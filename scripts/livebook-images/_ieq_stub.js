require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const p = await db.collection('book_pages').findOne({ book_id: book, chapter_number: 7, page_number: 20 });
  const pb = (p.blocks||[]).find(b=>b.type==='practice_bank');
  const txt = JSON.stringify(pb);
  for (const re of [/NEEDS_REVIEW/i,/TODO/i,/PLACEHOLDER/i,/TKTK/i,/Lorem ipsum/i]) {
    const m = txt.match(new RegExp('.{40}'+re.source+'.{40}', re.flags));
    if (m) console.log(`HIT ${re}:`, m[0]);
  }
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
