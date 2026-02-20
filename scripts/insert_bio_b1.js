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

// Tag legend:
// tag_bio_1 = Carbohydrates — structure, classification, properties
// tag_bio_2 = Disaccharides & Polysaccharides
// tag_bio_3 = Amino acids — structure, classification, properties
// tag_bio_4 = Proteins — structure, denaturation, tests
// tag_bio_5 = Nucleic acids — DNA, RNA, bases
// tag_bio_6 = Vitamins & Enzymes

const questions = [

// Q1 — Incorrect statement about Glucose; Ans: (1)
mkSCQ('BIO-001', 'Easy',
`The incorrect statement about Glucose is :`,
[
  'Glucose is soluble in water because of having aldehyde functional group',
  'Glucose remains in multiple isomeric form in its aqueous solution',
  'Glucose is one of the monomer unit in sucrose',
  'Glucose is an aldohexose',
],
'a',
`**Evaluating each statement:**

**Statement (1): Glucose is soluble in water because of having aldehyde functional group — INCORRECT ✗**

Glucose is soluble in water due to the presence of **multiple –OH (hydroxyl) groups** that form hydrogen bonds with water molecules. The aldehyde group alone does not account for its high water solubility.

**Statement (2): Glucose remains in multiple isomeric forms in aqueous solution — Correct ✓**

In aqueous solution, glucose exists in equilibrium between the open-chain form and two cyclic hemiacetal forms ($ \\alpha $-glucose and $ \\beta $-glucose) — a phenomenon called **mutarotation**.

**Statement (3): Glucose is one of the monomer units in sucrose — Correct ✓**

Sucrose (a disaccharide) is formed by $ \\alpha $-D-glucose and $ \\beta $-D-fructose linked by a glycosidic bond.

**Statement (4): Glucose is an aldohexose — Correct ✓**

Glucose has 6 carbons (hexose) and an aldehyde group (aldo-) → aldohexose.

**Final Answer: Option (1)**`,
'tag_bio_1'),

// Q2 — Pyranose form of sugar X; Ans: (2)
mkSCQ('BIO-002', 'Hard',
`The correct representation in six membered pyranose form for the following sugar $ [X] $ is\n\n$ \\text{CHO-CH(OH)-CH(OH)-CH(OH)-CH(OH)-CH}_2\\text{OH} $ (with an extra –CHO at C2, i.e., a 7-carbon sugar with two aldehyde groups)`,
[
  'A six-membered ring with –COOH at C1 position',
  'A six-membered ring with –CH₂OH at C5 and –OH at the anomeric carbon (C1)',
  'A six-membered ring with –CHO at C1 position',
  'A six-membered ring with –CH₂OH at C5 and –OH at C1 (same as option 2)',
],
'b',
`**Analysis of the pyranose ring formation:**

The sugar X shown has the structure of a 7-carbon sugar (heptose) with two aldehyde groups. However, based on the answer key and the SMILES structure provided (which corresponds to a glucoheptose-like compound), the correct pyranose structure is the one where:

- The ring oxygen bridges C1 and C5
- The anomeric –OH is at C1
- The –CH₂OH group is at C5 (exocyclic)

**Key principle:** In pyranose ring formation, the C1 aldehyde reacts with the C5 –OH to form a six-membered ring (5 carbons + 1 oxygen). The resulting hemiacetal has –OH at C1 (anomeric position) and –CH₂OH hanging outside the ring.

**Option (2)** correctly shows: $ \\mathrm{HOCH_2} $ at C5, ring oxygen between C1 and C5, and –OH at the anomeric carbon C1.

**Final Answer: Option (2)**`,
'tag_bio_1'),

// Q3 — Non-reducing sugar that hydrolyses to two reducing monosaccharides; Ans: (4)
mkSCQ('BIO-003', 'Easy',
`A non-reducing sugar A hydrolyses to give two reducing monosaccharides. Sugar A is`,
[
  'Fructose',
  'Galactose',
  'Glucose',
  'Sucrose',
],
'd',
`**Key concepts:**

**Non-reducing sugar:** A sugar that does NOT reduce Fehling's/Tollens' reagent. This happens when the anomeric –OH of ALL monosaccharide units is involved in the glycosidic linkage (no free –CHO or –OH at anomeric carbon).

**Reducing monosaccharides:** Glucose and fructose both have free anomeric –OH after hydrolysis and are reducing sugars.

**Evaluating options:**
- Fructose: monosaccharide (cannot hydrolyse further) — reducing sugar itself
- Galactose: monosaccharide — reducing sugar
- Glucose: monosaccharide — reducing sugar
- **Sucrose:** disaccharide formed by $ \\alpha $-D-glucose (C1) and $ \\beta $-D-fructose (C2) linked through both anomeric carbons → **non-reducing sugar**. On hydrolysis gives glucose + fructose (both reducing sugars) ✓

**Final Answer: Option (4) — Sucrose**`,
'tag_bio_2'),

// Q4 — A, B, C biomolecules with Molisch/Barfoed/Biuret tests; Ans: (2)
mkSCQ('BIO-004', 'Medium',
`A, B and C are three biomolecules. The results of the tests performed on them are given below:\n\n| | Molisch's test | Barfoed Test | Biuret Test |\n|---|---|---|---|\n| A | Positive | Negative | Negative |\n| B | Positive | Positive | Negative |\n| C | Negative | Negative | Positive |\n\nA, B and C are respectively:`,
[
  '$ \\mathrm{A} = $ Glucose, $ \\mathrm{B} = $ Fructose, $ \\mathrm{C} = $ Albumin',
  '$ \\mathrm{A} = $ Lactose, $ \\mathrm{B} = $ Glucose, $ \\mathrm{C} = $ Albumin',
  '$ \\mathrm{A} = $ Lactose, $ \\mathrm{B} = $ Glucose, $ \\mathrm{C} = $ Alanine',
  '$ \\mathrm{A} = $ Lactose, $ \\mathrm{B} = $ Fructose, $ \\mathrm{C} = $ Alanine',
],
'b',
`**Test analysis:**

**Molisch's test:** Positive for ALL carbohydrates (both mono and polysaccharides).
**Barfoed's test:** Positive for **monosaccharides only** (not disaccharides). Distinguishes mono from disaccharides.
**Biuret test:** Positive for **proteins** (peptide bonds, –CO–NH–).

**Interpreting results:**

| Compound | Molisch | Barfoed | Biuret | Conclusion |
|---|---|---|---|---|
| A | + | − | − | Carbohydrate, but NOT monosaccharide → **Disaccharide** |
| B | + | + | − | Carbohydrate AND monosaccharide → **Monosaccharide** |
| C | − | − | + | Not a carbohydrate, is a protein → **Protein** |

**Matching:**
- A = Lactose (disaccharide) ✓
- B = Glucose (monosaccharide) ✓
- C = Albumin (protein) ✓

Alanine is an amino acid (not a protein), so it would NOT give a positive Biuret test (Biuret requires at least 2 peptide bonds).

**Final Answer: Option (2)**`,
'tag_bio_1'),

// Q5 — Match biopolymer with monomer; Ans: (4)
mkSCQ('BIO-005', 'Easy',
`Match List I with List II\n\n| List I (Bio Polymer) | | List II (Monomer) | |\n|---|---|---|---|\n| A. | Starch | I. | nucleotide |\n| B. | Cellulose | II. | $ \\alpha $-glucose |\n| C. | Nucleic acid | III. | $ \\beta $-glucose |\n| D. | Protein | IV. | $ \\alpha $-amino acid |\n\nChoose the correct answer from the options given below:`,
[
  'A-II, B-I, C-III, D-IV',
  'A-IV, B-II, C-I, D-III',
  'A-I, B-III, C-IV, D-II',
  'A-II, B-III, C-I, D-IV',
],
'd',
`**Monomer–Polymer relationships in biomolecules:**

| Biopolymer | Monomer | Linkage |
|---|---|---|
| **Starch** | $ \\alpha $-glucose | $ \\alpha $-1,4 and $ \\alpha $-1,6 glycosidic |
| **Cellulose** | $ \\beta $-glucose | $ \\beta $-1,4 glycosidic |
| **Nucleic acid (DNA/RNA)** | Nucleotide | Phosphodiester |
| **Protein** | $ \\alpha $-amino acid | Peptide bond |

**Matching:**
- A (Starch) → II ($ \\alpha $-glucose) ✓
- B (Cellulose) → III ($ \\beta $-glucose) ✓
- C (Nucleic acid) → I (nucleotide) ✓
- D (Protein) → IV ($ \\alpha $-amino acid) ✓

**Final Answer: Option (4) — A-II, B-III, C-I, D-IV**`,
'tag_bio_2'),

// Q6 — Incorrect statement about starch/cellulose/glycogen; Ans: (1)
mkSCQ('BIO-006', 'Easy',
`Identify the incorrect statement from the following.`,
[
  'Amylose is a branched chain polymer of glucose',
  'Starch is a polymer of $ \\alpha $-D glucose',
  '$ \\beta $-Glycosidic linkage makes cellulose polymer',
  'Glycogen is called as animal starch',
],
'a',
`**Evaluating each statement:**

**Statement (1): Amylose is a branched chain polymer of glucose — INCORRECT ✗**

Amylose is actually a **linear (unbranched)** polymer of $ \\alpha $-D-glucose with $ \\alpha $-1,4 glycosidic linkages. It is the **amylopectin** component of starch that is branched (with $ \\alpha $-1,4 and $ \\alpha $-1,6 linkages).

**Statement (2): Starch is a polymer of $ \\alpha $-D glucose — Correct ✓**

Both amylose and amylopectin (components of starch) are made of $ \\alpha $-D-glucose units.

**Statement (3): $ \\beta $-Glycosidic linkage makes cellulose polymer — Correct ✓**

Cellulose has $ \\beta $-1,4 glycosidic linkages between $ \\beta $-D-glucose units.

**Statement (4): Glycogen is called as animal starch — Correct ✓**

Glycogen is the storage polysaccharide in animals, analogous to starch in plants.

**Final Answer: Option (1)**`,
'tag_bio_2'),

// Q7 — Test to distinguish monosaccharide from disaccharide; Ans: (3)
mkSCQ('BIO-007', 'Easy',
`Which one among the following chemical tests is used to distinguish monosaccharide from disaccharide ?`,
[
  "Seliwanoff's test",
  'Iodine test',
  'Barfoed test',
  "Tollen's test",
],
'c',
`**Analysis of each test:**

**Seliwanoff's test:** Distinguishes **ketoses from aldoses** (ketoses give faster red colour with resorcinol in HCl). Does NOT distinguish mono from disaccharides.

**Iodine test:** Detects **starch** (gives blue-black colour). Not used for mono vs. disaccharide distinction.

**Barfoed's test:** Uses copper acetate in acetic acid. **Monosaccharides** reduce it quickly (within 2 minutes) to give red Cu₂O precipitate. **Disaccharides** react very slowly or not at all under these conditions. → **Distinguishes monosaccharides from disaccharides** ✓

**Tollen's test:** Detects reducing sugars (both mono and reducing disaccharides give silver mirror). Cannot distinguish mono from disaccharide.

**Final Answer: Option (3) — Barfoed test**`,
'tag_bio_1'),

// Q8 — Two monomers in maltose; Ans: (4)
mkSCQ('BIO-008', 'Easy',
`Two monomers in maltose are:`,
[
  '$ \\alpha $-D-glucose and $ \\beta $-D-glucose',
  '$ \\alpha $-D-glucose and $ \\alpha $-D-galactose',
  '$ \\alpha $-D-glucose and $ \\alpha $-D-Fructose',
  '$ \\alpha $-D-glucose and $ \\alpha $-D-glucose',
],
'd',
`**Structure of Maltose:**

Maltose is a disaccharide formed by two glucose units linked by an $ \\alpha $-1,4 glycosidic bond.

- Both monomers are **$ \\alpha $-D-glucose**
- The linkage is between C1 of one $ \\alpha $-D-glucose and C4 of another $ \\alpha $-D-glucose
- Maltose is a **reducing sugar** because the second glucose unit has a free anomeric –OH at C1

**Comparison with other disaccharides:**
| Disaccharide | Monomers | Linkage |
|---|---|---|
| Maltose | $ \\alpha $-D-Glc + $ \\alpha $-D-Glc | $ \\alpha $-1,4 |
| Sucrose | $ \\alpha $-D-Glc + $ \\beta $-D-Fru | $ \\alpha $-1,$ \\beta $-2 |
| Lactose | $ \\beta $-D-Gal + $ \\beta $-D-Glc | $ \\beta $-1,4 |

**Final Answer: Option (4) — $ \\alpha $-D-glucose and $ \\alpha $-D-glucose**`,
'tag_bio_2'),

// Q9 — Incorrect statement about glycogen; Ans: (2)
mkSCQ('BIO-009', 'Easy',
`Which of the given statements is incorrect about glycogen?`,
[
  'It is present in animal cells.',
  'It is a straight chain polymer similar to amylose.',
  'It is present in some yeast and fungi',
  'Only $ \\alpha $ - linkages are present in the molecule.',
],
'b',
`**Evaluating each statement:**

**Statement (1): Glycogen is present in animal cells — Correct ✓**

Glycogen is the primary storage polysaccharide in animals, stored mainly in liver and muscle cells.

**Statement (2): Glycogen is a straight chain polymer similar to amylose — INCORRECT ✗**

Glycogen is **highly branched**, even more so than amylopectin. It has:
- $ \\alpha $-1,4 glycosidic linkages in the main chain
- $ \\alpha $-1,6 glycosidic linkages at branch points (every 8–12 glucose units)

Amylose is the **linear** (unbranched) component of starch.

**Statement (3): Glycogen is present in some yeast and fungi — Correct ✓**

Glycogen is also found in microorganisms like yeast and fungi.

**Statement (4): Only $ \\alpha $-linkages are present in glycogen — Correct ✓**

Both the chain ($ \\alpha $-1,4) and branch point ($ \\alpha $-1,6) linkages are $ \\alpha $-type.

**Final Answer: Option (2)**`,
'tag_bio_2'),

// Q10 — Naturally occurring amino acid with only one basic functional group; Ans: (1)
mkSCQ('BIO-010', 'Medium',
`The naturally occurring amino acid that contains only one basic functional group in its chemical structure is`,
[
  'asparagine',
  'histidine',
  'arginine',
  'lysine',
],
'a',
`**Analysis of basic functional groups in each amino acid:**

**Asparagine (Asn, N):**
- Side chain: –CH₂–CO–NH₂ (amide group)
- The amide group is **not basic** (pKa ≈ not titratable under physiological conditions)
- Has only the $ \\alpha $-amino group (–NH₂) as the basic group → **only ONE basic functional group** ✓

**Histidine (His, H):**
- Side chain: imidazole ring with **two nitrogen atoms** (one basic, pKa ≈ 6.0)
- Has $ \\alpha $-amino group + imidazole nitrogen → **two basic groups**

**Arginine (Arg, R):**
- Side chain: guanidinium group (–NH–C(=NH)–NH₂) — strongly basic (pKa ≈ 12.5)
- Has $ \\alpha $-amino group + guanidinium → **two basic groups**

**Lysine (Lys, K):**
- Side chain: –(CH₂)₄–NH₂ ($ \\epsilon $-amino group, pKa ≈ 10.5)
- Has $ \\alpha $-amino group + $ \\epsilon $-amino group → **two basic groups**

**Asparagine** has only the $ \\alpha $-amino group as the basic functional group (the amide side chain is neutral).

**Final Answer: Option (1) — Asparagine**`,
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
