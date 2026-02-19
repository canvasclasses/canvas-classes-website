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

// Q61 — KHP as primary standard; Answer: (1) Both correct
mkSCQ('RDX-061', 'Easy',
`Given below are two statements:

**Statement (I):** Potassium hydrogen phthalate is a primary standard for standardisation of sodium hydroxide solution.

**Statement (II):** In this titration phenolphthalein can be used as indicator.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Both Statement I and Statement II are correct',
  'Statement I is correct but Statement II is incorrect',
  'Statement I is incorrect but Statement II is correct',
  'Both Statement I and Statement II are incorrect'
],
'a',
`**Step 1 — Evaluate Statement I:**

Potassium hydrogen phthalate (KHP, $\\mathrm{KHC_8H_4O_4}$, MW = 204.22 g/mol) is an excellent **primary standard** for NaOH because:
- It is available in high purity
- It is stable in air (not hygroscopic)
- It has a high molar mass (reduces weighing errors)
- It reacts stoichiometrically with NaOH: $\\mathrm{KHC_8H_4O_4 + NaOH \\rightarrow KNaC_8H_4O_4 + H_2O}$

**Statement I is CORRECT** ✓

**Step 2 — Evaluate Statement II:**

The titration of KHP (weak acid) with NaOH (strong base) produces a basic solution at the equivalence point (pH ≈ 8–9). **Phenolphthalein** (colour change at pH 8.3–10) is the appropriate indicator for this titration.

**Statement II is CORRECT** ✓

**Answer: Option (1) — Both correct**`,
'tag_redox_3', src(2024, 'Feb', 1, 'Morning')),

// Q62 — Medium for MnO4- + thiosulphate with Mn change of 3; Answer: (2) Aqueous neutral
mkSCQ('RDX-062', 'Medium',
`During the reaction of permanganate with thiosulphate, the change in oxidation of manganese occurs by value of 3. Identify which of the below medium will favour the reaction.`,
[
  'Both aqueous acidic and neutral',
  'Aqueous neutral',
  'Both aqueous acidic and faintly alkaline',
  'Aqueous acidic'
],
'b',
`**Step 1 — Oxidation state changes of Mn in different media:**

| Medium | Reaction | Mn change |
|---|---|---|
| Acidic | $\\mathrm{MnO_4^- \\rightarrow Mn^{2+}}$ | $+7 \\rightarrow +2$ (change = 5) |
| Neutral | $\\mathrm{MnO_4^- \\rightarrow MnO_2}$ | $+7 \\rightarrow +4$ (change = 3) |
| Alkaline | $\\mathrm{MnO_4^- \\rightarrow MnO_4^{2-}}$ | $+7 \\rightarrow +6$ (change = 1) |

**Step 2 — Identify medium with change = 3:**

In **neutral (aqueous neutral) medium**, Mn changes from $+7$ to $+4$ (a change of 3).

The reaction in neutral medium:
$$\\mathrm{8MnO_4^- + 3S_2O_3^{2-} + H_2O \\rightarrow 8MnO_2 + 6SO_4^{2-} + 2OH^-}$$

**Answer: Option (2) — Aqueous neutral**`,
'tag_redox_3', src(2023, 'Apr', 6, 'Evening')),

// Q63 — Conductometric titration of benzoic acid vs NaOH; Answer: (2)
mkSCQ('RDX-063', 'Medium',
`Choose the correct representation of conductometric titration of benzoic acid vs sodium hydroxide.`,
[
  'Graph (1): conductance decreases then increases sharply after equivalence point',
  'Graph (2): conductance decreases to a minimum at equivalence point, then increases',
  'Graph (3): conductance increases throughout',
  'Graph (4): conductance remains constant then increases'
],
'b',
`**Step 1 — Analyse the conductometric titration of benzoic acid (weak acid) vs NaOH (strong base):**

**Reaction:** $\\mathrm{C_6H_5COOH + NaOH \\rightarrow C_6H_5COONa + H_2O}$

**Step 2 — Conductance changes:**

- **Before equivalence point:** As NaOH is added, highly mobile $\\mathrm{H^+}$ ions (from partial dissociation of benzoic acid) are replaced by less mobile $\\mathrm{Na^+}$ ions and $\\mathrm{C_6H_5COO^-}$ ions. The benzoate buffer forms. **Conductance decreases** (replacement of $\\mathrm{H^+}$ by less mobile ions).

- **At equivalence point:** Only $\\mathrm{C_6H_5COONa}$ in solution → **minimum conductance**

- **After equivalence point:** Excess NaOH adds highly mobile $\\mathrm{OH^-}$ ions → **conductance increases sharply**

**Step 3 — Shape of graph:**
The graph shows a V-shape: decreasing conductance before equivalence point, minimum at equivalence point, then sharp increase after.

**Answer: Option (2) — Graph showing V-shape (decrease to minimum, then increase)**`,
'tag_redox_3', src(2023, 'Jan', 24, 'Evening')),

// Q64 — Assertion-Reason about KOH solution aging; Answer: (3) Both correct, R is correct explanation
mkSCQ('RDX-064', 'Medium',
`Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R).

**Assertion (A):** An aqueous solution of KOH when used for volumetric analysis, its concentration should be checked before the use.

**Reason (R):** On aging, KOH solution absorbs atmospheric $\\mathrm{CO_2}$.

In the light of the above statements, choose the correct answer from the options given below.`,
[
  '(A) is not correct but (R) is correct',
  'Both (A) and (R) are correct but (R) is not the correct explanation of (A)',
  'Both (A) and (R) are correct and (R) is the correct explanation of (A)',
  '(A) is correct but (R) is not correct'
],
'c',
`**Step 1 — Evaluate Assertion (A):**

KOH solution is used as a standard base in volumetric analysis. However, KOH is not a primary standard because:
- It absorbs $\\mathrm{CO_2}$ from air: $\\mathrm{2KOH + CO_2 \\rightarrow K_2CO_3 + H_2O}$
- This changes the effective concentration of KOH over time

Therefore, its concentration must be **checked (standardised) before use**.
**Assertion (A) is CORRECT** ✓

**Step 2 — Evaluate Reason (R):**

KOH solution does indeed absorb atmospheric $\\mathrm{CO_2}$ on aging, converting KOH to $\\mathrm{K_2CO_3}$. This reduces the KOH concentration and introduces $\\mathrm{K_2CO_3}$, which has different neutralisation behaviour.
**Reason (R) is CORRECT** ✓

**Step 3 — Is R the correct explanation of A?**

Yes — the reason KOH concentration must be checked is precisely because it absorbs $\\mathrm{CO_2}$ and its concentration changes. R directly explains A.

**Answer: Option (3) — Both correct, R is the correct explanation of A**`,
'tag_redox_3', src(2023, 'Feb', 1, 'Evening')),

// Q65 — Assertion-Reason about phenolphthalein; Answer: (3) A true, R false
mkSCQ('RDX-065', 'Medium',
`Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R.

**Assertion A:** Phenolphthalein is a pH dependent indicator, remains colourless in acidic solution and gives pink colour in basic medium.

**Reason R:** Phenolphthalein is a weak acid. It doesn't dissociate in basic medium.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is NOT the correct explanation of A.',
  'A is true but R is false',
  'A is false but R is true'
],
'c',
`**Step 1 — Evaluate Assertion A:**

Phenolphthalein:
- In **acidic medium** (pH < 8.3): exists as $\\mathrm{H_2In}$ (colourless lactone form) ✓
- In **basic medium** (pH > 10): exists as $\\mathrm{In^{2-}}$ (pink quinonoid form) ✓
- It is indeed pH-dependent

**Assertion A is TRUE** ✓

**Step 2 — Evaluate Reason R:**

Phenolphthalein IS a weak acid — this part is correct.

However, the statement "It doesn't dissociate in basic medium" is **INCORRECT**. In basic medium, phenolphthalein **dissociates** (loses protons) to form the coloured $\\mathrm{In^{2-}}$ ion:
$$\\mathrm{H_2In \\xrightarrow{OH^-} HIn^- \\xrightarrow{OH^-} In^{2-}\\ (pink)}$$

The pink colour in basic medium is precisely BECAUSE it dissociates in basic medium.

**Reason R is FALSE** ✗

**Answer: Option (3) — A is true but R is false**`,
'tag_redox_3', src(2022, 'Jul', 26, 'Evening')),

// Q66 — Molarity of Cu2+ from hypo titration; Answer: 4 × 10^-2 M
mkNVT('RDX-066', 'Hard',
`20 mL of 0.02 M hypo solution is used for the titration of 10 mL of copper sulphate solution, in the presence of excess of KI using starch as an indicator. The molarity of $\\mathrm{Cu^{2+}}$ is found to be $\\_\\_\\_\\_ \\times 10^{-2}$ M (nearest integer)

Given:
$$\\mathrm{2Cu^{2+} + 4I^{-} \\rightarrow Cu_2I_2 + I_2}$$
$$\\mathrm{I_2 + 2S_2O_3^{2-} \\rightarrow 2I^{-} + S_4O_6^{2-}}$$`,
{ integer_value: 4 },
`**Step 1 — Moles of hypo ($\\mathrm{Na_2S_2O_3}$):**
$$n_{\\mathrm{S_2O_3^{2-}}} = 0.02 \\times 20 \\times 10^{-3} = 4 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 2 — Moles of $\\mathrm{I_2}$ from reaction 2 (ratio 1:2):**
$$n_{\\mathrm{I_2}} = \\frac{4 \\times 10^{-4}}{2} = 2 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 3 — Moles of $\\mathrm{Cu^{2+}}$ from reaction 1 (ratio 2:1 for $\\mathrm{Cu^{2+}}$:$\\mathrm{I_2}$):**
$$n_{\\mathrm{Cu^{2+}}} = 2 \\times n_{\\mathrm{I_2}} = 2 \\times 2 \\times 10^{-4} = 4 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 4 — Molarity of $\\mathrm{Cu^{2+}}$:**
$$M = \\frac{4 \\times 10^{-4}}{10 \\times 10^{-3}} = 0.04\\ \\mathrm{M} = 4 \\times 10^{-2}\\ \\mathrm{M}$$

**Answer: 4**`,
'tag_redox_3', src(2022, 'Jul', 26, 'Evening')),

// Q67 — Assertion-Reason about KMnO4 and HCl; Answer: (1) Both true, R is correct explanation
mkSCQ('RDX-067', 'Easy',
`Given below are two statements: One is labelled as Assertion A and the other is labelled as Reason R.

**Assertion A:** Permanganate titrations are not performed in presence of hydrochloric acid.

**Reason R:** Chlorine is formed as a consequence of oxidation of hydrochloric acid.

In the light of the above statements, choose the correct answer from the options given below:`,
[
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is NOT the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true'
],
'a',
`**Step 1 — Evaluate Assertion A:**

$\\mathrm{KMnO_4}$ is a strong oxidising agent. In the presence of HCl:
$$\\mathrm{2KMnO_4 + 16HCl \\rightarrow 2KCl + 2MnCl_2 + 5Cl_2 + 8H_2O}$$

$\\mathrm{KMnO_4}$ oxidises $\\mathrm{Cl^-}$ to $\\mathrm{Cl_2}$, consuming extra $\\mathrm{KMnO_4}$ beyond what is needed for the analyte. This gives erroneous (higher) results.

Therefore, permanganate titrations are **NOT performed in HCl medium** — $\\mathrm{H_2SO_4}$ is used instead.
**Assertion A is TRUE** ✓

**Step 2 — Evaluate Reason R:**

The reason is exactly as stated: $\\mathrm{KMnO_4}$ oxidises HCl, producing $\\mathrm{Cl_2}$. This is the correct chemical explanation for why HCl cannot be used.
**Reason R is TRUE** ✓ and is the correct explanation of A.

**Answer: Option (1) — Both A and R are true, R is the correct explanation of A**`,
'tag_redox_3', src(2022, 'Jul', 28, 'Evening')),

// Q68 — Compound X is weak acid indicator for NaOH + CH3COOH; Answer: (3) phenolphthalein
mkSCQ('RDX-068', 'Medium',
`A compound 'X' is a weak acid and it exhibits colour change at pH close to the equivalence point during neutralization of NaOH with $\\mathrm{CH_3COOH}$. Compound 'X' exists in ionized form in basic medium. The compound 'X' is`,
[
  'methyl orange',
  'methyl red',
  'phenolphthalein',
  'erichrome Black T'
],
'c',
`**Step 1 — Identify the equivalence point pH:**

For titration of $\\mathrm{CH_3COOH}$ (weak acid) with NaOH (strong base):
- At equivalence point, only $\\mathrm{CH_3COONa}$ is present
- pH at equivalence point ≈ 8.7–9 (basic)

**Step 2 — Identify the indicator:**

| Indicator | Type | pH range | Colour change |
|---|---|---|---|
| Methyl orange | Weak base | 3.1–4.4 | Red → Yellow |
| Methyl red | Weak acid | 4.4–6.2 | Red → Yellow |
| Phenolphthalein | Weak acid | 8.3–10 | Colourless → Pink |
| Erichrome Black T | Used in EDTA titrations | — | — |

**Step 3 — Match criteria:**
- Weak acid ✓ (phenolphthalein is a weak acid)
- Colour change near pH 8.7–9 ✓ (phenolphthalein changes at pH 8.3–10)
- Exists in ionised form in basic medium ✓ (forms $\\mathrm{In^{2-}}$ in base, giving pink colour)

**Answer: Option (3) — Phenolphthalein**`,
'tag_redox_3', src(2022, 'Jul', 29, 'Evening')),

// Q69 — Percentage of MnO2 in sample; Answer: 13%
mkNVT('RDX-069', 'Hard',
`A 2.0 g sample containing $\\mathrm{MnO_2}$ is treated with HCl liberating $\\mathrm{Cl_2}$. The $\\mathrm{Cl_2}$ gas is passed into a solution of KI and 60.0 mL of $0.1\\ \\mathrm{M}\\ \\mathrm{Na_2S_2O_3}$ is required to titrate the liberated iodine. The percentage of $\\mathrm{MnO_2}$ in the sample is $\\_\\_\\_\\_$. (Nearest integer)

[Atomic masses (in u): $\\mathrm{Mn} = 55$; $\\mathrm{Cl} = 35.5$; $\\mathrm{O} = 16$; $\\mathrm{I} = 127$; $\\mathrm{Na} = 23$; $\\mathrm{K} = 39$; $\\mathrm{S} = 32$]`,
{ integer_value: 13 },
`**Step 1 — Chain of reactions:**

**(i)** $\\mathrm{MnO_2 + 4HCl \\rightarrow MnCl_2 + Cl_2 + 2H_2O}$

**(ii)** $\\mathrm{Cl_2 + 2KI \\rightarrow 2KCl + I_2}$

**(iii)** $\\mathrm{I_2 + 2Na_2S_2O_3 \\rightarrow Na_2S_4O_6 + 2NaI}$

**Step 2 — Moles of $\\mathrm{Na_2S_2O_3}$:**
$$n_{\\mathrm{S_2O_3^{2-}}} = 0.1 \\times 60 \\times 10^{-3} = 6 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 3 — Moles of $\\mathrm{I_2}$ (from iii, ratio 1:2):**
$$n_{\\mathrm{I_2}} = \\frac{6 \\times 10^{-3}}{2} = 3 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 4 — Moles of $\\mathrm{Cl_2}$ (from ii, ratio 1:1):**
$$n_{\\mathrm{Cl_2}} = 3 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 5 — Moles of $\\mathrm{MnO_2}$ (from i, ratio 1:1):**
$$n_{\\mathrm{MnO_2}} = 3 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 6 — Mass of $\\mathrm{MnO_2}$:**
$$m = 3 \\times 10^{-3} \\times (55 + 32) = 3 \\times 10^{-3} \\times 87 = 0.261\\ \\mathrm{g}$$

**Step 7 — Percentage:**
$$\\% = \\frac{0.261}{2.0} \\times 100 = 13.05 \\approx \\mathbf{13\\%}$$

**Answer: 13%**`,
'tag_redox_3', src(2022, 'Jun', 28, 'Morning')),

// Q70 — Strength of KMnO4 in g/L; Answer: 316 × 10^-2 g/L
mkNVT('RDX-070', 'Hard',
`When 10 mL of an aqueous solution of $\\mathrm{KMnO_4}$ was titrated in acidic medium, equal volume of 0.1 M of an aqueous solution of ferrous sulphate was required for complete discharge of colour. The strength of $\\mathrm{KMnO_4}$ in grams per litre is $\\_\\_\\_\\_ \\times 10^{-2}$. (Nearest integer)

[Atomic mass of $\\mathrm{K} = 39$, $\\mathrm{Mn} = 55$, $\\mathrm{O} = 16$]`,
{ integer_value: 316 },
`**Step 1 — Balanced reaction in acidic medium:**
$$\\mathrm{KMnO_4 + 5FeSO_4 + 4H_2SO_4 \\rightarrow MnSO_4 + \\frac{1}{2}K_2SO_4 + \\frac{5}{2}Fe_2(SO_4)_3 + 4H_2O}$$

Or using n-factor method:
- $\\mathrm{KMnO_4}$: Mn goes $+7 \\rightarrow +2$, n-factor = 5
- $\\mathrm{FeSO_4}$: Fe goes $+2 \\rightarrow +3$, n-factor = 1

**Step 2 — Equivalents must be equal:**
$$n_{\\mathrm{KMnO_4}} \\times 5 = n_{\\mathrm{FeSO_4}} \\times 1$$

**Step 3 — Moles of $\\mathrm{FeSO_4}$:**
$$n_{\\mathrm{FeSO_4}} = 0.1 \\times 10 \\times 10^{-3} = 1 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 4 — Moles of $\\mathrm{KMnO_4}$:**
$$n_{\\mathrm{KMnO_4}} = \\frac{1 \\times 10^{-3}}{5} = 2 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 5 — Molarity of $\\mathrm{KMnO_4}$:**
$$M = \\frac{2 \\times 10^{-4}}{10 \\times 10^{-3}} = 0.02\\ \\mathrm{M}$$

**Step 6 — Strength in g/L:**
$$\\text{Molar mass of KMnO}_4 = 39 + 55 + 64 = 158\\ \\mathrm{g\\ mol^{-1}}$$
$$\\text{Strength} = 0.02 \\times 158 = 3.16\\ \\mathrm{g\\ L^{-1}} = 316 \\times 10^{-2}\\ \\mathrm{g\\ L^{-1}}$$

**Answer: 316**`,
'tag_redox_3', src(2022, 'Jun', 28, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (RDX-061 to RDX-070)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
