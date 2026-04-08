import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BookProgressModel from '@/lib/models/BookProgress';
import { createClient } from '@/app/utils/supabase/server';

async function getUserId(): Promise<string | null> {
  if (process.env.NODE_ENV === 'development') return 'dev-user';
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch { return null; }
}

// GET /api/v2/books/progress?book_slug=x  — fetch all completed pages for a book
export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401 });

  const bookSlug = req.nextUrl.searchParams.get('book_slug');
  if (!bookSlug) return NextResponse.json({ success: false, error: 'book_slug required' }, { status: 400 });

  try {
    await connectToDatabase();
    const records = await BookProgressModel.find({ user_id: userId, book_slug: bookSlug }).lean();
    return NextResponse.json({ success: true, data: records });
  } catch (err) {
    console.error('GET /api/v2/books/progress error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// POST /api/v2/books/progress — save or update a completed page
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401 });

  try {
    await connectToDatabase();
    const { book_slug, chapter_number, page_slug, quiz_score } = await req.json();

    if (!book_slug || !page_slug || chapter_number == null) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const record = await BookProgressModel.findOneAndUpdate(
      { user_id: userId, book_slug, page_slug },
      { chapter_number, quiz_score: quiz_score ?? 100, completed_at: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: record });
  } catch (err) {
    console.error('POST /api/v2/books/progress error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save progress' }, { status: 500 });
  }
}
