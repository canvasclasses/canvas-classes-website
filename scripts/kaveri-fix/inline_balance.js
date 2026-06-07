'use strict';
/**
 * Balance the CORRECT-answer position across all inline_quiz questions in the
 * Kaveri book, per chapter — closing the "always pick B" hole in the reading-page
 * quizzes (the same fix balance_positions.js applies to the practice banks).
 *
 * Reorders each question's 4 options so correct_index follows a fixed, non-obvious
 * pattern across the chapter's questions (in page → block → question order). Option
 * TEXT is never changed. Writes a one-time backup of the ORIGINAL order so the
 * change is fully reversible.
 *
 *   node scripts/kaveri-fix/inline_balance.js [all|<ch>] [--write|--rollback]
 *   (no flag = dry run / preview)
 *
 * Pre-checked safe for Kaveri: every inline_quiz question has exactly 4 options,
 * a stable id, and no explanation that names an option position.
 */
const fs = require('fs');
const { withBook, savePageBlocks } = require('./_lib');

const arg = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'all';
const onlyCh = arg !== 'all' ? Number(arg) : null;
const WRITE = process.argv.includes('--write');
const ROLLBACK = process.argv.includes('--rollback');
const BACKUP = 'scripts/kaveri-fix/_inline_balance_backup.json';
const PAT = [1, 3, 0, 2, 2, 0, 3, 1];
const POS = ['A', 'B', 'C', 'D'];
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);

(async () => {
  await withBook(async ({ pages, allPages }) => {
    // ── Rollback ────────────────────────────────────────────────────────────
    if (ROLLBACK) {
      if (!fs.existsSync(BACKUP)) { console.log('No backup file — nothing to roll back.'); return; }
      const orig = JSON.parse(fs.readFileSync(BACKUP, 'utf8')); // { qid: {options, correct_index} }
      let restored = 0; const touched = new Set();
      for (const p of allPages) {
        let dirty = false;
        for (const b of p.blocks || []) {
          if (b.type !== 'inline_quiz') continue;
          for (const q of b.questions || []) {
            if (orig[q.id]) { q.options = orig[q.id].options; q.correct_index = orig[q.id].correct_index; restored++; dirty = true; }
          }
        }
        if (dirty) { touched.add(p._id); await savePageBlocks(pages, p._id, p.blocks); }
      }
      console.log(`Rolled back ${restored} questions across ${touched.size} pages.`);
      return;
    }

    // ── Balance ─────────────────────────────────────────────────────────────
    const backup = fs.existsSync(BACKUP) ? JSON.parse(fs.readFileSync(BACKUP, 'utf8')) : {};
    const byCh = {};
    const dirtyPages = new Map();
    const chOrder = [...allPages].sort((a, b) => (a.chapter_number - b.chapter_number) || (a.page_number - b.page_number));

    const perChIdx = {};
    for (const p of chOrder) {
      const ch = p.chapter_number;
      if (onlyCh && ch !== onlyCh) continue;
      for (const b of p.blocks || []) {
        if (b.type !== 'inline_quiz') continue;
        for (const q of b.questions || []) {
          if (!Array.isArray(q.options) || q.options.length !== 4) continue;
          byCh[ch] = byCh[ch] || { before: [0, 0, 0, 0], after: [0, 0, 0, 0], n: 0 };
          byCh[ch].before[q.correct_index]++;
          perChIdx[ch] = (perChIdx[ch] || 0);
          const target = PAT[perChIdx[ch] % PAT.length] % 4;
          perChIdx[ch]++;
          byCh[ch].n++;
          byCh[ch].after[target]++;
          if (q.correct_index !== target) {
            if (backup[q.id] === undefined) backup[q.id] = { options: q.options.slice(), correct_index: q.correct_index };
            const correct = q.options[q.correct_index];
            const distractors = q.options.filter((_, k) => k !== q.correct_index);
            const opts = []; let di = 0;
            for (let pos = 0; pos < 4; pos++) opts.push(pos === target ? correct : distractors[di++]);
            q.options = opts; q.correct_index = target;
            dirtyPages.set(p._id, p);
          }
        }
      }
    }

    for (const ch of Object.keys(byCh).sort((a, b) => a - b)) {
      const c = byCh[ch];
      console.log(`Ch${ch}: ${c.n} inline questions | before A/B/C/D ${c.before.join('/')} → after ${c.after.join('/')}`);
    }
    console.log(`\nPages to update: ${dirtyPages.size}`);

    if (!WRITE) { console.log('(dry run — pass --write to apply)'); return; }
    if (!fs.existsSync(BACKUP)) fs.writeFileSync(BACKUP, JSON.stringify(backup, null, 0), 'utf8');
    else fs.writeFileSync(BACKUP, JSON.stringify(backup, null, 0), 'utf8'); // merge: keep originals, add any new
    for (const [, p] of dirtyPages) await savePageBlocks(pages, p._id, p.blocks);
    console.log(`✅ Applied. Backup at ${BACKUP} (rollback with --rollback).`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
