'use strict';
/**
 * Two reference-first additions to Class 11 Chem Ch.1 (founder decisions 2026-06-14):
 *  1. `scientific-measurement` — a "Length — and How We Measure It" section
 *     (units + the estimated-digit reading). NO precision instruments (vernier/
 *     screw gauge) — those live in experimental physics, per founder.  [Mittal §1.8.1, §1.10]
 *  2. `importance-of-chemistry` — a brief "Five Branches of Chemistry" section. [Mittal §1.4]
 * Additive only → content-loss guard passes. Writes via scripts/lib/book-writer.js.
 * Run: node scripts/refine_ch1_length_and_branches.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

function lengthBlocks() {
  return [
    { id: uuidv4(), type: 'heading', level: 2, text: 'Length — and How We Measure It',
      objective: 'Move between km, m, cm and mm, and read a length off a scale to the right precision.' },
    { id: uuidv4(), type: 'text', markdown:
      "Length is the most basic thing we measure, and its SI unit is the **metre (m)**. Everyday objects are sized in centimetres (cm) and millimetres (mm); distances in kilometres (km). Chemistry, though, reaches far smaller: a chemical bond is about $0.1$ nm long and an atom’s radius is a few tens of **picometres** — which is exactly why we need the very small prefixes from the last section.\n\n" +
      "The whole metric ladder for length is just powers of ten: $1\\text{ km} = 1000\\text{ m}$, and $1\\text{ m} = 100\\text{ cm} = 1000\\text{ mm}$, and $1\\text{ cm} = 10\\text{ mm}$.\n\n" +
      "In the lab, an ordinary **metre scale or ruler** (marked in millimetres) is all you need to measure the height of a liquid column or the size of a piece of apparatus. Finer instruments such as the vernier callipers and screw gauge exist for tiny lengths, but you’ll meet those in your physics practicals — here we only need to read a scale correctly." },
    { id: uuidv4(), type: 'table', caption: 'Units of Length',
      headers: ['Unit', 'Symbol', 'In metres', 'Typical use'],
      rows: [
        ['Kilometre', 'km', '1000 m', 'distances'],
        ['Metre — the SI unit', 'm', '1 m', 'height, length'],
        ['Centimetre', 'cm', '0.01 m', 'glassware, small objects'],
        ['Millimetre', 'mm', '0.001 m', 'fine scale readings'],
        ['Micrometre', 'µm', '10⁻⁶ m', 'cells, particles'],
        ['Nanometre', 'nm', '10⁻⁹ m', 'wavelengths, bond lengths'],
        ['Picometre', 'pm', '10⁻¹² m', 'atomic radii'],
      ] },
    { id: uuidv4(), type: 'text', markdown:
      "**Reading a scale — the estimated digit.** When you read a length off a ruler marked in millimetres, you write down every digit you can read off a marking *plus one more digit that you estimate* by eye between the smallest marks. A line ending between the 4.5 cm and 4.6 cm marks might be read as **4.55 cm** — the final 5 is your estimate. Because that last digit is a judgement, two careful people may differ in it by one. That tiny, unavoidable uncertainty is built into every measurement, and it’s the reason we’re careful about how many digits an answer is allowed to keep." },
    { id: uuidv4(), type: 'image', width: 'full', src: '',
      alt: 'A ruler marked in centimetres and millimetres with a line being read as 4.55 cm, the last digit estimated between the smallest marks',
      caption: '📸 The last digit of any scale reading is estimated by eye',
      generation_prompt:
        "Close-up technical illustration of a ruler/metre scale marked in centimetres with millimetre subdivisions, a horizontal object lying along it ending between the 4.5 cm and 4.6 cm marks. A callout points to the end with the reading '4.55 cm' and a small label 'last digit estimated'. Show the certain marks clearly and shade the gap being estimated. Dark background (#0a0a0a or near-black), orange accent labels and leader lines, clean technical illustration style." },
  ];
}

function branchBlocks() {
  return [
    { id: uuidv4(), type: 'heading', level: 2, text: 'The Five Branches of Chemistry',
      objective: 'Name the five branches of chemistry and what each one studies.' },
    { id: uuidv4(), type: 'text', markdown:
      "Chemistry is so vast that we split it into five overlapping branches. They share the same atoms and rules — the labels just say *which question* you’re asking. Because every other science eventually runs into atoms and molecules, chemistry sits right at the centre of them all, which is why it’s often called the **central science**." },
    { id: uuidv4(), type: 'table', caption: 'The Five Branches',
      headers: ['Branch', 'What it studies'],
      rows: [
        ['Physical Chemistry', 'How matter behaves and *why* — energy, speed of reactions, structure (this book)'],
        ['Organic Chemistry', 'Compounds of carbon — fuels, plastics, medicines, the chemistry of life’s molecules'],
        ['Inorganic Chemistry', 'Everything else — metals, minerals, salts, acids and their reactions'],
        ['Analytical Chemistry', 'What a sample contains and how much of each thing is in it'],
        ['Biochemistry', 'The chemistry happening inside living things'],
      ] },
  ];
}

async function insertBeforeHeading(db, slug, headingRegex, blocks, summary) {
  const page = await db.collection('book_pages').findOne({ slug });
  if (!page) throw new Error(`${slug} not found`);
  // idempotency: skip if the first new heading already exists
  const firstHeading = blocks.find((b) => b.type === 'heading');
  if ((page.blocks || []).some((b) => b.type === 'heading' && b.text === firstHeading.text)) {
    console.log(`⚠  ${slug}: "${firstHeading.text}" already present — skipping.`);
    return;
  }
  const sorted = (page.blocks || []).slice().sort((a, b) => a.order - b.order);
  let idx = sorted.findIndex((b) => b.type === 'heading' && headingRegex.test(b.text || ''));
  if (idx === -1) idx = sorted.length; // append if anchor missing
  const merged = [...sorted.slice(0, idx), ...blocks, ...sorted.slice(idx)].map((b, i) => ({ ...b, order: i }));
  const preview = await bw.savePage(db, { slug }, merged, { dryRun: true });
  console.log(`DRY-RUN ${slug}: ${sorted.length} → ${merged.length} · lossDetected=${preview.diff.lossDetected}`);
  const res = await bw.savePage(db, { slug }, merged, { author: 'agent', summary });
  console.log(`✓ ${slug} saved (v#${res.version}, ${merged.length} blocks).`);
}

bw.withDb(async (db) => {
  await insertBeforeHeading(db, 'scientific-measurement', /Mass and Weight/, lengthBlocks(),
    'add Length section (units + estimated-digit reading; no precision instruments) — Mittal §1.8.1/§1.10');
  await insertBeforeHeading(db, 'importance-of-chemistry', /Things you see/, branchBlocks(),
    'add Five Branches of Chemistry section — Mittal §1.4');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
