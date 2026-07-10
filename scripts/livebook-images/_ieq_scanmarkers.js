require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const pages = await db.collection('book_pages').find({ book_id: book, chapter_number: 7 }).toArray();
  const tokens = ['NEEDS_REVIEW','TODO','PLACEHOLDER','TKTK','Lorem ipsum'];
  let found = 0;
  for (const p of pages) {
    const pb = (p.blocks||[]).find(b=>b.type==='practice_bank');
    if (!pb) continue;
    pb.sections.forEach((s,si)=>(s.items||[]).forEach(it=>{
      const blob = JSON.stringify(it);
      for (const t of tokens) {
        let i = blob.indexOf(t);
        if (i!==-1){ found++; console.log(`p${p.page_number} sec[${si}] item ${it.id}: token "${t}" → ...${blob.slice(Math.max(0,i-30), i+60)}...`); }
      }
    }));
  }
  if (!found) console.log('No markers remain in any practice item.');
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
