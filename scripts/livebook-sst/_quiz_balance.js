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
    const pages = await db.collection('book_pages').find({ book_id: BOOK_ID, chapter_number: 1 }).sort({ page_number: 1 }).toArray();
    const positions = { 0: 0, 1: 0, 2: 0, 3: 0 };
    let total = 0;
    for (const p of pages) {
      const quiz = p.blocks.find((b) => b.type === 'inline_quiz');
      for (const q of quiz.questions) {
        positions[q.correct_index]++;
        total++;
        const lens = q.options.map((o) => o.length);
        const maxLen = Math.max(...lens);
        const keyLen = lens[q.correct_index];
        const isLongest = keyLen === maxLen;
        const ratio = keyLen / Math.max(...lens.filter((_, i) => i !== q.correct_index));
        if (isLongest && ratio > 1.3) console.log(`⚠ length-tell risk: ${p.slug} — "${q.question.slice(0,50)}..." keyLen=${keyLen} ratio=${ratio.toFixed(2)}`);
        if (!q.difficulty_level) console.log(`⚠ missing difficulty_level: ${p.slug}`);
      }
    }
    console.log('Position distribution (A/B/C/D):', positions, `total=${total}`);
    console.log('Percentages:', Object.fromEntries(Object.entries(positions).map(([k,v]) => [k, Math.round(v/total*100)+'%'])));
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
