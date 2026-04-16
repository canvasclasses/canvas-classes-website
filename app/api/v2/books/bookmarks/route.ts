import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BookBookmarkModel from '@/lib/models/BookBookmark';
import { getUserId } from '@/lib/bookAuth';

export const dynamic = 'force-dynamic';

const PRIVATE_NO_STORE = {
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
};

// GET /api/v2/books/bookmarks?book_slug=x — fetch all bookmarks for a book
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
    const bookmarks = await BookBookmarkModel
      .find({ user_id: userId, book_slug: bookSlug })
      .select('page_slug page_title chapter_number created_at')
      .sort({ created_at: -1 })
      .lean();
    return NextResponse.json({ success: true, data: bookmarks }, { headers: PRIVATE_NO_STORE });
  } catch (err) {
    console.error('GET /api/v2/books/bookmarks error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookmarks' },
      { status: 500, headers: PRIVATE_NO_STORE }
    );
  }
}

// POST /api/v2/books/bookmarks — toggle a bookmark (add or remove)
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
    const { book_slug, page_slug, page_title, chapter_number } = await req.json();

    if (!book_slug || !page_slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400, headers: PRIVATE_NO_STORE }
      );
    }

    // Toggle: if bookmark exists, delete it; otherwise, create it.
    const existing = await BookBookmarkModel.findOne({
      user_id: userId, book_slug, page_slug,
    });

    if (existing) {
      await BookBookmarkModel.deleteOne({ _id: existing._id });
      return NextResponse.json(
        { success: true, action: 'removed' },
        { headers: PRIVATE_NO_STORE }
      );
    }

    await BookBookmarkModel.create({
      user_id: userId,
      book_slug,
      page_slug,
      page_title: page_title || page_slug,
      chapter_number: chapter_number ?? 0,
    });

    return NextResponse.json(
      { success: true, action: 'added' },
      { headers: PRIVATE_NO_STORE }
    );
  } catch (err) {
    console.error('POST /api/v2/books/bookmarks error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle bookmark' },
      { status: 500, headers: PRIVATE_NO_STORE }
    );
  }
}
