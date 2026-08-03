/*
 * insert_placements.js — put the physics simulations on their pages.
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads the table in `placements.js` and inserts one block per row through the
 * SANCTIONED GATEWAY (`scripts/lib/book-writer.js` → savePage), which snapshots
 * the prior version, runs the content-loss guard and writes an audit entry.
 * Never `updateOne`. CLAUDE.md §0.6.
 *
 * Every insert is ADDITIVE — blocks are only added, never removed or reordered —
 * so the content-loss guard must report zero removals. If it doesn't, that is a
 * bug in this script and the run should be aborted, not forced.
 *
 * WHERE THE BLOCK LANDS. Not appended blindly at the end: a simulation belongs
 * after the teaching and before the check. So the insert point is, in order:
 *   1. immediately before the page's first `inline_quiz` / `reasoning_prompt`
 *      (the "now check yourself" block), else
 *   2. immediately before a closing `practice_bank` / `practice_link`, else
 *   3. appended at the end.
 * The chosen index is printed for every row so a human can audit the decision.
 *
 * IDEMPOTENT. A page that already carries a block with the same `archetype` is
 * skipped, so a re-run after a partial failure cannot double-insert.
 *
 * USAGE
 *   node scripts/physics-sims/insert_placements.js            # DRY RUN (default)
 *   node scripts/physics-sims/insert_placements.js --apply    # write
 *   node scripts/physics-sims/insert_placements.js --book class11-physics
 *   node scripts/physics-sims/insert_placements.js --chapter 4
 */

const path = require('path');
const { randomUUID } = require('crypto');
const bw = require(path.join(__dirname, '..', 'lib', 'book-writer.js'));
const { PLACEMENTS } = require('./placements.js');

const APPLY = process.argv.includes('--apply');
const argOf = (flag) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
};
const ONLY_BOOK = argOf('--book');
const ONLY_CH = argOf('--chapter');

/** The block types that mean "the student is now being tested". */
const CHECK_TYPES = new Set(['inline_quiz', 'reasoning_prompt']);
const PRACTICE_TYPES = new Set(['practice_bank', 'practice_link', 'chapter_practice']);

function insertIndex(blocks) {
  const firstCheck = blocks.findIndex((b) => CHECK_TYPES.has(b.type));
  if (firstCheck >= 0) return { i: firstCheck, why: `before first ${blocks[firstCheck].type}` };
  const firstPractice = blocks.findIndex((b) => PRACTICE_TYPES.has(b.type));
  if (firstPractice >= 0) return { i: firstPractice, why: `before ${blocks[firstPractice].type}` };
  return { i: blocks.length, why: 'appended at end' };
}

(async () => {
  let inserted = 0, skipped = 0, missing = 0, failed = 0;

  await bw.withDb(async (db) => {
    for (const row of PLACEMENTS) {
      if (ONLY_BOOK && row.book !== ONLY_BOOK) continue;
      if (ONLY_CH && String(row.chapter) !== String(ONLY_CH)) continue;

      const book = await db.collection('books').findOne({ slug: row.book });
      if (!book) { console.log(`✗ no book ${row.book}`); missing++; continue; }

      const page = await db.collection('book_pages').findOne({
        book_id: book._id, slug: row.page, deleted_at: null,
      });
      if (!page) { console.log(`✗ ${row.book}/${row.page} — page not found`); missing++; continue; }

      const blocks = Array.isArray(page.blocks) ? [...page.blocks] : [];

      // Idempotency: same archetype already on this page → leave it alone.
      if (blocks.some((b) => b && b.archetype === row.block.archetype)) {
        console.log(`· ${row.page.padEnd(46)} ${row.block.archetype} — already present, skipped`);
        skipped++; continue;
      }

      const { i, why } = insertIndex(blocks);
      const block = { id: randomUUID(), order: 0, ...row.block };
      blocks.splice(i, 0, block);
      const reordered = blocks.map((b, n) => ({ ...b, order: n }));

      const res = await bw.savePage(db, { pageId: page._id }, reordered, {
        author: 'agent:physics-sim-placement',
        summary: `insert ${row.block.type}/${row.block.archetype}`,
        dryRun: !APPLY,
      });

      const removed = res && res.guard ? (res.guard.removedBlocks ?? 0) : 0;
      if (removed > 0) {
        console.log(`✗ ABORT ${row.page} — guard reports ${removed} removed blocks`);
        failed++; continue;
      }

      console.log(
        `${APPLY ? '✓' : '·'} ch${row.chapter} p${String(page.page_number).padStart(2)} `
        + `${row.page.padEnd(46)} ${String(row.block.archetype).padEnd(30)} `
        + `@${i}/${blocks.length - 1} (${why})`
      );
      inserted++;
    }
  });

  console.log('\n' + '─'.repeat(72));
  console.log(`${APPLY ? 'INSERTED' : 'WOULD INSERT'}: ${inserted}   skipped: ${skipped}   `
    + `missing: ${missing}   failed: ${failed}`);
  if (!APPLY) console.log('DRY RUN — nothing written. Re-run with --apply.');
  if (failed) process.exit(1);
})().catch((e) => { console.error(e); process.exit(1); });
