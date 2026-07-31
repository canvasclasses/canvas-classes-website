import type { Metadata } from 'next';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import GradeLandingPage, {
  type GradeBook,
  type GradePage,
} from '@/features/books/components/GradeLandingPage';
import LiveBooksComingSoon from '@/features/books/components/LiveBooksComingSoon';
import { loadChapterImagery } from '@/features/books/lib/bookImagery';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Class 12 Live Books — NCERT Interactive Lessons',
  description:
    'Class 12 NCERT live books with interactive lessons, simulations, quizzes, and Hinglish mode. Coming soon on Canvas Classes.',
};

const EXPECTED_SUBJECTS = ['Chemistry', 'Physics', 'Mathematics', 'Biology'];

/**
 * Books whose URL segment under /class-12 differs from their DB slug.
 * Chemistry shipped first at /class-12/chemistry with the slug
 * `ncert-simplified-12`; those URLs are indexed, so the segment is pinned
 * here rather than migrated. New books should just use their slug.
 */
const URL_SEGMENTS: Record<string, string> = {
  'ncert-simplified-12': 'chemistry',
};

export default async function Class12Page() {
  await connectToDatabase();

  const rawBooks = await BookModel.find({ grade: 12, is_published: true })
    .sort({ subject: 1, title: 1 })
    .lean();

  if (rawBooks.length === 0) {
    return <LiveBooksComingSoon grade={12} expectedSubjects={EXPECTED_SUBJECTS} />;
  }

  const books: GradeBook[] = rawBooks.map((b) => ({
    _id: String(b._id),
    slug: String(b.slug),
    cover_image: ((b as Record<string, unknown>).cover_image as string) ?? null,
    url_segment: URL_SEGMENTS[String(b.slug)],
    title: String(b.title),
    subject: String(b.subject),
    grade: Number(b.grade),
    chapters: b.chapters
      .filter((c) => c.is_published)
      .sort((a, b) => a.number - b.number)
      .map((c) => ({ number: c.number, title: c.title, slug: c.slug, description: c.description ?? null })),
  }));

  const bookIds = books.map((b) => b._id);
  const publishedChapterNums = books.flatMap((b) => b.chapters.map((c) => c.number));

  const rawPages =
    bookIds.length === 0
      ? []
      : await BookPageModel.find({
          book_id: { $in: bookIds },
          chapter_number: { $in: publishedChapterNums },
          published: true,
        })
          .select('book_id slug title chapter_number page_number reading_time_min content_types video_title')
          .sort({ chapter_number: 1, page_number: 1 })
          .lean();

  const pages: GradePage[] = rawPages.map((p) => ({
    book_id: String(p.book_id),
    slug: p.slug,
    title: p.title,
    chapter_number: p.chapter_number,
    page_number: p.page_number,
    reading_time_min: p.reading_time_min ?? null,
    content_types: (p as Record<string, unknown>).content_types as GradePage['content_types'] ?? null,
    video_title: (p as Record<string, unknown>).video_title as string ?? null,
  }));

  // Real artwork from inside the books — see features/books/lib/bookImagery.ts.
  // One page per chapter, bounded, behind this page's 24h ISR cache.
  const imagery = await loadChapterImagery(
    books.map((b) => ({ _id: b._id, chapterNumbers: b.chapters.map((c) => c.number) })),
  );

  for (const b of books) {
    // a cover set by hand on the book document always wins
    b.cover_image = b.cover_image ?? imagery.covers.get(b._id) ?? null;
    for (const c of b.chapters) {
      c.thumbnail = imagery.thumbnails.get(`${b._id}:${c.number}`) ?? null;
    }
  }

  return <GradeLandingPage grade={12} books={books} pages={pages} basePath="/class-12" />;
}
