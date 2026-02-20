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

// Q31 — Not true about RNA; Ans: (3)
mkSCQ('BIO-031', 'Medium',
`Which of the following statements is not true about RNA?`,
[
  'It controls the synthesis of protein',
  'It usually does not replicate',
  'It has always double standard $ \\alpha $-helix structure',
  'It is present in the nucleus of the cell',
],
'c',
`**Evaluating statements about RNA:**

**Statement (1): RNA controls the synthesis of protein — True ✓**
mRNA carries the genetic code from DNA to ribosomes; tRNA brings amino acids; rRNA forms ribosomes. Together they control protein synthesis.

**Statement (2): RNA usually does not replicate — True ✓**
Unlike DNA, RNA does not undergo self-replication under normal conditions (except in some RNA viruses using RNA-dependent RNA polymerase).

**Statement (3): RNA has always double-stranded $ \\alpha $-helix structure — FALSE ✗**
RNA is generally **single-stranded**. It does NOT always have a double-stranded $ \\alpha $-helix structure. DNA has the double helix ($ \\beta $-helix, not $ \\alpha $-helix). Some RNA molecules can form local double-stranded regions through intramolecular base pairing (hairpin loops), but this is not universal.

**Statement (4): RNA is present in the nucleus — True ✓**
RNA is synthesized in the nucleus (transcription) and is present there before being transported to the cytoplasm.

**Final Answer: Option (3)**`,
'tag_bio_5'),

// Q32 — Match substances with elements; Ans: (4)
mkSCQ('BIO-032', 'Medium',
`Match List I with List II\n\n**List I (Substances)**\nA. Ziegler catalyst\nB. Blood Pigment\nC. Wilkinson catalyst\nD. Vitamin B₁₂\n\n**List II (Element Present)**\nI. Rhodium\nII. Cobalt\nIII. Iron\nIV. Titanium\n\nChoose the correct answer from the options given below:`,
[
  'A-II, B-IV, C-I, D-III',
  'A-II, B-III, C-IV, D-I',
  'A-III, B-II, C-IV, D-I',
  'A-IV, B-III, C-I, D-II',
],
'd',
`**Identifying the metal in each substance:**

| Substance | Metal | Reasoning |
|---|---|---|
| **Ziegler catalyst** | **Titanium (Ti)** | Ziegler-Natta catalyst = TiCl₄ + Al(C₂H₅)₃; used for polymerization |
| **Blood Pigment (Haemoglobin)** | **Iron (Fe)** | Haemoglobin contains heme group with Fe²⁺ at the centre |
| **Wilkinson catalyst** | **Rhodium (Rh)** | ClRh[P(C₆H₅)₃]₃ — Wilkinson's catalyst for hydrogenation |
| **Vitamin B₁₂ (Cyanocobalamin)** | **Cobalt (Co)** | Vitamin B₁₂ contains cobalt at the centre of a corrin ring |

**Matching:**
- A (Ziegler) → IV (Titanium)
- B (Blood Pigment) → III (Iron)
- C (Wilkinson) → I (Rhodium)
- D (Vitamin B₁₂) → II (Cobalt)

**Final Answer: Option (4) — A-IV, B-III, C-I, D-II**`,
'tag_bio_6'),

// Q33 — Number of vitamins stored in body; Ans: 5
mkNVT('BIO-033', 'Medium',
`From the vitamins $ \\mathrm{A, B_1, B_6, B_{12}, C, D, E} $ and $ \\mathrm{K} $, the number of vitamins that can be stored in our body is ______ .`,
{ integer_value: 5 },
`**Classification of vitamins by solubility:**

| Type | Vitamins | Stored in body? |
|---|---|---|
| **Fat-soluble** | A, D, E, K | **Yes** — stored in liver and adipose tissue |
| **Water-soluble** | B-group (B₁, B₂, B₆, B₁₂, etc.), C | Generally **No** — excreted in urine (except B₁₂) |

**Special case — Vitamin B₁₂:**
Vitamin B₁₂ (cyanocobalamin) is water-soluble but is stored in the liver for several years. It is an exception among water-soluble vitamins.

**From the given list:** A, B₁, B₆, B₁₂, C, D, E, K

**Vitamins stored in body:**
1. Vitamin A (fat-soluble) ✓
2. Vitamin D (fat-soluble) ✓
3. Vitamin E (fat-soluble) ✓
4. Vitamin K (fat-soluble) ✓
5. Vitamin B₁₂ (water-soluble but stored in liver) ✓

**Not stored:** B₁, B₆, C (water-soluble, excreted readily)

**Final Answer: 5**`,
'tag_bio_6'),

// Q34 — Match vitamin with deficiency disease; Ans: (1)
mkSCQ('BIO-034', 'Easy',
`Match List I and List II\n\n**List I (Vitamin)**\nA. Vitamin A\nB. Thiamine\nC. Ascorbic acid\nD. Riboflavin\n\n**List II (Deficiency disease)**\nI. Beri-Beri\nII. Cheilosis\nIII. Xerophthalmia\nIV. Scurvy\n\nChoose the correct answer from the options given below:`,
[
  '$ \\mathrm{A-III, B-I, C-IV, D-II} $',
  '$ \\mathrm{A-IV, B-I, C-III, D-II} $',
  '$ \\mathrm{A-IV, B-II, C-III, D-I} $',
  '$ \\mathrm{A-III, B-II, C-IV, D-I} $',
],
'a',
`**Vitamin–Deficiency disease matching:**

| Vitamin | Chemical name | Deficiency disease |
|---|---|---|
| **Vitamin A** | Retinol | **Xerophthalmia** (night blindness, dry eyes) |
| **Thiamine** | Vitamin B₁ | **Beri-Beri** (nerve and cardiovascular damage) |
| **Ascorbic acid** | Vitamin C | **Scurvy** (bleeding gums, poor wound healing) |
| **Riboflavin** | Vitamin B₂ | **Cheilosis** (cracks at corners of mouth, skin lesions) |

**Matching:**
- A (Vitamin A) → III (Xerophthalmia) ✓
- B (Thiamine) → I (Beri-Beri) ✓
- C (Ascorbic acid) → IV (Scurvy) ✓
- D (Riboflavin) → II (Cheilosis) ✓

**Final Answer: Option (1) — A-III, B-I, C-IV, D-II**`,
'tag_bio_6'),

// Q35 — Water soluble vitamin not excreted easily; Ans: (4) Vitamin B12
mkSCQ('BIO-035', 'Medium',
`Which one of the following is a water soluble vitamin, that is not excreted easily?`,
[
  'Vitamin $ \\mathrm{B_2} $',
  'Vitamin $ \\mathrm{B_1} $',
  'Vitamin $ \\mathrm{B_6} $',
  'Vitamin $ \\mathrm{B_{12}} $',
],
'd',
`**Water-soluble vitamins and excretion:**

All B-group vitamins and Vitamin C are water-soluble. They are generally excreted in urine and not stored in the body.

**Exception — Vitamin B₁₂ (Cyanocobalamin):**

Vitamin B₁₂ is unique among water-soluble vitamins:
- It is stored in the **liver** in significant amounts
- The liver can store enough B₁₂ to last **3–5 years**
- It is NOT easily excreted because it binds to a specific protein (intrinsic factor) for absorption and is recycled in the body
- Deficiency takes years to develop even after stopping dietary intake

**Other B vitamins** (B₁, B₂, B₆) are readily excreted in urine and need regular dietary replenishment.

**Final Answer: Option (4) — Vitamin B₁₂**`,
'tag_bio_6'),

// Q36 — Vitamins stored for longer duration; Ans: (2) Vitamin A and D
mkSCQ('BIO-036', 'Easy',
`Which among the following pairs of Vitamins is stored in our body relatively for longer duration?`,
[
  'Thiamine and Vitamin A',
  'Vitamin A and D',
  'Thiamine and Ascorbic acid',
  'Ascorbic acid and Vitamin D',
],
'b',
`**Fat-soluble vs water-soluble vitamins:**

| Type | Vitamins | Storage |
|---|---|---|
| **Fat-soluble** | **A, D, E, K** | Stored in liver and adipose tissue for **long duration** |
| Water-soluble | B-group, C | Excreted in urine; **not stored** for long |

**Evaluating pairs:**
- Thiamine (B₁) + Vitamin A: Thiamine is water-soluble → not stored long ✗
- **Vitamin A + Vitamin D:** Both are fat-soluble → **stored for longer duration** ✓
- Thiamine + Ascorbic acid (C): Both water-soluble → not stored long ✗
- Ascorbic acid (C) + Vitamin D: C is water-soluble → not stored long ✗

**Final Answer: Option (2) — Vitamin A and D**`,
'tag_bio_6'),

// Q37 — Deficiency of Vitamin K causes; Ans: (1)
mkSCQ('BIO-037', 'Easy',
`Deficiency of vitamin K causes :`,
[
  'Increase in blood clotting time',
  'Increase in fragility of RBCs',
  'Cheilosis',
  'Decrease in blood clotting time',
],
'a',
`**Role of Vitamin K:**

Vitamin K (phylloquinone) is essential for the synthesis of **clotting factors** in the blood (factors II, VII, IX, X — the prothrombin group).

**Deficiency of Vitamin K:**
- Impairs synthesis of clotting factors
- Blood takes **longer to clot** → **increased blood clotting time**
- Can lead to excessive bleeding (haemorrhage)

**Why other options are wrong:**
- Fragility of RBCs: caused by Vitamin E deficiency
- Cheilosis: caused by Vitamin B₂ (Riboflavin) deficiency
- Decrease in clotting time: would mean faster clotting — opposite of what K deficiency causes

**Final Answer: Option (1) — Increase in blood clotting time**`,
'tag_bio_6'),

// Q38 — Match vitamin with deficiency disease (Riboflavin, Thiamine, Pyridoxine, Ascorbic acid); Ans: (3)
mkSCQ('BIO-038', 'Medium',
`Match the following:\n\n| | Vitamin | | Deficiency disease |\n|---|---|---|---|\n| (i) | Riboflavin | (a) | Beriberi |\n| (ii) | Thiamine | (b) | Scurvy |\n| (iii) | Pyridoxine | (c) | Cheilosis |\n| (iv) | Ascorbic acid | (d) | Convulsions |`,
[
  '(i) - (a), (ii) - (d), (iii) - (c), (iv) - (b)',
  '(i) - (c), (ii) - (d), (iii) - (a), (iv) - (b)',
  '(i) - (c), (ii) - (a), (iii) - (d), (iv) - (b)',
  '(i) - (d), (ii) - (b), (iii) - (a), (iv) - (c)',
],
'c',
`**Vitamin–Deficiency disease matching:**

| Vitamin | Also known as | Deficiency disease |
|---|---|---|
| **Riboflavin** | Vitamin B₂ | **Cheilosis** (cracking at corners of mouth, skin lesions) |
| **Thiamine** | Vitamin B₁ | **Beriberi** (nerve damage, cardiovascular problems) |
| **Pyridoxine** | Vitamin B₆ | **Convulsions** (seizures, neurological symptoms) |
| **Ascorbic acid** | Vitamin C | **Scurvy** (bleeding gums, poor wound healing) |

**Matching:**
- (i) Riboflavin → (c) Cheilosis ✓
- (ii) Thiamine → (a) Beriberi ✓
- (iii) Pyridoxine → (d) Convulsions ✓
- (iv) Ascorbic acid → (b) Scurvy ✓

**Final Answer: Option (3) — (i)-(c), (ii)-(a), (iii)-(d), (iv)-(b)**`,
'tag_bio_6'),

// Q39 — L-Glucose structure (image-dependent, skip with note) — using Q40 instead
// Q40 — Match isomer types; Ans: (1)
mkSCQ('BIO-039', 'Hard',
`Match List I with List II\n\n| | List-I | | List-II |\n|---|---|---|---|\n| A. | $ \\alpha $-Glucose and $ \\alpha $-Galactose | I. | Functional isomers |\n| B. | $ \\alpha $-Glucose and $ \\beta $-Glucose | II. | Homologous |\n| C. | $ \\alpha $-Glucose and $ \\alpha $-Fructose | III. | Anomers |\n| D. | $ \\alpha $-Glucose and $ \\alpha $-Ribose | IV. | Epimers |\n\nChoose the correct answer from the options given below:`,
[
  'A-IV, B-III, C-I, D-II',
  'A-III, B-IV, C-I, D-II',
  'A-IV, B-III, C-II, D-I',
  'A-III, B-IV, C-II, D-I',
],
'a',
`**Isomer type definitions:**

**Epimers:** Diastereomers that differ in configuration at only ONE chiral centre (other than the anomeric carbon).

**Anomers:** Isomers that differ only at the anomeric carbon (C1 in aldoses, C2 in ketoses). They are a special type of epimer.

**Functional isomers:** Same molecular formula but different functional groups.

**Homologous:** Members of a homologous series — differ by –CH₂– unit.

**Matching:**

| Pair | Relationship | Reasoning |
|---|---|---|
| **A. $ \\alpha $-Glucose & $ \\alpha $-Galactose** | **Epimers (IV)** | Same formula (C₆H₁₂O₆), differ only at C4 configuration |
| **B. $ \\alpha $-Glucose & $ \\beta $-Glucose** | **Anomers (III)** | Differ only at C1 (anomeric carbon) |
| **C. $ \\alpha $-Glucose & $ \\alpha $-Fructose** | **Functional isomers (I)** | Same formula (C₆H₁₂O₆), glucose is aldohexose, fructose is ketohexose |
| **D. $ \\alpha $-Glucose & $ \\alpha $-Ribose** | **Homologous (II)** | Glucose (C₆H₁₂O₆) and Ribose (C₅H₁₀O₅) differ by –CH₂O– unit |

**Final Answer: Option (1) — A-IV, B-III, C-I, D-II**`,
'tag_bio_1'),

// Q41 — Which is a reducing sugar (structure-based); Ans: (1) — hemiacetal with free anomeric OH
mkSCQ('BIO-040', 'Hard',
`Which of the following is a reducing sugar?\n\n(1) A cyclic sugar with free anomeric –OH (hemiacetal form)\n(2) A sugar with –OCH₃ at the anomeric carbon (methyl glycoside — acetal form)\n(3) A disaccharide with both anomeric carbons involved in glycosidic linkage\n(4) A sugar with two –OCH₃ groups blocking both anomeric positions`,
[
  'Option with free anomeric –OH (hemiacetal)',
  'Methyl glycoside (anomeric –OCH₃)',
  'Non-reducing disaccharide (both anomeric carbons blocked)',
  'Di-methyl acetal (both anomeric positions blocked)',
],
'a',
`**Reducing sugar definition:**

A reducing sugar has a **free anomeric –OH group** (hemiacetal or hemiketal) that can open to give a free aldehyde or ketone group, which then reduces oxidizing agents (Fehling's, Tollens', Benedict's reagents).

**Key principle:**
- **Hemiacetal (free –OH at anomeric C)** → reducing sugar ✓
- **Acetal (–OR at anomeric C, e.g., methyl glycoside)** → non-reducing sugar ✗
- **Glycosidic bond at anomeric C** → non-reducing (if both anomeric carbons are blocked, as in sucrose)

**Analysis of options:**
- Option (1): Free anomeric –OH → can open to aldehyde → **reducing sugar** ✓
- Option (2): –OCH₃ at anomeric carbon (methyl glycoside/acetal) → cannot open → non-reducing ✗
- Option (3): Both anomeric carbons in glycosidic linkage → non-reducing ✗
- Option (4): Both positions blocked → non-reducing ✗

**Final Answer: Option (1)**`,
'tag_bio_1'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
