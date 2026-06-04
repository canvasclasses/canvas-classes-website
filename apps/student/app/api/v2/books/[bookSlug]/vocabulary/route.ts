import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import type { ContentBlock } from '@canvas/data/types/books';
import { harvestVocabulary, dedupeVaultWords, type VaultWord } from '@canvas/data/books/vocabulary';

// PUBLIC: no auth required — this is the same vocabulary every reader sees,
// derived from the published book content. Cache aggressively; the deck only
// changes when the book is re-authored (admin save calls revalidatePath).
export const revalidate = 86400;

const MAX_PAGES = 400; // hard cap; a full Kaveri book is ~128 pages.

// GET /api/v2/books/[bookSlug]/vocabulary — the harvested Word Vault deck.
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

    // Map each page id → its chapter number so harvested words carry provenance.
    const pageChapter = new Map<string, number>();
    for (const ch of book.chapters ?? []) {
      for (const pid of ch.page_ids ?? []) pageChapter.set(String(pid), ch.number);
    }
    const pageIds = Array.from(pageChapter.keys());
    if (pageIds.length === 0) {
      return NextResponse.json({ success: true, data: { words: [] } });
    }

    const pages = await BookPageModel
      .find({ _id: { $in: pageIds } })
      .select('slug chapter_number blocks')
      .limit(MAX_PAGES)
      .lean();

    const harvested: VaultWord[] = [];
    for (const p of pages) {
      const blocks = (p.blocks ?? []) as unknown as ContentBlock[];
      harvested.push(
        ...harvestVocabulary(blocks, {
          chapterNumber: p.chapter_number ?? pageChapter.get(String(p._id)),
          pageSlug: p.slug,
        })
      );
    }

    const words = dedupeVaultWords(harvested);
    return NextResponse.json({ success: true, data: { words } });
  } catch (err) {
    console.error('GET /api/v2/books/[bookSlug]/vocabulary error:', err);
    return NextResponse.json({ success: false, error: 'Failed to load vocabulary' }, { status: 500 });
  }
}
