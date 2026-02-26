// POC Fix Batch 4a: POC-091 to POC-095
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const fixes = [
  {
    id: 'POC-091',
    difficulty: 'Hard',
    sol: `**Step 1: Recall Carius Method for Bromine**\n\n$$\\%Br = \\frac{80}{188} \\times \\frac{m_{AgBr}}{m_{\\text{compound}}} \\times 100$$\n\nWhere molar mass of $\\ce{AgBr}$ = 108 + 80 = 188 g/mol\n\n**Step 2: Substitute Given Values**\n\n- $m_{AgBr}$ = 0.188 g\n- $m_{\\text{compound}}$ = 0.2 g\n\n$$m_{Br} = \\frac{80}{188} \\times 0.188 = \\frac{15.04}{188} = 0.080 \\text{ g}$$\n\n**Step 3: Calculate Percentage**\n\n$$\\%Br = \\frac{0.080}{0.2} \\times 100 = 40\\%$$\n\n**Answer: 40** (nearest integer)\n\n**Elegant alternative:**\n$$\\%Br = \\frac{80 \\times 0.188}{188 \\times 0.2} \\times 100 = \\frac{80 \\times 0.188}{188 \\times 0.2} \\times 100$$\n\nNotice: $\\frac{0.188}{188} = \\frac{0.2}{200}$, so the ratio $\\frac{0.188}{0.2} = 0.94$ and $\\frac{80}{188} \\times 0.94 = 0.40$, giving $\\%Br = 40\\%$.\n\n**Key Points to Remember:**\n- $\\%Br = \\frac{80}{188} \\times \\frac{m_{AgBr}}{m_{\\text{compound}}} \\times 100$\n- The nice numbers here (0.188 g AgBr, 0.2 g compound) should signal that %Br will be a clean number\n- If %Br is 40% and MW of compound is known, we can infer structure`
  },
  {
    id: 'POC-092',
    difficulty: 'Hard',
    sol: `**Step 1: Recall the Sulphur Estimation Formula**\n\n$$\\%S = \\frac{32}{233} \\times \\frac{m_{BaSO_4}}{m_{\\text{compound}}} \\times 100$$\n\nWhere molar mass of $\\ce{BaSO4}$ = 137 + 32 + 64 = **233 g/mol**\n\n**Step 2: Substitute Given Values**\n\n- $m_{BaSO_4}$ = 1.44 g\n- $m_{\\text{compound}}$ = 0.471 g\n\n$$m_S = \\frac{32}{233} \\times 1.44 = \\frac{46.08}{233} = 0.1978 \\text{ g}$$\n\n**Step 3: Calculate Percentage**\n\n$$\\%S = \\frac{0.1978}{0.471} \\times 100 = 41.99\\% \\approx \\mathbf{42\\%}$$\n\n**Answer: 42** (nearest integer)\n\n**Note:** This is essentially the same data as POC-064 (0.471 g compound, 1.4439 g BaSO₄ → 42%). The slight difference in BaSO₄ mass (1.44 vs 1.4439) gives the same nearest integer.\n\n**Key Points to Remember:**\n- $\\%S = \\frac{32}{233} \\times \\frac{m_{BaSO_4}}{m_{\\text{compound}}} \\times 100$\n- Shortcut: $\\frac{32}{233} \\approx 0.1373$\n- $\\ce{BaSO4}$ = white insoluble precipitate, used gravimetrically\n- Both halogens and sulphur use the Carius tube (sealed thick-walled tube)`
  },
  {
    id: 'POC-093',
    difficulty: 'Hard',
    sol: `**Step 1: Recall Carius Method for Chlorine**\n\n$$\\%Cl = \\frac{35.5}{143.5} \\times \\frac{m_{AgCl}}{m_{\\text{compound}}} \\times 100$$\n\nWhere molar mass of $\\ce{AgCl}$ = 107.87 + 35.5 ≈ 143.5 g/mol (using Ag = 107.87)\n\n**Step 2: Substitute Given Values**\n\n- $m_{AgCl}$ = 0.3849 g\n- $m_{\\text{compound}}$ = 0.5 g\n\n$$m_{Cl} = \\frac{35.5}{143.37} \\times 0.3849$$\n\nUsing the given atomic masses: Ag = 107.87, Cl = 35.5\n\nMolar mass of AgCl = 107.87 + 35.5 = 143.37 g/mol\n\n$$m_{Cl} = \\frac{35.5}{143.37} \\times 0.3849 = \\frac{13.664}{143.37} = 0.09531 \\text{ g}$$\n\n**Step 3: Calculate Percentage**\n\n$$\\%Cl = \\frac{0.09531}{0.5} \\times 100 = 19.06\\% \\approx \\mathbf{19\\%}$$\n\n**Answer: 19** (nearest integer)\n\n**Verification:**\n$$\\frac{35.5 \\times 0.3849}{143.37 \\times 0.5} \\times 100 = \\frac{13.664}{71.685} \\times 100 = 19.06\\% \\checkmark$$\n\n**Key Points to Remember:**\n- When given Ag = 107.87 (not 108), use exact molar mass for AgCl = 143.37 g/mol\n- The extra chlorination step (5g Cl₂ used) is irrelevant to the % calculation\n- Only the Carius data (mass of AgCl and mass of compound A) are needed`
  },
  {
    id: 'POC-094',
    difficulty: 'Hard',
    sol: `**Step 1: Identify N,N-dimethylaminopentane**\n\nN,N-dimethylaminopentane = $\\ce{C5H11N(CH3)2}$ = $\\ce{C7H17N}$\n\nMolecular formula: $\\ce{C7H17N}$\n- C: 7\n- H: 17\n- N: 1\n- Molar mass = 7(12) + 17(1) + 14 = 84 + 17 + 14 = **115 g/mol**\n\n**Step 2: Calculate Moles of N,N-dimethylaminopentane**\n\nMass of sample = 57.5 g\n$$n_{\\text{compound}} = \\frac{57.5}{115} = 0.5 \\text{ mol}$$\n\n**Step 3: Determine Moles of CuO Required**\n\nIn Dumas' method, the reaction is:\n$$\\ce{C_xH_yN + (2x + \\frac{y}{2}) CuO -> x CO2 + \\frac{y}{2} H2O + \\frac{1}{2} N2 + (2x + \\frac{y}{2}) Cu}$$\n\nFor $\\ce{C7H17N}$ (x=7, y=17, z=1):\n$$n_{CuO} \\text{ per mole of compound} = 2(7) + \\frac{17}{2} = 14 + 8.5 = 22.5 \\text{ mol CuO/mol compound}$$\n\n**Step 4: Calculate Total Moles of CuO**\n\n$$n_{CuO} = 0.5 \\text{ mol compound} \\times 22.5 \\text{ mol CuO/mol compound} = 11.25 \\text{ mol}$$\n\nThe answer is required as $x \\times 10^{-2}$:\n$$11.25 \\text{ mol} = 1125 \\times 10^{-2}$$\n\n**Answer: 1125**\n\n**Key Points to Remember:**\n- CuO required per molecule: $(2x + \\frac{y}{2})$ moles where x = C atoms, y = H atoms\n- This formula comes from: C → CO₂ needs 2 O atoms (from 2 CuO), H₂ → H₂O needs 1 O atom (from 1 CuO)\n- N,N-dimethylaminopentane: $\\ce{CH3CH2CH2CH2CH2-N(CH3)2}$ = $\\ce{C7H17N}$`
  },
  {
    id: 'POC-095',
    difficulty: 'Hard',
    sol: `**Step 1: Set Up the Kjeldahl Calculation in Reverse**\n\nGiven:\n- Mass of compound = 0.8 g\n- %N = 42%\n- Acid used: 1M $\\ce{H2SO4}$\n- Find: Volume of $\\ce{H2SO4}$ (mL)\n\n**Step 2: Calculate Mass and Moles of Nitrogen**\n\n$$m_N = \\frac{42}{100} \\times 0.8 = 0.336 \\text{ g}$$\n\n$$n_N = \\frac{0.336}{14} = 0.024 \\text{ mol}$$\n\n**Step 3: Calculate Moles of NH₃ Evolved**\n\nEach N atom gives one $\\ce{NH3}$ molecule:\n$$n_{NH_3} = n_N = 0.024 \\text{ mol}$$\n\n**Step 4: Calculate Volume of H₂SO₄ Neutralised**\n\n$\\ce{H2SO4}$ is diprotic: $\\ce{H2SO4 + 2NH3 -> (NH4)2SO4}$\n$$n_{H_2SO_4} = \\frac{n_{NH_3}}{2} = \\frac{0.024}{2} = 0.012 \\text{ mol}$$\n\nFor 1M $\\ce{H2SO4}$:\n$$V = \\frac{n}{M} = \\frac{0.012}{1} = 0.012 \\text{ L} = \\mathbf{12 \\text{ mL}}$$\n\n**Answer: 12 mL**\n\n**Verification using Kjeldahl formula:**\n$$\\%N = \\frac{1.4 \\times N_{\\text{acid}} \\times V}{W}$$\n$$42 = \\frac{1.4 \\times 2 \\times V}{0.8}$$\n$$V = \\frac{42 \\times 0.8}{1.4 \\times 2} = \\frac{33.6}{2.8} = 12 \\text{ mL} \\checkmark$$\n\n**Key Points to Remember:**\n- Reverse Kjeldahl: given %N, find volume of acid\n- $\\ce{H2SO4}$ normality = 2 × molarity (diprotic)\n- Formula: $V_{\\text{mL}} = \\frac{\\%N \\times W}{1.4 \\times N_{\\text{acid}}}$\n- For HCl (monoprotic): normality = molarity`
  }
];

async function runFix() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  for (const f of fixes) {
    const update = { $set: {} };
    if (f.q) update.$set['question_text.markdown'] = f.q;
    if (f.sol) update.$set['solution.text_markdown'] = f.sol;
    if (f.difficulty) update.$set['metadata.difficulty'] = f.difficulty;
    const res = await col.updateOne({ display_id: f.id }, update);
    console.log(`${f.id}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }
  await mongoose.disconnect();
  console.log('Done batch 4a');
}
runFix().catch(e => { console.error(e); process.exit(1); });
