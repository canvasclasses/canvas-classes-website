import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BookProgressModel from '@/lib/models/BookProgress';
import BookBookmarkModel from '@/lib/models/BookBookmark';
import { getUserIdFromRequest } from '@/lib/auth';

// Combined endpoint that returns BOTH progress and bookmarks in one round-trip.
// Eliminates the two-request waterfall that previously blocked reader hydration.
//
// Per-user data — never cache on shared caches.
export const dynamic = 'force-dynamic';

const PRIVATE_NO_STORE = {
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
};

// Hard ceiling so a pathological user can't pull tens of thousands of rows
// into memory in a single request. 1000 pages completed + 1000 bookmarked
// is already more than any realistic book.
const MAX_RECORDS = 1000;

// GET /api/v2/books/user-state?book_slug=x — returns { progress, bookmarks }
export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    // Anonymous readers get an empty payload so the hook can proceed without
    // erroring — books are publicly readable, just not trackable.
    return NextResponse.json(
      { success: true, data: { progress: [], bookmarks: [] } },
      { headers: PRIVATE_NO_STORE }
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
    // Parallel fetch — the two collections are independent.
    const [progress, bookmarks] = await Promise.all([
      BookProgressModel
        .find({ user_id: userId, book_slug: bookSlug })
        .select('page_slug chapter_number quiz_score completed_at')
        .limit(MAX_RECORDS)
        .lean(),
      BookBookmarkModel
        .find({ user_id: userId, book_slug: bookSlug })
        .select('page_slug page_title chapter_number created_at')
        .sort({ created_at: -1 })
        .limit(MAX_RECORDS)
        .lean(),
    ]);

    return NextResponse.json(
      { success: true, data: { progress, bookmarks } },
      { headers: PRIVATE_NO_STORE }
    );
  } catch (err) {
    console.error('GET /api/v2/books/user-state error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user state' },
      { status: 500, headers: PRIVATE_NO_STORE }
    );
  }
}
