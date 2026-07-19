'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const db = c.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class11-biology' });
  const pages = await db.collection('book_pages')
    .find({ book_id: String(book._id), chapter_number: 15 })
    .project({ slug: 1, page_number: 1, published: 1, 'blocks': 1, deleted_at: 1 }).toArray();
  console.log('ch15 pages in DB:', pages.length);
  for (const p of pages.sort((a,b)=>a.page_number-b.page_number))
    console.log(`  p${p.page_number} ${p.slug} — ${p.blocks.length} blocks, published=${p.published}, deleted=${p.deleted_at}`);
  const ch15 = (book.chapters||[]).find(ch=>ch.number===15);
  console.log('ch15 wired in book.chapters:', ch15 ? `yes (${ch15.page_ids.length} page_ids)` : 'NO');
  // Also confirm ch14 regulation page intact
  const ch14reg = await db.collection('book_pages').findOne({ book_id: String(book._id), chapter_number: 14, slug: 'regulation-and-disorders' }, { projection: { blocks: 1 } });
  console.log('ch14 regulation-and-disorders blocks:', ch14reg ? ch14reg.blocks.length : 'MISSING');
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
