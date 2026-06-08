import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookPracticeAttempt from '@canvas/data/models/BookPracticeAttempt';
import { recordBookAttempt } from '@canvas/persona/book-attempt';
import { getUserIdFromRequest } from '@/lib/auth';

// Per-user data — never cache on shared caches.
export const dynamic = 'force-dynamic';
const PRIVATE_NO_STORE = {
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
};

const MAX_HISTORY = 500;
const VALID_CONCEPTS = new Set(['comprehension', 'vocab_in_context', 'grammar', 'interpretation', 'inference']);

// GET /api/v2/books/practice?book_slug=x — cumulative attempt history for this
// user+book (newest first), used by the adaptive selector to calibrate.
export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401, headers: PRIVATE_NO_STORE });
  }
  const bookSlug = req.nextUrl.searchParams.get('book_slug');
  if (!bookSlug) {
    return NextResponse.json({ success: false, error: 'book_slug required' }, { status: 400, headers: PRIVATE_NO_STORE });
  }
  try {
    await connectToDatabase();
    const records = await BookPracticeAttempt
      .find({ user_id: userId, book_slug: bookSlug })
      .select('question_id concept_tag difficulty correct chapter_number')
      .sort({ attempted_at: -1 })
      .limit(MAX_HISTORY)
      .lean();
    return NextResponse.json({ success: true, data: records }, { headers: PRIVATE_NO_STORE });
  } catch (err) {
    console.error('GET /api/v2/books/practice error:', err);
    return NextResponse.json({ success: false, error: 'Failed to load practice history' }, { status: 500, headers: PRIVATE_NO_STORE });
  }
}

// POST /api/v2/books/practice — record one attempt.
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401, headers: PRIVATE_NO_STORE });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400, headers: PRIVATE_NO_STORE });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ success: false, error: 'Body must be an object' }, { status: 400, headers: PRIVATE_NO_STORE });
  }

  // Explicit field whitelist — never spread the raw body into the document.
  const b = body as Record<string, unknown>;
  const book_slug = typeof b.book_slug === 'string' ? b.book_slug : null;
  const chapter_number = typeof b.chapter_number === 'number' ? Math.floor(b.chapter_number) : null;
  const question_id = typeof b.question_id === 'string' ? b.question_id : null;
  const concept_tag = typeof b.concept_tag === 'string' && VALID_CONCEPTS.has(b.concept_tag) ? b.concept_tag : 'comprehension';
  const difficulty = typeof b.difficulty === 'number' ? Math.min(5, Math.max(1, Math.floor(b.difficulty))) : 1;
  const correct = typeof b.correct === 'boolean' ? b.correct : null;
  const time_ms = typeof b.time_ms === 'number' && isFinite(b.time_ms) ? Math.max(0, Math.min(600000, Math.floor(b.time_ms))) : 0;

  if (!book_slug || chapter_number === null || !question_id || correct === null) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400, headers: PRIVATE_NO_STORE });
  }
  if (book_slug.length > 200 || question_id.length > 200) {
    return NextResponse.json({ success: false, error: 'Field too long' }, { status: 400, headers: PRIVATE_NO_STORE });
  }

  try {
    await connectToDatabase();
    await BookPracticeAttempt.create({
      user_id: userId,
      book_slug,
      chapter_number,
      question_id,
      concept_tag,
      difficulty,
      correct,
      time_ms,
    });

    // ── Unified persona (ADR-011 / Phase 0b; KEPT under ADR-012) ──────────
    // Dual-write the same attempt into the ONE skill-keyed persona
    // (UserProgress.concept_mastery) via the canonical writer, so Live Books
    // signal joins Crucible's. Wrapped so it can NEVER fail the student's
    // practice response; the in-book adaptive selector still uses the
    // book_practice_attempts write above.
    // ADR-012 (2026-06-07): Books are decoupled from Crucible *recommendation*,
    // but this feed is intentionally KEPT (non-load-bearing) for a holistic
    // cross-surface persona — it does NOT drive any cross-surface redirect.
    try {
      await recordBookAttempt({
        userId,
        bookSlug: book_slug,
        chapter: chapter_number,
        conceptTag: concept_tag,
        questionId: question_id,
        isCorrect: correct,
        difficulty,
        timeMs: time_ms,
      });
    } catch (personaErr) {
      console.error('unified persona dual-write failed (non-fatal):', personaErr);
    }

    return NextResponse.json({ success: true }, { headers: PRIVATE_NO_STORE });
  } catch (err) {
    console.error('POST /api/v2/books/practice error:', err);
    return NextResponse.json({ success: false, error: 'Failed to record attempt' }, { status: 500, headers: PRIVATE_NO_STORE });
  }
}
