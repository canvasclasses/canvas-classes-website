// Regenerates scripts/bio-book/_practice/ch<N>.js as an exact snapshot of its
// CURRENT live blocks in Mongo (same ids, same content). Needed because the
// authored modules called uuid() at require() time, so every re-save looked
// like a full block removal+addition to book-writer's content-loss guard.
// Usage: node _snapshot_module.js <chapterNumber>
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const ch = Number(process.argv[2]);
(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class11-biology' });
  const page = await db.collection('book_pages').findOne({ book_id: String(book._id), chapter_number: ch, slug: `ch${ch}-practice-ncert-exercises` });
  if (!page) throw new Error(`ch${ch}: no live page found — insert it first`);
  const out = `'use strict';
// Class 11 Biology — Ch.${ch} — "Practice — NCERT Exercises" page.
// SNAPSHOT of the live, already-inserted page (regenerated to fix a
// non-idempotency bug: the original module called uuid() at require() time,
// so every re-save looked like a full block removal+addition to book-writer's
// content-loss guard. This module carries the exact ids currently live in
// Mongo, so re-running insert_practice_pages.js against it is a true no-op.
module.exports = ${JSON.stringify({
    slug: page.slug,
    title: page.title,
    subtitle: page.subtitle,
    page_type: page.page_type,
    tags: page.tags,
    blocks: page.blocks,
  }, null, 2)};
`;
  const f = path.join(__dirname, `ch${ch}.js`);
  fs.writeFileSync(f, out);
  console.log(`ch${ch}: snapshot written, ${page.blocks.length} blocks`);
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
