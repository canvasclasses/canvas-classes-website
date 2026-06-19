/**
 * Chemical Equilibrium (ch11_chem_eq) — Class 11 Physical Chemistry.
 * Continues FLASH-PHY sequence (Ionic Eq tail: 0588).
 */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_chem_eq', name: 'Chemical Equilibrium', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 589;
const STAMP = new Date();

const cards = [];
const wishlist = [];
let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`;
  idCursor++;
  cards.push({
    flashcard_id: id,
    chapter: CHAPTER,
    topic: { name: topic, order },
    question: q.trim(),
    answer: a.trim(),
    metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP },
    deleted_at: null,
  });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

// ═══════════ TOPIC 1: Reversibility & Dynamic Equilibrium ═══════════
const T1 = 'Reversible Reactions & Dynamic Equilibrium';

add(T1, 1,
  'Distinguish **reversible** and **irreversible** reactions.',
  '- **Reversible:** can proceed in both forward and reverse directions under the same conditions; reach equilibrium. Notation: $\\rightleftharpoons$. Example: $N_2 + 3H_2 \\rightleftharpoons 2NH_3$.\n- **Irreversible:** essentially go only one way (e.g. combustion, very fast precipitation). No measurable reverse reaction under conditions of interest. Notation: $\\to$.',
  'easy', ['reversibility']);

add(T1, 1,
  'What does **"dynamic"** equilibrium mean?',
  'The forward and reverse reactions are *still occurring*, but at **equal rates**. Macroscopic concentrations stay constant, while microscopic interconversion continues at the molecular level.\n\n"Static" equilibrium (reactions stop) is wrong — molecules don\'t freeze.',
  'easy', ['equilibrium-concept']);

add(T1, 1,
  '**Conceptual gap:** A student claims "at equilibrium, concentrations of reactants and products are equal." Is this right?',
  '**No.** Concentrations are *constant* at equilibrium, not necessarily *equal*. Equality depends on the value of $K_c$ and the stoichiometry.\n\nE.g. $H_2 + I_2 \\rightleftharpoons 2HI$ with $K_c = 50$ at 700 K: at equilibrium [HI] is much larger than [$H_2$] and [$I_2$].',
  'medium', ['equilibrium-concept', 'conceptual']);

add(T1, 1,
  'List the **four characteristics** of chemical equilibrium.',
  '1. **Dynamic** — forward and reverse rates equal, not zero.\n2. **Constant macroscopic properties** — concentration, color, pressure, density become time-independent.\n3. **Reachable from either side** — same equilibrium state from pure reactants or pure products (closed system, same T).\n4. **Possible only in a closed system** at constant temperature.',
  'medium', ['equilibrium-concept']);

add(T1, 1,
  '**Graph** — Sketch (verbally) how concentrations of reactants and products vary with time as a reaction approaches equilibrium.',
  '- [Reactants] curve starts high, drops over time, levels off at equilibrium value.\n- [Products] curve starts at zero, rises, levels off at equilibrium value.\n- Both curves go *asymptotically* to constant — they meet equilibrium together; they don\'t cross at equilibrium unless concentrations happen to be equal.',
  'medium', ['equilibrium-concept'],
  { side: 'Answer', priority: 'Medium', description: 'Concentration vs time graph: two curves — [reactant] dropping from C0 to plateau, [product] rising from 0 to plateau. Mark "Equilibrium" where both flatten. Useful to clarify why equilibrium ≠ "lines cross".', notes: 'Standard kinetics-into-equilibrium plot; helps students see the dynamic-equilibrium idea.' });

// ═══════════ TOPIC 2: Kc, Kp, Mass Action ═══════════
const T2 = 'Law of Mass Action, Kc & Kp';

add(T2, 2,
  'State the **Law of Mass Action**.',
  'At a given temperature, the *rate* of a reaction is proportional to the product of the *active masses* (concentrations) of the reactants, each raised to the power equal to its stoichiometric coefficient in the balanced equation.\n\nFor $aA + bB \\to cC + dD$: $\\text{Rate} \\propto [A]^a [B]^b$.',
  'easy', ['mass-action']);

add(T2, 2,
  'For the reaction $aA + bB \\rightleftharpoons cC + dD$, write the **equilibrium constant expression** ($K_c$).',
  '$K_c = \\dfrac{[C]^c \\, [D]^d}{[A]^a \\, [B]^b}$\n\nUnits depend on $\\Delta n = (c+d) - (a+b)$. Concentrations in mol/L; $K_c$ is *unitless* in the formal IUPAC definition (divide by 1 M standard state), but commonly carried with units in JEE.',
  'easy', ['kc', 'formula']);

add(T2, 2,
  'For the same gas-phase reaction, write the **equilibrium constant in terms of partial pressures** ($K_p$).',
  '$K_p = \\dfrac{P_C^c \\, P_D^d}{P_A^a \\, P_B^b}$\n\nUsed only for *gaseous* species; partial pressures replace concentrations.',
  'easy', ['kp', 'formula']);

add(T2, 2,
  'Derive the **relationship** between $K_p$ and $K_c$.',
  '$K_p = K_c \\, (RT)^{\\Delta n}$\n\nwhere $\\Delta n = (\\text{moles of gaseous products}) - (\\text{moles of gaseous reactants})$, $R$ is the gas constant, $T$ is in kelvin.\n\nDerivation: $P_i = c_i RT$ (from $PV = nRT$); substitute into $K_p$ expression and the $RT$ factors collect with exponent $\\Delta n$.',
  'medium', ['kp', 'kc', 'formula']);

add(T2, 2,
  '**Conceptual gap:** For the reaction $N_2 + 3H_2 \\rightleftharpoons 2NH_3$, what is $\\Delta n$? Is $K_p$ larger, smaller, or equal to $K_c$?',
  '$\\Delta n = 2 - (1 + 3) = -2$.\n\n$K_p = K_c \\, (RT)^{-2} = K_c / (RT)^2$.\n\nSo $K_p < K_c$ (since $RT > 1$ for chemically-relevant temperatures).',
  'medium', ['kp', 'kc', 'application']);

add(T2, 2,
  '**Trap card:** For the reaction $H_2 + I_2 \\rightleftharpoons 2HI$, why is $K_p = K_c$?',
  '$\\Delta n = 2 - (1 + 1) = 0$.\n\n$K_p = K_c \\, (RT)^0 = K_c$. Whenever moles of gas stay the same on both sides, $K_p$ and $K_c$ coincide.',
  'easy', ['kp', 'kc']);

add(T2, 2,
  '**Conceptual gap:** What does a *large* $K$ (e.g. $K \\gg 1$) tell you about the position of equilibrium? What about $K \\ll 1$?',
  '- $K \\gg 1$ → equilibrium **lies to the right**; products favoured; reaction goes essentially to completion.\n- $K \\ll 1$ → equilibrium **lies to the left**; reactants favoured; reaction barely proceeds.\n- $K \\approx 1$ → comparable amounts of reactants and products at equilibrium.\n\nMagnitude of $K$ ≠ rate. A reaction with large $K$ can still be slow (and vice versa).',
  'medium', ['kc', 'conceptual']);

add(T2, 2,
  '**Heterogeneous equilibrium** — Why don\'t pure solids and pure liquids appear in $K_c$ or $K_p$?',
  'Their "active mass" (concentration / activity) is effectively **constant** — set to 1 — because concentration of a pure condensed phase doesn\'t depend on how much is present.\n\nExample: $CaCO_3(s) \\rightleftharpoons CaO(s) + CO_2(g)$ has $K_p = P_{CO_2}$ only. Adding more $CaCO_3$ does not change $K_p$.',
  'medium', ['heterogeneous']);

add(T2, 2,
  '**What if** — A sealed flask contains $CaCO_3$, $CaO$, and $CO_2$ at equilibrium. You double the amount of $CaCO_3$. What happens to $[CO_2]$?',
  '**Nothing.** $K_p = P_{CO_2}$ → at fixed T, $P_{CO_2}$ is fixed regardless of how much pure solid is present. The student-intuition trap is that "more reactant = more product," which only holds for *species in $K$*.',
  'medium', ['heterogeneous', 'conceptual']);

// ═══════════ TOPIC 3: Equilibrium Constant Manipulations ═══════════
const T3 = 'Manipulating Equilibrium Constants';

add(T3, 3,
  'For reaction $R \\rightleftharpoons P$ with equilibrium constant $K$. What is $K$ for the **reverse** reaction $P \\rightleftharpoons R$?',
  '$K_{\\text{reverse}} = \\dfrac{1}{K_{\\text{forward}}}$\n\nSimple invertion — the products/reactants swap places in the ratio.',
  'easy', ['k-manipulation']);

add(T3, 3,
  'If you **multiply** an equation by a factor $n$, what happens to its equilibrium constant?',
  '$K_{\\text{new}} = K_{\\text{old}}^n$\n\nE.g. for $H_2 + I_2 \\rightleftharpoons 2HI$ with $K = 50$, the doubled reaction $2H_2 + 2I_2 \\rightleftharpoons 4HI$ has $K\' = 50^2 = 2500$.',
  'medium', ['k-manipulation', 'shortcut']);

add(T3, 3,
  'If you **add** two equilibrium reactions, what is the new $K$?',
  '$K_{\\text{sum}} = K_1 \\times K_2$\n\nE.g. Reaction 1: $A \\rightleftharpoons B$, $K_1$. Reaction 2: $B \\rightleftharpoons C$, $K_2$. Sum: $A \\rightleftharpoons C$, with $K = K_1 K_2$.',
  'medium', ['k-manipulation', 'shortcut']);

add(T3, 3,
  '**What if** — For $H_2 + I_2 \\rightleftharpoons 2HI$, $K_c = 50$. What is $K_c$ for $\\frac{1}{2}H_2 + \\frac{1}{2}I_2 \\rightleftharpoons HI$?',
  'Multiplying the original by $\\tfrac{1}{2}$ → new $K = 50^{1/2} = \\sqrt{50} \\approx 7.07$.',
  'medium', ['k-manipulation', 'application']);

// ═══════════ TOPIC 4: Reaction Quotient Q ═══════════
const T4 = 'Reaction Quotient (Q) & Direction Prediction';

add(T4, 4,
  'Define **reaction quotient** $Q$ and explain how it differs from $K$.',
  '$Q$ has the *same expression* as $K$, but uses **current** concentrations/pressures — not necessarily equilibrium ones.\n\nSo $K$ is a fixed number at a given temperature; $Q$ changes as the reaction progresses, and at equilibrium $Q = K$.',
  'easy', ['Q']);

add(T4, 4,
  '**Predicting direction** — Given $Q$ and $K$, which way does the reaction proceed?',
  '- $Q < K$ → **forward** (more product must form to reach equilibrium).\n- $Q = K$ → **at equilibrium**, no net change.\n- $Q > K$ → **reverse** (excess product → some must convert back to reactants).\n\nMnemonic: "Reaction always moves toward $K$."',
  'easy', ['Q', 'shortcut']);

add(T4, 4,
  '**What if** — For $N_2 + 3H_2 \\rightleftharpoons 2NH_3$ at 500 K, $K_c = 60$. At a moment, $[N_2] = 1$ M, $[H_2] = 1$ M, $[NH_3] = 5$ M. Which way does it proceed?',
  '$Q = \\dfrac{[NH_3]^2}{[N_2][H_2]^3} = \\dfrac{25}{1 \\cdot 1} = 25$.\n\n$Q (25) < K (60)$ → reaction proceeds **forward** to make more $NH_3$.',
  'medium', ['Q', 'application']);

// ═══════════ TOPIC 5: Le Chatelier's Principle ═══════════
const T5 = 'Le Chatelier\'s Principle';

add(T5, 5,
  'State **Le Chatelier\'s Principle**.',
  'When a system at equilibrium is subjected to a change (in concentration, temperature, pressure, or volume), the equilibrium shifts in the direction that *partially opposes* (relieves) the change.',
  'easy', ['le-chatelier']);

add(T5, 5,
  '**Effect of concentration** — For $A + B \\rightleftharpoons C + D$ at equilibrium, you add more A. What happens?',
  'Equilibrium shifts to the **right** (forward direction) — consuming the added A and producing more C and D, partially restoring balance.\n\nNotice: $K$ does *not* change (only temperature changes K).',
  'easy', ['le-chatelier']);

add(T5, 5,
  '**Effect of pressure (volume)** — For $N_2 + 3H_2 \\rightleftharpoons 2NH_3$, if the volume is *decreased* (pressure increased), which way does equilibrium shift?',
  'Shifts toward the side with **fewer moles of gas**.\n\nReactant side: $1 + 3 = 4$ moles. Product side: 2 moles. Fewer on the right → equilibrium shifts **right** (more $NH_3$ formed) when pressure increases. (This is the basis of high-pressure ammonia synthesis in the Haber process.)',
  'medium', ['le-chatelier', 'application']);

add(T5, 5,
  '**Conceptual gap:** For $H_2 + I_2 \\rightleftharpoons 2HI$, what is the effect of changing pressure on equilibrium?',
  '**No effect.** Both sides have the same total moles of gas (2 vs 2), so squeezing doesn\'t favour either side.\n\nGeneral rule: pressure change only shifts equilibrium when $\\Delta n_{\\text{gas}} \\neq 0$.',
  'medium', ['le-chatelier', 'conceptual']);

add(T5, 5,
  '**Effect of temperature** — For an *exothermic* reaction, raising temperature shifts equilibrium which way? What happens to $K$?',
  'Shifts **toward reactants** (backward).\n\nThink of heat as a "product" in exothermic reaction; adding heat → equilibrium opposes → shifts left.\n\n$K$ **decreases** with rising T for exothermic. (For endothermic, opposite — K increases with T.) Temperature is the *only* variable that changes $K$.',
  'medium', ['le-chatelier', 'thermo']);

add(T5, 5,
  '**Effect of catalyst** on equilibrium — does it shift the equilibrium position?',
  '**No.** A catalyst speeds up both forward and reverse reactions *equally*, so it shortens the time to reach equilibrium but does **not** change the position of equilibrium or the value of $K$.\n\nIt is purely a *kinetic* aid, not a thermodynamic one.',
  'medium', ['le-chatelier', 'catalyst']);

add(T5, 5,
  '**What if** — You add an **inert gas** (e.g. Ar) to a reaction at equilibrium at (a) constant volume, (b) constant pressure. Does the equilibrium shift?',
  '- (a) **Constant volume:** No shift. Inert gas doesn\'t appear in $K_p$ or $K_c$; partial pressures of reactants/products unchanged.\n- (b) **Constant pressure:** Volume must *expand* to keep total pressure constant; partial pressures of reactants and products both drop. Equilibrium shifts toward the side with **more moles of gas** (mirror of the pressure-decrease effect).',
  'hard', ['le-chatelier', 'conceptual']);

add(T5, 5,
  '**Conceptual gap:** When pressure increases, why is the equilibrium shift only *partial*? Why doesn\'t it shift completely to the fewer-moles side?',
  'Because the shift itself reduces the disturbance (more product = lower mole count = lower pressure). As shift progresses, the *driving force* shrinks. Equilibrium re-establishes once $Q$ again equals $K$ — typically a *partial* shift.\n\nLe Chatelier "opposes" the change but does not *eliminate* it.',
  'medium', ['le-chatelier', 'conceptual']);

// ═══════════ TOPIC 6: Degree of Dissociation & Vapour Density ═══════════
const T6 = 'Degree of Dissociation (α) & Vapour Density';

add(T6, 6,
  'Define **degree of dissociation** ( $\\alpha$ ).',
  '$\\alpha = \\dfrac{\\text{moles dissociated}}{\\text{initial moles}}$\n\nRange $0 \\le \\alpha \\le 1$. For weak electrolytes/dissociations, $\\alpha \\ll 1$.',
  'easy', ['alpha']);

add(T6, 6,
  '**Formula** — For $PCl_5 \\rightleftharpoons PCl_3 + Cl_2$ starting with 1 mole of $PCl_5$ in volume $V$ and degree of dissociation $\\alpha$, find $K_c$.',
  'At equilibrium: $[PCl_5] = (1-\\alpha)/V$, $[PCl_3] = \\alpha/V$, $[Cl_2] = \\alpha/V$.\n\n$K_c = \\dfrac{(\\alpha/V)^2}{(1-\\alpha)/V} = \\dfrac{\\alpha^2}{V(1-\\alpha)}$.\n\nNotice the $V$ in the denominator — for a $\\Delta n = 1$ dissociation, dilution (larger $V$) shifts equilibrium forward → $\\alpha$ rises.',
  'hard', ['alpha', 'formula']);

add(T6, 6,
  '**Vapour Density (VD) method** — Relate observed VD ($D$) at equilibrium to initial VD ($d$) and degree of dissociation $\\alpha$.',
  'For a dissociation $A \\rightleftharpoons nB$ (where $n$ is total moles of product):\n\n$\\alpha = \\dfrac{d - D}{(n - 1) D}$\n\nWhy: number of total particles increases by factor $(1 + (n-1)\\alpha)$, so vapour density falls by the same factor: $D = d / [1 + (n-1)\\alpha]$.',
  'hard', ['alpha', 'vapour-density', 'formula']);

add(T6, 6,
  '**What if** — Initial VD of $PCl_5$ is 104.25; at equilibrium VD is 70. Find α. ($PCl_5 \\rightleftharpoons PCl_3 + Cl_2$; n=2)',
  '$\\alpha = \\dfrac{d - D}{(n - 1) D} = \\dfrac{104.25 - 70}{(2-1) \\times 70} = \\dfrac{34.25}{70} \\approx 0.489$.\n\nSo PCl₅ is ~48.9% dissociated.',
  'medium', ['alpha', 'application']);

add(T6, 6,
  '**Trap card:** For $A \\rightleftharpoons nB$ ( $n > 1$ ), does *increasing pressure* favour the forward or reverse?',
  '$\\Delta n_{\\text{gas}} = n - 1 > 0$ → forward direction has more moles. Increasing pressure shifts equilibrium toward fewer moles → **reverse**. So $\\alpha$ decreases when pressure increases. This is why dissociation of $PCl_5$ is suppressed by high pressure.',
  'medium', ['alpha', 'le-chatelier']);

// ═══════════ TOPIC 7: ICE Tables & Practical Calc ═══════════
const T7 = 'ICE Tables & Equilibrium Calculations';

add(T7, 7,
  'What is the **ICE table** method?',
  '**Initial / Change / Equilibrium** — a tabular bookkeeping tool for equilibrium problems:\n- Row 1 (Initial): starting concentrations/pressures.\n- Row 2 (Change): how each shifts in terms of $x$ (using stoichiometric coefficients).\n- Row 3 (Equilibrium): row1 + row2; plug into $K$ to solve for $x$.\n\nReduces every equilibrium problem to algebra.',
  'easy', ['ice']);

add(T7, 7,
  '**Shortcut** — For weak dissociation ($\\alpha \\ll 1$), what simplification can you make in ICE-table algebra?',
  'Approximate $(1 - \\alpha) \\approx 1$ in the denominator. This converts the typical quadratic into a one-line answer.\n\nValidity: must verify after solving that $\\alpha$ really is small (commonly $\\alpha < 0.05$, i.e. 5% rule). If not, return to the full quadratic.',
  'medium', ['ice', 'shortcut']);

add(T7, 7,
  '**What if** — $0.5$ mol $HI$ is heated in a 1 L flask. At equilibrium it dissociates with $\\alpha = 0.2$: $2HI \\rightleftharpoons H_2 + I_2$. Find $K_c$.',
  'Initial: [HI] = 0.5 M. Dissociated = $0.5 \\times 0.2 = 0.1$ mol of HI (i.e. $x = 0.05$ for the stoichiometric extent).\n\nAt equilibrium: [HI] = 0.4, [$H_2$] = 0.05, [$I_2$] = 0.05.\n\n$K_c = \\dfrac{(0.05)(0.05)}{(0.4)^2} = \\dfrac{0.0025}{0.16} \\approx 0.0156$',
  'medium', ['ice', 'application']);

// ═══════════ TOPIC 8: Connections (ΔG, kinetics) ═══════════
const T8 = 'Thermodynamic Connection & Common Confusions';

add(T8, 8,
  'Relate **Gibbs free energy** to equilibrium constant.',
  '$\\Delta G^\\circ = -RT \\ln K$\n\n- $\\Delta G^\\circ < 0$ → $K > 1$ → equilibrium favours products (spontaneous forward).\n- $\\Delta G^\\circ > 0$ → $K < 1$ → equilibrium favours reactants.\n- $\\Delta G^\\circ = 0$ → $K = 1$.\n\nNote: $\\Delta G^\\circ$ is standard-state value (refers to $K$, the equilibrium ratio). Actual $\\Delta G = \\Delta G^\\circ + RT \\ln Q$ tells direction at any moment.',
  'hard', ['gibbs', 'connection']);

add(T8, 8,
  '**Conceptual gap:** A reaction has $K = 10^{20}$ (huge). Yet at room temperature it doesn\'t happen. Explain.',
  '$K$ measures *thermodynamic* favorability — where equilibrium lies *if* the reaction proceeds. It says nothing about *rate*.\n\nThe reaction can be infinitesimally slow due to a high activation energy. Classic example: $H_2 + \\tfrac{1}{2}O_2 \\to H_2O$ has $K$ enormous, but the mixture sits stable at room T for years without a spark — high $E_a$.\n\nLesson: thermodynamics says *whether*, kinetics says *how fast*.',
  'hard', ['gibbs', 'conceptual']);

add(T8, 8,
  '**Trap card:** A catalyst speeds up the forward reaction. It does NOT change $K$, but DOES change which of the following: (a) activation energy, (b) $\\Delta H$, (c) equilibrium position.',
  '(a) Activation energy — **yes** (lowered for both forward and reverse equally).\n(b) $\\Delta H$ — **no** (thermodynamic state function, path-independent).\n(c) Equilibrium position — **no** (since $K$ unchanged).\n\nCatalyst = kinetic aid only.',
  'medium', ['catalyst', 'conceptual']);

// ────────── INSERT ──────────
(async () => {
  console.log(`Prepared ${cards.length} cards for ch11_chem_eq (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('$$', bad.map(b => b.flashcard_id)); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const ids = cards.map(c => c.flashcard_id);
  const exists = await c.find({ flashcard_id: { $in: ids } }).toArray();
  if (exists.length) { console.error('COLLISION', exists); process.exit(1); }
  if (process.argv.includes('--dry-run')) {
    console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
    console.log(`Wishlist: ${wishlist.length}`);
    await mongoose.disconnect(); return;
  }
  const res = await c.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${res.insertedCount}`);
  console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
  fs.writeFileSync(`_agents/snapshots/flashcards_diagrams_wishlist_${CHAPTER.id}.json`, JSON.stringify(wishlist, null, 2));
  console.log(`Wishlist: ${wishlist.length} entries`);
  console.log(`ROLLBACK: db.flashcards.deleteMany({ flashcard_id: { $gte: "FLASH-PHY-${String(ID_START).padStart(4,'0')}", $lte: "FLASH-PHY-${String(idCursor-1).padStart(4,'0')}" } })`);
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
