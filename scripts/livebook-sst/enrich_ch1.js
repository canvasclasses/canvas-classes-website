'use strict';
// Ch1 enrichment pass (founder request, 2026-07-05): make pages more image-rich and add
// step-by-step interactive reveals wherever a natural fit exists. Reuses existing platform
// blocks — `guided_reveal` (paced click-to-advance, built for Life Skills, explicitly
// reusable platform-wide) and `timeline` (already used across ICT/Hindi) — rather than
// inventing anything new. All content restructures existing page facts; nothing new is
// fabricated. Two pages (how-historians-know-the-past, and none other in Ch1) replace a
// static `table` with a `guided_reveal` — the only content-loss-guarded change here.
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

function guidedReveal(title, intro, steps, outro) {
  return {
    id: uuid(), type: 'guided_reveal', order: 0, title, intro,
    steps: steps.map((s) => ({ id: uuid(), kind: 'point', ...s })),
    outro,
  };
}
function timeline(title, orientation, events) {
  return { id: uuid(), type: 'timeline', order: 0, title, orientation, events: events.map((e) => ({ id: uuid(), ...e })) };
}
function image(alt, caption, generation_prompt, aspect_ratio = '3:2') {
  return {
    id: uuid(), type: 'image', order: 0, src: '', alt, caption, width: 'full', aspect_ratio,
    generation_prompt: `${generation_prompt} Dark cinematic background, atmospheric Indian-illustration style, painterly, no text overlay.`,
  };
}

async function insertAfter(db, slug, predicate, newBlocks, opts = {}) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  if (!page) throw new Error(`page not found: ${slug}`);
  const idx = page.blocks.findIndex(predicate);
  if (idx === -1) throw new Error(`insertion anchor not found on ${slug}`);
  const updated = [...page.blocks.slice(0, idx + 1), ...newBlocks, ...page.blocks.slice(idx + 1)]
    .map((b, i) => ({ ...b, order: i }));
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary: opts.summary || 'Enrichment: added image/interactive-reveal block(s)' });
  console.log(`✓ ${slug} — inserted (v${res.version})`);
}

async function replaceBlock(db, slug, predicate, replacement, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  const idx = page.blocks.findIndex(predicate);
  if (idx === -1) throw new Error(`replace anchor not found on ${slug}`);
  const updated = page.blocks.map((b, i) => (i === idx ? replacement : b)).map((b, i) => ({ ...b, order: i }));
  const res = await bw.savePage(db, { slug }, updated, {
    author: 'agent', summary, allowContentLoss: true,
    lossReason: 'Founder-directed enrichment pass: replacing a static table with a richer step-by-step guided_reveal covering the exact same content (2026-07-05).',
  });
  console.log(`✓ ${slug} — replaced (v${res.version})`);
}

async function main() {
  await bw.withDb(async (db) => {
    // P1 — add one supporting image after the "everyday life" text.
    await insertAfter(db, 'what-is-social-science',
      (b) => b.type === 'text' && /wake up in a house/.test(b.markdown || ''),
      [image(
        'Everyday systems that make up a single morning',
        '📸 The hidden systems behind an ordinary morning',
        'Illustration of a single Indian household morning scene showing a house, a breakfast table with food, a road outside, a school building, and an electricity pole with wires, all subtly connected by soft glowing lines suggesting an invisible network.'
      )]
    );

    // P2 — guided_reveal on the Panchamahabhutas (5 elements).
    await insertAfter(db, 'indias-roots-in-social-thinking',
      (b) => b.type === 'text' && /Panchamahabhutas/.test(b.markdown || '') && /five great elements/.test(b.markdown || ''),
      [guidedReveal(
        'The Five Panchamahabhutas',
        'Tap through each of the five elements ancient Indian thinkers used to describe the natural world as one connected system.',
        [
          { headline: 'Prithvi — Earth', body: 'The solid ground itself — the ancient starting point for thinking about where and how people settle, farm, and build.' },
          { headline: 'Apah — Water', body: 'Rivers, rain and groundwater — the element that decided which regions could support farming, cities, and trade.' },
          { headline: 'Agni — Fire', body: 'Heat and transformation — from cooking and metalworking to the sun that drives climate and the seasons.' },
          { headline: 'Vayu — Air', body: 'Wind and breath — invisible, but shaping weather, trade winds, and the very air settlements depend on.' },
          { headline: 'Akasha — Space', body: 'The space that holds everything else — the idea that ties earth, water, fire and air into a single connected system.' },
        ],
        'Scholars used the Panchamahabhutas to explain natural processes, the human body, and the relationship between living beings and the environment — the same interconnected view Social Science takes today.'
      )],
      { summary: 'Enrichment: added guided_reveal for the Panchamahabhutas' }
    );

    // P3 — guided_reveal on the four disciplines.
    await insertAfter(db, 'four-disciplines-one-society',
      (b) => b.type === 'text' && /draws mainly from four disciplines/.test(b.markdown || ''),
      [guidedReveal(
        'Four Disciplines, Four Lenses',
        'Tap through each discipline to see the one question it asks about society.',
        [
          { headline: 'Geography', body: 'Studies the Earth, its environments, and the relationship between people and their surroundings.' },
          { headline: 'History', body: 'Examines the human past and helps you understand how societies change over time.' },
          { headline: 'Political Science', body: 'Analyses systems of governance, power, and the rights and responsibilities of citizens.' },
          { headline: 'Economics', body: 'Explores how societies produce, distribute and use resources to meet their needs.' },
        ],
        'Each discipline asks a different question, yet all are interconnected — together they give you a complete picture of one society.'
      )],
      { summary: 'Enrichment: added guided_reveal for the four disciplines' }
    );

    // P4 — guided_reveal on geography's tools.
    await insertAfter(db, 'geography-the-study-of-place',
      (b) => b.type === 'text' && /uses maps, globes, atlases/.test(b.markdown || ''),
      [guidedReveal(
        "A Geographer's Toolkit",
        'Tap through the tools geography uses to investigate where things are, and why.',
        [
          { headline: 'Maps', body: 'The most basic tool — showing where places, features and boundaries actually sit relative to each other.' },
          { headline: 'Globes', body: 'A true-to-scale 3D model of the Earth, showing how continents and oceans relate across the whole planet at once.' },
          { headline: 'Atlases', body: 'Collections of maps and data bundled together, letting you compare physical, political and climate information side by side.' },
          { headline: 'GIS (Geographical Information System)', body: 'Digital layers of geographic data — population, elevation, rainfall — stacked on top of each other for deeper analysis.' },
          { headline: 'Infographics', body: 'Visual summaries that turn geographic data into a picture a reader can understand at a glance.' },
        ],
        "You'll see how these same tools sharpen what you can learn from a place over the next two years."
      )],
      { summary: 'Enrichment: added guided_reveal for geography tools' }
    );

    // P5 — supporting image on historiography methods.
    await insertAfter(db, 'history-the-study-of-the-past',
      (b) => b.type === 'text' && /empirical evidence/.test(b.markdown || '') && /carbon-14 dating/.test(b.markdown || ''),
      [image(
        'Tools of modern historiography',
        '📸 How modern historians reconstruct the past',
        'Illustration of historiography tools arranged together: a carbon-dating lab instrument, an archaeological dig site with brushes and exposed artefacts, and a DNA double-helix motif suggesting human genetics research, all under warm study-lamp lighting.'
      )]
    );

    // P6 — replace the flat table with a guided_reveal walking through the 4 evidence types.
    await replaceBlock(db, 'how-historians-know-the-past',
      (b) => b.type === 'table',
      guidedReveal(
        'The Four Kinds of Historical Evidence',
        'Tap through each type of evidence historians read like clues.',
        [
          { headline: 'Literary sources', body: 'Written texts — travelogues, memoirs, letters, genealogical records, folklore and revenue documents. Example: the Samaveda manuscript; the Tirukkural, preserved on palm-leaf.' },
          { headline: 'Archaeological sources', body: 'Material remains dug up and studied with scientific instruments — monuments, buildings, artefacts, sculptures. Example: a terracotta figurine from the Sindhu-Sarasvati Civilisation; a 12th-century Vishnu sculpture.' },
          { headline: 'Epigraphic sources', body: 'Inscriptions carved into stone, metal plates or rock. Example: a Brahmi inscription from the Gupta period; a Kannada inscription of Emperor Krishnadeva Raya at Hampi.' },
          { headline: 'Numismatic sources', body: "Coins, currency and medals, read through their metal, inscriptions and symbols. Example: a coin of King Samudragupta; a Mughal coin from Jahangir's reign." },
        ],
        'Four completely different objects — a manuscript, a figurine, an inscription, a coin — each telling historians something the others cannot.'
      ),
      'Enrichment: replaced static table with guided_reveal for the four evidence types'
    );

    // P7 — guided_reveal on dharma/artha/rajadharma.
    await insertAfter(db, 'political-science-power-and-governance',
      (b) => b.type === 'text' && /rajadharma/.test(b.markdown || ''),
      [guidedReveal(
        'Three Old Ideas Behind Governance',
        'Tap through the three ideas ancient Indian political thought linked together.',
        [
          { headline: 'Dharma — moral duty', body: 'The idea that a ruler and citizens alike carry a moral responsibility, not just a legal one, in how they act.' },
          { headline: 'Artha — economic well-being', body: 'Governance was never separated from the economy — a ruler was judged partly on whether people prospered.' },
          { headline: 'Rajadharma — the duties of the ruler', body: 'A specific code of what a ruler owed their people — protection, fair taxation, and welfare — not just the right to command them.' },
        ],
        "These three ideas together are why ancient Indian political thought saw power as a responsibility, not a privilege — a thread that runs straight through to institutions like the Panchayati Raj today."
      )],
      { summary: 'Enrichment: added guided_reveal for dharma/artha/rajadharma' }
    );

    // P8 — timeline of India's economic journey.
    await insertAfter(db, 'economics-choices-and-resources',
      (b) => b.type === 'text' && /widespread poverty, recurrent famines/.test(b.markdown || ''),
      [timeline("India's Economic Journey", 'vertical', [
        { label: 'Pre-colonial strength', detail: "For centuries, India was one of the world's leading economies — a major centre of trade, industry and maritime activity.", icon: 'ship' },
        { label: 'Colonial disruption', detail: 'Colonial rule caused widespread poverty, recurrent famines, and the decline of traditional industries.', icon: 'trending-down' },
        { label: 'Post-independence rebuilding', detail: 'India began the long task of rebuilding its economy from the ground up.', icon: 'hammer' },
        { label: 'Recent decades', detail: 'Real progress through better infrastructure, education, technology, falling poverty and rising life expectancy — alongside the ongoing challenge of reaching every section of society.', icon: 'trending-up' },
      ])],
      { summary: "Enrichment: added timeline for India's economic journey" }
    );

    // P9 — supporting image on civic participation.
    await insertAfter(db, 'why-social-science-matters',
      (b) => b.type === 'text' && /Laws, rights and responsibilities guide/.test(b.markdown || ''),
      [image(
        'Citizens participating in local civic life',
        '📸 A citizen, informed and taking part',
        'Illustration of Indian citizens of different ages participating in a local civic meeting or public discussion, some raising hands to speak, a ballot box or notice board visible in the background, warm community atmosphere.'
      )]
    );
  });
}
main().catch((e) => { console.error('❌', e); process.exit(1); });
