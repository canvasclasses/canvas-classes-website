import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import BookReader from '@/components/books/reader/BookReader';

interface Props {
  params: Promise<{ bookSlug: string; pageSlug: string }>;
}

export default async function BookPageRoute({ params }: Props) {
  const { bookSlug, pageSlug } = await params;

  await connectToDatabase();

  const [book, page] = await Promise.all([
    BookModel.findOne({ slug: bookSlug }).lean(),
    BookPageModel.findOne({ slug: pageSlug }).lean(),
  ]);

  if (!book || !page) notFound();

  // Get all pages in this book sorted by chapter + page number
  const allPages = await BookPageModel
    .find({ book_id: String(book._id) })
    .select('_id slug title chapter_number page_number published')
    .sort({ chapter_number: 1, page_number: 1 })
    .lean();

  const currentIndex = allPages.findIndex(p => p.slug === pageSlug);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  // Chapter pages for progress bar
  const chapterPages = allPages.filter(p => p.chapter_number === page.chapter_number);

  return (
    <BookReader
      book={JSON.parse(JSON.stringify(book))}
      page={JSON.parse(JSON.stringify(page))}
      allPages={JSON.parse(JSON.stringify(allPages))}
      chapterPages={JSON.parse(JSON.stringify(chapterPages))}
      prevPageSlug={prevPage?.slug ?? null}
      nextPageSlug={nextPage?.slug ?? null}
      bookSlug={bookSlug}
    />
  );
}
