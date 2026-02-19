#!/usr/bin/env node

/**
 * TAXONOMY SYNC SCRIPT
 * Syncs chapters from taxonomyData_from_csv.ts to MongoDB
 * Must be run before inserting questions
 */

const fs = require('fs');
const path = require('path');

// Read taxonomy data
const taxonomyPath = path.resolve(__dirname, '../app/crucible/admin/taxonomy/taxonomyData_from_csv.ts');
const taxonomyContent = fs.readFileSync(taxonomyPath, 'utf-8');

// Extract chapters (type: 'chapter')
const chapterMatches = taxonomyContent.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*parent_id:\s*null,\s*type:\s*'chapter'/g);

const chapters = [];
let sequenceOrder = 1;

for (const match of chapterMatches) {
  const [, id, name] = match;
  chapters.push({
    _id: id,
    name: name,
    display_order: sequenceOrder++,
    stats: {
      total_questions: 0
    }
  });
}

console.log(`✅ Extracted ${chapters.length} chapters from taxonomy`);

// Insert chapters via API
async function insertChapters() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  console.log(`\n📦 Inserting chapters into MongoDB...\n`);
  
  let successful = 0;
  let failed = 0;
  
  for (const chapter of chapters) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v2/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chapter)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        successful++;
        console.log(`  ✅ ${chapter._id} - ${chapter.name}`);
      } else {
        // Check if already exists
        if (result.error && result.error.includes('duplicate')) {
          console.log(`  ⚠️  ${chapter._id} - Already exists (skipped)`);
        } else {
          failed++;
          console.log(`  ❌ ${chapter._id} - Failed: ${result.error}`);
        }
      }
    } catch (error) {
      failed++;
      console.log(`  ❌ ${chapter._id} - Error: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SYNC SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total chapters: ${chapters.length}`);
  console.log(`✅ Successfully synced: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('\n✨ Taxonomy sync complete!\n');
}

insertChapters().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
