// PUBLIC: no auth required — returns only AGGREGATE BITSAT score stats
// (counts, mean, percentiles, histogram). No individual/raw scores or PII ever
// leave the server. Rate-limited per IP to prevent abuse.

import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';
import { fetchScorecards } from '@/features/bitsat/scores/source';
import {
  computeScoreAnalytics,
  computeBranchBreakdown,
  computeSessionStats,
} from '@/features/bitsat/scores/analytics';

// The modern (2022+) BITSAT paper is out of 390. Score data is the current
// cycle, so we aggregate against the modern max.
const MODERN_MAX_SCORE = 390;

const statsLimiter = createRateLimiter({ max: 30, windowMs: 60_000 });

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = statsLimiter.check(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute.' },
        { status: 429 },
      );
    }

    // Scorecards come from the third-party API (server-side); the adapter caches
    // the upstream response for an hour and returns [] on any failure.
    const records = await fetchScorecards();
    const analytics = computeScoreAnalytics(
      records.map((r) => r.final_score),
      MODERN_MAX_SCORE,
    );
    const branches = computeBranchBreakdown(records);
    const sessions = computeSessionStats(records);

    return NextResponse.json({ success: true, analytics, branches, sessions });
  } catch (err) {
    console.error('BITSAT score-stats error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
