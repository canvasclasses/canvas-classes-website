const fs = require('fs');
const path = require('path');
const dir = 'scripts/livebook-images';
const q = JSON.parse(fs.readFileSync(path.join(dir,'_ieq_queue.json'),'utf8'));
const START = Number(process.argv[2]||0);   // 0-based index into queue
const COUNT = Number(process.argv[3]||15);
const BATCH = process.argv[4]||'b1';
const slice = q.slice(START, START+COUNT);
const map = slice.map((it,i) => ({
  file: `ieq_${BATCH}_${String(i+1).padStart(2,'0')}.png`,
  n: START+i+1,
  page: it.pageNumber, slug: it.slug, pageId: it.pageId,
  blockId: it.blockId, field: it.targetField, lang: it.lang,
}));
fs.writeFileSync(path.join(dir,`_ieq_${BATCH}_map.json`), JSON.stringify(map,null,2));
console.log(`Wrote _ieq_${BATCH}_map.json (${slice.length} items, queue idx ${START}..${START+slice.length-1})\n`);
slice.forEach((it,i)=>{
  console.log(`#${START+i+1}  [${map[i].file}]  p${it.pageNumber} ${it.slug}`);
  console.log(it.prompt);
  console.log('-----');
});
