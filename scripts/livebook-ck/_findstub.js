'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const db = c.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'ncert-simplified-12' });
  const ch = book.chapters.find((x) => x.number === 3);
  console.log('chapter page_ids count:', ch.page_ids.length);
  for (const id of ch.page_ids) {
    const p = await db.collection('book_pages').findOne({ _id: id });
    if (!p) { console.log('NULL page_id (orphan):', id); continue; }
    const textN = (p.blocks || []).filter((b) => b.type === 'text').length;
    if (textN === 0) console.log(`ZERO text blocks: p${p.page_number} ${p.slug} (types: ${(p.blocks||[]).map(b=>b.type).join(',')})`);
  }
  console.log('done');
  await c.close();
})().catch((e) => { console.error(e); process.exit(1); });
