'use strict';
/* QA fix #2 (2026-07-25): the aˣ explorer used spec-mode 'a^x' with a slider, which
   renders NaN everywhere except x=0 (JessieCode doesn't coerce a spec slider under '^').
   Repoint it to the new 'exp-base-explorer' archetype (draws via Math.pow(a.Value(),x)).
   Keep the bounds frame; drop the broken spec.functions/points (the archetype draws both
   the curve and the (0,1) anchor). Versioned savePage, ids preserved. */
const bw = require('../lib/book-writer');
const { withDb } = bw;
(async () => {
  await withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: 'class11-mathematics' });
    const pages = db.collection('book_pages');
    const page = await pages.findOne({ book_id: book._id, slug: 'growth-and-decay' });
    let changed = false;
    const blocks = page.blocks.map((blk) => {
      if (blk.type === 'math_graph' && /the exponential/i.test(blk.title || '')) {
        changed = true;
        const b = { ...blk, archetype: 'exp-base-explorer', archetype_params: { start: 2 } };
        b.spec = { bounds: blk.spec.bounds, showGrid: true, showAxes: true, keepSquare: false };
        return b;
      }
      return { ...blk };
    });
    if (!changed) throw new Error('aˣ block not found');
    const res = await bw.savePage(db, { slug: 'growth-and-decay' }, blocks, { author: 'script', summary: 'QA: aˣ graph → exp-base-explorer archetype (fixes NaN curve from spec a^x)' });
    console.log('patched growth-and-decay · v' + res.version + ' · loss ' + res.diff.lossDetected);
  });
})().catch((e) => { console.error(e); process.exit(1); });
