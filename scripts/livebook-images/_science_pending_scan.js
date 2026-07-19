require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
  const pages = await db.collection('book_pages').find({ book_id: book }).toArray();
  const countPending = (blocks)=>{let n=0;for(const b of blocks||[]){
    if(b?.type==='image'&&b.generation_prompt&&(!b.src||b.src===''))n++;
    if(b?.type==='callout'&&b.image_prompt&&(!b.image_src||b.image_src===''))n++;
  }return n;};
  const byCh={};
  for (const p of pages){
    const n = countPending(p.blocks)+countPending(p.hinglish_blocks);
    byCh[p.chapter_number] = (byCh[p.chapter_number]||0)+n;
  }
  for (const k of Object.keys(byCh).sort((a,b)=>a-b)) {
    console.log(`ch${k}: ${byCh[k]} pending`);
  }
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
