import 'dotenv/config';
import mongoose from 'mongoose';
import { validateBlocks } from '../../packages/data/books/schemas';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const db = mongoose.connection.db!;
  const p = await db.collection('book_pages').findOne({ slug: 'landforms-and-disasters' });
  try {
    const result = validateBlocks(p!.blocks);
    console.log('✅ landforms-and-disasters — schema valid,', p!.blocks.length, 'blocks');
    const psBlock = (result as any[]).find((b: any) => b.type === 'perspective_scenario');
    console.log('perspective_scenario block parsed OK:', !!psBlock, '| options:', psBlock?.options?.length);
  } catch (e: any) {
    console.log('❌ FAILED:', e.message);
    process.exitCode = 1;
  }
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
