import { notFound } from 'next/navigation';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import BookPageModel from '@canvas/data/models/BookPage';
import { InteractiveImageBlock } from '@canvas/data/types/books';
import BioDeckClient, { type DeckSprint } from '@/features/books/deck/BioDeckClient';

// Public, cacheable — the set of Label Sprints changes only when an admin
// publishes/edits a page's interactive_image blocks. Per-student progress is
// client-side (localStorage), so nothing here is per-user.
export const revalidate = 3600;

// A Label Sprint needs an uploaded diagram and enough labels to be a real test.
const MIN_HOTSPOTS = 3;

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export default async function BookDeckPage({ params }: Props) {
  const { bookSlug } = await params;
  await connectToDatabase();

  const book = await BookModel.findOne({ slug: bookSlug }).lean();
  if (!book || !book.is_published) notFound();

  const publishedChapterNumbers = book.chapters
    .filter((c) => c.is_published)
    .map((c) => c.number);

  const rawPages =
    publishedChapterNumbers.length === 0
      ? []
      : await BookPageModel.find({
          book_id: String(book._id),
          chapter_number: { $in: publishedChapterNumbers },
          published: true,
        })
          .select('slug title chapter_number page_number blocks')
          .sort({ chapter_number: 1, page_number: 1 })
          .lean();

  // Every playable interactive_image (uploaded + ≥3 hotspots) becomes a sprint.
  const sprints: DeckSprint[] = [];
  for (const page of rawPages) {
    const blocks = ((page as Record<string, unknown>).blocks ?? []) as Array<Record<string, unknown>>;
    blocks.forEach((raw, idx) => {
      if (raw?.type !== 'interactive_image') return;
      // Round-trip strips any Mongoose/BSON internals from the Mixed subdoc.
      const block = JSON.parse(JSON.stringify(raw)) as InteractiveImageBlock;
      if (!block.src || (block.hotspots?.length ?? 0) < MIN_HOTSPOTS) return;
      sprints.push({
        id: block.id || `${page.slug}#${idx}`,
        block,
        pageTitle: String(page.title),
        pageSlug: String(page.slug),
      });
    });
  }

  return (
    <main className="min-h-screen bg-[var(--book-bg)] text-white">
      <BioDeckClient
        bookId={String(book.slug)}
        bookTitle={String(book.title)}
        sprints={sprints}
      />
    </main>
  );
}
