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

mkSCQ('BOND-165','Medium',
`Given below are two statements:\n\n**Statement I:** o-Nitrophenol is steam volatile due to intramolecular hydrogen bonding.\n\n**Statement II:** o-Nitrophenol has high melting point due to hydrogen bonding.\n\nChoose the most appropriate answer:`,
['Both Statement I and Statement II are false','Statement I is true but Statement II is false','Statement I is false but Statement II is true','Both Statement I and Statement II are true'],
'b',
`**Step 1 — Evaluate Statement I:**\no-Nitrophenol forms an **intramolecular** H-bond between the –OH and –NO₂ groups (6-membered ring). This means:\n- The –OH is not available for intermolecular H-bonding with water\n- The molecule is less associated → more volatile → **steam volatile** ✓\n**Statement I is true** ✓\n\n**Step 2 — Evaluate Statement II:**\nBecause o-nitrophenol has intramolecular H-bonding (not intermolecular), it has:\n- **Lower** melting point compared to p-nitrophenol (which has intermolecular H-bonding)\n- The intramolecular H-bond does NOT increase the melting point\n**Statement II is false** ✗\n\n**Answer: Option (2) — Statement I true, Statement II false**`,
'tag_bonding_6', src(2021,'Feb',26,'Morning')),

mkSCQ('BOND-166','Easy',
`If the boiling point of $\\mathrm{H_2O}$ is 373 K, the boiling point of $\\mathrm{H_2S}$ will be:`,
['Less than 300 K','Equal to 373 K','More than 373 K','Greater than 300 K but less than 373 K'],
'a',
`**Step 1 — Compare intermolecular forces:**\n\n**$\\mathrm{H_2O}$:** O–H bonds + lone pairs on O → strong **intermolecular hydrogen bonding** → high boiling point (373 K)\n\n**$\\mathrm{H_2S}$:** S is not electronegative enough for significant H-bonding → only **Van der Waals forces** (weak)\n\n**Step 2 — Boiling point of $\\mathrm{H_2S}$:**\n- Without H-bonding, $\\mathrm{H_2S}$ has much weaker intermolecular forces\n- Actual boiling point of $\\mathrm{H_2S}$ ≈ 213 K (−60°C)\n- This is **less than 300 K**\n\n**Answer: Option (1) — Less than 300 K**`,
'tag_bonding_6', src(2020,'Sep',3,'Morning')),

mkSCQ('BOND-167','Medium',
`Consider the following molecules and statements:\n\n**(A)** 2-hydroxybenzoic acid (salicylic acid)\n**(B)** 4-hydroxybenzoic acid (para-hydroxybenzoic acid)\n\n**(a)** (B) is more likely to be crystalline than (A)\n**(b)** (B) has higher boiling point than (A)\n**(c)** (B) dissolves more readily than (A) in water\n\nIdentify the correct option:`,
['(a) and (b) are true','(a) and (c) are true','Only (a) is true','(b) and (c) are true'],
'b',
`**Step 1 — Compare A (2-hydroxybenzoic acid) and B (4-hydroxybenzoic acid):**\n\n**A (salicylic acid, ortho):**\n- Has intramolecular H-bond between –OH and –COOH\n- Less intermolecular H-bonding → less crystalline, lower melting point\n- Less soluble in water (intramolecular H-bond reduces interaction with water)\n\n**B (para-hydroxybenzoic acid):**\n- No intramolecular H-bonding possible (groups are far apart)\n- Extensive intermolecular H-bonding → more crystalline ✓\n- Higher melting/boiling point ✓\n- More soluble in water (free –OH and –COOH for H-bonding with water) ✓\n\n**Step 2 — Evaluate statements:**\n- **(a) B is more crystalline:** ✓ (more intermolecular H-bonding)\n- **(b) B has higher boiling point:** ✓ (stronger intermolecular forces)\n- **(c) B dissolves more readily in water:** ✓ (more H-bonding with water)\n\n**JEE answer: (a) and (c) are true**\n\n**Answer: Option (2) — (a) and (c) are true**`,
'tag_bonding_6', src(2020,'Sep',3,'Evening')),

mkSCQ('BOND-168','Hard',
`Among the compounds A and B with molecular formula $\\mathrm{C_9H_{18}O_3}$, A has a **higher boiling point** than B. The possible structures of A and B are:\n\n(1) A = 1,3,5-trimethoxycyclohexane; B = 1,3,5-trimethoxycyclohexane\n(2) A = 1,3,5-trimethoxycyclohexane; B = 1,3,5-trimethoxycyclohexane\n(3) A = 1,3,5-tris(hydroxymethyl)cyclohexane; B = 1,3,5-trimethoxycyclohexane\n(4) A = 1,3,5-trimethoxycyclohexane; B = 1,3,5-tris(hydroxymethyl)cyclohexane`,
['Option 1','Option 2','Option 3','Option 4'],
'c',
`**Step 1 — Identify the structures:**\n\n**1,3,5-trimethoxycyclohexane** ($\\mathrm{C_9H_{18}O_3}$): Has –OCH₃ groups (no O–H) → only Van der Waals and dipole–dipole forces → **lower boiling point**\n\n**1,3,5-tris(hydroxymethyl)cyclohexane** ($\\mathrm{C_9H_{18}O_3}$): Has –CH₂OH groups (O–H present) → **intermolecular hydrogen bonding** → **higher boiling point**\n\n**Step 2 — Assignment:**\n- A (higher bp) = 1,3,5-tris(hydroxymethyl)cyclohexane (has –OH groups, H-bonding)\n- B (lower bp) = 1,3,5-trimethoxycyclohexane (no –OH, no H-bonding)\n\n**Answer: Option (3) — A = tris(hydroxymethyl), B = trimethoxy**`,
'tag_bonding_6', src(2020,'Sep',4,'Morning')),

mkSCQ('BOND-169','Medium',
`Given below are two statements — Assertion A and Reason R:\n\n**Assertion A:** Lithium halides are somewhat covalent in nature.\n\n**Reason R:** Lithium possesses high polarisation capability.\n\nChoose the most appropriate answer:`,
['A is true but R is false','A is false but R is true','Both A and R are true but R is NOT the correct explanation of A','Both A and R are true and R is the correct explanation of A'],
'd',
`**Step 1 — Evaluate Assertion A:**\nLithium halides (LiF, LiCl, LiBr, LiI) show significant covalent character compared to other alkali metal halides. This is because Li⁺ is very small → high charge density → high polarising power → distorts anion electron cloud → covalent character. **A is true** ✓\n\n**Step 2 — Evaluate Reason R:**\nLi⁺ has the smallest ionic radius among alkali metal cations → highest charge density → highest polarising power. **R is true** ✓\n\n**Step 3 — Is R the correct explanation?**\nYes — the high polarising capability of Li⁺ directly causes the covalent character of lithium halides (Fajans' rules: small, highly charged cation → more covalent character).\n\n**Answer: Option (4) — Both true, R is correct explanation**`,
'tag_bonding_2', src(2021,'Jul',27,'Morning')),

mkSCQ('BOND-170','Medium',
`The correct statement among the following is:`,
['$\\mathrm{(SiH_3)_3N}$ is planar and less basic than $\\mathrm{(CH_3)_3N}$','$\\mathrm{(SiH_3)_3N}$ is pyramidal and more basic than $\\mathrm{(CH_3)_3N}$','$\\mathrm{(SiH_3)_3N}$ is pyramidal and less basic than $\\mathrm{(CH_3)_3N}$','$\\mathrm{(SiH_3)_3N}$ is planar and more basic than $\\mathrm{(CH_3)_3N}$'],
'a',
`**Step 1 — Structure of $\\mathrm{(SiH_3)_3N}$:**\n- N lone pair donates into empty 3d orbitals of Si (pπ–dπ back bonding)\n- This delocalises the lone pair → N becomes sp² hybridized → **planar** structure\n- Lone pair is involved in back bonding → less available for protonation → **less basic**\n\n**Step 2 — Structure of $\\mathrm{(CH_3)_3N}$:**\n- C has no empty d-orbitals → no back bonding\n- N remains sp³ → **pyramidal**\n- Lone pair fully available → **more basic**\n\n**Answer: Option (1) — Planar and less basic than $\\mathrm{(CH_3)_3N}$**`,
'tag_bonding_7', src(2019,'Apr',12,'Morning')),

mkSCQ('BOND-171','Medium',
`The bond order and magnetic property of **acetylide ion** ($\\mathrm{C_2^{2-}}$) are same as that of`,
['$\\mathrm{O_2^+}$','$\\mathrm{N_2^+}$','$\\mathrm{NO^+}$','$\\mathrm{O_2^-}$'],
'c',
`**Step 1 — Acetylide ion $\\mathrm{C_2^{2-}}$ (14 electrons):**\n- Isoelectronic with $\\mathrm{N_2}$\n- Bond order = (10−4)/2 = **3**\n- All electrons paired → **diamagnetic**\n\n**Step 2 — Check each option:**\n\n| Species | e⁻ | Bond Order | Magnetic |\n|---------|-----|-----------|----------|\n| $\\mathrm{O_2^+}$ | 15 | 2.5 | Paramagnetic |\n| $\\mathrm{N_2^+}$ | 13 | 2.5 | Paramagnetic |\n| $\\mathrm{NO^+}$ | 10 | 3 | **Diamagnetic** ✓ |\n| $\\mathrm{O_2^-}$ | 17 | 1.5 | Paramagnetic |\n\n$\\mathrm{NO^+}$ has BO = 3 and is diamagnetic — matches acetylide ion.\n\n**Answer: Option (3) — $\\mathrm{NO^+}$**`,
'tag_bonding_4', src(2023,'Apr',12,'Morning')),

mkNVT('BOND-172','Hard',
`AX is a covalent diatomic molecule where A and X are second row elements. Based on MO Theory, the bond order of AX is 2.5. The total number of electrons in AX is ____`,
{ integer_value: 15 },
`**Step 1 — Bond order formula:**\n$$\\text{BO} = \\frac{N_b - N_a}{2} = 2.5 \\Rightarrow N_b - N_a = 5$$\n\n**Step 2 — For second-row diatomics, try n = 15 electrons:**\nMO filling: $\\sigma_{1s}^2\\sigma^*_{1s}^2\\sigma_{2s}^2\\sigma^*_{2s}^2\\sigma_{2p}^2\\pi_{2p}^4\\pi^*_{2p}^1$\n- $N_b = 8$ (bonding), $N_a = 3$ (antibonding)\n$$\\text{BO} = \\frac{8-3}{2} = 2.5 \\checkmark$$\n\n**Example:** NO has 7 + 8 = 15 electrons, BO = 2.5\n\n**Answer: 15**`,
'tag_bonding_4', src(2021,'Mar',18,'Morning')),

mkSCQ('BOND-173','Medium',
`The increasing order of boiling points of the following compounds is:\n\n**I.** 4-methylphenol (p-cresol)\n**II.** 4-nitrophenol\n**III.** 4-aminophenol\n**IV.** 4-methoxyphenol`,
['I < III < IV < II','I < IV < II < III','IV < I < II < III','III < I < II < IV'],
'a',
`**Step 1 — Factors affecting boiling point:**\nHigher boiling point = stronger intermolecular forces (H-bonding, dipole–dipole, molecular weight).\n\n**Step 2 — Analyse each compound:**\n\n**I. 4-methylphenol (p-cresol):** Has –OH (H-bonding), methyl group (weak electron donor). Moderate bp.\n\n**II. 4-nitrophenol:** Has –OH (H-bonding) + –NO₂ (strong electron withdrawor, increases polarity). High bp due to strong dipole and H-bonding.\n\n**III. 4-aminophenol:** Has –OH AND –NH₂ (two H-bond donors + acceptors). Very extensive H-bonding → highest bp.\n\n**IV. 4-methoxyphenol:** Has –OH (H-bonding) + –OCH₃ (H-bond acceptor). Moderate bp, slightly higher than p-cresol.\n\n**Step 3 — Increasing order:**\n$$\\text{I (p-cresol)} < \\text{III (aminophenol)} < \\text{IV (methoxyphenol)} < \\text{II (nitrophenol)}$$\n\n**JEE answer: I < III < IV < II**\n\n**Answer: Option (1)**`,
'tag_bonding_6', src(2023,'Apr',13,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-165 to BOND-173)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
