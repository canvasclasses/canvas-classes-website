#!/usr/bin/env node

/**
 * COMPLETE QUESTION INGESTION PIPELINE
 * End-to-end: Sync chapters → Insert questions → Verify
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'crucible';

let client;
let db;

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB\n');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

/**
 * Step 1: Sync chapters from taxonomy
 */
async function syncChapters() {
  console.log('📦 STEP 1: Syncing Chapters\n');
  
  const chaptersDir = path.resolve(__dirname, '../data/chapters');
  const indexFile = path.join(chaptersDir, '_index.json');
  
  if (!fs.existsSync(indexFile)) {
    console.log('❌ _index.json not found. Run setup_chapter_structure.js first');
    return false;
  }
  
  const { chapters } = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
  const chaptersCollection = db.collection('chapters');
  
  let synced = 0;
  let skipped = 0;
  
  for (const chapter of chapters) {
    try {
      const existing = await chaptersCollection.findOne({ _id: chapter.id });
      
      if (existing) {
        console.log(`  ⚠️  ${chapter.id} - Already exists`);
        skipped++;
        continue;
      }
      
      await chaptersCollection.insertOne({
        _id: chapter.id,
        name: chapter.name,
        display_order: chapter.sequence_order,
        question_sequence: 0,
        class_level: chapter.class_level.toString(),
        subject: 'Chemistry',
        stats: {
          total_questions: 0,
          published_questions: 0,
          draft_questions: 0,
          avg_difficulty: 'Medium',
          pyq_count: 0
        },
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      console.log(`  ✅ ${chapter.id} - Synced`);
      synced++;
    } catch (error) {
      console.log(`  ❌ ${chapter.id} - Error: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Chapters: ${synced} synced, ${skipped} skipped\n`);
  return true;
}

/**
 * Step 2: Insert questions from chapter files
 */
async function insertQuestions() {
  console.log('📝 STEP 2: Inserting Questions\n');
  
  const chaptersDir = path.resolve(__dirname, '../data/chapters');
  const chapterFiles = fs.readdirSync(chaptersDir)
    .filter(f => f.endsWith('.json') && f !== '_index.json');
  
  const questionsCollection = db.collection('questions_v2');
  
  let totalInserted = 0;
  let totalSkipped = 0;
  
  for (const file of chapterFiles) {
    const filepath = path.join(chaptersDir, file);
    const chapterData = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    
    if (chapterData.questions.length === 0) {
      continue;
    }
    
    console.log(`\n  📄 ${file} (${chapterData.questions.length} questions)`);
    
    let inserted = 0;
    let skipped = 0;
    
    for (const question of chapterData.questions) {
      try {
        // Check if already exists
        const existing = await questionsCollection.findOne({ display_id: question.display_id });
        
        if (existing) {
          console.log(`    ⚠️  ${question.display_id} - Already exists`);
          skipped++;
          continue;
        }
        
        // Prepare question document
        const questionDoc = {
          _id: uuidv4(),
          display_id: question.display_id,
          question_text: question.question_text,
          type: question.type,
          options: question.options || [],
          answer: question.answer || null,
          solution: question.solution,
          metadata: question.metadata,
          status: question.status || 'review',
          quality_score: 85,
          needs_review: false,
          version: 1,
          created_at: new Date(),
          created_by: 'ai_agent',
          updated_at: new Date(),
          updated_by: 'ai_agent',
          asset_ids: []
        };
        
        await questionsCollection.insertOne(questionDoc);
        console.log(`    ✅ ${question.display_id} - Inserted`);
        inserted++;
      } catch (error) {
        console.log(`    ❌ ${question.display_id} - Error: ${error.message}`);
      }
    }
    
    totalInserted += inserted;
    totalSkipped += skipped;
    console.log(`    Summary: ${inserted} inserted, ${skipped} skipped`);
  }
  
  console.log(`\n📊 Total Questions: ${totalInserted} inserted, ${totalSkipped} skipped\n`);
  return totalInserted;
}

/**
 * Step 3: Verify insertion
 */
async function verifyInsertion() {
  console.log('🔍 STEP 3: Verifying Insertion\n');
  
  const questionsCollection = db.collection('questions_v2');
  const chaptersCollection = db.collection('chapters');
  
  const totalQuestions = await questionsCollection.countDocuments();
  const totalChapters = await chaptersCollection.countDocuments();
  
  console.log(`  📊 Total chapters in DB: ${totalChapters}`);
  console.log(`  📊 Total questions in DB: ${totalQuestions}`);
  
  // Get questions by chapter
  const questionsByChapter = await questionsCollection.aggregate([
    { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();
  
  console.log('\n  📈 Questions per chapter:');
  questionsByChapter.forEach(({ _id, count }) => {
    console.log(`    - ${_id}: ${count} questions`);
  });
  
  // Get questions by difficulty
  const questionsByDifficulty = await questionsCollection.aggregate([
    { $group: { _id: '$metadata.difficulty', count: { $sum: 1 } } }
  ]).toArray();
  
  console.log('\n  📊 Questions by difficulty:');
  questionsByDifficulty.forEach(({ _id, count }) => {
    console.log(`    - ${_id}: ${count} questions`);
  });
  
  console.log('\n✅ Verification complete\n');
  return true;
}

/**
 * Main pipeline execution
 */
async function main() {
  console.log('🚀 STARTING COMPLETE PIPELINE\n');
  console.log('='.repeat(60) + '\n');
  
  // Connect to MongoDB
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Pipeline failed: Cannot connect to MongoDB');
    console.log('\n💡 Make sure MongoDB is running:');
    console.log('   - Check connection string in .env');
    console.log('   - Verify MongoDB service is active\n');
    process.exit(1);
  }
  
  try {
    // Step 1: Sync chapters
    const chaptersOk = await syncChapters();
    if (!chaptersOk) {
      throw new Error('Chapter sync failed');
    }
    
    // Step 2: Insert questions
    const questionsInserted = await insertQuestions();
    
    // Step 3: Verify
    await verifyInsertion();
    
    console.log('='.repeat(60));
    console.log('✨ PIPELINE COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n👉 View questions at: http://localhost:3000/crucible/admin\n`);
    
  } catch (error) {
    console.error('\n❌ Pipeline error:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed\n');
    }
  }
}

// Run pipeline
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
