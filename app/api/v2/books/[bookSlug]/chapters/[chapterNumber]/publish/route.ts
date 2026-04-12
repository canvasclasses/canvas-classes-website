// POST /api/v2/books/[bookSlug]/chapters/[chapterNumber]/publish
//
// Toggles a chapter's is_published flag. When publishing, the toggle also
// cascades published: true onto every page inside that chapter — the user's
// mental model is "this whole chapter is ready, ship it all".
//
// When unpublishing, pages are LEFT ALONE (their individual `published` flag
// is preserved) so that the admin can unpublish a chapter for editing
// without nuking each page's state. Students won't see them either way while
// the chapter flag is off.
//
// Request body: (optional)
//   { "publish": true | false }  — explicit target state; if omitted the
//                                  endpoint toggles whatever is currently set.

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import { requireAdmin } from '@/lib/bookAuth';

type Params = { params: Promise<{ bookSlug: string; chapterNumber: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const { bookSlug, chapterNumber } = await params;
  const chapterNum = parseInt(chapterNumber, 10);
  if (Number.isNaN(chapterNum)) {
    return NextResponse.json(
      { success: false, error: 'chapterNumber must be an integer' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const book = await BookModel.findOne({ slug: bookSlug });
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const chapterIdx = book.chapters.findIndex((c) => c.number === chapterNum);
    if (chapterIdx === -1) {
      return NextResponse.json({ success: false, error: 'Chapter not found' }, { status: 404 });
    }

    // Determine target state — explicit body wins, otherwise flip current.
    let explicitTarget: boolean | undefined;
    try {
      const body = await req.json();
      if (typeof body?.publish === 'boolean') explicitTarget = body.publish;
    } catch {
      // Empty body — treat as toggle
    }

    const currentlyPublished = Boolean(book.chapters[chapterIdx].is_published);
    const nextPublished = explicitTarget ?? !currentlyPublished;

    book.chapters[chapterIdx].is_published = nextPublished;
    book.markModified('chapters');
    await book.save();

    // On publish: cascade every page in this chapter to published=true.
    // On unpublish: leave page-level flags alone (see file header comment).
    let cascadedPages = 0;
    if (nextPublished) {
      const result = await BookPageModel.updateMany(
        { book_id: String(book._id), chapter_number: chapterNum },
        { $set: { published: true } }
      );
      cascadedPages = result.modifiedCount ?? 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        chapter_number: chapterNum,
        is_published: nextPublished,
        cascaded_pages: cascadedPages,
      },
      message: nextPublished
        ? `Chapter ${chapterNum} published (${cascadedPages} pages made live)`
        : `Chapter ${chapterNum} unpublished`,
    });
  } catch (error) {
    console.error(
      `POST /api/v2/books/${bookSlug}/chapters/${chapterNumber}/publish error:`,
      error
    );
    return NextResponse.json(
      { success: false, error: 'Failed to toggle chapter publish state' },
      { status: 500 }
    );
  }
}
