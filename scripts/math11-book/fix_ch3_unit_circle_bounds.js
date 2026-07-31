'use strict';
/* Class 11 Math · Ch.3 Trigonometric Functions — "Measuring Angles" page.
   The 'unit-circle' archetype block had NO spec.bounds, so it fell back to
   MathGraphBoard's DEFAULT_BOUNDS (-6..6 both axes) — a radius-1 circle sitting
   in a 12-unit-wide frame, leaving most of the canvas empty (founder-reported
   2026-07-24, screenshot of this exact page). Fix: pass an explicit tight
   bounds via `spec.bounds` (archetype + spec CAN coexist — MathGraphBoard reads
   `spec?.bounds` independently of whether `archetype` is set), sized to keep
   the circle prominent while leaving headroom for the sin/cos text readout at
   board-coords (1.15, 1.7) and (1.15, 1.4).
   Purely additive (adds `spec` to a block that had none) — passes the
   content-loss guard trivially. Idempotent: skips if spec.bounds is already set.
   Run: node scripts/math11-book/fix_ch3_unit_circle_bounds.js */
const bw = require('../lib/book-writer');

const SLUG = 'measuring-angles-degree-radian';
const NEW_BOUNDS = { xmin: -1.8, xmax: 2.6, ymin: -1.6, ymax: 2.1 };

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    const idx = (cur.blocks || []).findIndex((b) => b.type === 'math_graph' && b.archetype === 'unit-circle');
    if (idx === -1) throw new Error('no unit-circle math_graph block found on this page');

    const target = cur.blocks[idx];
    if (target.spec?.bounds) { console.log('bounds already set — skipping (idempotent):', target.spec.bounds); return; }

    const newBlocks = cur.blocks.map((b, i) => (i === idx ? { ...b, spec: { ...(b.spec || {}), bounds: NEW_BOUNDS } } : b));

    const res = await bw.savePage(db, { slug: SLUG }, newBlocks, {
      author: 'agent',
      summary: `Tightened the unit-circle math_graph block's bounds from the -6..6 default to ${JSON.stringify(NEW_BOUNDS)} so the radius-1 circle fills the frame instead of sitting in mostly-empty space (founder-reported).`,
    });
    console.log('SAVED', res.slug, 'version', res.version, '· new bounds:', NEW_BOUNDS);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
