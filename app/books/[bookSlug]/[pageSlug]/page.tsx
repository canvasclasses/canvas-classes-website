import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import BookReader from '@/components/books/reader/BookReader';

// ISR — cache the rendered RSC payload for each (bookSlug, pageSlug) tuple
// for 60 seconds. Auth is enforced by middleware on every request, so cache
// hits still pass through the gate. Admins editing drafts bypass this route
// entirely (they use the /crucible/admin editor), so stale draft content is
// not a concern here.
export const revalidate = 60;

interface Props {
  params: Promise<{ bookSlug: string; pageSlug: string }>;
}

export default async function BookPageRoute({ params }: Props) {
  const { bookSlug, pageSlug } = await params;

  await connectToDatabase();

  const book = await BookModel.findOne({ slug: bookSlug }).lean();
  if (!book) notFound();

  // Book-level gate
  if (!book.is_published) notFound();

  // Scope page lookup to this book so two books can't collide on slug.
  const page = await BookPageModel
    .findOne({ book_id: String(book._id), slug: pageSlug })
    .lean();
  if (!page) notFound();

  // Chapter-level gate — must exist AND be published.
  const parentChapter = book.chapters.find((c) => c.number === page.chapter_number);
  if (!parentChapter || !parentChapter.is_published) notFound();

  // Page-level gate
  if (!page.published) notFound();

  // Nav / progress bar data — only walk through pages the student is
  // allowed to see (published chapters + published pages).
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
