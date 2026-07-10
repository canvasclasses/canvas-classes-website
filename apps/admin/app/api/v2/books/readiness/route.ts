import { NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import { requireAdmin } from '@/lib/adminAuth';
import type { PageReadinessSummary } from '@canvas/data/books/readiness';

// Reads pre-computed readiness summaries (kept fresh on every page save + by the
// recompute backfill), so the whole dashboard loads in two queries regardless of
// how many pages exist. Admin-only; never cached.
export const dynamic = 'force-dynamic';

interface LeanPage {
  _id: string;
  book_id: string;
  chapter_number: number;
  page_number: number;
  slug: string;
  title: string;
  page_type?: string;
  readiness?: PageReadinessSummary | null;
  review?: { reviewed?: boolean } | null;
}

// GET /api/v2/books/readiness — full book→chapter→page readiness tree.
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  try {
    await connectToDatabase();

    const books = await BookModel.find({}).sort({ grade: 1, title: 1 }).limit(500).lean();
    const bookById = new Map(books.map((b) => [String(b._id), b]));

    const pages = (await BookPageModel.find({ book_id: { $in: [...bookById.keys()] } })
      .select('book_id chapter_number page_number slug title page_type readiness review')
      .limit(30000)
      .lean()) as unknown as LeanPage[];

    // Group pages by book, then chapter.
    const pagesByBook = new Map<string, LeanPage[]>();
    for (const p of pages) {
      const arr = pagesByBook.get(p.book_id) || [];
      arr.push(p);
      pagesByBook.set(p.book_id, arr);
    }

    const data = books.map((book) => {
      const bookPages = (pagesByBook.get(String(book._id)) || []).sort(
        (a, b) => a.chapter_number - b.chapter_number || a.page_number - b.page_number
      );

      // Chapter titles/order come from the book's embedded chapters; pages join by number.
      const chapterMeta = new Map(
        (book.chapters || []).map((c) => [c.number, { title: c.title, is_published: c.is_published }])
      );
      const byChapter = new Map<number, LeanPage[]>();
      for (const p of bookPages) {
        const arr = byChapter.get(p.chapter_number) || [];
        arr.push(p);
        byChapter.set(p.chapter_number, arr);
      }
      // Include chapters that exist in the book shell even with zero pages.
      for (const c of book.chapters || []) if (!byChapter.has(c.number)) byChapter.set(c.number, []);

      const chapters = [...byChapter.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([number, chPages]) => ({
          number,
          title: chapterMeta.get(number)?.title || `Chapter ${number}`,
          is_published: chapterMeta.get(number)?.is_published ?? false,
          pages: chPages.map((p) => ({
            id: p._id,
            slug: p.slug,
            title: p.title,
            page_number: p.page_number,
            page_type: p.page_type || 'lesson',
            reviewed: p.review?.reviewed === true,
            readiness: p.readiness || null,
          })),
        }));

      return {
        slug: book.slug,
        title: book.title,
        subject: book.subject,
        grade: book.grade,
        is_published: book.is_published,
        chapters,
      };
    });

    return NextResponse.json({ success: true, data, generated_at: new Date().toISOString() });
  } catch (error) {
    console.error('GET /api/v2/books/readiness error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to build readiness report' },
      { status: 500 }
    );
  }
}
