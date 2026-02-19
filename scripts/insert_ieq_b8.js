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

mkNVT('IEQ-071','Hard',
`600 mL of 0.01 M HCl is mixed with 400 mL of 0.01 M $\\mathrm{H_2SO_4}$. The pH of the mixture is $\\_\\_\\_\\_ \\times 10^{-2}$. (Nearest integer)\n\n$[\\log 2 = 0.30,\\ \\log 3 = 0.48,\\ \\log 5 = 0.69,\\ \\log 7 = 0.84,\\ \\log 11 = 1.04]$`,
{ integer_value: 186 },
`**Step 1 — Moles of $\\mathrm{H^+}$:**\n\nFrom HCl: $n_{\\mathrm{H^+}} = 0.01 \\times 0.6 = 6 \\times 10^{-3}$ mol\n\nFrom $\\mathrm{H_2SO_4}$ (dibasic): $n_{\\mathrm{H^+}} = 2 \\times 0.01 \\times 0.4 = 8 \\times 10^{-3}$ mol\n\n**Step 2 — Total $[\\mathrm{H^+}]$:**\nTotal volume = 1000 mL = 1 L\n$$[\\mathrm{H^+}] = \\frac{(6 + 8) \\times 10^{-3}}{1} = 14 \\times 10^{-3} = 1.4 \\times 10^{-2}\\ \\mathrm{M}$$\n\n**Step 3 — pH:**\n$$\\mathrm{pH} = -\\log(1.4 \\times 10^{-2}) = 2 - \\log 1.4 = 2 - \\log\\frac{14}{10}$$\n$$= 2 - (\\log 14 - 1) = 3 - \\log 14 = 3 - (\\log 2 + \\log 7)$$\n$$= 3 - (0.30 + 0.84) = 3 - 1.14 = 1.86$$\n\nExpressed as $x \\times 10^{-2}$: $1.86 = 186 \\times 10^{-2}$\n\n**Answer: 186**`,
'tag_ionic_eq_4', src(2023,'Jan',30,'Morning')),

mkNVT('IEQ-072','Hard',
`Sulphurous acid ($\\mathrm{H_2SO_3}$) has $K_{a1} = 1.7 \\times 10^{-2}$ and $K_{a2} = 6.4 \\times 10^{-8}$. The pH of 0.588 M $\\mathrm{H_2SO_3}$ is ____ (Round off to Nearest Integer)`,
{ integer_value: 1 },
`**Step 1 — First dissociation dominates** (since $K_{a1} \\gg K_{a2}$):\n$$\\mathrm{H_2SO_3 \\rightleftharpoons H^+ + HSO_3^-}, \\quad K_{a1} = 1.7 \\times 10^{-2}$$\n\n**Step 2 — ICE table** (initial $[\\mathrm{H_2SO_3}] = 0.588$ M):\n\n| | $\\mathrm{H_2SO_3}$ | $\\mathrm{H^+}$ | $\\mathrm{HSO_3^-}$ |\n|--|--|--|--|\n| Initial | 0.588 | 0 | 0 |\n| Change | $-x$ | $+x$ | $+x$ |\n| Equil. | $0.588-x$ | $x$ | $x$ |\n\n$$K_{a1} = \\frac{x^2}{0.588 - x} = 1.7 \\times 10^{-2}$$\n\n**Step 3 — Solve** (using quadratic or approximation):\n$$x^2 + 0.017x - 0.01 = 0$$\n$$x = \\frac{-0.017 + \\sqrt{0.000289 + 0.04}}{2} = \\frac{-0.017 + \\sqrt{0.040289}}{2}$$\n$$= \\frac{-0.017 + 0.2007}{2} = \\frac{0.1837}{2} \\approx 0.0918\\ \\mathrm{M}$$\n\n**Step 4 — pH:**\n$$\\mathrm{pH} = -\\log(0.0918) \\approx -\\log(10^{-1}) = 1$$\n\n**Answer: 1**`,
'tag_ionic_eq_4', src(2022,'Jul',26,'Morning')),

mkNVT('IEQ-073','Hard',
`20 mL of 0.1 M NaOH is added to 50 mL of 0.1 M acetic acid solution. The pH of the resulting solution is $\\_\\_\\_\\_ \\times 10^{-2}$. (Nearest integer)\n\n$[\\mathrm{pK_a(CH_3COOH)} = 4.76,\\ \\log 2 = 0.30,\\ \\log 3 = 0.48]$`,
{ integer_value: 458 },
`**Step 1 — Moles of each:**\nMoles NaOH = $0.1 \\times 0.02 = 2 \\times 10^{-3}$ mol\nMoles $\\mathrm{CH_3COOH}$ = $0.1 \\times 0.05 = 5 \\times 10^{-3}$ mol\n\n**Step 2 — After neutralisation:**\n$$\\mathrm{CH_3COOH + NaOH \\rightarrow CH_3COONa + H_2O}$$\n$\\mathrm{CH_3COOH}$ remaining = $5 \\times 10^{-3} - 2 \\times 10^{-3} = 3 \\times 10^{-3}$ mol\n$\\mathrm{CH_3COONa}$ formed = $2 \\times 10^{-3}$ mol\n\n**Step 3 — Henderson-Hasselbalch:**\n$$\\mathrm{pH} = \\mathrm{pK_a} + \\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]} = 4.76 + \\log\\frac{2}{3}$$\n$$= 4.76 + \\log 2 - \\log 3 = 4.76 + 0.30 - 0.48 = 4.58$$\n\nExpressed as $x \\times 10^{-2}$: $4.58 = 458 \\times 10^{-2}$\n\n**Answer: 458**`,
'tag_ionic_eq_1', src(2023,'Apr',13,'Evening')),

mkNVT('IEQ-074','Hard',
`A litre of buffer solution contains 0.1 mole each of $\\mathrm{NH_3}$ and $\\mathrm{NH_4Cl}$. On the addition of 0.02 mole of HCl by dissolving gaseous HCl, the pH of the solution is found to be $\\_\\_\\_\\_ \\times 10^{-3}$ (Nearest integer)\n\n$[\\mathrm{pK_b(NH_3)} = 4.745,\\ \\log 2 = 0.301,\\ \\log 3 = 0.477,\\ T = 298\\ \\mathrm{K}]$`,
{ integer_value: 9079 },
`**Step 1 — After adding HCl:**\nHCl reacts with $\\mathrm{NH_3}$:\n$$\\mathrm{NH_3 + HCl \\rightarrow NH_4Cl}$$\n$\\mathrm{NH_3}$ remaining = $0.1 - 0.02 = 0.08$ mol\n$\\mathrm{NH_4Cl}$ = $0.1 + 0.02 = 0.12$ mol\n\n**Step 2 — pOH using Henderson-Hasselbalch:**\n$$\\mathrm{pOH} = \\mathrm{pK_b} + \\log\\frac{[\\mathrm{NH_4^+}]}{[\\mathrm{NH_3}]} = 4.745 + \\log\\frac{0.12}{0.08}$$\n$$= 4.745 + \\log 1.5 = 4.745 + \\log\\frac{3}{2}$$\n$$= 4.745 + \\log 3 - \\log 2 = 4.745 + 0.477 - 0.301 = 4.921$$\n\n**Step 3 — pH:**\n$$\\mathrm{pH} = 14 - 4.921 = 9.079$$\n\nExpressed as $x \\times 10^{-3}$: $9.079 = 9079 \\times 10^{-3}$\n\n**Answer: 9079**`,
'tag_ionic_eq_1', src(2023,'Jan',25,'Morning')),

mkSCQ('IEQ-075','Medium',
`Class XII students were asked to prepare one litre of buffer solution of pH 8.26 by their chemistry teacher. The amount of ammonium chloride to be dissolved by the student in 0.2 M ammonia solution to make one litre of the buffer is:\n\n$[\\mathrm{pK_b(NH_3)} = 4.74;\\ M(\\mathrm{NH_3}) = 17\\ \\mathrm{g\\ mol^{-1}};\\ M(\\mathrm{NH_4Cl}) = 53.5\\ \\mathrm{g\\ mol^{-1}}]$`,
['53.5 g','72.3 g','107 g','126 g'],
'c',
`**Step 1 — Find pOH:**\n$$\\mathrm{pOH} = 14 - 8.26 = 5.74$$\n\n**Step 2 — Henderson-Hasselbalch for base:**\n$$\\mathrm{pOH} = \\mathrm{pK_b} + \\log\\frac{[\\mathrm{NH_4^+}]}{[\\mathrm{NH_3}]}$$\n$$5.74 = 4.74 + \\log\\frac{[\\mathrm{NH_4Cl}]}{0.2}$$\n$$\\log\\frac{[\\mathrm{NH_4Cl}]}{0.2} = 1.00$$\n$$\\frac{[\\mathrm{NH_4Cl}]}{0.2} = 10$$\n$$[\\mathrm{NH_4Cl}] = 2.0\\ \\mathrm{M}$$\n\n**Step 3 — Mass of $\\mathrm{NH_4Cl}$ in 1 L:**\n$$m = 2.0\\ \\mathrm{mol} \\times 53.5\\ \\mathrm{g\\ mol^{-1}} = 107\\ \\mathrm{g}$$\n\n**Answer: Option (3) — 107 g**`,
'tag_ionic_eq_1', src(2022,'Jul',26,'Evening')),

mkSCQ('IEQ-076','Medium',
`A student needs to prepare a buffer solution of propanoic acid and its sodium salt with pH 4. The ratio $\\dfrac{[\\mathrm{CH_3CH_2COO^-}]}{[\\mathrm{CH_3CH_2COOH}]}$ required to make the buffer is:\n\n$[K_a(\\mathrm{CH_3CH_2COOH}) = 1.3 \\times 10^{-5}]$`,
['0.03','0.13','0.23','0.33'],
'b',
`**Step 1 — Henderson-Hasselbalch equation:**\n$$\\mathrm{pH} = \\mathrm{pK_a} + \\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]}$$\n\n**Step 2 — Calculate $\\mathrm{pK_a}$:**\n$$\\mathrm{pK_a} = -\\log(1.3 \\times 10^{-5}) = 5 - \\log 1.3 \\approx 5 - 0.114 = 4.886$$\n\n**Step 3 — Solve for ratio:**\n$$4 = 4.886 + \\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]}$$\n$$\\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]} = 4 - 4.886 = -0.886$$\n$$\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]} = 10^{-0.886} \\approx 0.13$$\n\n**Answer: Option (2) — 0.13**`,
'tag_ionic_eq_1', src(2022,'Jun',28,'Evening')),

mkNVT('IEQ-077','Medium',
`In order to prepare a buffer solution of pH 5.74, sodium acetate is added to acetic acid. If the concentration of acetic acid in the buffer is 1.0 M, the concentration of sodium acetate in the buffer is $\\_\\_\\_\\_ $ M. (Round off to Nearest Integer)\n\n$[\\mathrm{pK_a(acetic\\ acid)} = 4.74]$`,
{ integer_value: 10 },
`**Step 1 — Henderson-Hasselbalch equation:**\n$$\\mathrm{pH} = \\mathrm{pK_a} + \\log\\frac{[\\mathrm{CH_3COONa}]}{[\\mathrm{CH_3COOH}]}$$\n\n**Step 2 — Substitute values:**\n$$5.74 = 4.74 + \\log\\frac{[\\mathrm{CH_3COONa}]}{1.0}$$\n$$\\log[\\mathrm{CH_3COONa}] = 5.74 - 4.74 = 1.00$$\n$$[\\mathrm{CH_3COONa}] = 10^1 = 10\\ \\mathrm{M}$$\n\n**Answer: 10 M**`,
'tag_ionic_eq_1', src(2021,'Mar',18,'Morning')),

mkNVT('IEQ-078','Hard',
`The solubility product of $\\mathrm{PbI_2}$ is $8.0 \\times 10^{-9}$. The solubility of lead iodide in 0.1 molar solution of lead nitrate is $x \\times 10^{-6}\\ \\mathrm{mol/L}$. The value of x is ____ (Rounded off to nearest integer)\n\n$[\\sqrt{2} = 1.41]$`,
{ integer_value: 141 },
`**Step 1 — Dissociation of $\\mathrm{PbI_2}$:**\n$$\\mathrm{PbI_2 \\rightleftharpoons Pb^{2+} + 2I^-}$$\n$$K_{sp} = [\\mathrm{Pb^{2+}}][\\mathrm{I^-}]^2 = 8.0 \\times 10^{-9}$$\n\n**Step 2 — Common ion effect** ($[\\mathrm{Pb^{2+}}]_{initial} = 0.1$ M from $\\mathrm{Pb(NO_3)_2}$):\nLet solubility = $s$ mol/L (assume $s \\ll 0.1$)\n$$[\\mathrm{Pb^{2+}}] = 0.1 + s \\approx 0.1\\ \\mathrm{M}$$\n$$[\\mathrm{I^-}] = 2s$$\n\n**Step 3 — Solve for s:**\n$$K_{sp} = (0.1)(2s)^2 = 0.1 \\times 4s^2 = 0.4s^2 = 8.0 \\times 10^{-9}$$\n$$s^2 = \\frac{8.0 \\times 10^{-9}}{0.4} = 2.0 \\times 10^{-8}$$\n$$s = \\sqrt{2.0 \\times 10^{-8}} = \\sqrt{2} \\times 10^{-4} = 1.41 \\times 10^{-4}\\ \\mathrm{mol/L}$$\n\nExpressed as $x \\times 10^{-6}$: $s = 141 \\times 10^{-6}$, so $x = 141$\n\n**Answer: 141**`,
'tag_ionic_eq_3', src(2021,'Feb',24,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (IEQ-071 to IEQ-078)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
