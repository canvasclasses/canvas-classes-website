'use strict';
/**
 * Re-orders the 20 worked_example blocks on 'additional-practice-beyond-ncert'
 * (Ch.1 Chemistry) into increasing order of difficulty (founder request,
 * 2026-07-24). The hero image + intro text stay first, unchanged.
 *
 * Difficulty ladder used (easiest -> hardest):
 *   1. Pure recall/pattern-matching, zero arithmetic (nomenclature).
 *   2. Single 1:1 mole-ratio stoichiometry, no equivalents concept at all.
 *   3. Single reaction + a limiting-reagent decision, still no equivalents.
 *   4. Introduces normality/equivalents on a SINGLE, simple acid-base or
 *      dilution calculation.
 *   5. A single REDOX titration (needs a balanced half-reaction / n-factor).
 *   6. Two reactions CHAINED together (liberate-then-titrate), or a two-
 *      unknown mixture requiring simultaneous-equation algebra.
 *   7. Hardest: back-titration STACKED with aliquot-scaling, or TWO
 *      independent titrations on the same sample that must be combined
 *      using two different n-factors.
 *
 * Purely a re-order — every block keeps its exact id/content, only `order`
 * changes. Written via book-writer.savePage (versioned; content-loss guard
 * trivially passes since nothing is added or removed, just resequenced).
 * Idempotent: safe to re-run, it always converges to the same final order.
 * Run: node scripts/arrange_ch1_extra_practice_by_difficulty.js
 */
const bw = require('./lib/book-writer');

const SLUG = 'additional-practice-beyond-ncert';

// Target order for the worked_example blocks, by their exact label.
const DIFFICULTY_ORDER = [
  'Example — Naming Technique: Writing Formulas from Names',
  'Example — Naming Technique: Reading Names from Formulas',
  'Example — Mass of NaHCO₃ Needed to Neutralise a Given Volume of Vinegar',
  'Example — Lime Needed to Soften Hard Water (Removing HCO₃⁻)',
  'Example — Volume of HNO₃ Needed to Dissolve Copper',
  'Example — How Much AgCl Precipitates from AgNO₃ in Excess HCl',
  'Example — Limiting Reagent: Ammonia Burning in Oxygen',
  'Example — Maximum Mass of PbSO₄ Precipitated from Two Mixed Solutions',
  'Example — Molarity from Density and Percentage, Then Diluting It',
  'Example — Strength of an Acid Solution, Then Neutralising a Base',
  'Example — % Ammonia in Ammonium Sulphate via Back-Titration',
  'Example — Equivalent Weight and Molecular Weight of an Unknown Acid',
  'Example — Purity of H₂O₂ from a KMnO₄ Titration',
  'Example — Percentage of Oxalate in a Salt, via KMnO₄ Titration',
  'Example — Strength of H₂O₂ via an Iodometric Titration',
  'Example — Concentration of K₂Cr₂O₇ via an Iodometric Titration',
  'Example — Splitting an Al–Zn Mixture Using the Gas They Both Release',
  'Example — Splitting a CaCO₃–MgCO₃ Mixture Using the CO₂ It Releases',
  'Example — Assaying a Pyrolusite Ore Sample by Back-Titration',
  'Example — Finding a Mole Ratio from TWO Separate Titrations on the Same Compound',
];

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    const nonWorked = cur.blocks.filter((b) => b.type !== 'worked_example');
    const worked = cur.blocks.filter((b) => b.type === 'worked_example');

    if (worked.length !== DIFFICULTY_ORDER.length) {
      throw new Error(`expected ${DIFFICULTY_ORDER.length} worked_example blocks, found ${worked.length} — aborting, block set changed since this script was written`);
    }
    const byLabel = new Map(worked.map((b) => [b.label, b]));
    const missing = DIFFICULTY_ORDER.filter((label) => !byLabel.has(label));
    if (missing.length) throw new Error(`labels not found on page: ${JSON.stringify(missing)}`);

    const orderedWorked = DIFFICULTY_ORDER.map((label) => byLabel.get(label));

    // Already in this order? Then no-op (idempotent).
    const sortedCur = [...cur.blocks].sort((a, b) => a.order - b.order);
    const curWorkedLabelsInOrder = sortedCur.filter((b) => b.type === 'worked_example').map((b) => b.label);
    const alreadyDone = JSON.stringify(curWorkedLabelsInOrder) === JSON.stringify(DIFFICULTY_ORDER);
    if (alreadyDone) { console.log('already in difficulty order — skipping (idempotent).'); return; }

    const nonWorkedSorted = [...nonWorked].sort((a, b) => a.order - b.order);
    const withNewOrder = [...nonWorkedSorted, ...orderedWorked].map((b, i) => ({ ...b, order: i }));

    const res = await bw.savePage(db, { slug: SLUG }, withNewOrder, {
      author: 'agent',
      summary: 'Re-ordered the 20 worked_example blocks into increasing order of difficulty (founder request) — ' +
        'nomenclature/recall first, then simple 1:1 stoichiometry, limiting reagent, single normality/back-' +
        'titration problems, single redox titrations, chained two-reaction titrations and two-unknown mixture ' +
        'algebra, ending on the two-independent-titrations problem as the hardest. No content added or removed.',
    });
    console.log('SAVED', res.slug, 'version', res.version, '· blocks:', withNewOrder.length, '· lossDetected:', res.diff.lossDetected);
    console.log('\nnew order:');
    withNewOrder.filter((b) => b.type === 'worked_example').forEach((b, i) => console.log(' ', i + 1, b.label));
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
