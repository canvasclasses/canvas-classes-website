/**
 * Mole Concept (ch11_mole) — GAP-FILL PASS, 2026-07-26.
 *
 * Context: the active 60-card deck (FLASH-PHY-1101..1631, non-contiguous —
 * see history below) already follows the trap/conceptual-gap philosophy from
 * the 2026-06-18 rewrite + the 2026-06-26 "flashcard-rubric-refinement" pass
 * that deliberately REMOVED flat "state the law" / "define X" recall cards
 * (old FLASH-PHY-0453..0490 and FLASH-PHY-1102..1133: Law of Definite/Multiple
 * Proportions, Gay-Lussac's Law, Mole Fraction — all pure definitions with no
 * gap-testing angle). This pass does NOT resurrect those — it closes real
 * coverage gaps found by cross-referencing the 332-question ch11_mole bank's
 * microConcept distribution against the active deck's topics, and writes each
 * new card in the same trap-testing style, grounded in real bank questions
 * (never invented): MOLE-009/013 (multiple vs definite proportions), MOLE-156
 * (mole fraction denominator), MOLE-060/076 (gravimetric analysis), MOLE-031
 * (excess reagent leftover), MOLE-051 (gas-mixture ratio swap), MOLE-043
 * (sequential-reaction reagent misattribution), MOLE-079 (stacked % yields).
 *
 * Pure addition — no soft-deletes, no snapshot needed.
 */
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_mole', name: 'Mole Concept', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 1632;
const STAMP = new Date();

const cards = []; let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = []) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`;
  idCursor++;
  cards.push({ flashcard_id: id, chapter: CHAPTER, topic: { name: topic, order }, question: q.trim(), answer: a.trim(), metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP }, deleted_at: null });
}

const T1 = 'Laws of Combination, Sig Figs & Atomic Mass';
add(T1, 1,
  '**Trap:** (i) "$CO_2$ always has C : O = 1 : 2 by mass." (ii) "For a fixed mass of C, the O combining in $CO$ vs $CO_2$ is 1 : 2." Which one is the Law of Multiple Proportions?',
  '**Only (ii).** (i) is Definite Proportions — one compound, always the same ratio. Multiple Proportions needs **two different compounds of the same elements**, compared against each other. PYQ options mix these two statements exactly to catch this.',
  'medium', ['laws', 'conceptual']
);

const T2 = 'Mole Basics — Mass / Volume / Particles';
add(T2, 2,
  '**Trap:** A $CH_4$/$C_2H_4$ mixture in ratio $a:b$ gives 40 mL $CO_2$ on combustion. Flip the ratio to $b:a$ — is the $CO_2$ produced also just "flipped back" to 40 mL?',
  '**No — swapping isn\'t symmetric.** $C_2H_4$ makes **twice** the $CO_2$ per volume that $CH_4$ does. Give the bigger share to the higher-yield gas and the total itself changes (here, to 50 mL). "Same two volumes, different order" only gives the same answer when both components contribute equally — which they never do for different formulas.',
  'medium', ['gas-mixture', 'combustion', 'conceptual']
);

const T3 = 'Concentration Units';
add(T3, 3,
  '**Trap:** 8 g NaOH dissolved in 18 g water. Mole fraction of NaOH and molality — same denominator?',
  '**No — that\'s the trap.** Moles: NaOH = 0.2, water = 1.0. Mole fraction $x_{NaOH} = 0.2/(0.2+1.0) = 0.167$ — denominator is **total moles**. Molality $= 0.2/0.018\\text{ kg} = 11.11$ — denominator is **mass of solvent alone**. Reusing 1.0 mol as the molality denominator (instead of converting to kg) is the standard wrong-option trap.',
  'medium', ['mole-fraction', 'concentration', 'conceptual']
);

const T4 = 'Empirical & Molecular Formula';
add(T4, 4,
  '**Method:** A mixture\'s composition is found by precipitating one ion and weighing the mass change (e.g. $AgCl \\to AgBr$ swap, or $CuS/Cu_2S \\to CuO$). What\'s the one trick that cracks these gravimetric problems?',
  'Track the atom that\'s **conserved**, not the compound you started with. Silver stays fixed while $Cl^-$ is swapped for heavier $Br^-$ → mass gain = (moles swapped) × (mass difference per mole). Or: every Cu atom ends up in $CuO$ → count Cu in the product, split it between the two sources. Trying to solve both unknowns from the reaction as written (instead of anchoring on the conserved atom) is what stalls these.',
  'hard', ['gravimetric', 'conceptual', 'shortcut']
);

const T6 = 'Limiting Reagent & Yield';
add(T6, 6,
  '**Trap:** You\'ve correctly found the limiting reagent. The question then asks how much of the *excess* reactant is left over — what\'s the step most students skip?',
  'Finding the LR only tells you which one runs out — you still have to **compute how much of the excess reagent actually got used**, then subtract from what you started with. Moles of excess consumed = (moles of LR) × (stoichiometric ratio), **not 1:1** unless the equation literally says so. E.g. $3AgNO_3 + FeCl_3$: every mole of $AgNO_3$ (LR) consumes only $\\tfrac{1}{3}$ mole of $FeCl_3$ — drop that 3 and the leftover is wrong.',
  'medium', ['lr', 'yield', 'conceptual']
);
add(T6, 6,
  '**Trap:** A two-step process makes $CO$ from $C$, then that $CO$ reduces $Fe_2O_3$. You\'re asked how much $O_2$ is needed overall. Which reaction does the $O_2$ actually belong to?',
  'The **first step** — $2C + O_2 \\to 2CO$ — not the final reduction. It\'s tempting to picture $O_2$ burning straight to $CO_2$ (1:1 with C), but here $O_2$ only makes $CO$ (**2 mol $CO$ per mol $O_2$**), and *that* does the reducing separately. Mixing up which sub-reaction a reagent feeds is what flips multi-step answers.',
  'hard', ['sequential', 'lr', 'conceptual']
);
add(T6, 6,
  '**Trap:** A synthesis has three steps in a row with 60%, 50%, 50% yield. If you only look at the *last* step, its yield reads 100% for the specific transformation it performs. Does that "reset" the mole count lost earlier?',
  '**No — earlier losses carry through regardless of any single step\'s own yield.** Overall yield is the **product** of every step\'s yield along the chain ($0.6 \\times 0.5 \\times 0.5 = 15\\%$ here), not whichever step you looked at last. A clean step at the end just means *that* step lost nothing — everything lost before it is still gone.',
  'hard', ['yield', 'sequential', 'conceptual']
);

// ─────── ROLLOUT ───────
(async () => {
  console.log(`Prepared ${cards.length} cards (FLASH-PHY-${String(ID_START).padStart(4, '0')} → FLASH-PHY-${String(idCursor - 1).padStart(4, '0')})`);
  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('$$ FOUND', bad.map(b => b.flashcard_id)); process.exit(1); }

  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('flashcards');
  const exists = await col.find({ flashcard_id: { $in: cards.map(c => c.flashcard_id) } }).toArray();
  if (exists.length) { console.error('COLLISION', exists.map(e => e.flashcard_id)); await mongoose.disconnect(); process.exit(1); }

  console.log('Mix:', JSON.stringify(cards.reduce((a, c) => { a[c.metadata.difficulty] = (a[c.metadata.difficulty] || 0) + 1; return a; }, {})));
  console.log('Topics:', JSON.stringify(cards.reduce((a, c) => { a[c.topic.name] = (a[c.topic.name] || 0) + 1; return a; }, {})));

  if (process.argv.includes('--dry-run')) {
    console.log('\n--- DRY RUN — first card ---\n', JSON.stringify(cards[0], null, 2));
    await mongoose.disconnect();
    return;
  }

  const insRes = await col.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${insRes.insertedCount}`);
  console.log(`ROLLBACK: mongosh $MONGODB_URI --eval 'db.flashcards.deleteMany({flashcard_id:{$gte:"FLASH-PHY-${String(ID_START).padStart(4, '0')}",$lte:"FLASH-PHY-${String(idCursor - 1).padStart(4, '0')}"}})'`);
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
