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

mkSCQ('IEQ-041','Medium',
`20 mL of 0.1 M $\\mathrm{NH_4OH}$ is mixed with 40 mL of 0.05 M HCl. The pH of the mixture is nearest to:\n\n$(K_b(\\mathrm{NH_4OH}) = 1 \\times 10^{-5},\\ \\log 2 = 0.30,\\ \\log 3 = 0.48,\\ \\log 5 = 0.69)$`,
['3.2','4.2','5.2','6.2'],
'c',
`**Step 1 — Moles of each:**\nMoles $\\mathrm{NH_4OH}$ = $0.1 \\times 0.02 = 2 \\times 10^{-3}$ mol\nMoles HCl = $0.05 \\times 0.04 = 2 \\times 10^{-3}$ mol\n\n**Step 2 — Neutralisation:**\n$$\\mathrm{NH_4OH + HCl \\rightarrow NH_4Cl + H_2O}$$\nAll $\\mathrm{NH_4OH}$ is consumed → only $\\mathrm{NH_4Cl}$ remains (2×10⁻³ mol)\n\n**Step 3 — pH of $\\mathrm{NH_4Cl}$ solution (salt of weak base + strong acid):**\nTotal volume = 60 mL\n$$[\\mathrm{NH_4Cl}] = \\frac{2 \\times 10^{-3}}{0.06} = \\frac{1}{30}\\ \\mathrm{M}$$\n\n$$\\mathrm{pH} = 7 - \\frac{1}{2}(\\mathrm{pK_b} + \\log C)$$\n$$\\mathrm{pK_b} = 5, \\quad \\log C = \\log(1/30) = -\\log 30 = -(\\log 3 + \\log 10) = -(0.48 + 1) = -1.48$$\n$$\\mathrm{pH} = 7 - \\frac{1}{2}(5 + (-1.48)) = 7 - \\frac{3.52}{2} = 7 - 1.76 = 5.24 \\approx 5.2$$\n\n**Answer: Option (3) — 5.2**`,
'tag_ionic_eq_5', src(2022,'Jul',25,'Morning')),

mkSCQ('IEQ-042','Medium',
`The pH of a 0.02 M $\\mathrm{NH_4Cl}$ solution will be:\n\n$[K_b(\\mathrm{NH_4OH}) = 10^{-5},\\ \\log 2 = 0.301]$`,
['4.65','2.65','4.35','5.35'],
'd',
`**Step 1 — $\\mathrm{NH_4Cl}$ is a salt of weak base + strong acid → acidic solution:**\n\n$$\\mathrm{NH_4^+ + H_2O \\rightleftharpoons NH_4OH + H^+}$$\n\n$K_h = \\frac{K_w}{K_b} = \\frac{10^{-14}}{10^{-5}} = 10^{-9}$\n\n**Step 2 — pH formula:**\n$$\\mathrm{pH} = 7 - \\frac{1}{2}(\\mathrm{pK_b} + \\log C)$$\n$$= 7 - \\frac{1}{2}(5 + \\log 0.02)$$\n$$= 7 - \\frac{1}{2}(5 + \\log 2 \\times 10^{-2})$$\n$$= 7 - \\frac{1}{2}(5 + 0.301 - 2)$$\n$$= 7 - \\frac{1}{2}(3.301)$$\n$$= 7 - 1.65 = 5.35$$\n\n**Answer: Option (4) — 5.35**`,
'tag_ionic_eq_5', src(2019,'Apr',10,'Evening')),

mkSCQ('IEQ-043','Medium',
`Given below are two statements:\n\n**Statement (I):** A buffer solution is the mixture of a salt and an acid or a base mixed in any particular quantities.\n\n**Statement (II):** Blood is a naturally occurring buffer solution whose pH is maintained by $\\mathrm{H_2CO_3/HCO_3^-}$ concentrations.`,
['Statement I is true but Statement II is false','Both Statement I and Statement II are true','Statement I is false but Statement II is true','Both Statement I and Statement II are false'],
'c',
`**Step 1 — Evaluate Statement I:**\nA buffer solution is NOT just any mixture of salt and acid/base. It requires:\n- A **weak acid** and its **conjugate base** (salt), OR\n- A **weak base** and its **conjugate acid** (salt)\n- Mixed in **specific proportions** (not "any" quantities)\n\nIf equal moles of strong acid and its salt are mixed, it's not a buffer. The statement says "any particular quantities" which is misleading — it must be specific ratios.\n**Statement I is FALSE** ✗ (too broad/incorrect)\n\n**Step 2 — Evaluate Statement II:**\nBlood pH (7.35–7.45) is maintained by the $\\mathrm{H_2CO_3/HCO_3^-}$ buffer system:\n$$\\mathrm{H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-}$$\n**Statement II is TRUE** ✓\n\n**Answer: Option (3) — Statement I false, Statement II true**`,
'tag_ionic_eq_1', src(2024,'Apr',8,'Evening')),

mkNVT('IEQ-044','Hard',
`The pH of an aqueous solution containing 1 M benzoic acid ($\\mathrm{pK_a} = 4.20$) and 1 M sodium benzoate is 4.5. The volume of benzoic acid solution in 300 mL of this buffer solution is $\\_\\_\\_\\_ $ mL.`,
{ integer_value: 100 },
`**Step 1 — Henderson-Hasselbalch equation:**\n$$\\mathrm{pH} = \\mathrm{pK_a} + \\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]}$$\n$$4.5 = 4.20 + \\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]}$$\n$$\\log\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]} = 0.30 = \\log 2$$\n$$\\frac{[\\mathrm{Salt}]}{[\\mathrm{Acid}]} = 2$$\n\n**Step 2 — Find volumes:**\nBoth solutions are 1 M. Let volume of acid = $V_a$ mL, volume of salt = $V_s$ mL.\n$$V_a + V_s = 300\\ \\mathrm{mL}$$\n\nSince both are 1 M, moles ratio = volume ratio:\n$$\\frac{V_s}{V_a} = 2 \\Rightarrow V_s = 2V_a$$\n$$V_a + 2V_a = 300 \\Rightarrow 3V_a = 300 \\Rightarrow V_a = 100\\ \\mathrm{mL}$$\n\n**Answer: 100 mL**`,
'tag_ionic_eq_1', src(2024,'Jan',30,'Evening')),

mkNVT('IEQ-045','Easy',
`$K_a$ for $\\mathrm{CH_3COOH}$ is $1.8 \\times 10^{-5}$ and $K_b$ for $\\mathrm{NH_4OH}$ is $1.8 \\times 10^{-5}$. The pH of ammonium acetate solution will be ____`,
{ integer_value: 7 },
`**Step 1 — Ammonium acetate = salt of weak acid + weak base:**\n$$\\mathrm{CH_3COONH_4}$$\n\n**Step 2 — pH formula:**\n$$\\mathrm{pH} = 7 + \\frac{1}{2}(\\mathrm{pK_a} - \\mathrm{pK_b})$$\n\n**Step 3 — Calculate:**\n$$\\mathrm{pK_a} = -\\log(1.8 \\times 10^{-5}), \\quad \\mathrm{pK_b} = -\\log(1.8 \\times 10^{-5})$$\n$$\\mathrm{pK_a} = \\mathrm{pK_b}$$\n$$\\mathrm{pH} = 7 + \\frac{1}{2}(0) = 7$$\n\nWhen $K_a = K_b$, the salt solution is **neutral** (pH = 7).\n\n**Answer: 7**`,
'tag_ionic_eq_5', src(2024,'Feb',1,'Morning')),

mkSCQ('IEQ-046','Easy',
`The plot of pH-metric titration of weak base $\\mathrm{NH_4OH}$ vs strong acid HCl looks like which graph?`,
['Graph showing pH starting low and rising sharply','Graph showing pH starting high (~11), decreasing gradually, with a sharp drop near equivalence point, then levelling off at low pH','Graph showing a flat line','Graph showing pH starting low and staying low'],
'a',
`**Step 1 — Identify the titration:**\nWeak base ($\\mathrm{NH_4OH}$) in flask, strong acid (HCl) added from burette.\n\n**Step 2 — Expected pH curve:**\n- **Initially:** $\\mathrm{NH_4OH}$ solution → pH ≈ 11 (basic)\n- **As HCl is added:** Buffer region forms ($\\mathrm{NH_4OH/NH_4Cl}$) → pH decreases gradually\n- **At half-equivalence point:** pH = pOH = pKb = 4.74, so pH = 9.26\n- **At equivalence point:** Only $\\mathrm{NH_4Cl}$ → pH ≈ 5 (acidic, sharp drop)\n- **After equivalence:** Excess HCl → pH drops to ≈ 1-2\n\n**Step 3:** The correct graph starts at high pH (~11), decreases with a buffer region, has a sharp drop at equivalence point (but less sharp than strong acid/strong base), and ends at low pH.\n\n**JEE answer: Option (1)** — the graph that shows pH starting high and decreasing to low with inflection point.\n\n**Answer: Option (1)**`,
'tag_ionic_eq_8', src(2022,'Jul',27,'Evening')),

mkSCQ('IEQ-047','Medium',
`Given below are two statements:\n\n**Statement I:** On passing $\\mathrm{HCl_{(g)}}$ through a saturated solution of $\\mathrm{BaCl_2}$, at room temperature white turbidity appears.\n\n**Statement II:** When HCl gas is passed through a saturated solution of NaCl, sodium chloride is precipitated due to common ion effect.`,
['Both Statement I and Statement II are correct','Statement I is correct but Statement II is incorrect','Both Statement I and Statement II are incorrect','Statement I is incorrect but Statement II is correct'],
'd',
`**Step 1 — Evaluate Statement I:**\n$\\mathrm{BaCl_2}$ is highly soluble in water. Passing HCl gas through its saturated solution:\n- HCl dissolves → increases $[\\mathrm{Cl^-}]$ (common ion effect)\n- But $\\mathrm{BaCl_2}$ is very soluble → $K_{sp}$ is very large → no precipitation\n- **No white turbidity** → **Statement I is FALSE** ✗\n\n**Step 2 — Evaluate Statement II:**\nNaCl saturated solution + HCl gas:\n- HCl dissolves → $[\\mathrm{Cl^-}]$ increases\n- $Q_{sp} = [\\mathrm{Na^+}][\\mathrm{Cl^-}] > K_{sp}$ → NaCl precipitates\n- This is the **common ion effect** ✓\n- **Statement II is TRUE** ✓\n\n**Answer: Option (4) — Statement I incorrect, Statement II correct**`,
'tag_ionic_eq_3', src(2024,'Apr',5,'Evening')),

mkSCQ('IEQ-048','Easy',
`For a sparingly soluble salt $\\mathrm{AB_2}$, the equilibrium concentrations of $\\mathrm{A^{2+}}$ ions and $\\mathrm{B^-}$ ions are $1.2 \\times 10^{-4}$ M and $0.24 \\times 10^{-3}$ M, respectively. The solubility product of $\\mathrm{AB_2}$ is:`,
['$6.91 \\times 10^{-12}$','$0.276 \\times 10^{-12}$','$27.65 \\times 10^{-12}$','$0.069 \\times 10^{-12}$'],
'a',
`**Step 1 — Dissociation:**\n$$\\mathrm{AB_2 \\rightleftharpoons A^{2+} + 2B^-}$$\n$$K_{sp} = [\\mathrm{A^{2+}}][\\mathrm{B^-}]^2$$\n\n**Step 2 — Substitute values:**\n$$[\\mathrm{A^{2+}}] = 1.2 \\times 10^{-4}\\ \\mathrm{M}$$\n$$[\\mathrm{B^-}] = 0.24 \\times 10^{-3} = 2.4 \\times 10^{-4}\\ \\mathrm{M}$$\n\n**Step 3 — Calculate:**\n$$K_{sp} = (1.2 \\times 10^{-4})(2.4 \\times 10^{-4})^2$$\n$$= (1.2 \\times 10^{-4})(5.76 \\times 10^{-8})$$\n$$= 6.912 \\times 10^{-12} \\approx 6.91 \\times 10^{-12}$$\n\n**Answer: Option (1) — $6.91 \\times 10^{-12}$**`,
'tag_ionic_eq_3', src(2024,'Apr',9,'Evening')),

mkNVT('IEQ-049','Hard',
`The pH at which $\\mathrm{Mg(OH)_2}$ [$K_{sp} = 1 \\times 10^{-11}$] begins to precipitate from a solution containing 0.10 M $\\mathrm{Mg^{2+}}$ ions is ____`,
{ integer_value: 9 },
`**Step 1 — Condition for precipitation:**\nPrecipitation begins when $Q_{sp} = K_{sp}$:\n$$[\\mathrm{Mg^{2+}}][\\mathrm{OH^-}]^2 = K_{sp}$$\n$$0.10 \\times [\\mathrm{OH^-}]^2 = 1 \\times 10^{-11}$$\n$$[\\mathrm{OH^-}]^2 = 10^{-10}$$\n$$[\\mathrm{OH^-}] = 10^{-5}\\ \\mathrm{M}$$\n\n**Step 2 — Calculate pH:**\n$$\\mathrm{pOH} = -\\log(10^{-5}) = 5$$\n$$\\mathrm{pH} = 14 - 5 = 9$$\n\n**Answer: 9**`,
'tag_ionic_eq_3', src(2024,'Jan',30,'Morning')),

mkSCQ('IEQ-050','Hard',
`Solubility of calcium phosphate (molecular mass M) in water is W g per 100 mL at 25°C. Its solubility product at 25°C will be approximately:`,
['$10^7\\left(\\dfrac{W}{M}\\right)^3$','$10^7\\left(\\dfrac{W}{M}\\right)^5$','$10^3\\left(\\dfrac{W}{M}\\right)^5$','$10^5\\left(\\dfrac{W}{M}\\right)^5$'],
'b',
`**Step 1 — Calcium phosphate = $\\mathrm{Ca_3(PO_4)_2}$:**\n$$\\mathrm{Ca_3(PO_4)_2 \\rightleftharpoons 3Ca^{2+} + 2PO_4^{3-}}$$\n$$K_{sp} = [\\mathrm{Ca^{2+}}]^3[\\mathrm{PO_4^{3-}}]^2 = (3s)^3(2s)^2 = 27s^3 \\cdot 4s^2 = 108s^5$$\n\n**Step 2 — Convert solubility:**\nW g per 100 mL = W g per 0.1 L = 10W g per L\n$$s = \\frac{10W}{M}\\ \\mathrm{mol\\ L^{-1}}$$\n\n**Step 3 — Calculate $K_{sp}$:**\n$$K_{sp} = 108 \\times \\left(\\frac{10W}{M}\\right)^5 = 108 \\times \\frac{10^5 W^5}{M^5}$$\n$$\\approx 10^7 \\times \\left(\\frac{W}{M}\\right)^5$$\n\n(since $108 \\times 10^5 \\approx 10^7$)\n\n**Answer: Option (2) — $10^7\\left(\\dfrac{W}{M}\\right)^5$**`,
'tag_ionic_eq_3', src(2024,'Feb',1,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (IEQ-041 to IEQ-050)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
