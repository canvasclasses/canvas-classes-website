'use strict';
/**
 * Task 1 (founder 2026-06-14): end page 4 (`introduction-chemistry-matter`) with a
 * short "Measurement of Physical and Chemical Properties" intro — qualitative vs
 * quantitative observations, a measurement = symbol+number+unit, measurement as a
 * comparison, and measurement's built-in uncertainty — as a bridge into page 5
 * (the detailed measurement study). Reference-first: founder's source image.
 * Edits the existing bridge text (keeps its id) + inserts 4 blocks. Additive →
 * content-loss guard passes. Run: node scripts/refine_ch1_p4_measurement_intro.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const SLUG = 'introduction-chemistry-matter';
const BRIDGE_ID = 'aa95c7ae-67d8-4095-b852-8024e5f54c66'; // the "You can now tell substances apart…" text

function introBlocks() {
  return [
    { id: uuidv4(), type: 'heading', level: 2, text: 'Measurement of Physical and Chemical Properties',
      objective: 'Tell qualitative from quantitative observations, and see what every measurement is built from.' },
    { id: uuidv4(), type: 'text', markdown:
      "A key step in the scientific method is **observation**, and observations come in two kinds.\n\n" +
      "**Qualitative** observations carry no numbers — the colour of a chemical, its odour, or the fact that a flask turns hot when a reaction starts. **Quantitative** observations are *measurements*: they hand you a number. Weight, area, length, volume, pressure, amount of substance, acidity (pH) and temperature are all quantitative.\n\n" +
      "Chemistry leans heavily on the quantitative kind — which raises a simple question: what is a measurement actually made of?" },
    { id: uuidv4(), type: 'image', width: 'full', src: '',
      alt: 'Anatomy of a measurement: p = 1.00 × 10^5 Pa, labelled as symbol (p), number (1.00 × 10^5) and unit (Pa)',
      caption: '📸 Every measurement is a number paired with a unit (and a symbol for the quantity)',
      generation_prompt:
        "Annotated equation diagram of a single measurement: large centred expression 'p = 1.00 × 10⁵ Pa'. Three rounded callout bubbles with leader lines point to its parts — a blue bubble 'Symbol for pressure' → points to 'p'; a green bubble 'Number' → points to '1.00 × 10⁵'; a red bubble 'Unit of pressure' → points to 'Pa'. Friendly, clean, textbook style. Dark background (#0a0a0a or near-black), orange accent leader lines, clean technical illustration style." },
    { id: uuidv4(), type: 'text', markdown:
      "Two things are always true about a measurement.\n\n" +
      "**First, a measurement is a comparison.** Saying a person is *six feet* tall really means they are six times as tall as a reference length of one foot. The 'foot' is the **unit** — the agreed yardstick we compare against. Every measurement is a number *of some unit*; the number alone is meaningless.\n\n" +
      "**Second, a measurement always carries some uncertainty.** No instrument is perfect, so a little doubt clings to the last digit of any reading. Careful technique can shrink that uncertainty, but it can never be removed entirely.\n\n" +
      "On the next page we put this to work — the units, the conversions, and the tools that turn matter into reliable numbers." },
  ];
}

bw.withDb(async (db) => {
  const page = await db.collection('book_pages').findOne({ slug: SLUG });
  if (!page) throw new Error(`${SLUG} not found`);
  if ((page.blocks || []).some((b) => b.type === 'heading' && /Measurement of Physical and Chemical Properties/.test(b.text || ''))) {
    console.log('⚠  section already present — skipping (idempotent).');
    return;
  }
  const sorted = (page.blocks || []).slice().sort((a, b) => a.order - b.order);
  const bridgeIdx = sorted.findIndex((b) => b.id === BRIDGE_ID);
  if (bridgeIdx === -1) throw new Error('bridge text block not found');

  // Reword the bridge so it leads INTO the new measurement section (keep its id).
  sorted[bridgeIdx] = { ...sorted[bridgeIdx], markdown:
    "You can now tell substances apart by their **properties** — what's physical, what's chemical, and what depends on amount. But spotting a property is only half the job: science demands that we *measure* it. So before we move on, let's nail down what a measurement actually is." };

  const merged = [
    ...sorted.slice(0, bridgeIdx + 1),
    ...introBlocks(),
    ...sorted.slice(bridgeIdx + 1),
  ].map((b, i) => ({ ...b, order: i }));

  const preview = await bw.savePage(db, { slug: SLUG }, merged, { dryRun: true });
  console.log(`DRY-RUN ${SLUG}: ${sorted.length} → ${merged.length} · lossDetected=${preview.diff.lossDetected} (reasons: ${preview.diff.reasons.join('; ') || 'none'})`);
  const res = await bw.savePage(db, { slug: SLUG }, merged,
    { author: 'agent', summary: 'end page 4 with Measurement of Physical/Chemical Properties intro (qual/quant, number+unit, comparison, uncertainty)' });
  console.log(`✓ saved (v#${res.version}, ${merged.length} blocks).`);
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
