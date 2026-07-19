require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e'; // Class 11 Chemistry
  const pages = await db.collection('book_pages').find({ book_id: book })
    .project({ chapter_number:1, page_number:1, title:1, slug:1 })
    .sort({ chapter_number:1, page_number:1 }).toArray();
  const byCh={};
  for (const p of pages){ (byCh[p.chapter_number]=byCh[p.chapter_number]||[]).push(p.title); }
  for (const k of Object.keys(byCh).sort((a,b)=>a-b)) {
    console.log(`ch${k}: ${byCh[k].slice(0,3).join(' | ')}`);
  }
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
