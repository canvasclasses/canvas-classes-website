'use strict';
/**
 * Deterministically spread the CORRECT answer across option positions in a
 * chapter_practice bank, so "always pick B" can never beat the quiz.
 *
 * Reads scripts/kaveri-fix/_ch<N>_practice.json, reorders each question's
 * `options` so correct_index follows a fixed, non-obvious pattern (not a plain
 * A-B-C-D cycle), updates correct_index, and writes the JSON back. Option TEXT
 * is never changed — only the order — so distractor quality is untouched.
 *
 * Safe to re-run (idempotent target positions). After running, rebuild with
 * practice_build.js and confirm with practice_validate.js.
 *
 *   node scripts/kaveri-fix/balance_positions.js <ch> [--write]
 *
 * NOTE: assumes every question has 4 options. Run practice_validate first; fix
 * any 3-option questions (add a 4th plausible distractor) before rebalancing.
 * Also assumes explanations reference option CONTENT, not a letter/position —
 * verify that for the chapter before trusting the result.
 */
const fs = require('fs');

const ch = Number(process.argv[2]);
const WRITE = process.argv.includes('--write');
if (!ch) { console.error('Usage: node balance_positions.js <ch> [--write]'); process.exit(1); }

// Fixed scrambled cycle (period 8, each of 0..3 twice) → ~uniform, no ABCD tell.
const PAT = [1, 3, 0, 2, 2, 0, 3, 1];

const path = `scripts/kaveri-fix/_ch${ch}_practice.json`;
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const qs = data.chapter_practice.questions;

let changed = 0;
const before = [0, 0, 0, 0], after = [0, 0, 0, 0];
const issues = [];

qs.forEach((q, i) => {
  const opts = q.options || [];
  before[q.correct_index] = (before[q.correct_index] || 0) + 1;
  if (opts.length !== 4) { issues.push(`q${i + 1}: ${opts.length} options — skipped`); after[q.correct_index]++; return; }

  const target = PAT[i % PAT.length] % opts.length;
  const correctText = opts[q.correct_index];
  const distractors = opts.filter((_, k) => k !== q.correct_index); // preserve relative order
  const reordered = [];
  let di = 0;
  for (let pos = 0; pos < opts.length; pos++) reordered.push(pos === target ? correctText : distractors[di++]);

  if (q.correct_index !== target) changed++;
  q.options = reordered;
  q.correct_index = target;
  after[target]++;
});

console.log(`Ch${ch}: ${qs.length} questions, ${changed} repositioned`);
console.log(`  before A/B/C/D: ${before.join(' / ')}`);
console.log(`  after  A/B/C/D: ${after.join(' / ')}`);
issues.forEach((x) => console.log(`  ⚠️  ${x}`));

if (WRITE) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`  ✅ wrote ${path}`);
} else {
  console.log(`  (dry run — pass --write to save)`);
}
