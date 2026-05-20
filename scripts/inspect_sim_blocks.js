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
      .toArray();
    pages.forEach(p => {
      const simBlocks = (p.blocks || []).filter(b => b.type === 'simulation');
      console.log(`P${p.page_number}: ${simBlocks.length} sim block(s)`);
      simBlocks.forEach(s => console.log('  ', JSON.stringify(s)));
    });
  } finally {
    await client.close();
  }
}
main().catch(e => { console.error(e); process.exit(1); });
