#!/usr/bin/env node
/**
 * Direct MongoDB insertion script for PERI questions.
 * Bypasses the API auth layer by connecting to MongoDB directly.
 * Usage: node scripts/insert_peri_direct.js data/peri_q01_20.json
 */

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI not set in .env.local');

async function main() {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.error('Usage: node scripts/insert_peri_direct.js <path-to-json>');
    process.exit(1);
  }

  const jsonPath = path.resolve(process.cwd(), args[0]);
  if (!fs.existsSync(jsonPath)) {
    console.error('File not found:', jsonPath);
    process.exit(1);
  }

  const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`\nLoaded ${questions.length} questions from ${path.basename(jsonPath)}`);

  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB\n');

  const db = client.db('crucible');
  const collection = db.collection('questions_v2');

  let inserted = 0;
  let skipped = 0;
  const errors = [];

  for (const q of questions) {
    try {
      // Check for duplicate display_id
      const existing = await collection.findOne({ display_id: q.display_id });
      if (existing) {
        console.log(`  ⚠️  ${q.display_id} - Already exists, skipping`);
        skipped++;
        continue;
      }

      const now = new Date();
      const doc = {
        _id: uuidv4(),
        display_id: q.display_id,
        question_text: {
          markdown: q.question_text.markdown,
          latex_validated: false
        },
        type: q.type,
        options: q.options || [],
        answer: q.answer || null,
        solution: {
          text_markdown: q.solution.text_markdown,
          latex_validated: false
        },
        metadata: q.metadata,
        status: 'published',
        quality_score: 80,
        needs_review: false,
        version: 1,
        created_by: 'admin',
        updated_by: 'admin',
        asset_ids: [],
        deleted_at: null,
        created_at: now,
        updated_at: now
      };

      await collection.insertOne(doc);
      console.log(`  ✅ ${q.display_id} - Inserted`);
      inserted++;
    } catch (err) {
      console.log(`  ❌ ${q.display_id} - Error: ${err.message}`);
      errors.push({ display_id: q.display_id, error: err.message });
    }
  }

  await client.close();

  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total:    ${questions.length}`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Errors:   ${errors.length}`);
  if (errors.length) {
    errors.forEach(e => console.log(`  - ${e.display_id}: ${e.error}`));
  }
  console.log('\nDone!\n');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
