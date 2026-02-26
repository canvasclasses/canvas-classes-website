// POC Step 2: Ingest all 96 parsed questions as POC-NEW-xxx
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Answer key mapping (from MD file answer section)
const answerKey = {
  108: 'd', 109: 'a', 110: 'a', 111: 'd', 112: 'd', 113: 'c', 114: 7, 115: 'd',
  116: 'b', 117: 'b', 118: 'd', 119: 'c', 120: 125, 121: 'b', 122: 'c', 123: 'c',
  124: 4, 125: 'd', 126: 'c', 127: 'c', 128: 'c', 129: 'a', 130: 'b', 131: 'a',
  132: 'b', 133: 'c', 134: 'b', 135: 'd', 136: 'a', 137: 'b', 138: 'c', 139: 'b',
  140: 'c', 141: 'a', 142: 'a', 143: 'b', 144: 'b', 145: 'a', 146: 'b', 147: 'c',
  148: 'd', 149: 'a', 150: 'c', 151: 'b', 152: 'c', 153: 'c', 154: 'a', 155: 'b',
  156: 'c', 157: 'a', 158: 'b', 159: 'a', 160: 'c', 161: 'c', 162: 'b', 163: 'a',
  164: 'c', 165: 'b', 166: 'c', 167: 'c', 168: 'a', 169: 'b', 170: 'c', 171: 'b',
  172: 'a', 173: 'c', 174: 'c', 175: 'b', 176: 'c', 177: 'b', 178: 'a', 179: 'b',
  180: 'b', 181: 'a', 182: 22, 183: 14, 184: 64, 185: 56, 186: 46, 187: 40,
  188: 'b', 189: 'b', 190: 'b', 191: 'c', 192: 'a', 193: 'a', 194: 'a', 195: 'a',
  196: 7, 197: 68, 198: 40, 199: 42, 200: 19, 201: 1125, 202: 12, 203: 19,
  204: 'c', 205: 'd', 206: 'c', 207: 'a', 208: 26.92, 209: 50
};

function createQuestionObject(parsedQ) {
  const answer = answerKey[parsedQ.mdNumber];
  const isNumerical = typeof answer === 'number';
  
  const questionText = parsedQ.questionLines.join('\n');
  
  return {
    _id: uuidv4(),
    display_id: parsedQ.displayId,
    question_text: {
      markdown: questionText,
      latex_validated: true
    },
    type: isNumerical ? 'NVT' : 'SCQ',
    options: isNumerical ? [] : parsedQ.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      is_correct: opt.id === answer
    })),
    answer: {
      correct_option: isNumerical ? null : answer,
      numerical_value: isNumerical ? answer : null,
      explanation: `Answer from MD file.`
    },
    solution: {
      text_markdown: `Solution available in MD file.`,
      latex_validated: true
    },
    metadata: {
      difficulty: 'Medium',
      chapter_id: 'ch11_prac_org',
      tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }],
      is_pyq: true,
      is_top_pyq: false,
      exam_source: parsedQ.examSource
    },
    status: 'published',
    created_by: 'admin',
    updated_by: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
    version: 1,
    deleted_at: null,
    asset_ids: [],
    quality_score: 85
  };
}

async function ingestAll() {
  console.log('\n=== POC STEP 2: INGEST ALL QUESTIONS ===\n');
  
  // Load parsed questions
  const parsedQuestions = JSON.parse(
    fs.readFileSync('scripts/poc_parsed_questions.json', 'utf-8')
  );
  
  console.log(`Loaded ${parsedQuestions.length} parsed questions`);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    console.log('\nIngesting questions...');
    let count = 0;
    
    for (const parsedQ of parsedQuestions) {
      const questionObj = createQuestionObject(parsedQ);
      await collection.insertOne(questionObj);
      count++;
      
      if (count % 10 === 0) {
        console.log(`  ✅ Ingested ${count}/${parsedQuestions.length} questions`);
      }
    }
    
    console.log(`\n✅ Successfully ingested all ${count} questions as POC-NEW-xxx`);
    console.log(`\n📊 Next: Run step 3 to compare and remove duplicates`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

ingestAll();
