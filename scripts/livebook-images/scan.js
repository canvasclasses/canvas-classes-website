// Read-only scan: count Livebook image prompts that still need an image.
// Looks at book_pages.blocks[] (and hinglish_blocks[]) for:
//   - type 'image'   with generation_prompt set but src empty
//   - type 'callout' with image_prompt   set but image_src empty
// No writes. Safe to run anytime.
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const pages = await db.collection('book_pages').find({}).toArray();

  let totalImage = 0, totalCallout = 0, pagesWithWork = 0, doneImage = 0;
  const byBookChapter = {};

  const tally = (blocks, page) => {
    let pending = 0;
    for (const b of blocks || []) {
      if (b?.type === 'image' && b.generation_prompt) {
        if (!b.src || b.src === '') { totalImage++; pending++; }
        else doneImage++;
      }
      if (b?.type === 'callout' && b.image_prompt) {
        if (!b.image_src || b.image_src === '') { totalCallout++; pending++; }
      }
    }
    if (pending > 0) {
      const key = `${page.book_id} / ch${page.chapter_number}`;
      byBookChapter[key] = (byBookChapter[key] || 0) + pending;
    }
    return pending;
  };

  for (const page of pages) {
    const p = tally(page.blocks, page) + tally(page.hinglish_blocks, page);
    if (p > 0) pagesWithWork++;
  }

  console.log('=== Livebook image-generation backlog ===');
  console.log(`Pages scanned:          ${pages.length}`);
  console.log(`Pages with pending art: ${pagesWithWork}`);
  console.log(`Pending IMAGE blocks:   ${totalImage}`);
  console.log(`Pending CALLOUT thumbs: ${totalCallout}`);
  console.log(`Already-filled images:  ${doneImage}`);
  console.log('\n--- pending, by book / chapter ---');
  for (const [k, v] of Object.entries(byBookChapter).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`);
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
