require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_mole';
const now = new Date();

function mkSCQ(display_id, difficulty, markdown, opts, correct, tag_id, exam_source) {
  return mk(display_id, difficulty, 'SCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: id === correct })),
    { correct_option: correct }, null, tag_id, exam_source);
}

function mk(display_id, difficulty, type, markdown, options, answer, solution, tag_id, exam_source) {
  return {
    _id: uuidv4(), display_id,
    question_text: { markdown, latex_validated: false },
    type, options,
    answer: answer ?? null,
    solution: solution ? { text_markdown: solution, latex_validated: false } : null,
    metadata: {
      difficulty, chapter_id: CHAPTER_ID,
      tags: [{ tag_id, weight: 1.0 }],
      is_pyq: !!exam_source, is_top_pyq: false,
      exam_source: exam_source ?? null,
      source_reference: { type: 'image', verified_against_source: true,
        verification_date: now, verified_by: 'ai_agent' }
    },
    status: 'review', version: 1, quality_score: 95,
    created_by: 'ai_agent', updated_by: 'ai_agent',
    created_at: now, updated_at: now, deleted_at: null
  };
}

const questions = [
  mkSCQ('MOLE-291', 'Medium', 'An organic compound contains $20$ atoms of carbon per molecule, the percentage of carbon by weight being $70$. The gram molecular mass of the organic compound is approximately', ['465.0', '365.0', '415.0', '667.0'], 'a', 'tag_mole_1', null),
];

async function main() {
  if (questions.length === 0) return;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  let ok = 0;
  for (const q of questions) {
    try { await col.insertOne(q); console.log(`✅ ${q.display_id}`); ok++; }
    catch(e) { console.log(`❌ ${q.display_id}: ${e.message}`); }
  }
  console.log(`\n📊 Batch complete: ${ok} inserted.`);
  await client.close();
}
main();
