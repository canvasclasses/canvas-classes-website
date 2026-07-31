'use strict';
/* Rebalance the correct-answer POSITION across every graded MCQ in Ch.6
   "Transforming Graphs" — the first build clustered 14/23 answers at position B
   (a textbook position-tell, see feedback_mcq_answer_position_spread). Fix in
   place: rotate each question's options so the correct answer lands on a target
   position cycling A→B→C→D. Option TEXT + explanations are unchanged (they never
   reference a position), block ids are preserved, so book-writer.savePage sees
   zero content loss. Run: node scripts/math11-book/rebalance_ch6_quiz_positions.js */
const bw = require('../lib/book-writer');
const { withDb } = bw;

const SLUGS = [
  'transforming-graphs-opener', 'three-mirrors', 'modulus-fold-up', 'modulus-mirror',
  'modulus-reflect-down', 'count-and-combine', 'transforming-graphs-practice',
];

function rotateTo(options, correctIdx, target) {
  const n = options.length;
  const t = ((target % n) + n) % n;
  const shift = ((correctIdx - t) % n + n) % n;   // left-rotate by shift → correct lands at t
  const rot = options.slice(shift).concat(options.slice(0, shift));
  return { options: rot, correct_index: t };
}

(async () => {
  await withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: 'class11-mathematics' });
    const pages = db.collection('book_pages');
    let counter = 0;
    const tally = [0, 0, 0, 0];

    for (const slug of SLUGS) {
      const page = await pages.findOne({ book_id: book._id, slug });
      if (!page) { console.log('  missing:', slug); continue; }
      const blocks = page.blocks.map((blk) => ({ ...blk }));
      let touched = false;

      for (const blk of blocks) {
        if (blk.type === 'inline_quiz' && Array.isArray(blk.questions)) {
          blk.questions = blk.questions.map((qq) => {
            const r = rotateTo(qq.options, qq.correct_index, counter++);
            tally[r.correct_index]++; touched = true;
            return { ...qq, options: r.options, correct_index: r.correct_index };
          });
        }
        if (blk.type === 'practice_bank' && Array.isArray(blk.sections)) {
          blk.sections = blk.sections.map((s) => ({
            ...s,
            items: s.items.map((it) => {
              if (it.kind !== 'mcq') return it;
              const r = rotateTo(it.options, it.correct_index, counter++);
              tally[r.correct_index]++; touched = true;
              return { ...it, options: r.options, correct_index: r.correct_index };
            }),
          }));
        }
      }

      if (touched) {
        const res = await bw.savePage(db, { slug }, blocks, { author: 'script', summary: 'rebalance quiz answer positions (in place, ids preserved)' });
        console.log('  rebalanced', slug, '· version', res.version, '· lossDetected', res.diff.lossDetected);
      } else {
        console.log('  no graded MCQs on', slug);
      }
    }
    console.log('Final correct_index spread [A,B,C,D]:', tally, '· total', tally.reduce((a, c) => a + c, 0));
  });
})().catch((e) => { console.error(e); process.exit(1); });
