import BookPageModel from '@canvas/data/models/BookPage';

/**
 * Cover art + chapter thumbnails for a grade landing page.
 *
 * Live Books hold hundreds of published images in R2 that no landing surface
 * was using. This pulls one out of the start of each chapter so the shelf and
 * the chapter rows show real artwork instead of coloured rectangles.
 *
 * Two traps this has already hit, both fixed here:
 *
 *  1. Page numbering is BOOK-WIDE, not per-chapter (Class 9 Science chapter 2
 *     starts at page 7, chapter 3 at page 16, and chapter 1 starts at -1), and
 *     openers are not `page_number === 1`. So "first page" must mean the lowest
 *     page_number *within that chapter*, never a hardcoded number.
 *
 *  2. Most `chapter_opener` pages carry an `image` block with NO url in it —
 *     they are title cards still awaiting artwork. Stopping at the opener
 *     therefore returned nothing for most chapters (Class 9 English and Science
 *     showed empty thumbnails throughout). We now walk the first few pages of
 *     the chapter and take the first that actually yields an image, so an empty
 *     opener falls through instead of blanking the row. Chemistry's opener does
 *     have real art, and still wins, because the opener is tried first.
 *
 * Cost control (CLAUDE.md §8.6 / §10): `blocks` is a fat Mixed field, so the
 * first query reads only page numbers, and the second reads `blocks` for a
 * bounded handful of candidates per chapter. Both are capped, and the whole
 * thing sits behind the landing page's 24h ISR cache.
 */

/** Matches an http(s) image URL anywhere in a serialised block tree. */
const IMG_URL = /"(?:src|url|image_url|image)"\s*:\s*"(https?:\/\/[^"]+?\.(?:png|jpe?g|webp|avif))"/i;

function firstImageIn(blocks: unknown): string | null {
  if (!blocks) return null;
  const match = IMG_URL.exec(JSON.stringify(blocks));
  return match ? match[1] : null;
}

export interface ChapterImagery {
  /** keyed `${bookId}:${chapterNumber}` */
  thumbnails: Map<string, string>;
  /** keyed bookId — the first chapter that actually has an image */
  covers: Map<string, string>;
}

/**
/** How many pages deep to look before giving up on a chapter's thumbnail. */
const CANDIDATES_PER_CHAPTER = 3;

/**
 * @param books   published books, each with the chapter numbers to look at
 * @param maxDocs hard cap on candidate pages whose blocks are read (§8.6)
 */
export async function loadChapterImagery(
  books: { _id: string; chapterNumbers: number[] }[],
  maxDocs = 400,
): Promise<ChapterImagery> {
  const thumbnails = new Map<string, string>();
  const covers = new Map<string, string>();
  if (books.length === 0) return { thumbnails, covers };

  const scope = books.map(b => ({
    book_id: b._id,
    chapter_number: { $in: b.chapterNumbers },
  }));

  // 1. Cheap pass: page numbers only, so we can order each chapter's pages
  //    without pulling `blocks` for the whole book.
  const index = await BookPageModel.find({ $or: scope, published: true })
    .select('_id book_id chapter_number page_number')
    .sort({ chapter_number: 1, page_number: 1 })
    .limit(4000)
    .lean();

  // The first few pages of each chapter, in order — not just the opener,
  // because openers are frequently image-less title cards.
  const candidateIds: string[] = [];
  const pageKey = new Map<string, string>();   // pageId -> `${bookId}:${chapter}`
  const pageRank = new Map<string, number>();  // pageId -> position in chapter
  const takenPerChapter = new Map<string, number>();

  for (const p of index) {
    const key = `${String(p.book_id)}:${p.chapter_number}`;
    const taken = takenPerChapter.get(key) ?? 0;
    if (taken >= CANDIDATES_PER_CHAPTER) continue;
    takenPerChapter.set(key, taken + 1);

    const id = String(p._id);
    candidateIds.push(id);
    pageKey.set(id, key);
    pageRank.set(id, taken);
    if (candidateIds.length >= maxDocs) break;
  }

  if (candidateIds.length === 0) return { thumbnails, covers };

  // 2. Blocks for those candidates only.
  const pages = await BookPageModel.find({ _id: { $in: candidateIds } })
    .select('_id blocks')
    .lean();

  // Keep the EARLIEST page that actually produced an image, since Mongo does
  // not guarantee the $in result order matches candidateIds.
  const bestRank = new Map<string, number>();

  for (const page of pages) {
    const id = String(page._id);
    const key = pageKey.get(id);
    if (!key) continue;

    const url = firstImageIn((page as Record<string, unknown>).blocks);
    if (!url) continue;

    const rank = pageRank.get(id) ?? Number.MAX_SAFE_INTEGER;
    const incumbent = bestRank.get(key);
    if (incumbent !== undefined && incumbent <= rank) continue;

    bestRank.set(key, rank);
    thumbnails.set(key, url);
  }

  // Cover art = the lowest-numbered chapter that actually has an image, so a
  // book whose first chapter is text-only still gets a cover.
  for (const b of books) {
    for (const n of [...b.chapterNumbers].sort((x, y) => x - y)) {
      const url = thumbnails.get(`${b._id}:${n}`);
      if (url) { covers.set(b._id, url); break; }
    }
  }

  return { thumbnails, covers };
}
