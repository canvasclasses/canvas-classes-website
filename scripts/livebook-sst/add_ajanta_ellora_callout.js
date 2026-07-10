'use strict';
// Founder request (2026-07-10): add text about the Ajanta & Ellora caves to Ch2 page 10
// (underground-water-caves-and-karst-landscapes) — the founder added Ajanta/Ellora photos to the
// top gallery. Accuracy note: these are HUMAN-CARVED rock-cut caves (chiselled into Deccan basalt),
// NOT natural karst caves dissolved by water. So the text frames them as a deliberate CONTRAST
// ("not every cave is carved by water"), which is both correct and a nice teaching beat, and ties
// back to the Deccan Traps introduced earlier in the chapter. Facts web-verified before writing
// (Ajanta ~30 Buddhist caves 2nd c BCE–5th c CE, murals; Ellora 34 Buddhist/Hindu/Jain caves
// 6th–10th c CE, Kailasa monolithic temple carved top-down, ~200,000 t removed; both UNESCO 1983).
// Inserted after the "India's Real Underground Country" (Meghalaya natural caves) callout, before
// the quiz. No block removed; no media touched.
const crypto = require('crypto');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const SLUG = 'underground-water-caves-and-karst-landscapes';
const AFTER_BLOCK_ID = '72cf4ef2-caef-4229-b094-ac0da9ad651b'; // quest_continues "India's Real Underground Country"

const CALLOUT = {
  id: crypto.randomUUID(),
  type: 'callout',
  variant: 'india_science',
  title: 'The Other Kind of Cave — Ajanta and Ellora',
  markdown:
    "Every cave on this page so far was carved by *water*, slowly dissolving rock over thousands of " +
    "years. But India is also home to world-famous caves of a completely different kind — ones " +
    "carved by *human hands*.\n\n" +
    "In **Maharashtra**, near Aurangabad, sit the **Ajanta** and **Ellora** caves — not hollowed " +
    "out by dripping water, but chiselled straight into the hard **volcanic basalt of the Deccan** " +
    "(the very same ancient lava rock you met earlier in this chapter). At **Ajanta**, artists more " +
    "than 2,000 years ago cut around 30 Buddhist halls into a cliff and covered the walls with " +
    "glowing paintings that survive to this day. At **Ellora**, generations carved 34 Buddhist, " +
    "Hindu and Jain temples side by side — crowned by the astonishing **Kailasa Temple**, sculpted " +
    "*top-down* out of a single rock, with an estimated 200,000 tonnes of stone removed by hammer " +
    "and chisel alone. Both are **UNESCO World Heritage Sites**.\n\n" +
    "So when you look at the caves in the gallery above, remember there are two very different " +
    "stories hiding there: some caves are *dissolved* by patient water, and some are *carved* by " +
    "patient people.",
};

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: SLUG });
    if (!page) throw new Error('page not found: ' + SLUG);
    const out = [];
    let inserted = false;
    for (const b of page.blocks) {
      out.push(b);
      if (b.id === AFTER_BLOCK_ID) { out.push({ ...CALLOUT }); inserted = true; }
    }
    if (!inserted) throw new Error('anchor block not found: ' + AFTER_BLOCK_ID);
    for (const t of ['image', 'gallery', 'video']) {
      const before = page.blocks.filter((x) => x.type === t).length;
      const after = out.filter((x) => x.type === t).length;
      if (after < before) throw new Error(`ABORT: ${t} dropped`);
    }
    const reindexed = out.map((b, i) => ({ ...b, order: i }));
    const res = await bw.savePage(db, { slug: SLUG }, reindexed, {
      author: 'agent',
      summary: 'Added India-spotlight callout on the Ajanta & Ellora rock-cut caves (founder request), ' +
        'framed as a natural-vs-carved contrast. Web-verified facts. No media touched.',
    });
    console.log(`✓ ${SLUG} saved (v${res.version || '?'}) — ${reindexed.length} blocks; Ajanta/Ellora callout added`);
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
