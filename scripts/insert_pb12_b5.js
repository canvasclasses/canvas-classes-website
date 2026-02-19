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

// Q41 — Total acidic oxides from NO, N2O, B2O3, N2O5, CO, SO3, P4O10; Answer: (3) 3
mkSCQ('PB12-041', 'Medium',
`The total number of acidic oxides from the following list is:

$\\mathrm{NO,\\ N_2O,\\ B_2O_3,\\ N_2O_5,\\ CO,\\ SO_3,\\ P_4O_{10}}$`,
['5', '4', '3', '6'],
'b',
`**Nature of each oxide:**

| Oxide | Nature |
|---|---|
| NO | Neutral |
| $\\mathrm{N_2O}$ | Neutral |
| $\\mathrm{B_2O_3}$ | **Acidic** ✓ |
| $\\mathrm{N_2O_5}$ | **Acidic** (anhydride of $\\mathrm{HNO_3}$) ✓ |
| CO | Neutral |
| $\\mathrm{SO_3}$ | **Acidic** (anhydride of $\\mathrm{H_2SO_4}$) ✓ |
| $\\mathrm{P_4O_{10}}$ | **Acidic** (anhydride of $\\mathrm{H_3PO_4}$) ✓ |

Acidic oxides: $\\mathrm{B_2O_3}$, $\\mathrm{N_2O_5}$, $\\mathrm{SO_3}$, $\\mathrm{P_4O_{10}}$ = **4**

Answer key = (2) 4.

**Answer: Option (2) — 4**`,
'tag_pblock12_1', src(2022, 'Jul', 25, 'Evening')),

// Q42 — Match gas evolved in reactions; Answer: (3) A-II, B-IV, C-I, D-III
mkSCQ('PB12-042', 'Medium',
`Match List-I with List-II, match the gas evolved during each reaction.

| | List-I | | List-II |
|---|---|---|---|
| A | $\\mathrm{(NH_4)_2Cr_2O_7 \\xrightarrow{\\Delta}}$ | I | $\\mathrm{H_2}$ |
| B | $\\mathrm{KMnO_4 + HCl \\rightarrow}$ | II | $\\mathrm{N_2}$ |
| C | $\\mathrm{Al + NaOH + H_2O \\rightarrow}$ | III | $\\mathrm{O_2}$ |
| D | $\\mathrm{NaNO_3 \\xrightarrow{\\Delta}}$ | IV | $\\mathrm{Cl_2}$ |

Choose the correct answer from the options given below:`,
[
  'A-II, B-III, C-I, D-IV',
  'A-III, B-I, C-IV, D-II',
  'A-II, B-IV, C-I, D-III',
  'A-III, B-IV, C-I, D-II'
],
'c',
`**Reactions and gases evolved:**

- **A:** $\\mathrm{(NH_4)_2Cr_2O_7 \\xrightarrow{\\Delta} Cr_2O_3 + N_2\\uparrow + 4H_2O}$ → **$\\mathrm{N_2}$** (A-II)
- **B:** $\\mathrm{2KMnO_4 + 16HCl \\rightarrow 2KCl + 2MnCl_2 + 5Cl_2\\uparrow + 8H_2O}$ → **$\\mathrm{Cl_2}$** (B-IV)
- **C:** $\\mathrm{2Al + 2NaOH + 2H_2O \\rightarrow 2NaAlO_2 + 3H_2\\uparrow}$ → **$\\mathrm{H_2}$** (C-I)
- **D:** $\\mathrm{2NaNO_3 \\xrightarrow{\\Delta} 2NaNO_2 + O_2\\uparrow}$ → **$\\mathrm{O_2}$** (D-III)

**Answer: Option (3) — A-II, B-IV, C-I, D-III**`,
'tag_pblock12_3', src(2022, 'Jul', 28, 'Morning')),

// Q43 — Conc. HNO3 + I2 gives; Answer: (3) HIO3, NO2 and H2O
mkSCQ('PB12-043', 'Medium',
`Concentrated $\\mathrm{HNO_3}$ reacts with Iodine to give`,
[
  '$\\mathrm{HI,\\ NO_2}$ and $\\mathrm{H_2O}$',
  '$\\mathrm{HIO_2,\\ N_2O}$ and $\\mathrm{H_2O}$',
  '$\\mathrm{HIO_3,\\ NO_2}$ and $\\mathrm{H_2O}$',
  '$\\mathrm{HIO_4,\\ N_2O}$ and $\\mathrm{H_2O}$'
],
'c',
`Reaction of iodine with concentrated nitric acid:
$$\\mathrm{I_2 + 10HNO_3(conc) \\rightarrow 2HIO_3 + 10NO_2 + 4H_2O}$$

- $\\mathrm{HNO_3}$ oxidises $\\mathrm{I_2}$ to $\\mathrm{HIO_3}$ (iodic acid, I in +5 state)
- $\\mathrm{HNO_3}$ is reduced to $\\mathrm{NO_2}$

**Answer: Option (3) — $\\mathrm{HIO_3}$, $\\mathrm{NO_2}$ and $\\mathrm{H_2O}$**`,
'tag_pblock12_3', src(2022, 'Jul', 28, 'Evening')),

// Q44 — Oxide of N that damages plant leaves; Answer: (3) NO2
mkSCQ('PB12-044', 'Easy',
`Dinitrogen is a robust compound, but reacts at high altitude to form oxides. The oxide of nitrogen that can damage plant leaves and retard photosynthesis is`,
[
  'NO',
  '$\\mathrm{NO_3^-}$',
  '$\\mathrm{NO_2}$',
  '$\\mathrm{NO_2^-}$'
],
'c',
`**$\\mathrm{NO_2}$** (nitrogen dioxide) is a reddish-brown toxic gas that:
- Damages plant leaves by causing leaf spotting and necrosis
- Retards photosynthesis by interfering with chlorophyll
- Is a major component of photochemical smog
- Causes acid rain ($\\mathrm{NO_2 + H_2O \\rightarrow HNO_3 + HNO_2}$)

**Answer: Option (3) — $\\mathrm{NO_2}$**`,
'tag_pblock12_3', src(2022, 'Jul', 29, 'Evening')),

// Q45 — Number of amphoteric oxides from Na2O, As2O3, N2O, NO, Cl2O7; Answer: (2) 1
mkSCQ('PB12-045', 'Easy',
`Given below are the oxides:

$\\mathrm{Na_2O,\\ As_2O_3,\\ N_2O,\\ NO}$ and $\\mathrm{Cl_2O_7}$

Number of amphoteric oxides is:`,
['0', '1', '2', '3'],
'b',
`**Nature of each oxide:**

| Oxide | Nature |
|---|---|
| $\\mathrm{Na_2O}$ | Basic |
| $\\mathrm{As_2O_3}$ | **Amphoteric** ✓ (reacts with both acids and bases) |
| $\\mathrm{N_2O}$ | Neutral |
| $\\mathrm{NO}$ | Neutral |
| $\\mathrm{Cl_2O_7}$ | Acidic |

Only $\\mathrm{As_2O_3}$ is amphoteric.

**Answer: Option (2) — 1**`,
'tag_pblock12_1', src(2022, 'Jun', 24, 'Morning')),

// Q46 — Gas produced from NH4Cl + NaNO2 solution; Answer: (2) N2
mkSCQ('PB12-046', 'Easy',
`The gas produced by treating an aqueous solution of ammonium chloride with sodium nitrite is`,
[
  '$\\mathrm{NH_3}$',
  '$\\mathrm{N_2}$',
  '$\\mathrm{N_2O}$',
  '$\\mathrm{Cl_2}$'
],
'b',
`Reaction of ammonium chloride with sodium nitrite:
$$\\mathrm{NH_4Cl + NaNO_2 \\xrightarrow{\\Delta} N_2\\uparrow + 2H_2O + NaCl}$$

This is a laboratory method for preparing pure nitrogen gas. The $\\mathrm{NH_4^+}$ ion provides N in −3 state and $\\mathrm{NO_2^-}$ provides N in +3 state; they combine to give $\\mathrm{N_2}$ (0 oxidation state).

**Answer: Option (2) — $\\mathrm{N_2}$**`,
'tag_pblock12_3', src(2022, 'Jun', 27, 'Evening')),

// Q47 — Nitrogen gas obtained by thermal decomposition of; Answer: (3) Ba(N3)2
mkSCQ('PB12-047', 'Medium',
`Nitrogen gas is obtained by thermal decomposition of:`,
[
  '$\\mathrm{NaNO_2}$',
  '$\\mathrm{NaNO_3}$',
  '$\\mathrm{Ba(N_3)_2}$',
  '$\\mathrm{Ba(NO_3)_2}$'
],
'c',
`**Thermal decomposition reactions:**

- $\\mathrm{NaNO_2 \\xrightarrow{\\Delta}}$ does not simply give $\\mathrm{N_2}$
- $\\mathrm{NaNO_3 \\xrightarrow{\\Delta} NaNO_2 + O_2}$ (gives $\\mathrm{O_2}$, not $\\mathrm{N_2}$)
- $\\mathrm{Ba(N_3)_2 \\xrightarrow{\\Delta} Ba + 3N_2}$ → **gives $\\mathrm{N_2}$** ✓
- $\\mathrm{Ba(NO_3)_2 \\xrightarrow{\\Delta} BaO + NO_2 + O_2}$ (gives $\\mathrm{NO_2}$ and $\\mathrm{O_2}$)

Barium azide decomposes to give pure nitrogen gas.

**Answer: Option (3) — $\\mathrm{Ba(N_3)_2}$**`,
'tag_pblock12_3', src(2022, 'Jun', 28, 'Morning')),

// Q48 — Number of N2O, N2O3, N2O4, N2O5 having N-N bond; Answer: (3) 3
mkSCQ('PB12-048', 'Medium',
`Among the given oxides of nitrogen; $\\mathrm{N_2O}$, $\\mathrm{N_2O_3}$, $\\mathrm{N_2O_4}$ and $\\mathrm{N_2O_5}$, the number of compound(s) having N–N bond is`,
['1', '2', '3', '4'],
'c',
`**Structures and N–N bonds:**

| Oxide | Structure | N–N bond? |
|---|---|---|
| $\\mathrm{N_2O}$ | $\\mathrm{N=N=O}$ or $\\mathrm{N\\equiv N-O}$ | **Yes** (N=N or N≡N) ✓ |
| $\\mathrm{N_2O_3}$ | $\\mathrm{O_2N-NO}$ | **Yes** (N–N bond) ✓ |
| $\\mathrm{N_2O_4}$ | $\\mathrm{O_2N-NO_2}$ | **Yes** (N–N bond) ✓ |
| $\\mathrm{N_2O_5}$ | $\\mathrm{O_2N-O-NO_2}$ | **No** (N–O–N bridge, no direct N–N) ✗ |

3 compounds have N–N bonds: $\\mathrm{N_2O}$, $\\mathrm{N_2O_3}$, $\\mathrm{N_2O_4}$

**Answer: Option (3) — 3**`,
'tag_pblock12_3', src(2022, 'Jun', 28, 'Evening')),

// Q49 — Oxide without N-N bond; Answer: (3) N2O5
mkSCQ('PB12-049', 'Easy',
`The oxide without nitrogen-nitrogen bond is:`,
[
  '$\\mathrm{N_2O_4}$',
  '$\\mathrm{N_2O}$',
  '$\\mathrm{N_2O_5}$',
  '$\\mathrm{N_2O_3}$'
],
'c',
`**Structures:**

- $\\mathrm{N_2O_4}$: $\\mathrm{O_2N-NO_2}$ → has **N–N bond** ✗
- $\\mathrm{N_2O}$: $\\mathrm{N=N=O}$ → has **N=N bond** ✗
- $\\mathrm{N_2O_5}$: $\\mathrm{O_2N-O-NO_2}$ → **NO N–N bond** (connected via N–O–N bridge) ✓
- $\\mathrm{N_2O_3}$: $\\mathrm{O_2N-NO}$ → has **N–N bond** ✗

**Answer: Option (3) — $\\mathrm{N_2O_5}$**`,
'tag_pblock12_3', src(2021, 'Sep', 1, 'Evening')),

// Q50 — Chemical nature of oxide from conc HNO3 + P4O10 (4:1); Answer: (1) acidic
mkSCQ('PB12-050', 'Medium',
`Chemical nature of the nitrogen oxide compound obtained from a reaction of concentrated nitric acid and $\\mathrm{P_4O_{10}}$ (in 4:1 ratio) is:`,
['acidic', 'basic', 'amphoteric', 'neutral'],
'a',
`$\\mathrm{P_4O_{10}}$ is a powerful dehydrating agent. It reacts with concentrated $\\mathrm{HNO_3}$:

$$\\mathrm{4HNO_3 + P_4O_{10} \\rightarrow 4HPO_3 + 2N_2O_5}$$

The product is $\\mathrm{N_2O_5}$ (dinitrogen pentoxide), which is the anhydride of nitric acid:
$$\\mathrm{N_2O_5 + H_2O \\rightarrow 2HNO_3}$$

$\\mathrm{N_2O_5}$ is an **acidic** oxide.

**Answer: Option (1) — acidic**`,
'tag_pblock12_3', src(2021, 'Jul', 20, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (PB12-041 to PB12-050)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
