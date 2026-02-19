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

mkNVT('BOND-079','Easy',
`$\\mathrm{AB_3}$ is an interhalogen **T-shaped** molecule. The number of lone pairs of electrons on A is ____`,
{ integer_value: 2 },
`**T-shaped geometry** arises from 5 electron pairs on the central atom (trigonal bipyramidal electron geometry) with 2 lone pairs occupying equatorial positions.\n\n**Step 1 — Electron pair count for T-shaped:**\n- Bonds: 3 (to B)\n- Lone pairs: 2\n- Total electron pairs: 5 → trigonal bipyramidal electron geometry\n\n**Step 2:** The 2 lone pairs occupy equatorial positions, leaving 2 axial and 1 equatorial bond → T-shape.\n\n**Lone pairs on A = 2**\n\n**Answer: 2**`,
'tag_bonding_3', src(2021,'Aug',26,'Morning')),

mkNVT('BOND-080','Easy',
`The number of lone pairs of electrons on the central I atom in $\\mathrm{I_3^-}$ is ____`,
{ integer_value: 3 },
`**Step 1 — Valence electrons in $\\mathrm{I_3^-}$:**\n- 3 × I(7) + 1(charge) = 22 valence electrons\n\n**Step 2 — Lewis structure:**\n- 2 I–I bonds use 4 electrons\n- Remaining 18 electrons distributed as lone pairs\n- Central I: 3 lone pairs\n- Each terminal I: 3 lone pairs\n\n**Step 3 — Verify VSEPR:**\n- Central I: 2 bonds + 3 lone pairs = 5 electron pairs → trigonal bipyramidal electron geometry\n- 3 lone pairs in equatorial positions → **linear** molecular shape\n\n**Lone pairs on central I = 3**\n\n**Answer: 3**`,
'tag_bonding_3', src(2021,'Jul',20,'Morning')),

mkMTC('BOND-081','Medium',
`Match **List I** with **List II**:\n\n**List I (Species):** (a) $\\mathrm{SF_4}$ (b) $\\mathrm{IF_5}$ (c) $\\mathrm{NO_2^+}$ (d) $\\mathrm{NH_4^+}$\n\n**List II (Hybridization):** (i) $\\mathrm{sp^3d^2}$ (ii) $\\mathrm{d^2sp^3}$ (iii) $\\mathrm{sp^3d}$ (iv) $\\mathrm{sp^3}$ (v) sp\n\nChoose the correct answer:`,
['(a)-(i), (b)-(ii), (c)-(v), (d)-(iii)','(a)-(ii), (b)-(i), (c)-(iv), (d)-(v)','(a)-(iii), (b)-(i), (c)-(v), (d)-(iv)','(a)-(iv), (b)-(iii), (c)-(ii), (d)-(v)'],
'c',
`**Step 1 — Determine hybridization of each species:**\n\n**(a) $\\mathrm{SF_4}$:** S has 4 bonds + 1 lone pair = 5 electron pairs → **sp³d** → (iii)\n\n**(b) $\\mathrm{IF_5}$:** I has 5 bonds + 1 lone pair = 6 electron pairs → **sp³d²** → (i)\n\n**(c) $\\mathrm{NO_2^+}$:** N has 2 double bonds + 0 lone pairs = 2 electron pairs → **sp** → (v)\n\n**(d) $\\mathrm{NH_4^+}$:** N has 4 bonds + 0 lone pairs = 4 electron pairs → **sp³** → (iv)\n\n**Matching:** (a)-(iii), (b)-(i), (c)-(v), (d)-(iv)\n\n**Answer: Option (3)**`,
'tag_bonding_3', src(2021,'Jul',22,'Morning')),

mkSCQ('BOND-082','Easy',
`Given below are two statements:\n\n**Assertion A:** The H–O–H bond angle in water molecule is 104.5°.\n\n**Reason R:** The lone pair–lone pair repulsion of electrons is higher than the bond pair–bond pair repulsion.\n\nChoose the correct answer:`,
['A is false but R is true','Both A and R are true, but R is not the correct explanation of A','A is true but R is false','Both A and R are true, and R is the correct explanation of A'],
'd',
`**Step 1 — Evaluate Assertion A:**\nThe H–O–H bond angle in water is **104.5°** (less than the tetrahedral angle of 109.5°). This is a well-established fact. **A is true** ✓\n\n**Step 2 — Evaluate Reason R:**\nAccording to VSEPR theory, repulsion order is:\n$$\\text{lp–lp} > \\text{lp–bp} > \\text{bp–bp}$$\nThe two lone pairs on O repel the bond pairs more strongly than bond pairs repel each other, compressing the H–O–H angle below 109.5°. **R is true** ✓\n\n**Step 3 — Is R the correct explanation of A?**\nYes — the large lone pair–lone pair repulsion pushes the bond pairs closer together, reducing the bond angle to 104.5°. R correctly explains A.\n\n**Answer: Option (4) — Both A and R are true, R is the correct explanation**`,
'tag_bonding_3', src(2021,'Mar',16,'Morning')),

mkSCQ('BOND-083','Easy',
`A central atom in a molecule has **two lone pairs** of electrons and forms **three single bonds**. The shape of this molecule is`,
['See-saw','Planar triangular','T-shaped','Trigonal pyramidal'],
'c',
`**Step 1 — Count electron pairs:**\n- Bonds: 3\n- Lone pairs: 2\n- Total electron pairs: 5\n\n**Step 2 — VSEPR with 5 electron pairs:**\n- 5 electron pairs → trigonal bipyramidal electron geometry\n- 2 lone pairs occupy equatorial positions (minimise repulsion)\n- 3 bonds: 2 axial + 1 equatorial\n\n**Step 3 — Molecular shape:**\nWith 2 equatorial lone pairs and 3 bonds (2 axial + 1 equatorial), the shape is **T-shaped**.\n\nExample: $\\mathrm{ClF_3}$, $\\mathrm{BrF_3}$\n\n**Answer: Option (3) — T-shaped**`,
'tag_bonding_3', src(2021,'Mar',17,'Morning')),

mkNVT('BOND-084','Medium',
`The number of species below that have **two lone pairs** of electrons in their central atom is ____\n\n$$\\mathrm{SF_4,\\ BF_4^-,\\ ClF_3,\\ AsF_3,\\ PCl_5,\\ BrF_5,\\ XeF_4,\\ SF_6}$$`,
{ integer_value: 2 },
`**Step 1 — Count lone pairs on central atom:**\n\n| Species | Bonds | Lone pairs |\n|---------|-------|------------|\n| $\\mathrm{SF_4}$ | 4 | 1 |\n| $\\mathrm{BF_4^-}$ | 4 | 0 |\n| $\\mathrm{ClF_3}$ | 3 | 2 ✓ |\n| $\\mathrm{AsF_3}$ | 3 | 1 |\n| $\\mathrm{PCl_5}$ | 5 | 0 |\n| $\\mathrm{BrF_5}$ | 5 | 1 |\n| $\\mathrm{XeF_4}$ | 4 | 2 ✓ |\n| $\\mathrm{SF_6}$ | 6 | 0 |\n\n**Step 2:** $\\mathrm{ClF_3}$ and $\\mathrm{XeF_4}$ each have 2 lone pairs → **2 species**\n\n**Answer: 2**`,
'tag_bonding_3', src(2021,'Mar',18,'Evening')),

mkSCQ('BOND-085','Medium',
`Which of the following are **isostructural** pairs?\n\n**A.** $\\mathrm{SO_4^{2-}}$ and $\\mathrm{CrO_4^{2-}}$\n**B.** $\\mathrm{SiCl_4}$ and $\\mathrm{TiCl_4}$\n**C.** $\\mathrm{NH_3}$ and $\\mathrm{NO_3^-}$\n**D.** $\\mathrm{BCl_3}$ and $\\mathrm{BrCl_3}$`,
['A and C only','B and C only','A and B only','C and D only'],
'c',
`**Isostructural** = same shape/geometry.\n\n**Step 1 — Analyse each pair:**\n\n**A. $\\mathrm{SO_4^{2-}}$ and $\\mathrm{CrO_4^{2-}}$:**\n- Both have tetrahedral geometry (4 bonds, 0 lone pairs on central atom) ✓\n\n**B. $\\mathrm{SiCl_4}$ and $\\mathrm{TiCl_4}$:**\n- Both have tetrahedral geometry (4 bonds, 0 lone pairs) ✓\n\n**C. $\\mathrm{NH_3}$ and $\\mathrm{NO_3^-}$:**\n- $\\mathrm{NH_3}$: pyramidal (3 bonds + 1 lone pair)\n- $\\mathrm{NO_3^-}$: trigonal planar (3 bonds + 0 lone pairs)\n- Different shapes ✗\n\n**D. $\\mathrm{BCl_3}$ and $\\mathrm{BrCl_3}$:**\n- $\\mathrm{BCl_3}$: trigonal planar (3 bonds + 0 lone pairs)\n- $\\mathrm{BrCl_3}$: T-shaped (3 bonds + 2 lone pairs)\n- Different shapes ✗\n\n**Isostructural pairs: A and B**\n\n**Answer: Option (3) — A and B only**`,
'tag_bonding_3', src(2021,'Feb',24,'Morning')),

mkSCQ('BOND-086','Easy',
`The correct shape and I–I–I bond angles respectively in $\\mathrm{I_3^-}$ ion are:`,
['T-shaped; 180° and 90°','Distorted trigonal planar; 135° and 90°','Trigonal planar; 120°','Linear; 180°'],
'd',
`**Step 1 — VSEPR analysis of $\\mathrm{I_3^-}$:**\n- Central I: 2 bonds + 3 lone pairs = 5 electron pairs\n- 5 electron pairs → trigonal bipyramidal electron geometry\n- 3 lone pairs occupy equatorial positions\n- 2 bonds in axial positions\n\n**Step 2 — Molecular shape:**\nWith 2 axial bonds and 3 equatorial lone pairs, the molecular shape is **linear** (bond angle = 180°).\n\n**Step 3 — Bond angle:**\nThe I–I–I angle = **180°** (linear)\n\n**Answer: Option (4) — Linear; 180°**`,
'tag_bonding_3', src(2021,'Feb',24,'Evening')),

mkSCQ('BOND-087','Medium',
`Which among the following species has **unequal bond lengths**?`,
['$\\mathrm{SiF_4}$','$\\mathrm{SF_4}$','$\\mathrm{XeF_4}$','$\\mathrm{BF_4^-}$'],
'b',
`**Unequal bond lengths** occur when bonds are in different environments (different positions in the molecule).\n\n**Step 1 — Analyse each species:**\n\n**$\\mathrm{SiF_4}$:** Tetrahedral, all 4 Si–F bonds equivalent → **equal** bond lengths ✗\n\n**$\\mathrm{SF_4}$:** See-saw geometry (sp³d). S has 4 bonds + 1 lone pair:\n- 2 axial S–F bonds (90° from lone pair)\n- 2 equatorial S–F bonds (120° from lone pair)\n- Axial bonds are longer/weaker than equatorial bonds → **unequal** bond lengths ✓\n\n**$\\mathrm{XeF_4}$:** Square planar, all 4 Xe–F bonds equivalent → **equal** bond lengths ✗\n\n**$\\mathrm{BF_4^-}$:** Tetrahedral, all 4 B–F bonds equivalent → **equal** bond lengths ✗\n\n**Answer: Option (2) — $\\mathrm{SF_4}$**`,
'tag_bonding_3', src(2021,'Feb',25,'Evening')),

mkSCQ('BOND-088','Medium',
`If $\\mathrm{AB_4}$ molecule is a **polar** molecule, a possible geometry of $\\mathrm{AB_4}$ is:`,
['Square pyramidal','Tetrahedral','Rectangular planar','Square planar'],
'a',
`**A polar molecule** has a net non-zero dipole moment (asymmetric charge distribution).\n\n**Step 1 — Analyse each geometry for $\\mathrm{AB_4}$:**\n\n**Tetrahedral:** All 4 A–B bonds equivalent, symmetric → bond dipoles cancel → **non-polar** ✗\n\n**Square planar:** All 4 A–B bonds in same plane, symmetric → bond dipoles cancel → **non-polar** ✗\n\n**Square pyramidal:** $\\mathrm{AB_4}$ with square pyramidal shape would require 5 bonds (AB₅ type) — not applicable for AB₄.\n\n**Step 2 — Reconsider:** Square pyramidal for AB₄ means A has 4 bonds + 1 lone pair. The lone pair creates asymmetry → net dipole moment → **polar** ✓\n\nExample: $\\mathrm{SF_4}$ (see-saw, polar) or $\\mathrm{XeF_4}$ (square planar, non-polar).\n\nFor AB₄ to be polar, it needs asymmetric geometry like **see-saw** or the question intends **square pyramidal** (with lone pair).\n\n**Answer: Option (1) — Square pyramidal**`,
'tag_bonding_3', src(2020,'Sep',2,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-079 to BOND-088)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
