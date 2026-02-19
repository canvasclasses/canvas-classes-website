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

// Q91 — Van't Hoff factor of formic acid; Answer: (3) 1.9
mkSCQ('SOL-091', 'Hard',
`The depression in freezing point observed for a formic acid solution of concentration 0.5 mL L⁻¹ is 0.0405°C. Density of formic acid is 1.05 g mL⁻¹. The Van't Hoff factor of the formic acid solution is nearly:

(Given for water $k_f = 1.86\\ \\mathrm{K\\ kg\\ mol^{-1}}$)`,
['0.8', '1.1', '1.9', '2.4'],
'c',
`**Step 1 — Mass of formic acid in 1 L solution:**
$$m = 0.5\\ \\text{mL} \\times 1.05\\ \\text{g/mL} = 0.525\\ \\text{g}$$

**Step 2 — Moles of formic acid (HCOOH, M = 46 g/mol):**
$$n = \\frac{0.525}{46} = 0.01141\\ \\text{mol}$$

**Step 3 — Molality (solvent ≈ 1 kg water for dilute solution):**
$$m \\approx 0.01141\\ \\text{mol/kg}$$

**Step 4 — Van't Hoff factor:**
$$i = \\frac{\\Delta T_f}{K_f \\cdot m} = \\frac{0.0405}{1.86 \\times 0.01141} = \\frac{0.0405}{0.02122} = 1.909 \\approx 1.9$$

**Answer: Option (3) — 1.9**`,
'tag_solutions_6', src(2022, 'Jul', 25, 'Morning')),

// Q92 — Relation between MA and MB; Answer: (2) MB = 4MA
mkSCQ('SOL-092', 'Medium',
`Boiling point of a 2% aqueous solution of a nonvolatile solute A is equal to the boiling point of 8% aqueous solution of a non-volatile solute B. The relation between molecular weights of A and B is.`,
[
  `$M_A = 4M_B$`,
  `$M_B = 4M_A$`,
  `$M_A = 8M_B$`,
  `$M_B = 8M_A$`
],
'b',
`**Equal boiling points → equal elevation in BP → equal molality:**

For a $w$% solution (w g solute per 100 g solution → w g solute per (100−w) g solvent):

$$m = \\frac{w/M}{(100-w)/1000} = \\frac{1000w}{M(100-w)}$$

For dilute solutions (w << 100): $m \\approx \\dfrac{10w}{M}$

**Setting molalities equal:**
$$\\frac{10 \\times 2}{M_A} = \\frac{10 \\times 8}{M_B}$$
$$\\frac{2}{M_A} = \\frac{8}{M_B}$$
$$M_B = 4M_A$$

**Answer: Option (2) — $M_B = 4M_A$**`,
'tag_solutions_5', src(2022, 'Jul', 27, 'Morning')),

// Q93 — Moles of solute A added; Answer: 5.55 mol
mkNVT('SOL-093', 'Hard',
`When a certain amount of solid A is dissolved in 100 g of water at 25°C to make a dilute solution, the vapour pressure of the solution is reduced to one-half of that of pure water. The vapour pressure of pure water is 23.76 mmHg. The number of moles of solute A added is ____`,
{ decimal_value: 5.55 },
`**Step 1 — Relative lowering of VP:**
$$\\frac{P^\\circ - P}{P^\\circ} = \\frac{P^\\circ - P^\\circ/2}{P^\\circ} = \\frac{1}{2} = x_{\\text{solute}}$$

**Step 2 — Mole fraction of solute = 0.5:**
$$x_{\\text{solute}} = \\frac{n_A}{n_A + n_{\\text{water}}} = 0.5$$

$$n_A = n_{\\text{water}} = \\frac{100}{18} = 5.556\\ \\text{mol}$$

**Answer: 5.55 mol**`,
'tag_solutions_1', src(2022, 'Jul', 27, 'Evening')),

// Q94 — Percentage association of solute A; Answer: (4) 80%
mkSCQ('SOL-094', 'Medium',
`Solute A associates in water. When 0.7 g of solute A is dissolved in 42.0 g of water, it depresses the freezing point by 0.2°C. The percentage association of solute A in water, is

[Given: Molar mass of A = 93 g mol⁻¹. Molal depression constant of water is 1.86 K kg mol⁻¹]`,
['50%', '60%', '70%', '80%'],
'd',
`**Step 1 — Expected molality (no association):**
$$m_{\\text{exp}} = \\frac{0.7/93}{0.042} = \\frac{0.007527}{0.042} = 0.1792\\ \\text{mol/kg}$$

**Step 2 — Observed molality from FP depression:**
$$m_{\\text{obs}} = \\frac{\\Delta T_f}{K_f} = \\frac{0.2}{1.86} = 0.1075\\ \\text{mol/kg}$$

**Step 3 — Van't Hoff factor:**
$$i = \\frac{m_{\\text{obs}}}{m_{\\text{exp}}} = \\frac{0.1075}{0.1792} = 0.60$$

**Step 4 — Degree of association (assuming dimerisation, $2A \\rightarrow A_2$):**
$$i = 1 - \\frac{\\alpha}{2} = 0.60$$
$$\\frac{\\alpha}{2} = 0.40 \\Rightarrow \\alpha = 0.80 = 80\\%$$

**Answer: Option (4) — 80%**`,
'tag_solutions_6', src(2022, 'Jun', 25, 'Evening')),

// Q95 — Percentage dissociation of acetic acid; Answer: 5%
mkNVT('SOL-095', 'Hard',
`1.2 mL of acetic acid is dissolved in water to make 2.0 L of solution. The depression in freezing point observed for this strength of acid is 0.0198°C. The percentage of dissociation of the acid is (Nearest integer)

[Given: Density of acetic acid is 1.02 g mL⁻¹; Molar mass of acetic acid is 60 g mol⁻¹; $K_f(\\mathrm{H_2O}) = 1.85\\ \\mathrm{K\\ kg\\ mol^{-1}}$]`,
{ integer_value: 5 },
`**Step 1 — Mass and moles of acetic acid:**
$$m = 1.2 \\times 1.02 = 1.224\\ \\text{g}$$
$$n = \\frac{1.224}{60} = 0.0204\\ \\text{mol}$$

**Step 2 — Molality (solvent ≈ 2 kg for 2 L dilute solution):**
$$m = \\frac{0.0204}{2} = 0.0102\\ \\text{mol/kg}$$

**Step 3 — Van't Hoff factor from observed FP depression:**
$$i = \\frac{\\Delta T_f}{K_f \\cdot m} = \\frac{0.0198}{1.85 \\times 0.0102} = \\frac{0.0198}{0.01887} = 1.049$$

**Step 4 — Degree of dissociation:**
$$i = 1 + \\alpha \\Rightarrow \\alpha = 0.049 \\approx 5\\%$$

**Answer: 5%**`,
'tag_solutions_6', src(2022, 'Jun', 29, 'Morning')),

// Q96 — Largest FP depression among 0.10 M solutions; Answer: (3) KHSO4
mkSCQ('SOL-096', 'Medium',
`Which one of the following 0.10 M aqueous solutions will exhibit the largest freezing point depression?`,
['glycine', 'hydrazine', '$\\mathrm{KHSO_4}$', 'glucose'],
'c',
`**Largest FP depression = highest effective concentration (i × M):**

| Solute | Dissociation | i | i × 0.10 M |
|---|---|---|---|
| Glycine ($\\mathrm{H_2NCH_2COOH}$) | Zwitterion, effectively non-electrolyte | ~1 | 0.10 |
| Hydrazine ($\\mathrm{N_2H_4}$) | Weak base, slight ionisation | ~1 | ~0.10 |
| $\\mathrm{KHSO_4}$ | $\\mathrm{KHSO_4 \\rightarrow K^+ + H^+ + SO_4^{2-}}$ | 3 | **0.30** |
| Glucose | Non-electrolyte | 1 | 0.10 |

$\\mathrm{KHSO_4}$ dissociates completely into 3 ions → highest effective concentration → **largest FP depression**.

**Answer: Option (3) — $\\mathrm{KHSO_4}$**`,
'tag_solutions_5', src(2021, 'Aug', 31, 'Morning')),

// Q97 — Van't Hoff factor of HA (50% dimerises, rest dissociates); Answer: 125 × 10^-2
mkNVT('SOL-097', 'Hard',
`In a solvent 50% of an acid HA dimerizes and the rest dissociates. The van't Hoff factor of the acid is $\\_\\_\\_\\_ \\times 10^{-2}$ (Round off to the nearest integer)`,
{ integer_value: 125 },
`**Step 1 — Set up the equilibrium:**

Start with 1 mol of HA.
- 50% dimerises: 0.5 mol HA → 0.25 mol $(\\mathrm{HA})_2$
- 50% dissociates: 0.5 mol HA → 0.5 mol $\\mathrm{H^+}$ + 0.5 mol $\\mathrm{A^-}$

**Step 2 — Count total moles at equilibrium:**
- Unreacted HA: 0 mol (all 1 mol either dimerised or dissociated)
- $(\\mathrm{HA})_2$: 0.25 mol
- $\\mathrm{H^+}$: 0.5 mol
- $\\mathrm{A^-}$: 0.5 mol

Total = $0.25 + 0.5 + 0.5 = 1.25$ mol

**Step 3 — Van't Hoff factor:**
$$i = \\frac{\\text{total moles at equilibrium}}{\\text{initial moles}} = \\frac{1.25}{1} = 1.25 = 125 \\times 10^{-2}$$

**Answer: 125**`,
'tag_solutions_6', src(2021, 'Jul', 27, 'Evening')),

// Q98 — Boiling point of AB2 solution; Answer: 106°C
mkNVT('SOL-098', 'Hard',
`$\\mathrm{AB_2}$ is 10% dissociated in water to $\\mathrm{A^{2+}}$ and $\\mathrm{B^-}$. The boiling point of 10.0 molal aqueous solution of $\\mathrm{AB_2}$ is $\\_\\_\\_\\_$ °C. (Round off to the Nearest Integer).

[Given: Molal elevation constant of water $K_b = 0.5\\ \\mathrm{K\\ kg\\ mol^{-1}}$; boiling point of pure water = 100°C]`,
{ integer_value: 106 },
`**Step 1 — Van't Hoff factor for AB₂ (10% dissociation, n = 3 ions):**
$$i = 1 + (3-1)(0.10) = 1 + 0.20 = 1.20$$

**Step 2 — Elevation in BP:**
$$\\Delta T_b = i \\cdot K_b \\cdot m = 1.20 \\times 0.5 \\times 10 = 6\\ \\text{K}$$

**Step 3 — Boiling point:**
$$T_b = 100 + 6 = 106°\\text{C}$$

**Answer: 106°C**`,
'tag_solutions_6', src(2021, 'Mar', 16, 'Morning')),

// Q99 — Freezing point of C4H10 in benzene; Answer: 1°C (FP = 1°C, i.e. 5.5 - 4.5 = 1)
mkNVT('SOL-099', 'Medium',
`$\\mathrm{C_6H_6}$ freezes at 5.5°C. The temperature at which a solution of 10 g of $\\mathrm{C_4H_{10}}$ in 200 g of $\\mathrm{C_6H_6}$ freeze is $\\_\\_\\_\\_$ °C. (nearest integer value)

(The molal freezing point depression constant of $\\mathrm{C_6H_6}$ is 5.12°C/m.)`,
{ integer_value: 1 },
`**Step 1 — Molar mass of butane ($\\mathrm{C_4H_{10}}$):**
$$M = 4(12) + 10(1) = 58\\ \\text{g/mol}$$

**Step 2 — Moles of butane:**
$$n = \\frac{10}{58} = 0.1724\\ \\text{mol}$$

**Step 3 — Molality:**
$$m = \\frac{0.1724}{0.200} = 0.862\\ \\text{mol/kg}$$

**Step 4 — Depression in FP:**
$$\\Delta T_f = K_f \\times m = 5.12 \\times 0.862 = 4.41\\ \\text{K}$$

**Step 5 — Freezing point:**
$$T_f = 5.5 - 4.41 = 1.09 \\approx 1°\\text{C}$$

**Answer: 1°C**`,
'tag_solutions_5', src(2021, 'Feb', 24, 'Evening')),

// Q100 — Value of x in CrCl3·xNH3; Answer: 5
mkNVT('SOL-100', 'Hard',
`The elevation of boiling point of 0.10 m aqueous $\\mathrm{CrCl_3 \\cdot xNH_3}$ solution is two times that of 0.05 m aqueous $\\mathrm{CaCl_2}$ solution. The value of x is $\\_\\_\\_\\_$

[Assume 100% ionisation of the complex and $\\mathrm{CaCl_2}$, coordination number of Cr as 6, and that all $\\mathrm{NH_3}$ molecules are present inside the coordination sphere]`,
{ integer_value: 5 },
`**Step 1 — Van't Hoff factor of CaCl₂:**
$$\\mathrm{CaCl_2 \\rightarrow Ca^{2+} + 2Cl^-},\\quad i_{\\mathrm{CaCl_2}} = 3$$

**Step 2 — Elevation in BP of CaCl₂ solution:**
$$\\Delta T_{b,\\mathrm{CaCl_2}} = 3 \\times K_b \\times 0.05 = 0.15 K_b$$

**Step 3 — Elevation in BP of complex solution = 2 × that of CaCl₂:**
$$\\Delta T_{b,\\text{complex}} = 2 \\times 0.15 K_b = 0.30 K_b$$

**Step 4 — Van't Hoff factor of complex:**
$$i_{\\text{complex}} \\times K_b \\times 0.10 = 0.30 K_b$$
$$i_{\\text{complex}} = 3$$

**Step 5 — Determine x:**

The complex $\\mathrm{[Cr(NH_3)_x Cl_{6-x}]Cl_{x-3}}$ (coordination number = 6):
- Cr has coordination number 6, so $x$ NH₃ + $(6-x)$ Cl⁻ are inside the sphere
- Remaining Cl⁻ outside = $3 - (6-x) = x - 3$ (for $x > 3$)

For $i = 3$: the complex dissociates into 3 ions total.
$$[\\mathrm{Cr(NH_3)_x Cl_{6-x}}]^{(x-3)+} + (x-3)\\mathrm{Cl^-}$$

Number of ions = $1 + (x-3) = x - 2 = 3 \\Rightarrow x = 5$

**Verify:** $\\mathrm{[Cr(NH_3)_5Cl]Cl_2}$ → $\\mathrm{[Cr(NH_3)_5Cl]^{2+} + 2Cl^-}$ → 3 ions ✓

**Answer: x = 5**`,
'tag_solutions_6', src(2020, 'Sep', 6, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (SOL-091 to SOL-100)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
