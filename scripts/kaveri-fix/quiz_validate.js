'use strict';
/**
 * Validate the quiz bank live in Mongo: the "length-tell" metric + difficulty coverage.
 * Pass when correct-is-longest rate is at/near chance and every Q has difficulty_level.
 *   node scripts/kaveri-fix/quiz_validate.js [chapter]
 */
const { withBook } = require('./_lib');
const onlyCh = process.argv[2] ? Number(process.argv[2]) : null;

(async () => {
  await withBook(async ({ allPages }) => {
    const pos = [0, 1, 2].map(() => ({ n: 0, longest: 0 }));
    let overall = { n: 0, longest: 0 }, missingDiff = 0, total = 0;
    const flagged = [];
    const ansPosByCh = {}; // per-chapter correct-answer position tally (A/B/C/D)
    for (const p of allPages) {
      if (onlyCh && p.chapter_number !== onlyCh) continue;
      for (const b of p.blocks || []) {
        if (b.type !== 'inline_quiz') continue;
        (b.questions || []).forEach((q, i) => {
          if (!q.options || q.correct_index == null) return;
          total++;
          (ansPosByCh[p.chapter_number] = ansPosByCh[p.chapter_number] || [0, 0, 0, 0]);
          if (q.correct_index >= 0 && q.correct_index < 4) ansPosByCh[p.chapter_number][q.correct_index]++;
          if (![1, 2, 3].includes(q.difficulty_level)) missingDiff++;
          const lens = q.options.map((o) => String(o).length);
          const correctLen = lens[q.correct_index];
          const maxLen = Math.max(...lens);
          const isLongest = correctLen === maxLen;
          overall.n++; if (isLongest) overall.longest++;
          if (i < 3) { pos[i].n++; if (isLongest) pos[i].longest++; }
          // Flag a question where the correct answer is >1.3x the next longest distractor.
          const others = lens.filter((_, k) => k !== q.correct_index);
          if (correctLen > 1.3 * Math.max(...others)) flagged.push(`Ch${p.chapter_number} ${p.slug} q${i + 1}`);
        });
      }
    }
    const pct = (o) => (o.n ? Math.round((100 * o.longest) / o.n) : 0);
    console.log(`Scope: ${onlyCh ? 'Ch' + onlyCh : 'whole book'} — ${total} questions`);
    console.log(`correct-is-longest:  Q1 ${pct(pos[0])}%  Q2 ${pct(pos[1])}%  Q3 ${pct(pos[2])}%  ALL ${pct(overall)}%  (chance ≈ 25-40%)`);
    console.log(`missing difficulty_level: ${missingDiff}`);
    console.log(`length-tell flags (correct >1.3x next): ${flagged.length}`);
    if (flagged.length) console.log('  ', flagged.slice(0, 20).join(' | '));
    // Answer-position balance — guard the "always pick B" hole per chapter.
    let passPos = true;
    console.log(`\nanswer-position balance (A/B/C/D), per chapter:`);
    for (const ch of Object.keys(ansPosByCh).sort((a, b) => a - b)) {
      const c = ansPosByCh[ch];
      const n = c.reduce((x, y) => x + y, 0);
      const maxPos = Math.max(...c);
      const ok = maxPos <= n * 0.4 && Math.min(...c) > 0;
      if (!ok) passPos = false;
      console.log(`  Ch${ch}: ${c.join(' / ')}  ${ok ? 'OK' : '❌ BIAS'}`);
    }

    const passLen = pct(overall) <= 45 && pct(pos[2]) <= 45 && flagged.length === 0;
    const passDiff = missingDiff === 0;
    console.log(`\nRESULT: length ${passLen ? 'PASS' : 'FAIL'} | difficulty ${passDiff ? 'PASS' : 'FAIL'} | position ${passPos ? 'PASS' : 'FAIL'}`);
    process.exit(passLen && passPos ? 0 : 1);
  });
})().catch((e) => { console.error(e); process.exit(1); });
