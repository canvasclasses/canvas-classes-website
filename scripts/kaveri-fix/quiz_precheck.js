'use strict';
/**
 * Pre-apply gate for the quiz fix files. For each chapter, cross-checks
 * _ch<N>_fix.json against _ch<N>_quiz.json WITHOUT touching the DB:
 *   - structural: 48 ids, 4 options, valid correct_index, difficulty 1/2/3
 *   - length tell: correct-is-longest rate per position bucket
 *   - meaning drift: token overlap between new correct option and the original
 *     correct_text; low overlap + no question rewrite => flag for manual review
 */
const fs = require('fs');

function tokens(s) {
  return new Set(String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2));
}
function overlap(a, b) {
  const A = tokens(a), B = tokens(b);
  if (!A.size) return 1;
  let hit = 0; for (const w of A) if (B.has(w)) hit++;
  return hit / A.size;
}

let grand = { n: 0, longest: 0 }, totalFlags = 0;
for (let ch = 1; ch <= 8; ch++) {
  const quiz = JSON.parse(fs.readFileSync(`scripts/kaveri-fix/_ch${ch}_quiz.json`, 'utf8'));
  const fix = JSON.parse(fs.readFileSync(`scripts/kaveri-fix/_ch${ch}_fix.json`, 'utf8'));
  const qById = new Map(quiz.map((q) => [q.question_id, q]));
  const fById = new Map(fix.map((f) => [f.question_id, f]));
  const pos = [0, 1, 2].map(() => ({ n: 0, longest: 0 }));
  const flags = [];
  let structErr = 0;

  for (const q of quiz) {
    const f = fById.get(q.question_id);
    if (!f) { structErr++; flags.push(`MISSING ${q.question_id}`); continue; }
    if (!Array.isArray(f.options) || f.options.length !== 4) { structErr++; flags.push(`opts ${q.question_id}`); }
    if (![0, 1, 2, 3].includes(f.correct_index)) { structErr++; flags.push(`idx ${q.question_id}`); }
    if (![1, 2, 3].includes(f.difficulty_level)) { structErr++; flags.push(`diff ${q.question_id}`); }
    if (!Array.isArray(f.options)) continue;
    const lens = f.options.map((o) => String(o).length);
    const isLongest = lens[f.correct_index] === Math.max(...lens);
    const p = q.position - 1;
    if (p >= 0 && p < 3) { pos[p].n++; if (isLongest) pos[p].longest++; }
    grand.n++; if (isLongest) grand.longest++;
    // meaning drift: only meaningful when the question was NOT rewritten
    if (!f.question) {
      const ov = overlap(q.correct_text, f.options[f.correct_index]);
      if (ov < 0.25) flags.push(`DRIFT? ${q.page_slug} p${q.position} ov=${ov.toFixed(2)} :: "${q.correct_text}" -> "${f.options[f.correct_index]}"`);
    }
  }
  const pct = (o) => (o.n ? Math.round((100 * o.longest) / o.n) : 0);
  const driftFlags = flags.filter((x) => x.startsWith('DRIFT')).length;
  totalFlags += driftFlags;
  console.log(`Ch${ch}: ${fix.length} fixes | struct-err ${structErr} | longest Q1 ${pct(pos[0])}% Q2 ${pct(pos[1])}% Q3 ${pct(pos[2])}% | drift-flags ${driftFlags}`);
  flags.filter((x) => !x.startsWith('DRIFT')).slice(0, 5).forEach((x) => console.log('   STRUCT', x));
  flags.filter((x) => x.startsWith('DRIFT')).slice(0, 8).forEach((x) => console.log('   ', x));
}
console.log(`\nWHOLE BANK correct-is-longest: ${Math.round((100 * grand.longest) / grand.n)}%  (was 94%)`);
console.log(`Total meaning-drift flags to eyeball: ${totalFlags}`);
