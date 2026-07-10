require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const p = await db.collection('book_pages').findOne({ book_id: book, chapter_number: 7, page_number: 20 });
  const pb = (p.blocks||[]).find(b=>b.type==='practice_bank');
  pb.sections.forEach((s,si)=>{
    (s.items||[]).forEach((it,ii)=>{
      const blob = JSON.stringify(it);
      if (/NEEDS_REVIEW/.test(blob)) {
        console.log(`\n=== Section [${si}] "${s.title}" item ${ii} ===`);
        console.log('id:', it.id, '| badge/source:', it.source||it.badge);
        console.log('prompt:', (it.prompt||it.question||it.text||'').slice(0,300));
        console.log('answer/solution:', (it.solution||it.answer||it.explanation||'').slice(0,800));
      }
    });
  });
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
