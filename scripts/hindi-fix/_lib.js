'use strict';
/** Shared toolkit for Class 9 Hindi गंगा content-fix scripts. Read-modify-write
 * book_pages, scoped to class9-hindi-ganga. Mirrors scripts/kaveri-fix/_lib.js. */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const BOOK_SLUG = 'class9-hindi-ganga';
async function withBook(fn) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const pages = db.collection('book_pages');
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('गंगा book not found');
    const allPages = await pages.find({ book_id: String(book._id) }).sort({ chapter_number: 1, page_number: 1 }).toArray();
    return await fn({ db, pages, book, bookId: String(book._id), allPages });
  } finally { await client.close(); }
}
async function savePageBlocks(pages, pageId, blocks) {
  return (await pages.updateOne({ _id: pageId }, { $set: { blocks, updated_at: new Date() } })).modifiedCount;
}
// Walk every MCQ across all 5 surfaces in a page; cb(q, ctx) may mutate q in place.
// ctx = { surface, block }. Returns count of MCQs visited.
function eachMcq(page, cb) {
  let n = 0;
  for (const b of page.blocks || []) {
    if (b.type === 'inline_quiz') for (const q of b.questions || []) { if (hasMcq(q)) { cb(q, { surface: 'inline_quiz', block: b }); n++; } }
    else if (b.type === 'chapter_practice') for (const q of b.questions || []) { if (hasMcq(q)) { cb(q, { surface: 'chapter_practice', block: b }); n++; } }
    else if (b.type === 'comprehension_checkpoint') for (const q of b.questions || []) { if (hasMcq(q)) { cb(q, { surface: 'checkpoint', block: b }); n++; } }
    else if (b.type === 'vocabulary_lab') for (const q of b.self_check || []) { if (hasMcq(q)) { cb(q, { surface: 'vocab_self_check', block: b }); n++; } }
    else if (b.type === 'apply_express') for (const q of b.challenges || []) { if (q.kind === 'form_select' && hasMcq(q)) { cb(q, { surface: 'form_select', block: b }); n++; } }
  }
  return n;
}
function hasMcq(q) { return Array.isArray(q.options) && q.correct_index != null; }
module.exports = { BOOK_SLUG, withBook, savePageBlocks, eachMcq };
