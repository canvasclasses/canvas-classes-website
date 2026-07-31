'use strict';
/**
 * Browser-QA fix: the identify explanation on p25 said "the first / second /
 * third diagram", but the UI labels the options A, B and C. Match the labels
 * the student actually sees.
 *
 * Run:  node scripts/physics11-book/sync_p25_identify_wording.js [--dry]
 */
const { savePage, withDb } = require('../lib/book-writer');
const { PAGES } = require('./build_unitC_vectors.js');

const dryRun = process.argv.includes('--dry');
const src = PAGES.find((p) => p.slug === 'types-of-vectors-and-the-angle-between');
const newExplanation = src.blocks.find((b) => b.type === 'vector_board').identify.explanation;

withDb(async (db) => {
  const page = await db.collection('book_pages').findOne({ slug: src.slug });
  const blocks = page.blocks.map((b) =>
    b.type === 'vector_board' && b.identify
      ? { ...b, identify: { ...b.identify, explanation: newExplanation } }
      : b
  );
  const r = await savePage(db, { slug: src.slug }, blocks, {
    author: 'unitC-qa-fix', summary: 'Identify explanation now names options A/B/C as displayed', dryRun,
  });
  console.log(`  p25: ${dryRun ? (r.wouldBlock ? '!! WOULD BLOCK' : 'ok') : 'saved'}`);
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
