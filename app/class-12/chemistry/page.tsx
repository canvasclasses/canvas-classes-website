import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import BookTableOfContents, {
  type ToCBook,
  type ToCChapter,
  type ToCPage,
} from '@/components/books/BookTableOfContents';
import LiveBooksComingSoon from '@/components/books/LiveBooksComingSoon';

export const revalidate = 60;

export const metadata = {
  title: 'Class 12 Chemistry — NCERT Simplified | Canvas Classes',
  description:
    'Master Class 12 Chemistry with NCERT Simplified — interactive lessons, inline quizzes, simulations, and worked examples for JEE & NEET.',
};

const BOOK_SLUG = 'ncert-simplified-12';
const BASE_PATH = '/class-12/chemistry';

export default async function Class12ChemistryPage() {
  await connectToDatabase();

  const book = await BookModel.findOne({ slug: BOOK_SLUG }).lean();
  if (!book || !book.is_published) {
    return <LiveBooksComingSoon grade={12} expectedSubjects={['Chemistry']} />;
  }

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
          .select('slug title chapter_number page_number reading_time_min content_types video_title')
          .sort({ chapter_number: 1, page_number: 1 })
          .lean();

  const pages: ToCPage[] = rawPages.map((p) => ({
    slug: p.slug,
    title: p.title,
    chapter_number: p.chapter_number,
    page_number: p.page_number,
    reading_time_min: p.reading_time_min ?? null,
    content_types: (p as Record<string, unknown>).content_types as ToCPage['content_types'] ?? null,
    video_title: (p as Record<string, unknown>).video_title as string ?? null,
  }));

  const firstPage = pages[0];

  const chapters: ToCChapter[] = publishedChapters.map((ch) => ({
    number: ch.number,
    title: ch.title,
    slug: ch.slug,
    pages: pages.filter((p) => p.chapter_number === ch.number),
  }));

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
      basePath={BASE_PATH}
    />
  );
}
