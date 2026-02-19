#!/usr/bin/env node

/**
 * MIGRATE QUESTIONS TO CHAPTER FILES
 * Moves questions from batch file to appropriate chapter JSON files
 */

const fs = require('fs');
const path = require('path');

const batchFile = path.resolve(__dirname, '../data/questions_batch_001.json');
const chaptersDir = path.resolve(__dirname, '../data/chapters');

// Read batch questions
const batchQuestions = JSON.parse(fs.readFileSync(batchFile, 'utf-8'));

console.log(`✅ Loaded ${batchQuestions.length} questions from batch file\n`);

// Group questions by chapter
const questionsByChapter = {};

batchQuestions.forEach(q => {
  const chapterId = q.metadata.chapter_id;
  if (!questionsByChapter[chapterId]) {
    questionsByChapter[chapterId] = [];
  }
  questionsByChapter[chapterId].push(q);
});

console.log(`📊 Questions grouped by chapter:`);
Object.entries(questionsByChapter).forEach(([chapterId, questions]) => {
  console.log(`  - ${chapterId}: ${questions.length} questions`);
});

console.log('\n📝 Migrating questions to chapter files...\n');

// Migrate to chapter files
let migrated = 0;
let errors = 0;

Object.entries(questionsByChapter).forEach(([chapterId, questions]) => {
  const chapterFile = path.join(chaptersDir, `${chapterId}.json`);
  
  if (!fs.existsSync(chapterFile)) {
    console.log(`  ❌ ${chapterId}.json - File not found`);
    errors++;
    return;
  }
  
  // Read existing chapter file
  const chapterData = JSON.parse(fs.readFileSync(chapterFile, 'utf-8'));
  
  // Add questions (avoid duplicates)
  const existingIds = new Set(chapterData.questions.map(q => q.display_id));
  const newQuestions = questions.filter(q => !existingIds.has(q.display_id));
  
  chapterData.questions.push(...newQuestions);
  
  // Write back
  fs.writeFileSync(chapterFile, JSON.stringify(chapterData, null, 2));
  
  console.log(`  ✅ ${chapterId}.json - Added ${newQuestions.length} questions (total: ${chapterData.questions.length})`);
  migrated += newQuestions.length;
});

console.log('\n' + '='.repeat(60));
console.log('📊 MIGRATION SUMMARY');
console.log('='.repeat(60));
console.log(`Questions migrated: ${migrated}`);
console.log(`Errors: ${errors}`);
console.log('\n✨ Migration complete!\n');
