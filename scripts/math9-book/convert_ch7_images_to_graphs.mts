/**
 * Class 9 Mathematics, Chapter 7 "Probability" — add ONE interactive
 * `math_graph` block (the new `trial-convergence` archetype) to the
 * "experimental-vs-theoretical" page.
 *
 * Scope note: the rest of this chapter (frequency tables, Venn/set diagrams,
 * tree diagrams) is correctly NOT graph territory and is untouched — this
 * script only ever loads and transforms the one page below.
 *
 * This is a PURE ADDITION. The page's order:0 hero banner already describes
 * this exact convergence graph (relative frequency of heads jumping wildly
 * early, settling into a band around 0.5) as an atmospheric cover image —
 * that banner is a cover-image design decision and is NOT touched here. The
 * new block gives students the same idea as something they can actually
 * drag and explore, placed in the page body right after the formal
 * introduction of the Law of Large Numbers (order:3 heading + order:4 text),
 * before the Gambler's Fallacy warning (order:5).
 *
 * Usage:
 *   npx tsx scripts/math9-book/convert_ch7_images_to_graphs.mts --dry     (default)
 *   npx tsx scripts/math9-book/convert_ch7_images_to_graphs.mts --commit
 */
import { v4 as uuidv4 } from 'uuid';
import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: '.env.local' });
const { withDb, savePage } = require('../lib/book-writer');

const COMMIT = process.argv.includes('--commit');
const uid = () => uuidv4();

// ── Helpers (mirrors convert_ch1_images_to_graphs.mts) ─────────────────────
function mathGraph({ title, caption, archetype, archetype_params, spec }) {
  return {
    id: uid(),
    type: 'math_graph',
    ...(title ? { title } : {}),
    ...(caption ? { caption } : {}),
    ...(archetype ? { archetype, archetype_params } : {}),
    ...(spec ? { spec } : {}),
  };
}

function renumber(blocks) {
  return blocks.map((b, i) => ({ ...b, order: i }));
}

// Pure addition: insert new blocks right after the block whose heading text
// matches `afterHeadingText` (exact match).
function insertAfterHeading(blocks, afterHeadingText, newBlocks) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((b) => b.type === 'heading' && b.text === afterHeadingText);
  if (idx === -1) throw new Error(`heading "${afterHeadingText}" not found`);
  // Insert after the heading's own intro text block(s) — walk forward past
  // consecutive 'text' blocks so the graph lands after the setup prose, not
  // wedged between the heading and its first sentence.
  let insertAt = idx + 1;
  while (insertAt < sorted.length && sorted[insertAt].type === 'text') insertAt++;
  return renumber([...sorted.slice(0, insertAt), ...newBlocks, ...sorted.slice(insertAt)]);
}

// ── Per-page transform ───────────────────────────────────────────────────

const PAGE = {
  slug: 'experimental-vs-theoretical',
  reason:
    "Pure addition: insert the trial-convergence math_graph archetype right after the formal Law of Large Numbers intro (heading 'Two routes, one destination' + its formula text) and before the Gambler's Fallacy warning. Seeded at p=0.5 to match the page's own running fair-coin example. Custom bounds (x: 0-200, y: 0-1) since trials run up to 200 and relative frequency is bounded in [0,1] — keepSquare:false because the two axes have wildly different natural ranges (per MATH_BOOK_PAGE_WORKFLOW.md §5). Does NOT touch the order:0 hero banner, which already covers the same idea as a static cover image.",
  transform: (blocks) =>
    insertAfterHeading(blocks, 'Two routes, one destination', [
      mathGraph({
        title: 'Watch It Converge',
        caption:
          'A simulated fair coin (p = 0.5). Drag the trials slider — the relative-frequency line jumps around early, then settles into a narrow band around the theoretical probability (dashed).',
        archetype: 'trial-convergence',
        archetype_params: { p: 0.5, trials: 10 },
        spec: {
          bounds: { xmin: 0, xmax: 200, ymin: 0, ymax: 1 },
          keepSquare: false,
        },
      }),
    ]),
};

(async () => {
  await withDb(async (db) => {
    const pages = db.collection('book_pages');
    const bookId = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';

    const page = await pages.findOne({ book_id: bookId, chapter_number: 7, slug: PAGE.slug });
    if (!page) {
      console.error(`✗ page not found: ${PAGE.slug}`);
      return;
    }

    let newBlocks;
    try {
      newBlocks = PAGE.transform(page.blocks);
    } catch (e) {
      console.error(`✗ transform failed for ${PAGE.slug}: ${e.message}`);
      return;
    }

    const zr = ContentBlocksArraySchema.safeParse(newBlocks);
    if (!zr.success) {
      console.error(`✗ Zod FAILED for ${PAGE.slug}:`, JSON.stringify(zr.error.issues.slice(0, 5), null, 2));
      return;
    }

    const dry = await savePage(db, { slug: PAGE.slug, pageId: page._id }, newBlocks, {
      author: 'script:convert_ch7_images_to_graphs',
      summary: `DRY RUN — ${PAGE.reason}`,
      dryRun: true,
    });
    console.log(`\n=== ${PAGE.slug} ===`);
    console.log('diff:', JSON.stringify(dry.diff));
    console.log('wouldBlock:', dry.wouldBlock);

    if (!COMMIT) return;

    const res = await savePage(db, { slug: PAGE.slug, pageId: page._id }, newBlocks, {
      author: 'script:convert_ch7_images_to_graphs',
      summary: PAGE.reason,
      allowContentLoss: dry.wouldBlock,
      lossReason: dry.wouldBlock
        ? 'This script is a pure addition (insertAfterHeading) and should never trigger the content-loss guard. If it did, stop and investigate before committing.'
        : '',
    });
    console.log(`✅ COMMITTED ${PAGE.slug} — version ${res.version}`);
  });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
