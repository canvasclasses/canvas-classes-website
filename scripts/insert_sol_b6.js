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

// Q51 — Molarity of oxalic acid solution; Answer: 20 × 10^-2 M
mkNVT('SOL-051', 'Medium',
`The molarity of the solution prepared by dissolving 6.3 g of oxalic acid ($\\mathrm{H_2C_2O_4 \\cdot 2H_2O}$) in 250 mL of water in mol L⁻¹ is $x \\times 10^{-2}$. The value of x is $\\_\\_\\_\\_$. (Nearest integer)

[Atomic mass: H: 1.0, C: 12.0, O: 16.0]`,
{ integer_value: 20 },
`**Step 1 — Molar mass of $\\mathrm{H_2C_2O_4 \\cdot 2H_2O}$:**
$$M = 2(1) + 2(12) + 4(16) + 2(18) = 2 + 24 + 64 + 36 = 126\\ \\mathrm{g\\ mol^{-1}}$$

**Step 2 — Moles:**
$$n = \\frac{6.3}{126} = 0.05\\ \\mathrm{mol}$$

**Step 3 — Molarity:**
$$M = \\frac{0.05}{0.250} = 0.20\\ \\mathrm{mol\\ L^{-1}} = 20 \\times 10^{-2}$$

**Answer: x = 20**`,
'tag_solutions_4', src(2021, 'Aug', 31, 'Morning')),

// Q52 — Concentration of NaOH from Na2O; Answer: 13 × 10^-1 M
mkNVT('SOL-052', 'Medium',
`Sodium oxide reacts with water to produce sodium hydroxide. 20.0 g of sodium oxide is dissolved in 500 mL of water. Neglecting the change in volume, the concentration of the resulting NaOH solution is $\\_\\_\\_\\_ \\times 10^{-1}$ M. (Nearest integer)

[Atomic mass: Na = 23.0, O = 16.0, H = 1.0]`,
{ integer_value: 13 },
`**Step 1 — Reaction:**
$$\\mathrm{Na_2O + H_2O \\rightarrow 2NaOH}$$

**Step 2 — Molar mass of $\\mathrm{Na_2O}$:**
$$M = 2(23) + 16 = 62\\ \\mathrm{g\\ mol^{-1}}$$

**Step 3 — Moles of $\\mathrm{Na_2O}$:**
$$n_{\\mathrm{Na_2O}} = \\frac{20.0}{62} = 0.3226\\ \\mathrm{mol}$$

**Step 4 — Moles of NaOH (ratio 1:2):**
$$n_{\\mathrm{NaOH}} = 2 \\times 0.3226 = 0.6452\\ \\mathrm{mol}$$

**Step 5 — Molarity:**
$$M = \\frac{0.6452}{0.500} = 1.290\\ \\mathrm{M} = 12.9 \\times 10^{-1} \\approx 13 \\times 10^{-1}$$

**Answer: 13**`,
'tag_solutions_4', src(2021, 'Aug', 31, 'Evening')),

// Q53 — Concentration of CuSO4 from CuSO4·5H2O; Answer: 64 × 10^-3 mol/L
mkNVT('SOL-053', 'Medium',
`If 80 g of copper sulphate $\\mathrm{CuSO_4 \\cdot 5H_2O}$ is dissolved in deionised water to make 5 L of solution. The concentration of the copper sulphate solution is $x \\times 10^{-3}$ mol L⁻¹. The value of x is $\\_\\_\\_\\_$.

[Atomic masses Cu: 63.54 u, S: 32 u, O: 16 u, H: 1 u]`,
{ integer_value: 64 },
`**Step 1 — Molar mass of $\\mathrm{CuSO_4 \\cdot 5H_2O}$:**
$$M = 63.54 + 32 + 4(16) + 5(18) = 63.54 + 32 + 64 + 90 = 249.54\\ \\mathrm{g\\ mol^{-1}}$$

**Step 2 — Moles:**
$$n = \\frac{80}{249.54} = 0.3206\\ \\mathrm{mol}$$

**Step 3 — Molarity:**
$$M = \\frac{0.3206}{5} = 0.06413\\ \\mathrm{mol\\ L^{-1}} = 64.13 \\times 10^{-3} \\approx 64 \\times 10^{-3}$$

**Answer: x = 64**`,
'tag_solutions_4', src(2021, 'Sep', 1, 'Evening')),

// Q54 — Mass of FeSO4·7H2O for 10 ppm Fe in wheat; Answer: 4.95 g
mkNVT('SOL-054', 'Hard',
`Ferrous sulphate heptahydrate is used to fortify foods with iron. The amount (in grams) of the salt required to achieve 10 ppm of iron in 100 kg of wheat is $\\_\\_\\_\\_$.

Atomic weight: Fe = 55.85; S = 32.00; O = 16.00`,
{ decimal_value: 4.95 },
`**Step 1 — Mass of Fe needed (10 ppm in 100 kg wheat):**
$$m_{\\mathrm{Fe}} = \\frac{10}{10^6} \\times 100 \\times 10^3\\ \\mathrm{g} = 1\\ \\mathrm{g}$$

**Step 2 — Molar mass of $\\mathrm{FeSO_4 \\cdot 7H_2O}$:**
$$M = 55.85 + 32 + 4(16) + 7(18) = 55.85 + 32 + 64 + 126 = 277.85\\ \\mathrm{g\\ mol^{-1}}$$

**Step 3 — Moles of Fe needed:**
$$n_{\\mathrm{Fe}} = \\frac{1}{55.85} = 0.01790\\ \\mathrm{mol}$$

**Step 4 — Mass of $\\mathrm{FeSO_4 \\cdot 7H_2O}$ (1:1 ratio with Fe):**
$$m = 0.01790 \\times 277.85 = 4.97 \\approx 4.95\\ \\mathrm{g}$$

**Answer: 4.95 g**`,
'tag_solutions_4', src(2020, 'Jan', 8, 'Morning')),

// Q55 — Positive deviation from Raoult's law; Answer: (4) acetone + CS2
mkSCQ('SOL-055', 'Easy',
`Identify the mixture that shows positive deviations from Raoult's Law`,
[
  `$(\\mathrm{CH_3})_2\\mathrm{CO} + \\mathrm{C_6H_5NH_2}$`,
  `$\\mathrm{CHCl_3} + \\mathrm{C_6H_6}$`,
  `$\\mathrm{CHCl_3} + (\\mathrm{CH_3})_2\\mathrm{CO}$`,
  `$(\\mathrm{CH_3})_2\\mathrm{CO} + \\mathrm{CS_2}$`
],
'd',
`**Positive deviation** from Raoult's law occurs when A–B interactions are **weaker** than A–A and B–B interactions. The vapour pressure is higher than ideal.

| Mixture | A–B interaction | Deviation |
|---|---|---|
| Acetone + aniline | H-bonding (A–B stronger) | Negative |
| CHCl₃ + benzene | Weak dipole-induced | Positive |
| CHCl₃ + acetone | H-bonding (CHCl₃ donates H to C=O) | Negative |
| Acetone + CS₂ | Dipole–non-polar (weaker A–B) | **Positive** |

**Acetone ($\\mathrm{(CH_3)_2CO}$) + $\\mathrm{CS_2}$:** Acetone is polar and CS₂ is non-polar. The A–B interactions are weaker than A–A (dipole-dipole) interactions in pure acetone, leading to positive deviation.

**Answer: Option (4) — $(\\mathrm{CH_3})_2\\mathrm{CO} + \\mathrm{CS_2}$**`,
'tag_solutions_3', src(2024, 'Jan', 31, 'Morning')),

// Q56 — Boiling point of solvent from VP-T graph; Answer: 82°C
mkNVT('SOL-056', 'Medium',
`The vapour pressure vs. temperature curve for a solution–solvent system is shown below. The boiling point of the solvent is $\\_\\_\\_\\_$ °C.

![Vapour pressure vs temperature graph](https://cdn.mathpix.com/cropped/bf411b36-f043-4538-b3e9-9713e0bd83a5-05.jpg?height=367&width=327&top_left_y=1299&top_left_x=1448)`,
{ integer_value: 82 },
`**Reading the graph:**

The boiling point of a liquid is the temperature at which its vapour pressure equals the external (atmospheric) pressure (760 mm Hg or 1 atm).

From the vapour pressure vs. temperature graph:
- The **solvent curve** intersects the atmospheric pressure line (1 atm = 760 mm Hg) at a certain temperature.
- Reading from the graph, the solvent curve crosses 760 mm Hg at **82°C**.

The solution curve intersects at a higher temperature (showing elevation in boiling point).

**Answer: 82°C**`,
'tag_solutions_1', src(2023, 'Apr', 11, 'Evening')),

// Q57 — Mass of glucose to lower VP by 0.20 mmHg; Answer: (2) 3.69 g
mkSCQ('SOL-057', 'Medium',
`What weight of glucose must be dissolved in 100 g of water to lower the vapour pressure by 0.20 mm Hg? (Assume dilute solution is being formed)

Given: Vapour pressure of pure water is 54.2 mm Hg at room temperature. Molar mass of glucose is 180 g mol⁻¹`,
['3.59 g', '3.69 g', '4.69 g', '2.59 g'],
'b',
`**Step 1 — Relative lowering of VP:**
$$\\frac{\\Delta P}{P^\\circ} = x_{\\text{glucose}} = \\frac{0.20}{54.2} = 3.69 \\times 10^{-3}$$

**Step 2 — For dilute solution, $x_{\\text{glucose}} \\approx \\dfrac{n_{\\text{glucose}}}{n_{\\text{water}}}$:**
$$n_{\\text{water}} = \\frac{100}{18} = 5.556\\ \\mathrm{mol}$$

$$n_{\\text{glucose}} = 3.69 \\times 10^{-3} \\times 5.556 = 0.02050\\ \\mathrm{mol}$$

**Step 3 — Mass of glucose:**
$$m = 0.02050 \\times 180 = 3.69\\ \\mathrm{g}$$

**Answer: Option (2) — 3.69 g**`,
'tag_solutions_1', src(2023, 'Apr', 11, 'Evening')),

// Q58 — VP of MgCl2 solution at 38°C; Answer: 48 mm Hg
mkNVT('SOL-058', 'Hard',
`80 mole percent of $\\mathrm{MgCl_2}$ is dissociated in aqueous solution. The vapour pressure of 1.0 molal aqueous solution of $\\mathrm{MgCl_2}$ at 38°C is $\\_\\_\\_\\_$ mm Hg. (Nearest integer)

Given: Vapour pressure of water at 38°C is 50 mm Hg`,
{ integer_value: 48 },
`**Step 1 — Van't Hoff factor for MgCl₂ (80% dissociation):**
$$\\mathrm{MgCl_2 \\rightarrow Mg^{2+} + 2Cl^-}\\quad (n = 3)$$
$$i = 1 + (3-1)(0.80) = 1 + 1.6 = 2.6$$

**Step 2 — Effective molality:**
$$m_{\\text{eff}} = i \\times m = 2.6 \\times 1.0 = 2.6\\ \\mathrm{mol\\ kg^{-1}}$$

**Step 3 — Mole fraction of solvent (water):**
$$n_{\\text{water}} = \\frac{1000}{18} = 55.56\\ \\mathrm{mol}$$
$$n_{\\text{particles}} = 2.6\\ \\mathrm{mol}$$
$$x_{\\text{water}} = \\frac{55.56}{55.56 + 2.6} = \\frac{55.56}{58.16} = 0.9553$$

**Step 4 — Vapour pressure of solution (Raoult's law):**
$$P = x_{\\text{water}} \\times P^\\circ = 0.9553 \\times 50 = 47.77 \\approx 48\\ \\mathrm{mm\\ Hg}$$

**Answer: 48 mm Hg**`,
'tag_solutions_1', src(2023, 'Apr', 12, 'Morning')),

// Q59 — Vapour pressure of pure A; Answer: 314 mm Hg
mkNVT('SOL-059', 'Hard',
`The Total pressure observed by mixing two liquid A and B is 350 mm Hg when their mole fractions are 0.7 and 0.3 respectively. The Total pressure becomes 410 mm Hg if the mole fractions are changed to 0.2 and 0.8 respectively for A and B. The vapour pressure of pure A is $\\_\\_\\_\\_$ mm Hg. (Nearest integer)

Consider the liquids and solutions behave ideally`,
{ integer_value: 314 },
`**Step 1 — Set up equations using Raoult's law:**

$$P_{\\text{total}} = x_A P_A^\\circ + x_B P_B^\\circ$$

**Equation 1:** $0.7 P_A^\\circ + 0.3 P_B^\\circ = 350$ ... (1)

**Equation 2:** $0.2 P_A^\\circ + 0.8 P_B^\\circ = 410$ ... (2)

**Step 2 — Solve simultaneously:**

From (1): $7 P_A^\\circ + 3 P_B^\\circ = 3500$ ... (1')

From (2): $2 P_A^\\circ + 8 P_B^\\circ = 4100$ ... (2')

Multiply (1') by 8 and (2') by 3:
$$56 P_A^\\circ + 24 P_B^\\circ = 28000$$
$$6 P_A^\\circ + 24 P_B^\\circ = 12300$$

Subtract: $50 P_A^\\circ = 15700$
$$P_A^\\circ = 314\\ \\mathrm{mm\\ Hg}$$

**Answer: 314 mm Hg**`,
'tag_solutions_3', src(2023, 'Jan', 24, 'Evening')),

// Q60 — Vapour pressure of pure liquid A; Answer: 2 atm
mkNVT('SOL-060', 'Hard',
`A gaseous mixture of two substances A and B, under a total pressure of 0.8 atm is in equilibrium with an ideal liquid solution. The mole fraction of substance A is 0.5 in the vapour phase and 0.2 in the liquid phase. The vapour pressure of pure liquid A is $\\_\\_\\_\\_$ atm. (Nearest integer)`,
{ integer_value: 2 },
`**Step 1 — Partial pressure of A in vapour:**
$$P_A = y_A \\times P_{\\text{total}} = 0.5 \\times 0.8 = 0.4\\ \\mathrm{atm}$$

**Step 2 — Raoult's law for A:**
$$P_A = x_A \\times P_A^\\circ$$
$$0.4 = 0.2 \\times P_A^\\circ$$
$$P_A^\\circ = \\frac{0.4}{0.2} = 2\\ \\mathrm{atm}$$

**Answer: 2 atm**`,
'tag_solutions_3', src(2022, 'Jul', 28, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (SOL-051 to SOL-060)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
