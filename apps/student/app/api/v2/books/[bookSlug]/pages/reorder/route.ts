import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import { requireAdmin } from '@/lib/bookAuth';

type Params = { params: Promise<{ bookSlug: string }> };

/**
 * PATCH /api/v2/books/[bookSlug]/pages/reorder
 *
 * Safely rearranges pages — updates page_number and/or chapter_number ONLY.
 * NEVER touches blocks, title, subtitle, or any other content field.
 *
 * Use this for:
 *  - Inserting a new page mid-sequence (shift existing pages up first, then POST the new page)
 *  - Moving a page to a different position
 *  - Moving pages between chapters
 *
 * Body:
 * {
 *   "updates": [
 *     { "slug": "subatomic-particles", "page_number": 3 },
 *     { "slug": "thomsons-model",      "page_number": 4, "chapter_number": 2 }
 *   ]
 * }
 *
 * Returns: { success, updated, results: [{slug, ok}] }
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const { bookSlug } = await params;
  try {
    await connectToDatabase();

    const book = await BookModel.findOne({ slug: bookSlug }).lean();
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const body = await req.json();
    const updates: { slug: string; page_number: number; chapter_number?: number }[] =
      body.updates;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'updates must be a non-empty array of {slug, page_number, chapter_number?}',
        },
        { status: 400 }
      );
    }

    const bookId = String(book._id);
    const results: { slug: string; ok: boolean }[] = [];

    for (const { slug, page_number, chapter_number } of updates) {
      if (typeof slug !== 'string' || typeof page_number !== 'number') {
        results.push({ slug: slug ?? '?', ok: false });
        continue;
      }

      // Only set the sequence fields — blocks and content are never in this $set
      const sequenceFields: Record<string, number> = { page_number };
      if (typeof chapter_number === 'number') {
        sequenceFields.chapter_number = chapter_number;
      }

      const result = await BookPageModel.updateOne(
        { book_id: bookId, slug },
        { $set: sequenceFields }
      );

      results.push({ slug, ok: result.matchedCount > 0 });
    }

    const failed = results.filter((r) => !r.ok).map((r) => r.slug);

    return NextResponse.json({
      success: true,
      updated: results.filter((r) => r.ok).length,
      results,
      ...(failed.length > 0 && { warning: `Slugs not found: ${failed.join(', ')}` }),
    });
  } catch (error) {
    console.error(`PATCH /api/v2/books/${bookSlug}/pages/reorder error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder pages' },
      { status: 500 }
    );
  }
}
