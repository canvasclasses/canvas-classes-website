import 'dotenv/config';
import mongoose from 'mongoose';
import { validateBlocks } from '../../packages/data/books/schemas';
async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const db = mongoose.connection.db!;
  const pages = await db.collection('book_pages').find({ book_id: 'a60d142c-c96b-48cc-ba72-e68d71d83802', chapter_number: 4 }).toArray();
  let ok = 0, fail = 0;
  for (const p of pages.sort((a: any, b: any) => a.page_number - b.page_number)) {
    const r = validateBlocks(p.blocks);
    if (r.ok) { ok++; console.log('✅', p.slug, `(${p.blocks.length} blocks, ~${p.reading_time_min}min)`); }
    else { fail++; console.log('❌', p.slug, '—', JSON.stringify((r as any).error).slice(0, 300)); }
  }
  console.log(`\n${ok}/${ok + fail} Ch4 pages valid, ${fail} failed`);
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
