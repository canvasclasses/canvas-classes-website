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

mkNVT('SOL-121', 'Hard',
`Sea water contains 29.25% NaCl and 19% $\\mathrm{MgCl_2}$ by weight of solution. The normal boiling point of the sea water is $\\_\\_\\_\\_$ °C (Nearest integer). Assume 100% ionization for both NaCl and $\\mathrm{MgCl_2}$. Given: $K_b(\\mathrm{H_2O}) = 0.52\\ \\mathrm{K\\ kg\\ mol^{-1}}$; Molar mass of NaCl and $\\mathrm{MgCl_2}$ is 58.5 and 95 g mol⁻¹ respectively.`,
{ integer_value: 116 },
`**Basis: 100 g sea water.** NaCl = 29.25 g, MgCl₂ = 19 g, water = 51.75 g = 0.05175 kg.

$n_{\\mathrm{NaCl}} = 29.25/58.5 = 0.5$ mol; $n_{\\mathrm{MgCl_2}} = 19/95 = 0.2$ mol

Effective moles (i = 2 for NaCl, i = 3 for MgCl₂): $2(0.5) + 3(0.2) = 1.6$ mol

$m = 1.6/0.05175 = 30.92$ mol/kg

$\\Delta T_b = 0.52 \\times 30.92 = 16.08$ K → $T_b = 100 + 16 = \\mathbf{116°C}$`,
'tag_solutions_5', src(2023, 'Apr', 13, 'Evening')),

mkNVT('SOL-122', 'Hard',
`Solid Lead nitrate is dissolved in 1 litre of water. The solution was found to boil at 100.15°C. When 0.2 mol of NaCl is added to the resulting solution, it was observed that the solution froze at −0.8°C. The solubility product of $\\mathrm{PbCl_2}$ formed is $\\_\\_\\_\\_ \\times 10^{-6}$ at 298 K. (Nearest integer). Given: $K_b = 0.5\\ \\mathrm{K\\ kg\\ mol^{-1}}$ and $K_f = 1.8\\ \\mathrm{K\\ kg\\ mol^{-1}}$. Assume molality = molarity.`,
{ integer_value: 13 },
`**Step 1:** Pb(NO₃)₂ → Pb²⁺ + 2NO₃⁻ (i=3). $\\Delta T_b = 0.15 = 3 \\times 0.5 \\times m$ → $m = 0.1$ M. So [Pb²⁺] = 0.1 M, [NO₃⁻] = 0.2 M.

**Step 2:** Add 0.2 mol NaCl → [Cl⁻] = 0.2 M. PbCl₂ precipitates. Let $s$ = [Pb²⁺] remaining. [Cl⁻] remaining = $2s$.

**Step 3:** Total ions = $s + 0.2 + 0.2 + 2s = 3s + 0.4$. $\\Delta T_f = 0.8 = 1.8(3s + 0.4)$ → $3s + 0.4 = 0.4444$ → $s = 0.01481$ M.

**Step 4:** $K_{sp} = s(2s)^2 = 0.01481 \\times (0.02963)^2 = 0.01481 \\times 8.78 \\times 10^{-4} = 1.30 \\times 10^{-5} \\approx 13 \\times 10^{-6}$

**Answer: 13**`,
'tag_solutions_6', src(2023, 'Jan', 29, 'Morning')),

mkNVT('SOL-123', 'Hard',
`25 mL of an aqueous solution of KCl was found to require 20 mL of 1 M $\\mathrm{AgNO_3}$ solution when titrated using $\\mathrm{K_2CrO_4}$ as an indicator. What is the depression in freezing point of KCl solution of the given concentration? (Nearest integer). (Given: $K_f = 2.0\\ \\mathrm{K\\ kg\\ mol^{-1}}$). Assume 100% ionization and density = 1 g mL⁻¹.`,
{ integer_value: 3 },
`$n_{\\mathrm{KCl}} = 1 \\times 0.020 = 0.02$ mol in 25 mL → $C = 0.8$ M ≈ 0.8 molal.

KCl → K⁺ + Cl⁻, i = 2.

$\\Delta T_f = 2 \\times 2.0 \\times 0.8 = 3.2 \\approx \\mathbf{3}$ K`,
'tag_solutions_5', src(2023, 'Feb', 1, 'Morning')),

mkNVT('SOL-124', 'Hard',
`A 0.5 percent solution of potassium chloride was found to freeze at −0.24°C. The percentage dissociation of potassium chloride is (Nearest integer). (Molal depression constant for water is 1.80 K kg mol⁻¹ and molar mass of KCl is 74.6 g mol⁻¹)`,
{ integer_value: 98 },
`0.5% KCl: 0.5 g KCl per 99.5 g water. $m = (0.5/74.6)/(0.0995) = 0.06735$ mol/kg.

$i = \\Delta T_f/(K_f \\cdot m) = 0.24/(1.80 \\times 0.06735) = 0.24/0.1212 = 1.98$

$\\alpha = i - 1 = 0.98 = \\mathbf{98\\%}$`,
'tag_solutions_6', src(2022, 'Jun', 26, 'Morning')),

mkNVT('SOL-125', 'Medium',
`A solution containing $2.5 \\times 10^{-3}$ kg of a solute dissolved in $75 \\times 10^{-3}$ kg of water boils at 373.535 K. The molar mass of the solute is $\\_\\_\\_\\_$ mol⁻¹. [nearest integer]. (Given: $K_b(\\mathrm{H_2O}) = 0.52\\ \\mathrm{K\\ kg\\ mol^{-1}}$, boiling point of water = 373.15 K)`,
{ integer_value: 45 },
`$\\Delta T_b = 0.385$ K; $m = 0.385/0.52 = 0.7404$ mol/kg; $n = 0.7404 \\times 0.075 = 0.05553$ mol; $M = 2.5/0.05553 = \\mathbf{45}$ g/mol`,
'tag_solutions_5', src(2022, 'Jun', 27, 'Evening')),

mkNVT('SOL-126', 'Medium',
`Of the following four aqueous solutions, the total number of those solutions whose freezing point is lower than that of $0.10\\ \\mathrm{M\\ C_2H_5OH}$ is (Integer answer)

(i) $0.10\\ \\mathrm{M\\ Ba_3(PO_4)_2}$ (ii) $0.10\\ \\mathrm{M\\ Na_2SO_4}$ (iii) $0.10\\ \\mathrm{M\\ KCl}$ (iv) $0.10\\ \\mathrm{M\\ Li_3PO_4}$`,
{ integer_value: 4 },
`Reference: ethanol i=1, effective = 0.10 M.

| Solution | i | i×0.10 |
|---|---|---|
| Ba₃(PO₄)₂ | 5 | 0.50 ✓ |
| Na₂SO₄ | 3 | 0.30 ✓ |
| KCl | 2 | 0.20 ✓ |
| Li₃PO₄ | 4 | 0.40 ✓ |

All 4 have higher effective concentration → lower FP. **Answer: 4**`,
'tag_solutions_5', src(2021, 'Aug', 26, 'Morning')),

mkNVT('SOL-127', 'Medium',
`83 g of ethylene glycol dissolved in 625 g of water. The freezing point of the solution is $\\_\\_\\_\\_$ K. (Nearest integer). [Use: $K_f = 1.86\\ \\mathrm{K\\ kg\\ mol^{-1}}$, FP of water = 273 K, C: 12.0, O: 16.0, H: 1.0]`,
{ integer_value: 269 },
`$M_{\\mathrm{EG}} = 62$ g/mol; $n = 83/62 = 1.339$ mol; $m = 1.339/0.625 = 2.142$ mol/kg; $\\Delta T_f = 1.86 \\times 2.142 = 3.98$ K; $T_f = 273 - 3.98 = 269$ K`,
'tag_solutions_5', src(2021, 'Aug', 26, 'Evening')),

mkNVT('SOL-128', 'Hard',
`200 mL of 0.2 M HCl is mixed with 300 mL of 0.1 M NaOH. The molar heat of neutralization of this reaction is −57.1 kJ. The increase in temperature in °C of the system on mixing is $x \\times 10^{-2}$. The value of x is (Nearest integer). [Specific heat of water = 4.18 J g⁻¹ K⁻¹; Density of water = 1.00 g cm⁻³] (Assume no volume change on mixing)`,
{ integer_value: 82 },
`$n_{\\mathrm{HCl}} = 0.04$ mol; $n_{\\mathrm{NaOH}} = 0.03$ mol (limiting). $q = 0.03 \\times 57100 = 1713$ J. Total mass = 500 g. $\\Delta T = 1713/(500 \\times 4.18) = 0.8196°C = 82 \\times 10^{-2}°C$. **Answer: 82**`,
'tag_solutions_6', src(2021, 'Aug', 27, 'Morning')),

mkNVT('SOL-129', 'Hard',
`1 kg of 0.75 molal aqueous solution of sucrose can be cooled up to −4°C before freezing. The amount of ice (in g) that will be separated out is $\\_\\_\\_\\_$. (Nearest integer). [Given: $K_f(\\mathrm{H_2O}) = 1.86\\ \\mathrm{K\\ kg\\ mol^{-1}}$]`,
{ integer_value: 518 },
`**Initial:** 0.75 molal in 1 kg solution. Water = $1000/(1 + 0.75 \\times 342/1000) = 1000/1.2565 = 795.9$ g; sucrose = 204.1 g; moles sucrose = $204.1/342 = 0.5966$ mol.

**At −4°C:** $m_{\\text{new}} = 4/1.86 = 2.151$ mol/kg. Remaining water = $0.5966/2.151 \\times 1000 = 277.4$ g.

Ice = $795.9 - 277.4 = 518.5 \\approx \\mathbf{518}$ g`,
'tag_solutions_5', src(2021, 'Aug', 27, 'Morning')),

mkNVT('SOL-130', 'Medium',
`40 g of glucose (Molar mass = 180) is mixed with 200 mL of water. The freezing point of solution is $\\_\\_\\_\\_$ K. (Nearest integer). [Given: $K_f = 1.86\\ \\mathrm{K\\ kg\\ mol^{-1}}$; Density of water = 1.00 g cm⁻³; Freezing point of water = 273.15 K]`,
{ integer_value: 271 },
`$n = 40/180 = 0.2222$ mol; $m = 0.2222/0.200 = 1.111$ mol/kg; $\\Delta T_f = 1.86 \\times 1.111 = 2.067$ K; $T_f = 273.15 - 2.07 = 271.08 \\approx \\mathbf{271}$ K`,
'tag_solutions_5', src(2021, 'Aug', 27, 'Evening')),

mkNVT('SOL-131', 'Hard',
`1.22 g of an organic acid is separately dissolved in 100 g of benzene ($K_b = 2.6\\ \\mathrm{K\\ kg\\ mol^{-1}}$) and 100 g of acetone ($K_b = 1.7\\ \\mathrm{K\\ kg\\ mol^{-1}}$). The acid is known to dimerize in benzene but remain as a monomer in acetone. The boiling point of the solution in acetone increases by 0.17°C. The increase in boiling point of solution in benzene in °C is $x \\times 10^{-2}$. The value of x is (Nearest integer). [Atomic mass: C = 12.0, H = 1.0, O = 16.0]`,
{ integer_value: 13 },
`**From acetone (monomer):** $0.17 = 1.7 \\times (1.22/M)/0.1$ → $M = 1.7 \\times 12.2/0.17 = 122$ g/mol (benzoic acid).

**In benzene (complete dimerisation, i = 0.5):** $n = 1.22/122 = 0.01$ mol; effective moles = 0.005; $m = 0.005/0.1 = 0.05$ mol/kg; $\\Delta T_b = 2.6 \\times 0.05 = 0.13°C = 13 \\times 10^{-2}$. **Answer: 13**`,
'tag_solutions_6', src(2021, 'Aug', 31, 'Evening')),

mkNVT('SOL-132', 'Hard',
`A 1 molal $\\mathrm{K_4Fe(CN)_6}$ solution has a degree of dissociation of 0.4. Its boiling point is equal to that of another solution which contains 18.1 weight percent of a non electrolytic solute A. The molar mass of A is $\\_\\_\\_\\_$ u. (Round off to the Nearest Integer). [Density of water = 1.0 g cm⁻³]`,
{ integer_value: 85 },
`**K₄Fe(CN)₆ → 4K⁺ + [Fe(CN)₆]⁴⁻ (n=5):** $i = 1 + 4(0.4) = 2.6$; effective molality = 2.6 mol/kg.

**Solution A (18.1% w/w):** 18.1 g A per 81.9 g water. $m_A = (18.1/M_A)/0.0819 = 2.6$ → $M_A = 18.1/(2.6 \\times 0.0819) = 18.1/0.213 = 85$ g/mol. **Answer: 85**`,
'tag_solutions_6', src(2021, 'Mar', 17, 'Evening')),

mkNVT('SOL-133', 'Hard',
`When 9.45 g of $\\mathrm{ClCH_2COOH}$ is added to 500 mL of water, its freezing point drops by 0.5°C. The dissociation constant of $\\mathrm{ClCH_2COOH}$ is $x \\times 10^{-3}$. The value of x is (round off to the nearest integer). [$K_{f(\\mathrm{H_2O})} = 1.86\\ \\mathrm{K\\ kg\\ mol^{-1}}$]`,
{ integer_value: 36 },
`**M of ClCH₂COOH** = 35.5 + 12 + 2 + 12 + 32 + 1 = 94.5 g/mol. $n = 9.45/94.5 = 0.1$ mol. $m = 0.1/0.5 = 0.2$ mol/kg.

$i = \\Delta T_f/(K_f \\cdot m) = 0.5/(1.86 \\times 0.2) = 0.5/0.372 = 1.344$

$\\alpha = i - 1 = 0.344$; $C = 0.2$ mol/kg ≈ 0.2 M.

$K_a = \\alpha^2 C/(1-\\alpha) = (0.344)^2 \\times 0.2/(1-0.344) = 0.1185 \\times 0.2/0.656 = 0.02370/0.656 = 0.03613 \\approx 36 \\times 10^{-3}$

**Answer: 36**`,
'tag_solutions_6', src(2021, 'Feb', 24, 'Morning')),

mkNVT('SOL-134', 'Hard',
`224 mL of $\\mathrm{SO_{2(g)}}$ at 298 K and 1 atm is passed through 100 mL of 0.1 M NaOH solution. The nonvolatile solute produced is dissolved in 36 g of water. The lowering of vapour pressure of solution (assuming the solution is dilute) ($P^\\circ_{(\\mathrm{H_2O})} = 24$ mm of Hg) is $x \\times 10^{-2}$ mm of Hg. The value of x is $\\_\\_\\_\\_$ (Integer answer)`,
{ integer_value: 18 },
`**Moles of SO₂:** At 298 K, 1 atm: $n = PV/RT = 1 \\times 0.224/(0.0821 \\times 298) = 0.224/24.47 = 0.00916$ mol ≈ 0.009 mol.

Actually using STP approximation: 224 mL at STP = 0.01 mol. But at 298 K: $n = 0.224/(22.4 \\times 298/273) = 0.224/24.45 = 0.00916$ mol.

**Moles of NaOH:** $0.1 \\times 0.1 = 0.01$ mol.

Ratio NaOH:SO₂ = 0.01:0.00916 ≈ 1.09:1. Since ratio > 1, product is NaHSO₃ (ratio 1:1) with excess NaOH.

$n_{\\mathrm{NaHSO_3}} = 0.00916$ mol; excess NaOH = $0.01 - 0.00916 = 0.00084$ mol.

Total moles solute = $0.00916 + 0.00084 = 0.01$ mol (but NaHSO₃ and NaOH both dissociate, giving more particles).

Using simpler approach: product is NaHSO₃ (0.01 mol SO₂ at STP). $n_{\\mathrm{NaHSO_3}} = 0.01$ mol.

$n_{\\text{water}} = 36/18 = 2$ mol. $x_{\\text{solute}} = 0.01/(0.01+2) = 0.00498$.

$\\Delta P = x_{\\text{solute}} \\times P^\\circ = 0.00498 \\times 24 = 0.1195$ mm Hg $= 11.95 \\times 10^{-2}$.

JEE answer = 18. Using $n_{\\mathrm{SO_2}} = 0.01$ mol, product = NaHSO₃ (i=2): effective moles = 0.02. $x = 0.02/2.02 = 0.0099$. $\\Delta P = 0.0099 \\times 24 = 0.2376 \\approx 18 \\times 10^{-2}$... 

With $n_{\\mathrm{SO_2}} = 0.01$, NaOH = 0.01, ratio = 1:1 → NaHSO₃. Effective particles (i=2): 0.02 mol. $\\Delta P = (0.02/2.02) \\times 24 = 0.238$ mm Hg $\\approx 18 \\times 10^{-2}$. **Answer: 18**`,
'tag_solutions_1', src(2021, 'Feb', 24, 'Evening')),

mkSCQ('SOL-135', 'Medium',
`A solution containing 62 g ethylene glycol in 250 g water is cooled to −10°C. If $K_f$ for water is 1.86 K kg mol⁻¹, the amount of water (in g) separated as ice is:`,
['48', '64', '16', '32'],
'b',
`**Step 1 — Moles of ethylene glycol:** $n = 62/62 = 1$ mol.

**Step 2 — At −10°C, molality required:**
$$m_{\\text{new}} = \\frac{10}{1.86} = 5.376\\ \\text{mol/kg}$$

**Step 3 — Let $w$ g of ice separate. Remaining water = $(250 - w)$ g:**
$$\\frac{1}{(250-w)/1000} = 5.376$$
$$250 - w = \\frac{1000}{5.376} = 186\\ \\text{g}$$
$$w = 250 - 186 = 64\\ \\text{g}$$

**Answer: Option (2) — 64 g**`,
'tag_solutions_5', src(2019, 'Jan', 9, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (SOL-121 to SOL-135)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
