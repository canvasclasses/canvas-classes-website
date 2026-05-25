/**
 * GET /api/cron/seo-briefing
 *
 * Daily Vercel Cron fires at 03:00 UTC (08:30 IST — after the 02:00 UTC sync
 * has refreshed the Mongo data, before the team starts their day). Generates
 * the morning briefing: structured digest + Claude synthesis + optional Slack.
 *
 * Idempotent: re-running for the same date returns the existing briefing
 * without re-spending LLM tokens. Pass `?force=1` (or call the manual route)
 * to override.
 *
 * Auth: same three-tier pattern as /api/cron/seo-sync — Vercel attaches
 * Authorization: Bearer ${CRON_SECRET} automatically; script-secret and
 * localhost bypasses for local testing.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { runBriefing } from '@canvas/seo/briefing';
import { hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const maxDuration = 120;       // LLM + Slack post — generous ceiling

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const fromCron = !!cronSecret && request.headers.get('authorization') === `Bearer ${cronSecret}`;
  const allowed = fromCron || hasScriptSecret(request) || (await isLocalhostDev());
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const force = request.nextUrl.searchParams.get('force') === '1';

  try {
    const result = await runBriefing({ trigger: 'cron', force });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[cron/seo-briefing] failed', err);
    return NextResponse.json(
      { success: false, error: 'Briefing generation failed' },
      { status: 500 },
    );
  }
}
