// Realign the Class 12 "Solutions" chapter worked-examples to the NEWER
// (rationalised) NCERT edition. The chapter currently labels 14 worked-examples
// "NCERT 2.1"–"NCERT 2.14" — but several are actually the new edition's In-text
// Questions / Exercises (mislabeled), and the new edition's solved EXAMPLES are
// numbered differently (Ex 2.1 = ethylene-glycol mole fraction, etc.).
//
// This script (a) ADDS the 4 genuinely-missing new-edition Examples (2.1, 2.3,
// 2.4, 2.5), (b) REPLACES the glucose example with the new-edition Example 2.7
// (18 g / 1 kg), and (c) RELABELS every existing block to its accurate identity
// (Example 2.x / In-text Q 2.x / Exercise 2.17). All 13 new-edition Examples
// (2.1–2.13) end up present + correctly numbered; In-text/Exercise blocks stay
// (lossless, clearly labelled). Every write goes through book-writer.savePage
// (snapshots prior version + content-loss guard + audit — §0.6).
//
// Dry-run by default; pass --apply to write.
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bw = require('../lib/book-writer');

const APPLY = process.argv.includes('--apply');
const EX = 'solved_example';      // variant for a numbered solved Example
const IN = 'ncert_intext';        // variant for an In-text Question / Exercise

const we = (label, variant, problem, solution) =>
  ({ id: uuidv4(), type: 'worked_example', order: 0, label, variant, problem, solution, reveal_mode: 'tap_to_reveal' });

// ── the 4 new Examples to ADD + the 1 to REPLACE (verbatim new-edition text) ──
const EX_2_1 = we('NCERT 2.1', EX,
  'Calculate the mole fraction of ethylene glycol ($\\ce{C2H6O2}$) in a solution containing 20% of $\\ce{C2H6O2}$ by mass.',
  'Take 100 g of solution → 20 g ethylene glycol + 80 g water.\n\n' +
  'Molar mass of $\\ce{C2H6O2}$ $= 12\\times2 + 1\\times6 + 16\\times2 = 62$ g mol⁻¹.\n\n' +
  'Moles of $\\ce{C2H6O2}$ $= \\frac{20}{62} = 0.322$ mol\n\n' +
  'Moles of water $= \\frac{80}{18} = 4.444$ mol\n\n' +
  '$x_{\\text{glycol}} = \\frac{0.322}{0.322 + 4.444} = 0.068$, and $x_{\\text{water}} = 1 - 0.068 = 0.932$.');

const EX_2_3 = we('NCERT 2.3', EX,
  'Calculate the molality of a solution containing 2.5 g of ethanoic acid ($\\ce{CH3COOH}$) in 75 g of benzene.',
  'Molar mass of $\\ce{CH3COOH}$ $= 60$ g mol⁻¹.\n\n' +
  'Moles of ethanoic acid $= \\frac{2.5}{60} = 0.0417$ mol\n\n' +
  'Mass of benzene $= 75$ g $= 0.075$ kg\n\n' +
  'Molality $m = \\frac{0.0417}{0.075} = 0.556$ mol kg⁻¹.');

const EX_2_4 = we('NCERT 2.4', EX,
  'If $\\ce{N2}$ gas is bubbled through water at 293 K, how many millimoles of $\\ce{N2}$ gas would dissolve in 1 litre of water? Assume that $\\ce{N2}$ exerts a partial pressure of 0.987 bar. Given that Henry’s law constant for $\\ce{N2}$ at 293 K is 76.48 kbar.',
  'By Henry’s law, $x = \\frac{p}{K_H} = \\frac{0.987}{76480} = 1.29\\times10^{-5}$.\n\n' +
  '1 litre of water contains 55.5 mol. If $n$ is the moles of $\\ce{N2}$ dissolved,\n\n' +
  '$x = \\frac{n}{n + 55.5} \\approx \\frac{n}{55.5} = 1.29\\times10^{-5}$\n\n' +
  '$n = 1.29\\times10^{-5}\\times55.5 = 7.16\\times10^{-4}$ mol $=$ **0.716 mmol**.');

const EX_2_5 = we('NCERT 2.5', EX,
  'Vapour pressures of chloroform ($\\ce{CHCl3}$) and dichloromethane ($\\ce{CH2Cl2}$) at 298 K are 200 mm Hg and 415 mm Hg respectively. (i) Calculate the vapour pressure of the solution prepared by mixing 25.5 g of $\\ce{CHCl3}$ and 40 g of $\\ce{CH2Cl2}$ at 298 K, and (ii) the mole fractions of each component in the vapour phase.',
  'Molar masses: $\\ce{CH2Cl2}$ $= 85$, $\\ce{CHCl3}$ $= 119.5$ g mol⁻¹.\n\n' +
  'Moles $\\ce{CH2Cl2}$ $= \\frac{40}{85} = 0.47$; moles $\\ce{CHCl3}$ $= \\frac{25.5}{119.5} = 0.213$; total $= 0.683$ mol.\n\n' +
  '$x_{\\ce{CH2Cl2}} = \\frac{0.47}{0.683} = 0.688$, $x_{\\ce{CHCl3}} = 0.312$.\n\n' +
  '**(i)** $p_{\\text{total}} = p^0_1 + (p^0_2 - p^0_1)\\,x_2 = 200 + (415-200)\\times0.688 = 347.9$ mm Hg.\n\n' +
  '**(ii)** $p_{\\ce{CH2Cl2}} = 0.688\\times415 = 285.5$ mm Hg; $p_{\\ce{CHCl3}} = 0.312\\times200 = 62.4$ mm Hg.\n\n' +
  '$y_{\\ce{CH2Cl2}} = \\frac{285.5}{347.9} = 0.82$; $y_{\\ce{CHCl3}} = \\frac{62.4}{347.9} = 0.18$. The vapour is richer in the more volatile $\\ce{CH2Cl2}$.');

const EX_2_7 = {
  problem: '18 g of glucose ($\\ce{C6H12O6}$) is dissolved in 1 kg of water in a saucepan. At what temperature will this water boil at 1.013 bar? $K_b$ for water is 0.52 K kg mol⁻¹.',
  solution: 'Moles of glucose $= \\frac{18}{180} = 0.1$ mol; mass of water $= 1$ kg, so molality $m = 0.1$ mol kg⁻¹.\n\n' +
    '$\\Delta T_b = K_b \\times m = 0.52 \\times 0.1 = 0.052$ K.\n\n' +
    'Since water boils at 373.15 K at 1.013 bar, the boiling point of the solution $= 373.15 + 0.052 =$ **373.202 K**.',
};

// ── per-page plan ──
// relabel: { blockId: {label, variant} }  | replace: { blockId: {label,variant,problem,solution} }
// add:     [ {block, beforeId} ]  (insert new Example immediately before the anchor block)
const PLAN = {
  'concentration-part-1': {
    relabel: {
      '77b35311-6369-404b-899f-34152b3b162b': { label: 'NCERT — In-text Question 2.1', variant: IN },
      '5c958a94-474f-42ea-808c-ddd991497044': { label: 'NCERT — In-text Question 2.2', variant: IN },
    },
    add: [{ block: EX_2_1, beforeId: '77b35311-6369-404b-899f-34152b3b162b' }],
  },
  'concentration-part-2': {
    relabel: {
      '558683db-3abe-40ca-bb88-bd72556e19d4': { label: 'NCERT 2.2', variant: EX },          // NaOH molarity = Example 2.2
      '2c23d50a-3980-4fd8-b086-bc65cdb2de85': { label: 'NCERT — In-text Question 2.4', variant: IN }, // urea = In-text 2.4
    },
    add: [{ block: EX_2_3, beforeId: '2c23d50a-3980-4fd8-b086-bc65cdb2de85' }],              // Example 2.3 after NaOH, before urea
  },
  'henrys-law': {
    relabel: {
      'd2f3fb50-5795-4594-908e-0bdcc160e63a': { label: 'NCERT — In-text Question 2.7', variant: IN }, // CO2 = In-text 2.7
    },
    add: [{ block: EX_2_4, beforeId: 'd2f3fb50-5795-4594-908e-0bdcc160e63a' }],
  },
  'raoults-law': {
    relabel: {
      '3148a3ee-274e-4373-a2cf-0150dae28b63': { label: 'NCERT 2.6', variant: EX },           // benzene VP molar mass = Example 2.6
    },
    add: [{ block: EX_2_5, beforeId: '3148a3ee-274e-4373-a2cf-0150dae28b63' }],
  },
  'colligative-properties-intro': {
    relabel: {
      'a62f8302-d713-4d23-961a-71de6edc614d': { label: 'NCERT — Exercise 2.17', variant: IN }, // VP 1 molal = Exercise 2.17
    },
    add: [],
  },
  'boiling-point-elevation': {
    relabel: {
      '60200902-9a17-45ca-b391-9294b34a9fea': { label: 'NCERT 2.8', variant: EX },           // benzene Kb = Example 2.8
    },
    add: [],
  },
  'freezing-point-depression': {
    relabel: {
      '5bc58d6b-1298-4f27-8d4b-5aa9b5693bde': { label: 'NCERT 2.9', variant: EX },            // EG FP = Example 2.9
      'b2603ae3-71ce-4f88-95e6-4c3ec2d30263': { label: 'NCERT 2.10', variant: EX },           // unknown benzene = Example 2.10
    },
    add: [],
  },
  'osmosis-osmotic-pressure': {
    relabel: {
      'ae942f09-fb78-47fc-aed4-594cb2dc36da': { label: 'NCERT 2.11', variant: EX },           // protein = Example 2.11
    },
    add: [],
  },
  'vant-hoff-factor': {
    relabel: {
      '1aaa4f5a-c331-4548-a0d7-de4ecc61e7d9': { label: 'NCERT 2.12', variant: EX },           // benzoic = Example 2.12
      'd66954db-c2c5-46f6-8b94-738904bf1f85': { label: 'NCERT 2.13', variant: EX },           // acetic = Example 2.13
    },
    add: [],
  },
};
// glucose replace (Example 2.7) — keyed by real id
const GLUCOSE_ID = 'cb8072c5-ef0b-4aba-babd-9fd3d01200e3';

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'ncert-simplified-12' });
  console.log(APPLY ? '=== APPLY (book-writer, versioned) ===' : '=== DRY-RUN ===');

  for (const [slug, plan] of Object.entries(PLAN)) {
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug });
    if (!page) { console.log(`  ! page ${slug} not found`); continue; }
    let blocks = (page.blocks || []).map((b) => ({ ...b }));

    // relabel
    for (const b of blocks) {
      if (plan.relabel && plan.relabel[b.id]) Object.assign(b, plan.relabel[b.id]);
    }
    // replace glucose example content (boiling-point-elevation only)
    if (slug === 'boiling-point-elevation') {
      const g = blocks.find((b) => b.id === GLUCOSE_ID);
      if (g) Object.assign(g, { label: 'NCERT 2.7', variant: EX, problem: EX_2_7.problem, solution: EX_2_7.solution });
      else console.log('  ! glucose block id not matched on boiling-point-elevation');
    }
    // insert new Example blocks before their anchors
    for (const a of (plan.add || [])) {
      const idx = blocks.findIndex((b) => b.id === a.beforeId);
      if (idx === -1) { console.log(`  ! anchor ${a.beforeId} not found on ${slug}`); continue; }
      blocks.splice(idx, 0, { ...a.block, id: uuidv4() });
    }
    // reassign order sequentially (sort key only)
    blocks.forEach((b, i) => { b.order = i; });

    const res = await bw.savePage(db, { pageId: page._id }, blocks,
      { author: 'realign-solutions-examples', summary: 'Realign worked-examples to the rationalised NCERT edition (renumber + add Ex 2.1/2.3/2.4/2.5/2.7)', dryRun: !APPLY });
    const we = blocks.filter((b) => b.type === 'worked_example');
    if (!APPLY) {
      console.log(`  ${slug}: ${page.blocks.length}→${blocks.length} blocks · ${we.length} worked-ex · loss=${res.wouldBlock ? 'WOULD BLOCK' : 'no'}`);
    } else {
      console.log(`  ${slug}: saved v${res.version} · ${we.length} worked-ex`);
    }
  }
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
