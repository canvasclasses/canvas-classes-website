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

mkNVT('BOND-001','Medium',
`Number of molecules from the following which are **exceptions to the octet rule** is ____\n\n$$\\mathrm{CO_2,\\ NO_2,\\ H_2SO_4,\\ BF_3,\\ CH_4,\\ SiF_4,\\ ClO_2,\\ PCl_5,\\ BeF_2,\\ C_2H_6,\\ CHCl_3,\\ CBr_4}$$`,
{ integer_value: 6 },
`**Octet rule exceptions** fall into three categories: electron-deficient, odd-electron, and expanded octet.\n\n**Step 1 — Electron deficient (fewer than 8e⁻ on central atom):**\n- $\\mathrm{BF_3}$: B has 6e⁻ ✓ exception\n- $\\mathrm{BeF_2}$: Be has 4e⁻ ✓ exception\n\n**Step 2 — Odd-electron molecules:**\n- $\\mathrm{NO_2}$: 17 valence electrons → odd ✓ exception\n- $\\mathrm{ClO_2}$: 19 valence electrons → odd ✓ exception\n\n**Step 3 — Expanded octet (more than 8e⁻ on central atom):**\n- $\\mathrm{H_2SO_4}$: S has 12e⁻ ✓ exception\n- $\\mathrm{PCl_5}$: P has 10e⁻ ✓ exception\n- $\\mathrm{SiF_4}$: Si has exactly 8e⁻ — obeys octet ✗\n\n**Step 4 — Obey octet:**\n- $\\mathrm{CO_2}$: C has 8e⁻ ✗\n- $\\mathrm{CH_4}$: C has 8e⁻ ✗\n- $\\mathrm{C_2H_6}$: C has 8e⁻ ✗\n- $\\mathrm{CHCl_3}$: C has 8e⁻ ✗\n- $\\mathrm{CBr_4}$: C has 8e⁻ ✗\n\n**Exceptions: $\\mathrm{NO_2, H_2SO_4, BF_3, ClO_2, PCl_5, BeF_2}$ → 6**\n\n**Answer: 6**`,
'tag_bonding_1', src(2024,'Apr',8,'Morning')),

mkNVT('BOND-002','Medium',
`Number of compounds with **one lone pair of electrons on the central atom** amongst the following is ____\n\n$$\\mathrm{O_3,\\ H_2O,\\ SF_4,\\ ClF_3,\\ NH_3,\\ BrF_5,\\ XeF_4}$$`,
{ integer_value: 3 },
`**Step 1 — Count lone pairs on central atom for each species:**\n\n| Species | Bonding pairs | Lone pairs on central atom |\n|---------|--------------|---------------------------|\n| $\\mathrm{O_3}$ | 2 | 1 |\n| $\\mathrm{H_2O}$ | 2 | 2 |\n| $\\mathrm{SF_4}$ | 4 | 1 |\n| $\\mathrm{ClF_3}$ | 3 | 2 |\n| $\\mathrm{NH_3}$ | 3 | 1 |\n| $\\mathrm{BrF_5}$ | 5 | 1 |\n| $\\mathrm{XeF_4}$ | 4 | 2 |\n\n**Step 2 — Species with exactly ONE lone pair:**\n- $\\mathrm{O_3}$ ✓\n- $\\mathrm{SF_4}$ ✓\n- $\\mathrm{NH_3}$ ✓\n- $\\mathrm{BrF_5}$ ✓\n\n**Answer: 4**`,
'tag_bonding_1', src(2024,'Jan',29,'Morning')),

mkSCQ('BOND-003','Medium',
`Which of the following pair of molecules contain an **odd electron molecule** and an **expanded octet molecule**?`,
['$\\mathrm{BCl_3}$ and $\\mathrm{SF_6}$','NO and $\\mathrm{H_2SO_4}$','$\\mathrm{SF_6}$ and $\\mathrm{H_2SO_4}$','$\\mathrm{BCl_3}$ and NO'],
'b',
`**Odd-electron molecules** have an odd total number of valence electrons.\n**Expanded octet molecules** have the central atom with more than 8 electrons.\n\n**Step 1 — Check each option:**\n\n- **(1) $\\mathrm{BCl_3}$ and $\\mathrm{SF_6}$:** $\\mathrm{BCl_3}$ is electron-deficient (not odd-electron); $\\mathrm{SF_6}$ is expanded octet. But $\\mathrm{BCl_3}$ is NOT odd-electron. ✗\n\n- **(2) NO and $\\mathrm{H_2SO_4}$:** NO has 11 valence electrons → **odd-electron** ✓; $\\mathrm{H_2SO_4}$ has S with 12 electrons → **expanded octet** ✓\n\n- **(3) $\\mathrm{SF_6}$ and $\\mathrm{H_2SO_4}$:** Both are expanded octet, neither is odd-electron. ✗\n\n- **(4) $\\mathrm{BCl_3}$ and NO:** $\\mathrm{BCl_3}$ is electron-deficient; NO is odd-electron. Not the right pair. ✗\n\n**Answer: Option (2)**`,
'tag_bonding_1', src(2022,'Jul',29,'Morning')),

mkSCQ('BOND-004','Easy',
`Number of **electron deficient** molecules among the following $\\mathrm{PH_3,\\ B_2H_6,\\ CCl_4,\\ NH_3}$, LiH and $\\mathrm{BCl_3}$ is`,
['0','1','2','3'],
'c',
`**Electron deficient molecules** have the central atom with fewer than 8 electrons in their Lewis structure.\n\n**Step 1 — Analyse each molecule:**\n\n- $\\mathrm{PH_3}$: P has 8e⁻ (3 bonds + 1 lone pair) → NOT electron deficient\n- $\\mathrm{B_2H_6}$: B has only 6e⁻ (3 bonds, no lone pair) → **Electron deficient** ✓\n- $\\mathrm{CCl_4}$: C has 8e⁻ → NOT electron deficient\n- $\\mathrm{NH_3}$: N has 8e⁻ → NOT electron deficient\n- LiH: ionic compound, not applicable in this context → NOT electron deficient\n- $\\mathrm{BCl_3}$: B has 6e⁻ → **Electron deficient** ✓\n\n**Step 2 — Count:** $\\mathrm{B_2H_6}$ and $\\mathrm{BCl_3}$ → **2 molecules**\n\n**Answer: Option (3) — 2**`,
'tag_bonding_1', src(2022,'Jun',25,'Morning')),

mkSCQ('BOND-005','Easy',
`Which of the following is **least ionic**?`,
['$\\mathrm{BaCl_2}$','AgCl','KCl','$\\mathrm{CoCl_2}$'],
'b',
`**Ionic character** depends on the polarising power of the cation (charge/radius ratio) and polarisability of the anion. Higher polarisation → more covalent character → less ionic.\n\n**Step 1 — Apply Fajans' Rules:**\nA compound is less ionic (more covalent) when:\n- Cation has high charge and small size (high charge density)\n- Cation has a pseudo-noble gas configuration (18-electron config)\n\n**Step 2 — Analyse each compound:**\n- $\\mathrm{BaCl_2}$: Ba²⁺ is large, noble gas config → high ionic character\n- **AgCl**: Ag⁺ has 18-electron configuration (pseudo-noble gas) → high polarising power → **most covalent / least ionic** ✓\n- KCl: K⁺ is large, noble gas config → high ionic character\n- $\\mathrm{CoCl_2}$: Co²⁺ has d-electrons but larger than Ag⁺\n\n**Step 3:** Ag⁺ with 18-electron configuration has much greater polarising power than the others, making AgCl the least ionic.\n\n**Answer: Option (2) — AgCl**`,
'tag_bonding_2', src(2024,'Jan',31,'Evening')),

mkSCQ('BOND-006','Medium',
`Number of molecules/ions from the following in which the central atom is involved in $\\mathrm{sp^3}$ hybridization is\n\n$$\\mathrm{NO_3^-,\\ BCl_3,\\ ClO_2^-,\\ ClO_3}$$`,
['4','3','2','1'],
'c',
`**$\\mathrm{sp^3}$ hybridization** occurs when the central atom has 4 electron pairs (bonds + lone pairs).\n\n**Step 1 — Count electron pairs on central atom:**\n\n| Species | Bonds | Lone pairs | Total e⁻ pairs | Hybridization |\n|---------|-------|-----------|----------------|---------------|\n| $\\mathrm{NO_3^-}$ | 3 (with resonance) | 0 | 3 | sp² |\n| $\\mathrm{BCl_3}$ | 3 | 0 | 3 | sp² |\n| $\\mathrm{ClO_2^-}$ | 2 | 2 | 4 | sp³ ✓ |\n| $\\mathrm{ClO_3}$ | 3 | 1 | 4 | sp³ ✓ |\n\n**Step 2:** $\\mathrm{ClO_2^-}$ and $\\mathrm{ClO_3}$ → **2 species**\n\n**Answer: Option (3) — 2**`,
'tag_bonding_3', src(2024,'Apr',4,'Morning')),

mkMTC('BOND-007','Medium',
`Match **List I** with **List II**:\n\n| | List I (Molecule/Species) | | List II (Property/Shape) |\n|---|---|---|---|\n| A | $\\mathrm{SO_2Cl_2}$ | I | Paramagnetic |\n| B | NO | II | Diamagnetic |\n| C | $\\mathrm{NO_2^-}$ | III | Tetrahedral |\n| D | $\\mathrm{I_3^-}$ | IV | Linear |\n\nChoose the correct answer:`,
['A-II, B-III, C-I, D-IV','A-III, B-I, C-II, D-IV','A-IV, B-I, C-III, D-II','A-III, B-IV, C-II, D-I'],
'b',
`**Step 1 — Analyse each species:**\n\n**A. $\\mathrm{SO_2Cl_2}$:** S is central, bonded to 2O and 2Cl, no lone pairs → **tetrahedral** geometry → matches III\n\n**B. NO:** Has 11 valence electrons (odd number) → 1 unpaired electron → **paramagnetic** → matches I\n\n**C. $\\mathrm{NO_2^-}$:** N has 2 bonds + 1 lone pair → bent shape; all electrons paired → **diamagnetic** → matches II\n\n**D. $\\mathrm{I_3^-}$:** I has 2 bonds + 3 lone pairs → VSEPR: linear shape → matches IV\n\n**Step 2 — Matching:** A-III, B-I, C-II, D-IV\n\n**Answer: Option (2)**`,
'tag_bonding_3', src(2024,'Apr',6,'Morning')),

mkMTC('BOND-008','Easy',
`Match **List I** with **List II**:\n\n| | List I (Molecule) | | List II (Shape) |\n|---|---|---|---|\n| A | $\\mathrm{NH_3}$ | I | Square pyramid |\n| B | $\\mathrm{BrF_5}$ | II | Tetrahedral |\n| C | $\\mathrm{PCl_5}$ | III | Trigonal pyramidal |\n| D | $\\mathrm{CH_4}$ | IV | Trigonal bipyramidal |\n\nChoose the correct answer:`,
['A-II, B-IV, C-I, D-III','A-III, B-I, C-IV, D-II','A-IV, B-III, C-I, D-II','A-III, B-IV, C-I, D-II'],
'b',
`**Step 1 — Determine shape of each molecule using VSEPR:**\n\n**A. $\\mathrm{NH_3}$:** N has 3 bonds + 1 lone pair → 4 electron pairs → **trigonal pyramidal** → III\n\n**B. $\\mathrm{BrF_5}$:** Br has 5 bonds + 1 lone pair → 6 electron pairs → **square pyramidal** → I\n\n**C. $\\mathrm{PCl_5}$:** P has 5 bonds + 0 lone pairs → 5 electron pairs → **trigonal bipyramidal** → IV\n\n**D. $\\mathrm{CH_4}$:** C has 4 bonds + 0 lone pairs → 4 electron pairs → **tetrahedral** → II\n\n**Step 2 — Matching:** A-III, B-I, C-IV, D-II\n\n**Answer: Option (2)**`,
'tag_bonding_3', src(2024,'Apr',8,'Morning')),

mkSCQ('BOND-009','Easy',
`The shape of carbocation is:`,
['Diagonal pyramidal','Trigonal planar','Tetrahedral','Diagonal'],
'b',
`**Carbocation** ($\\mathrm{R_3C^+}$) has a central carbon with:\n- 3 bonding pairs\n- 0 lone pairs\n- Total electron pairs = 3\n\n**Step 1 — Apply VSEPR:**\nWith 3 bonding pairs and no lone pairs, the geometry is **trigonal planar** (120° bond angles).\n\n**Step 2 — Hybridization:**\nCarbon in carbocation is **sp² hybridized** — three sp² orbitals form σ bonds in a plane, and the empty p orbital is perpendicular to the plane.\n\n**Answer: Option (2) — Trigonal planar**`,
'tag_bonding_3', src(2024,'Apr',8,'Evening')),

mkSCQ('BOND-010','Medium',
`In which one of the following pairs do the central atoms exhibit $\\mathrm{sp^2}$ hybridization?`,
['$\\mathrm{H_2O}$ and $\\mathrm{NO_2}$','$\\mathrm{BF_3}$ and $\\mathrm{NO_2^-}$','$\\mathrm{NH_2^-}$ and $\\mathrm{H_2O}$','$\\mathrm{NH_2^-}$ and $\\mathrm{BF_3}$'],
'b',
`**$\\mathrm{sp^2}$ hybridization** requires 3 electron pairs (bonds + lone pairs) on the central atom.\n\n**Step 1 — Analyse each species:**\n\n| Species | Bonds | Lone pairs | Total | Hybridization |\n|---------|-------|-----------|-------|---------------|\n| $\\mathrm{H_2O}$ | 2 | 2 | 4 | sp³ |\n| $\\mathrm{NO_2}$ | 2 + ½ (odd e⁻) | ~1 | ~3 | sp² ✓ |\n| $\\mathrm{BF_3}$ | 3 | 0 | 3 | sp² ✓ |\n| $\\mathrm{NO_2^-}$ | 2 | 1 | 3 | sp² ✓ |\n| $\\mathrm{NH_2^-}$ | 2 | 2 | 4 | sp³ |\n\n**Step 2 — Find pair where BOTH are sp²:**\n- Option (2): $\\mathrm{BF_3}$ (sp²) and $\\mathrm{NO_2^-}$ (sp²) ✓\n\n**Answer: Option (2)**`,
'tag_bonding_3', src(2024,'Apr',9,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-001 to BOND-010)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
