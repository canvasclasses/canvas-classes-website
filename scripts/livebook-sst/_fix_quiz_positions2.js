'use strict';
// Second pass: position B (index 1) was still 41% (11/27), just over the ≤40% cap.
// Move 4 questions from index 1 -> index 3 by rotating [opt0, opt2, opt3, opt1].
// No text changes — pure reorder, so no length-tell risk introduced.
const bw = require('../lib/book-writer');

const TARGETS = [
  { slug: 'geography-the-study-of-place', qIndex: 0 }, // Q1
  { slug: 'geography-the-study-of-place', qIndex: 2 }, // Q3
  { slug: 'history-the-study-of-the-past', qIndex: 0 }, // Q1
  { slug: 'history-the-study-of-the-past', qIndex: 1 }, // Q2
];

async function main() {
  await bw.withDb(async (db) => {
    for (const { slug, qIndex } of TARGETS) {
      const page = await db.collection('book_pages').findOne({ book_id: 'a60d142c-c96b-48cc-ba72-e68d71d83802', slug });
      const quizIdx = page.blocks.findIndex((b) => b.type === 'inline_quiz');
      const quiz = page.blocks[quizIdx];
      const q = quiz.questions[qIndex];
      if (q.correct_index !== 1) throw new Error(`${slug} Q${qIndex + 1} is not at index 1 (got ${q.correct_index}) — aborting`);
      const [o0, o1, o2, o3] = q.options;
      q.options = [o0, o2, o3, o1];
      q.correct_index = 3;
      const newBlocks = page.blocks.map((b, i) => (i === quizIdx ? quiz : b));
      const res = await bw.savePage(db, { slug }, newBlocks, {
        author: 'agent',
        summary: `Rotated Q${qIndex + 1} options to move correct answer from position B to D (position-balance pass 2)`,
      });
      console.log(`✓ ${slug} Q${qIndex + 1} — moved to index 3 (v${res.version})`);
    }
  });
}
main().catch((e) => { console.error('❌', e); process.exit(1); });
