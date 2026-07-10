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
    for (const slug of ['geography-the-study-of-place', 'why-social-science-matters']) {
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      const quiz = page.blocks.find((b) => b.type === 'inline_quiz');
      quiz.questions.forEach((q, i) => {
        console.log(`\n${slug} Q${i+1} (correct_index=${q.correct_index}):`);
        q.options.forEach((o, j) => console.log(`  [${j}] (${o.length}) ${o}`));
      });
    }
  } finally { await client.close(); }
}
main();
