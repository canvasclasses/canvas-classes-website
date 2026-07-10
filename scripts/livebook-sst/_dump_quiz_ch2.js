'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const pages = await db.collection('book_pages').find({ book_id: BOOK_ID, chapter_number: 2 }).sort({ page_number: 1 }).toArray();
    for (const p of pages) {
      const quiz = p.blocks.find((b) => b.type === 'inline_quiz');
      console.log(`\n=== ${p.slug} ===`);
      quiz.questions.forEach((q, i) => {
        console.log(`Q${i+1} (correct_index=${q.correct_index}):`);
        q.options.forEach((o, j) => console.log(`  [${j}]${j===q.correct_index?'*':' '} (${o.length}) ${o}`));
      });
    }
  } finally { await client.close(); }
}
main();
