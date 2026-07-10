'use strict';
// Follow-up to add_perspective_scenario.js (founder request, 2026-07-08): add
// infographics to real-event blocks (offloading comparative/timeline facts from
// text to visual), trim the Western Ghats text now that its map/timeline is
// visual, and add a second perspective_scenario instance — the real post-Chamoli
// hydropower policy debate — deepening the same Chamoli thread already central
// to Ch2 rather than introducing a scattered new event. Facts verified via web
// search before writing (2021 Uttarakhand/Chamoli flood, Aug 2021 MoEFCC
// Supreme Court affidavit, Hemant Dhyani / Char Dham High Power Committee).
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

const DIAGRAM_STYLE = 'Dark background, orange accent labels, clean technical illustration style.';

async function patchBlockFields(db, slug, blockId, patch, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  if (!page) throw new Error(`page not found: ${slug}`);
  const idx = page.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) throw new Error(`block ${blockId} not found on ${slug}`);
  const updated = page.blocks.map((b, i) => (i === idx ? { ...b, ...patch } : b));
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary });
  console.log(`✓ ${slug} — patched block ${blockId.slice(0, 8)} (v${res.version})`);
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

async function main() {
  await bw.withDb(async (db) => {
    // ─── 1. Western Ghats perspective_scenario — trim text + add infographic ──
    await patchBlockFields(db, 'landforms-and-disasters', '15ca8370-d2f0-4cd8-ae92-f1b9513e32bd', {
      event_context: "In 2010, the Ministry of Environment and Forests set up an expert panel chaired by ecologist Madhav Gadgil to study the Western Ghats — a 1,600-km mountain range and UNESCO World Heritage Site spanning six states. Its 2011 report recommended declaring the large majority of the range an Ecologically Sensitive Area. Several state governments pushed back, worried about the impact on farmers, plantation owners and local industry — so in 2012 the government set up a second panel, chaired by space scientist K. Kasturirangan, to reconsider it. Its 2013 report proposed a much smaller protected core instead. Neither report has been fully implemented to this day.",
      image_prompt: "Infographic map of India's Western Ghats mountain range running along the west coast through six states, with two overlaid shaded zones in different colours showing two different protected-area boundaries — a larger shaded region labelled 'Gadgil Committee, 2011' and a smaller, more tightly-drawn nested region labelled 'Kasturirangan Committee, 2013 (~37%)'. Small timeline strip along the bottom: 2010 - panel formed, 2011 - Gadgil report, 2012 - second panel formed, 2013 - Kasturirangan report. " + DIAGRAM_STYLE,
      image_caption: 'Two real government panels, two very different maps of how much to protect.',
    }, 'Trimmed event_context now that the infographic carries the map/timeline facts; added image_prompt');

    // ─── 2. "Three Clues, One Village" evidence_pack — add infographic ─────────
    await patchBlockFields(db, 'how-historians-know-the-past', '31b4254c-3a37-49c5-b484-afb8b7c66894', {
      image_prompt: "Infographic diagram showing three labelled evidence icons side by side: an ancient copper coin, a speech-bubble representing an oral tradition passed down through generations, and a soil cross-section showing a distinct silt layer underground. Small connecting lines between the three icons suggest a historian cross-checking them against each other. " + DIAGRAM_STYLE,
      image_caption: 'Three kinds of evidence, cross-checked against each other.',
    }, 'Added infographic to evidence_pack callout');

    // ─── 3. "Three Signals Before the Flood" evidence_pack — add infographic ──
    await patchBlockFields(db, 'glacial-landforms-and-moraines', '69ca1203-9c50-4245-a80d-46c1d792690b', {
      image_prompt: "Infographic diagram showing three labelled detection icons along a simple timeline: a satellite icon labelled 'Satellite images', a seismograph waveform icon labelled 'Seismic sensors', and a river-gauge water-level icon labelled 'River gauge data', all pointing toward a single flood-warning symbol. " + DIAGRAM_STYLE,
      image_caption: 'Three signals, none enough alone.',
    }, 'Added infographic to evidence_pack callout');

    // ─── 4. New perspective_scenario: Chamoli hydropower policy debate ─────────
    const scenario = {
      id: uuid(),
      type: 'perspective_scenario',
      order: 0,
      title: 'Should Hydropower Construction Continue Here?',
      role_frame: "You're advising the Supreme Court's expert panel on whether hydropower construction should continue in the same stretch of the Himalayas hit by the Chamoli disaster.",
      event_context: 'On 7 February 2021, a massive rock-and-ice avalanche broke away from Ronti peak in Chamoli district, triggering a flash flood down the Rishiganga and Dhauliganga rivers. It destroyed part of a large hydropower project under construction, killing or leaving missing around 200 workers at the site. Months later, in August 2021, the Ministry of Environment, Forest and Climate Change told the Supreme Court that a consensus had been reached to continue construction on seven hydropower projects in the region. Not everyone agreed.',
      image_prompt: "Infographic diagram of a steep Himalayan river valley showing a hydropower dam and tunnel structure at the base, with a small icon of a rock-and-ice avalanche breaking away from a peak above it and flowing down as a flood arrow toward the dam. Three labelled arrows branch away from the disaster site toward three icons: a construction-crane icon labelled 'Continue building', a clipboard icon labelled 'Require a fresh safety review', and a stop-sign icon labelled 'Halt construction here'. " + DIAGRAM_STYLE,
      image_caption: 'The same valley, three real answers to what should happen next.',
      source_note: "Grounded in real, documented positions taken after the February 2021 Chamoli disaster: the Ministry of Environment, Forest and Climate Change's August 2021 Supreme Court affidavit, the position of petitioners (including a CPI-ML leader) in the ongoing Supreme Court case against the Tapovan-Vishnugad project, and public statements by Hemant Dhyani, a member of the Supreme Court's own High Power Committee on the Char Dham project.",
      prompt: 'Which position would you back?',
      options: [
        {
          id: uuid(),
          label: 'Continue building — the projects are needed and can be made safer',
          real_position: "The Ministry of Environment, Forest and Climate Change's actual August 2021 position",
          perspective: "The Ministry told the Supreme Court that a consensus had been reached to continue work on seven hydropower projects, reflecting the reasoning that the region's energy needs are real, huge sums are already invested, and abandoning projects entirely wastes both money and power India needs. The tradeoff: critics point out that this project itself had just been destroyed by the exact kind of Himalayan hazard experts have long warned about, and continuing without addressing that risk could put the next set of workers in the same danger.",
        },
        {
          id: uuid(),
          label: 'Pause and require a fresh safety review before continuing',
          real_position: 'The actual position of petitioners, including a CPI-ML leader, in the Supreme Court case against this project',
          perspective: "Petitioners argued that a project damaged by a disaster of this scale shouldn't simply resume under its old environmental clearance — it should have to prove, with fresh scientific study, that it's actually safe to continue at this site before construction restarts. The tradeoff: a fresh review takes real time, during which workers already contracted for the project may lose income, and the project's energy output is delayed.",
        },
        {
          id: uuid(),
          label: 'Stop building hydropower projects in this zone altogether',
          real_position: "The position voiced by Hemant Dhyani, a member of the Supreme Court's own High Power Committee on the Char Dham project",
          perspective: "Dhyani pointed out that after Uttarakhand's 2013 Kedarnath disaster, there was already broad agreement that these fragile mountains should not be further disturbed by construction — and that this new disaster shows that agreement wasn't followed. This treats repeated Himalayan disasters as a pattern, not a one-off. The tradeoff: this is the hardest position for government and industry to accept, since it means walking away from investments already made and finding energy elsewhere.",
        },
      ],
      synthesis: "More than one hydropower project resumed construction in this same region after 2021 — this wasn't a case where the debate stopped and one side clearly won. It's the same tension India keeps returning to in the Himalayas: the region's rivers are a genuine source of clean energy, and the same steep, young, unstable mountains that make the energy possible are also what made the Chamoli disaster so severe. Real disaster scientists, courts and ministries are still working through exactly this tradeoff — not a settled question, an ongoing one.",
    };

    await insertAfter(db, 'glacial-landforms-and-moraines', (b) => b.id === '3b34e04d-3738-4c44-89f4-3c8bf6b3ce5e', [scenario],
      'Added second perspective_scenario instance (Chamoli hydropower policy debate) — deepens the existing Chamoli thread');
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
