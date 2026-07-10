'use strict';
// Ch2 concept-rewrite — BATCH 1: the 5 physical-process pages (2026-07-10, founder
// feedback that body text copied NCERT). Rewrites the reworded-NCERT `text` blocks
// into genuine teacher-English that explains mechanism + why (with concrete
// images: onion/honey/fingernails/soup-pot analogies), and lands the two hard
// coverage fixes: inner-vs-outer core (was collapsed) on plate-tectonics, and
// "volcanoes build land / Deccan Traps" (NCERT Fig 2.6) on plate-boundaries.
//
// Targets text blocks by a unique substring of their CURRENT markdown, replaces
// the whole block's markdown in place (id/order preserved). Touches ONLY `text`
// blocks — every image/gallery/video/callout/quiz/guided_reveal is left untouched.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

// slug -> [ { match: <substring of current markdown>, markdown: <new> } ]
const REWRITES = {
  'plate-tectonics-earths-moving-crust': [
    {
      match: 'The Earth is made up of three main layers',
      markdown:
        "Cut the Earth open and you'd find it built in layers, like an onion. The thin **crust** is " +
        "the rocky skin we live on — only about 5–7 km thick under the oceans, and 30–40 km under " +
        "the continents (tiny, next to the planet's ~6,400 km radius). Below it lies the **mantle**, " +
        "a vast, scorching layer of rock nearly 2,900 km deep that behaves like extremely stiff putty " +
        "over long stretches of time.\n\n" +
        "At the centre sits the **core**, and it comes in two parts. The **outer core** is *liquid* — " +
        "a searing ocean of molten iron and nickel. The **inner core**, right at the heart, is a " +
        "*solid* ball of white-hot metal and the densest part of the whole planet; the crushing " +
        "pressure there keeps it solid even at temperatures rivalling the surface of the Sun.\n\n" +
        "Now the piece that matters most for this chapter. The crust and the rigid top of the mantle " +
        "together form the **lithosphere** — and *this* is the shell that's cracked into tectonic " +
        "plates. Just beneath it lies the **asthenosphere**, a hot, partly-molten layer soft enough " +
        "for those plates to creep across it, like biscuits drifting slowly over warm honey.",
    },
    {
      match: 'Tectonic plates are massive slabs of solid rock that move very slowly',
      markdown:
        "These plates are not small — each is a massive slab of solid rock, some carrying whole " +
        "continents and oceans, and they creep along at just a few centimetres a year (about the " +
        "speed your fingernails grow). They come in three kinds: **continental plates**, which carry " +
        "landmasses; **oceanic plates**, which carry ocean floor and are thinner but denser; and " +
        "**mixed plates**, which carry *both* at once — like the Indo-Australian plate, which hauls " +
        "India, Australia and the sea floor between them as one connected piece. Earth's surface is " +
        "tiled by seven big plates — the Pacific, Eurasian, African, North American, South American, " +
        "Indo-Australian and Antarctic — plus a scatter of smaller ones.",
    },
    {
      match: 'The movement of tectonic plates is caused by',
      markdown:
        "So what could possibly shove a slab of rock the size of a continent? The engine is heat, " +
        "deep inside the Earth. Picture a pot of thick soup on a stove: heat at the bottom makes the " +
        "soup rise, spread across the top, cool, and sink again — a slow, endless churning loop. The " +
        "mantle does exactly this. Ferocious heat from the core sets the mantle rock creeping in " +
        "giant loops called **convection currents**, and as that rock flows beneath the plates it " +
        "drags them along — pulling them apart in some places and ramming them together in others. A " +
        "few centimetres a year sounds like nothing, but keep it up for millions of years and it " +
        "rearranges the entire face of the planet.",
    },
  ],

  'plate-boundaries-earthquakes-and-volcanoes': [
    {
      match: 'The edges where tectonic plates meet are called',
      markdown:
        "The real drama happens at the **edges** where plates meet — the **plate boundaries** — and " +
        "there are three kinds, each doing something completely different.\n\n" +
        "At a **convergent boundary**, two plates are driven *into* each other. If both carry " +
        "continents, neither will sink, so the trapped rock has nowhere to go but up — buckling into " +
        "fold mountains like the **Himalaya**, which are *still rising* today as the Indian plate " +
        "keeps pushing north. If an oceanic plate meets a continental one, the denser ocean plate " +
        "slides *underneath* and melts, feeding volcanoes and triggering earthquakes above.\n\n" +
        "At a **divergent boundary**, plates pull *apart*. Molten rock wells up into the gap and " +
        "freezes into brand-new crust, building undersea mountain chains like the Mid-Atlantic " +
        "Ridge.\n\n" +
        "At a **transform boundary**, plates simply grind *past* each other. No crust is made or " +
        "destroyed, but the rock snags, strains, and suddenly slips — which is why these boundaries, " +
        "like California's San Andreas Fault, are earthquake country.",
    },
    {
      match: 'Plate tectonics plays a major role in shaping the Earth',
      markdown:
        "Because most volcanoes and earthquakes are born at plate boundaries, they don't scatter " +
        "randomly across the globe — they line up along those seams. The most striking example is " +
        "the great horseshoe of boundaries ringing the Pacific Ocean, so crowded with volcanoes and " +
        "quakes that it's nicknamed the **Ring of Fire**.\n\n" +
        "And here's a twist worth remembering: volcanoes don't only tear land *down* — they also " +
        "*build* it. Every eruption deposits lava and ash that cool into fresh rock, and over " +
        "millions of years those layers stack up into whole plateaus. India's own **Deccan Traps** — " +
        "the vast, step-like basalt hills spread across much of the Deccan — were laid down by " +
        "colossal ancient eruptions, and the black soil that weathers from that rock is some of the " +
        "richest farming soil in the country. Destruction and creation are two sides of the same " +
        "volcano.",
    },
    {
      match: 'India has experienced some major earthquakes in the past',
      markdown:
        "India is no bystander to any of this. The entire northern edge of the country is being " +
        "slowly crumpled by the India–Asia collision, which makes the Himalaya and the plains below " +
        "them genuinely earthquake-prone. In a country this densely populated, a single large quake " +
        "can be devastating — as the **2001 Gujarat earthquake** showed, when thousands of lives " +
        "were lost and whole towns were flattened in moments.",
    },
  ],

  'weathering-breaking-rock-in-place': [
    {
      match: 'is the process through which rocks on the Earth',
      markdown:
        "**Weathering** is nature's way of breaking rock apart *right where it sits* — no moving " +
        "involved, just the patient crumbling of solid rock into smaller and smaller pieces. That " +
        "last part is the whole idea: weathering **breaks**, it doesn't **carry**. (Carrying comes " +
        "next, and it has its own name — erosion.)\n\n" +
        "Rock gets broken down in three ways. **Physical weathering** shatters rock by brute physical " +
        "force — water freezing and expanding inside a crack, or blazing days and freezing nights " +
        "making rock swell and shrink until it flakes — with no change to what the rock is *made " +
        "of*. **Chemical weathering** goes after the rock's actual chemistry: rainwater, air and " +
        "natural acids react with its minerals and turn them into entirely new, weaker substances " +
        "(this is what quietly eats away limestone and marble). **Biological weathering** is the work " +
        "of living things — a tree root prising a boulder apart as it thickens in a crack, burrowing " +
        "animals loosening the soil, even the faint acids of lichens clinging to a bare rock face.",
    },
  ],

  'erosion-and-indias-ancient-water-wisdom': [
    {
      match: 'is the process by which soil, rocks and other surface materials are worn away',
      markdown:
        "If weathering is the *breaking*, **erosion** is the *carrying away*. Erosion is the process " +
        "where loosened soil and rock are picked up and moved somewhere else by a natural carrier — " +
        "running water, wind, ice or waves. That one word, *movement*, is the entire difference " +
        "between the two: weathering loosens the material in place, erosion hauls it off.\n\n" +
        "It comes in a few forms, each named after whatever is doing the carrying. **Water erosion** " +
        "— rivers, rain and sea waves — is by far the most widespread. **Wind erosion** takes over in " +
        "dry, sandy places where there's little plant cover to pin the ground down. **Glacial " +
        "erosion** is the grinding work of moving ice, scraping up rock and soil like a giant, " +
        "slow-motion bulldozer. And **coastal erosion** is the sea steadily gnawing at the shore. " +
        "Between them, these carriers are forever redrawing the map — stripping land from one place " +
        "and dumping it in another.",
    },
  ],

  'agents-of-gradation-and-landforms-in-history': [
    {
      match: 'are natural forces that wear down, transport and deposit materials',
      markdown:
        "Zoom out from any single river or glacier and a pattern appears: nature is forever trying " +
        "to *flatten* the land — grinding down whatever stands high and filling in whatever lies " +
        "low. The forces that carry out this levelling work are called the **agents of gradation**, " +
        "and there are five of them: **running water, glaciers, wind, waves and groundwater.**\n\n" +
        "Each shapes the land in its own signature way. Running water carves valleys and lays down " +
        "fertile plains. Glaciers — slow rivers of ice — bulldoze wide, U-shaped valleys. Wind " +
        "sculpts deserts, scooping sand from one place and heaping it in another. Sea waves chisel " +
        "coastlines into cliffs, beaches and bays. And groundwater quietly *dissolves* rock like " +
        "limestone from the inside out, hollowing out caves and sinkholes. Working together across " +
        "unimaginable stretches of time, these five are the sculptors behind almost every landform " +
        "you'll meet in this chapter.",
    },
  ],
};

function replaceOnce(blocks, match, newMarkdown, slug) {
  const hits = blocks.filter((b) => b.type === 'text' && (b.markdown || '').includes(match));
  if (hits.length === 0) throw new Error(`[${slug}] no text block matched: "${match}"`);
  if (hits.length > 1) throw new Error(`[${slug}] ${hits.length} text blocks matched (not unique): "${match}"`);
  return blocks.map((b) => (b === hits[0] ? { ...b, markdown: newMarkdown } : b));
}

async function main() {
  await bw.withDb(async (db) => {
    for (const [slug, edits] of Object.entries(REWRITES)) {
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      if (!page) throw new Error('page not found: ' + slug);

      const mediaBefore = page.blocks.filter((b) => ['image', 'gallery', 'video'].includes(b.type)).length;
      let blocks = page.blocks;
      for (const e of edits) blocks = replaceOnce(blocks, e.match, e.markdown, slug);
      const mediaAfter = blocks.filter((b) => ['image', 'gallery', 'video'].includes(b.type)).length;
      if (mediaAfter !== mediaBefore) throw new Error(`[${slug}] media count changed ${mediaBefore}->${mediaAfter}`);

      const res = await bw.savePage(db, { slug }, blocks, {
        author: 'agent',
        summary:
          'Ch2 concept-rewrite batch 1 (process pages): re-taught reworded-NCERT text into ' +
          'mechanism-explaining teacher English; fixed inner/outer core + added volcanic ' +
          'deposition (Deccan Traps). All media preserved.',
      });
      console.log(`✓ ${slug} — ${edits.length} text block(s) rewritten (v${res.version || '?'}), media ${mediaAfter} preserved`);
    }
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
