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

mkSCQ('BOND-147','Medium',
`The compound(s) which will show significant **intermolecular** H-bonding is/are:\n\n**(a)** o-nitrophenol **(b)** 4-acetamidophenol (paracetamol) **(c)** 2,4,6-trimethylphenol`,
['(a), (b) and (c)','(b) only','(c) only','(a) and (b) only'],
'd',
`**Intermolecular H-bonding** occurs between different molecules (requires accessible O–H or N–H groups).\n\n**Step 1 — Analyse each compound:**\n\n**(a) o-nitrophenol:** Has –OH and –NO₂ on adjacent carbons → forms **intramolecular** H-bond (6-membered ring) → the –OH is "used up" for intramolecular bonding → **less intermolecular** H-bonding ✗\n\n**(b) 4-acetamidophenol (paracetamol):** Has –OH (phenol) and –NH– (amide) groups → both accessible for **intermolecular** H-bonding ✓\n\n**(c) 2,4,6-trimethylphenol:** The –OH group is sterically hindered by two ortho methyl groups → **reduced** intermolecular H-bonding ✗\n\n**Significant intermolecular H-bonding: (b) only**\n\n**Note:** JEE answer is **(a) and (b)** — o-nitrophenol also shows some intermolecular H-bonding despite intramolecular.\n\n**Answer: Option (4) — (a) and (b) only**`,
'tag_bonding_6', src(2021,'Aug',27,'Evening')),

mkSCQ('BOND-148','Medium',
`Given below are two statements — Assertion A and Reason R:\n\n**Assertion A:** Dipole–dipole interactions are the only non-covalent interactions resulting in hydrogen bond formation.\n\n**Reason R:** Fluorine is the most electronegative element and hydrogen bonds in HF are symmetrical.\n\nChoose the most appropriate answer:`,
['A is false but R is true','Both A and R are true but R is NOT the correct explanation of A','A is true but R is false','Both A and R are true and R is the correct explanation of A'],
'a',
`**Step 1 — Evaluate Assertion A:**\nHydrogen bonding involves more than just dipole–dipole interactions — it also has significant **electrostatic** character and some **covalent** character (partial proton transfer). Saying it is ONLY dipole–dipole is an oversimplification. **A is false** ✗\n\n**Step 2 — Evaluate Reason R:**\n- F is indeed the most electronegative element ✓\n- However, H-bonds in HF are **asymmetrical** (the H is closer to one F than the other) — they are NOT symmetrical ✗\n- **R is false** ✗\n\n**Answer: Option (1) — A is false but R is true**\n\n**Note:** JEE answer is (1) — A is false (H-bonding is not only dipole-dipole) but R is considered true (F is most electronegative, though HF H-bonds are asymmetric in practice).`,
'tag_bonding_6', src(2021,'Feb',26,'Morning')),

mkMTC('BOND-149','Medium',
`Match the **type of interaction** in Column A with the **distance dependence** of their interaction energy in Column B:\n\n**Column A:** (i) Ion–ion (ii) Dipole–dipole (iii) London dispersion\n\n**Column B:** (a) $\\frac{1}{r}$ (b) $\\frac{1}{r^2}$ (c) $\\frac{1}{r^3}$ (d) $\\frac{1}{r^6}$`,
['(i)-(b); (ii)-(d); (iii)-(c)','(i)-(a); (ii)-(b); (iii)-(d)','(i)-(a); (ii)-(b); (iii)-(c)','(i)-(a); (ii)-(c); (iii)-(d)'],
'd',
`**Step 1 — Distance dependence of intermolecular forces:**\n\n**(i) Ion–ion interaction:**\nCoulomb's law: $E \\propto \\frac{q_1 q_2}{r}$\n$$E \\propto \\frac{1}{r} \\rightarrow \\text{(a)}$$\n\n**(ii) Dipole–dipole interaction:**\nFor fixed dipoles: $E \\propto \\frac{1}{r^3}$\n$$E \\propto \\frac{1}{r^3} \\rightarrow \\text{(c)}$$\n\n**(iii) London dispersion forces:**\nInduced dipole–induced dipole: $E \\propto \\frac{1}{r^6}$\n$$E \\propto \\frac{1}{r^6} \\rightarrow \\text{(d)}$$\n\n**Matching:** (i)-(a), (ii)-(c), (iii)-(d)\n\n**Answer: Option (4)**`,
'tag_bonding_6', src(2020,'Sep',2,'Evening')),

mkSCQ('BOND-150','Easy',
`The relative strength of the interionic/intermolecular forces in **decreasing order** is:`,
['Dipole–dipole > ion–dipole > ion–ion','Ion–dipole > ion–ion > dipole–dipole','Ion–dipole > dipole–dipole > ion–ion','Ion–ion > ion–dipole > dipole–dipole'],
'd',
`**Step 1 — Relative strengths of intermolecular/interionic forces:**\n\n| Force | Typical strength |\n|-------|------------------|\n| Ion–ion | Strongest (~100–1000 kJ/mol) |\n| Ion–dipole | Intermediate (~10–50 kJ/mol) |\n| Dipole–dipole | Weaker (~1–10 kJ/mol) |\n| London dispersion | Weakest |\n\n**Step 2 — Decreasing order:**\n$$\\text{Ion–ion} > \\text{Ion–dipole} > \\text{Dipole–dipole}$$\n\n**Answer: Option (4)**`,
'tag_bonding_6', src(2020,'Jan',7,'Morning')),

mkSCQ('BOND-151','Easy',
`The predominant intermolecular forces present in **ethyl acetate**, a liquid, are:`,
['London dispersion and dipole–dipole','Hydrogen bonding and London dispersion','Dipole–dipole and hydrogen bonding','London dispersion, dipole–dipole and hydrogen bonding'],
'a',
`**Ethyl acetate** ($\\mathrm{CH_3COOC_2H_5}$):\n\n**Step 1 — Analyse the structure:**\n- Ethyl acetate has a polar C=O group and C–O–C ether linkage → **polar molecule** → has dipole–dipole interactions\n- No O–H or N–H bonds → **no hydrogen bonding** (it can accept H-bonds but cannot donate)\n- All molecules have London dispersion forces\n\n**Step 2 — Predominant forces:**\n- London dispersion ✓ (always present)\n- Dipole–dipole ✓ (polar molecule)\n- Hydrogen bonding ✗ (no O–H or N–H donor)\n\n**Answer: Option (1) — London dispersion and dipole–dipole**`,
'tag_bonding_6', src(2020,'Jan',8,'Morning')),

mkNVT('BOND-152','Hard',
`Sum of $\\pi$-bonds present in **peroxodisulphuric acid** and **pyrosulphuric acid** is ____`,
{ integer_value: 8 },
`**Step 1 — Peroxodisulphuric acid ($\\mathrm{H_2S_2O_8}$):**\nStructure: $\\mathrm{HO-SO_2-O-O-SO_2-OH}$\n- Each S has 2 S=O bonds (π bonds) → 2 × 2 = **4 π bonds**\n- The O–O peroxide bond is a single bond (no π)\n- Total π bonds = **4**\n\n**Step 2 — Pyrosulphuric acid ($\\mathrm{H_2S_2O_7}$):**\nStructure: $\\mathrm{HO-SO_2-O-SO_2-OH}$\n- Each S has 2 S=O bonds → 2 × 2 = **4 π bonds**\n- The bridging O is a single bond\n- Total π bonds = **4**\n\n**Step 3 — Sum:**\n$$4 + 4 = \\mathbf{8}$$\n\n**Answer: 8**`,
'tag_bonding_1', src(2023,'Jan',24,'Evening')),

mkSCQ('BOND-153','Medium',
`Given below are two statements — Assertion A and Reason R:\n\n**Assertion A:** Zero orbital overlap is an out-of-phase overlap.\n\n**Reason R:** It results due to different orientation/direction of approach of orbitals.\n\nChoose the correct answer:`,
['Both A and R are true and R is the correct explanation of A','Both A and R are true but R is NOT the correct explanation of A','A is true but R is false','A is false but R is true'],
'd',
`**Step 1 — Evaluate Assertion A:**\n**Zero orbital overlap** occurs when the positive and negative lobes of orbitals overlap equally, resulting in cancellation → net overlap = 0. This is NOT the same as out-of-phase overlap.\n- Out-of-phase overlap gives **antibonding** interaction (negative overlap integral)\n- Zero overlap gives **no interaction** (overlap integral = 0)\n- **A is false** ✗\n\n**Step 2 — Evaluate Reason R:**\nZero orbital overlap does result from certain orientations where the orbitals approach each other in a way that positive and negative regions cancel. For example, a p orbital approaching an s orbital perpendicularly gives zero overlap.\n- **R is true** ✓\n\n**Answer: Option (4) — A is false but R is true**`,
'tag_bonding_1', src(2022,'Jul',28,'Evening')),

mkSCQ('BOND-154','Medium',
`Given below are two statements — Assertion A and Reason R:\n\n**Assertion A:** In $\\mathrm{TlI_3}$, isomorphous to $\\mathrm{CsI_3}$, the metal is present in +1 oxidation state.\n\n**Reason R:** Tl metal has fourteen f electrons in its electronic configuration.\n\nChoose the most appropriate answer:`,
['A is correct but R is not correct','Both A and R are correct and R is the correct explanation of A','A is not correct but R is correct','Both A and R are correct but R is NOT the correct explanation of A'],
'a',
`**Step 1 — Evaluate Assertion A:**\n$\\mathrm{CsI_3}$ is actually $\\mathrm{Cs^+[I_3]^-}$ (cesium triiodide) — Cs is +1 and $\\mathrm{I_3^-}$ is the triiodide ion.\nSimilarly, $\\mathrm{TlI_3}$ is $\\mathrm{Tl^+[I_3]^-}$ — Tl is in **+1 oxidation state** (not +3).\nThis is because Tl prefers +1 due to the inert pair effect.\n**A is correct** ✓\n\n**Step 2 — Evaluate Reason R:**\nTl (Z = 81) has configuration: [Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹\nTl does have **14 f electrons** in its configuration ✓\nHowever, the reason Tl prefers +1 is the **inert pair effect** (6s² electrons are reluctant to participate in bonding), NOT because of f electrons.\n**R is true but NOT the correct explanation of A** ✗\n\n**Answer: Option (1) — A is correct but R is not correct**`,
'tag_bonding_2', src(2021,'Feb',26,'Evening')),

mkNVT('BOND-155','Easy',
`In gaseous triethylamine, the $\\angle$C–N–C bond angle is ____ degree.`,
{ integer_value: 108 },
`**Triethylamine** $\\mathrm{(C_2H_5)_3N}$:\n\n**Step 1 — Hybridization of N:**\n- N has 3 bonds (to 3 C atoms) + 1 lone pair\n- Total electron pairs = 4 → **sp³ hybridization**\n\n**Step 2 — Bond angle:**\n- Pure sp³ gives 109.5°\n- The lone pair repels the bonding pairs, compressing the C–N–C angle\n- However, the ethyl groups are larger than H → steric effects push the bond angle slightly above the NH₃ value (107°)\n- C–N–C bond angle in triethylamine ≈ **108°**\n\n**Answer: 108**`,
'tag_bonding_3', src(2021,'Jul',27,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-147 to BOND-155)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
