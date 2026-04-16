import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import BookReader from '@/components/books/reader/BookReader';

export const revalidate = 60;

interface Props {
  params: Promise<{ pageSlug: string }>;
}

const BOOK_SLUG = 'ncert-simplified';
const BASE_PATH = '/class-11/chemistry';

export default async function Class11ChemistryPageRoute({ params }: Props) {
  const { pageSlug } = await params;

  await connectToDatabase();

  const book = await BookModel.findOne({ slug: BOOK_SLUG }).lean();
  if (!book) notFound();
  if (!book.is_published) notFound();

  const page = await BookPageModel
    .findOne({ book_id: String(book._id), slug: pageSlug })
    .lean();
  if (!page) notFound();

  const parentChapter = book.chapters.find((c) => c.number === page.chapter_number);
  if (!parentChapter || !parentChapter.is_published) notFound();
  if (!page.published) notFound();

  const publishedChapterNumbers = book.chapters
    .filter((c) => c.is_published)
    .map((c) => c.number);

  const allPages = await BookPageModel
    .find({
      book_id: String(book._id),
      chapter_number: { $in: publishedChapterNumbers },
      published: true,
    })
    .select('_id slug title chapter_number page_number published')
    .sort({ chapter_number: 1, page_number: 1 })
    .lean();

  const currentIndex = allPages.findIndex((p) => p.slug === pageSlug);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  const chapterPages = allPages.filter((p) => p.chapter_number === page.chapter_number);

  return (
    <BookReader
      book={JSON.parse(JSON.stringify(book))}
      page={JSON.parse(JSON.stringify(page))}
      allPages={JSON.parse(JSON.stringify(allPages))}
      chapterPages={JSON.parse(JSON.stringify(chapterPages))}
      prevPageSlug={prevPage?.slug ?? null}
      nextPageSlug={nextPage?.slug ?? null}
      bookSlug={BOOK_SLUG}
      basePath={BASE_PATH}
    />
  );
}
