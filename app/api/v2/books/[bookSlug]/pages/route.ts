import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import { createClient } from '@/app/utils/supabase/server';
import { ContentBlock } from '@/types/books';

async function requireAdmin(): Promise<{ email: string } | null> {
  if (process.env.NODE_ENV === 'development') {
    return { email: 'dev@localhost' };
  }
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return null;
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
    if (!adminEmails.includes(user.email)) return null;
    return { email: user.email };
  } catch {
    return null;
  }
}

function computeReadingTime(blocks: ContentBlock[]): number {
  let wordCount = 0;
  let videoCount = 0;
  let audioCount = 0;

  for (const block of blocks) {
    if (block.type === 'text') wordCount += block.markdown.split(/\s+/).length;
    if (block.type === 'heading') wordCount += block.text.split(/\s+/).length;
    if (block.type === 'callout') wordCount += block.markdown.split(/\s+/).length;
    if (block.type === 'video') videoCount++;
    if (block.type === 'audio_note') audioCount++;
  }

  return Math.max(1, Math.ceil(wordCount / 200) + videoCount * 2 + audioCount * 1);
}

type Params = { params: Promise<{ bookSlug: string }> };

// GET /api/v2/books/[bookSlug]/pages — list pages, optionally filtered by chapter
export async function GET(req: NextRequest, { params }: Params) {
  const { bookSlug } = await params;
  try {
    await connectToDatabase();

    const book = await BookModel.findOne({ slug: bookSlug }).lean();
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const chapterParam = searchParams.get('chapter');

    const filter: Record<string, unknown> = { book_id: String(book._id) };
    if (chapterParam) filter.chapter_number = parseInt(chapterParam);

    const pages = await BookPageModel.find(filter)
      .sort({ chapter_number: 1, page_number: 1 })
      .select('-blocks')  // Exclude blocks from list view — fetch individually when editing
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
    const blocks: ContentBlock[] = body.blocks || [];

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
