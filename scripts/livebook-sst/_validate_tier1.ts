import 'dotenv/config';
import mongoose from 'mongoose';
import { validateBlocks } from '../../packages/data/books/schemas';

const slugs = [
  'how-historians-know-the-past','plate-boundaries-earthquakes-and-volcanoes',
  'weathering-breaking-rock-in-place','agents-of-gradation-and-landforms-in-history',
  'wind-landforms-deserts-dunes-and-oases','underground-water-caves-and-karst-landscapes',
  'glacial-landforms-and-moraines','why-social-science-matters','shaping-the-earths-surface-toolkit'
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const db = mongoose.connection.db!;
  const pages = await db.collection('book_pages').find({ slug: { $in: slugs } }).toArray();
  let ok = 0, fail = 0;
  for (const p of pages) {
    try {
      const result = validateBlocks(p.blocks);
      console.log('✅', p.slug, '— schema valid,', (result as any[]).length, 'blocks parsed');
      ok++;
    } catch (e: any) {
      console.log('❌', p.slug, '—', e.message?.slice(0, 800));
      fail++;
    }
  }
  console.log(`\n${ok} valid, ${fail} failed`);
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
