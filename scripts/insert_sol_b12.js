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

// Q111 — Molecular weight of Y; Answer: (4) 3A
mkSCQ('SOL-111', 'Medium',
`The freezing point of a 4% aqueous solution of X is equal to the freezing point of a 12% aqueous solution of Y. If the molecular weight of X is A, then the molecular weight of Y will be`,
['2A', 'A', '4A', '3A'],
'd',
`**Equal FP depression → equal molality:**

For a $w$% solution (w g solute per 100 g solution):
$$m = \\frac{w/M}{(100-w)/1000} \\approx \\frac{10w}{M} \\quad (\\text{dilute solution})$$

**Setting molalities equal:**
$$\\frac{10 \\times 4}{M_X} = \\frac{10 \\times 12}{M_Y}$$
$$\\frac{4}{A} = \\frac{12}{M_Y}$$
$$M_Y = \\frac{12A}{4} = 3A$$

**Answer: Option (4) — 3A**`,
'tag_solutions_5', src(2019, 'Jan', 12, 'Morning')),

// Q112 — Mass w of benzoic acid; Answer: (2) 2.4 g
mkSCQ('SOL-112', 'Hard',
`Molecules of benzoic acid ($\\mathrm{C_6H_5COOH}$) dimerise in 30 g of benzene. 'w' g of benzoic acid shows a depression in freezing point equal to 2 K. If the percentage association of the acid to form dimer in the solution is 80, then w is:

(Given that $K_f = 5\\ \\mathrm{K\\ mol^{-1}}$, molar mass of benzoic acid = 122 g mol⁻¹)`,
['1.0 g', '2.4 g', '1.8 g', '1.5 g'],
'b',
`**Step 1 — Van't Hoff factor for 80% dimerisation ($2A \\rightarrow A_2$):**
$$i = 1 - \\frac{\\alpha}{2} = 1 - \\frac{0.80}{2} = 1 - 0.40 = 0.60$$

**Step 2 — Molality from FP depression:**
$$\\Delta T_f = i \\cdot K_f \\cdot m$$
$$2 = 0.60 \\times 5 \\times m$$
$$m = \\frac{2}{3} = 0.667\\ \\text{mol/kg}$$

**Step 3 — Moles of benzoic acid (solvent = 30 g = 0.030 kg):**
$$n = 0.667 \\times 0.030 = 0.02\\ \\text{mol}$$

**Step 4 — Mass:**
$$w = 0.02 \\times 122 = 2.44 \\approx 2.4\\ \\text{g}$$

**Answer: Option (2) — 2.4 g**`,
'tag_solutions_6', src(2019, 'Jan', 12, 'Evening')),

// Q113 — VP of 30% (w/v) glucose solution; Answer: 23 mm Hg
mkNVT('SOL-113', 'Hard',
`The vapour pressure of 30% (w/v), aqueous solution of glucose is $\\_\\_\\_\\_$ mm Hg at 25°C.

[Given: The density of 30% (w/v), aqueous solution of glucose is 1.2 g cm⁻³ and vapour pressure of pure water is 24 mm Hg.]

(Molar mass of glucose is 180 g mol⁻¹)`,
{ integer_value: 23 },
`**Step 1 — Composition of 30% (w/v) solution:**

30% (w/v) means 30 g glucose per 100 mL solution.

Mass of 100 mL solution = $100 \\times 1.2 = 120$ g

Mass of water = $120 - 30 = 90$ g

**Step 2 — Moles:**
$$n_{\\text{glucose}} = \\frac{30}{180} = \\frac{1}{6}\\ \\text{mol}$$
$$n_{\\text{water}} = \\frac{90}{18} = 5\\ \\text{mol}$$

**Step 3 — Mole fraction of water:**
$$x_{\\text{water}} = \\frac{5}{5 + 1/6} = \\frac{5}{31/6} = \\frac{30}{31} = 0.9677$$

**Step 4 — Vapour pressure of solution:**
$$P = x_{\\text{water}} \\times P^\\circ = 0.9677 \\times 24 = 23.22 \\approx 23\\ \\text{mm Hg}$$

**Answer: 23 mm Hg**`,
'tag_solutions_1', src(2023, 'Apr', 15, 'Morning')),

// Q114 — False statement about CS2 + acetone; Answer: (2) volume < 200 mL
mkSCQ('SOL-114', 'Medium',
`At 35°C, the vapour pressure of $\\mathrm{CS_2}$, is 512 mm Hg and that of acetone is 144 mmHg. A solution of $\\mathrm{CS_2}$ in acetone has a total vapour pressure of 600 mmHg. The false statement amongst the following is:`,
[
  'Raoult\'s law is not obeyed by this system',
  'a mixture of 100 mL $\\mathrm{CS_2}$ and 100 mL acetone has a volume < 200 mL',
  '$\\mathrm{CS_2}$ and acetone are less attracted to each other than to themselves',
  'heat must be absorbed in order to produce the solution at 35°C'
],
'b',
`**Analysis — CS₂ + acetone shows positive deviation from Raoult's law:**

Total VP (600 mm Hg) > ideal VP (between 144 and 512 mm Hg for any mixture) → **positive deviation**.

Positive deviation occurs when A–B interactions are **weaker** than A–A and B–B.

**Statement (1):** Raoult's law is not obeyed — **TRUE ✓** (positive deviation)

**Statement (2):** Volume of mixture < 200 mL — **FALSE ✗**

For positive deviation, the intermolecular forces weaken upon mixing. The molecules are farther apart → volume **increases** (> 200 mL), not decreases. Volume contraction occurs for negative deviation.

**Statement (3):** CS₂ and acetone are less attracted to each other than to themselves — **TRUE ✓** (this is the cause of positive deviation)

**Statement (4):** Heat is absorbed (endothermic mixing) — **TRUE ✓** (positive deviation → $\\Delta H_{mix} > 0$)

**Answer: Option (2) — False statement**`,
'tag_solutions_3', src(2020, 'Jan', 7, 'Morning')),

// Q115 — Two beakers sealed together; Answer: (1) solution increases, solvent decreases
mkSCQ('SOL-115', 'Easy',
`Two open beakers one containing a solvent and the other containing a mixture of that solvent with a non volatile solute are together sealed in a container. Over time:`,
[
  'the volume of the solution increases and the volume of the solvent decreases',
  'the volume of the solution decreases and the volume of the solvent increases',
  'the volume of the solution and the solvent does not change',
  'the volume of the solution does not change and the volume of the solvent decreases'
],
'a',
`**Concept — Vapour pressure and distillation:**

When both beakers are sealed together:
- The **pure solvent** has higher vapour pressure than the **solution** (Raoult's law: solute lowers VP)
- Solvent molecules evaporate more readily from the pure solvent beaker
- These vapours condense preferentially into the solution beaker (lower VP)

**Net transfer:** Solvent molecules move from pure solvent → solution (via vapour phase)

**Result:**
- Volume of pure solvent **decreases**
- Volume of solution **increases**

This continues until the pure solvent beaker is completely empty or equilibrium is reached.

**Answer: Option (1) — solution increases, solvent decreases**`,
'tag_solutions_1', src(2020, 'Jan', 7, 'Evening')),

// Q116 — VP and mole fractions in vapour; Answer: (4) 500 mmHg, 0.4, 0.6
mkSCQ('SOL-116', 'Medium',
`The vapour pressures of pure liquids A and B are 400 and 600 mm Hg respectively at 298 K. On mixing the two liquids, the sum of their volumes is equal to the volume of the final mixture. The mole fraction of liquid B is 0.5 in the mixture. The vapour pressure of the final solution, the mole fractions of components A and B in the vapour phase, respectively are`,
[
  '500 mm Hg, 0.5, 0.5',
  '450 mm Hg, 0.4, 0.6',
  '450 mm Hg, 0.5, 0.5',
  '500 mm Hg, 0.4, 0.6'
],
'd',
`**Step 1 — Ideal solution (volumes additive → ideal behaviour):**
$$x_A = 0.5,\\quad x_B = 0.5$$

**Step 2 — Total vapour pressure:**
$$P_{\\text{total}} = x_A P_A^\\circ + x_B P_B^\\circ = 0.5(400) + 0.5(600) = 200 + 300 = 500\\ \\text{mm Hg}$$

**Step 3 — Mole fractions in vapour:**
$$y_A = \\frac{P_A}{P_{\\text{total}}} = \\frac{0.5 \\times 400}{500} = \\frac{200}{500} = 0.4$$
$$y_B = \\frac{P_B}{P_{\\text{total}}} = \\frac{0.5 \\times 600}{500} = \\frac{300}{500} = 0.6$$

**Answer: Option (4) — 500 mm Hg, 0.4, 0.6**`,
'tag_solutions_3', src(2019, 'Apr', 8, 'Morning')),

// Q117 — Correct statement about ideal solution M and N; Answer: (1) xM/xN > yM/yN
mkSCQ('SOL-117', 'Medium',
`Liquid M and liquid N form an ideal solution. The vapour pressures of pure liquids M and N are 450 and 700 mmHg, respectively, at the same temperature. Then correct statement is:

($x_M$ = Mole fraction of 'M' in solution; $x_N$ = Mole fraction of 'N' in solution; $y_M$ = Mole fraction of 'M' in vapour phase; $y_N$ = Mole fraction of 'N' in vapour phase;)`,
[
  `$\\dfrac{x_M}{x_N} > \\dfrac{y_M}{y_N}$`,
  `$\\dfrac{x_M}{x_N} = \\dfrac{y_M}{y_N}$`,
  `$\\dfrac{x_M}{x_N} < \\dfrac{y_M}{y_N}$`,
  `$(x_M - y_M) < (x_N - y_N)$`
],
'a',
`**Analysis:**

Since $P_N^\\circ > P_M^\\circ$ (700 > 450), N is more volatile than M.

In the vapour phase, the more volatile component N is enriched:
$$y_N > x_N \\quad \\text{and} \\quad y_M < x_M$$

**Comparing ratios:**
$$y_M = \\frac{x_M P_M^\\circ}{P_{\\text{total}}},\\quad y_N = \\frac{x_N P_N^\\circ}{P_{\\text{total}}}$$

$$\\frac{y_M}{y_N} = \\frac{x_M P_M^\\circ}{x_N P_N^\\circ} = \\frac{x_M}{x_N} \\cdot \\frac{P_M^\\circ}{P_N^\\circ} = \\frac{x_M}{x_N} \\cdot \\frac{450}{700}$$

Since $\\dfrac{450}{700} < 1$:
$$\\frac{y_M}{y_N} < \\frac{x_M}{x_N} \\Rightarrow \\frac{x_M}{x_N} > \\frac{y_M}{y_N}$$

**Answer: Option (1) — $\\dfrac{x_M}{x_N} > \\dfrac{y_M}{y_N}$**`,
'tag_solutions_3', src(2019, 'Apr', 9, 'Morning')),

// Q118 — Mass of CO2 dissolved in 1 L water; Answer: 1221 × 10^-3 g
mkNVT('SOL-118', 'Hard',
`A company dissolves 'x' amount of $\\mathrm{CO_2}$ at 298 K in 1 litre of water to prepare soda water. $X = \\_\\_\\_\\_ \\times 10^{-3}$ g (nearest integer)

(Given: partial pressure of $\\mathrm{CO_2}$ at 298 K = 0.835 bar. Henry's law constant for $\\mathrm{CO_2}$ at 298 K = 1.67 kbar. Atomic mass of H, C and O is 1, 12, and 16 g mol⁻¹, respectively)`,
{ integer_value: 1221 },
`**Step 1 — Mole fraction of CO₂ (Henry's law):**
$$x_{\\mathrm{CO_2}} = \\frac{p}{K_H} = \\frac{0.835}{1670} = 5.0 \\times 10^{-4}$$

**Step 2 — Moles of water in 1 L:**
$$n_{\\mathrm{H_2O}} = \\frac{1000}{18} = 55.56\\ \\text{mol}$$

**Step 3 — Moles of CO₂:**
$$n_{\\mathrm{CO_2}} = x_{\\mathrm{CO_2}} \\times n_{\\mathrm{H_2O}} = 5.0 \\times 10^{-4} \\times 55.56 = 0.02778\\ \\text{mol}$$

**Step 4 — Mass of CO₂ (M = 44 g/mol):**
$$m = 0.02778 \\times 44 = 1.222\\ \\text{g} = 1222 \\times 10^{-3}\\ \\text{g} \\approx 1221 \\times 10^{-3}$$

**Answer: 1221**`,
'tag_solutions_7', src(2022, 'Jun', 24, 'Evening')),

// Q119 — Correct plot for KH values; Answer: (1)
mkSCQ('SOL-119', 'Medium',
`For the solution of the gases w, x, y and z in water at 298 K, the Henry's law constants ($K_H$) are 0.5, 2, 35 and 40 kbar, respectively. The correct plot for the given data is:

(1) ![Graph 1](https://cdn.mathpix.com/cropped/bf411b36-f043-4538-b3e9-9713e0bd83a5-11.jpg?height=227&width=285&top_left_y=2067&top_left_x=287)

(2) ![Graph 2](https://cdn.mathpix.com/cropped/bf411b36-f043-4538-b3e9-9713e0bd83a5-11.jpg?height=223&width=278&top_left_y=2069&top_left_x=657)

(3) ![Graph 3](https://cdn.mathpix.com/cropped/bf411b36-f043-4538-b3e9-9713e0bd83a5-11.jpg?height=250&width=276&top_left_y=2069&top_left_x=1027)

(4) ![Graph 4](https://cdn.mathpix.com/cropped/bf411b36-f043-4538-b3e9-9713e0bd83a5-11.jpg?height=246&width=287&top_left_y=2069&top_left_x=1388)`,
['Graph (1)', 'Graph (2)', 'Graph (3)', 'Graph (4)'],
'a',
`**Henry's law:** $p = K_H \\cdot x$

A plot of partial pressure ($p$) vs mole fraction ($x$) gives a straight line through the origin with slope = $K_H$.

**Key relationships:**
- Higher $K_H$ → steeper slope → gas is less soluble
- Lower $K_H$ → shallower slope → gas is more soluble

**Ordering by $K_H$:**
$$K_{H,w} = 0.5 < K_{H,x} = 2 < K_{H,y} = 35 < K_{H,z} = 40$$

The correct graph shows four lines through the origin with slopes in the order: w (least steep) < x < y < z (most steep).

**Answer: Option (1) — Graph showing lines with correct slope ordering**`,
'tag_solutions_7', src(2019, 'Apr', 8, 'Evening')),

// Q120 — Osmosis direction in CuSO4/K2Cr2O7 system; Answer: (1) Molarity of CuSO4 lowered
mkSCQ('SOL-120', 'Medium',
`0.05 M $\\mathrm{CuSO_4}$ when treated with 0.01 M $\\mathrm{K_2Cr_2O_7}$ gives green colour solution of $\\mathrm{Cu_2Cr_2O_7}$. The two solutions are separated as shown below: [SPM: Semi Permeable Membrane]

| $\\mathrm{K_2Cr_2O_7}$ | $\\mathrm{CuSO_4}$ |
|---|---|
| Side X | SPM |

Due to osmosis:`,
[
  'Molarity of $\\mathrm{CuSO_4}$ solution is lowered.',
  'Molarity of $\\mathrm{K_2Cr_2O_7}$ solution is lowered.',
  'Green colour formation observed on side Y.',
  'Green colour formation observed on side X.'
],
'a',
`**Step 1 — Compare osmotic pressures:**

Effective concentrations (assuming complete dissociation):
- $\\mathrm{K_2Cr_2O_7}$ (i = 3): $3 \\times 0.01 = 0.03$ M effective
- $\\mathrm{CuSO_4}$ (i = 2): $2 \\times 0.05 = 0.10$ M effective

**Step 2 — Direction of osmosis:**

Osmosis occurs from lower concentration (Side X: K₂Cr₂O₇, 0.03 M effective) to higher concentration (Side Y: CuSO₄, 0.10 M effective).

Water moves from Side X → Side Y (through SPM).

**Step 3 — Effect:**
- Side X (K₂Cr₂O₇): loses water → concentration **increases**
- Side Y (CuSO₄): gains water → concentration (molarity) **decreases/lowered**

**Step 4 — Green colour:** Green colour forms when Cu²⁺ meets Cr₂O₇²⁻. Since water moves to Side Y, K₂Cr₂O₇ does NOT cross the SPM. Green colour would only form if Cr₂O₇²⁻ reaches Cu²⁺ side — this doesn't happen through SPM.

**Answer: Option (1) — Molarity of CuSO₄ solution is lowered**`,
'tag_solutions_6', src(2024, 'Apr', 9, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (SOL-111 to SOL-120)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
