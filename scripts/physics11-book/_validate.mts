/** Zod-validate every page of the Class 11 Physics book straight from the DB. */
import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { withDb } = require('../lib/book-writer');
(async () => {
  await withDb(async (db: any) => {
    const book = await db.collection('books').findOne({ slug: 'class11-physics' });
    if (!book) { console.log('book not found'); return; }
    const pages = await db.collection('book_pages').find({ book_id: book._id, deleted_at: null }).toArray();
    let bad = 0;
    for (const p of pages.sort((a: any, b: any) => a.chapter_number - b.chapter_number || a.page_number - b.page_number)) {
      const r = ContentBlocksArraySchema.safeParse(p.blocks);
      if (r.success) console.log(`OK   ch${p.chapter_number} p${p.page_number} ${p.slug}`);
      else { bad++; console.log(`FAIL ch${p.chapter_number} p${p.page_number} ${p.slug} ::`, JSON.stringify(r.error.issues.slice(0, 5))); }
    }
    console.log(bad === 0 ? `✅ ALL ${pages.length} VALID` : `❌ ${bad} page(s) invalid`);
  });
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
