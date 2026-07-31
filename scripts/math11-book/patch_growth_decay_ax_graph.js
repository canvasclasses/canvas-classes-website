'use strict';
/* QA fix (2026-07-25): the aˣ explorer's auto general-form overlay read "aˣ = a^x"
   (redundant with the "aˣ = 2^x" card) and overlapped the x-axis tick labels (the
   exponential lives above the axis, so y=0 sat low in the frame). Fix in place:
   (1) relabel the curve 'y' → overlay becomes the meaningful TEMPLATE "y = a^x"
       while the card stays the specific "y = 2^x";
   (2) lower ymin -1 → -2.5 so the bottom-pinned overlay clears the axis numbers.
   Versioned savePage, ids preserved (lossDetected false). */
const bw = require('../lib/book-writer');
const { withDb } = bw;
(async () => {
  await withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: 'class11-mathematics' });
    const pages = db.collection('book_pages');
    const page = await pages.findOne({ book_id: book._id, slug: 'growth-and-decay' });
    const blocks = page.blocks.map((blk) => {
      if (blk.type === 'math_graph' && /the exponential/i.test(blk.title || '')) {
        const spec = { ...blk.spec };
        spec.bounds = { ...spec.bounds, ymin: -2.5 };
        spec.functions = spec.functions.map((f, i) => i === 0 ? { ...f, label: 'y' } : f);
        return { ...blk, spec };
      }
      return { ...blk };
    });
    const res = await bw.savePage(db, { slug: 'growth-and-decay' }, blocks, { author: 'script', summary: 'QA: aˣ graph relabel y + ymin headroom (overlay no longer overlaps axis)' });
    console.log('patched growth-and-decay · v' + res.version + ' · loss ' + res.diff.lossDetected);
  });
})().catch((e) => { console.error(e); process.exit(1); });
