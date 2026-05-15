/**
 * PATCH /api/v2/user/progress/session-confidence
 *
 * Reclassifies every attempt in a single browse session to a new confidence
 * tier. Called by BrowseView when the student taps "This was casual — don't
 * count" in the session-summary modal.
 *
 * Body: { session_id: string, confidence: 'high' | 'medium' | 'low' }
 *
 * The persistence model already wrote each attempt immediately on submit
 * (see CRUCIBLE_ARCHITECTURE.md §3.2) — this endpoint only changes the tier
 * and rebalances the affected counters (concept_mastery, chapter_progress,
 * stats). It does NOT delete data; a casual mark just makes the attempts
 * invisible to mastery-grade surfaces.
 *
 * Operates on the recent_attempts window only (last 200 attempts). Older
 * attempts cannot be reclassified by design — casual marks must happen
 * during or right after the session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress, AttemptConfidence } from '@/lib/models/UserProgress';

const ALLOWED: AttemptConfidence[] = ['high', 'medium', 'low'];

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const session_id: unknown = body?.session_id;
    const confidence: unknown = body?.confidence;

    if (typeof session_id !== 'string' || session_id.length === 0 || session_id.length > 64) {
      return NextResponse.json({ error: 'Invalid session_id' }, { status: 400 });
    }
    if (!ALLOWED.includes(confidence as AttemptConfidence)) {
      return NextResponse.json({ error: 'Invalid confidence' }, { status: 400 });
    }

    await connectToDatabase();

    // Optimistic-concurrency retry — same pattern as the other writers.
    const MAX_RETRIES = 3;
    let changed = 0;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const progress = await UserProgress.findById(userId);
        if (!progress) {
          return NextResponse.json({ success: true, reclassified: 0 });
        }
        const fn = (progress as unknown as {
          reclassifyBrowseSession: (sid: string, c: AttemptConfidence) => number;
        }).reclassifyBrowseSession;
        if (typeof fn !== 'function') {
          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
        changed = fn.call(progress, session_id, confidence as AttemptConfidence);
        if (changed > 0) await progress.save();
        break;
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'VersionError' && attempt < MAX_RETRIES) {
          continue; // re-read and retry
        }
        throw e;
      }
    }

    return NextResponse.json({ success: true, reclassified: changed });
  } catch (err) {
    console.error('[PATCH /api/v2/user/progress/session-confidence]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
