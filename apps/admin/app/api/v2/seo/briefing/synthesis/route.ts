/**
 * POST /api/v2/seo/briefing/synthesis
 *
 * Attaches a Claude-generated synthesis to today's (or a specified date's)
 * briefing. Called by the Claude Code Desktop daily routine after it has
 * read the digest and produced a prose summary.
 *
 * Body:
 *   {
 *     forDate?: 'YYYY-MM-DD',   // defaults to most recent briefing
 *     synthesis: string,         // required — markdown text
 *     model: string,             // identifier shown in the UI, e.g. "claude-sonnet-4-7"
 *     tokensUsed?: number        // optional — for cost tracking
 *   }
 *
 * Auth: requireAdmin (CLAUDE.md §8.2.1). The Desktop task uses the
 * x-admin-secret script-secret bypass for unattended runs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, hasBriefingSecret } from '@/lib/auth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { attachSynthesis } from '@canvas/seo/briefing';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // Scoped briefing-secret bypass — see digest/route.ts for rationale.
  if (!hasBriefingSecret(request)) {
    const gate = await requireAdmin(request);
    if (!gate.ok) return gate.response;
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.synthesis !== 'string' || typeof body.model !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Body must contain { synthesis: string, model: string, forDate?: "YYYY-MM-DD", tokensUsed?: number }' },
      { status: 400 },
    );
  }

  await connectToDatabase();
  try {
    const result = await attachSynthesis({
      forDate: typeof body.forDate === 'string' ? body.forDate : undefined,
      synthesis: body.synthesis,
      model: body.model,
      tokensUsed: typeof body.tokensUsed === 'number' ? body.tokensUsed : null,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const msg = (err as Error).message ?? 'unknown';
    const status = msg.includes('no briefing found') || msg.includes('invalid forDate') ? 400 : 500;
    console.error('[seo/briefing/synthesis] failed', err);
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
