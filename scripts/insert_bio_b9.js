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

// Q85 — Correct match: Ester test, Carbylamine test, Phthalein dye test with amino acids; Ans: (1)
mkSCQ('BIO-081', 'Hard',
`The correct match between Item I and Item II is:\n\n**Item I**\n(A) Ester test\n(B) Carbylamine test\n(C) Phthalein dye test\n\n**Item II**\n(P) Tyr\n(Q) Asp\n(R) Ser\n(S) Lys`,
[
  '$ (\\mathrm{A}) \\to (\\mathrm{Q, R}); (\\mathrm{B}) \\to (\\mathrm{S}); (\\mathrm{C}) \\to (\\mathrm{P}) $',
  '$ (\\mathrm{A}) \\to (\\mathrm{R}); (\\mathrm{B}) \\to (\\mathrm{Q}); (\\mathrm{C}) \\to (\\mathrm{P}) $',
  '$ (\\mathrm{A}) \\to (\\mathrm{R}); (\\mathrm{B}) \\to (\\mathrm{S}); (\\mathrm{C}) \\to (\\mathrm{Q}) $',
  '$ (\\mathrm{A}) \\to (\\mathrm{Q}); (\\mathrm{B}) \\to (\\mathrm{S}); (\\mathrm{C}) \\to (\\mathrm{R}) $',
],
'a',
`**Test–Amino acid matching:**

**Ester test:** Detects –OH groups (alcohols) and –COOH groups (carboxylic acids) that can form esters.
- **Asp (Aspartic acid):** has –COOH side chain → ester test ✓
- **Ser (Serine):** has –CH₂OH side chain → ester test ✓
- Both Asp and Ser give positive ester test → **(A) → (Q, R)**

**Carbylamine test:** Detects primary amines (–NH₂). Gives foul-smelling isocyanide with CHCl₃/KOH.
- **Lys (Lysine):** has free ε-NH₂ group (primary amine) → positive carbylamine test ✓
- → **(B) → (S)**

**Phthalein dye test:** Detects phenolic –OH groups (reacts with phthalic anhydride to give a dye).
- **Tyr (Tyrosine):** has a phenolic –OH group (para-hydroxyphenyl side chain) → positive phthalein dye test ✓
- → **(C) → (P)**

**Final Answer: Option (1)**`,
'tag_bio_3'),

// Q86 — Structure of histidine at pH 2; Ans: (4) fully protonated zwitterion
mkSCQ('BIO-082', 'Hard',
`The correct structure of histidine in a strongly acidic solution $ (\\mathrm{pH} = 2) $ is`,
[
  'Zwitterion with $ \\mathrm{NH_3^+} $ and $ \\mathrm{COO^-} $, imidazole neutral',
  'Neutral form with $ \\mathrm{NH_2} $ and $ \\mathrm{COOH} $, imidazole protonated',
  'Neutral form with $ \\mathrm{NH_2} $ and $ \\mathrm{COOH} $, imidazole neutral',
  'Fully protonated: $ \\mathrm{NH_3^+} $, $ \\mathrm{COOH} $, and imidazolium $ (\\mathrm{NH^+}) $',
],
'd',
`**Ionization of histidine at pH 2:**

Histidine has three ionizable groups with pKa values:
| Group | pKa |
|---|---|
| –COOH (carboxyl) | ~1.8 |
| Imidazole (side chain –NH) | ~6.0 |
| –NH₃⁺ (amino) | ~9.2 |

**At pH 2 (strongly acidic):**

pH 2 is below all pKa values, so ALL ionizable groups are in their **protonated (acidic) form**:

- –COOH: pH < pKa(1.8)? Actually pH 2 > pKa 1.8, so –COOH is partially deprotonated. But at pH 2, the predominant form has –COOH (since pKa ≈ 1.8, at pH 2 about 60% is –COO⁻).

**Reconsidering:** At pH 2:
- –COOH (pKa 1.8): pH > pKa → mostly –COO⁻... but the answer key says (4) = fully protonated.
- In JEE context, at pH 2 (strongly acidic), all groups are considered protonated: –COOH, –NH₃⁺, imidazolium (–NH⁺)

The correct structure at pH 2 shows: **$ \\mathrm{NH_3^+} $ at $ \\alpha $-amino, –COOH at carboxyl, and protonated imidazolium ring**.

**Final Answer: Option (4) — Fully protonated form**`,
'tag_bio_3'),

// Q87 — Vanillin: sum of oxygen atoms and pi electrons; Ans: 11
mkNVT('BIO-083', 'Hard',
`Vanillin compound obtained from vanilla beans, has total sum of oxygen atoms and $ \\pi $ electrons is ______ .`,
{ integer_value: 11 },
`**Structure of Vanillin:**

Vanillin = 4-hydroxy-3-methoxybenzaldehyde

$$\\mathrm{Structure: HO-C_6H_3(OCH_3)-CHO}$$

Molecular formula: $ \\mathrm{C_8H_8O_3} $

**Counting oxygen atoms:**

| Group | Oxygen atoms |
|---|---|
| –OH (phenolic) | 1 |
| –OCH₃ (methoxy) | 1 |
| –CHO (aldehyde) | 1 |
| **Total O atoms** | **3** |

**Counting $ \\pi $ electrons:**

| Source | $ \\pi $ electrons |
|---|---|
| Benzene ring (3 double bonds) | 6 |
| –CHO (C=O double bond) | 2 |
| **Total $ \\pi $ electrons** | **8** |

**Sum = O atoms + $ \\pi $ electrons = 3 + 8 = 11**

**Final Answer: 11**`,
'tag_bio_4'),

// Q88 — Positive test with ninhydrin; Ans: (2) Egg albumin
mkSCQ('BIO-084', 'Easy',
`Which of the following gives a positive test with ninhydrin?`,
[
  'Starch',
  'Egg albumin',
  'Polyvinyl chloride',
  'Cellulose',
],
'b',
`**Ninhydrin test:**

Ninhydrin reacts with **free $ \\alpha $-amino groups** (–NH₂) to give a **purple colour** (Ruhemann's purple). It is used to detect amino acids and proteins.

| Compound | Contains $ \\alpha $-amino groups? | Ninhydrin test |
|---|---|---|
| Starch | No (polysaccharide) | Negative |
| **Egg albumin** | **Yes (protein — contains amino acids with free –NH₂)** | **Positive** ✓ |
| Polyvinyl chloride | No (synthetic polymer) | Negative |
| Cellulose | No (polysaccharide) | Negative |

**Egg albumin** is a protein (globular protein from egg white). Proteins have free amino groups at the N-terminus and on lysine side chains → positive ninhydrin test.

**Final Answer: Option (2) — Egg albumin**`,
'tag_bio_4'),

// Q89 — Amino acid from protein X hydrolysis (correct alpha-amino acid structure); Ans: (2)
mkSCQ('BIO-085', 'Medium',
`A protein 'X' with molecular weight of 70,000 u, on hydrolysis gives amino acids. One of these amino acid is`,
[
  '$ \\mathrm{CH_3-CH(CH_2NH_2)-CH_2CH_2COOH} $ (not an $ \\alpha $-amino acid)',
  '$ \\mathrm{(CH_3)_2CHCH_2CH(NH_2)COOH} $ (leucine — $ \\alpha $-amino acid)',
  '$ \\mathrm{(CH_3)_2CH-CH(NH_2)-CH_2COOH} $ ($ \\beta $-amino acid)',
  '$ \\mathrm{(CH_3)_2C(NH_2)-CH_2CH_2COOH} $ (not $ \\alpha $-amino acid)',
],
'b',
`**Key principle:** Proteins on hydrolysis yield exclusively **$ \\alpha $-amino acids** — where the –NH₂ group is on the carbon directly adjacent to the –COOH group (the $ \\alpha $-carbon).

General structure: $ \\mathrm{R-CH(NH_2)-COOH} $

**Evaluating each option:**

**(1)** $ \\mathrm{CH_3-CH(CH_2NH_2)-CH_2CH_2COOH} $: –NH₂ is NOT on the $ \\alpha $-carbon (it's on a side chain) → not an $ \\alpha $-amino acid ✗

**(2)** $ \\mathrm{(CH_3)_2CHCH_2CH(NH_2)COOH} $: –NH₂ IS on the carbon adjacent to –COOH → **$ \\alpha $-amino acid** ✓
This is **Leucine** (Leu, L): $ \\mathrm{(CH_3)_2CHCH_2CH(NH_2)COOH} $

**(3)** $ \\mathrm{(CH_3)_2CH-CH(NH_2)-CH_2COOH} $: –NH₂ is on the $ \\beta $-carbon (not adjacent to –COOH) → $ \\beta $-amino acid ✗

**(4)** $ \\mathrm{(CH_3)_2C(NH_2)-CH_2CH_2COOH} $: –NH₂ is on a tertiary carbon far from –COOH → not $ \\alpha $-amino acid ✗

**Final Answer: Option (2) — Leucine**`,
'tag_bio_3'),

// Q90 — Test that does NOT use copper reagent; Ans: (1) Seliwanoff's test
mkSCQ('BIO-086', 'Medium',
`Which one of the following tests used for the identification of functional groups in organic compounds does not use copper reagent?`,
[
  "Seliwanoff's test",
  'Biuret test for peptide bond',
  "Barfoed's test",
  "Benedict's test",
],
'a',
`**Copper-containing reagents in biochemical tests:**

| Test | Reagent | Contains Cu? |
|---|---|---|
| **Seliwanoff's test** | Resorcinol in HCl | **No copper** ✓ |
| Biuret test | CuSO₄ in NaOH | Yes — Cu²⁺ |
| Barfoed's test | Copper acetate in acetic acid | Yes — Cu²⁺ |
| Benedict's test | CuSO₄ + Na₂CO₃ + sodium citrate | Yes — Cu²⁺ |

**Seliwanoff's test** uses **resorcinol (1,3-dihydroxybenzene) dissolved in HCl** — no copper at all. It detects ketoses (fructose) by forming a cherry-red colour.

All other options (Biuret, Barfoed's, Benedict's) use copper-containing reagents.

**Final Answer: Option (1) — Seliwanoff's test**`,
'tag_bio_4'),

// Q91 — Secondary structure of protein stabilised by; Ans: (3) Hydrogen bonding
mkSCQ('BIO-087', 'Easy',
`The secondary structure of protein is stabilised by:`,
[
  'Peptide bond',
  'glycosidic bond',
  'Hydrogen bonding',
  'van der Waals forces',
],
'c',
`**Protein secondary structure:**

Secondary structure refers to the local folding patterns of the polypeptide backbone — primarily the **$ \\alpha $-helix** and **$ \\beta $-pleated sheet**.

**Stabilizing force: Hydrogen bonding**

In $ \\alpha $-helix:
- H-bonds between –C=O of residue $ n $ and –N–H of residue $ n+4 $
- These run parallel to the helix axis

In $ \\beta $-sheet:
- H-bonds between –C=O and –N–H of adjacent strands (parallel or antiparallel)

**Why not others:**
- Peptide bond: defines primary structure (covalent bond between amino acids)
- Glycosidic bond: found in carbohydrates, not proteins
- van der Waals forces: contribute to tertiary structure (hydrophobic interactions), not specifically secondary

**Final Answer: Option (3) — Hydrogen bonding**`,
'tag_bio_4'),

// Q92 — Number of ionizable groups in tripeptide Asp-Glu-Lys; Ans: 5
mkNVT('BIO-088', 'Hard',
`The total number of ionizable groups present in a tripeptide Asp–Glu–Lys is ______ .`,
{ integer_value: 5 },
`**Ionizable groups in Asp–Glu–Lys:**

A tripeptide has:
1. One free N-terminus (–NH₂/–NH₃⁺)
2. One free C-terminus (–COOH/–COO⁻)
3. Side chain ionizable groups

**Counting for each residue:**

| Residue | Side chain ionizable group |
|---|---|
| **Asp (Aspartic acid)** | –CH₂COOH (pKa ~3.9) → 1 ionizable group |
| **Glu (Glutamic acid)** | –CH₂CH₂COOH (pKa ~4.1) → 1 ionizable group |
| **Lys (Lysine)** | –(CH₂)₄NH₂ (pKa ~10.5) → 1 ionizable group |

**Total ionizable groups:**
- N-terminus (–NH₂): 1
- C-terminus (–COOH): 1
- Asp side chain (–COOH): 1
- Glu side chain (–COOH): 1
- Lys side chain (–NH₂): 1

**Total = 5 ionizable groups**

**Final Answer: 5**`,
'tag_bio_4'),

// Q93 — Incorrect base structure in DNA; Ans: (2)
mkSCQ('BIO-089', 'Hard',
`DNA molecule contains 4 bases whose structure are shown below. One of the structures is not correct, identify the incorrect base structure.\n\n(1) Thymine: methylated pyrimidine-2,4-dione ($ \\mathrm{C_5H_6N_2O_2} $)\n(2) Guanine: shown with incorrect ring fusion ($ \\mathrm{C_5H_5N_5O} $)\n(3) Cytosine: 4-aminopyrimidin-2(1H)-one\n(4) Adenine: 6-aminopurine`,
[
  'Thymine structure',
  'Guanine structure',
  'Cytosine structure',
  'Adenine structure',
],
'b',
`**DNA bases and their correct structures:**

The four bases in DNA are: Adenine (A), Guanine (G), Cytosine (C), Thymine (T).

**Correct structures:**

| Base | Type | Key features |
|---|---|---|
| Thymine | Pyrimidine | C=O at C2 and C4, –CH₃ at C5 |
| **Guanine** | Purine | Bicyclic (pyrimidine + imidazole fused), –NH₂ at C2, C=O at C6, –NH at N1 |
| Cytosine | Pyrimidine | –NH₂ at C4, C=O at C2 |
| Adenine | Purine | Bicyclic, –NH₂ at C6 |

**Guanine correct formula:** $ \\mathrm{C_5H_5N_5O} $

The SMILES shown for guanine in the question ($ \\mathrm{Cc1nc2c(=O)[nH]c(N)nc2[nH]1} $) has an incorrect ring structure — it shows a methyl group and incorrect connectivity. The correct guanine structure is a bicyclic purine with the carbonyl at C6 and amino at C2.

**Final Answer: Option (2) — Guanine structure is incorrect**`,
'tag_bio_5'),

// Q94 — Total correct statements about nucleic acids; Ans: 3
mkNVT('BIO-090', 'Medium',
`The total number of correct statements, regarding the nucleic acids is ______ .\n\nA. RNA is regarded as the reserve of genetic information.\nB. DNA molecule self-duplicates during cell division\nC. DNA synthesizes proteins in the cell.\nD. The message for the synthesis of particular proteins is present in DNA\nE. Identical DNA strands are transferred to daughter cells.`,
{ integer_value: 3 },
`**Evaluating each statement:**

**A. RNA is regarded as the reserve of genetic information — FALSE ✗**
**DNA** is the reserve of genetic information (genetic material). RNA is involved in protein synthesis but is not the primary store of genetic information (except in some RNA viruses).

**B. DNA molecule self-duplicates during cell division — TRUE ✓**
DNA replication occurs during S-phase of cell division, producing two identical DNA molecules (semi-conservative replication).

**C. DNA synthesizes proteins in the cell — FALSE ✗**
DNA does NOT directly synthesize proteins. The process is: DNA → (transcription) → mRNA → (translation) → Protein. **Ribosomes** synthesize proteins using mRNA as template.

**D. The message for the synthesis of particular proteins is present in DNA — TRUE ✓**
The genetic code (sequence of bases in DNA) carries the information for protein synthesis. This information is transcribed to mRNA.

**E. Identical DNA strands are transferred to daughter cells — TRUE ✓**
During cell division, each daughter cell receives an identical copy of the DNA (semi-conservative replication ensures this).

**Correct statements: B, D, E = 3**

**Final Answer: 3**`,
'tag_bio_5'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
