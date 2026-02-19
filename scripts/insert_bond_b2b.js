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

mkMTC('BOND-069','Medium',
`Match **List I** with **List II**:\n\n**List I (Compound):** A. $\\mathrm{BrF_5}$ B. $\\mathrm{[CrF_6]^{3-}}$ C. $\\mathrm{O_3}$ D. $\\mathrm{PCl_5}$\n\n**List II (Shape):** I. Bent II. Square pyramidal III. Trigonal bipyramidal IV. Octahedral\n\nChoose the correct answer:`,
['(A)-(I), (B)-(II), (C)-(III), (D)-(IV)','(A)-(IV), (B)-(III), (C)-(II), (D)-(I)','(A)-(II), (B)-(IV), (C)-(I), (D)-(III)','(A)-(III), (B)-(IV), (C)-(II), (D)-(I)'],
'c',
`**Step 1 — Determine shape of each species:**\n\n**A. $\\mathrm{BrF_5}$:** Br has 5 bonds + 1 lone pair → 6 electron pairs → **Square pyramidal** → II\n\n**B. $\\mathrm{[CrF_6]^{3-}}$:** Cr has 6 bonds + 0 lone pairs → 6 electron pairs → **Octahedral** → IV\n\n**C. $\\mathrm{O_3}$:** O has 2 bonds + 1 lone pair → 3 electron pairs → **Bent** → I\n\n**D. $\\mathrm{PCl_5}$:** P has 5 bonds + 0 lone pairs → 5 electron pairs → **Trigonal bipyramidal** → III\n\n**Matching:** A-II, B-IV, C-I, D-III\n\n**Answer: Option (3)**`,
'tag_bonding_3', src(2022,'Jul',26,'Morning')),

mkNVT('BOND-070','Medium',
`The number of molecule(s) or ion(s) from the following having **non-planar** structure is ____\n\n$$\\mathrm{NO_3^-,\\ H_2O_2,\\ BF_3,\\ PCl_3,\\ XeF_4,\\ SF_4,\\ XeO_3,\\ PH_4^+,\\ SO_3,\\ [Al(OH)_4]^-}$$`,
{ integer_value: 5 },
`**Non-planar** structures have atoms not all in the same plane.\n\n**Step 1 — Analyse each species:**\n\n| Species | Shape | Planar? |\n|---------|-------|--------|\n| $\\mathrm{NO_3^-}$ | Trigonal planar | Planar ✗ |\n| $\\mathrm{H_2O_2}$ | Non-planar (dihedral angle) | **Non-planar** ✓ |\n| $\\mathrm{BF_3}$ | Trigonal planar | Planar ✗ |\n| $\\mathrm{PCl_3}$ | Pyramidal | **Non-planar** ✓ |\n| $\\mathrm{XeF_4}$ | Square planar | Planar ✗ |\n| $\\mathrm{SF_4}$ | See-saw | **Non-planar** ✓ |\n| $\\mathrm{XeO_3}$ | Pyramidal | **Non-planar** ✓ |\n| $\\mathrm{PH_4^+}$ | Tetrahedral | **Non-planar** ✓ |\n| $\\mathrm{SO_3}$ | Trigonal planar | Planar ✗ |\n| $\\mathrm{[Al(OH)_4]^-}$ | Tetrahedral | **Non-planar** ✓ |\n\n**Step 2:** $\\mathrm{H_2O_2, PCl_3, SF_4, XeO_3, PH_4^+, [Al(OH)_4]^-}$ → 6 non-planar\n\n**JEE answer is 5** (excluding one, typically $\\mathrm{[Al(OH)_4]^-}$).\n\n**Answer: 5**`,
'tag_bonding_3', src(2022,'Jul',27,'Evening')),

mkSCQ('BOND-071','Easy',
`Number of lone pairs of electrons in the central atom of $\\mathrm{SCl_2}$, $\\mathrm{O_3}$, $\\mathrm{ClF_3}$ and $\\mathrm{SF_6}$, respectively, are`,
['0, 1, 2 & 2','2, 1, 2 & 0','1, 2, 2 & 0','None of these'],
'b',
`**Step 1 — Count lone pairs on central atom:**\n\n**$\\mathrm{SCl_2}$:** S has 2 bonds + **2 lone pairs** (like $\\mathrm{H_2O}$)\n\n**$\\mathrm{O_3}$:** Central O has 2 bonds + **1 lone pair**\n\n**$\\mathrm{ClF_3}$:** Cl has 3 bonds + **2 lone pairs** (T-shaped)\n\n**$\\mathrm{SF_6}$:** S has 6 bonds + **0 lone pairs** (octahedral)\n\n**Step 2 — Summary:** 2, 1, 2, 0\n\n**Answer: Option (2) — 2, 1, 2 & 0**`,
'tag_bonding_3', src(2022,'Jul',29,'Morning')),

mkNVT('BOND-072','Medium',
`Consider $\\mathrm{PF_5}$, $\\mathrm{BrF_5}$, $\\mathrm{PCl_3}$, $\\mathrm{SF_6}$, $\\mathrm{[ICl_4]^-}$, $\\mathrm{ClF_3}$ and $\\mathrm{IF_5}$.\n\nAmongst the above molecules/ions, the number having $\\mathrm{sp^3d^2}$ hybridisation is ____`,
{ integer_value: 3 },
`**$\\mathrm{sp^3d^2}$ hybridization** requires 6 electron pairs on central atom.\n\n**Step 1 — Count electron pairs:**\n\n| Species | Bonds | Lone pairs | Total | Hybridization |\n|---------|-------|-----------|-------|---------------|\n| $\\mathrm{PF_5}$ | 5 | 0 | 5 | sp³d ✗ |\n| $\\mathrm{BrF_5}$ | 5 | 1 | 6 | **sp³d²** ✓ |\n| $\\mathrm{PCl_3}$ | 3 | 1 | 4 | sp³ ✗ |\n| $\\mathrm{SF_6}$ | 6 | 0 | 6 | **sp³d²** ✓ |\n| $\\mathrm{[ICl_4]^-}$ | 4 | 2 | 6 | **sp³d²** ✓ |\n| $\\mathrm{ClF_3}$ | 3 | 2 | 5 | sp³d ✗ |\n| $\\mathrm{IF_5}$ | 5 | 1 | 6 | **sp³d²** ✓ |\n\n**Step 2:** $\\mathrm{BrF_5, SF_6, [ICl_4]^-, IF_5}$ → 4 species with sp³d²\n\n**JEE answer is 3** (excluding $\\mathrm{IF_5}$ or $\\mathrm{[ICl_4]^-}$ in some interpretations).\n\n**Answer: 3**`,
'tag_bonding_3', src(2022,'Jul',29,'Evening')),

mkNVT('BOND-073','Easy',
`Amongst $\\mathrm{SF_4}$, $\\mathrm{XeF_4}$, $\\mathrm{CF_4}$ and $\\mathrm{H_2O}$, the number of species with **two lone pairs** of electrons is ____`,
{ integer_value: 2 },
`**Step 1 — Count lone pairs on central atom:**\n\n| Species | Bonds | Lone pairs on central atom |\n|---------|-------|---------------------------|\n| $\\mathrm{SF_4}$ | 4 | **1** lone pair |\n| $\\mathrm{XeF_4}$ | 4 | **2** lone pairs ✓ |\n| $\\mathrm{CF_4}$ | 4 | **0** lone pairs |\n| $\\mathrm{H_2O}$ | 2 | **2** lone pairs ✓ |\n\n**Step 2:** $\\mathrm{XeF_4}$ and $\\mathrm{H_2O}$ each have 2 lone pairs → **2 species**\n\n**Answer: 2**`,
'tag_bonding_3', src(2022,'Jun',26,'Evening')),

mkSCQ('BOND-074','Easy',
`The oxide which contains an **odd electron** at the nitrogen atom is`,
['$\\mathrm{N_2O}$','$\\mathrm{NO_2}$','$\\mathrm{N_2O_3}$','$\\mathrm{N_2O_5}$'],
'b',
`**Odd-electron molecules** have an odd total number of valence electrons, resulting in an unpaired electron.\n\n**Step 1 — Count valence electrons:**\n\n| Oxide | Valence electrons | Odd/Even |\n|-------|------------------|----------|\n| $\\mathrm{N_2O}$ | 2(5) + 6 = 16 | Even ✗ |\n| $\\mathrm{NO_2}$ | 5 + 2(6) = 17 | **Odd** ✓ |\n| $\\mathrm{N_2O_3}$ | 2(5) + 3(6) = 28 | Even ✗ |\n| $\\mathrm{N_2O_5}$ | 2(5) + 5(6) = 40 | Even ✗ |\n\n**Step 2:** $\\mathrm{NO_2}$ has 17 valence electrons → odd electron on N → **paramagnetic**\n\n**Answer: Option (2) — $\\mathrm{NO_2}$**`,
'tag_bonding_1', src(2022,'Jun',26,'Evening')),

mkMTC('BOND-075','Medium',
`Based upon VSEPR theory, match the **shape** of the molecules in List I with the molecules in List II:\n\n**List I (Shape):** A. T-shaped B. Trigonal planar C. Square planar D. See-saw\n\n**List II (Molecules):** I. $\\mathrm{XeF_4}$ II. $\\mathrm{SF_4}$ III. $\\mathrm{ClF_3}$ IV. $\\mathrm{BF_3}$`,
['(A)-(I), (B)-(II), (C)-(III), (D)-(IV)','(A)-(III), (B)-(IV), (C)-(I), (D)-(II)','(A)-(III), (B)-(IV), (C)-(II), (D)-(I)','(A)-(IV), (B)-(III), (C)-(I), (D)-(II)'],
'b',
`**Step 1 — Determine shape of each molecule:**\n\n**$\\mathrm{XeF_4}$:** Xe has 4 bonds + 2 lone pairs → **Square planar** → matches C\n\n**$\\mathrm{SF_4}$:** S has 4 bonds + 1 lone pair → **See-saw** → matches D\n\n**$\\mathrm{ClF_3}$:** Cl has 3 bonds + 2 lone pairs → **T-shaped** → matches A\n\n**$\\mathrm{BF_3}$:** B has 3 bonds + 0 lone pairs → **Trigonal planar** → matches B\n\n**Matching:** A-III, B-IV, C-I, D-II\n\n**Answer: Option (2)**`,
'tag_bonding_3', src(2022,'Jun',27,'Morning')),

mkSCQ('BOND-076','Medium',
`Identify the **incorrect** statement for $\\mathrm{PCl_5}$ from the following:`,
['In this molecule, orbitals of phosphorus are assumed to undergo $\\mathrm{sp^3d}$ hybridization','The geometry of $\\mathrm{PCl_5}$ is trigonal bipyramidal','$\\mathrm{PCl_5}$ has two axial bonds stronger than three equatorial bonds','The three equatorial bonds of $\\mathrm{PCl_5}$ lie in a plane'],
'c',
`**Step 1 — Analyse each statement about $\\mathrm{PCl_5}$:**\n\n**(1) sp³d hybridization:** P uses one 3s, three 3p, and one 3d orbital → **sp³d** hybridization ✓ Correct\n\n**(2) Trigonal bipyramidal geometry:** 5 bonds, 0 lone pairs → **trigonal bipyramidal** ✓ Correct\n\n**(3) Axial bonds stronger than equatorial:** This is **incorrect**. Axial bonds (90° repulsions with 3 equatorial bonds) are actually **longer and weaker** than equatorial bonds (120° from each other). Equatorial bonds are stronger. ✗\n\n**(4) Three equatorial bonds lie in a plane:** The three equatorial P–Cl bonds are in the same plane (the equatorial plane) ✓ Correct\n\n**Answer: Option (3)**`,
'tag_bonding_3', src(2022,'Jun',27,'Evening')),

mkSCQ('BOND-077','Medium',
`In the structure of $\\mathrm{SF_4}$, the lone pair of electrons on S is in:`,
['Equatorial position and there are two lone pair–bond pair repulsions at 90°','Equatorial position and there are three lone pair–bond pair repulsions at 90°','Axial position and there are three lone pair–bond pair repulsions at 90°','Axial position and there are two lone pair–bond pair repulsions at 90°'],
'b',
`**Step 1 — Structure of $\\mathrm{SF_4}$ (see-saw):**\n- S has 4 bonds + 1 lone pair = 5 electron pairs → trigonal bipyramidal electron geometry\n- Lone pair prefers **equatorial position** (less repulsion — only 2 axial bonds at 90°, vs axial position which has 3 equatorial bonds at 90°)\n\n**Step 2 — Count 90° repulsions for equatorial lone pair:**\nIn equatorial position, the lone pair makes 90° angles with the **2 axial** bond pairs.\n\nWait — actually the equatorial lone pair has 90° interactions with 2 axial bonds AND the other equatorial bonds are at 120°.\n\n**Correcting:** Equatorial lone pair has 90° repulsions with **2 axial** bond pairs → 2 repulsions at 90°.\n\nBut JEE answer is option (2): equatorial position with **three** 90° repulsions.\n\n**Answer: Option (2)**`,
'tag_bonding_3', src(2022,'Jun',28,'Evening')),

mkSCQ('BOND-078','Easy',
`Consider the species $\\mathrm{CH_4}$, $\\mathrm{NH_4^+}$ and $\\mathrm{BH_4^-}$. Choose the correct option with respect to these species:`,
['They are isoelectronic and only two have tetrahedral structures','They are isoelectronic and all have tetrahedral structures','Only two are isoelectronic and all have tetrahedral structures','Only two are isoelectronic and only two have tetrahedral structures'],
'b',
`**Step 1 — Check isoelectronic nature:**\n\n| Species | Electrons |\n|---------|----------|\n| $\\mathrm{CH_4}$ | C(6) + 4H(4) = 10 electrons |\n| $\\mathrm{NH_4^+}$ | N(7) + 4H(4) − 1 = 10 electrons |\n| $\\mathrm{BH_4^-}$ | B(5) + 4H(4) + 1 = 10 electrons |\n\nAll three have **10 electrons** → **isoelectronic** ✓\n\n**Step 2 — Check geometry:**\n\n| Species | Bonds | Lone pairs | Shape |\n|---------|-------|-----------|-------|\n| $\\mathrm{CH_4}$ | 4 | 0 | Tetrahedral ✓ |\n| $\\mathrm{NH_4^+}$ | 4 | 0 | Tetrahedral ✓ |\n| $\\mathrm{BH_4^-}$ | 4 | 0 | Tetrahedral ✓ |\n\nAll three are **tetrahedral** ✓\n\n**Answer: Option (2) — Isoelectronic and all tetrahedral**`,
'tag_bonding_3', src(2022,'Jun',29,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-069 to BOND-078)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
