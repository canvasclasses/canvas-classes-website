'use strict';
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  await bw.withDb(async (db) => {
    // 1. Fix stale `order` fields on rivers-waterfalls-meanders-and-deltas (callout insert didn't reindex).
    {
      const slug = 'rivers-waterfalls-meanders-and-deltas';
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      const newBlocks = page.blocks.map((b, i) => ({ ...b, order: i }));
      const res = await bw.savePage(db, { slug }, newBlocks, { author: 'agent', summary: 'Reindexed block order after callout insert' });
      console.log(`✓ ${slug} — order reindexed (v${res.version})`);
    }
    // 2. Lengthen 2 remaining length-tell distractors missed in the first pass.
    {
      const slug = 'wind-landforms-deserts-dunes-and-oases';
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      const quizIdx = page.blocks.findIndex((b) => b.type === 'inline_quiz');
      const quiz = page.blocks[quizIdx];
      const q = quiz.questions[2];
      q.options[0] = "The hollow immediately turns into a yardang instead, without any further wind action needed";
      q.options[1] = "Nothing changes at all, since deflation hollows have no real connection to underground groundwater";
      q.options[3] = "The hollow becomes a permanent sea, since desert groundwater is treated as an unlimited resource";
      const newBlocks = page.blocks.map((b, i) => (i === quizIdx ? quiz : b));
      const res = await bw.savePage(db, { slug }, newBlocks, { author: 'agent', summary: 'Lengthened remaining length-tell distractors (Q3)' });
      console.log(`✓ ${slug} — Q3 fixed (v${res.version})`);
    }
    {
      const slug = 'underground-water-caves-and-karst-landscapes';
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      const quizIdx = page.blocks.findIndex((b) => b.type === 'inline_quiz');
      const quiz = page.blocks[quizIdx];
      const q = quiz.questions[1];
      q.options[1] = "A sinkhole, formed when the ground above suddenly collapses into an underground cavity";
      q.options[2] = "A moraine, formed by rock and debris deposited by a retreating glacier";
      q.options[3] = "An underground river, formed by water flowing steadily through a cave system";
      const newBlocks = page.blocks.map((b, i) => (i === quizIdx ? quiz : b));
      const res = await bw.savePage(db, { slug }, newBlocks, { author: 'agent', summary: 'Lengthened remaining length-tell distractors (Q2)' });
      console.log(`✓ ${slug} — Q2 fixed (v${res.version})`);
    }
  });
}
main().catch((e) => { console.error('❌', e); process.exit(1); });
