/**
 * GET /api/v2/user/persona-snapshot
 *
 * Returns the versioned, read-only persona snapshot for the authenticated
 * student — the compact projection the AI tutor (Phase 2) consumes. Pure read:
 * it never mutates the persona (the only mutation surface is writer.ts).
 *
 * PER-USER → force-dynamic is correct here (CLAUDE.md §10.1). This route must
 * never be cached at the edge — every student's snapshot is different, and it
 * sits behind auth. It is intentionally NOT in the sitemap.
 */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { buildPersonaSnapshot } from '@canvas/persona/persona-snapshot';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snapshot = await buildPersonaSnapshot(userId);
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error('[GET /api/v2/user/persona-snapshot]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
