'use strict';
/**
 * Shared orchestrator for the Class 12 Biology Live Book (class12-biology).
 * Idempotent: creates/updates a chapter + its pages from an array of page
 * modules, wires chapter.page_ids in order, computes reading_time/content_types.
 *
 * Mirror of scripts/bio-book/build-lib.js (Class 11) — same page-module
 * contract, same guarded book-writer gateway (versioned, content-loss-guarded,
 * soft-delete). Re-running never duplicates and never silently loses content.
 */
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');

const BOOK_SLUG = 'class12-biology';

async function buildChapter(db, chapter, pageModules) {
  const books = db.collection('books');
  const pages = db.collection('book_pages');

  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error(`Book ${BOOK_SLUG} not found — run create-book.js first.`);
  const bookId = String(book._id);

  const orderedIds = [];
  for (const m of pageModules.sort((a, b) => a.page_number - b.page_number)) {
    const existing = await pages.findOne({ book_id: bookId, slug: m.slug });
    if (existing) {
      await bw.savePage(db, { pageId: existing._id }, m.blocks, {
        author: 'agent', summary: `bio12 ch${chapter.number} rebuild: ${m.slug}`,
        extraSet: {
          title: m.title, subtitle: m.subtitle || '',
          chapter_number: chapter.number, page_number: m.page_number,
          page_type: m.page_type || 'lesson', tags: m.tags || [],
          glossary: m.glossary || [],
        },
      });
      orderedIds.push(existing._id);
      console.log(`  updated  p${m.page_number} ${m.slug} (${m.blocks.length} blocks)`);
    } else {
      const _id = uuid();
      const doc = {
        _id, book_id: bookId, chapter_number: chapter.number, page_number: m.page_number,
        slug: m.slug, title: m.title, subtitle: m.subtitle || '',
        blocks: m.blocks, hinglish_blocks: [], tags: m.tags || [],
        glossary: m.glossary || [],
        published: false, page_type: m.page_type || 'lesson',
        reading_time_min: bw.computeReadingTime(m.blocks),
        content_types: bw.computeContentTypes(m.blocks),
        video_title: null, readiness: null,
        review: { reviewed: false, reviewed_by: null, reviewed_at: null },
        deleted_at: null, deleted_by: null, deletion_reason: null,
        created_at: new Date(), updated_at: new Date(),
      };
      await pages.insertOne(doc);
      orderedIds.push(_id);
      console.log(`  inserted p${m.page_number} ${m.slug} (${m.blocks.length} blocks, ${doc.reading_time_min} min)`);
    }
  }

  const chapters = Array.isArray(book.chapters) ? book.chapters : [];
  const idx = chapters.findIndex((c) => c.number === chapter.number);
  const chapterEntry = {
    number: chapter.number, title: chapter.title, slug: chapter.slug,
    page_ids: orderedIds, description: chapter.description || '', is_published: false,
  };
  if (idx >= 0) chapters[idx] = chapterEntry; else chapters.push(chapterEntry);
  chapters.sort((a, b) => a.number - b.number);
  await books.updateOne({ _id: book._id }, { $set: { chapters, updated_at: new Date() } });
  console.log(`Chapter ${chapter.number} "${chapter.title}": ${orderedIds.length} pages wired.`);
}

module.exports = { buildChapter, BOOK_SLUG };
