require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const pages = await db.collection('book_pages').find({ book_id: book, chapter_number: 7 })
    .sort({ page_number: 1 }).toArray();
  let pendImg=0, pendCall=0, doneImg=0;
  for (const p of pages) {
    let pi=0;
    for (const b of (p.blocks||[])) {
      if (b?.type==='image' && b.generation_prompt) { (!b.src)?(pendImg++,pi++):doneImg++; }
      if (b?.type==='callout' && b.image_prompt && !b.image_src) { pendCall++; pi++; }
    }
    console.log(`  p${p.page_number}  ${p.slug}  pending:${pi}`);
  }
  console.log(`\nch7 totals — pending image:${pendImg} callout:${pendCall} done:${doneImg}  pages:${pages.length}`);
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
