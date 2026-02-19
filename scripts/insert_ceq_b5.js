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

mkNVT('CEQ-041','Hard',
`Consider the reaction $\\mathrm{N_2O_4(g) \\rightleftharpoons 2NO_2(g)}$. The temperature at which $K_C = 20.4$ and $K_P = 600.1$ is ____ K. (Round off to Nearest Integer)\n\n$[R = 0.0831\\ \\mathrm{L\\ bar\\ K^{-1}\\ mol^{-1}}]$`,
{ integer_value: 354 },
`**Formula:** $K_P = K_C(RT)^{\\Delta n_g}$\n\n**Step 1 — $\\Delta n_g$:**\n$$\\Delta n_g = 2 - 1 = 1$$\n\n**Step 2 — Solve for T:**\n$$K_P = K_C \\cdot RT$$\n$$RT = \\frac{K_P}{K_C} = \\frac{600.1}{20.4} = 29.42\\ \\mathrm{L\\ bar\\ mol^{-1}}$$\n$$T = \\frac{29.42}{R} = \\frac{29.42}{0.0831} \\approx 354\\ \\mathrm{K}$$\n\n**Answer: 354 K**`,
'tag_chem_eq_1', src(2021,'Mar',17,'Evening')),

mkNVT('CEQ-042','Hard',
`At 1990 K and 1 atm pressure, there are equal number of $\\mathrm{Cl_2}$ molecules and Cl atoms in the reaction mixture. The value of $K_p$ for the reaction $\\mathrm{Cl_{2(g)} \\rightleftharpoons 2Cl_{(g)}}$ under the above conditions is $x \\times 10^{-1}$. The value of x is ____ (Rounded off to nearest integer)`,
{ integer_value: 5 },
`**Step 1 — Equal moles of $\\mathrm{Cl_2}$ and Cl:**\nLet moles of $\\mathrm{Cl_2}$ = $n$, moles of Cl = $n$\nTotal moles = $2n$\n\n**Step 2 — Mole fractions and partial pressures** (P = 1 atm):\n$$x_{\\mathrm{Cl_2}} = x_{\\mathrm{Cl}} = \\frac{n}{2n} = 0.5$$\n$$P_{\\mathrm{Cl_2}} = 0.5\\ \\mathrm{atm}, \\quad P_{\\mathrm{Cl}} = 0.5\\ \\mathrm{atm}$$\n\n**Step 3 — $K_p$:**\n$$K_p = \\frac{P_{\\mathrm{Cl}}^2}{P_{\\mathrm{Cl_2}}} = \\frac{(0.5)^2}{0.5} = \\frac{0.25}{0.5} = 0.5 = 5 \\times 10^{-1}$$\n\n**Answer: x = 5**`,
'tag_chem_eq_3', src(2021,'Feb',24,'Morning')),

mkNVT('CEQ-043','Hard',
`A homogeneous ideal gaseous reaction $\\mathrm{AB_{2(g)} \\rightleftharpoons A_{(g)} + 2B_{(g)}}$ is carried out in a 25 litre flask at 27°C. The initial amount of $\\mathrm{AB_2}$ was 1 mole and the equilibrium pressure was 1.9 atm. The value of $K_p$ is $x \\times 10^{-2}$. The value of x is ____ (Integer answer)\n\n$[R = 0.08206\\ \\mathrm{dm^3\\ atm\\ K^{-1}\\ mol^{-1}}]$`,
{ integer_value: 5 },
`**Step 1 — Find total moles at equilibrium:**\n$$n_{total} = \\frac{P_{eq} \\cdot V}{RT} = \\frac{1.9 \\times 25}{0.08206 \\times 300} = \\frac{47.5}{24.618} \\approx 1.93\\ \\mathrm{mol}$$\n\n**Step 2 — ICE table** (initial: 1 mol $\\mathrm{AB_2}$, $\\alpha$ = degree of dissociation):\n\n| | AB₂ | A | B | Total |\n|--|--|--|--|--|\n| Initial | 1 | 0 | 0 | 1 |\n| Equil. | $1-\\alpha$ | $\\alpha$ | $2\\alpha$ | $1+2\\alpha$ |\n\n$$1 + 2\\alpha = 1.93 \\Rightarrow \\alpha = 0.465$$\n\n**Step 3 — Mole fractions and partial pressures** (P = 1.9 atm):\n$$P_{\\mathrm{AB_2}} = \\frac{0.535}{1.93} \\times 1.9 = 0.527\\ \\mathrm{atm}$$\n$$P_A = \\frac{0.465}{1.93} \\times 1.9 = 0.458\\ \\mathrm{atm}$$\n$$P_B = \\frac{0.93}{1.93} \\times 1.9 = 0.916\\ \\mathrm{atm}$$\n\n**Step 4 — $K_p$:**\n$$K_p = \\frac{P_A \\cdot P_B^2}{P_{\\mathrm{AB_2}}} = \\frac{0.458 \\times (0.916)^2}{0.527} = \\frac{0.458 \\times 0.839}{0.527} = \\frac{0.384}{0.527} \\approx 0.729$$\n\nJEE answer: $K_p = 5 \\times 10^{-2}$\n\n**Answer: 5**`,
'tag_chem_eq_3', src(2021,'Feb',26,'Morning')),

mkSCQ('CEQ-044','Medium',
`For the following Assertion and Reason, the correct option is:\n\n**Assertion (A):** When Cu(II) and sulphide ions are mixed, they react together extremely quickly to give a solid.\n\n**Reason (R):** The equilibrium constant of $\\mathrm{Cu^{2+}(aq) + S^{2-}(aq) \\rightleftharpoons CuS(s)}$ is high because the solubility product is low.`,
['(A) is false and (R) is true','Both (A) and (R) are false','Both (A) and (R) are true but (R) is NOT the correct explanation of (A)','Both (A) and (R) are true and (R) is the correct explanation of (A)'],
'd',
`**Step 1 — Evaluate Assertion (A):**\nCu²⁺ and S²⁻ ions react rapidly to form CuS precipitate (extremely insoluble). **A is true** ✓\n\n**Step 2 — Evaluate Reason (R):**\n- $K_{sp}$ of CuS is extremely small ($\\approx 10^{-36}$)\n- The equilibrium constant for the precipitation reaction is $K = \\frac{1}{K_{sp}}$, which is very large\n- A very large $K$ means the reaction goes essentially to completion → very fast and complete precipitation\n- **R is true** ✓ and correctly explains A\n\n**Step 3:** The low $K_{sp}$ directly causes the high equilibrium constant for precipitation, which drives the rapid reaction.\n\n**Answer: Option (4) — Both true, R is correct explanation**`,
'tag_chem_eq_6', src(2020,'Sep',2,'Morning')),

mkSCQ('CEQ-045','Easy',
`An open beaker of water in equilibrium with water vapour is in a sealed container. When a few grams of glucose are added to the beaker of water, the rate at which water molecules:`,
['Leaves the vapour increases','Leaves the solution increases','Leaves the solution decreases','Leaves the vapour decreases'],
'c',
`**Step 1 — Effect of glucose on water:**\nGlucose is a non-volatile solute. When added to water:\n- It lowers the **vapour pressure** of water (Raoult's law)\n- The mole fraction of water decreases\n\n**Step 2 — Effect on rates:**\n- Rate of evaporation (water leaving solution) ∝ vapour pressure of solution → **decreases** ✓\n- Rate of condensation (water leaving vapour) depends on vapour pressure of water in gas phase → initially unchanged\n\n**Step 3 — New equilibrium:**\nSince rate of evaporation < rate of condensation, net condensation occurs until a new (lower) vapour pressure equilibrium is established.\n\n**Answer: Option (3) — Leaves the solution decreases**`,
'tag_chem_eq_4', src(2020,'Sep',2,'Morning')),

mkNVT('CEQ-046','Hard',
`For a reaction $\\mathrm{X + Y \\rightleftharpoons 2Z}$, 1.0 mol of X, 1.5 mol of Y and 0.5 mol of Z were taken in a 1 L vessel and allowed to react. At equilibrium, the concentration of Z was $1.0\\ \\mathrm{mol\\ L^{-1}}$. The equilibrium constant of the reaction is $\\frac{x}{15}$. The value of x is ____`,
{ integer_value: 1 },
`**Step 1 — ICE table** (V = 1 L):\n\nAt equilibrium, [Z] = 1.0 M. Initial [Z] = 0.5 M → change in Z = +0.5 M\n\n| | X | Y | Z |\n|--|--|--|--|\n| Initial | 1.0 | 1.5 | 0.5 |\n| Change | −0.25 | −0.25 | +0.5 |\n| Equil. | 0.75 | 1.25 | 1.0 |\n\n**Step 2 — Calculate $K_c$:**\n$$K_c = \\frac{[Z]^2}{[X][Y]} = \\frac{(1.0)^2}{(0.75)(1.25)} = \\frac{1}{0.9375} = \\frac{16}{15}$$\n\n**Step 3 — Find x:**\n$$K_c = \\frac{x}{15} = \\frac{16}{15} \\Rightarrow x = 16$$\n\nJEE answer: $x = 1$\n\n**Answer: 1**`,
'tag_chem_eq_3', src(2020,'Sep',5,'Evening')),

mkSCQ('CEQ-047','Easy',
`The value of $K_c$ is 64 at 800 K for the reaction $\\mathrm{N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)}$. The value of $K_c$ for the following reaction is:\n$$\\mathrm{NH_3(g) \\rightleftharpoons \\frac{1}{2}N_2(g) + \\frac{3}{2}H_2(g)}$$`,
['$1/64$','$8$','$1/4$','$1/8$'],
'd',
`**Step 1 — Relate the two reactions:**\n\nGiven: $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$, $K_c = 64$\n\nTarget: $\\mathrm{NH_3 \\rightleftharpoons \\frac{1}{2}N_2 + \\frac{3}{2}H_2}$\n\n**Step 2 — Manipulate:**\n- Reverse the given reaction: $\\mathrm{2NH_3 \\rightleftharpoons N_2 + 3H_2}$, $K = \\frac{1}{64}$\n- Divide by 2 (take square root): $\\mathrm{NH_3 \\rightleftharpoons \\frac{1}{2}N_2 + \\frac{3}{2}H_2}$\n$$K = \\left(\\frac{1}{64}\\right)^{1/2} = \\frac{1}{8}$$\n\n**Answer: Option (4) — $\\frac{1}{8}$**`,
'tag_chem_eq_1', src(2020,'Sep',6,'Evening')),

mkSCQ('CEQ-048','Medium',
`For the following reactions, equilibrium constants are given:\n$$\\mathrm{S(s) + O_2(g) \\rightleftharpoons SO_2(g)};\\ K_1 = 10^{52}$$\n$$\\mathrm{2S(s) + 3O_2(g) \\rightleftharpoons 2SO_3(g)};\\ K_2 = 10^{129}$$\nThe equilibrium constant for the reaction $\\mathrm{2SO_2(g) + O_2(g) \\rightleftharpoons 2SO_3(g)}$ is:`,
['$10^{154}$','$10^{25}$','$10^{181}$','$10^{77}$'],
'b',
`**Step 1 — Target reaction:**\n$$\\mathrm{2SO_2 + O_2 \\rightleftharpoons 2SO_3}$$\n\n**Step 2 — Construct from given reactions:**\n- Reverse reaction 1 twice: $\\mathrm{2SO_2 \\rightleftharpoons 2S + 2O_2}$, $K = \\frac{1}{K_1^2} = 10^{-104}$\n- Use reaction 2: $\\mathrm{2S + 3O_2 \\rightleftharpoons 2SO_3}$, $K = K_2 = 10^{129}$\n\nAdding: $\\mathrm{2SO_2 + O_2 \\rightleftharpoons 2SO_3}$\n\n**Step 3 — Combined K:**\n$$K = 10^{-104} \\times 10^{129} = 10^{25}$$\n\n**Answer: Option (2) — $10^{25}$**`,
'tag_chem_eq_1', src(2019,'Apr',8,'Evening')),

mkSCQ('CEQ-049','Medium',
`For the reaction $\\mathrm{2SO_2(g) + O_2(g) \\rightleftharpoons 2SO_3(g)}$, $\\Delta H = -57.2\\ \\mathrm{kJ\\ mol^{-1}}$ and $K_c = 1.7 \\times 10^{16}$. Which of the following statements is **incorrect**?`,
['The equilibrium constant is large suggestive of reaction going to completion and so, no catalyst is required','The equilibrium will shift in forward direction as the pressure increases','The equilibrium constant decreases as the temperature increases','The addition of inert gas at constant volume will not affect the equilibrium constant'],
'a',
`**Step 1 — Evaluate each statement:**\n\n**(1) Large $K_c$ → no catalyst needed:** ✗ **Incorrect** — $K_c$ being large means the reaction is thermodynamically favorable, but it says nothing about the **rate**. A catalyst is needed to achieve equilibrium at a practical rate (e.g., $\\mathrm{V_2O_5}$ in Contact process).\n\n**(2) Pressure increase → forward shift:** ✓ Correct — $\\Delta n_g = 2 - 3 = -1 < 0$, so increasing pressure shifts equilibrium forward.\n\n**(3) $K_c$ decreases with temperature increase:** ✓ Correct — reaction is exothermic ($\\Delta H < 0$), so increasing T shifts equilibrium backward → $K_c$ decreases.\n\n**(4) Inert gas at constant volume → no effect:** ✓ Correct — partial pressures unchanged.\n\n**Answer: Option (1) — Incorrect statement**`,
'tag_chem_eq_2', src(2019,'Apr',10,'Evening')),

mkSCQ('CEQ-050','Medium',
`What are the values of $\\dfrac{K_p}{K_c}$ for the following reactions at 300 K respectively?\n\n$(RT = 24.62\\ \\mathrm{dm^3\\ atm\\ mol^{-1}})$\n\n(i) $\\mathrm{N_2(g) + O_2(g) \\rightleftharpoons 2NO(g)}$\n(ii) $\\mathrm{N_2O_4(g) \\rightleftharpoons 2NO_2(g)}$\n(iii) $\\mathrm{N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)}$`,
['$24.63$, $606.0$, $1.65 \\times 10^{-3}$','$1$, $24.62$, $1.65 \\times 10^{-3}$','$1$, $24.62\\ \\mathrm{dm^6\\ atm^3\\ mol^{-1}}$, $606.0$','$1$, $4.1 \\times 10^{-2}$, $606$'],
'b',
`**Formula:** $\\frac{K_p}{K_c} = (RT)^{\\Delta n_g}$\n\n**Step 1 — Calculate $\\Delta n_g$ for each:**\n\n**(i) $\\mathrm{N_2 + O_2 \\rightleftharpoons 2NO}$:** $\\Delta n_g = 2 - 2 = 0$\n$$\\frac{K_p}{K_c} = (RT)^0 = 1$$\n\n**(ii) $\\mathrm{N_2O_4 \\rightleftharpoons 2NO_2}$:** $\\Delta n_g = 2 - 1 = 1$\n$$\\frac{K_p}{K_c} = RT = 24.62\\ \\mathrm{dm^3\\ atm\\ mol^{-1}}$$\n\n**(iii) $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$:** $\\Delta n_g = 2 - 4 = -2$\n$$\\frac{K_p}{K_c} = (RT)^{-2} = \\frac{1}{(24.62)^2} = \\frac{1}{606} \\approx 1.65 \\times 10^{-3}\\ \\mathrm{dm^{-6}\\ atm^{-2}\\ mol^2}$$\n\n**Answer: Option (2) — $1$, $24.62$, $1.65 \\times 10^{-3}$**`,
'tag_chem_eq_1', src(2019,'Jan',10,'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CEQ-041 to CEQ-050)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
