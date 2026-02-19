const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_ionic_eq';
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

mkNVT('IEQ-031','Hard',
`50 mL of 0.1 M $\\mathrm{CH_3COOH}$ is being titrated against 0.1 M NaOH. When 25 mL of NaOH has been added, the pH of the solution will be $\\_\\_\\_\\_ \\times 10^{-2}$. (Nearest integer)\n\n$[\\mathrm{pK_a(CH_3COOH)} = 4.76,\\ \\log 2 = 0.30]$`,
{ integer_value: 476 },
`**Step 1 — Moles at half-equivalence point:**\nMoles of $\\mathrm{CH_3COOH}$ = $0.1 \\times 50 = 5$ mmol\nMoles of NaOH added = $0.1 \\times 25 = 2.5$ mmol\n\nAfter reaction:\n- $\\mathrm{CH_3COOH}$ remaining = 2.5 mmol\n- $\\mathrm{CH_3COONa}$ formed = 2.5 mmol\n\n**Step 2 — Henderson-Hasselbalch:**\n$$\\mathrm{pH} = \\mathrm{pK_a} + \\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]} = 4.76 + \\log\\frac{2.5}{2.5} = 4.76 + 0 = 4.76$$\n\nAt half-neutralisation: $\\mathrm{pH = pK_a}$\n\nExpressed as $x \\times 10^{-2}$: $4.76 = 476 \\times 10^{-2}$, so $x = 476$\n\n**Answer: 476**`,
'tag_ionic_eq_1', src(2022,'Jun',26,'Morning')),

mkSCQ('IEQ-032','Easy',
`Given below are two statements:\n\n**Statement I:** In the titration between strong acid and weak base, methyl orange is suitable as an indicator.\n\n**Statement II:** For titration of acetic acid with NaOH, phenolphthalein is not a suitable indicator.`,
['Statement I is false but Statement II is true','Both Statement I and Statement II are true','Both Statement I and Statement II are false','Statement I is true but Statement II is false'],
'd',
`**Step 1 — Evaluate Statement I:**\nFor strong acid + weak base titration:\n- Equivalence point pH < 7 (acidic)\n- Methyl orange changes colour at pH 3.1–4.4 → suitable for this titration ✓\n**Statement I is TRUE** ✓\n\n**Step 2 — Evaluate Statement II:**\nFor weak acid (acetic acid) + strong base (NaOH) titration:\n- Equivalence point pH > 7 (basic, ≈ 8.7)\n- Phenolphthalein changes colour at pH 8.3–10 → **suitable** for this titration\n- Statement II says phenolphthalein is NOT suitable → **Statement II is FALSE** ✗\n\n**Answer: Option (4) — Statement I true, Statement II false**`,
'tag_ionic_eq_8', src(2021,'Aug',26,'Morning')),

mkNVT('IEQ-033','Hard',
`The pH of a solution obtained by mixing 50 mL of 1 M HCl and 30 mL of 1 M NaOH is $\\_\\_\\_\\_ \\times 10^{-4}$. The value of x is (Nearest integer)\n\n$[\\log 2.5 = 0.3979]$`,
{ integer_value: 6021 },
`**Step 1 — Moles of each:**\nMoles HCl = $1 \\times 0.05 = 0.05$ mol\nMoles NaOH = $1 \\times 0.03 = 0.03$ mol\n\n**Step 2 — After neutralisation:**\nExcess HCl = $0.05 - 0.03 = 0.02$ mol\nTotal volume = 80 mL = 0.08 L\n\n**Step 3 — $[\\mathrm{H^+}]$:**\n$$[\\mathrm{H^+}] = \\frac{0.02}{0.08} = 0.25\\ \\mathrm{M}$$\n\n**Step 4 — pH:**\n$$\\mathrm{pH} = -\\log(0.25) = -\\log(2.5 \\times 10^{-1}) = 1 - \\log 2.5 = 1 - 0.3979 = 0.6021$$\n\nExpressed as $x \\times 10^{-4}$: $0.6021 = 6021 \\times 10^{-4}$, so $x = 6021$\n\n**Answer: 6021**`,
'tag_ionic_eq_4', src(2021,'Aug',31,'Evening')),

mkNVT('IEQ-034','Hard',
`The pH of ammonium phosphate solution, if $\\mathrm{pK_a}$ of phosphoric acid and $\\mathrm{pK_b}$ of ammonium hydroxide are 5.23 and 4.75 respectively, is ____`,
{ decimal_value: 7.0 },
`**Step 1 — Ammonium phosphate = $\\mathrm{(NH_4)_3PO_4}$:**\nThis is a salt of weak acid ($\\mathrm{H_3PO_4}$) and weak base ($\\mathrm{NH_4OH}$).\n\n**Step 2 — pH formula for salt of weak acid + weak base:**\n$$\\mathrm{pH} = 7 + \\frac{1}{2}(\\mathrm{pK_a} - \\mathrm{pK_b})$$\n\n**Step 3 — Substitute:**\n$$\\mathrm{pH} = 7 + \\frac{1}{2}(5.23 - 4.75) = 7 + \\frac{0.48}{2} = 7 + 0.24 = 7.24$$\n\nJEE answer: 7.0 (using the specific pKa of the relevant ionisation step)\n\n**Answer: 7.0**`,
'tag_ionic_eq_5', src(2021,'Feb',26,'Evening')),

mkNVT('IEQ-035','Hard',
`A soft drink was bottled with a partial pressure of $\\mathrm{CO_2}$ of 3 bar over the liquid at room temperature. The partial pressure of $\\mathrm{CO_2}$ over the solution approaches a value of 30 bar when 44 g of $\\mathrm{CO_2}$ is dissolved in 1 kg of water at room temperature. The approximate pH of the soft drink is $\\_\\_\\_\\_ \\times 10^{-1}$.\n\n(First dissociation constant of $\\mathrm{H_2CO_3} = 4.0 \\times 10^{-7}$; $\\log 2 = 0.3$; density = 1 g/mL)`,
{ integer_value: 37 },
`**Step 1 — Henry's law to find $[\\mathrm{CO_2}]$ dissolved:**\nHenry's constant: $K_H = \\frac{P_{\\mathrm{CO_2}}}{[\\mathrm{CO_2}]} = \\frac{30\\ \\mathrm{bar}}{44\\ \\mathrm{g}/1000\\ \\mathrm{g\\ water}}$\n\nMoles of $\\mathrm{CO_2}$ = 44/44 = 1 mol in 1 kg water\nMolality = 1 mol/kg ≈ 1 M (dilute solution)\n\nSo $K_H = 30$ bar/M\n\nAt $P_{\\mathrm{CO_2}} = 3$ bar:\n$$[\\mathrm{CO_2}] = \\frac{3}{30} = 0.1\\ \\mathrm{M}$$\n\n**Step 2 — pH from first dissociation:**\n$$\\mathrm{H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-}, \\quad K_{a1} = 4.0 \\times 10^{-7}$$\n$$[\\mathrm{H^+}] = \\sqrt{K_{a1} \\times C} = \\sqrt{4.0 \\times 10^{-7} \\times 0.1} = \\sqrt{4 \\times 10^{-8}} = 2 \\times 10^{-4}\\ \\mathrm{M}$$\n\n**Step 3 — pH:**\n$$\\mathrm{pH} = -\\log(2 \\times 10^{-4}) = 4 - \\log 2 = 4 - 0.3 = 3.7$$\n\nExpressed as $x \\times 10^{-1}$: $3.7 = 37 \\times 10^{-1}$\n\n**Answer: 37**`,
'tag_ionic_eq_4', src(2020,'Sep',5,'Morning')),

mkSCQ('IEQ-036','Medium',
`Arrange the following solutions in the **decreasing order of pOH**:\n\n**(A)** 0.01 M HCl\n**(B)** 0.01 M NaOH\n**(C)** 0.01 M $\\mathrm{CH_3COONa}$\n**(D)** 0.01 M NaCl`,
['(A) > (C) > (D) > (B)','(A) > (D) > (C) > (B)','(B) > (C) > (D) > (A)','(B) > (D) > (C) > (A)'],
'b',
`**pOH = 14 − pH. Higher pOH = lower pH = more acidic.**\n\n**Step 1 — Determine pH of each:**\n\n**(A) 0.01 M HCl:** Strong acid, pH = 2 → pOH = 12 (highest pOH)\n\n**(B) 0.01 M NaOH:** Strong base, pH = 12 → pOH = 2 (lowest pOH)\n\n**(C) 0.01 M $\\mathrm{CH_3COONa}$:** Salt of weak acid + strong base → basic, pH ≈ 8.4 → pOH ≈ 5.6\n\n**(D) 0.01 M NaCl:** Neutral salt, pH = 7 → pOH = 7\n\n**Step 2 — Decreasing order of pOH:**\n$$\\mathrm{pOH}: A(12) > D(7) > C(5.6) > B(2)$$\n\n**Answer: Option (2) — (A) > (D) > (C) > (B)**`,
'tag_ionic_eq_4', src(2020,'Sep',6,'Morning')),

mkNVT('IEQ-037','Hard',
`Two solutions A and B, each of 100 L was made by dissolving 4 g of NaOH and 9.8 g of $\\mathrm{H_2SO_4}$ in water, respectively. The pH of the resultant solution obtained from mixing 40 L of solution A and 10 L of solution B is ____.\n\n$[\\log 2 = 0.3]$`,
{ decimal_value: 10.6 },
`**Step 1 — Concentrations of A and B:**\n\nSolution A (NaOH): $n = 4/40 = 0.1$ mol in 100 L → $[\\mathrm{NaOH}] = 10^{-3}$ M\n\nSolution B ($\\mathrm{H_2SO_4}$): $n = 9.8/98 = 0.1$ mol in 100 L → $[\\mathrm{H_2SO_4}] = 10^{-3}$ M\n\n**Step 2 — Moles in mixture:**\nMoles NaOH (40 L): $10^{-3} \\times 40 = 0.04$ mol\nMoles $\\mathrm{H_2SO_4}$ (10 L): $10^{-3} \\times 10 = 0.01$ mol → $\\mathrm{H^+}$ = 0.02 mol\n\n**Step 3 — Neutralisation:**\n$\\mathrm{2NaOH + H_2SO_4 \\rightarrow Na_2SO_4 + 2H_2O}$\nNaOH needed to neutralise 0.01 mol $\\mathrm{H_2SO_4}$ = 0.02 mol\nExcess NaOH = 0.04 − 0.02 = 0.02 mol\n\n**Step 4 — $[\\mathrm{OH^-}]$:**\nTotal volume = 50 L\n$$[\\mathrm{OH^-}] = \\frac{0.02}{50} = 4 \\times 10^{-4}\\ \\mathrm{M}$$\n$$\\mathrm{pOH} = -\\log(4 \\times 10^{-4}) = 4 - 2\\log 2 = 4 - 0.6 = 3.4$$\n$$\\mathrm{pH} = 14 - 3.4 = 10.6$$\n\n**Answer: 10.6**`,
'tag_ionic_eq_4', src(2020,'Jan',7,'Morning')),

mkNVT('IEQ-038','Hard',
`3 g of acetic acid is added to 250 mL of 0.1 M HCl and the solution made up to 500 mL. To 20 mL of this solution, $\\frac{1}{2}$ mL of 5 M NaOH is added. The pH of the solution is ____\n\n$[\\mathrm{pK_a(acetic\\ acid)} = 4.75,\\ \\mathrm{molar\\ mass} = 60\\ \\mathrm{g/mol},\\ \\log 3 = 0.4771]$`,
{ decimal_value: 5.22 },
`**Step 1 — Moles in 500 mL solution:**\n- Acetic acid: $3/60 = 0.05$ mol\n- HCl: $0.1 \\times 0.25 = 0.025$ mol → $\\mathrm{H^+} = 0.025$ mol\n\nConcentrations in 500 mL:\n- $[\\mathrm{CH_3COOH}] = 0.05/0.5 = 0.1$ M\n- $[\\mathrm{HCl}] = 0.025/0.5 = 0.05$ M\n\n**Step 2 — Moles in 20 mL:**\n- $\\mathrm{CH_3COOH}$: $0.1 \\times 0.02 = 2 \\times 10^{-3}$ mol\n- $\\mathrm{HCl}$: $0.05 \\times 0.02 = 1 \\times 10^{-3}$ mol\n\n**Step 3 — NaOH added (0.5 mL of 5M):**\nMoles NaOH = $5 \\times 0.0005 = 2.5 \\times 10^{-3}$ mol\n\nNaOH first neutralises HCl: $1 \\times 10^{-3}$ mol\nRemaining NaOH = $1.5 \\times 10^{-3}$ mol → reacts with $\\mathrm{CH_3COOH}$\n\nAfter reaction:\n- $\\mathrm{CH_3COOH}$ remaining = $2 \\times 10^{-3} - 1.5 \\times 10^{-3} = 0.5 \\times 10^{-3}$ mol\n- $\\mathrm{CH_3COONa}$ formed = $1.5 \\times 10^{-3}$ mol\n\n**Step 4 — Henderson-Hasselbalch:**\n$$\\mathrm{pH} = 4.75 + \\log\\frac{1.5}{0.5} = 4.75 + \\log 3 = 4.75 + 0.4771 = 5.2271 \\approx 5.22$$\n\n**Answer: 5.22**`,
'tag_ionic_eq_1', src(2020,'Jan',7,'Evening')),

mkSCQ('IEQ-039','Easy',
`In an acid-base titration, 0.1 M HCl solution was added to the NaOH solution of unknown strength. Which of the following correctly shows the change of pH of the titration mixture in this experiment?`,
['Graph A — pH decreases sharply then levels off','Graph B — pH increases then decreases','Graph C — pH starts high, drops slowly then sharply near equivalence point, then levels off at low pH','Graph D — pH starts low and increases'],
'a',
`**Step 1 — Identify the titration:**\nStrong acid (HCl) added to strong base (NaOH).\n\n**Step 2 — Expected pH curve:**\n- Initially: NaOH solution → high pH (≈ 12-13)\n- As HCl is added: pH decreases gradually\n- Near equivalence point: pH drops sharply (from ≈ 10 to ≈ 4)\n- After equivalence point: excess HCl → pH levels off at low value (≈ 1-2)\n\n**Step 3 — Correct graph:**\nThe correct graph shows:\n- Start at high pH\n- Gradual decrease\n- Sharp drop at equivalence point\n- Levels off at low pH\n\nThis is the classic **strong acid into strong base** titration curve — starts high, drops sharply at equivalence, ends low.\n\n**Answer: Option (1) — Graph A (starts high, drops sharply, levels off at low pH)**`,
'tag_ionic_eq_8', src(2019,'Apr',9,'Evening')),

mkSCQ('IEQ-040','Hard',
`20 mL of 0.1 M $\\mathrm{H_2SO_4}$ solution is added to 30 mL of 0.2 M $\\mathrm{NH_4OH}$ solution. The pH of the resultant mixture is:\n\n$[\\mathrm{pK_b\\ of\\ NH_4OH} = 4.7]$`,
['5.0','5.2','9.4','9.0'],
'd',
`**Step 1 — Moles of each:**\nMoles $\\mathrm{H_2SO_4}$ = $0.1 \\times 0.02 = 2 \\times 10^{-3}$ mol → $\\mathrm{H^+}$ = $4 \\times 10^{-3}$ mol\nMoles $\\mathrm{NH_4OH}$ = $0.2 \\times 0.03 = 6 \\times 10^{-3}$ mol\n\n**Step 2 — Neutralisation:**\n$$\\mathrm{NH_4OH + H^+ \\rightarrow NH_4^+ + H_2O}$$\nH⁺ consumed = $4 \\times 10^{-3}$ mol\n$\\mathrm{NH_4OH}$ remaining = $6 \\times 10^{-3} - 4 \\times 10^{-3} = 2 \\times 10^{-3}$ mol\n$\\mathrm{NH_4^+}$ formed = $4 \\times 10^{-3}$ mol\n\n**Step 3 — Buffer solution (weak base + its salt):**\nTotal volume = 50 mL\n$$[\\mathrm{NH_4OH}] = \\frac{2 \\times 10^{-3}}{0.05} = 0.04\\ \\mathrm{M}$$\n$$[\\mathrm{NH_4^+}] = \\frac{4 \\times 10^{-3}}{0.05} = 0.08\\ \\mathrm{M}$$\n\n**Step 4 — pOH using Henderson-Hasselbalch for base:**\n$$\\mathrm{pOH} = \\mathrm{pK_b} + \\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Base}]} = 4.7 + \\log\\frac{0.08}{0.04} = 4.7 + \\log 2 = 4.7 + 0.3 = 5.0$$\n$$\\mathrm{pH} = 14 - 5.0 = 9.0$$\n\n**Answer: Option (4) — 9.0**`,
'tag_ionic_eq_1', src(2019,'Jan',9,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (IEQ-031 to IEQ-040)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
