const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const STAGE = '/private/tmp/claude-501/-Users-CanvasClasses-Desktop-canvas/522c0945-fbc7-427e-945c-cb0260d3c6fe/scratchpad/ieq_b2';
const BOOK = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
const CH = '7';
const map = JSON.parse(fs.readFileSync(path.join(dir, '_ieq_b2_map.json'), 'utf8'));
let ok = 0, fail = 0;
for (const m of map) {
  const file = path.join(STAGE, m.file);
  if (!fs.existsSync(file)) { console.error(`MISSING ${m.file}`); fail++; continue; }
  try {
    const out = execFileSync('node', [
      path.join(dir, 'ingest.js'),
      '--file', file, '--page', m.pageId, '--block', m.blockId,
      '--field', m.field, '--lang', m.lang, '--book', BOOK, '--chapter', CH,
    ], { cwd: path.resolve(dir, '../..'), encoding: 'utf8' });
    process.stdout.write(`#${m.n} ${m.slug}: ${out.trim().split('\n').pop()}\n`);
    ok++;
  } catch (e) {
    console.error(`#${m.n} ${m.slug} FAILED: ${e.stderr || e.message}`);
    fail++;
  }
}
console.log(`\n=== batch 2 ingest done: ${ok} ok, ${fail} failed ===`);
