const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch12_pblock';
function src(year, month, day, shift) { return { exam_name: 'JEE Main', year, month, day, shift }; }

function mkSCQ(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: correctId === 'a' },
      { id: 'b', text: opts[1], is_correct: correctId === 'b' },
      { id: 'c', text: opts[2], is_correct: correctId === 'c' },
      { id: 'd', text: opts[3], is_correct: correctId === 'd' }
    ],
    answer: { correct_option: correctId },
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null
  };
}

function mkNVT(id, diff, text, answer, solution, tag, examSrc) {
  return {
    _id: uuidv4(), display_id: id, type: 'NVT',
    question_text: { markdown: text, latex_validated: false },
    options: [], answer,
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null
  };
}

const questions = [

// Q81 — Number of compounds with +4 OS of S; Answer: 3
mkNVT('PB12-081', 'Medium',
`From the given list, the number of compounds with +4 oxidation state of Sulphur:

$\\mathrm{SO_3,\\ H_2SO_3,\\ SOCl_2,\\ SF_4,\\ BaSO_4,\\ H_2S_2O_7}$`,
{ integer_value: 3 },
`**Oxidation state of S in each compound:**

| Compound | OS of S |
|---|---|
| $\\mathrm{SO_3}$ | +6 |
| $\\mathrm{H_2SO_3}$ | **+4** ✓ |
| $\\mathrm{SOCl_2}$ | **+4** ✓ (S: x + (-2) + 2(-1) = 0 → x = +4) |
| $\\mathrm{SF_4}$ | **+4** ✓ (S: x + 4(-1) = 0 → x = +4) |
| $\\mathrm{BaSO_4}$ | +6 |
| $\\mathrm{H_2S_2O_7}$ | +6 |

Compounds with +4 OS: $\\mathrm{H_2SO_3}$, $\\mathrm{SOCl_2}$, $\\mathrm{SF_4}$ = **3**

**Answer: 3**`,
'tag_pblock12_5', src(2024, 'Jan', 27, 'Morning')),

// Q82 — Number of oxoacids with peroxo bond; Answer: 1
mkNVT('PB12-082', 'Medium',
`Consider the following sulphur based oxoacids: $\\mathrm{H_2SO_3}$, $\\mathrm{H_2SO_4}$, $\\mathrm{H_2S_2O_8}$ and $\\mathrm{H_2S_2O_7}$. Amongst these oxoacids, the number of those with peroxo (O–O) bond is`,
{ integer_value: 1 },
`**Peroxo bond (O–O) in sulphur oxoacids:**

| Acid | Contains O–O bond? |
|---|---|
| $\\mathrm{H_2SO_3}$ | No |
| $\\mathrm{H_2SO_4}$ | No |
| $\\mathrm{H_2S_2O_8}$ (peroxodisulphuric acid) | **Yes** ✓ (structure: $\\mathrm{HO_3S-O-O-SO_3H}$) |
| $\\mathrm{H_2S_2O_7}$ (pyrosulphuric acid) | No (S–O–S bridge, not O–O) |

Only $\\mathrm{H_2S_2O_8}$ has a peroxo bond.

**Answer: 1**`,
'tag_pblock12_5', src(2022, 'Jul', 29, 'Evening')),

// Q83 — Correct order of melting points of Group 16 hydrides; Answer: (1) H2S < H2Se < H2Te < H2O
mkSCQ('PB12-083', 'Easy',
`The correct order of melting points of hydrides of group 16 elements is`,
[
  '$\\mathrm{H_2S < H_2Se < H_2Te < H_2O}$',
  '$\\mathrm{H_2O < H_2S < H_2Se < H_2Te}$',
  '$\\mathrm{H_2S < H_2Te < H_2Se < H_2O}$',
  '$\\mathrm{H_2Se < H_2S < H_2Te < H_2O}$'
],
'a',
`**Melting points of Group 16 hydrides:**

| Hydride | Melting point |
|---|---|
| $\\mathrm{H_2S}$ | −85.5°C (lowest among H₂S, H₂Se, H₂Te) |
| $\\mathrm{H_2Se}$ | −65.7°C |
| $\\mathrm{H_2Te}$ | −49°C |
| $\\mathrm{H_2O}$ | **0°C** (anomalously high due to strong H-bonding) |

For $\\mathrm{H_2S}$, $\\mathrm{H_2Se}$, $\\mathrm{H_2Te}$: melting points increase with molecular mass (stronger van der Waals forces).

$\\mathrm{H_2O}$ has anomalously high melting point due to extensive hydrogen bonding.

Order: $\\mathrm{H_2S < H_2Se < H_2Te < H_2O}$

**Answer: Option (1)**`,
'tag_pblock12_9', src(2022, 'Jun', 26, 'Morning')),

// Q84 — Oxoacid of S with S in two different OS; Answer: (1) H2S2O3
mkSCQ('PB12-084', 'Medium',
`Which of the following oxoacids of sulphur contains "S" in two different oxidation states?`,
[
  '$\\mathrm{H_2S_2O_3}$',
  '$\\mathrm{H_2S_2O_6}$',
  '$\\mathrm{H_2S_2O_7}$',
  '$\\mathrm{H_2S_2O_8}$'
],
'a',
`**Oxidation states of S in each acid:**

| Acid | OS of S |
|---|---|
| $\\mathrm{H_2S_2O_3}$ (thiosulphuric acid) | One S is +5, one S is −1 → **two different OS** ✓ |
| $\\mathrm{H_2S_2O_6}$ (dithionic acid) | Both S are +5 (same) |
| $\\mathrm{H_2S_2O_7}$ (pyrosulphuric acid) | Both S are +6 (same) |
| $\\mathrm{H_2S_2O_8}$ (peroxodisulphuric acid) | Both S are +6 (same) |

$\\mathrm{H_2S_2O_3}$ (thiosulphate): structure is $\\mathrm{SO_3^{2-}}$ with one O replaced by S. The central S is +5 and the terminal S is −1.

**Answer: Option (1) — $\\mathrm{H_2S_2O_3}$**`,
'tag_pblock12_5', src(2022, 'Jun', 28, 'Evening')),

// Q85 — S=O bonds in H2SO3, H2S2O8, H2S2O7; Answer: (2) 1, 4 and 4
mkSCQ('PB12-085', 'Medium',
`The number of $\\mathrm{S=O}$ bonds present in sulphurous acid, peroxodisulphuric acid and pyrosulphuric acid, respectively are:`,
[
  '1, 4 and 3',
  '1, 4 and 4',
  '2, 3 and 4',
  '2, 4 and 3'
],
'b',
`**Counting S=O bonds:**

**Sulphurous acid ($\\mathrm{H_2SO_3}$):**
Structure: S has 2 S–OH and 1 S=O → **1 S=O bond**

**Peroxodisulphuric acid ($\\mathrm{H_2S_2O_8}$):**
Structure: $\\mathrm{HO_3S-O-O-SO_3H}$
Each S has 2 S=O bonds → 2 × 2 = **4 S=O bonds**

**Pyrosulphuric acid ($\\mathrm{H_2S_2O_7}$):**
Structure: $\\mathrm{HO_3S-O-SO_3H}$
Each S has 2 S=O bonds → 2 × 2 = **4 S=O bonds**

**Answer: Option (2) — 1, 4 and 4**`,
'tag_pblock12_5', src(2021, 'Aug', 31, 'Evening')),

// Q86 — Number of halides inert to hydrolysis; Answer: 1
mkNVT('PB12-086', 'Medium',
`Among the following, the number of halide(s) which is/are inert to hydrolysis is:

(A) $\\mathrm{BF_3}$

(B) $\\mathrm{SiCl_4}$

(C) $\\mathrm{PCl_5}$

(D) $\\mathrm{SF_6}$`,
{ integer_value: 1 },
`**Hydrolysis behaviour:**

- **(A) $\\mathrm{BF_3}$:** Hydrolyses readily (Lewis acid, accepts OH⁻) ✗
- **(B) $\\mathrm{SiCl_4}$:** Hydrolyses readily (Si has empty d-orbitals) ✗
- **(C) $\\mathrm{PCl_5}$:** Hydrolyses readily (P has d-orbitals) ✗
- **(D) $\\mathrm{SF_6}$:** **Inert to hydrolysis** ✓ — Despite S having d-orbitals, the 6 F atoms completely surround S, creating steric protection. The F atoms are too small to allow water to approach S. $\\mathrm{SF_6}$ is kinetically inert.

Only $\\mathrm{SF_6}$ is inert to hydrolysis.

**Answer: 1**`,
'tag_pblock12_5', src(2021, 'Feb', 25, 'Morning')),

// Q87 — Statements about alpha and beta sulphur; Answer: (2) Statement I true, II false
mkSCQ('PB12-087', 'Medium',
`Given below are two statements:

**Statement I:** $\\alpha$ and $\\beta$ forms of sulphur can change reversibly between themselves with slow heating or slow cooling.

**Statement II:** At room temperature the stable crystalline form of sulphur is monoclinic sulphur.

In the light of the above statements, choose the correct answer from the options given below:`,
[
  'Both Statement I and Statement II are true.',
  'Statement I is true but Statement II is false.',
  'Statement I is false but Statement II is true.',
  'Both Statement I and Statement II are false.'
],
'b',
`**Statement I:** $\\alpha$-sulphur (rhombic) and $\\beta$-sulphur (monoclinic) can interconvert reversibly:
- Below 369 K (96°C): $\\alpha$-sulphur is stable
- Above 369 K: $\\beta$-sulphur is stable
- Slow heating/cooling allows reversible interconversion ✓

**Statement II:** At **room temperature** (below 369 K), the stable form is **rhombic sulphur** ($\\alpha$-sulphur), NOT monoclinic sulphur. Monoclinic sulphur is stable above 369 K. Statement II is **false**. ✗

**Answer: Option (2) — Statement I is true but Statement II is false**`,
'tag_pblock12_5', src(2021, 'Feb', 25, 'Evening')),

// Q88 — Gas X from warm dil H2SO4, turns K2Cr2O7 green; X and Y; Answer: (2) X=SO2, Y=Cr2(SO4)3
mkSCQ('PB12-088', 'Medium',
`On treating a compound with warm dil. $\\mathrm{H_2SO_4}$, gas X is evolved which turns $\\mathrm{K_2Cr_2O_7}$ paper acidified with dil. $\\mathrm{H_2SO_4}$ to a green compound Y. X and Y respectively are:`,
[
  '$\\mathrm{X = SO_2,\\ Y = Cr_2O_3}$',
  '$\\mathrm{X = SO_2,\\ Y = Cr_2(SO_4)_3}$',
  '$\\mathrm{X = SO_3,\\ Y = Cr_2(SO_4)_3}$',
  '$\\mathrm{X = SO_3,\\ Y = Cr_2O_3}$'
],
'b',
`**Gas X:** A sulphite compound + dil. $\\mathrm{H_2SO_4}$ → $\\mathrm{SO_2}$ gas (X)

**Reaction with $\\mathrm{K_2Cr_2O_7}$:**
$$\\mathrm{K_2Cr_2O_7 + H_2SO_4 + 3SO_2 \\rightarrow K_2SO_4 + Cr_2(SO_4)_3 + H_2O}$$

$\\mathrm{Cr_2O_7^{2-}}$ (orange) is reduced to $\\mathrm{Cr^{3+}}$ (green) as $\\mathrm{Cr_2(SO_4)_3}$.

Y = $\\mathrm{Cr_2(SO_4)_3}$ (green)

**Answer: Option (2) — $\\mathrm{X = SO_2}$, $\\mathrm{Y = Cr_2(SO_4)_3}$**`,
'tag_pblock12_5', src(2021, 'Feb', 26, 'Morning')),

// Q89 — Sulphite X + dil H2SO4 → Y; Y + NaOH → X; X + Y + H2O → Z; Answer: (1) SO2 and Na2SO3
mkSCQ('PB12-089', 'Medium',
`Reaction of an inorganic sulphite X with dilute $\\mathrm{H_2SO_4}$ generated compound Y. Reaction of Y with NaOH gives X. Further, the reaction of X with Y and water affords compound Z. Y and X, respectively, are:`,
[
  '$\\mathrm{SO_2}$ and $\\mathrm{Na_2SO_3}$',
  '$\\mathrm{SO_3}$ and $\\mathrm{NaHSO_3}$',
  '$\\mathrm{SO_2}$ and $\\mathrm{NaHSO_3}$',
  'S and $\\mathrm{Na_2SO_3}$'
],
'a',
`**Step 1:** Sulphite X + dil. $\\mathrm{H_2SO_4}$ → Y:
$$\\mathrm{Na_2SO_3 + H_2SO_4 \\rightarrow Na_2SO_4 + SO_2 + H_2O}$$
Y = $\\mathrm{SO_2}$, X = $\\mathrm{Na_2SO_3}$

**Step 2:** Y + NaOH → X:
$$\\mathrm{SO_2 + 2NaOH \\rightarrow Na_2SO_3 + H_2O}$$ ✓

**Step 3:** X + Y + H₂O → Z:
$$\\mathrm{Na_2SO_3 + SO_2 + H_2O \\rightarrow 2NaHSO_3}$$
Z = $\\mathrm{NaHSO_3}$ (sodium bisulphite)

**Answer: Option (1) — $\\mathrm{SO_2}$ and $\\mathrm{Na_2SO_3}$**`,
'tag_pblock12_5', src(2020, 'Sep', 6, 'Evening')),

// Q90 — Oxoacid of S without S-S bond; Answer: (1) H2S2O7
mkSCQ('PB12-090', 'Medium',
`The oxoacid of sulphur that does not contain bond between sulphur atom is:`,
[
  '$\\mathrm{H_2S_2O_7}$',
  '$\\mathrm{H_2S_2O_4}$',
  '$\\mathrm{H_2S_4O_6}$',
  '$\\mathrm{H_2S_2O_3}$'
],
'a',
`**S–S bonds in sulphur oxoacids:**

| Acid | S–S bond? |
|---|---|
| $\\mathrm{H_2S_2O_7}$ (pyrosulphuric acid) | **No** — S atoms linked via S–O–S bridge ✓ |
| $\\mathrm{H_2S_2O_4}$ (dithionous acid) | Yes — direct S–S bond |
| $\\mathrm{H_2S_4O_6}$ (tetrathionic acid) | Yes — S–S–S–S chain |
| $\\mathrm{H_2S_2O_3}$ (thiosulphuric acid) | Yes — S–S bond |

$\\mathrm{H_2S_2O_7}$ has the structure $\\mathrm{HO_3S-O-SO_3H}$ — the two S atoms are connected through an oxygen bridge, not directly.

**Answer: Option (1) — $\\mathrm{H_2S_2O_7}$**`,
'tag_pblock12_5', src(2019, 'Apr', 10, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (PB12-081 to PB12-090)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
