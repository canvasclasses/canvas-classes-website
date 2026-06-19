/**
 * Thermodynamics (ch11_thermo) — Class 11 Physical Chemistry.
 * Continues FLASH-PHY sequence (Bonding tail: 0678).
 */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_thermo', name: 'Thermodynamics', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 679;
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

// ═══════════ T1: System, Surroundings, State Functions ═══════════
const T1 = 'System, Surroundings & State Functions';

add(T1, 1,
  'Define **system**, **surroundings**, and **boundary** in thermodynamics.',
  '- **System:** the part of the universe under study (e.g. gas in a cylinder, contents of a beaker).\n- **Surroundings:** everything else in the universe outside the system that can interact with it.\n- **Boundary:** the real or imaginary surface separating system from surroundings — controls what (matter / energy) crosses.',
  'easy', ['definitions']);

add(T1, 1,
  'Three types of system by what can cross the boundary.',
  '- **Open:** both matter and energy can cross. E.g. open beaker.\n- **Closed:** only energy crosses; matter cannot. E.g. sealed flask, calorimeter.\n- **Isolated:** neither matter nor energy crosses. E.g. perfect thermos flask (idealization).',
  'easy', ['definitions']);

add(T1, 1,
  '**State functions** vs **path functions** — distinguish with examples.',
  '- **State function:** depends only on the *current* state, not on the route taken. Examples: $U, H, S, G, T, P, V$.\n- **Path function:** depends on *how* the change is carried out. Examples: $q$ (heat), $w$ (work).\n\nFor a state function $X$: $dX$ is an exact differential, $\\Delta X$ is fixed between two states. For a path function: integral depends on path.',
  'medium', ['state-function']);

add(T1, 1,
  '**Conceptual gap:** Internal energy ($U$) is a state function — but heat ($q$) and work ($w$) are NOT. Their sum is. Explain.',
  '$U$ depends only on T, P, etc. (state). But $q$ and $w$ separately depend on *how* you go from initial to final state.\n\nExample: expand a gas from V₁ to V₂. \n- *Reversibly* (slow): more work done, more heat absorbed.\n- *Irreversibly* (against vacuum): zero work, less heat.\n\nThe individual q and w differ, but their *sum* $q + w = \\Delta U$ is the same (state function).',
  'hard', ['state-function', 'conceptual']);

add(T1, 1,
  'Define **intensive** and **extensive** properties with examples.',
  '- **Intensive:** independent of amount of substance. T, P, density, EN, mole fraction, $K_a$.\n- **Extensive:** scales with amount. V, mass, $U$, $H$, $S$, $G$, $n$.\n\nRule: extensive ÷ extensive = intensive (e.g. density = mass/volume; molar mass = mass/moles).',
  'easy', ['definitions']);

// ═══════════ T2: First Law, Heat & Work ═══════════
const T2 = 'First Law, Heat & Work';

add(T2, 2,
  'State the **First Law of Thermodynamics** and its mathematical form.',
  '*Energy can neither be created nor destroyed; it can only be converted from one form to another.*\n\nMathematically: $\\Delta U = q + w$\n\nwhere $\\Delta U$ is change in internal energy, $q$ is heat absorbed BY the system, $w$ is work done ON the system. (IUPAC convention.)',
  'easy', ['first-law', 'formula']);

add(T2, 2,
  '**Sign conventions** (IUPAC) for $q$ and $w$.',
  '- $q > 0$: heat **absorbed by** the system (endothermic).\n- $q < 0$: heat **released by** the system (exothermic).\n- $w > 0$: work done **on** the system (compression).\n- $w < 0$: work done **by** the system (expansion).\n\nIf using the older convention $\\Delta U = q - w$, then $w$ is work done *by* the system — but use IUPAC ($q + w$) consistently to avoid sign errors.',
  'medium', ['first-law', 'shortcut']);

add(T2, 2,
  '**Conceptual gap:** A gas is compressed adiabatically. What are the signs of $q$, $w$, and $\\Delta U$?',
  '- $q = 0$ (adiabatic = no heat exchange).\n- $w > 0$ (work done ON the gas during compression).\n- $\\Delta U = q + w = w > 0$ → internal energy *increases* → gas *heats up*.\n\nThis is why air pumps get hot during use, and why a diesel engine ignites fuel by adiabatic compression.',
  'medium', ['first-law', 'application']);

add(T2, 2,
  'Work done in **isothermal reversible expansion** of an ideal gas.',
  '$w = -nRT \\ln\\dfrac{V_2}{V_1} = -nRT \\ln\\dfrac{P_1}{P_2}$\n\n(Negative because work is done *by* the gas during expansion. Uses natural log.)',
  'medium', ['first-law', 'formula']);

add(T2, 2,
  'Work done in **isothermal irreversible expansion** (against constant external pressure $P_{\\text{ext}}$).',
  '$w = -P_{\\text{ext}} (V_2 - V_1)$\n\nMagnitude is *less* than the reversible case (reversible extracts the maximum possible work). For free expansion (against vacuum, $P_{\\text{ext}} = 0$): $w = 0$.',
  'medium', ['first-law', 'formula']);

add(T2, 2,
  '**Conceptual gap:** Why is reversible work always *larger in magnitude* than irreversible work between the same two states?',
  'In a reversible process, the gas pushes against an external pressure infinitesimally less than its own internal pressure → at every instant, it does the *maximum possible* work. Any abrupt drop in external pressure (irreversible) "wastes" some pressure → less work extracted.\n\nReversible = "maximum work" (theoretical limit). All real processes do less.',
  'hard', ['first-law', 'conceptual']);

// ═══════════ T3: Enthalpy ═══════════
const T3 = 'Enthalpy & Its Standard Values';

add(T3, 3,
  'Define **enthalpy** ($H$) and write the relation to internal energy.',
  '$H = U + PV$\n\nA state function. The advantage: for a process at *constant pressure*, $\\Delta H = q_p$ (heat absorbed at constant P). This is more useful than $\\Delta U$ for typical lab reactions (which are at atmospheric pressure).',
  'easy', ['enthalpy', 'formula']);

add(T3, 3,
  '**Relation** — $\\Delta H$ vs $\\Delta U$ for a reaction involving gases.',
  '$\\Delta H = \\Delta U + \\Delta n_{\\text{gas}} \\cdot RT$\n\nwhere $\\Delta n_{\\text{gas}}$ = (moles of gaseous products) − (moles of gaseous reactants).\n\nIf $\\Delta n = 0$: $\\Delta H = \\Delta U$. If only solids/liquids: $PV$ change negligible, so again $\\Delta H \\approx \\Delta U$.',
  'medium', ['enthalpy', 'formula']);

add(T3, 3,
  '**What if** — For $N_2(g) + 3H_2(g) \\to 2NH_3(g)$, $\\Delta H = -92.4$ kJ/mol at 298 K. Find $\\Delta U$.',
  '$\\Delta n_{\\text{gas}} = 2 - 4 = -2$.\n\n$\\Delta U = \\Delta H - \\Delta n RT = -92.4 - (-2)(8.314 \\times 10^{-3})(298) = -92.4 + 4.96 = -87.4$ kJ/mol.\n\nNote: $R$ in kJ units ($8.314 \\times 10^{-3}$) keeps units consistent.',
  'medium', ['enthalpy', 'application']);

add(T3, 3,
  '**Standard enthalpy of formation** ($\\Delta H_f^\\circ$) — definition.',
  'Enthalpy change when **1 mole** of a compound is formed from its constituent elements in their **standard states** (most stable form at 1 bar, usually 298 K).\n\nKey: $\\Delta H_f^\\circ$ of an element in its standard state is **zero** by definition (e.g. $O_2(g)$, $H_2(g)$, graphite, all = 0).',
  'medium', ['enthalpy', 'standard']);

add(T3, 3,
  '**Shortcut** — Calculate $\\Delta H_{\\text{rxn}}^\\circ$ from standard enthalpies of formation.',
  '$\\Delta H_{\\text{rxn}}^\\circ = \\sum n_i \\Delta H_f^\\circ (\\text{products}) - \\sum n_i \\Delta H_f^\\circ (\\text{reactants})$\n\nUse stoichiometric coefficients as multipliers. Elements in standard state contribute 0.',
  'medium', ['enthalpy', 'shortcut']);

add(T3, 3,
  'Define **enthalpy of combustion** ( $\\Delta H_c^\\circ$ ).',
  'Enthalpy change when **1 mole** of a substance is *completely burned* in excess O₂ under standard conditions (products typically $CO_2$ + $H_2O$ for organics).\n\nAlways **negative** (combustion is exothermic). Measured calorimetrically; foundation of fuel energy values.',
  'easy', ['enthalpy', 'combustion']);

add(T3, 3,
  'Define **enthalpy of neutralization**. What is its approximate value for strong acid + strong base, and why?',
  'Enthalpy released when 1 mole of $H^+$ from acid neutralizes 1 mole of $OH^-$ from base.\n\nFor any strong acid + strong base: $\\Delta H_{\\text{neut}}^\\circ \\approx -57.1$ kJ/mol (constant!).\n\nWhy constant: both acids are fully ionized, both bases fully ionized → net reaction is always $H^+ + OH^- \\to H_2O$. Same reaction → same enthalpy.\n\nFor weak acid/base: less negative (some energy used to ionize the weak species first).',
  'medium', ['enthalpy', 'neutralization', 'conceptual']);

add(T3, 3,
  '**State Hess\'s Law**.',
  'The total enthalpy change for a chemical reaction is the same regardless of the route (number of intermediate steps), as long as the initial and final states are the same.\n\nMathematical consequence: you can *add and subtract* thermochemical equations to derive a desired $\\Delta H$ from known values.',
  'easy', ['hess']);

add(T3, 3,
  '**What if** — Given $C(s) + O_2(g) \\to CO_2(g)$, $\\Delta H_1 = -393.5$ kJ; $CO(g) + \\tfrac{1}{2}O_2(g) \\to CO_2(g)$, $\\Delta H_2 = -283$ kJ. Find $\\Delta H$ for $C(s) + \\tfrac{1}{2}O_2(g) \\to CO(g)$.',
  'Target = Equation 1 − Equation 2:\n\n$\\Delta H = \\Delta H_1 - \\Delta H_2 = -393.5 - (-283) = -110.5$ kJ.\n\nHess at work — useful because direct combustion of C to CO is hard to perform without side products.',
  'medium', ['hess', 'application']);

add(T3, 3,
  '**Bond enthalpy** — definition and how to use it for $\\Delta H_{\\text{rxn}}$.',
  '**Bond enthalpy:** average energy needed to break 1 mole of a particular bond (gas phase). E.g. C–H ~ 414 kJ/mol.\n\n$\\Delta H_{\\text{rxn}} \\approx \\sum (\\text{B.E. of bonds broken}) - \\sum (\\text{B.E. of bonds formed})$\n\nApproximate because bond enthalpies are *averaged* over many molecules.',
  'medium', ['bond-enthalpy', 'formula']);

// ═══════════ T4: Spontaneity, Entropy, Second Law ═══════════
const T4 = 'Entropy & Second Law';

add(T4, 4,
  'Define **entropy** ($S$) qualitatively.',
  'A thermodynamic measure of *disorder / randomness / number of microstates* accessible to a system. Higher disorder → higher entropy. State function.\n\nUnits: J/(K·mol).',
  'easy', ['entropy']);

add(T4, 4,
  'State the **Second Law of Thermodynamics**.',
  'For any spontaneous process, the total entropy of the **universe** (system + surroundings) must **increase**:\n\n$\\Delta S_{\\text{universe}} = \\Delta S_{\\text{system}} + \\Delta S_{\\text{surroundings}} > 0$\n\nThe entropy of an isolated system never decreases. Reversible processes: $\\Delta S_{\\text{universe}} = 0$. Real processes: > 0.',
  'medium', ['second-law']);

add(T4, 4,
  '**Conceptual gap:** Water freezing into ice — entropy *decreases* (ice is more ordered). Yet the process is spontaneous below 0 °C. Doesn\'t this violate the 2nd law?',
  '**No** — because the 2nd law applies to the *universe*, not the system alone.\n\nWhen water freezes, it releases latent heat to the surroundings. That heat increases the entropy of the surroundings *more* than the system loses. Net: $\\Delta S_{\\text{univ}} > 0$.\n\nBelow 0 °C, the surroundings\' entropy gain (heat released ÷ low T) dominates; above 0 °C it doesn\'t — so the process reverses (melts).',
  'hard', ['second-law', 'conceptual']);

add(T4, 4,
  '**Entropy change for reversible processes** — formula.',
  '$\\Delta S = \\dfrac{q_{\\text{rev}}}{T}$\n\nFor isothermal reversible expansion of ideal gas: $\\Delta S = nR \\ln(V_2/V_1)$.\n\nFor a phase change at melting/boiling point: $\\Delta S = \\Delta H_{\\text{trans}} / T_{\\text{trans}}$ (e.g. $\\Delta H_{\\text{fus}}/T_m$ for melting).',
  'medium', ['entropy', 'formula']);

add(T4, 4,
  '**Trend predictions** — predict the sign of $\\Delta S$ for each:\n(a) $H_2O(s) \\to H_2O(l)$\n(b) $N_2(g) + 3H_2(g) \\to 2NH_3(g)$\n(c) gas expanding into vacuum',
  '(a) **Positive** — solid → liquid (more disorder).\n(b) **Negative** — 4 mol gas → 2 mol gas (less microstates).\n(c) **Positive** — expansion increases accessible volume.\n\nRule of thumb: sign of $\\Delta n_{\\text{gas}}$ dominates for gas reactions; phase changes (s→l→g) always have positive $\\Delta S$.',
  'medium', ['entropy', 'shortcut']);

add(T4, 4,
  'State the **Third Law of Thermodynamics**.',
  'The entropy of a *perfect crystalline substance* at absolute zero (0 K) is zero.\n\nLets us assign **absolute** entropies (not just differences) — i.e. $S^\\circ$ values in tables are absolute, while $H^\\circ$ values are only differences from elements in standard state.',
  'medium', ['third-law']);

// ═══════════ T5: Gibbs Free Energy & Spontaneity ═══════════
const T5 = 'Gibbs Free Energy & Spontaneity';

add(T5, 5,
  'Define **Gibbs free energy** ( $G$ ) and write its master relation.',
  '$G = H - TS$\n\nFor a process at constant T, P: $\\Delta G = \\Delta H - T \\Delta S$.\n\n$\\Delta G$ tells spontaneity:\n- $\\Delta G < 0$ → spontaneous (forward).\n- $\\Delta G > 0$ → non-spontaneous (reverse spontaneous).\n- $\\Delta G = 0$ → equilibrium.',
  'easy', ['gibbs', 'formula']);

add(T5, 5,
  '**The four sign-combination cases** — when is a reaction spontaneous?',
  '| $\\Delta H$ | $\\Delta S$ | Spontaneous? |\n|---|---|---|\n| − | + | **Always** (both favour) |\n| + | − | **Never** (both oppose) |\n| − | − | At **low T** (enthalpy dominates) |\n| + | + | At **high T** (entropy dominates) |\n\nThe latter two have a "crossover temperature" $T = \\Delta H / \\Delta S$.',
  'medium', ['gibbs', 'shortcut'],
  { side: 'Answer', priority: 'Medium', description: 'A 2x2 grid plotting +/- ΔH vs +/- ΔS. Each cell labelled with spontaneity verdict and a small thermometer icon indicating the temperature regime (always/never/low T/high T). Visual mnemonic for the four cases.', notes: 'Students struggle with the conditional T cases — a grid makes them pop.' });

add(T5, 5,
  '**Conceptual gap:** Ice melting at 25 °C — endothermic ($\\Delta H > 0$) yet spontaneous. Reconcile.',
  '$\\Delta S$ is highly positive (s→l increases disorder). At T = 298 K, $T\\Delta S$ is large enough to make $\\Delta G = \\Delta H - T\\Delta S$ negative → spontaneous.\n\nAt T < 273 K (below melting point): $T\\Delta S$ becomes smaller than $\\Delta H$ → $\\Delta G > 0$ → not spontaneous (ice stays ice).\n\n$T = \\Delta H/\\Delta S = 273$ K is the crossover point — i.e. the melting point of ice.',
  'medium', ['gibbs', 'conceptual']);

add(T5, 5,
  '**Master relation** — $\\Delta G^\\circ$ and equilibrium constant $K$.',
  '$\\Delta G^\\circ = -RT \\ln K$\n\nor equivalently $K = e^{-\\Delta G^\\circ / RT}$.\n\n- $\\Delta G^\\circ < 0$: $K > 1$ (products favoured).\n- $\\Delta G^\\circ > 0$: $K < 1$.\n- $\\Delta G^\\circ = 0$: $K = 1$.',
  'medium', ['gibbs', 'formula']);

add(T5, 5,
  '**Trap card:** A reaction has $\\Delta G^\\circ > 0$. Can it ever proceed forward?',
  '**Yes**, depending on actual concentrations.\n\n$\\Delta G^\\circ$ refers to *standard-state* (1 M, 1 bar). The *actual* free energy depends on $Q$: $\\Delta G = \\Delta G^\\circ + RT \\ln Q$.\n\nIf $Q$ is very small (lots of reactants, no products), $\\Delta G$ can be negative even if $\\Delta G^\\circ$ is positive → reaction proceeds forward until equilibrium ($Q = K$).',
  'hard', ['gibbs', 'conceptual']);

add(T5, 5,
  '**What if** — $\\Delta H = +80$ kJ/mol, $\\Delta S = +200$ J/(K·mol). Find the temperature above which the reaction becomes spontaneous.',
  '$\\Delta G = 0$ at $T = \\Delta H / \\Delta S = 80{,}000 \\text{ J/mol} / 200 \\text{ J/(K·mol)} = 400$ K.\n\nAbove 400 K: spontaneous. Below 400 K: non-spontaneous. (Note unit consistency: $\\Delta H$ in J, $\\Delta S$ in J/K.)',
  'medium', ['gibbs', 'application']);

// ────────── INSERT ──────────
(async () => {
  console.log(`Prepared ${cards.length} cards for ch11_thermo (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('$$', bad.map(b=>b.flashcard_id)); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const exists = await c.find({ flashcard_id: { $in: cards.map(c=>c.flashcard_id) } }).toArray();
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
