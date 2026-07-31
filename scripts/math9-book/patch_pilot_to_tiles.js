'use strict';
/* Swap the pilot's concept-game from the (retired) balance-scale to the new
   draggable ALGEBRA TILES game, and rewrite the two text blocks that referenced
   the scale. In-place via book-writer.savePage (ids preserved, versioned). */
const bw = require('../lib/book-writer');
const { withDb } = bw;

const HOOK =
  'You already know how to *build* an equation. Now the big question: how do you **solve** one — how do you find the ' +
  'mystery number $ x $?\n\n' +
  'Here’s the secret, and it’s not heavy algebra — it’s **cancelling, kept fair**. A $ +1 $ and a $ -1 $ add up to ' +
  'nothing, so you can always cancel them out. Before we write a single symbol, play with the tiles below. Your job: ' +
  '**drag the tiles to clear the loose ones and get the $ x $-tiles all by themselves.**';

const BRIDGE =
  'Did you feel it? To clear a loose $ +1 $ you dropped a $ -1 $ on top and they cancelled to nothing — and to stay ' +
  'fair, you did it on **both** sides. That single idea — *cancel to clear, the same on both sides* — **is** how we ' +
  'solve every equation.\n\n' +
  'Now watch the exact same moves in symbols. This time **you** make each decision — click through it one step at a time.';

(async () => {
  await withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: 'class9-mathematics' });
    const pages = db.collection('book_pages');
    const page = await pages.findOne({ book_id: book._id, slug: 'play-then-solve-linear-equations' });
    if (!page) throw new Error('pilot page not found');
    let hookDone = false;
    const blocks = page.blocks.map((blk) => {
      if (blk.type === 'simulation') {
        return { ...blk, simulation_id: 'algebra-tiles-solver', title: 'Tile Lab — free the x' };
      }
      if (blk.type === 'text' && !hookDone && /You already know how to/i.test(blk.markdown || '')) {
        hookDone = true; return { ...blk, markdown: HOOK };
      }
      if (blk.type === 'text' && /Did you feel it\?/i.test(blk.markdown || '')) {
        return { ...blk, markdown: BRIDGE };
      }
      return { ...blk };
    });
    const res = await bw.savePage(db, { slug: 'play-then-solve-linear-equations' }, blocks, { author: 'script', summary: 'swap concept-game balance-scale → algebra-tiles; rewrite scale-referencing text' });
    console.log('patched pilot · v' + res.version + ' · loss ' + res.diff.lossDetected);
  });
})().catch((e) => { console.error(e); process.exit(1); });
