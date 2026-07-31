'use strict';
/**
 * Rewrites the opening "Did You Know" callout on 'concentration-of-solutions'
 * (Ch.1 Chemistry) — founder-added a new hero banner image (2026-07-25)
 * illustrating 5 real-world concentration scenarios (IV fluids/Molarity,
 * antifreeze/Molality, AQI+water fluoridation/ppm, scuba Trimix/mole
 * fraction, hand sanitizer/volume %) and wants the opening hook to explain
 * real-world stakes BEFORE the technical unit-by-unit content starts,
 * matching that image, instead of the old "one solution, six equivalent
 * descriptions" framing.
 *
 * Facts independently verified before writing (not copied from any source):
 * normal saline is 0.9% w/v NaCl = 0.154 M (isotonic with blood plasma);
 * molality is temperature-independent because it's mass-based, unlike
 * molarity which is volume-based (this echoes the page's own existing
 * exam_tip at order 22 — reinforces rather than contradicts it); mole
 * fraction sets partial pressure via Dalton's law, relevant to Trimix diving
 * gas blends and nitrogen narcosis/O2 toxicity; ppm is standard for trace
 * pollutants and water fluoridation; ~70% is the commonly-cited effective
 * concentration for alcohol hand sanitizer (denatures microbial proteins
 * fully before evaporating, vs. pure alcohol sealing the outer layer too
 * fast). Condensed into one hook, not 5 separate blocks — this replaces the
 * block's content only, not its position or type (still the opening
 * fun_fact/"Did You Know" callout at order 1, right after the hero image).
 *
 * Purely additive/text-only via book-writer.savePage. Idempotent.
 * Run: node scripts/rewrite_concentration_page_did_you_know.js
 */
const bw = require('./lib/book-writer');

const SLUG = 'concentration-of-solutions';
const BLOCK_ID = 'f99d18c7-b7da-48c2-8318-c07adbbaf325';

const NEW_TITLE = 'Same Concept, Different Stakes';
const NEW_MARKDOWN =
  "A nurse setting up your IV drip, an engineer designing your car's coolant, a diver 40 metres underwater, a city " +
  "tracking its air quality, and the hand sanitizer bottle in your bag — all five are working with the exact same " +
  'idea: **concentration**. But each one needs a *different* unit, and getting it wrong is not just a wrong answer ' +
  'on a test.\n\n' +
  'Saline IV bags are mixed to precisely $0.154$ M $\\ce{NaCl}$ — too concentrated or too dilute, and a patient\'s ' +
  'red blood cells shrink or burst. Coolant is measured in molality, not molarity, because mass does not expand and ' +
  "contract with temperature the way volume does. A diver's gas blend is set by mole fraction, because that decides " +
  'how much of each gas actually reaches the bloodstream at depth. Air-quality monitors and water fluoridation both ' +
  "live in parts-per-million, where the gap between 'helpful' and 'harmful' can be a single digit. And hand " +
  'sanitizer works best around **70%** alcohol, not 100% — pure alcohol seals off the outer layer of a microbe too ' +
  'fast to finish the job, while a little water lets it penetrate all the way through.\n\n' +
  'Same concentration, five completely different reasons to measure it a specific way. That is exactly what this ' +
  'page is about.';

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    const target = cur.blocks.find((b) => b.id === BLOCK_ID);
    if (!target) throw new Error(`block not found: ${BLOCK_ID}`);

    if (target.title === NEW_TITLE && target.markdown === NEW_MARKDOWN) {
      console.log('already rewritten — skipping (idempotent).');
      return;
    }

    const newBlocks = cur.blocks.map((b) =>
      b.id === BLOCK_ID ? { ...b, title: NEW_TITLE, markdown: NEW_MARKDOWN } : b
    );

    const res = await bw.savePage(db, { slug: SLUG }, newBlocks, {
      author: 'agent',
      summary: 'Rewrote the opening "Did You Know" callout to hook into the new hero banner\'s 5 real-world ' +
        'concentration scenarios (IV fluids, antifreeze, AQI, scuba Trimix, hand sanitizer) before the technical ' +
        'content starts — founder-requested. Text-only, same block position/type.',
    });
    console.log('SAVED', res.slug, 'version', res.version, '· lossDetected:', res.diff.lossDetected);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
