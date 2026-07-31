import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: '.env.local' });
const { withDb } = require('../lib/book-writer');

(async () => {
  await withDb(async (db: any) => {
    const book = await db.collection('books').findOne({ slug: 'class9-mathematics' });
    const bookId = String(book._id);
    let totalBad = 0;
    for (const ch of [1, 2, 3, 5, 6, 7, 8]) {
      const pages = await db.collection('book_pages').find({ book_id: bookId, chapter_number: ch }).toArray();
      let bad = 0;
      let mgCount = 0;
      for (const p of pages.sort((a: any, b: any) => a.page_number - b.page_number)) {
        const r = ContentBlocksArraySchema.safeParse(p.blocks);
        mgCount += (p.blocks || []).filter((b: any) => b.type === 'math_graph').length;
        if (!r.success) { bad++; totalBad++; console.log(`FAIL ch${ch} p${p.page_number} ${p.slug} ::`, JSON.stringify(r.error.issues.slice(0, 3))); }
      }
      console.log(`Ch${ch}: ${pages.length} pages, ${mgCount} math_graph blocks, ${bad === 0 ? '✅ all valid' : `❌ ${bad} invalid`}`);
    }
    console.log(totalBad === 0 ? '\n✅ ALL CHAPTERS VALID' : `\n❌ ${totalBad} page(s) invalid across the book`);
  });
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
