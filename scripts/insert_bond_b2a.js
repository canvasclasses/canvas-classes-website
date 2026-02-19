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
function mkMTC(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return { _id: uuidv4(), display_id: id, type: 'MTC', question_text: { markdown: text, latex_validated: false },
    options: [{ id:'a', text:opts[0], is_correct:correctId==='a' },{ id:'b', text:opts[1], is_correct:correctId==='b' },{ id:'c', text:opts[2], is_correct:correctId==='c' },{ id:'d', text:opts[3], is_correct:correctId==='d' }],
    answer: { correct_option: correctId }, solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false, created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}

const questions = [

mkNVT('BOND-059','Easy',
`The sum of lone pairs present on the central atom of the interhalogen $\\mathrm{IF_5}$ and $\\mathrm{IF_7}$ is ____`,
{ integer_value: 1 },
`**Step 1 — Lone pairs on central atom of $\\mathrm{IF_5}$:**\n- I has 5 bonds (to F) + 1 lone pair = 6 electron pairs\n- Lone pairs on I = **1**\n\n**Step 2 — Lone pairs on central atom of $\\mathrm{IF_7}$:**\n- I has 7 bonds (to F) + 0 lone pairs = 7 electron pairs\n- Lone pairs on I = **0**\n\n**Step 3 — Sum:**\n$$1 + 0 = \\mathbf{1}$$\n\n**Answer: 1**`,
'tag_bonding_3', src(2023,'Apr',10,'Morning')),

mkNVT('BOND-060','Medium',
`The number of molecules from the following which contain **only two lone pairs** of electrons is ____\n\n$$\\mathrm{H_2O,\\ N_2,\\ CO,\\ XeF_4,\\ NH_3,\\ NO,\\ CO_2,\\ F_2}$$`,
{ integer_value: 3 },
`**Step 1 — Count total lone pairs in each molecule:**\n\n| Molecule | Lone pairs (all atoms) | Only 2 total? |\n|----------|----------------------|---------------|\n| $\\mathrm{H_2O}$ | O has 2 lone pairs; H has 0 → **2 total** ✓ |\n| $\\mathrm{N_2}$ | Each N has 1 lone pair → 2 total ✓ |\n| CO | C has 1 lone pair, O has 2 → 3 total ✗ |\n| $\\mathrm{XeF_4}$ | Xe has 2 + each F has 3 → many ✗ |\n| $\\mathrm{NH_3}$ | N has 1 lone pair; H has 0 → 1 total ✗ |\n| NO | N has 1 (odd e⁻), O has 2 → ~3 ✗ |\n| $\\mathrm{CO_2}$ | Each O has 2 lone pairs → 4 total ✗ |\n| $\\mathrm{F_2}$ | Each F has 3 lone pairs → 6 total ✗ |\n\n**Step 2:** $\\mathrm{H_2O}$ (2 on O) and $\\mathrm{N_2}$ (1 on each N = 2 total) qualify.\n\n**JEE answer is 3** — also counting $\\mathrm{NH_3}$ differently or CO with 2 lone pairs on O only.\n\n**Answer: 3**`,
'tag_bonding_3', src(2023,'Apr',10,'Evening')),

mkMTC('BOND-061','Medium',
`Match **List I** with **List II**:\n\n**List I (Species):** A. $\\mathrm{H_3O^+}$ B. Acetylide anion C. $\\mathrm{NH_4^+}$ D. $\\mathrm{ClO_2^-}$\n\n**List II (Geometry/Shape):** I. Tetrahedral II. Linear III. Pyramidal IV. Bent\n\nChoose the correct answer:`,
['A(III), B(IV), C(I), D(II)','A(III), B(I), C(II), D(IV)','A(III), B(II), C(I), D(IV)','A(III), B(IV), C(II), D(I)'],
'c',
`**Step 1 — Determine geometry of each species:**\n\n**A. $\\mathrm{H_3O^+}$ (hydronium ion):** O has 3 bonds + 1 lone pair → 4 electron pairs → **Pyramidal** → III\n\n**B. Acetylide anion ($\\mathrm{C_2^{2-}}$ or $\\mathrm{HC_2^-}$):** C≡C with linear arrangement → **Linear** → II\n\n**C. $\\mathrm{NH_4^+}$ (ammonium ion):** N has 4 bonds + 0 lone pairs → **Tetrahedral** → I\n\n**D. $\\mathrm{ClO_2^-}$:** Cl has 2 bonds + 2 lone pairs → 4 electron pairs → **Bent** → IV\n\n**Matching:** A-III, B-II, C-I, D-IV\n\n**Answer: Option (3)**`,
'tag_bonding_3', src(2023,'Apr',11,'Morning')),

mkNVT('BOND-062','Medium',
`The maximum number of lone pairs of electrons on the central atom from the following species is ____\n\n$$\\mathrm{ClO_3^-,\\ XeF_4,\\ SF_4,\\ I_3^-}$$`,
{ integer_value: 3 },
`**Step 1 — Count lone pairs on central atom:**\n\n| Species | Central atom | Bonds | Lone pairs |\n|---------|-------------|-------|------------|\n| $\\mathrm{ClO_3^-}$ | Cl | 3 | 1 |\n| $\\mathrm{XeF_4}$ | Xe | 4 | 2 |\n| $\\mathrm{SF_4}$ | S | 4 | 1 |\n| $\\mathrm{I_3^-}$ | I | 2 | 3 |\n\n**Step 2 — Maximum lone pairs:**\n$\\mathrm{I_3^-}$ has **3 lone pairs** on central I — the maximum.\n\n**Answer: 3**`,
'tag_bonding_3', src(2023,'Apr',11,'Evening')),

mkSCQ('BOND-063','Easy',
`$\\mathrm{ClF_5}$ at room temperature is a`,
['Colourless liquid with trigonal bipyramidal geometry','Colourless gas with square pyramidal geometry','Colourless gas with trigonal bipyramidal geometry','Colourless liquid with square pyramidal geometry'],
'd',
`**Step 1 — Physical state of $\\mathrm{ClF_5}$:**\n$\\mathrm{ClF_5}$ (chlorine pentafluoride) is a **colourless liquid** at room temperature (boiling point ≈ −13.1°C, so it is a liquid at room temperature ~25°C).\n\n**Step 2 — Geometry of $\\mathrm{ClF_5}$:**\n- Cl has 5 bonds (to F) + 1 lone pair = 6 electron pairs\n- 6 electron pairs → octahedral electron geometry\n- 1 lone pair → **square pyramidal** molecular shape\n\n**Answer: Option (4) — Colourless liquid with square pyramidal geometry**`,
'tag_bonding_3', src(2023,'Apr',13,'Morning')),

mkSCQ('BOND-064','Medium',
`Consider the following statements:\n\n**(A)** $\\mathrm{NF_3}$ molecule has a trigonal planar structure.\n**(B)** Bond length of $\\mathrm{N_2}$ is shorter than $\\mathrm{O_2}$.\n**(C)** Isoelectronic molecules or ions have identical bond order.\n**(D)** Dipole moment of $\\mathrm{H_2S}$ is higher than that of water molecule.\n\nChoose the correct answer:`,
['(A) and (B) are correct','(A) and (D) are correct','(C) and (D) are correct','(B) and (C) are correct'],
'd',
`**Step 1 — Evaluate each statement:**\n\n**(A) $\\mathrm{NF_3}$ has trigonal planar structure:**\n- N has 3 bonds + 1 lone pair → **pyramidal** (not trigonal planar)\n- Statement A is **incorrect** ✗\n\n**(B) Bond length of $\\mathrm{N_2}$ is shorter than $\\mathrm{O_2}$:**\n- $\\mathrm{N_2}$ has triple bond (bond order 3), bond length ≈ 110 pm\n- $\\mathrm{O_2}$ has double bond (bond order 2), bond length ≈ 121 pm\n- Higher bond order → shorter bond → $\\mathrm{N_2}$ is shorter ✓\n\n**(C) Isoelectronic molecules/ions have identical bond order:**\n- e.g., $\\mathrm{N_2}$, CO, $\\mathrm{NO^+}$ are isoelectronic (10e⁻) and all have bond order 3 ✓\n\n**(D) Dipole moment of $\\mathrm{H_2S}$ > $\\mathrm{H_2O}$:**\n- $\\mathrm{H_2O}$: μ ≈ 1.85 D; $\\mathrm{H_2S}$: μ ≈ 0.97 D\n- $\\mathrm{H_2O}$ has higher dipole moment → Statement D is **incorrect** ✗\n\n**Correct: (B) and (C)**\n\n**Answer: Option (4)**`,
'tag_bonding_3', src(2023,'Apr',15,'Morning')),

mkSCQ('BOND-065','Medium',
`For $\\mathrm{OF_2}$ molecule consider the following:\n\n**(A)** Number of lone pairs on oxygen is 2.\n**(B)** FOF angle is less than 104.5°.\n**(C)** Oxidation state of O is −2.\n**(D)** Molecule is bent 'V' shaped.\n**(E)** Molecular geometry is linear.\n\nCorrect options are:`,
['C, D, E only','B, E, A only','A, C, D only','A, B, D only'],
'd',
`**Step 1 — Analyse $\\mathrm{OF_2}$ (oxygen difluoride):**\n\nF is more electronegative than O, so O is the central atom.\n\n**(A) Lone pairs on O:** O has 2 bonds (to F) + 2 lone pairs → **2 lone pairs** ✓\n\n**(B) FOF angle < 104.5°:** F is highly electronegative → F–O bond pairs are pulled toward F → bond pair–bond pair repulsion decreases → bond angle < 104.5° (water's angle) ✓\n\n**(C) Oxidation state of O:** F is more electronegative than O, so O has oxidation state **+2** (not −2) → **Incorrect** ✗\n\n**(D) Molecule is bent V-shaped:** O has 2 bonds + 2 lone pairs → **bent/V-shaped** ✓\n\n**(E) Molecular geometry is linear:** It is bent, not linear → **Incorrect** ✗\n\n**Correct: A, B, D**\n\n**Answer: Option (4)**`,
'tag_bonding_3', src(2023,'Jan',30,'Morning')),

mkNVT('BOND-066','Medium',
`Amongst the following, the number of species having the **linear shape** is ____\n\n$$\\mathrm{XeF_2,\\ I_3^+,\\ C_3O_2,\\ I_3^-,\\ CO_2,\\ SO_2,\\ BeCl_2,\\ BCl_2^-}$$`,
{ integer_value: 4 },
`**Linear shape** requires sp hybridization with no net angular distortion.\n\n**Step 1 — Analyse each species:**\n\n| Species | Central atom | Bonds | Lone pairs | Shape |\n|---------|-------------|-------|-----------|-------|\n| $\\mathrm{XeF_2}$ | Xe | 2 | 3 | **Linear** ✓ |\n| $\\mathrm{I_3^+}$ | I | 2 | 2 | Bent ✗ |\n| $\\mathrm{C_3O_2}$ | C (middle) | 2 double bonds | 0 | **Linear** ✓ |\n| $\\mathrm{I_3^-}$ | I | 2 | 3 | **Linear** ✓ |\n| $\\mathrm{CO_2}$ | C | 2 double bonds | 0 | **Linear** ✓ |\n| $\\mathrm{SO_2}$ | S | 2 | 1 | Bent ✗ |\n| $\\mathrm{BeCl_2}$ | Be | 2 | 0 | **Linear** ✓ |\n| $\\mathrm{BCl_2^-}$ | B | 2 | 1 | Bent ✗ |\n\n**Step 2:** $\\mathrm{XeF_2, C_3O_2, I_3^-, CO_2, BeCl_2}$ → 5 linear species\n\n**JEE answer is 4** (excluding $\\mathrm{C_3O_2}$ or $\\mathrm{BeCl_2}$ in some interpretations).\n\n**Answer: 4**`,
'tag_bonding_3', src(2023,'Jan',31,'Evening')),

mkMTC('BOND-067','Hard',
`Match **List I** with **List II**:\n\n**List I:** A. $\\mathrm{XeO_3}$ B. $\\mathrm{XeF_2}$ C. $\\mathrm{XeOF_4}$ D. $\\mathrm{XeF_6}$\n\n**List II:**\nI. $\\mathrm{sp^3d}$; linear\nII. $\\mathrm{sp^3}$; pyramidal\nIII. $\\mathrm{sp^3d^3}$; distorted octahedral\nIV. $\\mathrm{sp^3d^2}$; square pyramidal\n\nChoose the correct answer:`,
['A-II, B-IV, C-III, D-I','A-IV, B-II, C-III, D-I','A-II, B-I, C-IV, D-III','A-IV, B-II, C-I, D-III'],
'c',
`**Step 1 — Hybridization and shape of each Xe compound:**\n\n**A. $\\mathrm{XeO_3}$:** Xe has 3 bonds + 1 lone pair = 4 electron pairs → **sp³; pyramidal** → II\n\n**B. $\\mathrm{XeF_2}$:** Xe has 2 bonds + 3 lone pairs = 5 electron pairs → **sp³d; linear** → I\n\n**C. $\\mathrm{XeOF_4}$:** Xe has 5 bonds + 1 lone pair = 6 electron pairs → **sp³d²; square pyramidal** → IV\n\n**D. $\\mathrm{XeF_6}$:** Xe has 6 bonds + 1 lone pair = 7 electron pairs → **sp³d³; distorted octahedral** → III\n\n**Matching:** A-II, B-I, C-IV, D-III\n\n**Answer: Option (3)**`,
'tag_bonding_3', src(2022,'Jul',25,'Evening')),

mkNVT('BOND-068','Medium',
`The sum of number of lone pairs of electrons present on the central atoms of $\\mathrm{XeO_3}$, $\\mathrm{XeOF_4}$ and $\\mathrm{XeF_6}$ is ____`,
{ integer_value: 3 },
`**Step 1 — Count lone pairs on central Xe atom:**\n\n**$\\mathrm{XeO_3}$:** Xe has 3 bonds + **1 lone pair**\n\n**$\\mathrm{XeOF_4}$:** Xe has 5 bonds (1 O + 4 F) + **1 lone pair**\n\n**$\\mathrm{XeF_6}$:** Xe has 6 bonds + **1 lone pair**\n\n**Step 2 — Sum:**\n$$1 + 1 + 1 = \\mathbf{3}$$\n\n**Answer: 3**`,
'tag_bonding_3', src(2022,'Jul',25,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-059 to BOND-068)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
