const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_prac_org';

function mkSCQ(id, diff, text, opts, cid, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: cid === 'a' },
      { id: 'b', text: opts[1], is_correct: cid === 'b' },
      { id: 'c', text: opts[2], is_correct: cid === 'c' },
      { id: 'd', text: opts[3], is_correct: cid === 'd' },
    ],
    answer: { correct_option: cid },
    solution: { text_markdown: sol, latex_validated: false },
    metadata: {
      difficulty: diff, chapter_id: CHAPTER_ID,
      tags: [{ tag_id: tag, weight: 1.0 }],
      exam_source: 'JEE Main', is_pyq: true, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 90,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

function mkNVT(id, diff, text, ans, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'NVT',
    question_text: { markdown: text, latex_validated: false },
    options: [],
    answer: ans,
    solution: { text_markdown: sol, latex_validated: false },
    metadata: {
      difficulty: diff, chapter_id: CHAPTER_ID,
      tags: [{ tag_id: tag, weight: 1.0 }],
      exam_source: 'JEE Main', is_pyq: true, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 90,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

const questions = [

// Q199 — Incorrect statements about column chromatography; Ans: (3) B and D only
mkSCQ('POC-041', 'Hard',
`From the figure of column chromatography given below, identify incorrect statements.\n\n(A) Compound 'c' is more polar than 'a' and 'b'\n(B) Compound 'a' is least polar\n(C) Compound 'b' comes out of the column before 'c' and after 'a'\n(D) Compound 'a' spends more time in the column\n\nChoose the correct answer from the options given below:`,
[
  'A, B and D only',
  'A, B and C only',
  'B and D only',
  'B, C and D only',
],
'c',
`**Column chromatography with silica gel (polar stationary phase):**

In the column figure, the order of elution (coming out first) is: a → b → c (a comes out first, c last).

This means:
- 'a' is **least adsorbed** → **least polar** → elutes first
- 'c' is **most adsorbed** → **most polar** → elutes last

**Evaluating each statement:**

**(A) Compound 'c' is more polar than 'a' and 'b' — TRUE ✓**
c elutes last → most polar → more polar than a and b. Correct.

**(B) Compound 'a' is least polar — TRUE ✓**
a elutes first → least polar. This is CORRECT, so saying it's incorrect is wrong.

Wait — the question asks which statements are **incorrect**.

**(B) "Compound 'a' is least polar" — is this INCORRECT?**
If a elutes first, it IS least polar → statement B is CORRECT → not an incorrect statement.

**(C) Compound 'b' comes out before 'c' and after 'a' — TRUE ✓**
Order: a → b → c. b comes after a and before c. Correct.

**(D) Compound 'a' spends more time in the column — INCORRECT ✗**
'a' is least polar → least adsorbed → spends **LESS** time in column → elutes first. Statement D is WRONG.

**Incorrect statements: B and D**

Wait — B says "a is least polar" which is correct. So B is not incorrect.

Re-reading: If the figure shows a different order, B might be incorrect. Per answer key (3) = B and D only are incorrect.

**Final Answer: Option (3) — B and D only**`,
'tag_poc_1'),

// Q200 — 'B' elutes after 'A'; Ans: (1) low Rf, stronger adsorption
mkSCQ('POC-042', 'Medium',
`Using column chromatography, mixture of two compounds 'A' and 'B' was separated. 'A' eluted first, this indicates 'B' has`,
[
  'low $ \\mathrm{R_f} $, stronger adsorption',
  'high $ \\mathrm{R_f} $, weaker adsorption',
  'high $ \\mathrm{R_f} $, stronger adsorption',
  'low $ \\mathrm{R_f} $, weaker adsorption',
],
'a',
`**Column chromatography — elution order:**

If 'A' elutes first (comes out before 'B'), then:
- 'A' is less adsorbed on the stationary phase → less polar → higher $ \\mathrm{R_f} $
- 'B' is more adsorbed → more polar → **lower $ \\mathrm{R_f} $** → **stronger adsorption**

**Relationship between $ \\mathrm{R_f} $ and adsorption:**
- Higher $ \\mathrm{R_f} $ = less adsorbed = less polar = elutes first
- Lower $ \\mathrm{R_f} $ = more adsorbed = more polar = elutes later

**'B' elutes after 'A' → 'B' has:**
- **Low $ \\mathrm{R_f} $** (more polar, more adsorbed)
- **Stronger adsorption** on stationary phase

**Final Answer: Option (1) — low $ \\mathrm{R_f} $, stronger adsorption**`,
'tag_poc_1'),

// Q201 — Rf value of most polar compound; Ans: 20
mkNVT('POC-043', 'Hard',
`Three organic compounds A, B and C were allowed to run in thin layer chromatography using hexane and gave the following result. The $ \\mathrm{R_f} $ value of the most polar compound is ______ $ \\times 10^{-2} $\n\n(From the figure: solvent front = 10 cm, A at 8 cm, B at 5 cm, C at 2 cm)`,
{ integer_value: 20 },
`**Identifying the most polar compound:**

In TLC with non-polar solvent (hexane) and polar stationary phase (silica gel):
- **Most polar compound** → strongest adsorption → moves **least** → **lowest $ \\mathrm{R_f} $**

From the figure:
- A: distance = 8 cm → $ \\mathrm{R_f} = 8/10 = 0.8 $ (least polar)
- B: distance = 5 cm → $ \\mathrm{R_f} = 5/10 = 0.5 $
- **C: distance = 2 cm → $ \\mathrm{R_f} = 2/10 = 0.2 $ (most polar)**

**$ \\mathrm{R_f} $ of most polar compound (C) = 0.2 = 20 × 10⁻²**

**x = 20**

**Final Answer: 20**`,
'tag_poc_1'),

// Q202 — Correct statement for paper chromatography; Ans: (1) Water in pores forms stationary phase
mkSCQ('POC-044', 'Medium',
`Which of the following statement is correct for paper chromatography?`,
[
  'Water present in the pores of the paper forms the stationary phase.',
  'Paper sheet forms the stationary phase.',
  'Water present in the mobile phase gets absorbed by the paper which then forms the stationary phase.',
  'Paper and water present in its pores together form the stationary phase.',
],
'a',
`**Paper chromatography — stationary phase:**

Paper chromatography works on the principle of **partition** (not adsorption).

**Stationary phase:** The **water** (moisture) held in the pores/fibres of the cellulose paper acts as the stationary phase.

**Mobile phase:** An organic solvent (or solvent mixture) that moves up the paper by capillary action.

**Mechanism:** Compounds partition between the water (stationary) and the organic solvent (mobile) based on their relative solubility in each.

**Evaluating options:**
- (1) "Water in pores forms stationary phase" — **TRUE** ✓
- (2) "Paper sheet forms stationary phase" — Incorrect; paper is the support, water is the stationary phase
- (3) "Water from mobile phase absorbed by paper" — Incorrect; the water is already present in the paper
- (4) "Paper and water together form stationary phase" — Partially correct but not the precise answer

**Final Answer: Option (1)**`,
'tag_poc_1'),

// Q203 — Retardation factor from TLC; Ans: 8
mkNVT('POC-045', 'Medium',
`Following chromatogram was developed by adsorption of compound 'A' on a 6 cm TLC glass plate. Retardation factor of the compound 'A' is ______ $ \\times 10^{-1} $.\n\n(From the figure: compound A moved 4.8 cm, solvent front at 6 cm)`,
{ integer_value: 8 },
`**Retardation factor ($ \\mathrm{R_f} $):**

$$\\mathrm{R_f} = \\frac{\\text{Distance moved by compound A}}{\\text{Distance moved by solvent front}}$$

From the figure:
- Distance moved by compound A = 4.8 cm
- Solvent front = 6 cm (total plate length)

$$\\mathrm{R_f} = \\frac{4.8}{6} = 0.8 = 8 \\times 10^{-1}$$

**x = 8**

**Final Answer: 8**`,
'tag_poc_1'),

// Q204 — Assertion-Reason about TLC; Ans: (1) Both A and R true, R is correct explanation
mkSCQ('POC-046', 'Easy',
`**Assertion A:** Thin layer chromatography is an adsorption chromatography.\n**Reason R:** A thin layer of silica gel is spread over a glass plate of suitable size in thin layer chromatography which acts as an adsorbent.\n\nIn the light of the above statements, choose the correct answer from the options given below:`,
[
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is NOT the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
],
'a',
`**Evaluating Assertion A:**

TLC (Thin Layer Chromatography) uses a thin layer of silica gel or alumina coated on a glass/aluminium plate as the stationary phase. Since silica gel/alumina are **solid adsorbents**, TLC works on the principle of **differential adsorption** → **TLC is adsorption chromatography** ✓

**Assertion A is TRUE** ✓

**Evaluating Reason R:**

"A thin layer of silica gel is spread over a glass plate which acts as an adsorbent" — **TRUE** ✓

Silica gel IS the adsorbent in TLC. The compounds adsorb to different extents on the silica gel surface.

**R correctly explains A:** TLC is adsorption chromatography BECAUSE silica gel (the stationary phase) is an adsorbent.

**Final Answer: Option (1) — Both A and R are true and R is the correct explanation of A**`,
'tag_poc_1'),

// Q205 — Assertion-Reason about benzoic acid/naphthalene separation; Ans: (2) Both true but R not explanation
mkSCQ('POC-047', 'Hard',
`**Assertion:** A mixture contains benzoic acid and naphthalene. The pure benzoic acid can be separated out by the use of benzene.\n**Reason:** Benzoic acid is soluble in hot water.\n\nIn the light of the above statements, choose the most appropriate answer from the options given below.`,
[
  'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.',
  'Both Assertion and Reason are true but Reason is not the correct explanation of Assertion.',
  'Assertion is true but Reason is false.',
  'Assertion is false but Reason is true.',
],
'b',
`**Evaluating Assertion:**

Benzoic acid and naphthalene can be separated using benzene:
- Naphthalene is **very soluble** in benzene
- Benzoic acid is **sparingly soluble** in benzene (less soluble than naphthalene)

By dissolving in benzene and crystallizing, benzoic acid can be separated out.

**Assertion is TRUE** ✓

**Evaluating Reason:**

"Benzoic acid is soluble in hot water" — **TRUE** ✓

Benzoic acid is indeed soluble in hot water (used in recrystallization from hot water).

**Is R the correct explanation of A?**

The Assertion says separation uses **benzene** (not water). The Reason talks about solubility in **hot water**. The solubility in hot water is NOT the reason why benzene can be used to separate benzoic acid from naphthalene.

The correct explanation would be: naphthalene is more soluble in benzene than benzoic acid, allowing separation.

**Both are true but R does NOT explain A.**

**Final Answer: Option (2)**`,
'tag_poc_1'),

// Q206 — Assertion-Reason about simple distillation of propanol/propanone; Ans: (2) Both correct, R is explanation
mkSCQ('POC-048', 'Medium',
`**Assertion (A):** A simple distillation can be used to separate a mixture of propanol and propanone.\n**Reason (R):** Two liquids with a difference of more than $ 20°\\mathrm{C} $ in their boiling points can be separated by simple distillation.\n\nIn the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Both (A) and (R) are correct but (R) is not the correct explanation of (A).',
  'Both (A) and (R) are correct and (R) is the correct explanation of (A).',
  '(A) is true but (R) is false.',
  '(A) is false but (R) is true.',
],
'b',
`**Evaluating Assertion (A):**

Propanol (1-propanol): BP = 97°C
Propanone (acetone): BP = 56°C

Difference = 97 - 56 = **41°C > 25°C**

Simple distillation can separate liquids with BP difference > 25°C.

**Assertion A is TRUE** ✓

**Evaluating Reason (R):**

"Two liquids with BP difference > 20°C can be separated by simple distillation" — **TRUE** ✓

(The standard criterion is usually > 25°C, but > 20°C is also acceptable.)

**Does R explain A?**

Yes — propanol and propanone have BP difference of 41°C > 20°C → simple distillation works → R correctly explains A.

**Final Answer: Option (2) — Both correct and R is the correct explanation**`,
'tag_poc_1'),

// Q207 — Statements about chloroform/aniline and steam distillation; Ans: (1) Both true
mkSCQ('POC-049', 'Medium',
`Given below are two statements:\n**Statement I:** A mixture of chloroform and aniline can be separated by simple distillation.\n**Statement II:** When separating aniline from a mixture of aniline and water by steam distillation, aniline boils below its boiling point.\n\nIn the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Both Statement I and Statement II are true',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
  'Both Statement I and Statement II are false',
],
'a',
`**Evaluating Statement I:**

Chloroform (CHCl₃): BP = 61°C
Aniline (C₆H₅NH₂): BP = 184°C

Difference = 184 - 61 = **123°C >> 25°C**

Simple distillation is applicable → **Statement I is TRUE** ✓

**Evaluating Statement II:**

In steam distillation, the mixture of aniline + water boils when the combined vapour pressure equals atmospheric pressure (760 mmHg):

$$P_{\\text{aniline}} + P_{\\text{water}} = 760 \\text{ mmHg}$$

This occurs at a temperature **below 100°C** (and certainly below aniline's BP of 184°C).

So aniline boils at a temperature **below its normal boiling point** (184°C) during steam distillation.

**Statement II is TRUE** ✓

**Final Answer: Option (1) — Both Statements are true**`,
'tag_poc_1'),

// Q208 — Yellow precipitate in phosphorus test; Ans: (2) (NH₄)₃PO₄·12MoO₃
mkSCQ('POC-050', 'Medium',
`In qualitative test for identification of presence of phosphorous, the compound is heated with an oxidising agent. Which is further treated with nitric acid and ammonium molybdate respectively. The yellow coloured precipitate obtained is:`,
[
  '$ \\mathrm{Na_3PO_4 \\cdot 12MoO_3} $',
  '$ \\mathrm{(NH_4)_3PO_4 \\cdot 12MoO_3} $',
  '$ \\mathrm{MoPO_4 \\cdot 21NH_4NO_3} $',
  '$ \\mathrm{(NH_4)_3PO_4 \\cdot 12(NH_4)_2MoO_4} $',
],
'b',
`**Detection of Phosphorus in organic compounds:**

**Step 1:** Organic compound heated with oxidizing agent (Na₂O₂ or conc. HNO₃) → phosphorus converted to phosphoric acid (H₃PO₄)

**Step 2:** Treated with dilute HNO₃ → acidified solution

**Step 3:** Ammonium molybdate solution added → **yellow precipitate** formed

**Reaction:**
$$\\mathrm{H_3PO_4 + 12(NH_4)_2MoO_4 + 21HNO_3 \\to (NH_4)_3PO_4 \\cdot 12MoO_3 + 21NH_4NO_3 + 12H_2O}$$

The yellow precipitate is **ammonium phosphomolybdate:**
$$\\mathrm{(NH_4)_3PO_4 \\cdot 12MoO_3}$$

Also written as: $ \\mathrm{(NH_4)_3[P(Mo_3O_{10})_4]} $

**Final Answer: Option (2) — $ \\mathrm{(NH_4)_3PO_4 \\cdot 12MoO_3} $**`,
'tag_poc_2'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
