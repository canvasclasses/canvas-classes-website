'use strict';
/**
 * Re-save Ch.0 pages 8 & 10 through the sanctioned book-writer gateway after the
 * guided-steps redesign (versioned + audit-logged + content-loss guarded).
 * Run with --dry to preview the diff without writing.
 */
const { savePage, withDb } = require('../lib/book-writer');
const { pages } = require('./build_ch0_vector_addition.js');

const dryRun = process.argv.includes('--dry');

withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class11-physics' });
  for (const p of pages) {
    const res = await savePage(db, { book_id: book._id, slug: p.slug }, p.blocks, {
      author: 'agent:physics-ch0',
      summary: 'Guided step-by-step boards + drag practice after each teach board (founder review 2026-07-27)',
      dryRun,
      allowContentLoss: true,
      lossReason: 'Author-requested restructure of two unpublished pilot pages built earlier the same session.',
    });
    console.log(`${dryRun ? 'DRY ' : ''}p${p.page_number} ${p.slug}:`,
      JSON.stringify({ removed: res.diff?.removedBlockIds?.length, added: res.diff?.addedBlockIds?.length }));
  }
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
