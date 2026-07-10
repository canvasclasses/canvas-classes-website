import 'dotenv/config';
import mongoose from 'mongoose';
import { validateBlocks } from '../../packages/data/books/schemas';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const db = mongoose.connection.db!;
  const book = await db.collection('books').findOne({ _id: 'a60d142c-c96b-48cc-ba72-e68d71d83802' });
  const ch1and2 = book!.chapters.slice(0, 2);
  const allPageIds = ch1and2.flatMap((c: any) => c.page_ids);
  const pages = await db.collection('book_pages').find({ _id: { $in: allPageIds } }).toArray();
  let ok = 0, fail = 0;
  for (const p of pages) {
    const result = validateBlocks(p.blocks);
    if (result.ok) {
      ok++;
    } else {
      console.log('❌', p.slug, '—', result.error);
      fail++;
    }
  }
  console.log(`\n${ok}/${pages.length} valid, ${fail} failed`);
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
