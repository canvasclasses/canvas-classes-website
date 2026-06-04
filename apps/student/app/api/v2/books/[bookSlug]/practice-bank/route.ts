import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import type { ContentBlock } from '@canvas/data/types/books';
import { harvestPractice, type BankQuestion } from '@canvas/data/books/practiceSelector';

// PUBLIC: no auth — the practice question bank is identical for every reader.
// Cacheable; only changes when the book is re-authored.
export const revalidate = 86400;

const MAX_PAGES = 400;

// GET /api/v2/books/[bookSlug]/practice-bank — every chapter_practice question
// across the book, tagged with chapter, for cumulative adaptive selection.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ bookSlug: string }> }
) {
  const { bookSlug } = await params;
  if (!bookSlug) {
    return NextResponse.json({ success: false, error: 'bookSlug required' }, { status: 400 });
  }
  try {
    await connectToDatabase();
    const book = await BookModel.findOne({ slug: bookSlug }).lean();
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const pageChapter = new Map<string, number>();
    for (const ch of book.chapters ?? []) {
      for (const pid of ch.page_ids ?? []) pageChapter.set(String(pid), ch.number);
    }
    const pageIds = Array.from(pageChapter.keys());
    if (pageIds.length === 0) {
      return NextResponse.json({ success: true, data: { questions: [] } });
    }

    const pages = await BookPageModel
      .find({ _id: { $in: pageIds } })
      .select('chapter_number blocks')
      .limit(MAX_PAGES)
      .lean();

    const questions: BankQuestion[] = [];
    for (const p of pages) {
      const blocks = (p.blocks ?? []) as unknown as ContentBlock[];
      const chapter = p.chapter_number ?? pageChapter.get(String(p._id)) ?? 0;
      questions.push(...harvestPractice(blocks, chapter));
    }

    return NextResponse.json({ success: true, data: { questions } });
  } catch (err) {
    console.error('GET /api/v2/books/[bookSlug]/practice-bank error:', err);
    return NextResponse.json({ success: false, error: 'Failed to load practice bank' }, { status: 500 });
  }
}
