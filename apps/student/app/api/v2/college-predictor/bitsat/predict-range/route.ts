// PUBLIC: no auth required. Companion to /predict — answers the question
// "what happens to my predictions if I scored differently?". Returns
// Safe/Target/Reach counts and a list of programmes that unlock at each
// step, computed by reusing the same predictBitsat() engine across a band.
//
// Why batch instead of N client calls:
//   The predictor's hot path is one Mongo find() and ~50 in-memory
//   projections. Running 7–9 score points sequentially server-side is one
//   round-trip from the client and one Mongo round-trip from the server.
//   Doing it client-side would be 9 round-trips both ways.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  predictBitsat,
  REGIME_MAX_SCORE,
  type BitsatPredictorResult,
  type BitsatBucket,
  type BitsatRegime,
} from '@/features/college-predictor/bitsat/predictor';
import { BITSAT_PROGRAMME_BY_CODE, type BitsatProgrammeCode } from '@canvas/data/bitsat/programmes';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

const PROGRAMME_CODES = [
  'BE-CHE', 'BE-CIV', 'BE-CSE', 'BE-EEE', 'BE-ECE', 'BE-EIE', 'BE-ECMP',
  'BE-MECH', 'BE-MANF', 'BE-MNC', 'BE-ENV',
  'MSC-BIO', 'MSC-CHEM', 'MSC-ECON', 'MSC-MATH', 'MSC-PHYS', 'MSC-SEMI', 'MSC-GEN',
  'BPHARM',
] as const;

// Deltas are applied to the base score. Default sweep is ±60 in steps of 10,
// which covers a typical "what if I'd prepped one more month" question
// without overwhelming the visualisation.
const DEFAULT_DELTAS = [-60, -40, -20, -10, 0, 10, 20, 40, 60];

const RangeRequestSchema = z.object({
  base_score: z.number().int().min(0).max(450),
  regime: z.enum(['modern', 'legacy']).optional(),
  // Custom deltas can be passed for fine-grained sweeps.
  deltas: z.array(z.number().int().min(-200).max(200)).max(15).optional(),
  campuses: z.array(z.enum(['pilani', 'goa', 'hyderabad'])).optional(),
  programmes: z.array(z.enum(PROGRAMME_CODES)).optional(),
});

const rangeLimiter = createRateLimiter({ max: 20, windowMs: 60_000 });

// BITSAT prestige weighting — combines campus tier (Pilani is NIRF #20 / T1,
// Goa #56 / T2, Hyderabad flagship-but-unranked / T2) and programme demand tier
// (CSE/MnC/ECE elite, EEE/EIE/MECH strong, others standard). Used so chart
// bar heights reflect "is this prestigious opportunity?" not raw count.
const CAMPUS_WEIGHT: Record<'Pilani' | 'Goa' | 'Hyderabad', number> = {
  Pilani: 3,
  Goa: 2,
  Hyderabad: 2,
};

function tierForBitsat(campus: 'Pilani' | 'Goa' | 'Hyderabad', code: string): 'T1' | 'T2' | 'T3' {
  const demand = BITSAT_PROGRAMME_BY_CODE[code as BitsatProgrammeCode]?.demand_tier ?? 3;
  if (campus === 'Pilani' && demand === 1) return 'T1';            // Pilani CSE/MnC/ECE
  if (campus === 'Pilani' && demand === 2) return 'T2';
  if (campus !== 'Pilani' && demand === 1) return 'T2';            // Goa/Hyd CSE etc.
  return 'T3';
}

const TIER_WEIGHTS = { T1: 5, T2: 2, T3: 1 } as const;

interface ScorePoint {
  score: number;
  delta: number;
  counts: Record<BitsatBucket, number>;
  /**
   * Prestige-weighted opportunity score — sum of TIER_WEIGHTS over
   * Safe + Target programmes.
   */
  weighted_score: number;
  tier_mix: { T1: number; T2: number; T3: number };
  // Programmes that are Safe at this score but were NOT Safe at the user's
  // CURRENT score (delta === 0). This is the diff vs YOU, not vs the adjacent
  // sweep point — the UI labels this list as "what unlocks vs your current"
  // so the API must use that baseline. Empty at YOU and at lower-than-YOU
  // scores (where the Safe pool can only shrink).
  newly_safe: {
    campus_name: string;
    programme_code: string;
    programme_name: string;
    nirf?: number;
  }[];
  // Programmes newly in play (target-or-better) at this score that were
  // strictly Reach at YOU's current score.
  newly_in_play: { campus_name: string; programme_code: string; programme_name: string }[];
}

interface RangeResponse {
  success: boolean;
  error?: string;
  base_score?: number;
  regime?: BitsatRegime;
  max_score?: number;
  points?: ScorePoint[];
}

function bucketsToCounts(results: BitsatPredictorResult[]): Record<BitsatBucket, number> {
  const out: Record<BitsatBucket, number> = { safe: 0, target: 0, reach: 0, unlikely: 0 };
  for (const r of results) out[r.bucket] += 1;
  return out;
}

function computeWeightedBitsat(results: BitsatPredictorResult[]): {
  weighted_score: number;
  tier_mix: { T1: number; T2: number; T3: number };
} {
  let score = 0;
  const mix = { T1: 0, T2: 0, T3: 0 };
  for (const r of results) {
    if (r.bucket !== 'safe' && r.bucket !== 'target') continue;
    const tier = tierForBitsat(r.campus_name, r.programme_code);
    score += TIER_WEIGHTS[tier] * (CAMPUS_WEIGHT[r.campus_name] / 3);
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
    const regime: BitsatRegime = input.regime ?? 'modern';
    const maxScore = REGIME_MAX_SCORE[regime];
    const baseScore = input.base_score;
    const deltas = (input.deltas ?? DEFAULT_DELTAS).slice().sort((a, b) => a - b);

    // Compute the actual scores to evaluate; clamp into [0, maxScore].
    const scores = deltas
      .map((d) => ({ delta: d, score: Math.max(0, Math.min(maxScore, baseScore + d)) }))
      // Deduplicate scores that clamp to the same value at the boundaries.
      .filter((p, i, arr) => i === 0 || arr[i - 1].score !== p.score);

    // Predict at each score in parallel. predictBitsat() is already memoized
    // at the Mongo connection layer, so 9 concurrent calls share one pool.
    const predictions = await Promise.all(
      scores.map((p) =>
        predictBitsat(
          {
            score: p.score,
            regime,
            campuses: input.campuses,
            programmes: input.programmes,
            include_unlikely: true,
          },
          {},
        ).then((rows) => ({ ...p, rows })),
      ),
    );

    // Build per-point bucket counts. `newly_safe` / `newly_in_play` are diffs
    // against the YOU point (delta === 0), so the UI's "vs your current" copy
    // matches the data. Computing against the previous sweep point causes the
    // header callout ("+N Safe vs current") to disagree with the unlock list
    // ("no new colleges") at most ranks — the bug that prompted this fix.
    const youPoint =
      predictions.find((p) => p.delta === 0) ??
      predictions.find((p) => p.score === baseScore) ??
      predictions[Math.floor(predictions.length / 2)];
    const youSafeKeys = new Set<string>();
    const youInPlayKeys = new Set<string>();
    for (const r of youPoint.rows) {
      const key = `${r.campus_id}::${r.programme_code}`;
      if (r.bucket === 'safe') {
        youSafeKeys.add(key);
        youInPlayKeys.add(key);
      } else if (r.bucket === 'target') {
        youInPlayKeys.add(key);
      }
    }

    const points: ScorePoint[] = predictions.map((pred) => {
      const newlySafe: ScorePoint['newly_safe'] = [];
      const newlyInPlay: ScorePoint['newly_in_play'] = [];
      for (const r of pred.rows) {
        const key = `${r.campus_id}::${r.programme_code}`;
        if (r.bucket === 'safe' && !youSafeKeys.has(key)) {
          newlySafe.push({
            campus_name: r.campus_name,
            programme_code: r.programme_code,
            programme_name: r.programme_name,
            nirf: r.nirf_rank_engineering,
          });
        }
        // newly_in_play = went from strictly-Reach (or worse) at YOU to
        // Target-or-better here. Excludes rows that were already Safe at YOU.
        if (
          (r.bucket === 'target' || r.bucket === 'safe') &&
          !youInPlayKeys.has(key) &&
          r.bucket === 'target'
        ) {
          newlyInPlay.push({
            campus_name: r.campus_name,
            programme_code: r.programme_code,
            programme_name: r.programme_name,
          });
        }
      }
      // Sort unlocks: Pilani first (prestige), then by demand tier so
      // CSE/MnC bubble to the top.
      newlySafe.sort((a, b) => {
        const ca = CAMPUS_WEIGHT[a.campus_name as 'Pilani' | 'Goa' | 'Hyderabad'] ?? 1;
        const cb = CAMPUS_WEIGHT[b.campus_name as 'Pilani' | 'Goa' | 'Hyderabad'] ?? 1;
        if (ca !== cb) return cb - ca;
        const da = BITSAT_PROGRAMME_BY_CODE[a.programme_code as BitsatProgrammeCode]?.demand_tier ?? 3;
        const db = BITSAT_PROGRAMME_BY_CODE[b.programme_code as BitsatProgrammeCode]?.demand_tier ?? 3;
        return da - db;
      });
      const { weighted_score, tier_mix } = computeWeightedBitsat(pred.rows);
      return {
        score: pred.score,
        delta: pred.delta,
        counts: bucketsToCounts(pred.rows),
        weighted_score,
        tier_mix,
        newly_safe: newlySafe,
        newly_in_play: newlyInPlay,
      };
    });

    return NextResponse.json<RangeResponse>({
      success: true,
      base_score: baseScore,
      regime,
      max_score: maxScore,
      points,
    });
  } catch (err) {
    console.error('BITSAT predict-range error:', err);
    return NextResponse.json<RangeResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
