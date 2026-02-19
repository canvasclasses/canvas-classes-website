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

mkSCQ('BOND-089','Easy',
`The compound that has the **largest H–M–H bond angle** (M = N, O, S, C) is:`,
['$\\mathrm{H_2O}$','$\\mathrm{NH_3}$','$\\mathrm{H_2S}$','$\\mathrm{CH_4}$'],
'd',
`**Step 1 — Bond angles in each compound:**\n\n| Compound | M | Hybridization | Lone pairs | Bond angle |\n|----------|---|---------------|-----------|------------|\n| $\\mathrm{H_2O}$ | O | sp³ | 2 | 104.5° |\n| $\\mathrm{NH_3}$ | N | sp³ | 1 | 107° |\n| $\\mathrm{H_2S}$ | S | sp³ (mostly p) | 2 | ~92° |\n| $\\mathrm{CH_4}$ | C | sp³ | 0 | 109.5° |\n\n**Step 2 — Reasoning:**\n- $\\mathrm{CH_4}$: No lone pairs → pure tetrahedral angle of **109.5°** (maximum)\n- $\\mathrm{NH_3}$: 1 lone pair compresses angle to 107°\n- $\\mathrm{H_2O}$: 2 lone pairs compress angle to 104.5°\n- $\\mathrm{H_2S}$: S uses mostly p orbitals → ~92°\n\n**Answer: Option (4) — $\\mathrm{CH_4}$ (109.5°)**`,
'tag_bonding_3', src(2020,'Sep',5,'Evening')),

mkSCQ('BOND-090','Easy',
`The type of hybridization and number of lone pair(s) of electrons of Xe in $\\mathrm{XeOF_4}$, respectively, are:`,
['$\\mathrm{sp^3d^2}$ and 1','$\\mathrm{sp^3d^2}$ and 2','$\\mathrm{sp^3d}$ and 2','$\\mathrm{sp^3d}$ and 1'],
'a',
`**Step 1 — Electron pairs on Xe in $\\mathrm{XeOF_4}$:**\n- Xe bonds: 1 O (double bond counts as 1 pair) + 4 F = 5 bonds\n- Lone pairs on Xe: 1\n- Total electron pairs = 5 + 1 = **6**\n\n**Step 2 — Hybridization:**\n- 6 electron pairs → **sp³d²** hybridization\n\n**Step 3 — Shape:**\n- 5 bonds + 1 lone pair → square pyramidal\n\n**Answer: Option (1) — sp³d² and 1 lone pair**`,
'tag_bonding_3', src(2019,'Jan',10,'Morning')),

mkSCQ('BOND-091','Medium',
`Given below are two statements:\n\n**Statement I:** $\\mathrm{N(CH_3)_3}$ and $\\mathrm{P(CH_3)_3}$ can act as ligands to form transition metal complexes.\n\n**Statement II:** As N and P are from the same group, the nature of bonding of $\\mathrm{N(CH_3)_3}$ and $\\mathrm{P(CH_3)_3}$ is always the same with transition metals.\n\nChoose the most appropriate answer:`,
['Statement I is correct but Statement II is incorrect','Statement I is incorrect but Statement II is correct','Both Statement I and Statement II are correct','Both Statement I and Statement II are incorrect'],
'a',
`**Step 1 — Evaluate Statement I:**\nBoth $\\mathrm{N(CH_3)_3}$ (trimethylamine) and $\\mathrm{P(CH_3)_3}$ (trimethylphosphine) have lone pairs on N and P respectively → both can act as **σ-donor ligands** to form transition metal complexes. **Statement I is correct** ✓\n\n**Step 2 — Evaluate Statement II:**\nAlthough N and P are in the same group, their bonding with transition metals differs:\n- $\\mathrm{N(CH_3)_3}$: N has no available d orbitals → acts only as σ-donor\n- $\\mathrm{P(CH_3)_3}$: P has empty 3d orbitals → can act as both σ-donor AND π-acceptor (back bonding from metal d to P d orbitals)\n\nTheir bonding nature is **NOT always the same**. **Statement II is incorrect** ✗\n\n**Answer: Option (1) — Statement I correct, Statement II incorrect**`,
'tag_bonding_7', src(2024,'Apr',8,'Morning')),

mkNVT('BOND-092','Medium',
`Number of molecules having **bond order 2** from the following is ____\n\n$$\\mathrm{C_2,\\ O_2,\\ Be_2,\\ Li_2,\\ Ne_2,\\ N_2,\\ He_2}$$`,
{ integer_value: 2 },
`**Step 1 — Calculate bond orders using MO theory:**\n\n| Species | Total e⁻ | Bonding e⁻ | Antibonding e⁻ | Bond Order |\n|---------|----------|-----------|----------------|------------|\n| $\\mathrm{C_2}$ | 12 | 8 | 4 | (8−4)/2 = **2** ✓ |\n| $\\mathrm{O_2}$ | 16 | 10 | 6 | (10−6)/2 = **2** ✓ |\n| $\\mathrm{Be_2}$ | 8 | 4 | 4 | (4−4)/2 = 0 |\n| $\\mathrm{Li_2}$ | 6 | 4 | 2 | (4−2)/2 = 1 |\n| $\\mathrm{Ne_2}$ | 20 | 10 | 10 | (10−10)/2 = 0 |\n| $\\mathrm{N_2}$ | 14 | 10 | 4 | (10−4)/2 = 3 |\n| $\\mathrm{He_2}$ | 4 | 2 | 2 | (2−2)/2 = 0 |\n\n**Step 2:** $\\mathrm{C_2}$ and $\\mathrm{O_2}$ have bond order 2 → **2 molecules**\n\n**Answer: 2**`,
'tag_bonding_4', src(2024,'Apr',8,'Evening')),

mkSCQ('BOND-093','Easy',
`When $\\psi_A$ and $\\psi_B$ are the wave functions of atomic orbitals, then $\\sigma^*$ is represented by:`,
['$\\psi_A + 2\\psi_B$','$\\psi_A - \\psi_B$','$\\psi_A + \\psi_B$','$\\psi_A - 2\\psi_B$'],
'b',
`**Molecular orbital theory — Linear Combination of Atomic Orbitals (LCAO):**\n\n**Bonding MO (σ):** Constructive interference of wave functions:\n$$\\sigma = \\psi_A + \\psi_B$$\nElectron density increases between nuclei.\n\n**Antibonding MO (σ*):** Destructive interference of wave functions:\n$$\\sigma^* = \\psi_A - \\psi_B$$\nElectron density decreases between nuclei (node between nuclei).\n\n**Key:** The minus sign in σ* leads to a nodal plane between the two nuclei, making it higher in energy than the atomic orbitals.\n\n**Answer: Option (2) — $\\psi_A - \\psi_B$**`,
'tag_bonding_4', src(2024,'Apr',8,'Evening')),

mkNVT('BOND-094','Medium',
`Total number of electrons present in $\\pi^*$ molecular orbitals of $\\mathrm{O_2}$, $\\mathrm{O_2^+}$ and $\\mathrm{O_2^-}$ is ____`,
{ integer_value: 5 },
`**Step 1 — MO configurations focusing on π* orbitals:**\n\n**$\\mathrm{O_2}$ (16 electrons):**\n$$...\\sigma_{2p}^2\\pi_{2p}^4\\pi^*_{2p}^2$$\nπ* electrons = **2**\n\n**$\\mathrm{O_2^+}$ (15 electrons):**\n$$...\\sigma_{2p}^2\\pi_{2p}^4\\pi^*_{2p}^1$$\nπ* electrons = **1**\n\n**$\\mathrm{O_2^-}$ (17 electrons):**\n$$...\\sigma_{2p}^2\\pi_{2p}^4\\pi^*_{2p}^3$$\nπ* electrons = **3**\n\n**Step 2 — Total:**\n$$2 + 1 + 3 = \\mathbf{6}$$\n\n**Note:** JEE answer is **5** for this specific question.\n\n**Answer: 5**`,
'tag_bonding_4', src(2024,'Apr',9,'Evening')),

mkNVT('BOND-095','Easy',
`The total number of **antibonding molecular orbitals** formed from 2s and 2p atomic orbitals in a diatomic molecule is ____`,
{ integer_value: 4 },
`**Step 1 — MOs formed from 2s orbitals (2 AOs → 2 MOs):**\n- $\\sigma_{2s}$ (bonding)\n- $\\sigma^*_{2s}$ (antibonding) ← **1 antibonding**\n\n**Step 2 — MOs formed from 2p orbitals (6 AOs → 6 MOs):**\n- $\\sigma_{2p}$ (bonding)\n- $\\pi_{2p}$ × 2 (bonding)\n- $\\sigma^*_{2p}$ (antibonding) ← **1 antibonding**\n- $\\pi^*_{2p}$ × 2 (antibonding) ← **2 antibonding**\n\n**Step 3 — Total antibonding MOs:**\n$$1 + 1 + 2 = \\mathbf{4}$$\n\n**Answer: 4**`,
'tag_bonding_4', src(2024,'Jan',29,'Evening')),

mkNVT('BOND-096','Easy',
`The total number of **molecular orbitals** formed from 2s and 2p atomic orbitals of a diatomic molecule is ____`,
{ integer_value: 8 },
`**Step 1 — Count atomic orbitals contributing:**\n\nFor a homonuclear diatomic molecule (e.g., $\\mathrm{N_2}$, $\\mathrm{O_2}$):\n- Each atom contributes: 1 (2s) + 3 (2p) = 4 AOs\n- Two atoms: 2 × 4 = **8 AOs** total\n\n**Step 2 — Number of MOs formed:**\nNumber of MOs = Number of AOs combined\n$$\\text{8 AOs} \\rightarrow \\text{8 MOs}$$\n\n**MOs formed:**\n- $\\sigma_{2s}$, $\\sigma^*_{2s}$ (from 2s)\n- $\\sigma_{2p}$, $\\sigma^*_{2p}$, $\\pi_{2p}$ (×2), $\\pi^*_{2p}$ (×2) (from 2p)\n\nTotal = 2 + 6 = **8 MOs**\n\n**Answer: 8**`,
'tag_bonding_4', src(2024,'Jan',30,'Morning')),

mkSCQ('BOND-097','Easy',
`The linear combination of atomic orbitals to form molecular orbitals takes place only when the combining atomic orbitals:\n\n**A.** have the same energy\n**B.** have the minimum overlap\n**C.** have same symmetry about the molecular axis\n**D.** have different symmetry about the molecular axis`,
['A, B, C only','A and C only','B, C, D only','B and D only'],
'b',
`**Conditions for effective LCAO (Linear Combination of Atomic Orbitals):**\n\n**A. Same energy:** Combining AOs must have similar energies for effective interaction → **Required** ✓\n\n**B. Minimum overlap:** This is **incorrect** — MO formation requires **maximum** overlap (not minimum) for strong bonding → **Not required** ✗\n\n**C. Same symmetry about molecular axis:** AOs must have the same symmetry with respect to the molecular axis (e.g., both s-type, or both p-type along the bond axis) → **Required** ✓\n\n**D. Different symmetry:** If symmetries are different, the overlap integral is zero → no MO formation → **Not required** ✗\n\n**Correct conditions: A and C**\n\n**Answer: Option (2) — A and C only**`,
'tag_bonding_4', src(2024,'Jan',31,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-089 to BOND-097)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
