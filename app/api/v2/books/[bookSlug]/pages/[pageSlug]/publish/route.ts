import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import { requireAdmin } from '@/lib/bookAuth';

type Params = { params: Promise<{ bookSlug: string; pageSlug: string }> };

// POST /api/v2/books/[bookSlug]/pages/[pageSlug]/publish — toggle published state
export async function POST(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const { bookSlug, pageSlug } = await params;
  try {
    await connectToDatabase();

    const book = await BookModel.findOne({ slug: bookSlug }).lean();
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const page = await BookPageModel.findOne({
      book_id: String(book._id),
      slug: pageSlug,
    });

    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    page.published = !page.published;
    await page.save();

    return NextResponse.json({
      success: true,
      data: { published: page.published },
      message: page.published ? 'Page published' : 'Page unpublished',
    });
  } catch (error) {
    console.error(`POST /api/v2/books/${bookSlug}/pages/${pageSlug}/publish error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to toggle publish state' }, { status: 500 });
  }
}
