'use strict';
// Non-destructive completion of chapter 15: keep the 6 already-inserted pages
// (reuse their _id, do NOT re-save/modify), insert only the missing closing page,
// then wire book.chapters[15]. Avoids the uuid-churn content-loss guard trip.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const fs = require('fs');
const { v4: uuid } = require('uuid');
const { MongoClient } = require('mongodb');
const bw = require('./build-lib'); // for BOOK_SLUG
const bwLib = require('../lib/book-writer');

const CH = { number: 15, title: 'Body Fluids and Circulation', slug: 'body-fluids-and-circulation',
  description: 'How blood and lymph keep the body supplied and clean — blood composition, ABO/Rh groups, clotting, the human heart and its cardiac cycle, the ECG, double circulation, and how the heart is regulated.' };

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const books = db.collection('books');
  const pages = db.collection('book_pages');
  const book = await books.findOne({ slug: 'class11-biology' });
  const bookId = String(book._id);

  const dir = path.join(__dirname, 'ch15', 'pages');
  const mods = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => require(path.join(dir, f)))
    .sort((a, b) => a.page_number - b.page_number);

  const orderedIds = [];
  for (const m of mods) {
    const existing = await pages.findOne({ book_id: bookId, slug: m.slug });
    if (existing) {
      orderedIds.push(existing._id);
      console.log(`  keep    p${m.page_number} ${m.slug} (${existing.blocks.length} blocks) — untouched`);
    } else {
      const _id = uuid();
      await pages.insertOne({
        _id, book_id: bookId, chapter_number: CH.number, page_number: m.page_number,
        slug: m.slug, title: m.title, subtitle: m.subtitle || '',
        blocks: m.blocks, hinglish_blocks: [], tags: m.tags || [], glossary: m.glossary || [],
        published: false, page_type: m.page_type || 'lesson',
        reading_time_min: bwLib.computeReadingTime(m.blocks),
        content_types: bwLib.computeContentTypes(m.blocks),
        video_title: null, readiness: null,
        review: { reviewed: false, reviewed_by: null, reviewed_at: null },
        deleted_at: null, deleted_by: null, deletion_reason: null,
        created_at: new Date(), updated_at: new Date(),
      });
      orderedIds.push(_id);
      console.log(`  insert  p${m.page_number} ${m.slug} (${m.blocks.length} blocks) — NEW`);
    }
  }

  const chapters = Array.isArray(book.chapters) ? book.chapters : [];
  const idx = chapters.findIndex(c => c.number === CH.number);
  const entry = { number: CH.number, title: CH.title, slug: CH.slug, page_ids: orderedIds, description: CH.description, is_published: false };
  if (idx >= 0) chapters[idx] = entry; else chapters.push(entry);
  chapters.sort((a, b) => a.number - b.number);
  await books.updateOne({ _id: book._id }, { $set: { chapters, updated_at: new Date() } });
  console.log(`Chapter 15 wired: ${orderedIds.length} pages.`);
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
