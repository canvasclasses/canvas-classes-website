import 'server-only';
import { SeoBriefing } from '@canvas/data/models/SeoBriefing';
import { analyzeSeo, type Insight } from './insights';

// ============================================
// The morning briefing pipeline.
//
//   analyzeSeo() → deterministic structured digest
//        │
//   persisted to seo_briefings (one row per forDate, idempotent on date)
//        │
//   Claude Code Desktop reads /api/v2/seo/digest on its own daily schedule,
//   writes the LLM synthesis back via attachSynthesis() (POST /api/v2/seo/
//   briefing/synthesis). This keeps LLM cost on the user's Max-plan
//   subscription instead of paid API tokens, and lets the user iterate on the
//   synthesis prompt without backend redeploys.
// ============================================

export interface BriefingResult {
  briefingId: string;
  forDate: Date;
  insightsCount: number;
  hasSynthesis: boolean;
}

/**
 * Run the deterministic analysis and upsert today's briefing row.
 * Idempotent: rerunning for the same date refreshes the insights array but
 * keeps any LLM synthesis that was previously attached unless `clearSynthesis`
 * is passed (used when the user wants to force the Desktop task to re-write
 * the synthesis for today).
 */
export async function runBriefing(args: {
  trigger: 'cron' | 'manual';
  force?: boolean;
  clearSynthesis?: boolean;
}): Promise<BriefingResult> {
  const digest = await analyzeSeo();
  const forDate = digest.dataAsOf ?? digest.generatedAt;
  forDate.setUTCHours(0, 0, 0, 0);

  if (!args.force) {
    const existing = await SeoBriefing.findOne({ forDate }).select({ _id: 1, llmSynthesis: 1 }).lean();
    if (existing) {
      return {
        briefingId: String(existing._id),
        forDate,
        insightsCount: digest.quickWins.length + digest.issues.length + digest.trending.length,
        hasSynthesis: Boolean(existing.llmSynthesis),
      };
    }
  }

  const insights = [...digest.quickWins, ...digest.issues, ...digest.trending];

  // Build the $set without llmSynthesis so an existing synthesis survives
  // a re-run unless `clearSynthesis` is passed.
  const setFields: Record<string, unknown> = {
    forDate,
    generatedAt: digest.generatedAt,
    trigger: args.trigger,
    health: {
      trafficTrendPct: digest.health.trafficTrendPct,
      cwvPassRate: digest.health.cwvPassRate,
      issueCount: digest.issues.length,
      winCount: digest.quickWins.length,
      totalClicks7d: digest.health.totalClicks7d,
      totalImpressions7d: digest.health.totalImpressions7d,
    },
    insights: insights.map(insightToStored),
    error: null,
  };
  if (args.clearSynthesis) {
    setFields.llmSynthesis = null;
    setFields.llmModel = null;
    setFields.llmTokensUsed = null;
  }

  const briefing = await SeoBriefing.findOneAndUpdate(
    { forDate },
    { $set: setFields },
    { upsert: true, returnDocument: 'after' },
  );

  return {
    briefingId: String(briefing._id),
    forDate,
    insightsCount: insights.length,
    hasSynthesis: Boolean(briefing.llmSynthesis),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Synthesis attach — called by Claude Code Desktop's daily routine after
// it reads /api/v2/seo/digest and produces a prose summary.
// ────────────────────────────────────────────────────────────────────────────

export interface AttachSynthesisArgs {
  forDate?: string;      // 'YYYY-MM-DD'; defaults to today's briefing
  synthesis: string;
  model: string;         // e.g. "claude-sonnet-4-7" — for display in the UI
  tokensUsed?: number | null;
}

export async function attachSynthesis(args: AttachSynthesisArgs): Promise<{
  briefingId: string;
  forDate: Date;
}> {
  if (!args.synthesis?.trim()) {
    throw new Error('attachSynthesis: synthesis is required');
  }

  // Resolve target date — if not provided, target the most recent briefing.
  let target: Date;
  if (args.forDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.forDate)) {
      throw new Error(`attachSynthesis: invalid forDate "${args.forDate}"`);
    }
    target = new Date(`${args.forDate}T00:00:00Z`);
  } else {
    const latest = await SeoBriefing.findOne({}).sort({ forDate: -1 }).select({ forDate: 1 }).lean();
    if (!latest) {
      throw new Error('attachSynthesis: no briefing exists yet — run /api/v2/seo/briefing first');
    }
    target = latest.forDate;
  }

  const updated = await SeoBriefing.findOneAndUpdate(
    { forDate: target },
    {
      $set: {
        llmSynthesis: args.synthesis.trim(),
        llmModel: args.model,
        llmTokensUsed: args.tokensUsed ?? null,
        error: null,
      },
    },
    { returnDocument: 'after' },
  );
  if (!updated) {
    throw new Error(`attachSynthesis: no briefing found for ${args.forDate ?? 'latest'} — call /api/v2/seo/briefing first`);
  }

  // Slack delivery is opt-in via env var. If you wire Claude Code Desktop to
  // POST synthesis here, you'll also get Slack delivery for free if the
  // webhook is configured.
  if (process.env.SEO_SLACK_WEBHOOK) {
    try {
      await postToSlack({
        synthesis: args.synthesis,
        forDate: target,
        health: updated.health,
      });
    } catch (err) {
      console.error('[seo/briefing] Slack delivery failed:', err);
    }
  }

  return { briefingId: String(updated._id), forDate: target };
}

// ────────────────────────────────────────────────────────────────────────────

function insightToStored(i: Insight) {
  return {
    id: i.id,
    severity: i.severity,
    title: i.title,
    evidence: i.evidence,
    recommendation: i.recommendation,
    estimatedImpact: i.estimatedImpact,
    drillDownUrl: i.drillDownUrl,
    metadata: i.metadata,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Slack delivery — fires after a synthesis is attached, if SEO_SLACK_WEBHOOK
// is configured. Uses Slack's incoming-webhook block-kit format.
// ────────────────────────────────────────────────────────────────────────────

async function postToSlack(args: {
  synthesis: string;
  forDate: Date;
  health: { trafficTrendPct: number | null; cwvPassRate: number | null; winCount: number; issueCount: number };
}): Promise<void> {
  const url = process.env.SEO_SLACK_WEBHOOK!;
  const trendArrow = (args.health.trafficTrendPct ?? 0) >= 0 ? '↗' : '↘';
  const trendPct = args.health.trafficTrendPct != null
    ? `${args.health.trafficTrendPct >= 0 ? '+' : ''}${(args.health.trafficTrendPct * 100).toFixed(0)}%`
    : 'n/a';
  const cwv = args.health.cwvPassRate != null
    ? `${Math.round(args.health.cwvPassRate * 100)}% of pages pass CWV`
    : 'no CWV data';

  const headline = `*SEO morning briefing — ${args.forDate.toISOString().slice(0, 10)}*`;
  const health = `${trendArrow} Traffic ${trendPct} vs prior week · ${cwv} · ${args.health.winCount} wins · ${args.health.issueCount} issues`;

  await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      blocks: [
        { type: 'section', text: { type: 'mrkdwn', text: headline } },
        { type: 'context', elements: [{ type: 'mrkdwn', text: health }] },
        { type: 'divider' },
        { type: 'section', text: { type: 'mrkdwn', text: args.synthesis.slice(0, 2900) } },
        {
          type: 'actions',
          elements: [{
            type: 'button',
            text: { type: 'plain_text', text: 'Open dashboard' },
            url: 'https://admin.canvasclasses.in/seo',
          }],
        },
      ],
    }),
  });
}
