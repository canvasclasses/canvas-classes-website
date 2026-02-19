#!/usr/bin/env node

/**
 * CHAPTER STRUCTURE SETUP
 * Creates organized JSON file structure for all 28 chapters
 * Each chapter gets its own JSON file for questions
 */

const fs = require('fs');
const path = require('path');

// Read taxonomy to get all chapters
const taxonomyPath = path.resolve(__dirname, '../app/crucible/admin/taxonomy/taxonomyData_from_csv.ts');
const taxonomyContent = fs.readFileSync(taxonomyPath, 'utf-8');

// Extract chapter information
const chapters = [];
const chapterRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*parent_id:\s*null,\s*type:\s*'chapter',\s*sequence_order:\s*(\d+),\s*class_level:\s*(\d+),\s*chapterType:\s*'([^']+)'/g;

let match;
while ((match = chapterRegex.exec(taxonomyContent)) !== null) {
  const [, id, name, sequence, classLevel, chapterType] = match;
  chapters.push({
    id,
    name,
    sequence_order: parseInt(sequence),
    class_level: parseInt(classLevel),
    chapter_type: chapterType
  });
}

console.log(`✅ Found ${chapters.length} chapters in taxonomy\n`);

// Create data/chapters directory
const chaptersDir = path.resolve(__dirname, '../data/chapters');
if (!fs.existsSync(chaptersDir)) {
  fs.mkdirSync(chaptersDir, { recursive: true });
  console.log('📁 Created data/chapters directory');
}

// Create JSON file for each chapter
let created = 0;
let skipped = 0;

chapters.forEach(chapter => {
  const filename = `${chapter.id}.json`;
  const filepath = path.join(chaptersDir, filename);
  
  // Check if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`  ⚠️  ${filename} - Already exists (skipped)`);
    skipped++;
    return;
  }
  
  // Create template JSON structure
  const template = {
    chapter_info: {
      id: chapter.id,
      name: chapter.name,
      class_level: chapter.class_level,
      chapter_type: chapter.chapter_type,
      sequence_order: chapter.sequence_order
    },
    questions: []
  };
  
  fs.writeFileSync(filepath, JSON.stringify(template, null, 2));
  console.log(`  ✅ ${filename} - Created`);
  created++;
});

console.log('\n' + '='.repeat(60));
console.log('📊 SETUP SUMMARY');
console.log('='.repeat(60));
console.log(`Total chapters: ${chapters.length}`);
console.log(`✅ Files created: ${created}`);
console.log(`⚠️  Files skipped (already exist): ${skipped}`);
console.log('\n✨ Chapter structure setup complete!');
console.log(`\n📁 Location: ${chaptersDir}\n`);

// Create index file listing all chapters
const indexPath = path.join(chaptersDir, '_index.json');
fs.writeFileSync(indexPath, JSON.stringify({ chapters }, null, 2));
console.log(`📋 Created _index.json with chapter metadata\n`);
