import { notFound } from 'next/navigation';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import BookReader from '@/features/books/components/reader/BookReader';
import type { ChapterJourney } from '@canvas/data/types/books';

// 24h ISR — high-cardinality, bot-crawled book pages; a 1h window drove excess
// ISR writes (2026-06). Published edits need a revalidate-on-save to propagate
// faster (CLAUDE.md §10.5).
export const revalidate = 86400;

interface Props {
  params: Promise<{ pageSlug: string }>;
}

const BOOK_SLUG = 'ncert-simplified';
const BASE_PATH = '/class-11/chemistry';

const CHECK_TYPES = new Set(['inline_quiz', 'reasoning_prompt', 'chapter_practice', 'apply_express']);

// Per-page badge counts for the chapter-opener journey (§15.1). Recurses into
// `section` columns; estimates reading time from word count when not stored.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function countPage(blocks: any[], storedMin?: number) {
  let sims = 0, workedExamples = 0, checks = 0, words = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walk = (bs: any[]) => {
    for (const b of bs || []) {
      if (b.type === 'simulation') sims++;
      else if (b.type === 'worked_example') workedExamples++;
      else if (CHECK_TYPES.has(b.type)) checks++;
      else if (b.type === 'section' && Array.isArray(b.columns)) b.columns.forEach(walk);
      if (typeof b.markdown === 'string') words += b.markdown.split(/\s+/).length;
      if (typeof b.text === 'string') words += b.text.split(/\s+/).length;
    }
  };
  walk(blocks);
  const readingTimeMin = storedMin ?? Math.max(2, Math.round(words / 180));
  return { sims, workedExamples, checks, readingTimeMin };
}

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
    .select('_id slug title chapter_number page_number published page_type')
    .sort({ chapter_number: 1, page_number: 1 })
    .lean();

  const currentIndex = allPages.findIndex((p) => p.slug === pageSlug);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  const chapterPages = allPages.filter((p) => p.chapter_number === page.chapter_number);

  // For a chapter opener, derive the journey from the chapter's LESSON pages.
  let chapterJourney: ChapterJourney | null = null;
  if (page.page_type === 'chapter_opener') {
    const lessonPages = await BookPageModel
      .find({
        book_id: String(book._id),
        chapter_number: page.chapter_number,
        published: true,
        page_type: { $ne: 'chapter_opener' },
      })
      .select('slug title subtitle page_number blocks reading_time_min')
      .sort({ page_number: 1 })
      .lean();

    const entries = lessonPages.map((p) => {
      const c = countPage(p.blocks as unknown[] as never[], p.reading_time_min);
      return { slug: p.slug, title: p.title, subtitle: p.subtitle, ...c };
    });
    chapterJourney = {
      entries,
      totals: {
        pages: entries.length,
        sims: entries.reduce((s, e) => s + e.sims, 0),
        workedExamples: entries.reduce((s, e) => s + e.workedExamples, 0),
        checks: entries.reduce((s, e) => s + e.checks, 0),
        readingTimeMin: entries.reduce((s, e) => s + e.readingTimeMin, 0),
      },
      firstPageSlug: entries[0]?.slug ?? null,
    };
  }

  return (
    <BookReader
      book={JSON.parse(JSON.stringify(book))}
      page={JSON.parse(JSON.stringify(page))}
      allPages={JSON.parse(JSON.stringify(allPages))}
      chapterPages={JSON.parse(JSON.stringify(chapterPages))}
      chapterJourney={chapterJourney}
      prevPageSlug={prevPage?.slug ?? null}
      nextPageSlug={nextPage?.slug ?? null}
      bookSlug={BOOK_SLUG}
      basePath={BASE_PATH}
    />
  );
}
