/**
 * POST /api/v2/seo/sync
 *
 * Run a single-day GSC + CrUX sync. Idempotent — re-running for the same
 * date overwrites that day's rows with the latest numbers from Google's
 * APIs. The dashboard reads from Mongo, never from the live APIs.
 *
 * Body (all optional):
 *   { date?: 'YYYY-MM-DD',     // defaults to D-3 (GSC's finalisation lag)
 *     skipCrux?: boolean,      // skip the CrUX leg, default false
 *     trigger?: 'cron' | 'manual' }  // for the run log, default 'manual'
 *
 * Auth: requireAdmin per CLAUDE.md §8.2.1. Cron uses the `x-admin-secret`
 * script-secret bypass (Vercel cron sets it via the route's URL pattern in
 * vercel.json — to be added in PR 2).
 *
 * Response: the SyncRun document with rowCounts so an operator can see
 * "ok, 1 total + 873 queries + 412 pages got upserted today".
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { GscSyncRun } from '@canvas/data/models/GscSyncRun';
import { runSync } from '@canvas/seo/run-sync';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 min — multi-dim fetch + bulk upsert can take a while

interface SyncBody {
  date?: string;
  skipCrux?: boolean;
}

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const body = (await request.json().catch(() => ({}))) as SyncBody;
  await connectToDatabase();

  try {
    const result = await runSync({
      date: typeof body.date === 'string' ? body.date : undefined,
      skipCrux: body.skipCrux === true,
      trigger: 'manual',
    });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[seo/sync] failed', err);
    return NextResponse.json(
      { success: false, error: 'Sync failed' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/v2/seo/sync — recent run history for the sync log UI.
 * Returns the last 20 runs, newest first.
 */
export async function GET(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  await connectToDatabase();
  const runs = await GscSyncRun.find({})
    .sort({ startedAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json({ success: true, runs });
}
