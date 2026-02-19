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

// Q21 — Molecular mass of solute from boiling point elevation; Answer: 100 g/mol
mkNVT('SOL-021', 'Medium',
`A solution containing 2 g of a non-volatile solute in 20 g of water boils at 373.52 K. The molecular mass of the solute is $\\_\\_\\_\\_$ g mol⁻¹. (Nearest integer)

Given: water boils at 373 K, $K_b$ for water = 0.52 K kg mol⁻¹`,
{ integer_value: 100 },
`**Step 1 — Elevation in boiling point:**
$$\\Delta T_b = 373.52 - 373 = 0.52\\ \\mathrm{K}$$

**Step 2 — Molality of solution:**
$$\\Delta T_b = K_b \\cdot m$$
$$0.52 = 0.52 \\times m \\Rightarrow m = 1\\ \\mathrm{mol\\ kg^{-1}}$$

**Step 3 — Moles of solute:**
$$n = m \\times m_{\\text{solvent (kg)}} = 1 \\times 0.020 = 0.02\\ \\mathrm{mol}$$

**Step 4 — Molar mass:**
$$M = \\frac{w}{n} = \\frac{2}{0.02} = 100\\ \\mathrm{g\\ mol^{-1}}$$

**Answer: 100 g/mol**`,
'tag_solutions_5', src(2023, 'Jan', 30, 'Morning')),

// Q22 — Freezing point of H2SO4 battery solution; Answer: 243 K
mkNVT('SOL-022', 'Hard',
`Lead storage battery contains 38% by weight solution of $\\mathrm{H_2SO_4}$. The van't Hoff factor is 2.67 at this concentration. The temperature in Kelvin at which the solution in the battery will freeze is $\\_\\_\\_\\_$ (Nearest integer).

Given: $K_f = 1.8\\ \\mathrm{K\\ kg\\ mol^{-1}}$`,
{ integer_value: 243 },
`**Step 1 — Molality of 38% H₂SO₄:**

In 100 g solution: 38 g H₂SO₄ and 62 g water.
$$n_{\\mathrm{H_2SO_4}} = \\frac{38}{98} = 0.3878\\ \\mathrm{mol}$$
$$m = \\frac{0.3878}{0.062} = 6.255\\ \\mathrm{mol\\ kg^{-1}}$$

**Step 2 — Depression in freezing point:**
$$\\Delta T_f = i \\cdot K_f \\cdot m = 2.67 \\times 1.8 \\times 6.255 = 30.05\\ \\mathrm{K}$$

**Step 3 — Freezing point:**
$$T_f = 273 - 30.05 = 242.95 \\approx 243\\ \\mathrm{K}$$

**Answer: 243 K**`,
'tag_solutions_5', src(2023, 'Jan', 30, 'Evening')),

// Q23 — Molar mass from osmotic pressure; Answer: 62250 g/mol
mkNVT('SOL-023', 'Hard',
`At 27°C, a solution containing 2.5 g of solute in 250.0 mL of solution exerts an osmotic pressure of 400 Pa. The molar mass of the solute is $\\_\\_\\_\\_$ g mol⁻¹ (Nearest integer)

(Given: $R = 0.083\\ \\mathrm{L\\ bar\\ mol^{-1}}$)`,
{ integer_value: 62250 },
`**Step 1 — Convert units:**
- $\\pi = 400\\ \\mathrm{Pa} = 400 \\times 10^{-5}\\ \\mathrm{bar} = 4 \\times 10^{-3}\\ \\mathrm{bar}$
- $V = 250\\ \\mathrm{mL} = 0.25\\ \\mathrm{L}$
- $T = 300\\ \\mathrm{K}$

**Step 2 — Osmotic pressure formula:**
$$\\pi = \\frac{wRT}{MV}$$
$$M = \\frac{wRT}{\\pi V} = \\frac{2.5 \\times 0.083 \\times 300}{4 \\times 10^{-3} \\times 0.25}$$

$$= \\frac{62.25}{10^{-3}} = 62250\\ \\mathrm{g\\ mol^{-1}}$$

**Answer: 62250 g/mol**`,
'tag_solutions_6', src(2023, 'Jan', 31, 'Morning')),

// Q24 — Ratio of molar masses from FP depression; Answer: (2) 1:0.25 → actually 4:1
mkSCQ('SOL-024', 'Medium',
`Two solutions A and B are prepared by dissolving 1 g of non-volatile solutes X and Y, respectively in 1 kg of water. The ratio of depression in freezing points for A and B is found to be 1:4. The ratio of molar masses of X and Y is`,
['1 : 4', '1 : 0.25', '1 : 0.20', '1 : 5'],
'b',
`**Step 1 — Depression in freezing point:**
$$\\Delta T_f = K_f \\cdot m = K_f \\cdot \\frac{w}{M \\cdot W_{\\text{solvent}}}$$

Since $w = 1\\ \\mathrm{g}$ and $W_{\\text{solvent}} = 1\\ \\mathrm{kg}$ for both:
$$\\Delta T_f \\propto \\frac{1}{M}$$

**Step 2 — Ratio of depressions:**
$$\\frac{\\Delta T_{f,A}}{\\Delta T_{f,B}} = \\frac{M_Y}{M_X} = \\frac{1}{4}$$

$$\\Rightarrow M_X : M_Y = 4 : 1$$

**Step 3 — Express as ratio of X to Y:**
$$M_X : M_Y = 4 : 1 = 1 : 0.25$$

**Answer: Option (2) — 1 : 0.25**`,
'tag_solutions_5', src(2022, 'Jul', 25, 'Evening')),

// Q25 — Kb/Kf ratio; Answer: 1 (X=1)
mkNVT('SOL-025', 'Medium',
`The elevation in boiling point for 1 molal solution of non-volatile solute A is 3 K. The depression in freezing point for 2 molal solution of A in the same solvent is 6 K. The ratio of $K_b$ and $K_f$ i.e., $K_b/K_f$ is 1 : X. The value of X is ____`,
{ integer_value: 1 },
`**Step 1 — Find $K_b$:**
$$\\Delta T_b = K_b \\cdot m \\Rightarrow 3 = K_b \\times 1 \\Rightarrow K_b = 3\\ \\mathrm{K\\ kg\\ mol^{-1}}$$

**Step 2 — Find $K_f$:**
$$\\Delta T_f = K_f \\cdot m \\Rightarrow 6 = K_f \\times 2 \\Rightarrow K_f = 3\\ \\mathrm{K\\ kg\\ mol^{-1}}$$

**Step 3 — Ratio:**
$$\\frac{K_b}{K_f} = \\frac{3}{3} = 1 = \\frac{1}{1}$$

So $K_b/K_f = 1:1$, meaning $X = 1$.

**Answer: X = 1**`,
'tag_solutions_5', src(2022, 'Jul', 26, 'Evening')),

// Q26 — Depression in FP of acetic acid with ascorbic acid; Answer: 15
mkNVT('SOL-026', 'Hard',
`150 g of acetic acid was contaminated with 10.2 g ascorbic acid ($\\mathrm{C_6H_8O_6}$) to lower down its freezing point by $(x \\times 10^{-1})°\\mathrm{C}$. The value of x is $\\_\\_\\_\\_$ (Nearest integer).

[Given: $K_f = 3.9\\ \\mathrm{K\\ kg\\ mol^{-1}}$; Molar mass of ascorbic acid = 176 g mol⁻¹]`,
{ integer_value: 15 },
`**Step 1 — Moles of ascorbic acid:**
$$n = \\frac{10.2}{176} = 0.05795\\ \\mathrm{mol}$$

**Step 2 — Molality (solvent = acetic acid, 150 g = 0.15 kg):**
$$m = \\frac{0.05795}{0.150} = 0.3864\\ \\mathrm{mol\\ kg^{-1}}$$

**Step 3 — Depression in FP:**
$$\\Delta T_f = K_f \\times m = 3.9 \\times 0.3864 = 1.507\\ \\mathrm{K} \\approx 1.5\\ \\mathrm{K}$$

$$= 15 \\times 10^{-1}\\mathrm{°C}$$

**Answer: x = 15**`,
'tag_solutions_5', src(2022, 'Jul', 28, 'Morning')),

// Q27 — Molar mass of solute A from FP depression in ethanol; Answer: 80 g/mol
mkNVT('SOL-027', 'Hard',
`1.80 g of solute A was dissolved in 62.5 cm³ of ethanol and freezing point of the solution was found to be 155.1 K. The molar mass of solute A is $\\_\\_\\_\\_$ g mol⁻¹.

[Given: Freezing point of ethanol is 156.0 K. Density of ethanol is 0.80 g cm⁻³. Freezing point depression constant of ethanol is 2.00 K kg mol⁻¹]`,
{ integer_value: 80 },
`**Step 1 — Depression in FP:**
$$\\Delta T_f = 156.0 - 155.1 = 0.9\\ \\mathrm{K}$$

**Step 2 — Mass of ethanol (solvent):**
$$m_{\\text{ethanol}} = 62.5 \\times 0.80 = 50\\ \\mathrm{g} = 0.050\\ \\mathrm{kg}$$

**Step 3 — Molality:**
$$m = \\frac{\\Delta T_f}{K_f} = \\frac{0.9}{2.00} = 0.45\\ \\mathrm{mol\\ kg^{-1}}$$

**Step 4 — Moles of solute:**
$$n = 0.45 \\times 0.050 = 0.0225\\ \\mathrm{mol}$$

**Step 5 — Molar mass:**
$$M = \\frac{1.80}{0.0225} = 80\\ \\mathrm{g\\ mol^{-1}}$$

**Answer: 80 g/mol**`,
'tag_solutions_5', src(2022, 'Jul', 29, 'Evening')),

// Q28 — Concentration of glucose isotonic with blood; Answer: 54 g/L
mkNVT('SOL-028', 'Medium',
`The osmotic pressure of blood is 7.47 bar at 300 K. To inject glucose to a patient intravenously, it has to be isotonic with blood. The concentration of glucose solution in g L⁻¹ is ____

(Molar mass of glucose = 180 g mol⁻¹, $R = 0.083\\ \\mathrm{L\\ bar^{-1}\\ mol^{-1}}$) (Nearest integer)`,
{ integer_value: 54 },
`**Step 1 — Molarity of isotonic glucose solution:**
$$\\pi = CRT$$
$$C = \\frac{\\pi}{RT} = \\frac{7.47}{0.083 \\times 300} = \\frac{7.47}{24.9} = 0.3\\ \\mathrm{mol\\ L^{-1}}$$

**Step 2 — Concentration in g/L:**
$$= 0.3 \\times 180 = 54\\ \\mathrm{g\\ L^{-1}}$$

**Answer: 54 g/L**`,
'tag_solutions_6', src(2022, 'Jun', 28, 'Evening')),

// Q29 — Osmotic pressure of protein solution; Answer: 415 Pa
mkNVT('SOL-029', 'Hard',
`The osmotic pressure exerted by a solution prepared by dissolving 2.0 g of protein of molar mass 60 kg mol⁻¹ in 200 mL of water at 27°C is $\\_\\_\\_\\_$ Pa. [integer value]

(use $R = 0.083\\ \\mathrm{L\\ bar\\ mol^{-1}\\ K^{-1}}$)`,
{ integer_value: 415 },
`**Step 1 — Molar mass of protein:**
$$M = 60\\ \\mathrm{kg\\ mol^{-1}} = 60000\\ \\mathrm{g\\ mol^{-1}}$$

**Step 2 — Moles of protein:**
$$n = \\frac{2.0}{60000} = 3.333 \\times 10^{-5}\\ \\mathrm{mol}$$

**Step 3 — Molarity:**
$$C = \\frac{3.333 \\times 10^{-5}}{0.200} = 1.667 \\times 10^{-4}\\ \\mathrm{mol\\ L^{-1}}$$

**Step 4 — Osmotic pressure:**
$$\\pi = CRT = 1.667 \\times 10^{-4} \\times 0.083 \\times 300 = 4.15 \\times 10^{-3}\\ \\mathrm{bar}$$

**Step 5 — Convert to Pa:**
$$1\\ \\mathrm{bar} = 10^5\\ \\mathrm{Pa}$$
$$\\pi = 4.15 \\times 10^{-3} \\times 10^5 = 415\\ \\mathrm{Pa}$$

**Answer: 415 Pa**`,
'tag_solutions_6', src(2022, 'Jun', 26, 'Evening')),

// Q30 — Ratio of elevation in BP for solvents A and B; Answer: 8
mkNVT('SOL-030', 'Medium',
`2 g of a non-volatile non-electrolyte solute is dissolved in 200 g of two different solvents A and B whose ebullioscopic constants are in the ratio of 1:8. The elevation in boiling points of A and B are in the ratio $\\dfrac{x}{y}$ (x:y). The value of y is $\\_\\_\\_\\_$ (Nearest Integer)`,
{ integer_value: 8 },
`**Step 1 — Elevation in boiling point formula:**
$$\\Delta T_b = K_b \\cdot m = K_b \\cdot \\frac{w}{M \\cdot W_{\\text{solvent}}}$$

Since same solute (same $w$, same $M$) and same mass of solvent (200 g):
$$\\Delta T_b \\propto K_b$$

**Step 2 — Ratio of elevations:**
$$\\frac{\\Delta T_{b,A}}{\\Delta T_{b,B}} = \\frac{K_{b,A}}{K_{b,B}} = \\frac{1}{8}$$

So $x:y = 1:8$, meaning $y = 8$.

**Answer: y = 8**`,
'tag_solutions_5', src(2022, 'Jun', 27, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (SOL-021 to SOL-030)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
