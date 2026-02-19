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

// Q51 — Equimolar mixture of NaOH and Na2CO3; x g of NaOH; Answer: 1
mkNVT('RDX-051', 'Hard',
`4 g equimolar mixture of NaOH and $\\mathrm{Na_2CO_3}$ contains $x$ g of NaOH and $y$ g of $\\mathrm{Na_2CO_3}$. The value of $x$ is $\\_\\_\\_\\_$ g. (Nearest integer)`,
{ integer_value: 1 },
`**Step 1 — Equimolar means equal moles of NaOH and $\\mathrm{Na_2CO_3}$:**

Let moles of each = $n$

**Step 2 — Set up mass equation:**
$$m_{\\mathrm{NaOH}} + m_{\\mathrm{Na_2CO_3}} = 4\\ \\mathrm{g}$$
$$n \\times 40 + n \\times 106 = 4$$
$$n(40 + 106) = 4$$
$$n \\times 146 = 4$$
$$n = \\frac{4}{146} = 0.02740\\ \\mathrm{mol}$$

**Step 3 — Mass of NaOH:**
$$x = n \\times 40 = 0.02740 \\times 40 = 1.096 \\approx \\mathbf{1}\\ \\mathrm{g}$$

**Step 4 — Verify:**
$$y = n \\times 106 = 0.02740 \\times 106 = 2.904 \\approx 3\\ \\mathrm{g}$$
$$x + y = 1 + 3 = 4\\ \\mathrm{g}$$ ✓

**Answer: 1**`,
'tag_redox_3', src(2021, 'Jul', 20, 'Evening')),

// Q52 — Molarity of Fe2+ from K2Cr2O7 titration; Answer: 18
mkNVT('RDX-052', 'Hard',
`When 10 mL of an aqueous solution of $\\mathrm{Fe^{2+}}$ ions was titrated in the presence of dil $\\mathrm{H_2SO_4}$ using diphenylamine indicator, 15 mL of 0.02 M solution of $\\mathrm{K_2Cr_2O_7}$ was required to get the end point. The molarity of the solution containing $\\mathrm{Fe^{2+}}$ ions is $x \\times 10^{-2}$ M. The value of $x$ is $\\_\\_\\_\\_$. (Nearest integer)`,
{ integer_value: 18 },
`**Step 1 — Balanced reaction:**
$$\\mathrm{Cr_2O_7^{2-} + 6Fe^{2+} + 14H^{+} \\rightarrow 2Cr^{3+} + 6Fe^{3+} + 7H_2O}$$

**Step 2 — Moles of $\\mathrm{K_2Cr_2O_7}$:**
$$n_{\\mathrm{Cr_2O_7^{2-}}} = 0.02 \\times 15 \\times 10^{-3} = 3 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 3 — Moles of $\\mathrm{Fe^{2+}}$ (ratio 1:6):**
$$n_{\\mathrm{Fe^{2+}}} = 6 \\times 3 \\times 10^{-4} = 1.8 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 4 — Molarity of $\\mathrm{Fe^{2+}}$:**
$$M = \\frac{1.8 \\times 10^{-3}}{10 \\times 10^{-3}} = 0.18\\ \\mathrm{M} = 18 \\times 10^{-2}\\ \\mathrm{M}$$

$$x = 18$$

**Answer: 18**`,
'tag_redox_3', src(2021, 'Jul', 25, 'Morning')),

// Q53 — Volume of CrO4^2- to react with S2O3^2-; Answer: 173 mL
mkNVT('RDX-053', 'Hard',
`In basic medium $\\mathrm{CrO_4^{2-}}$ oxidises $\\mathrm{S_2O_3^{2-}}$ to form $\\mathrm{SO_4^{2-}}$ and itself changes into $\\mathrm{Cr(OH)_4^{-}}$. The volume of $0.154\\ \\mathrm{M}\\ \\mathrm{CrO_4^{2-}}$ required to react with 40 mL of $0.25\\ \\mathrm{M}\\ \\mathrm{S_2O_3^{2-}}$ is $\\_\\_\\_\\_ $ mL. (Rounded-off to the nearest integer)`,
{ integer_value: 173 },
`**Step 1 — Determine n-factors:**

**$\\mathrm{CrO_4^{2-}} \\rightarrow \\mathrm{Cr(OH)_4^{-}}$:**
Cr: $+6 \\rightarrow +3$ → gain of 3e⁻ per Cr → n-factor = 3

**$\\mathrm{S_2O_3^{2-}} \\rightarrow \\mathrm{SO_4^{2-}}$:**
S in $\\mathrm{S_2O_3^{2-}}$: average OS = $+2$
S in $\\mathrm{SO_4^{2-}}$: OS = $+6$
Change per S = $+6 - (+2) = 4$; per $\\mathrm{S_2O_3^{2-}}$ (2 S atoms) = $2 \\times 4 = 8$
n-factor of $\\mathrm{S_2O_3^{2-}}$ = 8

**Step 2 — Equivalents must be equal:**
$$n_{\\mathrm{CrO_4^{2-}}} \\times 3 = n_{\\mathrm{S_2O_3^{2-}}} \\times 8$$

**Step 3 — Moles of $\\mathrm{S_2O_3^{2-}}$:**
$$n_{\\mathrm{S_2O_3^{2-}}} = 0.25 \\times 40 \\times 10^{-3} = 0.01\\ \\mathrm{mol}$$

**Step 4 — Moles of $\\mathrm{CrO_4^{2-}}$:**
$$n_{\\mathrm{CrO_4^{2-}}} = \\frac{0.01 \\times 8}{3} = \\frac{0.08}{3} = 0.02667\\ \\mathrm{mol}$$

**Step 5 — Volume:**
$$V = \\frac{0.02667}{0.154} = 0.1732\\ \\mathrm{L} = 173.2 \\approx \\mathbf{173}\\ \\mathrm{mL}$$

**Answer: 173 mL**`,
'tag_redox_3', src(2021, 'Feb', 25, 'Morning')),

// Q54 — Molarity of NaOH from oxalic acid titration; Answer: 6 M
mkNVT('RDX-054', 'Hard',
`Consider titration of NaOH solution versus 1.25 M oxalic acid solution. At the end point following burette readings were obtained.

| Reading | Volume (mL) |
|---|---|
| (i) | 4.5 |
| (ii) | 4.5 |
| (iii) | 4.4 |
| (iv) | 4.4 |
| (v) | 4.4 |

If the volume of oxalic acid taken was 10.0 mL then the molarity of the NaOH solution is $\\_\\_\\_\\_ $ M. (Rounded-off to the nearest integer)`,
{ integer_value: 6 },
`**Step 1 — Concordant titre value:**
The concordant readings are 4.4 mL, 4.4 mL, 4.4 mL → $V_{\\mathrm{NaOH}} = 4.4$ mL

**Step 2 — Reaction:**
$$\\mathrm{H_2C_2O_4 + 2NaOH \\rightarrow Na_2C_2O_4 + 2H_2O}$$

**Step 3 — Moles of oxalic acid:**
$$n_{\\mathrm{H_2C_2O_4}} = 1.25 \\times 10.0 \\times 10^{-3} = 0.0125\\ \\mathrm{mol}$$

**Step 4 — Moles of NaOH (ratio 1:2):**
$$n_{\\mathrm{NaOH}} = 2 \\times 0.0125 = 0.025\\ \\mathrm{mol}$$

**Step 5 — Molarity of NaOH:**
$$M = \\frac{0.025}{4.4 \\times 10^{-3}} = \\frac{0.025}{0.0044} = 5.68 \\approx \\mathbf{6}\\ \\mathrm{M}$$

**Answer: 6 M**`,
'tag_redox_3', src(2021, 'Feb', 25, 'Evening')),

// Q55 — Purity of H2O2; Answer: 85%
mkNVT('RDX-055', 'Hard',
`A 20.0 mL solution containing 0.2 g impure $\\mathrm{H_2O_2}$ reacts completely with 0.316 g of $\\mathrm{KMnO_4}$ in acid solution. The purity of $\\mathrm{H_2O_2}$ (in %) is $\\_\\_\\_\\_$

(mol. wt. of $\\mathrm{H_2O_2} = 34$; mol. wt. of $\\mathrm{KMnO_4} = 158$)`,
{ integer_value: 85 },
`**Step 1 — Balanced reaction:**
$$\\mathrm{2KMnO_4 + 5H_2O_2 + 3H_2SO_4 \\rightarrow 2MnSO_4 + K_2SO_4 + 5O_2 + 8H_2O}$$

**Step 2 — Moles of $\\mathrm{KMnO_4}$:**
$$n_{\\mathrm{KMnO_4}} = \\frac{0.316}{158} = 2 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 3 — Moles of $\\mathrm{H_2O_2}$ (ratio 2:5):**
$$n_{\\mathrm{H_2O_2}} = \\frac{5}{2} \\times 2 \\times 10^{-3} = 5 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 4 — Mass of pure $\\mathrm{H_2O_2}$:**
$$m = 5 \\times 10^{-3} \\times 34 = 0.17\\ \\mathrm{g}$$

**Step 5 — Purity:**
$$\\text{Purity} = \\frac{0.17}{0.2} \\times 100 = \\mathbf{85\\%}$$

**Answer: 85%**`,
'tag_redox_3', src(2020, 'Sep', 4, 'Morning')),

// Q56 — Molarity of KMnO4 solution; Answer: 8 M
mkNVT('RDX-056', 'Hard',
`Only 2 mL of $\\mathrm{KMnO_4}$ solution of unknown molarity is required to reach the end point of a titration of 20 mL of oxalic acid (2 M) in acidic medium. The molarity of $\\mathrm{KMnO_4}$ solution should be $\\_\\_\\_\\_ $ M.`,
{ integer_value: 8 },
`**Step 1 — Balanced reaction in acidic medium:**
$$\\mathrm{2KMnO_4 + 5H_2C_2O_4 + 3H_2SO_4 \\rightarrow 2MnSO_4 + 10CO_2 + K_2SO_4 + 8H_2O}$$

**Step 2 — Moles of oxalic acid:**
$$n_{\\mathrm{H_2C_2O_4}} = 2\\ \\mathrm{M} \\times 20 \\times 10^{-3}\\ \\mathrm{L} = 0.04\\ \\mathrm{mol}$$

**Step 3 — Moles of $\\mathrm{KMnO_4}$ (ratio 2:5):**
$$n_{\\mathrm{KMnO_4}} = \\frac{2}{5} \\times 0.04 = 0.016\\ \\mathrm{mol}$$

**Step 4 — Molarity of $\\mathrm{KMnO_4}$:**
$$M = \\frac{0.016}{2 \\times 10^{-3}} = 8\\ \\mathrm{M}$$

**Answer: 8 M**`,
'tag_redox_3', src(2024, 'Apr', 4, 'Morning')),

// Q57 — Incorrect statements about primary standard; Answer: (2) C and E only
mkSCQ('RDX-057', 'Medium',
`Identify the incorrect statements regarding primary standard of titrimetric analysis.

**(A)** It should be purely available in dry form.

**(B)** It should not undergo chemical change in air.

**(C)** It should be hygroscopic and should react with another chemical instantaneously and stoichiometrically.

**(D)** It should be readily soluble in water.

**(E)** $\\mathrm{KMnO_4}$ & NaOH can be used as primary standard.

Choose the correct answer from the options given below:`,
[
  '(A) and (B) only',
  '(C) and (E) only',
  '(B) and (E) only',
  '(C) and (D) only'
],
'b',
`**Properties of a primary standard:**
A primary standard must be:
1. Available in high purity
2. Stable in air (not hygroscopic, not oxidised)
3. High molar mass (to reduce weighing errors)
4. Readily soluble in the solvent
5. React stoichiometrically and completely

**Step 1 — Evaluate each statement:**

**(A)** "Available in dry form" — ✓ Correct property of a primary standard

**(B)** "Should not undergo chemical change in air" — ✓ Correct (must be stable)

**(C)** "Should be hygroscopic" — ✗ **Incorrect**: A primary standard must **NOT** be hygroscopic (absorbing moisture would change its mass and concentration). This is an incorrect statement.

**(D)** "Should be readily soluble in water" — ✓ Correct property

**(E)** "$\\mathrm{KMnO_4}$ & NaOH can be used as primary standard" — ✗ **Incorrect**:
- $\\mathrm{KMnO_4}$ is not a primary standard (it oxidises organic matter, difficult to obtain pure)
- NaOH is not a primary standard (it is hygroscopic and absorbs $\\mathrm{CO_2}$ from air)

**Incorrect statements: C and E**

**Answer: Option (2) — (C) and (E) only**`,
'tag_redox_3', src(2024, 'Apr', 9, 'Morning')),

// Q58 — KMnO4 decomposes at 513 K; Answer: (4) K2MnO4 & MnO2
mkSCQ('RDX-058', 'Easy',
`$\\mathrm{KMnO_4}$ decomposes on heating at 513 K to form $\\mathrm{O_2}$ along with`,
[
  `$\\mathrm{MnO_2}$ & $\\mathrm{K_2O_2}$`,
  `$\\mathrm{K_2MnO_4}$ & $\\mathrm{Mn}$`,
  `$\\mathrm{Mn}$ & $\\mathrm{KO_2}$`,
  `$\\mathrm{K_2MnO_4}$ & $\\mathrm{MnO_2}$`
],
'd',
`**Step 1 — Thermal decomposition of $\\mathrm{KMnO_4}$:**

$$\\mathrm{2KMnO_4 \\xrightarrow{513\\ K} K_2MnO_4 + MnO_2 + O_2}$$

**Step 2 — Verify oxidation states:**
- Mn in $\\mathrm{KMnO_4}$: $+7$
- Mn in $\\mathrm{K_2MnO_4}$: $+6$ (reduced by 1)
- Mn in $\\mathrm{MnO_2}$: $+4$ (reduced by 3)
- O in $\\mathrm{KMnO_4}$: $-2$; O in $\\mathrm{O_2}$: $0$ (oxidised)

This is a disproportionation-type decomposition where Mn is reduced and O is oxidised.

**Step 3 — Products:**
$\\mathrm{K_2MnO_4}$ (potassium manganate, green) and $\\mathrm{MnO_2}$ (manganese dioxide, black) are formed along with $\\mathrm{O_2}$.

**Answer: Option (4) — $\\mathrm{K_2MnO_4}$ & $\\mathrm{MnO_2}$**`,
'tag_redox_3', src(2024, 'Jan', 29, 'Morning')),

// Q59 — Amount of NaOH from oxalic acid titration; Answer: 4 g
mkNVT('RDX-059', 'Medium',
`If 50 mL of 0.5 M oxalic acid is required to neutralise 25 mL of NaOH solution, the amount of NaOH in 50 mL of given NaOH solution is $\\_\\_\\_\\_ $ g.`,
{ integer_value: 4 },
`**Step 1 — Reaction:**
$$\\mathrm{H_2C_2O_4 + 2NaOH \\rightarrow Na_2C_2O_4 + 2H_2O}$$

**Step 2 — Moles of oxalic acid:**
$$n_{\\mathrm{H_2C_2O_4}} = 0.5 \\times 50 \\times 10^{-3} = 0.025\\ \\mathrm{mol}$$

**Step 3 — Moles of NaOH in 25 mL (ratio 1:2):**
$$n_{\\mathrm{NaOH}} = 2 \\times 0.025 = 0.05\\ \\mathrm{mol}$$

**Step 4 — Molarity of NaOH:**
$$M = \\frac{0.05}{0.025} = 2\\ \\mathrm{M}$$

**Step 5 — Moles of NaOH in 50 mL:**
$$n = 2 \\times 0.05 = 0.1\\ \\mathrm{mol}$$

**Step 6 — Mass:**
$$m = 0.1 \\times 40 = \\mathbf{4\\ \\mathrm{g}}$$

**Answer: 4 g**`,
'tag_redox_3', src(2024, 'Jan', 29, 'Evening')),

// Q60 — 2MnO4- + bI- + cH2O → xI2 + yMnO2 + zOH-; value of z; Answer: 8
mkNVT('RDX-060', 'Medium',
`$\\mathrm{2MnO_4^{-} + bI^{-} + cH_2O \\rightarrow xI_2 + yMnO_2 + zOH^{-}}$

If the above equation is balanced with integer coefficients, the value of $z$ is $\\_\\_\\_\\_$.`,
{ integer_value: 8 },
`**Step 1 — Identify the half-reactions (neutral/alkaline medium):**

**Reduction:** $\\mathrm{MnO_4^- \\rightarrow MnO_2}$
Mn: $+7 \\rightarrow +4$ (gain of 3e⁻)

**Oxidation:** $\\mathrm{I^- \\rightarrow I_2}$
I: $-1 \\rightarrow 0$ (loss of 1e⁻ per I, 2e⁻ per $\\mathrm{I_2}$)

**Step 2 — Balance electrons:**
LCM of 3 and 2 = 6
- 2 $\\mathrm{MnO_4^-}$ gain $2 \\times 3 = 6$ e⁻ → $y = 2$
- 3 $\\mathrm{I_2}$ formed from 6 $\\mathrm{I^-}$ losing 6 e⁻ → $b = 6$, $x = 3$

**Step 3 — Balance O:**
Left O from $\\mathrm{MnO_4^-}$: $2 \\times 4 = 8$; from $\\mathrm{H_2O}$: $c$
Right O from $\\mathrm{MnO_2}$: $2 \\times 2 = 4$; from $\\mathrm{OH^-}$: $z$
$$8 + c = 4 + z \\quad \\cdots (1)$$

**Step 4 — Balance H:**
Left H from $\\mathrm{H_2O}$: $2c$
Right H from $\\mathrm{OH^-}$: $z$
$$2c = z \\quad \\cdots (2)$$

**Step 5 — Balance charge:**
Left: $2(-1) + 6(-1) + 0 = -8$
Right: $0 + 0 + z(-1) = -z$
$$-8 = -z \\Rightarrow z = 8$$

**Step 6 — Find c from (2):**
$$c = z/2 = 4$$

**Verify (1):** $8 + 4 = 4 + 8 = 12$ ✓

**Answer: $z = 8$**`,
'tag_redox_1', src(2024, 'Jan', 30, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (RDX-051 to RDX-060)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
