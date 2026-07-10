require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const pages = await db.collection('book_pages').find({ book_id: book }).toArray();
  const byCh = {};
  for (const p of pages) {
    const k = p.chapter_number;
    if (!byCh[k]) byCh[k] = { title: p.chapter_title || '', pages: 0 };
    byCh[k].pages++;
  }
  console.log('Class 11 Chemistry chapters:');
  for (const k of Object.keys(byCh).sort((a,b)=>a-b)) {
    console.log(`  ch${k}: ${byCh[k].title}  (${byCh[k].pages} pages)`);
  }
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
