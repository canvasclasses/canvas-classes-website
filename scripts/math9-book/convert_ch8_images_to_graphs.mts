/**
 * Class 9 Mathematics, Chapter 8 "Sequences and Progressions" — replace
 * never-generated static-image placeholders (src:'') with interactive
 * `math_graph` blocks, following the exact same pattern already shipped for
 * Chapter 1 (Coordinate Geometry) — see convert_ch1_images_to_graphs.mts.
 *
 * Every number below is copied verbatim from the chapter's own already-
 * published text (worked examples) — nothing invented:
 *   - p5 "visualising-an-ap": the tile-staircase AP is 1, 5, 9, 13, 17 →
 *     a = 1, d = 4 (page text: "First term a = 1; common difference d = 4").
 *   - p7 "sum-of-first-n-natural-numbers": the Gauss pairing-trick proof,
 *     no page-specific a/d/r — just the general Sₙ = n(n+1)/2 staircase.
 *   - p10 "visualising-a-gp": the bouncing-ball GP is 24, 18, 13.5, ... →
 *     a = 24, r = 0.75 (page text / Worked Example 10: "dropped from 24 feet
 *     ... rises to 3/4 of its previous height").
 *
 * Only the ORDER-6 / ORDER-5 diagram placeholder (the concept-specific plot
 * or proof figure) is swapped on each page — the order-0 cinematic banner
 * image is left untouched, matching the Chapter 1 precedent (banners are a
 * separate image-generation concern, not part of this conversion).
 *
 * Usage:
 *   npx tsx scripts/math9-book/convert_ch8_images_to_graphs.mts --dry     (default)
 *   npx tsx scripts/math9-book/convert_ch8_images_to_graphs.mts --commit
 */
import { v4 as uuidv4 } from 'uuid';
import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: '.env.local' });
const { withDb, savePage } = require('../lib/book-writer');

const COMMIT = process.argv.includes('--commit');
const uid = () => uuidv4();

// ── Helpers (mirrored from convert_ch1_images_to_graphs.mts) ───────────────
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

// Replace the block at a given order (an unbuilt image placeholder) with one
// or more new blocks, renumbering the whole array.
function replaceAtOrder(blocks, targetOrder, newBlocks) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((b) => b.order === targetOrder && b.type === 'image');
  if (idx === -1) throw new Error(`no image block at order ${targetOrder}`);
  return renumber([...sorted.slice(0, idx), ...newBlocks, ...sorted.slice(idx + 1)]);
}

// ── Per-page transforms ──────────────────────────────────────────────────

const PAGES = [
  {
    slug: 'visualising-an-ap',
    reason:
      'Replace the unbuilt order-6 plot image ("(1,1),(2,5),(3,9),(4,13),(5,17) on a straight line") ' +
      'with a sequence-pattern math_graph archetype seeded at the page\'s own a=1, d=4, terms=5 — ' +
      'draggable sliders let students see the same tile-staircase AP re-plot live instead of a static PNG. ' +
      'Bounds sized to the sequence\'s own extent (t_n up to 17) per MATH_BOOK_PAGE_WORKFLOW §3 — the -6..6 ' +
      'default would clip the plot.',
    transform: (blocks) => replaceAtOrder(blocks, 6, [
      mathGraph({
        title: 'AP as a straight line',
        caption: 'Tile-staircase AP: a = 1, d = 4. Drag the sliders — the points always fall on a straight line of slope d.',
        archetype: 'sequence-pattern',
        archetype_params: { kind: 'ap', a: 1, d: 4, terms: 5 },
        spec: { bounds: { xmin: -1, xmax: 7, ymin: -2, ymax: 20 }, keepSquare: false },
      }),
    ]),
  },
  {
    slug: 'sum-of-first-n-natural-numbers',
    reason:
      'Replace the unbuilt order-5 Gauss staircase-to-rectangle diagram with the sum-pairing-proof archetype ' +
      '(2·Sₙ = n(n+1) visual proof, n slider 2-12, seeded at n=6 matching the page\'s own 6×7 illustration). ' +
      'Bounds set to roughly n+1 on both axes per the task spec (rectangle proof, not a circle) — the default ' +
      '-6..6 board would clip a 6×7 rectangle.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'The Gauss staircase-to-rectangle proof',
        caption: 'Drag n — the ascending staircase (violet) and its mirrored descending copy (sky) always tile an n×(n+1) rectangle, so 2·Sₙ = n(n+1).',
        archetype: 'sum-pairing-proof',
        archetype_params: { n: 6 },
        spec: { bounds: { xmin: -1, xmax: 13, ymin: -1, ymax: 14 }, keepSquare: true },
      }),
    ]),
  },
  {
    slug: 'visualising-a-gp',
    reason:
      'Replace the unbuilt order-6 plot image ("Peak heights vs bounce number: a curve, not a line") with a ' +
      'sequence-pattern math_graph archetype (GP mode) seeded at the page\'s own bouncing-ball a=24, r=0.75, ' +
      'terms=6. Bounds widened to y=28 since the first term is 24 — the default -6..6 board would clip every point.',
    transform: (blocks) => replaceAtOrder(blocks, 6, [
      mathGraph({
        title: 'GP as an exponential curve',
        caption: 'Bouncing-ball peak heights: a = 24, r = 0.75. Unlike the AP, the points curve — dropping fast, then flattening toward 0.',
        archetype: 'sequence-pattern',
        archetype_params: { kind: 'gp', a: 24, r: 0.75, terms: 6 },
        spec: { bounds: { xmin: 0, xmax: 7, ymin: 0, ymax: 28 }, keepSquare: false },
      }),
    ]),
  },
];

(async () => {
  await withDb(async (db) => {
    const pages = db.collection('book_pages');
    const bookId = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';

    for (const cfg of PAGES) {
      const page = await pages.findOne({ book_id: bookId, chapter_number: 8, slug: cfg.slug });
      if (!page) { console.error(`✗ page not found: ${cfg.slug}`); continue; }

      let newBlocks;
      try {
        newBlocks = cfg.transform(page.blocks);
      } catch (e) {
        console.error(`✗ transform failed for ${cfg.slug}: ${e.message}`);
        continue;
      }

      const zr = ContentBlocksArraySchema.safeParse(newBlocks);
      if (!zr.success) {
        console.error(`✗ Zod FAILED for ${cfg.slug}:`, JSON.stringify(zr.error.issues.slice(0, 5), null, 2));
        continue;
      }

      const dry = await savePage(db, { slug: cfg.slug, pageId: page._id }, newBlocks, {
        author: 'script:convert_ch8_images_to_graphs',
        summary: `DRY RUN — ${cfg.reason}`,
        dryRun: true,
      });
      console.log(`\n=== ${cfg.slug} ===`);
      console.log('diff:', JSON.stringify(dry.diff));
      console.log('wouldBlock:', dry.wouldBlock);

      if (!COMMIT) continue;

      const res = await savePage(db, { slug: cfg.slug, pageId: page._id }, newBlocks, {
        author: 'script:convert_ch8_images_to_graphs',
        summary: cfg.reason,
        allowContentLoss: dry.wouldBlock,
        lossReason: dry.wouldBlock
          ? 'Founder-approved (session 2026-07-24): replacing a never-generated static-image placeholder (src:\'\', zero R2 assets) with an equivalent or richer interactive math_graph block, per explicit page-by-page plan presented and approved before any changes.'
          : '',
      });
      console.log(`✅ COMMITTED ${cfg.slug} — version ${res.version}`);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
