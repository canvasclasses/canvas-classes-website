'use strict';
/**
 * Shared scaffold for the Class 11 Mathematics Live Book.
 * PURELY ADDITIVE + idempotent (matches by slug). Everything is created
 * UNPUBLISHED (is_published/published = false) — nothing reaches students until
 * the founder reviews + publishes in the admin books editor.
 *
 * Book: "Class 11 Mathematics" (subject: mathematics, grade 11, board ncert)
 * Chapter 2: "Relations and Functions" (NCERT Ch.2 numbering kept, so Ch.1 Sets /
 * Ch.3 Trig can be added later at their own numbers).
 */
const { computeReadingTime, computeContentTypes, withDb } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK = {
  slug: 'class11-mathematics',
  title: 'Class 11 Mathematics',
  subject: 'mathematics',
  grade: 11,
  board: 'ncert',
};
const CH = {
  number: 2,
  title: 'Relations and Functions',
  slug: 'relations-and-functions',
  description:
    'Ordered pairs and Cartesian products; relations; functions and the vertical-line test; ' +
    'domain, range and the function machine; the function families; algebra of functions; and ' +
    'transformations — taught through interactive graphs.',
};

// block factory: b(type, order, extra) → { id, type, order, ...extra }
const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });

// quiz-question factory
const q = (question, options, correct_index, explanation, difficulty_level) => ({
  id: uuidv4(), question, options, correct_index, explanation, difficulty_level,
});

async function ensureBookAndChapter(db) {
  const books = db.collection('books');
  const now = new Date();
  let book = await books.findOne({ slug: BOOK.slug });
  if (!book) {
    book = {
      _id: uuidv4(), slug: BOOK.slug, title: BOOK.title,
      subject: BOOK.subject, grade: BOOK.grade, board: BOOK.board,
      chapters: [], is_published: false,
      deleted_at: null, created_at: now, updated_at: now,
    };
    await books.insertOne(book);
    console.log('created book:', BOOK.slug, book._id);
  } else {
    console.log('book exists:', BOOK.slug, book._id);
  }
  if (!book.chapters.some((c) => c.slug === CH.slug)) {
    await books.updateOne({ _id: book._id }, {
      $push: { chapters: { number: CH.number, title: CH.title, slug: CH.slug, page_ids: [], description: CH.description, is_published: false } },
      $set: { updated_at: now },
    });
    console.log('added chapter:', CH.number, CH.title);
  } else {
    console.log('chapter exists:', CH.title);
  }
  return book._id;
}

/**
 * Insert (or skip-if-exists) the given pages, then RESET the chapter's page_ids
 * to ALL non-deleted pages for this chapter, ordered by page_number — so running
 * page batches in any order always leaves a correct, complete, ordered list.
 */
async function insertPages(db, bookId, pageList) {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const now = new Date();
  for (const p of pageList) {
    const existing = await pages.findOne({ book_id: bookId, slug: p.slug });
    if (existing) { console.log('  page exists, skipping:', p.slug); continue; }
    const doc = {
      _id: uuidv4(), book_id: bookId,
      chapter_number: CH.number, page_number: p.page_number,
      slug: p.slug, title: p.title, subtitle: p.subtitle || undefined,
      blocks: p.blocks,
      page_type: p.page_type || 'lesson', published: false,
      reading_time_min: computeReadingTime(p.blocks),
      content_types: computeContentTypes(p.blocks),
      tags: [], deleted_at: null, created_at: now, updated_at: now,
    };
    await pages.insertOne(doc);
    console.log('  created page', p.page_number, '·', p.slug, '·', doc.reading_time_min, 'min ·', (doc.content_types.join('/') || '—'));
  }
  const all = await pages.find({ book_id: bookId, chapter_number: CH.number, deleted_at: null }, { projection: { _id: 1, page_number: 1 } }).toArray();
  all.sort((a, c) => a.page_number - c.page_number);
  await books.updateOne(
    { _id: bookId, 'chapters.slug': CH.slug },
    { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: now } },
  );
  console.log('  chapter page_ids set:', all.length, 'pages');
}

module.exports = { BOOK, CH, b, q, ensureBookAndChapter, insertPages, withDb };
