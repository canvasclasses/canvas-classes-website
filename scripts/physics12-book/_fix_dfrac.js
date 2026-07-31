'use strict';
/**
 * Replace every `\dfrac` with `\frac` in the live class12-physics content.
 *
 * WHY: CLAUDE.md §4 bans `\dfrac` — in inline maths it forces display-style and
 * renders oversized, breaking line rhythm. The already-built Ch.1-5 used it 623
 * times; Ch.6 (built to the rule) uses `\frac`, so the book rendered
 * inconsistently page to page. The build scripts have been fixed already; this
 * brings the pages in the database into line with them.
 *
 * SAFETY: writes go through book-writer's `savePage`, which snapshots the prior
 * version of every page it touches (so this is reversible via restorePageVersion)
 * and runs the content-loss guard. This is a pure token substitution — no block
 * is added, removed or reordered, and no asset reference is touched.
 *
 * Run:  node scripts/physics12-book/_fix_dfrac.js --dry
 *       node scripts/physics12-book/_fix_dfrac.js
 */
const bw = require('../lib/book-writer');

const DRY = process.argv.includes('--dry');
const BOOK_SLUG = 'class12-physics';

/** Deep-map every string in a nested structure. */
function mapStrings(node, fn) {
  if (typeof node === 'string') return fn(node);
  if (Array.isArray(node)) return node.map((v) => mapStrings(v, fn));
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = mapStrings(v, fn);
    return out;
  }
  return node;
}

const countDfrac = (o) => (JSON.stringify(o).match(/\\\\dfrac/g) || []).length;

bw.withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error(`book not found: ${BOOK_SLUG}`);
  const pages = (await db.collection('book_pages')
    .find({ book_id: book._id, deleted_at: null }).toArray())
    .sort((a, c) => a.chapter_number - c.chapter_number || a.page_number - c.page_number);

  let touched = 0; let replaced = 0;
  for (const p of pages) {
    const before = countDfrac(p.blocks);
    if (!before) continue;
    const newBlocks = mapStrings(p.blocks, (s) => s.replace(/\\dfrac/g, '\\frac'));
    const after = countDfrac(newBlocks);
    if (after !== 0) {
      console.error(`  ⚠ ch${p.chapter_number} p${p.page_number} ${p.slug}: ${after} \\dfrac survived — investigate`);
      continue;
    }
    touched++; replaced += before;
    console.log(`  ${DRY ? 'would fix' : 'fixed'}  ch${p.chapter_number} p${String(p.page_number).padStart(2)} ${p.slug.padEnd(42)} ${before}`);
    if (!DRY) {
      // NOTE: savePage's selector understands `pageId` or `slug` only — an
      // `_id` key silently becomes `{ slug: undefined }` and throws "page not found".
      await bw.savePage(db, { pageId: p._id }, newBlocks, {
        author: 'script:_fix_dfrac',
        summary: 'CLAUDE.md §4 compliance: \\dfrac -> \\frac (inline maths must not force display style)',
      });
    }
  }
  console.log(`\n${DRY ? 'DRY RUN — ' : ''}pages ${DRY ? 'to change' : 'changed'}: ${touched} · \\dfrac occurrences replaced: ${replaced}`);
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
