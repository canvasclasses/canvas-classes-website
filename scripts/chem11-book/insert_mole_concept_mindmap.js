'use strict';
/**
 * Inserts the chapter-end revision mind map for ch11_mole ("Some Basic
 * Concepts of Chemistry" / Mole Concept, Class 11 Chemistry Live Book).
 *
 * A mind map is NOT a flashcard replacement — it's the "shape of the
 * chapter" (orientation: what topics exist, how they connect), which then
 * routes into the flashcard deck (retrieval practice) via each leaf's
 * "Test yourself" link. See MindMapBlock in packages/data/types/books.ts.
 *
 * Content grounding (Rule 0 — nothing here is invented): every leaf condenses
 * a real formula/trap already established this session, either from the
 * active ch11_mole flashcard deck (FLASH-PHY-11xx/16xx, "Watch out"/"Trap"
 * framing) or from real questions_v2 solutions (MOLE-009/013/025/031/043/
 * 051/060/076/079/156, etc.). The 7 branches are the SAME 7 topic names
 * already used by the flashcard taxonomy (packages/data/flashcards/
 * flashcardTaxonomy.ts) — so `flashcardTopic` on every leaf resolves to a
 * real Flashcard.topic.name and the "Test yourself" deep link actually works
 * (see the ?topic= param added to FlashcardsChapterClient.tsx same session).
 *
 * ═══ LEAF CONTENT FRAMEWORK (v2, 2026-07-26 — read this before adding a
 * chapter) ═══
 * v1 gave every leaf a single flowing paragraph in flashcard voice. Founder
 * review rejected it as "generic" — for a calculation-heavy chapter, a
 * revision map has to surface the actual formula/shortcut at a glance, not
 * just restate the concept in prose. Every leaf below is authored as:
 *   - `formula` (optional): the ONE canonical equation/rule line for this
 *     sub-concept, standalone, no verbs. Omit ONLY for genuinely conceptual
 *     leaves with no single formula (e.g. why average atomic mass is
 *     non-integer). This is rendered in its own highlighted chip, above the
 *     bullets — do not fold it into a sentence.
 *   - `summary`: 2-4 SHORT markdown bullets (`- `), each under ~20 words.
 *     First bullet = the rule/method in its most compact usable form (if
 *     there's no separate `formula`, this bullet carries it). A
 *     `**Shortcut:**`-labelled bullet where a genuine speed trick exists.
 *     Close on a `**Watch out:**` bullet whenever a real trap exists — this
 *     is where the old trap-testing angle lives now: one bullet among
 *     several, not the whole leaf. Don't force one onto a leaf that's pure
 *     reference (e.g. "which reagent absorbs what") or pure shortcut with no
 *     natural misconception — an invented trap is worse than no trap. Never
 *     write a bullet as a full paragraph — if it needs two independent
 *     clauses, split it into two bullets.
 * Reuse this exact shape (formula chip + 2-4 bullets, watch-out last) for
 * every future chapter's mind map — that consistency is what makes revision
 * fast; a student shouldn't have to re-learn how to read the map each time.
 *
 * ADDITIVE ONLY — appended as a brand-new last page. No existing page is
 * touched. Ships published:false for founder review, per every other new
 * Live Book surface this session.
 *
 * Dry-run by default; pass --apply to write.
 * Usage: node scripts/chem11-book/insert_mole_concept_mindmap.js [--apply]
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { v4: uuid } = require('uuid');
const { MongoClient } = require('mongodb');
const bw = require('../lib/book-writer');

const APPLY = process.argv.includes('--apply');
const BOOK_ID = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e'; // Class 11 Chemistry
const CHAPTER_NUMBER = 1; // Some Basic Concepts of Chemistry (Mole Concept)
const FLASHCARD_CHAPTER_SLUG = 'mole-concept'; // generateChapterSlug('Mole Concept')
const must = (c, m) => { if (!c) throw new Error('SAFETY: ' + m); };

// ─── Branches ─────────────────────────────────────────────────────────────────
// `label` is the SHORT display string that has to fit inside a ~145px pill in
// the renderer — keep it under ~20 characters. The full-length flashcard topic
// name is carried separately on every leaf as `flashcardTopic`, and THAT is
// what must match a real Flashcard.topic.name byte-for-byte for the
// "Test yourself" deep link to resolve. Never shorten the second string.
//
// Each leaf def is [id, label, formula|null, bullets[]] — see the framework
// note above for what belongs in `formula` vs. `bullets`.
const branch = (id, label, children) => ({ id, label, children });
function branchLeaves(topicName, defs) {
  return defs.map(([id, label, formula, bullets]) => ({
    id, label,
    ...(formula ? { formula } : {}),
    summary: bullets.map((b) => `- ${b}`).join('\n'),
    flashcardTopic: topicName,
  }));
}

const BRANCHES = [
  branch('laws', 'Laws and sig figs', branchLeaves(
    'Laws of Combination, Sig Figs & Atomic Mass', [
      ['multiple-vs-definite', 'Multiple vs definite', null, [
        '**Definite proportions:** ONE compound → always the same fixed ratio.',
        '**Multiple proportions:** TWO compounds of the same elements → the varying element combines in a small whole-number ratio for a fixed mass of the other.',
        '**Watch out:** options often swap these two definitions — check whether the statement compares one compound or two.',
      ]],
      ['sig-figs', 'Sig figs', '×÷ → fewest sig figs  |  +− → fewest decimal places', [
        '**× ÷:** answer keeps the sig figs of the *least-precise* factor.',
        '**+ −:** answer keeps the fewest *decimal places*, not sig figs.',
        'e.g. $12.11+18.0+1.012=31.1$ (set by $18.0$\'s 1 decimal place).',
        '**Watch out:** mixing up the two rules is the classic error.',
      ]],
      ['precision-accuracy', 'Precision vs accuracy', null, [
        '**Accuracy** = how close to the true value.',
        '**Precision** = how close repeated readings are to each other.',
        '**Watch out:** a biased balance can be precise but never accurate — the two are independent.',
      ]],
      ['avg-atomic-mass', 'Average atomic mass', '$\\bar{M} = \\sum(\\text{isotope \\%} \\times \\text{isotope mass})$', [
        'It\'s an isotope-weighted average, not one atom\'s real mass.',
        'e.g. $\\ce{Cl}$: $0.75(35) + 0.25(37) = 35.5$.',
        '**Watch out:** monoisotopic elements (F, P, Na, I, Au) ARE near-integer — the exception.',
      ]],
    ])),
  branch('mole-basics', 'Mole basics', branchLeaves(
    'Mole Basics — Mass / Volume / Particles', [
      ['mole-conversions', 'Mole conversions', '$n=\\dfrac{m}{M}=\\dfrac{N}{N_A}=\\dfrac{V}{22.4\\text{ L}}$', [
        'Three routes to moles — mass, particle count, or gas volume at STP.',
        '**Watch out:** the 22.4 L route is for gases only — never liquids or solids.',
      ]],
      ['stp-confusion', 'STP volume', 'Old STP = 22.4 L/mol  |  IUPAC STP = 22.7 L/mol', [
        '**Shortcut:** JEE/NCERT almost always mean the *old* 22.4 L.',
        'NTP (20°C, 1 atm) is a third, different value: 24.05 L/mol.',
        '**Watch out:** always check which standard the question actually states — silently assuming 22.4 L is the #1 source of a wrong molar-volume answer.',
      ]],
      ['gas-mixture', 'Gas mixtures', '$M_{avg}=\\sum x_iM_i$', [
        'Mole-fraction-weighted average, not a plain average of the two molar masses.',
        '**Watch out:** swapping a mixture\'s ratio ($a{:}b \\to b{:}a$) does NOT just flip the answer — the gases contribute unequally, so the total itself changes.',
      ]],
      ['vapour-density', 'Vapour density', '$M = 2 \\times \\text{V.D.}$', [
        'V.D. is mass relative to $\\ce{H2}$ ($M=2$), so doubling it gives molar mass directly.',
        '**Watch out:** once you have the real molar mass, use it to reach the *molecular* formula — stopping at the empirical formula is the classic wrong option.',
      ]],
    ])),
  branch('concentration', 'Concentration units', branchLeaves(
    'Concentration Units', [
      ['molarity-molality', 'Molarity vs molality', null, [
        '**Molarity** $M$ = mol solute / L **solution** — shifts with temperature.',
        '**Molality** $m$ = mol solute / kg **solvent** — temperature-independent.',
        '**Watch out:** solution vs solvent is the usual slip.',
      ]],
      ['mole-fraction', 'Mole fraction', '$x_A = \\dfrac{n_A}{n_A+n_B+\\ldots}$', [
        'Denominator is **total moles** — not any mass.',
        '**Watch out:** reusing molality\'s kg-of-solvent denominator here is the standard wrong-option trap.',
      ]],
      ['molarity-from-wbyw', 'Molarity from %w/w', '$M = \\dfrac{10 \\times d \\times \\%}{\\text{molar mass}}$', [
        '**Shortcut:** the **10** is a fixed unit-conversion constant (g/L → mol/L) — it\'s not in the raw data, so don\'t drop it.',
      ]],
      ['h2o2-strength', 'Volume strength', 'Volume strength $= 11.2M = 5.6N$', [
        '"20-volume" means 1 L of that $\\ce{H2O2}$ releases 20 L of $\\ce{O2}$ at STP.',
        '**Watch out:** use $\\times11.2$ with molarity, $\\times5.6$ with normality — swapping them doubles or halves the answer.',
      ]],
    ])),
  branch('formula', 'Empirical formula', branchLeaves(
    'Empirical & Molecular Formula', [
      ['ef-from-composition', 'Empirical from %', null, [
        'Assume 100 g → element % = element mass (g).',
        '÷ atomic mass → moles → ÷ the **smallest** mole value → ratio.',
        '**Watch out:** skipping the "divide by smallest" step is the most common miss.',
      ]],
      ['combustion-analysis', 'Combustion analysis', '$m_C = m_{CO_2}\\times\\frac{12}{44}$,  $m_H = m_{H_2O}\\times\\frac{2}{18}$', [
        'Oxygen is always found **by difference**: $m_O = m_{sample}-m_C-m_H$.',
        '**Watch out:** O can\'t be measured directly — it mixes with the $\\ce{O2}$ used to burn the sample.',
      ]],
      ['gravimetric', 'Gravimetric analysis', null, [
        '**Shortcut:** track the atom that\'s *conserved* (e.g. every Cu ends up in $\\ce{CuO}$), not the compound you started with.',
        '**Watch out:** trying to balance both unknowns from the raw reaction — instead of anchoring on the conserved atom — is what stalls these.',
      ]],
    ])),
  branch('eudiometry', 'Eudiometry', branchLeaves(
    'Eudiometry', [
      ['volumes-are-moles', 'Volumes = moles', 'Same T, P  ⇒  volume ratio = mole ratio (Avogadro)', [
        '**Shortcut:** treat gas volumes as moles directly — never compute actual mole counts in eudiometry.',
      ]],
      ['water-disappears', 'Water condenses', null, [
        'Water formed condenses to liquid once cooled to room T — its volume becomes negligible.',
        '**Watch out:** that\'s exactly why problems say "after cooling to room temperature" before the final volume reading.',
      ]],
      ['reagent-roles', 'Absorbing reagents', null, [
        '**KOH** → absorbs $\\ce{CO2}$.',
        '**Alkaline pyrogallol** → absorbs excess $\\ce{O2}$.',
        '**Bromine water** → absorbs unsaturated hydrocarbons.',
      ]],
    ])),
  branch('lr-yield', 'Limiting reagent', branchLeaves(
    'Limiting Reagent & Yield', [
      ['finding-lr', 'Finding the LR', 'Smallest of (moles ÷ coefficient) across reactants = LR', [
        '**Watch out:** comparing raw mole counts *without* dividing by the coefficient is the single most common error.',
      ]],
      ['excess-left-over', 'Excess left over', 'Left over = (initial excess moles) − (moles of LR × ratio)', [
        'Finding the LR only tells you which one runs out — you still must compute how much of the excess got consumed.',
        '**Watch out:** that\'s moles of LR × stoichiometric ratio, **not** 1:1 unless the equation says so.',
      ]],
      ['percent-yield', 'Percent yield', '$\\%\\text{Yield}=\\dfrac{\\text{actual}}{\\text{theoretical from LR}}\\times100$', [
        '**Watch out:** over 100% is physically impossible — it signals an impure or wet product, never over-production.',
      ]],
      ['sequential', 'Sequential steps', null, [
        'Ask which specific sub-reaction a reagent feeds into — e.g. $\\ce{O2}\\to\\ce{CO}$ (2 mol CO per mol $\\ce{O2}$) is different accounting than $\\ce{O2}\\to\\ce{CO2}$.',
        '**Watch out:** stacked yields multiply all the way through — a clean 100% final step doesn\'t erase earlier losses.',
      ]],
    ])),
  branch('equivalent', 'Equivalent concept', branchLeaves(
    'Equivalent Concept & n-factor', [
      ['n-factor-basics', 'n-factor basics', null, [
        '**Acid** → replaceable $H^+$. **Base** → replaceable $OH^-$. **Salt** → total cation charge.',
        '**Redox** → electrons actually gained/lost in *that* reaction — reaction-dependent, not fixed to the compound.',
        '**Watch out:** a salt\'s n-factor is total positive *charge*, not the number of cations — $\\ce{Al2(SO4)3}$ is $2\\times3=6$, not 2.',
      ]],
      ['n-factor-medium', 'n-factor by medium', '$\\ce{KMnO4}$: acidic n=5  ·  neutral n=3  ·  basic n=1', [
        'Same compound, three different equivalent weights — the reduction product changes with medium.',
        '**Watch out:** always identify the medium before computing eq. wt — the same reagent gives a different answer in each.',
      ]],
      ['law-of-equivalence', 'Law of equivalence', '$N_1V_1 = N_2V_2$', [
        'Equivalents of reactants = equivalents of products, always.',
        '**Shortcut:** works in any titration without ever needing the balanced equation.',
        '**Watch out:** both sides need *normality*, not molarity — substituting $M$ for $N$ silently drops the n-factor.',
      ]],
    ])),
];

const MIND_MAP_BLOCK = {
  id: uuid(),
  type: 'mind_map',
  order: 0,
  title: 'Mole Concept — See the Whole Chapter',
  root_label: 'Mole Concept',
  intro: 'Before you practice, look at the whole chapter at once. Tap a topic, then a sub-topic, for its formula, shortcut and the exact trap examiners build questions around — then jump straight into flashcards for it.',
  branches: BRANCHES,
  flashcardChapterSlug: FLASHCARD_CHAPTER_SLUG,
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');

    const book = await books.findOne({ _id: BOOK_ID });
    must(book, `book ${BOOK_ID} not found`);
    const chapters = Array.isArray(book.chapters) ? book.chapters : [];
    const chapEntry = chapters.find((c) => c.number === CHAPTER_NUMBER);
    must(chapEntry, `chapter ${CHAPTER_NUMBER} entry not found on book`);

    const branchCount = BRANCHES.length;
    const leafCount = BRANCHES.reduce((s, b) => s + b.children.length, 0);
    console.log(`Mind map: ${branchCount} branches, ${leafCount} leaves.`);

    const badDollars = JSON.stringify(BRANCHES).match(/\$\$/g);
    must(!badDollars, `found $$ (double-dollar LaTeX) in authored content — forbidden, use single $`);

    const slug = 'mole-concept-mind-map';
    const existing = await pages.findOne({ book_id: BOOK_ID, slug });

    if (existing) {
      const next = [{ ...MIND_MAP_BLOCK, id: existing.blocks[0].id, order: existing.blocks[0].order }];
      console.log(`UPDATE ${slug} in place (keeping block id ${next[0].id})`);
      if (APPLY) {
        const res = await bw.savePage(db, { pageId: existing._id }, next, {
          author: 'script:insert_mole_concept_mindmap',
          summary: 'Rewrite mind-map leaves to formula+bullets framework (founder review: v1 was too generic)',
        });
        console.log(`✅ APPLIED — version ${res.version}`);
      } else {
        console.log('DRY RUN — nothing written. Re-run with --apply.');
      }
      return;
    }

    const chapterPages = await pages.find(
      { book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, deleted_at: null },
      { projection: { page_number: 1 } }
    ).toArray();
    const nextPageNumber = Math.max(0, ...chapterPages.map((p) => p.page_number || 0)) + 1;

    const _id = uuid();
    const doc = {
      _id, book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: nextPageNumber,
      slug, title: 'Mole Concept — Revision Mind Map', subtitle: 'Tap through every trap before you practice',
      blocks: [MIND_MAP_BLOCK], hinglish_blocks: [], tags: ['revision', 'mind-map'], glossary: [],
      published: false, page_type: 'lesson',
      reading_time_min: bw.computeReadingTime([MIND_MAP_BLOCK]),
      content_types: bw.computeContentTypes([MIND_MAP_BLOCK]),
      video_title: null, readiness: null,
      review: { reviewed: false, reviewed_by: null, reviewed_at: null },
      deleted_at: null, deleted_by: null, deletion_reason: null,
      created_at: new Date(), updated_at: new Date(),
    };

    console.log(`INSERT ${slug} as p${nextPageNumber} in chapter ${CHAPTER_NUMBER} (${branchCount} branches, ${leafCount} leaves)`);

    if (APPLY) {
      await pages.insertOne(doc);
      chapEntry.page_ids.push(_id);
      await books.updateOne({ _id: book._id }, { $set: { chapters, updated_at: new Date() } });
      console.log(`✅ APPLIED — page _id ${_id}, linked into chapter.page_ids (${chapEntry.page_ids.length} pages now). published:false — review before publishing.`);
      console.log(`ROLLBACK: mongosh $MONGODB_URI --eval 'db.book_pages.deleteOne({_id:"${_id}"}); db.books.updateOne({_id:"${BOOK_ID}"},{$pull:{"chapters.$[c].page_ids":"${_id}"}},{arrayFilters:[{"c.number":${CHAPTER_NUMBER}}]})'`);
    } else {
      console.log('DRY RUN — nothing written. Re-run with --apply.');
    }
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
module.exports = { MIND_MAP_BLOCK };
