'use strict';
// Founder feedback (2026-07-09): the "A River's Journey" section (a static
// 3-dot horizontal timeline) reads as boring — asked for something
// interactive/dynamic with motion graphics. Replaced it with a new
// self-contained simulator ('river-journey', RiverJourneySim.tsx): an animated
// source→sea landscape where water flows continuously and a droplet travels
// the whole course, lighting up each stage (upper/middle/lower) with its
// landforms. Same position on the page (right after the intro that names the
// three courses). Content parity: the sim carries the exact same NCERT facts
// the timeline did (steep/erosion/V-valleys → meander/oxbow → delta/deposition).
const bw = require('../lib/book-writer');
const { v4: uuid } = require('uuid');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const TIMELINE_ID = '3103e392-ea8d-49cc-910c-acdb98e6dc32';

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'rivers-waterfalls-meanders-and-deltas' });
    const idx = page.blocks.findIndex((b) => b.id === TIMELINE_ID);
    if (idx === -1) throw new Error('A River\'s Journey timeline block not found');

    const simBlock = {
      id: uuid(),
      order: idx,
      type: 'simulation',
      simulation_id: 'river-journey',
      title: "A River's Journey",
    };

    const updated = page.blocks.map((b, i) => (i === idx ? simBlock : b)).map((b, i) => ({ ...b, order: i }));

    const res = await bw.savePage(db, { slug: 'rivers-waterfalls-meanders-and-deltas' }, updated, {
      author: 'agent',
      summary: 'Replaced the static "A River\'s Journey" timeline with a new interactive simulator (river-journey) — animated source→sea landscape + a droplet that travels the course and lights up each stage. Same facts, far more engaging.',
      allowContentLoss: true,
      lossReason: 'Founder explicitly asked to redesign this section ("too boring... design something interactive and dynamic... motion graphics"). The timeline is replaced in place by the river-journey simulator, which carries the identical NCERT course facts (upper/middle/lower). No information removed — the same content is now interactive.',
    });
    console.log(`✓ rivers-waterfalls-meanders-and-deltas — timeline → river-journey sim (v${res.version}), page now ${updated.length} blocks`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
