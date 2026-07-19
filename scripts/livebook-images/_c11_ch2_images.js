require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const pages = await db.collection('book_pages').find({ book_id: book, chapter_number: 2 })
    .sort({ page_number:1 }).toArray();
  const out = [];
  const collect = (blocks, lang) => {
    for (const b of blocks || []) {
      if (b?.type === 'image' && b.src) {
        out.push({ page: null, slug: null, blockId: b.id, prompt: b.generation_prompt || '', alt: b.alt || '', src: b.src, lang });
      }
      if (b?.type === 'callout' && b.image_src) {
        out.push({ page: null, slug: null, blockId: b.id, prompt: b.image_prompt || '', alt: b.title || '', src: b.image_src, lang });
      }
    }
  };
  for (const p of pages) {
    const before = out.length;
    collect(p.blocks, 'en');
    for (let i = before; i < out.length; i++) { out[i].page = p.page_number; out[i].slug = p.slug; }
  }
  console.log(`Class 11 ch2 (Atomic Structure): ${pages.length} pages, ${out.length} filled images`);
  console.log(JSON.stringify(out, null, 2));
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
