// Emit the ordered queue of Livebook image prompts that still need an image.
// READ-ONLY. Writes a JSON queue file the run-loop walks through.
//
// Usage:
//   node scripts/livebook-images/worklist.js                       # everything pending
//   node scripts/livebook-images/worklist.js --book <bookId>       # one book
//   node scripts/livebook-images/worklist.js --book <id> --chapter 2
//   node scripts/livebook-images/worklist.js --chapter 2 --limit 20
//   node scripts/livebook-images/worklist.js --out queue.json      # custom output path
//
// Output (default): scripts/livebook-images/_queue.json
// Each item: { pageId, slug, bookId, chapterNumber, pageNumber, lang,
//              blockId, kind: 'image'|'callout', prompt, alt, targetField }
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const bookFilter = arg('book');
const chapterFilter = arg('chapter') ? Number(arg('chapter')) : null;
const limit = arg('limit') ? Number(arg('limit')) : Infinity;
const outPath = arg('out') || path.join(__dirname, '_queue.json');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const q = {};
  if (bookFilter) q.book_id = bookFilter;
  if (chapterFilter !== null) q.chapter_number = chapterFilter;

  const pages = await db
    .collection('book_pages')
    .find(q)
    .sort({ book_id: 1, chapter_number: 1, page_number: 1 })
    .toArray();

  const queue = [];
  const collect = (blocks, page, lang) => {
    for (const b of blocks || []) {
      if (b?.type === 'image' && b.generation_prompt && (!b.src || b.src === '')) {
        queue.push({
          pageId: page._id, slug: page.slug, bookId: page.book_id,
          chapterNumber: page.chapter_number, pageNumber: page.page_number, lang,
          blockId: b.id, kind: 'image', targetField: 'src',
          prompt: b.generation_prompt, alt: b.alt || '',
        });
      }
      if (b?.type === 'callout' && b.image_prompt && (!b.image_src || b.image_src === '')) {
        queue.push({
          pageId: page._id, slug: page.slug, bookId: page.book_id,
          chapterNumber: page.chapter_number, pageNumber: page.page_number, lang,
          blockId: b.id, kind: 'callout', targetField: 'image_src',
          prompt: b.image_prompt, alt: b.title || '',
        });
      }
    }
  };

  for (const page of pages) {
    collect(page.blocks, page, 'en');
    collect(page.hinglish_blocks, page, 'hi');
  }

  const sliced = queue.slice(0, limit);
  fs.writeFileSync(outPath, JSON.stringify(sliced, null, 2));

  console.log(`Queued ${sliced.length} of ${queue.length} pending images -> ${outPath}`);
  if (sliced.length) {
    console.log('\nFirst few:');
    for (const it of sliced.slice(0, 5)) {
      console.log(`  [${it.kind}] ${it.slug} (ch${it.chapterNumber}) block ${it.blockId.slice(0, 8)} — ${it.prompt.slice(0, 70)}...`);
    }
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
