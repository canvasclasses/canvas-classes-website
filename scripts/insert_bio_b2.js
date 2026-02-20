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

// Q11 — Most basic amino acid; Ans: (1) Lysine
mkSCQ('BIO-011', 'Medium',
`Among the following compounds most basic amino acid is:`,
[
  'Lysine',
  'Asparagine',
  'Serine',
  'Histidine',
],
'a',
`**Basicity of amino acids depends on the number and pKa of basic groups:**

| Amino acid | Basic groups | pKa of side chain |
|---|---|---|
| **Lysine (Lys)** | $ \\alpha $-NH₂ + $ \\epsilon $-NH₂ | ~10.5 |
| Asparagine (Asn) | $ \\alpha $-NH₂ only (amide is non-basic) | — |
| Serine (Ser) | $ \\alpha $-NH₂ only (–OH is non-basic) | — |
| Histidine (His) | $ \\alpha $-NH₂ + imidazole | ~6.0 |

**Reasoning:**
- Lysine has two amino groups: the $ \\alpha $-amino group and the $ \\epsilon $-amino group on the side chain (pKa ≈ 10.5)
- Histidine has an imidazole ring but its pKa (~6.0) is lower than lysine's $ \\epsilon $-NH₂ (~10.5)
- Asparagine and Serine have only one basic group (the $ \\alpha $-NH₂)

**Lysine is the most basic** among these four options due to its high-pKa $ \\epsilon $-amino group.

*(Note: Arginine is the most basic amino acid overall with pKa ~12.5, but it is not among the options.)*

**Final Answer: Option (1) — Lysine**`,
'tag_bio_3'),

// Q12 — Coagulation of egg on heating; Ans: (2)
mkSCQ('BIO-012', 'Easy',
`Coagulation of egg, on heating is because of :`,
[
  'The secondary structure of protein remains unchanged',
  'Denaturation of protein occurs',
  'Biological property of protein remains unchanged',
  'Breaking of the peptide linkage in the primary structure of protein occurs',
],
'b',
`**Denaturation of proteins:**

When an egg is heated, the proteins (mainly albumin) undergo **denaturation** — a process in which the secondary, tertiary, and quaternary structures are disrupted while the primary structure (sequence of amino acids connected by peptide bonds) remains intact.

**What happens during denaturation:**
- Hydrogen bonds stabilizing $ \\alpha $-helix and $ \\beta $-sheet structures break
- Disulfide bonds and hydrophobic interactions are disrupted
- The protein unfolds and loses its native 3D shape
- The protein loses its biological activity
- The process is often **irreversible** (as in cooking an egg)

**Why other options are wrong:**
- (1) Secondary structure is DISRUPTED, not unchanged
- (3) Biological property is LOST during denaturation
- (4) Peptide bonds in the primary structure are NOT broken during denaturation

**Final Answer: Option (2) — Denaturation of protein occurs**`,
'tag_bio_4'),

// Q13 — Which structure remains intact after coagulation; Ans: (1) Primary
mkSCQ('BIO-013', 'Easy',
`Which structure of protein remains intact after coagulation of egg white on boiling?`,
[
  'Primary',
  'Tertiary',
  'Secondary',
  'Quaternary',
],
'a',
`**Protein structure levels and denaturation:**

| Structure | Description | Stabilized by | Affected by denaturation? |
|---|---|---|---|
| **Primary** | Sequence of amino acids | Peptide bonds (covalent) | **NO — remains intact** |
| Secondary | $ \\alpha $-helix, $ \\beta $-sheet | H-bonds | Yes — disrupted |
| Tertiary | 3D folding | H-bonds, disulfide, hydrophobic | Yes — disrupted |
| Quaternary | Multiple subunits | Non-covalent interactions | Yes — disrupted |

**Key principle:** Denaturation disrupts secondary, tertiary, and quaternary structures but does **NOT** break the covalent **peptide bonds** that define the primary structure. The amino acid sequence remains unchanged.

Boiling an egg denatures the egg white proteins (albumin) — the protein unfolds and coagulates, but the peptide backbone is intact.

**Final Answer: Option (1) — Primary**`,
'tag_bio_4'),

// Q14 — Type of amino acids from protein hydrolysis; Ans: (2) alpha
mkSCQ('BIO-014', 'Easy',
`Type of amino acids obtained by hydrolysis of proteins is :`,
[
  '$ \\beta $',
  '$ \\alpha $',
  '$ \\delta $',
  '$ \\gamma $',
],
'b',
`**Classification of amino acids by position of amino group:**

Amino acids are classified based on the position of the –NH₂ group relative to the –COOH group:

- **$ \\alpha $-amino acids:** –NH₂ on the carbon adjacent to –COOH (C2)
- $ \\beta $-amino acids: –NH₂ on C3
- $ \\gamma $-amino acids: –NH₂ on C4
- $ \\delta $-amino acids: –NH₂ on C5

**All 20 naturally occurring amino acids** that make up proteins are **$ \\alpha $-amino acids** — the amino group is on the $ \\alpha $-carbon (the carbon directly bonded to the carboxyl group).

General structure: $ \\mathrm{H_2N-CH(R)-COOH} $

When proteins are hydrolyzed (by acid, base, or enzymes), they yield exclusively $ \\alpha $-amino acids.

**Final Answer: Option (2) — $ \\alpha $**`,
'tag_bio_3'),

// Q15 — Number of tripeptides from 3 different amino acids; Ans: 6
mkNVT('BIO-015', 'Medium',
`The number of tripeptides formed by three different amino acids using each amino acid once is ______ .`,
{ integer_value: 6 },
`**Counting tripeptide sequences:**

Given 3 different amino acids: A, B, C — each used exactly once in a tripeptide.

The number of arrangements = number of permutations of 3 distinct objects = $ 3! $

$$3! = 3 \\times 2 \\times 1 = 6$$

**All possible sequences:**
1. A–B–C
2. A–C–B
3. B–A–C
4. B–C–A
5. C–A–B
6. C–B–A

Each sequence is a different tripeptide because the N-terminus and C-terminus are distinct ends, so order matters.

**Final Answer: 6**`,
'tag_bio_4'),

// Q16 — Does not stabilize 2° and 3° protein structures; Ans: (3) -O-O-linkage
mkSCQ('BIO-016', 'Medium',
`The one that does not stabilize $ 2^{\\circ} $ and $ 3^{\\circ} $ structures of proteins is`,
[
  '-S-S-linkage',
  'H-bonding',
  '-O-O-linkage',
  'van der Waals forces',
],
'c',
`**Forces stabilizing protein secondary and tertiary structures:**

| Interaction | Stabilizes 2° | Stabilizes 3° |
|---|---|---|
| **H-bonding** | ✓ ($ \\alpha $-helix, $ \\beta $-sheet) | ✓ |
| **–S–S– (disulfide) linkage** | — | ✓ (covalent cross-links in tertiary) |
| **van der Waals forces** | — | ✓ (hydrophobic interactions) |
| **–O–O– (peroxide) linkage** | ✗ | ✗ |

**–O–O– (peroxide) linkage** does NOT exist in proteins. Proteins contain:
- –S–S– bonds (from cysteine residues)
- –NH–CO– (peptide bonds, primary structure)
- Hydrogen bonds, ionic interactions, hydrophobic interactions

There is no –O–O– linkage in protein structure. This is a fictitious option.

**Final Answer: Option (3) — -O-O-linkage**`,
'tag_bio_4'),

// Q17 — Match tests with functional groups; Ans: (3)
mkSCQ('BIO-017', 'Medium',
`Match List I and List II\n\n**List I (Test)**\n(A) Molisch's Test\n(B) Biuret Test\n(C) Carbylamine Test\n(D) Schiff's Test\n\n**List II (Functional group / Class of Compound)**\n(I) Peptide\n(II) Carbohydrate\n(III) Primary amine\n(IV) Aldehyde\n\nChoose the correct answer from the options given below:`,
[
  '(A) - I, (B) - II, (C) - III, (D) - IV',
  '(A) - III, (B) - IV, (C) - I, (D) - II',
  '(A) - II, (B) - I, (C) - III, (D) - IV',
  '(A) - III, (B) - IV, (C) - II, (D) - I',
],
'c',
`**Test–Compound matching:**

| Test | Detects | Match |
|---|---|---|
| **Molisch's Test** | All carbohydrates (gives purple ring with $ \\alpha $-naphthol in H₂SO₄) | → **(II) Carbohydrate** |
| **Biuret Test** | Peptide bonds (–CO–NH–) in proteins/peptides; gives violet colour with Cu²⁺ in NaOH | → **(I) Peptide** |
| **Carbylamine Test** | Primary amines (gives foul-smelling isocyanide with CHCl₃ + KOH) | → **(III) Primary amine** |
| **Schiff's Test** | Aldehydes (gives pink/magenta colour with Schiff's reagent — decolorized fuchsin) | → **(IV) Aldehyde** |

**Correct matching: A-II, B-I, C-III, D-IV**

**Final Answer: Option (3)**`,
'tag_bio_4'),

// Q18 — Structure intact after denaturation; Ans: (1) Primary
mkSCQ('BIO-018', 'Easy',
`During the denaturation of proteins, which of these structures will remain intact?`,
[
  'Primary',
  'Secondary',
  'Tertiary',
  'Quaternary',
],
'a',
`**Denaturation and protein structure:**

Denaturation is the process by which a protein loses its native conformation due to disruption of non-covalent interactions (and sometimes disulfide bonds) without breaking the peptide bonds.

| Structure | Bond type | Disrupted by denaturation? |
|---|---|---|
| **Primary** | Covalent peptide bonds | **No — remains intact** |
| Secondary | H-bonds | Yes |
| Tertiary | H-bonds, disulfide, hydrophobic, ionic | Yes |
| Quaternary | Non-covalent interactions between subunits | Yes |

The **primary structure** (the amino acid sequence held together by covalent peptide bonds) is NOT affected by denaturation. Only the higher-order 3D structure is disrupted.

**Final Answer: Option (1) — Primary**`,
'tag_bio_4'),

// Q19 — How many give positive Biuret test; Ans: 2
mkNVT('BIO-019', 'Medium',
`How many of the given compounds will give a positive Biuret test?\n\nGlycine, Glycylalanine, Tripeptide, Biuret`,
{ integer_value: 2 },
`**Biuret test principle:**

Biuret test gives a **violet/purple colour** with Cu²⁺ in alkaline solution when there are **at least two peptide bonds** (–CO–NH–) in the molecule.

**Evaluating each compound:**

| Compound | Peptide bonds | Biuret test |
|---|---|---|
| Glycine | 0 (single amino acid) | Negative |
| Glycylalanine | 1 (dipeptide) | Negative (needs ≥ 2) |
| **Tripeptide** | **2** | **Positive ✓** |
| **Biuret** (H₂N–CO–NH–CO–NH₂) | **2 (–CO–NH– groups)** | **Positive ✓** |

**Note:** Biuret itself (the compound) gives a positive Biuret test — that's why the test is named after it. It has two –CO–NH– linkages.

Glycine (amino acid) and Glycylalanine (dipeptide with only 1 peptide bond) do NOT give a positive Biuret test.

**Final Answer: 2** (Tripeptide and Biuret)`,
'tag_bio_4'),

// Q20 — Stability of alpha-helix depends on; Ans: (1) H-bonding
mkSCQ('BIO-020', 'Easy',
`Stability of $ \\alpha $-Helix structure of proteins depends upon`,
[
  'H-bonding interaction',
  'dipolar interaction',
  'van der Waals forces',
  '$ \\pi $-stacking interaction',
],
'a',
`**$ \\alpha $-Helix structure of proteins:**

The $ \\alpha $-helix is a secondary structure of proteins where the polypeptide chain coils into a right-handed helix.

**Stabilization of $ \\alpha $-helix:**

The $ \\alpha $-helix is stabilized primarily by **intramolecular hydrogen bonds** formed between:
- The –NH– group of one amino acid residue
- The –C=O group of the amino acid residue **4 positions ahead** in the chain

$$\\text{–C=O} \\cdots \\text{H–N–}$$

These H-bonds run parallel to the helix axis and are responsible for maintaining the helical conformation.

**Other interactions** (van der Waals, dipolar, $ \\pi $-stacking) play minor roles but are NOT the primary stabilizing force.

**Final Answer: Option (1) — H-bonding interaction**`,
'tag_bio_4'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
