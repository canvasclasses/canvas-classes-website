// PUBLIC: no auth required. Wraps the JoSAA predictor + the choice-list
// optimizer in one call so the client doesn't have to pull a giant
// 600-row prediction set just to sort it.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { predictColleges } from '@/features/college-predictor/lib/predictor';
import { resolveEffectiveRank } from '@/features/college-predictor/lib/percentileToRank';
import { buildChoiceList } from '@/features/college-predictor/lib/choiceList';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

const ChoiceListRequestSchema = z.object({
  rank: z.number().int().positive().max(2_000_000).optional(),
  percentile: z.number().min(0).max(100).optional(),
  // See /predict route — same CRL/CAT semantics. Default 'CAT' preserves
  // historical behaviour for any direct API callers.
  rank_type: z.enum(['CRL', 'CAT']).optional(),
  category: z.enum([
    'OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS',
    'OPEN (PwD)', 'OBC-NCL (PwD)', 'SC (PwD)', 'ST (PwD)', 'EWS (PwD)',
  ]),
  gender: z.enum(['Gender-Neutral', 'Female-only (including Supernumerary)']),
  home_state: z.string().min(2).max(50),
  year: z.number().int().min(2016).max(2030).optional(),

  // Preferences for the optimizer
  branch_flexibility: z.enum(['cse-only', 'tech-adjacent', 'flexible']).default('flexible'),
  risk_profile: z.enum(['conservative', 'balanced', 'aggressive']).default('balanced'),
  list_size: z.number().int().min(20).max(200).default(60),
  preferred_regions: z.array(z.enum(['North', 'South', 'East', 'West', 'Central', 'Northeast'])).optional(),
  dream_branch: z.string().max(80).optional(),
  dream_colleges: z.array(z.string().max(80)).max(5).optional(),

  // Filters that affect the underlying prediction pool.
  college_types: z.array(z.enum(['NIT', 'IIIT', 'GFTI'])).optional(),
}).refine((d) => d.rank !== undefined || d.percentile !== undefined, {
  message: 'rank or percentile required',
});

const limiter = createRateLimiter({ max: 15, windowMs: 60_000 });

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

    const parsed = ChoiceListRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.issues },
        { status: 400 },
      );
    }
    const input = parsed.data;

    const targetYear = input.year ?? new Date().getFullYear();
    const effRank = resolveEffectiveRank({
      rank: input.rank,
      percentile: input.percentile,
      rank_type: input.rank_type,
      category: input.category,
      year: targetYear,
    }).effectiveRank;

    // Run the full predictor (include_unlikely=false; the optimizer will drop
    // its own unlikely set internally anyway).
    const results = await predictColleges({
      rank: effRank,
      category: input.category,
      gender: input.gender,
      home_state: input.home_state,
      year: targetYear,
      include_unlikely: false,
    });

    // Apply college-type filter at this layer (predictor itself doesn't take
    // that filter; the existing /predict route filters post-hoc).
    const typeFiltered = input.college_types && input.college_types.length > 0
      ? results.filter((r) => input.college_types!.includes(r.college_type as 'NIT' | 'IIIT' | 'GFTI'))
      : results;

    const choiceList = buildChoiceList(typeFiltered, {
      branch_flexibility: input.branch_flexibility,
      risk_profile: input.risk_profile,
      list_size: input.list_size,
      preferred_regions: input.preferred_regions,
      dream_branch: input.dream_branch,
      dream_colleges: input.dream_colleges,
    });

    return NextResponse.json({
      success: true,
      input_summary: {
        effective_rank: effRank,
        category: input.category,
        gender: input.gender,
        home_state: input.home_state,
        year: targetYear,
      },
      ...choiceList,
    });
  } catch (err) {
    console.error('Choice-list error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
