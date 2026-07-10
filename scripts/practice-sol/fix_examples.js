// Correctness fixes to the realigned Solutions worked-examples (found by the
// verification pass). The earlier realign RELABELED several Example blocks but
// left OLD-edition content under the new numbers; this replaces their
// problem+solution with the NEW-edition verbatim text/answers. Labels/variants
// are already correct from the realign — only `problem` + `solution` change.
// Every write via book-writer.savePage (versioned + content-loss guard).
// Dry-run by default; pass --apply.
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bw = require('../lib/book-writer');
const APPLY = process.argv.includes('--apply');

// blockId → { problem, solution }  (new-edition verbatim)
const FIX = {
  // raoults-law · Example 2.6 — drop the spurious "25 °C"
  '3148a3ee-274e-4373-a2cf-0150dae28b63': {
    problem: 'The vapour pressure of pure benzene at a certain temperature is 0.850 bar. A non-volatile, non-electrolyte solid weighing 0.5 g when added to 39.0 g of benzene (molar mass 78 g mol⁻¹) gives a solution whose vapour pressure is 0.845 bar. What is the molar mass of the solid substance?',
    solution: 'Given $p_1^0 = 0.850$ bar, $p = 0.845$ bar, $M_1 = 78$ g mol⁻¹, $w_2 = 0.5$ g, $w_1 = 39$ g.\n\n' +
      'Using $\\frac{p_1^0 - p}{p_1^0} = \\frac{w_2\\,M_1}{M_2\\,w_1}$:\n\n' +
      '$$\\frac{0.850 - 0.845}{0.850} = \\frac{0.5 \\times 78}{M_2 \\times 39}$$\n\n' +
      '$$M_2 = \\frac{0.5 \\times 78 \\times 0.850}{0.005 \\times 39} = 170\\ \\text{g mol}^{-1}.$$',
  },
  // boiling-point-elevation · Example 2.8 — 90 g benzene → 58 g/mol
  '60200902-9a17-45ca-b391-9294b34a9fea': {
    problem: 'The boiling point of benzene is 353.23 K. When 1.80 g of a non-volatile solute was dissolved in 90 g of benzene, the boiling point was raised to 354.11 K. Calculate the molar mass of the solute. $K_b$ for benzene is 2.53 K kg mol⁻¹.',
    solution: '$\\Delta T_b = 354.11 - 353.23 = 0.88$ K.\n\n' +
      'Using $M_2 = \\frac{K_b \\times w_2 \\times 1000}{\\Delta T_b \\times w_1}$:\n\n' +
      '$$M_2 = \\frac{2.53 \\times 1.80 \\times 1000}{0.88 \\times 90} = 58\\ \\text{g mol}^{-1}.$$',
  },
  // freezing-point-depression · Example 2.9 — fp = 270.95 K
  '5bc58d6b-1298-4f27-8d4b-5aa9b5693bde': {
    problem: '45 g of ethylene glycol ($\\ce{C2H6O2}$) is mixed with 600 g of water. Calculate (a) the freezing point depression and (b) the freezing point of the solution. ($K_f$ for water = 1.86 K kg mol⁻¹.)',
    solution: 'Moles of ethylene glycol $= \\frac{45}{62} = 0.73$ mol; mass of water $= 0.6$ kg.\n\n' +
      'Molality $m = \\frac{0.73}{0.6} = 1.2$ mol kg⁻¹.\n\n' +
      '**(a)** $\\Delta T_f = K_f \\times m = 1.86 \\times 1.2 = 2.2$ K.\n\n' +
      '**(b)** Freezing point of the solution $= 273.15 - 2.2 = 270.95$ K.',
  },
  // freezing-point-depression · Example 2.10 — 0.40 K, Kf 5.12 → 256 g/mol
  'b2603ae3-71ce-4f88-95e6-4c3ec2d30263': {
    problem: '1.00 g of a non-electrolyte solute dissolved in 50 g of benzene lowered the freezing point of benzene by 0.40 K. The freezing point depression constant of benzene is 5.12 K kg mol⁻¹. Find the molar mass of the solute.',
    solution: 'Using $M_2 = \\frac{K_f \\times w_2 \\times 1000}{\\Delta T_f \\times w_1}$:\n\n' +
      '$$M_2 = \\frac{5.12 \\times 1.00 \\times 1000}{0.40 \\times 50} = 256\\ \\text{g mol}^{-1}.$$',
  },
  // osmosis-osmotic-pressure · Example 2.11 — 61,022 g/mol
  'ae942f09-fb78-47fc-aed4-594cb2dc36da': {
    problem: '200 cm³ of an aqueous solution of a protein contains 1.26 g of the protein. The osmotic pressure of such a solution at 300 K is found to be $2.57 \\times 10^{-3}$ bar. Calculate the molar mass of the protein.',
    solution: 'Using $M_2 = \\frac{w_2\\,R\\,T}{\\pi\\,V}$ with $w_2 = 1.26$ g, $R = 0.083$ L bar K⁻¹ mol⁻¹, $T = 300$ K, $\\pi = 2.57 \\times 10^{-3}$ bar, $V = 0.200$ L:\n\n' +
      '$$M_2 = \\frac{1.26 \\times 0.083 \\times 300}{2.57 \\times 10^{-3} \\times 0.200} = 61022\\ \\text{g mol}^{-1}.$$',
  },
  // vant-hoff-factor · Example 2.12 — benzoic acid, 99.2% association
  '1aaa4f5a-c331-4548-a0d7-de4ecc61e7d9': {
    problem: '2 g of benzoic acid ($\\ce{C6H5COOH}$) dissolved in 25 g of benzene shows a depression in freezing point equal to 1.62 K. Molal depression constant for benzene is 4.9 K kg mol⁻¹. What is the percentage association of the acid if it forms a dimer in solution?',
    solution: 'Experimental (abnormal) molar mass:\n\n' +
      '$$M_2 = \\frac{K_f \\times w_2 \\times 1000}{\\Delta T_f \\times w_1} = \\frac{4.9 \\times 2 \\times 1000}{1.62 \\times 25} = 241.98\\ \\text{g mol}^{-1}.$$\n\n' +
      'Normal molar mass of benzoic acid $= 122$ g mol⁻¹, so the van’t Hoff factor\n\n' +
      '$$i = \\frac{\\text{normal molar mass}}{\\text{abnormal molar mass}} = \\frac{122}{241.98} = 0.504.$$\n\n' +
      'For dimerisation $2\\,\\ce{C6H5COOH <=> (C6H5COOH)2}$, if $x$ is the degree of association the total moles at equilibrium $= 1 - \\frac{x}{2} = i$:\n\n' +
      '$$\\frac{x}{2} = 1 - 0.504 = 0.496 \\implies x = 0.992.$$\n\n' +
      'Therefore the **degree of association of benzoic acid is 99.2%**.',
  },
  // vant-hoff-factor · Example 2.13 — acetic acid, dissociation constant
  'd66954db-c2c5-46f6-8b94-738904bf1f85': {
    problem: '0.6 mL of acetic acid ($\\ce{CH3COOH}$), having density 1.06 g mL⁻¹, is dissolved in 1 litre of water. The depression in freezing point observed for this strength of acid was 0.0205 °C. Calculate the van’t Hoff factor and the dissociation constant of the acid. ($K_f$ for water = 1.86 K kg mol⁻¹.)',
    solution: 'Mass of acetic acid $= 0.6 \\times 1.06 = 0.636$ g; moles $= \\frac{0.636}{60} = 0.0106$ mol $= n$. As the solvent is 1 L of water, molality $\\approx 0.0106$ mol kg⁻¹.\n\n' +
      'Calculated depression (no dissociation): $\\Delta T_f = K_f \\times m = 1.86 \\times 0.0106 = 0.0197$ K.\n\n' +
      '$$i = \\frac{\\text{observed }\\Delta T_f}{\\text{calculated }\\Delta T_f} = \\frac{0.0205}{0.0197} = 1.041.$$\n\n' +
      'For $\\ce{CH3COOH <=> H+ + CH3COO-}$, if $x$ is the degree of dissociation the total moles $= 1 + x = i$, so $x = 0.041$.\n\n' +
      'Dissociation constant:\n\n' +
      '$$K_a = \\frac{C x^2}{1 - x} = \\frac{0.0106 \\times (0.041)^2}{1 - 0.041} \\approx 1.86 \\times 10^{-5}.$$',
  },
  // henrys-law · In-text Question 2.7 — quantity of CO2 in 500 mL soda water under 2.5 atm
  'd2f3fb50-5795-4594-908e-0bdcc160e63a': {
    problem: 'Henry’s law constant for $\\ce{CO2}$ in water is $1.67 \\times 10^{8}$ Pa at 298 K. Calculate the quantity of $\\ce{CO2}$ in 500 mL of soda water when packed under 2.5 atm $\\ce{CO2}$ pressure at 298 K.',
    solution: 'Convert the pressure: $p_{\\ce{CO2}} = 2.5\\ \\text{atm} = 2.5 \\times 101325 = 2.533 \\times 10^{5}$ Pa.\n\n' +
      'Mole fraction of dissolved $\\ce{CO2}$:\n\n' +
      '$$x_{\\ce{CO2}} = \\frac{p}{K_H} = \\frac{2.533 \\times 10^{5}}{1.67 \\times 10^{8}} = 1.517 \\times 10^{-3}.$$\n\n' +
      '500 mL of water $\\approx 500$ g $= \\frac{500}{18} = 27.78$ mol. Since $x_{\\ce{CO2}}$ is small, moles of $\\ce{CO2}$:\n\n' +
      '$$n_{\\ce{CO2}} \\approx x_{\\ce{CO2}} \\times n_{\\text{water}} = 1.517 \\times 10^{-3} \\times 27.78 = 0.042\\ \\text{mol}.$$\n\n' +
      'Mass of $\\ce{CO2}$ $= 0.042 \\times 44 = 1.85$ g.',
  },
};

// which page each block lives on (for selecting the page to savePage)
const BLOCK_PAGE = {
  '3148a3ee-274e-4373-a2cf-0150dae28b63': 'raoults-law',
  '60200902-9a17-45ca-b391-9294b34a9fea': 'boiling-point-elevation',
  '5bc58d6b-1298-4f27-8d4b-5aa9b5693bde': 'freezing-point-depression',
  'b2603ae3-71ce-4f88-95e6-4c3ec2d30263': 'freezing-point-depression',
  'ae942f09-fb78-47fc-aed4-594cb2dc36da': 'osmosis-osmotic-pressure',
  '1aaa4f5a-c331-4548-a0d7-de4ecc61e7d9': 'vant-hoff-factor',
  'd66954db-c2c5-46f6-8b94-738904bf1f85': 'vant-hoff-factor',
  'd2f3fb50-5795-4594-908e-0bdcc160e63a': 'henrys-law',
};

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'ncert-simplified-12' });
  console.log(APPLY ? '=== APPLY (book-writer) ===' : '=== DRY-RUN ===');

  // group block ids by page
  const byPage = {};
  for (const [bid, page] of Object.entries(BLOCK_PAGE)) (byPage[page] ||= []).push(bid);

  for (const [slug, bids] of Object.entries(byPage)) {
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug });
    const blocks = (page.blocks || []).map((b) => ({ ...b }));
    let touched = 0;
    for (const bid of bids) {
      const blk = blocks.find((b) => b.id === bid);
      if (!blk) { console.log(`  ! ${slug}: block ${bid} not found`); continue; }
      blk.problem = FIX[bid].problem;
      blk.solution = FIX[bid].solution;
      touched++;
    }
    const res = await bw.savePage(db, { pageId: page._id }, blocks,
      { author: 'fix-solutions-examples', summary: 'Replace old-edition example content with new-edition verbatim (verification fixes)', dryRun: !APPLY });
    console.log(`  ${slug}: ${touched} block(s) fixed · loss=${(res.wouldBlock ? 'WOULD BLOCK' : 'no')}${APPLY ? ` · saved v${res.version}` : ''}`);
  }
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
