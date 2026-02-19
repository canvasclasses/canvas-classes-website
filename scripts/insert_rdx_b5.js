const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_redox';
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

// Q41 — Cr2O7^2- + XH+ + Ye- → 2A + ZH2O; Answer: (4) 14, 6, 7 and Cr3+
mkSCQ('RDX-041', 'Medium',
`In acidic medium, $\\mathrm{K_2Cr_2O_7}$ shows oxidising action as represented in the half reaction:

$$\\mathrm{Cr_2O_7^{2-} + XH^{+} + Ye^{-} \\rightarrow 2A + ZH_2O}$$

$X$, $Y$, $Z$ and $A$ are respectively:`,
[
  `8, 6, 4 and $\\mathrm{Cr_2O_3}$`,
  `14, 7, 6 and $\\mathrm{Cr^{3+}}$`,
  `8, 4, 6 and $\\mathrm{Cr_2O_3}$`,
  `14, 6, 7 and $\\mathrm{Cr^{3+}}$`
],
'd',
`**Step 1 — Identify the product A:**
In acidic medium, $\\mathrm{Cr_2O_7^{2-}}$ is reduced to $\\mathrm{Cr^{3+}}$:
$$\\mathrm{Cr_2O_7^{2-} \\rightarrow 2Cr^{3+}}$$
So $A = \\mathrm{Cr^{3+}}$

**Step 2 — Balance Cr:**
2 Cr on each side ✓

**Step 3 — Balance O (using $\\mathrm{H_2O}$):**
7 O on left → 7 $\\mathrm{H_2O}$ on right → $Z = 7$

**Step 4 — Balance H (using $\\mathrm{H^+}$):**
$7 \\times 2 = 14$ H on right → 14 $\\mathrm{H^+}$ on left → $X = 14$

**Step 5 — Balance charge (using $e^-$):**
Left charge: $-2 + 14(+1) + Y(-1) = 12 - Y$
Right charge: $2(+3) = +6$
$$12 - Y = 6 \\Rightarrow Y = 6$$

**Verify:** $\\mathrm{Cr_2O_7^{2-} + 14H^{+} + 6e^{-} \\rightarrow 2Cr^{3+} + 7H_2O}$
- Cr: $+6 \\rightarrow +3$ (gain of 3e⁻ per Cr, 6e⁻ total) ✓
- Charge: $-2 + 14 - 6 = +6 = 2(+3)$ ✓

**$X = 14$, $Y = 6$, $Z = 7$, $A = \\mathrm{Cr^{3+}}$**

**Answer: Option (4)**`,
'tag_redox_1', src(2024, 'Feb', 1, 'Morning')),

// Q42 — Water molecules produced for 2 KMnO4 in FAS titration; Answer: 68
mkNVT('RDX-042', 'Hard',
`$\\mathrm{KMnO_4}$ is titrated with ferrous ammonium sulphate hexahydrate in presence of dilute $\\mathrm{H_2SO_4}$. Number of water molecules produced for 2 molecules of $\\mathrm{KMnO_4}$ is $\\_\\_\\_\\_$`,
{ integer_value: 68 },
`**Step 1 — Balanced reaction of $\\mathrm{KMnO_4}$ with FAS (Mohr's salt) in acidic medium:**

Ferrous ammonium sulphate hexahydrate = $\\mathrm{FeSO_4 \\cdot (NH_4)_2SO_4 \\cdot 6H_2O}$

The redox reaction:
$$\\mathrm{2KMnO_4 + 10FeSO_4 + 8H_2SO_4 \\rightarrow 2MnSO_4 + 5Fe_2(SO_4)_3 + K_2SO_4 + 8H_2O}$$

**Step 2 — Water from the reaction itself:**
8 $\\mathrm{H_2O}$ molecules from the redox reaction for 2 $\\mathrm{KMnO_4}$.

**Step 3 — Water from the hydrated salt:**
10 moles of $\\mathrm{FeSO_4 \\cdot (NH_4)_2SO_4 \\cdot 6H_2O}$ are used.
Each mole has 6 water molecules → $10 \\times 6 = 60$ water molecules.

**Step 4 — Total water molecules:**
$$8 + 60 = 68$$

**Answer: 68**`,
'tag_redox_3', src(2023, 'Apr', 13, 'Morning')),

// Q43 — Cr2O7^2- + XH+ + 6Fe^2+ → YCr3+ + 6Fe3+ + ZH2O; sum X+Y+Z; Answer: 23
mkNVT('RDX-043', 'Hard',
`See the following chemical reaction:

$$\\mathrm{Cr_2O_7^{2-} + XH^{+} + 6Fe^{2+} \\rightarrow YCr^{3+} + 6Fe^{3+} + ZH_2O}$$

The sum of $X$, $Y$ and $Z$ is ____`,
{ integer_value: 23 },
`**Step 1 — Balance Cr:**
$\\mathrm{Cr_2O_7^{2-}}$ has 2 Cr → $Y = 2$

**Step 2 — Balance O (using $\\mathrm{H_2O}$):**
7 O on left → $Z = 7$

**Step 3 — Balance H (using $\\mathrm{H^+}$):**
$7 \\times 2 = 14$ H on right → $X = 14$

**Step 4 — Verify charge balance:**
Left: $-2 + 14(+1) + 6(+2) = -2 + 14 + 12 = +24$
Right: $2(+3) + 6(+3) = +6 + 18 = +24$ ✓

**Step 5 — Sum:**
$$X + Y + Z = 14 + 2 + 7 = \\mathbf{23}$$

**Answer: 23**`,
'tag_redox_1', src(2023, 'Apr', 13, 'Evening')),

// Q44 — 2MnO4- + bC2O4^2- + cH+ → xMn2+ + yCO2 + zH2O; value of c; Answer: 16
mkNVT('RDX-044', 'Hard',
`$\\mathrm{2MnO_4^{-} + bC_2O_4^{2-} + cH^{+} \\rightarrow xMn^{2+} + yCO_2 + zH_2O}$

If the above equation is balanced with integer coefficients, the value of $c$ is $\\_\\_\\_\\_$. (Round off to the Nearest Integer).`,
{ integer_value: 16 },
`**Step 1 — Identify the half-reactions:**

**Reduction:** $\\mathrm{MnO_4^- \\rightarrow Mn^{2+}}$ (Mn: $+7 \\rightarrow +2$, gain of 5e⁻)
**Oxidation:** $\\mathrm{C_2O_4^{2-} \\rightarrow 2CO_2}$ (C: $+3 \\rightarrow +4$, loss of 2e⁻ per $\\mathrm{C_2O_4^{2-}}$, i.e., 2e⁻ total)

**Step 2 — Balance electrons:**
LCM of 5 and 2 = 10
- 2 $\\mathrm{MnO_4^-}$ gain $2 \\times 5 = 10$ e⁻
- 5 $\\mathrm{C_2O_4^{2-}}$ lose $5 \\times 2 = 10$ e⁻

So $b = 5$, $x = 2$, $y = 10$

**Step 3 — Balance O:**
Left O: $2(4) + 5(4) = 8 + 20 = 28$... wait, $\\mathrm{C_2O_4^{2-}}$ has 4 O.
Left O from $\\mathrm{MnO_4^-}$: $2 \\times 4 = 8$; from $\\mathrm{C_2O_4^{2-}}$: $5 \\times 4 = 20$; total = 28
Right O from $\\mathrm{CO_2}$: $10 \\times 2 = 20$; from $\\mathrm{H_2O}$: $z$
$$28 = 20 + z \\Rightarrow z = 8$$

**Step 4 — Balance H:**
$$c = 2z = 2 \\times 8 = 16$$

**Verify charge:**
Left: $2(-1) + 5(-2) + 16(+1) = -2 - 10 + 16 = +4$
Right: $2(+2) + 0 + 0 = +4$ ✓

**Answer: $c = 16$**`,
'tag_redox_1', src(2023, 'Apr', 13, 'Evening')),

// Q45 — NaCl + K2Cr2O7 + H2SO4 → A; A+NaOH → B; B+H2SO4+H2O2 → C; sum of atoms; Answer: 18
mkNVT('RDX-045', 'Hard',
`Consider the following reactions:

$$\\mathrm{NaCl + K_2Cr_2O_7 + \\underset{(Conc.)}{H_2SO_4} \\rightarrow (A) + side\\ products}$$

$$\\mathrm{(A) + NaOH \\rightarrow (B) + side\\ products}$$

$$\\mathrm{(B) + \\underset{(dilute)}{H_2SO_4} + H_2O_2 \\rightarrow (C) + side\\ products}$$

The sum of the total number of atoms in one molecule each of (A), (B) and (C) is $\\_\\_\\_\\_$`,
{ integer_value: 18 },
`**Step 1 — Identify compound A:**
$\\mathrm{NaCl + K_2Cr_2O_7 + H_2SO_4(conc.)} \\rightarrow$ chromyl chloride
$$\\mathrm{4NaCl + K_2Cr_2O_7 + 6H_2SO_4 \\rightarrow 4NaHSO_4 + K_2SO_4 + 2CrO_2Cl_2 + 3H_2O}$$
**A = $\\mathrm{CrO_2Cl_2}$ (chromyl chloride)**
Atoms in $\\mathrm{CrO_2Cl_2}$: 1 Cr + 2 O + 2 Cl = **5 atoms**

**Step 2 — Identify compound B:**
$\\mathrm{CrO_2Cl_2 + 4NaOH \\rightarrow Na_2CrO_4 + 2NaCl + 2H_2O}$
**B = $\\mathrm{Na_2CrO_4}$ (sodium chromate)**
Atoms in $\\mathrm{Na_2CrO_4}$: 2 Na + 1 Cr + 4 O = **7 atoms**

**Step 3 — Identify compound C:**
$\\mathrm{Na_2CrO_4 + H_2SO_4(dil) + H_2O_2 \\rightarrow CrO_5 + Na_2SO_4 + H_2O}$
Actually: $\\mathrm{2CrO_4^{2-} + 2H^+ \\rightarrow Cr_2O_7^{2-} + H_2O}$, then $\\mathrm{Cr_2O_7^{2-} + 4H_2O_2 + 2H^+ \\rightarrow 2CrO_5 + 5H_2O}$
**C = $\\mathrm{CrO_5}$ (chromium pentoxide / peroxochromate)**
Atoms in $\\mathrm{CrO_5}$: 1 Cr + 5 O = **6 atoms**

**Step 4 — Sum:**
$$5 + 7 + 6 = \\mathbf{18}$$

**Answer: 18**`,
'tag_redox_1', src(2020, 'Jan', 7, 'Evening')),

// Q46 — Volume of HBr to neutralise Ba(OH)2; Answer: (3) 10.0 mL
mkSCQ('RDX-046', 'Easy',
`The volume of 0.02 M aqueous HBr required to neutralize 10.0 mL of 0.01 M aqueous $\\mathrm{Ba(OH)_2}$ is (Assume complete neutralization)`,
[
  '2.5 mL',
  '5.0 mL',
  '10.0 mL',
  '7.5 mL'
],
'c',
`**Step 1 — Reaction:**
$$\\mathrm{Ba(OH)_2 + 2HBr \\rightarrow BaBr_2 + 2H_2O}$$

**Step 2 — Moles of $\\mathrm{Ba(OH)_2}$:**
$$n_{\\mathrm{Ba(OH)_2}} = 0.01\\ \\mathrm{M} \\times 10.0 \\times 10^{-3}\\ \\mathrm{L} = 1.0 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 3 — Moles of HBr required (stoichiometry 1:2):**
$$n_{\\mathrm{HBr}} = 2 \\times 1.0 \\times 10^{-4} = 2.0 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 4 — Volume of HBr:**
$$V = \\frac{n}{M} = \\frac{2.0 \\times 10^{-4}}{0.02} = 0.01\\ \\mathrm{L} = 10.0\\ \\mathrm{mL}$$

**Answer: Option (3) — 10.0 mL**`,
'tag_redox_3', src(2023, 'Apr', 6, 'Evening')),

// Q47 — Concentration of H2SO4; Answer: 1 M
mkNVT('RDX-047', 'Hard',
`20 mL of calcium hydroxide was consumed when it was reacted with 10 mL of unknown solution of $\\mathrm{H_2SO_4}$. Also 20 mL standard solution of 0.5 M HCl containing 2 drops of phenolphthalein was titrated with calcium hydroxide, the mixture showed pink colour when burette displayed the value of 35.5 mL whereas the burette showed 25.5 mL initially. The concentration of $\\mathrm{H_2SO_4}$ is $\\_\\_\\_\\_$ M. (Nearest integer)`,
{ integer_value: 1 },
`**Step 1 — Find concentration of $\\mathrm{Ca(OH)_2}$:**

Volume of $\\mathrm{Ca(OH)_2}$ used = $35.5 - 25.5 = 10.0$ mL

Reaction: $\\mathrm{Ca(OH)_2 + 2HCl \\rightarrow CaCl_2 + 2H_2O}$

Moles of HCl = $0.5 \\times 20 \\times 10^{-3} = 0.01$ mol

Moles of $\\mathrm{Ca(OH)_2}$ = $0.01/2 = 0.005$ mol

$$[\\mathrm{Ca(OH)_2}] = \\frac{0.005}{10 \\times 10^{-3}} = 0.5\\ \\mathrm{M}$$

**Step 2 — Find concentration of $\\mathrm{H_2SO_4}$:**

Reaction: $\\mathrm{Ca(OH)_2 + H_2SO_4 \\rightarrow CaSO_4 + 2H_2O}$

Moles of $\\mathrm{Ca(OH)_2}$ used = $0.5 \\times 20 \\times 10^{-3} = 0.01$ mol

Moles of $\\mathrm{H_2SO_4}$ = $0.01$ mol (1:1 ratio)

$$[\\mathrm{H_2SO_4}] = \\frac{0.01}{10 \\times 10^{-3}} = 1\\ \\mathrm{M}$$

**Answer: 1 M**`,
'tag_redox_3', src(2023, 'Apr', 13, 'Morning')),

// Q48 — Molarity of Fe2+ from K2Cr2O7 titration; Answer: 24 × 10^-2 M
mkNVT('RDX-048', 'Hard',
`20 mL of $0.02\\ \\mathrm{M}\\ \\mathrm{K_2Cr_2O_7}$ solution is used for the titration of 10 mL of $\\mathrm{Fe^{2+}}$ solution in the acidic medium. The molarity of $\\mathrm{Fe^{2+}}$ solution is $\\_\\_\\_\\_ \\times 10^{-2}\\ \\mathrm{M}$`,
{ integer_value: 24 },
`**Step 1 — Balanced reaction:**
$$\\mathrm{Cr_2O_7^{2-} + 6Fe^{2+} + 14H^{+} \\rightarrow 2Cr^{3+} + 6Fe^{3+} + 7H_2O}$$

**Step 2 — Moles of $\\mathrm{K_2Cr_2O_7}$:**
$$n_{\\mathrm{Cr_2O_7^{2-}}} = 0.02 \\times 20 \\times 10^{-3} = 4 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 3 — Moles of $\\mathrm{Fe^{2+}}$ (ratio 1:6):**
$$n_{\\mathrm{Fe^{2+}}} = 6 \\times 4 \\times 10^{-4} = 2.4 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 4 — Molarity of $\\mathrm{Fe^{2+}}$:**
$$M = \\frac{2.4 \\times 10^{-3}}{10 \\times 10^{-3}} = 0.24\\ \\mathrm{M} = 24 \\times 10^{-2}\\ \\mathrm{M}$$

**Answer: 24**`,
'tag_redox_3', src(2022, 'Jul', 27, 'Morning')),

// Q49 — Basicity of acid A; Answer: (3) 3
mkSCQ('RDX-049', 'Medium',
`The neutralization occurs when 10 mL of 0.1 M acid 'A' is allowed to react with 30 mL of 0.05 M base $\\mathrm{M(OH)_2}$. The basicity of the acid 'A' is [M is a metal]`,
[
  '1',
  '2',
  '3',
  '4'
],
'c',
`**Step 1 — At neutralisation, equivalents of acid = equivalents of base:**

$$n_{\\mathrm{acid}} \\times \\text{basicity} = n_{\\mathrm{base}} \\times \\text{acidity}$$

**Step 2 — Moles of each:**
$$n_{\\mathrm{acid}} = 0.1 \\times 10 \\times 10^{-3} = 1 \\times 10^{-3}\\ \\mathrm{mol}$$
$$n_{\\mathrm{base}} = 0.05 \\times 30 \\times 10^{-3} = 1.5 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 3 — Acidity of $\\mathrm{M(OH)_2}$:**
$\\mathrm{M(OH)_2}$ provides 2 $\\mathrm{OH^-}$ per formula unit → acidity = 2

**Step 4 — Equivalents:**
$$n_{\\mathrm{acid}} \\times \\text{basicity} = n_{\\mathrm{base}} \\times 2$$
$$1 \\times 10^{-3} \\times \\text{basicity} = 1.5 \\times 10^{-3} \\times 2$$
$$\\text{basicity} = \\frac{3 \\times 10^{-3}}{1 \\times 10^{-3}} = 3$$

**Answer: Option (3) — 3**`,
'tag_redox_3', src(2022, 'Jul', 25, 'Evening')),

// Q50 — Volume of KMnO4 left in burette; Answer: 30 mL
mkNVT('RDX-050', 'Hard',
`0.01 M $\\mathrm{KMnO_4}$ solution was added to 20.0 mL of 0.05 M Mohr's salt solution through a burette. The initial reading of 50 mL burette is zero. The volume of $\\mathrm{KMnO_4}$ solution left in the burette after the end point is $\\_\\_\\_\\_ $ mL. (nearest integer)`,
{ integer_value: 30 },
`**Step 1 — Reaction of $\\mathrm{KMnO_4}$ with Mohr's salt ($\\mathrm{FeSO_4 \\cdot (NH_4)_2SO_4 \\cdot 6H_2O}$) in acidic medium:**

$$\\mathrm{MnO_4^{-} + 5Fe^{2+} + 8H^{+} \\rightarrow Mn^{2+} + 5Fe^{3+} + 4H_2O}$$

**Step 2 — Moles of $\\mathrm{Fe^{2+}}$ (Mohr's salt):**
$$n_{\\mathrm{Fe^{2+}}} = 0.05 \\times 20 \\times 10^{-3} = 1 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 3 — Moles of $\\mathrm{KMnO_4}$ required (ratio 1:5):**
$$n_{\\mathrm{KMnO_4}} = \\frac{1 \\times 10^{-3}}{5} = 2 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 4 — Volume of $\\mathrm{KMnO_4}$ used:**
$$V = \\frac{2 \\times 10^{-4}}{0.01} = 0.02\\ \\mathrm{L} = 20\\ \\mathrm{mL}$$

**Step 5 — Volume left in burette:**
Initial burette reading = 0 mL (full 50 mL burette)
Volume used = 20 mL
$$V_{\\text{left}} = 50 - 20 = \\mathbf{30\\ \\mathrm{mL}}$$

**Answer: 30 mL**`,
'tag_redox_3', src(2022, 'Jul', 25, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (RDX-041 to RDX-050)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
