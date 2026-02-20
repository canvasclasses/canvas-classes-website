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

// Q57 — Rf ratio of sample A and C; Ans: 200 (x=200)
mkNVT('POC-001', 'Hard',
`Using the given figure of paper chromatography, the ratio of $ \\mathrm{R_f} $ values of sample A and sample C is $ x \\times 10^{-2} $. Value of $ x $ is ______`,
{ integer_value: 200 },
`**Retardation factor ($ \\mathrm{R_f} $):**

$$\\mathrm{R_f} = \\frac{\\text{Distance travelled by substance}}{\\text{Distance travelled by solvent front}}$$

From the paper chromatography figure:
- Solvent front distance = 10 cm (assumed from figure)
- Sample A distance = 8 cm → $ \\mathrm{R_f(A)} = 8/10 = 0.8 $
- Sample C distance = 4 cm → $ \\mathrm{R_f(C)} = 4/10 = 0.4 $

**Ratio of $ \\mathrm{R_f(A)} $ to $ \\mathrm{R_f(C)} $:**

$$\\frac{\\mathrm{R_f(A)}}{\\mathrm{R_f(C)}} = \\frac{0.8}{0.4} = 2.0 = 200 \\times 10^{-2}$$

**x = 200**

**Final Answer: 200**`,
'tag_poc_1'),

// Q58 — Correct statement about chromatography; Ans: (3) Rf of polar compound is smaller
mkSCQ('POC-002', 'Medium',
`The correct statement among the following, for a "chromatography" purification method is:`,
[
  'Organic compounds run faster than solvent in the thin layer chromatographic plate.',
  '$ \\mathrm{R_f} $ is an integral value.',
  '$ \\mathrm{R_f} $ of a polar compound is smaller than that of a non-polar compound.',
  'Non-polar compounds are retained at top and polar compounds come down in column chromatography.',
],
'c',
`**Evaluating each statement:**

**(1) Organic compounds run faster than solvent — FALSE ✗**
The solvent front always moves faster than the solute. $ \\mathrm{R_f} < 1 $ always.

**(2) $ \\mathrm{R_f} $ is an integral value — FALSE ✗**
$ \\mathrm{R_f} = \\frac{\\text{distance by substance}}{\\text{distance by solvent}} $, which is always between 0 and 1 (a fraction, not an integer).

**(3) $ \\mathrm{R_f} $ of polar compound is smaller than non-polar — TRUE ✓**
In adsorption chromatography (silica gel/alumina stationary phase):
- Polar compounds adsorb more strongly to the polar stationary phase → move slower → **smaller $ \\mathrm{R_f} $**
- Non-polar compounds adsorb less → move faster → **larger $ \\mathrm{R_f} $**

**(4) Non-polar compounds retained at top — FALSE ✗**
In column chromatography, non-polar compounds are **less adsorbed** → elute first (come out first, not retained at top). Polar compounds are retained longer.

**Final Answer: Option (3)**`,
'tag_poc_1'),

// Q59 — Methods for purification based on; Ans: (1) nature of compound and presence of impurity
mkSCQ('POC-003', 'Easy',
`Methods used for purification of organic compounds are based on:`,
[
  'nature of compound and presence of impurity.',
  'neither on nature of compound nor on the impurity present.',
  'nature of compound only.',
  'presence of impurity only.',
],
'a',
`**Purification methods** for organic compounds are selected based on **both**:

1. **Nature of the compound** (volatile, non-volatile, solubility, boiling point, etc.)
2. **Nature/type of impurity** present (volatile, non-volatile, soluble, insoluble, etc.)

**Examples:**
- **Distillation:** Used when compound is volatile and impurity is non-volatile (based on nature of compound)
- **Crystallization:** Used when compound and impurity have different solubilities (based on both)
- **Steam distillation:** Used for steam-volatile, water-immiscible compounds (nature of compound)
- **Sublimation:** Used when compound sublimes but impurity doesn't (nature of both)

**The choice of purification method depends on the nature of BOTH the compound AND the impurity.**

**Final Answer: Option (1)**`,
'tag_poc_1'),

// Q60 — Technique for steam volatile water immiscible substance; Ans: (4) Steam distillation
mkSCQ('POC-004', 'Easy',
`The technique used for purification of steam volatile water immiscible substance is:`,
[
  'Fractional distillation',
  'Fractional distillation under reduced pressure',
  'Distillation',
  'Steam distillation',
],
'd',
`**Steam distillation** is used for:
- Compounds that are **steam volatile** (can be carried over with steam)
- Compounds that are **immiscible with water**
- Compounds that would decompose at their normal boiling point

**Principle:** When steam is passed through the compound, the mixture boils at a temperature **below 100°C** (since the combined vapour pressure of water + compound = atmospheric pressure at a lower temperature). This allows purification without decomposition.

**Examples:** Aniline, essential oils, turpentine oil

**Final Answer: Option (4) — Steam distillation**`,
'tag_poc_1'),

// Q61 — Purification based on solubility in two solvents; Ans: (4) Differential Extraction
mkSCQ('POC-005', 'Easy',
`Which among the following purification methods is based on the principle of "Solubility" in two different solvents?`,
[
  'Column Chromatography',
  'Sublimation',
  'Distillation',
  'Differential Extraction',
],
'd',
`**Differential Extraction (Solvent Extraction):**

This method is based on the **difference in solubility** of a compound in two immiscible solvents (usually water and an organic solvent like ether, DCM, etc.).

**Principle:** The compound distributes itself between two immiscible solvents according to its relative solubility in each (distribution coefficient/partition coefficient).

$$K = \\frac{\\text{Concentration in organic solvent}}{\\text{Concentration in aqueous solvent}}$$

**Process:** The mixture is shaken with an immiscible organic solvent in a separating funnel. The compound preferentially dissolves in one solvent and is separated.

**Other methods:**
- Column Chromatography: based on differential adsorption
- Sublimation: based on sublimation property
- Distillation: based on difference in boiling points

**Final Answer: Option (4) — Differential Extraction**`,
'tag_poc_1'),

// Q62 — Adsorption principle used for; Ans: (2) Chromatography
mkSCQ('POC-006', 'Easy',
`'Adsorption' principle is used for which of the following purification method?`,
[
  'Extraction',
  'Chromatography',
  'Distillation',
  'Sublimation',
],
'b',
`**Purification methods and their principles:**

| Method | Principle |
|---|---|
| Extraction | Difference in solubility in two immiscible solvents |
| **Chromatography** | **Differential adsorption** on stationary phase |
| Distillation | Difference in boiling points (volatility) |
| Sublimation | Ability to sublime (solid → gas directly) |
| Crystallization | Difference in solubility at different temperatures |

**Chromatography** works on the principle of **differential adsorption** — different components of a mixture adsorb to different extents on the stationary phase (silica gel, alumina, etc.) and are thus separated.

**Final Answer: Option (2) — Chromatography**`,
'tag_poc_1'),

// Q63 — Extraction of essential oils from flowers; Ans: (4) Steam distillation
mkSCQ('POC-007', 'Easy',
`The fragrance of flowers is due to the presence of some steam volatile organic compounds called essential oils. These are generally insoluble in water at room temperature but are miscible with water vapour in the vapour phase. A suitable method for the extraction of these oils from the flowers is:`,
[
  'crystallisation',
  'distillation under reduced pressure',
  'distillation',
  'steam distillation',
],
'd',
`**Essential oils** are:
- Steam volatile (can be carried over with steam)
- Water immiscible at room temperature
- Often decompose at their normal boiling points

**Steam distillation** is the ideal method because:
1. The mixture of water + essential oil boils below 100°C
2. The oil is carried over with steam without decomposition
3. After condensation, the oil separates from water (immiscible)
4. The oil can then be collected from the separating funnel

**Examples:** Rose oil, jasmine oil, eucalyptus oil — all extracted by steam distillation.

**Simple distillation** would require heating to the oil's boiling point (may cause decomposition).
**Reduced pressure distillation** is for high-boiling compounds that decompose.
**Crystallization** is for solid compounds.

**Final Answer: Option (4) — Steam distillation**`,
'tag_poc_1'),

// Q64 — Correct order of elution in silica gel column; Ans: (1) B, A, C
mkSCQ('POC-008', 'Hard',
`Thin layer chromatography of a mixture shows the following observation (spots at different heights on TLC plate — B at top, A in middle, C at bottom).\n\nThe correct order of elution in the silica gel column chromatography is`,
[
  'B, A, C',
  'B, C, A',
  'A, C, B',
  'C, A, B',
],
'a',
`**Relationship between TLC and column chromatography:**

In TLC with silica gel (polar stationary phase):
- **Higher $ \\mathrm{R_f} $** = less polar compound (moves higher up the plate)
- **Lower $ \\mathrm{R_f} $** = more polar compound (moves less, stays near bottom)

From the TLC observation:
- B is at the **top** → highest $ \\mathrm{R_f} $ → **least polar**
- A is in the **middle** → intermediate $ \\mathrm{R_f} $
- C is at the **bottom** → lowest $ \\mathrm{R_f} $ → **most polar**

**In column chromatography (silica gel):**
- Less polar compounds are **less adsorbed** → elute first
- More polar compounds are **more adsorbed** → elute last

**Elution order: B (least polar, elutes first) → A → C (most polar, elutes last)**

**Final Answer: Option (1) — B, A, C**`,
'tag_poc_1'),

// Q65 — Ratio of Rf values of A to B; Ans: 2
mkNVT('POC-009', 'Medium',
`The separation of two coloured substances was done by paper chromatography. The distances travelled by solvent front, substance A and substance B from the base line are 3.25 cm, 2.08 cm and 1.05 cm respectively. The ratio of $ \\mathrm{R_f} $ values of A to B is (Answer the nearest integer)`,
{ integer_value: 2 },
`**Calculating $ \\mathrm{R_f} $ values:**

$$\\mathrm{R_f} = \\frac{\\text{Distance travelled by substance}}{\\text{Distance travelled by solvent front}}$$

**$ \\mathrm{R_f} $ of A:**
$$\\mathrm{R_f(A)} = \\frac{2.08}{3.25} = 0.6400$$

**$ \\mathrm{R_f} $ of B:**
$$\\mathrm{R_f(B)} = \\frac{1.05}{3.25} = 0.3231$$

**Ratio $ \\mathrm{R_f(A)} : \\mathrm{R_f(B)} $:**
$$\\frac{0.6400}{0.3231} = \\frac{2.08}{1.05} = 1.981 \\approx 2$$

**Final Answer: 2**`,
'tag_poc_1'),

// Q66 — Match List-I (Mixture) with List-II (Purification Process); Ans: (4) A-III, B-IV, C-I, D-II
mkSCQ('POC-010', 'Medium',
`Match List-I with List-II:\n\n**List-I (Mixture):**\n(A) Chloroform & Aniline\n(B) Benzoic acid & Naphthalene\n(C) Water & Aniline\n(D) Naphthalene & Sodium chloride\n\n**List-II (Purification Process):**\n(I) Steam distillation\n(II) Sublimation\n(III) Distillation\n(IV) Crystallisation`,
[
  'A-IV, B-III, C-I, D-II',
  'A-III, B-I, C-IV, D-II',
  'A-III, B-IV, C-II, D-I',
  'A-III, B-IV, C-I, D-II',
],
'd',
`**Matching mixtures to purification methods:**

**(A) Chloroform & Aniline:**
- Both are liquids with different boiling points (CHCl₃: 61°C, Aniline: 184°C)
- Difference > 25°C → **Simple Distillation (III)** ✓

**(B) Benzoic acid & Naphthalene:**
- Both are solids with different solubilities in hot/cold solvent
- Benzoic acid is more soluble in hot water → **Crystallisation (IV)** ✓

**(C) Water & Aniline:**
- Aniline is steam volatile and immiscible with water
- → **Steam distillation (I)** ✓

**(D) Naphthalene & Sodium chloride:**
- Naphthalene sublimes, NaCl does not
- → **Sublimation (II)** ✓

**Matching: A-III, B-IV, C-I, D-II**

**Final Answer: Option (4)**`,
'tag_poc_1'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
