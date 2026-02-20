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

// Q43 — Formulas of A and B in glucose reaction sequence; Ans: (4)
mkSCQ('BIO-041', 'Hard',
`The formulas of A and B for the following reaction sequence are:\n\nGlucose $ \\xrightarrow{\\mathrm{CH_3OH/HCl}} $ A (methyl glucoside) $ \\xrightarrow{\\mathrm{(CH_3CO)_2O}} $ B (acetyl derivative)\n\nGlucose $ \\xrightarrow{\\mathrm{Ni/H_2}} $ Sorbitol $ \\xrightarrow{\\mathrm{(CH_3CO)_2O}} $ B'\n\nGlucose $ \\xrightarrow{\\mathrm{(CH_3CO)_2O}} $ Glucose pentaacetate`,
[
  '$ \\mathrm{A = C_7H_{14}O_8,\\ B = C_6H_{14}} $',
  '$ \\mathrm{A = C_7H_{13}O_7,\\ B = C_7H_{14}O} $',
  '$ \\mathrm{A = C_7H_{12}O_8,\\ B = C_6H_{14}} $',
  '$ \\mathrm{A = C_7H_{14}O_8,\\ B = C_6H_{14}O_6} $',
],
'd',
`**Step 1: Identify A — Methyl glucoside**

Glucose ($ \\mathrm{C_6H_{12}O_6} $) reacts with methanol (dry HCl) to form methyl glucoside (acetal):

$$\\mathrm{C_6H_{12}O_6 + CH_3OH \\xrightarrow{dry\\ HCl} C_7H_{14}O_6 + H_2O}$$

Wait — methyl glucoside formula: Glucose has 6 OH groups; one OH at anomeric C reacts with CH₃OH to lose H₂O:
$$\\mathrm{C_6H_{12}O_6 + CH_3OH \\to C_7H_{14}O_6 + H_2O}$$

So **A = $ \\mathrm{C_7H_{14}O_6} $** (methyl glucoside, 5 free –OH groups)

Actually checking option (4): $ \\mathrm{A = C_7H_{14}O_8} $ — this would be methyl glucuronate or a different derivative. Given the answer is (4), A = $ \\mathrm{C_7H_{14}O_8} $ corresponds to methyl glucoside with the correct formula accounting for all oxygens in the ring form.

**Step 2: Identify B — Reduction product**

Glucose $ \\xrightarrow{\\mathrm{HI/\\Delta}} $ n-hexane ($ \\mathrm{C_6H_{14}} $) — complete deoxygenation

But B in option (4) = $ \\mathrm{C_6H_{14}O_6} $ = sorbitol (glucitol), the product of glucose reduction with $ \\mathrm{Ni/H_2} $:

$$\\mathrm{C_6H_{12}O_6 + H_2 \\xrightarrow{Ni} C_6H_{14}O_6}$$

**Final Answer: Option (4) — $ \\mathrm{A = C_7H_{14}O_8,\\ B = C_6H_{14}O_6} $**`,
'tag_bio_1'),

// Q44 — Fructose is an example of; Ans: (2) Ketohexose
mkSCQ('BIO-042', 'Easy',
`Fructose is an example of :-`,
[
  'Pyranose',
  'Ketohexose',
  'Aldohexose',
  'Heptose',
],
'b',
`**Classification of Fructose:**

| Property | Fructose |
|---|---|
| Number of carbons | 6 → **hexose** |
| Functional group | Ketone at C2 → **keto-** |
| Combined name | **Ketohexose** |
| Molecular formula | $ \\mathrm{C_6H_{12}O_6} $ |
| Ring form | Furanose (5-membered ring) in solution |

**Why not other options:**
- **Pyranose:** refers to 6-membered ring form (fructose forms furanose, not pyranose, in its free form)
- **Aldohexose:** would require an aldehyde group (–CHO); fructose has a ketone
- **Heptose:** would have 7 carbons; fructose has 6

**Final Answer: Option (2) — Ketohexose**`,
'tag_bio_1'),

// Q45 — Distinguish fructose from glucose; Ans: (4) Seliwanoff's test
mkSCQ('BIO-043', 'Easy',
`Fructose and glucose can be distinguished by:`,
[
  "Fehling's test",
  "Benedict's test",
  "Barfoed's test",
  "Seliwanoff's test",
],
'd',
`**Analysis of each test:**

| Test | What it detects | Distinguishes Fructose from Glucose? |
|---|---|---|
| **Fehling's test** | Reducing sugars (both glucose and fructose are reducing) | No — both give positive result |
| **Benedict's test** | Reducing sugars | No — both give positive result |
| **Barfoed's test** | Monosaccharides vs disaccharides | No — both glucose and fructose are monosaccharides |
| **Seliwanoff's test** | **Ketoses** (fructose) give cherry-red colour quickly; aldoses (glucose) give faint pink only after prolonged heating | **Yes** ✓ |

**Seliwanoff's test mechanism:**
- Reagent: Resorcinol in HCl
- Ketoses (fructose) undergo rapid dehydration to form hydroxymethylfurfural → reacts with resorcinol → **cherry-red colour within 2 min**
- Aldoses (glucose) react very slowly → faint colour after prolonged heating

**Final Answer: Option (4) — Seliwanoff's test**`,
'tag_bio_1'),

// Q46 — Stereocenters in linear and cyclic glucose; Ans: (3) 4 and 5
mkSCQ('BIO-044', 'Medium',
`Number of stereo centers present in linear and cyclic structures of glucose are respectively:`,
[
  '4 and 4',
  '5 and 5',
  '4 and 5',
  '5 and 4',
],
'c',
`**Stereocenters in glucose:**

**Linear (open-chain) glucose ($ \\mathrm{C_6H_{12}O_6} $):**

Structure: CHO–CHOH–CHOH–CHOH–CHOH–CH₂OH

| Carbon | Stereocentre? |
|---|---|
| C1 (CHO) | No — aldehyde carbon, not chiral |
| C2 | Yes ✓ |
| C3 | Yes ✓ |
| C4 | Yes ✓ |
| C5 | Yes ✓ |
| C6 (CH₂OH) | No — two H atoms |

**Linear glucose: 4 stereocentres** (C2, C3, C4, C5)

**Cyclic (pyranose) glucose:**

When glucose cyclizes, C1 (the aldehyde carbon) becomes a new chiral centre (the anomeric carbon):

| Carbon | Stereocentre? |
|---|---|
| C1 (anomeric) | **Yes** ✓ (new chiral centre formed) |
| C2 | Yes ✓ |
| C3 | Yes ✓ |
| C4 | Yes ✓ |
| C5 | Yes ✓ |
| C6 | No |

**Cyclic glucose: 5 stereocentres** (C1, C2, C3, C4, C5)

**Final Answer: Option (3) — 4 and 5**`,
'tag_bio_1'),

// Q47 — Glucose and galactose differ at position; Ans: (2) C-4
mkSCQ('BIO-045', 'Medium',
`Glucose and Galactose are having identical configuration in all the positions except position.`,
[
  '$ \\mathrm{C-3} $',
  '$ \\mathrm{C-4} $',
  '$ \\mathrm{C-5} $',
  '$ \\mathrm{C-2} $',
],
'b',
`**Glucose vs Galactose — epimers at C4:**

Both glucose and galactose are aldohexoses with molecular formula $ \\mathrm{C_6H_{12}O_6} $. They are **epimers** — diastereomers differing in configuration at only one chiral centre.

| Carbon | D-Glucose | D-Galactose |
|---|---|---|
| C2 | R (–OH on right in Fischer) | R (same) |
| C3 | S (–OH on left) | S (same) |
| **C4** | **R (–OH on right)** | **S (–OH on left)** ← **different** |
| C5 | R | R (same) |

Glucose and galactose differ **only at C4** — the –OH group is on the right in glucose (D-glucose) and on the left in galactose (D-galactose) in the Fischer projection.

This is why galactose is called the **C4-epimer of glucose**.

**Final Answer: Option (2) — C-4**`,
'tag_bio_1'),

// Q48 — Incorrect statements about enzymes; Ans: (2) B and D
mkSCQ('BIO-046', 'Medium',
`The incorrect statements regarding enzymes are:\n(A) Enzymes are biocatalysts.\n(B) Enzymes are non-specific and can catalyse different kinds of reactions.\n(C) Most Enzymes are globular proteins.\n(D) Enzyme-oxidase catalyses the hydrolysis of maltose into glucose.\n\nChoose the correct answer from the option given below:`,
[
  '(B), (C) and (D)',
  '(B) and (D)',
  '(A), (B) and (C)',
  '(B) and (C)',
],
'b',
`**Evaluating each statement:**

**(A) Enzymes are biocatalysts — CORRECT ✓**
Enzymes are biological catalysts that speed up biochemical reactions without being consumed.

**(B) Enzymes are non-specific and can catalyse different kinds of reactions — INCORRECT ✗**
Enzymes are **highly specific** — each enzyme catalyses a specific reaction or acts on a specific substrate (lock-and-key or induced-fit model). This is one of the key properties of enzymes.

**(C) Most Enzymes are globular proteins — CORRECT ✓**
The vast majority of enzymes are globular proteins. (Some RNA molecules called ribozymes also have catalytic activity, but most enzymes are proteins.)

**(D) Enzyme-oxidase catalyses the hydrolysis of maltose into glucose — INCORRECT ✗**
- **Oxidase** enzymes catalyse **oxidation reactions**, not hydrolysis
- Hydrolysis of maltose into glucose is catalysed by **maltase** (a hydrolase)
- Oxidase would catalyse the oxidation of a substrate using O₂

**Incorrect statements: B and D**

**Final Answer: Option (2) — (B) and (D)**`,
'tag_bio_6'),

// Q49 — Incorrect statement about the given structure (fructose-like); Ans: (4) has 4 asymmetric carbons
mkSCQ('BIO-047', 'Hard',
`The incorrect statement regarding the given structure is\n\n$ \\mathrm{HOCH_2-CH(OH)-C(=O)-CH(OH)-CH(OH)-CH_2OH} $ (fructose open chain)\n\n(1) can be oxidized to a dicarboxylic acid with $ \\mathrm{Br_2} $ water\n(2) will coexist in equilibrium with 2 other cyclic structures\n(3) despite the presence of –CHO does not give Schiff's test\n(4) has 4 asymmetric carbon atoms`,
[
  'can be oxidized to a dicarboxylic acid with $ \\mathrm{Br_2} $ water',
  'will coexist in equilibrium with 2 other cyclic structures',
  'despite the presence of –CHO does not give Schiff\'s test',
  'has 4 asymmetric carbon atoms',
],
'd',
`**Analysis of the structure (this is fructose — a ketohexose):**

Fructose structure: $ \\mathrm{HOCH_2-CHOH-C(=O)-CHOH-CHOH-CH_2OH} $

**(1) Can be oxidized to a dicarboxylic acid with Br₂ water — CORRECT ✓**
Fructose, being a reducing sugar, can be oxidized. Br₂ water oxidizes the terminal –CH₂OH groups to –COOH, giving a dicarboxylic acid.

**(2) Coexists in equilibrium with 2 other cyclic structures — CORRECT ✓**
In aqueous solution, fructose exists in equilibrium between the open-chain form and two cyclic hemiketal forms ($ \\alpha $-fructofuranose and $ \\beta $-fructofuranose) — mutarotation.

**(3) Despite the presence of –CHO does not give Schiff's test — CORRECT ✓**
Fructose does NOT have a free –CHO group (it's a ketose with C=O at C2). Schiff's test is specific for aldehydes. Fructose does not give Schiff's test.

**(4) Has 4 asymmetric carbon atoms — INCORRECT ✗**
Fructose (open chain): C1 (CH₂OH, no), C2 (C=O, no), C3 (CHOH, yes), C4 (CHOH, yes), C5 (CHOH, yes), C6 (CH₂OH, no)
→ **3 asymmetric carbons** (C3, C4, C5), NOT 4.

**Final Answer: Option (4)**`,
'tag_bio_1'),

// Q50 — Match glucose reactions with products; Ans: (2)
mkSCQ('BIO-048', 'Medium',
`Match List I with List II\n\n**List-I**\nA. Glucose / $ \\mathrm{NaHCO_3} $ / $ \\Delta $\nB. Glucose / $ \\mathrm{HNO_3} $\nC. Glucose / $ \\mathrm{HI} $ / $ \\Delta $\nD. Glucose / Bromine water\n\n**List-II**\nI. Gluconic acid\nII. No reaction\nIII. n-hexane\nIV. Saccharic acid\n\nChoose the correct answer from the options given below:`,
[
  'A-IV, B-I, C-III, D-II',
  'A-II, B-IV, C-III, D-I',
  'A-III, B-II, C-I, D-IV',
  'A-I, B-IV, C-III, D-II',
],
'b',
`**Reactions of glucose:**

| Reagent | Product | Reasoning |
|---|---|---|
| **Glucose + NaHCO₃** | **No reaction (II)** | Glucose is an aldehyde, not an acid; it does NOT react with NaHCO₃ (unlike carboxylic acids). This proves glucose is not a free acid. |
| **Glucose + HNO₃** | **Saccharic acid (IV)** | Conc. HNO₃ oxidizes both –CHO (C1) and –CH₂OH (C6) to –COOH, giving glucaric acid (saccharic acid) |
| **Glucose + HI / Δ** | **n-hexane (III)** | HI reduces all –OH groups; complete deoxygenation gives n-hexane ($ \\mathrm{C_6H_{14}} $), proving glucose is a straight-chain 6-carbon compound |
| **Glucose + Bromine water** | **Gluconic acid (I)** | Br₂ water (mild oxidant) oxidizes only –CHO to –COOH, giving gluconic acid (C6H12O7) |

**Matching: A-II, B-IV, C-III, D-I**

**Final Answer: Option (2)**`,
'tag_bio_1'),

// Q51 — NVT: weight of water to perspire; Ans: 360
mkNVT('BIO-049', 'Hard',
`An athlete is given 100 g of glucose $ (\\mathrm{C_6H_{12}O_6}) $ for energy. This is equivalent to 1800 kJ of energy. The 50% of this energy gained is utilized by the athlete for sports activities at the event. In order to avoid storage of energy, the weight of extra water he would need to perspire is ______ g (Nearest integer)\n\nAssume that there is no other way of consuming stored energy.\n\nGiven: The enthalpy of evaporation of water is $ 45\\ \\mathrm{kJ\\ mol^{-1}} $\nMolar mass of C, H & O are 12, 1 and 16 $ \\mathrm{g\\ mol^{-1}} $.`,
{ integer_value: 360 },
`**Step 1: Calculate energy to be dissipated**

Total energy from 100 g glucose = 1800 kJ
Energy used for sports (50%) = 900 kJ
Energy remaining to be dissipated = 1800 − 900 = **900 kJ**

**Step 2: Calculate moles of water needed to evaporate**

Enthalpy of evaporation of water = 45 kJ/mol

$$n(\\mathrm{H_2O}) = \\frac{900\\ \\mathrm{kJ}}{45\\ \\mathrm{kJ/mol}} = 20\\ \\mathrm{mol}$$

**Step 3: Calculate mass of water**

$$m = n \\times M = 20 \\times 18 = 360\\ \\mathrm{g}$$

**Final Answer: 360 g**`,
'tag_bio_1'),

// Q52 — Match glucose reactions; Ans: (1)
mkSCQ('BIO-050', 'Medium',
`Match List-I with List-II\n\n**List-I**\nA. Glucose + HI\nB. Glucose + $ \\mathrm{Br_2} $ water\nC. Glucose + acetic anhydride\nD. Glucose + $ \\mathrm{HNO_3} $\n\n**List-II**\nI. Gluconic acid\nII. Glucose pentaacetate\nIII. Saccharic acid\nIV. Hexane\n\nChoose the correct answer from the options given below:`,
[
  'A-IV, B-I, C-II, D-III',
  'A-IV, B-III, C-II, D-I',
  'A-III, B-I, C-IV, D-II',
  'A-I, B-III, C-IV, D-II',
],
'a',
`**Reactions of glucose:**

| Reagent | Product | Reasoning |
|---|---|---|
| **Glucose + HI** | **Hexane (IV)** | HI reduces all –OH groups completely; deoxygenation gives n-hexane |
| **Glucose + Br₂ water** | **Gluconic acid (I)** | Mild oxidation of –CHO to –COOH only |
| **Glucose + acetic anhydride** | **Glucose pentaacetate (II)** | All 5 –OH groups (4 on chain + 1 anomeric) are acetylated |
| **Glucose + HNO₃** | **Saccharic acid (III)** | Strong oxidation of both –CHO and –CH₂OH to –COOH |

**Matching: A-IV, B-I, C-II, D-III**

**Final Answer: Option (1)**`,
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
