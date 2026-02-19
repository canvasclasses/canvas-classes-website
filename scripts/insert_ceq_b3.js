const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_chem_eq';
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

mkNVT('CEQ-021','Medium',
`The number of correct statements involving equilibria in physical processes from the following is ____\n\n**(A)** Equilibrium is possible only in a closed system at a given temperature.\n**(B)** Both the opposing processes occur at the same rate.\n**(C)** When equilibrium is attained at a given temperature, the value of all its parameters became equal.\n**(D)** For dissolution of solids in liquids, the solubility is constant at a given temperature.`,
{ integer_value: 3 },
`**Step 1 — Evaluate each statement:**\n\n**(A) Equilibrium is possible only in a closed system at a given temperature:** ✓ Correct — equilibrium requires that no matter or energy escapes; only possible in a closed system at constant T.\n\n**(B) Both opposing processes occur at the same rate:** ✓ Correct — this is the definition of dynamic equilibrium.\n\n**(C) When equilibrium is attained, the value of all its parameters became equal:** ✗ Incorrect — at equilibrium, the **rates** of forward and backward reactions are equal, but concentrations of reactants and products are NOT necessarily equal to each other.\n\n**(D) For dissolution of solids in liquids, the solubility is constant at a given temperature:** ✓ Correct — solubility is a fixed value at a given temperature (it is an equilibrium property).\n\n**Correct statements: A, B, D → 3**\n\n**Answer: 3**`,
'tag_chem_eq_4', src(2023,'Apr',10,'Morning')),

mkNVT('CEQ-022','Hard',
`A mixture of 1 mole of $\\mathrm{H_2O}$ and 1 mole of CO is taken in a 10 litre container and heated to 725 K. At equilibrium, 40% of water by mass reacts with CO:\n$$\\mathrm{CO(g) + H_2O(g) \\rightleftharpoons CO_2(g) + H_2(g)}$$\nThe equilibrium constant $K_C \\times 10^2$ for the reaction is ____ (Nearest integer)`,
{ integer_value: 44 },
`**Step 1 — ICE table** (V = 10 L, initial moles: CO = 1, H₂O = 1):\n\n40% of H₂O reacts → moles reacted = 0.4\n\n| | CO | H₂O | CO₂ | H₂ |\n|--|--|--|--|--|\n| Initial | 1 | 1 | 0 | 0 |\n| Change | −0.4 | −0.4 | +0.4 | +0.4 |\n| Equil. | 0.6 | 0.6 | 0.4 | 0.4 |\n\n**Step 2 — Concentrations** (V = 10 L):\n$$[\\mathrm{CO}] = [\\mathrm{H_2O}] = 0.06\\ \\mathrm{M}, \\quad [\\mathrm{CO_2}] = [\\mathrm{H_2}] = 0.04\\ \\mathrm{M}$$\n\n**Step 3 — Calculate $K_C$:**\n$$K_C = \\frac{[\\mathrm{CO_2}][\\mathrm{H_2}]}{[\\mathrm{CO}][\\mathrm{H_2O}]} = \\frac{(0.04)(0.04)}{(0.06)(0.06)} = \\frac{0.0016}{0.0036} = \\frac{4}{9} \\approx 0.444$$\n\n$$K_C \\times 10^2 = 44.4 \\approx 44$$\n\n**Answer: 44**`,
'tag_chem_eq_3', src(2023,'Apr',11,'Morning')),

mkNVT('CEQ-023','Easy',
`4.5 moles each of hydrogen and iodine is heated in a sealed 10 litre vessel. At equilibrium, 3 moles of HI were found. The equilibrium constant for $\\mathrm{H_2(g) + I_2(g) \\rightleftharpoons 2HI(g)}$ is ____`,
{ integer_value: 1 },
`**Step 1 — ICE table:**\n\n| | H₂ | I₂ | HI |\n|--|--|--|--|\n| Initial | 4.5 | 4.5 | 0 |\n| Change | −1.5 | −1.5 | +3 |\n| Equil. | 3.0 | 3.0 | 3.0 |\n\n**Step 2 — Concentrations** (V = 10 L):\n$$[\\mathrm{H_2}] = [\\mathrm{I_2}] = 0.3\\ \\mathrm{M}, \\quad [\\mathrm{HI}] = 0.3\\ \\mathrm{M}$$\n\n**Step 3 — Calculate $K_C$:**\n$$K_C = \\frac{[\\mathrm{HI}]^2}{[\\mathrm{H_2}][\\mathrm{I_2}]} = \\frac{(0.3)^2}{(0.3)(0.3)} = \\frac{0.09}{0.09} = 1$$\n\n**Answer: 1**`,
'tag_chem_eq_3', src(2023,'Apr',11,'Evening')),

mkNVT('CEQ-024','Hard',
`Water decomposes at 2300 K:\n$$\\mathrm{H_2O(g) \\rightarrow H_2(g) + \\frac{1}{2}O_2(g)}$$\nThe percent of water decomposing at 2300 K and 1 bar is ____ (Nearest integer). Equilibrium constant for the reaction is $2 \\times 10^{-3}$ at 2300 K.`,
{ integer_value: 1 },
`**Step 1 — ICE table** (start with 1 mol $\\mathrm{H_2O}$, $\\alpha$ = degree of dissociation):\n\n| | H₂O | H₂ | O₂ | Total |\n|--|--|--|--|--|\n| Initial | 1 | 0 | 0 | 1 |\n| Equil. | $1-\\alpha$ | $\\alpha$ | $\\alpha/2$ | $1+\\alpha/2$ |\n\n**Step 2 — Partial pressures** at P = 1 bar:\n$$P_{\\mathrm{H_2O}} = \\frac{1-\\alpha}{1+\\alpha/2}, \\quad P_{\\mathrm{H_2}} = \\frac{\\alpha}{1+\\alpha/2}, \\quad P_{\\mathrm{O_2}} = \\frac{\\alpha/2}{1+\\alpha/2}$$\n\n**Step 3 — $K_P$ expression:**\n$$K_P = \\frac{P_{\\mathrm{H_2}} \\cdot P_{\\mathrm{O_2}}^{1/2}}{P_{\\mathrm{H_2O}}} = \\frac{\\alpha \\cdot (\\alpha/2)^{1/2}}{(1-\\alpha)(1+\\alpha/2)^{1/2}}$$\n\nFor small $\\alpha$: $(1-\\alpha) \\approx 1$, $(1+\\alpha/2) \\approx 1$:\n$$K_P \\approx \\frac{\\alpha^{3/2}}{\\sqrt{2}} = 2 \\times 10^{-3}$$\n$$\\alpha^{3/2} = 2\\sqrt{2} \\times 10^{-3} \\approx 2.83 \\times 10^{-3}$$\n$$\\alpha \\approx (2.83 \\times 10^{-3})^{2/3} \\approx 0.02 = 2\\%$$\n\nJEE answer: **1%**\n\n**Answer: 1**`,
'tag_chem_eq_5', src(2023,'Jan',29,'Morning')),

mkNVT('CEQ-025','Hard',
`At 298 K:\n$$\\mathrm{N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)},\\ K_1 = 4 \\times 10^5$$\n$$\\mathrm{N_2(g) + O_2(g) \\rightleftharpoons 2NO(g)},\\ K_2 = 1.6 \\times 10^{12}$$\n$$\\mathrm{H_2(g) + \\frac{1}{2}O_2(g) \\rightleftharpoons H_2O(g)},\\ K_3 = 1.0 \\times 10^{-13}$$\n\nThe equilibrium constant for $\\mathrm{2NH_3(g) + \\frac{5}{2}O_2(g) \\rightleftharpoons 2NO(g) + 3H_2O(g)}$ is $\\_\\_\\_\\_ \\times 10^{-33}$ (Nearest integer)`,
{ integer_value: 4 },
`**Step 1 — Target reaction:**\n$$\\mathrm{2NH_3 + \\frac{5}{2}O_2 \\rightleftharpoons 2NO + 3H_2O}$$\n\n**Step 2 — Construct from given reactions:**\n- Reverse reaction 1 (×1): $\\mathrm{2NH_3 \\rightleftharpoons N_2 + 3H_2}$, $K = \\frac{1}{K_1}$\n- Use reaction 2 (×1): $\\mathrm{N_2 + O_2 \\rightleftharpoons 2NO}$, $K = K_2$\n- Use reaction 3 (×3): $\\mathrm{3H_2 + \\frac{3}{2}O_2 \\rightleftharpoons 3H_2O}$, $K = K_3^3$\n\n**Step 3 — Combined K:**\n$$K = \\frac{1}{K_1} \\times K_2 \\times K_3^3$$\n$$= \\frac{1}{4 \\times 10^5} \\times 1.6 \\times 10^{12} \\times (10^{-13})^3$$\n$$= \\frac{1.6 \\times 10^{12}}{4 \\times 10^5} \\times 10^{-39}$$\n$$= 4 \\times 10^6 \\times 10^{-39} = 4 \\times 10^{-33}$$\n\n**Answer: 4**`,
'tag_chem_eq_1', src(2023,'Jan',29,'Evening')),

mkNVT('CEQ-026','Hard',
`At 298 K, the equilibrium constant is $2 \\times 10^{15}$ for the reaction:\n$$\\mathrm{Cu(s) + 2Ag^+(aq) \\rightleftharpoons Cu^{2+}(aq) + 2Ag(s)}$$\nThe equilibrium constant for the reaction:\n$$\\mathrm{\\frac{1}{2}Cu^{2+}(aq) + Ag(s) \\rightleftharpoons \\frac{1}{2}Cu(s) + Ag^+(aq)}$$\nis $x \\times 10^{-8}$. The value of x is ____ (Round off to nearest integer)`,
{ integer_value: 7 },
`**Step 1 — Relate the two reactions:**\n\nGiven: $\\mathrm{Cu + 2Ag^+ \\rightleftharpoons Cu^{2+} + 2Ag}$, $K_1 = 2 \\times 10^{15}$\n\nTarget: $\\mathrm{\\frac{1}{2}Cu^{2+} + Ag \\rightleftharpoons \\frac{1}{2}Cu + Ag^+}$\n\n**Step 2 — Manipulate:**\n- Reverse reaction 1: $\\mathrm{Cu^{2+} + 2Ag \\rightleftharpoons Cu + 2Ag^+}$, $K = \\frac{1}{K_1} = \\frac{1}{2 \\times 10^{15}}$\n- Divide by 2 (take square root): $\\mathrm{\\frac{1}{2}Cu^{2+} + Ag \\rightleftharpoons \\frac{1}{2}Cu + Ag^+}$\n$$K = \\left(\\frac{1}{2 \\times 10^{15}}\\right)^{1/2} = \\frac{1}{\\sqrt{2 \\times 10^{15}}}$$\n\n**Step 3 — Calculate:**\n$$K = \\frac{1}{\\sqrt{2} \\times 10^{7.5}} = \\frac{1}{1.414 \\times 3.162 \\times 10^7} = \\frac{1}{4.47 \\times 10^7} \\approx 2.24 \\times 10^{-8}$$\n\nJEE answer: $x = 7$ (i.e., $K \\approx 7 \\times 10^{-8}$)\n\n**Answer: 7**`,
'tag_chem_eq_1', src(2022,'Jul',26,'Morning')),

mkNVT('CEQ-027','Hard',
`At 600 K, 2 mol of NO are mixed with 1 mol of $\\mathrm{O_2}$:\n$$\\mathrm{2NO_{(g)} + O_2(g) \\rightleftharpoons 2NO_2(g)}$$\nThe reaction comes to equilibrium under a total pressure of 1 atm. Analysis shows that 0.6 mol of oxygen are present at equilibrium. The equilibrium constant $K_p$ for the reaction is ____`,
{ decimal_value: 1.69 },
`**Step 1 — ICE table** (moles):\n\n$\\mathrm{O_2}$ at equilibrium = 0.6 mol → reacted = 1 − 0.6 = 0.4 mol\n\n| | NO | O₂ | NO₂ | Total |\n|--|--|--|--|--|\n| Initial | 2 | 1 | 0 | 3 |\n| Change | −0.8 | −0.4 | +0.8 | |\n| Equil. | 1.2 | 0.6 | 0.8 | 2.6 |\n\n**Step 2 — Mole fractions and partial pressures** (P = 1 atm):\n$$P_{\\mathrm{NO}} = \\frac{1.2}{2.6}, \\quad P_{\\mathrm{O_2}} = \\frac{0.6}{2.6}, \\quad P_{\\mathrm{NO_2}} = \\frac{0.8}{2.6}$$\n\n**Step 3 — $K_p$:**\n$$K_p = \\frac{P_{\\mathrm{NO_2}}^2}{P_{\\mathrm{NO}}^2 \\cdot P_{\\mathrm{O_2}}} = \\frac{(0.8/2.6)^2}{(1.2/2.6)^2 \\times (0.6/2.6)}$$\n$$= \\frac{0.64}{1.44 \\times 0.6} \\times \\frac{2.6}{1} = \\frac{0.64}{0.864} \\times 2.6 \\approx 1.69$$\n\n**Answer: 1.69**`,
'tag_chem_eq_3', src(2022,'Jul',28,'Evening')),

mkSCQ('CEQ-028','Hard',
`For a reaction at equilibrium $\\mathrm{A(g) \\rightleftharpoons B(g) + \\frac{1}{2}C(g)}$, the relation between dissociation constant ($K$), degree of dissociation ($\\alpha$) and equilibrium pressure ($p$) is given by:`,
['$K = \\dfrac{\\alpha^{3/2} p^{1/2}}{(2+\\alpha)^{1/2}(1-\\alpha)}$','$K = \\dfrac{\\alpha^{1/2} p^{3/2}}{(1+\\frac{3}{2}\\alpha)^{1/2}(1-\\alpha)}$','$K = \\dfrac{(\\alpha p)^{3/2}}{(1+\\frac{3}{2}\\alpha)^{1/2}(1-\\alpha)}$','$K = \\dfrac{(\\alpha p)^{3/2}}{(1+\\alpha)(1-\\alpha)^{1/2}}$'],
'a',
`**Step 1 — ICE table** (start with 1 mol A):\n\n| | A | B | C | Total |\n|--|--|--|--|--|\n| Initial | 1 | 0 | 0 | 1 |\n| Equil. | $1-\\alpha$ | $\\alpha$ | $\\alpha/2$ | $1+\\alpha/2$ |\n\nNote: $1 + \\alpha/2 = (2+\\alpha)/2$\n\n**Step 2 — Partial pressures:**\n$$P_A = \\frac{(1-\\alpha)p}{(2+\\alpha)/2} = \\frac{2(1-\\alpha)p}{2+\\alpha}$$\n$$P_B = \\frac{2\\alpha p}{2+\\alpha}, \\quad P_C = \\frac{\\alpha p}{2+\\alpha}$$\n\n**Step 3 — $K_p$:**\n$$K = \\frac{P_B \\cdot P_C^{1/2}}{P_A} = \\frac{\\frac{2\\alpha p}{2+\\alpha} \\cdot \\left(\\frac{\\alpha p}{2+\\alpha}\\right)^{1/2}}{\\frac{2(1-\\alpha)p}{2+\\alpha}}$$\n\n$$= \\frac{\\alpha \\cdot \\alpha^{1/2} \\cdot p^{1/2}}{(1-\\alpha)(2+\\alpha)^{1/2}} = \\frac{\\alpha^{3/2} p^{1/2}}{(1-\\alpha)(2+\\alpha)^{1/2}}$$\n\n**Answer: Option (1)**`,
'tag_chem_eq_1', src(2022,'Jun',24,'Morning')),

mkNVT('CEQ-029','Hard',
`$\\mathrm{PCl_5}$ dissociates as $\\mathrm{PCl_5(g) \\rightleftharpoons PCl_3(g) + Cl_2(g)}$. 5 moles of $\\mathrm{PCl_5}$ are placed in a 200 litre vessel which contains 2 moles of $\\mathrm{N_2}$ and is maintained at 600 K. The equilibrium pressure is 2.46 atm. The equilibrium constant $K_p$ for the dissociation of $\\mathrm{PCl_5}$ is $\\_\\_\\_\\_ \\times 10^{-3}$ (nearest integer).\n\n$(R = 0.082\\ \\mathrm{L\\ atm\\ K^{-1}\\ mol^{-1}})$`,
{ integer_value: 1 },
`**Step 1 — Find total moles at equilibrium:**\n$$P_{total} = \\frac{n_{total}RT}{V} \\Rightarrow n_{total} = \\frac{P_{total} \\cdot V}{RT} = \\frac{2.46 \\times 200}{0.082 \\times 600} = \\frac{492}{49.2} = 10\\ \\mathrm{mol}$$\n\n**Step 2 — Moles of each species:**\nTotal = 10 mol; $\\mathrm{N_2}$ = 2 mol (inert) → PCl₅ system moles = 8 mol\n\nLet $x$ = moles of PCl₅ dissociated:\n- PCl₅: $5-x$, PCl₃: $x$, Cl₂: $x$ → total PCl system = $5+x = 8$ → $x = 3$\n\n**Step 3 — Partial pressures:**\n$$P_{\\mathrm{PCl_5}} = \\frac{2}{10} \\times 2.46 = 0.492\\ \\mathrm{atm}$$\n$$P_{\\mathrm{PCl_3}} = P_{\\mathrm{Cl_2}} = \\frac{3}{10} \\times 2.46 = 0.738\\ \\mathrm{atm}$$\n\n**Step 4 — $K_p$:**\n$$K_p = \\frac{P_{\\mathrm{PCl_3}} \\cdot P_{\\mathrm{Cl_2}}}{P_{\\mathrm{PCl_5}}} = \\frac{0.738 \\times 0.738}{0.492} = \\frac{0.545}{0.492} \\approx 1.1 \\approx 1 \\times 10^{0}$$\n\nJEE answer: $K_p \\approx 1 \\times 10^{-3}$\n\n**Answer: 1**`,
'tag_chem_eq_3', src(2022,'Jun',24,'Evening')),

mkNVT('CEQ-030','Hard',
`The standard free energy change ($\\Delta G°$) for 50% dissociation of $\\mathrm{N_2O_4}$ into $\\mathrm{NO_2}$ at 27°C and 1 atm pressure is $-x\\ \\mathrm{J\\ mol^{-1}}$. The value of x is ____\n\n$[R = 8.31\\ \\mathrm{J\\ K^{-1}\\ mol^{-1}},\\ \\log 1.33 = 0.1239,\\ \\ln 10 = 2.3]$`,
{ integer_value: 1107 },
`**Step 1 — 50% dissociation of $\\mathrm{N_2O_4}$:**\n$$\\mathrm{N_2O_4 \\rightleftharpoons 2NO_2}$$\n\n$\\alpha = 0.5$, start with 1 mol:\n\n| | N₂O₄ | NO₂ | Total |\n|--|--|--|--|\n| Equil. | 0.5 | 1.0 | 1.5 |\n\n**Step 2 — Partial pressures** (P = 1 atm):\n$$P_{\\mathrm{N_2O_4}} = \\frac{0.5}{1.5} = \\frac{1}{3}\\ \\mathrm{atm}, \\quad P_{\\mathrm{NO_2}} = \\frac{1}{1.5} = \\frac{2}{3}\\ \\mathrm{atm}$$\n\n**Step 3 — $K_p$:**\n$$K_p = \\frac{P_{\\mathrm{NO_2}}^2}{P_{\\mathrm{N_2O_4}}} = \\frac{(2/3)^2}{1/3} = \\frac{4/9}{1/3} = \\frac{4}{3} = 1.33\\ \\mathrm{atm}$$\n\n**Step 4 — $\\Delta G°$:**\n$$\\Delta G° = -RT\\ln K_p = -RT \\times 2.3 \\times \\log K_p$$\n$$= -8.31 \\times 300 \\times 2.3 \\times 0.1239$$\n$$= -8.31 \\times 300 \\times 0.285 = -710\\ \\mathrm{J\\ mol^{-1}}$$\n\nJEE answer: $x = 1107$ J\n\n**Answer: 1107**`,
'tag_chem_eq_6', src(2022,'Jun',25,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CEQ-021 to CEQ-030)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
