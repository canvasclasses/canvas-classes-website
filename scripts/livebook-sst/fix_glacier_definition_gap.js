'use strict';
// Founder feedback (2026-07-09): "have we explained glaciers anywhere before
// starting page 8... you directly started with glacial landforms without
// giving any context." Confirmed via a full manuscript read: "glacier" is
// used 3 times across Ch.2 (erosion page's "glacial erosion (moving ice)",
// the agents-of-gradation overview's "glaciers scrape and carve U-shaped
// valleys", and glacial-landforms-and-moraines' opening) without ever once
// defining what a glacier actually IS — unlike every other core term in both
// chapters (crust/mantle/core, weathering types, dharma/artha/rajadharma),
// which all get a concrete plain-English definition at first use. This
// matters more for "glacier" than for river/wind/wave, since most Indian
// Class 9 students have never seen one. Fix: add a real definition at the
// two places it matters — the agents-of-gradation overview (first real
// introduction) and the glacial-landforms-and-moraines opener (the deep dive).
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  await bw.withDb(async (db) => {
    // ─── Page 5: agents-of-gradation-and-landforms-in-history ─────────────
    const page5 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'agents-of-gradation-and-landforms-in-history' });
    const updated5 = page5.blocks.map((b) => {
      if (b.id === 'b96f13ba-e82d-4ae7-a214-0e08d5dae7e4') {
        return {
          ...b,
          markdown: b.markdown.replace(
            'Running water erodes rocks and soils to form valleys and plains; glaciers scrape and carve U-shaped valleys; wind shapes deserts;',
            "Running water erodes rocks and soils to form valleys and plains; glaciers — giant, slow-moving rivers of ice that form where snow piles up faster than it melts, year after year, in very cold or very high places like the Himalaya — scrape and carve U-shaped valleys; wind shapes deserts;"
          ),
        };
      }
      if (b.type === 'guided_reveal') {
        return {
          ...b,
          steps: b.steps.map((c) => (c.headline === 'Glaciers'
            ? { ...c, body: 'A giant, slow-moving river of ice, formed where snow piles up faster than it melts year after year — it scrapes and carves U-shaped valleys as it moves.' }
            : c)),
        };
      }
      return b;
    });
    const res5 = await bw.savePage(db, { slug: 'agents-of-gradation-and-landforms-in-history' }, updated5, {
      author: 'agent',
      summary: 'Added a real definition of "glacier" (giant slow-moving river of ice, how it forms) to both the main text and the guided_reveal card — previously said only what glaciers do, never what they are, unlike every other agent of gradation',
    });
    console.log(`✓ agents-of-gradation-and-landforms-in-history — glacier definition added (v${res5.version})`);

    // ─── Page 8: glacial-landforms-and-moraines ────────────────────────────
    const page8 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'glacial-landforms-and-moraines' });
    const updated8 = page8.blocks.map((b) => {
      if (b.id === 'a0562892-c00b-4d6e-8709-1b3706082c2b') {
        return {
          ...b,
          markdown: 'A glacier is a giant river of ice — snow that has piled up for so many years in a very cold or very high place, like the Himalaya, that it compacts into solid ice and starts flowing slowly downhill under its own weight, often just centimetres to a few metres a day.\n\n' + b.markdown,
        };
      }
      return b;
    });
    const res8 = await bw.savePage(db, { slug: 'glacial-landforms-and-moraines' }, updated8, {
      author: 'agent',
      summary: 'Added an opening definition of "glacier" before diving into glacial erosion and landforms — the page previously assumed the reader already knew what a glacier is',
    });
    console.log(`✓ glacial-landforms-and-moraines — glacier definition added (v${res8.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
