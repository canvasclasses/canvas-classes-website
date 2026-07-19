'use strict';
/**
 * Inserts the per-chapter "Chapter Recap" pages into class12-biology.
 *
 * ADDITIVE ONLY — mirrors scripts/bio-book12/_practice/insert_practice_pages.js
 * exactly. Each chapter gets ONE new page appended as its new LAST page (after
 * the NCERT-exercises page); existing pages are never re-saved. Re-running is
 * idempotent: an existing recap page (by slug) is UPDATED in place via
 * book-writer.savePage (versioned, content-loss-guarded) rather than duplicated.
 *
 * Reads page modules from scripts/bio-book12/_recap/ch<N>.js.
 *
 * Dry-run by default; pass --apply to write.
 * Usage: node scripts/bio-book12/_recap/insert_recap_pages.js [--apply]
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env.local') });
const fs = require('fs');
const { v4: uuid } = require('uuid');
const { MongoClient } = require('mongodb');
const bw = require('../../lib/book-writer');

const APPLY = process.argv.includes('--apply');
const BOOK_SLUG = 'class12-biology';
const must = (c, m) => { if (!c) throw new Error('SAFETY: ' + m); };

function loadModules() {
  const out = [];
  for (let ch = 1; ch <= 13; ch++) {
    const f = path.join(__dirname, `ch${ch}.js`);
    if (!fs.existsSync(f)) { console.log(`  ch${ch}: (no module yet — skipped)`); continue; }
    delete require.cache[require.resolve(f)];
    out.push({ chapter: ch, mod: require(f) });
  }
  return out;
}

async function main() {
  const mods = loadModules();
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const book = await books.findOne({ slug: BOOK_SLUG });
    must(book, `book ${BOOK_SLUG} not found`);
    const bookId = String(book._id);
    const chapters = Array.isArray(book.chapters) ? book.chapters : [];

    let inserted = 0, updated = 0;

    for (const { chapter, mod } of mods) {
      // ---- guards on the authored module ----
      must(mod && typeof mod === 'object', `ch${chapter}: module is not an object`);
      must(typeof mod.slug === 'string' && mod.slug, `ch${chapter}: missing slug`);
      must(Array.isArray(mod.blocks) && mod.blocks.length >= 1, `ch${chapter}: no blocks`);
      must(mod.blocks[0]?.type === 'image', `ch${chapter}: block 0 is not a hero image`);
      must(mod.blocks[mod.blocks.length - 1]?.type === 'inline_quiz', `ch${chapter}: last block is not inline_quiz`);

      const chapEntry = chapters.find((c) => c.number === chapter);
      must(chapEntry, `ch${chapter}: chapter entry not found on book`);

      const existing = await pages.findOne({ book_id: bookId, slug: mod.slug });

      if (existing) {
        if (APPLY) {
          await bw.savePage(db, { pageId: existing._id }, mod.blocks, {
            author: 'agent', summary: `ch${chapter} chapter-recap page rebuild`,
            extraSet: {
              title: mod.title, subtitle: mod.subtitle || '',
              page_type: mod.page_type || 'lesson', tags: mod.tags || [],
            },
          });
          if (!chapEntry.page_ids.map(String).includes(String(existing._id))) {
            chapEntry.page_ids.push(existing._id);
          }
        }
        updated++;
        console.log(`  ch${chapter}: UPDATE ${mod.slug} (${mod.blocks.length} blocks)`);
      } else {
        const chapterPages = await pages.find(
          { book_id: bookId, chapter_number: chapter, deleted_at: null },
          { projection: { page_number: 1 } }
        ).toArray();
        const nextPageNumber = Math.max(0, ...chapterPages.map((p) => p.page_number || 0)) + 1;
        const _id = uuid();
        const doc = {
          _id, book_id: bookId, chapter_number: chapter, page_number: nextPageNumber,
          slug: mod.slug, title: mod.title, subtitle: mod.subtitle || '',
          blocks: mod.blocks, hinglish_blocks: [], tags: mod.tags || [], glossary: [],
          published: false, page_type: mod.page_type || 'lesson',
          reading_time_min: bw.computeReadingTime(mod.blocks),
          content_types: bw.computeContentTypes(mod.blocks),
          video_title: null, readiness: null,
          review: { reviewed: false, reviewed_by: null, reviewed_at: null },
          deleted_at: null, deleted_by: null, deletion_reason: null,
          created_at: new Date(), updated_at: new Date(),
        };
        if (APPLY) {
          await pages.insertOne(doc);
          chapEntry.page_ids.push(_id);
        }
        inserted++;
        console.log(`  ch${chapter}: INSERT ${mod.slug} as p${nextPageNumber} (${mod.blocks.length} blocks, ${doc.reading_time_min} min)`);
      }
    }

    if (APPLY) {
      await books.updateOne({ _id: book._id }, { $set: { chapters, updated_at: new Date() } });
    }
    console.log(`\n${inserted} inserted, ${updated} updated across ${mods.length} chapters.`);
    if (!APPLY) console.log('DRY RUN — nothing written. Re-run with --apply.');
    else console.log('✅ APPLIED (new pages inserted additively; existing pages untouched).');
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
