/**
 * Class 9 Mathematics, Chapter 2 "Introduction to Linear Polynomials" — replace
 * never-generated static-image placeholders (src:'') with interactive
 * `math_graph` blocks, and add new ones where the page currently has no
 * content diagram at all. Same pattern as Chapter 1 (Coordinate Geometry) —
 * see convert_ch1_images_to_graphs.mts for the canonical template this mirrors.
 *
 * Every number below is copied verbatim from the chapter's own already-
 * published text (worked examples, NCERT exercises, image captions) — nothing
 * invented, per CLAUDE.md Rule 0.
 *
 * Usage:
 *   npx tsx scripts/math9-book/convert_ch2_images_to_graphs.mts --dry     (default)
 *   npx tsx scripts/math9-book/convert_ch2_images_to_graphs.mts --commit
 */
import { v4 as uuidv4 } from 'uuid';
import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: '.env.local' });
const { withDb, savePage } = require('../lib/book-writer');

const COMMIT = process.argv.includes('--commit');
const uid = () => uuidv4();

// ── Helpers (identical to the Chapter 1 script) ─────────────────────────────
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
// matches `afterHeadingText` (exact match). Walks forward past consecutive
// 'text' blocks so the graph lands after the setup prose, not wedged between
// the heading and its first sentence.
function insertAfterHeading(blocks, afterHeadingText, newBlocks) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((b) => b.type === 'heading' && b.text === afterHeadingText);
  if (idx === -1) throw new Error(`heading "${afterHeadingText}" not found`);
  let insertAt = idx + 1;
  while (insertAt < sorted.length && sorted[insertAt].type === 'text') insertAt++;
  return renumber([...sorted.slice(0, insertAt), ...newBlocks, ...sorted.slice(insertAt)]);
}

// Pure addition: insert right after a specific block `order` value (used for
// page 24, where the new figure belongs after the WORKED example that poses
// the puzzle — a reveal/confirmation beat, not a spoiler placed before the
// question).
function insertAfterOrder(blocks, targetOrder, newBlocks) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((b) => b.order === targetOrder);
  if (idx === -1) throw new Error(`no block at order ${targetOrder}`);
  return renumber([...sorted.slice(0, idx + 1), ...newBlocks, ...sorted.slice(idx + 1)]);
}

// ── Per-page transforms ──────────────────────────────────────────────────

const PAGES = [
  {
    slug: 'linear-polynomials-in-the-wild',
    reason: 'This page has NO body diagram at all (only the order:0 banner, which we never touch). Add the line-explorer archetype right after the formal ax+b definition, as a "play with it" beat before the worked examples.',
    transform: (blocks) => insertAfterHeading(blocks, 'A linear polynomial — degree 1, the friendliest family', [
      mathGraph({
        title: 'Line Explorer',
        caption: 'Drag m and c — m plays the role of the leading coefficient a, c plays the role of the constant term b. Watch how each one reshapes the line.',
        archetype: 'line-explorer',
      }),
    ]),
  },
  {
    slug: 'linear-patterns-discovering-the-constant-step',
    reason: 'Replace the unbuilt L-staircase tile image (Fig. 2.4, order 5) with the sequence-pattern archetype seeded at the page\'s own AP: Stage 1=1, constant step +2.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'The L-staircase as a growing sequence',
        caption: 'Stage 1 = 1, Stage 2 = 3, Stage 3 = 5, Stage 4 = 7 — drag the sliders to match. The constant step d = 2 is exactly the leading coefficient of the rule 2n − 1.',
        archetype: 'sequence-pattern',
        archetype_params: { kind: 'ap', a: 1, d: 2, terms: 6 },
      }),
    ]),
  },
  {
    slug: 'linear-growth-and-linear-decay',
    reason: 'This page has NO body diagram at all. Add a spec-mode family figure with BOTH C(d)=100+60d (growth) and h(t)=3−0.5t (decay) — the page\'s own two worked functions — plotted on one board, right after the "same algebra, opposite story" paragraph that already sets up the contrast. Custom bounds: C(d) reaches 400 at d=5, so the default -5..5 board would clip it; keepSquare is turned off because the two functions live on very different y-scales (a real consequence of the real numbers, not an error).',
    transform: (blocks) => insertAfterHeading(blocks, 'Linear decay — Example 10 (NCERT water tank)', [
      mathGraph({
        title: 'Growth vs. Decay — two real functions, one board',
        caption: 'C(d) = 100 + 60d (violet, taxi cost) climbs steeply — linear growth. h(t) = 3 − 0.5t (sky, tank height) falls gently — linear decay. Same skeleton y = ax + b, opposite sign of a.',
        spec: {
          bounds: { xmin: -1, xmax: 6, ymin: -20, ymax: 420 },
          functions: [
            { expr: '100 + 60*x', color: 'violet', label: 'C(d) = 100 + 60d' },
            { expr: '3 - 0.5*x', color: 'sky', label: 'h(t) = 3 − 0.5t' },
          ],
          showGrid: true, showAxes: true, keepSquare: false,
        },
      }),
    ]),
  },
  {
    slug: 'meet-y-equals-ax-plus-b',
    reason: 'Replace the unbuilt "role of a and b" annotated-equation image (Fig. 2.12, order 8) with the line-explorer archetype — an actual draggable y=mx+c board in place of a static annotated diagram.',
    transform: (blocks) => replaceAtOrder(blocks, 8, [
      mathGraph({
        title: 'Meet y = ax + b — Line Explorer',
        caption: 'Drag m and c — m plays the role of a (the rate of change / slope), c plays the role of b (the starting value / y-intercept).',
        archetype: 'line-explorer',
      }),
    ]),
  },
  {
    slug: 'drawing-the-line-plotting-y-equals-ax-plus-b',
    reason: 'Replace the unbuilt "two-point plot" image (Fig. 2.15, order 8) with a spec-mode board showing the exact two points the page\'s own worked walkthrough uses — A(0,1) and B(3,7) — plus the line y=2x+1 through them.',
    transform: (blocks) => replaceAtOrder(blocks, 8, [
      mathGraph({
        title: 'Plotting y = 2x + 1 from two points',
        caption: 'A(0, 1) and B(3, 7) both satisfy y = 2x + 1 — lay a ruler across them and the whole line appears.',
        spec: {
          bounds: { xmin: -3, xmax: 5, ymin: -2, ymax: 8 },
          points: [pt(0, 1, 'A', 'amber'), pt(3, 7, 'B', 'amber')],
          functions: [{ expr: '2*x+1', color: 'sky', label: 'y = 2x + 1' }],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]),
  },
  {
    slug: 'slope-the-geometric-meaning-of-a',
    reason: 'Replace the unbuilt "three negative-slope lines" image (Fig. 2.16, order 7) with a spec-mode family figure of the page\'s own three lines: y=−⅓x, y=−x, y=−3x. Custom bounds so the steep −3x line stays inside the frame.',
    transform: (blocks) => replaceAtOrder(blocks, 7, [
      mathGraph({
        title: 'Three negative-slope lines',
        caption: 'y = −⅓x (gentle), y = −x (45°), y = −3x (steep) — all through the origin. The bigger the size of the slope, the steeper the fall.',
        spec: {
          bounds: { xmin: -4, xmax: 4, ymin: -6, ymax: 6 },
          functions: [
            { expr: '-x/3', color: 'sky', label: 'y = −⅓x' },
            { expr: '-x', color: 'pink', label: 'y = −x' },
            { expr: '-3*x', color: 'amber', label: 'y = −3x' },
          ],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]),
  },
  {
    slug: 'y-intercept-and-parallel-lines',
    reason: 'Replace the unbuilt "three parallel lines" image (Fig. 2.17, order 10) with a spec-mode family figure of the page\'s own three lines: y=2x−1, y=2x+1, y=2x+5 — same slope, different y-intercepts. Custom bounds sized to the caption\'s own stated grid range.',
    transform: (blocks) => replaceAtOrder(blocks, 10, [
      mathGraph({
        title: 'Three parallel lines, same slope',
        caption: 'y = 2x − 1, y = 2x + 1, y = 2x + 5 — all tilt at the same angle; only the y-intercept changes where each one is caught by the y-axis.',
        spec: {
          bounds: { xmin: -4, xmax: 4, ymin: -4, ymax: 9 },
          functions: [
            { expr: '2*x-1', color: 'sky', label: 'y = 2x − 1' },
            { expr: '2*x+1', color: 'violet', label: 'y = 2x + 1' },
            { expr: '2*x+5', color: 'amber', label: 'y = 2x + 5' },
          ],
          showGrid: true, showAxes: true, keepSquare: true,
        },
      }),
    ]),
  },
  {
    slug: 'the-hexagon-matchstick-pattern',
    reason: 'This page has NO body diagram at all. Add the sequence-pattern archetype seeded at the page\'s own AP: Stage 1=6, constant step +5, right after the "building the pattern by hand" explanation and before the existing simulation block.',
    transform: (blocks) => insertAfterHeading(blocks, 'Building the pattern by hand', [
      mathGraph({
        title: 'The hexagon-chain sequence',
        caption: 'Stage 1 = 6, Stage 2 = 11, Stage 3 = 16, … — each new hexagon adds exactly 5 fresh matchsticks. Drag the sliders to match.',
        archetype: 'sequence-pattern',
        archetype_params: { kind: 'ap', a: 6, d: 5, terms: 8 },
      }),
    ]),
  },
  {
    slug: 'two-linear-polynomials-together',
    reason: 'This page has NO body diagram at all. Add a spec-mode family figure for Puzzle B\'s family f(x)=ax+a (a>0), placed AFTER the WORKED block that poses "what do they have in common?" (order 9) so the visual confirms/reveals the shared point rather than spoiling the question that precedes it. a=0.5, 1, 2 chosen as three representative positive values; f(-1)=0 for every one of them, confirmed algebraically (a·(-1)+a=0 for any a) — the marked point (-1,0) is exact, not decorative.',
    transform: (blocks) => insertAfterOrder(blocks, 9, [
      mathGraph({
        title: 'The family f(x) = ax + a — what do they share?',
        caption: 'a = 0.5, 1, 2 — three different lines, different slopes, different y-intercepts. Yet every single one threads through the same point. Watch where they all cross.',
        spec: {
          bounds: { xmin: -4, xmax: 3, ymin: -3, ymax: 8 },
          points: [pt(-1, 0, '(−1, 0)', 'pink')],
          functions: [
            { expr: '0.5*x+0.5', color: 'sky', label: 'a = 0.5' },
            { expr: 'x+1', color: 'violet', label: 'a = 1' },
            { expr: '2*x+2', color: 'amber', label: 'a = 2' },
          ],
          showGrid: true, showAxes: true, keepSquare: true,
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
      const page = await pages.findOne({ book_id: bookId, chapter_number: 2, slug: cfg.slug });
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
        author: 'script:convert_ch2_images_to_graphs',
        summary: `DRY RUN — ${cfg.reason}`,
        dryRun: true,
      });
      console.log(`\n=== ${cfg.slug} ===`);
      console.log('diff:', JSON.stringify(dry.diff));
      console.log('wouldBlock:', dry.wouldBlock);

      if (!COMMIT) continue;

      const res = await savePage(db, { slug: cfg.slug, pageId: page._id }, newBlocks, {
        author: 'script:convert_ch2_images_to_graphs',
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
