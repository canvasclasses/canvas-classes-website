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

function mkAR(id, diff, text, opts, correctId, solution, tag, examSrc) {
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

const questions = [

// Q41 — Ratio of molecular masses of proteins A and B; Answer: 177 × 10^-2
mkNVT('SOL-041', 'Hard',
`If 250 cm³ of an aqueous solution containing 0.73 g of a protein A is isotonic with one litre of another aqueous solution containing 1.65 g of a protein B, at 298 K, the ratio of the molecular masses of A and B is $\\_\\_\\_\\_ \\times 10^{-2}$ (to the nearest integer).`,
{ integer_value: 177 },
`**Isotonic solutions** have the same osmotic pressure:
$$\\pi_A = \\pi_B$$
$$C_A RT = C_B RT \\Rightarrow C_A = C_B$$

**Step 1 — Molar concentrations:**
$$C_A = \\frac{0.73/M_A}{0.250} = \\frac{2.92}{M_A}$$
$$C_B = \\frac{1.65/M_B}{1.000} = \\frac{1.65}{M_B}$$

**Step 2 — Set equal:**
$$\\frac{2.92}{M_A} = \\frac{1.65}{M_B}$$
$$\\frac{M_A}{M_B} = \\frac{2.92}{1.65} = 1.770 = 177 \\times 10^{-2}$$

**Answer: 177**`,
'tag_solutions_6', src(2020, 'Sep', 3, 'Evening')),

// Q42 — Osmotic pressure of NaCl + glucose mixture; Answer: 167 × 10^-3 atm
mkNVT('SOL-042', 'Hard',
`The osmotic pressure of a solution of NaCl is 0.10 atm and that of a glucose solution is 0.20 atm. The osmotic pressure of a solution formed by mixing 1 L of the sodium chloride solution with 2 L of the glucose solution is $x \\times 10^{-3}$ atm. x is $\\_\\_\\_\\_$ (nearest integer)`,
{ integer_value: 167 },
`**Step 1 — Moles of solute particles in each solution:**

For NaCl ($i = 2$): $\\pi = iCRT$
$$n_{\\text{NaCl particles}} = \\frac{\\pi_1 V_1}{RT} = \\frac{0.10 \\times 1}{RT}$$

For glucose ($i = 1$):
$$n_{\\text{glucose}} = \\frac{0.20 \\times 2}{RT} = \\frac{0.40}{RT}$$

**Step 2 — Total effective moles in 3 L mixture:**
$$n_{\\text{total}} = \\frac{0.10 + 0.40}{RT} = \\frac{0.50}{RT}$$

**Step 3 — Osmotic pressure of mixture:**
$$\\pi_{\\text{mix}} = \\frac{n_{\\text{total}} RT}{V_{\\text{total}}} = \\frac{0.50}{3} = 0.1667\\ \\mathrm{atm} = 167 \\times 10^{-3}\\ \\mathrm{atm}$$

**Answer: 167**`,
'tag_solutions_6', src(2020, 'Sep', 4, 'Evening')),

// Q43 — Amount of NaCl to decrease FP to -0.2°C; Answer: 1.74 g
mkNVT('SOL-043', 'Medium',
`How much amount of NaCl should be added to 600 g of water $(\rho = 1.00\\ \\mathrm{g/mL})$ to decrease the freezing point of water to $-0.2°\\mathrm{C}$?

(The freezing point depression constant for water = 2 K kg mol⁻¹)`,
{ decimal_value: 1.74 },
`**Step 1 — Van't Hoff factor for NaCl:**
$$\\mathrm{NaCl \\rightarrow Na^+ + Cl^-},\\quad i = 2$$

**Step 2 — Molality required:**
$$\\Delta T_f = i \\cdot K_f \\cdot m$$
$$0.2 = 2 \\times 2 \\times m \\Rightarrow m = 0.05\\ \\mathrm{mol\\ kg^{-1}}$$

**Step 3 — Moles of NaCl:**
$$n = 0.05 \\times 0.600 = 0.03\\ \\mathrm{mol}$$

**Step 4 — Mass of NaCl (M = 58.5 g/mol):**
$$m = 0.03 \\times 58.5 = 1.755 \\approx 1.74\\ \\mathrm{g}$$

**Answer: 1.74 g**`,
'tag_solutions_5', src(2020, 'Jan', 9, 'Morning')),

// Q44 — Mole fraction of urea from molality; Answer: 74
mkNVT('SOL-044', 'Medium',
`Molality of an aqueous solution of urea is 4.44 m. Mole fraction of urea in solution is $x \\times 10^{-3}$. Value of x is $\\_\\_\\_\\_$ (Integer answer)`,
{ integer_value: 74 },
`**Step 1 — Basis: 1 kg of water**

$$n_{\\text{urea}} = 4.44\\ \\mathrm{mol}$$
$$n_{\\text{water}} = \\frac{1000}{18} = 55.56\\ \\mathrm{mol}$$

**Step 2 — Mole fraction of urea:**
$$\\chi_{\\text{urea}} = \\frac{4.44}{4.44 + 55.56} = \\frac{4.44}{60} = 0.074 = 74 \\times 10^{-3}$$

**Answer: x = 74**`,
'tag_solutions_4', src(2024, 'Apr', 8, 'Evening')),

// Q45 — Molarity of H2SO4 solution; Answer: 4 M
mkNVT('SOL-045', 'Medium',
`A solution of $\\mathrm{H_2SO_4}$ is 31.4% $\\mathrm{H_2SO_4}$ by mass and has a density of 1.25 g/mL. The molarity of the $\\mathrm{H_2SO_4}$ solution is $\\_\\_\\_\\_$ M (nearest integer)

[Given: molar mass of $\\mathrm{H_2SO_4}$ = 98 g mol⁻¹]`,
{ integer_value: 4 },
`**Step 1 — In 1 L of solution:**
$$m_{\\text{solution}} = 1000 \\times 1.25 = 1250\\ \\mathrm{g}$$

**Step 2 — Mass of H₂SO₄:**
$$m_{\\mathrm{H_2SO_4}} = 0.314 \\times 1250 = 392.5\\ \\mathrm{g}$$

**Step 3 — Moles of H₂SO₄:**
$$n = \\frac{392.5}{98} = 4.005 \\approx 4\\ \\mathrm{mol}$$

**Step 4 — Molarity:**
$$M = \\frac{4}{1} = 4\\ \\mathrm{M}$$

**Answer: 4 M**`,
'tag_solutions_4', src(2024, 'Jan', 29, 'Morning')),

// Q46 — Molality of 0.8 M H2SO4; Answer: 815 × 10^-3 m
mkNVT('SOL-046', 'Hard',
`Molality of 0.8 M $\\mathrm{H_2SO_4}$ solution (density 1.06 g cm⁻³) is $\\_\\_\\_\\_ \\times 10^{-3}$ m.

Round off your answer to the nearest integer.`,
{ integer_value: 815 },
`**Step 1 — In 1 L of solution:**
$$m_{\\text{solution}} = 1000 \\times 1.06 = 1060\\ \\mathrm{g}$$

**Step 2 — Mass of H₂SO₄ (0.8 mol in 1 L):**
$$m_{\\mathrm{H_2SO_4}} = 0.8 \\times 98 = 78.4\\ \\mathrm{g}$$

**Step 3 — Mass of solvent (water):**
$$m_{\\text{water}} = 1060 - 78.4 = 981.6\\ \\mathrm{g} = 0.9816\\ \\mathrm{kg}$$

**Step 4 — Molality:**
$$b = \\frac{0.8}{0.9816} = 0.8150\\ \\mathrm{mol\\ kg^{-1}} = 815 \\times 10^{-3}\\ \\mathrm{m}$$

**Answer: 815**`,
'tag_solutions_4', src(2024, 'Jan', 29, 'Evening')),

// Q47 — Mass of sodium acetate for 250 mL 0.35 M; Answer: 7 g
mkNVT('SOL-047', 'Easy',
`The mass of sodium acetate ($\\mathrm{CH_3COONa}$) required to prepare 250 mL of 0.35 M aqueous solution is $\\_\\_\\_\\_$ g.

(Molar mass of $\\mathrm{CH_3COONa}$ is 82.02 g mol⁻¹) Round off to the nearest integer.`,
{ integer_value: 7 },
`**Step 1 — Moles required:**
$$n = 0.35 \\times 0.250 = 0.0875\\ \\mathrm{mol}$$

**Step 2 — Mass:**
$$m = 0.0875 \\times 82.02 = 7.177 \\approx 7\\ \\mathrm{g}$$

**Answer: 7 g**`,
'tag_solutions_4', src(2024, 'Jan', 30, 'Morning')),

// Q48 — Volume of CO2 at STP; Answer: 1362 mL
mkNVT('SOL-048', 'Medium',
`A 300 mL bottle of soft drink has 0.2 M $\\mathrm{CO_2}$ dissolved in it. Assuming $\\mathrm{CO_2}$ behaves as an ideal gas, the volume of the dissolved $\\mathrm{CO_2}$ at STP is $\\_\\_\\_\\_$ mL. (Nearest integer)

Given: At STP, molar volume of an ideal gas is 22.7 L mol⁻¹`,
{ integer_value: 1362 },
`**Step 1 — Moles of CO₂ dissolved:**
$$n = 0.2\\ \\mathrm{M} \\times 0.300\\ \\mathrm{L} = 0.06\\ \\mathrm{mol}$$

**Step 2 — Volume at STP:**
$$V = n \\times V_m = 0.06 \\times 22.7 = 1.362\\ \\mathrm{L} = 1362\\ \\mathrm{mL}$$

**Answer: 1362 mL**`,
'tag_solutions_4', src(2023, 'Jan', 30, 'Morning')),

// Q49 — Concentration of DCM in ppm; Answer: 148 ppm
mkNVT('SOL-049', 'Hard',
`Some amount of dichloromethane ($\\mathrm{CH_2Cl_2}$) is added to 671.141 mL of chloroform ($\\mathrm{CHCl_3}$) to prepare $2.6 \\times 10^{-3}$ M solution of $\\mathrm{CH_2Cl_2}$ (DCM). The concentration of DCM is $\\_\\_\\_\\_$ ppm (by mass).

Given: Atomic mass: C = 12; H: 1; Cl = 35.5; density of $\\mathrm{CHCl_3}$ = 1.49 g cm⁻³`,
{ integer_value: 148 },
`**Step 1 — Moles of DCM:**
$$n_{\\mathrm{DCM}} = 2.6 \\times 10^{-3} \\times 0.671141 = 1.745 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 2 — Molar mass of DCM ($\\mathrm{CH_2Cl_2}$):**
$$M = 12 + 2(1) + 2(35.5) = 85\\ \\mathrm{g\\ mol^{-1}}$$

**Step 3 — Mass of DCM:**
$$m_{\\mathrm{DCM}} = 1.745 \\times 10^{-3} \\times 85 = 0.1483\\ \\mathrm{g}$$

**Step 4 — Mass of CHCl₃:**
$$m_{\\mathrm{CHCl_3}} = 671.141 \\times 1.49 = 1000\\ \\mathrm{g}$$

**Step 5 — ppm by mass:**
$$\\mathrm{ppm} = \\frac{m_{\\mathrm{DCM}}}{m_{\\text{total}}} \\times 10^6 = \\frac{0.1483}{1000.1483} \\times 10^6 \\approx 148\\ \\mathrm{ppm}$$

**Answer: 148 ppm**`,
'tag_solutions_4', src(2023, 'Jan', 30, 'Morning')),

// Q50 — Assertion-Reason: molality unchanged with temperature; Answer: (3) Both true, R is correct explanation
mkAR('SOL-050', 'Medium',
`Given below are two statements: one is labelled as Assertion and the other is labelled as Reason.

**Assertion:** At 10°C, the density of a 5 M solution of KCl [atomic masses of K & Cl are 39 & 35.5 g mol⁻¹ respectively], is 'x' g mL⁻¹. The solution is cooled to −21°C. The molality of the solution will remain unchanged.

**Reason:** The molality of a solution does not change with temperature as mass remains unaffected with temperature.

In the light of the above statements, choose the correct answer from the options given below.`,
[
  'Assertion is true but Reason is false.',
  'Assertion is false but Reason is true.',
  'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.',
  'Both Assertion and Reason are true but Reason is not the correct explanation of Assertion.'
],
'c',
`**Assertion:** When a 5 M KCl solution is cooled from 10°C to −21°C, the molality remains unchanged.

Molality = moles of solute / kg of solvent. Both moles and mass are independent of temperature. Even though the volume (and hence molarity) changes with temperature, molality does not change. **Assertion is TRUE ✓**

**Reason:** Molality depends on mass (not volume). Since mass is independent of temperature, molality remains constant regardless of temperature changes. **Reason is TRUE ✓**

The Reason correctly explains the Assertion — molality is unchanged because it is based on mass, not volume.

**Answer: Option (3) — Both true, Reason is the correct explanation**`,
'tag_solutions_4', src(2022, 'Jun', 27, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (SOL-041 to SOL-050)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
