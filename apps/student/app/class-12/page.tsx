import type { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import GradeLandingPage, {
  type GradeBook,
  type GradePage,
} from '@/components/books/GradeLandingPage';
import LiveBooksComingSoon from '@/components/books/LiveBooksComingSoon';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Class 12 Live Books — NCERT Interactive Lessons | Canvas Classes',
  description:
    'Class 12 NCERT live books with interactive lessons, simulations, quizzes, and Hinglish mode. Coming soon on Canvas Classes.',
};

const EXPECTED_SUBJECTS = ['Chemistry', 'Physics', 'Mathematics', 'Biology'];

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
    title: String(b.title),
    subject: String(b.subject),
    grade: Number(b.grade),
    chapters: b.chapters
      .filter((c) => c.is_published)
      .sort((a, b) => a.number - b.number)
      .map((c) => ({ number: c.number, title: c.title, slug: c.slug })),
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

  return <GradeLandingPage grade={12} books={books} pages={pages} basePath="/class-12" />;
}
