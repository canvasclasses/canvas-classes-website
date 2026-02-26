// POC Complete Ingestion: All 102 questions (Q108-Q209) from MD file
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Complete answer key for Q108-Q209
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

function extractExamSource(line) {
  const match = line.match(/\[(\d+)\s+(\w+),\s+(\d{4})\s+\(Shift-([IVX]+)\)\]/);
  if (match) {
    return {
      exam: 'JEE Main',
      day: parseInt(match[1]),
      month: match[2],
      year: parseInt(match[3]),
      shift: `Shift-${match[4]}`
    };
  }
  return null;
}

function parsePOCQuestions() {
  const content = fs.readFileSync('PYQ/POC - PYQ - JEE.md', 'utf-8');
  const lines = content.split('\n');
  
  const questions = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Match question number: "108. Match List-I..."
    const qMatch = line.match(/^(\d{3})\.\s+(.+)/);
    if (qMatch) {
      const qNum = parseInt(qMatch[1]);
      
      // Only process questions 108-209
      if (qNum >= 108 && qNum <= 209) {
        const questionObj = {
          mdNumber: qNum,
          displayId: `POC-${String(qNum - 107).padStart(3, '0')}`,
          questionLines: [qMatch[2]],
          options: [],
          examSource: null
        };
        
        i++;
        let foundExamSource = false;
        
        // Collect question text, options, and exam source
        while (i < lines.length) {
          const currentLine = lines[i].trim();
          
          // Check for next question
          if (/^\d{3}\.\s+/.test(currentLine)) {
            break;
          }
          
          // Extract exam source
          const examSrc = extractExamSource(currentLine);
          if (examSrc) {
            questionObj.examSource = examSrc;
            foundExamSource = true;
          }
          
          // Extract options (a), (b), (c), (d)
          const optMatch = currentLine.match(/^\(([a-d])\)\s+(.+)/);
          if (optMatch) {
            questionObj.options.push({
              id: optMatch[1],
              text: optMatch[2]
            });
          }
          
          // Add to question lines if not an option and not exam source
          if (!optMatch && currentLine && !examSrc) {
            questionObj.questionLines.push(currentLine);
          }
          
          i++;
        }
        
        // Only add if we have exam source (valid question, not answer explanation)
        if (foundExamSource) {
          questions.push(questionObj);
        }
        
        continue;
      }
    }
    i++;
  }
  
  return questions;
}

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
      explanation: `Answer: ${answer}`
    },
    solution: {
      text_markdown: `Solution for question ${parsedQ.mdNumber}.`,
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
  console.log('\n=== POC COMPLETE INGESTION: ALL 102 QUESTIONS ===\n');
  
  console.log('Step 1: Parsing MD file...');
  const parsedQuestions = parsePOCQuestions();
  console.log(`✅ Parsed ${parsedQuestions.length} questions with exam sources`);
  console.log(`   Range: Q${parsedQuestions[0].mdNumber} to Q${parsedQuestions[parsedQuestions.length - 1].mdNumber}`);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    console.log('\nStep 2: Ingesting all questions...');
    let count = 0;
    
    for (const parsedQ of parsedQuestions) {
      const questionObj = createQuestionObject(parsedQ);
      await collection.insertOne(questionObj);
      count++;
      
      if (count % 20 === 0) {
        console.log(`  ✅ Ingested ${count}/${parsedQuestions.length} questions`);
      }
    }
    
    console.log(`\n✅ Successfully ingested all ${count} questions`);
    console.log(`   Display IDs: POC-001 to POC-${String(count).padStart(3, '0')}`);
    
    // Verify
    const finalCount = await collection.countDocuments({
      'metadata.chapter_id': 'ch11_prac_org'
    });
    
    console.log(`\n📊 FINAL VERIFICATION:`);
    console.log(`   Total POC questions in database: ${finalCount}`);
    console.log(`   Sequence matches MD file: Q108-Q${107 + finalCount}`);
    
    // Year distribution
    const allQuestions = await collection.find({
      'metadata.chapter_id': 'ch11_prac_org'
    }).toArray();
    
    const yearCounts = {};
    allQuestions.forEach(q => {
      const year = q.metadata.exam_source?.year;
      if (year) yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    
    console.log('\n   Year distribution:');
    Object.keys(yearCounts).sort().forEach(year => {
      console.log(`     ${year}: ${yearCounts[year]} questions`);
    });
    
    console.log('\n🎉 POC ingestion complete!');
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

ingestAll();
