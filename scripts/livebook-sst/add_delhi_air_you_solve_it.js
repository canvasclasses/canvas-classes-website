'use strict';
// Chapter 1 flagship "You Solve It" (2026-07-10): Delhi's winter air / stubble
// burning — deliberately chosen because it is a FOUR-DISCIPLINE knot (geography +
// economics + political science + society), which reinforces this page's exact
// thesis ("one problem needs more than one discipline"). Inserted on
// four-disciplines-one-society as its capstone, after the Cyclone Fani callout,
// before the quiz. Every fact web-verified (see source_note). One you_solve_it
// added; no block removed, no media touched.
const crypto = require('crypto');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const SLUG = 'four-disciplines-one-society';
const AFTER_BLOCK_ID = '4ea3269e-98cc-4caa-88d6-3ff81c992910'; // the bridging_science callout

const BLOCK = {
  id: crypto.randomUUID(),
  type: 'you_solve_it',
  title: "Delhi Can't Breathe Each Winter — Whose Problem Is It to Fix?",
  problem:
    "Every year, as winter closes in, the air over Delhi turns genuinely dangerous to breathe — " +
    "thick, grey, and thick with tiny particles that lodge deep in people's lungs. A big seasonal " +
    "part of it drifts in from the farms of neighbouring **Punjab and Haryana**, where, right after " +
    "the rice harvest, farmers set fire to the leftover **stubble** in their fields to clear them " +
    "fast for the next crop. Millions of people — children, the elderly, the sick — breathe the " +
    "result.",
  why_hard:
    "Here's what makes this so stubborn — and it's the whole lesson of this page. It isn't *one* " +
    "problem; it's four tangled into one. **Geography** decides why Delhi and why winter: cold, " +
    "still winter air traps the smoke close to the ground instead of letting it blow away. " +
    "**Economics** explains why the farmer lights the match at all: after harvesting rice there's " +
    "barely a **three-week gap** before wheat must be sown, and burning is by far the cheapest, " +
    "fastest way to clear a field — the farmer isn't a villain, just someone with almost no time " +
    "and little money. **Political Science** turns it into a tangle, because the smoke is *made* in " +
    "one state and *suffered* in another, so no single government fully owns the problem. And " +
    "**society** pays the price in millions of damaged lungs. Pull on any one thread and the others " +
    "tighten.",
  image_src: '',
  image_prompt:
    "A clean map-style infographic of the Delhi–Punjab–Haryana region in winter: farm-fire dots " +
    "across Punjab and Haryana, arrows of smoke drifting toward a hazy Delhi, and four small labelled " +
    "icons around the edge tagging the four angles — geography (trapped winter air), economics (short " +
    "harvest window), politics (smoke crossing state borders), society (public health). Dark " +
    "background, orange accent labels, clean technical illustration style.",
  image_caption:
    "One problem, four disciplines: why Delhi's winter smog is a geography, economics, politics AND society puzzle (illustration).",
  source_note:
    "Grounded in documented reporting and policy on Delhi–NCR winter air pollution and paddy-" +
    "stubble burning: the short (~3-week) rice-harvest-to-wheat-sowing window that pushes farmers to " +
    "burn; in-situ machines like the Happy Seeder and the ICAR/IARI Pusa Bio-Decomposer; the Crop " +
    "Residue Management subsidy scheme; the debate over crop diversification away from MSP-backed " +
    "paddy; and the statutory Commission for Air Quality Management (CAQM, 2021). NASA satellite data " +
    "shows farm fires fell sharply from 2018, even as Delhi's winter air stayed hazardous.",
  solutions: [
    {
      id: crypto.randomUUID(),
      label: "Give farmers machines that sow the next crop straight through the stubble",
      upside:
        "Tools like the **Happy Seeder** plant wheat directly into the field while chopping and " +
        "spreading the old straw — so nothing needs burning, and the straw rots down to enrich the " +
        "soil. It solves the problem right at its source.",
      tradeoff:
        "The machines are **expensive and fuel-hungry**. A small farmer can't afford one, may not " +
        "get one in time within that tight three-week window, and gains nothing personally from the " +
        "extra cost and effort.",
    },
    {
      id: crypto.randomUUID(),
      label: "Spray a bio-decomposer that rots the stubble into manure",
      upside:
        "The **Pusa Bio-Decomposer** (developed by India's ICAR) is a cheap microbial spray that " +
        "dissolves stubble into useful manure in about two to three weeks — turning a waste problem " +
        "into free fertiliser.",
      tradeoff:
        "It needs those **15–20 days to work** — time the farmer often doesn't have before sowing " +
        "wheat — plus the effort of spraying every field. That's why real-world adoption has stayed " +
        "slow.",
    },
    {
      id: crypto.randomUUID(),
      label: "Pay farmers to stop growing paddy altogether",
      upside:
        "No paddy means no paddy stubble — this attacks the **root cause**. Switching Punjab and " +
        "Haryana toward other crops would also save enormous amounts of the groundwater that rice " +
        "guzzles.",
      tradeoff:
        "Paddy is propped up by a **guaranteed government price and assured purchase (MSP)**. Asking " +
        "a farmer to give up a certain income for an uncertain new crop is a huge economic gamble — " +
        "and politically explosive.",
    },
    {
      id: crypto.randomUUID(),
      label: "Ban burning and fine any farmer who does it",
      upside:
        "It's fast and clear, and a national body — the **Commission for Air Quality Management** — " +
        "already exists to enforce rules across all the states at once.",
      tradeoff:
        "It **punishes farmers for a trap they didn't build**. Fines without an affordable " +
        "alternative tend to breed resentment and quiet defiance rather than cleaner air — and can " +
        "push a struggling family deeper into debt.",
    },
  ],
  prompt:
    "If you had to protect *both* Delhi's lungs and the Punjab farmer's livelihood, which would you " +
    "back — and what is the single strongest objection to your own choice?",
  reality_check:
    "In the real world, India uses a messy blend of all of these — subsidised machines, " +
    "bio-decomposer trials, some crop-switching money, and CAQM oversight — and it's working, " +
    "*partly*: satellite data shows farm fires have fallen a lot since 2018. Yet Delhi's winter air " +
    "is still dangerous, because a large share of the pollution is actually **local** — vehicles, " +
    "dust and industry — not just stubble. Notice what this really taught you: a problem that looks " +
    "like 'farmers versus the city' is in fact geography, economics, politics and society knotted " +
    "together. That is the whole point of this chapter — no single discipline, and no single state, " +
    "can untie it alone.",
};

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: SLUG });
    if (!page) throw new Error('page not found: ' + SLUG);
    const out = [];
    let inserted = false;
    for (const b of page.blocks) {
      out.push(b);
      if (b.id === AFTER_BLOCK_ID) { out.push({ ...BLOCK }); inserted = true; }
    }
    if (!inserted) throw new Error('anchor not found: ' + AFTER_BLOCK_ID);
    for (const t of ['image', 'gallery', 'video']) {
      const before = page.blocks.filter((x) => x.type === t).length;
      const after = out.filter((x) => x.type === t).length;
      if (after < before) throw new Error(`ABORT: ${t} dropped`);
    }
    const reindexed = out.map((b, i) => ({ ...b, order: i }));
    const res = await bw.savePage(db, { slug: SLUG }, reindexed, {
      author: 'agent',
      summary:
        'Added Chapter 1 flagship "You Solve It" — Delhi winter air / stubble burning, chosen as a ' +
        'four-discipline knot that reinforces this page\'s thesis. Web-verified facts, source cited. ' +
        'Inserted as page capstone before the quiz; no media touched.',
    });
    console.log(`✓ ${SLUG} saved (v${res.version || '?'}) — ${reindexed.length} blocks; you_solve_it added`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
