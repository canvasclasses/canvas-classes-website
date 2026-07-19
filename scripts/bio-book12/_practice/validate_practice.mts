import { createRequire } from 'module';
import { existsSync } from 'fs';
import { join } from 'path';
import { ContentBlocksArraySchema } from '../../../packages/data/books/schemas';

const require = createRequire(import.meta.url);

// Validates the authored practice-page modules against the real Zod schema.
// Unlike the lesson validator, a practice page legitimately ENDS on a
// practice_bank (not an inline_quiz), so that structural rule is not applied.
let bad = 0;
for (let ch = 1; ch <= 13; ch++) {
  const f = join(process.cwd(), `scripts/bio-book12/_practice/ch${ch}.js`);
  if (!existsSync(f)) { console.log(`ch${ch}: (missing)`); continue; }
  const mod = require(f);
  const blocks = mod.blocks || [];
  const problems: string[] = [];

  if (blocks[0]?.type !== 'image') problems.push('block 0 is not a hero image');
  const pb = blocks.find((b: any) => b.type === 'practice_bank');
  if (!pb) problems.push('no practice_bank block');
  const orders = blocks.map((b: any) => b.order);
  if (orders.some((o: number, i: number) => o !== i)) problems.push('orders not 0..N sequential');
  const ids: string[] = [];
  const collect = (o: any) => { if (o && typeof o === 'object') { if (typeof o.id === 'string') ids.push(o.id); } };
  blocks.forEach((b: any) => { collect(b); (b.sections || []).forEach((s: any) => { collect(s); (s.items || []).forEach(collect); }); });
  if (new Set(ids).size !== ids.length) problems.push('duplicate ids somewhere (block/section/item)');

  const itemCount = pb ? pb.sections.reduce((s: number, sec: any) => s + (sec.items || []).length, 0) : 0;

  const res = ContentBlocksArraySchema.safeParse(blocks);
  if (!res.success) {
    bad++;
    console.log(`INVALID ch${ch} (${mod.slug}) — ${blocks.length} blocks`);
    for (const iss of res.error.issues.slice(0, 8)) console.log(`   ${iss.path.join('.')}: ${iss.message}`);
  } else if (problems.length) {
    bad++;
    console.log(`STRUCT  ch${ch} (${mod.slug}) — ${problems.join('; ')}`);
  } else {
    console.log(`ok      ch${ch} (${mod.slug}) — ${itemCount} exercises, ${pb.sections.length} themes`);
  }
}
console.log(`\n${bad} module(s) with problems.`);
if (bad) process.exit(2);
