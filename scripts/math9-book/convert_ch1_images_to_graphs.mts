/**
 * Class 9 Mathematics, Chapter 1 "Coordinate Geometry" — replace never-generated
 * static-image placeholders (src:'') with interactive `math_graph` blocks, per
 * the founder's request: the new math_graph tool (built for Class 11) is a
 * better fit for this chapter's plotted-point / triangle / distance diagrams
 * than static images would have been.
 *
 * Every coordinate below is copied verbatim from the chapter's own already-
 * published text (worked examples, NCERT exercises) — nothing invented.
 *
 * Usage:
 *   npx tsx scripts/math9-book/convert_ch1_images_to_graphs.mts --dry     (default)
 *   npx tsx scripts/math9-book/convert_ch1_images_to_graphs.mts --commit
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

// Pure addition: insert right before a given heading.
function insertBeforeHeading(blocks, beforeHeadingText, newBlocks) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((b) => b.type === 'heading' && b.text === beforeHeadingText);
  if (idx === -1) throw new Error(`heading "${beforeHeadingText}" not found`);
  return renumber([...sorted.slice(0, idx), ...newBlocks, ...sorted.slice(idx)]);
}

// ── Per-page transforms ──────────────────────────────────────────────────

const PAGES = [
  {
    slug: 'two-axes-four-quadrants-cartesian-plane',
    reason: 'Replace unbuilt "4 points on the axes" diagram with a labelled spec-mode math_graph — matches the page\'s own worked reading of B/G/H/E exactly.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Reading points off the axes',
        caption: 'O = (0, 0), B = (4.5, 0), G = (0, −4.5), H = (0, 4), E = (−2.9, 0).',
        spec: {
          bounds: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 },
          points: [
            pt(0, 0, 'O', 'sky'),
            pt(4.5, 0, 'B', 'violet'),
            pt(0, -4.5, 'G', 'amber'),
            pt(0, 4, 'H', 'emerald'),
            pt(-2.9, 0, 'E', 'pink'),
          ],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]),
  },
  {
    slug: 'mapping-reiaan-room-exercise-set-1-1',
    reason: 'Replace the unbuilt floor-plan diagram with a spec-mode math_graph using the new `segments` field — room outline + both doors, matching every number in Exercise Set 1.1 (i)-(iv).',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: "Reiaan's room, Fig. 1.3",
        caption: 'O, A, B, C are the room corners. D₁R₁ is the room door; B₁B₂ is the bathroom door on the y-axis. 1 grid step = 1 foot.',
        spec: {
          bounds: { xmin: -2, xmax: 14, ymin: -2, ymax: 12 },
          points: [
            pt(0, 0, 'O', 'sky'), pt(12, 0, 'A', 'sky'), pt(12, 10, 'B', 'sky'), pt(0, 10, 'C', 'sky'),
            pt(7.5, 0, 'D₁', 'amber'), pt(11.5, 0, 'R₁', 'amber'),
            pt(0, 1.5, 'B₁', 'emerald'), pt(0, 4, 'B₂', 'emerald'),
          ],
          segments: [
            seg([0, 0], [12, 0], { color: 'sky' }), seg([12, 0], [12, 10], { color: 'sky' }),
            seg([12, 10], [0, 10], { color: 'sky' }), seg([0, 10], [0, 0], { color: 'sky' }),
            seg([7.5, 0], [11.5, 0], { color: 'amber', label: 'Room door D₁R₁ (4 ft)' }),
            seg([0, 1.5], [0, 4], { color: 'emerald', label: 'Bathroom door B₁B₂ (2.5 ft)' }),
          ],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]),
  },
  {
    slug: 'four-quadrants-where-every-point-lives',
    reason: 'Replace the unbuilt quadrant diagram with the two labelled points the page\'s own worked examples classify (Q, S).',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Two points, two quadrants',
        caption: 'Q(−5, 3) lies in Quadrant II (x < 0, y > 0). S(3, −5) lies in Quadrant IV (x > 0, y < 0).',
        spec: {
          bounds: { xmin: -7, xmax: 7, ymin: -6, ymax: 6 },
          points: [pt(-5, 3, 'Q', 'violet'), pt(3, -5, 'S', 'amber')],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]),
  },
  {
    slug: 'reiaan-whole-house-exercise-1-2-part-1',
    reason: 'Replace the unbuilt apartment diagram with the bedroom + bathroom outline, the wardrobe, the study table (the exact answer to Q1(i)), and the bathroom door — every number NCERT Ex 1.2 Q1/Q2 actually use.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: "Reiaan's whole apartment, Fig. 1.5",
        caption: 'Bedroom in x ≥ 0, bathroom in x ≤ 0. Study table T₁T₂T₃T₄ is the answer to Q1(i); wardrobe W₁–W₃.',
        spec: {
          bounds: { xmin: -8, xmax: 14, ymin: -2, ymax: 12 },
          points: [
            pt(0, 0, 'O', 'sky'), pt(12, 0, 'A', 'sky'), pt(12, 10, 'B', 'sky'), pt(0, 10, 'C', 'sky'),
            pt(0, 9, 'F', 'sky'),
            pt(0, 1.5, 'B₁', 'emerald'), pt(0, 4, 'B₂', 'emerald'),
            pt(8, 9, 'T₁', 'pink'), pt(11, 7, 'T₃', 'pink'),
          ],
          segments: [
            // bedroom outline
            seg([0, 0], [12, 0], { color: 'sky' }), seg([12, 0], [12, 10], { color: 'sky' }),
            seg([12, 10], [0, 10], { color: 'sky' }), seg([0, 10], [0, 0], { color: 'sky' }),
            // bathroom outline (shares the bedroom's left wall)
            seg([0, 0], [-6, 0], { color: 'sky' }), seg([-6, 0], [-6, 9], { color: 'sky' }),
            seg([-6, 9], [0, 9], { color: 'sky' }),
            // bathroom door, highlighted on the shared wall
            seg([0, 1.5], [0, 4], { color: 'emerald', label: 'Bathroom door B₁B₂' }),
            // wardrobe (4 ft × 2 ft)
            seg([3, 1], [7, 1], { color: 'amber' }), seg([7, 1], [7, 3], { color: 'amber', label: 'Wardrobe W₁–W₃' }),
            seg([7, 3], [3, 3], { color: 'amber' }), seg([3, 3], [3, 1], { color: 'amber' }),
            // study table — the exact rectangle answered in Q1(i)
            seg([8, 9], [11, 9], { color: 'pink' }), seg([11, 9], [11, 7], { color: 'pink', label: 'Study table T₁T₂T₃T₄' }),
            seg([11, 7], [8, 7], { color: 'pink' }), seg([8, 7], [8, 9], { color: 'pink' }),
          ],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]),
  },
  {
    slug: 'distance-between-two-points',
    reason: 'Replace the unbuilt triangle diagram with the exact ADM triangle, plus the right-triangle construction (foot C) the page walks through step-by-step for finding AD.',
    transform: (blocks) => replaceAtOrder(blocks, 7, [
      mathGraph({
        title: 'Triangle ADM, Fig. 1.6',
        caption: 'A(3, 4), D(7, 1), M(9, 6) — an acute triangle entirely in Quadrant I. Dashed: the right-triangle construction for AD (foot C).',
        spec: {
          bounds: { xmin: -1, xmax: 10, ymin: 0, ymax: 7 },
          points: [pt(3, 4, 'A', 'violet'), pt(7, 1, 'D', 'sky'), pt(9, 6, 'M', 'amber'), pt(3, 1, 'C', 'emerald')],
          segments: [
            seg([3, 4], [7, 1], { color: 'violet', label: 'AD = 5' }),
            seg([7, 1], [9, 6], { color: 'sky', label: 'DM = √29' }),
            seg([9, 6], [3, 4], { color: 'amber', label: 'MA = √40' }),
            seg([3, 4], [3, 1], { color: 'emerald', dashed: true }),
            seg([3, 1], [7, 1], { color: 'emerald', dashed: true }),
          ],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]),
  },
  {
    slug: 'distance-formula',
    reason: 'Replace the unbuilt generic-formula diagram with the new distance-explorer archetype — drag any two points, watch the legs + hypotenuse + live d update. The visual PROOF, not a static illustration.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Distance Explorer',
        caption: 'Drag P and Q anywhere — the legs and the live distance always obey the formula.',
        archetype: 'distance-explorer',
        archetype_params: { x1: 1, y1: 1, x2: 6, y2: 5 },
        compare: false,
      }),
    ]),
  },
];

// Page 11 gets TWO transforms in sequence: the interactive at the old image
// position, then a NEW static family figure (the workflow's own "revision
// figure" beat) inserted before the formula section — pure addition.
const PAGE_11 = {
  slug: 'reflections-in-the-axes',
  reason: 'Replace the unbuilt single-image diagram with (1) the reflection archetype at the same spot — general, draggable, seeded at A(3,4) — and (2) a NEW static family figure showing the full ADM/A\'D\'M\' pair as revision, per MATH_BOOK_PAGE_WORKFLOW §2 beat 4.',
  transform: (blocks) => {
    let b = replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Reflection Explorer',
        caption: 'Drag P and watch its mirror image P\' — seeded at A(3, 4), the triangle\'s own first vertex.',
        archetype: 'reflection',
        archetype_params: { axis: 'y', x: 3, y: 4 },
      }),
    ]);
    b = insertBeforeHeading(b, 'The three rules — coordinate-by-coordinate', [
      mathGraph({
        title: "Revision: triangle ADM reflected in the y-axis",
        caption: "Fig. 1.9 — every side length is preserved. Dashed lines connect each vertex to its mirror image.",
        spec: {
          bounds: { xmin: -10, xmax: 10, ymin: 0, ymax: 7 },
          points: [
            pt(3, 4, 'A', 'violet'), pt(7, 1, 'D', 'violet'), pt(9, 6, 'M', 'violet'),
            pt(-3, 4, "A'", 'sky'), pt(-7, 1, "D'", 'sky'), pt(-9, 6, "M'", 'sky'),
          ],
          segments: [
            seg([3, 4], [7, 1], { color: 'violet', label: 'ADM' }), seg([7, 1], [9, 6], { color: 'violet' }), seg([9, 6], [3, 4], { color: 'violet' }),
            seg([-3, 4], [-7, 1], { color: 'sky', label: "A'D'M'" }), seg([-7, 1], [-9, 6], { color: 'sky' }), seg([-9, 6], [-3, 4], { color: 'sky' }),
            seg([3, 4], [-3, 4], { dashed: true, color: 'pink' }), seg([7, 1], [-7, 1], { dashed: true, color: 'pink' }), seg([9, 6], [-9, 6], { dashed: true, color: 'pink' }),
          ],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]);
    return b;
  },
};

// Page 12 has NO existing body diagram at all — pure addition. Seeded at
// Worked Example 1's own P(-2,5), Q(6,-3) for continuity (explore first,
// meet the same pair formally a few blocks later).
const PAGE_12 = {
  slug: 'midpoint-formula',
  reason: 'This page currently has NO diagram at all (not an image swap — new content). Add the midpoint-explorer archetype as the "Play" beat, right after the discovering-the-rule table.',
  transform: (blocks) => insertBeforeHeading(blocks, 'The midpoint formula', [
    mathGraph({
      title: 'Midpoint Explorer',
      caption: 'Drag P and Q — M always sits exactly halfway, its coordinates the average of theirs.',
      archetype: 'midpoint-explorer',
      archetype_params: { x1: -2, y1: 5, x2: 6, y2: -3 },
    }),
  ]),
};

// Page 13 also has NO existing body diagram — pure addition, TWO blocks for
// the page's two distinct sub-topics (locus/circle, then collinearity).
const PAGE_13 = {
  slug: 'circles-centres-and-collinearity',
  reason: 'This page currently has NO diagram at all. Add circle-locus-explorer after the circle definition, and collinearity-checker after the collinearity definition — both auto-checkable, the tool\'s actual differentiator.',
  transform: (blocks) => {
    let b = insertAfterHeading(blocks, 'A circle is a locus', [
      mathGraph({
        title: 'Circle as a Locus',
        caption: 'Every point on the circle is exactly r from the centre. Drag P and the radius slider — the verdict updates live.',
        archetype: 'circle-locus-explorer',
        archetype_params: { h: 0, k: 0, r: 3 },
      }),
    ]);
    b = insertAfterHeading(b, 'Collinearity — when three points lie on a line', [
      mathGraph({
        title: 'Are They Collinear?',
        caption: 'Seeded at M(−3,−4), A(0,0), G(6,8) — the chapter\'s own collinear triple (Worked Example 4). Drag any point to break the line and watch the verdict flip.',
        archetype: 'collinearity-checker',
        archetype_params: { x1: -3, y1: -4, x2: 0, y2: 0, x3: 6, y3: 8 },
        spec: { bounds: { xmin: -6, xmax: 8, ymin: -6, ymax: 10 } },
      }),
    ]);
    return b;
  },
};

const ALL_PAGES = [...PAGES, PAGE_11, PAGE_12, PAGE_13];

(async () => {
  await withDb(async (db) => {
    const pages = db.collection('book_pages');
    const bookId = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';

    for (const cfg of ALL_PAGES) {
      const page = await pages.findOne({ book_id: bookId, chapter_number: 1, slug: cfg.slug });
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
        author: 'script:convert_ch1_images_to_graphs',
        summary: `DRY RUN — ${cfg.reason}`,
        dryRun: true,
      });
      console.log(`\n=== ${cfg.slug} ===`);
      console.log('diff:', JSON.stringify(dry.diff));
      console.log('wouldBlock:', dry.wouldBlock);

      if (!COMMIT) continue;

      const res = await savePage(db, { slug: cfg.slug, pageId: page._id }, newBlocks, {
        author: 'script:convert_ch1_images_to_graphs',
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
