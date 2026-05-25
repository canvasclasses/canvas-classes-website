/**
 * GET /api/cron/seo-sync
 *
 * Vercel Cron entry point. Fires once per day (see apps/admin/vercel.json)
 * and triggers the shared runSync orchestrator for D-3.
 *
 * Auth: Vercel automatically attaches `Authorization: Bearer ${CRON_SECRET}`
 * to outbound cron requests when the env var is set. We verify against the
 * same env var here. The localhost dev bypass + script-secret bypass let us
 * exercise the route locally and from one-off scripts without leaking the
 * cron secret. Mirrors the pattern in apps/student/app/api/blog/cron/publish.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { runSync } from '@canvas/seo/run-sync';
import { hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const fromVercelCron =
    !!cronSecret && request.headers.get('authorization') === `Bearer ${cronSecret}`;
  const allowed = fromVercelCron || hasScriptSecret(request) || (await isLocalhostDev());
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const result = await runSync({ trigger: 'cron' });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[cron/seo-sync] failed', err);
    return NextResponse.json(
      { success: false, error: 'Cron sync failed' },
      { status: 500 },
    );
  }
}
