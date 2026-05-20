'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const CHAPTER_NUMBER = 2;
async function main() {
  const cmd = process.argv[2];
  if (cmd !== 'publish' && cmd !== 'unpublish') {
    console.error('Usage: node scripts/toggle_math_ch2_publish.js {publish|unpublish}');
    process.exit(1);
  }
  const flag = cmd === 'publish';
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const r1 = await db.collection('book_pages').updateMany(
      { book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER },
      { $set: { published: flag } }
    );
    const r2 = await db.collection('books').updateOne(
      { _id: BOOK_ID, 'chapters.number': CHAPTER_NUMBER },
      { $set: { 'chapters.$.is_published': flag } }
    );
    console.log(`✅ pages: ${r1.modifiedCount} updated · chapter: ${r2.modifiedCount} updated → published=${flag}`);
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
