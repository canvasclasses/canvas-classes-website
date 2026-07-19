'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const db = c.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class11-biology' });
  console.log('Book chapters:', book.chapters.length);
  for (const ch of book.chapters.filter(x => x.number >= 9)) {
    const pages = await db.collection('book_pages').find({ _id: { $in: ch.page_ids }, deleted_at: null }).project({ published: 1 }).toArray();
    const pub = pages.filter(p => p.published).length;
    console.log(`  Ch${ch.number} "${ch.title}": ${ch.page_ids.length} pages wired, ${pages.length} live, ${pub} published`);
  }
  const total = await db.collection('book_pages').countDocuments({ book_id: String(book._id), deleted_at: null });
  console.log('Total live pages in class11-biology:', total);
  await c.close();
})().catch(e => { console.error(e); process.exit(1); });
