'use strict';
/**
 * One-off driver: ingest the 16 verified Ch.11 images.
 * Pairs _queue.json (queue order) with the 16 ChatGPT PNGs in ~/Downloads
 * (sorted oldest→newest = the same order, content-verified by the agent).
 * Runs ingest.js per pair (compress → R2 → write block → journal).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const QUEUE = require('./_queue.json');
const DL = path.join(os.homedir(), 'Downloads');
const BOOK = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
const CH = '11';
const INGEST = path.join(__dirname, 'ingest.js');

// This session's 16 images = the 16 most-recently-modified ChatGPT PNGs.
// Verified window: 1782039071000 .. 1782039282000 (2026-06-21 16:21–16:24).
const WINDOW_LO = 1782039000000, WINDOW_HI = 1782039400000;
const picked = fs.readdirSync(DL)
  .filter((f) => f.startsWith('ChatGPT Image') && f.endsWith('.png'))
  .map((f) => ({ f, m: fs.statSync(path.join(DL, f)).mtimeMs }))
  .sort((a, b) => b.m - a.m)        // newest first
  .slice(0, QUEUE.length)
  .sort((a, b) => a.m - b.m);       // back to oldest→newest

console.log('Selected file mtimes:', picked.map((x) => Math.round(x.m / 1000)).join(', '));
const outOfWindow = picked.filter((x) => x.m < WINDOW_LO || x.m > WINDOW_HI);
if (outOfWindow.length) {
  console.error(`ABORT: ${outOfWindow.length} selected file(s) fall outside the verified session window — check Downloads.`);
  console.error(outOfWindow.map((x) => `  ${x.f} @ ${Math.round(x.m / 1000)}`).join('\n'));
  process.exit(1);
}
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
