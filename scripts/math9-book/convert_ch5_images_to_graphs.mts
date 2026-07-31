/**
 * Class 9 Mathematics, Chapter 5 "Circles" — replace never-generated
 * static-image placeholders (src:'') with interactive, axis-free `math_graph`
 * blocks using the new circle-theorem archetype family, per the founder's
 * request: the same pattern already successfully applied to Chapter 1
 * (Coordinate Geometry).
 *
 * Every archetype used here is deliberately AXIS-FREE — NCERT circle
 * theorems are drawn without a coordinate grid — so every block below passes
 * `spec: { showAxes: false, showGrid: false, bounds: {...} }` ALONGSIDE its
 * `archetype` field. `archetype` and `spec` are independent fields on the
 * same math_graph block; spec.showAxes/showGrid/bounds apply regardless of
 * whether spec-mode or archetype-mode drew the shapes.
 *
 * Titles/captions are grounded in each page's own already-published theorem
 * statements (Theorems 1-12) — nothing invented.
 *
 * Page 3 ("how-many-circles-through-points") already has a leftover
 * `simulation` block (circle-and-locus-explorer) from an earlier chapter's
 * build. It does NOT teach this page's own content (circumcircle via
 * perpendicular bisectors of a triangle) and is left in place — removing it
 * is a founder decision, not this script's. The new circumcircle-explorer
 * math_graph block is added alongside it, replacing only this page's own
 * never-generated image placeholder.
 *
 * Page 12 ("circles-theorem-toolkit") is a recap-table page with no diagram
 * placeholder to replace — skipped entirely, per the plan.
 *
 * Usage:
 *   npx tsx scripts/math9-book/convert_ch5_images_to_graphs.mts --dry     (default)
 *   npx tsx scripts/math9-book/convert_ch5_images_to_graphs.mts --commit
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

// Axis-free bounds shared by every circle-theorem block on this chapter
// (r = 3 everywhere, so ~1.5x radius gives comfortable drag room).
const CIRCLE_SPEC = { showAxes: false, showGrid: false, bounds: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 } };
// The circumcircle-explorer's default triangle spans roughly x∈[-2,3], y∈[-2,2]
// — a slightly wider box keeps the dragged vertices comfortably inboard.
const CIRCUMCIRCLE_SPEC = { showAxes: false, showGrid: false, bounds: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 } };

// ── Per-page transforms ──────────────────────────────────────────────────

const PAGES = [
  {
    slug: 'what-is-a-circle',
    reason: 'Replace the unbuilt "parts of a circle" diagram (order 5) with the circle-anatomy-explorer archetype — radius, chord, diameter made tactile instead of a static labelled picture.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Circle Anatomy Explorer',
        caption: 'Drag P around the circle — watch the radius OP and the chord AP update live, and see the verdict flip to YES exactly when AP becomes a diameter (the longest possible chord).',
        archetype: 'circle-anatomy-explorer',
        archetype_params: { r: 3 },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'the-symmetry-of-a-circle',
    reason: 'Replace the unbuilt rotational/reflection symmetry diagram (order 5) with the circle-symmetry-explorer archetype — a rotation slider sweeps a diameter through every angle, always a line of symmetry.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Circle Symmetry Explorer',
        caption: 'Sweep θ through every angle — the circle looks identical at every stop (complete rotational symmetry), and the diameter drawn at each θ is always a line of reflection symmetry.',
        archetype: 'circle-symmetry-explorer',
        archetype_params: { r: 3 },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'how-many-circles-through-points',
    reason: 'Replace the unbuilt circumcentre diagram (order 8) with the circumcircle-explorer archetype (default triangle) — the two perpendicular bisectors and the circle through all three vertices draw live as vertices are dragged, proving Theorem 1. The page\'s existing circle-and-locus-explorer simulation block (order 5, left over from an earlier build) is left untouched, per instructions.',
    transform: (blocks) => replaceAtOrder(blocks, 8, [
      mathGraph({
        title: 'Circumcircle Explorer',
        caption: 'Drag any vertex of triangle ABC — the two perpendicular bisectors always meet at one point O, equidistant from all three vertices (OA = OB = OC): the circumcentre of Theorem 1.',
        archetype: 'circumcircle-explorer',
        archetype_params: { x1: -2, y1: -1, x2: 2, y2: 2, x3: 3, y3: -2 },
        spec: CIRCUMCIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'equal-chords-and-central-angles',
    reason: 'Replace the unbuilt equal-chords/equal-angles diagram (order 5) with the chord-distance-explorer archetype — its live central-angle readouts (∠POQ, ∠ROS) directly demonstrate Theorems 2-3.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Chord & Central Angle Explorer',
        caption: 'Drag chords PQ and RS to equal lengths — watch ∠POQ and ∠ROS lock to the same value: equal chords subtend equal angles at the centre, and the converse (Theorems 2-3).',
        archetype: 'chord-distance-explorer',
        archetype_params: { r: 3 },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'perpendicular-from-centre-bisects-chord',
    reason: 'Replace the unbuilt CM ⟂ AB diagram (order 5) with the chord-perpendicular-bisector archetype — the foot of the perpendicular from the centre always lands exactly at the chord\'s midpoint, proving Theorem 4.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Chord Perpendicular Bisector',
        caption: 'Drag chord AB anywhere — the perpendicular OM from the centre always lands exactly at the midpoint M, with AM = MB every time (Theorem 4).',
        archetype: 'chord-perpendicular-bisector',
        archetype_params: { r: 3 },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'equal-chords-are-equidistant',
    reason: 'Replace the unbuilt equal-chords/equal-distance diagram (order 5) with the chord-distance-explorer archetype — its live perpendicular-distance readouts (PQ dist from O, RS dist from O) demonstrate Theorems 6-7.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Chord Distance Explorer',
        caption: 'Drag chords PQ and RS to equal lengths — their perpendicular distances from the centre O match exactly, and the converse (Theorems 6-7).',
        archetype: 'chord-distance-explorer',
        archetype_params: { r: 3 },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'which-chord-is-farther',
    reason: 'Replace the unbuilt long-chord/short-chord diagram (order 5) with the same chord-distance-explorer archetype used on page 6 — the page\'s own text poses the inverse question (which chord is farther?), and the same live board already answers it (Theorem 8).',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Chord Distance Explorer',
        caption: 'Make PQ longer than RS — watch PQ\'s distance from centre O shrink below RS\'s: the longer chord always sits closer to the centre (Theorem 8).',
        archetype: 'chord-distance-explorer',
        archetype_params: { r: 3 },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'angle-at-the-centre',
    reason: 'Replace the unbuilt ∠AOB = 2∠APB diagram (order 7) with the inscribed-angle-explorer archetype (dual:false) — dragging P keeps the central-to-inscribed ratio locked at 2:1, proving Theorem 9.',
    transform: (blocks) => replaceAtOrder(blocks, 7, [
      mathGraph({
        title: 'Inscribed Angle Explorer',
        caption: 'Drag P anywhere around the circle — the central angle ∠AOB stays exactly double the inscribed angle ∠APB, wherever P sits (Theorem 9).',
        archetype: 'inscribed-angle-explorer',
        archetype_params: { r: 3, dual: 'false' },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'angles-in-the-same-segment',
    reason: 'Replace the unbuilt three-equal-angles diagram (order 5) with the inscribed-angle-explorer archetype (dual:true) — two draggable points P and Q on the same arc, both locked equal to each other, demonstrating the Theorem 9 corollary.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Inscribed Angle Explorer — Same Segment',
        caption: 'Drag P and Q anywhere on the same arc — ∠APB and ∠AQB always stay equal to each other (and to half of ∠AOB): angles in the same segment are equal.',
        archetype: 'inscribed-angle-explorer',
        archetype_params: { r: 3, dual: 'true' },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'cyclic-quadrilaterals',
    reason: 'Replace the unbuilt cyclic-quadrilateral diagram (order 7) with the cyclic-quad-explorer archetype (constrainD:true) — live ∠A+∠C and ∠B+∠D readouts stay at 180° as any vertex is dragged around the circle, proving Theorem 11.',
    transform: (blocks) => replaceAtOrder(blocks, 7, [
      mathGraph({
        title: 'Cyclic Quadrilateral Explorer',
        caption: 'Drag any vertex of ABCD around the circle — ∠A + ∠C and ∠B + ∠D always sum to 180° (Theorem 11).',
        archetype: 'cyclic-quad-explorer',
        archetype_params: { r: 3, constrainD: 'true' },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
  {
    slug: 'when-is-a-quadrilateral-cyclic',
    reason: 'Replace the unbuilt converse-test diagram (order 5) with the cyclic-quad-explorer archetype (constrainD:false) — vertex D is freed from the circle, so dragging it off breaks the 180° angle sums and dragging it back restores them: the converse, Theorem 12.',
    transform: (blocks) => replaceAtOrder(blocks, 5, [
      mathGraph({
        title: 'Cyclic Quadrilateral Explorer — the Converse',
        caption: 'Drag D off the circle — the angle sums break away from 180°. Drag it back onto the circle and they\'re restored: the converse test for concyclic points (Theorem 12).',
        archetype: 'cyclic-quad-explorer',
        archetype_params: { r: 3, constrainD: 'false' },
        spec: CIRCLE_SPEC,
      }),
    ]),
  },
];

(async () => {
  await withDb(async (db) => {
    const pages = db.collection('book_pages');
    const bookId = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';

    for (const cfg of PAGES) {
      const page = await pages.findOne({ book_id: bookId, chapter_number: 5, slug: cfg.slug });
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
        author: 'script:convert_ch5_images_to_graphs',
        summary: `DRY RUN — ${cfg.reason}`,
        dryRun: true,
      });
      console.log(`\n=== ${cfg.slug} ===`);
      console.log('diff:', JSON.stringify(dry.diff));
      console.log('wouldBlock:', dry.wouldBlock);

      if (!COMMIT) continue;

      const res = await savePage(db, { slug: cfg.slug, pageId: page._id }, newBlocks, {
        author: 'script:convert_ch5_images_to_graphs',
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
