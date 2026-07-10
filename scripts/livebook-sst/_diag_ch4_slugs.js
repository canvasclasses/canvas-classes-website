'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const db = c.db('crucible');
  const pages = await db.collection('book_pages').find({ book_id: BOOK_ID, chapter_number: 4 }).project({ slug:1, published:1, deleted_at:1, book_id:1 }).toArray();
  pages.forEach(p => console.log(JSON.stringify({ slug: p.slug, published: p.published, deleted_at: p.deleted_at, book_id_ok: p.book_id === BOOK_ID })));
  // exact test of the route's query
  const hit = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'the-human-family-tree' });
  console.log('DIRECT findOne the-human-family-tree ->', hit ? 'FOUND ('+hit._id+')' : 'NULL');
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
