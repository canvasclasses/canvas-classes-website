'use strict';
// Tier 1 engagement retrofit (founder-approved, 2026-07-08) — see
// _agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md "Engagement retrofit" section for the
// audit + Singapore/Nordic research this executes. Content-only: no block removed,
// no asset unlinked, reading time only grows — content-loss guard should never fire.
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

function callout(variant, title, markdown, order = 0) {
  return { id: uuid(), type: 'callout', order, variant, title, markdown };
}
function reasoningPrompt(reasoning_type, difficulty_level, prompt, reveal, order = 0) {
  return { id: uuid(), type: 'reasoning_prompt', order, reasoning_type, prompt, reveal, difficulty_level };
}

async function insertAfter(db, slug, predicate, newBlocks, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  if (!page) throw new Error(`page not found: ${slug}`);
  const idx = page.blocks.findIndex(predicate);
  if (idx === -1) throw new Error(`insertion anchor not found on ${slug}`);
  const updated = [...page.blocks.slice(0, idx + 1), ...newBlocks, ...page.blocks.slice(idx + 1)]
    .map((b, i) => ({ ...b, order: i }));
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary });
  console.log(`✓ ${slug} — inserted ${newBlocks.length} block(s) (v${res.version})`);
}

async function patchBlockFields(db, slug, blockId, patch, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  if (!page) throw new Error(`page not found: ${slug}`);
  const idx = page.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) throw new Error(`block ${blockId} not found on ${slug}`);
  const updated = page.blocks.map((b, i) => (i === idx ? { ...b, ...patch } : b));
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary });
  console.log(`✓ ${slug} — patched block ${blockId.slice(0, 8)} (v${res.version})`);
}

async function main() {
  await bw.withDb(async (db) => {
    // ─── Ch1: how-historians-know-the-past ──────────────────────────────────
    // Fill in the existing curiosity_prompt's hint/reveal (currently null) with a
    // real hands-on activity + a career mention, then add an evidence-reasoning
    // pair (Singapore SBQ-style) building on the existing india_science callout.
    await patchBlockFields(db, 'how-historians-know-the-past', '78bc588e-94b7-4984-b97b-ed9181db9844', {
      hint: 'Look around your home for anything older than you — a coin, a stamp, an old photograph, a handwritten letter. What details do you notice?',
      reveal: "Historians call this kind of physical evidence numismatics (coins), philately (stamps) or a family archive — and professionals called archivists and numismatists study exactly these objects for a living.",
    }, 'Engagement retrofit: hands-on activity + career mention in curiosity_prompt hint/reveal');

    await insertAfter(db, 'how-historians-know-the-past', (b) => b.id === 'c0a3da3c-7afc-4b17-8e7a-6fd12f482f7f', [
      callout('evidence_pack', 'Three Clues, One Village',
        "A team of historians is investigating a small settlement abandoned around 800 years ago. They have three pieces of evidence:\n\n> **Clue A:** A copper coin found in a farmer's field, bearing a king's name and a date in a regional era.\n\n> **Clue B:** A local oral tradition, passed down through generations, that the village was abandoned after 'the river changed its path.'\n\n> **Clue C:** A layer of fine silt found half a metre below the current ground level, spread evenly across the old village site.\n\nWhich of these three would a historian trust *most* on its own, and which would need the other two to back it up before being trusted at all?"),
      reasoningPrompt('logical', 3,
        "Look again at Clues A, B and C. The silt layer (Clue C) is physical evidence, but on its own it can't say WHO lived there or WHEN. The coin (Clue A) can date the settlement fairly precisely, but only proves someone was there — not why they left. The oral tradition (Clue B) directly claims a cause, but has passed through many retellings and could have changed with each one. Based on this, what is the strongest way for a historian to actually explain why the village was abandoned?",
        "The strongest explanation almost never comes from one clue alone — it comes from checking whether all three agree. The coin dates the settlement. The silt layer is physical proof of some kind of flood or river event, and its position can be roughly dated too. If that date lines up with when the coins stop appearing, the physical evidence (silt) starts to actively confirm the oral tradition (river changing course) instead of just sitting next to it. This is exactly the method historians use in real Indian archaeology — cross-checking manuscripts, inscriptions, coins and excavated soil layers against each other, because any single source alone can be incomplete, biased, or simply silent on the question being asked."),
    ], 'Engagement retrofit: added evidence-reasoning pair (Singapore SBQ-style) after india_science callout');

    // ─── Ch2: plate-boundaries-earthquakes-and-volcanoes ───────────────────
    // Add a present-day, checkable, actionable safety fact (BIS seismic zoning).
    await insertAfter(db, 'plate-boundaries-earthquakes-and-volcanoes', (b) => b.id === '4da3c353-0e09-4689-babc-aff8648daf97', [
      callout('bridging_science', 'Which Zone Do You Live In?',
        "India is officially divided into four seismic risk zones — Zone II (least active) through Zone V (most active) — mapped by the Bureau of Indian Standards. Zone V includes the Himalayan belt, the North-East, and the Kutch region; Zone IV includes Delhi-NCR and parts of Bihar and Uttarakhand. Buildings in Zone IV and V are legally required to follow stricter earthquake-resistant construction rules than buildings in Zone II. Find out which zone your own city or town falls into — it changes how strictly the buildings around you were supposed to be built."),
    ], 'Engagement retrofit: added BIS seismic-zone real-life safety callout');

    // ─── Ch2: weathering-breaking-rock-in-place (weakest page in the audit) ─
    await patchBlockFields(db, 'weathering-breaking-rock-in-place', '9c298d3d-c057-413f-8cb1-ec7795ec447f', {
      hint: 'Look at an old stone or concrete step, a boundary wall, or a gravestone near you — does it look smooth, or rough and crumbly at the edges?',
      reveal: "If it looks rough, pitted or crumbly, weathering has already been at work on it for years — you don't need a lab to see this process, just a closer look at something ordinary.",
    }, 'Engagement retrofit: hands-on observation activity in curiosity_prompt hint/reveal');

    await insertAfter(db, 'weathering-breaking-rock-in-place', (b) => b.id === 'f8b6adcb-7844-4de0-a85e-6e69e913c11a', [
      callout('bridging_science', 'Why the Taj Mahal Is Losing Its Shine',
        "The Taj Mahal's white marble has been slowly yellowing and pitting for decades — not from age alone, but from chemical weathering. Pollutants in the air around Agra react with the marble's surface, a process sometimes called 'marble cancer.' The same chemical weathering that dissolves limestone caves is attacking one of India's most photographed monuments, which is part of why authorities restrict vehicle traffic and factories near the site. Next time you notice a discoloured or crumbling wall, a pitted stone step, or a building that looks 'eaten away' — that's the same weathering this page just described, working in real time near you."),
    ], 'Engagement retrofit: added Taj Mahal marble-weathering real-life callout (weakest page in the audit)');

    // ─── Ch2: agents-of-gradation-and-landforms-in-history ──────────────────
    await insertAfter(db, 'agents-of-gradation-and-landforms-in-history', (b) => b.id === 'ddb939e7-796c-468b-8e63-0bb0a43eda35', [
      callout('bridging_science', 'The Desert That Used to Block Armies Now Powers Cities',
        "The same difficult, dry terrain of the Thar Desert that limited large settlements and forced traders onto routes like the Silk Route is today one of India's biggest sources of solar power — the open, sun-baked land that made farming hard is ideal for solar panels. Rajasthan's Bhadla Solar Park, built on this desert landscape, is one of the largest solar power installations in the world. The same landform can matter for completely different reasons across different centuries."),
    ], 'Engagement retrofit: added present-day Thar Desert solar-power callout');

    // ─── Ch2: wind-landforms-deserts-dunes-and-oases ────────────────────────
    // Names the Thar Desert explicitly (missing despite being used two pages earlier).
    await insertAfter(db, 'wind-landforms-deserts-dunes-and-oases', (b) => b.id === '8683f39c-1d02-48d6-8ad1-2ebfe6ec32e2', [
      callout('india_science', 'How Thar Desert Villages Solved the Oasis Problem',
        "India's own Thar Desert, spread across Rajasthan and Gujarat, shows dune types like these in real life. Long before modern pipelines, desert villages here built underground rainwater-harvesting structures called kunds and tankas — essentially artificial oases — to store the little rain that falls in a very dry year. Many of these structures, some centuries old, are still used by villages today."),
    ], 'Engagement retrofit: named Thar Desert + added kunds/tankas real-life water-harvesting callout');

    // ─── Ch2: underground-water-caves-and-karst-landscapes (thin) ───────────
    await insertAfter(db, 'underground-water-caves-and-karst-landscapes', (b) => b.id === 'a15511ff-ce57-4f36-94fd-9c3b59470aa3', [
      callout('quest_continues', "India's Real Underground Country",
        "Meghalaya, in India's north-east, has some of the longest and deepest surveyed cave systems in the entire Indian subcontinent, carved into limestone over thousands of years by the same underground water process this page describes. Local Khasi and Jaintia communities have explored many of these caves for generations, and cavers continue to discover new passages today — the full underground network is thought to extend much further than what's currently mapped."),
    ], 'Engagement retrofit: named Meghalaya karst caves (page had no named place before)');

    // ─── Ch2: glacial-landforms-and-moraines — evidence-reasoning pair ──────
    // Builds on the existing Chamoli quest_continues callout — same phenomenon,
    // reframed as a Singapore-SBQ-style multi-signal reasoning task.
    await insertAfter(db, 'glacial-landforms-and-moraines', (b) => b.id === '84d9c984-d5a7-4d07-ad42-76910078b6d0', [
      callout('evidence_pack', 'Three Signals Before the Flood',
        "Scientists studying the Chamoli disaster pieced together what happened using several kinds of evidence, gathered *after* the flood had already struck:\n\n> **Signal 1 — Satellite images:** Photos taken before and after showed a large chunk of a hanging glacier and the rock face beneath it had broken away from a steep Himalayan slope.\n\n> **Signal 2 — Seismic sensors:** Instruments that normally detect earthquakes recorded a distinct vibration signal at the moment of the collapse, even though no earthquake had occurred.\n\n> **Signal 3 — River gauge data:** Water-level sensors downstream showed a sudden, extreme spike, far beyond anything a normal rainfall event could cause.\n\nWhich signal, on its own, would have been the clearest early warning that something catastrophic was happening upstream — and why might relying on just one of these three have been risky?"),
      reasoningPrompt('logical', 4,
        "Look again at the three signals. The satellite images (Signal 1) are the most direct visual proof of what broke away, but satellites only pass over a given spot occasionally — they might not catch an event in its first minutes. The seismic vibration (Signal 2) is detected instantly and monitored constantly — but on its own, it can't tell scientists whether the vibration was an earthquake, a landslide, or something else. The river gauge spike (Signal 3) is the most directly dangerous signal for people downstream, but by the time water levels spike, the flood is already arriving. Based on this, what's the strongest approach for detecting a disaster like this early?",
        "No single signal type is enough on its own — this is exactly why real disaster-monitoring systems combine multiple signal types instead of relying on any one sensor. The seismic signal can trigger an automatic alert within seconds, even before anyone knows the cause. Satellite images, checked afterward, confirm what physically happened. River gauges act as a last line of defence, catching anything the first two missed. This layered approach — combining fast-but-ambiguous signals with slower-but-certain ones — is the same reasoning historians, doctors and disaster scientists all use: cross-check multiple independent sources rather than trusting any single one completely."),
    ], 'Engagement retrofit: added Chamoli evidence-reasoning pair (Ch2 evidence_pack prototype)');

    // ─── Ch1 close: why-social-science-matters — career spotlight ──────────
    await insertAfter(db, 'why-social-science-matters', (b) => b.id === '807b5ebd-4af2-4ce7-b742-236bb83f7d67', [
      callout('career_spotlight', 'Four Disciplines, Real Jobs',
        "Every discipline in this chapter has a real, present-day career built on it. Geographers and GIS analysts (using tools like ISRO's Bhuvan) plan cities, track floods and manage disasters. Historians and archivists work in institutions like the National Archives of India and state archaeology departments, piecing together exactly the kind of evidence this chapter described. Civil servants — through exams like the UPSC — run the governance systems this chapter traced back to the Panchayati Raj. Economists at the Reserve Bank of India, NITI Aayog, and private companies make the resource-allocation decisions this chapter's family-budget example was really about. None of these are historical curiosities — they're active job titles in India today."),
    ], 'Engagement retrofit: added chapter-closing career_spotlight (Ch1) — 0/21 pages had a career tie-in before this');

    // ─── Ch2 close: shaping-the-earths-surface-toolkit — career spotlight ──
    await insertAfter(db, 'shaping-the-earths-surface-toolkit', (b) => b.id === 'aa4111c9-fe3c-4b36-90c5-753d0b49399c', [
      callout('career_spotlight', 'Who Studies These Forces For a Living',
        "Every force in this chapter is someone's actual job. Seismologists at the National Center for Seismology and the Geological Survey of India monitor plate movement and earthquake risk. Disaster management officers — coordinated through the National Disaster Management Authority (NDMA) — plan the exact kind of evacuation and rescue operations this chapter's Chamoli and Cyclone Fani examples describe. Hydrologists and geomorphologists study how rivers, glaciers and groundwater reshape land, often working with satellite data from ISRO. Civil and geotechnical engineers use everything in this chapter — rock types, weathering, slope stability — before a single road or building goes up in the hills."),
    ], 'Engagement retrofit: added chapter-closing career_spotlight (Ch2)');
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
