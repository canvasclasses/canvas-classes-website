'use strict';
/**
 * snapshot-all-book-pages.js — one-time/idempotent BASELINE.
 * Snapshots the CURRENT state of every Live Book page into `book_page_versions`
 * as a recovery point, so nothing as of today can be lost. Safe: reads + inserts
 * only; never modifies book_pages. Re-runnable (skips pages that already have a
 * version). Run: node scripts/snapshot-all-book-pages.js
 */
const bw = require('./lib/book-writer');

bw.withDb(async (db) => {
  await bw.ensureIndexes(db);
  const pages = await db.collection('book_pages').find({}).toArray();
  const versions = db.collection('book_page_versions');
  let created = 0, backfilled = 0, skipped = 0;
  for (const p of pages) {
    const existing = await versions.findOne({ page_id: p._id }, { sort: { version: 1 } });
    if (!existing) {
      await bw.snapshotVersion(db, p, 'baseline snapshot 2026-06-14 (Phase 1 content protection)', 'baseline');
      created++;
    } else if (!existing.doc) {
      // backfill full doc onto a baseline created before the doc field existed (page unchanged since)
      await versions.updateOne({ _id: existing._id }, { $set: { doc: p, asset_refs: [...bw.collectAssetRefs(p.blocks || [])] } });
      backfilled++;
    } else { skipped++; }
  }
  console.log(`Pages: ${pages.length} | created: ${created} | full-doc backfilled: ${backfilled} | already complete: ${skipped}`);
  const totalVersions = await db.collection('book_page_versions').countDocuments({});
  console.log(`book_page_versions total docs: ${totalVersions}`);
}).catch((e) => { console.error('ERR', e.message); process.exit(1); });
