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

mkSCQ('BOND-117','Medium',
`Of the species NO, $\\mathrm{NO^+}$, $\\mathrm{NO^{2+}}$ and $\\mathrm{NO^-}$, the one with **minimum bond strength** is:`,
['$\\mathrm{NO^+}$','NO','$\\mathrm{NO^{2+}}$','$\\mathrm{NO^-}$'],
'd',
`**Bond strength** increases with bond order.\n\n**Step 1 — Calculate bond orders:**\n\n| Species | e⁻ | Bond Order |\n|---------|-----|------------|\n| $\\mathrm{NO^{2+}}$ | 9 | (8−1)/2 = 3.5 |\n| $\\mathrm{NO^+}$ | 10 | (8−2)/2 = 3 |\n| NO | 11 | (8−3)/2 = 2.5 |\n| $\\mathrm{NO^-}$ | 12 | (8−4)/2 = 2 |\n\n**Step 2:** Minimum bond order = minimum bond strength\n$\\mathrm{NO^-}$ has BO = 2 → **minimum bond strength**\n\n**Answer: Option (4) — $\\mathrm{NO^-}$**`,
'tag_bonding_4', src(2020,'Sep',3,'Morning')),

mkSCQ('BOND-118','Medium',
`The bond order and the magnetic characteristic of $\\mathrm{CN^-}$ are`,
['$2\\frac{1}{2}$, diamagnetic','3, diamagnetic','3, paramagnetic','$2\\frac{1}{2}$, paramagnetic'],
'b',
`**Step 1 — MO configuration of $\\mathrm{CN^-}$ (14 electrons, isoelectronic with $\\mathrm{N_2}$):**\n\n$$\\sigma_{1s}^2\\sigma^*_{1s}^2\\sigma_{2s}^2\\sigma^*_{2s}^2\\pi_{2p}^4\\sigma_{2p}^2$$\n\n**Step 2 — Bond order:**\n$$\\text{BO} = \\frac{10-4}{2} = \\mathbf{3}$$\n\n**Step 3 — Magnetic nature:**\n- All electrons are paired → **diamagnetic**\n\n**Answer: Option (2) — 3, diamagnetic**`,
'tag_bonding_4', src(2020,'Jan',7,'Evening')),

mkSCQ('BOND-119','Easy',
`Arrange the following bonds according to their **average bond energies in descending order**: C–Cl, C–Br, C–F, C–I`,
['C–F > C–Cl > C–Br > C–I','C–Br > C–I > C–Cl > C–F','C–I > C–Br > C–Cl > C–F','C–Cl > C–Br > C–I > C–F'],
'a',
`**Bond energy** increases as bond length decreases (shorter bond = stronger bond).\n\n**Step 1 — Bond lengths (C–X):**\n- C–F: ~135 pm (shortest)\n- C–Cl: ~177 pm\n- C–Br: ~194 pm\n- C–I: ~214 pm (longest)\n\n**Step 2 — Bond energies (approximate):**\n- C–F: ~485 kJ/mol (strongest)\n- C–Cl: ~327 kJ/mol\n- C–Br: ~285 kJ/mol\n- C–I: ~213 kJ/mol (weakest)\n\n**Descending order:** C–F > C–Cl > C–Br > C–I\n\n**Answer: Option (1)**`,
'tag_bonding_2', src(2020,'Jan',8,'Evening')),

mkSCQ('BOND-120','Easy',
`If the magnetic moment of a di-oxygen species is 1.73 BM, it may be`,
['$\\mathrm{O_2^-}$ or $\\mathrm{O_2^+}$','$\\mathrm{O_2}$ or $\\mathrm{O_2^+}$','$\\mathrm{O_2}$ or $\\mathrm{O_2^-}$','$\\mathrm{O_2}$, $\\mathrm{O_2^-}$ or $\\mathrm{O_2^+}$'],
'a',
`**Magnetic moment** $\\mu = \\sqrt{n(n+2)}$ BM.\nFor 1.73 BM: $\\sqrt{n(n+2)} = \\sqrt{3}$ → n = 1 unpaired electron.\n\n**Step 1 — Count unpaired electrons:**\n\n| Species | e⁻ | Unpaired e⁻ |\n|---------|-----|-------------|\n| $\\mathrm{O_2}$ | 16 | 2 (μ = 2.83 BM) |\n| $\\mathrm{O_2^+}$ | 15 | 1 ✓ (μ = 1.73 BM) |\n| $\\mathrm{O_2^-}$ | 17 | 1 ✓ (μ = 1.73 BM) |\n| $\\mathrm{O_2^{2-}}$ | 18 | 0 (μ = 0 BM) |\n\n**Step 2:** $\\mathrm{O_2^+}$ and $\\mathrm{O_2^-}$ both have 1 unpaired electron → μ = 1.73 BM\n\n**Answer: Option (1) — $\\mathrm{O_2^-}$ or $\\mathrm{O_2^+}$**`,
'tag_bonding_4', src(2020,'Jan',9,'Morning')),

mkSCQ('BOND-121','Medium',
`Among the following molecules/ions $\\mathrm{C_2^{2-}}$, $\\mathrm{N_2^{2-}}$, $\\mathrm{O_2^{2-}}$, $\\mathrm{O_2}$, which one is **diamagnetic** and has the **shortest bond length**?`,
['$\\mathrm{N_2^{2-}}$','$\\mathrm{O_2^{2-}}$','$\\mathrm{O_2}$','$\\mathrm{C_2^{2-}}$'],
'd',
`**Step 1 — Bond orders and magnetic nature:**\n\n| Species | e⁻ | Bond Order | Unpaired e⁻ | Magnetic |\n|---------|-----|-----------|------------|----------|\n| $\\mathrm{C_2^{2-}}$ | 14 | 3 | 0 | **Diamagnetic** ✓ |\n| $\\mathrm{N_2^{2-}}$ | 16 | 2 | 2 | Paramagnetic |\n| $\\mathrm{O_2^{2-}}$ | 18 | 1 | 0 | Diamagnetic |\n| $\\mathrm{O_2}$ | 16 | 2 | 2 | Paramagnetic |\n\n**Step 2 — Shortest bond length:**\nHigher bond order → shorter bond length.\n- $\\mathrm{C_2^{2-}}$: BO = 3 → shortest bond length AND diamagnetic ✓\n- $\\mathrm{O_2^{2-}}$: BO = 1, diamagnetic but longer bond\n\n**Answer: Option (4) — $\\mathrm{C_2^{2-}}$**`,
'tag_bonding_4', src(2019,'Apr',8,'Evening')),

mkSCQ('BOND-122','Medium',
`Among the following, the molecule expected to be **stabilized by anion formation** is: $\\mathrm{C_2}$, $\\mathrm{O_2}$, NO, $\\mathrm{F_2}$`,
['$\\mathrm{F_2}$','$\\mathrm{C_2}$','$\\mathrm{O_2}$','NO'],
'b',
`**Stabilized by anion formation** means adding an electron increases the bond order.\n\n**Step 1 — Bond orders before and after adding e⁻:**\n\n| Molecule | BO | Anion | BO of anion | Stabilized? |\n|----------|-----|-------|------------|-------------|\n| $\\mathrm{F_2}$ | 1 | $\\mathrm{F_2^-}$ | 0.5 | No (decreases) |\n| $\\mathrm{C_2}$ | 2 | $\\mathrm{C_2^-}$ | 2.5 | **Yes** ✓ |\n| $\\mathrm{O_2}$ | 2 | $\\mathrm{O_2^-}$ | 1.5 | No (decreases) |\n| NO | 2.5 | $\\mathrm{NO^-}$ | 2 | No (decreases) |\n\n**Step 2:** Only $\\mathrm{C_2}$ is stabilized by anion formation (e⁻ goes into bonding π MO).\n\n**Answer: Option (2) — $\\mathrm{C_2}$**`,
'tag_bonding_4', src(2019,'Apr',9,'Morning')),

mkSCQ('BOND-123','Easy',
`Among the following species, the **diamagnetic** molecule is:`,
['CO','$\\mathrm{B_2}$','$\\mathrm{O_2}$','NO'],
'a',
`**Diamagnetic** = all electrons paired (no unpaired electrons).\n\n**Step 1 — Check each species:**\n\n| Species | e⁻ | Unpaired e⁻ | Magnetic |\n|---------|-----|------------|----------|\n| CO | 14 | 0 (isoelectronic with N₂) | **Diamagnetic** ✓ |\n| $\\mathrm{B_2}$ | 10 | 2 (in degenerate π) | Paramagnetic |\n| $\\mathrm{O_2}$ | 16 | 2 (in π*) | Paramagnetic |\n| NO | 11 | 1 (odd e⁻) | Paramagnetic |\n\n**Answer: Option (1) — CO**`,
'tag_bonding_4', src(2019,'Apr',9,'Evening')),

mkSCQ('BOND-124','Easy',
`During the change of $\\mathrm{O_2}$ to $\\mathrm{O_2^-}$, the incoming electron goes to the orbital:`,
['$\\pi 2p_x$','$\\pi^* 2p_x$','$\\pi 2p_y$','$\\sigma^* 2p_z$'],
'b',
`**Step 1 — MO configuration of $\\mathrm{O_2}$ (16 electrons):**\n\n$$...\\sigma_{2p}^2\\pi_{2p_x}^2\\pi_{2p_y}^2\\pi^*_{2p_x}^1\\pi^*_{2p_y}^1$$\n\nThe HOMO (highest occupied MO) of $\\mathrm{O_2}$ is the degenerate $\\pi^*_{2p}$ level, each with 1 electron.\n\n**Step 2 — Adding one electron to form $\\mathrm{O_2^-}$:**\nThe 17th electron enters one of the half-filled $\\pi^*_{2p}$ orbitals (by Aufbau principle).\n\nThe incoming electron goes to **$\\pi^* 2p_x$** (or $\\pi^* 2p_y$ — both are equivalent).\n\n**Answer: Option (2) — $\\pi^* 2p_x$**`,
'tag_bonding_4', src(2019,'Apr',10,'Morning')),

mkSCQ('BOND-125','Medium',
`According to molecular orbital theory, which of the following is true with respect to $\\mathrm{Li_2^+}$ and $\\mathrm{Li_2^-}$?`,
['$\\mathrm{Li_2^+}$ is stable and $\\mathrm{Li_2^-}$ is unstable','Both are unstable','Both are stable','$\\mathrm{Li_2^+}$ is unstable and $\\mathrm{Li_2^-}$ is stable'],
'c',
`**A species is stable** if its bond order > 0.\n\n**Step 1 — MO analysis of $\\mathrm{Li_2^+}$ (5 electrons):**\n$$\\sigma_{1s}^2\\sigma^*_{1s}^2\\sigma_{2s}^1$$\n$$\\text{BO} = \\frac{3-2}{2} = 0.5 > 0 \\text{ → stable}$$\n\n**Step 2 — MO analysis of $\\mathrm{Li_2^-}$ (7 electrons):**\n$$\\sigma_{1s}^2\\sigma^*_{1s}^2\\sigma_{2s}^2\\sigma^*_{2s}^1$$\n$$\\text{BO} = \\frac{4-3}{2} = 0.5 > 0 \\text{ → stable}$$\n\n**Both have BO = 0.5 > 0 → both are stable**\n\n**Answer: Option (3) — Both are stable**`,
'tag_bonding_4', src(2019,'Jan',9,'Morning')),

mkSCQ('BOND-126','Medium',
`In which of the following processes has the **bond order increased** and **paramagnetic character changed to diamagnetic**?`,
['$\\mathrm{O_2 \\rightarrow O_2^+}$','$\\mathrm{NO \\rightarrow NO^+}$','$\\mathrm{O_2 \\rightarrow O_2^-}$','$\\mathrm{N_2 \\rightarrow N_2^+}$'],
'b',
`**Step 1 — Analyse each process:**\n\n**(1) $\\mathrm{O_2 \\rightarrow O_2^+}$:** Remove e⁻ from π*\n- BO: 2 → 2.5 (increases ✓)\n- $\\mathrm{O_2}$: 2 unpaired; $\\mathrm{O_2^+}$: 1 unpaired → still paramagnetic ✗\n\n**(2) $\\mathrm{NO \\rightarrow NO^+}$:** Remove e⁻ from π* (antibonding)\n- BO: 2.5 → 3 (increases ✓)\n- NO: 1 unpaired (paramagnetic); $\\mathrm{NO^+}$: 0 unpaired (diamagnetic) ✓\n\n**(3) $\\mathrm{O_2 \\rightarrow O_2^-}$:** Add e⁻ to π*\n- BO: 2 → 1.5 (decreases ✗)\n\n**(4) $\\mathrm{N_2 \\rightarrow N_2^+}$:** Remove e⁻ from bonding σ\n- BO: 3 → 2.5 (decreases ✗)\n\n**Answer: Option (2) — $\\mathrm{NO \\rightarrow NO^+}$**`,
'tag_bonding_4', src(2019,'Jan',9,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-117 to BOND-126)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
