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

mkSCQ('IEQ-001','Medium',
`Which of the following statement(s) is/are correct?\n\n**(A)** The pH of $1 \\times 10^{-8}$ M HCl solution is 8.\n**(B)** The conjugate base of $\\mathrm{H_2PO_4^-}$ is $\\mathrm{HPO_4^{2-}}$.\n**(C)** $K_w$ increases with increase in temperature.\n**(D)** When a solution of a weak monoprotic acid is titrated against a strong base, at half neutralisation point, $\\mathrm{pH} = \\frac{1}{2}\\mathrm{pK_a}$.`,
['(B), (C)','(A), (D)','(A), (B), (C)','(B), (C), (D)'],
'a',
`**Step 1 — Evaluate each statement:**\n\n**(A) pH of $10^{-8}$ M HCl = 8:** ✗ Incorrect. At such low concentration, the contribution of water's own $\\mathrm{H^+}$ ($10^{-7}$ M) cannot be ignored. Total $[\\mathrm{H^+}] = 10^{-8} + 10^{-7} \\approx 1.1 \\times 10^{-7}$ M → pH ≈ 6.96, not 8.\n\n**(B) Conjugate base of $\\mathrm{H_2PO_4^-}$ is $\\mathrm{HPO_4^{2-}}$:** ✓ Correct. Removing one $\\mathrm{H^+}$ from $\\mathrm{H_2PO_4^-}$ gives $\\mathrm{HPO_4^{2-}}$.\n\n**(C) $K_w$ increases with temperature:** ✓ Correct. Dissociation of water is endothermic; increasing T shifts equilibrium forward → $K_w$ increases.\n\n**(D) At half-neutralisation, pH = $\\frac{1}{2}\\mathrm{pK_a}$:** ✗ Incorrect. At half-neutralisation, [acid] = [salt], so by Henderson-Hasselbalch: pH = pKa + log(1) = **pKa** (not $\\frac{1}{2}$pKa).\n\n**Correct statements: B and C**\n\n**Answer: Option (1) — (B), (C)**`,
'tag_ionic_eq_7', src(2023,'Apr',15,'Morning')),

mkSCQ('IEQ-002','Easy',
`In base vs. acid titration, at the end point methyl orange is present as`,
['Quinonoid form','Heterocyclic form','Phenolic form','Benzenoid form'],
'a',
`**Methyl orange** is an acid-base indicator that changes colour based on pH.\n\n**Step 1 — Structure of methyl orange:**\n- In **acidic** medium (pH < 3.1): exists as **quinonoid form** (red/pink colour)\n- In **basic** medium (pH > 4.4): exists as **benzenoid form** (yellow colour)\n\n**Step 2 — At end point of base vs. acid titration:**\nIn a base vs. acid titration (base in burette, acid in flask), the end point is reached when the solution becomes slightly acidic (pH ≈ 3.1-4.4 for methyl orange).\n\nAt the end point, the solution is acidic → methyl orange is in the **quinonoid form** (red/orange).\n\n**Answer: Option (1) — Quinonoid form**`,
'tag_ionic_eq_8', src(2022,'Jul',25,'Evening')),

mkSCQ('IEQ-003','Medium',
`Which of the following compound **CANNOT** act as a Lewis base?`,
['$\\mathrm{NF_3}$','$\\mathrm{PCl_5}$','$\\mathrm{SF_4}$','$\\mathrm{ClF_3}$'],
'b',
`**Lewis base** = electron pair donor (must have a lone pair available for donation).\n\n**Step 1 — Analyse each compound:**\n\n**(1) $\\mathrm{NF_3}$:** N has a lone pair → can donate → **Lewis base** ✓ (though weakly, due to F withdrawing electrons)\n\n**(2) $\\mathrm{PCl_5}$:** P has 5 bonds, no lone pairs, and an empty d-orbital → acts as **Lewis acid** (electron acceptor), NOT a Lewis base ✗\n\n**(3) $\\mathrm{SF_4}$:** S has one lone pair → can donate → **Lewis base** ✓\n\n**(4) $\\mathrm{ClF_3}$:** Cl has two lone pairs → can donate → **Lewis base** ✓\n\n**Answer: Option (2) — $\\mathrm{PCl_5}$**`,
'tag_ionic_eq_7', src(2021,'Mar',17,'Morning')),

mkSCQ('IEQ-004','Easy',
`Incorrect statement for the use of indicator in acid-base titration is:`,
['Methyl orange may be used for a weak acid vs weak base titration','Phenolphthalein may be used for a strong acid vs strong base titration','Methyl orange is a suitable indicator for a strong acid vs weak base titration','Phenolphthalein is a suitable indicator for a weak acid vs strong base titration'],
'a',
`**Indicator selection** depends on the pH at the equivalence point:\n\n**Step 1 — Equivalence point pH for each titration:**\n- Strong acid + Strong base: pH = 7 → both methyl orange and phenolphthalein work\n- Strong acid + Weak base: pH < 7 → methyl orange (pH 3.1–4.4) is suitable\n- Weak acid + Strong base: pH > 7 → phenolphthalein (pH 8.3–10) is suitable\n- Weak acid + Weak base: pH ≈ 7 (depends on Ka/Kb) → **no sharp endpoint**, so no indicator works well\n\n**Step 2 — Evaluate each option:**\n- **(1) Methyl orange for weak acid + weak base:** ✗ **Incorrect** — no sharp endpoint in weak acid/weak base titration; methyl orange is NOT suitable\n- **(2) Phenolphthalein for strong acid + strong base:** ✓ Correct (works, though not ideal)\n- **(3) Methyl orange for strong acid + weak base:** ✓ Correct\n- **(4) Phenolphthalein for weak acid + strong base:** ✓ Correct\n\n**Answer: Option (1) — Incorrect statement**`,
'tag_ionic_eq_8', src(2023,'Jan',31,'Evening')),

mkNVT('IEQ-005','Easy',
`Assuming that $\\mathrm{Ba(OH)_2}$ is completely ionised in aqueous solution, the concentration of $\\mathrm{H_3O^+}$ ions in 0.005 M aqueous solution of $\\mathrm{Ba(OH)_2}$ at 298 K is $\\_\\_\\_\\_ \\times 10^{-12}\\ \\mathrm{mol\\ L^{-1}}$. (Nearest integer)`,
{ integer_value: 1 },
`**Step 1 — Ionisation of $\\mathrm{Ba(OH)_2}$:**\n$$\\mathrm{Ba(OH)_2 \\rightarrow Ba^{2+} + 2OH^-}$$\n\n$[\\mathrm{OH^-}] = 2 \\times 0.005 = 0.01\\ \\mathrm{M} = 10^{-2}\\ \\mathrm{M}$\n\n**Step 2 — Calculate $[\\mathrm{H_3O^+}]$:**\n$$[\\mathrm{H_3O^+}] = \\frac{K_w}{[\\mathrm{OH^-}]} = \\frac{10^{-14}}{10^{-2}} = 10^{-12}\\ \\mathrm{M}$$\n\nExpressed as $x \\times 10^{-12}$: $x = 1$\n\n**Answer: 1**`,
'tag_ionic_eq_6', src(2021,'Jul',25,'Evening')),

mkSCQ('IEQ-006','Easy',
`The amphoteric hydroxide is:`,
['$\\mathrm{Be(OH)_2}$','$\\mathrm{Ca(OH)_2}$','$\\mathrm{Mg(OH)_2}$','$\\mathrm{Sr(OH)_2}$'],
'a',
`**Amphoteric hydroxide** = reacts with both acids AND bases.\n\n**Step 1 — Check each hydroxide:**\n\n**(1) $\\mathrm{Be(OH)_2}$:** Reacts with HCl (acid): $\\mathrm{Be(OH)_2 + 2HCl \\rightarrow BeCl_2 + 2H_2O}$\nAlso reacts with NaOH (base): $\\mathrm{Be(OH)_2 + 2NaOH \\rightarrow Na_2[Be(OH)_4]}$\n→ **Amphoteric** ✓\n\n**(2) $\\mathrm{Ca(OH)_2}$:** Only reacts with acids → purely basic ✗\n\n**(3) $\\mathrm{Mg(OH)_2}$:** Only reacts with acids → purely basic ✗\n\n**(4) $\\mathrm{Sr(OH)_2}$:** Only reacts with acids → purely basic ✗\n\n**Note:** Be is a small, highly polarising cation → its hydroxide shows amphoteric character (similar to Al, Zn).\n\n**Answer: Option (1) — $\\mathrm{Be(OH)_2}$**`,
'tag_ionic_eq_7', src(2019,'Jan',11,'Morning')),

mkSCQ('IEQ-007','Medium',
`Given below are two statements:\n\n**Statement I:** Methyl orange is a weak acid.\n\n**Statement II:** The benzenoid form of methyl orange is more intense/deeply coloured than the quinonoid form.\n\nChoose the most appropriate answer:`,
['Both Statement I and Statement II are incorrect','Statement I is incorrect but Statement II is correct','Both Statement I and Statement II are correct','Statement I is correct but Statement II is incorrect'],
'd',
`**Step 1 — Evaluate Statement I:**\nMethyl orange is indeed a **weak acid** (it is an azo dye that acts as a weak acid indicator). **Statement I is correct** ✓\n\n**Step 2 — Evaluate Statement II:**\n- **Quinonoid form** (acidic medium, red/pink): more intensely coloured due to extended conjugation\n- **Benzenoid form** (basic medium, yellow): less intensely coloured\n- The quinonoid form is MORE deeply coloured than the benzenoid form\n- **Statement II is incorrect** ✗ (it says benzenoid is more intense, which is wrong)\n\n**Answer: Option (4) — Statement I correct, Statement II incorrect**`,
'tag_ionic_eq_8', src(2023,'Apr',8,'Evening')),

mkNVT('IEQ-008','Hard',
`If the pKa of lactic acid is 5, then the pH of 0.005 M calcium lactate solution at 25°C is $\\_\\_\\_\\_ \\times 10^{-1}$ (Nearest integer)`,
{ integer_value: 85 },
`**Step 1 — Calcium lactate dissociation:**\nCalcium lactate = $\\mathrm{Ca(CH_3CH(OH)COO)_2}$ → $\\mathrm{Ca^{2+} + 2Lac^-}$\n\n$[\\mathrm{Lac^-}] = 2 \\times 0.005 = 0.01\\ \\mathrm{M}$\n\n**Step 2 — Hydrolysis of lactate ion (salt of weak acid + strong base):**\n$$\\mathrm{Lac^- + H_2O \\rightleftharpoons HLac + OH^-}$$\n\n$K_h = \\frac{K_w}{K_a} = \\frac{10^{-14}}{10^{-5}} = 10^{-9}$\n\n**Step 3 — pH of salt solution:**\n$$\\mathrm{pH} = 7 + \\frac{1}{2}(\\mathrm{pK_a} + \\log C)$$\n$$= 7 + \\frac{1}{2}(5 + \\log 0.01)$$\n$$= 7 + \\frac{1}{2}(5 + (-2))$$\n$$= 7 + \\frac{3}{2} = 7 + 1.5 = 8.5$$\n\n$8.5 = 85 \\times 10^{-1}$\n\n**Answer: 85**`,
'tag_ionic_eq_4', src(2023,'Jan',24,'Evening')),

mkSCQ('IEQ-009','Easy',
`When the hydrogen ion concentration $[\\mathrm{H^+}]$ changes by a factor of 1000, the value of pH of the solution`,
['Increases by 1000 units','Decreases by 3 units','Decreases by 2 units','Increases by 2 units'],
'b',
`**Definition:** $\\mathrm{pH} = -\\log[\\mathrm{H^+}]$\n\n**Step 1 — Effect of 1000-fold change in $[\\mathrm{H^+}]$:**\n\nIf $[\\mathrm{H^+}]$ increases by factor 1000:\n$$\\mathrm{pH_{new}} = -\\log(1000 \\times [\\mathrm{H^+}]) = -\\log[\\mathrm{H^+}] - \\log 1000 = \\mathrm{pH_{old}} - 3$$\n\nSo pH **decreases by 3 units**.\n\n**Step 2 — Verify:**\nIf $[\\mathrm{H^+}]$ goes from $10^{-7}$ to $10^{-4}$ (×1000), pH goes from 7 to 4 → decrease of 3 ✓\n\n**Answer: Option (2) — Decreases by 3 units**`,
'tag_ionic_eq_6', src(2023,'Jan',25,'Evening')),

mkNVT('IEQ-010','Medium',
`The volume of HCl, containing $73\\ \\mathrm{g\\ L^{-1}}$, required to completely neutralise NaOH obtained by reacting 0.69 g of metallic sodium with water, is $\\_\\_\\_\\_ $ mL. (Nearest Integer)\n\n(Molar masses: Na = 23, Cl = 35.5, O = 16, H = 1 g/mol)`,
{ integer_value: 15 },
`**Step 1 — Moles of Na:**\n$$n_{\\mathrm{Na}} = \\frac{0.69}{23} = 0.03\\ \\mathrm{mol}$$\n\n**Step 2 — Reaction of Na with water:**\n$$\\mathrm{2Na + 2H_2O \\rightarrow 2NaOH + H_2}$$\nMoles of NaOH = moles of Na = 0.03 mol\n\n**Step 3 — Molarity of HCl solution:**\n$$M_{\\mathrm{HCl}} = \\frac{73\\ \\mathrm{g\\ L^{-1}}}{36.5\\ \\mathrm{g\\ mol^{-1}}} = 2\\ \\mathrm{M}$$\n\n**Step 4 — Volume of HCl needed:**\n$$\\mathrm{NaOH + HCl \\rightarrow NaCl + H_2O}$$\nMoles of HCl = 0.03 mol\n$$V = \\frac{0.03\\ \\mathrm{mol}}{2\\ \\mathrm{mol\\ L^{-1}}} = 0.015\\ \\mathrm{L} = 15\\ \\mathrm{mL}$$\n\n**Answer: 15 mL**`,
'tag_ionic_eq_4', src(2023,'Jan',29,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (IEQ-001 to IEQ-010)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
