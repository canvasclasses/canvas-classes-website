'use strict';
/**
 * Read-only inspection: shows current state of all Class 9 books
 * Run: node scripts/inspect_class9_books.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db    = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');

    const class9Books = await books.find({ grade: 9 }).toArray();
    console.log(`Found ${class9Books.length} Class 9 book(s)\n`);

    for (const book of class9Books) {
      const bookId = String(book._id);
      const pub    = book.is_published ? '🟢 LIVE' : '⚪ DRAFT';
      console.log(`${'═'.repeat(60)}`);
      console.log(`${pub}  "${book.title}"`);
      console.log(`  _id:     ${bookId}`);
      console.log(`  slug:    ${book.slug}`);
      console.log(`  subject: ${book.subject}`);
      console.log(`  Chapters (${book.chapters.length}):`);

      const sorted = [...book.chapters].sort((a, b) => a.number - b.number);
      for (const ch of sorted) {
        const chPub = ch.is_published ? '🟢' : '⚪';
        // Count actual pages in DB
        const pageCount = await pages.countDocuments({ book_id: bookId, chapter_number: ch.number });
        const idCount   = ch.page_ids?.length ?? 0;
        const mismatch  = pageCount !== idCount ? ` ⚠ DB=${pageCount} ids=${idCount}` : '';
        console.log(`    ${chPub} Ch${String(ch.number).padEnd(3)} ${ch.title.padEnd(50)} pages:${pageCount}${mismatch}`);
      }

      const totalPages = await pages.countDocuments({ book_id: bookId });
      console.log(`  Total pages in DB: ${totalPages}`);
      console.log();
    }
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
