'use strict';
/**
 * Apply rewritten quiz options for one chapter.
 *   node scripts/kaveri-fix/quiz_apply.js <chapter> [--dry]
 * Reads scripts/kaveri-fix/_ch<N>_fix.json:
 *   [{ question_id, options:[4 strings], correct_index, difficulty_level (1|2|3), explanation? }]
 * Only inline_quiz questions whose id matches are touched. Everything else is preserved.
 */
const fs = require('fs');
const { withBook, savePageBlocks } = require('./_lib');

const ch = Number(process.argv[2]);
const DRY = process.argv.includes('--dry');
if (!ch) { console.error('usage: quiz_apply.js <chapter> [--dry]'); process.exit(1); }

const fixFile = `scripts/kaveri-fix/_ch${ch}_fix.json`;
const fixes = JSON.parse(fs.readFileSync(fixFile, 'utf8'));
const fixById = new Map();
for (const f of fixes) {
  if (!Array.isArray(f.options) || f.options.length !== 4) throw new Error(`${f.question_id}: need exactly 4 options`);
  if (f.options.some((o) => typeof o !== 'string' || !o.trim())) throw new Error(`${f.question_id}: empty option`);
  if (![0, 1, 2, 3].includes(f.correct_index)) throw new Error(`${f.question_id}: bad correct_index`);
  if (![1, 2, 3].includes(f.difficulty_level)) throw new Error(`${f.question_id}: difficulty_level must be 1|2|3`);
  fixById.set(f.question_id, f);
}

(async () => {
  await withBook(async ({ pages, allPages }) => {
    const chPages = allPages.filter((p) => p.chapter_number === ch);
    let touchedQs = 0, touchedPages = 0;
    const matched = new Set();
    for (const p of chPages) {
      let dirty = false;
      for (const b of p.blocks || []) {
        if (b.type !== 'inline_quiz') continue;
        for (const q of b.questions || []) {
          const f = fixById.get(q.id);
          if (!f) continue;
          q.options = f.options;
          q.correct_index = f.correct_index;
          q.difficulty_level = f.difficulty_level;
          if (f.question && f.question.trim()) q.question = f.question;
          if (f.explanation && f.explanation.trim()) q.explanation = f.explanation;
          matched.add(q.id);
          touchedQs++;
          dirty = true;
        }
      }
      if (dirty) {
        touchedPages++;
        if (!DRY) await savePageBlocks(pages, p._id, p.blocks);
      }
    }
    const unmatched = fixes.filter((f) => !matched.has(f.question_id)).map((f) => f.question_id);
    console.log(`Ch${ch}: ${DRY ? '[DRY] would update' : 'updated'} ${touchedQs} questions across ${touchedPages} pages.`);
    if (unmatched.length) console.log(`  ⚠ ${unmatched.length} fix ids not found in DB:`, unmatched.slice(0, 10));
  });
})().catch((e) => { console.error(e); process.exit(1); });
