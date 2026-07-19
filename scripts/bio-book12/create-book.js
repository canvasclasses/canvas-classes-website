'use strict';
/**
 * Creates the Class 12 Biology Live Book shell (class12-biology) if absent.
 * Idempotent — safe to re-run. Chapters are added by each ch<N>/build.js via
 * build-lib.buildChapter, so this only needs the empty book doc to exist.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { v4: uuid } = require('uuid');
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class12-biology';

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const books = client.db('crucible').collection('books');
    const existing = await books.findOne({ slug: BOOK_SLUG });
    if (existing) {
      console.log(`Book ${BOOK_SLUG} already exists: ${existing._id} (${(existing.chapters || []).length} chapters).`);
      return;
    }
    const bookDoc = {
      _id: uuid(), slug: BOOK_SLUG, title: 'Class 12 Biology',
      subject: 'biology', grade: 12, board: 'ncert',
      chapters: [],
      is_published: false,
      created_at: new Date(), updated_at: new Date(),
    };
    await books.insertOne(bookDoc);
    console.log(`Created book ${BOOK_SLUG}: ${bookDoc._id}`);
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
