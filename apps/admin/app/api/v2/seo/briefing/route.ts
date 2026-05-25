/**
 * POST /api/v2/seo/briefing
 *
 * Manual trigger from the dashboard's "Generate today's briefing" button.
 * Same logic as the cron, but accepts a `force` body flag and uses the
 * admin gate instead of the Bearer-token gate.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { runBriefing } from '@canvas/seo/briefing';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const body = await request.json().catch(() => ({}));
  const force = body?.force === true;

  await connectToDatabase();
  try {
    const result = await runBriefing({ trigger: 'manual', force });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[seo/briefing] failed', err);
    return NextResponse.json(
      { success: false, error: 'Briefing generation failed' },
      { status: 500 },
    );
  }
}
