import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BookProgressModel from '@/lib/models/BookProgress';
import { getUserId } from '@/lib/bookAuth';

// Per-user data — never cache on shared caches (CDN, Next.js data cache).
// The client layer (useBookProgress hook) does its own in-memory dedupe.
export const dynamic = 'force-dynamic';

// Shared private-cache headers applied to every response so no shared cache
// (CDN / edge / proxy) ever holds one user's progress data.
const PRIVATE_NO_STORE = {
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
};

// GET /api/v2/books/progress?book_slug=x  — fetch all completed pages for a book
export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthenticated' },
      { status: 401, headers: PRIVATE_NO_STORE }
    );
  }

  const bookSlug = req.nextUrl.searchParams.get('book_slug');
  if (!bookSlug) {
    return NextResponse.json(
      { success: false, error: 'book_slug required' },
      { status: 400, headers: PRIVATE_NO_STORE }
    );
  }

  try {
    await connectToDatabase();
    // Only pull the fields the client actually consumes — the full document
    // includes timestamps / score metadata that the reader never reads.
    const records = await BookProgressModel
      .find({ user_id: userId, book_slug: bookSlug })
      .select('page_slug chapter_number quiz_score completed_at')
      .lean();
    return NextResponse.json({ success: true, data: records }, { headers: PRIVATE_NO_STORE });
  } catch (err) {
    console.error('GET /api/v2/books/progress error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500, headers: PRIVATE_NO_STORE }
    );
  }
}

// POST /api/v2/books/progress — save or update a completed page
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthenticated' },
      { status: 401, headers: PRIVATE_NO_STORE }
    );
  }

  try {
    await connectToDatabase();
    const { book_slug, chapter_number, page_slug, quiz_score } = await req.json();

    if (!book_slug || !page_slug || chapter_number == null) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400, headers: PRIVATE_NO_STORE }
      );
    }

    const record = await BookProgressModel.findOneAndUpdate(
      { user_id: userId, book_slug, page_slug },
      { chapter_number, quiz_score: quiz_score ?? 100, completed_at: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: record }, { headers: PRIVATE_NO_STORE });
  } catch (err) {
    console.error('POST /api/v2/books/progress error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to save progress' },
      { status: 500, headers: PRIVATE_NO_STORE }
    );
  }
}
