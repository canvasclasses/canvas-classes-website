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

// Q21 — Structure unaffected by heating; Ans: (3) primary
mkSCQ('BIO-021', 'Easy',
`The structure of protein that is unaffected by heating is :`,
[
  'secondary structure',
  'tertiary structure',
  'primary structure',
  'Quaternary structure',
],
'c',
`**Effect of heating on protein structure:**

Heating disrupts non-covalent interactions that maintain higher-order protein structures:

| Structure | Stabilized by | Effect of heating |
|---|---|---|
| **Primary** | Covalent peptide bonds (–CO–NH–) | **Unaffected** ✓ |
| Secondary | H-bonds ($ \\alpha $-helix, $ \\beta $-sheet) | Disrupted |
| Tertiary | H-bonds, disulfide bonds, hydrophobic, ionic | Disrupted |
| Quaternary | Non-covalent interactions between subunits | Disrupted |

The **primary structure** consists of amino acids linked by covalent peptide bonds. These bonds require much higher energy to break than what normal heating provides. Therefore, the primary structure remains intact during denaturation by heat.

**Final Answer: Option (3) — primary structure**`,
'tag_bio_4'),

// Q22 — NOT an example of fibrous protein; Ans: (2) Albumin
mkSCQ('BIO-022', 'Easy',
`Which of the following is NOT an example of fibrous protein ?`,
[
  'Keratin',
  'Albumin',
  'Myosin',
  'Collagen',
],
'b',
`**Classification of proteins:**

| Type | Characteristics | Examples |
|---|---|---|
| **Fibrous proteins** | Long, thread-like, insoluble in water, structural role | Keratin, Myosin, Collagen, Fibrin |
| **Globular proteins** | Spherical/compact shape, soluble in water, metabolic role | Albumin, Haemoglobin, Insulin, Enzymes |

**Evaluating options:**
- **Keratin:** Fibrous protein — found in hair, nails, wool ✓
- **Albumin:** **Globular protein** — found in egg white (egg albumin) and blood serum; water-soluble ✗ (NOT fibrous)
- **Myosin:** Fibrous protein — found in muscles ✓
- **Collagen:** Fibrous protein — found in connective tissue ✓

**Final Answer: Option (2) — Albumin**`,
'tag_bio_4'),

// Q23 — Water soluble protein; Ans: (2) Albumin
mkSCQ('BIO-023', 'Easy',
`The water soluble protein is:`,
[
  'Fibrin',
  'Albumin',
  'Myosin',
  'Collagen',
],
'b',
`**Solubility of proteins:**

Globular proteins are generally **water-soluble** because their hydrophilic amino acid residues are oriented outward toward the aqueous environment.

Fibrous proteins are generally **water-insoluble** because they form tightly packed structural networks.

| Protein | Type | Solubility |
|---|---|---|
| Fibrin | Fibrous | Insoluble |
| **Albumin** | **Globular** | **Water-soluble** ✓ |
| Myosin | Fibrous | Insoluble |
| Collagen | Fibrous | Insoluble |

**Albumin** (egg albumin / serum albumin) is a classic example of a water-soluble globular protein.

**Final Answer: Option (2) — Albumin**`,
'tag_bio_4'),

// Q24 — Interaction stabilizing alpha-helix; Ans: (3) Hydrogen bonding
mkSCQ('BIO-024', 'Easy',
`Out of the following, which type of interaction is responsible for the stabilisation of $ \\alpha $-helix structure of proteins?`,
[
  'Covalent bonding',
  'Ionic bonding',
  'Hydrogen bonding',
  'van der Waals forces',
],
'c',
`**$ \\alpha $-Helix stabilization:**

The $ \\alpha $-helix is a secondary structure where the polypeptide backbone coils into a right-handed helix. It is stabilized by **intramolecular hydrogen bonds**:

$$\\text{C=O} \\cdots \\text{H–N}$$

- The carbonyl oxygen (C=O) of one peptide bond forms an H-bond with the N–H of the peptide bond **4 residues ahead** in the sequence
- These H-bonds run approximately parallel to the helix axis
- Each H-bond has energy ~5 kcal/mol; the cumulative effect of many H-bonds makes the helix very stable

**Why not others:**
- Covalent bonds: too strong; they define primary structure (peptide bonds)
- Ionic bonds: important in tertiary structure, not specifically $ \\alpha $-helix
- van der Waals: too weak to be the primary stabilizing force for $ \\alpha $-helix

**Final Answer: Option (3) — Hydrogen bonding**`,
'tag_bio_4'),

// Q25 — Seliwanoff and Xanthoproteic tests identify; Ans: (2) ketoses, proteins
mkSCQ('BIO-025', 'Medium',
`Seliwanoff test and Xanthoproteic test are used for the identification of ____ and ____ respectively.`,
[
  'aldoses, ketoses',
  'ketoses, proteins',
  'proteins, ketoses',
  'ketoses, aldoses',
],
'b',
`**Test identification:**

**Seliwanoff's test:**
- Reagent: Resorcinol in HCl
- **Detects ketoses** (e.g., fructose)
- Ketoses undergo rapid dehydration to form hydroxymethylfurfural, which reacts with resorcinol to give a **cherry-red colour**
- Aldoses give a faint pink colour only after prolonged heating

**Xanthoproteic test:**
- Reagent: Concentrated HNO₃
- **Detects proteins** (specifically aromatic amino acids — Tyr, Phe, Trp)
- Nitration of aromatic ring gives a yellow colour, which turns orange in alkaline conditions
- Used to identify proteins containing aromatic amino acid residues

**Matching:**
- Seliwanoff test → **ketoses** ✓
- Xanthoproteic test → **proteins** ✓

**Final Answer: Option (2) — ketoses, proteins**`,
'tag_bio_4'),

// Q26 — Peptide giving positive CAN and carbylamine tests; Ans: (4) Ser-Lys
mkSCQ('BIO-026', 'Hard',
`The peptide that gives positive ceric ammonium nitrate and carbylamine tests is:`,
[
  'Gln - Asp',
  'Asp - Gln',
  'Lys - Asp',
  'Ser - Lys',
],
'd',
`**Test requirements:**

**Ceric ammonium nitrate (CAN) test:** Positive for compounds with **–OH group** (alcohols, phenols). Gives red/orange colour.

**Carbylamine test:** Positive for **primary amines** (–NH₂ group). Gives foul-smelling isocyanide with CHCl₃/KOH.

**Analysis of each peptide:**

| Peptide | –OH group? | Primary –NH₂ (free)? | CAN | Carbylamine |
|---|---|---|---|---|
| Gln–Asp | No –OH side chain | No free primary amine (N-terminus blocked by Gln amide) | − | − |
| Asp–Gln | No –OH side chain | N-terminus of Asp has –NH₂ | − | + |
| Lys–Asp | No –OH side chain | N-terminus + Lys ε-NH₂ | − | + |
| **Ser–Lys** | **Ser has –CH₂OH** | **N-terminus + Lys ε-NH₂** | **+** | **+** |

**Ser–Lys:**
- **Serine** has a –CH₂OH side chain → positive CAN test ✓
- **Lysine** has a free ε-NH₂ group (primary amine) → positive carbylamine test ✓

**Final Answer: Option (4) — Ser - Lys**`,
'tag_bio_3'),

// Q27 — Test that cannot identify amino acids; Ans: (3) Barfoed test
mkSCQ('BIO-027', 'Medium',
`Which of the following tests cannot be used for identifying amino acids?`,
[
  'Biuret test',
  'Xanthoproteic test',
  'Barfoed test',
  'Ninhydrin test',
],
'c',
`**Tests for amino acid identification:**

| Test | What it detects | Applicable to amino acids? |
|---|---|---|
| **Biuret test** | Peptide bonds (≥2); also gives colour with $ \\alpha $-amino acids in some conditions | Yes (for proteins/peptides) |
| **Xanthoproteic test** | Aromatic amino acids (Tyr, Phe, Trp) via nitration | Yes — identifies aromatic amino acids |
| **Barfoed test** | Monosaccharides (reducing sugars) — copper acetate in acetic acid | **No — tests for carbohydrates, not amino acids** |
| **Ninhydrin test** | Free $ \\alpha $-amino acids and $ \\alpha $-amino groups — gives purple (Ruhemann's purple) | Yes — universal test for amino acids |

**Barfoed test** is used to distinguish monosaccharides from disaccharides. It has no application in identifying amino acids.

**Final Answer: Option (3) — Barfoed test**`,
'tag_bio_3'),

// Q28 — Two nucleotides joined by; Ans: (1) Phosphodiester linkage
mkSCQ('BIO-028', 'Easy',
`Two nucleotides are joined together by a linkage known as :`,
[
  'Phosphodiester linkage',
  'Glycosidic linkage',
  'Disulphide linkage',
  'Peptide linkage',
],
'a',
`**Structure of nucleic acids:**

A **nucleotide** consists of:
1. A nitrogenous base (purine or pyrimidine)
2. A pentose sugar (ribose in RNA, deoxyribose in DNA)
3. A phosphate group

**Linkage between nucleotides:**

Two nucleotides are connected by a **phosphodiester bond** — formed between:
- The 3'-OH of one nucleotide's sugar
- The 5'-phosphate of the next nucleotide

$$\\text{Sugar}_1\\text{-3'-O-PO}_2^-\\text{-O-5'-Sugar}_2$$

This creates the sugar-phosphate backbone of DNA and RNA.

**Other linkages:**
- Glycosidic linkage: connects base to sugar within a nucleotide
- Disulfide linkage: between cysteine residues in proteins
- Peptide linkage: between amino acids in proteins

**Final Answer: Option (1) — Phosphodiester linkage**`,
'tag_bio_5'),

// Q29 — % of N in uracil; Ans: 25
mkNVT('BIO-029', 'Medium',
`Uracil is a base present in RNA with the following structure (2,4-dioxopyrimidine). The % of N in uracil is ______ .`,
{ integer_value: 25 },
`**Molecular formula of Uracil:**

Uracil structure: 2,4-dioxopyrimidine

$$\\text{Molecular formula: } \\mathrm{C_4H_4N_2O_2}$$

**Molar mass calculation:**

$$M = 4(12) + 4(1) + 2(14) + 2(16)$$
$$M = 48 + 4 + 28 + 32 = 112 \\text{ g/mol}$$

**% of Nitrogen:**

$$\\% N = \\frac{\\text{mass of N}}{\\text{molar mass}} \\times 100 = \\frac{2 \\times 14}{112} \\times 100$$

$$\\% N = \\frac{28}{112} \\times 100 = 25\\%$$

**Final Answer: 25**`,
'tag_bio_5'),

// Q30 — Complementary base of thymine (compound A) in DNA; Ans: (3) Adenine
mkSCQ('BIO-030', 'Easy',
`The compound 'A' (thymine, shown with structure $ \\mathrm{C_5H_6N_2O_2} $, a methylated uracil) is a complementary base of ______ in DNA strands.`,
[
  'Uracil',
  'Guanine',
  'Adenine',
  'Cytosine',
],
'c',
`**Base pairing rules in DNA (Chargaff's rules):**

In DNA double helix, bases pair specifically through hydrogen bonds:

| Base | Pairs with | H-bonds |
|---|---|---|
| Adenine (A) | **Thymine (T)** | 2 H-bonds |
| Guanine (G) | Cytosine (C) | 3 H-bonds |

**Compound A = Thymine** (identified by the SMILES showing a methylated pyrimidine-2,4-dione — the methyl group at C5 distinguishes thymine from uracil).

Thymine is the complementary base of **Adenine** in DNA.

$$\\mathrm{A = T} \\quad (\\text{2 hydrogen bonds})$$

**Note:** In RNA, Uracil replaces Thymine and pairs with Adenine.

**Final Answer: Option (3) — Adenine**`,
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
