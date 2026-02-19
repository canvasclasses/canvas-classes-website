#!/usr/bin/env node
// MOLE PYQ Batch 1: MOLE-291 to MOLE-305 (PYQ Q1–Q15)
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });
const now = new Date();

function mkNVT(id, diff, md, ans, sol, tag, src) {
  return { _id: uuidv4(), display_id: id, question_text: { markdown: md, latex_validated: true }, type: 'NVT', options: [], answer: ans, solution: { text_markdown: sol, latex_validated: true }, metadata: { difficulty: diff, chapter_id: 'ch11_mole', tags: [{ tag_id: tag, weight: 1.0 }], exam_source: src, is_pyq: true, is_top_pyq: false }, status: 'review', version: 1, quality_score: 90, needs_review: false, created_by: 'ai_agent', updated_by: 'ai_agent', created_at: now, updated_at: now, deleted_at: null };
}
function mkSCQ(id, diff, md, options, sol, tag, src) {
  return { _id: uuidv4(), display_id: id, question_text: { markdown: md, latex_validated: true }, type: 'SCQ', options, solution: { text_markdown: sol, latex_validated: true }, metadata: { difficulty: diff, chapter_id: 'ch11_mole', tags: [{ tag_id: tag, weight: 1.0 }], exam_source: src, is_pyq: true, is_top_pyq: false }, status: 'review', version: 1, quality_score: 90, needs_review: false, created_by: 'ai_agent', updated_by: 'ai_agent', created_at: now, updated_at: now, deleted_at: null };
}
function opts(a, b, c, d, k) {
  return [{ id: 'a', text: a, is_correct: k === 'a' }, { id: 'b', text: b, is_correct: k === 'b' }, { id: 'c', text: c, is_correct: k === 'c' }, { id: 'd', text: d, is_correct: k === 'd' }];
}
function src(y, mo, d, sh) { return { exam: 'JEE Main', year: y, month: mo, day: d, shift: sh }; }

const questions = [
  // Q1 — NVT — 26 Jun 2022 (E) — Ans: 225
  mkNVT('MOLE-291','Medium',
    'The moles of methane required to produce $81\\,\\text{g}$ of water after complete combustion is ______ $\\times 10^{-2}\\,\\text{mol}$. [nearest integer]',
    {integer_value:225},
    '**Step 1:** $\\ce{CH4 + 2O2 -> CO2 + 2H2O}$ — 1 mol $\\ce{CH4}$ gives 2 mol $\\ce{H2O}$.\n\n**Step 2:** $n_{\\ce{H2O}} = 81/18 = 4.5\\,\\text{mol}$\n\n**Step 3:** $n_{\\ce{CH4}} = 4.5/2 = 2.25\\,\\text{mol} = 225 \\times 10^{-2}\\,\\text{mol}$\n\n**Key Points:**\n- Stoichiometric ratio $\\ce{CH4}:\\ce{H2O} = 1:2$\n- $M_{\\ce{H2O}} = 18\\,\\text{g/mol}$',
    'tag_mole_1', src(2022,'Jun',26,'Evening')),

  // Q2 — SCQ — 07 Jan 2020 (M) — Ans: 3 (option c)
  mkSCQ('MOLE-292','Easy',
    'Amongst the following statements, that which was **not** proposed by Dalton was:',
    opts('Chemical reactions involve reorganization of atoms — neither created nor destroyed.',
         'All atoms of a given element have identical properties including identical mass.',
         'When gases combine or are reproduced in a chemical reaction they do so in a simple ratio by volume provided all gases are at same T & P.',
         'Matter consists of indivisible atoms.','c'),
    '**Step 1: Recall Dalton\'s Postulates** — conservation of atoms (a), identical atoms per element (b), indivisible atoms (d) are all Dalton\'s.\n\n**Step 2:** Option (c) — gases combining in simple volume ratios — is **Gay-Lussac\'s Law**, not Dalton\'s.\n\n**Key Points:**\n- Gay-Lussac proposed the law of combining volumes\n- Dalton\'s theory deals with mass ratios, not volumes\n- Answer: Option (3)',
    'tag_mole_1', src(2020,'Jan',7,'Morning')),

  // Q3 — SCQ — 08 Apr 2023 (E) — Ans: 4 (option d)
  mkSCQ('MOLE-293','Easy',
    'Which of the following have the same number of significant figures?\n\n(A) $0.00253$ \u2003 (B) $1.0003$ \u2003 (C) $15.0$ \u2003 (D) $163$\n\nChoose the correct answer:',
    opts('A, B and C only','C and D only','B and C only','A, C and D only','d'),
    '**Step 1: Count sig figs:**\n- A: $0.00253$ → 3 sig figs\n- B: $1.0003$ → 5 sig figs\n- C: $15.0$ → 3 sig figs\n- D: $163$ → 3 sig figs\n\n**Step 2:** A, C, D all have 3 sig figs.\n\n**Key Points:**\n- Leading zeros not significant; trailing zeros after decimal are significant\n- Answer: Option (4)',
    'tag_mole_1', src(2023,'Apr',8,'Evening')),

  // Q4 — SCQ — 29 Jun 2022 (E) — Ans: 2 (option b)
  mkSCQ('MOLE-294','Easy',
    'Using the rules for significant figures, the correct answer for the expression $\\dfrac{0.02858 \\times 0.112}{0.5702}$ will be:',
    opts('$0.005613$','$0.00561$','$0.0056$','$0.006$','b'),
    '**Step 1:** Calculate: $\\frac{0.02858 \\times 0.112}{0.5702} = 0.005614$\n\n**Step 2:** Sig figs: $0.02858$(4), $0.112$(3), $0.5702$(4). Fewest = 3.\n\n**Step 3:** Round to 3 sig figs: $0.00561$\n\n**Key Points:**\n- Multiplication/division: result has fewest sig figs of any factor\n- Answer: Option (2)',
    'tag_mole_1', src(2022,'Jun',29,'Evening')),

  // Q5 — NVT — 25 Jul 2021 (E) — Ans: 3
  mkNVT('MOLE-295','Easy',
    'The number of significant figures in $0.00340$ is ______.',
    {integer_value:3},
    '**Step 1:** $0.00340$: leading zeros not significant; $3$, $4$, trailing $0$ after decimal = significant.\n\n**Total: 3 significant figures** (3, 4, 0)\n\n**Key Points:**\n- Leading zeros never significant\n- Trailing zeros after decimal always significant',
    'tag_mole_1', src(2021,'Jul',25,'Evening')),

  // Q6 — NVT — 26 Feb 2021 (M) — Ans: 8
  mkNVT('MOLE-296','Easy',
    'The number of significant figures in $50000.020 \\times 10^{-3}$ is ______.',
    {integer_value:8},
    '**Step 1:** $50000.020 \\times 10^{-3} = 50.000020$\n\n**Step 2:** Decimal point present → all 8 digits significant: $5,0,0,0,0,0,2,0$\n\n**Key Points:**\n- Presence of decimal point makes all digits (including trailing zeros) significant\n- Answer: 8',
    'tag_mole_1', src(2021,'Feb',26,'Morning')),

  // Q7 — NVT — 27 Jan 2024 (E) — Ans: 7
  mkNVT('MOLE-297','Easy',
    'Volume of $3\\,\\text{M}$ NaOH (formula weight $40\\,\\text{g mol}^{-1}$) which can be prepared from $84\\,\\text{g}$ of NaOH is ______ $\\times 10^{-1}\\,\\text{dm}^3$.',
    {integer_value:7},
    '**Step 1:** $n_{\\ce{NaOH}} = 84/40 = 2.1\\,\\text{mol}$\n\n**Step 2:** $V = n/M = 2.1/3 = 0.7\\,\\text{L} = 7 \\times 10^{-1}\\,\\text{dm}^3$\n\n**Key Points:**\n- $1\\,\\text{L} = 1\\,\\text{dm}^3$\n- $V = n/M$',
    'tag_mole_4', src(2024,'Jan',27,'Evening')),

  // Q8 — SCQ — 10 Apr 2023 (M) — Ans: 4 (option d)
  mkSCQ('MOLE-298','Easy',
    'The number of molecules and moles in $2.8375$ litres of $\\ce{O2}$ at STP are respectively:',
    opts('$7.527 \\times 10^{23}$ and $0.125\\,\\text{mol}$','$7.527 \\times 10^{22}$ and $0.250\\,\\text{mol}$','$1.505 \\times 10^{23}$ and $0.250\\,\\text{mol}$','$7.527 \\times 10^{22}$ and $0.125\\,\\text{mol}$','d'),
    '**Step 1:** At STP (22.7 L/mol): $n = 2.8375/22.7 = 0.125\\,\\text{mol}$\n\n**Step 2:** $N = 0.125 \\times 6.022 \\times 10^{23} = 7.527 \\times 10^{22}$\n\n**Key Points:**\n- New IUPAC STP: molar volume = 22.7 L/mol\n- Answer: Option (4)',
    'tag_mole_4', src(2023,'Apr',10,'Morning')),

  // Q9 — SCQ — 10 Apr 2023 (E) — Ans: 2 (option b)
  mkSCQ('MOLE-299','Medium',
    'Match List-I with List-II:\n\n**List-I:** A: $16\\,\\text{g}$ of $\\ce{CH4(g)}$; B: $1\\,\\text{g}$ of $\\ce{H2(g)}$; C: $1\\,\\text{mol}$ of $\\ce{N2(g)}$; D: $0.5\\,\\text{mol}$ of $\\ce{SO2(g)}$\n\n**List-II:** I: Weighs $28\\,\\text{g}$; II: $60.2 \\times 10^{23}$ electrons; III: Weighs $32\\,\\text{g}$; IV: Occupies $11.4\\,\\text{L}$ at STP',
    opts('A-II, B-III, C-IV, D-I','A-II, B-IV, C-I, D-III','A-I, B-III, C-II, D-IV','A-II, B-IV, C-III, D-I','b'),
    '**A:** 16 g $\\ce{CH4}$ = 1 mol; electrons = $10 \\times 6.02 \\times 10^{23} = 60.2 \\times 10^{23}$ → **II**\n\n**B:** 1 g $\\ce{H2}$ = 0.5 mol; V = $0.5 \\times 22.7 = 11.35 \\approx 11.4\\,\\text{L}$ → **IV**\n\n**C:** 1 mol $\\ce{N2}$ = 28 g → **I**\n\n**D:** 0.5 mol $\\ce{SO2}$ = $0.5 \\times 64 = 32\\,\\text{g}$ → **III**\n\n**Answer: A-II, B-IV, C-I, D-III → Option (2)**',
    'tag_mole_4', src(2023,'Apr',10,'Evening')),

  // Q10 — NVT — 25 Jun 2022 (M) — Ans: 5418
  mkNVT('MOLE-300','Hard',
    'The number of N atoms in $681\\,\\text{g}$ of $\\ce{C7H5N3O6}$ is $x \\times 10^{21}$. The value of $x$ is ______ ($N_A = 6.02 \\times 10^{23}\\,\\text{mol}^{-1}$) [Nearest Integer]',
    {integer_value:5418},
    '**Step 1:** $M_{\\ce{C7H5N3O6}} = 7(12)+5(1)+3(14)+6(16) = 84+5+42+96 = 227\\,\\text{g/mol}$\n\n**Step 2:** $n = 681/227 = 3\\,\\text{mol}$\n\n**Step 3:** N atoms per molecule = 3; total N atoms = $3 \\times 3 \\times 6.02 \\times 10^{23} = 54.18 \\times 10^{23} = 5418 \\times 10^{21}$\n\n**Key Points:**\n- $\\ce{C7H5N3O6}$ = TNT; $M = 227\\,\\text{g/mol}$\n- $x = 5418$',
    'tag_mole_4', src(2022,'Jun',25,'Morning')),

  // Q11 — NVT — 01 Sep 2021 (E) — Ans: 2
  mkNVT('MOLE-301','Easy',
    'The number of atoms in $8\\,\\text{g}$ of sodium is $x \\times 10^{23}$. The value of $x$ is ______ (Nearest integer). [$N_A = 6.02 \\times 10^{23}\\,\\text{mol}^{-1}$, Atomic mass of Na $= 23.0\\,\\text{u}$]',
    {integer_value:2},
    '**Step 1:** $n_{\\ce{Na}} = 8/23 = 0.3478\\,\\text{mol}$\n\n**Step 2:** $N = 0.3478 \\times 6.02 \\times 10^{23} = 2.09 \\times 10^{23}$\n\n**Nearest integer: $x = 2$**\n\n**Key Points:**\n- $N = (m/M) \\times N_A$\n- Answer: 2',
    'tag_mole_4', src(2021,'Sep',1,'Evening')),

  // Q12 — SCQ — 08 Apr 2019 (E) — Ans: 2 (option b)
  mkSCQ('MOLE-302','Easy',
    'The percentage composition of carbon **by mole** in methane ($\\ce{CH4}$) is:',
    opts('$75\\%$','$20\\%$','$80\\%$','$25\\%$','b'),
    '**Step 1:** $\\ce{CH4}$ has 1 C + 4 H = 5 total atoms per molecule.\n\n**Step 2:** Mole % of C $= (1/5) \\times 100 = 20\\%$\n\n**Key Points:**\n- Mole % uses atom count, not mass\n- Mass % of C in $\\ce{CH4} = (12/16) \\times 100 = 75\\%$ (different!)\n- Answer: Option (2)',
    'tag_mole_4', src(2019,'Apr',8,'Evening')),

  // Q13 — SCQ — 12 Apr 2019 (M) — Ans: 1 (option a)
  mkSCQ('MOLE-303','Medium',
    '$5$ moles of $\\ce{AB2}$ weigh $125 \\times 10^{-3}\\,\\text{kg}$ and $10$ moles of $\\ce{A2B2}$ weigh $300 \\times 10^{-3}\\,\\text{kg}$. The molar masses $M_A$ and $M_B$ in $\\text{kg mol}^{-1}$ are:',
    opts('$M_A = 5 \\times 10^{-3}$, $M_B = 10 \\times 10^{-3}$','$M_A = 25 \\times 10^{-3}$, $M_B = 50 \\times 10^{-3}$','$M_A = 50 \\times 10^{-3}$, $M_B = 25 \\times 10^{-3}$','$M_A = 10 \\times 10^{-3}$, $M_B = 5 \\times 10^{-3}$','a'),
    '**Step 1:** $5(M_A + 2M_B) = 0.125 \\Rightarrow M_A + 2M_B = 0.025$ ...(1)\n\n**Step 2:** $10(2M_A + 2M_B) = 0.300 \\Rightarrow 2M_A + 2M_B = 0.030$ ...(2)\n\n**Step 3:** (2)-(1): $M_A = 0.005 = 5 \\times 10^{-3}$; then $M_B = 0.010 = 10 \\times 10^{-3}$\n\n**Answer: Option (1)**',
    'tag_mole_4', src(2019,'Apr',12,'Morning')),

  // Q14 — SCQ — 06 Apr 2024 (E) — Ans: 3 (option c)
  mkSCQ('MOLE-304','Medium',
    'Molality ($m$) of $3\\,\\text{M}$ aqueous solution of NaCl is: (Density $= 1.25\\,\\text{g mL}^{-1}$; $M_r$: Na $= 23$, Cl $= 35.5$)',
    opts('$1.9\\,m$','$3.85\\,m$','$2.79\\,m$','$2.90\\,m$','c'),
    '**Step 1:** $m = \\frac{1000M}{1000d - M \\cdot M_r}$\n\n**Step 2:** $M_r(\\ce{NaCl}) = 58.5\\,\\text{g/mol}$\n\n$$m = \\frac{1000 \\times 3}{1000 \\times 1.25 - 3 \\times 58.5} = \\frac{3000}{1250 - 175.5} = \\frac{3000}{1074.5} = 2.79\\,\\text{mol/kg}$$\n\n**Answer: Option (3)**',
    'tag_mole_2', src(2024,'Apr',6,'Evening')),

  // Q15 — NVT — 08 Apr 2023 (M) — Ans: 11
  mkNVT('MOLE-305','Medium',
    '$0.5\\,\\text{g}$ of an organic compound (X) with $60\\%$ carbon will produce ______ $\\times 10^{-1}\\,\\text{g}$ of $\\ce{CO2}$ on complete combustion.',
    {integer_value:11},
    '**Step 1:** $m_C = 0.5 \\times 0.60 = 0.3\\,\\text{g}$\n\n**Step 2:** $n_C = 0.3/12 = 0.025\\,\\text{mol}$\n\n**Step 3:** All C → $\\ce{CO2}$: $m_{\\ce{CO2}} = 0.025 \\times 44 = 1.1\\,\\text{g} = 11 \\times 10^{-1}\\,\\text{g}$\n\n**Key Points:**\n- All carbon converts to $\\ce{CO2}$ on complete combustion\n- Answer: 11',
    'tag_mole_5', src(2023,'Apr',8,'Morning')),
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  let ok = 0, fail = 0;
  for (const doc of questions) {
    try { await col.insertOne(doc); console.log(`  ✅ ${doc.display_id}`); ok++; }
    catch(e) { console.log(`  ❌ ${doc.display_id}: ${e.message}`); fail++; }
  }
  console.log(`\n📊 ${ok} inserted, ${fail} failed`);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
