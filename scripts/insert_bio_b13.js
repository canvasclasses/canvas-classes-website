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

// Q125 — Correct structure of Ruhemann's Purple; Ans: (4)
mkSCQ('BIO-121', 'Hard',
`The correct structure of Ruhemann's Purple, the compound formed in the reaction of Ninhydrin with proteins is:`,
[
  'A compound with two ninhydrin units connected by –N– with one unit having –O⁻',
  'A compound with two ninhydrin units connected by =N– with both units having –O⁻',
  'A compound with two ninhydrin units connected by –N=N– linkage',
  'A compound with one ninhydrin unit connected via =N– to another ninhydrin unit, with one –O⁻ on each',
],
'd',
`**Ninhydrin reaction with amino acids:**

When ninhydrin reacts with an $ \\alpha $-amino acid, the following sequence occurs:

1. Ninhydrin oxidizes the amino acid → CO₂ + aldehyde + reduced ninhydrin (hydrindantin)
2. The liberated –NH₂ (from the amino acid) reacts with another molecule of ninhydrin
3. The reduced ninhydrin (hydrindantin) condenses with the ninhydrin–NH₂ complex

**Ruhemann's Purple:**

The product is a **purple dye** formed by condensation of:
- One molecule of reduced ninhydrin (hydrindantin)
- One molecule of ninhydrin
- Connected through a nitrogen atom (–N=)

Structure: Two indane-1,3-dione units connected through a nitrogen bridge with enolate anions (–O⁻) on each unit, giving the characteristic purple colour due to extended conjugation.

The correct SMILES shows: $ \\mathrm{O=C1C(N=c2c(=O)c(=O)c3ccccc23)=C([O^-])c2ccccc21} $

This is option (4) — one ninhydrin connected via =N– to another ninhydrin unit with –O⁻ on each.

**Final Answer: Option (4)**`,
'tag_bio_4'),

// Q126 — Chiral carbons in Ile-Arg-Pro; Ans: 4
mkNVT('BIO-122', 'Hard',
`The number of chiral carbon(s) present in peptide, Ile–Arg–Pro, is ______ .`,
{ integer_value: 4 },
`**Counting chiral carbons in Ile–Arg–Pro tripeptide:**

**Isoleucine (Ile):**
- $ \\alpha $-carbon: chiral ✓
- $ \\beta $-carbon (–CH(CH₃)–): chiral ✓ (Ile has 2 chiral centres — it's one of the two amino acids with 2 chiral centres)
- Total: **2 chiral carbons**

**Arginine (Arg):**
- $ \\alpha $-carbon: chiral ✓
- Side chain (–CH₂–CH₂–CH₂–NH–C(=NH)–NH₂): no chiral centres in side chain
- Total: **1 chiral carbon**

**Proline (Pro):**
- $ \\alpha $-carbon: chiral ✓ (the ring nitrogen is connected to the $ \\alpha $-carbon, making it chiral)
- The pyrrolidine ring: no additional chiral centres
- Total: **1 chiral carbon**

**Total chiral carbons = 2 (Ile) + 1 (Arg) + 1 (Pro) = 4**

**Final Answer: 4**`,
'tag_bio_3'),

// Q127 — Most stable structure of Vitamin C; Ans: (1)
mkSCQ('BIO-123', 'Hard',
`All structures given below are of vitamin C. Most stable of them is:`,
[
  'L-Ascorbic acid: $ \\gamma $-lactone with enediol at C2–C3, –OH at C2 and C3 (enol form, conjugated)',
  'Dehydroascorbic acid: $ \\gamma $-lactone with diketone at C2–C3',
  'Ascorbic acid with methyl at C5 (incorrect stereochemistry)',
  'Ascorbic acid with incorrect ring size ($ \\delta $-lactone)',
],
'a',
`**Structure of Vitamin C (L-Ascorbic acid):**

Vitamin C (L-ascorbic acid) is a $ \\gamma $-lactone (5-membered ring with ester linkage) with an **enediol group** at C2–C3.

**Most stable tautomer:**

The biologically active and most stable form is the **enediol form** (option 1):
- C2–C3 double bond (C=C)
- –OH groups at both C2 and C3 (enediol)
- $ \\gamma $-lactone ring (C1 carbonyl as ester)
- Side chain: –CH(OH)–CH₂OH at C5

**Why this is most stable:**
- The enediol form is stabilized by **conjugation** between the C=C double bond and the adjacent C=O of the lactone
- This extended conjugation lowers the energy of the molecule
- The enediol form is also the form that acts as an antioxidant (donates H⁺ and e⁻)

**Other forms are less stable:**
- Diketone form (option 2): dehydroascorbic acid — oxidized form, less stable
- Options 3 and 4: incorrect stereochemistry or ring size

The SMILES $ \\mathrm{O=C1O[C@@](O)([CH]CO)C(O)=C1O} $ correctly represents the most stable enediol form.

**Final Answer: Option (1)**`,
'tag_bio_6'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
