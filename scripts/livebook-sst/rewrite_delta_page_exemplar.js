'use strict';
// EXEMPLAR rewrite (2026-07-09, founder feedback: "you literally just copied NCERT text and
// have not improved the explanation, and missed sections like Sundarbans").
//
// This rewrites ONLY the three expository `text` blocks on the deltas page into genuine
// richer teacher-English that explains the *mechanism and the why* (river energy vs. slope;
// why the outer bank erodes and inner deposits; why a river dumps its load at the sea) rather
// than lightly rewording NCERT's definitions — and ADDS a real Sundarbans teaching block where
// the book previously only echoed NCERT's "explore its uniqueness" prompt in one line.
//
// PRESERVES every image / gallery / video block untouched (same src, same id). No block is
// removed. book-writer's content-loss guard is the backstop.
const crypto = require('crypto');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const SLUG = 'rivers-waterfalls-meanders-and-deltas';

// New body text keyed by the existing block id (rewrite in place — keeps ids stable).
const REWRITES = {
  // [2] the upper/middle/lower course intro
  '8d61dc09-9c11-45b8-b172-f5f5a5bfb293':
    "Follow a single river from the mountains down to the sea and it behaves almost like three " +
    "different rivers along the way. One simple idea ties them together: **the steeper the land, " +
    "the faster and stronger the water** — and fast water cuts *down* into the land, while slow " +
    "water drops whatever it was carrying.\n\n" +
    "Near its source, in the **upper course**, the river is racing down a steep slope. All that " +
    "speed goes into cutting downward, carving narrow **V-shaped valleys**, plunging over " +
    "**waterfalls**, and crashing through rocky **rapids**.\n\n" +
    "Once it reaches flatter ground in the **middle course**, the river loses much of that energy. " +
    "Instead of cutting down, it starts swinging from side to side in wide bends called " +
    "**meanders**, and begins dropping sediment to build **floodplains** and leave behind cut-off " +
    "loops called **oxbow lakes**.\n\n" +
    "By the **lower course**, the river is slow, wide and heavy with sediment it can no longer " +
    "carry. It lets that load settle out, building **deltas, levees and alluvial fans** as it " +
    "finally empties into the sea.",

  // [5] waterfalls
  '81dd82bf-c96d-4670-93f7-416120566ee7':
    "A **waterfall** is simply the place where a river drops suddenly over a steep edge. But *why* " +
    "does that edge appear in one spot and not another? The secret is that not all rock wears away " +
    "at the same speed. Where a band of **hard rock lies on top of softer rock**, the river scours " +
    "out the soft rock underneath far faster, undercutting the hard layer until the water has " +
    "nowhere to go but straight down. As the hard lip keeps breaking off, the waterfall slowly " +
    "*retreats upstream* over the years, eating its way back into the hills.\n\n" +
    "Falling water carries real force — which is why waterfalls are valued for **hydroelectric " +
    "power**, as well as for tourism, trekking and photography. **Jog Falls** on the Sharavati " +
    "river in Karnataka, one of India's highest, is a spectacular example.",

  // [8] meanders
  'a5eca1f3-d5d3-4b1a-86dd-9dd613c8779e':
    "When a river reaches gentler ground it almost never runs straight — it begins to swing in " +
    "sweeping curves called **meanders**. Here is the engine that drives them: on the **outer edge " +
    "of a bend** the water runs faster and deeper, so it eats away at that bank (erosion); on the " +
    "**inner edge** the water moves slowly, so it drops its sand and silt there instead " +
    "(deposition). Cut away one side while building up the other, bend after bend, and the loops " +
    "grow larger and more exaggerated with every passing year.\n\n" +
    "Those inner banks get layered with fresh, fertile soil — which is exactly why farmers and " +
    "whole villages settle along meandering rivers, and why the bends are used for irrigation, " +
    "navigation and even tourism. The **Grand Anicut (Kallanai)** across the Kaveri in Tamil " +
    "Nadu — built over 1,800 years ago and *still* diverting water for farmers today — shows how " +
    "old this partnership between people and river bends really is.",

  // [12] deltas
  '4f47c3e9-73c5-4a55-bee3-7204e5be2b78':
    "At the very end of its journey the river runs into the still water of a sea, ocean or lake — " +
    "and stops pushing forward. The instant it loses that push, it can no longer hold the enormous " +
    "load of silt and sand it has carried for hundreds of kilometres, so it dumps everything right " +
    "at its mouth. Layer piles on layer until a brand-new, low, fan-shaped or triangular piece of " +
    "land rises out of the water: a **delta**, usually split by the river into many branching " +
    "channels called **distributaries**.\n\n" +
    "Because a delta is built from fine river silt, it is some of the most fertile land on Earth — " +
    "ideal for **rice and jute** — and the meeting of fresh and salt water makes it rich fishing " +
    "ground, which is why deltas so often carry dense populations and busy trade routes. The catch " +
    "is that this same flat, low land **floods very easily**, especially when a storm shoves the " +
    "sea inland.",
};

// New Sundarbans teaching block — inserted right after the deltas text block.
const SUNDARBANS = {
  id: crypto.randomUUID(),
  type: 'callout',
  variant: 'india_science',
  title: "The Sundarbans — the World's Largest Mangrove Delta",
  markdown:
    "Where the **Ganga, Brahmaputra and Meghna** rivers empty into the Bay of Bengal, they build " +
    "the largest delta on the planet — and on it grows the **Sundarbans**, the biggest mangrove " +
    "forest in the world, shared between India (West Bengal) and Bangladesh.\n\n" +
    "What makes it so unusual is that it is **tidal**: twice every day the sea floods in and drains " +
    "back out, so the land is never purely river nor purely sea, but a shifting maze of salt-" +
    "tolerant mangrove islands and channels. Mangroves are special trees that can live with their " +
    "roots soaking in salty water — and their dense, tangled roots do something remarkable. They " +
    "**soak up the force of the cyclones and storm surges** that sweep in from the Bay of Bengal, " +
    "standing like a living wall that shields the millions of people living further inland.\n\n" +
    "It is also the only mangrove home of the **Royal Bengal tiger**, which here has learned to " +
    "swim between the islands and hunt across the tides. For all of this, the Sundarbans is a " +
    "**UNESCO World Heritage Site** — not merely 'a delta popular with tourists,' but one of the " +
    "most extraordinary and important landscapes in all of India.",
};

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: SLUG });
    if (!page) throw new Error('page not found: ' + SLUG);

    const out = [];
    for (const b of page.blocks) {
      // rewrite target text blocks in place
      if (b.type === 'text' && REWRITES[b.id]) {
        out.push({ ...b, markdown: REWRITES[b.id] });
      } else {
        out.push(b);
      }
      // insert Sundarbans block immediately after the deltas text block
      if (b.id === '4f47c3e9-73c5-4a55-bee3-7204e5be2b78') {
        out.push({ ...SUNDARBANS });
      }
    }

    // sanity: no image/gallery/video lost
    const countBefore = (arr, t) => arr.filter((x) => x.type === t).length;
    for (const t of ['image', 'gallery', 'video']) {
      const before = countBefore(page.blocks, t);
      const after = countBefore(out, t);
      if (after < before) throw new Error(`ABORT: ${t} blocks dropped (${before} -> ${after})`);
      console.log(`  ${t}: ${before} -> ${after} (preserved)`);
    }

    const reindexed = out.map((b, i) => ({ ...b, order: i }));
    const res = await bw.savePage(db, { slug: SLUG }, reindexed, {
      author: 'agent',
      summary:
        'Exemplar quality pass (founder feedback): rewrote the 3 river/waterfall/meander/delta ' +
        'concept paragraphs into richer teacher-English explaining mechanism + why (not reworded ' +
        'NCERT), and added a real Sundarbans teaching block replacing the one-line echo. All ' +
        'images/galleries/video preserved.',
    });
    console.log(`\n✓ ${SLUG} saved (v${res.version || '?'}) — ${reindexed.length} blocks`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
