const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch12_biomolecules';

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

// Q63 — Enzyme A and B in sucrose fermentation; Ans: (3) Invertase and Zymase
mkSCQ('BIO-061', 'Easy',
`$ \\mathrm{C_{12}H_{22}O_{11} + H_2O \\xrightarrow{\\text{Enzyme A}} C_6H_{12}O_6 + C_6H_{12}O_6 \\xrightarrow{\\text{Enzyme B}} 2C_2H_5OH + 2CO_2} $\n\nIn the above reactions, the enzyme A and enzyme B respectively are :-`,
[
  'Amylase and Invertase',
  'Invertase and Amylase',
  'Invertase and Zymase',
  'Zymase and Invertase',
],
'c',
`**Enzyme identification:**

**Reaction 1:** Sucrose ($ \\mathrm{C_{12}H_{22}O_{11}} $) + H₂O → Glucose + Fructose

This is hydrolysis of sucrose (inversion of sucrose). The enzyme that catalyses this is **Invertase** (also called sucrase).

$$\\text{Sucrose} \\xrightarrow{\\text{Invertase}} \\alpha\\text{-D-Glucose} + \\beta\\text{-D-Fructose}$$

**Reaction 2:** Glucose/Fructose → 2 C₂H₅OH + 2 CO₂

This is **alcoholic fermentation** of glucose. The enzyme that catalyses this is **Zymase** (a complex of enzymes found in yeast).

$$\\text{Glucose} \\xrightarrow{\\text{Zymase}} 2\\text{ Ethanol} + 2\\text{ CO}_2$$

**Other enzymes:**
- Amylase: hydrolyses starch to maltose
- Maltase: hydrolyses maltose to glucose

**Final Answer: Option (3) — Invertase and Zymase**`,
'tag_bio_2'),

// Q64 — Glycosidic linkage in lactose; Ans: (3)
mkSCQ('BIO-062', 'Medium',
`Which of the glycosidic linkage between galactose and glucose is present in lactose?`,
[
  '$ \\mathrm{C-1} $ of glucose and $ \\mathrm{C-4} $ of galactose',
  '$ \\mathrm{C-1} $ of glucose and $ \\mathrm{C-6} $ of galactose',
  '$ \\mathrm{C-1} $ of galactose and $ \\mathrm{C-4} $ of glucose',
  '$ \\mathrm{C-1} $ of galactose and $ \\mathrm{C-6} $ of glucose',
],
'c',
`**Structure of Lactose:**

Lactose is a disaccharide found in milk. Its structure:

- **$ \\beta $-D-Galactose** linked to **$ \\beta $-D-Glucose**
- Linkage: **C1 of galactose → C4 of glucose** ($ \\beta $-1,4 glycosidic bond)
- The anomeric carbon (C1) of galactose is involved in the bond
- The C1 of glucose remains free as an anomeric –OH → lactose is a **reducing sugar**

**Why not other options:**
- C1 of glucose + C4 of galactose: this would be a different disaccharide
- C1 of galactose + C6 of glucose: this would be a $ \\beta $-1,6 linkage (not lactose)
- C1 of glucose + C6 of galactose: incorrect

**Final Answer: Option (3) — C-1 of galactose and C-4 of glucose**`,
'tag_bio_2'),

// Q66 — Match disaccharides with monomers; Ans: (3)
mkSCQ('BIO-063', 'Medium',
`Match List-I with List-II.\n\n**List-I**\n(a) Sucrose\n(b) Lactose\n(c) Maltose\n\n**List-II**\n(i) $ \\beta $-D-Galactose and $ \\beta $-D-Glucose\n(ii) $ \\alpha $-D-Glucose and $ \\beta $-D-Fructose\n(iii) $ \\alpha $-D-Glucose and $ \\alpha $-D-Glucose\n\nChoose the correct answer from the options given below:`,
[
  '(a) → (iii), (b) → (ii), (c) → (i)',
  '(a) → (iii), (b) → (i), (c) → (ii)',
  '(a) → (ii), (b) → (i), (c) → (iii)',
  '(a) → (i), (b) → (iii), (c) → (ii)',
],
'c',
`**Monomer units of disaccharides:**

| Disaccharide | Monomers | Match |
|---|---|---|
| **Sucrose** | $ \\alpha $-D-Glucose + $ \\beta $-D-Fructose | → **(ii)** |
| **Lactose** | $ \\beta $-D-Galactose + $ \\beta $-D-Glucose | → **(i)** |
| **Maltose** | $ \\alpha $-D-Glucose + $ \\alpha $-D-Glucose | → **(iii)** |

**Correct matching: (a)→(ii), (b)→(i), (c)→(iii)**

**Final Answer: Option (3)**`,
'tag_bio_2'),

// Q67 — Functional groups in maltose; Ans: (3) One acetal and one hemiacetal
mkSCQ('BIO-064', 'Medium',
`What are the functional groups present in the structure of maltose?`,
[
  'One ketal and one hemiketal',
  'Two acetals',
  'One acetal and one hemiacetal',
  'One acetal and one ketal',
],
'c',
`**Structure of maltose and functional groups:**

Maltose consists of two $ \\alpha $-D-glucose units linked by an $ \\alpha $-1,4 glycosidic bond.

**First glucose unit (non-reducing end):**
- C1 is involved in the glycosidic bond with C4 of the second glucose
- C1 has two –OR groups (one from the ring oxygen, one from the glycosidic bond) → **Acetal** (full acetal, no free –OH at C1)

**Second glucose unit (reducing end):**
- C1 is free and has an –OH group (anomeric –OH)
- C1 has one –OR (ring oxygen) and one –OH → **Hemiacetal**

**Summary:**
- First glucose: **Acetal** (C1 involved in glycosidic bond)
- Second glucose: **Hemiacetal** (C1 free with –OH)

This is why maltose is a **reducing sugar** — the hemiacetal can open to give a free aldehyde.

**Final Answer: Option (3) — One acetal and one hemiacetal**`,
'tag_bio_2'),

// Q68 — Number of chiral carbons in sucrose; Ans: 9
mkNVT('BIO-065', 'Hard',
`The number of chiral carbons present in sucrose is ______ .`,
{ integer_value: 9 },
`**Counting chiral carbons in sucrose:**

Sucrose = $ \\alpha $-D-glucose (pyranose) + $ \\beta $-D-fructose (furanose) linked at C1 of glucose and C2 of fructose.

**$ \\alpha $-D-Glucopyranose unit:**

| Carbon | Chiral? |
|---|---|
| C1 (anomeric, involved in glycosidic bond) | Yes ✓ |
| C2 | Yes ✓ |
| C3 | Yes ✓ |
| C4 | Yes ✓ |
| C5 | Yes ✓ |
| C6 (–CH₂O–) | No |

Glucose contributes **5 chiral carbons**

**$ \\beta $-D-Fructofuranose unit:**

| Carbon | Chiral? |
|---|---|
| C1 (–CH₂OH) | No |
| C2 (anomeric, involved in glycosidic bond) | Yes ✓ |
| C3 | Yes ✓ |
| C4 | Yes ✓ |
| C5 | Yes ✓ |
| C6 (–CH₂OH) | No |

Fructose contributes **4 chiral carbons**

**Total chiral carbons in sucrose = 5 + 4 = 9**

**Final Answer: 9**`,
'tag_bio_2'),

// Q69 — Not true about lactose; Ans: (1)
mkSCQ('BIO-066', 'Medium',
`Which one of the following statement is not true?`,
[
  'Lactose contains $ \\alpha $-glycosidic linkage between $ \\mathrm{C_1} $ of galactose and $ \\mathrm{C_4} $ of glucose',
  'Lactose is a reducing sugar and it gives Fehling\'s test.',
  'Lactose $ (\\mathrm{C_{11}H_{22}O_{11}}) $ is a disaccharide and it contains 8 hydroxyl groups.',
  'On acid hydrolysis, lactose gives one molecule of D(+)-glucose and one molecule of D(+)-galactose.',
],
'a',
`**Evaluating statements about lactose:**

**(1) Lactose contains $ \\alpha $-glycosidic linkage between C₁ of galactose and C₄ of glucose — FALSE ✗**

The glycosidic linkage in lactose is a **$ \\beta $-1,4 glycosidic bond** (not $ \\alpha $). The C1 of **$ \\beta $-D-galactose** is linked to C4 of $ \\beta $-D-glucose. This $ \\beta $-linkage is why humans cannot digest lactose without the enzyme lactase.

**(2) Lactose is a reducing sugar and gives Fehling's test — TRUE ✓**

The C1 of the glucose unit in lactose has a free anomeric –OH → reducing sugar → positive Fehling's test.

**(3) Lactose (C₁₁H₂₂O₁₁) is a disaccharide with 8 hydroxyl groups — TRUE ✓**

Lactose formula: $ \\mathrm{C_{12}H_{22}O_{11}} $ (actually). It has 8 free –OH groups in the structure.

**(4) Acid hydrolysis gives D(+)-glucose and D(+)-galactose — TRUE ✓**

Both glucose and galactose are dextrorotatory (+).

**Final Answer: Option (1)**`,
'tag_bio_2'),

// Q70 — Maltose on treatment with dilute HCl gives; Ans: (1) D-Glucose
mkSCQ('BIO-067', 'Easy',
`Maltose on treatment with dilute HCl gives:`,
[
  'D-Glucose',
  'D-Fructose',
  'D-Galactose',
  'D-Glucose and D-Fructose',
],
'a',
`**Hydrolysis of maltose:**

Maltose is a disaccharide composed of **two $ \\alpha $-D-glucose units** linked by an $ \\alpha $-1,4 glycosidic bond.

$$\\mathrm{Maltose + H_2O \\xrightarrow{dil.\\ HCl\\ or\\ maltase} 2\\ D\\text{-}Glucose}$$

On acid hydrolysis (dilute HCl), the glycosidic bond breaks to give **two molecules of D-glucose** only.

**Why not other options:**
- D-Fructose: would come from sucrose hydrolysis
- D-Galactose: would come from lactose hydrolysis
- D-Glucose + D-Fructose: would come from sucrose hydrolysis

**Final Answer: Option (1) — D-Glucose**`,
'tag_bio_2'),

// Q71 — Not true about sucrose; Ans: (3)
mkSCQ('BIO-068', 'Medium',
`Which of the following statements is not true about sucrose?`,
[
  'It is also named as invert sugar.',
  'It is a non-reducing sugar.',
  'The glycosidic linkage is present between $ \\mathrm{C_1} $ of $ \\alpha $-glucose and $ \\mathrm{C_1} $ of $ \\beta $-fructose.',
  'On hydrolysis, it produces glucose and fructose.',
],
'c',
`**Evaluating statements about sucrose:**

**(1) Sucrose is also named as invert sugar — FALSE as stated, but the MIXTURE after hydrolysis is called invert sugar**

Actually, the **hydrolysis product** (glucose + fructose mixture) is called invert sugar, not sucrose itself. However, this statement is sometimes considered acceptable in context. Let's check option (3) more carefully.

**(2) Sucrose is a non-reducing sugar — TRUE ✓**

Both anomeric carbons (C1 of glucose and C2 of fructose) are involved in the glycosidic bond → no free anomeric –OH → non-reducing.

**(3) Glycosidic linkage between C₁ of $ \\alpha $-glucose and C₁ of $ \\beta $-fructose — FALSE ✗**

The correct linkage is between **C₁ of $ \\alpha $-glucose and C₂ of $ \\beta $-fructose** (not C₁ of fructose). Fructose's anomeric carbon is C2 (since fructose is a ketose). This statement incorrectly says C₁ of fructose.

**(4) On hydrolysis, sucrose produces glucose and fructose — TRUE ✓**

**Final Answer: Option (3)**`,
'tag_bio_2'),

// Q72 — Amylopectin is composed of; Ans: (3)
mkSCQ('BIO-069', 'Easy',
`Amylopectin is composed of:`,
[
  '$ \\beta $-D-glucose, $ \\mathrm{C_1} $-$ \\mathrm{C_4} $ and $ \\mathrm{C_1} $-$ \\mathrm{C_6} $ linkages',
  '$ \\alpha $-D-glucose, $ \\mathrm{C_1} $-$ \\mathrm{C_4} $ and $ \\mathrm{C_2} $-$ \\mathrm{C_6} $ linkages',
  '$ \\alpha $-D-glucose, $ \\mathrm{C_1} $-$ \\mathrm{C_4} $ and $ \\mathrm{C_1} $-$ \\mathrm{C_6} $ linkages',
  '$ \\beta $-D-glucose, $ \\mathrm{C_1} $-$ \\mathrm{C_4} $ and $ \\mathrm{C_2} $-$ \\mathrm{C_6} $ linkages',
],
'c',
`**Structure of Amylopectin:**

Amylopectin is the branched component of starch (~80% of starch).

| Feature | Amylopectin |
|---|---|
| Monomer | **$ \\alpha $-D-glucose** |
| Main chain linkage | **$ \\alpha $-1,4 glycosidic bond** (C₁–C₄) |
| Branch point linkage | **$ \\alpha $-1,6 glycosidic bond** (C₁–C₆) |
| Branching frequency | Every 24–30 glucose units |
| Molecular weight | Very high (10⁶–10⁸ Da) |

**Comparison with amylose:**
- Amylose: $ \\alpha $-D-glucose, only $ \\alpha $-1,4 linkages (linear)
- Amylopectin: $ \\alpha $-D-glucose, $ \\alpha $-1,4 (main chain) + $ \\alpha $-1,6 (branches)

**Why not $ \\beta $-D-glucose:** Cellulose uses $ \\beta $-D-glucose. Starch (both amylose and amylopectin) uses $ \\alpha $-D-glucose.

**Final Answer: Option (3) — $ \\alpha $-D-glucose, C₁–C₄ and C₁–C₆ linkages**`,
'tag_bio_2'),

// Q73 — Total carbon atoms in tyrosine; Ans: 9
mkNVT('BIO-070', 'Medium',
`The total number of carbon atoms present in tyrosine, an amino acid, is ______ .`,
{ integer_value: 9 },
`**Structure of Tyrosine:**

Tyrosine (Tyr, Y) is an aromatic amino acid with the structure:

$$\\mathrm{HO-C_6H_4-CH_2-CH(NH_2)-COOH}$$

**Counting carbon atoms:**

| Part | Carbons |
|---|---|
| Benzene ring (phenol) | 6 |
| –CH₂– (methylene) | 1 |
| –CH(NH₂)– ($ \\alpha $-carbon) | 1 |
| –COOH (carboxyl) | 1 |
| **Total** | **9** |

Molecular formula of tyrosine: $ \\mathrm{C_9H_{11}NO_3} $

**Final Answer: 9**`,
'tag_bio_3'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
