'use strict';
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const PATCH = {
  'weather-climate-and-temperature': { qi: 1, ci: 1, newCorrect: "The Sun's rays hit the equator head-on but strike the poles at a weak, spread-out slant" },
  'punjab-floods-2025': { qi: 1, ci: 0, newCorrect: "Because weak embankments and floodplain building turned a heavy flood into a catastrophe" },
};
(async () => {
  await bw.withDb(async (db) => {
    for (const [slug, p] of Object.entries(PATCH)) {
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      const qBlock = page.blocks.find((b) => b.type === 'inline_quiz');
      const q = qBlock.questions[p.qi];
      q.options[p.ci] = p.newCorrect;
      const blocks = page.blocks.map((b) => (b === qBlock ? { ...b } : b));
      await bw.savePage(db, { slug }, blocks, { author: 'agent', summary: 'Trim over-long correct option (quiz length-tell cleanup).' });
      const lens = q.options.map((o) => o.length);
      const others = lens.filter((_, i) => i !== p.ci);
      console.log(`✓ ${slug} q${p.qi + 1}: correct now ${lens[p.ci]}c vs avg ${Math.round(others.reduce((a, b) => a + b) / others.length)}c`);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
