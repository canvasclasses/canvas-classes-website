'use strict';
/**
 * Shared toolkit for the science chapter-end Practice & Mastery banks.
 * Read-modify-write against book_pages, scoped to one science book.
 *
 * Defaults to the Class 9 Science book; override with SCIENCE_BOOK_SLUG to reuse
 * the same toolchain for Class 10 Science (or any future science/math book that
 * uses the shared chapter_practice / apply_express infrastructure).
 *
 * Mirrors scripts/kaveri-fix/_lib.js. Every mutator preserves _id and only
 * touches the fields it is asked to.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const BOOK_SLUG = process.env.SCIENCE_BOOK_SLUG || 'class9-science';

async function withBook(fn) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book ${BOOK_SLUG} not found`);
    const bookId = String(book._id);
    const allPages = await pages
      .find({ book_id: bookId })
      .sort({ chapter_number: 1, page_number: 1 })
      .toArray();
    return await fn({ db, books, pages, book, bookId, allPages });
  } finally {
    await client.close();
  }
}

async function savePageBlocks(pages, pageId, blocks, extra = {}) {
  const set = { blocks, updated_at: new Date(), ...extra };
  const res = await pages.updateOne({ _id: pageId }, { $set: set });
  return res.modifiedCount;
}

// Science concept tags (see PracticeConceptTag in packages/data/types/books.ts).
const SCIENCE_CONCEPTS = ['recall', 'concept', 'application', 'numerical', 'reasoning'];

module.exports = { BOOK_SLUG, SCIENCE_CONCEPTS, withBook, savePageBlocks };
