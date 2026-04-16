import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import { requireAdmin, isAdminRequest } from '@/lib/bookAuth';
import { ContentBlock } from '@/types/books';
import { validateBlocks } from '@/lib/schemas/blocks';
import { computeReadingTime, computeContentTypes } from '@/lib/utils/books';

const VALID_CALLOUT_VARIANTS = new Set([
  'remember', 'note', 'warning', 'exam_tip', 'fun_fact',
]);

/**
 * Sanitises a single block in-place (shallow copy already made by caller):
 *  • Assigns a UUID if `id` is missing or not a string
 *  • Resets an invalid callout `variant` to 'note'
 *
 * This lets old DB data self-heal on the next save rather than blocking
 * every subsequent edit with a Zod validation error.
 */
function sanitizeBlock(b: Record<string, unknown>): Record<string, unknown> {
  if (!b.id || typeof b.id !== 'string') {
    b.id = randomUUID();
  }

  if (
    b.type === 'callout' &&
    (typeof b.variant !== 'string' || !VALID_CALLOUT_VARIANTS.has(b.variant as string))
  ) {
    b.variant = 'note';
  }

  return b;
}

/**
 * Walks the top-level blocks array (and child blocks inside section columns)
 * and sanitises every block before Zod validation runs.
 */
function sanitizeBlocks(blocks: unknown[]): unknown[] {
  return blocks.map((block) => {
    if (typeof block !== 'object' || block === null) return block;
    const b = sanitizeBlock({ ...(block as Record<string, unknown>) });

    // Recurse into section columns (sections cannot nest further)
    if (b.type === 'section' && Array.isArray(b.columns)) {
      b.columns = (b.columns as unknown[][]).map((col) => {
        if (!Array.isArray(col)) return col;
        return col.map((child) => {
          if (typeof child !== 'object' || child === null) return child;
          return sanitizeBlock({ ...(child as Record<string, unknown>) });
        });
      });
    }

    return b;
  });
}

// GET branches on isAdminRequest() — admins see drafts, students see only
// published. Caching this response would leak draft content to students (or
// stale published content to admins), so it must never be cached.
// Students should load pages via the SSR route at app/books/[bookSlug]/[pageSlug]
// which is cached via ISR; this API route exists primarily for the admin editor.
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ bookSlug: string; pageSlug: string }> };

// GET /api/v2/books/[bookSlug]/pages/[pageSlug] — get full page with all blocks
//
// Public by default: only returns pages where the book is published, the
// parent chapter is published, and the page itself is published.
// Admins bypass all three gates so the editor can load drafts.
export async function GET(_req: NextRequest, { params }: Params) {
  const { bookSlug, pageSlug } = await params;
  try {
    await connectToDatabase();

    // Run auth check and book lookup in parallel — they're independent.
    // Page lookup needs book._id so it runs after, but auth overlaps with
    // the book query instead of running sequentially after it.
    const [isAdmin, book] = await Promise.all([
      isAdminRequest(),
      BookModel.findOne({ slug: bookSlug }).lean(),
    ]);

    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const page = await BookPageModel.findOne({
      book_id: String(book._id),
      slug: pageSlug,
    }).lean();

    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    if (!isAdmin) {
      if (!book.is_published) {
        return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
      }
      const parentChapter = book.chapters.find((c) => c.number === page.chapter_number);
      if (!parentChapter?.is_published) {
        return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
      }
      if (!page.published) {
        return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error(`GET /api/v2/books/${bookSlug}/pages/${pageSlug} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch page' }, { status: 500 });
  }
}

// PUT /api/v2/books/[bookSlug]/pages/[pageSlug] — save page metadata and/or blocks
// SAFETY RULE: blocks are only updated when explicitly provided in the request body.
// Sending only metadata fields (e.g. page_number, title) will NEVER wipe existing blocks.
export async function PUT(req: NextRequest, { params }: Params) {
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

    const body = await req.json();

    // Prevent overwriting immutable fields
    delete body._id;
    delete body.book_id;
    delete body.slug;

    const updateFields: Record<string, unknown> = { ...body };

    // Only update blocks + reading_time when blocks are explicitly provided.
    // A PUT with only metadata fields (e.g. page_number) must NEVER wipe content.
    if (Array.isArray(body.blocks)) {
      // Sanitise legacy/invalid data before Zod sees it — self-heals on save.
      // Currently fixes: missing id, invalid callout variant.
      const healed = sanitizeBlocks(body.blocks);

      // Zod validation at the API edge — rejects malformed block payloads
      // before they hit Mongo. Catches: unknown block types, missing required
      // fields, wrong field types, typos in enums (variant/align/level/etc).
      const validated = validateBlocks(healed);
      if (!validated.ok) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid block payload: ${validated.error}`,
            issues: validated.issues,
          },
          { status: 400 }
        );
      }
      const blocks = validated.blocks as ContentBlock[];
      updateFields.blocks = blocks;
      updateFields.reading_time_min = computeReadingTime(blocks);
      updateFields.content_types = computeContentTypes(blocks);
    } else {
      delete updateFields.blocks;
      delete updateFields.reading_time_min;
    }

    const page = await BookPageModel.findOneAndUpdate(
      { book_id: String(book._id), slug: pageSlug },
      { $set: updateFields },
      { new: true, runValidators: false }
    ).lean();

    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error(`PUT /api/v2/books/${bookSlug}/pages/${pageSlug} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to save page' }, { status: 500 });
  }
}

// DELETE /api/v2/books/[bookSlug]/pages/[pageSlug] — delete page (admin only)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const { bookSlug, pageSlug } = await params;
  try {
    await connectToDatabase();

    const book = await BookModel.findOne({ slug: bookSlug });
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const page = await BookPageModel.findOneAndDelete({
      book_id: String(book._id),
      slug: pageSlug,
    }).lean();

    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    // Remove page_id from its chapter in the book document
    const pageId = String(page._id);
    for (const chapter of book.chapters) {
      const idx = chapter.page_ids.indexOf(pageId);
      if (idx !== -1) {
        chapter.page_ids.splice(idx, 1);
        break;
      }
    }
    await book.save();

    return NextResponse.json({ success: true, message: 'Page deleted' });
  } catch (error) {
    console.error(`DELETE /api/v2/books/${bookSlug}/pages/${pageSlug} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to delete page' }, { status: 500 });
  }
}
