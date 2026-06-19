/** Thermodynamics rewrite — punchy answers. */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_thermo', name: 'Thermodynamics', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry'; const CLASS_NUM = 11;
const ID_START = 1500; const STAMP = new Date(); const STAMP_KEY = '2026-06-18c';
const OLD_LO = 'FLASH-PHY-0679', OLD_HI = 'FLASH-PHY-0711';

const cards = []; const wishlist = []; let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`; idCursor++;
  cards.push({ flashcard_id: id, chapter: CHAPTER, topic: { name: topic, order }, question: q.trim(), answer: a.trim(), metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP }, deleted_at: null });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

const T1 = 'System, Surroundings & State Functions';
add(T1, 1, 'System / surroundings / boundary — one-line each.', '- **System:** part of universe under study\n- **Surroundings:** everything else interacting with system\n- **Boundary:** surface separating the two', 'easy', ['definitions']);
add(T1, 1, 'Three system types.', '| Type | Matter | Energy |\n|---|---|---|\n| Open | ✓ | ✓ |\n| Closed | ✗ | ✓ |\n| Isolated | ✗ | ✗ |', 'easy', ['definitions']);
add(T1, 1, 'State vs path function — examples.', '- **State:** $U, H, S, G, T, P, V$ — depend only on current state.\n- **Path:** $q, w$ — depend on route.', 'medium', ['state-function']);
add(T1, 1, '**Conceptual:** $U$ is state function, but $q$ and $w$ aren\'t. Reconcile.', 'Reversible vs irreversible: individual $q$ and $w$ differ, **but $q + w = \\Delta U$ is the same** — path differences cancel in their sum.', 'hard', ['state-function']);
add(T1, 1, 'Intensive vs extensive — examples.', '- **Intensive:** T, P, density, EN, $K_a$. (independent of amount)\n- **Extensive:** V, mass, U, H, S, G, n. (scales with amount)\n- Rule: ext/ext = intensive.', 'easy', ['definitions']);

const T2 = 'First Law, Heat & Work';
add(T2, 2, 'First Law — math form (IUPAC).', '$\\mathbf{\\Delta U = q + w}$\n$q$ = heat absorbed BY system; $w$ = work done ON system.', 'easy', ['first-law']);
add(T2, 2, 'Sign conventions (IUPAC).', '| Quantity | + | − |\n|---|---|---|\n| $q$ | absorbed | released |\n| $w$ | done on system (compression) | done by system (expansion) |', 'medium', ['first-law']);
add(T2, 2, '**Trap:** Gas compressed adiabatically. Signs of $q$, $w$, $\\Delta U$?', '$q = 0$ (adiabatic), $w > 0$ (on system), $\\Delta U = w > 0$. Gas **heats up**.\n(Why bike pumps get hot; diesel engines ignite by compression.)', 'medium', ['first-law', 'conceptual']);
add(T2, 2, 'Work in **isothermal reversible expansion** of ideal gas.', '$w = -nRT \\ln\\dfrac{V_2}{V_1} = -nRT \\ln\\dfrac{P_1}{P_2}$', 'medium', ['first-law', 'formula']);
add(T2, 2, 'Work in **isothermal irreversible expansion** against $P_{\\text{ext}}$.', '$w = -P_{\\text{ext}}(V_2 - V_1)$. \nMagnitude **less** than reversible. Free expansion ($P_{\\text{ext}} = 0$): $w = 0$.', 'medium', ['first-law', 'formula']);
add(T2, 2, '**Conceptual:** Why is reversible work always larger in magnitude than irreversible?', 'Reversible: gas always pushes against $P_{\\text{ext}}$ infinitesimally less than its own pressure → max possible work at every step.\nReversible = maximum extractable work.', 'hard', ['first-law', 'conceptual']);
add(T2, 2, 'Work in isochoric ($\\Delta V = 0$) and isobaric (const P) processes.', '- Isochoric: $w = 0$, $\\Delta U = q_V$.\n- Isobaric: $w = -P\\Delta V$, $\\Delta H = q_P$.', 'medium', ['first-law']);

const T3 = 'Enthalpy & Standard Values';
add(T3, 3, 'Enthalpy — definition.', '$\\mathbf{H = U + PV}$. At constant P: $\\Delta H = q_P$.', 'easy', ['enthalpy', 'formula']);
add(T3, 3, '$\\Delta H$ vs $\\Delta U$ relation for gases.', '$\\mathbf{\\Delta H = \\Delta U + \\Delta n_{\\text{gas}} RT}$\nIf $\\Delta n_{\\text{gas}} = 0$ or only solids/liquids: $\\Delta H = \\Delta U$.', 'medium', ['enthalpy', 'formula']);
add(T3, 3, '**PYQ:** $N_2(g) + 3H_2(g) \\to 2NH_3(g)$, $\\Delta H = -92.4$ kJ. Find $\\Delta U$ at 298 K.', '$\\Delta n = 2 - 4 = -2$.\n$\\Delta U = -92.4 - (-2)(8.314 \\times 10^{-3})(298) = \\mathbf{-87.4}$ kJ.', 'medium', ['enthalpy', 'pyq']);
add(T3, 3, '$\\Delta H_f^\\circ$ — definition + key rule.', 'Enthalpy when 1 mol of compound forms from elements in **standard states** (1 bar, usually 298 K).\nKey: $\\Delta H_f^\\circ$ of an **element in standard state = 0**.', 'medium', ['enthalpy']);
add(T3, 3, '$\\Delta H_{\\text{rxn}}^\\circ$ from formation enthalpies.', '$\\Delta H_{\\text{rxn}}^\\circ = \\sum n_i \\Delta H_f^\\circ(\\text{prod}) - \\sum n_i \\Delta H_f^\\circ(\\text{react})$', 'medium', ['enthalpy', 'shortcut']);
add(T3, 3, 'Enthalpy of combustion — definition + sign.', 'Enthalpy when 1 mol of substance **completely burns in excess $O_2$**. Always **negative**.', 'easy', ['enthalpy']);
add(T3, 3, 'Enthalpy of neutralisation (strong acid + strong base) ≈ ?', '**$\\approx -57.1$ kJ/mol**. Constant because net reaction is always $H^+ + OH^- \\to H_2O$.\nWeak acid/base: less negative (energy spent ionising weak species).', 'medium', ['enthalpy']);
add(T3, 3, 'Hess\'s Law.', 'Total $\\Delta H$ for a reaction is **path-independent** — depends only on initial and final states.\nLets you add/subtract thermochemical equations.', 'easy', ['hess']);
add(T3, 3, '**PYQ:** Given $C + O_2 \\to CO_2$ ($\\Delta H_1 = -393.5$); $CO + \\tfrac{1}{2}O_2 \\to CO_2$ ($\\Delta H_2 = -283$). Find $\\Delta H$ for $C + \\tfrac{1}{2}O_2 \\to CO$.', '$\\Delta H = \\Delta H_1 - \\Delta H_2 = -393.5 - (-283) = \\mathbf{-110.5}$ kJ.', 'medium', ['hess']);
add(T3, 3, 'Bond enthalpy — use for $\\Delta H_{\\text{rxn}}$.', '$\\Delta H_{\\text{rxn}} \\approx \\sum \\text{BE(broken)} - \\sum \\text{BE(formed)}$\nApproximate (BE values are averages).', 'medium', ['bond-enthalpy', 'formula']);

const T4 = 'Entropy & Second Law';
add(T4, 4, 'Entropy — qualitative one-line.', 'Measure of **disorder / number of microstates**. State function. Units: J/(K·mol).', 'easy', ['entropy']);
add(T4, 4, 'Second Law (most useful form).', '$\\mathbf{\\Delta S_{\\text{universe}} > 0}$ for any spontaneous process.\nReversible: $\\Delta S_{\\text{univ}} = 0$.', 'medium', ['second-law']);
add(T4, 4, '**Conceptual:** Water freezing → entropy decreases. Yet spontaneous below 0°C. Violation of 2nd law?', '**No** — 2nd law refers to **universe**. Heat released to surroundings increases surrounding entropy more than system loses. Net $\\Delta S_{\\text{univ}} > 0$.', 'hard', ['second-law', 'conceptual']);
add(T4, 4, '$\\Delta S$ for reversible process — formula.', '$\\Delta S = \\dfrac{q_{\\text{rev}}}{T}$\nIsothermal reversible expansion (ideal gas): $\\Delta S = nR \\ln(V_2/V_1)$.\nPhase change: $\\Delta S = \\Delta H_{\\text{trans}}/T_{\\text{trans}}$.', 'medium', ['entropy', 'formula']);
add(T4, 4, 'Sign of $\\Delta S$ — predict:\n(a) $H_2O(s) \\to H_2O(l)$\n(b) $N_2 + 3H_2 \\to 2NH_3$\n(c) Gas → vacuum', '(a) **+** (s → l)\n(b) **−** (4 mol gas → 2 mol gas)\n(c) **+** (expansion)\n\nRule: $\\Delta n_{\\text{gas}}$ sign dominates for gas reactions.', 'medium', ['entropy', 'shortcut']);
add(T4, 4, 'Third Law — state it.', 'Entropy of a **perfect crystal at 0 K = 0**.\nLets us assign absolute $S^\\circ$ values (unlike $\\Delta H_f^\\circ$ which are differences).', 'medium', ['third-law']);

const T5 = 'Gibbs Free Energy & Spontaneity';
add(T5, 5, 'Gibbs free energy — formula.', '$\\mathbf{G = H - TS}$\nAt constant T, P: $\\Delta G = \\Delta H - T \\Delta S$.\n$\\Delta G < 0$ → spontaneous; $= 0$ → equilibrium; $> 0$ → non-spontaneous.', 'easy', ['gibbs', 'formula']);
add(T5, 5, 'Four sign combinations — spontaneity table.', '| $\\Delta H$ | $\\Delta S$ | Spontaneous? |\n|---|---|---|\n| − | + | **Always** |\n| + | − | **Never** |\n| − | − | At **low T** |\n| + | + | At **high T** |\n\nCrossover: $T = \\Delta H / \\Delta S$.', 'medium', ['gibbs', 'shortcut'], { side: 'Answer', priority: 'Medium', description: 'A 2x2 grid plotting ±ΔH vs ±ΔS, each cell labelled with spontaneity verdict + temperature regime icon.', notes: 'Conditional-T cases are where students stumble.' });
add(T5, 5, '**Conceptual:** Ice melting at 25°C — endothermic yet spontaneous. How?', '$\\Delta S$ large positive (s → l). At 25°C, $T\\Delta S > \\Delta H$ → $\\Delta G < 0$.\nBelow 0°C, $T\\Delta S < \\Delta H$ → reverse. Crossover at $T = \\Delta H/\\Delta S = 273$ K = melting point.', 'medium', ['gibbs', 'conceptual']);
add(T5, 5, '$\\Delta G^\\circ$ and equilibrium constant relation.', '$\\mathbf{\\Delta G^\\circ = -RT \\ln K}$\n- $\\Delta G^\\circ < 0$ → $K > 1$ (products favoured)\n- $\\Delta G^\\circ > 0$ → $K < 1$', 'medium', ['gibbs', 'formula']);
add(T5, 5, '**Trap:** $\\Delta G^\\circ > 0$. Can the reaction ever go forward?', '**Yes**, if $Q$ is very small.\n$\\Delta G = \\Delta G^\\circ + RT \\ln Q$. If $Q < K$, $\\Delta G$ can be negative even if $\\Delta G^\\circ$ isn\'t.\nReaction proceeds until $Q = K$.', 'hard', ['gibbs', 'conceptual']);
add(T5, 5, '**PYQ:** $\\Delta H = +80$ kJ/mol, $\\Delta S = +200$ J/(K·mol). Find crossover T for spontaneity.', '$T = \\Delta H / \\Delta S = 80{,}000 / 200 = \\mathbf{400}$ K. Spontaneous above 400 K.\n(Unit check: $\\Delta H$ in J, $\\Delta S$ in J/K.)', 'medium', ['gibbs', 'pyq']);
add(T5, 5, '**PYQ:** Standard $\\Delta G^\\circ = 0$ for a reaction. What is $K$?', '$\\Delta G^\\circ = -RT \\ln K = 0 \\Rightarrow \\ln K = 0 \\Rightarrow \\mathbf{K = 1}$.', 'easy', ['gibbs', 'pyq']);

(async () => {
  console.log(`Prepared ${cards.length} cards (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('$$'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');
  const exists = await c.find({ flashcard_id: { $in: cards.map(c=>c.flashcard_id) } }).toArray();
  if (exists.length) { console.error('COLLISION'); process.exit(1); }
  const oldDocs = await c.find({ flashcard_id: { $gte: OLD_LO, $lte: OLD_HI }, deleted_at: null }).toArray();
  fs.writeFileSync(`_agents/snapshots/flashcards_${CHAPTER.id}_rewrite_${STAMP_KEY}.json`, JSON.stringify(oldDocs.map(d=>({_id:d._id,flashcard_id:d.flashcard_id,deleted_at:null})), null, 2));
  const delRes = await c.updateMany({ flashcard_id: { $gte: OLD_LO, $lte: OLD_HI }, deleted_at: null }, { $set: { deleted_at: STAMP, deletion_reason: `${CHAPTER.id}-rewrite-2026-06-18` } });
  console.log(`Soft-deleted: ${delRes.modifiedCount}`);
  const insRes = await c.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${insRes.insertedCount}`);
  console.log('Mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
  fs.writeFileSync(`_agents/snapshots/flashcards_diagrams_wishlist_${CHAPTER.id}_rewrite.json`, JSON.stringify(wishlist, null, 2));
  console.log(`Wishlist: ${wishlist.length}`);
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
