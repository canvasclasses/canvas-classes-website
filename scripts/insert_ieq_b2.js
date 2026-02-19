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

mkSCQ('IEQ-011','Medium',
`**Assertion:** The amphoteric behaviour of water is explained by Lewis acid-base theory.\n\n**Reason:** Water acts as acid with $\\mathrm{NH_3}$ and base with $\\mathrm{H_2S}$.\n\nChoose the correct option:`,
['Both Assertion and Reason are true and Reason is the correct explanation of Assertion','Both Assertion and Reason are true but Reason is NOT the correct explanation of Assertion','Assertion is true but Reason is false','Assertion is false but Reason is true'],
'd',
`**Step 1 — Evaluate Assertion:**\nThe amphoteric behaviour of water is explained by **Bronsted-Lowry** theory (proton donor/acceptor), NOT Lewis acid-base theory. Lewis theory deals with electron pair donation/acceptance.\n**Assertion is FALSE** ✗\n\n**Step 2 — Evaluate Reason:**\n- Water + $\\mathrm{NH_3}$: $\\mathrm{H_2O + NH_3 \\rightleftharpoons OH^- + NH_4^+}$ → water donates $\\mathrm{H^+}$ → acts as **acid** ✓\n- Water + $\\mathrm{H_2S}$: $\\mathrm{H_2O + H_2S \\rightleftharpoons H_3O^+ + HS^-}$ → water accepts $\\mathrm{H^+}$ → acts as **base** ✓\n**Reason is TRUE** ✓\n\n**Answer: Option (4) — Assertion false, Reason true**`,
'tag_ionic_eq_7', src(2022,'Jun',25,'Evening')),

mkNVT('IEQ-012','Easy',
`The pH value of 0.001 M NaOH solution is ____`,
{ integer_value: 11 },
`**Step 1 — NaOH is a strong base (fully dissociates):**\n$$[\\mathrm{OH^-}] = 0.001\\ \\mathrm{M} = 10^{-3}\\ \\mathrm{M}$$\n\n**Step 2 — Calculate pOH:**\n$$\\mathrm{pOH} = -\\log[\\mathrm{OH^-}] = -\\log(10^{-3}) = 3$$\n\n**Step 3 — Calculate pH:**\n$$\\mathrm{pH} = 14 - \\mathrm{pOH} = 14 - 3 = 11$$\n\n**Answer: 11**`,
'tag_ionic_eq_6', src(2022,'Jun',27,'Evening')),

mkSCQ('IEQ-013','Easy',
`An acidic buffer is obtained on mixing:`,
['100 mL of 0.1 M $\\mathrm{CH_3COOH}$ and 100 mL of 0.1 M NaOH','100 mL of 0.1 M HCl and 200 mL of 0.1 M NaCl','100 mL of 0.1 M $\\mathrm{CH_3COOH}$ and 200 mL of 0.1 M NaOH','100 mL of 0.1 M HCl and 200 mL of 0.1 M $\\mathrm{CH_3COONa}$'],
'd',
`**Acidic buffer** = weak acid + its conjugate base (salt), with pH < 7.\n\n**Step 1 — Analyse each option:**\n\n**(1) 100 mL 0.1M $\\mathrm{CH_3COOH}$ + 100 mL 0.1M NaOH:**\nMoles: acid = 0.01, base = 0.01 → complete neutralisation → only $\\mathrm{CH_3COONa}$ (basic salt solution, not a buffer) ✗\n\n**(2) 100 mL 0.1M HCl + 200 mL 0.1M NaCl:**\nHCl is strong acid, NaCl is neutral salt → not a buffer ✗\n\n**(3) 100 mL 0.1M $\\mathrm{CH_3COOH}$ + 200 mL 0.1M NaOH:**\nMoles: acid = 0.01, base = 0.02 → NaOH in excess → basic solution ✗\n\n**(4) 100 mL 0.1M HCl + 200 mL 0.1M $\\mathrm{CH_3COONa}$:**\nMoles: HCl = 0.01, $\\mathrm{CH_3COONa}$ = 0.02\nHCl reacts with $\\mathrm{CH_3COONa}$: $\\mathrm{HCl + CH_3COONa \\rightarrow CH_3COOH + NaCl}$\nAfter reaction: $\\mathrm{CH_3COOH}$ = 0.01 mol, $\\mathrm{CH_3COONa}$ = 0.01 mol → **acidic buffer** ✓\n\n**Answer: Option (4)**`,
'tag_ionic_eq_1', src(2020,'Sep',3,'Morning')),

mkNVT('IEQ-014','Hard',
`At 310 K, the solubility of $\\mathrm{CaF_2}$ in water is $2.34 \\times 10^{-3}\\ \\mathrm{g/100\\ mL}$. The solubility product of $\\mathrm{CaF_2}$ is $\\_\\_\\_\\_ \\times 10^{-8}\\ (\\mathrm{mol/L})^3$ (nearest integer).\n\n(Molar mass: $\\mathrm{CaF_2} = 78\\ \\mathrm{g\\ mol^{-1}}$)`,
{ integer_value: 0 },
`**Step 1 — Convert solubility to mol/L:**\n$$s = \\frac{2.34 \\times 10^{-3}\\ \\mathrm{g}}{100\\ \\mathrm{mL}} = \\frac{2.34 \\times 10^{-3}\\ \\mathrm{g}}{0.1\\ \\mathrm{L}} = 2.34 \\times 10^{-2}\\ \\mathrm{g\\ L^{-1}}$$\n$$s = \\frac{2.34 \\times 10^{-2}}{78} = 3 \\times 10^{-4}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Step 2 — Dissociation of $\\mathrm{CaF_2}$:**\n$$\\mathrm{CaF_2 \\rightleftharpoons Ca^{2+} + 2F^-}$$\n$$[\\mathrm{Ca^{2+}}] = s = 3 \\times 10^{-4}\\ \\mathrm{M}, \\quad [\\mathrm{F^-}] = 2s = 6 \\times 10^{-4}\\ \\mathrm{M}$$\n\n**Step 3 — $K_{sp}$:**\n$$K_{sp} = [\\mathrm{Ca^{2+}}][\\mathrm{F^-}]^2 = (3 \\times 10^{-4})(6 \\times 10^{-4})^2$$\n$$= 3 \\times 10^{-4} \\times 36 \\times 10^{-8} = 108 \\times 10^{-12} = 1.08 \\times 10^{-10}$$\n\nExpressed as $x \\times 10^{-8}$: $x = 0.0108 \\approx 0$\n\nJEE answer: 0 (nearest integer)\n\n**Answer: 0**`,
'tag_ionic_eq_3', src(2022,'Jul',27,'Morning')),

mkNVT('IEQ-015','Medium',
`If the solubility product of PbS is $8 \\times 10^{-28}$, then the solubility of PbS in pure water at 298 K is $x \\times 10^{-16}\\ \\mathrm{mol\\ L^{-1}}$. The value of x is ____ (Nearest integer)\n\n$[\\sqrt{2} = 1.41]$`,
{ integer_value: 282 },
`**Step 1 — Dissociation of PbS:**\n$$\\mathrm{PbS \\rightleftharpoons Pb^{2+} + S^{2-}}$$\n$$K_{sp} = s^2 = 8 \\times 10^{-28}$$\n\n**Step 2 — Solve for s:**\n$$s = \\sqrt{8 \\times 10^{-28}} = \\sqrt{8} \\times 10^{-14} = 2\\sqrt{2} \\times 10^{-14}$$\n$$= 2 \\times 1.41 \\times 10^{-14} = 2.82 \\times 10^{-14}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Step 3 — Express as $x \\times 10^{-16}$:**\n$$s = 2.82 \\times 10^{-14} = 282 \\times 10^{-16}$$\n\n**Answer: 282**`,
'tag_ionic_eq_3', src(2022,'Jul',29,'Morning')),

mkSCQ('IEQ-016','Medium',
`The $K_{sp}$ for bismuth sulphide ($\\mathrm{Bi_2S_3}$) is $1.08 \\times 10^{-73}$. The solubility of $\\mathrm{Bi_2S_3}$ in $\\mathrm{mol\\ L^{-1}}$ at 298 K is`,
['$1.0 \\times 10^{-15}$','$2.7 \\times 10^{-12}$','$3.2 \\times 10^{-10}$','$4.2 \\times 10^{-8}$'],
'a',
`**Step 1 — Dissociation of $\\mathrm{Bi_2S_3}$:**\n$$\\mathrm{Bi_2S_3 \\rightleftharpoons 2Bi^{3+} + 3S^{2-}}$$\n$$[\\mathrm{Bi^{3+}}] = 2s, \\quad [\\mathrm{S^{2-}}] = 3s$$\n\n**Step 2 — Write $K_{sp}$:**\n$$K_{sp} = (2s)^2(3s)^3 = 4s^2 \\cdot 27s^3 = 108s^5$$\n\n**Step 3 — Solve for s:**\n$$s^5 = \\frac{1.08 \\times 10^{-73}}{108} = 10^{-75}$$\n$$s = (10^{-75})^{1/5} = 10^{-15}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Answer: Option (1) — $1.0 \\times 10^{-15}$**`,
'tag_ionic_eq_3', src(2022,'Jun',25,'Evening')),

mkSCQ('IEQ-017','Medium',
`The solubility of $\\mathrm{Ca(OH)_2}$ in water is:\n\n$[K_{sp}$ of $\\mathrm{Ca(OH)_2} = 5.5 \\times 10^{-6}]$`,
['$1.77 \\times 10^{-2}$','$1.77 \\times 10^{-6}$','$1.11 \\times 10^{-2}$','$1.11 \\times 10^{-6}$'],
'c',
`**Step 1 — Dissociation of $\\mathrm{Ca(OH)_2}$:**\n$$\\mathrm{Ca(OH)_2 \\rightleftharpoons Ca^{2+} + 2OH^-}$$\n$$[\\mathrm{Ca^{2+}}] = s, \\quad [\\mathrm{OH^-}] = 2s$$\n\n**Step 2 — Write $K_{sp}$:**\n$$K_{sp} = s(2s)^2 = 4s^3 = 5.5 \\times 10^{-6}$$\n\n**Step 3 — Solve for s:**\n$$s^3 = \\frac{5.5 \\times 10^{-6}}{4} = 1.375 \\times 10^{-6}$$\n$$s = (1.375 \\times 10^{-6})^{1/3} = (13.75 \\times 10^{-7})^{1/3}$$\n$$\\approx 2.4 \\times 10^{-7^{1/3}} \\approx 1.11 \\times 10^{-2}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Answer: Option (3) — $1.11 \\times 10^{-2}$**`,
'tag_ionic_eq_3', src(2021,'Feb',25,'Evening')),

mkSCQ('IEQ-018','Hard',
`If solubility product of $\\mathrm{Zr_3(PO_4)_4}$ is denoted by $K_{sp}$ and its molar solubility is denoted by S, then which of the following relations between S and $K_{sp}$ is correct?`,
['$S = \\left(\\dfrac{K_{sp}}{144}\\right)^{1/6}$','$S = \\left(\\dfrac{K_{sp}}{6912}\\right)^{1/7}$','$S = \\left(\\dfrac{K_{sp}}{929}\\right)^{1/9}$','$S = \\left(\\dfrac{K_{sp}}{216}\\right)^{1/7}$'],
'b',
`**Step 1 — Dissociation of $\\mathrm{Zr_3(PO_4)_4}$:**\n$$\\mathrm{Zr_3(PO_4)_4 \\rightleftharpoons 3Zr^{4+} + 4PO_4^{3-}}$$\n$$[\\mathrm{Zr^{4+}}] = 3S, \\quad [\\mathrm{PO_4^{3-}}] = 4S$$\n\n**Step 2 — Write $K_{sp}$:**\n$$K_{sp} = (3S)^3(4S)^4 = 27S^3 \\cdot 256S^4 = 6912S^7$$\n\n**Step 3 — Solve for S:**\n$$S^7 = \\frac{K_{sp}}{6912} \\Rightarrow S = \\left(\\frac{K_{sp}}{6912}\\right)^{1/7}$$\n\n**Answer: Option (2)**`,
'tag_ionic_eq_3', src(2019,'Apr',8,'Morning')),

mkSCQ('IEQ-019','Hard',
`Which of the following is the strongest Bronsted base?`,
['Aniline ($\\mathrm{C_6H_5NH_2}$)','Diphenylamine ($(\\mathrm{C_6H_5})_2NH$)','Pyrrole','Pyrrolidine (cyclic secondary amine)'],
'd',
`**Bronsted base strength** = ability to accept a proton = availability of lone pair on N.\n\n**Step 1 — Analyse each compound:**\n\n**(1) Aniline ($\\mathrm{C_6H_5NH_2}$):** Lone pair on N is delocalized into the benzene ring (resonance) → reduced basicity. $\\mathrm{pK_b} \\approx 9.4$\n\n**(2) Diphenylamine ($(\\mathrm{C_6H_5})_2NH$):** Two phenyl groups withdraw lone pair → even weaker base than aniline. $\\mathrm{pK_b} \\approx 13.1$\n\n**(3) Pyrrole:** N lone pair is part of the aromatic $\\pi$ system (6 $\\pi$ electrons) → essentially non-basic. $\\mathrm{pK_b} \\approx 13.6$\n\n**(4) Pyrrolidine (cyclic secondary amine):** No aromatic ring, no resonance withdrawal → lone pair fully available → **strongest base**. $\\mathrm{pK_b} \\approx 2.7$\n\n**Order of basicity:** Pyrrolidine >> Aniline > Diphenylamine > Pyrrole\n\n**Answer: Option (4) — Pyrrolidine**`,
'tag_ionic_eq_7', src(2024,'Jan',27,'Morning')),

mkSCQ('IEQ-020','Medium',
`Given below are two statements:\n\n**Statement (I):** Aqueous solution of ammonium carbonate is basic.\n\n**Statement (II):** Acidic/basic nature of salt solution of a salt of weak acid and weak base depends on $K_a$ and $K_b$ values of acid and the base forming it.\n\nChoose the most appropriate answer:`,
['Both Statement I and Statement II are correct','Statement I is correct but Statement II is incorrect','Both Statement I and Statement II are incorrect','Statement I is incorrect but Statement II is correct'],
'a',
`**Step 1 — Evaluate Statement I:**\n$\\mathrm{(NH_4)_2CO_3}$ is a salt of weak acid ($\\mathrm{H_2CO_3}$, $K_{a1} = 4.3 \\times 10^{-7}$) and weak base ($\\mathrm{NH_4OH}$, $K_b = 1.8 \\times 10^{-5}$).\n\nFor a salt of weak acid + weak base:\n$$\\mathrm{pH} = 7 + \\frac{1}{2}(\\mathrm{pK_a} - \\mathrm{pK_b})$$\n$$\\mathrm{pK_a}(\\mathrm{H_2CO_3}) \\approx 6.37, \\quad \\mathrm{pK_b}(\\mathrm{NH_4OH}) \\approx 4.74$$\n$$\\mathrm{pH} = 7 + \\frac{1}{2}(6.37 - 4.74) = 7 + 0.815 = 7.815 > 7$$\n→ **Basic** ✓ **Statement I is correct**\n\n**Step 2 — Evaluate Statement II:**\nFor a salt of weak acid + weak base, the pH depends on the relative strengths:\n- If $K_a > K_b$: acidic\n- If $K_a < K_b$: basic\n- If $K_a = K_b$: neutral\n**Statement II is correct** ✓\n\n**Answer: Option (1) — Both correct**`,
'tag_ionic_eq_5', src(2024,'Jan',27,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (IEQ-011 to IEQ-020)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
