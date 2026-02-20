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

// Q74 — Total essential amino acids from given list; Ans: 4
mkNVT('BIO-071', 'Medium',
`Total number of essential amino acid among the given list of amino acids is ______\n\nArginine, Phenylalanine, Aspartic acid, Cysteine, Histidine, Valine, Proline`,
{ integer_value: 4 },
`**Essential amino acids** are those that cannot be synthesized by the human body and must be obtained from diet.

The 9 essential amino acids (mnemonic: PVT TIM HaLL): Phenylalanine, Valine, Threonine, Tryptophan, Isoleucine, Methionine, Histidine, Arginine (conditionally), Leucine, Lysine.

**Evaluating the given list:**

| Amino acid | Essential? |
|---|---|
| Arginine | **Conditionally essential** ✓ (essential for children/growth) |
| **Phenylalanine** | **Essential** ✓ |
| Aspartic acid | Non-essential ✗ |
| Cysteine | Non-essential (conditionally essential) ✗ |
| **Histidine** | **Essential** ✓ |
| **Valine** | **Essential** ✓ |
| Proline | Non-essential ✗ |

Essential amino acids from the list: **Arginine, Phenylalanine, Histidine, Valine = 4**

**Final Answer: 4**`,
'tag_bio_3'),

// Q75 — Match amino acids with one-letter codes; Ans: (1)
mkSCQ('BIO-072', 'Medium',
`Match List-I with List-II.\n\n| | List-I (Natural Amino acid) | | List-II (One Letter Code) |\n|---|---|---|---|\n| (A) | Arginine | (I) | D |\n| (B) | Aspartic acid | (II) | N |\n| (C) | Asparagine | (III) | A |\n| (D) | Alanine | (IV) | R |\n\nChoose the correct answer from the options given below:`,
[
  'A-IV, B-I, C-II, D-III',
  'A-I, B-II, C-III, D-IV',
  'A-III, B-IV, C-I, D-II',
  'A-II, B-III, C-IV, D-I',
],
'a',
`**One-letter codes for amino acids:**

| Amino acid | One-letter code | Mnemonic |
|---|---|---|
| **Arginine** | **R** | aRginine |
| **Aspartic acid** | **D** | asparDic |
| **Asparagine** | **N** | asparagiNe |
| **Alanine** | **A** | Alanine |

**Matching:**
- A (Arginine) → IV (R) ✓
- B (Aspartic acid) → I (D) ✓
- C (Asparagine) → II (N) ✓
- D (Alanine) → III (A) ✓

**Final Answer: Option (1) — A-IV, B-I, C-II, D-III**`,
'tag_bio_3'),

// Q77 — Match amino acids with one-letter codes (Glu, Gln, Tyr, Trp); Ans: (3)
mkSCQ('BIO-073', 'Medium',
`Match List I with List II\n\n**List I (Natural amino acid)**\n(A) Glutamic acid\n(B) Glutamine\n(C) Tyrosine\n(D) Tryptophan\n\n**List II (One Letter Code)**\n(I) Q\n(II) W\n(III) E\n(IV) Y\n\nChoose the correct answer from the options given below:`,
[
  '(A)-III, B-IV, (C)-I, (D)-II',
  '(A)-IV, B-III, (C)-I, (D)-II',
  '(A)-III, B-I, (C)-IV, (D)-II',
  '(A)-II, B-I, (C)-IV, (D)-III',
],
'c',
`**One-letter codes for amino acids:**

| Amino acid | One-letter code | Memory aid |
|---|---|---|
| **Glutamic acid** | **E** | glutamicE (E for glu**E**) |
| **Glutamine** | **Q** | glutamine has a Q-like amide |
| **Tyrosine** | **Y** | tYrosine |
| **Tryptophan** | **W** | tryptophan — W (double-ring like W shape) |

**Matching:**
- A (Glutamic acid) → III (E) ✓
- B (Glutamine) → I (Q) ✓
- C (Tyrosine) → IV (Y) ✓
- D (Tryptophan) → II (W) ✓

**Final Answer: Option (3) — (A)-III, B-I, (C)-IV, (D)-II**`,
'tag_bio_3'),

// Q78 — Number of cyclic tripeptides from 2 amino acids; Ans: (4) 4
mkSCQ('BIO-074', 'Hard',
`Number of cyclic tripeptides formed with 2 amino acids A and B is:`,
[
  '2',
  '3',
  '5',
  '4',
],
'd',
`**Counting cyclic tripeptides from 2 amino acids A and B:**

In a cyclic tripeptide, 3 amino acid residues form a ring (no free N or C terminus). The sequence is read around the ring.

**Possible compositions:**
1. AAA — only 1 arrangement (all same) → 1 cyclic tripeptide
2. AAB — arrangements: AAB, ABA, BAA — but in a cycle, AAB = ABA = BAA (rotation) → only **1 unique** cyclic tripeptide
3. ABB — similarly → only **1 unique** cyclic tripeptide
4. BBB — only 1 arrangement → 1 cyclic tripeptide

**But wait:** For AAB type, we must also consider stereochemistry. However, the question asks about structural (constitutional) isomers only.

**Counting distinct cyclic tripeptides:**
- AAA: 1
- AAB: 1 (all rotations equivalent in a cycle)
- ABB: 1
- BBB: 1

**Total = 4 cyclic tripeptides**

**Final Answer: Option (4) — 4**`,
'tag_bio_3'),

// Q79 — Peptide linkages in 3G+2L+2V peptide; Ans: 6
mkNVT('BIO-075', 'Medium',
`A short peptide on complete hydrolysis produces 3 moles of glycine (G), two moles of leucine (L) and two moles of valine (V) per mole of peptide. The number of peptide linkages in it are ______ .`,
{ integer_value: 6 },
`**Counting peptide linkages:**

The peptide contains: 3G + 2L + 2V = **7 amino acid residues** total.

**Key relationship:**
For a linear peptide with $ n $ amino acid residues:
$$\\text{Number of peptide bonds} = n - 1$$

$$\\text{Peptide bonds} = 7 - 1 = 6$$

**Reasoning:** Each peptide bond forms between the –COOH of one amino acid and the –NH₂ of the next, releasing water. For 7 amino acids joined in a chain, 6 peptide bonds are formed.

**Final Answer: 6**`,
'tag_bio_4'),

// Q80 — Peptide linkages in Gly-Leu-Asp-His; Ans: 3
mkNVT('BIO-076', 'Easy',
`A peptide synthesized by the reactions of one molecule each of Glycine, Leucine, Aspartic acid and Histidine will have ______ peptide linkages.`,
{ integer_value: 3 },
`**Counting peptide linkages:**

The peptide contains 4 amino acid residues (Glycine + Leucine + Aspartic acid + Histidine).

**Formula:** For $ n $ amino acids in a linear peptide:
$$\\text{Peptide bonds} = n - 1 = 4 - 1 = 3$$

**Verification:** Gly–Leu–Asp–His has 3 peptide bonds:
1. Gly–Leu (between Gly and Leu)
2. Leu–Asp (between Leu and Asp)
3. Asp–His (between Asp and His)

**Final Answer: 3**`,
'tag_bio_4'),

// Q81 — Correct structure of cytosine; Ans: (3)
mkSCQ('BIO-077', 'Medium',
`Which one of the following is correct structure for cytosine?`,
[
  'A methylated pyrimidine with C=O at position 4 (thymine-like)',
  'A pyrimidine with two C=O groups (uracil-like)',
  'A pyrimidine with –NH₂ at position 4 and C=O at position 2',
  'A pyrimidine with –NH₂ at position 4 and C=O at position 4',
],
'c',
`**Structure of cytosine:**

Cytosine is a **pyrimidine base** found in both DNA and RNA.

**Correct structure of cytosine:**
- Pyrimidine ring (6-membered with 2 N atoms)
- **–NH₂ (amino group) at C4**
- **C=O (carbonyl) at C2**
- Double bond between C5 and C6

Molecular formula: $ \\mathrm{C_4H_5N_3O} $

**Distinguishing from other bases:**
| Base | Key features |
|---|---|
| Cytosine | –NH₂ at C4, C=O at C2 |
| Uracil | C=O at C2 and C4 (no –NH₂) |
| Thymine | C=O at C2 and C4, –CH₃ at C5 |

The SMILES $ \\mathrm{Nc1cc[nH]c(=O)n1} $ correctly represents cytosine with –NH₂ at C4 and C=O at C2.

**Final Answer: Option (3)**`,
'tag_bio_5'),

// Q82 — Chiral centres in threonine; Ans: 2
mkNVT('BIO-078', 'Medium',
`The number of chiral centres present in threonine is ______ .`,
{ integer_value: 2 },
`**Structure of Threonine (Thr, T):**

Threonine is an $ \\alpha $-amino acid with the structure:

$$\\mathrm{CH_3-CH(OH)-CH(NH_2)-COOH}$$

**Identifying chiral centres:**

| Carbon | Groups attached | Chiral? |
|---|---|---|
| C1 (–COOH) | =O, –OH, C2 | No (sp² carbon) |
| **C2 ($ \\alpha $-carbon)** | –NH₂, –H, –COOH, –CH(OH)CH₃ | **Yes** ✓ |
| **C3** | –OH, –H, –CH₃, –CH(NH₂)COOH | **Yes** ✓ |
| C4 (–CH₃) | 3H, C3 | No |

Threonine has **2 chiral centres** (C2 and C3), giving 4 possible stereoisomers (2² = 4). The naturally occurring form is L-threonine (2S,3R).

**Final Answer: 2**`,
'tag_bio_3'),

// Q83 — Not an essential amino acid; Ans: (1) Tyrosine
mkSCQ('BIO-079', 'Medium',
`Which of the following is not an essential amino acid?`,
[
  'Tyrosine',
  'Leucine',
  'Valine',
  'Lysine',
],
'a',
`**Essential vs non-essential amino acids:**

Essential amino acids cannot be synthesized by the human body and must be obtained from diet.

| Amino acid | Essential? |
|---|---|
| **Tyrosine** | **Non-essential** (can be synthesized from phenylalanine) |
| Leucine | Essential ✓ |
| Valine | Essential ✓ |
| Lysine | Essential ✓ |

**Tyrosine** is classified as a **conditionally non-essential** amino acid — it can be biosynthesized from the essential amino acid phenylalanine (by phenylalanine hydroxylase). Therefore, it is NOT independently essential.

The 9 essential amino acids: His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val.

**Final Answer: Option (1) — Tyrosine**`,
'tag_bio_3'),

// Q84 — Correct match between compound and reagent; Ans: (2)
mkSCQ('BIO-080', 'Hard',
`The correct match between item I and item II is\n\n**Item I (Compound)**\na. Lysine\nb. Furfural\nc. Benzyl alcohol\nd. Styrene\n\n**Item II (Reagent)**\np. 1-naphthol\nq. Ninhydrin\nr. $ \\mathrm{KMnO_4} $\ns. Ceric ammonium nitrate`,
[
  '$ \\mathrm{a \\to q,\\ b \\to r,\\ c \\to s,\\ d \\to p} $',
  '$ \\mathrm{a \\to q,\\ b \\to p,\\ c \\to s,\\ d \\to r} $',
  '$ \\mathrm{a \\to r,\\ b \\to p,\\ c \\to q,\\ d \\to s} $',
  '$ \\mathrm{a \\to q,\\ b \\to p,\\ c \\to r,\\ d \\to s} $',
],
'b',
`**Matching compounds with their identifying reagents:**

| Compound | Identifying reagent | Reasoning |
|---|---|---|
| **Lysine** | **Ninhydrin (q)** | Ninhydrin gives purple (Ruhemann's purple) with $ \\alpha $-amino acids; lysine is an amino acid |
| **Furfural** | **1-naphthol (p)** | Furfural (an aldehyde from pentoses) reacts with 1-naphthol in Molisch's test to give a purple ring; also used in Tollens' test for furfural identification |
| **Benzyl alcohol** | **Ceric ammonium nitrate (s)** | CAN test detects –OH groups (alcohols); benzyl alcohol (C₆H₅CH₂OH) has an –OH group → positive CAN test (orange/red colour) |
| **Styrene** | **KMnO₄ (r)** | Styrene (C₆H₅CH=CH₂) has a C=C double bond; KMnO₄ oxidizes alkenes (decolorizes purple KMnO₄) |

**Matching: a→q, b→p, c→s, d→r**

**Final Answer: Option (2)**`,
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
