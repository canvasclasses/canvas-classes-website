import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import { requireAdmin, isAdminRequest } from '@/lib/bookAuth';
import { ContentBlock } from '@/types/books';
import { validateBlocks } from '@/lib/schemas/blocks';
import { computeReadingTime, computeContentTypes } from '@/lib/utils/books';

// GET branches on isAdminRequest() — admins see drafts, students see only
// published. Caching would leak one view into the other. Students load page
// lists via the SSR route which is cached via ISR.
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ bookSlug: string }> };

// GET /api/v2/books/[bookSlug]/pages — list pages, optionally filtered by chapter
//
// Non-admins only see pages inside a published book + published chapter where
// the page itself is published. Admins see everything for editing purposes.
export async function GET(req: NextRequest, { params }: Params) {
  const { bookSlug } = await params;
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const chapterParam = searchParams.get('chapter');

    // Run auth check and book lookup in parallel — they're independent
    const [isAdmin, book] = await Promise.all([
      isAdminRequest(),
      BookModel.findOne({ slug: bookSlug }).lean(),
    ]);
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    // Non-admins hitting an unpublished book get an empty list, not a 404,
    // so it looks the same as "book exists but has no visible pages yet".
    if (!isAdmin && !book.is_published) {
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    const filter: Record<string, unknown> = { book_id: String(book._id) };

    if (chapterParam) {
      const chapterNum = parseInt(chapterParam, 10);
      if (Number.isNaN(chapterNum)) {
        return NextResponse.json(
          { success: false, error: 'chapter must be an integer' },
          { status: 400 }
        );
      }
      filter.chapter_number = chapterNum;
    }

    // For non-admins, restrict to pages whose parent chapter is published.
    if (!isAdmin) {
      const publishedChapterNumbers = book.chapters
        .filter((c) => c.is_published)
        .map((c) => c.number);

      if (publishedChapterNumbers.length === 0) {
        return NextResponse.json({ success: true, data: [], total: 0 });
      }

      if (chapterParam) {
        // If they asked for a specific chapter that isn't published, return empty.
        if (!publishedChapterNumbers.includes(filter.chapter_number as number)) {
          return NextResponse.json({ success: true, data: [], total: 0 });
        }
      } else {
        filter.chapter_number = { $in: publishedChapterNumbers };
      }

      filter.published = true;
    }

    const pages = await BookPageModel.find(filter)
      .sort({ chapter_number: 1, page_number: 1 })
      .select('_id slug title chapter_number page_number published reading_time_min content_types')
      .lean();

    return NextResponse.json({ success: true, data: pages, total: pages.length });
  } catch (error) {
    console.error(`GET /api/v2/books/${bookSlug}/pages error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST /api/v2/books/[bookSlug]/pages — create a new page (admin only)
export async function POST(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const { bookSlug } = await params;
  try {
    await connectToDatabase();

    const book = await BookModel.findOne({ slug: bookSlug });
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const body = await req.json();

    if (!body.title || !body.slug || body.chapter_number == null || body.page_number == null) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, slug, chapter_number, page_number' },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]+$/.test(body.slug)) {
      return NextResponse.json(
        { success: false, error: 'slug must be lowercase alphanumeric with hyphens only' },
        { status: 400 }
      );
    }

    const pageId = uuidv4();

    // Validate initial blocks at the API edge. Empty arrays are valid; any
    // malformed payload is rejected with a structured 400.
    let blocks: ContentBlock[] = [];
    if (Array.isArray(body.blocks) && body.blocks.length > 0) {
      const validated = validateBlocks(body.blocks);
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
      blocks = validated.blocks as ContentBlock[];
    }

    const page = await BookPageModel.create({
      _id: pageId,
      book_id: String(book._id),
      chapter_number: body.chapter_number,
      page_number: body.page_number,
      slug: body.slug,
      title: body.title,
      subtitle: body.subtitle || undefined,
      blocks,
      tags: body.tags || [],
      published: false,
      reading_time_min: computeReadingTime(blocks),
      content_types: computeContentTypes(blocks),
    });

    // Add page_id to the chapter in the book document
    const chapterIndex = book.chapters.findIndex(
      (c) => c.number === body.chapter_number
    );
    if (chapterIndex !== -1) {
      book.chapters[chapterIndex].page_ids.push(pageId);
      await book.save();
    }

    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error: unknown) {
    console.error(`POST /api/v2/books/${bookSlug}/pages error:`, error);
    if (error instanceof Error && (error as Error & { code?: number }).code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A page with this slug already exists in this book' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: 'Failed to create page' }, { status: 500 });
  }
}
