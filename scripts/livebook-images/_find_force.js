require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
  const pages = await db.collection('book_pages').find({ book_id: book, chapter_number: 6 })
    .project({ page_number:1, title:1, slug:1, blocks:1, hinglish_blocks:1 })
    .sort({ page_number:1 }).toArray();
  let pendEn=0, pendHi=0, total=0;
  const countPending = (blocks)=>{let n=0;for(const b of blocks||[]){
    if(b?.type==='image'&&b.generation_prompt&&(!b.src||b.src===''))n++;
    if(b?.type==='callout'&&b.image_prompt&&(!b.image_src||b.image_src===''))n++;
  }return n;};
  for (const p of pages){
    const e=countPending(p.blocks), h=countPending(p.hinglish_blocks);
    pendEn+=e; pendHi+=h;
    console.log(`  p${String(p.page_number).padStart(2)}: ${p.title}  [en pending ${e}${h?`, hi pending ${h}`:''}]`);
  }
  console.log(`\nTOTAL pending: en=${pendEn}, hi=${pendHi}`);
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
