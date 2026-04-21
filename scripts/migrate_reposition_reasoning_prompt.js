/**
 * migrate_reposition_reasoning_prompt.js
 *
 * The previous migration added curiosity_prompt at Block 0 and shifted every other
 * block up by 1 — so reasoning_prompt landed at Block 1, still before any theory.
 *
 * This script moves reasoning_prompt to after the second text block (i.e. after the
 * core concept + first explanation have been read), following the Class 9 template:
 *
 *   0: curiosity_prompt
 *   1: callout[fun_fact]
 *   2: text (core concept)
 *   3: heading
 *   4: text (explanation)  ← reasoning_prompt goes AFTER this
 *   5: reasoning_prompt    ← correct position
 *   6: image
 *   ...
 *
 * Heuristic: remove reasoning_prompt from its current position, then insert it
 * immediately after the second text block in the remaining array.  If there is
 * only one text block, insert after the first.
 *
 * Run: node scripts/migrate_reposition_reasoning_prompt.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const COLLECTION = 'book_pages';

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found in .env.local');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('crucible');
  const col = db.collection(COLLECTION);

  // Target pages: curiosity_prompt at 0, reasoning_prompt at 1
  const pages = await col.find({
    'blocks.0.type': 'curiosity_prompt',
    'blocks.1.type': 'reasoning_prompt',
  }).toArray();

  console.log(`Found ${pages.length} pages to reposition\n`);

  let updated = 0;

  for (const page of pages) {
    const blocks = page.blocks;

    // Pull out the reasoning_prompt (currently at index 1)
    const rpIndex = blocks.findIndex(b => b.type === 'reasoning_prompt');
    if (rpIndex === -1) continue;
    const reasoningBlock = blocks[rpIndex];

    // Remaining blocks (everything except the reasoning_prompt)
    const rest = blocks.filter((_, i) => i !== rpIndex);

    // Find the second text block in the remaining array; fall back to first text block
    let textCount = 0;
    let insertAfterIndex = -1;
    for (let i = 0; i < rest.length; i++) {
      if (rest[i].type === 'text') {
        textCount++;
        insertAfterIndex = i;
        if (textCount === 2) break;
      }
    }

    // If no text blocks at all, insert after index 2 (past curiosity + fun_fact)
    if (insertAfterIndex === -1) insertAfterIndex = Math.min(2, rest.length - 1);

    // Build new block array with reasoning_prompt inserted after insertAfterIndex
    const newBlocks = [
      ...rest.slice(0, insertAfterIndex + 1),
      reasoningBlock,
      ...rest.slice(insertAfterIndex + 1),
    ].map((b, i) => ({ ...b, order: i }));

    await col.updateOne(
      { _id: page._id },
      { $set: { blocks: newBlocks, updated_at: new Date() } }
    );

    const insertedAt = insertAfterIndex + 1;
    console.log(`  ✓ "${page.title}" — reasoning_prompt moved to Block ${insertedAt}`);
    updated++;
  }

  console.log(`\nDone — ${updated} repositioned.`);
  await client.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
