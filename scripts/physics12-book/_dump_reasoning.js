'use strict';
/**
 * Dump every `reasoning_prompt` block in class12-physics so its correct option
 * can be identified, and report the scale of the same issue in other books.
 *
 * WHY: reasoning_prompt blocks carry 4 options but NO `correct_index`, so
 *   (a) the reader can never mark the student right or wrong — ReasoningPromptRenderer
 *       only renders a verdict when `correct_index` is a number, and
 *   (b) `_hygiene.js`'s answer-position check skips them entirely, which let the
 *       correct answer drift to option A in ~84% of cases.
 * The schema already allows `correct_index` (optional). This dump is step 1 of
 * setting it and re-spreading the options.
 *
 * Run: node scripts/physics12-book/_dump_reasoning.js
 */
const fs = require('fs');
const path = require('path');
const { withDb } = require('../lib/book-writer');

const OUT = path.join(__dirname, '_reasoning_dump.json');

withDb(async (db) => {
  // ── scale of the same pattern across every book ───────────────────────────
  const books = await db.collection('books').find({ deleted_at: null }, { projection: { slug: 1 } }).toArray();
  console.log('reasoning_prompt blocks per book (with options, missing correct_index):');
  let grand = 0;
  for (const bk of books) {
    const pages = await db.collection('book_pages').find({ book_id: bk._id, deleted_at: null }).toArray();
    let n = 0;
    for (const p of pages) {
      for (const b of (p.blocks || [])) {
        if (b.type === 'reasoning_prompt' && Array.isArray(b.options) && b.options.length
            && typeof b.correct_index !== 'number') n++;
      }
    }
    if (n) { console.log(`   ${bk.slug.padEnd(24)} ${n}`); grand += n; }
  }
  console.log(`   ${'TOTAL'.padEnd(24)} ${grand}\n`);

  // ── the dump for class12-physics ──────────────────────────────────────────
  const book = await db.collection('books').findOne({ slug: 'class12-physics' });
  const pages = (await db.collection('book_pages')
    .find({ book_id: book._id, deleted_at: null }).toArray())
    .sort((a, c) => a.chapter_number - c.chapter_number || a.page_number - c.page_number);

  const items = [];
  for (const p of pages) {
    for (const b of (p.blocks || [])) {
      if (b.type !== 'reasoning_prompt' || !Array.isArray(b.options) || !b.options.length) continue;
      items.push({
        block_id: b.id,
        chapter: p.chapter_number,
        page: p.page_number,
        page_slug: p.slug,
        has_correct_index: typeof b.correct_index === 'number',
        prompt: b.prompt,
        options: b.options,
        reveal: b.reveal,
      });
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(items, null, 1));
  console.log(`class12-physics: ${items.length} reasoning_prompt blocks -> ${OUT}`);
  const byCh = {};
  items.forEach((i) => { byCh[i.chapter] = (byCh[i.chapter] || 0) + 1; });
  console.log('  per chapter:', JSON.stringify(byCh));
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
