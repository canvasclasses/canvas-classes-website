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

const questions = [

// Q53 — Hydrolysis of sucrose gives; Ans: (2)
mkSCQ('BIO-051', 'Medium',
`Hydrolysis of sucrose gives:`,
[
  '$ \\alpha $-D-(+)-Glucose and $ \\alpha $-D-(-)-Fructose',
  '$ \\alpha $-D-(+)-Glucose and $ \\beta $-D-(-)-Fructose',
  '$ \\alpha $-D-(-)-Glucose and $ \\beta $-D-(-)-Fructose',
  '$ \\alpha $-D-(-)-Glucose and $ \\alpha $-D-(+)-Fructose',
],
'b',
`**Hydrolysis of sucrose:**

$$\\mathrm{Sucrose + H_2O \\xrightarrow{H^+\\ or\\ invertase} Glucose + Fructose}$$

**Specific forms produced:**

| Product | Form | Optical rotation |
|---|---|---|
| Glucose | $ \\alpha $-D-glucose | (+) dextrorotatory |
| Fructose | $ \\beta $-D-fructose | (−) laevorotatory |

**Key facts:**
- Sucrose itself is dextrorotatory (+66.5°)
- After hydrolysis, the mixture becomes laevorotatory (net rotation is negative) because fructose (−92.4°) has a larger magnitude than glucose (+52.7°)
- This change from (+) to (−) is called **inversion of sucrose** → the product is called **invert sugar**
- The enzyme is **invertase** (sucrase)

**Final Answer: Option (2) — $ \\alpha $-D-(+)-Glucose and $ \\beta $-D-(-)-Fructose**`,
'tag_bio_2'),

// Q54 — Correct statement about gluconic acid; Ans: (3)
mkSCQ('BIO-052', 'Medium',
`Which of the following statements is correct?`,
[
  'Gluconic acid can form cyclic (acetal/hemiacetal) structure',
  'Gluconic acid is a dicarboxylic acid',
  'Gluconic acid is a partial oxidation product of glucose',
  'Gluconic acid is obtained by oxidation of glucose with $ \\mathrm{HNO_3} $',
],
'c',
`**Gluconic acid — properties and preparation:**

Gluconic acid ($ \\mathrm{C_6H_{12}O_7} $) is formed by oxidation of the **aldehyde group (–CHO)** of glucose to a **carboxylic acid (–COOH)**, while the –CH₂OH at C6 remains unchanged.

$$\\mathrm{Glucose \\xrightarrow{Br_2\\ water} Gluconic\\ acid}$$

**Evaluating each statement:**

**(1) Gluconic acid can form cyclic hemiacetal structure — INCORRECT ✗**
Gluconic acid has a –COOH at C1, not –CHO. A carboxylic acid cannot form a hemiacetal. (Glucose can form cyclic hemiacetal because it has –CHO.)

**(2) Gluconic acid is a dicarboxylic acid — INCORRECT ✗**
Gluconic acid has only ONE –COOH group (at C1). The –CH₂OH at C6 is not oxidized. Saccharic acid (glucaric acid) is the dicarboxylic acid.

**(3) Gluconic acid is a partial oxidation product of glucose — CORRECT ✓**
Only the –CHO is oxidized to –COOH. This is partial oxidation (only one end oxidized).

**(4) Gluconic acid is obtained by oxidation with HNO₃ — INCORRECT ✗**
HNO₃ (strong oxidant) oxidizes BOTH –CHO and –CH₂OH → saccharic acid (dicarboxylic acid). Gluconic acid is obtained by mild oxidation with **Br₂ water**.

**Final Answer: Option (3)**`,
'tag_bio_1'),

// Q55 — Not true for glucose; Ans: (2)
mkSCQ('BIO-053', 'Medium',
`Which of the following statement is not true for glucose?`,
[
  'Glucose exists in two crystalline forms $ \\alpha $ and $ \\beta $',
  'Glucose gives Schiff\'s test for aldehyde',
  'Glucose reacts with hydroxylamine to form oxime',
  'The pentaacetate of glucose does not react with hydroxylamine to give oxime',
],
'b',
`**Evaluating statements about glucose:**

**(1) Glucose exists in two crystalline forms $ \\alpha $ and $ \\beta $ — TRUE ✓**
$ \\alpha $-D-glucose (m.p. 146°C) and $ \\beta $-D-glucose (m.p. 150°C) are the two anomeric forms that can be crystallized.

**(2) Glucose gives Schiff's test for aldehyde — FALSE ✗**
Despite having an aldehyde group in its open-chain form, glucose does **NOT** give Schiff's test. This is because in solution, glucose exists predominantly in the cyclic hemiacetal form (>99%), and the free aldehyde concentration is too low to give a positive Schiff's test. This is one of the anomalous properties of glucose.

**(3) Glucose reacts with hydroxylamine to form oxime — TRUE ✓**
The open-chain aldehyde form reacts with NH₂OH to form glucose oxime (–CH=N–OH). This confirms the presence of a carbonyl group.

**(4) Pentaacetate of glucose does not react with hydroxylamine — TRUE ✓**
In glucose pentaacetate, the anomeric –OH is acetylated (acetal form). There is no free –CHO available, so it cannot react with hydroxylamine.

**Final Answer: Option (2) — Glucose gives Schiff's test**`,
'tag_bio_1'),

// Q56 — Sugar that does not give reddish brown precipitate with Fehling's; Ans: (1) Sucrose
mkSCQ('BIO-054', 'Easy',
`Sugar which does not give reddish brown precipitate with Fehling's reagent is:`,
[
  'Sucrose',
  'Lactose',
  'Glucose',
  'Maltose',
],
'a',
`**Fehling's test — reducing sugars:**

Fehling's reagent (Cu²⁺ in alkaline solution) is reduced by reducing sugars to give a **brick-red precipitate of Cu₂O**.

| Sugar | Type | Reducing? | Fehling's test |
|---|---|---|---|
| **Sucrose** | Disaccharide | **Non-reducing** | **Negative** ✓ |
| Lactose | Disaccharide | Reducing (free anomeric –OH on glucose unit) | Positive |
| Glucose | Monosaccharide | Reducing | Positive |
| Maltose | Disaccharide | Reducing (free anomeric –OH on second glucose) | Positive |

**Sucrose is non-reducing** because the glycosidic bond is between C1 of $ \\alpha $-glucose and C2 of $ \\beta $-fructose — both anomeric carbons are involved in the linkage, leaving no free anomeric –OH.

**Final Answer: Option (1) — Sucrose**`,
'tag_bio_2'),

// Q57 — Glycosidic linkage between C1 of alpha-glucose and C2 of beta-fructose; Ans: (2) Sucrose
mkSCQ('BIO-055', 'Easy',
`Glycosidic linkage between $ \\mathrm{C_1} $ of $ \\alpha $-glucose and $ \\mathrm{C_2} $ of $ \\beta $-fructose is found in`,
[
  'Maltose',
  'Sucrose',
  'Lactose',
  'amylose',
],
'b',
`**Glycosidic linkages in disaccharides:**

| Disaccharide | Linkage | Units |
|---|---|---|
| **Sucrose** | **$ \\alpha $-1,$ \\beta $-2 glycosidic bond** | C1 of $ \\alpha $-D-glucose + C2 of $ \\beta $-D-fructose |
| Maltose | $ \\alpha $-1,4 glycosidic bond | C1 of $ \\alpha $-D-glucose + C4 of $ \\alpha $-D-glucose |
| Lactose | $ \\beta $-1,4 glycosidic bond | C1 of $ \\beta $-D-galactose + C4 of $ \\beta $-D-glucose |
| Amylose | $ \\alpha $-1,4 glycosidic bond | $ \\alpha $-D-glucose units |

The linkage between **C1 of $ \\alpha $-glucose and C2 of $ \\beta $-fructose** is the defining feature of **sucrose**. This unique linkage involves both anomeric carbons, making sucrose a non-reducing sugar.

**Final Answer: Option (2) — Sucrose**`,
'tag_bio_2'),

// Q58 — Animal starch; Ans: (3) glycogen
mkSCQ('BIO-056', 'Easy',
`Animal starch is the other name of`,
[
  'amylose',
  'maltose',
  'glycogen',
  'amylopectin',
],
'c',
`**Storage polysaccharides:**

| Polysaccharide | Found in | Structure |
|---|---|---|
| Starch (amylose + amylopectin) | Plants | $ \\alpha $-D-glucose, $ \\alpha $-1,4 and $ \\alpha $-1,6 linkages |
| **Glycogen** | **Animals** (liver, muscles) | Highly branched, $ \\alpha $-1,4 and $ \\alpha $-1,6 linkages |

**Glycogen** is called **"animal starch"** because:
- It serves the same energy storage function in animals as starch does in plants
- Both are polymers of $ \\alpha $-D-glucose
- Glycogen is more highly branched than amylopectin (branches every 8–12 glucose units vs. every 24–30 in amylopectin)

**Final Answer: Option (3) — glycogen**`,
'tag_bio_2'),

// Q59 — Statements about maltose; Ans: (3)
mkSCQ('BIO-057', 'Medium',
`Given below are two statements.\nStatement I: Maltose has two $ \\alpha $-D-glucose units linked at $ \\mathrm{C_1} $ and $ \\mathrm{C_4} $ and is a reducing sugar.\nStatement II: Maltose has two monosaccharides: $ \\alpha $-D-glucose and $ \\beta $-D-glucose linked at $ \\mathrm{C_1} $ and $ \\mathrm{C_6} $ and it is a non-reducing sugar.\nIn the light of the above statements, choose the correct answer from the options given below.`,
[
  'Both Statement I and Statement II are true.',
  'Both Statement I and Statement II are false.',
  'Statement I is true but Statement II is false.',
  'Statement I is false but Statement II is true.',
],
'c',
`**Evaluating statements about maltose:**

**Statement I: Maltose has two $ \\alpha $-D-glucose units linked at C₁ and C₄ and is a reducing sugar — TRUE ✓**

- Maltose = $ \\alpha $-D-glucose + $ \\alpha $-D-glucose
- Linkage: $ \\alpha $-1,4 glycosidic bond (C1 of first glucose to C4 of second glucose)
- The second glucose unit has a **free anomeric –OH at C1** → maltose is a **reducing sugar** ✓

**Statement II: Maltose has $ \\alpha $-D-glucose and $ \\beta $-D-glucose linked at C₁ and C₆, and is non-reducing — FALSE ✗**

Multiple errors:
- Both units are $ \\alpha $-D-glucose (not $ \\alpha $ + $ \\beta $)
- Linkage is at C1–C4, not C1–C6
- Maltose IS a reducing sugar (not non-reducing)

**Final Answer: Option (3) — Statement I is true but Statement II is false**`,
'tag_bio_2'),

// Q60 — Assertion-Reason about sucrose; Ans: (2)
mkSCQ('BIO-058', 'Medium',
`Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R).\nAssertion (A): Sucrose is a disaccharide and a non-reducing sugar.\nReason (R): Sucrose involves glycosidic linkage between $ \\mathrm{C_1} $ of $ \\beta $-glucose and $ \\mathrm{C_2} $ of $ \\alpha $-fructose.\nChoose the most appropriate answer from the options given below:`,
[
  'Both (A) and (R) are true and (R) is the true explanation of (A).',
  '(A) is true but (R) is false.',
  '(A) is false but (R) is true.',
  'Both (A) and (R) are true but (R) is not the true explanation of (A).',
],
'b',
`**Evaluating Assertion and Reason:**

**Assertion (A): Sucrose is a disaccharide and a non-reducing sugar — TRUE ✓**

Sucrose is indeed a disaccharide. It is non-reducing because both anomeric carbons (C1 of glucose and C2 of fructose) are involved in the glycosidic bond, leaving no free anomeric –OH.

**Reason (R): Sucrose involves glycosidic linkage between C₁ of $ \\beta $-glucose and C₂ of $ \\alpha $-fructose — FALSE ✗**

The correct description is:
- Linkage between **C₁ of $ \\alpha $-glucose** and **C₂ of $ \\beta $-fructose**
- The Reason incorrectly states $ \\beta $-glucose and $ \\alpha $-fructose (the anomeric forms are swapped)

**Conclusion:** A is true, R is false.

**Final Answer: Option (2) — (A) is true but (R) is false**`,
'tag_bio_2'),

// Q61 — Compound with beta-C1-C4 glycosidic linkage; Ans: (3) Lactose
mkSCQ('BIO-059', 'Medium',
`Which one of the following compounds contains $ \\beta $-$ \\mathrm{C_1} $-$ \\mathrm{C_4} $ glycosidic linkage?`,
[
  'Sucrose',
  'Amylose',
  'Lactose',
  'Maltose',
],
'c',
`**Glycosidic linkages in carbohydrates:**

| Compound | Linkage type | Details |
|---|---|---|
| Sucrose | $ \\alpha $-1,$ \\beta $-2 | C1 of $ \\alpha $-glucose + C2 of $ \\beta $-fructose |
| Amylose | $ \\alpha $-1,4 | C1 of $ \\alpha $-glucose + C4 of next $ \\alpha $-glucose |
| **Lactose** | **$ \\beta $-1,4** | **C1 of $ \\beta $-D-galactose + C4 of $ \\beta $-D-glucose** |
| Maltose | $ \\alpha $-1,4 | C1 of $ \\alpha $-glucose + C4 of $ \\alpha $-glucose |

**Lactose** has a $ \\beta $-C₁–C₄ glycosidic linkage between galactose and glucose. This $ \\beta $-linkage is also why humans lacking lactase (the enzyme to break this bond) cannot digest lactose (lactose intolerance).

**Final Answer: Option (3) — Lactose**`,
'tag_bio_2'),

// Q62 — Compound A gives D-Galactose and D-Glucose on hydrolysis; Ans: (4) Lactose
mkSCQ('BIO-060', 'Easy',
`Compound A gives D-Galactose and D-Glucose on hydrolysis. The compound A is :`,
[
  'Amylose',
  'Sucrose',
  'Maltose',
  'Lactose',
],
'd',
`**Hydrolysis products of disaccharides:**

| Disaccharide | Hydrolysis products |
|---|---|
| Amylose | D-Glucose only |
| Sucrose | D-Glucose + D-Fructose |
| Maltose | D-Glucose + D-Glucose |
| **Lactose** | **D-Galactose + D-Glucose** |

**Lactose** (milk sugar) is a disaccharide composed of:
- $ \\beta $-D-galactose (linked via C1)
- $ \\beta $-D-glucose (linked via C4)

On acid hydrolysis or enzymatic hydrolysis (by lactase), lactose gives one molecule of D-galactose and one molecule of D-glucose.

**Final Answer: Option (4) — Lactose**`,
'tag_bio_2'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
