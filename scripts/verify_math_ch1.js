'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = await db.collection('book_pages')
      .find({ book_id: BOOK_ID, chapter_number: 1 })
      .sort({ page_number: 1 })
      .project({ page_number: 1, slug: 1, title: 1, published: 1, blocks: 1 })
      .toArray();
    console.log(`\nFound ${pages.length} pages in chapter 1:\n`);
    pages.forEach(p => {
      const types = (p.blocks || []).reduce((m, b) => { m[b.type] = (m[b.type] || 0) + 1; return m; }, {});
      const sims = (p.blocks || []).filter(b => b.type === 'simulation').map(b => b.simulation_id).join(', ');
      const typeStr = Object.entries(types).map(([t, n]) => `${t}×${n}`).join(', ');
      console.log(`P${p.page_number}: ${p.title}`);
      console.log(`     slug: ${p.slug}`);
      console.log(`     blocks (${p.blocks?.length || 0}): ${typeStr}`);
      console.log(`     sims: ${sims || '(none)'}`);
      console.log(`     published: ${p.published}`);
      console.log('');
    });
    const book = await db.collection('books').findOne({ _id: BOOK_ID });
    const ch1 = book?.chapters.find(c => c.number === 1);
    console.log(`Book chapter 1 page_ids count: ${ch1?.page_ids?.length || 0}`);
    console.log(`Book chapter 1 is_published: ${ch1?.is_published}`);
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
