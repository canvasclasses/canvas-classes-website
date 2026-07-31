/**
 * Pre-insert dry run for the Ch.0 vector pages.
 *   1. Zod-validates every block (no DB round-trip).
 *   2. Tallies quiz answer positions — Zod happily accepts correct_index: 0
 *      twenty times in a row, so a validity check alone does NOT catch a
 *      position-tell. This is a standing house rule after it recurred on the
 *      Social Science and Math books.
 *   3. Scans for `null` block fields, which pass a raw Mongo write but fail the
 *      admin editor's Zod `.optional()` on the next save.
 *
 * Run:  npx tsx scripts/physics11-book/_dryrun_ch0_vectors.mts
 */
import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { pages: vecPages } = require('./build_ch0_vector_addition.js');
const { pages: foundPages } = require('./build_ch0_foundations.js');
const pages = [...foundPages, ...vecPages].sort((a: any, b: any) => a.page_number - b.page_number);

let bad = 0;
const tally: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
const idTally: Record<number, number> = {};
let nulls = 0;

for (const p of pages) {
  const r = ContentBlocksArraySchema.safeParse(p.blocks);
  if (r.success) {
    console.log(`OK   p${p.page_number} ${p.slug}  (${p.blocks.length} blocks)`);
  } else {
    bad++;
    console.log(`FAIL p${p.page_number} ${p.slug} ::`, JSON.stringify(r.error.issues.slice(0, 6), null, 2));
  }

  for (const blk of p.blocks) {
    if (blk.type === 'inline_quiz') {
      for (const qq of blk.questions) tally[qq.correct_index] = (tally[qq.correct_index] ?? 0) + 1;
    }
    if (blk.type === 'vector_board' && blk.identify) {
      idTally[blk.identify.correct_index] = (idTally[blk.identify.correct_index] ?? 0) + 1;
    }
    // null scan (one level deep is enough for these block shapes)
    for (const [k, val] of Object.entries(blk)) {
      if (val === null) { nulls++; console.log(`  NULL FIELD  p${p.page_number} ${blk.type}.${k}`); }
    }
  }
}

const total = Object.values(tally).reduce((a, b) => a + b, 0);
console.log(`\nQuiz answer positions across ${total} questions:`);
for (const k of [0, 1, 2, 3]) console.log(`  ${'ABCD'[k]}: ${tally[k]}`);
const max = Math.max(...Object.values(tally));
const min = Math.min(...Object.values(tally));
const balanced = max - min <= 1;
console.log(balanced ? '  ✅ balanced' : '  ❌ POSITION TELL — rewrite option orders before inserting');

console.log(`\n"Which diagram?" correct positions:`, idTally);

console.log(`\n${bad === 0 && balanced && nulls === 0 ? '✅ SAFE TO INSERT' : '❌ DO NOT INSERT'}  (invalid pages: ${bad}, nulls: ${nulls})\n`);
process.exit(bad === 0 && balanced && nulls === 0 ? 0 : 1);
