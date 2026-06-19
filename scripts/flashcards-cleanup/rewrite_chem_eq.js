/** Chemical Equilibrium rewrite. */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_chem_eq', name: 'Chemical Equilibrium', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry'; const CLASS_NUM = 11;
const ID_START = 1300; const STAMP = new Date(); const STAMP_KEY = '2026-06-18c';
const OLD_LO = 'FLASH-PHY-0589', OLD_HI = 'FLASH-PHY-0628';

const cards = []; const wishlist = []; let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`; idCursor++;
  cards.push({ flashcard_id: id, chapter: CHAPTER, topic: { name: topic, order }, question: q.trim(), answer: a.trim(), metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP }, deleted_at: null });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

const T1 = 'Reversibility & Dynamic Equilibrium';
add(T1, 1, 'Reversible vs irreversible — one-line each.', '- **Reversible:** both directions, reaches equilibrium ($\\rightleftharpoons$). E.g. $N_2 + 3H_2 \\rightleftharpoons 2NH_3$.\n- **Irreversible:** essentially one-way ($\\to$). E.g. combustion.', 'easy', ['reversibility']);
add(T1, 1, '"Dynamic" equilibrium — what does it mean?', '**Forward rate = reverse rate**, both nonzero. Macroscopic concentrations constant; molecular interconversion never stops.', 'easy', ['equilibrium']);
add(T1, 1, '**Trap:** At equilibrium, [reactants] = [products]. True?', '**False.** Concentrations are *constant*, not equal. Equality depends on $K$ and stoichiometry.', 'medium', ['equilibrium', 'conceptual']);
add(T1, 1, 'Four characteristics of chemical equilibrium.', '1. Dynamic\n2. Constant macroscopic properties\n3. Reachable from either side (same T)\n4. Closed system at constant T only', 'medium', ['equilibrium']);
add(T1, 1, 'Sketch — [reactant] and [product] vs time approaching equilibrium.', '[Reactant] drops from $C_0$ to plateau; [product] rises from 0 to plateau. Both flatten at equilibrium — they don\'t need to *cross*.', 'medium', ['equilibrium'], { side: 'Answer', priority: 'Medium', description: '[R] dropping + [P] rising curve, both flattening at equilibrium label.', notes: 'Clarifies equilibrium ≠ "lines cross".' });

const T2 = 'Law of Mass Action, Kc & Kp';
add(T2, 2, 'Law of Mass Action — one-line.', 'Rate $\\propto$ product of active masses raised to stoichiometric powers.\n$aA + bB \\to \\ldots$ → rate $\\propto [A]^a[B]^b$.', 'easy', ['mass-action']);
add(T2, 2, '$K_c$ for $aA + bB \\rightleftharpoons cC + dD$?', '$K_c = \\dfrac{[C]^c [D]^d}{[A]^a [B]^b}$', 'easy', ['kc', 'formula']);
add(T2, 2, '$K_p$ — partial pressures form.', '$K_p = \\dfrac{P_C^c P_D^d}{P_A^a P_B^b}$ (gases only).', 'easy', ['kp', 'formula']);
add(T2, 2, 'Relation $K_p$ and $K_c$.', '$\\mathbf{K_p = K_c (RT)^{\\Delta n}}$\n$\\Delta n$ = moles of gaseous products − reactants.', 'medium', ['kp', 'formula']);
add(T2, 2, 'For $N_2 + 3H_2 \\rightleftharpoons 2NH_3$ — find $\\Delta n$. $K_p \\lessgtr K_c$?', '$\\Delta n = 2 - 4 = -2$.\n$K_p = K_c (RT)^{-2}$ → $K_p < K_c$.', 'medium', ['kp']);
add(T2, 2, 'When $K_p = K_c$?', 'When $\\Delta n_{\\text{gas}} = 0$. E.g. $H_2 + I_2 \\rightleftharpoons 2HI$.', 'easy', ['kp']);
add(T2, 2, '**What does magnitude of $K$ tell you?**', '- $K \\gg 1$: products favoured (right).\n- $K \\ll 1$: reactants favoured (left).\n- $K \\approx 1$: comparable amounts.\n$K$ tells *position*, not *rate*.', 'medium', ['kc']);
add(T2, 2, '**Why** are pure solids/liquids omitted from $K$?', 'Activity ≈ constant (independent of amount). Set to 1 in $K$ expression.\nE.g. $CaCO_3(s) \\rightleftharpoons CaO(s) + CO_2(g)$ → $K_p = P_{CO_2}$.', 'medium', ['heterogeneous']);
add(T2, 2, '**Trap:** Sealed flask of $CaCO_3$, $CaO$, $CO_2$ at equilibrium. Double the $CaCO_3$ amount. What happens to $[CO_2]$?', '**Nothing.** Pure solid amount doesn\'t appear in $K_p$. $P_{CO_2}$ fixed by T alone.', 'medium', ['heterogeneous', 'conceptual']);

const T3 = 'Manipulating Equilibrium Constants';
add(T3, 3, 'For reverse reaction, new $K = ?$', '$K_{\\text{rev}} = 1/K_{\\text{fwd}}$', 'easy', ['k-manipulation']);
add(T3, 3, 'Multiply equation by $n$: new $K = ?$', '$K^n$. E.g. doubling: $K^2$.', 'medium', ['k-manipulation']);
add(T3, 3, 'Add two equations: new $K = ?$', '$K_1 \\times K_2$ (multiply).', 'medium', ['k-manipulation']);
add(T3, 3, '$K_c$ for $H_2 + I_2 \\rightleftharpoons 2HI$ is 50. Find $K_c$ for $\\tfrac{1}{2}H_2 + \\tfrac{1}{2}I_2 \\rightleftharpoons HI$.', '$K = 50^{1/2} = \\mathbf{\\sqrt{50} \\approx 7.07}$.', 'medium', ['k-manipulation', 'application']);

const T4 = 'Reaction Quotient (Q)';
add(T4, 4, '$Q$ vs $K$ — what differs?', 'Same expression. $Q$ uses **current** concentrations (any moment); $K$ uses *equilibrium* concentrations. At equilibrium $Q = K$.', 'easy', ['Q']);
add(T4, 4, '$Q < K$, $Q = K$, $Q > K$ — direction?', '$Q < K$ → **forward**. $Q = K$ → at equilibrium. $Q > K$ → **reverse**.\nMnemonic: "moves toward $K$".', 'easy', ['Q', 'shortcut']);
add(T4, 4, '**PYQ:** $K_c = 60$. At some moment $[N_2] = 1$, $[H_2] = 1$, $[NH_3] = 5$ M (for $N_2 + 3H_2 \\rightleftharpoons 2NH_3$). Direction?', '$Q = 25/(1)(1)^3 = 25$. $Q < K$ → **forward**.', 'medium', ['Q', 'pyq']);

const T5 = 'Le Chatelier\'s Principle';
add(T5, 5, 'Le Chatelier — state it.', 'System at equilibrium subjected to a change shifts to **partially oppose** that change.', 'easy', ['le-chatelier']);
add(T5, 5, 'Add more A to $A + B \\rightleftharpoons C + D$. Shift?', '**Forward** — consumes added A. $K$ unchanged.', 'easy', ['le-chatelier']);
add(T5, 5, 'Decrease volume (increase pressure) for $N_2 + 3H_2 \\rightleftharpoons 2NH_3$. Shift?', 'Shifts to **fewer moles of gas** → **forward** (4 mol → 2 mol).\nBasis of high-P Haber process.', 'medium', ['le-chatelier']);
add(T5, 5, '**Conceptual:** Pressure change effect on $H_2 + I_2 \\rightleftharpoons 2HI$?', '**No shift.** Both sides have same total moles (2 vs 2) — $\\Delta n = 0$.', 'medium', ['le-chatelier']);
add(T5, 5, 'Raise T for an **exothermic** reaction. Shift? Effect on $K$?', '**Reverse** (heat treated as product). $K$ **decreases**.\nFor endothermic: opposite.', 'medium', ['le-chatelier']);
add(T5, 5, 'Effect of **catalyst** on equilibrium position and $K$.', '**Neither.** Speeds both directions equally → shorter time to equilibrium, same position, same $K$.', 'medium', ['catalyst']);
add(T5, 5, '**Trap:** Add inert gas at (a) constant V, (b) constant P. Shift?', '(a) **No shift** (partial pressures unchanged).\n(b) Volume expands → partials drop → shifts toward **more moles of gas**.', 'hard', ['le-chatelier', 'conceptual']);

const T6 = 'Degree of Dissociation (α)';
add(T6, 6, 'Degree of dissociation $\\alpha$ — definition.', '$\\alpha = \\dfrac{\\text{moles dissociated}}{\\text{initial moles}}$, range 0–1.', 'easy', ['alpha']);
add(T6, 6, '$K_c$ for $PCl_5 \\rightleftharpoons PCl_3 + Cl_2$, start 1 mol in volume V, dissociation $\\alpha$.', '$K_c = \\dfrac{\\alpha^2}{V(1-\\alpha)}$\nDilution (larger V) → more dissociation (V in denominator).', 'hard', ['alpha', 'formula']);
add(T6, 6, 'Vapour density (VD) method — relate $\\alpha$, $d$ (initial), $D$ (observed), $n$ (moles of product).', '$\\alpha = \\dfrac{d - D}{(n - 1)\\,D}$', 'hard', ['alpha', 'formula']);
add(T6, 6, '**PYQ:** VD of $PCl_5$ initially 104.25; at equilibrium 70. ($PCl_5 \\to PCl_3 + Cl_2$, n=2.) Find $\\alpha$.', '$\\alpha = (104.25 - 70)/(1 \\times 70) \\approx \\mathbf{0.489}$ (48.9% dissociated).', 'medium', ['alpha', 'pyq']);
add(T6, 6, '**Trap:** $A \\rightleftharpoons nB$, $n > 1$. Effect of increasing pressure on $\\alpha$?', '$\\Delta n_{\\text{gas}} > 0$ → forward gives more moles. Pressure ↑ shifts **back** → $\\alpha$ **decreases**.', 'medium', ['alpha']);

const T7 = 'ICE Tables & Calculations';
add(T7, 7, 'ICE table — what does it stand for?', '**I**nitial / **C**hange / **E**quilibrium. Bookkeeping for equilibrium algebra.', 'easy', ['ice']);
add(T7, 7, '**Shortcut:** $\\alpha \\ll 1$ approximation.', 'In denominator, $(1-\\alpha) \\approx 1$. Converts quadratic → one-line answer.\nValidate after: if $\\alpha < 0.05$ (5%), OK; else solve full quadratic.', 'medium', ['ice', 'shortcut']);
add(T7, 7, '**PYQ:** 0.5 mol HI in 1 L flask; at equilibrium $\\alpha = 0.2$ for $2HI \\rightleftharpoons H_2 + I_2$. Find $K_c$.', '$[HI] = 0.4$, $[H_2] = [I_2] = 0.05$ M.\n$K_c = (0.05)^2/(0.4)^2 \\approx \\mathbf{0.0156}$.', 'medium', ['ice', 'pyq']);

const T8 = 'Thermodynamic Connection';
add(T8, 8, 'Gibbs–equilibrium master relation.', '$\\mathbf{\\Delta G^\\circ = -RT \\ln K}$\n- $\\Delta G^\\circ < 0$ → $K > 1$ (products)\n- $\\Delta G^\\circ > 0$ → $K < 1$\n- $\\Delta G^\\circ = 0$ → $K = 1$', 'medium', ['gibbs', 'formula']);
add(T8, 8, '**Conceptual:** Reaction has $K = 10^{20}$ but doesn\'t happen at room T. Why?', '$K$ is thermodynamic; says nothing about *rate*. High activation energy can keep a thermodynamically favorable reaction kinetically frozen (e.g. $H_2 + O_2$ at room T).', 'hard', ['gibbs', 'conceptual']);
add(T8, 8, '**Catalyst** changes which of: $E_a$, $\\Delta H$, equilibrium position?', '$E_a$ **changes** (lowered, both directions equally).\n$\\Delta H$ unchanged (state function).\nEquilibrium position unchanged (K unchanged).', 'medium', ['catalyst']);

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
