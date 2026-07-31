/**
 * Class 9 Mathematics, Chapter 3 "Number Systems" — replace never-generated
 * static-image placeholders (src:'') with interactive `math_graph` blocks,
 * following the exact pattern proven on Chapter 1 (Coordinate Geometry) —
 * see convert_ch1_images_to_graphs.mts.
 *
 * Two pages, two placeholder images:
 *   1. irrational-numbers (p7)                 — spec-mode unit right triangle,
 *      legs = 1, hypotenuse labelled √2. Numbers copied verbatim from the
 *      page's own published text (order 4): "1² + 1² = d² ⟹ d = √2".
 *   2. constructing-surds-on-the-line (p9)      — the new 'surd-spiral-construction'
 *      archetype (Spiral of Theodorus), n=6, with explicit bounds so it isn't
 *      stranded at the tool's default -6..6 (per MATH_BOOK_PAGE_WORKFLOW §3).
 *
 * Every coordinate below is copied verbatim from the chapter's own already-
 * published text — nothing invented.
 *
 * Usage:
 *   npx tsx scripts/math9-book/convert_ch3_images_to_graphs.mts --dry     (default)
 *   npx tsx scripts/math9-book/convert_ch3_images_to_graphs.mts --commit
 */
import { v4 as uuidv4 } from 'uuid';
import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: '.env.local' });
const { withDb, savePage } = require('../lib/book-writer');

const COMMIT = process.argv.includes('--commit');
const uid = () => uuidv4();

// ── Helpers (mirrors convert_ch1_images_to_graphs.mts exactly) ────────────
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
const pt = (x, y, label, color, draggable) => ({ x, y, ...(label ? { label } : {}), ...(color ? { color } : {}), ...(draggable ? { draggable: true } : {}) });
const seg = (from, to, opts = {}) => ({ from: { x: from[0], y: from[1] }, to: { x: to[0], y: to[1] }, ...opts });

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
    slug: 'irrational-numbers',
    reason: 'Replace unbuilt "unit square with diagonal √2" diagram with a labelled spec-mode math_graph — matches the page\'s own worked text exactly: 1² + 1² = d² ⟹ d = √2.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'The unit square\'s diagonal',
        caption: 'O = (0, 0), A = (1, 0), B = (1, 1). Both legs OA and AB are 1 unit; the diagonal OB satisfies 1² + 1² = d², so d = √2.',
        spec: {
          bounds: { xmin: -0.5, xmax: 1.8, ymin: -0.5, ymax: 1.5 },
          points: [
            pt(0, 0, 'O', 'sky'),
            pt(1, 0, 'A', 'violet'),
            pt(1, 1, 'B', 'amber'),
          ],
          segments: [
            seg([0, 0], [1, 0], { color: 'sky', label: '1' }),
            seg([1, 0], [1, 1], { color: 'sky', label: '1' }),
            seg([0, 0], [1, 1], { color: 'amber', label: '√2' }),
          ],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]),
  },
  {
    slug: 'constructing-surds-on-the-line',
    reason: 'Replace unbuilt "OA=1, AB=1 right triangle + compass arc" diagram with the new surd-spiral-construction archetype (Spiral of Theodorus) — a slider reveals OPₙ = √n one triangle at a time, the exact construction the page\'s own text walks through (√2 → √3 → √4 → …). Explicit spec.bounds per MATH_BOOK_PAGE_WORKFLOW §3 so the spiral (radius up to √16 ≈ 4) isn\'t stranded at the tool\'s default -6..6.',
    transform: (blocks) => replaceAtOrder(blocks, 6, [
      mathGraph({
        title: 'Building √n, one right triangle at a time',
        caption: 'Each new leg has length 1, perpendicular to the previous hypotenuse — so OPₙ = √n. Drag the slider to reveal more triangles.',
        archetype: 'surd-spiral-construction',
        archetype_params: { n: 6 },
        spec: { bounds: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 } },
      }),
    ]),
  },
];

(async () => {
  await withDb(async (db) => {
    const pages = db.collection('book_pages');
    const bookId = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';

    for (const cfg of PAGES) {
      const page = await pages.findOne({ book_id: bookId, chapter_number: 3, slug: cfg.slug });
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
        author: 'script:convert_ch3_images_to_graphs',
        summary: `DRY RUN — ${cfg.reason}`,
        dryRun: true,
      });
      console.log(`\n=== ${cfg.slug} ===`);
      console.log('diff:', JSON.stringify(dry.diff));
      console.log('wouldBlock:', dry.wouldBlock);

      if (!COMMIT) continue;

      const res = await savePage(db, { slug: cfg.slug, pageId: page._id }, newBlocks, {
        author: 'script:convert_ch3_images_to_graphs',
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
