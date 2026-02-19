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

function mkMSQ(id, diff, text, opts, correctId, solution, tag, examSrc) {
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

// Q11 — Amount of sugar for 2L of 0.1M; Answer: (3) 68.4 g
mkSCQ('SOL-011', 'Easy',
`The amount of sugar ($\\mathrm{C_{12}H_{22}O_{11}}$) required to prepare 2 L of its 0.1 M aqueous solution is:`,
['17.1 g', '136.8 g', '68.4 g', '34.2 g'],
'c',
`**Step 1 — Molar mass of sucrose ($\\mathrm{C_{12}H_{22}O_{11}}$):**
$$M = 12(12) + 22(1) + 11(16) = 144 + 22 + 176 = 342\\ \\mathrm{g\\ mol^{-1}}$$

**Step 2 — Moles needed:**
$$n = 0.1\\ \\mathrm{M} \\times 2\\ \\mathrm{L} = 0.2\\ \\mathrm{mol}$$

**Step 3 — Mass:**
$$m = 0.2 \\times 342 = 68.4\\ \\mathrm{g}$$

**Answer: Option (3) — 68.4 g**`,
'tag_solutions_4', src(2019, 'Jan', 10, 'Evening')),

// Q12 — Mole fraction of methyl benzene in vapour; Answer: 23 × 10^-2
mkNVT('SOL-012', 'Medium',
`The vapour pressure of pure benzene and methyl benzene at 27°C is given as 80 Torr and 24 Torr, respectively. The mole fraction of methyl benzene in vapour phase, in equilibrium with an equimolar mixture of those two liquids (ideal solution) at the same temperature is $\\_\\_\\_\\_ \\times 10^{-2}$ (nearest integer)`,
{ integer_value: 23 },
`**Step 1 — Equimolar mixture:** $x_{\\text{benzene}} = x_{\\text{toluene}} = 0.5$

**Step 2 — Partial pressures (Raoult's law):**
$$P_{\\text{benzene}} = 0.5 \\times 80 = 40\\ \\text{Torr}$$
$$P_{\\text{toluene}} = 0.5 \\times 24 = 12\\ \\text{Torr}$$

**Step 3 — Total pressure:**
$$P_{\\text{total}} = 40 + 12 = 52\\ \\text{Torr}$$

**Step 4 — Mole fraction of methyl benzene (toluene) in vapour:**
$$y_{\\text{toluene}} = \\frac{P_{\\text{toluene}}}{P_{\\text{total}}} = \\frac{12}{52} = 0.2308 \\approx 23 \\times 10^{-2}$$

**Answer: 23**`,
'tag_solutions_1', src(2024, 'Apr', 9, 'Evening')),

// Q13 — Negative deviation from Raoult's law; Answer: (4) decreased VP, increased BP
mkSCQ('SOL-013', 'Easy',
`A solution of two miscible liquids showing negative deviation from Raoult's law will have:`,
[
  'increased vapour pressure, increased boiling point',
  'increased vapour pressure, decreased boiling point',
  'decreased vapour pressure, decreased boiling point',
  'decreased vapour pressure, increased boiling point'
],
'd',
`**Negative deviation from Raoult's law:**

Occurs when A–B interactions are **stronger** than A–A and B–B interactions. This means molecules are held more tightly in solution than in pure liquids.

**Effect on vapour pressure:**
- Stronger intermolecular forces → fewer molecules escape to vapour phase
- **Vapour pressure decreases** (below ideal)

**Effect on boiling point:**
- Lower vapour pressure means higher temperature needed to reach atmospheric pressure
- **Boiling point increases**

**Examples:** Acetone + aniline, CHCl₃ + acetone, HCl + water

**Answer: Option (4) — decreased vapour pressure, increased boiling point**`,
'tag_solutions_3', src(2024, 'Jan', 27, 'Morning')),

// Q14 — Vapour pressure of ideal mixture; Answer: 19 kPa
mkNVT('SOL-014', 'Medium',
`At 363 K, the vapour pressure of A is 21 kPa and that of B is 18 kPa. One mole of A and 2 moles of B are mixed. Assuming that this solution is ideal, the vapour pressure of the mixture is $\\_\\_\\_\\_$ kPa. (Round off to the Nearest Integer).`,
{ integer_value: 19 },
`**Step 1 — Mole fractions:**
$$x_A = \\frac{1}{1+2} = \\frac{1}{3};\\quad x_B = \\frac{2}{3}$$

**Step 2 — Total vapour pressure (Raoult's law):**
$$P_{\\text{total}} = x_A P_A^\\circ + x_B P_B^\\circ$$
$$= \\frac{1}{3}(21) + \\frac{2}{3}(18) = 7 + 12 = 19\\ \\mathrm{kPa}$$

**Answer: 19 kPa**`,
'tag_solutions_3', src(2021, 'Mar', 16, 'Evening')),

// Q15 — Molar solubility of O2 in water; Answer: 1389 × 10^-5
mkNVT('SOL-015', 'Hard',
`The oxygen dissolved in water exerts a partial pressure of 20 kPa in the vapour above water. The molar solubility of oxygen in water is $\\_\\_\\_\\_ \\times 10^{-5}$ mol dm⁻³. (Round off to the Nearest Integer).

[Given: Henry's law constant = $K_H = 8.0 \\times 10^4$ kPa for $\\mathrm{O_2}$. Density of water with dissolved oxygen = 1.0 kg dm⁻³]`,
{ integer_value: 1389 },
`**Step 1 — Henry's law:**
$$p = K_H \\cdot x_{\\mathrm{O_2}}$$
$$x_{\\mathrm{O_2}} = \\frac{p}{K_H} = \\frac{20}{8.0 \\times 10^4} = 2.5 \\times 10^{-4}$$

**Step 2 — Convert mole fraction to molarity:**

For dilute aqueous solution, moles of water per litre ≈ $\\frac{1000}{18} = 55.5$ mol/L

$$x_{\\mathrm{O_2}} = \\frac{n_{\\mathrm{O_2}}}{n_{\\mathrm{O_2}} + n_{\\mathrm{H_2O}}} \\approx \\frac{n_{\\mathrm{O_2}}}{n_{\\mathrm{H_2O}}}$$

$$n_{\\mathrm{O_2}} = x_{\\mathrm{O_2}} \\times n_{\\mathrm{H_2O}} = 2.5 \\times 10^{-4} \\times 55.5 = 0.013875\\ \\mathrm{mol\\ L^{-1}}$$

$$= 1387.5 \\times 10^{-5} \\approx 1389 \\times 10^{-5}\\ \\mathrm{mol\\ dm^{-3}}$$

**Answer: 1389**`,
'tag_solutions_7', src(2021, 'Mar', 17, 'Morning')),

// Q16 — Freezing point of benzene when naphthalene added; Answer: (4) Decreases
mkSCQ('SOL-016', 'Easy',
`What happens to freezing point of benzene when small quantity of naphthalene is added to benzene?`,
['Increases', 'Remains unchanged', 'First decreases and then increases', 'Decreases'],
'd',
`**Concept — Depression in freezing point:**

When a non-volatile solute (naphthalene) is dissolved in a solvent (benzene), it is a colligative property:
$$\\Delta T_f = K_f \\cdot m$$

- $\\Delta T_f$ is always positive (depression)
- Freezing point of solution = Freezing point of pure solvent − $\\Delta T_f$

Adding naphthalene (non-volatile, non-electrolyte) to benzene **lowers** the freezing point of benzene.

**Answer: Option (4) — Decreases**`,
'tag_solutions_5', src(2024, 'Jan', 30, 'Morning')),

// Q17 — Mass of urea to reduce VP by 25%; Answer: 1111 g
mkNVT('SOL-017', 'Hard',
`Mass of Urea ($\\mathrm{NH_2CONH_2}$) required to be dissolved in 1000 g of water in order to reduce the vapour pressure of water by 25% is $\\_\\_\\_\\_$ g. (Nearest integer)

Given: Molar mass of N, C, O and H are 14, 12, 16 and 1 g mol⁻¹ respectively.`,
{ integer_value: 1111 },
`**Step 1 — Molar mass of urea ($\\mathrm{NH_2CONH_2}$):**
$$M = 2(14) + 2(2)(1) + 12 + 16 = 28 + 4 + 12 + 16 = 60\\ \\mathrm{g\\ mol^{-1}}$$

**Step 2 — Relative lowering of vapour pressure:**
$$\\frac{P^\\circ - P}{P^\\circ} = 0.25 = x_{\\text{urea}}$$

**Step 3 — Mole fraction of urea:**
$$x_{\\text{urea}} = \\frac{n_{\\text{urea}}}{n_{\\text{urea}} + n_{\\text{water}}} = 0.25$$

**Step 4 — Moles of water:**
$$n_{\\text{water}} = \\frac{1000}{18} = 55.56\\ \\mathrm{mol}$$

**Step 5 — Solve for moles of urea:**
$$\\frac{n_u}{n_u + 55.56} = 0.25$$
$$n_u = 0.25(n_u + 55.56)$$
$$0.75 n_u = 13.89$$
$$n_u = 18.52\\ \\mathrm{mol}$$

**Step 6 — Mass of urea:**
$$m = 18.52 \\times 60 = 1111\\ \\mathrm{g}$$

**Answer: 1111 g**`,
'tag_solutions_1', src(2023, 'Apr', 6, 'Morning')),

// Q18 — Number of isotonic pairs; Answer: 4
mkNVT('SOL-018', 'Hard',
`Consider the following pairs of solution which will be isotonic at the same temperature. The number of pairs of solutions is/are ____

**A.** 1 M aq. NaCl and 2 M aq. urea

**B.** 1 M aq. $\\mathrm{CaCl_2}$ and 1.5 M aq. KCl

**C.** 1.5 M aq. $\\mathrm{AlCl_3}$ and 2 M aq. $\\mathrm{Na_2SO_4}$

**D.** 2.5 M aq. KCl and 1 M aq. $\\mathrm{Al_2(SO_4)_3}$`,
{ integer_value: 4 },
`**Isotonic solutions** have the same osmotic pressure → same effective concentration (i × M).

| Pair | Solution 1 | i × M | Solution 2 | i × M | Isotonic? |
|---|---|---|---|---|---|
| A | 1 M NaCl | 2 × 1 = 2 | 2 M urea | 1 × 2 = 2 | ✓ |
| B | 1 M CaCl₂ | 3 × 1 = 3 | 1.5 M KCl | 2 × 1.5 = 3 | ✓ |
| C | 1.5 M AlCl₃ | 4 × 1.5 = 6 | 2 M Na₂SO₄ | 3 × 2 = 6 | ✓ |
| D | 2.5 M KCl | 2 × 2.5 = 5 | 1 M Al₂(SO₄)₃ | 5 × 1 = 5 | ✓ |

All 4 pairs are isotonic.

**Answer: 4**`,
'tag_solutions_6', src(2023, 'Apr', 6, 'Evening')),

// Q19 — Molar mass of protein from osmotic pressure; Answer: 40535 g/mol
mkNVT('SOL-019', 'Hard',
`An aqueous solution of volume 300 cm³ contains 0.63 g of protein. The osmotic pressure of the solution at 300 K is 1.29 mbar. The molar mass of the protein is $\\_\\_\\_\\_$ g mol⁻¹.

Given: $R = 0.083\\ \\mathrm{L\\ bar\\ K^{-1}\\ mol^{-1}}$`,
{ integer_value: 40535 },
`**Step 1 — Osmotic pressure formula:**
$$\\pi = CRT = \\frac{n}{V}RT = \\frac{w}{M \\cdot V}RT$$

**Step 2 — Convert units:**
- $\\pi = 1.29\\ \\mathrm{mbar} = 1.29 \\times 10^{-3}\\ \\mathrm{bar}$
- $V = 300\\ \\mathrm{cm^3} = 0.3\\ \\mathrm{L}$

**Step 3 — Solve for M:**
$$M = \\frac{wRT}{\\pi V} = \\frac{0.63 \\times 0.083 \\times 300}{1.29 \\times 10^{-3} \\times 0.3}$$

$$= \\frac{15.687}{3.87 \\times 10^{-4}} = 40535\\ \\mathrm{g\\ mol^{-1}}$$

**Answer: 40535 g/mol**`,
'tag_solutions_6', src(2023, 'Apr', 10, 'Evening')),

// Q20 — Multi-statement: depression of FP experiment; Answer: (1) A and D only
mkSCQ('SOL-020', 'Medium',
`In the depression of freezing point experiment

**A.** Vapour pressure of the solution is less than that of pure solvent

**B.** Vapour pressure of the solution is more than that of pure solvent

**C.** Only solute molecules solidify at the freezing point

**D.** Only solvent molecules solidify at the freezing point

Choose the correct answer from the options given below:`,
['A and D only', 'B and C only', 'A and C only', 'A only'],
'a',
`**Statement A:** "Vapour pressure of the solution is less than that of pure solvent"

Adding a non-volatile solute lowers the vapour pressure of the solvent (Raoult's law). **A is CORRECT ✓**

**Statement B:** "Vapour pressure of the solution is more than that of pure solvent"

This is the opposite of A. **B is INCORRECT ✗**

**Statement C:** "Only solute molecules solidify at the freezing point"

At the freezing point of a solution, the **solvent** molecules solidify (form pure solid solvent), not the solute. This is why the freezing point is depressed — the solvent needs to be cooled further to solidify. **C is INCORRECT ✗**

**Statement D:** "Only solvent molecules solidify at the freezing point"

Correct — at the freezing point of the solution, pure solvent (ice in case of water) separates out. **D is CORRECT ✓**

**Answer: Option (1) — A and D only**`,
'tag_solutions_5', src(2023, 'Jan', 24, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (SOL-011 to SOL-020)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
