import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import BookReader from '@/features/books/components/reader/BookReader';
import PracticeHub from '@/features/books/components/practice/PracticeHub';
import type { Book, BookPage } from '@canvas/data/types/books';
import { buildBookPageMetadata, buildBookPageJsonLd } from '@/features/books/lib/bookPageSeo';

// CLAUDE.md §10.5: editorial book content → 24h. `revalidate = 60` is forbidden
// by §10.2 — these DB-backed pages are sitemap-listed and bot-crawled.
export const revalidate = 86400;

// Bounded per CLAUDE.md §8.6.
const MAX_NAV_PAGES = 1000;

/**
 * Books that live at a PINNED url segment instead of their slug (Chemistry is
 * at /class-11/chemistry). Serving them here too would publish the same pages
 * at two URLs, so this route 404s them — the pinned static route is canonical.
 * Must stay in sync with URL_SEGMENTS in ../../page.tsx.
 */
const PINNED_ELSEWHERE = new Set(['ncert-simplified', 'ncert-simplified-12']);

interface Props {
  params: Promise<{ bookSlug: string; pageSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug, pageSlug } = await params;
  if (PINNED_ELSEWHERE.has(bookSlug)) return {};
  await connectToDatabase();

  const book = await BookModel
    .findOne({ slug: bookSlug, grade: 11, is_published: true })
    .lean<Book | null>();
  if (!book) return {};

  const page = await BookPageModel
    .findOne({ book_id: String(book._id), slug: pageSlug, published: true })
    .lean<BookPage | null>();
  if (!page) return {};

  return buildBookPageMetadata({ book, page, basePath: '/class-11' });
}

export default async function Class11PageRoute({ params }: Props) {
  const { bookSlug, pageSlug } = await params;
  if (PINNED_ELSEWHERE.has(bookSlug)) notFound();

  await connectToDatabase();

  const book = await BookModel.findOne({ slug: bookSlug, grade: 11 }).lean<Book | null>();
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

  const basePath = `/class-11/${bookSlug}`;

  if (page.tags?.includes('kaveri_section:practice')) {
    return <PracticeHub book={book} page={page} bookSlug={bookSlug} basePath={basePath} />;
  }

  const jsonLd = buildBookPageJsonLd({ book, page, basePath: '/class-11' });

  return (
    <>
      <script
        type="application/ld+json"
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
