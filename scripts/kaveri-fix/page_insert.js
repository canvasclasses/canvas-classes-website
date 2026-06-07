'use strict';
/**
 * Insert a fully-authored page at a given position in a chapter, shifting later
 * pages' page_number up by 1 and rebuilding the chapter's page_ids in order.
 * Reads scripts/kaveri-fix/_newpage_<slug>.json:
 *   { chapter_number, after_slug, slug, title, subtitle, tags:[...], content_types:[...], blocks:[...] }
 * The new page is placed immediately AFTER `after_slug`. Idempotent by slug
 * (re-running replaces the existing page's blocks instead of duplicating).
 *   node scripts/kaveri-fix/page_insert.js <jsonfile> [--dry]
 */
const fs = require('fs');
const crypto = require('crypto');
const { withBook } = require('./_lib');

const file = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!file) { console.error('usage: page_insert.js <jsonfile> [--dry]'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const uid = () => crypto.randomUUID();

(async () => {
  await withBook(async ({ pages, books, book, bookId, allPages }) => {
    const ch = data.chapter_number;
    const chPages = allPages.filter((p) => p.chapter_number === ch).sort((a, b) => a.page_number - b.page_number);

    // Idempotent: if slug exists, just replace its blocks.
    const existing = chPages.find((p) => p.slug === data.slug);
    if (existing) {
      console.log(`${data.slug}: exists — replacing blocks only (page ${existing.page_number})`);
      if (!DRY) await pages.updateOne({ _id: existing._id }, { $set: { blocks: data.blocks, tags: data.tags, content_types: data.content_types, subtitle: data.subtitle, published: true, updated_at: new Date() } });
      return;
    }

    const after = chPages.find((p) => p.slug === data.after_slug);
    if (!after) { console.error(`after_slug not found: ${data.after_slug}`); process.exit(1); }
    const insertAt = after.page_number + 1;

    // Shift later pages up by 1 (highest first to avoid unique-index collisions).
    const toShift = chPages.filter((p) => p.page_number >= insertAt).sort((a, b) => b.page_number - a.page_number);
    console.log(`${data.slug}: insert at page ${insertAt} in Ch${ch}; shifting ${toShift.length} pages up`);
    if (!DRY) {
      for (const p of toShift) await pages.updateOne({ _id: p._id }, { $set: { page_number: p.page_number + 1 } });
    }

    const doc = {
      _id: uid(), book_id: bookId, chapter_number: ch, page_number: insertAt, slug: data.slug,
      title: data.title, subtitle: data.subtitle || '', blocks: data.blocks, hinglish_blocks: [],
      tags: data.tags, published: true, content_types: data.content_types || [],
      created_at: new Date(), updated_at: new Date(),
    };
    if (!DRY) await pages.insertOne(doc);

    // Rebuild this chapter's page_ids in page_number order.
    if (!DRY) {
      const fresh = await pages.find({ book_id: bookId, chapter_number: ch }).sort({ page_number: 1 }).toArray();
      const orderedIds = fresh.map((p) => String(p._id));
      await books.updateOne(
        { _id: book._id },
        { $set: { 'chapters.$[c].page_ids': orderedIds, updated_at: new Date() } },
        { arrayFilters: [{ 'c.number': ch }] }
      );
      console.log(`  rebuilt page_ids (${orderedIds.length}) for Ch${ch}`);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
