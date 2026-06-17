'use strict';
/**
 * Adds a "Pressure and Its Measurement" section to the Ch.1 page
 * `scientific-measurement` (Class 11 Chemistry).
 *
 * WHY: States of Matter was dropped from the rationalised NCERT Class 11
 * Chemistry syllabus, so pressure + its measurement no longer has a chemistry
 * home — yet Thermodynamics needs it (w = -PΔV) and Physics only teaches it
 * mid-course in "Mechanical Properties of Fluids", not the initial chapters.
 * This plugs that gap on the measurement page, where it fits the theme.
 *
 * WHAT it inserts (14 blocks), right after Temperature and before the closing
 * summary:
 *   h2 Pressure and Its Measurement
 *   text (concept: force/area, pascal, why chemists meet it now)
 *   latex_block P = F/A
 *   table (Pa / kPa / bar / atm / torr·mmHg conversions)
 *   callout[remember] (the master conversion chain)
 *   h3 Atmospheric Pressure and the Barometer + text + image
 *   h3 Gauge / Absolute Pressure and the Manometer + text + latex + text + image
 *   worked_example (atm → kPa, mmHg)
 * Plus two surgical patches:
 *   - closing summary text: add "and pressure" to the quantity list
 *   - exam_tip callout: append the pressure chain, the R-unit trap, gauge-vs-absolute
 *
 * Writes directly to MongoDB. Idempotency-guarded. Rollback backup written to
 * scripts/_ch1_pressure_rollback_backup.json before any change.
 * Run: node scripts/refine_ch1_pressure_measurement.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const fs = require('fs');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const SLUG = 'scientific-measurement';
const HEADING = 'Pressure and Its Measurement';

// ─── Helpers (inline ports of @canvas/data/books/utils) ─────────────────────
function flattenBlocks(arr) {
  const out = [];
  for (const b of arr) {
    if (b.type === 'section' && Array.isArray(b.columns)) {
      for (const col of b.columns) out.push(...col);
    } else out.push(b);
  }
  return out;
}
function computeReadingTime(arr) {
  const flat = flattenBlocks(arr);
  let w = 0, v = 0, a = 0;
  for (const b of flat) {
    if (b.type === 'text') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'heading') w += (b.text || '').split(/\s+/).length;
    else if (b.type === 'callout') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'video') v++;
    else if (b.type === 'audio_note') a++;
  }
  return Math.max(1, Math.ceil(w / 200) + v * 2 + a);
}
const INTERACTIVE = new Set([
  'inline_quiz', 'simulation', 'video', 'molecule_3d', 'interactive_image',
  'classify_exercise', 'reasoning_prompt', 'worked_example', 'practice_link',
]);
function computeContentTypes(arr) {
  const flat = flattenBlocks(arr);
  const found = new Set();
  for (const b of flat) if (INTERACTIVE.has(b.type)) found.add(b.type);
  return [...found].sort();
}

// ─── New section blocks (order assigned on splice) ──────────────────────────
function makePressureBlocks() {
  return [
    { id: uuidv4(), type: 'heading', level: 2, text: HEADING,
      objective: 'Move between atm, bar, Pa and mmHg, and explain how a barometer and a manometer read a pressure.' },

    { id: uuidv4(), type: 'text', markdown:
      "Push a drawing pin into a board and it sinks in with almost no effort. Press the flat head of the same pin against your thumb with the same push and nothing happens. The force hasn't changed — the **area** it acts on has. Pressure is that ratio: force divided by the area it is spread over.\n\n" +
      "The SI unit of pressure is the **pascal (Pa)**: one newton of force spread over one square metre. A pascal is a very small amount of pressure (the air around you presses at roughly $101325\\,\\text{Pa}$), so in chemistry we usually work in larger units like the **atmosphere (atm)**, the **bar**, or **millimetres of mercury (mmHg)**.\n\n" +
      "Why meet pressure now, in the very first chapter? Because it is a measured physical quantity just like mass or volume, and because you will lean on it the moment you reach **thermodynamics**, where the work done by a gas is written $w = -P\\,\\Delta V$. That formula stays meaningless until you know what $P$ is and which unit it is carrying." },

    { id: uuidv4(), type: 'latex_block', latex: 'P = \\frac{F}{A}', label: 'Pressure',
      note: 'F = force in newtons (N); A = area in square metres (m²)' },

    { id: uuidv4(), type: 'table',
      caption: 'Pressure Units and How They Convert',
      headers: ['Unit', 'Symbol', 'How it relates'],
      rows: [
        ['Pascal — the SI unit', 'Pa', '1 Pa = 1 N/m²'],
        ['Kilopascal', 'kPa', '1 kPa = 1000 Pa'],
        ['Bar', 'bar', '1 bar = 10⁵ Pa = 100 kPa'],
        ['Atmosphere', 'atm', '1 atm = 101 325 Pa = 1.013 bar'],
        ['Torr / mm of mercury', 'torr · mmHg', '1 atm = 760 torr = 760 mmHg'],
      ] },

    { id: uuidv4(), type: 'callout', variant: 'remember', title: 'The one line to memorise',
      markdown: "$1\\,\\text{atm} = 101325\\,\\text{Pa} = 1.013\\,\\text{bar} = 760\\,\\text{mmHg} = 760\\,\\text{torr}$\n\nEvery pressure conversion in the syllabus comes straight out of this single chain." },

    { id: uuidv4(), type: 'heading', level: 3, text: 'Atmospheric Pressure and the Barometer' },

    { id: uuidv4(), type: 'text', markdown:
      "The **barometer** measures the pressure of the atmosphere itself. Evangelista Torricelli built the first one in 1643. He filled a long glass tube with mercury ($\\ce{Hg}$), sealed it, and turned it upside down into a dish of mercury. The column fell until it stood about **760 mm** above the dish, leaving a vacuum at the top. The weight of the air pressing down on the open dish is what holds the column up: when the air pushes harder the column rises, and when pressure drops before a storm it falls.\n\n" +
      "This is why one atmosphere is also written as **760 mmHg**. Mercury is used because it is dense. Water is so much lighter that a water barometer would need a tube over 10 metres tall to balance the same air pressure." },

    { id: uuidv4(), type: 'image', src: '', width: 'full', aspect_ratio: '3:4',
      alt: 'Mercury barometer: a sealed vertical glass tube standing in a dish of mercury, with the mercury column held at 760 mm by atmospheric pressure',
      caption: '📸 A mercury barometer — the air holds the column up at 760 mm',
      generation_prompt:
        'Mercury barometer apparatus diagram. A tall vertical glass tube sealed at the top, standing inverted in an open dish of liquid mercury at the bottom. The mercury inside the tube stands as a column with an empty vacuum space above it; the column height from the dish surface to the top of the mercury is marked "760 mm" with a vertical dimension arrow. Show a downward arrow labelled "atmospheric pressure" pushing on the exposed mercury surface in the dish. Label: Vacuum, Mercury column, 760 mm height, Mercury reservoir, Atmospheric pressure. Dark background (#0a0a0a or near-black), orange accent labels and leader lines, clean technical illustration style.' },

    { id: uuidv4(), type: 'heading', level: 3, text: 'Gauge Pressure, Absolute Pressure and the Manometer' },

    { id: uuidv4(), type: 'text', markdown:
      "A barometer reads the open air, but to measure the pressure of a gas trapped *inside* a flask we use a **manometer**. In the open-tube version, a U-shaped tube of mercury has the gas connected to one arm and the atmosphere pressing on the other. The gas pushes the mercury until the two levels settle, and the height difference between them tells you how far the gas pressure sits above or below the air outside.\n\n" +
      "That height difference is the **gauge pressure** — the reading measured on top of the atmosphere. The true total pressure is the **absolute pressure**, which adds the atmosphere back in:" },

    { id: uuidv4(), type: 'latex_block', latex: 'P_{\\text{absolute}} = P_{\\text{atmospheric}} + P_{\\text{gauge}}', label: 'Absolute pressure' },

    { id: uuidv4(), type: 'text', markdown:
      "A car tyre “at 2 bar” on the gauge is really near 3 bar absolute, because the gauge never counts the atmosphere that was already there. In chemistry calculations we almost always need the **absolute** pressure, so add the atmospheric value to any gauge reading before it goes into a formula." },

    { id: uuidv4(), type: 'image', src: '', width: 'full', aspect_ratio: '4:3',
      alt: 'Open-tube manometer: a U-shaped mercury tube with a gas flask on one arm and the open atmosphere on the other, the level difference marking the gauge pressure',
      caption: '📸 An open-tube manometer — the level difference h is the gauge pressure',
      generation_prompt:
        'Open-tube manometer apparatus diagram. A U-shaped glass tube partly filled with mercury; the left arm connects to a round gas flask labelled "gas", the right arm is open to the air. The mercury level is higher in the open arm than in the gas arm, and the vertical difference between the two levels is marked with a dimension arrow labelled "h = gauge pressure". Show a downward arrow labelled "atmospheric pressure" at the open end. Label: Gas flask, Mercury, Open to atmosphere, Height difference h, Atmospheric pressure. Dark background (#0a0a0a or near-black), orange accent labels and leader lines, clean technical illustration style.' },

    { id: uuidv4(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Try It — Convert a Pressure',
      problem: 'A gas is at a pressure of $2.5\\,\\text{atm}$. Express this in (a) kilopascals and (b) millimetres of mercury.',
      solution:
        "**Start from the master chain:** $1\\,\\text{atm} = 101.325\\,\\text{kPa} = 760\\,\\text{mmHg}$.\n\n" +
        "**(a) atm → kPa**\n$2.5\\,\\text{atm} \\times 101.325\\,\\text{kPa/atm} = 253.3\\,\\text{kPa}$\n\n" +
        "**(b) atm → mmHg**\n$2.5\\,\\text{atm} \\times 760\\,\\text{mmHg/atm} = 1900\\,\\text{mmHg}$\n\n" +
        "**Answer:** $253.3\\,\\text{kPa}$ and $1900\\,\\text{mmHg}$." },
  ];
}

const EXAM_TIP_APPEND =
  "\n\n**Pressure — memorise the chain:** $1\\,\\text{atm} = 101325\\,\\text{Pa} = 1.013\\,\\text{bar} = 760\\,\\text{mmHg} = 760\\,\\text{torr}$.\n\n" +
  "**The R-unit trap:** in $PV = nRT$ the unit of $P$ decides which $R$ you use — pressure in atm pairs with $R = 0.0821\\,\\text{L atm mol}^{-1}\\,\\text{K}^{-1}$; pressure in pascals (SI) pairs with $R = 8.314\\,\\text{J mol}^{-1}\\,\\text{K}^{-1}$. Mixing the two is the most common gas-law slip.\n\n" +
  "**Gauge vs absolute:** a pressure “read on a gauge” must be converted with $P_{\\text{abs}} = P_{\\text{atm}} + P_{\\text{gauge}}$ before it enters any equation.";

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');

    const page = await pages.findOne({ slug: SLUG });
    if (!page) throw new Error(`"${SLUG}" not found.`);

    // Rollback backup BEFORE any change.
    const backupPath = 'scripts/_ch1_pressure_rollback_backup.json';
    fs.writeFileSync(backupPath, JSON.stringify(page, null, 2));
    console.log(`✓ rollback backup written → ${backupPath}`);

    // Idempotency guard.
    if ((page.blocks || []).some((b) => b.type === 'heading' && b.text === HEADING)) {
      console.log(`⚠  "${HEADING}" heading already present — skipping (idempotent).`);
      return;
    }

    const sorted = (page.blocks || []).slice().sort((a, b) => a.order - b.order);

    // Insert anchor: the closing summary text block (starts with "You can now measure").
    let anchorIdx = sorted.findIndex(
      (b) => b.type === 'text' && (b.markdown || '').startsWith('You can now measure matter precisely')
    );
    if (anchorIdx === -1) {
      // Fallback: insert just before the exam_tip callout.
      anchorIdx = sorted.findIndex((b) => b.type === 'callout' && b.variant === 'exam_tip');
    }
    if (anchorIdx === -1) throw new Error('Could not find an insertion anchor (closing summary or exam_tip).');

    // Patch 1 — add "and pressure" to the closing summary enumeration.
    const summary = sorted.find(
      (b) => b.type === 'text' && (b.markdown || '').startsWith('You can now measure matter precisely')
    );
    if (summary && !summary.markdown.includes('pressure')) {
      summary.markdown = summary.markdown.replace(
        'length, mass, volume, density, temperature —',
        'length, mass, volume, density, temperature and pressure —'
      );
      console.log('✓ closing summary patched to mention pressure');
    }

    // Patch 2 — append pressure tips to the exam_tip callout.
    const examTip = sorted.find((b) => b.type === 'callout' && b.variant === 'exam_tip');
    if (examTip && !examTip.markdown.includes('R-unit trap')) {
      examTip.markdown = examTip.markdown + EXAM_TIP_APPEND;
      console.log('✓ exam_tip callout extended with pressure tips');
    }

    // Splice in the new section.
    const newBlocks = makePressureBlocks();
    const merged = [
      ...sorted.slice(0, anchorIdx),
      ...newBlocks,
      ...sorted.slice(anchorIdx),
    ].map((b, i) => ({ ...b, order: i }));

    console.log(`→ inserting ${newBlocks.length} blocks before "${sorted[anchorIdx].type}" at index ${anchorIdx}`);
    console.log(`  ${sorted.length} blocks → ${merged.length} blocks`);

    await pages.updateOne(
      { _id: page._id },
      {
        $set: {
          blocks: merged,
          reading_time_min: computeReadingTime(merged),
          content_types: computeContentTypes(merged),
          updated_at: new Date(),
        },
      }
    );
    console.log('  ✓ saved');

    // Summary.
    const p = await pages.findOne({ slug: SLUG });
    console.log(`\n[${SLUG}] "${p.title}" · ${p.blocks.length} blocks · ${p.reading_time_min}min read`);
    for (const b of p.blocks.slice().sort((a, c) => a.order - c.order)) {
      let s = '';
      if (b.type === 'heading') s = `(h${b.level}) ${b.text}`;
      else if (b.type === 'callout') s = `[${b.variant}] ${b.title || ''}`;
      else if (b.type === 'image') s = `alt="${(b.alt || '').slice(0, 40)}"`;
      else if (b.type === 'text') s = `"${(b.markdown || '').slice(0, 55).replace(/\n/g, ' ')}"`;
      else if (b.type === 'table') s = `"${b.caption || ''}"`;
      else if (b.type === 'latex_block') s = `${b.label || ''}`;
      else if (b.type === 'worked_example') s = `"${b.label || ''}"`;
      else if (b.type === 'inline_quiz') s = `${b.questions?.length || 0} Qs`;
      console.log(`  ${String(b.order).padEnd(3)} ${b.type.padEnd(16)} ${s}`);
    }
    console.log('\n✓ Done.');
  } finally {
    await client.close();
  }
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
