'use strict';
// Founder reported (2026-07-09): "Invalid block payload: 9.order: Invalid
// input" when editing the meander gallery's aspect ratio in the admin editor.
// Root cause investigation found the book's OWN validator script
// (_validate_all21.ts) had been silently broken all session — validateBlocks()
// returns a {ok:false} result rather than throwing, but the script's try/catch
// only caught thrown exceptions, so it always reported "21/21 valid" no
// matter what. Fixing the validator surfaced 15/21 pages actually failing
// schema validation, across 4 distinct issue classes:
//
// 1. `order` missing (3 galleries) — MY fault, tonight's 3 gallery-rebuild
//    scripts (cave gallery, Chamoli gallery, meander gallery) built new block
//    objects as {id, type, items} without preserving/setting `order`.
// 2. `id` missing (1 gallery + 2 images) — MY fault, from the earlier
//    batch-2 real-photo sweep script, which built 3 new block objects
//    (economic-history gallery, Ashoka Pillar swap-source, Gram Sabha photo)
//    without a top-level block `id`.
// 3. `hint`/`reveal` = null (12 pages, all on the curiosity_prompt at
//    block[1]) — PRE-EXISTING, from the original build_ch1.js/build_ch2.js
//    scripts (2026-07-04/05), predates this session entirely. The renderer
//    treats null and undefined identically (`{block.hint && ...}`), so
//    unsetting is a zero-visual-change data-hygiene fix.
// 4. `learn_more: ""` (1 meet_a_scientist block, Kautilya) — PRE-EXISTING,
//    same original-build origin. This field is REQUIRED (min length 1), so
//    needed real content, not just unsetting. Filled with a verified fact
//    (WebSearch-confirmed): R. Shamasastry rediscovered the Arthashastra
//    manuscript in 1905 at the Oriental Research Institute, Mysore (then the
//    Mysore Oriental Library) — matches the field's established pattern
//    elsewhere in the platform (a real, still-existing institution).
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function fixPage(db, slug, fn, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  const updated = fn(page.blocks);
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary });
  console.log(`✓ ${slug} (v${res.version})`);
}

async function main() {
  await bw.withDb(async (db) => {
    // ─── Class 1: missing `order` on 3 galleries built tonight ────────────
    await fixPage(db, 'underground-water-caves-and-karst-landscapes',
      (blocks) => blocks.map((b, i) => (b.order === undefined ? { ...b, order: i } : b)),
      'Schema repair: backfilled missing `order` field on the cave gallery block (dropped when the block was rebuilt from a single image into a gallery earlier this session)');

    await fixPage(db, 'landforms-and-disasters',
      (blocks) => blocks.map((b, i) => (b.order === undefined ? { ...b, order: i } : b)),
      'Schema repair: backfilled missing `order` field on the Chamoli overview gallery block (dropped when the block was inserted earlier this session)');

    await fixPage(db, 'rivers-waterfalls-meanders-and-deltas',
      (blocks) => blocks.map((b, i) => (b.order === undefined ? { ...b, order: i } : b)),
      'Schema repair: backfilled missing `order` field on the meander gallery block (dropped when the block was rebuilt from a single image into a gallery earlier this session) — this was the exact bug the founder hit in the admin editor');

    // ─── Class 2: missing `id` on 3 blocks from the batch-2 sweep ─────────
    await fixPage(db, 'economics-choices-and-resources',
      (blocks) => blocks.map((b) => (b.type === 'gallery' && !b.id ? { ...b, id: uuid() } : b)),
      'Schema repair: backfilled missing `id` field on the economic-history gallery block (dropped when the block was created during the batch-2 real-photo sweep)');

    await fixPage(db, 'indias-roots-in-social-thinking',
      (blocks) => blocks.map((b) => {
        if (b.type === 'image' && b.alt?.includes('Lion Capital') && !b.id) return { ...b, id: uuid() };
        if (b.type === 'meet_a_scientist' && b.name === 'Kautilya (Chanakya)' && b.learn_more === '') {
          return { ...b, learn_more: 'The original Arthashastra manuscript, rediscovered in 1905 by scholar R. Shamasastry, is still preserved at the Oriental Research Institute, Mysore.' };
        }
        return b;
      }),
      'Schema repair: backfilled missing `id` on the Lion Capital of Ashoka image block (dropped during the batch-2 sweep), and filled the required `learn_more` field on the Kautilya meet_a_scientist block (was an empty string from the original build) with a verified fact about the Arthashastra\'s 1905 rediscovery');

    await fixPage(db, 'political-science-power-and-governance',
      (blocks) => blocks.map((b) => (b.type === 'image' && b.alt?.includes('Gram Sabha') && !b.id ? { ...b, id: uuid() } : b)),
      'Schema repair: backfilled missing `id` field on the Gram Sabha photo image block (dropped when the block was created during the batch-2 real-photo sweep)');

    // ─── Class 3: hint/reveal = null on 12 pages' curiosity_prompt block ──
    const nullHintPages = [
      'geography-the-study-of-place', 'economics-choices-and-resources', 'plate-tectonics-earths-moving-crust',
      'indias-roots-in-social-thinking', 'shaping-the-earths-surface-toolkit', 'landforms-and-disasters',
      'agents-of-gradation-and-landforms-in-history', 'political-science-power-and-governance',
      'plate-boundaries-earthquakes-and-volcanoes', 'why-social-science-matters',
      'coastal-landforms-beaches-cliffs-and-stacks', 'four-disciplines-one-society', 'history-the-study-of-the-past',
    ];
    for (const slug of nullHintPages) {
      await fixPage(db, slug,
        (blocks) => blocks.map((b) => {
          if (b.type !== 'curiosity_prompt') return b;
          const clean = { ...b };
          if (clean.hint === null) delete clean.hint;
          if (clean.reveal === null) delete clean.reveal;
          return clean;
        }),
        'Schema repair: removed `hint: null` / `reveal: null` on the curiosity_prompt block (schema requires string-or-absent, not null; pre-existing from the original chapter build, not introduced this session). Renderer already treats null and absent identically, so zero visual change.');
    }
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
