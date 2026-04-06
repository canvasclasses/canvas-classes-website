import { NextRequest, NextResponse } from 'next/server';
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

type Params = { params: Promise<{ bookSlug: string; pageSlug: string }> };

// GET /api/v2/books/[bookSlug]/pages/[pageSlug] — get full page with all blocks
export async function GET(_req: NextRequest, { params }: Params) {
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
    }).lean();

    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error(`GET /api/v2/books/${bookSlug}/pages/${pageSlug} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch page' }, { status: 500 });
  }
}

// PUT /api/v2/books/[bookSlug]/pages/[pageSlug] — save page (full block array replace)
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

    const blocks: ContentBlock[] = body.blocks || [];

    const page = await BookPageModel.findOneAndUpdate(
      { book_id: String(book._id), slug: pageSlug },
      {
        $set: {
          ...body,
          blocks,
          reading_time_min: computeReadingTime(blocks),
        },
      },
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
