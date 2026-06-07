'use strict';
/**
 * Shared toolkit for the Kaveri (Class 9 English) content-fix scripts.
 * Read-modify-write against book_pages, scoped to the class9-english-kaveri book.
 * Every mutator preserves _id and only touches the fields it is asked to.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-english-kaveri';

async function withBook(fn) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('Kaveri book not found');
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

// Save a single page's blocks (and optionally tags) back to Mongo.
async function savePageBlocks(pages, pageId, blocks, extra = {}) {
  const set = { blocks, updated_at: new Date(), ...extra };
  const res = await pages.updateOne({ _id: pageId }, { $set: set });
  return res.modifiedCount;
}

function sectionTag(page) {
  return (page.tags || []).find((t) => t.startsWith('kaveri_section:')) || '';
}
function pieceTag(page) {
  return (page.tags || []).find((t) => t.startsWith('kaveri_piece:')) || '';
}

module.exports = { BOOK_SLUG, withBook, savePageBlocks, sectionTag, pieceTag };
