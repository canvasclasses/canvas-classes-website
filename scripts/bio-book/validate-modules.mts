import { createRequire } from 'module';
import { readdirSync } from 'fs';
import { join } from 'path';
import { ContentBlocksArraySchema } from '../../packages/data/books/schemas';

const require = createRequire(import.meta.url);

// Usage: npx tsx scripts/bio-book/validate-modules.mts scripts/bio-book/ch2/pages
const dir = process.argv[2];
if (!dir) { console.error('pass a pages dir'); process.exit(1); }

let bad = 0;
const files = readdirSync(dir).filter((f) => f.endsWith('.js')).sort();
for (const f of files) {
  const mod = require(join(process.cwd(), dir, f));
  const blocks = mod.blocks || [];
  // structural checks
  const problems: string[] = [];
  if (mod.blocks?.[0]?.type !== 'image') problems.push('block 0 is not a hero image');
  if (mod.page_type === 'lesson' && blocks[blocks.length - 1]?.type !== 'inline_quiz') problems.push('last block is not inline_quiz');
  const orders = blocks.map((b: any) => b.order);
  if (orders.some((o: number, i: number) => o !== i)) problems.push('orders not 0..N sequential');
  const ids = blocks.map((b: any) => b.id);
  if (new Set(ids).size !== ids.length) problems.push('duplicate block ids');
  if (ids.some((id: any) => typeof id !== 'string' || !id)) problems.push('a block is missing a string id');

  const res = ContentBlocksArraySchema.safeParse(blocks);
  if (!res.success) {
    bad++;
    console.log(`INVALID ${f} (${mod.slug}) — ${blocks.length} blocks`);
    for (const iss of res.error.issues.slice(0, 8)) console.log(`   ${iss.path.join('.')}: ${iss.message}`);
  } else if (problems.length) {
    bad++;
    console.log(`STRUCT  ${f} (${mod.slug}) — ${problems.join('; ')}`);
  } else {
    console.log(`ok      ${f} (${mod.slug}) — ${blocks.length} blocks, ${mod.page_number != null ? 'p' + mod.page_number : ''}`);
  }
}
console.log(`\n${files.length} modules, ${bad} with problems.`);
if (bad) process.exit(2);
