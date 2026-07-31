'use strict';
/**
 * Follow-up to _restructure_atomic_spectra.js.
 *
 * The browser QA pass on the restructured page found one surviving wrong
 * Rydberg symbol that the bulk fix missed, for two compounding reasons:
 *   • it lives in a `latex_block`'s **note** field, which was not in the list
 *     of text-bearing keys the bulk fixer walked; and
 *   • it is a literal Unicode "R∞", not the LaTeX `R_\infty` the regex looked
 *     for — so even a wider key list would have skipped it.
 *
 * 109,677 cm^-1 is R_H (hydrogen, finite nuclear mass); R_infinity is
 * 109,737 cm^-1. The exam-tip callout on this page now explains the
 * distinction explicitly, so the note just needs the correct symbol.
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('../lib/book-writer');

const PAGE_ID = 'e2f53c0a-b122-45d5-bda8-453beaba41e2';
const DRY = process.argv.includes('--dry');

(async () => {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ _id: PAGE_ID });
    if (!page) throw new Error('page not found');

    let touched = 0;
    const blocks = page.blocks.map((b) => {
      if (typeof b.note !== 'string' || !b.note.includes('R∞')) return b;
      touched++;
      return { ...b, note: b.note.replace(/\(R∞\)/g, '(R_H)').replace(/R∞/g, 'R_H') };
    });

    if (!touched) { console.log('nothing to fix'); return; }
    console.log(`patching ${touched} block(s)`);
    blocks.forEach((b, i) => { if (b.note && b.note !== page.blocks[i].note) console.log('  >', b.note); });

    const dry = await bw.savePage(db, { pageId: PAGE_ID }, blocks, { dryRun: true });
    console.log('DIFF:', JSON.stringify(dry.diff));
    if (DRY) { console.log('--dry, nothing written'); return; }

    await bw.savePage(db, { pageId: PAGE_ID }, blocks, {
      author: 'agent',
      summary: 'Fix surviving Unicode "R∞" in a latex_block note field — 109,677 cm^-1 is R_H, not R_infinity (found by browser QA after the restructure).',
    });
    console.log('SAVED.');
  });
})().catch((e) => { console.error(e); process.exit(1); });
