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

// Q91 — Assertion-Reason: glycine + Cl2/red P → chiral carbon; Answer: (1) A true, R false
mkSCQ('PB12-091', 'Hard',
`Given below are two statements, one is labelled as Assertion A and the other is labelled as Reason R.

**Assertion A:** A solution of the product obtained by heating a mole of glycine with a mole of chlorine in presence of red phosphorous generates chiral carbon atom.

**Reason R:** A molecule with 2 chiral carbons is always optically active.

In the light of above statements, choose the correct answer from the options given below:`,
[
  'A is true but R is false',
  'Both A and R are true but R is the correct explanation of A',
  'A is false but R is true',
  'Both A and R are true but R is NOT the correct explanation of A'
],
'a',
`**Assertion A:** Glycine ($\\mathrm{NH_2CH_2COOH}$) + $\\mathrm{Cl_2}$/red P (Hell-Volhard-Zelinsky reaction):
$$\\mathrm{NH_2CH_2COOH + Cl_2 \\xrightarrow{P} NH_2CHClCOOH + HCl}$$

Product = $\\alpha$-chloroglycine ($\\mathrm{NH_2CHClCOOH}$)

The $\\alpha$-carbon now has 4 different groups: $\\mathrm{NH_2}$, H, Cl, $\\mathrm{COOH}$ → **chiral carbon** ✓

Assertion A is **true**.

**Reason R:** A molecule with 2 chiral carbons is **NOT always** optically active — it can be a meso compound (internal plane of symmetry makes it optically inactive). Reason R is **false**. ✗

**Answer: Option (1) — A is true but R is false**`,
'tag_pblock12_2', src(2023, 'Apr', 11, 'Evening')),

// Q92 — ClO + NO2 → X; X + H2O → Y + Z; Answer: (3) X=ClONO2, Y=HOCl, Z=HNO3
mkSCQ('PB12-092', 'Hard',
`Identify X, Y and Z in the following reaction. (Equation not balanced)

$$\\mathrm{ClO + NO_2 \\rightarrow \\underline{X} \\xrightarrow{H_2O} \\underline{Y} + \\underline{Z}}$$`,
[
  '$\\mathrm{X = ClONO_2,\\ Y = HOCl,\\ Z = NO_2}$',
  '$\\mathrm{X = ClNO_2,\\ Y = HCl,\\ Z = HNO_3}$',
  '$\\mathrm{X = ClONO_2,\\ Y = HOCl,\\ Z = HNO_3}$',
  '$\\mathrm{X = ClNO_3,\\ Y = Cl_2,\\ Z = NO_2}$'
],
'c',
`**Step 1:** $\\mathrm{ClO + NO_2 \\rightarrow ClONO_2}$ (chlorine nitrate)

X = $\\mathrm{ClONO_2}$ (Cl–O–NO₂ structure)

**Step 2:** Hydrolysis of chlorine nitrate:
$$\\mathrm{ClONO_2 + H_2O \\rightarrow HOCl + HNO_3}$$

Y = $\\mathrm{HOCl}$ (hypochlorous acid)
Z = $\\mathrm{HNO_3}$ (nitric acid)

This reaction is important in stratospheric ozone depletion chemistry.

**Answer: Option (3) — $\\mathrm{X = ClONO_2}$, $\\mathrm{Y = HOCl}$, $\\mathrm{Z = HNO_3}$**`,
'tag_pblock12_2', src(2023, 'Jan', 31, 'Morning')),

// Q93 — Statements about Cl2 + O2 and chemical reactivity; Answer: (1) Both true
mkSCQ('PB12-093', 'Easy',
`Given below are two statements:

**Statement I:** Chlorine can easily combine with oxygen to form oxides; and the product has a tendency to explode.

**Statement II:** Chemical reactivity of an element can be determined by its reaction with oxygen and halogens.

In the light of the above statements, choose the correct answer from the options given below:`,
[
  'Both the statements I and II are true',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
  'Both the Statements I and II are false'
],
'a',
`**Statement I:** Chlorine forms oxides like $\\mathrm{Cl_2O}$, $\\mathrm{ClO_2}$, $\\mathrm{Cl_2O_7}$, etc. These chlorine oxides are unstable and have a tendency to **explode** (e.g., $\\mathrm{ClO_2}$ is explosive). ✓

**Statement II:** The reactivity of an element is commonly assessed by its reactions with oxygen (to form oxides) and halogens (to form halides). These reactions reveal the element's oxidising/reducing power. ✓

Both statements are correct.

**Answer: Option (1) — Both the statements I and II are true**`,
'tag_pblock12_2', src(2023, 'Feb', 1, 'Morning')),

// Q94 — Sum of OS of Br in bromic acid and perbromic acid; Answer: 12
mkNVT('PB12-094', 'Hard',
`Sum of oxidation states of bromine in bromic acid and perbromic acid is $\\_\\_\\_\\_$`,
{ integer_value: 12 },
`**Bromic acid:** $\\mathrm{HBrO_3}$

Oxidation state of Br: $+1 + x + 3(-2) = 0 \\Rightarrow x = +5$

**Perbromic acid:** $\\mathrm{HBrO_4}$

Oxidation state of Br: $+1 + x + 4(-2) = 0 \\Rightarrow x = +7$

Sum = $+5 + +7 = \\mathbf{12}$

**Answer: 12**`,
'tag_pblock12_2', src(2023, 'Feb', 1, 'Morning')),

// Q95 — Number of interhalogens with square pyramidal structure; Answer: 3
mkNVT('PB12-095', 'Hard',
`The number of inter halogens from the following having square pyramidal structure is:

$\\mathrm{ClF_3,\\ IF_7,\\ BrF_5,\\ BrF_3,\\ I_2Cl_6,\\ IF_5,\\ ClF,\\ ClF_5}$`,
{ integer_value: 3 },
`**Structures of interhalogens:**

| Compound | Geometry |
|---|---|
| $\\mathrm{ClF_3}$ | T-shaped |
| $\\mathrm{IF_7}$ | Pentagonal bipyramidal |
| $\\mathrm{BrF_5}$ | **Square pyramidal** ✓ |
| $\\mathrm{BrF_3}$ | T-shaped |
| $\\mathrm{I_2Cl_6}$ | Planar (like $\\mathrm{Al_2Cl_6}$) |
| $\\mathrm{IF_5}$ | **Square pyramidal** ✓ |
| $\\mathrm{ClF}$ | Linear (diatomic) |
| $\\mathrm{ClF_5}$ | **Square pyramidal** ✓ |

$\\mathrm{BrF_5}$, $\\mathrm{IF_5}$, $\\mathrm{ClF_5}$ all have $\\mathrm{AX_5E}$ geometry → square pyramidal.

**Answer: 3**`,
'tag_pblock12_2', src(2022, 'Jul', 28, 'Morning')),

// Q96 — Polar stratospheric clouds facilitate formation of; Answer: (2) HOCl
mkSCQ('PB12-096', 'Medium',
`Polar stratospheric clouds facilitate the formation of`,
[
  '$\\mathrm{ClONO_2}$',
  'HOCl',
  'ClO',
  '$\\mathrm{CH_4}$'
],
'b',
`On the surface of **polar stratospheric clouds (PSCs)**, heterogeneous reactions occur:

$$\\mathrm{ClONO_2 + H_2O \\xrightarrow{PSC} HOCl + HNO_3}$$

$$\\mathrm{ClONO_2 + HCl \\xrightarrow{PSC} Cl_2 + HNO_3}$$

The PSC surfaces facilitate the hydrolysis of chlorine nitrate to form **HOCl** (hypochlorous acid), which is a key intermediate in ozone depletion.

**Answer: Option (2) — HOCl**`,
'tag_pblock12_2', src(2022, 'Jun', 26, 'Morning')),

// Q97 — Assertion-Reason: Fluorine forms one oxoacid; Answer: (1) Both correct, R is correct explanation
mkSCQ('PB12-097', 'Easy',
`Given below are two statements: one is labelled as Assertion and the other is labelled as Reason.

**Assertion:** Fluorine forms one oxoacid.

**Reason:** Fluorine has smallest size amongst all halogens and is highly electronegative.

In the light of the above statements, choose the most appropriate answer from the options given below.`,
[
  'Both assertion and reason are correct and reason is the correct explanation of assertion.',
  'Both assertion and reason are correct but reason is not the correct explanation of assertion.',
  'Assertion is correct and reason is incorrect',
  'Assertion is incorrect and reason is correct'
],
'a',
`**Assertion:** Fluorine forms only **one oxoacid** — $\\mathrm{HOF}$ (hypofluorous acid). Other halogens form multiple oxoacids (+1, +3, +5, +7 states). ✓

**Reason:** Fluorine is the most electronegative element with the smallest size. Due to:
1. **No d-orbitals** — cannot expand octet → cannot form higher oxoacids
2. **Highest electronegativity** — cannot show positive oxidation states (needed for higher oxoacids)
3. **Small size** — limits coordination

These properties restrict F to forming only $\\mathrm{HOF}$. ✓

R correctly explains A.

**Answer: Option (1)**`,
'tag_pblock12_7', src(2022, 'Jun', 27, 'Evening')),

// Q98 — Hydrolysis of ClONO2 gives A and B; ClONO2 + HCl gives B and C; Answer: (1) HOCl, HNO3, Cl2
mkSCQ('PB12-098', 'Medium',
`On the surface of polar stratospheric clouds, hydrolysis of chlorine nitrate gives A and B while its reaction with HCl produces B and C. A, B and C are, respectively`,
[
  '$\\mathrm{HOCl,\\ HNO_3,\\ Cl_2}$',
  '$\\mathrm{Cl_2,\\ HNO_3,\\ HOCl}$',
  '$\\mathrm{HClO_2,\\ HNO_2,\\ HOCl}$',
  '$\\mathrm{HOCl,\\ HNO_2,\\ Cl_2O}$'
],
'a',
`**Reaction 1:** Hydrolysis of chlorine nitrate ($\\mathrm{ClONO_2}$):
$$\\mathrm{ClONO_2 + H_2O \\rightarrow HOCl + HNO_3}$$
A = $\\mathrm{HOCl}$, B = $\\mathrm{HNO_3}$

**Reaction 2:** $\\mathrm{ClONO_2}$ + HCl:
$$\\mathrm{ClONO_2 + HCl \\rightarrow Cl_2 + HNO_3}$$
B = $\\mathrm{HNO_3}$ ✓ (same B), C = $\\mathrm{Cl_2}$

A = $\\mathrm{HOCl}$, B = $\\mathrm{HNO_3}$, C = $\\mathrm{Cl_2}$

**Answer: Option (1) — $\\mathrm{HOCl}$, $\\mathrm{HNO_3}$, $\\mathrm{Cl_2}$**`,
'tag_pblock12_2', src(2022, 'Jun', 27, 'Evening')),

// Q99 — Incorrect statement about halogens; Answer: (3) Cl2 is more reactive than ClF
mkSCQ('PB12-099', 'Medium',
`The incorrect statement is:`,
[
  '$\\mathrm{F_2}$ is a stronger oxidizing agent than $\\mathrm{Cl_2}$ in aqueous solution.',
  'On hydrolysis ClF forms HOCl and HF.',
  '$\\mathrm{Cl_2}$ is more reactive than ClF.',
  '$\\mathrm{F_2}$ is more reactive than ClF.'
],
'c',
`**Analysis:**

**(1) TRUE** — $\\mathrm{F_2}$ has the highest reduction potential (+2.87 V) → strongest oxidising agent in aqueous solution. ✓

**(2) TRUE** — $\\mathrm{ClF + H_2O \\rightarrow HOCl + HF}$ ✓

**(3) FALSE** — **ClF is more reactive than $\\mathrm{Cl_2}$**. The Cl–F bond in ClF is polar and weaker than Cl–Cl, making ClF more reactive. Also, F is a better leaving group. ✗ → This is the incorrect statement.

**(4) TRUE** — $\\mathrm{F_2}$ is more reactive than ClF (F₂ has the highest reactivity among all halogens and interhalogens). ✓

**Answer: Option (3) — $\\mathrm{Cl_2}$ is more reactive than ClF**`,
'tag_pblock12_7', src(2021, 'Aug', 26, 'Morning')),

// Q100 — Number of halogens forming halic (V) acid; Answer: 3
mkNVT('PB12-100', 'Medium',
`The number of halogen(s) forming halic (V) acid is $\\_\\_\\_\\_$.`,
{ integer_value: 3 },
`**Halic (V) acids** are acids where the halogen is in +5 oxidation state: $\\mathrm{HXO_3}$

| Halogen | Halic (V) acid | Exists? |
|---|---|---|
| F | $\\mathrm{HFO_3}$ | **No** — F cannot show +5 (no d-orbitals, most electronegative) |
| Cl | $\\mathrm{HClO_3}$ (chloric acid) | **Yes** ✓ |
| Br | $\\mathrm{HBrO_3}$ (bromic acid) | **Yes** ✓ |
| I | $\\mathrm{HIO_3}$ (iodic acid) | **Yes** ✓ |

3 halogens (Cl, Br, I) form halic (V) acids.

**Answer: 3**`,
'tag_pblock12_7', src(2021, 'Aug', 31, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (PB12-091 to PB12-100)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
