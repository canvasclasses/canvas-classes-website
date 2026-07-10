import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import { requireAdmin } from '@/lib/adminAuth';
import { validateBlocks } from '@canvas/data/books/schemas';
import { computePageReadiness } from '@canvas/data/books/readiness';

export const dynamic = 'force-dynamic';
// Recompute can walk every page's blocks; give it room on large books.
export const maxDuration = 300;

// POST /api/v2/books/readiness/recompute — (re)compute the readiness summary for
// every page (or one book with { bookSlug }). This is the one-time backfill and
// the dashboard's "Recompute" button. Reads full blocks, so it is heavier than
// the GET tree — run it on demand, not on every dashboard view.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  try {
    await connectToDatabase();

    let bookSlug: string | undefined;
    try {
      const body = await req.json();
      bookSlug = typeof body?.bookSlug === 'string' ? body.bookSlug : undefined;
    } catch {
      /* no body — recompute everything */
    }

    const bookFilter = bookSlug ? { slug: bookSlug } : {};
    const books = await BookModel.find(bookFilter).select('_id subject slug').limit(500).lean();
    if (bookSlug && books.length === 0) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    let updated = 0;
    // Process one book at a time so we never hold every book's blocks in memory.
    for (const book of books) {
      const pages = await BookPageModel.find({ book_id: String(book._id) })
        .select('_id blocks hinglish_blocks published page_type review')
        .lean();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ops = pages.map((p: any) => ({
        updateOne: {
          filter: { _id: p._id },
          update: {
            $set: {
              readiness: computePageReadiness(
                {
                  subject: book.subject,
                  blocks: p.blocks,
                  hinglish_blocks: p.hinglish_blocks,
                  published: p.published,
                  page_type: p.page_type,
                  review: p.review ?? null,
                },
                validateBlocks
              ),
            },
          },
        },
      }));

      if (ops.length > 0) {
        await BookPageModel.bulkWrite(ops, { ordered: false });
        updated += ops.length;
      }
    }

    return NextResponse.json({
      success: true,
      data: { books: books.length, pages_updated: updated },
      message: `Recomputed readiness for ${updated} page${updated === 1 ? '' : 's'}`,
    });
  } catch (error) {
    console.error('POST /api/v2/books/readiness/recompute error:', error);
    return NextResponse.json({ success: false, error: 'Failed to recompute readiness' }, { status: 500 });
  }
}
