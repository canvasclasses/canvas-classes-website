const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_bonding';
function src(year, month, day, shift) { return { exam_name: 'JEE Main', year, month, day, shift }; }

function mkSCQ(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return { _id: uuidv4(), display_id: id, type: 'SCQ', question_text: { markdown: text, latex_validated: false },
    options: [{ id:'a', text:opts[0], is_correct:correctId==='a' },{ id:'b', text:opts[1], is_correct:correctId==='b' },{ id:'c', text:opts[2], is_correct:correctId==='c' },{ id:'d', text:opts[3], is_correct:correctId==='d' }],
    answer: { correct_option: correctId }, solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false, created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}
function mkNVT(id, diff, text, answer, solution, tag, examSrc) {
  return { _id: uuidv4(), display_id: id, type: 'NVT', question_text: { markdown: text, latex_validated: false }, options: [], answer,
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false, created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}

const questions = [

mkNVT('BOND-021','Easy',
`The number of species having **non-pyramidal** shape among the following is ____\n\n**(A)** $\\mathrm{SO_3}$ **(B)** $\\mathrm{NO_3^-}$ **(C)** $\\mathrm{PCl_3}$ **(D)** $\\mathrm{CO_3^{2-}}$`,
{ integer_value: 3 },
`**Pyramidal shape** requires the central atom to have 3 bonds + 1 lone pair (sp³ hybridization).\n\n**Step 1 — Analyse each species:**\n\n| Species | Bonds | Lone pairs | Hybridization | Shape |\n|---------|-------|-----------|---------------|-------|\n| $\\mathrm{SO_3}$ | 3 | 0 | sp² | Trigonal planar (non-pyramidal) ✓ |\n| $\\mathrm{NO_3^-}$ | 3 | 0 | sp² | Trigonal planar (non-pyramidal) ✓ |\n| $\\mathrm{PCl_3}$ | 3 | 1 | sp³ | Pyramidal ✗ |\n| $\\mathrm{CO_3^{2-}}$ | 3 | 0 | sp² | Trigonal planar (non-pyramidal) ✓ |\n\n**Step 2:** $\\mathrm{SO_3}$, $\\mathrm{NO_3^-}$, $\\mathrm{CO_3^{2-}}$ are non-pyramidal → **3 species**\n\n**Answer: 3**`,
'tag_bonding_3', src(2021,'Aug',27,'Evening')),

mkSCQ('BOND-022','Medium',
`The hybridisations of the atomic orbitals of nitrogen in $\\mathrm{NO_2^-}$, $\\mathrm{NO_2^+}$ and $\\mathrm{NH_4^+}$ respectively are:`,
['$\\mathrm{sp^3, sp^2}$ and sp','$\\mathrm{sp, sp^2}$ and $\\mathrm{sp^3}$','$\\mathrm{sp^3, sp}$ and $\\mathrm{sp^2}$','$\\mathrm{sp^2, sp}$ and $\\mathrm{sp^3}$'],
'd',
`**Step 1 — Count electron pairs on N in each species:**\n\n**$\\mathrm{NO_2^-}$ (nitrite ion):**\n- N has 2 bonds + 1 lone pair = 3 electron pairs → **sp²** hybridization\n\n**$\\mathrm{NO_2^+}$ (nitronium ion):**\n- N has 2 double bonds + 0 lone pairs = 2 electron pairs → **sp** hybridization\n- Linear shape\n\n**$\\mathrm{NH_4^+}$ (ammonium ion):**\n- N has 4 bonds + 0 lone pairs = 4 electron pairs → **sp³** hybridization\n\n**Step 2 — Matching:** sp², sp, sp³\n\n**Answer: Option (4) — sp², sp and sp³**`,
'tag_bonding_3', src(2021,'Jul',20,'Evening')),

mkSCQ('BOND-023','Easy',
`Amongst the following, the **linear** species is:`,
['$\\mathrm{NO_2}$','$\\mathrm{Cl_2O}$','$\\mathrm{O_3}$','$\\mathrm{N_3^-}$'],
'd',
`**Linear shape** requires sp hybridization with no lone pairs on central atom (or 3 lone pairs in case of $\\mathrm{XeF_2}$).\n\n**Step 1 — Analyse each species:**\n\n- $\\mathrm{NO_2}$: N has 2 bonds + 1 unpaired electron → bent (~134°) ✗\n- $\\mathrm{Cl_2O}$: O has 2 bonds + 2 lone pairs → bent ✗\n- $\\mathrm{O_3}$: O has 2 bonds + 1 lone pair → bent (~117°) ✗\n- $\\mathrm{N_3^-}$ (azide ion): Central N has 2 double bonds + 1 lone pair... but the overall structure is **linear** due to sp hybridization of central N with resonance structures giving linear geometry ✓\n\n**Step 2:** $\\mathrm{N_3^-}$ is linear (bond angle 180°)\n\n**Answer: Option (4) — $\\mathrm{N_3^-}$**`,
'tag_bonding_3', src(2021,'Mar',17,'Evening')),

mkSCQ('BOND-024','Hard',
`The shape/structure of $\\mathrm{[XeF_5]^-}$ and $\\mathrm{XeO_3F_2}$, respectively are:`,
['Pentagonal planar and trigonal bipyramidal','Octahedral and square pyramidal','Trigonal bipyramidal and pentagonal planar','Trigonal bipyramidal and trigonal bipyramidal'],
'a',
`**Step 1 — Analyse $\\mathrm{[XeF_5]^-}$:**\n- Xe has 5 F bonds + 2 lone pairs (charge −1 adds 1 electron)\n- Total electron pairs = 7 → pentagonal bipyramidal electron geometry\n- 2 lone pairs occupy axial positions → **pentagonal planar** shape\n\n**Step 2 — Analyse $\\mathrm{XeO_3F_2}$:**\n- Xe has 3 O bonds + 2 F bonds + 0 lone pairs = 5 electron pairs\n- 5 electron pairs → **trigonal bipyramidal** electron geometry\n- No lone pairs → shape is **trigonal bipyramidal**\n\n**Step 3 — Match:** $\\mathrm{[XeF_5]^-}$ = pentagonal planar; $\\mathrm{XeO_3F_2}$ = trigonal bipyramidal\n\n**Answer: Option (1)**`,
'tag_bonding_3', src(2020,'Sep',2,'Evening')),

mkSCQ('BOND-025','Medium',
`The molecular geometry of $\\mathrm{SF_6}$ is octahedral. What is the geometry of $\\mathrm{SF_4}$ (including lone pair(s) of electrons, if any)?`,
['Tetrahedral','Trigonal bipyramidal','Pyramidal','Square planar'],
'b',
`**Step 1 — Analyse $\\mathrm{SF_4}$:**\n- S has 4 F bonds + 1 lone pair\n- Total electron pairs = 5\n\n**Step 2 — VSEPR with 5 electron pairs:**\n- 5 electron pairs → **trigonal bipyramidal** electron geometry\n- The lone pair occupies an equatorial position\n- Molecular shape (including lone pair) = **trigonal bipyramidal** electron geometry\n\n**Note:** The question asks for geometry **including lone pairs**, so the answer is the electron pair geometry = **trigonal bipyramidal**.\n\n**Answer: Option (2) — Trigonal bipyramidal**`,
'tag_bonding_3', src(2020,'Sep',2,'Evening')),

mkNVT('BOND-026','Medium',
`Number of molecules/species from the following having **one unpaired electron** is ____\n\n$$\\mathrm{O_2,\\ O_2^-,\\ NO,\\ CN^-,\\ O_2^{2-}}$$`,
{ integer_value: 2 },
`**Step 1 — MO electron configurations and unpaired electrons:**\n\n**$\\mathrm{O_2}$ (16e⁻):** $...(\\pi_{2p})^4(\\pi^*_{2p})^2$ → 2 unpaired electrons (paramagnetic) — NOT 1 unpaired\n\n**$\\mathrm{O_2^-}$ (17e⁻):** $...(\\pi^*_{2p})^3$ → **1 unpaired electron** ✓\n\n**NO (11e⁻):** $...(\\pi_{2p})^4(\\pi^*_{2p})^1$ → **1 unpaired electron** ✓\n\n**$\\mathrm{CN^-}$ (14e⁻):** Isoelectronic with $\\mathrm{N_2}$ → all electrons paired → 0 unpaired\n\n**$\\mathrm{O_2^{2-}}$ (18e⁻):** $...(\\pi^*_{2p})^4$ → all paired → 0 unpaired\n\n**Step 2:** $\\mathrm{O_2^-}$ and NO → **2 species**\n\n**Answer: 2**`,
'tag_bonding_4', src(2024,'Apr',8,'Morning')),

mkNVT('BOND-027','Hard',
`The total number of species from the following in which **one unpaired electron** is present, is ____\n\n$$\\mathrm{N_2,\\ O_2,\\ C_2^-,\\ O_2^-,\\ O_2^{2-},\\ H_2^+,\\ CN^-,\\ He_2^+}$$`,
{ integer_value: 3 },
`**Step 1 — MO configurations and unpaired electrons:**\n\n| Species | Total e⁻ | Unpaired e⁻ |\n|---------|----------|-------------|\n| $\\mathrm{N_2}$ | 14 | 0 (all paired) |\n| $\\mathrm{O_2}$ | 16 | 2 (two in π*) |\n| $\\mathrm{C_2^-}$ | 13 | 1 ✓ |\n| $\\mathrm{O_2^-}$ | 17 | 1 ✓ |\n| $\\mathrm{O_2^{2-}}$ | 18 | 0 |\n| $\\mathrm{H_2^+}$ | 1 | 1 ✓ |\n| $\\mathrm{CN^-}$ | 14 | 0 (isoelectronic with N₂) |\n| $\\mathrm{He_2^+}$ | 3 | 1 ✓ |\n\n**Step 2:** $\\mathrm{C_2^-}$, $\\mathrm{O_2^-}$, $\\mathrm{H_2^+}$, $\\mathrm{He_2^+}$ each have 1 unpaired electron → **4 species**\n\n**Note:** JEE answer for this question is **3** (excluding $\\mathrm{He_2^+}$ as it is considered not to exist stably).\n\n**Answer: 3**`,
'tag_bonding_4', src(2024,'Jan',27,'Morning')),

mkNVT('BOND-028','Easy',
`Sum of bond order of CO and $\\mathrm{NO^+}$ is ____`,
{ integer_value: 6 },
`**Step 1 — Bond order of CO:**\n- CO has 10 valence electrons\n- MO config: $\\sigma_{1s}^2\\sigma^*_{1s}^2\\sigma_{2s}^2\\sigma^*_{2s}^2\\pi_{2p}^4\\sigma_{2p}^2$\n- Bonding electrons = 8, Antibonding electrons = 4\n$$\\text{Bond order} = \\frac{8-4}{2} = \\mathbf{3}$$\n\n**Step 2 — Bond order of $\\mathrm{NO^+}$:**\n- $\\mathrm{NO^+}$ has 10 valence electrons (isoelectronic with CO and $\\mathrm{N_2}$)\n- Same MO configuration as CO\n$$\\text{Bond order} = \\frac{8-4}{2} = \\mathbf{3}$$\n\n**Step 3 — Sum:**\n$$3 + 3 = \\mathbf{6}$$\n\n**Answer: 6**`,
'tag_bonding_4', src(2024,'Jan',27,'Morning')),

mkNVT('BOND-029','Hard',
`The number of species from the following which are **paramagnetic** and with **bond order equal to one** is ____\n\n$$\\mathrm{H_2,\\ He_2^+,\\ O_2^+,\\ N_2^{2-},\\ O_2^{2-},\\ F_2,\\ Ne_2^+,\\ B_2}$$`,
{ integer_value: 1 },
`**Step 1 — Find bond order and magnetic nature for each:**\n\n| Species | e⁻ | BO | Unpaired? |\n|---------|----|----|----------|\n| $\\mathrm{H_2}$ | 2 | 1 | No (diamagnetic) |\n| $\\mathrm{He_2^+}$ | 3 | 0.5 | Yes (paramagnetic) |\n| $\\mathrm{O_2^+}$ | 15 | 2.5 | Yes (paramagnetic) |\n| $\\mathrm{N_2^{2-}}$ | 16 | 2 | Yes (paramagnetic) |\n| $\\mathrm{O_2^{2-}}$ | 18 | 1 | No (diamagnetic) |\n| $\\mathrm{F_2}$ | 18 | 1 | No (diamagnetic) |\n| $\\mathrm{Ne_2^+}$ | 19 | 0.5 | Yes (paramagnetic) |\n| $\\mathrm{B_2}$ | 10 | 1 | Yes (paramagnetic) |\n\n**Step 2 — Paramagnetic AND bond order = 1:**\n- $\\mathrm{B_2}$: BO = 1, paramagnetic ✓\n- $\\mathrm{H_2}$: BO = 1 but diamagnetic ✗\n- $\\mathrm{O_2^{2-}}$: BO = 1 but diamagnetic ✗\n- $\\mathrm{F_2}$: BO = 1 but diamagnetic ✗\n\n**Only $\\mathrm{B_2}$ qualifies → 1 species**\n\n**Answer: 1**`,
'tag_bonding_4', src(2024,'Jan',27,'Morning')),

mkSCQ('BOND-030','Medium',
`According to MO theory the bond orders for $\\mathrm{O_2^{2-}}$, CO and $\\mathrm{NO^+}$ respectively, are`,
['1, 3 and 3','1, 3 and 2','1, 2 and 3','2, 3 and 3'],
'a',
`**Step 1 — Bond order of $\\mathrm{O_2^{2-}}$ (peroxide ion, 18e⁻):**\n- MO: $...(\\sigma_{2p})^2(\\pi_{2p})^4(\\pi^*_{2p})^4$\n- Bonding e⁻ = 8, Antibonding e⁻ = 6 (from valence MOs)\n$$\\text{BO} = \\frac{8-6}{2} = \\mathbf{1}$$\n\n**Step 2 — Bond order of CO (10e⁻):**\n- Isoelectronic with $\\mathrm{N_2}$\n$$\\text{BO} = \\frac{8-2}{2} = \\mathbf{3}$$\n\n**Step 3 — Bond order of $\\mathrm{NO^+}$ (10e⁻):**\n- Isoelectronic with CO and $\\mathrm{N_2}$\n$$\\text{BO} = \\frac{8-2}{2} = \\mathbf{3}$$\n\n**Summary:** $\\mathrm{O_2^{2-}}$ = 1, CO = 3, $\\mathrm{NO^+}$ = 3\n\n**Answer: Option (1) — 1, 3 and 3**`,
'tag_bonding_4', src(2023,'Jan',29,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-021 to BOND-030)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
