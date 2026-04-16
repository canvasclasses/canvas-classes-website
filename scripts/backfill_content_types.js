/**
 * Backfill content_types on all existing book pages.
 *
 * content_types is a deduplicated list of "interesting" block types (quiz,
 * simulation, video, etc.) present on each page. It's normally computed on
 * save, but existing pages need a one-time backfill.
 *
 * Usage:  node scripts/backfill_content_types.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const INTERACTIVE_TYPES = new Set([
  'inline_quiz', 'simulation', 'video', 'molecule_3d', 'interactive_image',
  'classify_exercise', 'reasoning_prompt', 'worked_example', 'practice_link',
]);

function flattenBlocks(blocks) {
  const result = [];
  for (const block of blocks) {
    if (block.type === 'section' && Array.isArray(block.columns)) {
      for (const col of block.columns) {
        if (Array.isArray(col)) result.push(...col);
      }
    } else {
      result.push(block);
    }
  }
  return result;
}

function computeContentTypes(blocks) {
  const flat = flattenBlocks(blocks);
  const found = new Set();
  for (const b of flat) {
    if (INTERACTIVE_TYPES.has(b.type)) found.add(b.type);
  }
  return [...found].sort();
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const col = db.collection('book_pages');

  const pages = await col.find({}, { projection: { _id: 1, slug: 1, blocks: 1, content_types: 1 } }).toArray();
  console.log(`Found ${pages.length} book pages to process`);

  let updated = 0;
  for (const page of pages) {
    const blocks = Array.isArray(page.blocks) ? page.blocks : [];
    const types = computeContentTypes(blocks);

    // Only update if different from what's stored
    const existing = Array.isArray(page.content_types) ? page.content_types : [];
    if (JSON.stringify(types) !== JSON.stringify(existing)) {
      await col.updateOne({ _id: page._id }, { $set: { content_types: types } });
      console.log(`  ✓ ${page.slug}: [${types.join(', ')}]`);
      updated++;
    }
  }

  console.log(`\nDone. Updated ${updated} of ${pages.length} pages.`);
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
