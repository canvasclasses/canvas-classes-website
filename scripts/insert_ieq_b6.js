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

mkNVT('IEQ-051','Hard',
`The solubility product of $\\mathrm{BaSO_4}$ is $1 \\times 10^{-10}$ at 298 K. The solubility of $\\mathrm{BaSO_4}$ in 0.1 M $\\mathrm{K_2SO_4}$(aq) solution is $\\_\\_\\_\\_ \\times 10^{-9}\\ \\mathrm{g\\ L^{-1}}$ (nearest integer).\n\n(Molar mass of $\\mathrm{BaSO_4} = 233\\ \\mathrm{g\\ mol^{-1}}$)`,
{ integer_value: 233 },
`**Step 1 — Common ion effect:**\n$\\mathrm{K_2SO_4}$ provides $[\\mathrm{SO_4^{2-}}] = 0.1$ M (common ion)\n\n**Step 2 — Solubility of $\\mathrm{BaSO_4}$:**\n$$\\mathrm{BaSO_4 \\rightleftharpoons Ba^{2+} + SO_4^{2-}}$$\nLet solubility = $s$ mol/L\n$$K_{sp} = [\\mathrm{Ba^{2+}}][\\mathrm{SO_4^{2-}}] = s(0.1 + s) \\approx s \\times 0.1 = 10^{-10}$$\n$$s = \\frac{10^{-10}}{0.1} = 10^{-9}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Step 3 — Convert to g/L:**\n$$s = 10^{-9} \\times 233 = 233 \\times 10^{-9}\\ \\mathrm{g\\ L^{-1}}$$\n\nExpressed as $x \\times 10^{-9}$: $x = 233$\n\n**Answer: 233**`,
'tag_ionic_eq_3', src(2023,'Apr',8,'Evening')),

mkNVT('IEQ-052','Hard',
`25.0 mL of 0.050 M $\\mathrm{Ba(NO_3)_2}$ is mixed with 25.0 mL of 0.020 M NaF. $K_{sp}$ of $\\mathrm{BaF_2}$ is $0.5 \\times 10^{-6}$ at 298 K. The ratio of $[\\mathrm{Ba^{2+}}][\\mathrm{F^-}]^2$ and $K_{sp}$ is ____`,
{ integer_value: 5 },
`**Step 1 — Concentrations after mixing** (total volume = 50 mL):\n$$[\\mathrm{Ba^{2+}}] = \\frac{0.050 \\times 25}{50} = 0.025\\ \\mathrm{M}$$\n$$[\\mathrm{F^-}] = \\frac{0.020 \\times 25}{50} = 0.010\\ \\mathrm{M}$$\n\n**Step 2 — Calculate $Q_{sp}$:**\n$$Q_{sp} = [\\mathrm{Ba^{2+}}][\\mathrm{F^-}]^2 = 0.025 \\times (0.010)^2 = 0.025 \\times 10^{-4} = 2.5 \\times 10^{-6}$$\n\n**Step 3 — Ratio:**\n$$\\frac{Q_{sp}}{K_{sp}} = \\frac{2.5 \\times 10^{-6}}{0.5 \\times 10^{-6}} = 5$$\n\nSince $Q_{sp} > K_{sp}$, precipitation occurs.\n\n**Answer: 5**`,
'tag_ionic_eq_3', src(2023,'Apr',13,'Morning')),

mkNVT('IEQ-053','Hard',
`At 298 K, the solubility of silver chloride in water is $1.434 \\times 10^{-3}\\ \\mathrm{g\\ L^{-1}}$. The value of $-\\log K_{sp}$ for silver chloride is ____\n\n(Molar mass: Ag = 107.9, Cl = 35.5 g/mol)`,
{ integer_value: 10 },
`**Step 1 — Molar mass of AgCl:**\n$$M_{\\mathrm{AgCl}} = 107.9 + 35.5 = 143.4\\ \\mathrm{g\\ mol^{-1}}$$\n\n**Step 2 — Molar solubility:**\n$$s = \\frac{1.434 \\times 10^{-3}}{143.4} = 10^{-5}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Step 3 — $K_{sp}$:**\n$$\\mathrm{AgCl \\rightleftharpoons Ag^+ + Cl^-}$$\n$$K_{sp} = s^2 = (10^{-5})^2 = 10^{-10}$$\n\n**Step 4:**\n$$-\\log K_{sp} = -\\log(10^{-10}) = 10$$\n\n**Answer: 10**`,
'tag_ionic_eq_3', src(2023,'Jan',31,'Evening')),

mkSCQ('IEQ-054','Easy',
`The solubility of AgCl will be maximum in which of the following?`,
['0.01 M HCl','0.01 M KCl','Deionised water','0.01 M $\\mathrm{AgNO_3}$'],
'c',
`**Common ion effect:** Adding a common ion ($\\mathrm{Ag^+}$ or $\\mathrm{Cl^-}$) decreases the solubility of AgCl.\n\n**Step 1 — Analyse each option:**\n\n**(1) 0.01 M HCl:** Provides $\\mathrm{Cl^-}$ (common ion) → suppresses dissolution → low solubility ✗\n\n**(2) 0.01 M KCl:** Provides $\\mathrm{Cl^-}$ (common ion) → suppresses dissolution → low solubility ✗\n\n**(3) Deionised water:** No common ions → maximum solubility ✓\n\n**(4) 0.01 M $\\mathrm{AgNO_3}$:** Provides $\\mathrm{Ag^+}$ (common ion) → suppresses dissolution → low solubility ✗\n\n**Answer: Option (3) — Deionised water**`,
'tag_ionic_eq_3', src(2022,'Jun',29,'Morning')),

mkNVT('IEQ-055','Hard',
`$\\mathrm{A_3B_2}$ is a sparingly soluble salt of molar mass M (g/mol) and solubility x g/L. The solubility product satisfies $K_{sp} = a\\left(\\dfrac{x}{M}\\right)^5$. The value of a is ____ (Integer answer)`,
{ integer_value: 108 },
`**Step 1 — Dissociation of $\\mathrm{A_3B_2}$:**\n$$\\mathrm{A_3B_2 \\rightleftharpoons 3A^{2+} + 2B^{3-}}$$\n\nMolar solubility $s = x/M$ mol/L\n$$[\\mathrm{A^{2+}}] = 3s, \\quad [\\mathrm{B^{3-}}] = 2s$$\n\n**Step 2 — Write $K_{sp}$:**\n$$K_{sp} = [\\mathrm{A^{2+}}]^3[\\mathrm{B^{3-}}]^2 = (3s)^3(2s)^2 = 27s^3 \\times 4s^2 = 108s^5$$\n\n**Step 3 — Substitute $s = x/M$:**\n$$K_{sp} = 108\\left(\\frac{x}{M}\\right)^5$$\n\nSo $a = 108$\n\n**Answer: 108**`,
'tag_ionic_eq_3', src(2021,'Aug',31,'Morning')),

mkNVT('IEQ-056','Hard',
`The molar solubility of $\\mathrm{Zn(OH)_2}$ in 0.1 M NaOH solution is $x \\times 10^{-18}$ M. The value of x is ____ (Nearest integer)\n\n$[K_{sp}(\\mathrm{Zn(OH)_2}) = 2 \\times 10^{-20}]$`,
{ integer_value: 2 },
`**Step 1 — Common ion effect:**\nNaOH provides $[\\mathrm{OH^-}] = 0.1$ M\n\n**Step 2 — Dissociation of $\\mathrm{Zn(OH)_2}$:**\n$$\\mathrm{Zn(OH)_2 \\rightleftharpoons Zn^{2+} + 2OH^-}$$\nLet solubility = $s$ mol/L\n$$K_{sp} = [\\mathrm{Zn^{2+}}][\\mathrm{OH^-}]^2 = s(0.1 + 2s)^2 \\approx s(0.1)^2$$\n\n**Step 3 — Solve for s:**\n$$s = \\frac{K_{sp}}{(0.1)^2} = \\frac{2 \\times 10^{-20}}{0.01} = 2 \\times 10^{-18}\\ \\mathrm{M}$$\n\nExpressed as $x \\times 10^{-18}$: $x = 2$\n\n**Answer: 2**`,
'tag_ionic_eq_3', src(2021,'Sep',1,'Evening')),

mkSCQ('IEQ-057','Hard',
`A solution is 0.1 M in $\\mathrm{Cl^-}$ and 0.001 M in $\\mathrm{CrO_4^{2-}}$. Solid $\\mathrm{AgNO_3}$ is gradually added to it.\n\n$[K_{sp}(\\mathrm{AgCl}) = 1.7 \\times 10^{-10}\\ \\mathrm{M^2};\\ K_{sp}(\\mathrm{Ag_2CrO_4}) = 1.9 \\times 10^{-12}\\ \\mathrm{M^3}]$\n\nSelect the correct statement:`,
['AgCl precipitates first because its $K_{sp}$ is high','$\\mathrm{Ag_2CrO_4}$ precipitates first as its $K_{sp}$ is low','$\\mathrm{Ag_2CrO_4}$ precipitates first because the amount of $\\mathrm{Ag^+}$ needed is low','AgCl will precipitate first as the amount of $\\mathrm{Ag^+}$ needed to precipitate is low'],
'd',
`**Step 1 — Find $[\\mathrm{Ag^+}]$ needed to start precipitation of each:**\n\n**For AgCl:**\n$$[\\mathrm{Ag^+}] = \\frac{K_{sp}(\\mathrm{AgCl})}{[\\mathrm{Cl^-}]} = \\frac{1.7 \\times 10^{-10}}{0.1} = 1.7 \\times 10^{-9}\\ \\mathrm{M}$$\n\n**For $\\mathrm{Ag_2CrO_4}$:**\n$$[\\mathrm{Ag^+}]^2 = \\frac{K_{sp}(\\mathrm{Ag_2CrO_4})}{[\\mathrm{CrO_4^{2-}}]} = \\frac{1.9 \\times 10^{-12}}{0.001} = 1.9 \\times 10^{-9}$$\n$$[\\mathrm{Ag^+}] = \\sqrt{1.9 \\times 10^{-9}} \\approx 4.36 \\times 10^{-5}\\ \\mathrm{M}$$\n\n**Step 2 — Compare:**\n- AgCl needs $[\\mathrm{Ag^+}] = 1.7 \\times 10^{-9}$ M (much smaller)\n- $\\mathrm{Ag_2CrO_4}$ needs $[\\mathrm{Ag^+}] = 4.36 \\times 10^{-5}$ M (larger)\n\n**AgCl precipitates first** (needs less $\\mathrm{Ag^+}$)\n\n**Answer: Option (4) — AgCl precipitates first**`,
'tag_ionic_eq_3', src(2021,'Jul',20,'Evening')),

mkNVT('IEQ-058','Hard',
`Two salts $\\mathrm{A_2X}$ and MX have the same value of solubility product of $4.0 \\times 10^{-12}$. The ratio of their molar solubilities $\\dfrac{S(\\mathrm{A_2X})}{S(\\mathrm{MX})}$ is ____ (Round off to Nearest Integer)`,
{ integer_value: 50 },
`**Step 1 — Solubility of $\\mathrm{A_2X}$:**\n$$\\mathrm{A_2X \\rightleftharpoons 2A^+ + X^{2-}}$$\n$$K_{sp} = (2s_1)^2(s_1) = 4s_1^3 = 4.0 \\times 10^{-12}$$\n$$s_1^3 = 10^{-12} \\Rightarrow s_1 = 10^{-4}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Step 2 — Solubility of MX:**\n$$\\mathrm{MX \\rightleftharpoons M^+ + X^-}$$\n$$K_{sp} = s_2^2 = 4.0 \\times 10^{-12}$$\n$$s_2 = \\sqrt{4.0 \\times 10^{-12}} = 2 \\times 10^{-6}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Step 3 — Ratio:**\n$$\\frac{S(\\mathrm{A_2X})}{S(\\mathrm{MX})} = \\frac{10^{-4}}{2 \\times 10^{-6}} = \\frac{10^{-4}}{2 \\times 10^{-6}} = 50$$\n\n**Answer: 50**`,
'tag_ionic_eq_3', src(2021,'Mar',16,'Morning')),

mkNVT('IEQ-059','Hard',
`The solubility of $\\mathrm{CdSO_4}$ in water is $8.0 \\times 10^{-4}\\ \\mathrm{mol\\ L^{-1}}$. Its solubility in 0.01 M $\\mathrm{H_2SO_4}$ solution is $\\_\\_\\_\\_ \\times 10^{-6}\\ \\mathrm{mol\\ L^{-1}}$ (Round off to Nearest Integer)\n\n(Assume that solubility is much less than 0.01 M)`,
{ integer_value: 64 },
`**Step 1 — Find $K_{sp}$ of $\\mathrm{CdSO_4}$:**\n$$\\mathrm{CdSO_4 \\rightleftharpoons Cd^{2+} + SO_4^{2-}}$$\n$$K_{sp} = s^2 = (8.0 \\times 10^{-4})^2 = 6.4 \\times 10^{-7}$$\n\n**Step 2 — Solubility in 0.01 M $\\mathrm{H_2SO_4}$:**\n$\\mathrm{H_2SO_4}$ provides $[\\mathrm{SO_4^{2-}}] = 0.01$ M (common ion)\n\nLet solubility = $s'$ mol/L (assume $s' \\ll 0.01$):\n$$K_{sp} = s'(0.01 + s') \\approx s' \\times 0.01$$\n$$s' = \\frac{K_{sp}}{0.01} = \\frac{6.4 \\times 10^{-7}}{0.01} = 6.4 \\times 10^{-5}\\ \\mathrm{mol\\ L^{-1}}$$\n\nExpressed as $x \\times 10^{-6}$: $s' = 64 \\times 10^{-6}$, so $x = 64$\n\n**Answer: 64**`,
'tag_ionic_eq_3', src(2021,'Mar',18,'Evening')),

mkSCQ('IEQ-060','Hard',
`The solubility of AgCN in a buffer solution of pH = 3 is x. The value of x is:\n\n$[K_{sp}(\\mathrm{AgCN}) = 2.2 \\times 10^{-16};\\ K_a(\\mathrm{HCN}) = 6.2 \\times 10^{-10}]$`,
['$1.9 \\times 10^{-5}$','$2.2 \\times 10^{-16}$','$0.625 \\times 10^{-6}$','$1.6 \\times 10^{-6}$'],
'a',
`**Step 1 — Dissolution and protonation:**\n$$\\mathrm{AgCN \\rightleftharpoons Ag^+ + CN^-}; \\quad K_{sp} = 2.2 \\times 10^{-16}$$\n$$\\mathrm{CN^- + H^+ \\rightleftharpoons HCN}; \\quad K = \\frac{1}{K_a} = \\frac{1}{6.2 \\times 10^{-10}}$$\n\n**Step 2 — Net reaction:**\n$$\\mathrm{AgCN + H^+ \\rightleftharpoons Ag^+ + HCN}$$\n$$K_{net} = \\frac{K_{sp}}{K_a} = \\frac{2.2 \\times 10^{-16}}{6.2 \\times 10^{-10}} = 3.55 \\times 10^{-7}$$\n\n**Step 3 — At pH = 3:**\n$$[\\mathrm{H^+}] = 10^{-3}\\ \\mathrm{M}$$\n\nLet solubility = $s$: $[\\mathrm{Ag^+}] = s$, $[\\mathrm{HCN}] = s$\n$$K_{net} = \\frac{s^2}{[\\mathrm{H^+}]} = \\frac{s^2}{10^{-3}} = 3.55 \\times 10^{-7}$$\n$$s^2 = 3.55 \\times 10^{-10}$$\n$$s = \\sqrt{3.55 \\times 10^{-10}} \\approx 1.88 \\times 10^{-5} \\approx 1.9 \\times 10^{-5}\\ \\mathrm{M}$$\n\n**Answer: Option (1) — $1.9 \\times 10^{-5}$**`,
'tag_ionic_eq_3', src(2021,'Feb',25,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (IEQ-051 to IEQ-060)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
