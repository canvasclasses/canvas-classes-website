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

interface ScorePoint {
  score: number;
  delta: number;
  counts: Record<BitsatBucket, number>;
  // Programmes that became Safe at this score but were NOT Safe at the previous
  // (lower) score in the sweep — i.e. the "what does this score unlock?" set.
  newly_safe: { campus_name: string; programme_code: string; programme_name: string }[];
  // Programmes that became Target-or-better at this score but were Reach below.
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

    // Build per-point bucket counts and diff against the previous point to
    // compute "newly unlocked" lists.
    const points: ScorePoint[] = [];
    let prevSafeKeys = new Set<string>();
    let prevInPlayKeys = new Set<string>();
    for (const pred of predictions) {
      const safeKeys = new Set<string>();
      const inPlayKeys = new Set<string>();    // safe OR target — "in play"
      const newlySafe: ScorePoint['newly_safe'] = [];
      const newlyInPlay: ScorePoint['newly_in_play'] = [];
      for (const r of pred.rows) {
        const key = `${r.campus_id}::${r.programme_code}`;
        if (r.bucket === 'safe') {
          safeKeys.add(key);
          if (!prevSafeKeys.has(key)) {
            newlySafe.push({
              campus_name: r.campus_name,
              programme_code: r.programme_code,
              programme_name: r.programme_name,
            });
          }
        }
        if (r.bucket === 'safe' || r.bucket === 'target') {
          inPlayKeys.add(key);
          if (!prevInPlayKeys.has(key) && r.bucket === 'target') {
            // Target additions only — safe additions are tracked separately
            // and a row that goes reach → safe also reads as "in play".
            newlyInPlay.push({
              campus_name: r.campus_name,
              programme_code: r.programme_code,
              programme_name: r.programme_name,
            });
          }
        }
      }
      points.push({
        score: pred.score,
        delta: pred.delta,
        counts: bucketsToCounts(pred.rows),
        newly_safe: newlySafe,
        newly_in_play: newlyInPlay,
      });
      prevSafeKeys = safeKeys;
      prevInPlayKeys = inPlayKeys;
    }

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
