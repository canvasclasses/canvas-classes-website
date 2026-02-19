const fs = require('fs');
const path = require('path');

// Read the new questions
const newQuestionsFile = path.join(__dirname, '../data/new_mole_questions_batch2.json');
const newQuestionsData = JSON.parse(fs.readFileSync(newQuestionsFile, 'utf-8'));

// Read the existing chapter file
const chapterFile = path.join(__dirname, '../data/chapters/ch11_mole.json');
const chapterData = JSON.parse(fs.readFileSync(chapterFile, 'utf-8'));

console.log('📝 Adding Batch 2 Questions to ch11_mole.json\n');
console.log(`Current questions: ${chapterData.questions.length}`);
console.log(`New questions to add: ${newQuestionsData.questions.length}\n`);

// Add metadata fields to match existing format
const questionsToAdd = newQuestionsData.questions.map(q => ({
  ...q,
  metadata: {
    ...q.metadata,
    is_pyq: false,
    is_top_pyq: false
  },
  created_by: 'ai_agent',
  updated_by: 'ai_agent'
}));

// Append new questions
chapterData.questions.push(...questionsToAdd);

// Write back to file
fs.writeFileSync(chapterFile, JSON.stringify(chapterData, null, 2), 'utf-8');

console.log(`✅ Successfully added ${questionsToAdd.length} questions`);
console.log(`Total questions now: ${chapterData.questions.length}`);
console.log(`\nQuestion IDs added: MOLE-217 to MOLE-229`);
console.log('\n📁 File updated: /data/chapters/ch11_mole.json');
console.log('\n🔄 Next step: Run complete_pipeline.js to sync to MongoDB');
