// Template script for inserting mathematics questions
// Copy this file and modify the CHAPTER constants and questions array

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// ═══════════════════════════════════════════════════════════════
// CHAPTER CONFIGURATION - MODIFY THESE FOR YOUR BATCH
// ═══════════════════════════════════════════════════════════════
const CHAPTER_ID = 'ma_matrices';      // Chapter ID (ma_* format)
const PREFIX = 'MATR';                   // 4-char display_id prefix
const TAG_ID = 'tag_ma_matrices';       // Tag ID (tag_ma_* format)
// ═══════════════════════════════════════════════════════════════

const now = new Date();

function mk(display_id, difficultyLevel, type, markdown, options, answer, solution, examBoard, sourceType, examDetails, questionNature = 'Rule_Application') {
  return {
    _id: uuidv4(), display_id,
    question_text: { markdown, latex_validated: false },
    type, options, answer: answer ?? null,
    solution: solution ? { text_markdown: solution, latex_validated: false } : null,
    metadata: {
      difficultyLevel,
      chapter_id: CHAPTER_ID,
      subject: 'maths',
      tags: [{ tag_id: TAG_ID, weight: 1.0 }],
      examBoard: examBoard ?? null,
      sourceType: sourceType ?? null,
      examDetails: examDetails ?? null,
      questionNature: questionNature,
      microConcept: null,
      isMultiConcept: false,
      // Legacy fields (auto-populated)
      is_pyq: sourceType === 'PYQ',
      is_top_pyq: false,
      exam_source: examDetails ? {
        exam: examDetails.exam === 'JEE_Main' ? 'JEE Main' : 
              examDetails.exam === 'JEE_Advanced' ? 'JEE Advanced' :
              examDetails.exam === 'NEET_UG' ? 'NEET' : examDetails.exam,
        year: examDetails.year,
        month: examDetails.month ?? null,
        shift: examDetails.shift ?? null
      } : null,
      source_reference: { 
        type: 'image', verified_against_source: true,
        verification_date: now, verified_by: 'ai_agent' 
      }
    },
    status: 'review', version: 1, quality_score: 95,
    created_by: 'ai_agent', updated_by: 'ai_agent',
    created_at: now, updated_at: now, deleted_at: null
  };
}

function mkSCQ(display_id, difficultyLevel, markdown, opts, correct, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'SCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: id === correct })),
    { correct_option: correct }, null, examBoard, sourceType, examDetails, questionNature);
}

function mkMCQ(display_id, difficultyLevel, markdown, opts, correctArr, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'MCQ', markdown,
    ['a','b','c','d'].map((id,i) => ({ id, text: opts[i], is_correct: correctArr.includes(id) })),
    { correct_options: correctArr }, null, examBoard, sourceType, examDetails, questionNature);
}

function mkNVT(display_id, difficultyLevel, markdown, answer_val, examBoard, sourceType, examDetails, questionNature) {
  return mk(display_id, difficultyLevel, 'NVT', markdown, [],
    { integer_value: answer_val }, null, examBoard, sourceType, examDetails, questionNature);
}

// ═══════════════════════════════════════════════════════════════
// QUESTIONS - ADD YOUR EXTRACTED QUESTIONS HERE (6-8 per batch)
// ═══════════════════════════════════════════════════════════════
const questions = [
  // Example 1: JEE Main PYQ (replace with actual questions)
  // mkSCQ('MATR-001', 4,
  //   'If $A$ is a $3 \\times 3$ matrix such that $\\det(A) = 5$, then $\\det(2A)$ is equal to:',
  //   ['$10$', '$40$', '$80$', '$125$'],
  //   'c',
  //   'JEE',
  //   'PYQ',
  //   { exam: 'JEE_Main', year: 2024, shift: 'Morning' },
  //   'Rule_Application'
  // ),
  
  // Example 2: JEE Advanced PYQ
  // mkSCQ('MATR-002', 5,
  //   'Let $P$ be a matrix such that $P^2 = I$. Then which of the following is true?',
  //   ['Option A', 'Option B', 'Option C', 'Option D'],
  //   'a',
  //   'JEE',
  //   'PYQ',
  //   { exam: 'JEE_Advanced', year: 2024, paper: 'Paper 1' },
  //   'Synthesis'
  // ),
  
  // Example 3: Practice NVT
  // mkNVT('MATR-003', 3,
  //   'Find the trace of the matrix $\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{pmatrix}$',
  //   15,
  //   'JEE',
  //   'Practice',
  //   null,
  //   'Recall'
  // ),
];

// ═══════════════════════════════════════════════════════════════
// INSERTION LOGIC - DO NOT MODIFY BELOW THIS LINE
// ═══════════════════════════════════════════════════════════════
async function main() {
  if (questions.length === 0) { 
    console.log('❌ No questions defined. Please add questions to the array above.'); 
    return; 
  }

  console.log(`📦 Preparing to insert ${questions.length} questions...`);
  console.log(`📁 Chapter: ${CHAPTER_ID}`);
  console.log(`🏷️  Prefix: ${PREFIX}`);
  console.log(`🏷️  Tag: ${TAG_ID}`);

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  // Duplicate check
  const ids = questions.map(q => q.display_id);
  const existing = await col.find({ display_id: { $in: ids } }).toArray();
  if (existing.length > 0) {
    console.log('❌ Duplicate IDs found — aborting:', existing.map(e => e.display_id));
    await client.close(); 
    return;
  }

  // Validation
  const errors = [];
  for (const q of questions) {
    if (!q.metadata?.examBoard && q.metadata?.sourceType !== 'Practice') errors.push(`${q.display_id}: examBoard required`);
    if (!q.metadata?.sourceType) errors.push(`${q.display_id}: sourceType required`);
    if (!q.metadata?.difficultyLevel || q.metadata.difficultyLevel < 1 || q.metadata.difficultyLevel > 5) errors.push(`${q.display_id}: difficultyLevel must be 1-5`);
    if (!q.metadata?.questionNature) errors.push(`${q.display_id}: questionNature required`);
    if (q.metadata?.sourceType === 'PYQ' && !q.metadata?.examDetails) errors.push(`${q.display_id}: examDetails required for PYQ`);
    if (['SCQ','MCQ','AR','MST','MTC'].includes(q.type) && q.options.length !== 4) errors.push(`${q.display_id}: needs 4 options`);
    if (q.type === 'SCQ' && q.options.filter(o => o.is_correct).length !== 1) errors.push(`${q.display_id}: SCQ needs 1 correct`);
    if (q.metadata.chapter_id !== CHAPTER_ID) errors.push(`${q.display_id}: wrong chapter_id`);
    if (!q.display_id?.startsWith(PREFIX)) errors.push(`${q.display_id}: must start with ${PREFIX}`);
  }
  
  if (errors.length > 0) { 
    console.log('❌ Validation failed:\n' + errors.join('\n')); 
    await client.close(); 
    return; 
  }

  // Insert
  let ok = 0, fail = 0;
  for (const doc of questions) {
    try { 
      await col.insertOne(doc); 
      console.log(`✅ ${doc.display_id}`); 
      ok++; 
    }
    catch(e) { 
      console.log(`❌ ${doc.display_id}: ${e.message}`); 
      fail++; 
    }
  }
  
  console.log(`\n📊 Summary: ${ok} inserted, ${fail} failed`);

  // Verify
  const inserted = await col.find({ display_id: { $in: ids } }).toArray();
  console.log(`✅ Verified in DB: ${inserted.length}/${questions.length}`);
  
  if (ok === questions.length) {
    console.log('\n🎉 All questions inserted successfully!');
  } else {
    console.log('\n⚠️ Some questions failed. Review errors above.');
  }

  await client.close();
}

main().catch(console.error);
