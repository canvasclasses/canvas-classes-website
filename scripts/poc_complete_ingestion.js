// POC Complete Ingestion - Parse MD file and ingest all 104 questions
// Then identify and remove duplicates
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Parse POC MD file
function parsePOCMDFile() {
  const content = fs.readFileSync('PYQ/POC - PYQ - JEE.md', 'utf-8');
  const lines = content.split('\n');
  
  const questions = [];
  let currentQ = null;
  let currentSection = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Match question number pattern: "108. Match List-I..."
    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (qMatch) {
      // Save previous question
      if (currentQ) {
        questions.push(currentQ);
      }
      
      const qNum = parseInt(qMatch[1]);
      currentQ = {
        mdNumber: qNum,
        displayId: `POC-NEW-${String(qNum - 107).padStart(3, '0')}`,
        questionText: qMatch[2],
        options: [],
        examSource: null,
        fullText: []
      };
      currentSection = 'question';
    }
    
    // Match exam source: [02 April, 2025 (Shift-II)]
    const examMatch = line.match(/\[(\d+)\s+(\w+),\s+(\d{4})\s+\(Shift-([IVX]+)\)\]/);
    if (examMatch && currentQ) {
      currentQ.examSource = {
        day: parseInt(examMatch[1]),
        month: examMatch[2],
        year: parseInt(examMatch[3]),
        shift: `Shift-${examMatch[4]}`
      };
    }
    
    // Match options: (a) ... (b) ... (c) ... (d) ...
    const optMatch = line.match(/^\(([a-d])\)\s+(.+)/);
    if (optMatch && currentQ) {
      currentQ.options.push({
        id: optMatch[1],
        text: optMatch[2]
      });
    }
    
    if (currentQ && line) {
      currentQ.fullText.push(line);
    }
  }
  
  // Save last question
  if (currentQ) {
    questions.push(currentQ);
  }
  
  return questions;
}

async function ingestPOCQuestions() {
  console.log('\n=== POC COMPLETE INGESTION ===\n');
  console.log('Step 1: Parsing MD file...');
  
  const parsedQuestions = parsePOCMDFile();
  console.log(`✅ Parsed ${parsedQuestions.length} questions from MD file`);
  console.log(`   Range: Q${parsedQuestions[0].mdNumber} to Q${parsedQuestions[parsedQuestions.length - 1].mdNumber}`);
  
  // Show sample
  console.log('\nSample questions:');
  parsedQuestions.slice(0, 5).forEach(q => {
    console.log(`  ${q.displayId} (MD Q${q.mdNumber}): ${q.questionText.substring(0, 60)}...`);
  });
  
  console.log('\n⚠️  This is a parsing test. Full ingestion requires creating proper question objects.');
  console.log('📊 Next steps:');
  console.log('   1. Create proper question objects with all metadata');
  console.log('   2. Ingest all 104 questions as POC-NEW-xxx');
  console.log('   3. Compare with existing POC-001 to POC-099');
  console.log('   4. Remove duplicates from NEW set');
  console.log('   5. Renumber to POC-001 to POC-104 matching MD sequence');
}

ingestPOCQuestions().catch(console.error);
