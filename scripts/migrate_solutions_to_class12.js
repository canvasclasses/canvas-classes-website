/**
 * migrate_solutions_to_class12.js
 *
 * 1. Creates a new "NCERT Simplified" Class 12 Chemistry book (grade: 12)
 * 2. Moves the Solutions chapter (currently Ch 5 in Class 11 book) → Ch 2 of Class 12 book
 * 3. Updates all 13 Solutions pages: book_id → new Class 12 book, chapter_number 5 → 2
 * 4. Unpublishes Ch 5 from the Class 11 book (data preserved, just hidden)
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const CLASS11_BOOK_SLUG = 'ncert-simplified';
const CLASS12_BOOK_SLUG = 'ncert-simplified-12';
const SOLUTIONS_CH_NUM_OLD = 5;   // in Class 11 book
const SOLUTIONS_CH_NUM_NEW = 2;   // NCERT Class 12 Chapter 2

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const books = db.collection('books');
  const pages = db.collection('book_pages');

  // ── 1. Get Class 11 book ────────────────────────────────────────────────────
  const class11Book = await books.findOne({ slug: CLASS11_BOOK_SLUG });
  if (!class11Book) throw new Error('Class 11 book not found');

  const solutionsCh = class11Book.chapters.find(ch => ch.number === SOLUTIONS_CH_NUM_OLD);
  if (!solutionsCh) throw new Error('Solutions chapter not found in Class 11 book');

  console.log('Found Solutions chapter:', solutionsCh.title, '| pages:', solutionsCh.page_ids?.length);

  // ── 2. Check Class 12 book doesn't already exist ───────────────────────────
  const existing12 = await books.findOne({ slug: CLASS12_BOOK_SLUG });
  if (existing12) {
    console.log('Class 12 book already exists — skipping creation');
  }

  // ── 3. Create Class 12 book ────────────────────────────────────────────────
  const class12Id = existing12 ? String(existing12._id) : uuidv4();

  if (!existing12) {
    const class12Book = {
      _id: class12Id,
      slug: CLASS12_BOOK_SLUG,
      title: 'NCERT Simplified',
      subject: 'chemistry',
      grade: 12,
      is_published: true,
      description: 'NCERT Class 12 Chemistry — simplified, interactive, with simulations and inline quizzes.',
      chapters: [
        {
          number: SOLUTIONS_CH_NUM_NEW,
          title: solutionsCh.title,
          slug: solutionsCh.slug,
          description: solutionsCh.description ?? '',
          is_published: true,
          page_ids: solutionsCh.page_ids ?? [],
        },
      ],
      created_at: new Date(),
      updated_at: new Date(),
    };
    await books.insertOne(class12Book);
    console.log('✓ Created Class 12 book, id:', class12Id);
  }

  // ── 4. Update Solutions pages: new book_id + new chapter_number ────────────
  const updateResult = await pages.updateMany(
    { book_id: String(class11Book._id), chapter_number: SOLUTIONS_CH_NUM_OLD },
    {
      $set: {
        book_id: class12Id,
        chapter_number: SOLUTIONS_CH_NUM_NEW,
      },
    }
  );
  console.log('✓ Updated', updateResult.modifiedCount, 'Solutions pages → Class 12 book');

  // ── 5. Unpublish Solutions chapter from Class 11 book ──────────────────────
  await books.updateOne(
    { slug: CLASS11_BOOK_SLUG, 'chapters.number': SOLUTIONS_CH_NUM_OLD },
    { $set: { 'chapters.$.is_published': false } }
  );
  console.log('✓ Unpublished Solutions chapter from Class 11 book');

  // ── 6. Verify ──────────────────────────────────────────────────────────────
  const updatedClass11 = await books.findOne({ slug: CLASS11_BOOK_SLUG });
  console.log('\nClass 11 published chapters:');
  updatedClass11.chapters
    .filter(ch => ch.is_published)
    .sort((a, b) => a.number - b.number)
    .forEach(ch => console.log(' ', ch.number, '|', ch.title));

  const class12Book = await books.findOne({ slug: CLASS12_BOOK_SLUG });
  console.log('\nClass 12 chapters:');
  class12Book.chapters
    .sort((a, b) => a.number - b.number)
    .forEach(ch => console.log(' ', ch.number, '|', ch.title, '| published:', ch.is_published));

  const pageCount12 = await pages.countDocuments({ book_id: class12Id });
  console.log('\nClass 12 pages in DB:', pageCount12);

  await client.close();
  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
