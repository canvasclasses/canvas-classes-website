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

// Q31 — Correct statements about diborane; Answer: (2) (a) only
mkSCQ('PB11-031', 'Hard',
`Given below are the statements about diborane:

(a) Diborane is prepared by the oxidation of $\\mathrm{NaBH_4}$ with $\\mathrm{I_2}$

(b) Each boron atom is in $\\mathrm{sp^2}$ hybridized state

(c) Diborane has one bridged 3-centre-2-electron bond

(d) Diborane is a planar molecule

The option with correct statement(s) is`,
[
  '(c) and (d) only',
  '(a) only',
  '(c) only',
  '(a) and (b) only'
],
'b',
`**Analysis:**

**(a) TRUE** — Diborane is prepared by oxidation of $\\mathrm{NaBH_4}$ with $\\mathrm{I_2}$:
$$\\mathrm{2NaBH_4 + I_2 \\rightarrow B_2H_6 + 2NaI + H_2}$$ ✓

**(b) FALSE** — In $\\mathrm{B_2H_6}$, each B atom is **sp³ hybridized** (not sp²). The terminal H atoms use sp³ orbitals, and the bridging bonds involve sp³ orbitals of B. ✗

**(c) FALSE** — Diborane has **two** 3-centre-2-electron (3c-2e) bridging bonds, not one. ✗

**(d) FALSE** — Diborane is NOT planar. The bridging H atoms are above and below the plane of the four terminal H atoms and two B atoms. ✗

**Answer: Option (2) — (a) only**`,
'tag_pblock11_3', src(2021, 'Jul', 22, 'Morning')),

// Q32 — Incorrect statement about B2H6; Answer: (1)
mkSCQ('PB11-032', 'Medium',
`The incorrect statement about $\\mathrm{B_2H_6}$ is:`,
[
  'All B–H–B angles are of $120°$',
  'The two B–H–B bonds (bridged and terminal) are not of same length.',
  'Terminal B–H bonds have less p-character when compared to bridging bonds.',
  'Its fragment, $\\mathrm{BH_3}$, behaves as a Lewis acid.'
],
'a',
`**Analysis:**

**(1) INCORRECT** — The B–H–B bridging angle in $\\mathrm{B_2H_6}$ is approximately **84°** (not 120°). The 120° value would correspond to sp² hybridization, but the bridging geometry is more constrained. ✗ → This is the incorrect statement.

**(2) CORRECT** — Terminal B–H bonds (~119 pm) are shorter than bridging B–H–B bonds (~133 pm). ✓

**(3) CORRECT** — Terminal B–H bonds use sp³ orbitals with more s-character; bridging bonds involve 3c-2e bonds with more p-character. ✓

**(4) CORRECT** — $\\mathrm{BH_3}$ is electron deficient (only 6 electrons around B) → Lewis acid. ✓

**Answer: Option (1) — All B–H–B angles are of 120°**`,
'tag_pblock11_3', src(2021, 'Feb', 25, 'Morning')),

// Q33 — B2H6 reacts with O2 and H2O gives respectively; Answer: (4)
mkSCQ('PB11-033', 'Easy',
`Diborane ($\\mathrm{B_2H_6}$) reacts independently with $\\mathrm{O_2}$ and $\\mathrm{H_2O}$ to produce, respectively:`,
[
  '$\\mathrm{HBO_2}$ and $\\mathrm{H_3BO_3}$',
  '$\\mathrm{H_3BO_3}$ and $\\mathrm{B_2O_3}$',
  '$\\mathrm{B_2O_3}$ and $[\\mathrm{BH_4}]^-$',
  '$\\mathrm{B_2O_3}$ and $\\mathrm{H_3BO_3}$'
],
'd',
`**Reaction with $\\mathrm{O_2}$:**
$$\\mathrm{B_2H_6 + 3O_2 \\rightarrow B_2O_3 + 3H_2O}$$

Product: $\\mathrm{B_2O_3}$ (boron trioxide)

**Reaction with $\\mathrm{H_2O}$:**
$$\\mathrm{B_2H_6 + 6H_2O \\rightarrow 2B(OH)_3 + 6H_2}$$

$\\mathrm{B(OH)_3}$ = $\\mathrm{H_3BO_3}$ (boric acid)

**Answer: Option (4) — $\\mathrm{B_2O_3}$ and $\\mathrm{H_3BO_3}$**`,
'tag_pblock11_3', src(2019, 'Apr', 8, 'Morning')),

// Q34 — Correct statements about Group 13 oxides; Answer: (3)
mkSCQ('PB11-034', 'Medium',
`The correct statements among I to III regarding group 13 element oxides are:

(I) Boron trioxide is acidic.

(II) Oxides of aluminum and gallium are amphoteric.

(III) Oxides of indium and thallium are basic.`,
[
  '(I) and (III) only',
  '(I) and (II) only',
  '(I), (II) and (III)',
  '(II) and (III) only'
],
'c',
`**Nature of Group 13 oxides:**

| Element | Oxide | Nature |
|---|---|---|
| B | $\\mathrm{B_2O_3}$ | **Acidic** ✓ |
| Al | $\\mathrm{Al_2O_3}$ | **Amphoteric** ✓ |
| Ga | $\\mathrm{Ga_2O_3}$ | **Amphoteric** ✓ |
| In | $\\mathrm{In_2O_3}$ | **Basic** ✓ |
| Tl | $\\mathrm{Tl_2O_3}$ | **Basic** ✓ |

The acidic character decreases and basic character increases down the group.

All three statements are correct.

**Answer: Option (3) — (I), (II) and (III)**`,
'tag_pblock11_4', src(2019, 'Apr', 9, 'Evening')),

// Q35 — Number of 2c-2e and 3c-2e bonds in B2H6; Answer: (1) 4 and 2
mkSCQ('PB11-035', 'Easy',
`The number of 2-centre-2-electron and 3-centre-2-electron bonds in $\\mathrm{B_2H_6}$, respectively, are:`,
[
  '4 and 2',
  '2 and 4',
  '2 and 2',
  '2 and 1'
],
'a',
`Structure of $\\mathrm{B_2H_6}$ (diborane):

- **4 terminal B–H bonds:** Each is a normal 2-centre-2-electron (2c-2e) bond → **4 bonds of 2c-2e type**
- **2 bridging B–H–B bonds:** Each is a 3-centre-2-electron (3c-2e) bond (banana bond) → **2 bonds of 3c-2e type**

Total: 4 (2c-2e) + 2 (3c-2e) = 6 bonds, using 12 electrons (6 from 2B + 6 from 6H).

**Answer: Option (1) — 4 and 2**`,
'tag_pblock11_3', src(2019, 'Jan', 10, 'Evening')),

// Q36 — Correct statements about Group 13 elements; Answer: (1) A, C and E only
mkSCQ('PB11-036', 'Hard',
`The correct statements from the following are:

(A) The decreasing order of atomic radii of group 13 elements is $\\mathrm{Tl > In > Ga > Al > B}$.

(B) Down the group 13 electronegativity decreases from top to bottom.

(C) Al dissolves in dil. HCl and liberates $\\mathrm{H_2}$ but conc. $\\mathrm{HNO_3}$ renders Al passive by forming a protective oxide layer on the surface.

(D) All elements of group 13 exhibits highly stable +1 oxidation state.

(E) Hybridisation of Al in $[\\mathrm{Al(H_2O)_6}]^{3+}$ ion is $\\mathrm{sp^3d^2}$.

Choose the correct answer from the options given below:`,
[
  '(A), (C) and (E) only',
  '(A) and (C) only',
  '(C) and (E) only',
  '(A), (B), (C) and (E) only'
],
'a',
`**Analysis:**

**(A) TRUE** — Atomic radii order: Tl > In > Ga > Al > B. Note: Ga has a slightly smaller radius than Al due to d-orbital contraction, but the overall order given is correct. ✓

**(B) FALSE** — Electronegativity does NOT decrease uniformly down Group 13. Ga has higher electronegativity than Al due to d-orbital contraction. The trend is irregular. ✗

**(C) TRUE** — Al + dil. HCl → $\\mathrm{AlCl_3 + H_2}$ ✓; Conc. $\\mathrm{HNO_3}$ passivates Al by forming a thin $\\mathrm{Al_2O_3}$ layer. ✓

**(D) FALSE** — Only Tl shows highly stable +1 state. For Al and Ga, +1 is unstable. ✗

**(E) TRUE** — In $[\\mathrm{Al(H_2O)_6}]^{3+}$, Al is surrounded by 6 water ligands → octahedral → $\\mathrm{sp^3d^2}$ hybridization. ✓

**Answer: Option (1) — (A), (C) and (E) only**`,
'tag_pblock11_4', src(2024, 'Apr', 5, 'Evening')),

// Q37 — Statements about Group 13 halides hydrolysis; Answer: (4)
mkSCQ('PB11-037', 'Medium',
`Given below are two statements:

**Statement I:** Group 13 trivalent halides get easily hydrolysed by water due to their covalent nature.

**Statement II:** $\\mathrm{AlCl_3}$ upon hydrolysis in acidified aqueous solution forms octahedral $[\\mathrm{Al(H_2O)_6}]^{3+}$ ion.

In the light of the above statements, choose the correct answer from the options given below:`,
[
  'Statement I is true but statement II is false',
  'Statement I is false but statement II is true',
  'Both statement I and statement II are false',
  'Both statement I and statement II are true'
],
'd',
`**Statement I:** Group 13 trihalides (e.g., $\\mathrm{AlCl_3}$, $\\mathrm{GaCl_3}$) are covalent compounds. They readily hydrolyse in water because the central atom (Al, Ga, etc.) is electron deficient and accepts water molecules as Lewis bases. ✓

**Statement II:** When $\\mathrm{AlCl_3}$ dissolves in acidified aqueous solution:
$$\\mathrm{AlCl_3 + 6H_2O \\rightarrow [Al(H_2O)_6]^{3+} + 3Cl^-}$$
The $[\\mathrm{Al(H_2O)_6}]^{3+}$ ion is **octahedral** ($\\mathrm{sp^3d^2}$). ✓

Both statements are correct.

**Answer: Option (4)**`,
'tag_pblock11_4', src(2024, 'Jan', 31, 'Evening')),

// Q38 — Stability order of Group 13 in +1 OS; Answer: (1)
mkSCQ('PB11-038', 'Easy',
`Choose the correct stability order of group 13 elements in their +1 oxidation state.`,
[
  '$\\mathrm{Al < Ga < In < Tl}$',
  '$\\mathrm{Tl < In < Ga < Al}$',
  '$\\mathrm{In < Tl < Ga < Al}$',
  '$\\mathrm{Ga < In < Al < Tl}$'
],
'a',
`The stability of +1 oxidation state in Group 13 increases down the group due to the **inert pair effect**:

- **B:** +1 state essentially unknown
- **Al:** +1 state very unstable
- **Ga:** +1 state unstable
- **In:** +1 state known but less stable than +3
- **Tl:** +1 state most stable (Tl(I) is more stable than Tl(III))

Order: $\\mathrm{Al < Ga < In < Tl}$

**Answer: Option (1)**`,
'tag_pblock11_4', src(2022, 'Jun', 26, 'Morning')),

// Q39 — Ratio of water molecules in Mohr's salt and potash alum; Answer: 5 (×10^-1)
mkNVT('PB11-039', 'Medium',
`The ratio of number of water molecules in Mohr's salt and potash alum is $\\_\\_\\_\\_ \\times 10^{-1}$. (Integer answer)`,
{ integer_value: 5 },
`**Mohr's salt:** $\\mathrm{FeSO_4 \\cdot (NH_4)_2SO_4 \\cdot 6H_2O}$ → contains **6** water molecules

**Potash alum:** $\\mathrm{KAl(SO_4)_2 \\cdot 12H_2O}$ → contains **12** water molecules

$$\\text{Ratio} = \\frac{6}{12} = 0.5 = 5 \\times 10^{-1}$$

**Answer: 5**`,
'tag_pblock11_4', src(2021, 'Aug', 26, 'Morning')),

// Q40 — Al2O3 leached with alkali → X, X + gas Y → Z; Answer: (4)
mkSCQ('PB11-040', 'Medium',
`$\\mathrm{Al_2O_3}$ was leached with alkali to get X. The solution of X on passing of gas Y, forms Z.

X, Y and Z respectively are`,
[
  '$\\mathrm{X = Al(OH)_3,\\ Y = CO_2,\\ Z = Al_2O_3}$',
  '$\\mathrm{X = Na[Al(OH)_4],\\ Y = SO_2,\\ Z = Al_2O_3}$',
  '$\\mathrm{X = Al(OH)_3,\\ Y = SO_2,\\ Z = Al_2O_3 \\cdot xH_2O}$',
  '$\\mathrm{X = Na[Al(OH)_4],\\ Y = CO_2,\\ Z = Al_2O_3 \\cdot xH_2O}$'
],
'd',
`**Step 1:** $\\mathrm{Al_2O_3}$ leached with NaOH (alkali):
$$\\mathrm{Al_2O_3 + 2NaOH + 3H_2O \\rightarrow 2Na[Al(OH)_4]}$$

$\\mathrm{X = Na[Al(OH)_4]}$ (sodium aluminate)

**Step 2:** Passing $\\mathrm{CO_2}$ gas through sodium aluminate solution:
$$\\mathrm{Na[Al(OH)_4] + CO_2 \\rightarrow Al(OH)_3 \\downarrow + NaHCO_3}$$

The precipitate $\\mathrm{Al(OH)_3}$ on heating gives $\\mathrm{Al_2O_3 \\cdot xH_2O}$ (hydrated alumina).

$\\mathrm{Y = CO_2}$, $\\mathrm{Z = Al_2O_3 \\cdot xH_2O}$

This is the **Bayer process** for purification of bauxite.

**Answer: Option (4)**`,
'tag_pblock11_4', src(2021, 'Feb', 24, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (PB11-031 to PB11-040)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
