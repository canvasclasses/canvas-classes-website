'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class9-social-science' });
  console.log('book _id:', book._id, '| subject:', book.subject, '| grade:', book.grade, '| board:', book.board, '| is_published:', book.is_published);
  console.log('chapters:', (book.chapters || []).length);
  for (const c of book.chapters || []) {
    const missing = [];
    if (c.number === undefined || c.number === null) missing.push('number');
    if (!c.slug) missing.push('slug');
    if (!c.title) missing.push('title');
    console.log(`  ch#${c.number} pub=${c.is_published} pages=${(c.page_ids||[]).length} slug=${JSON.stringify(c.slug)} title=${JSON.stringify(c.title)}${missing.length ? '  ⚠ MISSING: ' + missing.join(',') : ''}`);
  }
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
