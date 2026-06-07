'use strict';
/**
 * §3.6.1 quality gate for a chapter's inline_quiz questions (reads live DB).
 * Checks: exactly 4 options, no dup options, correct_index in range, every
 * question has a difficulty_level, length-tell rate, and answer-position balance.
 *
 *   node scripts/science-quiz/quiz_validate.js <ch|all>
 * exit 0 = PASS, 1 = FAIL.
 */
const { withBook } = require('../science-practice/_lib');

const arg = process.argv[2] && process.argv[2] !== 'all' ? Number(process.argv[2]) : null;
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const POS = ['A', 'B', 'C', 'D'];

(async () => {
  await withBook(async ({ allPages }) => {
    const chapters = [...new Set(allPages.map((p) => p.chapter_number))].sort((a, b) => a - b).filter((c) => !arg || c === arg);
    let anyFail = false;
    for (const ch of chapters) {
      const qs = [];
      for (const p of allPages.filter((p) => p.chapter_number === ch))
        for (const b of p.blocks || []) if (b.type === 'inline_quiz') for (const q of b.questions || []) qs.push(q);
      if (!qs.length) continue;
      const n = qs.length;
      const fails = [], warns = [];
      const pos = [0, 0, 0, 0]; let tell = 0, noDiff = 0; const hygiene = [];
      qs.forEach((q, i) => {
        const opts = q.options || [], ci = q.correct_index;
        if (opts.length !== 4) hygiene.push(`q${i}:${opts.length}opts`);
        if (ci < 0 || ci >= opts.length) hygiene.push(`q${i}:idx`);
        if (new Set(opts.map((o) => String(o).trim().toLowerCase())).size !== opts.length) hygiene.push(`q${i}:dup`);
        if (q.difficulty_level == null) noDiff++;
        if (opts.length === 4 && ci >= 0 && ci < 4) {
          pos[ci]++;
          const lens = opts.map((o) => String(o).length), cl = lens[ci];
          const nextMax = Math.max(...lens.filter((_, k) => k !== ci));
          if (cl > nextMax && cl >= 1.15 * nextMax) tell++;
        }
      });
      const maxPos = Math.max(...pos);
      if (pct(tell, n) > 40) fails.push(`length tell ${pct(tell, n)}% (>40%)`);
      if (pct(maxPos, n) > 40) fails.push(`position ${POS[pos.indexOf(maxPos)]} = ${pct(maxPos, n)}% (>40%)`);
      if (pos.some((p) => p === 0)) fails.push(`position(s) never correct: ${pos.map((p, i) => (p === 0 ? POS[i] : null)).filter(Boolean).join(',')}`);
      if (noDiff) fails.push(`${noDiff}/${n} questions missing difficulty_level`);
      if (hygiene.length) fails.push(`hygiene: ${hygiene.join(' ')}`);
      const ok = fails.length === 0;
      if (!ok) anyFail = true;
      console.log(`\n━━ Ch${ch} — ${n} inline_quiz Qs — ${ok ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   positions A/B/C/D: ${pos.join(' / ')}   length-tell: ${pct(tell, n)}%   no-difficulty: ${noDiff}`);
      fails.forEach((f) => console.log(`   ❌ ${f}`));
      warns.forEach((w) => console.log(`   ⚠️  ${w}`));
    }
    console.log(`\nRESULT: ${anyFail ? '❌ FAIL' : '✅ PASS'}`);
    process.exit(anyFail ? 1 : 0);
  });
})().catch((e) => { console.error(e); process.exit(1); });
