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

const questions = [

// Q11 — Structure of 4-Methylpent-2-enal; Ans: (4) CC(C)C=CC=O
mkSCQ('GOC-011', 'Medium',
`Structure of 4-Methylpent-2-enal is:`,
[
  '$ \\mathrm{CH_2=CH-CH(CH_3)-CH_2-CHO} $ (pent-4-en-2-yl carbaldehyde)',
  '$ \\mathrm{CH_3CH_2C(CH_3)=CH-CHO} $ (3-methylpent-2-enal)',
  '$ \\mathrm{CH_3CH_2CH=C(CH_3)-CHO} $ (2-methylpent-3-enal)',
  '$ \\mathrm{(CH_3)_2CH-CH=CH-CHO} $ (4-methylpent-2-enal)',
],
'd',
`**Parsing 4-Methylpent-2-enal:**

- **Pent**: 5-carbon chain
- **2-en**: double bond between C2 and C3
- **al**: aldehyde (–CHO) at C1
- **4-methyl**: –CH₃ branch at C4

**Building the structure:**

$$\\mathrm{C1(CHO)-C2=C3-C4(CH_3)-C5}$$

$$\\mathrm{OHC-CH=CH-CH(CH_3)-CH_3}$$

Wait — 4-methyl means C4 has a methyl branch. With 5 carbons in main chain:

$$\\mathrm{CHO-CH=CH-CH(CH_3)-CH_3}$$

But C4 already has CH₃ as branch AND CH₃ as C5... Let me re-read:

4-Methylpent-2-enal: 5C chain (pent), –CHO at C1, C=C at C2–C3, –CH₃ at C4.

$$\\mathrm{CHO-CH=CH-\\underset{C4}{CH}(CH_3)-CH_3}$$

This gives: $ \\mathrm{(CH_3)_2CH-CH=CH-CHO} $ (isopropyl group at C4 = 4-methyl means C4 has an extra CH₃)

Actually: C4 in a 5-carbon chain already has C3 and C5 attached. Adding –CH₃ at C4:
$$\\mathrm{CHO-CH=CH-CH(CH_3)-CH_3}$$

This is $ \\mathrm{(CH_3)_2CH-CH=CH-CHO} $ → **(CH₃)₂CH–CH=CH–CHO**

**Final Answer: Option (4)**`,
'tag_goc_1'),

// Q12 — IUPAC name of CC(N)CC#N; Ans: (3) 3-Aminobutanenitrile
mkSCQ('GOC-012', 'Medium',
`IUPAC name of the following compound is:\n\n$ \\mathrm{CH_3-CH(NH_2)-CH_2-CN} $`,
[
  '2-Aminopentanenitrile',
  '2-Aminobutanenitrile',
  '3-Aminobutanenitrile',
  '3-Aminopropanenitrile',
],
'c',
`**Structure:** $ \\mathrm{CH_3-CH(NH_2)-CH_2-C\\equiv N} $

**IUPAC Naming:**

1. **Principal group:** –CN (nitrile) → suffix "nitrile" (C of CN is C1)
2. **Chain length:** C(≡N)–CH₂–CH(NH₂)–CH₃ = **4 carbons** → **butanenitrile**
3. **Numbering:** C1 = CN carbon, C2 = CH₂, C3 = CH(NH₂), C4 = CH₃
4. **Substituent:** –NH₂ at C3 → **3-amino**

**IUPAC name: 3-Aminobutanenitrile**

**Final Answer: Option (3) — 3-Aminobutanenitrile**`,
'tag_goc_1'),

// Q13 — Structure of 2,3-dibromo-1-phenylpentane; Ans: (3)
mkSCQ('GOC-013', 'Medium',
`Identify structure of 2,3-dibromo-1-phenylpentane.`,
[
  '$ \\mathrm{C_6H_5-CH_2-CH(Br)-CH_2-CH(Br)-CH_3} $ (Br at C2 and C4)',
  '$ \\mathrm{C_6H_5-CH_2-CH_2-CH(Br)-CH(Br)-CH_3} $ (Br at C3 and C4)',
  '$ \\mathrm{C_6H_5-CH_2-CH(Br)-CH(Br)-CH_2-CH_3} $ (Br at C2 and C3)',
  '$ \\mathrm{C_6H_5-CH(Br)-CH_2-CH_2-CH(Br)-CH_3} $ (Br at C1 and C4)',
],
'c',
`**Parsing 2,3-dibromo-1-phenylpentane:**

- **Pentane**: 5-carbon chain
- **1-phenyl**: –C₆H₅ at C1
- **2,3-dibromo**: –Br at C2 and C3

**Structure:**

$$\\mathrm{C_6H_5-\\underset{C1}{CH_2}-\\underset{C2}{CH}(Br)-\\underset{C3}{CH}(Br)-\\underset{C4}{CH_2}-\\underset{C5}{CH_3}}$$

This is: $ \\mathrm{C_6H_5CH_2CHBrCHBrCH_2CH_3} $

**Verification:**
- C1: –CH₂– bearing phenyl group ✓
- C2: –CHBr– ✓
- C3: –CHBr– ✓
- C4: –CH₂– ✓
- C5: –CH₃ ✓

**Final Answer: Option (3)**`,
'tag_goc_1'),

// Q14 — IUPAC name of CC(=O)CCC(C)C(=O)O; Ans: (1) 2-Methyl-5-oxohexanoic acid
mkSCQ('GOC-014', 'Medium',
`The correct IUPAC nomenclature for the following compound is:\n\n$ \\mathrm{CH_3-CO-CH_2-CH_2-CH(CH_3)-COOH} $`,
[
  '2-Methyl-5-oxohexanoic acid',
  '2-Formyl-5-methylhexan-6-oic acid',
  '5-Methyl-2-oxohexan-6-oic acid',
  '5-Formyl-2-methylhexanoic acid',
],
'a',
`**Structure:** $ \\mathrm{CH_3-CO-CH_2-CH_2-CH(CH_3)-COOH} $

**IUPAC Naming:**

1. **Principal group:** –COOH → suffix "oic acid" (C1)
2. **Longest chain containing –COOH:**
   C1(COOH)–C2(CH(CH₃))–C3–C4–C5(C=O)–C6(CH₃)
   = **6 carbons** → **hexanoic acid**
3. **Substituents:**
   - C2: –CH₃ → **2-methyl**
   - C5: =O (ketone) → **5-oxo**

**IUPAC name: 2-Methyl-5-oxohexanoic acid**

**Verification:** $ \\mathrm{HOOC-CH(CH_3)-CH_2-CH_2-CO-CH_3} $ ✓

**Final Answer: Option (1) — 2-Methyl-5-oxohexanoic acid**`,
'tag_goc_1'),

// Q15 — IUPAC name of ethylidene chloride; Ans: (3) 1,1-dichloroethane
mkSCQ('GOC-015', 'Easy',
`The IUPAC name of ethylidene chloride is`,
[
  '1-chloroethene',
  '1,2-dichloroethane',
  '1,1-dichloroethane',
  '1-chloroethyne',
],
'c',
`**Ethylidene chloride** is a common name.

**Ethylidene** refers to the group –CH=CH₂ (vinyl) or more specifically, the divalent group =CHCH₃ (ethylidene = CH₃CH=).

**Ethylidene chloride** = CH₃CHCl₂ (both Cl atoms on the same carbon)

**IUPAC name:** $ \\mathrm{CH_3-CHCl_2} $
- 2-carbon chain → ethane
- Two Cl at C1 → 1,1-dichloro

**IUPAC name: 1,1-dichloroethane**

**Note:** 
- Ethylene chloride (1,2-dichloroethane) = CH₂Cl–CH₂Cl (Cl on different carbons)
- Ethylidene chloride (1,1-dichloroethane) = CH₃–CHCl₂ (both Cl on same carbon)

**Final Answer: Option (3) — 1,1-dichloroethane**`,
'tag_goc_1'),

// Q16 — Mesityl oxide common name; Ans: (4) 4-Methylpent-3-en-2-one
mkSCQ('GOC-016', 'Medium',
`Mesityl oxide is a common name of:`,
[
  '2,4-Dimethylpentan-3-one',
  '3-Methylcyclohexanecarbaldehyde',
  '2-Methylcyclohexanone',
  '4-Methylpent-3-en-2-one',
],
'd',
`**Mesityl oxide** is the common name for the compound formed by the aldol condensation of acetone.

**Structure of mesityl oxide:**
$$\\mathrm{(CH_3)_2C=CH-CO-CH_3}$$

$$\\mathrm{CH_3-CO-CH=C(CH_3)_2}$$

**IUPAC name:**
- 6-carbon chain: C1(CH₃)–C2(C=O)–C3(CH=)–C4(C(CH₃)₂)... 

Actually: $ \\mathrm{CH_3-C(=O)-CH=C(CH_3)_2} $

Chain: C1(CH₃)–C2(=O)–C3=C4(CH₃)–C5(CH₃)... wait, that's 5 carbons:
- C1: CH₃
- C2: C=O (ketone)
- C3: CH=
- C4: C(CH₃)= with a branch CH₃

Longest chain: 5C → pent
- Ketone at C2 → pent-2-one
- Double bond at C3 → pent-3-en
- Methyl at C4 → 4-methyl

**IUPAC name: 4-Methylpent-3-en-2-one** ✓

**Final Answer: Option (4) — 4-Methylpent-3-en-2-one**`,
'tag_goc_1'),

// Q17 — IUPAC name of Cc1ccc([N+](=O)[O-])cc1Cl; Ans: (2) 2-chloro-1-methyl-4-nitrobenzene
mkSCQ('GOC-017', 'Hard',
`The correct IUPAC name of the following compound is:\n\n(Benzene ring with –CH₃ at C1, –Cl at C2, –NO₂ at C4)`,
[
  '5-chloro-4-methyl-1-nitrobenzene',
  '2-chloro-1-methyl-4-nitrobenzene',
  '2-methyl-5-nitro-1-chlorobenzene',
  '3-chloro-4-methyl-1-nitrobenzene',
],
'b',
`**Structure:** Benzene ring with –CH₃, –Cl, and –NO₂ substituents.

From the SMILES $ \\mathrm{Cc1ccc([N+](=O)[O-])cc1Cl} $:
- –CH₃ and –Cl are on adjacent carbons (ortho)
- –NO₂ is para to –CH₃

**IUPAC Naming of polysubstituted benzenes:**

When the ring has no principal characteristic group, substituents are listed alphabetically and the lowest locant set is assigned.

Substituents: Cl, CH₃ (methyl), NO₂

Numbering to give lowest locants:
- –CH₃ at C1, –Cl at C2, –NO₂ at C4 → locant set {1,2,4}
- Alternative: –Cl at C1, –CH₃ at C2, –NO₂ at C5 → locant set {1,2,5}

{1,2,4} < {1,2,5} → **2-chloro-1-methyl-4-nitrobenzene** ✓

**Final Answer: Option (2) — 2-chloro-1-methyl-4-nitrobenzene**`,
'tag_goc_1'),

// Q18 — σ and π bonds in ethylene; Ans: (4) 5 and 1
mkSCQ('GOC-018', 'Easy',
`Number of $ \\sigma $ and $ \\pi $ bonds present in ethylene molecule is respectively:`,
[
  '4 and 1',
  '5 and 2',
  '3 and 1',
  '5 and 1',
],
'd',
`**Structure of ethylene ($ \\mathrm{CH_2=CH_2} $):**

$$\\mathrm{H_2C=CH_2}$$

**Counting σ bonds:**
| Bond | Count |
|---|---|
| C–H bonds (4 total) | 4σ |
| C–C bond (part of C=C) | 1σ |
| **Total σ** | **5** |

**Counting π bonds:**
| Bond | Count |
|---|---|
| C=C double bond (1 π component) | 1π |
| **Total π** | **1** |

**In a C=C double bond:** 1σ + 1π

**Final Answer: Option (4) — 5σ and 1π**`,
'tag_goc_2'),

// Q19 — Number of 2° carbon atoms in CH₃-C(CH₃)-CH-C(CH₃)-CH₃; Ans: (3) One
mkSCQ('GOC-019', 'Medium',
`In the given compound, the number of $ 2^\\circ $ carbon atom/s is ______.\n\n$ \\mathrm{CH_3-C(CH_3)_2-CH_2-C(CH_3)_2-CH_3} $`,
[
  'Four',
  'Two',
  'One',
  'Three',
],
'c',
`**Structure:** $ \\mathrm{CH_3-C(CH_3)_2-CH_2-C(CH_3)_2-CH_3} $

**Classification of carbon atoms:**
- **1° carbon:** bonded to only 1 other carbon
- **2° carbon:** bonded to exactly 2 other carbons
- **3° carbon:** bonded to exactly 3 other carbons
- **4° carbon:** bonded to exactly 4 other carbons

**Identifying each carbon:**

| Carbon | Bonds to C | Type |
|---|---|---|
| CH₃ (terminal, ×4) | 1 each | 1° (×4) |
| C(CH₃)₂ (left quaternary) | 4 (2 CH₃ + CH₂ + CH₃ chain) | 4° |
| **CH₂ (middle)** | **2 (left C and right C)** | **2°** |
| C(CH₃)₂ (right quaternary) | 4 | 4° |

**Number of 2° carbons = 1** (only the central –CH₂–)

**Final Answer: Option (3) — One**`,
'tag_goc_2'),

// Q20 — Cyclohexane type; Ans: (4) Alicyclic
mkSCQ('GOC-020', 'Easy',
`Cyclohexane is ______ type of an organic compound.`,
[
  'Benzenoid aromatic',
  'Benzenoid non-aromatic',
  'Acyclic',
  'Alicyclic',
],
'd',
`**Classification of organic compounds:**

| Type | Description | Example |
|---|---|---|
| Acyclic (open chain) | No ring structure | Alkanes, alkenes |
| Alicyclic | Cyclic but NOT aromatic | Cyclohexane, cyclopentane |
| Benzenoid aromatic | Contains benzene ring | Benzene, toluene |
| Heterocyclic | Ring with heteroatom | Pyridine, furan |

**Cyclohexane ($ \\mathrm{C_6H_{12}} $):**
- Has a ring structure → cyclic ✓
- No benzene ring, no aromatic character (not planar, not $ 4n+2 $ π electrons in conjugated system)
- Contains only C and H in a saturated ring

**Cyclohexane is an alicyclic compound.**

**Final Answer: Option (4) — Alicyclic**`,
'tag_goc_2'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
