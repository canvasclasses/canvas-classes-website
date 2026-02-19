const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_periodic';

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
      exam_source: 'Other', is_pyq: false, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 85,
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
      exam_source: 'Other', is_pyq: false, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 85,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

const questions = [

// Img1 Q1 — Basic character of MgO, SrO, K₂O, NiO increasing order
mkSCQ('PERI-126', 'Medium',
`The basic character of $ \\mathrm{MgO} $, $ \\mathrm{SrO} $, $ \\mathrm{K_2O} $ and $ \\mathrm{NiO} $ increases in the order`,
[
  '$ \\mathrm{K_2O < SrO < MgO < NiO} $',
  '$ \\mathrm{NiO < MgO < SrO < K_2O} $',
  '$ \\mathrm{MgO < NiO < SrO < K_2O} $',
  '$ \\mathrm{K_2O < MgO < NiO < SrO} $',
],
'b',
`**Step 1: Factors governing basic character of metal oxides**

Basic character of metal oxides increases with:
- Increasing metallic character of the metal
- Decreasing ionization energy of the metal
- Increasing electropositive character

**Step 2: Classify each oxide**

| Oxide | Metal | Type | Basic character |
|---|---|---|---|
| $ \\mathrm{NiO} $ | Ni (transition metal, Z=28) | d-block | Weakly basic (amphoteric tendency) |
| $ \\mathrm{MgO} $ | Mg (Group 2, Period 3) | s-block | Moderately basic |
| $ \\mathrm{SrO} $ | Sr (Group 2, Period 5) | s-block | More basic than MgO (larger atom, lower IE) |
| $ \\mathrm{K_2O} $ | K (Group 1, Period 4) | s-block | Most basic (alkali metal oxide) |

**Step 3: Order of increasing basic character**

- NiO: transition metal oxide — least basic (d-block metals have higher IE and variable oxidation states)
- MgO: Group 2, Period 3 — moderately basic
- SrO: Group 2, Period 5 — more basic than MgO (Sr is more electropositive than Mg)
- K₂O: Group 1 alkali metal oxide — most basic

$$\\mathrm{NiO < MgO < SrO < K_2O}$$

**Final Answer: Option (b)**`,
'tag_periodic_5'),

// Img1 Q2 — Most dense metal
mkSCQ('PERI-127', 'Easy',
`Among the following metals, the most dense is`,
[
  'Osmium',
  'Iridium',
  'Platinum',
  'Gold',
],
'b',
`**Step 1: Density of transition metals**

Among all known elements, the densest metals are found in the 3rd row of d-block (Period 6):

| Metal | Density (g/cm³) |
|---|---|
| Osmium (Os) | 22.59 |
| **Iridium (Ir)** | **22.65** |
| Platinum (Pt) | 21.45 |
| Gold (Au) | 19.32 |

**Step 2: Identify the densest**

**Iridium (Ir)** has the highest density among all known elements at $ 22.65 $ g/cm³, slightly higher than Osmium (22.59 g/cm³).

**Note:** While Osmium is sometimes cited as the densest element (depending on the measurement method and crystal structure), the standard accepted value for Iridium is slightly higher.

**Final Answer: Option (b) — Iridium**`,
'tag_periodic_1'),

// Img1 Q3 — Which statements are correct (all 4)
mkSCQ('PERI-128', 'Medium',
`Which of the following statements are correct?

a) F is the most electronegative and Cs is the most electropositive element
b) The electronegativity of halogens decreases from F to I
c) Electron affinity of Cl is higher than that of F whereas their electronegativities are in reverse order
d) Electron affinity of noble gases is almost zero`,
[
  'a, b and c only',
  'b, c and d only',
  'a, c and d only',
  'All of the above',
],
'd',
`**Evaluating each statement:**

**Statement (a): F is the most electronegative and Cs is the most electropositive element ✓**

- F has the highest electronegativity (4.0 on Pauling scale) — correct.
- Cs has the lowest ionization energy and highest electropositivity among stable elements — correct.

**Statement (b): Electronegativity of halogens decreases from F to I ✓**

| Halogen | Electronegativity |
|---|---|
| F | 4.0 |
| Cl | 3.0 |
| Br | 2.8 |
| I | 2.5 |
| At | 2.2 |

Electronegativity decreases down Group 17 — correct.

**Statement (c): EA of Cl > EA of F, but EN(F) > EN(Cl) ✓**

- Electron affinity: Cl (−349 kJ/mol) > F (−328 kJ/mol) — correct. F has a small atomic size causing electron-electron repulsion when an extra electron is added, reducing its EA.
- Electronegativity: F (4.0) > Cl (3.0) — correct. EN and EA are different properties.

**Statement (d): Electron affinity of noble gases is almost zero ✓**

Noble gases have completely filled valence shells ($ ns^2\\,np^6 $). They have no tendency to gain electrons → EA ≈ 0 (or slightly positive, meaning energy is required) — correct.

**All four statements are correct.**

**Final Answer: Option (d) — All of the above**`,
'tag_periodic_4'),

// Img2 Q1 — NVT: elements with EN < 1 among Li, Be, B, Na, Mg, Al, K, Rb
mkNVT('PERI-129', 'Medium',
`Among the following elements, the number of elements having electronegativity $ < 1 $ is ______\n\n$ \\mathrm{Li,\\; Be,\\; B,\\; Na,\\; Mg,\\; Al,\\; K,\\; Rb} $`,
{ integer_value: 3 },
`**Step 1: Pauling electronegativity values**

| Element | Electronegativity |
|---|---|
| Li | 1.0 |
| Be | 1.5 |
| B | 2.0 |
| Na | 0.9 |
| Mg | 1.2 |
| Al | 1.5 |
| K | 0.8 |
| Rb | 0.8 |

**Step 2: Identify elements with EN < 1**

- Na: 0.9 < 1 ✓
- K: 0.8 < 1 ✓
- Rb: 0.8 < 1 ✓

All others (Li=1.0, Be=1.5, B=2.0, Mg=1.2, Al=1.5) have EN ≥ 1.

**Step 3: Count**

Elements with EN < 1: **Na, K, Rb → 3 elements**

**Final Answer: 3**`,
'tag_periodic_4'),

// Img3 Q1 — NVT: elements with only single oxidation state (other than zero)
mkNVT('PERI-130', 'Hard',
`Total number of element(s) which have only single oxidation state (other than zero) in their corresponding stable compounds among the following:\n\n$ \\mathrm{Cs,\\; Ba,\\; F,\\; Zn,\\; Be,\\; Al,\\; Sr,\\; Ga,\\; Pb} $`,
{ integer_value: 7 },
`**Step 1: Identify elements with only one oxidation state (other than zero)**

An element shows only a single oxidation state if it has no variable valency in stable compounds.

| Element | Oxidation states in stable compounds | Single OS? |
|---|---|---|
| Cs | +1 only | ✓ |
| Ba | +2 only | ✓ |
| F | −1 only (most electronegative, never positive) | ✓ |
| Zn | +2 only ($ 3d^{10} $ fully filled, stable) | ✓ |
| Be | +2 only | ✓ |
| Al | +3 only | ✓ |
| Sr | +2 only | ✓ |
| Ga | +3 (mainly), but also +1 in some compounds | ✗ |
| Pb | +2 and +4 (variable) | ✗ |

**Step 2: Count**

Elements with only single OS (≠ 0): **Cs, Ba, F, Zn, Be, Al, Sr → 7 elements**

Ga shows +1 and +3; Pb shows +2 and +4 → excluded.

**Final Answer: 7**`,
'tag_periodic_5'),

// Img3 Q2 — NVT: representative elements among Cd, Nb, Ta, Te, Ra, Mo, Po, Pd, Tc
mkNVT('PERI-131', 'Hard',
`Find out the total number of representative elements among the given elements:\n\n$ \\mathrm{Cd,\\; Nb,\\; Ta,\\; Te,\\; Ra,\\; Mo,\\; Po,\\; Pd,\\; Tc} $`,
{ integer_value: 3 },
`**Step 1: Definition of representative elements**

Representative elements are **s-block and p-block elements** (Groups 1, 2, and 13–18), excluding noble gases in some definitions. d-block and f-block elements are NOT representative elements.

**Step 2: Classify each element**

| Element | Z | Block | Representative? |
|---|---|---|---|
| Cd (Cadmium) | 48 | d-block (Group 12) | ✗ |
| Nb (Niobium) | 41 | d-block (Group 5) | ✗ |
| Ta (Tantalum) | 73 | d-block (Group 5) | ✗ |
| Te (Tellurium) | 52 | p-block (Group 16) | ✓ |
| Ra (Radium) | 88 | s-block (Group 2) | ✓ |
| Mo (Molybdenum) | 42 | d-block (Group 6) | ✗ |
| Po (Polonium) | 84 | p-block (Group 16) | ✓ |
| Pd (Palladium) | 46 | d-block (Group 10) | ✗ |
| Tc (Technetium) | 43 | d-block (Group 7) | ✗ |

**Step 3: Count**

Representative elements: **Te, Ra, Po → 3 elements**

**Final Answer: 3**`,
'tag_periodic_1'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
