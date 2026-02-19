const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_pblock';
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

// Q1 — Assertion-Reason: Stability of +1 OS of Ga, In, Tl; Answer: (3)
mkSCQ('PB11-001', 'Medium',
`Give below are two statements: One is labelled as Assertion A and the other is labelled as Reason R:

**Assertion A:** The stability order of +1 oxidation state of Ga, In and Tl is $\\mathrm{Ga} < \\mathrm{In} < \\mathrm{Tl}$.

**Reason R:** The inert pair effect stabilizes the lower oxidation state down the group.

In the light of the above statements, choose the correct answer from the options given below:`,
[
  'A is true but R is false.',
  'A is false but R is true.',
  'Both A and R are true and R is the correct explanation of A.',
  'Both A and R are true but R is NOT the correct explanation of A.'
],
'c',
`**Assertion A:** The stability of +1 oxidation state increases down Group 13: $\\mathrm{Ga} < \\mathrm{In} < \\mathrm{Tl}$. This is correct — Tl(I) is the most stable.

**Reason R:** The inert pair effect — the reluctance of the ns² pair to participate in bonding — increases down the group due to poor shielding by d and f electrons. This stabilizes the lower (+1) oxidation state. ✓

R correctly explains A.

**Answer: Option (3)**`,
'tag_pblock11_4', src(2024, 'Apr', 8, 'Morning')),

// Q2 — Assertion-Reason: Boron high melting point; Answer: (2)
mkSCQ('PB11-002', 'Easy',
`Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R).

**Assertion (A):** Melting point of Boron (2453 K) is unusually high in group 13 elements.

**Reason (R):** Solid Boron has very strong crystalline lattice.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Both (A) and (R) are correct but (R) is not the correct explanation of (A)',
  'Both (A) and (R) are correct and (R) is the correct explanation of (A)',
  '(A) is true but (R) is false',
  '(A) is false but (R) is true'
],
'b',
`**Assertion (A):** Boron has an unusually high melting point (2453 K) compared to other Group 13 elements (Al: 933 K, Ga: 303 K, In: 430 K, Tl: 577 K). ✓

**Reason (R):** Boron exists as a covalent solid with an extremely strong three-dimensional crystalline lattice (icosahedral $\\mathrm{B_{12}}$ units). This strong lattice requires enormous energy to break, explaining the high melting point. ✓

R is the correct explanation of A.

**Answer: Option (2)**`,
'tag_pblock11_4', src(2024, 'Jan', 27, 'Morning')),

// Q3 — Relative stability of +1 OS of Group 13; Answer: (4)
mkSCQ('PB11-003', 'Easy',
`The relative stability of +1 oxidation state of group 13 elements follows the order`,
[
  '$\\mathrm{Al} < \\mathrm{Ga} < \\mathrm{Tl} < \\mathrm{In}$',
  '$\\mathrm{Tl} < \\mathrm{In} < \\mathrm{Ga} < \\mathrm{Al}$',
  '$\\mathrm{Ga} < \\mathrm{Al} < \\mathrm{In} < \\mathrm{Tl}$',
  '$\\mathrm{Al} < \\mathrm{Ga} < \\mathrm{In} < \\mathrm{Tl}$'
],
'd',
`The stability of +1 oxidation state in Group 13 increases down the group due to the **inert pair effect**. The ns² electrons become increasingly reluctant to participate in bonding as we go down the group.

Order: $\\mathrm{Al} < \\mathrm{Ga} < \\mathrm{In} < \\mathrm{Tl}$

Tl(I) is the most stable — Tl predominantly exists in +1 state.

**Answer: Option (4)**`,
'tag_pblock11_4', src(2019, 'Jan', 11, 'Evening')),

// Q4 — Match List: Compound-Uses (Iodoform, CCl4, CFC, DDT); Answer: (2)
mkSCQ('PB11-004', 'Easy',
`Match List I with List II

| | List-I (Compound) | | List-II (Uses) |
|---|---|---|---|
| A. | Iodoform | I. | Fire extinguisher |
| B. | Carbon tetrachloride | II. | Insecticide |
| C. | CFC | III. | Antiseptic |
| D. | DDT | IV. | Refrigerants |

Choose the correct answer from the options given below:`,
[
  'A-I, B-II, C-III, D-IV',
  'A-III, B-I, C-IV, D-II',
  'A-II, B-IV, C-I, D-III',
  'A-III, B-II, C-IV, D-I'
],
'b',
`- **Iodoform ($\\mathrm{CHI_3}$):** Used as an **antiseptic** (A-III)
- **Carbon tetrachloride ($\\mathrm{CCl_4}$):** Used as a **fire extinguisher** (B-I)
- **CFC (Chlorofluorocarbons):** Used as **refrigerants** (C-IV)
- **DDT:** Used as an **insecticide** (D-II)

**Answer: Option (2) — A-III, B-I, C-IV, D-II**`,
'tag_pblock11_5', src(2024, 'Apr', 6, 'Morning')),

// Q5 — Match List: CCl4, CH2Cl2, DDT, Freons uses; Answer: (2)
mkSCQ('PB11-005', 'Easy',
`Match List-I with List-II.

| | List-I (Compound) | | List-II (Use) |
|---|---|---|---|
| (A) | Carbon tetrachloride | (I) | Paint remover |
| (B) | Methylene chloride | (II) | Refrigerators and air conditioners |
| (C) | DDT | (III) | Fire extinguisher |
| (D) | Freons | (IV) | Non biodegradable insecticide |

Choose the correct answer from the options given below:`,
[
  '(A)-(I), (B)-(II), (C)-(III), (D)-(IV)',
  '(A)-(III), (B)-(I), (C)-(IV), (D)-(II)',
  '(A)-(IV), (B)-(III), (C)-(II), (D)-(I)',
  '(A)-(II), (B)-(III), (C)-(I), (D)-(IV)'
],
'b',
`- **Carbon tetrachloride ($\\mathrm{CCl_4}$):** Fire extinguisher (A-III)
- **Methylene chloride ($\\mathrm{CH_2Cl_2}$):** Paint remover (B-I)
- **DDT:** Non-biodegradable insecticide (C-IV)
- **Freons (CFCs):** Refrigerators and air conditioners (D-II)

**Answer: Option (2) — (A)-(III), (B)-(I), (C)-(IV), (D)-(II)**`,
'tag_pblock11_5', src(2024, 'Feb', 1, 'Evening')),

// Q6 — Assertion-Reason: CO neutral, CO2 acidic; Answer: (2)
mkSCQ('PB11-006', 'Easy',
`Given below are two statements, one is labelled as Assertion A and the other is labelled as Reason R.

**Assertion A:** Carbon forms two important oxides CO and $\\mathrm{CO_2}$. CO is neutral whereas $\\mathrm{CO_2}$ is acidic in nature.

**Reason R:** $\\mathrm{CO_2}$ can combine with water in a limited way to form carbonic acid, while CO is sparingly soluble in water.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Both A and R are correct but R is NOT the correct explanation of A.',
  'Both A and R are correct and R is the correct explanation of A.',
  'A is not correct but R is correct.',
  'A is correct but R is not correct.'
],
'b',
`**Assertion A:** CO is a neutral oxide (does not react with acids or bases to form salts). $\\mathrm{CO_2}$ is an acidic oxide (reacts with bases). ✓

**Reason R:** $\\mathrm{CO_2 + H_2O \\rightleftharpoons H_2CO_3}$ (carbonic acid) — this explains why $\\mathrm{CO_2}$ is acidic. CO is sparingly soluble in water and does not form an acid. ✓

R correctly explains A.

**Answer: Option (2)**`,
'tag_pblock11_5', src(2023, 'Jan', 25, 'Evening')),

// Q7 — C60 contains how many hexagons and pentagons; Answer: (4)
mkSCQ('PB11-007', 'Medium',
`$\\mathrm{C_{60}}$, an allotrope of carbon contains`,
[
  '12 hexagons and 20 pentagons.',
  '16 hexagons and 16 pentagons.',
  '18 hexagons and 14 pentagons.',
  '20 hexagons and 12 pentagons.'
],
'd',
`Buckminsterfullerene ($\\mathrm{C_{60}}$) has a soccer-ball structure consisting of:
- **20 hexagonal** rings
- **12 pentagonal** rings

Total carbon atoms: Each C is shared between rings. Using Euler's formula for polyhedra:
- 60 vertices (C atoms), 90 edges (bonds), 32 faces (20 hexagons + 12 pentagons)

The five-membered rings are fused only to six-membered rings (no two pentagons share an edge).

**Answer: Option (4) — 20 hexagons and 12 pentagons**`,
'tag_pblock11_2', src(2019, 'Apr', 9, 'Morning')),

// Q8 — Correct order of catenation; Answer: (3)
mkSCQ('PB11-008', 'Medium',
`The correct order of catenation is:`,
[
  '$\\mathrm{Ge} > \\mathrm{Sn} > \\mathrm{Si} > \\mathrm{C}$',
  '$\\mathrm{C} > \\mathrm{Sn} > \\mathrm{Si} \\approx \\mathrm{Ge}$',
  '$\\mathrm{C} > \\mathrm{Si} > \\mathrm{Ge} \\approx \\mathrm{Sn}$',
  '$\\mathrm{Si} > \\mathrm{Sn} > \\mathrm{C} > \\mathrm{Ge}$'
],
'c',
`**Catenation** is the ability of an element to form chains with itself. It depends on the strength of the E–E bond.

- C–C bond is very strong (346 kJ/mol) → highest catenation
- Si–Si bond is weaker (226 kJ/mol)
- Ge–Ge and Sn–Sn bonds are progressively weaker

Order: $\\mathrm{C} > \\mathrm{Si} > \\mathrm{Ge} \\approx \\mathrm{Sn}$

**Answer: Option (3)**`,
'tag_pblock11_5', src(2019, 'Apr', 10, 'Morning')),

// Q9 — C-C bond length maximum in; Answer: (4) diamond
mkSCQ('PB11-009', 'Easy',
`The C–C bond length is maximum in:`,
[
  '$\\mathrm{C_{70}}$',
  '$\\mathrm{C_{60}}$',
  'graphite',
  'diamond'
],
'd',
`C–C bond lengths in allotropes of carbon:

| Allotrope | Bond type | Bond length |
|---|---|---|
| Diamond | Pure $\\sigma$ (sp³) | **154 pm** (longest) |
| Graphite | Delocalized (sp²) | 142 pm |
| $\\mathrm{C_{60}}$ | Mixed (sp²) | 143.5 pm (6-6) / 145.1 pm (6-5) |
| $\\mathrm{C_{70}}$ | Mixed (sp²) | ~143–147 pm |

Pure single bonds (sp³ hybridization in diamond) are the longest C–C bonds.

**Answer: Option (4) — diamond**`,
'tag_pblock11_2', src(2019, 'Apr', 12, 'Evening')),

// Q10 — Ratio of silica to alumina in good quality cement; Answer: (4) 3
mkSCQ('PB11-010', 'Easy',
`For a good quality cement, the ratio of silica to alumina is found to be`,
[
  '1.5',
  '4.5',
  '2',
  '3'
],
'd',
`In Portland cement, the quality is determined by the ratio of silica ($\\mathrm{SiO_2}$) to alumina ($\\mathrm{Al_2O_3}$).

For **good quality cement**, the ratio of silica to alumina should be approximately **3** (i.e., $\\mathrm{SiO_2 : Al_2O_3 = 3 : 1}$).

This ratio ensures proper setting properties and strength of the cement.

**Answer: Option (4) — 3**`,
'tag_pblock11_6', src(2023, 'Apr', 15, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (PB11-001 to PB11-010)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
