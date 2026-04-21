import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import BookReader from '@/components/books/reader/BookReader';
import type { Book, BookPage } from '@/types/books';
import { buildBookPageMetadata, buildBookPageJsonLd } from '@/lib/bookPageSeo';

export const revalidate = 60;

// Hard upper bound on pages fetched for nav/ToC — no real book comes close
// to this, but bounding the query matches CLAUDE.md §8.6.
const MAX_NAV_PAGES = 1000;

interface Props {
  params: Promise<{ bookSlug: string; pageSlug: string }>;
}

/**
 * Per-page SEO metadata.
 *
 * This is the single biggest SEO lever for Class 9 books — without this,
 * every chapter page renders with the generic site title and Google has
 * nothing page-specific to rank. Runs on every request but benefits from
 * the same ISR cache as the page body (revalidate = 60).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug, pageSlug } = await params;
  await connectToDatabase();

  const book = await BookModel
    .findOne({ slug: bookSlug, grade: 9, is_published: true })
    .lean<Book | null>();
  if (!book) return {};

  const page = await BookPageModel
    .findOne({ book_id: String(book._id), slug: pageSlug, published: true })
    .lean<BookPage | null>();
  if (!page) return {};

  return buildBookPageMetadata({ book, page, basePath: '/class-9' });
}

export default async function Class9PageRoute({ params }: Props) {
  const { bookSlug, pageSlug } = await params;

  await connectToDatabase();

  const book = await BookModel.findOne({ slug: bookSlug, grade: 9 }).lean<Book | null>();
  if (!book || !book.is_published) notFound();

  // Page + nav can run in parallel — nav only needs the book._id we already have.
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

  // basePath = /class-9/class9-science → back button + nav links stay under /class-9/
  const basePath = `/class-9/${bookSlug}`;

  // Schema.org LearningResource graph — lets Google understand this as a
  // Class 9 NCERT lesson (not just a generic article) so it can surface
  // in education-specific rich results.
  const jsonLd = buildBookPageJsonLd({ book, page, basePath: '/class-9' });

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookReader
        book={book}
        page={page}
        allPages={allPages}
        chapterPages={chapterPages}
        prevPageSlug={prevPage?.slug ?? null}
        nextPageSlug={nextPage?.slug ?? null}
        bookSlug={bookSlug}
        basePath={basePath}
      />
    </>
  );
}
