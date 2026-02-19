#!/usr/bin/env node

/**
 * BULK QUESTION INSERTION SCRIPT
 * Automatically inserts questions from JSON file into MongoDB via API
 * Usage: node scripts/insert_questions_batch.js data/questions_batch_001.json
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const BATCH_SIZE = 5; // Insert 5 questions at a time to avoid overwhelming the API

/**
 * Insert a single question via API
 */
async function insertQuestion(questionData) {
  try {
    // Generate UUID for _id if not present
    const questionWithId = {
      _id: uuidv4(),
      ...questionData,
      version: 1,
      quality_score: 85,
      needs_review: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const response = await fetch(`${API_BASE_URL}/api/v2/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionWithId),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}`);
    }

    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: error.message, display_id: questionData.display_id };
  }
}

/**
 * Insert questions in batches
 */
async function insertBatch(questions) {
  const results = {
    total: questions.length,
    successful: 0,
    failed: 0,
    errors: [],
  };

  console.log(`\n📦 Starting batch insertion of ${questions.length} questions...\n`);

  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(questions.length / BATCH_SIZE)}...`);

    const batchPromises = batch.map(q => insertQuestion(q));
    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach((result, idx) => {
      const question = batch[idx];
      if (result.success) {
        results.successful++;
        console.log(`  ✅ ${question.display_id} - Inserted successfully`);
      } else {
        results.failed++;
        results.errors.push({
          display_id: question.display_id,
          error: result.error,
        });
        console.log(`  ❌ ${question.display_id} - Failed: ${result.error}`);
      }
    });

    // Small delay between batches
    if (i + BATCH_SIZE < questions.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Error: Please provide path to JSON file');
    console.log('Usage: node scripts/insert_questions_batch.js <path-to-json>');
    console.log('Example: node scripts/insert_questions_batch.js data/questions_batch_001.json');
    process.exit(1);
  }

  const jsonPath = path.resolve(process.cwd(), args[0]);

  // Check if file exists
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Error: File not found: ${jsonPath}`);
    process.exit(1);
  }

  // Read and parse JSON
  let questions;
  try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    questions = JSON.parse(jsonContent);
    
    if (!Array.isArray(questions)) {
      throw new Error('JSON file must contain an array of questions');
    }
    
    console.log(`✅ Loaded ${questions.length} questions from ${path.basename(jsonPath)}`);
  } catch (error) {
    console.error(`❌ Error reading JSON file: ${error.message}`);
    process.exit(1);
  }

  // Validate questions
  const invalidQuestions = questions.filter(q => !q.display_id || !q.question_text || !q.type);
  if (invalidQuestions.length > 0) {
    console.error(`❌ Error: ${invalidQuestions.length} questions are missing required fields`);
    console.error('Required fields: display_id, question_text, type');
    process.exit(1);
  }

  // Insert questions
  const results = await insertBatch(questions);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 INSERTION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total questions: ${results.total}`);
  console.log(`✅ Successfully inserted: ${results.successful}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Failed Questions:');
    results.errors.forEach(err => {
      console.log(`  - ${err.display_id}: ${err.error}`);
    });
  }

  console.log('\n✨ Batch insertion complete!');
  console.log(`\n👉 Check admin dashboard at: ${API_BASE_URL}/crucible/admin\n`);

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
