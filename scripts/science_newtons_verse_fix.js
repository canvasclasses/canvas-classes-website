'use strict';
/**
 * Fix the Gita 2.47 verse translation on class9-science/newtons-second-law
 * (block ac94cdd5). Same register issue flagged and fixed elsewhere this
 * session: "हक़" (Urdu loanword, casual) doesn't fit a scriptural quote.
 * Unlike the life-skills instance, this one already carries the FULL meaning
 * (both "don't chase the result" and "don't stop acting because of it") —
 * only the register needs the dignity upgrade, matching the platform's other
 * two instances of this verse (distance-vs-displacement is the gold standard;
 * the life-skills instance was fixed earlier this session).
 *
 * Text-only edit on one callout block's `markdown` field — 0 blocks removed,
 * no content-loss guard needed. English line is already dignified; untouched.
 *
 * Run: node scripts/science_newtons_verse_fix.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'class9-science';
const SLUG = 'newtons-second-law';
const BLOCK_ID = 'ac94cdd5-80f9-4baa-a088-7562264459c8';
const DRY = process.argv.includes('--dry');

const NEW_MARKDOWN =
  '_Your hand is on the cause, not the result_\n\n### कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\n### मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥\n\n---\n\n' +
  'तेरा अधिकार केवल अपने कर्म पर है, उसके परिणाम पर नहीं। इसलिए परिणाम की चिंता में कर्म करना मत छोड़।\n\n' +
  '*You have control over your action, never directly over its result. In motion it is the same — you choose the force you apply; the acceleration that follows is fixed by the law F = ma.*';

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
    if (!page) throw new Error(`page ${SLUG} not found`);

    let fixed = false;
    const out = page.blocks.map((b) => {
      if (b.id === BLOCK_ID) { fixed = true; return { ...b, markdown: NEW_MARKDOWN }; }
      return b;
    });
    if (!fixed) throw new Error(`block ${BLOCK_ID} not found on page`);

    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'fix Gita 2.47 verse register on newtons-second-law: casual "हक़" → dignified "अधिकार"/"कर्म"/"परिणाम" (meaning was already complete)',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/0 — text-only)`
      : `✓ ${SLUG}: v${res.version} · verse register fixed`);
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Verse translation fixed.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
