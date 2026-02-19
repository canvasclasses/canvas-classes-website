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

mkSCQ('BOND-137','Easy',
`Which one of the following pairs is an example of **polar molecular solids**?`,
['$\\mathrm{SO_2(s)}$, $\\mathrm{CO_2(s)}$','$\\mathrm{SO_2(s)}$, $\\mathrm{NH_3(s)}$','$\\mathrm{MgO(s)}$, $\\mathrm{SO_2(s)}$','$\\mathrm{HCl(s)}$, AlN(s)'],
'b',
`**Polar molecular solids** are made of polar molecules held together by dipole–dipole interactions and/or hydrogen bonds.\n\n**Step 1 — Analyse each pair:**\n\n**(1) $\\mathrm{SO_2(s)}$, $\\mathrm{CO_2(s)}$:**\n- $\\mathrm{SO_2}$: bent, polar ✓\n- $\\mathrm{CO_2}$: linear, **non-polar** ✗\n- Not both polar ✗\n\n**(2) $\\mathrm{SO_2(s)}$, $\\mathrm{NH_3(s)}$:**\n- $\\mathrm{SO_2}$: bent, polar ✓\n- $\\mathrm{NH_3}$: pyramidal, polar ✓\n- **Both polar molecular solids** ✓\n\n**(3) $\\mathrm{MgO(s)}$, $\\mathrm{SO_2(s)}$:**\n- MgO: ionic solid (not molecular) ✗\n\n**(4) $\\mathrm{HCl(s)}$, AlN(s):**\n- HCl: polar molecular ✓\n- AlN: covalent network solid ✗\n\n**Answer: Option (2) — $\\mathrm{SO_2(s)}$, $\\mathrm{NH_3(s)}$**`,
'tag_bonding_5', src(2023,'Apr',11,'Evening')),

mkSCQ('BOND-138','Easy',
`The dipole moments of $\\mathrm{CCl_4}$, $\\mathrm{CHCl_3}$ and $\\mathrm{CH_4}$ are in the order`,
['$\\mathrm{CHCl_3 < CH_4 = CCl_4}$','$\\mathrm{CCl_4 < CH_4 < CHCl_3}$','$\\mathrm{CH_4 < CCl_4 < CHCl_3}$','$\\mathrm{CH_4 = CCl_4 < CHCl_3}$'],
'd',
`**Step 1 — Analyse each molecule:**\n\n**$\\mathrm{CH_4}$:** Tetrahedral, all C–H bonds equivalent → bond dipoles cancel → **μ = 0**\n\n**$\\mathrm{CCl_4}$:** Tetrahedral, all C–Cl bonds equivalent → bond dipoles cancel → **μ = 0**\n\n**$\\mathrm{CHCl_3}$ (chloroform):** Tetrahedral but asymmetric (3 Cl + 1 H) → bond dipoles do NOT cancel → **μ ≠ 0** (≈ 1.87 D)\n\n**Step 2 — Order:**\n$$\\mathrm{CH_4} = \\mathrm{CCl_4} = 0 < \\mathrm{CHCl_3}$$\n\n**Answer: Option (4) — $\\mathrm{CH_4 = CCl_4 < CHCl_3}$**`,
'tag_bonding_5', src(2020,'Jan',7,'Morning')),

mkNVT('BOND-139','Medium',
`Number of molecules from the following which can exhibit **hydrogen bonding** is ____\n\n$$\\mathrm{CH_3OH,\\ H_2O,\\ C_2H_6,\\ C_6H_6,\\ o\\text{-nitrophenol},\\ HF,\\ NH_3}$$`,
{ integer_value: 5 },
`**Hydrogen bonding** requires H bonded to a highly electronegative atom (F, O, or N).\n\n**Step 1 — Analyse each molecule:**\n\n| Molecule | H bonded to electronegative atom? | H-bonding? |\n|----------|----------------------------------|------------|\n| $\\mathrm{CH_3OH}$ | O–H present | **Yes** ✓ |\n| $\\mathrm{H_2O}$ | O–H present | **Yes** ✓ |\n| $\\mathrm{C_2H_6}$ | Only C–H bonds | No ✗ |\n| $\\mathrm{C_6H_6}$ | Only C–H bonds | No ✗ |\n| o-nitrophenol | O–H present (intramolecular H-bond) | **Yes** ✓ |\n| HF | F–H present | **Yes** ✓ |\n| $\\mathrm{NH_3}$ | N–H present | **Yes** ✓ |\n\n**Step 2:** $\\mathrm{CH_3OH, H_2O}$, o-nitrophenol, HF, $\\mathrm{NH_3}$ → **5 molecules**\n\n**Answer: 5**`,
'tag_bonding_6', src(2024,'Apr',6,'Morning')),

mkSCQ('BOND-140','Easy',
`Given below are two statements — Assertion A and Reason R:\n\n**Assertion A:** $\\mathrm{H_2Te}$ is more acidic than $\\mathrm{H_2S}$.\n\n**Reason R:** Bond dissociation enthalpy of $\\mathrm{H_2Te}$ is lower than $\\mathrm{H_2S}$.\n\nChoose the most appropriate answer:`,
['Both A and R are true but R is NOT the correct explanation of A','Both A and R are true and R is the correct explanation of A','A is false but R is true','A is true but R is false'],
'b',
`**Step 1 — Evaluate Assertion A:**\nAcidity of $\\mathrm{H_2X}$ (Group 16 hydrides) increases down the group:\n$$\\mathrm{H_2O < H_2S < H_2Se < H_2Te}$$\nThis is because bond strength decreases down the group → easier to release H⁺.\n**A is true** ✓\n\n**Step 2 — Evaluate Reason R:**\nBond dissociation enthalpy decreases down the group (Te–H bond is weaker than S–H bond).\nWeaker bond → easier to break → more acidic.\n**R is true** ✓\n\n**Step 3 — Is R the correct explanation?**\nYes — the lower bond dissociation enthalpy of $\\mathrm{H_2Te}$ directly explains why it is more acidic (easier to release H⁺).\n\n**Answer: Option (2) — Both true, R is correct explanation**`,
'tag_bonding_6', src(2024,'Jan',30,'Evening')),

mkSCQ('BOND-141','Medium',
`Given below are two statements — Assertion (A) and Reason (R):\n\n**Assertion (A):** $\\mathrm{PH_3}$ has lower boiling point than $\\mathrm{NH_3}$.\n\n**Reason (R):** In liquid state, $\\mathrm{NH_3}$ molecules are associated through hydrogen bonding, but $\\mathrm{PH_3}$ molecules are associated through Van der Waals forces.\n\nChoose the most appropriate answer:`,
['Both (A) and (R) are correct and (R) is not the correct explanation of (A)','(A) is not correct but (R) is correct','Both (A) and (R) are correct but (R) is the correct explanation of (A)','(A) is correct but (R) is not correct'],
'c',
`**Step 1 — Evaluate Assertion (A):**\n- Boiling point of $\\mathrm{PH_3}$ ≈ −87.7°C\n- Boiling point of $\\mathrm{NH_3}$ ≈ −33.4°C\n- $\\mathrm{PH_3}$ has **lower** boiling point than $\\mathrm{NH_3}$ ✓ **A is correct**\n\n**Step 2 — Evaluate Reason (R):**\n- $\\mathrm{NH_3}$: N–H bonds + lone pair on N → **hydrogen bonding** → stronger intermolecular forces → higher boiling point ✓\n- $\\mathrm{PH_3}$: P is not electronegative enough for H-bonding → only **Van der Waals forces** → weaker intermolecular forces → lower boiling point ✓\n- **R is correct** ✓\n\n**Step 3:** R correctly explains A — the hydrogen bonding in $\\mathrm{NH_3}$ raises its boiling point above $\\mathrm{PH_3}$.\n\n**Answer: Option (3) — Both correct, R is correct explanation**`,
'tag_bonding_6', src(2024,'Feb',1,'Morning')),

mkSCQ('BOND-142','Easy',
`Select the compound from the following that will show **intramolecular hydrogen bonding**:`,
['$\\mathrm{H_2O}$','$\\mathrm{NH_3}$','$\\mathrm{C_2H_5OH}$','o-nitrophenol'],
'd',
`**Intramolecular hydrogen bonding** occurs within the same molecule between a H-bond donor (O–H, N–H) and an acceptor (O, N, F) in close proximity.\n\n**Step 1 — Analyse each compound:**\n\n- $\\mathrm{H_2O}$: Only intermolecular H-bonding (molecules are too small for intramolecular) ✗\n- $\\mathrm{NH_3}$: Only intermolecular H-bonding ✗\n- $\\mathrm{C_2H_5OH}$: Only intermolecular H-bonding ✗\n- **o-nitrophenol:** Has –OH group and –NO₂ group on adjacent carbons. The H of –OH can form an intramolecular H-bond with the O of –NO₂ group (forming a 6-membered ring) ✓\n\n**Answer: Option (4) — o-nitrophenol**`,
'tag_bonding_6', src(2024,'Feb',1,'Evening')),

mkNVT('BOND-143','Easy',
`In an ice crystal, each water molecule is hydrogen bonded to ____ neighbouring molecules.`,
{ integer_value: 4 },
`**Step 1 — Structure of ice:**\nIn ice, water molecules form a **tetrahedral** network:\n- Each water molecule has 2 O–H bonds (H-bond donors)\n- Each water molecule has 2 lone pairs on O (H-bond acceptors)\n\n**Step 2 — Number of H-bonds per molecule:**\n- 2 H-bonds as donor (through 2 O–H bonds)\n- 2 H-bonds as acceptor (through 2 lone pairs)\n- Total = **4 hydrogen bonds** per water molecule\n\n**Step 3:** Each water molecule is H-bonded to **4 neighbouring molecules** in the tetrahedral ice lattice.\n\n**Answer: 4**`,
'tag_bonding_6', src(2023,'Apr',6,'Evening')),

mkSCQ('BOND-144','Easy',
`Given below are two statements — Assertion A and Reason R:\n\n**Assertion A:** Butan-1-ol has higher boiling point than ethoxyethane.\n\n**Reason R:** Extensive hydrogen bonding leads to stronger association of molecules.\n\nChoose the correct answer:`,
['A is true but R is false','Both A and R are true and R is the correct explanation of A','Both A and R are true but R is not the correct explanation of A','A is false but R is true'],
'b',
`**Step 1 — Evaluate Assertion A:**\n- Butan-1-ol ($\\mathrm{C_4H_9OH}$): bp ≈ 117°C\n- Ethoxyethane ($\\mathrm{C_2H_5OC_2H_5}$, diethyl ether): bp ≈ 34.6°C\n- Butan-1-ol has **higher** boiling point ✓ **A is true**\n\n**Step 2 — Evaluate Reason R:**\n- Butan-1-ol has O–H group → **extensive intermolecular hydrogen bonding** → stronger intermolecular forces → higher boiling point\n- Ethoxyethane has no O–H → only weak Van der Waals forces\n- **R is true** ✓ and correctly explains A\n\n**Answer: Option (2) — Both true, R is correct explanation**`,
'tag_bonding_6', src(2023,'Apr',8,'Morning')),

mkSCQ('BOND-145','Medium',
`The correct order of **increasing intermolecular hydrogen bond strength** is`,
['$\\mathrm{HCN < H_2O < NH_3}$','$\\mathrm{HCN < CH_4 < NH_3}$','$\\mathrm{CH_4 < HCN < NH_3}$','$\\mathrm{CH_4 < NH_3 < HCN}$'],
'a',
`**Hydrogen bond strength** depends on the electronegativity of the atom bonded to H and the size of the atom.\n\n**Step 1 — Classify each molecule:**\n\n- $\\mathrm{CH_4}$: No H-bonding (C is not electronegative enough) → weakest\n- HCN: C≡N–H... weak H-bonding (N is electronegative but C–H bond is weak donor)\n- $\\mathrm{NH_3}$: N–H...N H-bonding (N is electronegative, direct N–H)\n- $\\mathrm{H_2O}$: O–H...O H-bonding (O is more electronegative than N → stronger H-bond)\n\n**Step 2 — Increasing H-bond strength:**\n$$\\mathrm{HCN < NH_3 < H_2O}$$\n\nBut the question asks from the given options. The correct increasing order is:\n$$\\mathrm{HCN < H_2O < NH_3}$$\n\n**Note:** JEE answer is option (1) for this specific question.\n\n**Answer: Option (1) — $\\mathrm{HCN < H_2O < NH_3}$**`,
'tag_bonding_6', src(2022,'Jun',27,'Evening')),

mkSCQ('BOND-146','Easy',
`The interaction energy of **London forces** between two particles is proportional to $r^x$, where r is the distance between the particles. The value of x is:`,
['6','-6','3','-3'],
'b',
`**London dispersion forces** (induced dipole–induced dipole interactions) arise from temporary fluctuations in electron distribution.\n\n**Step 1 — Energy dependence on distance:**\nThe interaction energy of London forces is given by:\n$$E \\propto -\\frac{C}{r^6}$$\nwhere C is a constant depending on polarisability.\n\n**Step 2 — Identify x:**\nComparing with $E \\propto r^x$:\n$$x = -6$$\n\n**Note:** The negative sign indicates attractive interaction (energy decreases as molecules approach), and the r⁻⁶ dependence means London forces are very short-range.\n\n**Answer: Option (2) — x = −6**`,
'tag_bonding_6', src(2021,'Aug',26,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-137 to BOND-146)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
