require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const p = await db.collection('book_pages').findOne({ book_id: book, chapter_number: 7, page_number: 20 });
  const pb = (p.blocks||[]).find(b=>b.type==='practice_bank');
  for (const s of pb.sections) for (const it of (s.items||[])) {
    if (it.id==='ieq-ncert-7-66') {
      const sol = it.solution||it.answer||it.explanation||'';
      const idx = sol.indexOf('NEEDS_REVIEW');
      console.log('FULL NEEDS_REVIEW note:\n', sol.slice(idx));
    }
  }
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
