'use strict';
/* Point the Recap page's closing line at the new in-book "Practice — NCERT
   Exercises" page (the 36 worked exercises now live one page later, not
   "elsewhere"). Text-only edit via the sanctioned book-writer gateway.
   Run: node scripts/math11-book/patch_ch2_recap_pointer.js        (commits)
        node scripts/math11-book/patch_ch2_recap_pointer.js --dry  (dry-run) */
const bw = require('../lib/book-writer');
const { withDb } = bw;

const SLUG = 'relations-functions-recap';
const DRY = process.argv.includes('--dry');

const NEW_MD =
  '**Take it to the exercises — they’re right here.** The next page, **Practice — NCERT Exercises**, ' +
  'collects **all 36 questions** from NCERT **Exercise 2.1** (Cartesian products), **2.2** (relations), ' +
  '**2.3** (functions and domains) and the **Miscellaneous Exercise**, regrouped by idea and each with a ' +
  'full worked solution. Try every one on paper *first*, then tap to check your working — and mix the themes ' +
  'rather than doing one type in a block, because jumping between question types is what trains you to ' +
  '*recognise* which idea a problem needs, which is exactly what the exam tests.';

(async () => {
  await withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ slug: SLUG });
    if (!page) throw new Error('recap page not found: ' + SLUG);
    let hit = false;
    const out = page.blocks.map((b) => {
      if (b.type === 'text' && b.order === 7) { hit = true; return { ...b, markdown: NEW_MD }; }
      return b;
    });
    if (!hit) throw new Error('closing text block (order 7) not found');
    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'recap: point closing line at the new in-book Practice — NCERT Exercises page',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/0 — text-only)`
      : `✓ ${SLUG}: v${res.version} · closing pointer updated`);
  });
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
