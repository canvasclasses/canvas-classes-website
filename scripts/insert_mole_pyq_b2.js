#!/usr/bin/env node
// MOLE PYQ Batch 2: MOLE-306 to MOLE-320 (PYQ Q16–Q30)
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

  // Q16 — SCQ — 11 Apr 2023 (E) — Ans: 4 (option d = 10%)
  mkSCQ('MOLE-306','Easy',
    'A solution is prepared by adding $2\\,\\text{g}$ of $X$ to $1$ mole of water. Mass percent of $X$ in solution is:',
    opts('$5\\%$','$20\\%$','$2\\%$','$10\\%$','d'),
    '**Step 1:** Mass of water $= 1\\,\\text{mol} \\times 18\\,\\text{g/mol} = 18\\,\\text{g}$\n\n**Step 2:** Total mass of solution $= 18 + 2 = 20\\,\\text{g}$\n\n**Step 3:** Mass % of X $= (2/20) \\times 100 = 10\\%$\n\n**Key Points:**\n- Mass % $= \\frac{m_{\\text{solute}}}{m_{\\text{solution}}} \\times 100$\n- 1 mol water = 18 g\n- Answer: Option (4)',
    'tag_mole_2', src(2023,'Apr',11,'Evening')),

  // Q17 — NVT — 01 Feb 2023 (M) — Ans: 364
  mkNVT('MOLE-307','Medium',
    'The density of $3\\,\\text{M}$ solution of NaCl is $1.0\\,\\text{g mL}^{-1}$. Molality of the solution is ______ $\\times 10^{-2}\\,m$ (Nearest integer). [Molar mass of Na $= 23$, Cl $= 35.5\\,\\text{g mol}^{-1}$]',
    {integer_value:364},
    '**Step 1:** $m = \\frac{1000M}{1000d - M \\cdot M_r}$\n\n$M_r(\\ce{NaCl}) = 58.5\\,\\text{g/mol}$, $M = 3$, $d = 1.0$\n\n$$m = \\frac{1000 \\times 3}{1000 \\times 1.0 - 3 \\times 58.5} = \\frac{3000}{1000 - 175.5} = \\frac{3000}{824.5} = 3.638\\,\\text{mol/kg}$$\n\n$$= 364 \\times 10^{-2}\\,m$$\n\n**Key Points:**\n- Use $m = \\frac{1000M}{1000d - M \\cdot M_r}$\n- Answer: 364',
    'tag_mole_2', src(2023,'Feb',1,'Morning')),

  // Q18 — SCQ — 26 Jun 2022 (M) — Ans: 2 (option b = 14.0 M)
  mkSCQ('MOLE-308','Medium',
    'A commercially sold conc. HCl is $35\\%$ HCl by mass. If the density of this commercial acid is $1.46\\,\\text{g/mL}$, the molarity of this solution is: (Atomic mass: Cl $= 35.5$, H $= 1\\,\\text{amu}$)',
    opts('$10.2\\,\\text{M}$','$14.0\\,\\text{M}$','$12.5\\,\\text{M}$','$18.2\\,\\text{M}$','b'),
    '**Step 1:** $M = \\frac{10 \\times d \\times \\%}{M_r}$\n\n$M_r(\\ce{HCl}) = 36.5\\,\\text{g/mol}$\n\n$$M = \\frac{10 \\times 1.46 \\times 35}{36.5} = \\frac{511}{36.5} = 14.0\\,\\text{M}$$\n\n**Key Points:**\n- $M = \\frac{10 \\times d \\times \\%\\text{ by mass}}{M_r}$\n- Answer: Option (2) $14.0\\,\\text{M}$',
    'tag_mole_2', src(2022,'Jun',26,'Morning')),

  // Q19 — NVT — 17 Mar 2021 (M) — Ans: 64
  mkNVT('MOLE-309','Medium',
    'The mole fraction of a solute in a $100$ molal aqueous solution is ______ $\\times 10^{-2}$. (Round off to Nearest Integer) [Atomic masses: H: $1.0\\,\\text{u}$, O: $16.0\\,\\text{u}$]',
    {integer_value:64},
    '**Step 1:** 100 molal = 100 mol solute per 1000 g water.\n\n**Step 2:** Moles of water $= 1000/18 = 55.56\\,\\text{mol}$\n\n**Step 3:** Mole fraction of solute $= \\frac{100}{100 + 55.56} = \\frac{100}{155.56} = 0.6429$\n\n$$= 64 \\times 10^{-2}$$\n\n**Key Points:**\n- Mole fraction $= n_{\\text{solute}}/(n_{\\text{solute}} + n_{\\text{solvent}})$\n- Answer: 64',
    'tag_mole_2', src(2021,'Mar',17,'Morning')),

  // Q20 — NVT — 24 Feb 2021 (M) — Ans: 2
  mkNVT('MOLE-310','Easy',
    '$4.5\\,\\text{g}$ of compound A (M.W. $= 90$) was used to make $250\\,\\text{mL}$ of its aqueous solution. The molarity of the solution in M is $x \\times 10^{-1}$. The value of $x$ is ______ (Rounded off to nearest integer)',
    {integer_value:2},
    '**Step 1:** $n = 4.5/90 = 0.05\\,\\text{mol}$\n\n**Step 2:** $M = n/V = 0.05/0.250 = 0.2\\,\\text{mol/L} = 2 \\times 10^{-1}\\,\\text{M}$\n\n**Key Points:**\n- $M = n/V(\\text{L})$\n- Answer: $x = 2$',
    'tag_mole_2', src(2021,'Feb',24,'Morning')),

  // Q21 — NVT — 04 Sep 2020 (E) — Ans: 10
  mkNVT('MOLE-311','Medium',
    'A $100\\,\\text{mL}$ solution was made by adding $1.43\\,\\text{g}$ of $\\ce{Na2CO3 \\cdot xH2O}$. The normality of the solution is $0.1\\,\\text{N}$. The value of $x$ is ______. (Atomic mass of Na $= 23\\,\\text{g/mol}$)',
    {integer_value:10},
    '**Step 1:** Normality $= 0.1\\,\\text{N}$, $V = 0.1\\,\\text{L}$\n\n**Step 2:** Equivalents $= 0.1 \\times 0.1 = 0.01\\,\\text{eq}$\n\n**Step 3:** $n$-factor of $\\ce{Na2CO3} = 2$; moles $= 0.01/2 = 0.005\\,\\text{mol}$\n\n**Step 4:** $M_r(\\ce{Na2CO3 \\cdot xH2O}) = 1.43/0.005 = 286\\,\\text{g/mol}$\n\n**Step 5:** $M_r(\\ce{Na2CO3}) = 106$; $18x = 286 - 106 = 180 \\Rightarrow x = 10$\n\n**Key Points:**\n- $n$-factor of $\\ce{Na2CO3} = 2$ (diprotic base)\n- $M_r(\\ce{H2O}) = 18$\n- Answer: $x = 10$',
    'tag_mole_2', src(2020,'Sep',4,'Evening')),

  // Q22 — SCQ — 06 Sep 2020 (E) — Ans: 2 (option a = 4:1... wait ans=2 means option b = 3:1)
  // Answer key: Q22(2) → option (1) is 4:1, option (2) is 3:1 → Ans: option 2 = b
  mkSCQ('MOLE-312','Easy',
    'The average molar mass of chlorine is $35.5\\,\\text{g mol}^{-1}$. The ratio of ${}^{35}\\text{Cl}$ to ${}^{37}\\text{Cl}$ in naturally occurring chlorine is close to:',
    opts('$4:1$','$3:1$','$2:1$','$1:1$','b'),
    '**Step 1:** Let fraction of ${}^{35}\\text{Cl} = x$; fraction of ${}^{37}\\text{Cl} = (1-x)$\n\n**Step 2:** Average mass: $35x + 37(1-x) = 35.5$\n\n$$35x + 37 - 37x = 35.5 \\Rightarrow -2x = -1.5 \\Rightarrow x = 0.75$$\n\n**Step 3:** Ratio ${}^{35}\\text{Cl} : {}^{37}\\text{Cl} = 0.75 : 0.25 = 3:1$\n\n**Key Points:**\n- Weighted average of isotopic masses gives atomic mass\n- Answer: Option (2) $3:1$',
    'tag_mole_4', src(2020,'Sep',6,'Evening')),

  // Q23 — NVT — 13 Apr 2023 (E) — Ans: 100
  mkNVT('MOLE-313','Medium',
    '$1\\,\\text{g}$ of a carbonate ($\\ce{M2CO3}$) on treatment with excess HCl produces $0.01\\,\\text{mol}$ of $\\ce{CO2}$. The molar mass of $\\ce{M2CO3}$ is ______ $\\text{g mol}^{-1}$. (Nearest integer)',
    {integer_value:100},
    '**Step 1:** $\\ce{M2CO3 + 2HCl -> 2MCl + H2O + CO2}$\n\n1 mol $\\ce{M2CO3}$ gives 1 mol $\\ce{CO2}$.\n\n**Step 2:** $n_{\\ce{M2CO3}} = n_{\\ce{CO2}} = 0.01\\,\\text{mol}$\n\n**Step 3:** $M_r = m/n = 1/0.01 = 100\\,\\text{g/mol}$\n\n**Key Points:**\n- 1:1 mole ratio between $\\ce{M2CO3}$ and $\\ce{CO2}$\n- Answer: 100 g/mol',
    'tag_mole_6', src(2023,'Apr',13,'Evening')),

  // Q24 — NVT — 25 Jan 2023 (E) — Ans: 12
  mkNVT('MOLE-314','Medium',
    'Number of hydrogen atoms per molecule of a hydrocarbon A having $85.8\\%$ carbon is ______ (Given: Molar mass of A $= 84\\,\\text{g mol}^{-1}$)',
    {integer_value:12},
    '**Step 1:** Mass of C per mole $= 84 \\times 0.858 = 72\\,\\text{g}$\n\n**Step 2:** $n_C = 72/12 = 6$ carbon atoms\n\n**Step 3:** Mass of H $= 84 - 72 = 12\\,\\text{g}$; $n_H = 12/1 = 12$ hydrogen atoms\n\n**Formula: $\\ce{C6H12}$ (cyclohexane)**\n\n**Key Points:**\n- % C gives mass of C per mole\n- Remaining mass is H (only C and H in hydrocarbon)\n- Answer: 12',
    'tag_mole_3', src(2023,'Jan',25,'Evening')),

  // Q25 — SCQ — 29 Jan 2023 (E) — Ans: 1 (option a = C8H6... wait Q25 ans=1 → option a)
  // Q25: hydrocarbon A, 9.5 eq O2, 3 eq water → CxHy + (x + y/4)O2 → xCO2 + y/2 H2O
  // y/2 = 3 → y = 6; x + 6/4 = 9.5 → x = 8; formula C8H6 → option (1)
  mkSCQ('MOLE-315','Hard',
    'When a hydrocarbon A undergoes combustion in the presence of air, it requires $9.5$ equivalents of oxygen and produces $3$ equivalents of water. What is the molecular formula of A?',
    opts('$\\ce{C8H6}$','$\\ce{C9H9}$','$\\ce{C6H6}$','$\\ce{C9H6}$','a'),
    '**Step 1:** Combustion: $\\ce{C_xH_y + (x + y/4)O2 -> xCO2 + y/2 H2O}$\n\n**Step 2:** From water: $y/2 = 3 \\Rightarrow y = 6$\n\n**Step 3:** From O₂: $x + y/4 = 9.5 \\Rightarrow x + 1.5 = 9.5 \\Rightarrow x = 8$\n\n**Formula: $\\ce{C8H6}$**\n\n**Key Points:**\n- Equivalents of $\\ce{H2O}$ gives $y$; equivalents of $\\ce{O2}$ gives $x$\n- Answer: Option (1) $\\ce{C8H6}$',
    'tag_mole_5', src(2023,'Jan',29,'Evening')),

  // Q26 — NVT — 29 Jan 2023 (E) — Ans: 200
  mkNVT('MOLE-316','Medium',
    'When $0.01\\,\\text{mol}$ of an organic compound containing $60\\%$ carbon was burnt completely, $4.4\\,\\text{g}$ of $\\ce{CO2}$ was produced. The molar mass of compound is ______ $\\text{g mol}^{-1}$ (Nearest integer)',
    {integer_value:200},
    '**Step 1:** $n_{\\ce{CO2}} = 4.4/44 = 0.1\\,\\text{mol}$; $n_C = 0.1\\,\\text{mol}$\n\n**Step 2:** Mass of C in 0.01 mol compound $= 0.1 \\times 12 = 1.2\\,\\text{g}$\n\n**Step 3:** If 60% is C: total mass of 0.01 mol $= 1.2/0.60 = 2.0\\,\\text{g}$\n\n**Step 4:** $M_r = 2.0/0.01 = 200\\,\\text{g/mol}$\n\n**Key Points:**\n- Mass of C from $\\ce{CO2}$; use % C to find total mass\n- Answer: 200',
    'tag_mole_5', src(2023,'Jan',29,'Evening')),

  // Q27 — NVT — 16 Mar 2021 (E) — Ans: 525
  mkNVT('MOLE-317','Hard',
    'When $35\\,\\text{mL}$ of $0.15\\,\\text{M}$ lead nitrate solution is mixed with $20\\,\\text{mL}$ of $0.12\\,\\text{M}$ chromic sulphate solution, ______ $\\times 10^{-5}$ moles of lead sulphate precipitate out. (Round off to Nearest Integer)',
    {integer_value:525},
    '**Step 1:** $\\ce{3Pb(NO3)2 + Cr2(SO4)3 -> 3PbSO4 v + 2Cr(NO3)3}$\n\n**Step 2:** Moles of $\\ce{Pb(NO3)2} = 0.035 \\times 0.15 = 5.25 \\times 10^{-3}\\,\\text{mol}$\n\nMoles of $\\ce{Cr2(SO4)3} = 0.020 \\times 0.12 = 2.4 \\times 10^{-3}\\,\\text{mol}$\n\n**Step 3:** $\\ce{SO4^{2-}}$ available $= 3 \\times 2.4 \\times 10^{-3} = 7.2 \\times 10^{-3}\\,\\text{mol}$\n\n**Step 4:** $\\ce{Pb^{2+}}$ available $= 5.25 \\times 10^{-3}\\,\\text{mol}$ — limiting reagent\n\nMoles of $\\ce{PbSO4} = 5.25 \\times 10^{-3} = 525 \\times 10^{-5}\\,\\text{mol}$\n\n**Key Points:**\n- $\\ce{Pb^{2+} + SO4^{2-} -> PbSO4}$ (1:1)\n- $\\ce{Pb^{2+}}$ is limiting\n- Answer: 525',
    'tag_mole_6', src(2021,'Mar',16,'Evening')),

  // Q28 — NVT — 04 Sep 2020 (M) — Ans: 3400
  mkNVT('MOLE-318','Medium',
    'The mass of ammonia in grams produced when $2.8\\,\\text{kg}$ of dinitrogen quantitatively reacts with $1\\,\\text{kg}$ of dihydrogen is ______.',
    {integer_value:3400},
    '**Step 1:** $\\ce{N2 + 3H2 -> 2NH3}$\n\n**Step 2:** $n_{\\ce{N2}} = 2800/28 = 100\\,\\text{mol}$; $n_{\\ce{H2}} = 1000/2 = 500\\,\\text{mol}$\n\n**Step 3:** For 100 mol $\\ce{N2}$, need $300\\,\\text{mol}$ $\\ce{H2}$. Available $= 500\\,\\text{mol}$ — $\\ce{N2}$ is limiting.\n\n**Step 4:** $n_{\\ce{NH3}} = 2 \\times 100 = 200\\,\\text{mol}$\n\n$$m_{\\ce{NH3}} = 200 \\times 17 = 3400\\,\\text{g}$$\n\n**Key Points:**\n- $\\ce{N2}$ is the limiting reagent\n- 1 mol $\\ce{N2}$ → 2 mol $\\ce{NH3}$\n- Answer: 3400 g',
    'tag_mole_6', src(2020,'Sep',4,'Morning')),

  // Q29 — NVT — 25 Jul 2022 (E) — Ans: 46
  mkNVT('MOLE-319','Medium',
    '$56.0\\,\\text{L}$ of nitrogen gas is mixed with excess of hydrogen gas and it is found that $20\\,\\text{L}$ of ammonia gas is produced. The volume of unused nitrogen gas is found to be ______ L.',
    {integer_value:46},
    '**Step 1:** $\\ce{N2 + 3H2 -> 2NH3}$\n\n**Step 2:** 2 L $\\ce{NH3}$ produced from 1 L $\\ce{N2}$; so 20 L $\\ce{NH3}$ requires $20/2 = 10\\,\\text{L}$ $\\ce{N2}$.\n\n**Step 3:** Unused $\\ce{N2} = 56 - 10 = 46\\,\\text{L}$\n\n**Key Points:**\n- At same T, P: volume ratio = mole ratio\n- $\\ce{N2} : \\ce{NH3} = 1:2$\n- Answer: 46 L',
    'tag_mole_6', src(2022,'Jul',25,'Evening')),

  // Q30 — NVT — 08 Jan 2020 (M) — Ans: 27
  mkNVT('MOLE-320','Hard',
    'The volume (in mL) of $0.125\\,\\text{M}$ $\\ce{AgNO3}$ required to quantitatively precipitate chloride ions in $0.3\\,\\text{g}$ of $\\ce{[Co(NH3)6]Cl3}$ is ______. [$M_{\\ce{[Co(NH3)6]Cl3}} = 267.46\\,\\text{g/mol}$] (Nearest integer)',
    {integer_value:27},
    '**Step 1:** $n_{\\ce{[Co(NH3)6]Cl3}} = 0.3/267.46 = 1.1216 \\times 10^{-3}\\,\\text{mol}$\n\n**Step 2:** Each formula unit has 3 $\\ce{Cl-}$ ions:\n\n$n_{\\ce{Cl-}} = 3 \\times 1.1216 \\times 10^{-3} = 3.365 \\times 10^{-3}\\,\\text{mol}$\n\n**Step 3:** $\\ce{Ag+ + Cl- -> AgCl}$ (1:1)\n\n$n_{\\ce{AgNO3}} = 3.365 \\times 10^{-3}\\,\\text{mol}$\n\n**Step 4:** $V = n/M = 3.365 \\times 10^{-3}/0.125 = 0.02692\\,\\text{L} = 26.92 \\approx 27\\,\\text{mL}$\n\n**Key Points:**\n- 3 ionisable $\\ce{Cl-}$ per formula unit\n- $\\ce{Ag+}$ reacts 1:1 with $\\ce{Cl-}$\n- Answer: 27 mL',
    'tag_mole_6', src(2020,'Jan',8,'Morning')),
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
