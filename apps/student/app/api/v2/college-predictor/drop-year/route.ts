// PUBLIC: no auth required. Drop-year scenario analyzer.
//
// For each scenario in the empirical improvement distribution, runs the
// predictor at the scenario's target rank / score and returns a compact
// summary: top 3 colleges, Safe / Target / Reach counts, and the headline
// outcome. The UI consumes this to show "here's what each percentile of
// dropper outcome would look like" — without committing to any single
// prediction.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { predictColleges, type PredictorResult } from '@/features/college-predictor/lib/predictor';
import { predictBitsat, REGIME_MAX_SCORE, type BitsatPredictorResult } from '@/features/college-predictor/bitsat/predictor';
import { percentileToRank } from '@/features/college-predictor/lib/percentileToRank';
import {
  scenariosFor,
  applyScenario,
  type Scenario,
} from '@/features/college-predictor/lib/dropYear';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

const JoSAASchema = z.object({
  exam: z.literal('jee_main'),
  rank: z.number().int().positive().max(2_000_000).optional(),
  percentile: z.number().min(0).max(100).optional(),
  category: z.enum([
    'OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS',
    'OPEN (PwD)', 'OBC-NCL (PwD)', 'SC (PwD)', 'ST (PwD)', 'EWS (PwD)',
  ]),
  gender: z.enum(['Gender-Neutral', 'Female-only (including Supernumerary)']),
  home_state: z.string().min(2).max(50),
  year: z.number().int().min(2016).max(2030).optional(),
}).refine((d) => d.rank !== undefined || d.percentile !== undefined, {
  message: 'rank or percentile required',
});

const BitsatSchema = z.object({
  exam: z.literal('bitsat'),
  score: z.number().int().min(0).max(450),
  regime: z.enum(['modern', 'legacy']).optional(),
});

const RequestSchema = z.discriminatedUnion('exam', [JoSAASchema, BitsatSchema]);

const limiter = createRateLimiter({ max: 10, windowMs: 60_000 });

// ── Compact per-scenario summary used by the UI ─────────────────────────────
interface ScenarioOutcome {
  scenario: Scenario;
  /** Target rank or score after applying this scenario to the current state. */
  target_rank?: number;
  target_score?: number;
  /** Headline metric — how many programmes are Safe at this scenario. */
  counts: { safe: number; target: number; reach: number };
  /** Top 3 highest-NIRF or highest-demand programmes that would be SAFE. */
  top_unlocks: Array<{
    title: string;          // College or "BITS Campus"
    subtitle: string;       // Branch / Programme name
    nirf?: number;
    probability_pct: number;
  }>;
}

function pickTopUnlocksJosaa(rows: PredictorResult[]): ScenarioOutcome['top_unlocks'] {
  // We surface Safe colleges sorted by NIRF asc (best first), one per
  // college (parents care about the institute, not 6 branches at the same
  // place). Falls back to Target if there's nothing Safe yet.
  const safes = rows.filter((r) => r.bucket === 'safe');
  const pool = safes.length > 0 ? safes : rows.filter((r) => r.bucket === 'target');
  const seen = new Set<string>();
  const out: ScenarioOutcome['top_unlocks'] = [];
  for (const r of pool) {
    if (seen.has(r.college_id)) continue;
    seen.add(r.college_id);
    out.push({
      title: r.college_short_name,
      subtitle: r.branch_name,
      nirf: r.nirf_rank_engineering,
      probability_pct: r.probability_pct,
    });
    if (out.length === 3) break;
  }
  return out;
}

function pickTopUnlocksBitsat(rows: BitsatPredictorResult[]): ScenarioOutcome['top_unlocks'] {
  const safes = rows.filter((r) => r.bucket === 'safe');
  const pool = safes.length > 0 ? safes : rows.filter((r) => r.bucket === 'target');
  // Pre-sorted by demand tier in the predictor; take top 3.
  return pool.slice(0, 3).map((r) => ({
    title: `BITS ${r.campus_name}`,
    subtitle: r.programme_name,
    nirf: r.nirf_rank_engineering,
    probability_pct: r.probability_pct,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = limiter.check(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute.' },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 },
      );
    }
    const input = parsed.data;

    if (input.exam === 'jee_main') {
      const targetYear = input.year ?? new Date().getFullYear();
      const baseRank =
        input.rank ??
        percentileToRank(input.percentile as number, targetYear, input.category);

      const scenarios = scenariosFor('jee_main');

      // Predict in parallel at each scenario's projected rank.
      const outcomes: ScenarioOutcome[] = await Promise.all(
        scenarios.map(async (s) => {
          const { rank: targetRank } = applyScenario(s, { currentRank: baseRank });
          const rows = await predictColleges({
            rank: targetRank!,
            category: input.category,
            gender: input.gender,
            home_state: input.home_state,
            year: targetYear,
            include_unlikely: false,
          });
          const counts = {
            safe: rows.filter((r) => r.bucket === 'safe').length,
            target: rows.filter((r) => r.bucket === 'target').length,
            reach: rows.filter((r) => r.bucket === 'reach').length,
          };
          return {
            scenario: s,
            target_rank: targetRank,
            counts,
            top_unlocks: pickTopUnlocksJosaa(rows),
          };
        }),
      );

      return NextResponse.json({
        success: true,
        exam: 'jee_main',
        current_rank: baseRank,
        outcomes,
      });
    } else {
      const regime = input.regime ?? 'modern';
      const maxScore = REGIME_MAX_SCORE[regime];
      const baseScore = input.score;

      const scenarios = scenariosFor('bitsat');

      const outcomes: ScenarioOutcome[] = await Promise.all(
        scenarios.map(async (s) => {
          const { score: targetScore } = applyScenario(s, {
            currentScore: baseScore,
            maxScore,
          });
          const rows = await predictBitsat({
            score: targetScore!,
            regime,
            include_unlikely: false,
          });
          const counts = {
            safe: rows.filter((r) => r.bucket === 'safe').length,
            target: rows.filter((r) => r.bucket === 'target').length,
            reach: rows.filter((r) => r.bucket === 'reach').length,
          };
          return {
            scenario: s,
            target_score: targetScore,
            counts,
            top_unlocks: pickTopUnlocksBitsat(rows),
          };
        }),
      );

      return NextResponse.json({
        success: true,
        exam: 'bitsat',
        current_score: baseScore,
        max_score: maxScore,
        outcomes,
      });
    }
  } catch (err) {
    console.error('Drop-year analyzer error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
