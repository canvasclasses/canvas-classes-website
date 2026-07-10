'use strict';
/**
 * Fix the Gita 2.47 verse translation on the-25-minute-sprint (block 287138d8).
 * Founder: "your hindi translation here is very bad... don't make the Gita
 * verse feel too casual." Two problems, not just tone:
 *   1. Register — "हक़" (Urdu loanword, casual), "डूबो" (slangy imperative),
 *      "नतीजा गिनना छोड़ो" (spoken-register) don't fit a scriptural quote.
 *   2. Missing meaning — the old line only conveyed "don't worry about the
 *      result," dropping the verse's second half: "मा ते सङ्गोऽस्त्वकर्मणि" =
 *      don't let this become an excuse to stop acting either. Two other
 *      instances of this same śloka elsewhere in the platform (class9-science
 *      distance-vs-displacement, newtons-second-law) already get this right —
 *      used as the quality bar here.
 * Rewrote BOTH Hindi and English (they must agree; leaving English as the old
 * casual "Sink into the action; stop counting the outcome" while fixing only
 * Hindi would make the two lines say different things).
 *
 * Text-only edit on one callout block's `markdown` field — 0 blocks removed,
 * no content-loss guard needed.
 *
 * Run: node scripts/lifeskills_focus_gita_verse_fix.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'the-25-minute-sprint';
const BLOCK_ID = '287138d8-f58a-4200-833c-e4c2bd1aa891';
const DRY = process.argv.includes('--dry');

const NEW_MARKDOWN =
  '*कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥*\n\n' +
  'तेरा अधिकार केवल कर्म पर है, उसके फल पर कभी नहीं। फल की इच्छा से कर्म मत कर, और कर्म को त्यागने में भी तेरी आसक्ति न हो।\n\n' +
  'Your right is to the action itself, never to its result. Do not act from desire for the result — but do not use that as a reason to stop acting either.';

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
      summary: 'fix Gita 2.47 verse translation: casual register → dignified, and restore the dropped "don\'t stop acting either" clause; English rewritten to match',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/0 — text-only)`
      : `✓ ${SLUG}: v${res.version} · verse translation fixed`);
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Verse translation fixed.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
