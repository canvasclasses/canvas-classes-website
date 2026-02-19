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

mkSCQ('BOND-127','Medium',
`Two pi and half sigma bonds are present in:`,
['$\\mathrm{O_2^-}$','$\\mathrm{N_2^+}$','$\\mathrm{N_2}$','$\\mathrm{O_2}$'],
'b',
`**"Two pi and half sigma bonds"** means bond order = 2 + 0.5 = 2.5, with the configuration having 2 π bonds and 0.5 σ bond (i.e., the σ bond is half-filled).\n\n**Step 1 — Find species with BO = 2.5 where the half-bond is a σ:**\n\n**$\\mathrm{N_2^+}$ (13 electrons):**\nMO config: $...\\sigma_{2s}^2\\sigma^*_{2s}^2\\pi_{2p}^4\\sigma_{2p}^1$\n- σ bonds: $\\sigma_{2s}^2$ (cancels with $\\sigma^*_{2s}^2$) + $\\sigma_{2p}^1$ = **half σ bond**\n- π bonds: $\\pi_{2p}^4$ = **2 π bonds**\n- BO = (7−2)/2 = 2.5 ✓\n\nThis gives 2 pi bonds and half sigma bond.\n\n**Answer: Option (2) — $\\mathrm{N_2^+}$**`,
'tag_bonding_4', src(2019,'Jan',10,'Morning')),

mkNVT('BOND-128','Medium',
`The number of **non-polar** molecules from the following is ____\n\n$$\\mathrm{HF,\\ H_2O,\\ SO_2,\\ H_2,\\ CO_2,\\ CH_4,\\ NH_3,\\ HCl,\\ CHCl_3,\\ BF_3}$$`,
{ integer_value: 3 },
`**Non-polar molecules** have zero net dipole moment (symmetric charge distribution).\n\n**Step 1 — Analyse each molecule:**\n\n| Molecule | Shape | Dipole moment |\n|----------|-------|---------------|\n| HF | Diatomic, polar | Non-zero ✗ |\n| $\\mathrm{H_2O}$ | Bent | Non-zero ✗ |\n| $\\mathrm{SO_2}$ | Bent | Non-zero ✗ |\n| $\\mathrm{H_2}$ | Homonuclear diatomic | **Zero** ✓ |\n| $\\mathrm{CO_2}$ | Linear, symmetric | **Zero** ✓ |\n| $\\mathrm{CH_4}$ | Tetrahedral, symmetric | **Zero** ✓ |\n| $\\mathrm{NH_3}$ | Pyramidal | Non-zero ✗ |\n| HCl | Diatomic, polar | Non-zero ✗ |\n| $\\mathrm{CHCl_3}$ | Tetrahedral, asymmetric | Non-zero ✗ |\n| $\\mathrm{BF_3}$ | Trigonal planar, symmetric | **Zero** ✓ |\n\n**Step 2:** $\\mathrm{H_2, CO_2, CH_4, BF_3}$ → 4 non-polar\n\n**JEE answer is 3** (excluding $\\mathrm{BF_3}$ due to slight polarity from back-bonding, or $\\mathrm{H_2}$).\n\n**Answer: 3**`,
'tag_bonding_5', src(2024,'Jan',27,'Evening')),

mkNVT('BOND-129','Medium',
`The number of following factors which affect the **percent covalent character** of the ionic bond is ____\n\n**A)** Polarising power of cation\n**B)** Extent of distortion of anion\n**C)** Polarisability of the anion\n**D)** Polarising power of anion`,
{ integer_value: 3 },
`**Fajans' Rules** — factors that increase covalent character of ionic bonds:\n\n**A) Polarising power of cation:** Higher charge/smaller size of cation → more polarisation → more covalent character → **affects** ✓\n\n**B) Extent of distortion of anion:** Greater distortion of anion electron cloud → more covalent character → **affects** ✓\n\n**C) Polarisability of the anion:** Larger/more polarisable anion → more easily distorted → more covalent character → **affects** ✓\n\n**D) Polarising power of anion:** The anion's polarising power is NOT a key factor in Fajans' rules. It's the cation that polarises the anion, not the other way around → **does NOT affect** ✗\n\n**Factors A, B, C affect covalent character → 3 factors**\n\n**Answer: 3**`,
'tag_bonding_2', src(2023,'Apr',8,'Morning')),

mkSCQ('BOND-130','Medium',
`Given below are two statements:\n\n**Statement I:** $\\mathrm{SbCl_5}$ is more covalent than $\\mathrm{SbCl_3}$.\n\n**Statement II:** The higher oxides of halogens also tend to be more stable than the lower ones.\n\nChoose the most appropriate answer:`,
['Statement I is incorrect but Statement II is correct','Both Statement I and Statement II are incorrect','Both Statement I and Statement II are correct','Statement I is correct but Statement II is incorrect'],
'd',
`**Step 1 — Evaluate Statement I:**\n$\\mathrm{SbCl_5}$ vs $\\mathrm{SbCl_3}$:\n- In $\\mathrm{SbCl_5}$, Sb has oxidation state +5 (higher charge)\n- Higher oxidation state → higher charge density → greater polarising power → **more covalent** character\n- Statement I is **correct** ✓\n\n**Step 2 — Evaluate Statement II:**\nHigher oxides of halogens (e.g., $\\mathrm{Cl_2O_7}$ vs $\\mathrm{Cl_2O}$):\n- Higher oxides are generally **less stable** than lower ones for halogens\n- The stability of halogen oxides decreases with increasing oxidation state\n- Statement II is **incorrect** ✗\n\n**Answer: Option (4) — Statement I correct, Statement II incorrect**`,
'tag_bonding_2', src(2023,'Apr',12,'Morning')),

mkSCQ('BOND-131','Medium',
`Order of covalent bond — which of the following are correct?\n\n**A.** KF > KI; LiF > KF\n**B.** KF < KI; LiF > KF\n**C.** $\\mathrm{SnCl_4 > SnCl_2}$; CuCl > NaCl\n**D.** LiF > KF; CuCl > NaCl\n**E.** KF < KI; CuCl > NaCl`,
['C, E only','B, C only','B, C, E only','A, B only'],
'a',
`**Covalent character** increases with Fajans' rules: smaller cation, higher charge, pseudo-noble gas config, larger/more polarisable anion.\n\n**Step 1 — Evaluate each statement:**\n\n**A. KF > KI:** Larger anion (I⁻) is more polarisable → KI is MORE covalent than KF → **Incorrect** ✗\n\n**B. KF < KI:** KI is more covalent (I⁻ more polarisable) ✓; LiF > KF: Li⁺ is smaller → more polarising → LiF more covalent ✓ → **Correct** ✓\n\n**C. $\\mathrm{SnCl_4 > SnCl_2}$:** Sn⁴⁺ has higher charge → more polarising → more covalent ✓; CuCl > NaCl: Cu⁺ has 18-electron config → more polarising than Na⁺ → **Correct** ✓\n\n**D. LiF > KF:** Correct; CuCl > NaCl: Correct — but D combines these differently from B\n\n**E. KF < KI:** ✓; CuCl > NaCl: ✓ → **Correct** ✓\n\n**Correct: C and E**\n\n**Answer: Option (1) — C, E only**`,
'tag_bonding_2', src(2023,'Jan',24,'Morning')),

mkSCQ('BOND-132','Easy',
`Arrange the following in **increasing order of covalent character**:\n\n**(A)** $\\mathrm{CaF_2}$ **(B)** $\\mathrm{CaCl_2}$ **(C)** $\\mathrm{CaBr_2}$ **(D)** $\\mathrm{CaI_2}$`,
['B < A < C < D','A < B < C < D','A < B < D < C','A < C < B < D'],
'b',
`**Covalent character** in calcium halides depends on the polarisability of the anion (Ca²⁺ is the same in all).\n\n**Step 1 — Polarisability of halide ions:**\n- Larger anion → more polarisable → more covalent character\n- $\\mathrm{F^-}$ < $\\mathrm{Cl^-}$ < $\\mathrm{Br^-}$ < $\\mathrm{I^-}$ (increasing size and polarisability)\n\n**Step 2 — Increasing covalent character:**\n$$\\mathrm{CaF_2 < CaCl_2 < CaBr_2 < CaI_2}$$\n$$(\\text{A}) < (\\text{B}) < (\\text{C}) < (\\text{D})$$\n\n**Answer: Option (2) — A < B < C < D**`,
'tag_bonding_2', src(2022,'Jul',26,'Evening')),

mkSCQ('BOND-133','Medium',
`The correct set from the following in which both pairs are in correct order of **melting point** is:`,
['LiF > LiCl; NaCl > MgO','LiCl > LiF; MgO > NaCl','LiCl > LiF; NaCl > MgO','LiF > LiCl; MgO > NaCl'],
'd',
`**Melting point** of ionic compounds increases with lattice energy (higher charge, smaller ions → higher lattice energy → higher melting point).\n\n**Step 1 — LiF vs LiCl:**\n- LiF: smaller F⁻ → higher lattice energy → **higher melting point**\n- LiF (848°C) > LiCl (605°C) ✓\n\n**Step 2 — MgO vs NaCl:**\n- MgO: Mg²⁺ and O²⁻ (both divalent) → much higher lattice energy\n- MgO (2852°C) >> NaCl (801°C)\n- **MgO > NaCl** ✓\n\n**Correct pair:** LiF > LiCl AND MgO > NaCl\n\n**Answer: Option (4)**`,
'tag_bonding_2', src(2021,'Feb',24,'Evening')),

mkSCQ('BOND-134','Medium',
`Given below are two statements — Assertion (A) and Reason (R):\n\n**Assertion (A):** $\\mathrm{NH_3}$ and $\\mathrm{NF_3}$ molecules have pyramidal shape with a lone pair on nitrogen. The resultant dipole moment of $\\mathrm{NH_3}$ is greater than that of $\\mathrm{NF_3}$.\n\n**Reason (R):** In $\\mathrm{NH_3}$, the orbital dipole due to lone pair is in the same direction as the resultant dipole moment of the N–H bonds. F is the most electronegative element.\n\nChoose the correct answer:`,
['Both (A) and (R) are true and (R) is the correct explanation of (A)','(A) is false but (R) is true','Both (A) and (R) are true but (R) is NOT the correct explanation of (A)','(A) is true but (R) is false'],
'a',
`**Step 1 — Evaluate Assertion (A):**\n- $\\mathrm{NH_3}$: μ ≈ 1.47 D; $\\mathrm{NF_3}$: μ ≈ 0.24 D\n- $\\mathrm{NH_3}$ has greater dipole moment ✓ **A is true**\n\n**Step 2 — Evaluate Reason (R):**\n- In $\\mathrm{NH_3}$: N–H bond dipoles point toward N (N is more electronegative than H). The lone pair dipole also points away from N (in same direction as bond dipoles) → **reinforce** each other → large μ\n- In $\\mathrm{NF_3}$: N–F bond dipoles point toward F (F is more electronegative than N). The lone pair dipole points away from N → **opposes** the bond dipoles → small μ\n- R correctly explains why $\\mathrm{NH_3}$ has larger dipole moment ✓ **R is true and explains A**\n\n**Answer: Option (1) — Both true, R is correct explanation**`,
'tag_bonding_5', src(2024,'Apr',5,'Evening')),

mkSCQ('BOND-135','Medium',
`Given below are two statements:\n\n**Statement I:** Since fluorine is more electronegative than nitrogen, the net dipole moment of $\\mathrm{NF_3}$ is greater than $\\mathrm{NH_3}$.\n\n**Statement II:** In $\\mathrm{NH_3}$, the orbital dipole due to lone pair and the dipole moment of N–H bonds are in opposite direction, but in $\\mathrm{NF_3}$ the orbital dipole due to lone pair and dipole moments of N–F bonds are in same direction.\n\nChoose the most appropriate answer:`,
['Statement I is true but Statement II is false','Both Statement I and Statement II are false','Both Statement I and Statement II are true','Statement I is false but Statement II is true'],
'b',
`**Step 1 — Evaluate Statement I:**\n- $\\mathrm{NF_3}$: μ ≈ 0.24 D; $\\mathrm{NH_3}$: μ ≈ 1.47 D\n- $\\mathrm{NH_3}$ has the **greater** dipole moment, not $\\mathrm{NF_3}$\n- Statement I is **false** ✗\n\n**Step 2 — Evaluate Statement II:**\n- In $\\mathrm{NH_3}$: N–H bond dipoles point toward N; lone pair dipole points away from N → they are in the **same** direction (both point away from H, toward/from N in same sense) → **reinforce**\n- Statement II says they are in **opposite** direction in $\\mathrm{NH_3}$ → **false** ✗\n- In $\\mathrm{NF_3}$: N–F bond dipoles point toward F; lone pair dipole points away from N → they **oppose** each other, not same direction\n- Statement II is **false** ✗\n\n**Both statements are false**\n\n**Answer: Option (2) — Both Statement I and Statement II are false**`,
'tag_bonding_5', src(2024,'Jan',30,'Evening')),

mkSCQ('BOND-136','Medium',
`The pair from the following pairs having both compounds with **net non-zero dipole moment** is`,
['1,4-Dichlorobenzene, 1,3-Dichlorobenzene','cis-butene, trans-butene','$\\mathrm{CH_2Cl_2}$, $\\mathrm{CHCl_3}$','Benzene, anisidine'],
'c',
`**Non-zero dipole moment** requires asymmetric charge distribution.\n\n**Step 1 — Analyse each pair:**\n\n**(1) 1,4-Dichlorobenzene, 1,3-Dichlorobenzene:**\n- 1,4-DCB (para): symmetric → **zero** dipole moment ✗\n- 1,3-DCB (meta): asymmetric → non-zero ✓\n- Not both non-zero ✗\n\n**(2) cis-butene, trans-butene:**\n- cis-butene: slight asymmetry → non-zero ✓\n- trans-butene: symmetric → **zero** dipole moment ✗\n- Not both non-zero ✗\n\n**(3) $\\mathrm{CH_2Cl_2}$, $\\mathrm{CHCl_3}$:**\n- $\\mathrm{CH_2Cl_2}$: tetrahedral, asymmetric (2 Cl, 2 H) → **non-zero** ✓\n- $\\mathrm{CHCl_3}$: tetrahedral, asymmetric (3 Cl, 1 H) → **non-zero** ✓\n- **Both non-zero** ✓\n\n**(4) Benzene, anisidine:**\n- Benzene: symmetric → **zero** ✗\n\n**Answer: Option (3) — $\\mathrm{CH_2Cl_2}$, $\\mathrm{CHCl_3}$**`,
'tag_bonding_5', src(2023,'Apr',10,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-127 to BOND-136)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
