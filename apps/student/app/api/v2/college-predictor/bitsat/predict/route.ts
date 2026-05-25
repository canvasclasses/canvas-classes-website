// PUBLIC: no auth required — the BITSAT predictor is a free, public tool.
// Rate-limited per IP to prevent abuse. Mirror of the JoSAA predict route.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  predictBitsat,
  REGIME_MAX_SCORE,
  type BitsatRegime,
} from '@/features/college-predictor/bitsat/predictor';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

// Keep this enum aligned with packages/data/bitsat/programmes.ts.
const PROGRAMME_CODES = [
  'BE-CHE', 'BE-CIV', 'BE-CSE', 'BE-EEE', 'BE-ECE', 'BE-EIE', 'BE-ECMP',
  'BE-MECH', 'BE-MANF', 'BE-MNC', 'BE-ENV',
  'MSC-BIO', 'MSC-CHEM', 'MSC-ECON', 'MSC-MATH', 'MSC-PHYS', 'MSC-SEMI', 'MSC-GEN',
  'BPHARM',
] as const;

const PredictRequestSchema = z.object({
  // Max is 450 to accommodate legacy regime; modern is bounded to 390 below.
  score: z.number().int().min(0).max(450),
  regime: z.enum(['modern', 'legacy']).optional(),
  campuses: z.array(z.enum(['pilani', 'goa', 'hyderabad'])).optional(),
  programmes: z.array(z.enum(PROGRAMME_CODES)).optional(),
  include_unlikely: z.boolean().optional(),
  extended: z.boolean().optional(),     // false (default) → top 10; true → full list
}).refine(
  (d) => {
    const max = REGIME_MAX_SCORE[d.regime ?? 'modern'];
    return d.score <= max;
  },
  { message: 'Score exceeds max for selected regime (modern=390, legacy=450)' },
);

const predictorLimiter = createRateLimiter({ max: 30, windowMs: 60_000 });

const DEFAULT_TOP = 10;
const MAX_PROGRAMMES = 100;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = predictorLimiter.check(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute.' },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const parsed = PredictRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.issues },
        { status: 400 },
      );
    }
    const input = parsed.data;
    const regime: BitsatRegime = input.regime ?? 'modern';
    const maxScore = REGIME_MAX_SCORE[regime];

    const results = await predictBitsat({
      score: input.score,
      regime,
      campuses: input.campuses,
      programmes: input.programmes,
      include_unlikely: input.include_unlikely ?? false,
    });

    const counts = results.reduce(
      (acc, r) => {
        acc[r.bucket] = (acc[r.bucket] ?? 0) + 1;
        return acc;
      },
      { safe: 0, target: 0, reach: 0, unlikely: 0 } as Record<string, number>,
    );

    const extended = input.extended === true;
    const limit = extended ? MAX_PROGRAMMES : DEFAULT_TOP;
    const programmes = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      input_summary: {
        score: input.score,
        regime,
        max_score: maxScore,
      },
      counts,
      total_programmes: results.length,
      returned_programmes: programmes.length,
      extended,
      programmes,
    });
  } catch (err) {
    console.error('BITSAT predictor error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
