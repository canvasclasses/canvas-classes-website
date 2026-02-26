const fs = require('fs');

// Read the MD file
const content = fs.readFileSync('/Users/CanvasClasses/Desktop/canvas/PYQ/Hydrocarbons - PYQ - JEE.md', 'utf8');

// Extract questions with their dates
const lines = content.split('\n');
let questionNumber = 0;
let currentQuestion = null;
const questions = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if line starts with a question number
  const match = line.match(/^(\d+)\.\s+(.+)/);
  if (match) {
    questionNumber = parseInt(match[1]);
    currentQuestion = {
      number: questionNumber,
      text: match[2],
      date: null,
      year: null
    };
  }
  
  // Check for date pattern
  const dateMatch = line.match(/\[(\d+)\s+(Jan|Feb|Mar|April|May|June|July|Aug|Sept|Oct|Nov|Dec),?\s+(\d{4})\s+\(Shift-[I]+\)\]/);
  if (dateMatch && currentQuestion) {
    currentQuestion.date = line.trim();
    currentQuestion.year = parseInt(dateMatch[3]);
    questions.push({...currentQuestion});
    currentQuestion = null;
  }
}

console.log('=== HYDROCARBONS MD FILE SEQUENCE ANALYSIS ===\n');
console.log('First 30 questions:\n');

questions.slice(0, 30).forEach(q => {
  const marker = q.year === 2025 ? ' ⚠️ SKIP (2025)' : '';
  console.log(`Q${q.number}: ${q.year}${marker}`);
  console.log(`   ${q.text.substring(0, 80)}...`);
  console.log(`   Date: ${q.date}`);
  console.log('');
});

console.log('\n=== SUMMARY ===');
console.log(`Total questions in MD file: ${questions.length}`);
const questions2025 = questions.filter(q => q.year === 2025);
console.log(`Questions from 2025 to skip: ${questions2025.length}`);
console.log(`Questions to ingest: ${questions.length - questions2025.length}`);

console.log('\n=== 2025 QUESTIONS TO SKIP ===');
questions2025.forEach(q => {
  console.log(`Q${q.number}: ${q.date}`);
});
