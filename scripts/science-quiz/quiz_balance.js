'use strict';
/**
 * Spread the CORRECT answer across A/B/C/D in a chapter's _ch<ch>_quiz.json,
 * so "always pick B" cannot beat the quiz. Reorders options only (never edits
 * text), updates correct_index, writes the JSON back. Deterministic + idempotent.
 *
 * PRECHECK: refuses to touch any question whose explanation references an option
 * by letter/position ("option B", "the first choice") — reordering would break it.
 *
 *   node scripts/science-quiz/quiz_balance.js <ch> [--write]
 */
const fs = require('fs');

const ch = Number(process.argv[2]);
const WRITE = process.argv.includes('--write');
if (!ch) { console.error('Usage: node quiz_balance.js <ch> [--write]'); process.exit(1); }

const PAT = [0, 2, 1, 3, 3, 1, 2, 0]; // period 8, each of 0..3 twice
const LETTER_REF = /\boption\s+[a-d]\b|\b(first|second|third|fourth|last)\s+(option|choice|answer)\b/i;

const path = `scripts/science-quiz/_ch${ch}_quiz.json`;
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let changed = 0, skipped = 0;
const before = [0, 0, 0, 0], after = [0, 0, 0, 0];
data.items.forEach((it, i) => {
  const opts = it.options || [];
  before[it.correct_index] = (before[it.correct_index] || 0) + 1;
  if (opts.length !== 4) { skipped++; after[it.correct_index]++; return; }
  if (LETTER_REF.test(it.explanation || '')) { console.log(`  ⚠️ skip (letter ref): ${it.page_slug} q${it.q_index}`); skipped++; after[it.correct_index]++; return; }
  const target = PAT[i % PAT.length];
  const correctText = opts[it.correct_index];
  const distractors = opts.filter((_, k) => k !== it.correct_index);
  const reordered = [];
  let di = 0;
  for (let pos = 0; pos < 4; pos++) reordered.push(pos === target ? correctText : distractors[di++]);
  if (it.correct_index !== target) changed++;
  it.options = reordered;
  it.correct_index = target;
  after[target]++;
});

console.log(`Ch${ch}: ${data.items.length} questions, ${changed} repositioned, ${skipped} skipped`);
console.log(`  before A/B/C/D: ${before.join(' / ')}`);
console.log(`  after  A/B/C/D: ${after.join(' / ')}`);
if (WRITE) { fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n'); console.log(`  ✅ wrote ${path}`); }
else console.log('  (dry run — pass --write to save)');
