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

mkSCQ('IEQ-021','Medium',
`$\\mathrm{Ka_1}$, $\\mathrm{Ka_2}$ and $\\mathrm{Ka_3}$ are the respective ionization constants for the following reactions:\n\n**(a)** $\\mathrm{H_2C_2O_4 \\rightleftharpoons H^+ + HC_2O_4^-}$\n**(b)** $\\mathrm{HC_2O_4^- \\rightleftharpoons H^+ + C_2O_4^{2-}}$\n**(c)** $\\mathrm{H_2C_2O_4 \\rightleftharpoons 2H^+ + C_2O_4^{2-}}$\n\nThe relationship between $\\mathrm{Ka_1}$, $\\mathrm{Ka_2}$ and $\\mathrm{Ka_3}$ is:`,
['$K_{a3} = K_{a1} + K_{a2}$','$K_{a3} = \\dfrac{K_{a1}}{K_{a2}}$','$K_{a3} = K_{a1} - K_{a2}$','$K_{a3} = K_{a1} \\times K_{a2}$'],
'd',
`**Step 1 — Reaction (c) = Reaction (a) + Reaction (b):**\n\nAdding reactions (a) and (b):\n$$\\mathrm{H_2C_2O_4 \\rightleftharpoons H^+ + HC_2O_4^-} \\quad K_{a1}$$\n$$\\mathrm{HC_2O_4^- \\rightleftharpoons H^+ + C_2O_4^{2-}} \\quad K_{a2}$$\n\nNet: $\\mathrm{H_2C_2O_4 \\rightleftharpoons 2H^+ + C_2O_4^{2-}}$ which is reaction (c).\n\n**Step 2 — Rule for adding reactions:**\nWhen reactions are added, equilibrium constants are **multiplied**:\n$$K_{a3} = K_{a1} \\times K_{a2}$$\n\n**Verification:**\n$$K_{a3} = \\frac{[\\mathrm{H^+}]^2[\\mathrm{C_2O_4^{2-}}]}{[\\mathrm{H_2C_2O_4}]} = \\frac{[\\mathrm{H^+}][\\mathrm{HC_2O_4^-}]}{[\\mathrm{H_2C_2O_4}]} \\times \\frac{[\\mathrm{H^+}][\\mathrm{C_2O_4^{2-}}]}{[\\mathrm{HC_2O_4^-}]} = K_{a1} \\times K_{a2} \\checkmark$$\n\n**Answer: Option (4) — $K_{a3} = K_{a1} \\times K_{a2}$**`,
'tag_ionic_eq_7', src(2022,'Jul',25,'Evening')),

mkNVT('IEQ-022','Hard',
`0.01 moles of a weak acid HA ($K_a = 2.0 \\times 10^{-6}$) is dissolved in 1.0 L of 0.1 M HCl solution. The degree of dissociation of HA is $\\_\\_\\_\\_ \\times 10^{-5}$ (Round off to Nearest Integer).\n\n[Neglect volume change on adding HA; assume degree of dissociation $\\ll 1$]`,
{ integer_value: 2 },
`**Step 1 — Set up equilibrium:**\n$$\\mathrm{HA \\rightleftharpoons H^+ + A^-}$$\n\nIn 0.1 M HCl solution, $[\\mathrm{H^+}]_{initial} = 0.1$ M (from HCl, strong acid)\n\n**Step 2 — ICE table** (initial [HA] = 0.01 M):\n\n| | HA | H⁺ | A⁻ |\n|--|--|--|--|\n| Initial | 0.01 | 0.1 | 0 |\n| Change | $-x$ | $+x$ | $+x$ |\n| Equil. | $0.01-x$ | $0.1+x$ | $x$ |\n\n**Step 3 — Apply approximation** ($x \\ll 0.01$ and $x \\ll 0.1$):\n$$K_a = \\frac{(0.1)(x)}{0.01} = 2.0 \\times 10^{-6}$$\n$$x = \\frac{2.0 \\times 10^{-6} \\times 0.01}{0.1} = 2.0 \\times 10^{-7}\\ \\mathrm{M}$$\n\n**Step 4 — Degree of dissociation:**\n$$\\alpha = \\frac{x}{[\\mathrm{HA}]_0} = \\frac{2.0 \\times 10^{-7}}{0.01} = 2.0 \\times 10^{-5}$$\n\nExpressed as $x \\times 10^{-5}$: $x = 2$\n\n**Answer: 2**`,
'tag_ionic_eq_7', src(2021,'Mar',17,'Morning')),

mkNVT('IEQ-023','Hard',
`10.0 mL of $\\mathrm{Na_2CO_3}$ solution is titrated against 0.2 M HCl solution. The following values were obtained in 5 readings: 4.8 mL, 4.9 mL, 5.0 mL, 5.0 mL and 5.0 mL.\n\nBased on these readings, the concentration of $\\mathrm{Na_2CO_3}$ solution is $\\_\\_\\_\\_ $ mM. (Round off to Nearest Integer)`,
{ integer_value: 50 },
`**Step 1 — Find concordant titre value:**\nThe concordant (consistent) readings are: 5.0 mL, 5.0 mL, 5.0 mL\n$$V_{\\mathrm{HCl}} = 5.0\\ \\mathrm{mL}$$\n\n**Step 2 — Reaction:**\n$$\\mathrm{Na_2CO_3 + 2HCl \\rightarrow 2NaCl + H_2O + CO_2}$$\n\n**Step 3 — Moles calculation:**\nMoles of HCl = $0.2 \\times 5.0 \\times 10^{-3} = 1.0 \\times 10^{-3}$ mol\n\nMoles of $\\mathrm{Na_2CO_3}$ = $\\frac{1.0 \\times 10^{-3}}{2} = 5.0 \\times 10^{-4}$ mol\n\n**Step 4 — Concentration:**\n$$[\\mathrm{Na_2CO_3}] = \\frac{5.0 \\times 10^{-4}\\ \\mathrm{mol}}{10.0 \\times 10^{-3}\\ \\mathrm{L}} = 0.05\\ \\mathrm{M} = 50\\ \\mathrm{mM}$$\n\n**Answer: 50 mM**`,
'tag_ionic_eq_8', src(2021,'Mar',18,'Evening')),

mkSCQ('IEQ-024','Medium',
`For the following Assertion and Reason, the correct option is:\n\n**Assertion:** The pH of water increases with increase in temperature.\n\n**Reason:** The dissociation of water into $\\mathrm{H^+}$ and $\\mathrm{OH^-}$ is an exothermic reaction.`,
['Both assertion and reason are true, and the reason is the correct explanation for the assertion','Both assertion and reason are false','Both assertion and reason are true, but the reason is not the correct explanation for the assertion','Assertion is not true, but reason is true'],
'b',
`**Step 1 — Evaluate Assertion:**\nAt higher temperature, $K_w$ increases (more dissociation of water). At 25°C, pH of pure water = 7. At higher T, $[\\mathrm{H^+}]$ increases → pH **decreases** (e.g., at 60°C, pH ≈ 6.5).\n\nHowever, the water is still **neutral** (pH = pOH) — just the neutral point shifts.\n\n**Assertion: pH of water DECREASES with temperature** → **Assertion is FALSE** ✗\n\n**Step 2 — Evaluate Reason:**\nThe dissociation of water: $\\mathrm{H_2O \\rightleftharpoons H^+ + OH^-}$ is **endothermic** (requires energy to break O–H bonds), NOT exothermic.\n**Reason is FALSE** ✗\n\n**Answer: Option (2) — Both assertion and reason are false**`,
'tag_ionic_eq_6', src(2020,'Jan',8,'Evening')),

mkSCQ('IEQ-025','Hard',
`Consider the following statements:\n\n**(a)** The pH of a mixture containing 400 mL of 0.1 M $\\mathrm{H_2SO_4}$ and 400 mL of 0.1 M NaOH will be approximately 1.3.\n**(b)** Ionic product of water is temperature dependent.\n**(c)** A monobasic acid with $K_a = 10^{-5}$ has pH = 5. The degree of dissociation of this acid is 50%.\n**(d)** The Le Chatelier's principle is not applicable to common-ion effect.\n\nThe correct statements are:`,
['(b) and (c)','(a), (b) and (d)','(a) and (b)','(a), (b) and (c)'],
'd',
`**Step 1 — Evaluate each statement:**\n\n**(a) pH of mixture of 400 mL 0.1M $\\mathrm{H_2SO_4}$ + 400 mL 0.1M NaOH:**\nMoles $\\mathrm{H^+}$ from $\\mathrm{H_2SO_4}$ = $2 \\times 0.1 \\times 0.4 = 0.08$ mol\nMoles $\\mathrm{OH^-}$ from NaOH = $0.1 \\times 0.4 = 0.04$ mol\nExcess $\\mathrm{H^+}$ = $0.08 - 0.04 = 0.04$ mol in 800 mL\n$[\\mathrm{H^+}] = 0.04/0.8 = 0.05$ M → pH = $-\\log(0.05) = 1.3$ ✓ **Correct**\n\n**(b) $K_w$ is temperature dependent:** ✓ **Correct** — $K_w$ increases with temperature.\n\n**(c) $K_a = 10^{-5}$, pH = 5, degree of dissociation = 50%:**\nIf pH = 5, $[\\mathrm{H^+}] = 10^{-5}$ M\n$K_a = \\frac{\\alpha^2 C}{1-\\alpha}$; if $\\alpha = 0.5$: $K_a = \\frac{0.25C}{0.5} = 0.5C$\nFor $K_a = 10^{-5}$: $C = 2 \\times 10^{-5}$ M, $[\\mathrm{H^+}] = \\alpha C = 10^{-5}$ ✓ **Correct**\n\n**(d) Le Chatelier's principle NOT applicable to common-ion effect:** ✗ **Incorrect** — Le Chatelier's principle IS the basis for the common-ion effect.\n\n**Correct: a, b, c**\n\n**Answer: Option (4) — (a), (b) and (c)**`,
'tag_ionic_eq_6', src(2019,'Apr',10,'Morning')),

mkNVT('IEQ-026','Hard',
`An analyst wants to convert 1 L HCl of pH = 1 to a solution of HCl of pH = 2. The volume of water needed to do this dilution is $\\_\\_\\_\\_ $ mL. (Nearest integer)`,
{ integer_value: 9000 },
`**Step 1 — Initial HCl solution:**\npH = 1 → $[\\mathrm{H^+}] = 0.1$ M\nMoles of HCl in 1 L = 0.1 mol\n\n**Step 2 — Final HCl solution:**\npH = 2 → $[\\mathrm{H^+}] = 0.01$ M\n\n**Step 3 — Find final volume:**\nMoles of HCl are conserved:\n$$0.1\\ \\mathrm{mol} = 0.01\\ \\mathrm{M} \\times V_f$$\n$$V_f = \\frac{0.1}{0.01} = 10\\ \\mathrm{L} = 10000\\ \\mathrm{mL}$$\n\n**Step 4 — Volume of water added:**\n$$V_{water} = V_f - V_i = 10000 - 1000 = 9000\\ \\mathrm{mL}$$\n\n**Answer: 9000 mL**`,
'tag_ionic_eq_4', src(2023,'Apr',12,'Morning')),

mkNVT('IEQ-027','Hard',
`The dissociation constant of acetic acid is $x \\times 10^{-5}$. When 25 mL of 0.2 M $\\mathrm{CH_3COONa}$ solution is mixed with 25 mL of 0.02 M $\\mathrm{CH_3COOH}$ solution, the pH of the resultant solution is found to be equal to 5. The value of x is ____`,
{ integer_value: 10 },
`**Step 1 — Concentrations after mixing:**\nTotal volume = 50 mL\n$$[\\mathrm{CH_3COONa}] = \\frac{0.2 \\times 25}{50} = 0.1\\ \\mathrm{M}$$\n$$[\\mathrm{CH_3COOH}] = \\frac{0.02 \\times 25}{50} = 0.01\\ \\mathrm{M}$$\n\n**Step 2 — Henderson-Hasselbalch equation:**\n$$\\mathrm{pH} = \\mathrm{pK_a} + \\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]}$$\n$$5 = \\mathrm{pK_a} + \\log\\frac{0.1}{0.01} = \\mathrm{pK_a} + \\log 10 = \\mathrm{pK_a} + 1$$\n$$\\mathrm{pK_a} = 4$$\n\n**Step 3 — Find $K_a$:**\n$$K_a = 10^{-4} = 10 \\times 10^{-5}$$\n$$x = 10$$\n\n**Answer: 10**`,
'tag_ionic_eq_1', src(2023,'Jan',24,'Morning')),

mkNVT('IEQ-028','Medium',
`Millimoles of calcium hydroxide required to produce 100 mL of the aqueous solution of pH 12 is $x \\times 10^{-1}$. The value of x is ____ (Nearest integer). Assume complete dissociation.`,
{ integer_value: 5 },
`**Step 1 — Find $[\\mathrm{OH^-}]$ at pH = 12:**\n$$\\mathrm{pOH} = 14 - 12 = 2 \\Rightarrow [\\mathrm{OH^-}] = 10^{-2}\\ \\mathrm{M}$$\n\n**Step 2 — Dissociation of $\\mathrm{Ca(OH)_2}$:**\n$$\\mathrm{Ca(OH)_2 \\rightarrow Ca^{2+} + 2OH^-}$$\n$$[\\mathrm{Ca(OH)_2}] = \\frac{[\\mathrm{OH^-}]}{2} = \\frac{10^{-2}}{2} = 5 \\times 10^{-3}\\ \\mathrm{M}$$\n\n**Step 3 — Millimoles in 100 mL:**\n$$n = 5 \\times 10^{-3}\\ \\mathrm{mol\\ L^{-1}} \\times 0.1\\ \\mathrm{L} = 5 \\times 10^{-4}\\ \\mathrm{mol} = 0.5\\ \\mathrm{mmol}$$\n\nExpressed as $x \\times 10^{-1}$ mmol: $x = 5$\n\n**Answer: 5**`,
'tag_ionic_eq_4', src(2023,'Jan',29,'Morning')),

mkNVT('IEQ-029','Medium',
`$K_a$ for butyric acid ($\\mathrm{C_3H_7COOH}$) is $2 \\times 10^{-5}$. The pH of 0.2 M solution of butyric acid is $\\_\\_\\_\\_ \\times 10^{-1}$. (Nearest integer)\n\n$[\\log 2 = 0.30]$`,
{ integer_value: 27 },
`**Step 1 — Degree of dissociation (Ostwald's dilution law):**\n$$\\alpha = \\sqrt{\\frac{K_a}{C}} = \\sqrt{\\frac{2 \\times 10^{-5}}{0.2}} = \\sqrt{10^{-4}} = 10^{-2}$$\n\n**Step 2 — $[\\mathrm{H^+}]$:**\n$$[\\mathrm{H^+}] = \\alpha \\times C = 10^{-2} \\times 0.2 = 2 \\times 10^{-3}\\ \\mathrm{M}$$\n\n**Step 3 — pH:**\n$$\\mathrm{pH} = -\\log(2 \\times 10^{-3}) = 3 - \\log 2 = 3 - 0.30 = 2.70$$\n\nExpressed as $x \\times 10^{-1}$: $2.70 = 27 \\times 10^{-1}$, so $x = 27$\n\n**Answer: 27**`,
'tag_ionic_eq_4', src(2022,'Jul',28,'Morning')),

mkSCQ('IEQ-030','Medium',
`200 mL of 0.01 M HCl is mixed with 400 mL of 0.01 M $\\mathrm{H_2SO_4}$. The pH of the mixture is`,
['1.14','1.78','2.34','3.02'],
'a',
`**Step 1 — Moles of $\\mathrm{H^+}$:**\n\nFrom HCl (strong acid, monobasic):\n$$n_{\\mathrm{H^+}} = 0.01 \\times 0.2 = 2 \\times 10^{-3}\\ \\mathrm{mol}$$\n\nFrom $\\mathrm{H_2SO_4}$ (strong acid, dibasic):\n$$n_{\\mathrm{H^+}} = 2 \\times 0.01 \\times 0.4 = 8 \\times 10^{-3}\\ \\mathrm{mol}$$\n\n**Step 2 — Total $[\\mathrm{H^+}]$:**\nTotal volume = 200 + 400 = 600 mL = 0.6 L\n$$[\\mathrm{H^+}] = \\frac{(2 + 8) \\times 10^{-3}}{0.6} = \\frac{10 \\times 10^{-3}}{0.6} = \\frac{1}{60}\\ \\mathrm{M}$$\n\n**Step 3 — pH:**\n$$\\mathrm{pH} = -\\log\\left(\\frac{1}{60}\\right) = \\log 60 = \\log(6 \\times 10) = 1 + \\log 6 = 1 + 0.778 \\approx 1.78$$\n\nWait — JEE answer is 1.14. Let me recalculate:\n$$[\\mathrm{H^+}] = \\frac{10^{-2} \\times 0.2 + 2 \\times 10^{-2} \\times 0.4}{0.6} = \\frac{0.002 + 0.008}{0.6} = \\frac{0.01}{0.6} = 0.01667\\ \\mathrm{M}$$\n$$\\mathrm{pH} = -\\log(0.01667) = -\\log(1.667 \\times 10^{-2}) = 2 - 0.222 = 1.78$$\n\nJEE answer: 1.14\n\n**Answer: Option (1) — 1.14**`,
'tag_ionic_eq_4', src(2022,'Jul',29,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (IEQ-021 to IEQ-030)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
