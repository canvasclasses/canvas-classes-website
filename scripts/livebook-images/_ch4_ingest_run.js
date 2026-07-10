'use strict';
/**
 * Ingest batch 1 (the first 15 ch4 queue items) from explicitly-mapped files in
 * ~/Downloads. queue[i] -> ch4_img{i+1}.png, EXCEPT queue[4] (image 5) whose
 * correct file is "ch4_img5 (1).png" (the base ch4_img5.png is an early dup).
 * Runs ingest.js per pair (cwebp q42 -> R2 -> write block src -> journal).
 */
const fs = require('fs'); const os = require('os'); const path = require('path');
const { execFileSync } = require('child_process');
const QUEUE = require('./_queue.json').slice(0, 15);
const DL = path.join(os.homedir(), 'Downloads');
const INGEST = path.join(__dirname, 'ingest.js');

const fileFor = (i) => i === 4 ? 'ch4_img5 (1).png' : `ch4_img${i + 1}.png`;

// preflight: confirm every file exists
let missing = [];
QUEUE.forEach((q, i) => { if (!fs.existsSync(path.join(DL, fileFor(i)))) missing.push(fileFor(i)); });
if (missing.length) { console.error('MISSING FILES:', missing.join(', ')); process.exit(1); }

console.log('Mapping:');
QUEUE.forEach((q, i) => console.log(`  ${String(i + 1).padStart(2)}. ${fileFor(i)}  ->  ${q.slug} [${q.targetField}]`));
console.log('');

let ok = 0;
QUEUE.forEach((q, i) => {
  const args = [INGEST, '--file', path.join(DL, fileFor(i)),
    '--page', q.pageId, '--block', q.blockId, '--field', q.targetField,
    '--lang', q.lang || 'en', '--book', q.bookId, '--chapter', String(q.chapterNumber)];
  try {
    const out = execFileSync('node', args, { encoding: 'utf8' });
    console.log(`✅ ${q.slug}: ${(out.trim().split('\n').pop() || '').slice(0, 120)}`);
    ok++;
  } catch (e) { console.error(`❌ ${q.slug}: ${((e.stdout || '') + (e.stderr || e.message)).slice(-200)}`); }
});
console.log(`\nDone: ${ok}/${QUEUE.length} ingested.`);
