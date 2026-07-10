require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const p = await db.collection('book_pages').findOne({ book_id: book, chapter_number: 7, page_number: 20 });
  const pb = (p.blocks||[]).find(b=>b.type==='practice_bank');
  console.log('practice_bank top-level keys:', Object.keys(pb));
  for (const k of Object.keys(pb)) {
    const v = pb[k];
    if (Array.isArray(v)) console.log(`  ${k}: array length ${v.length}`);
    else if (v && typeof v==='object') console.log(`  ${k}: object keys [${Object.keys(v).join(',')}]`);
    else console.log(`  ${k}: ${JSON.stringify(v).slice(0,80)}`);
  }
  // try to find the items array wherever it is
  if (pb.sections) {
    console.log('\nsections:', pb.sections.length);
    let total=0;
    pb.sections.forEach((s,i)=>{ const it=s.items||s.questions||[]; total+=it.length; console.log(`  [${i}] ${s.title||s.name||'?'} — ${it.length} items`); });
    console.log('TOTAL items across sections:', total);
  }
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
