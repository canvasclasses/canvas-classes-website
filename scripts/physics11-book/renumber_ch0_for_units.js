'use strict';
/**
 * Ch.0 restructure (founder framework, 2026-07-29): the chapter is now three
 * explicit units, in this order —
 *
 *   Unit A  Basic Maths                 pages 0–12
 *   Unit B  Differentiation & Integration  pages 13–22
 *   Unit C  Vectors                     pages 23–34
 *
 * The 10 already-built pages keep their content untouched; only page_number
 * moves, to open the slots the new pages occupy. page_number is ordering
 * metadata (not versioned block content), so a plain $set is correct here —
 * same treatment as the chapter-title rename.
 *
 * Run:  node scripts/physics11-book/renumber_ch0_for_units.js
 */
const { withDb } = require('../lib/book-writer');

// slug → new page_number
const MOVES = {
  'mathematics-in-physics-opener': 0,   // A0  (was 0)
  'why-physics-leans-on-maths': 1,      // A1  (was 1)
  'powers-of-ten': 2,                   // A2  (was 2)
  'rearranging-formulas': 3,            // A3  (was 3)
  'trigonometry-for-physics': 9,        // A9  (was 4)
  'small-angle-shortcut': 11,           // A11 (was 5)
  'scalars-and-vectors': 23,            // C1  (was 6)
  'anatomy-of-a-vector': 24,            // C2  (was 7)
  'adding-vectors-triangle-law': 26,    // C4  (was 8)
  'subtracting-vectors': 31,            // C9  (was 9)
};

withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class11-physics' });
  if (!book) throw new Error('book class11-physics not found');
  const pages = db.collection('book_pages');
  const now = new Date();

  for (const [slug, n] of Object.entries(MOVES)) {
    const r = await pages.updateOne(
      { book_id: book._id, chapter_number: 0, slug, deleted_at: null },
      { $set: { page_number: n, updated_at: now } },
    );
    console.log(r.matchedCount ? `  ${String(n).padStart(2)} ← ${slug}` : `  !! not found: ${slug}`);
  }

  // Re-sort the chapter's page_ids by the new page_number.
  const all = await pages
    .find({ book_id: book._id, chapter_number: 0, deleted_at: null }, { projection: { _id: 1, page_number: 1, title: 1 } })
    .toArray();
  all.sort((a, c) => a.page_number - c.page_number);
  await db.collection('books').updateOne(
    { _id: book._id, 'chapters.slug': 'mathematics-in-physics' },
    { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: now } },
  );
  console.log('\nchapter order now:');
  all.forEach((p) => console.log(`  ${String(p.page_number).padStart(2)}  ${p.title}`));
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
