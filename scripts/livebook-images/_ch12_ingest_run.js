'use strict';
/**
 * One-off driver: ingest the 15 verified Ch.12 BATCH-1 images (pages 55–63).
 * Pairs the FIRST 15 _queue.json items (queue order) with the 15 newest ChatGPT
 * PNGs in ~/Downloads (sorted oldest→newest = the same order; content-verified
 * by the agent 1:1 against each page). Runs ingest.js per pair
 * (compress cwebp -q42 → R2 → write block src → journal).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const QUEUE = require('./_queue.json').slice(0, 15);
const DL = path.join(os.homedir(), 'Downloads');
const BOOK = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
const CH = '12';
const INGEST = path.join(__dirname, 'ingest.js');

const picked = fs.readdirSync(DL)
  .filter((f) => f.startsWith('ChatGPT Image') && f.endsWith('.png'))
  .map((f) => ({ f, m: fs.statSync(path.join(DL, f)).mtimeMs }))
  .sort((a, b) => b.m - a.m)        // newest first
  .slice(0, QUEUE.length)
  .sort((a, b) => a.m - b.m);       // back to oldest→newest

const files = picked.map((x) => path.join(DL, x.f));
if (files.length !== QUEUE.length) {
  console.error(`COUNT MISMATCH: ${files.length} files vs ${QUEUE.length} queue items — aborting.`);
  process.exit(1);
}

console.log('Mapping (file → page):');
QUEUE.forEach((q, i) => console.log(`  ${String(i + 1).padStart(2)}. ${path.basename(files[i])}  →  ${q.slug} [${q.targetField}]`));
console.log('');

let ok = 0;
QUEUE.forEach((q, i) => {
  const args = [INGEST,
    '--file', files[i],
    '--page', q.pageId,
    '--block', q.blockId,
    '--field', q.targetField,
    '--lang', q.lang || 'en',
    '--book', BOOK,
    '--chapter', CH,
  ];
  try {
    const out = execFileSync('node', args, { encoding: 'utf8' });
    const last = out.trim().split('\n').filter(Boolean).pop() || '';
    console.log(`✅ ${q.slug}: ${last}`);
    ok++;
  } catch (e) {
    console.error(`❌ ${q.slug}: ${(e.stdout || '') + (e.stderr || e.message)}`);
  }
});
console.log(`\nDone: ${ok}/${QUEUE.length} ingested.`);
