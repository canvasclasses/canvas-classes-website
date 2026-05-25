/**
 * GET /api/v2/seo/digest
 *
 * Returns the same structured SEO digest the dashboard renders, in JSON form.
 * Suitable for feeding to an LLM, posting to Slack, exporting to a BI tool,
 * or any other downstream consumer that wants the rules-engine output without
 * needing to re-implement the rules.
 *
 * Auth: requireAdmin (CLAUDE.md §8.2.1). Public consumers should not have
 * access — the digest can reveal traffic patterns + ranking-position data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, hasBriefingSecret } from '@/lib/auth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { analyzeSeo } from '@canvas/seo/insights';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Scoped briefing-secret bypass — granted ONLY at this route and the
  // synthesis route. See lib/auth.ts:hasBriefingSecret + PR 4 plan.
  if (!hasBriefingSecret(request)) {
    const gate = await requireAdmin(request);
    if (!gate.ok) return gate.response;
  }

  await connectToDatabase();
  try {
    const digest = await analyzeSeo();
    return NextResponse.json({ success: true, ...digest });
  } catch (err) {
    console.error('[seo/digest] failed', err);
    return NextResponse.json(
      { success: false, error: 'Digest generation failed' },
      { status: 500 },
    );
  }
}
