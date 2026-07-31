/**
 * Fixes the well-known "Mongo driver stores undefined as null" trap
 * (see memory: feedback_livebook_blocks_null_zod_trap.md) on 2 Chapter 2
 * math_graph blocks. Both used the `line-explorer` archetype (which takes no
 * params) via a mathGraph() helper call that omitted `archetype_params` —
 * the destructured `undefined` got spread into the object literal, and
 * MongoDB's Node driver serializes an `undefined` field value as `null` on
 * write, which MathGraphBlockSchema's `archetype_params: z.record(...).optional()`
 * correctly rejects (`.optional()` only accepts undefined, not a literal null).
 * Fix: replace the null with an empty object `{}`, which validates fine.
 *
 * Usage:
 *   npx tsx scripts/math9-book/fix_ch2_null_archetype_params.mts --dry   (default)
 *   npx tsx scripts/math9-book/fix_ch2_null_archetype_params.mts --commit
 */
import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: '.env.local' });
const { withDb, savePage } = require('../lib/book-writer');

const COMMIT = process.argv.includes('--commit');
const SLUGS = ['linear-polynomials-in-the-wild', 'meet-y-equals-ax-plus-b'];

(async () => {
  await withDb(async (db: any) => {
    const bookId = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
    for (const slug of SLUGS) {
      const page = await db.collection('book_pages').findOne({ book_id: bookId, chapter_number: 2, slug });
      if (!page) { console.error(`✗ not found: ${slug}`); continue; }
      const newBlocks = page.blocks.map((b: any) =>
        b.type === 'math_graph' && b.archetype_params === null ? { ...b, archetype_params: {} } : b
      );
      const zr = ContentBlocksArraySchema.safeParse(newBlocks);
      if (!zr.success) { console.error(`✗ Zod still fails for ${slug}:`, JSON.stringify(zr.error.issues.slice(0, 5))); continue; }

      const dry = await savePage(db, { slug, pageId: page._id }, newBlocks, {
        author: 'script:fix_ch2_null_archetype_params',
        summary: 'DRY RUN — fix Mongo undefined->null trap on archetype_params (line-explorer needs no params)',
        dryRun: true,
      });
      console.log(`\n=== ${slug} ===`);
      console.log('diff:', JSON.stringify(dry.diff));
      console.log('wouldBlock:', dry.wouldBlock);
      if (!COMMIT) continue;

      const res = await savePage(db, { slug, pageId: page._id }, newBlocks, {
        author: 'script:fix_ch2_null_archetype_params',
        summary: 'Fix Mongo undefined->null trap: archetype_params null -> {} on the line-explorer blocks (p4, p12)',
      });
      console.log(`✅ COMMITTED ${slug} — version ${res.version}`);
    }
  });
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
