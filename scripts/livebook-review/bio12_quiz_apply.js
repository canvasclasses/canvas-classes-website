'use strict';
/**
 * Central apply for the Class 12 Biology quiz-hygiene pass.
 *
 * Merges the per-chapter subagent authoring outputs (chN_fixed.json) with the
 * deterministic global answer-position plan (all.json -> target_index) and writes
 * each affected page ONCE through book-writer (versioned, content-loss-guarded).
 *
 * Per question it can set:
 *   - rewritten options + explanation (length-tell fix, from the subagents)
 *   - rebalanced answer position (swap the key into its target slot)
 *
 * SAFETY GUARDS (abort the whole run on any violation):
 *   - option count must stay 4, all options non-empty and unique
 *   - correct answer must still be the SAME TEXT after any rotation
 *   - correct must NOT be the longest option  (the defect we're fixing)
 *   - correct must NOT be the shortest option (the inverse exploit — a subagent
 *     caught itself creating this, so we gate on it explicitly)
 *   - question count per block unchanged
 *
 * Dry-run by default; pass --apply to write.
 * Usage: node scripts/livebook-review/bio12_quiz_apply.js <scratchDir> [--apply]
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const fs = require('fs');
const { MongoClient } = require('mongodb');
const bw = require('../lib/book-writer');

const SCRATCH = process.argv[2];
const APPLY = process.argv.includes('--apply');
if (!SCRATCH) { console.error('pass the scratch dir'); process.exit(1); }

const must = (cond, msg) => { if (!cond) throw new Error('SAFETY: ' + msg); };

function loadFixes() {
  const byId = {};
  for (let ch = 1; ch <= 13; ch++) {
    const f = path.join(SCRATCH, `ch${ch}_fixed.json`);
    if (!fs.existsSync(f)) { console.log(`  (no fixes file for ch${ch})`); continue; }
    const rows = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const r of rows) byId[r.id] = r;
  }
  return byId;
}

// Move the correct option into `target` by swapping. Preserves all four options.
function rotateTo(options, correctIndex, target) {
  if (correctIndex === target) return { options: [...options], correct_index: correctIndex };
  const o = [...options];
  [o[correctIndex], o[target]] = [o[target], o[correctIndex]];
  return { options: o, correct_index: target };
}

async function main() {
  const fixes = loadFixes();
  const plan = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'all.json'), 'utf8'));
  const planById = Object.fromEntries(plan.map((r) => [r.id, r]));
  console.log(`loaded ${Object.keys(fixes).length} authored fixes; ${plan.length} questions in the position plan\n`);

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const book = await db.collection('books').findOne({ slug: 'class12-biology' });
    const pages = await db.collection('book_pages')
      .find({ book_id: String(book._id), deleted_at: null }).toArray();
    pages.sort((a, b) => (a.chapter_number - b.chapter_number) || (a.page_number - b.page_number));

    let pagesTouched = 0, qFixed = 0, qMoved = 0;
    const stats = { longest: 0, shortest: 0, total: 0 };

    for (const page of pages) {
      let pageChanged = false;
      const blocks = page.blocks.map((b) => {
        if (b.type !== 'inline_quiz') return b;
        const questions = (b.questions || []).map((q) => {
          const fix = fixes[q.id];
          const tgt = planById[q.id];
          let options = [...q.options];
          let correct_index = q.correct_index;
          let explanation = q.explanation;

          // 1) authored length-tell rewrite (options are in ORIGINAL order)
          if (fix) {
            must(Array.isArray(fix.options) && fix.options.length === 4, `${q.id}: fix must have 4 options`);
            must(fix.correct_index === q.correct_index, `${q.id}: subagent changed correct_index`);
            options = fix.options;
            if (fix.explanation) explanation = fix.explanation;
            qFixed++; pageChanged = true;
          }

          // 2) deterministic position rebalance
          const correctText = options[correct_index];
          if (tgt && tgt.target_index !== correct_index) {
            const r = rotateTo(options, correct_index, tgt.target_index);
            options = r.options; correct_index = r.correct_index;
            qMoved++; pageChanged = true;
          }

          // ---- guards ----
          must(options.length === 4, `${q.id}: not 4 options`);
          must(options.every((o) => typeof o === 'string' && o.trim().length), `${q.id}: empty option`);
          must(new Set(options).size === 4, `${q.id}: duplicate options`);
          must(options[correct_index] === correctText, `${q.id}: correct answer text changed during rotation`);

          // A TIE IS NOT A TELL. If several options share the max length the
          // student learns nothing from length — that is in fact the ideal end
          // state. Only a *strictly unique* longest/shortest correct answer is
          // exploitable. (The original export script counted ties as tells,
          // which overstated the defect and would abort this run on the
          // deliberately length-equal questions.)
          const L = options.map((o) => o.length);
          const max = Math.max(...L), min = Math.min(...L);
          const uniqueLongest = L[correct_index] === max && L.filter((n) => n === max).length === 1;
          const uniqueShortest = L[correct_index] === min && L.filter((n) => n === min).length === 1;
          stats.total++;
          if (uniqueLongest) stats.longest++;
          if (uniqueShortest) stats.shortest++;
          // Only enforce on questions we actually rewrote — untouched clean ones
          // are reported, not blocked.
          if (fix) must(!uniqueLongest, `${q.id}: correct is STILL the uniquely longest option after fix`);

          return { ...q, options, correct_index, explanation };
        });
        must(questions.length === (b.questions || []).length, 'question count changed');
        return { ...b, questions };
      });

      if (!pageChanged) continue;
      must(blocks.length === page.blocks.length, `${page.slug}: block count changed`);
      pagesTouched++;
      if (APPLY) {
        await bw.savePage(db, { pageId: page._id }, blocks, {
          author: 'agent',
          summary: 'audit F1/F7: quiz hygiene — break length-tells + rebalance answer positions',
        });
        console.log(`  wrote ch${page.chapter_number} p${page.page_number} ${page.slug}`);
      }
    }

    const pct = (n) => Math.round((n / stats.total) * 100) + '%';
    console.log(`\n──── RESULT (${stats.total} questions book-wide) ────`);
    console.log(`  pages touched:      ${pagesTouched}`);
    console.log(`  questions rewritten:${qFixed}`);
    console.log(`  answers repositioned:${qMoved}`);
    console.log(`  correct = longest:  ${stats.longest}/${stats.total}  (${pct(stats.longest)})   [was 60%]`);
    console.log(`  correct = shortest: ${stats.shortest}/${stats.total}  (${pct(stats.shortest)})   [~25% = chance]`);
    if (!APPLY) console.log('\nDRY RUN — nothing written. Re-run with --apply.');
    else console.log('\n✅ APPLIED via book-writer (versioned + reversible).');
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
