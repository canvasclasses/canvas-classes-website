/**
 * Pre-insert dry run for any Ch.0 unit build script.
 * Target defaults to Unit A; override with DRY_TARGET=./build_unitB_calculus.js
 *   1. Zod-validates every block.
 *   2. Tallies BOTH inline_quiz and practice_bank MCQ answer positions — a
 *      position-tell is invisible to Zod and has recurred twice on other books.
 *   3. Scans for `null` block fields (raw-write trap; see the Livebook null memo).
 *   4. Checks LaTeX hygiene: balanced $ delimiters and balanced braces per block.
 *
 * Run:  DRY_TARGET=./build_unitB_calculus.js npx tsx scripts/physics11-book/_dryrun_unit.mts
 */
import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const target = process.env.DRY_TARGET || './build_unitA_basic_maths.js';
const { PAGES } = require(target);
const pages = [...PAGES].sort((a: any, b: any) => a.page_number - b.page_number);

let bad = 0;
let nulls = 0;
let latex = 0;
const tally: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

function checkLatex(where: string, s: unknown) {
  if (typeof s !== 'string') return;
  const dollars = (s.match(/\$/g) ?? []).length;
  if (dollars % 2 !== 0) { latex++; console.log(`  LATEX odd $ count (${dollars})  ${where}: ${s.slice(0, 90)}`); }
  const open = (s.match(/\{/g) ?? []).length;
  const close = (s.match(/\}/g) ?? []).length;
  if (open !== close) { latex++; console.log(`  LATEX brace mismatch (${open}/${close})  ${where}: ${s.slice(0, 90)}`); }
  if (s.includes('$$')) { latex++; console.log(`  LATEX double-dollar  ${where}`); }
}

function walk(where: string, node: any) {
  if (node === null) { nulls++; console.log(`  NULL FIELD  ${where}`); return; }
  if (typeof node === 'string') { checkLatex(where, node); return; }
  if (Array.isArray(node)) { node.forEach((v, i) => walk(`${where}[${i}]`, v)); return; }
  if (typeof node === 'object') { for (const [k, v] of Object.entries(node)) walk(`${where}.${k}`, v); }
}

for (const p of pages) {
  const r = ContentBlocksArraySchema.safeParse(p.blocks);
  if (r.success) {
    console.log(`OK   p${String(p.page_number).padStart(2)} ${p.slug}  (${p.blocks.length} blocks)`);
  } else {
    bad++;
    console.log(`FAIL p${p.page_number} ${p.slug} ::`, JSON.stringify(r.error.issues.slice(0, 8), null, 2));
  }

  for (const blk of p.blocks) {
    walk(`p${p.page_number}.${blk.type}`, blk);
    if (blk.type === 'inline_quiz') {
      for (const qq of blk.questions) tally[qq.correct_index] = (tally[qq.correct_index] ?? 0) + 1;
    }
    if (blk.type === 'vector_board' && blk.identify) {
      tally[blk.identify.correct_index] = (tally[blk.identify.correct_index] ?? 0) + 1;
    }
    if (blk.type === 'practice_bank') {
      for (const sec of blk.sections) {
        for (const it of sec.items) {
          if (it.kind === 'mcq') tally[it.correct_index] = (tally[it.correct_index] ?? 0) + 1;
        }
      }
    }
  }
}

const total = Object.values(tally).reduce((a, b) => a + b, 0);
console.log(`\nMCQ answer positions across ${total} questions (quiz + practice bank):`);
for (const k of [0, 1, 2, 3]) console.log(`  ${'ABCD'[k]}: ${tally[k]}`);
const max = Math.max(...Object.values(tally));
const min = Math.min(...Object.values(tally));
const balanced = max - min <= 2;   // ±2 over ~30 questions is a fair spread
console.log(balanced ? '  ✅ balanced' : '  ❌ POSITION TELL — rewrite option orders before inserting');

const ok = bad === 0 && balanced && nulls === 0 && latex === 0;
console.log(`\n${ok ? '✅ SAFE TO INSERT' : '❌ DO NOT INSERT'}  (invalid: ${bad}, nulls: ${nulls}, latex: ${latex})\n`);
process.exit(ok ? 0 : 1);
