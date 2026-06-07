'use strict';
/**
 * Kill the length "tell" in गंगा inline_quiz blocks: questions where the correct
 * option is > 1.3× the next-longest distractor (a visible giveaway). One safe move per flagged
 * question: strip an English-gloss parenthetical — e.g. "(journalism)" — off the
 * CORRECT option. That removes BOTH the length tell and the unfair hint that only the
 * right answer carried; the gloss already lives in the vocab cards + `explanation`, so
 * nothing pedagogical is lost. Full-clause correct answers with no gloss are left as-is
 * (mechanical padding/trimming there would wreck meaning or grammar) and reported.
 * Option order / correct_index are untouched (positions already balanced). Reversible.
 *
 *   node scripts/hindi-fix/inline_lengthfix.js            # dry run
 *   node scripts/hindi-fix/inline_lengthfix.js --write
 *   node scripts/hindi-fix/inline_lengthfix.js --rollback
 */
const fs = require('fs');
const { withBook, savePageBlocks } = require('./_lib');
const WRITE = process.argv.includes('--write');
const ROLLBACK = process.argv.includes('--rollback');
const BACKUP = 'scripts/hindi-fix/_inline_lengthfix_backup.json';
const len = (s) => String(s).length;                 // match audit/validator metric
const isGiveaway = (opts, ci) => { const L = opts.map(len); const o = L.filter((_, k) => k !== ci); return o.length && L[ci] > 1.3 * Math.max(...o); };

function trimCorrect(t, opts, ci) {
  // ONLY safe move: remove English-gloss parentheticals like "(journalism)",
  // "(Doctrine of Lapse)" — pure redundant hints that only sit on the correct
  // option. Anything else (em-dash/comma clauses) can carry real answer content,
  // so we never strip it automatically. The gloss detail already lives in vocab
  // cards + the explanation, so removing it loses nothing.
  let s = String(t).replace(/\s*\([^()]*[A-Za-z][^()]*\)/g, '').replace(/\s+/g, ' ').trim();
  return s;
}
(async () => {
  await withBook(async ({ pages, allPages }) => {
    if (ROLLBACK) {
      if (!fs.existsSync(BACKUP)) { console.log('No backup — nothing to roll back.'); return; }
      const orig = JSON.parse(fs.readFileSync(BACKUP, 'utf8')); let n = 0; const touched = new Set();
      for (const p of allPages) { let dirty = false;
        for (const b of p.blocks || []) { if (b.type !== 'inline_quiz') continue;
          for (const q of b.questions || []) if (orig[q.id]) { q.options = orig[q.id]; n++; dirty = true; } }
        if (dirty) { touched.add(p._id); await savePageBlocks(pages, p._id, p.blocks); } }
      console.log(`Rolled back ${n} questions across ${touched.size} pages.`); return;
    }
    const backup = {}; const dirty = new Map(); let flagged = 0, trimmed = 0; const residual = []; const samples = [];
    for (const p of allPages) {
      for (const b of p.blocks || []) { if (b.type !== 'inline_quiz') continue;
        for (const q of b.questions || []) {
          if (!Array.isArray(q.options) || q.correct_index == null) continue;
          if (!isGiveaway(q.options, q.correct_index)) continue;
          flagged++;
          const orig = q.options.slice(); const ci = q.correct_index;
          const trimmedCorrect = trimCorrect(q.options[ci], q.options, ci);
          if (trimmedCorrect !== q.options[ci]) q.options[ci] = trimmedCorrect;
          if (isGiveaway(q.options, ci)) { residual.push(`Ch${p.chapter_number} ${p.slug}: "${orig[ci]}"`); q.options = orig; continue; }
          trimmed++; backup[q.id] = orig; dirty.set(p._id, p); if (samples.length < 8) samples.push([orig[ci], q.options]);
        }
      }
    }
    console.log(`flagged inline giveaways: ${flagged} | cleared-by-trim: ${trimmed} | residual(left as-is): ${residual.length}`);
    console.log('\nSample fixes:');
    for (const [oc, opts] of samples) { console.log(`  was correct: "${oc}"`); opts.forEach(o => console.log(`     - ${o}`)); console.log(''); }
    if (residual.length) { console.log('RESIDUAL (left untouched, review manually):'); residual.slice(0, 20).forEach(r => console.log('  ', r)); }
    console.log(`\nPages to update: ${dirty.size}`);
    if (!WRITE) { console.log('(dry run — pass --write to apply)'); return; }
    fs.writeFileSync(BACKUP, JSON.stringify(backup), 'utf8');
    for (const [, p] of dirty) await savePageBlocks(pages, p._id, p.blocks);
    console.log(`✅ Applied. Backup at ${BACKUP} (rollback with --rollback).`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
