#!/usr/bin/env node
/**
 * Post-pass over the physics corpus:
 *   1. \dfrac -> \frac  (CLAUDE.md §4 — \dfrac renders oversized)
 *   2. spread the MCQ correct-answer positions
 *
 * Why (2) needs a script: authoring an MCQ naturally puts the correct option
 * first — you write the answer, then invent distractors. Left alone that gives a
 * 100%-position-(a) bank, which students learn to game. This has bitten the
 * project twice before (Social Science, Math), so it is mechanised rather than
 * left to discipline.
 *
 * The reshuffle is deterministic (seeded per chapter) so re-running is a no-op,
 * and it preserves the relative order of the distractors — only the correct
 * option moves. Options that must stay last ("none of these") are pinned.
 *
 * usage: node scripts/hcv-bank/balance.js [--check] [chapterNumber ...]
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', '..', '_agents', 'question-banks', 'physics-hcv', 'chapters');
const CHECK_ONLY = process.argv.includes('--check');
const PIN_LAST = /^\s*(none of these|none of the above|all of the above|any of these|cannot be (determined|decided)|the information is insufficient|data insufficient)/i;

// deterministic PRNG so repeated runs are stable
function lcg(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function shuffled(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let filesChanged = 0, itemsMoved = 0, fracFixed = 0;
const before = [0, 0, 0, 0], after = [0, 0, 0, 0];

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
let files = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
if (args.length) {
  const want = args.map(a => `ch${String(a).padStart(2, '0')}.json`);
  files = files.filter(f => want.includes(f));
}

for (const file of files) {
  const full = path.join(DIR, file);
  const raw = fs.readFileSync(full, 'utf8');
  const doc = JSON.parse(raw);
  let changed = false;

  // ── 1. \dfrac -> \frac, everywhere ────────────────────────────────────────
  const fixFrac = (node) => {
    if (Array.isArray(node)) return node.forEach(fixFrac);
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (typeof v === 'string' && v.includes('\\dfrac')) {
          node[k] = v.split('\\dfrac').join('\\frac');
          fracFixed++; changed = true;
        } else fixFrac(v);
      }
    }
  };
  fixFrac(doc);

  // ── 2. spread correct-answer positions ────────────────────────────────────
  const mcqs = [];
  for (const sec of doc.blocks.practice_bank.sections) {
    for (const it of sec.items) if (it.kind === 'mcq') mcqs.push(it);
  }
  mcqs.forEach(it => before[it.correct_index]++);

  // target positions: equal counts of 0/1/2/3, then shuffled per chapter
  const n = mcqs.length;
  const targets = [];
  for (let i = 0; i < n; i++) targets.push(i % 4);
  const rnd = lcg(doc.hcv_chapter * 7919 + n);
  const plan = shuffled(targets, rnd);

  mcqs.forEach((it, i) => {
    const opts = it.options;
    const correct = opts[it.correct_index];
    const pinned = opts.filter(o => PIN_LAST.test(o));
    const rest = opts.filter(o => o !== correct && !pinned.includes(o));

    let target = plan[i];
    // a pinned option owns the last slot(s) — never place the correct one there
    // unless the correct option is itself the pinned one.
    const maxSlot = opts.length - 1 - (pinned.includes(correct) ? 0 : pinned.length);
    if (pinned.includes(correct)) target = opts.length - 1;
    else if (target > maxSlot) target = maxSlot;

    const next = [];
    let ri = 0;
    for (let s = 0; s < opts.length; s++) {
      if (s === target) next.push(correct);
      else if (s > maxSlot && !pinned.includes(correct)) next.push(pinned[s - maxSlot - 1]);
      else next.push(rest[ri++]);
    }
    // safety: the rearranged set must be a permutation of the original
    if (next.length !== opts.length || next.some(o => o === undefined) ||
        new Set(next).size !== new Set(opts).size) {
      console.error(`  ! ${file} ${it.id}: reshuffle aborted (option set mismatch) — left unchanged`);
      after[it.correct_index]++;
      return;
    }
    if (next[target] !== correct) {
      console.error(`  ! ${file} ${it.id}: target slot mismatch — left unchanged`);
      after[it.correct_index]++;
      return;
    }
    if (it.correct_index !== target) { itemsMoved++; changed = true; }
    it.options = next;
    it.correct_index = target;
    after[target]++;
  });

  if (changed && !CHECK_ONLY) {
    fs.writeFileSync(full, JSON.stringify(doc, null, 1) + '\n');
    filesChanged++;
  }
}

const pct = (d, tot) => tot ? (100 * d / tot).toFixed(1) + '%' : '0%';
const totB = before.reduce((a, b) => a + b, 0), totA = after.reduce((a, b) => a + b, 0);
console.log(`\n  files: ${files.length}   MCQs: ${totB}`);
console.log(`  before  a/b/c/d = ${before.join('/')}   (${before.map(d => pct(d, totB)).join(', ')})`);
console.log(`  after   a/b/c/d = ${after.join('/')}   (${after.map(d => pct(d, totA)).join(', ')})`);
console.log(`  \\dfrac fixed: ${fracFixed}   options moved: ${itemsMoved}   files written: ${CHECK_ONLY ? '(check only)' : filesChanged}\n`);
