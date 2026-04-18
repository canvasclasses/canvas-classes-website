import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import BookReader from '@/components/books/reader/BookReader';
import type { Book, BookPage } from '@/types/books';

// ISR — cache the rendered RSC payload for each (bookSlug, pageSlug) tuple
// for 60 seconds. Auth is enforced by middleware on every request, so cache
// hits still pass through the gate. Admins editing drafts bypass this route
// entirely (they use the /crucible/admin editor), so stale draft content is
// not a concern here.
export const revalidate = 60;

const MAX_NAV_PAGES = 1000;

interface Props {
  params: Promise<{ bookSlug: string; pageSlug: string }>;
}

export default async function BookPageRoute({ params }: Props) {
  const { bookSlug, pageSlug } = await params;

  await connectToDatabase();

  const book = await BookModel.findOne({ slug: bookSlug }).lean<Book | null>();
  if (!book || !book.is_published) notFound();

  const bookIdStr = String(book._id);
  const publishedChapterNumbers = book.chapters
    .filter((c) => c.is_published)
    .map((c) => c.number);

  const [page, allPages] = await Promise.all([
    BookPageModel
      .findOne({ book_id: bookIdStr, slug: pageSlug })
      .lean<BookPage | null>(),
    BookPageModel
      .find({
        book_id: bookIdStr,
        chapter_number: { $in: publishedChapterNumbers },
        published: true,
      })
      .select('_id slug title chapter_number page_number published')
      .sort({ chapter_number: 1, page_number: 1 })
      .limit(MAX_NAV_PAGES)
      .lean(),
  ]);

  if (!page) notFound();

  const parentChapter = book.chapters.find((c) => c.number === page.chapter_number);
  if (!parentChapter || !parentChapter.is_published) notFound();
  if (!page.published) notFound();

  const currentIndex = allPages.findIndex((p) => p.slug === pageSlug);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  const chapterPages = allPages.filter((p) => p.chapter_number === page.chapter_number);

  return (
    <BookReader
      book={book}
      page={page}
      allPages={allPages}
      chapterPages={chapterPages}
      prevPageSlug={prevPage?.slug ?? null}
      nextPageSlug={nextPage?.slug ?? null}
      bookSlug={bookSlug}
    />
  );
}
