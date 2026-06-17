'use strict';
// READ-ONLY self-test of the content-loss guard (uses dryRun — writes nothing).
const bw = require('./lib/book-writer');

bw.withDb(async (db) => {
  const cur = await db.collection('book_pages').findOne({ slug: 'scientific-measurement' });
  const blocks = cur.blocks || [];
  console.log(`Page "${cur.slug}" has ${blocks.length} blocks.\n`);

  // 1. No-op save (same blocks) → should NOT be blocked.
  const same = await bw.savePage(db, { slug: 'scientific-measurement' }, blocks, { dryRun: true });
  console.log(`[A] identical save → lossDetected=${same.diff.lossDetected} reasons=${JSON.stringify(same.diff.reasons)}`);

  // 2. Remove one block → SHOULD be flagged as content loss.
  const minusOne = blocks.slice(0, -1);
  const drop = await bw.savePage(db, { slug: 'scientific-measurement' }, minusOne, { dryRun: true });
  console.log(`[B] drop last block → lossDetected=${drop.diff.lossDetected} reasons=${JSON.stringify(drop.diff.reasons)}`);

  // 3. Remove a block for real WITHOUT consent → should THROW (blocked).
  try {
    await bw.savePage(db, { slug: 'scientific-measurement' }, minusOne, { author: 'test', summary: 'try drop' });
    console.log('[C] FAIL — block removal was NOT blocked!');
  } catch (e) {
    console.log(`[C] correctly BLOCKED: ${e.contentLoss ? 'contentLoss' : 'other'} — ${e.message.slice(0, 80)}…`);
  }

  // 4. Append a block → NOT loss.
  const plusOne = [...blocks, { id: 'test-xyz', type: 'text', order: blocks.length, markdown: 'temp' }];
  const add = await bw.savePage(db, { slug: 'scientific-measurement' }, plusOne, { dryRun: true });
  console.log(`[D] add a block → lossDetected=${add.diff.lossDetected} added=${add.diff.addedBlockIds.length}`);
}).catch((e) => { console.error('ERR', e.message); process.exit(1); });
