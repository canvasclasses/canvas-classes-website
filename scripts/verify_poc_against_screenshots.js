// Verify POC database against screenshots - Q108 to Q209 (102 questions)
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Complete list from screenshots: Q108-Q209 (102 questions)
const expectedQuestions = [];
for (let i = 108; i <= 209; i++) {
  expectedQuestions.push(i);
}

async function verify() {
  console.log('\n=== VERIFY POC AGAINST SCREENSHOTS ===\n');
  console.log(`Expected questions from screenshots: Q108-Q209 (${expectedQuestions.length} questions)`);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    // Get all POC questions
    const pocQuestions = await collection.find({
      'metadata.chapter_id': 'ch11_prac_org'
    }).sort({ display_id: 1 }).toArray();
    
    console.log(`\nCurrent database: ${pocQuestions.length} POC questions`);
    console.log(`Range: ${pocQuestions[0]?.display_id} to ${pocQuestions[pocQuestions.length - 1]?.display_id}`);
    
    // Map display_id to MD question number (POC-001 = Q108, POC-002 = Q109, etc.)
    const dbQuestionNumbers = pocQuestions.map((q, idx) => {
      const displayNum = parseInt(q.display_id.split('-')[1]);
      return 107 + displayNum; // POC-001 = 108, POC-002 = 109, etc.
    });
    
    console.log('\nQuestion numbers in database:');
    console.log(`  ${dbQuestionNumbers.slice(0, 10).join(', ')}...${dbQuestionNumbers.slice(-10).join(', ')}`);
    
    // Find missing questions
    const missing = expectedQuestions.filter(q => !dbQuestionNumbers.includes(q));
    
    console.log(`\n📊 ANALYSIS:`);
    console.log(`  Expected: ${expectedQuestions.length} questions (Q108-Q209)`);
    console.log(`  In database: ${dbQuestionNumbers.length} questions`);
    console.log(`  Missing: ${missing.length} questions`);
    
    if (missing.length > 0) {
      console.log(`\n⚠️  Missing questions:`);
      console.log(`  ${missing.join(', ')}`);
    } else {
      console.log(`\n✅ All questions present!`);
    }
    
    // Check for questions with missing solutions or tags
    let missingSolutions = 0;
    let missingTags = 0;
    let missingDifficulty = 0;
    
    pocQuestions.forEach(q => {
      if (!q.solution || !q.solution.text_markdown || q.solution.text_markdown.length < 50) {
        missingSolutions++;
      }
      if (!q.metadata.tags || q.metadata.tags.length === 0) {
        missingTags++;
      }
      if (!q.metadata.difficulty || q.metadata.difficulty === 'Medium') {
        missingDifficulty++;
      }
    });
    
    console.log(`\n📝 QUALITY CHECK:`);
    console.log(`  Questions with inadequate solutions: ${missingSolutions}`);
    console.log(`  Questions with missing tags: ${missingTags}`);
    console.log(`  Questions with default difficulty: ${missingDifficulty}`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

verify();
