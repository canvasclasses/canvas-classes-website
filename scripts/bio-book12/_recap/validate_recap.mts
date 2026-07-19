import { createRequire } from 'module';
import { existsSync } from 'fs';
import { join } from 'path';
import { ContentBlocksArraySchema } from '../../../packages/data/books/schemas';

const require = createRequire(import.meta.url);

// Validates the authored chapter-recap page modules against the real Zod
// schema. Unlike the practice pages, a recap page is a normal 'lesson' page
// that ENDS on inline_quiz (the standard lesson-page structural rule applies).
let bad = 0;
for (let ch = 1; ch <= 13; ch++) {
  const f = join(process.cwd(), `scripts/bio-book12/_recap/ch${ch}.js`);
  if (!existsSync(f)) { console.log(`ch${ch}: (missing)`); continue; }
  const mod = require(f);
  const blocks = mod.blocks || [];
  const problems: string[] = [];

  if (blocks[0]?.type !== 'image') problems.push('block 0 is not a hero image');
  if (blocks[blocks.length - 1]?.type !== 'inline_quiz') problems.push('last block is not inline_quiz');
  const orders = blocks.map((b: any) => b.order);
  if (orders.some((o: number, i: number) => o !== i)) problems.push('orders not 0..N sequential');

  const ids: string[] = [];
  const collect = (o: any) => { if (o && typeof o === 'object' && typeof o.id === 'string') ids.push(o.id); };
  blocks.forEach((b: any) => {
    collect(b);
    (b.hotspots || []).forEach(collect);
    (b.questions || []).forEach(collect);
  });
  if (new Set(ids).size !== ids.length) problems.push('duplicate ids somewhere (block/hotspot/question)');

  // quiz hygiene: correct_index spread, no length-tell repeat of the audit's F1 bug
  const quiz = blocks.find((b: any) => b.type === 'inline_quiz');
  let quizNote = '';
  if (quiz) {
    const idxCounts: Record<number, number> = {};
    let longestTell = 0;
    for (const q of quiz.questions || []) {
      idxCounts[q.correct_index] = (idxCounts[q.correct_index] || 0) + 1;
      const lens = q.options.map((o: string) => o.length);
      const max = Math.max(...lens);
      if (lens[q.correct_index] === max && lens.filter((n: number) => n === max).length === 1) longestTell++;
    }
    quizNote = ` | quiz: ${quiz.questions.length}q, positions=${JSON.stringify(idxCounts)}, correct=uniquely-longest in ${longestTell}`;
  }

  const res = ContentBlocksArraySchema.safeParse(blocks);
  if (!res.success) {
    bad++;
    console.log(`INVALID ch${ch} (${mod.slug}) — ${blocks.length} blocks`);
    for (const iss of res.error.issues.slice(0, 10)) console.log(`   ${iss.path.join('.')}: ${iss.message}`);
  } else if (problems.length) {
    bad++;
    console.log(`STRUCT  ch${ch} (${mod.slug}) — ${problems.join('; ')}`);
  } else {
    console.log(`ok      ch${ch} (${mod.slug}) — ${blocks.length} blocks${quizNote}`);
  }
}
console.log(`\n${bad} module(s) with problems.`);
if (bad) process.exit(2);
