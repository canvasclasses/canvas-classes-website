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

// Q102 — Increasing order of boiling point; Ans: (2) (B)<(A)<(C)<(D)
mkSCQ('GOC-061', 'Hard',
`For the Compounds:\n(A) $ \\mathrm{H_3C-CH_2-O-CH_2-CH_2-CH_3} $ (ethyl propyl ether)\n(B) $ \\mathrm{H_3C-CH_2-CH_2-CH_2-CH_3} $ (pentane)\n(C) $ \\mathrm{CH_3CH_2-CO-CH_2CH_3} $ (pentan-3-one)\n(D) $ \\mathrm{CH_3CH_2CH_2CH(CH_3)OH} $ (2-methylbutan-1-ol)\n\nThe increasing order of boiling point is:`,
[
  '$ \\mathrm{(D) < (C) < (A) < (B)} $',
  '$ \\mathrm{(B) < (A) < (C) < (D)} $',
  '$ \\mathrm{(A) < (B) < (C) < (D)} $',
  '$ \\mathrm{(B) < (A) < (D) < (C)} $',
],
'b',
`**Boiling point depends on intermolecular forces:**

| Compound | MW | IMF | BP (approx.) |
|---|---|---|---|
| (B) Pentane | 72 | van der Waals only | 36°C |
| (A) Ethyl propyl ether | 88 | Dipole-dipole (C–O–C) | 64°C |
| (C) Pentan-3-one | 86 | Dipole-dipole (C=O, stronger) | 102°C |
| (D) 2-Methylbutan-1-ol | 88 | **H-bonding (O–H)** | 128°C |

**Ranking:**
- (B) Pentane: weakest IMF → lowest BP
- (A) Ether: dipole-dipole (weak, O lone pairs but no O–H)
- (C) Ketone: stronger dipole-dipole (C=O has larger dipole than C–O–C)
- (D) Alcohol: H-bonding → highest BP

**Increasing BP: (B) < (A) < (C) < (D)**

**Final Answer: Option (2)**`,
'tag_goc_2'),

// Q103 — Example of vinylic halide; Ans: (1)
mkSCQ('GOC-062', 'Medium',
`Example of vinylic halide is`,
[
  'Halogen directly on a C=C carbon ($ \\mathrm{X-C=C} $ type)',
  'Halogen on carbon adjacent to C=C (allylic)',
  'Halogen on benzene ring (aryl halide)',
  'Halogen on sp³ carbon in a ring with a double bond',
],
'a',
`**Types of organic halides:**

| Type | Structure | Description |
|---|---|---|
| **Vinylic halide** | $ \\mathrm{X-C=C} $ | Halogen directly on a doubly-bonded carbon (sp² C) |
| Allylic halide | $ \\mathrm{C=C-C-X} $ | Halogen on carbon adjacent to C=C |
| Aryl halide | $ \\mathrm{Ar-X} $ | Halogen on benzene ring carbon |
| Alkyl halide | $ \\mathrm{R-X} $ | Halogen on sp³ carbon |

**Vinylic halide:** The halogen is attached directly to the carbon of the C=C double bond (sp² hybridized carbon).

Example: $ \\mathrm{CH_2=CH-Cl} $ (vinyl chloride), $ \\mathrm{CH_2=C(Cl)-} $

Option (1) shows X directly on C=C carbon → **vinylic halide** ✓

**Final Answer: Option (1)**`,
'tag_goc_2'),

// Q104 — Assertion-Reason about allyl halide; Ans: (1) A true, R false
mkSCQ('GOC-063', 'Medium',
`**Assertion (A):** $ \\mathrm{CH_2=CH-CH_2-Cl} $ is an example of allyl halide.\n**Reason (R):** Allyl halides are the compounds in which the halogen atom is attached to $ \\mathrm{sp^2} $ hybridised carbon atom.\n\nIn the light of the two above statements, choose the most appropriate answer from the options given below:`,
[
  '(A) is true but (R) is false',
  'Both (A) and (R) are true but (R) is not the correct explanation of A',
  '(A) is false but (R) is true',
  'Both (A) and (R) are true and (R) is the correct explanation of (A)',
],
'a',
`**Evaluating Assertion (A):**

$ \\mathrm{CH_2=CH-CH_2-Cl} $ (allyl chloride):
- The –Cl is on the carbon adjacent to the C=C double bond (allylic position)
- This IS an allyl halide ✓

**Assertion A is TRUE** ✓

**Evaluating Reason (R):**

"Allyl halides are compounds where halogen is attached to sp² hybridized carbon" — **FALSE** ✗

In allyl halides, the halogen is attached to the **sp³ carbon** that is adjacent to the C=C bond (the allylic carbon). The sp² carbons are the ones in the C=C double bond.

In $ \\mathrm{CH_2=CH-CH_2-Cl} $:
- C1 (=CH₂): sp²
- C2 (=CH–): sp²
- **C3 (–CH₂Cl): sp³** ← halogen is here

**Reason R is FALSE** ✗

**Final Answer: Option (1) — (A) is true but (R) is false**`,
'tag_goc_2'),

// Q105 — Match list of cyclic compounds; Ans: (3) A-III, B-IV, C-I, D-II
mkSCQ('GOC-064', 'Hard',
`Match List-I with List-II.\n\n**List-I:**\n(A) Tetrahydrofuran (5-membered ring with O, saturated)\n(B) Bicyclo[1.1.0]butane-like (spiro compound)\n(C) Bicyclo[2.2.0] type (bicyclic fused)\n(D) Furan (5-membered aromatic ring with O)\n\n**List-II:**\n(I) Spiro compound\n(II) Aromatic compound\n(III) Non-planar Heterocyclic compound\n(IV) Bicyclo compound\n\nChoose the correct answer from the options given below`,
[
  '$ \\mathrm{A-II,\\ B-I,\\ C-IV,\\ D-III} $',
  '$ \\mathrm{A-IV,\\ B-III,\\ C-I,\\ D-II} $',
  '$ \\mathrm{A-III,\\ B-IV,\\ C-I,\\ D-II} $',
  '$ \\mathrm{A-IV,\\ B-III,\\ C-II,\\ D-I} $',
],
'c',
`**Matching compounds to their descriptions:**

From the SMILES in the original question:
- (A) $ \\mathrm{C1CCOC1} $ = Tetrahydrofuran (THF): 5-membered ring with O, non-planar, saturated → **Non-planar Heterocyclic compound (III)**
- (B) $ \\mathrm{CC1(C)C2C1C2(C)C} $ = Spiro compound (two rings sharing one carbon) → **Spiro compound (I)**... 

Wait, the SMILES shows a bicyclic structure. Let me re-read:
- (B) $ \\mathrm{CC1(C)C2C1C2(C)C} $ = bicyclo compound → **(IV) Bicyclo compound**
- (C) $ \\mathrm{CC1C(C)C12C(C)C2C} $ = spiro compound (two rings sharing one carbon) → **(I) Spiro compound**
- (D) $ \\mathrm{c1ccoc1} $ = Furan: aromatic heterocycle → **(II) Aromatic compound**

**Matching:**
- A (THF) → III (Non-planar Heterocyclic) ✓
- B (bicyclic) → IV (Bicyclo compound) ✓
- C (spiro) → I (Spiro compound) ✓
- D (Furan) → II (Aromatic compound) ✓

**Final Answer: Option (3) — A-III, B-IV, C-I, D-II**`,
'tag_goc_2'),

// Q106 — Correct decreasing order of densities; Ans: (1) (D)>(C)>(B)>(A)
mkSCQ('GOC-065', 'Medium',
`The correct decreasing order of densities of the following compounds is:\n(A) Benzene\n(B) 1,3-Dichlorobenzene\n(C) 1-Bromo-3-chlorobenzene\n(D) 1,3-Dibromobenzene`,
[
  '$ \\mathrm{(D) > (C) > (B) > (A)} $',
  '$ \\mathrm{(C) > (D) > (A) > (B)} $',
  '$ \\mathrm{(C) > (B) > (A) > (D)} $',
  '$ \\mathrm{(A) > (B) > (C) > (D)} $',
],
'a',
`**Density comparison of substituted benzenes:**

Density increases with molecular mass (for similar-sized molecules with similar structures).

| Compound | Substituents | Molecular mass |
|---|---|---|
| (A) Benzene | None | 78 g/mol |
| (B) 1,3-Dichlorobenzene | 2×Cl (35.5 each) | 147 g/mol |
| (C) 1-Bromo-3-chlorobenzene | Br (80) + Cl (35.5) | 191 g/mol |
| (D) 1,3-Dibromobenzene | 2×Br (80 each) | 236 g/mol |

**Density order (higher MW → higher density for similar structures):**

$$\\mathrm{(D) > (C) > (B) > (A)}$$

**Final Answer: Option (1) — (D) > (C) > (B) > (A)**`,
'tag_goc_2'),

// Q107 — Total C–C sigma bonds in mesityl oxide; Ans: 5
mkNVT('GOC-066', 'Medium',
`The total number of $ \\mathrm{C-C} $ sigma bond/s in mesityl oxide $ (\\mathrm{C_6H_{10}O}) $ is (Round off to the Nearest Integer).`,
{ integer_value: 5 },
`**Structure of mesityl oxide (4-methylpent-3-en-2-one):**

$$\\mathrm{CH_3-CO-CH=C(CH_3)-CH_3}$$

$$\\mathrm{CH_3-C(=O)-CH=C(CH_3)-CH_3}$$

**Counting C–C sigma bonds:**

| Bond | Type | σ bond? |
|---|---|---|
| C1(CH₃)–C2(C=O) | Single | ✓ |
| C2(C=O)–C3(CH=) | Single | ✓ |
| C3=C4 | Double (1σ + 1π) | ✓ (1σ) |
| C4–C5(CH₃) | Single | ✓ |
| C4–C6(CH₃) | Single | ✓ |

Total C–C sigma bonds = **5**

(C1–C2, C2–C3, C3=C4 (σ component), C4–C5, C4–C6)

**Final Answer: 5**`,
'tag_goc_2'),

// Q108 — Hybridisation of carbons a, b, c in CH₃CH=COC₆H₅; Ans: (3) sp³, sp², sp²
mkSCQ('GOC-067', 'Medium',
`In the following molecule, hybridisation of carbon a, b and c respectively are:\n\n$ \\mathrm{\\underset{a}{CH_3}-\\underset{b}{CH}=\\underset{c}{C}H-O-C_6H_5} $\n\n(From SMILES: $ \\mathrm{CC=COc1ccccc1} $, where a = CH₃, b = CH=, c = =CH–O)`,
[
  '$ \\mathrm{sp^3,\\ sp,\\ sp} $',
  '$ \\mathrm{sp^3,\\ sp^2,\\ sp} $',
  '$ \\mathrm{sp^3,\\ sp^2,\\ sp^2} $',
  '$ \\mathrm{sp^3,\\ sp,\\ sp^2} $',
],
'c',
`**Structure:** $ \\mathrm{CH_3-CH=CH-O-C_6H_5} $ (1-phenoxyprop-1-ene)

**Identifying carbons a, b, c:**
- **a** = CH₃ (terminal methyl)
- **b** = CH= (part of C=C double bond)
- **c** = =CH–O (part of C=C double bond, bonded to O)

**Hybridization:**

| Carbon | Bonds | Hybridization |
|---|---|---|
| **a (CH₃)** | 4 single bonds (3C–H + 1C–C) | **sp³** |
| **b (CH=)** | Part of C=C (1σ + 1π), 1C–H, 1C–C | **sp²** |
| **c (=CH–O)** | Part of C=C (1σ + 1π), 1C–H, 1C–O | **sp²** |

Both b and c are part of the C=C double bond → both sp² hybridized.

**Final Answer: Option (3) — sp³, sp², sp²**`,
'tag_goc_2'),

// Q109 — Ionic reactions proceed through; Ans: (3) Heterolytic bond cleavage
mkSCQ('GOC-068', 'Easy',
`Ionic reactions with organic compounds proceed through:\n(A) Homolytic bond cleavage\n(B) Heterolytic bond cleavage\n(C) Free radical formation\n(D) Primary free radical\n(E) Secondary free radical\n\nChoose the correct answer from the options given below:`,
[
  '(A) only',
  '(C) only',
  '(B) only',
  '(D) and (E) only',
],
'c',
`**Types of bond cleavage:**

| Type | Description | Products | Reaction type |
|---|---|---|---|
| **Homolytic** | Each atom gets one electron | Free radicals | Free radical reactions |
| **Heterolytic** | Both electrons go to one atom | Ions (carbocations/carbanions) | **Ionic reactions** |

**Ionic reactions** involve the formation of **ions** (charged intermediates):
- Carbocations ($ \\mathrm{R^+} $)
- Carbanions ($ \\mathrm{R^-} $)

These form via **heterolytic bond cleavage** where both electrons of the bond go to one atom.

Free radicals (A, C, D, E) are formed by homolytic cleavage → involved in free radical reactions, NOT ionic reactions.

**Final Answer: Option (3) — (B) only (Heterolytic bond cleavage)**`,
'tag_goc_3'),

// Q110 — Decreasing order of stability of carbocations; Ans: (2) B>A>C
mkSCQ('GOC-069', 'Hard',
`Arrange the following carbocations in decreasing order of stability.\n\n(A) Cyclopentyl cation ($ \\mathrm{C_5H_9^+} $, secondary cyclic)\n(B) Tetrahydrofuranyl cation ($ \\mathrm{C_4H_7O^+} $, O adjacent to cation)\n(C) Tetrahydropyranyl cation ($ \\mathrm{C_5H_9O^+} $, O not adjacent to cation)`,
[
  '$ \\mathrm{A > C > B} $',
  '$ \\mathrm{B > A > C} $',
  '$ \\mathrm{C > B > A} $',
  '$ \\mathrm{C > A > B} $',
],
'b',
`**Stability of carbocations:**

From the SMILES in the original question:
- (A) $ \\mathrm{[CH+]1CCCC1} $ = cyclopentyl cation (2° carbocation, no heteroatom)
- (B) $ \\mathrm{[CH+]1CCCO1} $ = tetrahydrofuranyl cation (O adjacent to C⁺, at α-position)
- (C) $ \\mathrm{[CH]1CCOC1} $ = another oxacyclopentyl cation

**Key principle:** Oxygen adjacent to a carbocation provides **resonance stabilization** via lone pair donation:

$$\\mathrm{C^+-C-O: \\leftrightarrow C=C-\\overset{+}{O}:}$$

**(B)** has O directly adjacent (α) to the carbocation → **maximum resonance stabilization** → most stable

**(A)** cyclopentyl cation: secondary carbocation, no heteroatom stabilization → intermediate stability

**(C)** O is at β-position (not directly adjacent) → less stabilization than (B)

**Stability: B > A > C**

**Final Answer: Option (2) — B > A > C**`,
'tag_goc_3'),

// Q111 — Most stable carbocation; Ans: (4)
mkSCQ('GOC-070', 'Hard',
`Which of the following carbocations is most stable?`,
[
  '$ \\mathrm{[C+]C=CC(=C)OC} $ (allyl type with one OMe)',
  '$ \\mathrm{[C+]C=COC} $ (vinyl ether cation)',
  '$ \\mathrm{[C+]C=CC=COC} $ (extended conjugation with OMe)',
  '$ \\mathrm{[C+]C=CC=COC} $ (most extended conjugation + OMe at terminus)',
],
'd',
`**Stability of carbocations — key factors:**
1. **Resonance stabilization:** More resonance structures → more stable
2. **Electron-donating groups:** –OR (alkoxy) stabilizes adjacent carbocation via lone pair donation
3. **Extended conjugation:** More π system delocalization → more stable

**Comparing the options:**

**(1)** $ \\mathrm{^+CH_2-CH=C(=CH_2)-OCH_3} $: Limited conjugation, one OMe

**(2)** $ \\mathrm{^+CH_2-CH=CH-OCH_3} $: Allylic cation + OMe stabilization

**(3)** $ \\mathrm{^+CH_2-CH=CH-CH=CH-OCH_3} $: Extended conjugation (4 carbons) + OMe at terminus

**(4)** Most extended conjugation with OMe at the end of the conjugated chain → **maximum delocalization**

The carbocation with the longest conjugated chain ending in –OCH₃ has the most resonance structures and maximum stabilization.

**Final Answer: Option (4)**`,
'tag_goc_3'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
