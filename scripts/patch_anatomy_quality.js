'use strict';
/**
 * Quality patch for the Anatomy & Physiology / Skeletal System pages already in the
 * DB: fixes two typos and spreads each inline_quiz's correct-answer positions across
 * A/B/C/D (§3.6.1 — no clustering). Mutates blocks IN PLACE (block + question ids
 * preserved) and saves through book-writer.savePage, so the content-loss guard passes.
 */
const bw = require('./lib/book-writer');

// Move quiz question `qi`'s correct answer to position `target` by swapping options
// (preserves all option texts, the question id, and the content-based explanation).
function setPos(quiz, qi, target) {
  const q = quiz.questions[qi];
  const c = q.correct_index;
  if (c === target) return;
  [q.options[c], q.options[target]] = [q.options[target], q.options[c]];
  q.correct_index = target;
}
const firstQuiz = (blocks) => blocks.find((b) => b.type === 'inline_quiz');
function replaceInBlocks(blocks, oldStr, newStr) {
  for (const b of blocks) {
    if (typeof b.markdown === 'string' && b.markdown.includes(oldStr)) b.markdown = b.markdown.replace(oldStr, newStr);
  }
}

// page slug -> mutate(blocks)
const OPS = {
  'what-your-skeleton-does': (bl) => { const q = firstQuiz(bl); setPos(q, 0, 0); setPos(q, 1, 2); setPos(q, 2, 1); },
  'inside-a-bone': (bl) => { replaceInBlocks(bl, 'a almost-new', 'an almost-new'); const q = firstQuiz(bl); setPos(q, 0, 1); setPos(q, 1, 2); setPos(q, 2, 0); },
  'the-chemistry-of-bone': (bl) => { replaceInBlocks(bl, 'hydroxeapatite', 'hydroxyapatite'); const q = firstQuiz(bl); setPos(q, 0, 1); setPos(q, 1, 0); setPos(q, 2, 2); },
  'axial-and-appendicular': (bl) => { const q = firstQuiz(bl); setPos(q, 0, 1); setPos(q, 1, 3); setPos(q, 2, 0); },
  'joints-where-bones-meet': (bl) => { const q = firstQuiz(bl); setPos(q, 0, 1); setPos(q, 1, 3); setPos(q, 2, 2); },
};

(async () => {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    for (const [slug, mutate] of Object.entries(OPS)) {
      const page = await pages.findOne({ slug });
      if (!page) { console.log('not found:', slug); continue; }
      const blocks = page.blocks;
      mutate(blocks);
      const r = await bw.savePage(db, { slug }, blocks, { author: 'agent', summary: 'fix typos + spread quiz answer positions (§3.6.1)' });
      const q = firstQuiz(blocks);
      console.log('patched:', slug, '· quiz positions:', q ? q.questions.map((x) => 'ABCD'[x.correct_index]).join('') : '(no quiz)', '· v' + r.version);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
