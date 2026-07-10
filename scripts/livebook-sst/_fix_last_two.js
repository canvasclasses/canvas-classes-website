'use strict';
const bw = require('../lib/book-writer');

const EDITS = [
  {
    slug: 'geography-the-study-of-place',
    qIndex: 2,
    optIndex: 0,
    newText: 'A long coastline on its own automatically makes any country wealthy and globally important, regardless of anything else happening around it or its history',
  },
  {
    slug: 'why-social-science-matters',
    qIndex: 1,
    optIndex: 2,
    newText: 'None of these disciplines really apply here — this is just a random collection of local trivia with no systematic explanation behind any part of it',
  },
];

async function main() {
  await bw.withDb(async (db) => {
    for (const { slug, qIndex, optIndex, newText } of EDITS) {
      const page = await db.collection('book_pages').findOne({ book_id: 'a60d142c-c96b-48cc-ba72-e68d71d83802', slug });
      const quizIdx = page.blocks.findIndex((b) => b.type === 'inline_quiz');
      const quiz = page.blocks[quizIdx];
      quiz.questions[qIndex].options[optIndex] = newText;
      const newBlocks = page.blocks.map((b, i) => (i === quizIdx ? quiz : b));
      const res = await bw.savePage(db, { slug }, newBlocks, {
        author: 'agent',
        summary: `Lengthened Q${qIndex + 1} option ${optIndex} to close a borderline length-tell ratio (§3.6.1)`,
      });
      console.log(`✓ ${slug} Q${qIndex + 1} opt${optIndex} — updated (v${res.version})`);
    }
  });
}
main().catch((e) => { console.error('❌', e); process.exit(1); });
