const fs = require('fs');
const path = require('path');

// Read all 5 part files
const part1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/new_mole_questions_batch3_part1.json'), 'utf8'));
const part2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/new_mole_questions_batch3_part2.json'), 'utf8'));
const part3 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/new_mole_questions_batch3_part3.json'), 'utf8'));
const part4 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/new_mole_questions_batch3_part4.json'), 'utf8'));
const part5 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/new_mole_questions_batch3_part5.json'), 'utf8'));

// Merge all parts
const allQuestions = [...part1, ...part2, ...part3, ...part4, ...part5];

console.log(`✅ Merged ${allQuestions.length} questions from 5 parts`);
console.log(`   Questions: ${allQuestions[0].display_id} to ${allQuestions[allQuestions.length - 1].display_id}`);

// Add metadata to each question
const questionsWithMetadata = allQuestions.map(q => ({
  ...q,
  status: 'review',
  created_by: 'ai_agent',
  updated_by: 'ai_agent'
}));

// Read existing ch11_mole.json
const ch11MolePath = path.join(__dirname, '../data/chapters/ch11_mole.json');
const ch11Mole = JSON.parse(fs.readFileSync(ch11MolePath, 'utf8'));

console.log(`\n📊 Current ch11_mole.json has ${ch11Mole.questions.length} questions`);

// Append new questions
ch11Mole.questions.push(...questionsWithMetadata);

console.log(`📊 After adding: ${ch11Mole.questions.length} questions`);

// Write back to file
fs.writeFileSync(ch11MolePath, JSON.stringify(ch11Mole, null, 2));

console.log(`\n✅ Successfully appended ${questionsWithMetadata.length} questions to ch11_mole.json`);
console.log(`   Total questions in ch11_mole: ${ch11Mole.questions.length}`);
