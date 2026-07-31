'use strict';
/**
 * Push the current in-source Unit A page content over the already-inserted DB
 * docs, through the sanctioned gateway (savePage → version snapshot + content-
 * loss guard + audit entry).
 *
 * Needed because the first insert happened accidentally via a `require()` from
 * the dry-run script, before the MCQ answer positions were rebalanced. Safe to
 * re-run: identical content produces a no-op diff.
 *
 * Run:  node scripts/physics11-book/sync_unitA_pages.js [--dry]
 */
const { savePage, withDb, computeReadingTime, computeContentTypes } = require('../lib/book-writer');
const { PAGES } = require('./build_unitA_basic_maths.js');

const dryRun = process.argv.includes('--dry');

/**
 * Block ids are regenerated on every require (uuidv4 at module load), so a naive
 * save looks to the content-loss guard like "every block removed". Re-key the
 * new blocks onto the existing ids positionally — the block list is identical in
 * length and type order, only option arrays and two explanations changed — so
 * the guard sees the real diff instead of a phantom wipe.
 */
function rekey(existing, incoming, slug) {
  if (!existing || existing.length !== incoming.length) {
    throw new Error(`rekey ${slug}: block count changed (${existing?.length} → ${incoming.length}) — inspect before overwriting`);
  }
  return incoming.map((blk, i) => {
    if (existing[i].type !== blk.type) {
      throw new Error(`rekey ${slug}: block ${i} type changed (${existing[i].type} → ${blk.type})`);
    }
    return { ...blk, id: existing[i].id };
  });
}

withDb(async (db) => {
  for (const p of PAGES) {
    const cur = await db.collection('book_pages').findOne({ slug: p.slug });
    const blocks = rekey(cur?.blocks, p.blocks, p.slug);
    const res = await savePage(db, { slug: p.slug }, blocks, {
      author: 'unitA-sync',
      summary: 'Unit A rebuild — rebalanced MCQ answer positions',
      dryRun,
      extraSet: {
        title: p.title,
        subtitle: p.subtitle,
        page_number: p.page_number,
        page_type: p.page_type || 'lesson',
        glossary: p.glossary || undefined,
        reading_time_min: computeReadingTime(p.blocks),
        content_types: computeContentTypes(p.blocks),
      },
    });
    if (dryRun) {
      console.log(`  ${p.slug}: ${res.wouldBlock ? '!! WOULD BLOCK' : 'ok'} ${JSON.stringify(res.diff.reasons || [])}`);
    } else {
      console.log(`  synced ${p.slug}`);
    }
  }
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
