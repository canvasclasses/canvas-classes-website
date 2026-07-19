'use strict';
/**
 * Surgical fix for the Ch.6 p6 (Hardy-Weinberg) broken bridge.
 *
 * THE BUG (found in the 2026-07-16 publication audit):
 *   p6 closes with "...next we watch it actually reshape a population, sorting
 *   variation into the patterns evolution leaves behind." — but p7 is the
 *   GEOLOGICAL TIMELINE ("Life Through Deep Time"). The promised content is p5
 *   (Mechanism of Evolution), which already happened. The authoring agent
 *   assumed a different page order, so the page makes the reader a promise the
 *   book doesn't keep.
 *
 * THE FIX: rewrite ONLY the final bridge sentence so it leads into deep time.
 * Everything else on the page is untouched.
 *
 * Writes through book-writer (versioned, content-loss-guarded, reversible).
 * Dry-run by default; pass --apply to write.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const bw = require('../lib/book-writer');

const APPLY = process.argv.includes('--apply');

// The exact sentence to replace (the broken promise) and its replacement.
const BROKEN_TAIL =
  'Of those five, natural selection is the one Darwin built his whole theory on — and next we watch it actually reshape a population, sorting variation into the patterns evolution leaves behind.';
const FIXED_TAIL =
  'Of those five, natural selection is the one Darwin built his whole theory on — and you have already watched it sort variation on the page before this. So the machinery is now complete: life began, variation appeared, selection and drift went to work, and the algebra tells us when it is happening. What we have not done is stand back and watch the whole thing run. Next we do exactly that — four billion years of it, in the order it actually happened.';

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const book = await db.collection('books').findOne({ slug: 'class12-biology' });
    if (!book) throw new Error('book class12-biology not found');
    const page = await db.collection('book_pages').findOne({
      book_id: String(book._id), chapter_number: 6, page_number: 6, deleted_at: null,
    });
    if (!page) throw new Error('ch6 p6 not found');
    console.log(`page: ${page.title} (${page.slug}) — ${page.blocks.length} blocks`);

    // Find the LAST text block (the bridge lives there).
    const texts = page.blocks.filter((b) => b.type === 'text');
    const target = texts[texts.length - 1];
    if (!target) throw new Error('no text block found');

    if (!target.markdown.includes(BROKEN_TAIL)) {
      console.error('SAFETY: the expected broken sentence was NOT found. Aborting rather than guessing.');
      console.error('--- current last text block ---\n' + target.markdown);
      process.exit(2);
    }

    const blocks = page.blocks.map((b) =>
      b.id === target.id ? { ...b, markdown: b.markdown.replace(BROKEN_TAIL, FIXED_TAIL) } : b
    );

    // Guard: only the one block changed, block count identical.
    if (blocks.length !== page.blocks.length) throw new Error('SAFETY: block count changed');
    const changed = blocks.filter((b, i) => JSON.stringify(b) !== JSON.stringify(page.blocks[i]));
    if (changed.length !== 1) throw new Error(`SAFETY: expected exactly 1 changed block, got ${changed.length}`);

    console.log('\n--- BEFORE (tail) ---\n…' + BROKEN_TAIL);
    console.log('\n--- AFTER (tail) ---\n…' + FIXED_TAIL);

    if (!APPLY) {
      console.log('\nDRY RUN — nothing written. Re-run with --apply to write.');
      return;
    }
    await bw.savePage(db, { pageId: page._id }, blocks, {
      author: 'agent',
      summary: 'audit fix: ch6 p6 Hardy-Weinberg bridge pointed at the wrong next page (promised selection-reshapes-population; p7 is the deep-time timeline)',
    });
    console.log('\n✅ APPLIED via book-writer (versioned + reversible).');
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
