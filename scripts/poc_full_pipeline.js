// POC Complete Pipeline: Parse, Ingest, Compare, Remove Duplicates, Renumber
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Helper to extract exam source from line
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

// Parse POC MD file - questions 108-211
function parsePOCQuestions() {
  const content = fs.readFileSync('PYQ/POC - PYQ - JEE.md', 'utf-8');
  const lines = content.split('\n');
  
  const questions = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Match main question number: "108. Match List-I..."
    const qMatch = line.match(/^(\d{3})\.\s+(.+)/);
    if (qMatch) {
      const qNum = parseInt(qMatch[1]);
      
      // Only process questions 108-211 (104 questions)
      if (qNum >= 108 && qNum <= 211) {
        const questionObj = {
          mdNumber: qNum,
          displayId: `POC-NEW-${String(qNum - 107).padStart(3, '0')}`,
          questionLines: [qMatch[2]],
          options: [],
          examSource: null,
          type: 'SCQ'
        };
        
        i++;
        
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
          }
          
          // Extract options (a), (b), (c), (d)
          const optMatch = currentLine.match(/^\(([a-d])\)\s+(.+)/);
          if (optMatch) {
            questionObj.options.push({
              id: optMatch[1],
              text: optMatch[2]
            });
          }
          
          // Check if it's a numerical type question
          if (currentLine.includes('\\(\\underline{\\hspace') || currentLine.includes('is \\(\\underline')) {
            questionObj.type = 'NVT';
          }
          
          // Add to question lines if not an option
          if (!optMatch && currentLine && !examSrc) {
            questionObj.questionLines.push(currentLine);
          }
          
          i++;
        }
        
        // Only add if we have exam source (valid question)
        if (questionObj.examSource) {
          questions.push(questionObj);
        }
        
        continue;
      }
    }
    i++;
  }
  
  return questions;
}

// Create MongoDB question object
function createQuestionObject(parsedQ, correctAnswer = 'a', numericalValue = null) {
  const questionText = parsedQ.questionLines.join('\n');
  
  return {
    _id: uuidv4(),
    display_id: parsedQ.displayId,
    question_text: {
      markdown: questionText,
      latex_validated: true
    },
    type: parsedQ.type,
    options: parsedQ.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      is_correct: opt.id === correctAnswer
    })),
    answer: {
      correct_option: parsedQ.type === 'SCQ' ? correctAnswer : null,
      numerical_value: parsedQ.type === 'NVT' ? numericalValue : null,
      explanation: 'Answer from MD file.'
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

async function runPipeline() {
  console.log('\n=== POC COMPLETE PIPELINE ===\n');
  
  // Step 1: Parse MD file
  console.log('Step 1: Parsing POC MD file...');
  const parsedQuestions = parsePOCQuestions();
  console.log(`✅ Parsed ${parsedQuestions.length} questions`);
  console.log(`   Range: Q${parsedQuestions[0].mdNumber} to Q${parsedQuestions[parsedQuestions.length - 1].mdNumber}`);
  
  // Show sample
  console.log('\nSample parsed questions:');
  parsedQuestions.slice(0, 5).forEach(q => {
    console.log(`  ${q.displayId} (MD Q${q.mdNumber}): ${q.questionLines[0].substring(0, 50)}...`);
    console.log(`    Type: ${q.type}, Options: ${q.options.length}, Year: ${q.examSource?.year}`);
  });
  
  console.log('\n✅ Parsing complete!');
  console.log(`\n📊 Next steps to complete:`);
  console.log(`   1. Create full question objects with proper answers`);
  console.log(`   2. Ingest all ${parsedQuestions.length} questions as POC-NEW-xxx`);
  console.log(`   3. Compare with existing POC-001 to POC-099`);
  console.log(`   4. Identify duplicates (by question text similarity)`);
  console.log(`   5. Delete duplicate NEW questions`);
  console.log(`   6. Renumber remaining to POC-001 to POC-${parsedQuestions.length}`);
  
  // Save parsed data for next step
  fs.writeFileSync(
    'scripts/poc_parsed_questions.json',
    JSON.stringify(parsedQuestions, null, 2)
  );
  console.log(`\n💾 Saved parsed questions to scripts/poc_parsed_questions.json`);
}

runPipeline().catch(console.error);
