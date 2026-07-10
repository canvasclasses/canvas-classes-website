import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import { requireAdmin } from '@/lib/adminAuth';
import { validateBlocks } from '@canvas/data/books/schemas';
import { computePageReadiness } from '@canvas/data/books/readiness';

type Params = { params: Promise<{ bookSlug: string; pageSlug: string }> };

// POST /api/v2/books/[bookSlug]/pages/[pageSlug]/review — toggle human sign-off.
// Body: { reviewed?: boolean }. Omitted → toggle. Recomputes readiness so the
// page's stage reflects the sign-off immediately.
export async function POST(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const { bookSlug, pageSlug } = await params;
  try {
    await connectToDatabase();

    const book = await BookModel.findOne({ slug: bookSlug }).select('_id subject').lean();
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const page = await BookPageModel.findOne({ book_id: String(book._id), slug: pageSlug });
    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    let desired: boolean;
    try {
      const body = await req.json();
      desired = typeof body?.reviewed === 'boolean' ? body.reviewed : !page.review?.reviewed;
    } catch {
      desired = !page.review?.reviewed;
    }

    page.review = {
      reviewed: desired,
      reviewed_by: desired ? admin.email : null,
      reviewed_at: desired ? new Date() : null,
    };
    // Keep the readiness stage in sync with the sign-off in the same write.
    page.readiness = computePageReadiness(
      {
        subject: book.subject,
        blocks: page.blocks,
        hinglish_blocks: page.hinglish_blocks,
        published: page.published,
        page_type: page.page_type,
        review: page.review,
      },
      validateBlocks
    );
    await page.save();

    return NextResponse.json({
      success: true,
      data: { reviewed: desired, readiness: page.readiness },
      message: desired ? 'Marked reviewed' : 'Review cleared',
    });
  } catch (error) {
    console.error(`POST /api/v2/books/${bookSlug}/pages/${pageSlug}/review error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to update review state' }, { status: 500 });
  }
}
