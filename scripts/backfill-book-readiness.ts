/**
 * One-time backfill: compute the readiness summary for every Live Book page and
 * store it on `book_pages.readiness`, using the SAME engine the app uses at save
 * time (packages/data/books/readiness.ts). Idempotent — safe to re-run.
 *
 *   npx tsx scripts/backfill-book-readiness.ts
 *
 * After this runs, the Book Readiness dashboard reads pre-computed summaries.
 * The dashboard's "Recompute" button does the same thing via an admin API.
 */
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { computePageReadiness } from '../packages/data/books/readiness';
import { validateBlocks } from '../packages/data/books/schemas';

dotenv.config({ path: '.env.local' });

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env.local');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('crucible');

  const books = await db.collection('books').find({ deleted_at: null }).toArray();
  const subjectByBookId = new Map(books.map((b) => [String(b._id), b.subject as string]));

  const pages = await db
    .collection('book_pages')
    .find({ deleted_at: null })
    .project({ book_id: 1, chapter_number: 1, blocks: 1, hinglish_blocks: 1, published: 1, page_type: 1, review: 1 })
    .toArray();

  const ops: { updateOne: { filter: { _id: unknown }; update: { $set: { readiness: unknown } } } }[] = [];
  const stageTally: Record<string, number> = {};
  let pendingImagesTotal = 0;
  let missingQuiz = 0;

  for (const p of pages) {
    const readiness = computePageReadiness(
      {
        subject: subjectByBookId.get(String(p.book_id)) || '',
        blocks: p.blocks,
        hinglish_blocks: p.hinglish_blocks,
        published: p.published,
        page_type: p.page_type,
        review: p.review ?? null,
      },
      validateBlocks
    );
    ops.push({ updateOne: { filter: { _id: p._id }, update: { $set: { readiness } } } });
    stageTally[readiness.stage] = (stageTally[readiness.stage] || 0) + 1;
    pendingImagesTotal += readiness.pendingImages;
    if (readiness.blockers.includes('No quiz / checkpoint block')) missingQuiz++;
  }

  if (ops.length) await db.collection('book_pages').bulkWrite(ops, { ordered: false });

  console.log(`\n✅ Backfilled readiness for ${ops.length} pages across ${books.length} books.`);
  console.log('   Stage distribution:', stageTally);
  console.log(`   Total images pending: ${pendingImagesTotal}`);
  console.log(`   Pages missing a quiz: ${missingQuiz}`);

  // Spot-check: a chapter we know is drafted-but-unillustrated should show pending images.
  const sci = books.find((b) => b.slug === 'class9-science');
  if (sci) {
    const ch8 = await db.collection('book_pages')
      .find({ book_id: String(sci._id), chapter_number: 8, deleted_at: null })
      .project({ title: 1, readiness: 1 }).toArray();
    const imgs = ch8.reduce((a, p) => a + (p.readiness?.pendingImages || 0), 0);
    console.log(`\n   Spot-check — Class 9 Science Ch8: ${ch8.length} pages, ${imgs} images pending.`);
  }

  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
