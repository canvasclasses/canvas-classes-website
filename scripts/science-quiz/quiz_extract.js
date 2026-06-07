'use strict';
/**
 * Dump every inline_quiz question of one science chapter to an editable JSON,
 * so the distractors can be rewritten to BOOK_PAGE_WORKFLOW.md §3.6.1.
 * Match-back key is (page_slug, block_id, q_id), so re-importing is exact.
 *
 *   node scripts/science-quiz/quiz_extract.js <ch>
 * Writes scripts/science-quiz/_ch<ch>_quiz.json
 */
const fs = require('fs');
const { withBook } = require('../science-practice/_lib');

const ch = Number(process.argv[2]);
if (!ch) { console.error('Usage: node quiz_extract.js <ch>'); process.exit(1); }

(async () => {
  await withBook(async ({ allPages }) => {
    const items = [];
    for (const p of allPages.filter((p) => p.chapter_number === ch).sort((a, b) => a.page_number - b.page_number)) {
      for (const b of p.blocks || []) {
        if (b.type !== 'inline_quiz') continue;
        (b.questions || []).forEach((q, qi) => {
          items.push({
            page_slug: p.slug, page_title: p.title, block_id: b.id, q_id: q.id, q_index: qi,
            question: q.question, options: q.options, correct_index: q.correct_index,
            explanation: q.explanation || '', difficulty_level: q.difficulty_level ?? null,
          });
        });
      }
    }
    const out = `scripts/science-quiz/_ch${ch}_quiz.json`;
    fs.writeFileSync(out, JSON.stringify({ chapter: ch, items }, null, 2) + '\n');
    console.log(`Extracted ${items.length} inline_quiz questions from ch${ch} -> ${out}`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
