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

mkSCQ('BOND-108','Medium',
`Consider the ions/molecule $\\mathrm{O_2^+}$, $\\mathrm{O_2}$, $\\mathrm{O_2^-}$, $\\mathrm{O_2^{2-}}$. For **increasing bond order** the correct option is`,
['$\\mathrm{O_2^- < O_2^{2-} < O_2 < O_2^+}$','$\\mathrm{O_2^- < O_2^{2-} < O_2^+ < O_2}$','$\\mathrm{O_2^- < O_2^+ < O_2^{2-} < O_2}$','$\\mathrm{O_2^{2-} < O_2^- < O_2 < O_2^+}$'],
'd',
`**Step 1 — Calculate bond orders:**\n\n| Species | e⁻ | π* electrons | Bond Order |\n|---------|-----|-------------|------------|\n| $\\mathrm{O_2^+}$ | 15 | 1 | (10−5)/2 = **2.5** |\n| $\\mathrm{O_2}$ | 16 | 2 | (10−6)/2 = **2** |\n| $\\mathrm{O_2^-}$ | 17 | 3 | (10−7)/2 = **1.5** |\n| $\\mathrm{O_2^{2-}}$ | 18 | 4 | (10−8)/2 = **1** |\n\n**Step 2 — Increasing order:**\n$$\\mathrm{O_2^{2-}}(1) < \\mathrm{O_2^-}(1.5) < \\mathrm{O_2}(2) < \\mathrm{O_2^+}(2.5)$$\n\n**Answer: Option (4)**`,
'tag_bonding_4', src(2022,'Jun',26,'Morning')),

mkNVT('BOND-109','Easy',
`According to molecular orbital theory, the number of **unpaired electrons** in $\\mathrm{O_2^{2-}}$ is ____`,
{ integer_value: 0 },
`**Step 1 — MO configuration of $\\mathrm{O_2^{2-}}$ (18 electrons):**\n\n$$\\sigma_{1s}^2\\sigma^*_{1s}^2\\sigma_{2s}^2\\sigma^*_{2s}^2\\sigma_{2p}^2\\pi_{2p}^4\\pi^*_{2p}^4$$\n\n**Step 2 — Count unpaired electrons:**\n- $\\pi^*_{2p}$ has 4 electrons filling both degenerate π* orbitals completely (2 in each)\n- All electrons are **paired**\n\n**Step 3 — Magnetic nature:**\n- 0 unpaired electrons → **diamagnetic**\n\n**Answer: 0**`,
'tag_bonding_4', src(2021,'Aug',31,'Evening')),

mkSCQ('BOND-110','Easy',
`Number of **paramagnetic** oxides among the following is ____\n\n$$\\mathrm{Li_2O,\\ CaO,\\ Na_2O_2,\\ KO_2,\\ MgO,\\ K_2O}$$`,
['1','3','0','2'],
'a',
`**Paramagnetic** oxides contain unpaired electrons.\n\n**Step 1 — Analyse each oxide:**\n\n- $\\mathrm{Li_2O}$: ionic, all electrons paired → diamagnetic ✗\n- CaO: ionic, all electrons paired → diamagnetic ✗\n- $\\mathrm{Na_2O_2}$ (sodium peroxide): contains $\\mathrm{O_2^{2-}}$ (peroxide ion) with BO = 1, all paired → diamagnetic ✗\n- $\\mathrm{KO_2}$ (potassium superoxide): contains $\\mathrm{O_2^-}$ (superoxide ion) with 1 unpaired electron → **paramagnetic** ✓\n- MgO: ionic, all electrons paired → diamagnetic ✗\n- $\\mathrm{K_2O}$: ionic, all electrons paired → diamagnetic ✗\n\n**Step 2:** Only $\\mathrm{KO_2}$ is paramagnetic → **1 oxide**\n\n**Answer: Option (1) — 1**`,
'tag_bonding_4', src(2021,'Sep',1,'Evening')),

mkSCQ('BOND-111','Medium',
`Which one of the following species **doesn't** have a magnetic moment of 1.73 BM (spin only value)?`,
['$\\mathrm{O_2^+}$','CuI','$\\mathrm{[Cu(NH_3)_4]Cl_2}$','$\\mathrm{O_2^-}$'],
'b',
`**Magnetic moment** $\\mu = \\sqrt{n(n+2)}$ BM, where n = unpaired electrons.\nFor 1.73 BM: $\\sqrt{n(n+2)} = 1.73 = \\sqrt{3}$ → n = 1 unpaired electron.\n\n**Step 1 — Check each species:**\n\n**$\\mathrm{O_2^+}$ (15e⁻):** π* has 1 electron → **1 unpaired** → μ = 1.73 BM ✓\n\n**CuI:** Cu⁺ has d¹⁰ configuration → **0 unpaired** → μ = 0 BM ✗ (doesn't have 1.73 BM)\n\n**$\\mathrm{[Cu(NH_3)_4]Cl_2}$:** Cu²⁺ has d⁹ → **1 unpaired** → μ = 1.73 BM ✓\n\n**$\\mathrm{O_2^-}$ (17e⁻):** π* has 3 electrons → **1 unpaired** → μ = 1.73 BM ✓\n\n**Step 2:** CuI (Cu⁺, d¹⁰) has 0 unpaired electrons → μ = 0 BM → **doesn't have 1.73 BM**\n\n**Answer: Option (2) — CuI**`,
'tag_bonding_4', src(2021,'Jul',20,'Evening')),

mkSCQ('BOND-112','Easy',
`In the following, the correct **bond order sequence** is:`,
['$\\mathrm{O_2^{2-} > O_2^+ > O_2^- > O_2}$','$\\mathrm{O_2^+ > O_2^- > O_2^{2-} > O_2}$','$\\mathrm{O_2^+ > O_2 > O_2^- > O_2^{2-}}$','$\\mathrm{O_2 > O_2^- > O_2^{2-} > O_2^+}$'],
'c',
`**Bond orders:**\n- $\\mathrm{O_2^+}$: BO = 2.5\n- $\\mathrm{O_2}$: BO = 2\n- $\\mathrm{O_2^-}$: BO = 1.5\n- $\\mathrm{O_2^{2-}}$: BO = 1\n\n**Decreasing order:**\n$$\\mathrm{O_2^+}(2.5) > \\mathrm{O_2}(2) > \\mathrm{O_2^-}(1.5) > \\mathrm{O_2^{2-}}(1)$$\n\n**Answer: Option (3)**`,
'tag_bonding_4', src(2021,'Jul',25,'Evening')),

mkNVT('BOND-113','Easy',
`The difference between bond orders of CO and $\\mathrm{NO^+}$ is $\\dfrac{x}{2}$ where $x =$ ____`,
{ integer_value: 0 },
`**Step 1 — Bond order of CO (10e⁻):**\n- Isoelectronic with $\\mathrm{N_2}$\n$$\\text{BO}_{\\mathrm{CO}} = \\frac{8-2}{2} = 3$$\n\n**Step 2 — Bond order of $\\mathrm{NO^+}$ (10e⁻):**\n- Also isoelectronic with $\\mathrm{N_2}$ and CO\n$$\\text{BO}_{\\mathrm{NO^+}} = \\frac{8-2}{2} = 3$$\n\n**Step 3 — Difference:**\n$$\\text{Difference} = 3 - 3 = 0 = \\frac{x}{2}$$\n$$x = 0$$\n\n**Answer: 0**`,
'tag_bonding_4', src(2021,'Jul',27,'Morning')),

mkNVT('BOND-114','Medium',
`The total number of electrons in all **bonding molecular orbitals** of $\\mathrm{O_2^{2-}}$ is ____`,
{ integer_value: 10 },
`**Step 1 — Full MO configuration of $\\mathrm{O_2^{2-}}$ (18 electrons):**\n\n$$\\underbrace{\\sigma_{1s}^2}_{\\text{bond}}\\underbrace{\\sigma^*_{1s}^2}_{\\text{anti}}\\underbrace{\\sigma_{2s}^2}_{\\text{bond}}\\underbrace{\\sigma^*_{2s}^2}_{\\text{anti}}\\underbrace{\\sigma_{2p}^2}_{\\text{bond}}\\underbrace{\\pi_{2p}^4}_{\\text{bond}}\\underbrace{\\pi^*_{2p}^4}_{\\text{anti}}$$\n\n**Step 2 — Count electrons in bonding MOs:**\n- $\\sigma_{1s}$: 2 electrons\n- $\\sigma_{2s}$: 2 electrons\n- $\\sigma_{2p}$: 2 electrons\n- $\\pi_{2p}$: 4 electrons\n- Total bonding electrons = 2 + 2 + 2 + 4 = **10**\n\n**Answer: 10**`,
'tag_bonding_4', src(2021,'Jul',27,'Evening')),

mkSCQ('BOND-115','Medium',
`According to molecular orbital theory, the species among the following that **does not exist** is:`,
['$\\mathrm{He_2^-}$','$\\mathrm{O_2^{2-}}$','$\\mathrm{He_2^+}$','$\\mathrm{Be_2}$'],
'd',
`**A species exists** if its bond order > 0.\n\n**Step 1 — Calculate bond orders:**\n\n**$\\mathrm{He_2^-}$ (5e⁻):** $\\sigma_{1s}^2\\sigma^*_{1s}^2\\sigma_{2s}^1$\n$$\\text{BO} = \\frac{3-2}{2} = 0.5 > 0 \\text{ → exists}$$\n\n**$\\mathrm{O_2^{2-}}$ (18e⁻):**\n$$\\text{BO} = \\frac{10-8}{2} = 1 > 0 \\text{ → exists}$$\n\n**$\\mathrm{He_2^+}$ (3e⁻):** $\\sigma_{1s}^2\\sigma^*_{1s}^1$\n$$\\text{BO} = \\frac{2-1}{2} = 0.5 > 0 \\text{ → exists}$$\n\n**$\\mathrm{Be_2}$ (8e⁻):** $\\sigma_{1s}^2\\sigma^*_{1s}^2\\sigma_{2s}^2\\sigma^*_{2s}^2$\n$$\\text{BO} = \\frac{4-4}{2} = 0 \\text{ → does NOT exist}$$\n\n**Answer: Option (4) — $\\mathrm{Be_2}$**`,
'tag_bonding_4', src(2021,'Feb',25,'Morning')),

mkMTC('BOND-116','Easy',
`Match **List I** (Molecule) with **List II** (Bond Order):\n\n**(a)** $\\mathrm{Ne_2}$ → (i) 1\n**(b)** $\\mathrm{N_2}$ → (ii) 2\n**(c)** $\\mathrm{F_2}$ → (iii) 0\n**(d)** $\\mathrm{O_2}$ → (iv) 3\n\nChoose the correct answer:`,
['(a)→(ii), (b)→(i), (c)→(iv), (d)→(iii)','(a)→(iii), (b)→(iv), (c)→(i), (d)→(ii)','(a)→(i), (b)→(ii), (c)→(iii), (d)→(iv)','(a)→(iv), (b)→(iii), (c)→(ii), (d)→(i)'],
'b',
`**Step 1 — Calculate bond orders:**\n\n**$\\mathrm{Ne_2}$ (20e⁻):** All bonding and antibonding MOs filled equally → BO = 0 → **(iii)**\n\n**$\\mathrm{N_2}$ (14e⁻):** BO = (10−4)/2 = 3 → **(iv)**\n\n**$\\mathrm{F_2}$ (18e⁻):** BO = (10−8)/2 = 1 → **(i)**\n\n**$\\mathrm{O_2}$ (16e⁻):** BO = (10−6)/2 = 2 → **(ii)**\n\n**Matching:** (a)→(iii), (b)→(iv), (c)→(i), (d)→(ii)\n\n**Answer: Option (2)**`,
'tag_bonding_4', src(2021,'Feb',25,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (BOND-108 to BOND-116)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
