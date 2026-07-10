'use strict';
// Founder feedback (2026-07-08, screenshot): "remove this section" — the
// Chamoli hero photo (SDRF rescue team clearing debris in the Tapovan tunnel).
// Confirmed via AskUserQuestion: delete the hero block entirely (not just
// clear its src) — the page now opens directly with the 3-image Chamoli
// overview gallery already sitting right below it (added earlier this turn).
// This is the one page in the book without a block[0] hero banner, by
// explicit founder choice.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'landforms-and-disasters' });
    const idx = page.blocks.findIndex((b) => b.id === 'ff04e412-74b1-4853-88c9-30269ebd9397');
    if (idx === -1) throw new Error('Chamoli hero block not found');
    const updated = page.blocks.filter((_, i) => i !== idx);
    const res = await bw.savePage(db, { slug: 'landforms-and-disasters' }, updated, {
      author: 'agent',
      summary: 'Deleted the Chamoli hero image block (rescue-tunnel photo) — founder confirmed via AskUserQuestion: delete entirely, not just clear. Page now opens directly with the 3-image Chamoli overview gallery.',
      allowContentLoss: true,
      lossReason: 'Founder explicit instruction ("remove this section") + confirmed scope via AskUserQuestion ("Delete the hero block entirely"). R2 asset not deleted, only unlinked from this block.',
    });
    console.log(`✓ landforms-and-disasters — hero block removed (v${res.version}), page now ${updated.length} blocks`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
