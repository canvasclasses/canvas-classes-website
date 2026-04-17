import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import GradeLandingPage, {
  type GradeBook,
  type GradePage,
} from '@/components/books/GradeLandingPage';

export const revalidate = 60;

export const metadata = {
  title: 'Class 9 — Live Books | Canvas Classes',
  description:
    'Interactive NCERT-aligned live books for Class 9 — Physics, Mathematics, and Science with simulations, quizzes, and worked examples.',
};

export default async function Class9Page() {
  await connectToDatabase();

  const rawBooks = await BookModel.find({ grade: 9, is_published: true })
    .sort({ subject: 1, title: 1 })
    .lean();

  if (rawBooks.length === 0) notFound();

  // Only published chapters per book
  const books: GradeBook[] = rawBooks.map((b) => ({
    _id: String(b._id),
    slug: String(b.slug),
    title: String(b.title),
    subject: String(b.subject),
    grade: Number(b.grade),
    chapters: b.chapters
      .filter((c) => c.is_published)
      .sort((a, b) => a.number - b.number)
      .map((c) => ({
        number: c.number,
        title: c.title,
        slug: c.slug,
      })),
  }));

  // Fetch published pages for all published chapters across all books
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
          .select('book_id slug title chapter_number page_number reading_time_min content_types')
          .sort({ chapter_number: 1, page_number: 1 })
          .lean();

  const pages: GradePage[] = rawPages.map((p) => ({
    book_id: String(p.book_id),
    slug: p.slug,
    title: p.title,
    chapter_number: p.chapter_number,
    page_number: p.page_number,
    reading_time_min: p.reading_time_min ?? null,
    content_types:
      (p as Record<string, unknown>).content_types as GradePage['content_types'] ?? null,
  }));

  return <GradeLandingPage grade={9} books={books} pages={pages} basePath="/class-9" />;
}
