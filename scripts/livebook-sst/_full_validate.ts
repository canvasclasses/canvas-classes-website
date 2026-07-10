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
  for (const p of pages) {
    const result = validateBlocks(p.blocks);
    if (!result.ok) {
      console.log(`\n=== ${p.slug} (${result.issues.length} issue(s)) ===`);
      for (const iss of result.issues) {
        console.log('  -', iss.path.join('.'), ':', iss.message);
      }
    }
  }
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
