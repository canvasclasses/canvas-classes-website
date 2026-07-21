'use strict';
/**
 * One-time (re-runnable) backfill: stamp `worked_example_count` on every
 * book_pages doc so the reader can compute chapter-continuous "Solved Example N"
 * numbering. Going forward book-writer.js maintains this on every save.
 * Raw updateOne is acceptable here — this writes ONLY the derived count field,
 * never blocks/assets, so the content-loss guard is not relevant.
 */
const bw = require('./lib/book-writer');

const DRY = process.argv.includes('--dry');

bw.withDb(async (db) => {
  const pages = await db.collection('book_pages')
    .find({}, { projection: { _id: 1, slug: 1, blocks: 1, worked_example_count: 1 } })
    .toArray();

  let changed = 0, unchanged = 0;
  for (const p of pages) {
    const count = bw.computeWorkedExampleCount(p.blocks || []);
    if (p.worked_example_count === count) { unchanged++; continue; }
    changed++;
    if (count > 0) console.log(`  ${p.slug}: ${p.worked_example_count ?? '(unset)'} -> ${count}`);
    if (!DRY) {
      await db.collection('book_pages').updateOne(
        { _id: p._id },
        { $set: { worked_example_count: count } }
      );
    }
  }
  console.log(`\n${DRY ? '[DRY] ' : ''}pages=${pages.length} changed=${changed} unchanged=${unchanged}`);
}).catch((e) => { console.error(e); process.exit(1); });
