import { ContentBlocksArraySchema } from '@canvas/data/books/schemas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PAGES } = require('/Users/CanvasClasses/Desktop/canvas/scripts/physics11-book/rework_ch0_hcverma_style.js');
let bad=0, nulls=0; const tally:Record<number,number>={0:0,1:0,2:0,3:0};
let stepSolvers=0, gatedSteps=0, totalSteps=0;
for (const p of PAGES) {
  const r = ContentBlocksArraySchema.safeParse(p.blocks);
  console.log(r.success ? `OK   ${p.slug} (${p.blocks.length} blocks)` : `FAIL ${p.slug} :: ${JSON.stringify(r.error.issues.slice(0,6),null,1)}`);
  if(!r.success) bad++;
  for (const bl of p.blocks) {
    if (bl.type==='inline_quiz') for(const qq of bl.questions) tally[qq.correct_index]=(tally[qq.correct_index]??0)+1;
    if (bl.type==='step_solver'){ stepSolvers++; totalSteps+=bl.steps.length; gatedSteps+=bl.steps.filter((s:any)=>s.check).length; }
    for (const [k,val] of Object.entries(bl)) if (val===null){ nulls++; console.log(`  NULL ${p.slug} ${bl.type}.${k}`); }
  }
}
const vals=Object.values(tally); const balanced=Math.max(...vals)-Math.min(...vals)<=1;
console.log(`\nquiz positions A/B/C/D: ${vals.join('/')}  ${balanced?'✅ balanced':'❌ POSITION TELL'}`);
console.log(`step_solver blocks: ${stepSolvers} · steps: ${totalSteps} · gated on a micro-interaction: ${gatedSteps} (${Math.round(100*gatedSteps/totalSteps)}%)`);
console.log(`\n${bad===0&&balanced&&nulls===0?'✅ SAFE TO WRITE':'❌ DO NOT WRITE'} (invalid:${bad}, nulls:${nulls})`);
process.exit(bad===0&&balanced&&nulls===0?0:1);
