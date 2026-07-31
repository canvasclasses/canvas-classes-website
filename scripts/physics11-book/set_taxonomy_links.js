'use strict';
/**
 * Wire Ch.0 to the Crucible chapter `ph11_math_phy` and tag each content page
 * with the topic it teaches, so the reader can hand students off to practice.
 * Pure metadata — no blocks touched.
 */
const { withDb } = require('../lib/book-writer');

const CRUCIBLE_CHAPTER = 'ph11_math_phy';
const PAGE_TAGS = {
  'trigonometry-for-physics':   ['tag_mip_7'],
  'small-angle-shortcut':       ['tag_mip_7'],
  'scalars-and-vectors':        ['tag_mip_1'],
  'anatomy-of-a-vector':        ['tag_mip_1'],
  'adding-vectors-triangle-law':['tag_mip_2'],
  'subtracting-vectors':        ['tag_mip_2'],
};

withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class11-physics' });
  await db.collection('books').updateOne(
    { _id: book._id, 'chapters.slug': 'mathematics-for-physics' },
    { $set: { 'chapters.$.crucible_chapter_id': CRUCIBLE_CHAPTER, updated_at: new Date() } }
  );
  console.log(`chapter → ${CRUCIBLE_CHAPTER}`);
  for (const [slug, tags] of Object.entries(PAGE_TAGS)) {
    const r = await db.collection('book_pages').updateOne(
      { book_id: book._id, slug },
      { $set: { crucible_tags: tags, updated_at: new Date() } }
    );
    console.log(`  ${r.matchedCount ? '✓' : '✗'} ${slug} → ${tags.join(', ')}`);
  }
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
