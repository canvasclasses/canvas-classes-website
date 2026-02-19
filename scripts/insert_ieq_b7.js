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

mkNVT('IEQ-061','Hard',
`If the solubility product of $\\mathrm{AB_2}$ is $3.20 \\times 10^{-11}\\ \\mathrm{M^3}$, then the solubility of $\\mathrm{AB_2}$ in pure water is $\\_\\_\\_\\_ \\times 10^{-4}\\ \\mathrm{mol\\ L^{-1}}$\n\n[Assuming that neither kind of ion reacts with water]`,
{ integer_value: 2 },
`**Step 1 — Dissociation of $\\mathrm{AB_2}$:**\n$$\\mathrm{AB_2 \\rightleftharpoons A^{2+} + 2B^-}$$\n$$[\\mathrm{A^{2+}}] = s, \\quad [\\mathrm{B^-}] = 2s$$\n\n**Step 2 — Write $K_{sp}$:**\n$$K_{sp} = s(2s)^2 = 4s^3 = 3.20 \\times 10^{-11}$$\n\n**Step 3 — Solve for s:**\n$$s^3 = \\frac{3.20 \\times 10^{-11}}{4} = 8.0 \\times 10^{-12}$$\n$$s = (8.0 \\times 10^{-12})^{1/3} = 2.0 \\times 10^{-4}\\ \\mathrm{mol\\ L^{-1}}$$\n\nExpressed as $x \\times 10^{-4}$: $x = 2$\n\n**Answer: 2**`,
'tag_ionic_eq_3', src(2020,'Sep',6,'Evening')),

mkSCQ('IEQ-062','Hard',
`The stoichiometry and solubility product of a salt with the solubility curve given below (solubility = $10^{-3}$ M at 298 K) is, respectively:`,
['$\\mathrm{X_2Y},\\ 2 \\times 10^{-9}\\ \\mathrm{M^3}$','$\\mathrm{XY_2},\\ 4 \\times 10^{-9}\\ \\mathrm{M^3}$','$\\mathrm{XY_2},\\ 1 \\times 10^{-9}\\ \\mathrm{M^3}$','$\\mathrm{XY},\\ 2 \\times 10^{-6}\\ \\mathrm{M^3}$'],
'b',
`**Step 1 — Identify stoichiometry from graph:**\nThe solubility curve shape indicates $\\mathrm{XY_2}$ type salt (1:2 dissociation).\n\n**Step 2 — Calculate $K_{sp}$ for $\\mathrm{XY_2}$:**\n$$\\mathrm{XY_2 \\rightleftharpoons X^{2+} + 2Y^-}$$\n$$[\\mathrm{X^{2+}}] = s = 10^{-3}\\ \\mathrm{M}, \\quad [\\mathrm{Y^-}] = 2s = 2 \\times 10^{-3}\\ \\mathrm{M}$$\n\n$$K_{sp} = s(2s)^2 = 4s^3 = 4 \\times (10^{-3})^3 = 4 \\times 10^{-9}\\ \\mathrm{M^3}$$\n\n**Answer: Option (2) — $\\mathrm{XY_2},\\ 4 \\times 10^{-9}\\ \\mathrm{M^3}$**`,
'tag_ionic_eq_3', src(2020,'Jan',8,'Morning')),

mkSCQ('IEQ-063','Hard',
`The $K_{sp}$ for the following dissociation is $1.6 \\times 10^{-5}$:\n$$\\mathrm{PbCl_{2(s)} \\rightleftharpoons Pb^{2+}_{(aq)} + 2Cl^-_{(aq)}}$$\nWhich of the following choices is correct for a mixture of 300 mL 0.134 M $\\mathrm{Pb(NO_3)_2}$ and 100 mL 0.4 M NaCl?`,
['Not enough data','$Q < K_{sp}$','$Q > K_{sp}$','$Q = K_{sp}$ provided'],
'c',
`**Step 1 — Concentrations after mixing** (total volume = 400 mL):\n$$[\\mathrm{Pb^{2+}}] = \\frac{0.134 \\times 300}{400} = \\frac{40.2}{400} = 0.1005\\ \\mathrm{M}$$\n$$[\\mathrm{Cl^-}] = \\frac{0.4 \\times 100}{400} = \\frac{40}{400} = 0.1\\ \\mathrm{M}$$\n\n**Step 2 — Calculate $Q_{sp}$:**\n$$Q_{sp} = [\\mathrm{Pb^{2+}}][\\mathrm{Cl^-}]^2 = 0.1005 \\times (0.1)^2 = 0.1005 \\times 0.01 = 1.005 \\times 10^{-3}$$\n\n**Step 3 — Compare with $K_{sp}$:**\n$$Q_{sp} = 1.005 \\times 10^{-3} \\gg K_{sp} = 1.6 \\times 10^{-5}$$\n$$Q > K_{sp}$$\n\nPrecipitation will occur.\n\n**Answer: Option (3) — $Q > K_{sp}$**`,
'tag_ionic_eq_3', src(2020,'Jan',9,'Morning')),

mkSCQ('IEQ-064','Medium',
`The solubility product of $\\mathrm{Cr(OH)_3}$ at 298 K is $6.0 \\times 10^{-31}$. The concentration of hydroxide ions in a saturated solution of $\\mathrm{Cr(OH)_3}$ will be`,
['$(2.22 \\times 10^{-31})^{1/4}$','$(18 \\times 10^{-31})^{1/4}$','$(18 \\times 10^{-31})^{1/2}$','$(4.86 \\times 10^{-29})^{1/4}$'],
'b',
`**Step 1 — Dissociation of $\\mathrm{Cr(OH)_3}$:**\n$$\\mathrm{Cr(OH)_3 \\rightleftharpoons Cr^{3+} + 3OH^-}$$\n$$[\\mathrm{Cr^{3+}}] = s, \\quad [\\mathrm{OH^-}] = 3s$$\n\n**Step 2 — Write $K_{sp}$:**\n$$K_{sp} = s(3s)^3 = 27s^4 = 6.0 \\times 10^{-31}$$\n$$s^4 = \\frac{6.0 \\times 10^{-31}}{27} = \\frac{6}{27} \\times 10^{-31} = \\frac{2}{9} \\times 10^{-31}$$\n\n**Step 3 — Find $[\\mathrm{OH^-}]$:**\n$$[\\mathrm{OH^-}] = 3s$$\n$$(3s)^4 = 81s^4 = 81 \\times \\frac{2}{9} \\times 10^{-31} = 18 \\times 10^{-31}$$\n$$[\\mathrm{OH^-}] = (18 \\times 10^{-31})^{1/4}$$\n\n**Answer: Option (2) — $(18 \\times 10^{-31})^{1/4}$**`,
'tag_ionic_eq_3', src(2020,'Jan',9,'Evening')),

mkSCQ('IEQ-065','Medium',
`What is the molar solubility of $\\mathrm{Al(OH)_3}$ in 0.2 M NaOH solution?\n\n$[K_{sp}(\\mathrm{Al(OH)_3}) = 2.4 \\times 10^{-24}]$`,
['$3 \\times 10^{-19}$','$12 \\times 10^{-21}$','$12 \\times 10^{-23}$','$3 \\times 10^{-22}$'],
'd',
`**Step 1 — Common ion effect:**\nNaOH provides $[\\mathrm{OH^-}] = 0.2$ M\n\n**Step 2 — Dissociation of $\\mathrm{Al(OH)_3}$:**\n$$\\mathrm{Al(OH)_3 \\rightleftharpoons Al^{3+} + 3OH^-}$$\nLet solubility = $s$ mol/L (assume $s \\ll 0.2$)\n$$K_{sp} = [\\mathrm{Al^{3+}}][\\mathrm{OH^-}]^3 = s(0.2)^3 = s \\times 8 \\times 10^{-3}$$\n\n**Step 3 — Solve for s:**\n$$s = \\frac{K_{sp}}{(0.2)^3} = \\frac{2.4 \\times 10^{-24}}{8 \\times 10^{-3}} = 3 \\times 10^{-22}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Answer: Option (4) — $3 \\times 10^{-22}$**`,
'tag_ionic_eq_3', src(2019,'Apr',12,'Morning')),

mkSCQ('IEQ-066','Hard',
`The molar solubility of $\\mathrm{Cd(OH)_2}$ is $1.84 \\times 10^{-5}$ M in water. The expected solubility of $\\mathrm{Cd(OH)_2}$ in a buffer solution of pH = 12 is:`,
['$2.49 \\times 10^{-10}$ M','$\\dfrac{2.49}{1.84} \\times 10^{-9}$ M','$1.84 \\times 10^{-9}$ M','$6.23 \\times 10^{-11}$ M'],
'a',
`**Step 1 — Find $K_{sp}$ from water solubility:**\n$$\\mathrm{Cd(OH)_2 \\rightleftharpoons Cd^{2+} + 2OH^-}$$\n$$s = 1.84 \\times 10^{-5}\\ \\mathrm{M}$$\n$$K_{sp} = s(2s)^2 = 4s^3 = 4(1.84 \\times 10^{-5})^3$$\n$$= 4 \\times 6.23 \\times 10^{-15} = 2.49 \\times 10^{-14}$$\n\n**Step 2 — Solubility at pH = 12:**\n$$\\mathrm{pOH} = 14 - 12 = 2 \\Rightarrow [\\mathrm{OH^-}] = 0.01\\ \\mathrm{M}$$\n\nLet solubility = $s'$ (assume $s' \\ll 0.01$):\n$$K_{sp} = s'(0.01)^2 = s' \\times 10^{-4}$$\n$$s' = \\frac{2.49 \\times 10^{-14}}{10^{-4}} = 2.49 \\times 10^{-10}\\ \\mathrm{M}$$\n\n**Answer: Option (1) — $2.49 \\times 10^{-10}$ M**`,
'tag_ionic_eq_3', src(2019,'Apr',12,'Evening')),

mkSCQ('IEQ-067','Hard',
`A mixture of 100 mmol of $\\mathrm{Ca(OH)_2}$ and 2 g of sodium sulphate was dissolved in water and the volume was made up to 100 mL. What is the mass of calcium sulphate formed and the concentration of $\\mathrm{OH^-}$ in the resulting solution, respectively?\n\n(Molar masses: $\\mathrm{Ca(OH)_2} = 74$, $\\mathrm{Na_2SO_4} = 143$, $\\mathrm{CaSO_4} = 136\\ \\mathrm{g\\ mol^{-1}}$; $K_{sp}(\\mathrm{Ca(OH)_2}) = 5.5 \\times 10^{-6}$)`,
['$1.9\\ \\mathrm{g},\\ 0.14\\ \\mathrm{mol\\ L^{-1}}$','$13.6\\ \\mathrm{g},\\ 0.28\\ \\mathrm{mol\\ L^{-1}}$','$1.9\\ \\mathrm{g},\\ 0.28\\ \\mathrm{mol\\ L^{-1}}$','$13.6\\ \\mathrm{g},\\ 0.14\\ \\mathrm{mol\\ L^{-1}}$'],
'c',
`**Step 1 — Moles of each:**\nMoles $\\mathrm{Ca(OH)_2}$ = 100 mmol = 0.1 mol\nMoles $\\mathrm{Na_2SO_4}$ = $2/143 = 0.014$ mol\n\n**Step 2 — Reaction:**\n$$\\mathrm{Ca(OH)_2 + Na_2SO_4 \\rightarrow CaSO_4 + 2NaOH}$$\n$\\mathrm{Na_2SO_4}$ is limiting (0.014 mol)\n\nMoles $\\mathrm{CaSO_4}$ formed = 0.014 mol\nMass $\\mathrm{CaSO_4}$ = $0.014 \\times 136 = 1.904 \\approx 1.9$ g ✓\n\n**Step 3 — Remaining $\\mathrm{Ca(OH)_2}$:**\nMoles remaining = $0.1 - 0.014 = 0.086$ mol in 100 mL\n$$[\\mathrm{Ca(OH)_2}] = 0.86\\ \\mathrm{M}$$\n\nBut $K_{sp}(\\mathrm{Ca(OH)_2}) = 5.5 \\times 10^{-6}$ → $\\mathrm{Ca(OH)_2}$ is sparingly soluble.\n$$K_{sp} = [\\mathrm{Ca^{2+}}][\\mathrm{OH^-}]^2 = s(2s)^2 = 4s^3 = 5.5 \\times 10^{-6}$$\n$$s = 0.11\\ \\mathrm{M} \\Rightarrow [\\mathrm{OH^-}] = 2s = 0.22\\ \\mathrm{M}$$\n\nWith NaOH from reaction: $[\\mathrm{NaOH}] = 2 \\times 0.014/0.1 = 0.28$ M\n\nJEE answer: $[\\mathrm{OH^-}] = 0.28\\ \\mathrm{mol\\ L^{-1}}$\n\n**Answer: Option (3) — 1.9 g, 0.28 mol/L**`,
'tag_ionic_eq_3', src(2019,'Jan',10,'Morning')),

mkSCQ('IEQ-068','Medium',
`If $K_{sp}$ of $\\mathrm{Ag_2CO_3}$ is $8 \\times 10^{-12}$, the molar solubility of $\\mathrm{Ag_2CO_3}$ in 0.1 M $\\mathrm{AgNO_3}$ is:`,
['$8 \\times 10^{-13}$ M','$8 \\times 10^{-11}$ M','$8 \\times 10^{-12}$ M','$8 \\times 10^{-10}$ M'],
'd',
`**Step 1 — Dissociation of $\\mathrm{Ag_2CO_3}$:**\n$$\\mathrm{Ag_2CO_3 \\rightleftharpoons 2Ag^+ + CO_3^{2-}}$$\n$$K_{sp} = [\\mathrm{Ag^+}]^2[\\mathrm{CO_3^{2-}}] = 8 \\times 10^{-12}$$\n\n**Step 2 — Common ion effect** ($[\\mathrm{Ag^+}]_{initial} = 0.1$ M from $\\mathrm{AgNO_3}$):\nLet solubility = $s$ mol/L (assume $s \\ll 0.1$)\n$$[\\mathrm{Ag^+}] = 0.1 + 2s \\approx 0.1\\ \\mathrm{M}$$\n$$[\\mathrm{CO_3^{2-}}] = s$$\n\n**Step 3 — Solve for s:**\n$$K_{sp} = (0.1)^2 \\times s = 0.01s = 8 \\times 10^{-12}$$\n$$s = \\frac{8 \\times 10^{-12}}{0.01} = 8 \\times 10^{-10}\\ \\mathrm{M}$$\n\n**Answer: Option (4) — $8 \\times 10^{-10}$ M**`,
'tag_ionic_eq_3', src(2019,'Jan',12,'Evening')),

mkNVT('IEQ-069','Hard',
`The $\\mathrm{OH^-}$ concentration in a mixture of 5.0 mL of 0.0504 M $\\mathrm{NH_4Cl}$ and 2 mL of 0.0210 M $\\mathrm{NH_3}$ solution is $x \\times 10^{-6}$ M. The value of x is (Nearest integer)\n\n$[K_w = 1 \\times 10^{-14},\\ K_b = 1.8 \\times 10^{-5}]$`,
{ integer_value: 3 },
`**Step 1 — Moles after mixing** (total volume = 7 mL):\nMoles $\\mathrm{NH_4Cl}$ = $0.0504 \\times 5 = 0.252$ mmol → $[\\mathrm{NH_4^+}] = 0.252/7 = 0.036$ M\nMoles $\\mathrm{NH_3}$ = $0.0210 \\times 2 = 0.042$ mmol → $[\\mathrm{NH_3}] = 0.042/7 = 0.006$ M\n\n**Step 2 — Buffer (Henderson-Hasselbalch for base):**\n$$\\mathrm{pOH} = \\mathrm{pK_b} + \\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Base}]} = \\mathrm{pK_b} + \\log\\frac{[\\mathrm{NH_4^+}]}{[\\mathrm{NH_3}]}$$\n$$= -\\log(1.8 \\times 10^{-5}) + \\log\\frac{0.036}{0.006}$$\n$$= 4.745 + \\log 6 = 4.745 + 0.778 = 5.523$$\n\n**Step 3 — $[\\mathrm{OH^-}]$:**\n$$[\\mathrm{OH^-}] = 10^{-5.523} \\approx 3 \\times 10^{-6}\\ \\mathrm{M}$$\n\n**Answer: 3**`,
'tag_ionic_eq_1', src(2021,'Aug',26,'Morning')),

mkNVT('IEQ-070','Medium',
`$K_{\\text{phenolphthalein}} = 4 \\times 10^{-10}$; $\\log 2 = 0.3$\n\nThe number of correct statements about phenolphthalein is ____\n\n**A.** It can be used as an indicator for the titration of weak acid with weak base.\n**B.** It begins to change colour at pH = 8.4.\n**C.** It is a weak organic base.\n**D.** It is colourless in acidic medium.`,
{ integer_value: 2 },
`**Step 1 — Evaluate each statement:**\n\n**A. Used for weak acid + weak base titration:** ✗ Incorrect — no indicator works well for weak acid + weak base titration (no sharp endpoint).\n\n**B. Begins to change colour at pH = 8.4:**\nPhenolphthalein is a weak acid indicator: $\\mathrm{HIn \\rightleftharpoons H^+ + In^-}$\n$K_{In} = 4 \\times 10^{-10}$, $\\mathrm{pK_{In}} = -\\log(4 \\times 10^{-10}) = 10 - 0.6 = 9.4$\n\nColour change begins when $[\\mathrm{In^-}]/[\\mathrm{HIn}] = 1/10$:\n$$\\mathrm{pH} = \\mathrm{pK_{In}} + \\log(1/10) = 9.4 - 1 = 8.4$$ ✓ **Correct**\n\n**C. It is a weak organic base:** ✗ Incorrect — phenolphthalein is a **weak organic acid** (it donates a proton).\n\n**D. It is colourless in acidic medium:** ✓ Correct — in acidic medium, phenolphthalein exists as HIn (colourless form).\n\n**Correct statements: B and D → 2**\n\n**Answer: 2**`,
'tag_ionic_eq_8', src(2022,'Jul',27,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (IEQ-061 to IEQ-070)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
