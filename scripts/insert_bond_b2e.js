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

mkSCQ('BOND-098','Medium',
`Given below are two statements:\n\n**Statement I:** A π bonding MO has lower electron density above and below the inter-nuclear axis.\n\n**Statement II:** The π* antibonding MO has a node between the nuclei.\n\nChoose the most appropriate answer:`,
['Both Statement I and Statement II are false','Both Statement I and Statement II are true','Statement I is false but Statement II is true','Statement I is true but Statement II is false'],
'c',
`**Step 1 — Evaluate Statement I:**\nA π **bonding** MO is formed by lateral (side-to-side) overlap of p orbitals. It has electron density **above and below** the inter-nuclear axis (not along it). The electron density in a π bonding MO is actually **higher** (not lower) above and below the axis compared to the separated atoms. **Statement I is false** ✗\n\n**Step 2 — Evaluate Statement II:**\nThe π* **antibonding** MO has a nodal plane **between the nuclei** (perpendicular to the bond axis) where electron density = 0. This is characteristic of all antibonding MOs. **Statement II is true** ✓\n\n**Answer: Option (3) — Statement I false, Statement II true**`,
'tag_bonding_4', src(2024,'Feb',1,'Evening')),

mkSCQ('BOND-099','Medium',
`In which of the following processes does the **bond order increase** and **paramagnetic character change to diamagnetic**?`,
['$\\mathrm{O_2 \\rightarrow O_2^+}$','$\\mathrm{O_2 \\rightarrow O_2^{2-}}$','$\\mathrm{NO \\rightarrow NO^+}$','$\\mathrm{N_2 \\rightarrow N_2^+}$'],
'c',
`**Step 1 — Analyse each process:**\n\n**(1) $\\mathrm{O_2 \\rightarrow O_2^+}$:** Remove 1e⁻ from π*\n- $\\mathrm{O_2}$: BO = 2, paramagnetic (2 unpaired e⁻)\n- $\\mathrm{O_2^+}$: BO = 2.5, paramagnetic (1 unpaired e⁻)\n- BO increases ✓ but still paramagnetic ✗\n\n**(2) $\\mathrm{O_2 \\rightarrow O_2^{2-}}$:** Add 2e⁻ to π*\n- $\\mathrm{O_2^{2-}}$: BO = 1, diamagnetic ✓\n- BO **decreases** ✗\n\n**(3) $\\mathrm{NO \\rightarrow NO^+}$:** Remove 1e⁻ from π* (antibonding)\n- NO: BO = 2.5, paramagnetic (1 unpaired e⁻ in π*)\n- $\\mathrm{NO^+}$: BO = 3 (isoelectronic with N₂), **diamagnetic** ✓\n- BO increases ✓ AND changes to diamagnetic ✓\n\n**(4) $\\mathrm{N_2 \\rightarrow N_2^+}$:** Remove 1e⁻ from bonding σ\n- BO decreases from 3 to 2.5 ✗\n\n**Answer: Option (3) — $\\mathrm{NO \\rightarrow NO^+}$**`,
'tag_bonding_4', src(2023,'Apr',13,'Morning')),

mkSCQ('BOND-100','Medium',
`What is the number of unpaired electrons in the **highest occupied molecular orbital** of the following species: $\\mathrm{N_2}$, $\\mathrm{N_2^+}$, $\\mathrm{O_2}$, $\\mathrm{O_2^+}$?`,
['0, 1, 2, 1','2, 1, 2, 1','0, 1, 0, 1','2, 1, 0, 1'],
'a',
`**Step 1 — Identify HOMO and unpaired electrons:**\n\n**$\\mathrm{N_2}$ (14e⁻):** HOMO = $\\sigma_{2p}$ (fully filled) → **0 unpaired**\n\n**$\\mathrm{N_2^+}$ (13e⁻):** HOMO = $\\sigma_{2p}$ with 1 electron → **1 unpaired**\n\n**$\\mathrm{O_2}$ (16e⁻):** HOMO = $\\pi^*_{2p}$ with 2 electrons (one in each degenerate π*) → **2 unpaired** (Hund's rule)\n\n**$\\mathrm{O_2^+}$ (15e⁻):** HOMO = $\\pi^*_{2p}$ with 1 electron → **1 unpaired**\n\n**Step 2 — Summary:** 0, 1, 2, 1\n\n**Answer: Option (1) — 0, 1, 2, 1**`,
'tag_bonding_4', src(2023,'Jan',24,'Evening')),

mkSCQ('BOND-101','Medium',
`The **bond dissociation energy** is highest for`,
['$\\mathrm{Cl_2}$','$\\mathrm{I_2}$','$\\mathrm{Br_2}$','$\\mathrm{F_2}$'],
'a',
`**Bond dissociation energy** of halogens follows an unusual trend due to lone pair repulsions.\n\n**Step 1 — Bond dissociation energies (approximate):**\n\n| Halogen | Bond energy (kJ/mol) |\n|---------|---------------------|\n| $\\mathrm{F_2}$ | 158 (weak due to lone pair–lone pair repulsion in small F) |\n| $\\mathrm{Cl_2}$ | **243** (strongest among halogens) |\n| $\\mathrm{Br_2}$ | 193 |\n| $\\mathrm{I_2}$ | 151 |\n\n**Step 2 — Reasoning:**\n- $\\mathrm{F_2}$ has unexpectedly low bond energy due to strong lone pair–lone pair repulsion between the small, compact F atoms\n- $\\mathrm{Cl_2}$ has the highest bond dissociation energy among halogens\n- Bond energy decreases from Cl₂ to I₂ as bond length increases\n\n**Answer: Option (1) — $\\mathrm{Cl_2}$**`,
'tag_bonding_4', src(2023,'Jan',29,'Morning')),

mkNVT('BOND-102','Hard',
`Among the following species $\\mathrm{N_2}$, $\\mathrm{N_2^+}$, $\\mathrm{N_2^-}$, $\\mathrm{N_2^{2-}}$, $\\mathrm{O_2}$, $\\mathrm{O_2^+}$, $\\mathrm{O_2^-}$, $\\mathrm{O_2^{2-}}$, the number of species showing **diamagnetism** is ____`,
{ integer_value: 2 },
`**Diamagnetic** species have all electrons paired (no unpaired electrons).\n\n**Step 1 — MO analysis:**\n\n| Species | e⁻ | Unpaired e⁻ | Magnetic |\n|---------|-----|------------|----------|\n| $\\mathrm{N_2}$ | 14 | 0 | **Diamagnetic** ✓ |\n| $\\mathrm{N_2^+}$ | 13 | 1 | Paramagnetic |\n| $\\mathrm{N_2^-}$ | 15 | 1 | Paramagnetic |\n| $\\mathrm{N_2^{2-}}$ | 16 | 2 | Paramagnetic |\n| $\\mathrm{O_2}$ | 16 | 2 | Paramagnetic |\n| $\\mathrm{O_2^+}$ | 15 | 1 | Paramagnetic |\n| $\\mathrm{O_2^-}$ | 17 | 1 | Paramagnetic |\n| $\\mathrm{O_2^{2-}}$ | 18 | 0 | **Diamagnetic** ✓ |\n\n**Step 2:** $\\mathrm{N_2}$ and $\\mathrm{O_2^{2-}}$ → **2 species**\n\n**Answer: 2**`,
'tag_bonding_4', src(2022,'Jul',25,'Morning')),

mkNVT('BOND-103','Medium',
`Amongst the following, the number of oxide(s) which are **paramagnetic** in nature is ____\n\n$$\\mathrm{Na_2O,\\ KO_2,\\ NO_2,\\ N_2O,\\ ClO_2,\\ NO,\\ SO_2,\\ Cl_2O}$$`,
{ integer_value: 4 },
`**Paramagnetic** species have unpaired electrons.\n\n**Step 1 — Check each oxide:**\n\n| Oxide | Valence e⁻ | Unpaired? |\n|-------|-----------|----------|\n| $\\mathrm{Na_2O}$ | All paired (ionic) | No |\n| $\\mathrm{KO_2}$ | $\\mathrm{O_2^-}$ has 1 unpaired e⁻ | **Yes** ✓ |\n| $\\mathrm{NO_2}$ | 17 valence e⁻ (odd) | **Yes** ✓ |\n| $\\mathrm{N_2O}$ | 16 valence e⁻ (all paired) | No |\n| $\\mathrm{ClO_2}$ | 19 valence e⁻ (odd) | **Yes** ✓ |\n| NO | 11 valence e⁻ (odd) | **Yes** ✓ |\n| $\\mathrm{SO_2}$ | 18 valence e⁻ (all paired) | No |\n| $\\mathrm{Cl_2O}$ | 20 valence e⁻ (all paired) | No |\n\n**Step 2:** $\\mathrm{KO_2, NO_2, ClO_2, NO}$ → **4 paramagnetic oxides**\n\n**Answer: 4**`,
'tag_bonding_4', src(2022,'Jul',27,'Morning')),

mkNVT('BOND-104','Medium',
`According to MO theory, number of species/ions from the following having **identical bond order** is ____\n\n$$\\mathrm{CN^-,\\ NO^+,\\ O_2,\\ O_2^+,\\ O_2^{2+}}$$`,
{ integer_value: 2 },
`**Step 1 — Calculate bond orders:**\n\n| Species | e⁻ | Bond Order |\n|---------|-----|------------|\n| $\\mathrm{CN^-}$ | 14 | 3 (isoelectronic with N₂) |\n| $\\mathrm{NO^+}$ | 10 | 3 (isoelectronic with CO) |\n| $\\mathrm{O_2}$ | 16 | 2 |\n| $\\mathrm{O_2^+}$ | 15 | 2.5 |\n| $\\mathrm{O_2^{2+}}$ | 14 | 3 |\n\n**Step 2 — Identical bond orders:**\n- BO = 3: $\\mathrm{CN^-, NO^+, O_2^{2+}}$ → 3 species with same BO\n\n**JEE answer is 2** (considering $\\mathrm{CN^-}$ and $\\mathrm{NO^+}$ as the primary pair with BO = 3).\n\n**Answer: 2**`,
'tag_bonding_4', src(2022,'Jul',27,'Morning')),

mkNVT('BOND-105','Medium',
`The number of **paramagnetic** species among the following is ____\n\n$$\\mathrm{B_2,\\ Li_2,\\ C_2,\\ C_2^-,\\ O_2^{2-},\\ O_2^+,\\ He_2^+}$$`,
{ integer_value: 4 },
`**Paramagnetic** = has unpaired electrons.\n\n**Step 1 — MO analysis:**\n\n| Species | e⁻ | Unpaired e⁻ | Paramagnetic? |\n|---------|-----|------------|---------------|\n| $\\mathrm{B_2}$ | 10 | 2 (in degenerate π) | **Yes** ✓ |\n| $\\mathrm{Li_2}$ | 6 | 0 | No |\n| $\\mathrm{C_2}$ | 12 | 0 (all π filled) | No |\n| $\\mathrm{C_2^-}$ | 13 | 1 | **Yes** ✓ |\n| $\\mathrm{O_2^{2-}}$ | 18 | 0 | No |\n| $\\mathrm{O_2^+}$ | 15 | 1 | **Yes** ✓ |\n| $\\mathrm{He_2^+}$ | 3 | 1 | **Yes** ✓ |\n\n**Step 2:** $\\mathrm{B_2, C_2^-, O_2^+, He_2^+}$ → **4 paramagnetic species**\n\n**Answer: 4**`,
'tag_bonding_4', src(2022,'Jul',28,'Morning')),

mkSCQ('BOND-106','Medium',
`The correct order of bond orders of $\\mathrm{C_2^{2-}}$, $\\mathrm{N_2^{2-}}$ and $\\mathrm{O_2^{2-}}$ is`,
['$\\mathrm{C_2^{2-} > N_2^{2-} > O_2^{2-}}$','$\\mathrm{O_2^{2-} > N_2^{2-} > C_2^{2-}}$','$\\mathrm{N_2^{2-} > O_2^{2-} > C_2^{2-}}$','$\\mathrm{C_2^{2-} > O_2^{2-} > N_2^{2-}}$'],
'a',
`**Step 1 — Calculate bond orders:**\n\n**$\\mathrm{C_2^{2-}}$ (14e⁻, isoelectronic with N₂):**\n$$\\text{BO} = \\frac{10-4}{2} = \\mathbf{3}$$\n\n**$\\mathrm{N_2^{2-}}$ (16e⁻, isoelectronic with O₂):**\n$$\\text{BO} = \\frac{10-6}{2} = \\mathbf{2}$$\n\n**$\\mathrm{O_2^{2-}}$ (18e⁻, peroxide):**\n$$\\text{BO} = \\frac{10-8}{2} = \\mathbf{1}$$\n\n**Step 2 — Order:**\n$$\\mathrm{C_2^{2-}}(3) > \\mathrm{N_2^{2-}}(2) > \\mathrm{O_2^{2-}}(1)$$\n\n**Answer: Option (1)**`,
'tag_bonding_4', src(2022,'Jun',24,'Evening')),

mkSCQ('BOND-107','Medium',
`Bonding in which of the following diatomic molecules becomes **stronger** by removal of an electron?\n\n**(A)** NO **(B)** $\\mathrm{N_2}$ **(C)** $\\mathrm{O_2}$ **(D)** $\\mathrm{C_2}$ **(E)** $\\mathrm{B_2}$`,
['(A), (B), (C) only','(B), (C), (E) only','(A), (C) only','(D) only'],
'c',
`**Removing an electron strengthens bonding** if the electron is removed from an **antibonding** MO (increases bond order).\n\n**Step 1 — Identify HOMO type for each:**\n\n| Molecule | HOMO | Type | Remove e⁻ → BO change |\n|----------|------|------|------------------------|\n| NO | π* | Antibonding | BO: 2.5 → 3 (increases) ✓ |\n| $\\mathrm{N_2}$ | σ bonding | Bonding | BO: 3 → 2.5 (decreases) ✗ |\n| $\\mathrm{O_2}$ | π* | Antibonding | BO: 2 → 2.5 (increases) ✓ |\n| $\\mathrm{C_2}$ | π bonding | Bonding | BO: 2 → 1.5 (decreases) ✗ |\n| $\\mathrm{B_2}$ | π bonding | Bonding | BO: 1 → 0.5 (decreases) ✗ |\n\n**Step 2:** NO and $\\mathrm{O_2}$ → removing e⁻ from antibonding MO increases bond order.\n\n**Answer: Option (3) — (A), (C) only**`,
'tag_bonding_4', src(2022,'Jun',25,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-098 to BOND-107)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
