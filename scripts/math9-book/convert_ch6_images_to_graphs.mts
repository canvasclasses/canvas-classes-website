/**
 * Class 9 Mathematics, Chapter 6 "Perimeter and Area" — replace 4 never-
 * generated static-image placeholders (src:'') with interactive `math_graph`
 * archetype blocks, per the founder's request: these 4 pages are all
 * shape-construction PROOFS (cut-and-slide, triangle-pair, slice-and-
 * rearrange, sector sweep) — exactly the kind of thing a draggable slider
 * demonstrates better than a static diagram. The rest of the chapter
 * (shape/formula diagrams on pages 1,2,4,5,8,9,10,13) is correctly left
 * alone — those are not graph territory and are NOT touched by this script.
 *
 * Every numeric param below is copied verbatim from the page's own already-
 * published text (worked examples) where the page states specific numbers;
 * page 11's r/n and page 12's r are the founder-specified defaults from the
 * approved plan. Nothing invented beyond that.
 *
 * All 4 archetypes are axis-free by design (shape-construction proofs, not
 * coordinate-plotted content) — spec.showAxes/showGrid are false on every
 * block, per MATH_LIVEBOOK_PLAN convention for archetype-mode mensuration
 * pages.
 *
 * Usage:
 *   npx tsx scripts/math9-book/convert_ch6_images_to_graphs.mts --dry     (default)
 *   npx tsx scripts/math9-book/convert_ch6_images_to_graphs.mts --commit
 */
import { v4 as uuidv4 } from 'uuid';
import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: '.env.local' });
const { withDb, savePage } = require('../lib/book-writer');

const COMMIT = process.argv.includes('--commit');
const uid = () => uuidv4();

// ── Helpers ──────────────────────────────────────────────────────────────
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
// Every page has TWO image placeholders: order:0 is the ultra-wide cinematic
// chapter/section banner (untouched — same as Chapter 1's convention of
// leaving the banner alone), order:5 is the technical diagram that actually
// illustrates the construction being taught. Only order:5 is replaced.

const PAGES = [
  {
    slug: 'area-of-a-parallelogram',
    reason: 'Replace the unbuilt cut-and-slide diagram with the parallelogram-to-rectangle archetype. b=12, h=5 are the page\'s own worked-example numbers (order:7, "Area with the right height"); s=4.15 is derived from the same example\'s 6.5 cm slant side via s = √(6.5² − 5²), so the drawn shape matches the stated slant exactly.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Parallelogram → Rectangle Explorer',
        caption: 'Drag the slider from 0 to 1 — the cut-off end triangle slides across into the gap. Base 12 cm and height 5 cm never change, so the area stays 12 × 5 = 60 cm² throughout.',
        archetype: 'parallelogram-to-rectangle',
        archetype_params: { b: 12, h: 5, s: 4.15 },
        spec: {
          showAxes: false, showGrid: false, keepSquare: true,
          bounds: { xmin: -2, xmax: 18, ymin: -3, ymax: 9 },
        },
      }),
    ]),
  },
  {
    slug: 'area-of-a-triangle',
    reason: 'Replace the unbuilt congruent-triangle-pair diagram with the triangle-pair-to-parallelogram archetype. b=10, h=6 are the page\'s own worked-example numbers (order:9, End-of-chapter Q9, base BC=10 cm / height=6 cm); c (apex x-offset) has no stated value on the page, so it is scaled proportionally from the archetype\'s own default ratio (c/b = 1.5/5 = 0.3 → c = 3) to keep a well-formed, non-degenerate triangle.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Triangle Pair → Parallelogram Explorer',
        caption: 'Drag the slider — a congruent copy of the triangle (base 10 cm, height 6 cm) slides into place beside it, completing a parallelogram of double the area. Each triangle is exactly half: ½ × 10 × 6 = 30 cm².',
        archetype: 'triangle-pair-to-parallelogram',
        archetype_params: { b: 10, h: 6, c: 3 },
        spec: {
          showAxes: false, showGrid: false, keepSquare: true,
          bounds: { xmin: -2, xmax: 15, ymin: -2, ymax: 8 },
        },
      }),
    ]),
  },
  {
    slug: 'area-of-a-circle',
    reason: 'Replace the unbuilt slice-and-rearrange diagram with the circle-area-slice-rearrange archetype — the chapter\'s highest-value build. r=3, n=8 per the founder-approved plan (the page\'s own worked example uses r=7, but 3/8 gives a clearer starting wedge picture at the default zoom; the wedge count is fully draggable 4–24 regardless).',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Circle Area — Slice & Rearrange',
        caption: 'Drag the wedge-count slider n from 4 up to 24 — the circle slices into more, thinner wedges, and the strip below straightens toward a rectangle of base πr and height r. Watch the strip become a rectangle as n grows.',
        archetype: 'circle-area-slice-rearrange',
        archetype_params: { r: 3, n: 8 },
        spec: {
          showAxes: false, showGrid: false, keepSquare: true,
          bounds: { xmin: -11, xmax: 11, ymin: -4, ymax: 9.5 },
        },
      }),
    ]),
  },
  {
    slug: 'area-of-a-sector',
    reason: 'Replace the unbuilt shaded-sector diagram with the sector-explorer archetype. r=3 per the founder-approved plan; theta=90 matches the page\'s own text, which calls out the "Quarter disc (θ = 90°)" case by name directly in the formula-explanation paragraph (order:4), right before the worked example.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Sector Explorer',
        caption: 'Drag the angle slider θ — the second radius sweeps around a circle of radius 3; arc length and sector area update live. Starts at θ = 90°, the "quarter disc" case from the text above.',
        archetype: 'sector-explorer',
        archetype_params: { r: 3, theta: 90 },
        spec: {
          showAxes: false, showGrid: false, keepSquare: true,
          bounds: { xmin: -4, xmax: 4, ymin: -4, ymax: 4 },
        },
      }),
    ]),
  },
];

(async () => {
  await withDb(async (db) => {
    const pages = db.collection('book_pages');
    const bookId = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';

    for (const cfg of PAGES) {
      const page = await pages.findOne({ book_id: bookId, chapter_number: 6, slug: cfg.slug });
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
        author: 'script:convert_ch6_images_to_graphs',
        summary: `DRY RUN — ${cfg.reason}`,
        dryRun: true,
      });
      console.log(`\n=== ${cfg.slug} ===`);
      console.log('diff:', JSON.stringify(dry.diff));
      console.log('wouldBlock:', dry.wouldBlock);

      if (!COMMIT) continue;

      const res = await savePage(db, { slug: cfg.slug, pageId: page._id }, newBlocks, {
        author: 'script:convert_ch6_images_to_graphs',
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
