// PUBLIC: no auth required. Companion to /predict for the JoSAA predictor.
// Answers: "what does my rank actually buy me, and how does that change if I
// were a few hundred ranks better or worse?"
//
// Deltas are expressed as PERCENTAGES of the user's rank, not absolute counts.
// Reason: a 500-rank gap matters a lot at CRL 100 (life-changing) but almost
// nothing at CRL 50,000 (won't shift any cutoff). Percent deltas keep the
// visualisation legible across the full ~1M-rank spectrum.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  predictColleges,
  type Bucket,
  type PredictorResult,
} from '@/features/college-predictor/lib/predictor';
import { resolveEffectiveRank } from '@/features/college-predictor/lib/percentileToRank';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

// Percent deltas applied to the base rank. Negative = better rank.
// Range covers ±40 % which is a realistic "what if I got a few more / fewer
// marks" band without exaggerating beyond plausible exam-day variance.
const DEFAULT_PCT_DELTAS = [-40, -25, -15, -8, 0, 8, 15, 25, 40];

const RangeRequestSchema = z.object({
  rank: z.number().int().positive().max(2_000_000).optional(),
  percentile: z.number().min(0).max(100).optional(),
  // See /predict route — same CRL/CAT semantics. The sparkline is rank-
  // sensitive so the conversion has to happen BEFORE pct_deltas are applied.
  rank_type: z.enum(['CRL', 'CAT']).optional(),
  category: z.enum([
    'OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS',
    'OPEN (PwD)', 'OBC-NCL (PwD)', 'SC (PwD)', 'ST (PwD)', 'EWS (PwD)',
  ]),
  gender: z.enum(['Gender-Neutral', 'Female-only (including Supernumerary)']),
  home_state: z.string().min(2).max(50),
  year: z.number().int().min(2016).max(2030).optional(),
  pct_deltas: z.array(z.number().int().min(-80).max(80)).max(15).optional(),
  regions: z.array(z.enum(['North', 'South', 'East', 'West', 'Central', 'Northeast'])).optional(),
  college_types: z.array(z.enum(['NIT', 'IIIT', 'GFTI'])).optional(),
}).refine((d) => d.rank !== undefined || d.percentile !== undefined, {
  message: 'Provide either rank or percentile',
});

const rangeLimiter = createRateLimiter({ max: 20, windowMs: 60_000 });

// Tier weights — used to compute a "prestige-weighted" opportunity score per
// rank point. The point isn't a precise ranking algorithm, it's to make the
// sensitivity chart honest: a bar where 30 marginal NIT-Manipur Civil seats
// open should NOT look taller than a bar where 5 NIT-Trichy CSE seats open.
//
// Tier buckets:
//   T1 (NIRF ≤ 25): top NITs, IIIT Hyderabad/Delhi/Bangalore — life-changing
//   T2 (NIRF 26–100): solid NITs/IIITs — strong outcomes
//   T3 (NIRF > 100 or unranked): smaller GFTIs/new NITs — keep-an-option seats
const TIER_WEIGHTS = { T1: 5, T2: 2, T3: 1 } as const;

function tierFor(nirf?: number): 'T1' | 'T2' | 'T3' {
  if (nirf !== undefined && nirf <= 25) return 'T1';
  if (nirf !== undefined && nirf <= 100) return 'T2';
  return 'T3';
}

interface RankPoint {
  rank: number;
  pct_delta: number;            // % change from base
  abs_delta: number;            // absolute rank difference (negative = better)
  counts: Record<Bucket, number>;
  /**
   * Prestige-weighted opportunity score: sum of TIER_WEIGHTS over Safe + Target
   * branches. Lets the chart display tier-weighted bar heights so a few top
   * NITs visibly outweigh many marginal seats.
   */
  weighted_score: number;
  /** Tier mix of Safe branches at this rank — for the small T1/T2/T3 indicator below each bar. */
  tier_mix: { T1: number; T2: number; T3: number };
  // Branches (college::branch tuples) that are Safe at this rank but were
  // NOT Safe at the user's current rank (the YOU baseline, pct_delta === 0).
  // Per-branch — NOT deduped by college — so that count matches the Safe-
  // delta the UI displays in the header callout. The UI will surface the
  // top 6 sorted by NIRF prestige. Empty at YOU and at worse-than-YOU points
  // (Safe pool can only shrink, not grow, when rank gets worse).
  newly_safe: {
    college_short_name: string;
    college_type: string;
    branch_name: string;
    nirf?: number;
  }[];
}

interface RangeResponse {
  success: boolean;
  error?: string;
  base_rank?: number;
  points?: RankPoint[];
}

function bucketsToCounts(results: PredictorResult[]): Record<Bucket, number> {
  const out: Record<Bucket, number> = { safe: 0, target: 0, reach: 0, unlikely: 0 };
  for (const r of results) out[r.bucket] += 1;
  return out;
}

function computeWeighted(results: PredictorResult[]): {
  weighted_score: number;
  tier_mix: { T1: number; T2: number; T3: number };
} {
  let score = 0;
  const mix = { T1: 0, T2: 0, T3: 0 };
  for (const r of results) {
    if (r.bucket !== 'safe' && r.bucket !== 'target') continue;
    const tier = tierFor(r.nirf_rank_engineering);
    score += TIER_WEIGHTS[tier];
    if (r.bucket === 'safe') mix[tier] += 1;
  }
  return { weighted_score: score, tier_mix: mix };
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = rangeLimiter.check(ip);
    if (!rl.ok) {
      return NextResponse.json<RangeResponse>(
        { success: false, error: 'Too many requests. Please wait a minute.' },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json<RangeResponse>(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const parsed = RangeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<RangeResponse>(
        { success: false, error: 'Invalid input' },
        { status: 400 },
      );
    }
    const input = parsed.data;
    const targetYear = input.year ?? new Date().getFullYear();
    // Resolve base rank with CRL→category-rank conversion if applicable, so
    // the pct_delta ±40% band is computed on the same scale the matcher uses.
    const baseRank = resolveEffectiveRank({
      rank: input.rank,
      percentile: input.percentile,
      rank_type: input.rank_type,
      category: input.category,
      year: targetYear,
    }).effectiveRank;

    const pctDeltas = (input.pct_deltas ?? DEFAULT_PCT_DELTAS).slice().sort((a, b) => a - b);

    // Convert percent deltas to actual ranks; clamp into [1, 2_000_000].
    const points = pctDeltas
      .map((pct) => {
        const newRank = Math.max(1, Math.min(2_000_000, Math.round(baseRank * (1 + pct / 100))));
        return { pct_delta: pct, rank: newRank, abs_delta: newRank - baseRank };
      })
      // Deduplicate when adjacent percent steps clamp to the same rank.
      .filter((p, i, arr) => i === 0 || arr[i - 1].rank !== p.rank);

    // Predict at each rank in parallel.
    const predictions = await Promise.all(
      points.map((p) =>
        predictColleges(
          {
            rank: p.rank,
            category: input.category,
            gender: input.gender,
            home_state: input.home_state,
            year: targetYear,
            include_unlikely: true,
          },
          {},
        ).then((rows) => ({ ...p, rows })),
      ),
    );

    // Apply region + college-type filter if provided.
    const regionSet = input.regions && input.regions.length > 0 ? new Set(input.regions) : null;
    const typeSet = input.college_types && input.college_types.length > 0
      ? new Set(input.college_types)
      : null;

    function applyFilters(rows: PredictorResult[]): PredictorResult[] {
      if (!regionSet && !typeSet) return rows;
      return rows.filter((r) => {
        if (regionSet && !regionSet.has(r.college_region as 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast')) return false;
        if (typeSet && !typeSet.has(r.college_type as 'NIT' | 'IIIT' | 'GFTI')) return false;
        return true;
      });
    }

    // Build per-point bucket counts. `newly_safe` is computed as the diff
    // against the user's CURRENT rank (the bar where pct_delta === 0), NOT
    // against the previous sweep point. Reason: the UI labels this list as
    // "what unlocks vs your current", so the API must use that baseline or
    // the two surfaces (header callout + unlock list) contradict each other
    // — exactly the bug a user reported (e.g. "+33 Safe vs your current" but
    // the unlock list showed zero new colleges).
    const sortedAscByRank = predictions.slice().sort((a, b) => a.rank - b.rank);

    // Locate the YOU point (pct_delta === 0). Falls back to whichever point
    // matches baseRank exactly if the explicit 0% step was deduplicated, then
    // to the middle index. This is robust to the sweep dedup logic upstream.
    const youPoint =
      sortedAscByRank.find((p) => p.pct_delta === 0) ??
      sortedAscByRank.find((p) => p.rank === baseRank) ??
      sortedAscByRank[Math.floor(sortedAscByRank.length / 2)];
    const youFilteredRows = applyFilters(youPoint.rows);
    // YOU's Safe set keyed per branch (college_id::branch). Per-branch — NOT
    // per-college — so that newly_safe.length matches the Safe-count delta
    // the UI shows in the header callout. If we dedup by college_id, then a
    // college already-Safe at YOU's rank silently absorbs additional Safe
    // branches at better ranks, and the unlock list shows zero while the
    // counter shows "+30 Safe vs your current". Exactly the contradiction
    // a user reported.
    const youSafeKeys = new Set<string>();
    for (const r of youFilteredRows) {
      if (r.bucket === 'safe') {
        youSafeKeys.add(`${r.college_id}::${r.branch_short_name}`);
      }
    }

    const enriched: RankPoint[] = sortedAscByRank.map((p) => {
      const filtered = applyFilters(p.rows);
      // newly_safe = branches Safe here but not Safe at YOU. No college-level
      // dedup; the UI shows top 6 by NIRF prestige.
      const newlySafe: RankPoint['newly_safe'] = [];
      for (const r of filtered) {
        const key = `${r.college_id}::${r.branch_short_name}`;
        if (r.bucket === 'safe' && !youSafeKeys.has(key)) {
          newlySafe.push({
            college_short_name: r.college_short_name,
            college_type: r.college_type,
            branch_name: r.branch_short_name,
            nirf: r.nirf_rank_engineering,
          });
        }
      }
      // Sort unlocks by NIRF asc (most prestigious first) so the UI surfaces
      // the headline unlocks at the top of the list.
      newlySafe.sort((a, b) => (a.nirf ?? 9999) - (b.nirf ?? 9999));
      const { weighted_score, tier_mix } = computeWeighted(filtered);
      return {
        rank: p.rank,
        pct_delta: p.pct_delta,
        abs_delta: p.abs_delta,
        counts: bucketsToCounts(filtered),
        weighted_score,
        tier_mix,
        newly_safe: newlySafe,
      };
    });

    // Return in original delta order (negative→positive) for the chart.
    enriched.sort((a, b) => a.pct_delta - b.pct_delta);

    return NextResponse.json<RangeResponse>({
      success: true,
      base_rank: baseRank,
      points: enriched,
    });
  } catch (err) {
    console.error('JoSAA predict-range error:', err);
    return NextResponse.json<RangeResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
