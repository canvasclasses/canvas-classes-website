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
import { percentileToRank } from '@/features/college-predictor/lib/percentileToRank';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

// Percent deltas applied to the base rank. Negative = better rank.
// Range covers ±40 % which is a realistic "what if I got a few more / fewer
// marks" band without exaggerating beyond plausible exam-day variance.
const DEFAULT_PCT_DELTAS = [-40, -25, -15, -8, 0, 8, 15, 25, 40];

const RangeRequestSchema = z.object({
  rank: z.number().int().positive().max(2_000_000).optional(),
  percentile: z.number().min(0).max(100).optional(),
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

interface RankPoint {
  rank: number;
  pct_delta: number;            // % change from base
  abs_delta: number;            // absolute rank difference (negative = better)
  counts: Record<Bucket, number>;
  // Colleges that became Safe at this rank but weren't Safe at the prior
  // (worse-ranked) point in the sweep. Counts unique college names — multiple
  // branches at one college collapse to one entry to keep the unlock list
  // legible.
  newly_safe: { college_short_name: string; college_type: string; branch_name: string }[];
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
    const baseRank =
      input.rank ??
      percentileToRank(input.percentile as number, targetYear, input.category);

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

    // Build per-point bucket counts + diff against previous point.
    // For JoSAA, we sort ascending (better rank first) so the "unlocked
    // colleges" reads left-to-right as "as you improve, you unlock these".
    const sortedAscByRank = predictions.slice().sort((a, b) => a.rank - b.rank);
    let prevSafeKeys = new Set<string>();
    const enriched: RankPoint[] = sortedAscByRank.map((p) => {
      const filtered = applyFilters(p.rows);
      const safeKeys = new Set<string>();
      const newlySafe: RankPoint['newly_safe'] = [];
      const seenColleges = new Set<string>();
      for (const r of filtered) {
        const key = `${r.college_id}::${r.branch_short_name}`;
        if (r.bucket === 'safe') {
          safeKeys.add(key);
          if (!prevSafeKeys.has(key) && !seenColleges.has(r.college_id)) {
            // First Safe branch at this college in this delta — represent
            // the college once with its highest-bucket branch.
            seenColleges.add(r.college_id);
            newlySafe.push({
              college_short_name: r.college_short_name,
              college_type: r.college_type,
              branch_name: r.branch_short_name,
            });
          }
        }
      }
      const point: RankPoint = {
        rank: p.rank,
        pct_delta: p.pct_delta,
        abs_delta: p.abs_delta,
        counts: bucketsToCounts(filtered),
        newly_safe: newlySafe,
      };
      prevSafeKeys = safeKeys;
      return point;
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
