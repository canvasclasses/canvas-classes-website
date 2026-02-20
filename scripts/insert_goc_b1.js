const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_goc';

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

// Q1 — Common name of Benzene-1,2-diol; Ans: (1) catechol
mkSCQ('GOC-001', 'Easy',
`Common name of Benzene-1,2-diol is:`,
[
  'catechol',
  'o-cresol',
  'quinol',
  'resorcinol',
],
'a',
`**Benzene-1,2-diol** has two –OH groups at the 1 and 2 positions (ortho) of the benzene ring.

**Common names of dihydroxybenzenes:**

| IUPAC name | Common name | Position |
|---|---|---|
| Benzene-1,2-diol | **Catechol** | ortho (1,2) |
| Benzene-1,3-diol | Resorcinol | meta (1,3) |
| Benzene-1,4-diol | Quinol (Hydroquinone) | para (1,4) |

**o-cresol** = 2-methylphenol (has –CH₃, not –OH at position 2).

**Final Answer: Option (1) — Catechol**`,
'tag_goc_1'),

// Q2 — Total sigma and pi bonds in 2-oxohex-4-ynoic acid; Ans: 18
mkNVT('GOC-002', 'Hard',
`The total number of 'sigma' and 'Pi' bonds in 2-oxohex-4-ynoic acid is ______`,
{ integer_value: 18 },
`**Structure of 2-oxohex-4-ynoic acid:**

$$\\mathrm{HOOC-CO-CH_2-C\\equiv C-CH_3}$$

Full structure: $ \\mathrm{CH_3-C\\equiv C-CH_2-CO-COOH} $

**Counting bonds:**

**Sigma (σ) bonds:**
| Bond | Count |
|---|---|
| C–C single bonds | C1–C2 (triple, 1σ), C2–C3 (1σ), C3–C4 (1σ), C4–C5 (1σ), C5–C6 (1σ) = 5σ |
| C–H bonds | CH₃ (3H) = 3σ, CH₂ (2H) = 2σ → 5σ |
| C=O bonds (each has 1σ) | C5=O and C6=O → 2σ |
| O–H bond | 1σ |
| C–O (in COOH) | 1σ |

Total σ bonds: 5 (C–C) + 5 (C–H) + 2 (C=O σ) + 1 (O–H) + 1 (C–O) = **14σ**

**Pi (π) bonds:**
| Bond | Count |
|---|---|
| C≡C (triple bond) | 2π |
| C=O (ketone) | 1π |
| C=O (carboxyl) | 1π |

Total π bonds: **4π**

**Total = 14σ + 4π = 18**

**Final Answer: 18**`,
'tag_goc_1'),

// Q3 — Correct nomenclature for compound with SMILES C=CCC(O)CC(C=O)C(=O)O; Ans: (2)
mkSCQ('GOC-003', 'Hard',
`The correct nomenclature for the following compound is:\n\n$ \\mathrm{CH_2=CH-CH_2-CH(OH)-CH_2-CH(CHO)-COOH} $`,
[
  '2-formyl-4-hydroxyhept-7-enoic acid',
  '2-formyl-4-hydroxyhept-6-enoic acid',
  '2-carboxy-4-hydroxyhept-7-enal',
  '2-carboxy-4-hydroxyhept-6-enal',
],
'b',
`**Structure:** $ \\mathrm{CH_2=CH-CH_2-CH(OH)-CH_2-CH(CHO)-COOH} $

**IUPAC Naming:**

**Step 1: Identify principal characteristic group (highest priority):**
–COOH (carboxylic acid) > –CHO (aldehyde) > –OH (alcohol)
Principal group = –COOH → suffix "oic acid"

**Step 2: Number the chain:**
The longest chain containing –COOH and –CHO:
C1(COOH)–C2(CHO)–C3–C4(OH)–C5–C6=C7

Chain = 7 carbons → **hept**

**Step 3: Locate substituents:**
- C2: –CHO (formyl group, as prefix since –COOH is principal)
- C4: –OH (hydroxy)
- C6=C7: double bond → **hex-6-ene** (position 6)

**IUPAC name: 2-formyl-4-hydroxyhept-6-enoic acid**

**Final Answer: Option (2)**`,
'tag_goc_1'),

// Q4 — Functional group in sulphonic acids; Ans: (2) –SO₃H
mkSCQ('GOC-004', 'Easy',
`Functional group present in sulphonic acids is:`,
[
  '$ \\mathrm{-SO_4H} $',
  '$ \\mathrm{-SO_3H} $',
  'Sulfinyl group $ \\mathrm{-S(=O)-} $',
  '$ \\mathrm{-SO_2} $',
],
'b',
`**Sulphonic acids** are organic compounds containing the functional group **–SO₃H** (sulfonic acid group).

General formula: $ \\mathrm{R-SO_3H} $

Example: Benzenesulphonic acid $ \\mathrm{C_6H_5-SO_3H} $

**Structure of –SO₃H:**
$$\\mathrm{-S(=O)(=O)-OH}$$

This is different from:
- –SO₄H: sulfuric acid ester (not sulphonic acid)
- –SO₂: sulfonyl group (no –OH)
- –S(=O)–: sulfinyl group (only one =O)

**Final Answer: Option (2) — –SO₃H**`,
'tag_goc_1'),

// Q5 — IUPAC names of compound A and B; Ans: (4) Statement I incorrect, Statement II correct
mkSCQ('GOC-005', 'Medium',
`Given below are two statements:\n\n**Statement I:** IUPAC name of 4-chloro-1,3-dinitrobenzene is correct for the compound with –NO₂ at positions 1,3 and –Cl at position 4.\n\n**Statement II:** IUPAC name of 4-ethyl-2-methylaniline is correct for the compound with –NH₂ at C1, –CH₃ at C2, and –C₂H₅ at C4.\n\nIn the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Both Statement I and Statement II are incorrect.',
  'Both Statement I and Statement II are correct.',
  'Statement I is correct but Statement II is incorrect.',
  'Statement I is incorrect but Statement II is correct.',
],
'd',
`**Evaluating Statement I:**

Compound A: 4-chloro-1,3-dinitrobenzene

The compound shown has –NO₂ at positions 1 and 3, and –Cl at position 4.

In IUPAC nomenclature for benzene derivatives, the principal characteristic group (or substituent given lowest locant) determines numbering. For this compound:
- Numbering should give lowest locants to substituents
- Correct name: **1-chloro-2,4-dinitrobenzene** (Cl at C1, NO₂ at C2 and C4)
- "4-chloro-1,3-dinitrobenzene" is **incorrect** ✗

**Evaluating Statement II:**

Compound B: 4-ethyl-2-methylaniline

Structure: –NH₂ at C1, –CH₃ at C2, –C₂H₅ at C4

In aniline derivatives, –NH₂ gets position 1. Numbering to give lowest locants to other substituents:
- –CH₃ at C2, –C₂H₅ at C4 → **4-ethyl-2-methylaniline** ✓

**Final Answer: Option (4) — Statement I is incorrect but Statement II is correct**`,
'tag_goc_1'),

// Q6 — IUPAC name of CCC(C)C(C)CCC(C)C; Ans: (2) 2,5,6-Trimethyloctane
mkSCQ('GOC-006', 'Medium',
`IUPAC name of the following hydrocarbon (X) is:\n\n$ \\mathrm{CH_3CH_2CH(CH_3)CH(CH_3)CH_2CH_2CH(CH_3)CH_3} $`,
[
  '2-Ethyl-3,6-dimethylheptane',
  '2,5,6-Trimethyloctane',
  '3,4,7-Trimethyloctane',
  '2-Ethyl-2,6-diethylheptane',
],
'b',
`**Structure:** $ \\mathrm{CH_3-CH_2-CH(CH_3)-CH(CH_3)-CH_2-CH_2-CH(CH_3)-CH_3} $

**Step 1: Find the longest chain.**

Numbering from right: C1–C2–C3–C4–C5–C6–C7–C8

The longest continuous chain = **8 carbons** (octane)

**Step 2: Number to give lowest locants to branches.**

From left: CH₃–CH₂–CH(CH₃)–CH(CH₃)–CH₂–CH₂–CH(CH₃)–CH₃
- Position 3: –CH₃ branch
- Position 4: –CH₃ branch  
- Position 7: –CH₃ branch

From right: positions would be 2, 5, 6 → **lower set** ✓

**Substituents:** –CH₃ at C2, C5, C6 → **2,5,6-trimethyloctane**

**Final Answer: Option (2) — 2,5,6-Trimethyloctane**`,
'tag_goc_1'),

// Q7 — IUPAC name of 1-Ethyl-3,3-dimethylcyclohexane; Ans: (2)
mkSCQ('GOC-007', 'Medium',
`IUPAC name of the following compound (P) is (a cyclohexane ring with an ethyl group and two methyl groups):`,
[
  '1-Ethyl-5,5-dimethylcyclohexane',
  '3-Ethyl-1,1-dimethylcyclohexane',
  '1-Ethyl-3,3-dimethylcyclohexane',
  '1,1-Dimethyl-3-ethylcyclohexane',
],
'b',
`**Naming substituted cyclohexane:**

The compound has a cyclohexane ring with:
- Two –CH₃ groups on the same carbon (gem-dimethyl)
- One –C₂H₅ (ethyl) group on another carbon

**IUPAC rules for cycloalkanes:**
1. Number the ring to give lowest locants to substituents
2. When two methyl groups are on the same carbon, that carbon gets the **lowest possible number**

**Numbering:**
- Carbon bearing two –CH₃ groups = C1 (gem-dimethyl → 1,1-dimethyl)
- Carbon bearing –C₂H₅ = C3 (going around the ring)

**Name: 3-Ethyl-1,1-dimethylcyclohexane**

Note: "1,1-Dimethyl-3-ethylcyclohexane" (option 4) is the same compound but alphabetical order requires ethyl before methyl → **3-ethyl-1,1-dimethylcyclohexane** is correct.

**Final Answer: Option (2) — 3-Ethyl-1,1-dimethylcyclohexane**`,
'tag_goc_1'),

// Q8 — Molecular formula of second homologue of monocarboxylic acids; Ans: (2) C₂H₄O₂ — wait, answer is (2) but let me check
// Answer key: Q8(2). Second homologue of monocarboxylic acids: HCOOH (1st), CH₃COOH (2nd) = C₂H₄O₂
mkSCQ('GOC-008', 'Easy',
`The molecular formula of second homologue in the homologous series of mono carboxylic acids is:`,
[
  '$ \\mathrm{C_3H_6O_2} $',
  '$ \\mathrm{C_2H_4O_2} $',
  '$ \\mathrm{CH_2O} $',
  '$ \\mathrm{C_2H_2O_2} $',
],
'b',
`**Homologous series of monocarboxylic acids (general formula $ \\mathrm{C_nH_{2n}O_2} $):**

| Homologue | Name | Formula |
|---|---|---|
| 1st | Formic acid (HCOOH) | $ \\mathrm{CH_2O_2} $ |
| **2nd** | **Acetic acid (CH₃COOH)** | **$ \\mathrm{C_2H_4O_2} $** |
| 3rd | Propionic acid (C₂H₅COOH) | $ \\mathrm{C_3H_6O_2} $ |

Each successive member differs by –CH₂– (14 mass units).

**Second homologue = Acetic acid = $ \\mathrm{C_2H_4O_2} $**

**Final Answer: Option (2) — $ \\mathrm{C_2H_4O_2} $**`,
'tag_goc_1'),

// Q9 — Number of compounds with sulphur as heteroatom; Ans: (2)
mkNVT('GOC-009', 'Medium',
`Number of compounds among the following which contain sulphur as heteroatom is ______.\n\nFuran, Thiophene, Pyridine, Pyrrole, Cysteine, Tyrosine`,
{ integer_value: 2 },
`**Identifying sulphur-containing compounds:**

| Compound | Heteroatom | Contains S? |
|---|---|---|
| Furan | O (oxygen) | No |
| **Thiophene** | **S (sulphur)** | **Yes** ✓ |
| Pyridine | N (nitrogen) | No |
| Pyrrole | N (nitrogen) | No |
| **Cysteine** | **S (sulphur)** — side chain –CH₂SH | **Yes** ✓ |
| Tyrosine | O (phenolic –OH) | No |

**Compounds with sulphur as heteroatom: Thiophene and Cysteine = 2**

**Final Answer: 2**`,
'tag_goc_2'),

// Q10 — IUPAC name of cyclohex-2-en-1-ol; Ans: (4)
mkSCQ('GOC-010', 'Medium',
`According to IUPAC system, the compound (cyclohexene ring with –OH group) is named as:`,
[
  'Cyclohex-1-en-2-ol',
  '1-Hydroxyhex-2-ene',
  'Cyclohex-1-en-3-ol',
  'Cyclohex-2-en-1-ol',
],
'd',
`**Structure:** A cyclohexene ring with –OH group.

The compound is a cyclohexene ring where the –OH group is on C1 and the double bond is between C2 and C3.

**IUPAC Naming of cyclic alcohols:**

1. The –OH group (principal characteristic group) gets the **lowest locant** → C1
2. Number around the ring to give the double bond the next lowest locant
3. –OH at C1, C=C between C2–C3

**Name: Cyclohex-2-en-1-ol**

- "Cyclohex" = cyclohexane ring
- "2-en" = double bond starting at C2
- "1-ol" = –OH at C1

**Final Answer: Option (4) — Cyclohex-2-en-1-ol**`,
'tag_goc_1'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
