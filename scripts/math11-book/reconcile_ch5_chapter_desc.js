'use strict';
/* Class 11 Math · Ch.5 — update the CHAPTER description (in `books.chapters[]`)
   to reflect the real NCERT spine now that the source PDF has been read. This is
   a metadata-only field on the `books` document (not `book_pages`), so it is
   outside book-writer's page-content gateway — but it is still handled narrowly:
   only the `description` string of chapter 5 is touched, nothing else in the
   chapters array or book document. No pages, blocks, or page_ids are touched.
   Run: node scripts/math11-book/reconcile_ch5_chapter_desc.js */
const { withDb } = require('../lib/book-writer');

const NEW_DESCRIPTION =
  'Solving linear inequalities in one variable and the sign-flip rule, with graphical representation on the ' +
  'number line — the real NCERT Ch.5 core (Ex 5.1 + Miscellaneous Exercise, verbatim). Also includes an ' +
  'extension beyond the current rationalised syllabus: graphing a linear inequality in two variables as a ' +
  'shaded half-plane, and systems of two or three inequalities as the overlap of shaded regions — kept as ' +
  'groundwork for Linear Programming, clearly labelled as such on the page.';

async function main() {
  await withDb(async (db) => {
    const books = db.collection('books');
    const book = await books.findOne({ slug: 'class11-mathematics' });
    if (!book) throw new Error('book not found: class11-mathematics');
    const before = (book.chapters || []).find((c) => c.slug === 'linear-inequalities');
    if (!before) throw new Error('chapter not found: linear-inequalities');
    console.log('BEFORE:', before.description);

    const res = await books.updateOne(
      { _id: book._id, 'chapters.slug': 'linear-inequalities' },
      { $set: { 'chapters.$.description': NEW_DESCRIPTION, updated_at: new Date() } },
    );
    console.log('matched:', res.matchedCount, 'modified:', res.modifiedCount);

    const after = await books.findOne({ slug: 'class11-mathematics' });
    const afterCh = (after.chapters || []).find((c) => c.slug === 'linear-inequalities');
    console.log('AFTER:', afterCh.description);
    // sanity: page_ids untouched
    console.log('page_ids still', afterCh.page_ids.length, 'entries, unchanged:',
      JSON.stringify(afterCh.page_ids) === JSON.stringify(before.page_ids));
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
