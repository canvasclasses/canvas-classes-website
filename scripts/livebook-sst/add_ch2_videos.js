'use strict';
// Founder request (2026-07-09): open Ch.2 page 1 with a Yellowstone
// supervolcano hook (colourful hot springs/geysers, hidden danger beneath)
// to build curiosity before the formal plate-tectonics content, featuring 3
// founder-selected YouTube videos:
//   1. yHlLp0O5Fq4 — Yellowstone supervolcano (Italian-narrated; founder
//      chose to keep it as the visual hook despite the language, confirmed
//      via AskUserQuestion) — page 1, right after the revised curiosity_prompt.
//   2. q-ng6YpxHxU — "Animated Maps: Tectonic Plate Movement" (Esri, English,
//      541M years of real plate movement, explicitly shows India colliding
//      with Asia to form the Himalaya) — page 1, after the convection-currents
//      section, right before the existing Himalaya-formation callout.
//   3. KJ-dutQXUtg — Icelandic volcano eruption 4K drone footage (real 2021
//      Fagradalsfjalli eruption, English title, likely music/ambient not
//      narration-dependent) — page 2, after the Ring-of-Fire/plate-boundary
//      map, tied to the page's existing Mid-Atlantic Ridge divergent-boundary
//      content (Iceland sits directly on that ridge).
// Plus a 4th video the founder asked to add as a "watch later" recommendation
// rather than the main hook, since it replaces the Italian video's role as
// primary but accessible-in-English alternative:
//   4. fhn9X670GPY — National Geographic "Did You Know There Was A Volcano
//      Under Yellowstone?" (X-Ray Earth, 44 min) — page 1, near the end,
//      framed as optional further viewing.
//
// Verified facts used in the new curiosity_prompt copy (WebSearch, before
// writing, per this project's anti-hallucination discipline): Yellowstone's
// hotspot origin (~600km+ deep mantle plume), the North American plate
// drifting over a stationary hotspot leaving a trail of extinct volcanoes
// from Nevada to Yellowstone, magma chamber ~40x80km, Old Faithful's ~90min
// interval, Grand Prismatic Spring's thermophile-bacteria colours.
const bw = require('../lib/book-writer');
const { v4: uuid } = require('uuid');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

function reorder(blocks) {
  return blocks.map((b, i) => ({ ...b, order: i }));
}

async function main() {
  await bw.withDb(async (db) => {
    // ─── Page 1: plate-tectonics-earths-moving-crust ──────────────────────
    const page1 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'plate-tectonics-earths-moving-crust' });

    const yellowstoneVideo = {
      id: uuid(),
      type: 'video',
      provider: 'youtube_nocookie',
      src: 'yHlLp0O5Fq4',
      caption: "See it for yourself: Yellowstone's supervolcano and its otherworldly hot springs",
      duration_sec: 0,
    };
    const tectonicAnimationVideo = {
      id: uuid(),
      type: 'video',
      provider: 'youtube_nocookie',
      src: 'q-ng6YpxHxU',
      caption: 'Watch continents actually drift — millions of years of real plate movement, animated from geological data',
      duration_sec: 88,
    };
    const natGeoVideo = {
      id: uuid(),
      type: 'video',
      provider: 'youtube_nocookie',
      src: 'fhn9X670GPY',
      caption: 'Want to go deeper? National Geographic\'s full documentary on the volcano beneath Yellowstone (44 min)',
      duration_sec: 2640,
    };

    let blocks1 = page1.blocks.map((b) => {
      if (b.id === 'b5682bad-7165-4725-a16c-6e404a47718b') {
        return {
          ...b,
          prompt: "Yellowstone National Park is famous for its rainbow-coloured hot springs and geysers that erupt almost like clockwork — Old Faithful alone has gone off roughly every 90 minutes for well over a century. But underneath all that beauty sits something far more dangerous: a supervolcano, with a chamber of partly molten rock stretching roughly 80 kilometres across. Before reading on, why do you think something this powerful sits under a national park in the middle of the United States, in exactly this spot — and not somewhere else?",
          hint: "It isn't that the ground here has always been unstable. Think about what this entire chapter is actually about.",
          reveal: 'Yellowstone sits above a hotspot — a plume of extremely hot rock rising from deep inside the Earth, from over 600 kilometres down, that has stayed in roughly the same place for millions of years. What has actually moved is the ground above it: the North American continent has slowly drifted over this fixed hotspot, leaving behind a trail of older, now-extinct volcanoes stretching all the way from Nevada to Yellowstone\'s current location. Yellowstone isn\'t just "a volcano that happens to be here" — it\'s living proof that an entire continent has been quietly sliding across the Earth\'s surface for millions of years. That sliding motion is exactly what this chapter is about.',
        };
      }
      if (b.id === '072dffaa-3d7e-4d2c-98cd-ac144f7d117e') {
        return {
          ...b,
          markdown: b.markdown.replace(
            "The Earth's surface is not fixed",
            "That trail of extinct volcanoes under Yellowstone is a clue to something much bigger. The Earth's surface is not fixed"
          ),
        };
      }
      return b;
    });

    // Insert Yellowstone video right after the curiosity_prompt
    const idxCuriosity = blocks1.findIndex((b) => b.id === 'b5682bad-7165-4725-a16c-6e404a47718b');
    blocks1 = [...blocks1.slice(0, idxCuriosity + 1), yellowstoneVideo, ...blocks1.slice(idxCuriosity + 1)];

    // Insert the tectonic-animation video right after the convection-currents
    // text, before the "Threads of Curiosity" callout (which discusses the
    // Indian plate's collision with Asia — same story the video shows)
    const idxConvectionText = blocks1.findIndex((b) => b.id === 'fbd9211f-a3d8-4774-8386-4f0ca5f7b75c');
    blocks1 = [...blocks1.slice(0, idxConvectionText + 1), tectonicAnimationVideo, ...blocks1.slice(idxConvectionText + 1)];

    // Insert the Nat Geo "watch later" video right before the closing quiz
    const idxQuiz = blocks1.findIndex((b) => b.type === 'inline_quiz');
    blocks1 = [...blocks1.slice(0, idxQuiz), natGeoVideo, ...blocks1.slice(idxQuiz)];

    blocks1 = reorder(blocks1);
    const res1 = await bw.savePage(db, { slug: 'plate-tectonics-earths-moving-crust' }, blocks1, {
      author: 'agent',
      summary: 'Rewrote the opening curiosity_prompt around a Yellowstone supervolcano hook (hotspot + plate-drift explanation, WebSearch-verified facts) and added 3 video blocks: the founder-selected Yellowstone video as the main hook, an Esri plate-movement animation after the convection-currents section, and a National Geographic documentary as a "watch deeper" recommendation before the quiz',
    });
    console.log(`✓ plate-tectonics-earths-moving-crust — Yellowstone hook + 3 videos added (v${res1.version}), page now ${blocks1.length} blocks`);

    // ─── Page 2: plate-boundaries-earthquakes-and-volcanoes ───────────────
    const page2 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'plate-boundaries-earthquakes-and-volcanoes' });
    const icelandVideo = {
      id: uuid(),
      type: 'video',
      provider: 'youtube_nocookie',
      src: 'KJ-dutQXUtg',
      caption: 'Real footage: flying through an active lava flow in Iceland — exactly where two plates are pulling apart along the Mid-Atlantic Ridge',
      duration_sec: 0,
    };
    let blocks2 = page2.blocks;
    const idxMap = blocks2.findIndex((b) => b.id === '7ebea3ab-3239-4a1d-8840-c882641c11eb');
    blocks2 = [...blocks2.slice(0, idxMap + 1), icelandVideo, ...blocks2.slice(idxMap + 1)];
    blocks2 = reorder(blocks2);
    const res2 = await bw.savePage(db, { slug: 'plate-boundaries-earthquakes-and-volcanoes' }, blocks2, {
      author: 'agent',
      summary: 'Added real Iceland volcanic eruption drone footage right after the tectonic-plate map, tied to the page\'s existing Mid-Atlantic Ridge / divergent-boundary content (Iceland sits directly on that ridge)',
    });
    console.log(`✓ plate-boundaries-earthquakes-and-volcanoes — Iceland video added (v${res2.version}), page now ${blocks2.length} blocks`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
