const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch12_solutions';
function src(year, month, day, shift) { return { exam_name: 'JEE Main', year, month, day, shift }; }

function mkSCQ(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: correctId === 'a' },
      { id: 'b', text: opts[1], is_correct: correctId === 'b' },
      { id: 'c', text: opts[2], is_correct: correctId === 'c' },
      { id: 'd', text: opts[3], is_correct: correctId === 'd' }
    ],
    answer: { correct_option: correctId },
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null
  };
}

function mkNVT(id, diff, text, answer, solution, tag, examSrc) {
  return {
    _id: uuidv4(), display_id: id, type: 'NVT',
    question_text: { markdown: text, latex_validated: false },
    options: [], answer,
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null
  };
}

const questions = [

// Q101 — Order of RLVP for A, B, C; Answer: (3) A > B > C
mkSCQ('SOL-101', 'Medium',
`A set of solutions is prepared using 180 g of water as a solvent and 10 g of different non-volatile solutes A, B and C. The relative lowering of vapour pressure in the presence of these solutes are in the order

[Given, molar mass of A = 100 g mol⁻¹; B = 200 g mol⁻¹; C = 10,000 g mol⁻¹]`,
[
  'B > C > A',
  'C > B > A',
  'A > B > C',
  'A > C > B'
],
'c',
`**Relative lowering of VP (RLVP):**
$$\\frac{\\Delta P}{P^\\circ} = x_{\\text{solute}} = \\frac{n_{\\text{solute}}}{n_{\\text{solute}} + n_{\\text{water}}}$$

For dilute solutions: $\\mathrm{RLVP} \\approx \\dfrac{n_{\\text{solute}}}{n_{\\text{water}}}$

**Moles of each solute (10 g each):**

| Solute | M (g/mol) | n = 10/M (mol) |
|---|---|---|
| A | 100 | 0.10 |
| B | 200 | 0.05 |
| C | 10,000 | 0.001 |

Higher moles → higher RLVP.

$$n_A > n_B > n_C \\Rightarrow \\mathrm{RLVP}_A > \\mathrm{RLVP}_B > \\mathrm{RLVP}_C$$

**Answer: Option (3) — A > B > C**`,
'tag_solutions_1', src(2020, 'Sep', 6, 'Evening')),

// Q102 — Volume of gas after equilibrium; Answer: 2.18 L
mkNVT('SOL-102', 'Hard',
`A cylinder containing an ideal gas (0.1 mol of 1.0 dm³) is in thermal equilibrium with a large volume of 0.5 molal aqueous solution of ethylene glycol at its freezing point. If the stoppers $S_1$ and $S_2$ (as shown in the figure) are suddenly withdrawn, the volume of the gas in litres after equilibrium is achieved will be $\\_\\_\\_\\_$.

(Given, $K_f$(water) = 2.0 K kg mol⁻¹, $R = 0.08\\ \\mathrm{dm^3\\ atm\\ K^{-1}\\ mol^{-1}}$)

![Cylinder with stoppers diagram](https://cdn.mathpix.com/cropped/bf411b36-f043-4538-b3e9-9713e0bd83a5-10.jpg?height=291&width=321&top_left_y=146&top_left_x=1448)`,
{ decimal_value: 2.18 },
`**Step 1 — Freezing point of 0.5 molal ethylene glycol solution:**
$$\\Delta T_f = K_f \\times m = 2.0 \\times 0.5 = 1.0\\ \\text{K}$$
$$T_f = 273 - 1 = 272\\ \\text{K}$$

**Step 2 — Initial conditions of gas:**
- $n = 0.1$ mol, $V_1 = 1.0$ dm³, $T_1 = 272$ K
- Initial pressure: $P_1 = \\dfrac{nRT_1}{V_1} = \\dfrac{0.1 \\times 0.08 \\times 272}{1.0} = 2.176$ atm

**Step 3 — After stoppers withdrawn, gas expands to atmospheric pressure (1 atm) at same temperature:**
$$P_1 V_1 = P_2 V_2 \\quad (\\text{isothermal})$$
$$V_2 = \\frac{P_1 V_1}{P_2} = \\frac{2.176 \\times 1.0}{1} = 2.176 \\approx 2.18\\ \\text{L}$$

**Answer: 2.18 L**`,
'tag_solutions_6', src(2020, 'Sep', 6, 'Morning')),

// Q103 — Concentration of XY; Answer: (4) 6 × 10^-2 M
mkSCQ('SOL-103', 'Medium',
`The osmotic pressure of a dilute solution of an ionic compound XY in water is four times that of a solution 0.01 M $\\mathrm{BaCl_2}$ in water. Assuming complete dissociation of the given ionic compounds in water, the concentration of XY (in mol L⁻¹) in solution is`,
[
  `$4 \\times 10^{-2}$`,
  `$16 \\times 10^{-4}$`,
  `$4 \\times 10^{-4}$`,
  `$6 \\times 10^{-2}$`
],
'd',
`**Step 1 — Effective concentration of BaCl₂:**
$$\\mathrm{BaCl_2 \\rightarrow Ba^{2+} + 2Cl^-},\\quad i = 3$$
$$\\pi_{\\mathrm{BaCl_2}} = 3 \\times 0.01 \\times RT = 0.03RT$$

**Step 2 — Osmotic pressure of XY = 4 × that of BaCl₂:**
$$\\pi_{XY} = 4 \\times 0.03RT = 0.12RT$$

**Step 3 — XY is ionic (1:1 electrolyte), $i = 2$:**
$$i_{XY} \\times C_{XY} \\times RT = 0.12RT$$
$$2 \\times C_{XY} = 0.12$$
$$C_{XY} = 0.06\\ \\text{mol/L} = 6 \\times 10^{-2}\\ \\text{mol/L}$$

**Answer: Option (4) — $6 \\times 10^{-2}$ mol/L**`,
'tag_solutions_6', src(2019, 'Apr', 9, 'Morning')),

// Q104 — Depression in FP of K2SO4 solution; Answer: (1) 0.36 K
mkSCQ('SOL-104', 'Easy',
`Molal depression constant for a solvent is 4.0 K kg mol⁻¹. The depression in the freezing point of the solvent for 0.03 mol kg⁻¹ solution of $\\mathrm{K_2SO_4}$ is:

(Assume complete dissociation of the electrolyte)`,
['0.36 K', '0.24 K', '0.18 K', '0.12 K'],
'a',
`**Step 1 — Van't Hoff factor for K₂SO₄:**
$$\\mathrm{K_2SO_4 \\rightarrow 2K^+ + SO_4^{2-}},\\quad i = 3$$

**Step 2 — Depression in FP:**
$$\\Delta T_f = i \\cdot K_f \\cdot m = 3 \\times 4.0 \\times 0.03 = 0.36\\ \\text{K}$$

**Answer: Option (1) — 0.36 K**`,
'tag_solutions_5', src(2019, 'Apr', 9, 'Evening')),

// Q105 — Lowering of VP of urea solution; Answer: (4) 0.017 mm Hg
mkSCQ('SOL-105', 'Easy',
`At room temperature, a dilute solution of urea is prepared by dissolving 0.60 g of urea in 360 g of water. If the vapour pressure of pure water at this temperature is 35 mm Hg, lowering of vapour pressure will be:

(molar mass of urea = 60 g mol⁻¹)`,
['0.028 mm Hg', '0.027 mm Hg', '0.031 mm Hg', '0.017 mm Hg'],
'd',
`**Step 1 — Moles of urea and water:**
$$n_{\\text{urea}} = \\frac{0.60}{60} = 0.01\\ \\text{mol}$$
$$n_{\\text{water}} = \\frac{360}{18} = 20\\ \\text{mol}$$

**Step 2 — Mole fraction of urea:**
$$x_{\\text{urea}} = \\frac{0.01}{0.01 + 20} = \\frac{0.01}{20.01} = 4.998 \\times 10^{-4}$$

**Step 3 — Lowering of VP (Raoult's law):**
$$\\Delta P = x_{\\text{urea}} \\times P^\\circ = 4.998 \\times 10^{-4} \\times 35 = 0.01749 \\approx 0.017\\ \\text{mm Hg}$$

**Answer: Option (4) — 0.017 mm Hg**`,
'tag_solutions_1', src(2019, 'Apr', 10, 'Morning')),

// Q106 — Ratio of BP elevations for solvents A and B; Answer: (2) 1:5
mkSCQ('SOL-106', 'Easy',
`1 g of a non-volatile non-electrolyte solute is dissolved in 100 g of two different solvents A and B whose ebullioscopic constants are in the ratio of 1:5. The ratio of the elevation in their boiling points, $\\dfrac{\\Delta T_b(A)}{\\Delta T_b(B)}$, is: (assuming they have the same molar mass)`,
['10 : 1', '1 : 5', '1 : 0.2', '5 : 1'],
'b',
`**Elevation in BP:**
$$\\Delta T_b = K_b \\cdot m = K_b \\cdot \\frac{w}{M \\cdot W_{\\text{solvent}}}$$

Since same solute ($w$, $M$) and same mass of solvent (100 g):
$$\\Delta T_b \\propto K_b$$

$$\\frac{\\Delta T_b(A)}{\\Delta T_b(B)} = \\frac{K_{b,A}}{K_{b,B}} = \\frac{1}{5}$$

**Answer: Option (2) — 1 : 5**`,
'tag_solutions_5', src(2019, 'Apr', 10, 'Evening')),

// Q107 — Osmotic pressure of urea + glucose mixture; Answer: (3) 4.92 atm
mkSCQ('SOL-107', 'Medium',
`A solution is prepared by dissolving 0.6 g of urea (molar mass = 60 g mol⁻¹) and 1.8 g of glucose (molar mass = 180 g mol⁻¹) in 100 mL of water at 27°C. The osmotic pressure of the solution is:

($R = 0.08206\\ \\mathrm{L\\ atm\\ K^{-1}\\ mol^{-1}}$)`,
['8.2 atm', '2.46 atm', '4.92 atm', '1.64 atm'],
'c',
`**Step 1 — Moles of each solute:**
$$n_{\\text{urea}} = \\frac{0.6}{60} = 0.01\\ \\text{mol}$$
$$n_{\\text{glucose}} = \\frac{1.8}{180} = 0.01\\ \\text{mol}$$

**Step 2 — Total moles:**
$$n_{\\text{total}} = 0.01 + 0.01 = 0.02\\ \\text{mol}$$

**Step 3 — Total molarity:**
$$C = \\frac{0.02}{0.100} = 0.2\\ \\text{M}$$

**Step 4 — Osmotic pressure:**
$$\\pi = CRT = 0.2 \\times 0.08206 \\times 300 = 4.924 \\approx 4.92\\ \\text{atm}$$

**Answer: Option (3) — 4.92 atm**`,
'tag_solutions_6', src(2019, 'Apr', 12, 'Evening')),

// Q108 — Relation between Kb and Kf; Answer: (1) Kb = 2Kf
mkSCQ('SOL-108', 'Easy',
`The elevation in boiling point for 1 molal solution of glucose is 2 K. The depression in freezing point for 2 molal solution of glucose in the same solvent is 2 K. The relation between $K_b$ and $K_f$ is:`,
[
  `$K_b = 2K_f$`,
  `$K_b = 1.5K_f$`,
  `$K_b = K_f$`,
  `$K_b = 0.5K_f$`
],
'a',
`**Step 1 — Find Kb:**
$$\\Delta T_b = K_b \\cdot m \\Rightarrow 2 = K_b \\times 1 \\Rightarrow K_b = 2\\ \\text{K kg mol}^{-1}$$

**Step 2 — Find Kf:**
$$\\Delta T_f = K_f \\cdot m \\Rightarrow 2 = K_f \\times 2 \\Rightarrow K_f = 1\\ \\text{K kg mol}^{-1}$$

**Step 3 — Relation:**
$$K_b = 2 = 2 \\times 1 = 2K_f$$

**Answer: Option (1) — $K_b = 2K_f$**`,
'tag_solutions_5', src(2019, 'Jan', 10, 'Evening')),

// Q109 — Water added to pure milk; Answer: (2) 3 cups water to 2 cups pure milk
mkSCQ('SOL-109', 'Medium',
`The freezing point of a diluted milk sample is found to be −0.2°C, while it should have been −0.5°C for pure milk. How much water has been added to pure milk to make the diluted sample?`,
[
  '1 cup of water to 2 cups of pure milk',
  '3 cups of water to 2 cups of pure milk',
  '1 cup of water to 3 cups of pure milk',
  '2 cups of water to 3 cups of pure milk'
],
'b',
`**Key concept:** The FP depression is proportional to the concentration of solutes. When water is added, the concentration decreases proportionally.

**Step 1 — Ratio of concentrations:**
$$\\frac{C_{\\text{diluted}}}{C_{\\text{pure}}} = \\frac{\\Delta T_{f,\\text{diluted}}}{\\Delta T_{f,\\text{pure}}} = \\frac{0.2}{0.5} = \\frac{2}{5}$$

**Step 2 — Dilution factor:**
If $V_{\\text{pure milk}} = V$ and $V_{\\text{water added}} = V_w$:
$$\\frac{V}{V + V_w} = \\frac{2}{5}$$
$$5V = 2V + 2V_w$$
$$3V = 2V_w \\Rightarrow V_w : V = 3 : 2$$

So **3 cups of water** are added to **2 cups of pure milk**.

**Answer: Option (2) — 3 cups of water to 2 cups of pure milk**`,
'tag_solutions_6', src(2019, 'Jan', 11, 'Morning')),

// Q110 — Van't Hoff factor of K2HgI4; Answer: (2) 1.8
mkSCQ('SOL-110', 'Easy',
`$\\mathrm{K_2HgI_4}$ is 40% ionised in aqueous solution. The value of its van't Hoff factor (i) is:`,
['1.6', '1.8', '20', '22'],
'b',
`**Step 1 — Dissociation of K₂HgI₄:**
$$\\mathrm{K_2HgI_4 \\rightarrow 2K^+ + HgI_4^{2-}}$$
This gives 3 ions per formula unit (n = 3).

**Step 2 — Van't Hoff factor:**
$$i = 1 + (n-1)\\alpha = 1 + (3-1)(0.40) = 1 + 0.80 = 1.80$$

**Answer: Option (2) — 1.8**`,
'tag_solutions_6', src(2019, 'Jan', 11, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (SOL-101 to SOL-110)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
