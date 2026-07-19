import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { validateBlocks } from '../../packages/data/books/schemas';

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db('crucible');
  const pages = await db.collection('book_pages').find({ deleted_at: null }).toArray();
  let invalid = 0;
  for (const p of pages) {
    const result = validateBlocks(p.blocks as any);
    if (!result.ok) {
      invalid++;
      console.log(`\n=== ${p.slug} (${result.issues.length} issue(s)) ===`);
      for (const iss of result.issues) console.log('  -', iss.path.join('.'), ':', iss.message);
    }
  }
  console.log(`\nSCAN COMPLETE: ${invalid} invalid / ${pages.length} pages`);
  await client.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
