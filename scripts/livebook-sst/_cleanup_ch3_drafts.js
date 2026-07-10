'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const SLUGS = ['the-blanket-of-air', 'layers-of-the-atmosphere'];
(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const pages = await db.collection('book_pages').find({ book_id: BOOK_ID, slug: { $in: SLUGS } }).toArray();
  for (const p of pages) {
    const hasAsset = (p.blocks || []).some((b) => (b.src && b.src.length) || (b.items || []).some((it) => it && it.src));
    if (p.published || hasAsset) { console.log(`REFUSE ${p.slug}: published=${p.published} hasAsset=${hasAsset}`); continue; }
    await db.collection('book_pages').deleteOne({ _id: p._id });
    await db.collection('books').updateOne({ _id: BOOK_ID, 'chapters.number': 3 }, { $pull: { 'chapters.$.page_ids': p._id } });
    console.log(`removed draft "${p.slug}" (${p.blocks.length} blocks, 0 assets) + unlinked`);
  }
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
