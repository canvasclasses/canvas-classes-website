'use strict';
/**
 * Founder rule (2026-07-27): a Live Book chapter title must match its Crucible
 * chapter title verbatim, so a student never sees "Atomic Structure" here and
 * "Structure of Atom" there. Crucible wins — it's the source of truth.
 *
 *   Ch.0  "Mathematics for Physics"  →  "Mathematics in Physics"  (= ph11_math_phy)
 *   Ch.1  "Units and Measurement"    →  "Units and Dimensions"     (= ph11_units, not yet built)
 */
const { savePage, withDb } = require('../lib/book-writer');

withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class11-physics' });
  if (!book) { console.log('book not found — nothing to rename'); return; }

  // Chapter metadata (array field — not versioned content, plain $set is fine).
  const res = await db.collection('books').updateOne(
    { _id: book._id, 'chapters.slug': 'mathematics-for-physics' },
    { $set: { 'chapters.$.title': 'Mathematics in Physics', 'chapters.$.slug': 'mathematics-in-physics', updated_at: new Date() } }
  );
  console.log('chapter renamed:', res.modifiedCount, 'matched:', res.matchedCount);

  // The opener page's slug + title changed in the build script too — rename the
  // already-inserted DB doc to match, through the sanctioned gateway.
  const opener = await db.collection('book_pages').findOne({ book_id: book._id, slug: 'mathematics-for-physics-opener' });
  if (opener) {
    const blocks = opener.blocks;
    await db.collection('book_pages').updateOne(
      { _id: opener._id },
      { $set: { slug: 'mathematics-in-physics-opener', title: 'Mathematics in Physics', chapter_number: opener.chapter_number, updated_at: new Date() } }
    );
    console.log('opener page renamed');
  }
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
