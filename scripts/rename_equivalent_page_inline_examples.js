'use strict';
/**
 * Renames the two hand-written in-prose "Example 1." / "Example 2." labels on
 * the 'equivalent-concept' page (Ch.1 Chemistry) to "Illustration 1." /
 * "Illustration 2." — founder-flagged 2026-07-25: these collided visually
 * with the real, auto-numbered "Example 1" worked_example card immediately
 * below them on the same page. Per BOOK_PAGE_WORKFLOW.md §3.5, "Example N" is
 * reserved sitewide for the renderer's auto chapter-continuous numbering of
 * worked_example blocks — body text must never hand-write it. "Illustration"
 * is the standard textbook term for a quick in-prose derivation, distinct
 * from a formal worked example.
 *
 * Purely additive/text-only via book-writer.savePage (versioned). Idempotent:
 * skips if the markdown no longer contains the old labels.
 * Run: node scripts/rename_equivalent_page_inline_examples.js
 */
const bw = require('./lib/book-writer');

const SLUG = 'equivalent-concept';
const BLOCK_ID = 'b23b24f9-d887-48a4-93a3-204a1b56abcd';

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    const target = cur.blocks.find((b) => b.id === BLOCK_ID);
    if (!target) throw new Error(`block not found: ${BLOCK_ID}`);

    if (!target.markdown.includes('**Example 1.**') && !target.markdown.includes('**Example 2.**')) {
      console.log('already renamed — skipping (idempotent).');
      return;
    }

    const newMarkdown = target.markdown
      .replace('**Example 1.**', '**Illustration 1.**')
      .replace('**Example 2.**', '**Illustration 2.**');

    const newBlocks = cur.blocks.map((b) =>
      b.id === BLOCK_ID ? { ...b, markdown: newMarkdown } : b
    );

    const res = await bw.savePage(db, { slug: SLUG }, newBlocks, {
      author: 'agent',
      summary: 'Renamed in-prose "Example 1./2." to "Illustration 1./2." to stop colliding with the ' +
        'auto-numbered worked_example "Example 1" card below — founder-flagged, text-only change.',
    });
    console.log('SAVED', res.slug, 'version', res.version, '· lossDetected:', res.diff.lossDetected);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
