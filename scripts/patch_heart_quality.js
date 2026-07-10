'use strict';
// Spread the correct-answer positions on the two heart quizzes that clustered (§3.6.1).
const bw = require('./lib/book-writer');
function setPos(quiz, qi, target) {
  const q = quiz.questions[qi]; const c = q.correct_index;
  if (c === target) return;
  [q.options[c], q.options[target]] = [q.options[target], q.options[c]];
  q.correct_index = target;
}
const firstQuiz = (bl) => bl.find((b) => b.type === 'inline_quiz');
const OPS = {
  'follow-a-drop-of-blood': (bl) => { const q = firstQuiz(bl); setPos(q, 0, 1); setPos(q, 1, 0); setPos(q, 2, 2); }, // B,A,C
  'blood-vessels': (bl) => { const q = firstQuiz(bl); setPos(q, 0, 1); setPos(q, 1, 0); setPos(q, 2, 2); },        // B,A,C
};
(async () => {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    for (const [slug, mutate] of Object.entries(OPS)) {
      const page = await pages.findOne({ slug });
      if (!page) { console.log('not found:', slug); continue; }
      mutate(page.blocks);
      const r = await bw.savePage(db, { slug }, page.blocks, { author: 'agent', summary: 'spread quiz answer positions (§3.6.1)' });
      const q = firstQuiz(page.blocks);
      console.log('patched:', slug, '·', q.questions.map((x) => 'ABCD'[x.correct_index]).join(''), '· v' + r.version);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
