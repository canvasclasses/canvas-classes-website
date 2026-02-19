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

// Q1 — Molarity of NaCl solution; Answer: (4) 0.2 M
mkSCQ('SOL-001', 'Easy',
`The Molarity (M) of an aqueous solution containing 5.85 g of NaCl in 500 mL water is:

(Given: Molar Mass Na: 23 and Cl: 35.5 g mol⁻¹)`,
['2', '20', '4', '0.2'],
'd',
`**Step 1 — Molar mass of NaCl:**
$$M_{\\mathrm{NaCl}} = 23 + 35.5 = 58.5\\ \\mathrm{g\\ mol^{-1}}$$

**Step 2 — Moles of NaCl:**
$$n = \\frac{5.85}{58.5} = 0.1\\ \\mathrm{mol}$$

**Step 3 — Molarity:**
$$M = \\frac{0.1\\ \\mathrm{mol}}{0.500\\ \\mathrm{L}} = 0.2\\ \\mathrm{M}$$

**Answer: Option (4) — 0.2 M**`,
'tag_solutions_4', src(2024, 'Apr', 4, 'Morning')),

// Q2 — Mass percent of ethyl alcohol; Answer: 22
mkNVT('SOL-002', 'Easy',
`A solution is prepared by adding 1 mole ethyl alcohol in 9 mole water. The mass percent of solute in the solution is ____

(Integer answer)

(Given: Molar mass in g mol⁻¹: Ethyl alcohol: 46, water: 18)`,
{ integer_value: 22 },
`**Step 1 — Mass of ethyl alcohol (solute):**
$$m_{\\text{solute}} = 1 \\times 46 = 46\\ \\mathrm{g}$$

**Step 2 — Mass of water (solvent):**
$$m_{\\text{solvent}} = 9 \\times 18 = 162\\ \\mathrm{g}$$

**Step 3 — Total mass of solution:**
$$m_{\\text{total}} = 46 + 162 = 208\\ \\mathrm{g}$$

**Step 4 — Mass percent:**
$$\\% = \\frac{46}{208} \\times 100 = 22.1 \\approx \\mathbf{22}$$

**Answer: 22**`,
'tag_solutions_4', src(2024, 'Apr', 8, 'Evening')),

// Q3 — Quantity that changes with temperature; Answer: (1) Molarity
mkSCQ('SOL-003', 'Easy',
`The quantity which changes with temperature is:`,
['Molarity', 'Mass percentage', 'Molality', 'Mole fraction'],
'a',
`**Analysis of each concentration term:**

| Term | Depends on volume? | Changes with T? |
|---|---|---|
| Molarity (M) | Yes (mol/L) | ✓ Yes — volume changes with T |
| Mass percentage | No (mass/mass) | ✗ No |
| Molality (m) | No (mol/kg) | ✗ No |
| Mole fraction | No (mol/mol) | ✗ No |

**Molarity** is the only concentration term that involves volume. Since volume of a liquid changes with temperature (thermal expansion/contraction), molarity changes with temperature.

All other terms (mass %, molality, mole fraction) are based on mass or moles only, which are temperature-independent.

**Answer: Option (1) — Molarity**`,
'tag_solutions_4', src(2024, 'Jan', 27, 'Evening')),

// Q4 — Mole fraction of C; Answer: (2)
mkSCQ('SOL-004', 'Easy',
`If a substance 'A' dissolves in solution of a mixture of 'B' and 'C' with their respective number of moles as $n_A$, $n_B$ and $n_C$, mole fraction of C in the solution is:`,
[
  `$\\dfrac{n_C}{n_A \\times n_B \\times n_C}$`,
  `$\\dfrac{n_C}{n_A + n_B + n_C}$`,
  `$\\dfrac{n_C}{n_A - n_B - n_C}$`,
  `$\\dfrac{n_B}{n_A + n_B}$`
],
'b',
`**Definition of mole fraction:**

Mole fraction of a component = $\\dfrac{\\text{moles of that component}}{\\text{total moles of all components}}$

For component C in a three-component mixture (A, B, C):
$$\\chi_C = \\frac{n_C}{n_A + n_B + n_C}$$

**Answer: Option (2)**`,
'tag_solutions_4', src(2024, 'Jan', 30, 'Evening')),

// Q5 — Volume of NaOH stock solution needed; Answer: 180 mL
mkNVT('SOL-005', 'Medium',
`5 g of NaOH was dissolved in deionized water to prepare a 450 mL stock solution. What volume (in mL) of this solution would be required to prepare 500 mL of 0.1 M solution?

Given: Molar Mass of Na, O and H is 23, 16 and 1 g mol⁻¹ respectively`,
{ integer_value: 180 },
`**Step 1 — Molar mass of NaOH:**
$$M_{\\mathrm{NaOH}} = 23 + 16 + 1 = 40\\ \\mathrm{g\\ mol^{-1}}$$

**Step 2 — Moles of NaOH in stock:**
$$n = \\frac{5}{40} = 0.125\\ \\mathrm{mol}$$

**Step 3 — Molarity of stock solution:**
$$M_1 = \\frac{0.125}{0.450} = \\frac{5}{18}\\ \\mathrm{M}$$

**Step 4 — Dilution formula ($M_1V_1 = M_2V_2$):**
$$\\frac{5}{18} \\times V_1 = 0.1 \\times 500$$
$$V_1 = \\frac{50 \\times 18}{5} = 180\\ \\mathrm{mL}$$

**Answer: 180 mL**`,
'tag_solutions_4', src(2023, 'Jan', 24, 'Morning')),

// Q6 — Number of units to express concentration; Answer: 5
mkNVT('SOL-006', 'Easy',
`The number of units, which are used to express concentration of solutions from the following is ____

(Mass percent, Mole, Mole fraction, Molarity, ppm, Molality.)`,
{ integer_value: 5 },
`**Step 1 — Identify concentration units from the list:**

| Term | Is it a concentration unit? |
|---|---|
| Mass percent | ✓ Yes |
| Mole | ✗ No — mole is a quantity, not a concentration |
| Mole fraction | ✓ Yes |
| Molarity | ✓ Yes |
| ppm | ✓ Yes |
| Molality | ✓ Yes |

**Step 2 — Count:**
Mass percent, Mole fraction, Molarity, ppm, Molality = **5 units**

"Mole" alone is not a concentration unit — it is an amount.

**Answer: 5**`,
'tag_solutions_4', src(2023, 'Jan', 24, 'Evening')),

// Q7 — Mass ratio of ethylene glycol for molal vs molar; Answer: (3) 2:1
mkSCQ('SOL-007', 'Medium',
`What is the mass ratio of ethylene glycol ($\\mathrm{C_2H_6O_2}$, molar mass = 62 g/mol) required for making 500 g of 0.25 molal aqueous solution and 250 mL of 0.25 molar aqueous solution?`,
['1 : 1', '3 : 1', '2 : 1', '1 : 2'],
'c',
`**Step 1 — Mass for 500 g of 0.25 molal solution:**

Molality = moles of solute per kg of solvent.
$$0.25 = \\frac{n}{m_{\\text{solvent (kg)}}}$$

Let mass of ethylene glycol = $w$ g, mass of solvent = $(500 - w)$ g

$$0.25 = \\frac{w/62}{(500-w)/1000}$$

Since solution is dilute, $(500 - w) \\approx 500$ g = 0.5 kg:
$$n = 0.25 \\times 0.5 = 0.125\\ \\mathrm{mol}$$
$$w_1 = 0.125 \\times 62 = 7.75\\ \\mathrm{g}$$

**Step 2 — Mass for 250 mL of 0.25 molar solution:**
$$n = 0.25 \\times 0.250 = 0.0625\\ \\mathrm{mol}$$
$$w_2 = 0.0625 \\times 62 = 3.875\\ \\mathrm{g}$$

**Step 3 — Ratio:**
$$\\frac{w_1}{w_2} = \\frac{7.75}{3.875} = 2:1$$

**Answer: Option (3) — 2 : 1**`,
'tag_solutions_4', src(2023, 'Jan', 25, 'Evening')),

// Q8 — Molarity of glucose in blood; Answer: 4 × 10^-3 M
mkNVT('SOL-008', 'Easy',
`If the concentration of glucose ($\\mathrm{C_6H_{12}O_6}$) in blood is $0.72\\ \\mathrm{g\\ L^{-1}}$, the molarity of glucose in blood is $\\_\\_\\_\\_ \\times 10^{-3}$ M (Nearest integer)

[Given: Atomic mass of C = 12, H = 1, O = 16 u]`,
{ integer_value: 4 },
`**Step 1 — Molar mass of glucose ($\\mathrm{C_6H_{12}O_6}$):**
$$M = 6(12) + 12(1) + 6(16) = 72 + 12 + 96 = 180\\ \\mathrm{g\\ mol^{-1}}$$

**Step 2 — Molarity:**
$$M = \\frac{0.72\\ \\mathrm{g\\ L^{-1}}}{180\\ \\mathrm{g\\ mol^{-1}}} = 4 \\times 10^{-3}\\ \\mathrm{M}$$

**Answer: 4**`,
'tag_solutions_4', src(2021, 'Jul', 22, 'Morning')),

// Q9 — Molality from mole fraction of solvent = 0.8; Answer: (3) 13.88
mkSCQ('SOL-009', 'Medium',
`The mole fraction of a solvent in aqueous solution of a solute is 0.8. The molality (in mol kg⁻¹) of the aqueous solution is:`,
[
  `$13.88 \\times 10^{-3}$`,
  `$13.88 \\times 10^{-1}$`,
  `$13.88$`,
  `$13.88 \\times 10^{-2}$`
],
'c',
`**Step 1 — Find mole fraction of solute:**
$$\\chi_{\\text{solute}} = 1 - \\chi_{\\text{solvent}} = 1 - 0.8 = 0.2$$

**Step 2 — Assume basis: 1 mol total**
- Moles of solvent (water) = 0.8 mol
- Moles of solute = 0.2 mol

**Step 3 — Mass of solvent:**
$$m_{\\text{water}} = 0.8 \\times 18 = 14.4\\ \\mathrm{g} = 0.0144\\ \\mathrm{kg}$$

**Step 4 — Molality:**
$$b = \\frac{n_{\\text{solute}}}{m_{\\text{solvent (kg)}}} = \\frac{0.2}{0.0144} = 13.88\\ \\mathrm{mol\\ kg^{-1}}$$

**Answer: Option (3) — 13.88**`,
'tag_solutions_4', src(2019, 'Apr', 12, 'Morning')),

// Q10 — Molality of Na+ ions; Answer: (2) 4
mkSCQ('SOL-010', 'Easy',
`A solution of sodium sulphate contains 92 g of $\\mathrm{Na^+}$ ions per kilogram of water. The molality of $\\mathrm{Na^+}$ ions in that solution in mol kg⁻¹ is:`,
['16', '4', '12', '8'],
'b',
`**Step 1 — Molar mass of Na⁺:**
$$M_{\\mathrm{Na^+}} = 23\\ \\mathrm{g\\ mol^{-1}}$$

**Step 2 — Moles of Na⁺ per kg of water:**
$$n_{\\mathrm{Na^+}} = \\frac{92}{23} = 4\\ \\mathrm{mol}$$

**Step 3 — Molality:**
$$b = \\frac{4\\ \\mathrm{mol}}{1\\ \\mathrm{kg}} = 4\\ \\mathrm{mol\\ kg^{-1}}$$

**Answer: Option (2) — 4**`,
'tag_solutions_4', src(2019, 'Jan', 9, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (SOL-001 to SOL-010)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
