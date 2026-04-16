import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import BookTableOfContents, {
  type ToCBook,
  type ToCChapter,
  type ToCPage,
} from '@/components/books/BookTableOfContents';

// ISR — the ToC changes only when an admin publishes a new chapter / page,
// so a 60s revalidate window is safe and keeps Mongo off the hot path.
export const revalidate = 60;

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export default async function BookLandingPage({ params }: Props) {
  const { bookSlug } = await params;
  await connectToDatabase();

  const book = await BookModel.findOne({ slug: bookSlug }).lean();
  if (!book) notFound();

  // Student-facing view — hide the whole book if it's not live yet.
  if (!book.is_published) notFound();

  // Only published chapters are visible to students.
  const publishedChapters = book.chapters
    .filter((c) => c.is_published)
    .sort((a, b) => a.number - b.number);

  const publishedChapterNumbers = publishedChapters.map((c) => c.number);

  const rawPages =
    publishedChapterNumbers.length === 0
      ? []
      : await BookPageModel.find({
          book_id: String(book._id),
          chapter_number: { $in: publishedChapterNumbers },
          published: true,
        })
          .select('slug title chapter_number page_number reading_time_min content_types')
          .sort({ chapter_number: 1, page_number: 1 })
          .lean();

  // Serialise pages (strip Mongoose internals).
  const pages: ToCPage[] = rawPages.map((p) => ({
    slug: p.slug,
    title: p.title,
    chapter_number: p.chapter_number,
    page_number: p.page_number,
    reading_time_min: p.reading_time_min ?? null,
    content_types: (p as Record<string, unknown>).content_types as ToCPage['content_types'] ?? null,
  }));

  const firstPage = pages[0];

  // Group pages by chapter.
  const chapters: ToCChapter[] = publishedChapters.map((ch) => ({
    number: ch.number,
    title: ch.title,
    slug: ch.slug,
    pages: pages.filter((p) => p.chapter_number === ch.number),
  }));

  // Serialise book metadata (only what the client component needs).
  const bookData: ToCBook = {
    slug: String(book.slug),
    title: String(book.title),
    subject: String(book.subject),
    grade: Number(book.grade),
  };

  return (
    <BookTableOfContents
      book={bookData}
      chapters={chapters}
      firstPageSlug={firstPage?.slug}
    />
  );
}
