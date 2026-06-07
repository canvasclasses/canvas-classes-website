'use strict';
/**
 * Spread the CORRECT answer across option positions (A/B/C/D) for EVERY MCQ in the
 * गंगा book — inline_quiz, chapter_practice, comprehension_checkpoint, vocabulary_lab
 * self_check, and apply_express form_select. Closes the "tap the first option" hole
 * (correct was at A for 98% of 608 questions).
 *
 * Reorders `options` only (option TEXT never changes); for form_select it reorders the
 * parallel `option_reasons` array too. A deterministic per-(chapter,surface) scramble
 * pattern keeps each bank/surface ~uniform with no obvious cycle. Writes a reversible
 * backup keyed by question id.
 *
 *   node scripts/hindi-fix/balance_positions.js            # dry run (preview)
 *   node scripts/hindi-fix/balance_positions.js --write    # apply
 *   node scripts/hindi-fix/balance_positions.js --rollback # restore original order
 */
const fs = require('fs');
const { withBook, savePageBlocks, eachMcq } = require('./_lib');
const WRITE = process.argv.includes('--write');
const ROLLBACK = process.argv.includes('--rollback');
const BACKUP = 'scripts/hindi-fix/_balance_positions_backup.json';
const PAT = [1, 3, 0, 2, 2, 0, 3, 1]; // period 8, each of 0..3 twice → ~uniform, no ABCD tell

(async () => {
  await withBook(async ({ pages, allPages }) => {
    if (ROLLBACK) {
      if (!fs.existsSync(BACKUP)) { console.log('No backup — nothing to roll back.'); return; }
      const orig = JSON.parse(fs.readFileSync(BACKUP, 'utf8'));
      let n = 0; const touched = new Set();
      for (const p of allPages) { let dirty = false;
        eachMcq(p, (q) => { if (orig[q.id]) { q.options = orig[q.id].options; q.correct_index = orig[q.id].correct_index; if (orig[q.id].option_reasons) q.option_reasons = orig[q.id].option_reasons; n++; dirty = true; } });
        if (dirty) { touched.add(p._id); await savePageBlocks(pages, p._id, p.blocks); } }
      console.log(`Rolled back ${n} questions across ${touched.size} pages.`); return;
    }
    const backup = {};
    const counter = {};            // key `${ch}:${surface}` → running index for PAT
    const dist = {};               // key surface → before/after [A,B,C,D]
    const dirty = new Map();
    for (const p of allPages) {
      const ch = p.chapter_number;
      eachMcq(p, (q, { surface }) => {
        const len = q.options.length;
        const d = (dist[surface] ??= { before: [0,0,0,0], after: [0,0,0,0], n: 0 });
        d.before[q.correct_index]++; d.n++;
        const ck = (surface === 'chapter_practice' || surface === 'inline_quiz') ? `${ch}:${surface}` : surface;
        const idx = (counter[ck] = (counter[ck] || 0)); counter[ck]++;
        const target = PAT[idx % PAT.length] % len;
        if (target !== q.correct_index) {
          backup[q.id] = { options: q.options.slice(), correct_index: q.correct_index, ...(q.option_reasons ? { option_reasons: q.option_reasons.slice() } : {}) };
          const correct = q.options[q.correct_index];
          const correctReason = q.option_reasons ? q.option_reasons[q.correct_index] : null;
          const distract = q.options.map((o, k) => [o, k]).filter(([, k]) => k !== q.correct_index);
          const newOpts = [], newReasons = [];
          let di = 0;
          for (let pos = 0; pos < len; pos++) {
            if (pos === target) { newOpts.push(correct); if (q.option_reasons) newReasons.push(correctReason); }
            else { const [o, k] = distract[di++]; newOpts.push(o); if (q.option_reasons) newReasons.push(q.option_reasons[k]); }
          }
          q.options = newOpts; q.correct_index = target; if (q.option_reasons) q.option_reasons = newReasons;
          dirty.set(p._id, p);
        }
        d.after[target]++;
      });
    }
    console.log('Per-surface correct-answer position (before → after):');
    for (const s of Object.keys(dist)) { const d = dist[s]; console.log(`  ${s.padEnd(18)} n=${String(d.n).padStart(3)} | ${d.before.join('/')} → ${d.after.join('/')}`); }
    console.log(`\nPages to update: ${dirty.size}`);
    if (!WRITE) { console.log('(dry run — pass --write to apply)'); return; }
    fs.writeFileSync(BACKUP, JSON.stringify(backup), 'utf8');
    for (const [, p] of dirty) await savePageBlocks(pages, p._id, p.blocks);
    console.log(`✅ Applied. Backup at ${BACKUP} (rollback with --rollback).`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
