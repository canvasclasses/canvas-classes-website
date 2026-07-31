'use strict';
/* Point "Name That Graph"'s closing line at the two new practice pages
   (Spot the Right Graph, Describe the Move) that now sit between it and
   Chapter 2 — the old line jumped straight to "Relations and Functions" as if
   nothing came between. Text-only edit via the sanctioned book-writer gateway.
   Run: node scripts/math11-book/patch_ch0_closing_pointer.js        (commits)
        node scripts/math11-book/patch_ch0_closing_pointer.js --dry  (dry-run) */
const bw = require('../lib/book-writer');
const { withDb } = bw;

const SLUG = 'name-that-graph';
const DRY = process.argv.includes('--dry');

const NEW_MD =
  '**Well played.** You now carry a mental gallery of shapes and know how each dial moves them. Keep this ' +
  'chapter handy — whenever a graph in a later topic looks unfamiliar, it’s almost always one of these six ' +
  'shapes wearing a disguise.\n\n' +
  'Two practice pages come next: **Spot the Right Graph** (pick the correct curve out of several look-alikes — ' +
  'no drawing, just recognising) and **Describe the Move** (read a formula and name the shift, stretch or ' +
  'flip in words). Work through both before moving on. Then: **Relations and Functions**, where these shapes ' +
  'get their formal names and rules.';

(async () => {
  await withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ slug: SLUG });
    if (!page) throw new Error('page not found: ' + SLUG);
    let hit = false;
    const out = page.blocks.map((b) => {
      if (b.type === 'text' && b.order === 5) { hit = true; return { ...b, markdown: NEW_MD }; }
      return b;
    });
    if (!hit) throw new Error('closing text block (order 5) not found');
    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'name-that-graph: point closing line at the two new practice pages instead of jumping straight to Ch.2',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/0 — text-only)`
      : `✓ ${SLUG}: v${res.version} · closing pointer updated`);
  });
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
