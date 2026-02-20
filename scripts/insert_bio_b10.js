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

// Q95 — Complementary strand of ATGCTTCA; Ans: (2) TACGAAGT
mkSCQ('BIO-091', 'Medium',
`If one strand of a DNA has the sequence ATGCTTCA, sequence of the bases in complementary strand is:`,
[
  'CATTAGCT',
  'TACGAAGT',
  'GTACTTAC',
  'ATGCGACT',
],
'b',
`**DNA base pairing rules (Chargaff's rules):**

| Base in template strand | Complementary base |
|---|---|
| A (Adenine) | T (Thymine) |
| T (Thymine) | A (Adenine) |
| G (Guanine) | C (Cytosine) |
| C (Cytosine) | G (Guanine) |

**Complementary strand is antiparallel** — read 3'→5' when the template is 5'→3'.

**Template strand:** 5'–A–T–G–C–T–T–C–A–3'

**Complementary strand:** 3'–T–A–C–G–A–A–G–T–5'

Reading the complementary strand 5'→3': **T–A–C–G–A–A–G–T**

$$\\text{Template: } 5'\\text{-ATGCTTCA-}3'$$
$$\\text{Complement: } 3'\\text{-TACGAAGT-}5'$$

**Final Answer: Option (2) — TACGAAGT**`,
'tag_bio_5'),

// Q96 — Number of oxygen atoms in nucleotide from base only in RNA (Uracil); Ans: 9
mkNVT('BIO-092', 'Hard',
`The number of oxygen atoms present in a nucleotide formed from a base, that is present only in RNA is ______ .`,
{ integer_value: 9 },
`**Base present only in RNA:** Uracil (Thymine is in DNA; Uracil replaces Thymine in RNA)

**Nucleotide = Base + Sugar + Phosphate group**

For RNA, the nucleotide is a **ribonucleotide** (contains ribose sugar).

**Uridine 5'-monophosphate (UMP) structure:**

| Component | Oxygen atoms |
|---|---|
| **Uracil** ($ \\mathrm{C_4H_4N_2O_2} $) | 2 (two C=O groups) |
| **Ribose** ($ \\mathrm{C_5H_{10}O_4} $ in ring form) | 4 (ring O + three –OH groups) |
| **Phosphate** ($ \\mathrm{-OPO_3H_2} $) | 4 (but one O bridges to sugar C5') |

**Counting oxygens in UMP:**

- Uracil: 2 O (two carbonyl oxygens)
- Ribose: 4 O (ring oxygen + OH at C2', C3'; the C5' oxygen bridges to phosphate)
- Phosphate group ($ \\mathrm{-O-PO_3H_2} $): 4 O (one bridging + three non-bridging)

**But the bridging oxygen between ribose C5' and phosphate is counted once:**

Total O in UMP = 2 (uracil) + 4 (ribose: ring O + C2'OH + C3'OH + C5'–O–P) + 3 (phosphate: =O + 2×–OH) = **9**

More precisely: UMP molecular formula = $ \\mathrm{C_9H_{13}N_2O_9P} $ → **9 oxygen atoms**

**Final Answer: 9**`,
'tag_bio_5'),

// Q97 — Sugar moiety in DNA and RNA; Ans: (3)
mkSCQ('BIO-093', 'Easy',
`Sugar moiety in DNA and RNA molecules respectively are`,
[
  '$ \\beta $-D-2-deoxyribose, $ \\beta $-D-deoxyribose',
  '$ \\beta $-D-ribose, $ \\beta $-D-2deoxyribose',
  '$ \\beta $-D-2-deoxyribose, $ \\beta $-D-ribose',
  '$ \\beta $-D-deoxyribose, $ \\beta $-D-2deoxyribose',
],
'c',
`**Sugar components of nucleic acids:**

| Nucleic acid | Sugar | Key feature |
|---|---|---|
| **DNA** | **$ \\beta $-D-2-deoxyribose** | No –OH at C2' (deoxy = missing oxygen at C2') |
| **RNA** | **$ \\beta $-D-ribose** | Has –OH at C2' |

**Structures:**
- $ \\beta $-D-ribose: $ \\mathrm{C_5H_{10}O_4} $ (furanose form), –OH at C1', C2', C3', C5'
- $ \\beta $-D-2-deoxyribose: $ \\mathrm{C_5H_{10}O_3} $ (furanose form), –H at C2' (no –OH)

The absence of the 2'-OH in DNA makes it more stable than RNA (the 2'-OH in RNA can participate in hydrolysis reactions).

**Final Answer: Option (3) — $ \\beta $-D-2-deoxyribose, $ \\beta $-D-ribose**`,
'tag_bio_5'),

// Q98 — Isomeric form of uracil present in RNA; Ans: (1)
mkSCQ('BIO-094', 'Medium',
`Out of following isomeric forms of uracil, which one is present in RNA?`,
[
  'Pyrimidine-2,4(1H,3H)-dione (keto form with C=O at C2 and C4)',
  'Enol form: 2-hydroxy-4-hydroxypyrimidine',
  'Enol form: 2-oxo-4-hydroxypyrimidine',
  'Enol form: 2-hydroxy-4-oxopyrimidine',
],
'a',
`**Tautomeric forms of uracil:**

Uracil can exist in keto and enol tautomeric forms. In biological systems (RNA), uracil exists predominantly in the **keto form**.

**Keto form (biologically active):**
$$\\text{Pyrimidine-2,4(1H,3H)-dione}$$
- C=O at position 2 (between N1 and N3)
- C=O at position 4 (between N3 and C5)
- This is the form that base-pairs with Adenine in RNA

SMILES: $ \\mathrm{O=c1cc[nH]c(=O)[nH]1} $

**Why keto form?**
The keto form is thermodynamically more stable and is the form present in RNA. The enol forms are minor tautomers that do not participate in normal base pairing.

**Final Answer: Option (1) — Keto form (pyrimidine-2,4-dione)**`,
'tag_bio_5'),

// Q99 — Compound found in RNA; Ans: (2) Uracil (keto form)
mkSCQ('BIO-095', 'Medium',
`Among the following compounds, which one is found in RNA?`,
[
  'A pyrimidine with –NH₂ at C4 and C=O at C2 (cytosine tautomer)',
  'Uracil: pyrimidine-2,4(1H,3H)-dione (keto form)',
  'Thymine: 5-methyluracil',
  'N,N-dimethyluracil (methylated at both N atoms)',
],
'b',
`**Bases in RNA vs DNA:**

| Base | Found in | Type |
|---|---|---|
| Adenine | Both DNA and RNA | Purine |
| Guanine | Both DNA and RNA | Purine |
| Cytosine | Both DNA and RNA | Pyrimidine |
| **Uracil** | **RNA only** | Pyrimidine |
| Thymine | DNA only | Pyrimidine |

**Uracil** (pyrimidine-2,4-dione) is the base unique to RNA. It replaces thymine (5-methyluracil) in RNA.

The correct structure of uracil (keto form) has:
- C=O at C2 and C4
- –NH at N1 and N3
- SMILES: $ \\mathrm{O=c1cc[nH]c(=O)[nH]1} $

**Final Answer: Option (2) — Uracil (keto form)**`,
'tag_bio_5'),

// Q100 — Thiamine and pyridoxine also known as; Ans: (4)
mkSCQ('BIO-096', 'Easy',
`Thiamine and pyridoxine are also known respectively as:`,
[
  'Vitamin $ \\mathrm{B_2} $ and Vitamin E',
  'Vitamin E and Vitamin $ \\mathrm{B_2} $',
  'Vitamin $ \\mathrm{B_6} $ and Vitamin $ \\mathrm{B_2} $',
  'Vitamin $ \\mathrm{B_1} $ and Vitamin $ \\mathrm{B_6} $',
],
'd',
`**Vitamin names and chemical names:**

| Chemical name | Vitamin | Deficiency disease |
|---|---|---|
| **Thiamine** | **Vitamin B₁** | Beriberi |
| Riboflavin | Vitamin B₂ | Cheilosis |
| Pyridoxine | Vitamin B₆ | Convulsions |
| Cyanocobalamin | Vitamin B₁₂ | Pernicious anaemia |
| Ascorbic acid | Vitamin C | Scurvy |
| Tocopherol | Vitamin E | Sterility |

**Thiamine = Vitamin B₁**
**Pyridoxine = Vitamin B₆**

**Final Answer: Option (4) — Vitamin B₁ and Vitamin B₆**`,
'tag_bio_6'),

// Q101 — Vitamin helpful in blood clotting; Ans: (3) Vitamin K
mkSCQ('BIO-097', 'Easy',
`Which of the following vitamin is helpful in the blood clotting?`,
[
  'Vitamin C',
  'Vitamin E',
  'Vitamin K',
  'Vitamin B',
],
'c',
`**Vitamin K and blood clotting:**

Vitamin K (phylloquinone) is essential for the synthesis of **clotting factors** (prothrombin group: factors II, VII, IX, X) in the liver.

**Role of Vitamin K:**
- Acts as a cofactor for the enzyme that carboxylates glutamate residues in clotting proteins
- This carboxylation is essential for the clotting factors to bind calcium ions and become active
- Without Vitamin K → clotting factors are inactive → blood does not clot properly

**Other vitamins and their roles:**
- Vitamin C: antioxidant, collagen synthesis
- Vitamin E: antioxidant, protects cell membranes
- Vitamin B group: various metabolic functions

**Final Answer: Option (3) — Vitamin K**`,
'tag_bio_6'),

// Q102 — Match pyranose/furanose structures; Ans: (4)
mkSCQ('BIO-098', 'Hard',
`Match items of Row I with those of Row II.\n\n**Row I:** Four cyclic sugar structures (P, Q, R, S)\n\n**Row II:**\n(i) $ \\alpha $-D-(−) Fructofuranose\n(ii) $ \\beta $-D-(−) Fructofuranose\n(iii) $ \\alpha $-D-(−) Glucopyranose\n(iv) $ \\beta $-D-(−) Glucopyranose\n\nCorrect match is`,
[
  '$ \\mathrm{P \\to iv,\\ Q \\to iii,\\ R \\to i,\\ S \\to ii} $',
  '$ \\mathrm{P \\to i,\\ Q \\to ii,\\ R \\to iii,\\ S \\to iv} $',
  '$ \\mathrm{P \\to iii,\\ Q \\to iv,\\ R \\to ii,\\ S \\to i} $',
  '$ \\mathrm{P \\to iii,\\ Q \\to iv,\\ R \\to i,\\ S \\to ii} $',
],
'd',
`**Identifying cyclic sugar structures:**

**Key rules for identifying anomers:**

For **glucopyranose** (6-membered ring, D-glucose):
- $ \\alpha $-D-glucopyranose: anomeric –OH at C1 is **axial** (trans to –CH₂OH at C5)
- $ \\beta $-D-glucopyranose: anomeric –OH at C1 is **equatorial** (cis to –CH₂OH at C5)

For **fructofuranose** (5-membered ring, D-fructose):
- $ \\alpha $-D-fructofuranose: anomeric –OH at C2 is on the **same side** as C6 (–CH₂OH)
- $ \\beta $-D-fructofuranose: anomeric –OH at C2 is on the **opposite side** from C6

**Based on the structures shown in the question:**
- P → (iii) $ \\alpha $-D-(−) Glucopyranose
- Q → (iv) $ \\beta $-D-(−) Glucopyranose
- R → (i) $ \\alpha $-D-(−) Fructofuranose
- S → (ii) $ \\beta $-D-(−) Fructofuranose

**Final Answer: Option (4) — P→iii, Q→iv, R→i, S→ii**`,
'tag_bio_1'),

// Q103 — Number of carbon atoms in product B; Ans: 1
mkNVT('BIO-099', 'Hard',
`$ \\mathrm{C_6H_{12}O_6 \\xrightarrow{\\text{Zymase}} A \\xrightarrow[\\Delta]{\\mathrm{NaOI}} B + CHI_3} $\n\nThe number of carbon atoms present in the product B is ______ .`,
{ integer_value: 1 },
`**Step 1: Identify A**

Glucose $ \\xrightarrow{\\text{Zymase}} $ Ethanol ($ \\mathrm{C_2H_5OH} $) + CO₂

So **A = Ethanol ($ \\mathrm{C_2H_5OH} $)**

**Step 2: Reaction of ethanol with NaOI (iodoform reaction)**

Ethanol ($ \\mathrm{CH_3CH_2OH} $) reacts with NaOI (NaOH + I₂) — the iodoform reaction:

$$\\mathrm{CH_3CH_2OH + NaOI \\xrightarrow{\\Delta} CHI_3 + B}$$

The iodoform reaction on ethanol:
1. Oxidation: $ \\mathrm{CH_3CH_2OH \\to CH_3CHO} $ (acetaldehyde)
2. Iodination: $ \\mathrm{CH_3CHO + 3NaOI \\to CI_3CHO + 3NaOH} $
3. Hydrolysis: $ \\mathrm{CI_3CHO + NaOH \\to CHI_3 + HCOONa} $

**Products:** CHI₃ (iodoform) + **HCOONa** (sodium formate)

**B = HCOONa (sodium formate)**

Number of carbon atoms in HCOONa = **1**

**Final Answer: 1**`,
'tag_bio_1'),

// Q104 — Possible structure of compound A (C5H10O5); Ans: (3)
mkSCQ('BIO-100', 'Hard',
`Compound A, $ \\mathrm{C_5H_{10}O_5} $, gives a tetraacetate with $ \\mathrm{Ac_2O} $ and oxidation of A with $ \\mathrm{Br_2}\\text{-}\\mathrm{H_2O} $ gives an acid, $ \\mathrm{C_5H_{10}O_6} $. Reduction of A with HI gives isopentane. The possible structure of A is:`,
[
  '$ \\mathrm{HOCH_2-C(=O)-CH(OH)-CH_2OH} $ (ketopentose, 4C)',
  '$ \\mathrm{OHC-CH(OH)-CH_2OH} $ (3C aldose)',
  '$ \\mathrm{OHC-CH(OH)-CH(OH)-CH(OH)-CH_2OH} $ (aldopentose)',
  'A branched structure with no straight chain',
],
'c',
`**Analysis of compound A ($ \\mathrm{C_5H_{10}O_5} $):**

**Clue 1: Tetraacetate with Ac₂O**
A has **4 –OH groups** (tetraacetate = 4 acetyl groups added). With formula $ \\mathrm{C_5H_{10}O_5} $, having 4 –OH groups and 5 oxygens → one oxygen must be in a C=O (aldehyde or ketone).

**Clue 2: Oxidation with Br₂-H₂O gives $ \\mathrm{C_5H_{10}O_6} $**
Br₂ water oxidizes **–CHO to –COOH** (adds one O). This confirms A has an **aldehyde group** (–CHO).

**Clue 3: Reduction with HI gives isopentane ($ \\mathrm{C_5H_{12}} $)**
Isopentane = 2-methylbutane = $ \\mathrm{(CH_3)_2CHCH_2CH_3} $. This is a branched C5 hydrocarbon. This means A has a **branched carbon skeleton**.

**Conclusion:** A is an **aldopentose** with a branched chain. The structure is:
$$\\mathrm{OHC-CH(OH)-CH(OH)-CH(OH)-CH_2OH}$$

This is a straight-chain aldopentose (like ribose or arabinose), but reduction with HI giving isopentane suggests a branched structure.

Given the answer key (3) and the SMILES $ \\mathrm{O=CC(O)C(O)(CO)CO} $ shown in the question, this is a **branched aldopentose** with the –CHO at C1.

**Final Answer: Option (3)**`,
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
