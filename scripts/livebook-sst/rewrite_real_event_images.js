'use strict';
// Rewrite all real-event-tied images to a hyper-realistic photo + infographic-
// overlay style, replacing the illustrated house style (founder feedback,
// 2026-07-08 — the disaster hero read as decorative, not real). Scope
// confirmed by founder: ALL real-event images, not just the flagged hero.
// Consistent language across all 4: photorealistic documentary shot of the
// ACTUAL real place, no people, clean infographic data panel overlaid — never
// claiming to literally be a news photo of the event.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function patchBlockFields(db, slug, blockId, patch, opts, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  if (!page) throw new Error(`page not found: ${slug}`);
  const idx = page.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) throw new Error(`block ${blockId} not found on ${slug}`);
  const updated = page.blocks.map((b, i) => (i === idx ? { ...b, ...patch } : b));
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary, ...opts });
  console.log(`✓ ${slug} — patched block ${blockId.slice(0, 8)} (v${res.version})`);
}

async function main() {
  await bw.withDb(async (db) => {
    // 1. landforms-and-disasters hero — already generated+ingested (illustrated
    //    style); deliberately unlink so the placeholder shows until regenerated.
    await patchBlockFields(db, 'landforms-and-disasters', 'ff04e412-74b1-4853-88c9-30269ebd9397', {
      src: '',
      generation_prompt: "Photorealistic documentary-style image of a steep Himalayan valley in Uttarakhand — a river with a visible flood-debris path along its banks, scarred slopes above, and a partially damaged hydropower structure in the middle distance, overcast daylight, muted natural colours, no people visible. Clean infographic panel overlaid in one corner with factual labels: date '7 February 2021', location 'Chamoli district, Uttarakhand', cause 'rock-ice avalanche triggering a flash flood', affected 'hydropower project and downstream villages'. Respectful, factual, documentary tone, no additional text elsewhere on the image.",
      caption: 'An illustrative rendering of the Chamoli disaster site (Feb 2021) — not an actual photograph.',
    }, {
      allowContentLoss: true,
      lossReason: "Founder-directed style change (2026-07-08): moving all real-event images from the illustrated house style to a hyper-realistic photo + infographic style. Deliberately unlinking the old generated image so the page shows a pending placeholder until the new version is generated, rather than leaving a stale mismatched image live.",
    }, 'Cleared old illustrated hero + rewrote generation_prompt for hyper-realistic + infographic style');

    // 2. "Three Signals Before the Flood" evidence_pack — still a placeholder.
    await patchBlockFields(db, 'glacial-landforms-and-moraines', '69ca1203-9c50-4245-a80d-46c1d792690b', {
      image_prompt: "Photorealistic documentary-style image of a Himalayan river valley monitoring station at dusk, showing a seismograph instrument display, a satellite ground-receiver dish, and a river gauge post along the riverbank, composed together in one wide scene, muted natural colours, no people. Clean infographic panel overlaid showing three labelled icons in sequence: 'Satellite images', 'Seismic sensors', 'River gauge data', pointing toward a flood-warning symbol. Respectful, factual, documentary tone.",
      image_caption: 'How scientists actually pieced together what happened at Chamoli — three real signal types, none enough alone.',
    }, {}, 'Rewrote infographic prompt for hyper-realistic + infographic style (was placeholder, no regeneration needed)');

    // 3. "Should Hydropower Construction Continue Here?" perspective_scenario — placeholder.
    const p1 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'glacial-landforms-and-moraines' });
    const hydroBlock = p1.blocks.find((b) => b.type === 'perspective_scenario');
    await patchBlockFields(db, 'glacial-landforms-and-moraines', hydroBlock.id, {
      image_prompt: "Photorealistic documentary-style image of a steep Himalayan river valley with a hydropower dam and tunnel structure at its base, scarred slopes and a glacier visible above, overcast daylight, muted natural colours, no people. Clean infographic panel overlaid showing three branching labelled paths: a crane icon labelled 'Continue building', a clipboard icon labelled 'Require a fresh safety review', and a stop-sign icon labelled 'Halt construction here'. Respectful, factual, documentary tone.",
    }, {}, 'Rewrote infographic prompt for hyper-realistic + infographic style (was placeholder, no regeneration needed)');

    // 4. Western Ghats perspective_scenario — placeholder.
    const p2 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'landforms-and-disasters' });
    const ghatsBlock = p2.blocks.find((b) => b.type === 'perspective_scenario');
    await patchBlockFields(db, 'landforms-and-disasters', ghatsBlock.id, {
      image_prompt: "Photorealistic documentary-style aerial image of India's Western Ghats mountain range — dense green forested slopes, misty valleys, a winding river, natural daylight, no people or buildings prominent. Clean infographic map overlay showing two shaded zones representing two different protected-area boundaries: a larger region labelled 'Gadgil Committee, 2011' and a smaller nested region labelled 'Kasturirangan Committee, 2013 (~37%)', with a small timeline strip along the bottom: 2010 - panel formed, 2011 - Gadgil report, 2012 - second panel formed, 2013 - Kasturirangan report. Respectful, factual, documentary tone.",
    }, {}, 'Rewrote infographic prompt for hyper-realistic + infographic style (was placeholder, no regeneration needed)');
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
