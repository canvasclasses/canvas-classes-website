/**
 * /seo/briefings — list of recent morning briefings, newest first. Each
 * briefing shows Claude's plain-English synthesis (the headline value) plus
 * the underlying health snapshot. Click any row to expand the full insight list.
 */

import 'server-only';
import { redirect } from 'next/navigation';
import { Newspaper, Bot, Hand, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { SeoBriefing, type ISeoBriefing, type StoredInsight } from '@canvas/data/models/SeoBriefing';
import { GenerateBriefingButton } from '@/features/admin/seo/GenerateBriefingButton';
import { InsightCard } from '@/features/admin/seo/InsightCard';
import { EmptyState } from '@/features/admin/seo/components';

export const metadata = { title: 'SEO · Morning Briefings | Canvas Admin' };
export const dynamic = 'force-dynamic';

const LIMIT = 14;       // ~2 weeks of daily briefings

interface BriefingRow {
  id: string;
  forDate: Date;
  generatedAt: Date;
  trigger: ISeoBriefing['trigger'];
  health: ISeoBriefing['health'];
  insights: StoredInsight[];
  llmSynthesis: string | null;
  llmModel: string | null;
}

export default async function BriefingsPage() {
  if (!(await requireAdmin())) redirect('/login?next=/seo/briefings');

  await connectToDatabase();
  const docs = await SeoBriefing.find({})
    .sort({ forDate: -1 })
    .limit(LIMIT)
    .lean();

  const briefings: BriefingRow[] = docs.map(d => ({
    id: String(d._id),
    forDate: d.forDate,
    generatedAt: d.generatedAt,
    trigger: d.trigger,
    health: d.health,
    insights: d.insights as StoredInsight[],
    llmSynthesis: d.llmSynthesis,
    llmModel: d.llmModel,
  }));

  const latest = briefings[0];

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Newspaper size={24} className="text-orange-400" /> Morning Briefings
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-white/50">
            Claude analyses the SEO digest each morning at 03:00 UTC (08:30 IST) and writes a 3-action plan for the week.
            Past 14 days listed below; click the latest to expand.
          </p>
        </div>
        <GenerateBriefingButton />
      </header>

      {briefings.length === 0 ? (
        <EmptyState
          title="No briefings yet"
          hint="Click 'Generate today's briefing' above, or wait for the 03:00 UTC cron tomorrow."
        />
      ) : (
        <>
          {/* Latest briefing — expanded by default */}
          {latest && <LatestBriefing briefing={latest} />}

          {/* Older briefings — collapsed */}
          {briefings.length > 1 && (
            <section className="mt-8">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
                Previous briefings
              </h2>
              <div className="space-y-2">
                {briefings.slice(1).map(b => <CollapsedBriefing key={b.id} briefing={b} />)}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function LatestBriefing({ briefing }: { briefing: BriefingRow }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.04] to-transparent">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 bg-white/[0.02] px-5 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-orange-400" />
          <span className="font-semibold">For {briefing.forDate.toISOString().slice(0, 10)}</span>
          <TriggerPill trigger={briefing.trigger} />
          {briefing.llmModel && (
            <span className="text-[11px] text-white/40">· {briefing.llmModel}</span>
          )}
        </div>
        <HealthLine health={briefing.health} />
      </div>

      <div className="p-5">
        {briefing.llmSynthesis ? (
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-semibold prose-h2:text-base prose-h2:mt-0 prose-h3:text-sm prose-h3:text-orange-300 prose-p:text-white/80 prose-strong:text-white">
            <ReactMarkdown>{briefing.llmSynthesis}</ReactMarkdown>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200/90">
            <p className="font-medium">Awaiting Claude synthesis.</p>
            <p className="mt-1 text-xs text-amber-200/70">
              The deterministic insights are below. Your Claude Code Desktop routine will attach the prose summary
              on its next run (configured separately — see <code className="rounded bg-white/5 px-1 py-0.5">_agents/plans/SEO_DASHBOARD.md</code>).
            </p>
          </div>
        )}

        {briefing.insights.length > 0 && (
          <details className="mt-6 border-t border-white/10 pt-4">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/60">
              Show all {briefing.insights.length} structured insights
            </summary>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              {briefing.insights.map(i => (
                <InsightCard key={i.id} insight={{ ...i, score: 0 }} />
              ))}
            </div>
          </details>
        )}
      </div>
    </article>
  );
}

function CollapsedBriefing({ briefing }: { briefing: BriefingRow }) {
  // Pull the first <h3> from the LLM synthesis as a preview line.
  const headline = extractFirstAction(briefing.llmSynthesis);
  return (
    <details className="group rounded-xl border border-white/10 bg-white/[0.02] open:bg-white/[0.04]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-xs font-mono text-white/40 tabular-nums">
            {briefing.forDate.toISOString().slice(0, 10)}
          </span>
          <TriggerPill trigger={briefing.trigger} />
          <span className="truncate text-sm text-white/70">
            {headline ?? `${briefing.insights.length} insights`}
          </span>
        </div>
        <HealthLine health={briefing.health} />
      </summary>
      <div className="border-t border-white/10 px-4 pb-4 pt-3">
        {briefing.llmSynthesis ? (
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-semibold prose-h2:text-sm prose-h3:text-xs prose-h3:text-orange-300 prose-p:text-white/70">
            <ReactMarkdown>{briefing.llmSynthesis}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-xs text-white/50 italic">No LLM synthesis.</p>
        )}
      </div>
    </details>
  );
}

function HealthLine({ health }: { health: ISeoBriefing['health'] }) {
  const trend = health.trafficTrendPct;
  const TrendIcon = trend == null ? Minus : trend > 0.005 ? TrendingUp : trend < -0.005 ? TrendingDown : Minus;
  const trendColor = trend == null ? 'text-white/40' : trend > 0 ? 'text-emerald-300' : 'text-red-300';
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/60 tabular-nums">
      <span className={`inline-flex items-center gap-1 ${trendColor}`}>
        <TrendIcon size={11} />
        {trend == null ? '—' : `${trend >= 0 ? '+' : ''}${(trend * 100).toFixed(0)}%`}
      </span>
      <span>{health.totalClicks7d.toLocaleString()} clicks/7d</span>
      <span>{health.winCount} wins</span>
      <span>{health.issueCount} issues</span>
    </div>
  );
}

function TriggerPill({ trigger }: { trigger: ISeoBriefing['trigger'] }) {
  const isCron = trigger === 'cron';
  const Icon = isCron ? Bot : Hand;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/60">
      <Icon size={9} /> {isCron ? 'Cron' : 'Manual'}
    </span>
  );
}

function extractFirstAction(synthesis: string | null): string | null {
  if (!synthesis) return null;
  const match = synthesis.match(/^###\s+\d+\.\s+(.+)$/m);
  return match?.[1]?.trim() ?? null;
}
