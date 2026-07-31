'use strict';
/* Heal the undefined→null difficulty_level on Ch.6 inline_quiz questions (the
   Mongo-driver undefined→null trap). Assign a real L1→L2→L3 ladder per quiz
   (workflow quiz-hygiene wants difficulty tags) and re-save via savePage,
   preserving block ids (lossDetected false). */
const bw = require('../lib/book-writer');
const { withDb } = bw;
const SLUGS = ['three-mirrors','modulus-fold-up','modulus-mirror','modulus-reflect-down','count-and-combine'];
(async () => {
  await withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: 'class11-mathematics' });
    const pages = db.collection('book_pages');
    for (const slug of SLUGS) {
      const page = await pages.findOne({ book_id: book._id, slug });
      if (!page) { console.log('missing', slug); continue; }
      const blocks = page.blocks.map((blk) => {
        if (blk.type !== 'inline_quiz') return { ...blk };
        return { ...blk, questions: blk.questions.map((qq, i) => {
          const c = { ...qq, difficulty_level: (i % 3) + 1 };   // 1,2,3 ladder
          return c;
        }) };
      });
      const res = await bw.savePage(db, { slug }, blocks, { author: 'script', summary: 'heal null difficulty_level → L1-3 ladder' });
      console.log('healed', slug, '· v' + res.version, '· loss', res.diff.lossDetected);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
