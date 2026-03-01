/**
 * Direct MongoDB deletion script for ch12_carbonyl questions
 * Bypasses API to avoid chapter stats update issues
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const DRY_RUN = !process.argv.includes('--confirm');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function main() {
  console.log('🗑️  Direct MongoDB Deletion - ch12_carbonyl Questions');
  console.log('═══════════════════════════════════════════════════════════════════\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No deletions will be performed');
    console.log('   Run with --confirm flag to actually delete questions\n');
  } else {
    console.log('🔴 DELETION MODE - Questions will be permanently marked as deleted!\n');
  }
  
  // Connect to MongoDB
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected\n');
  
  const db = mongoose.connection.db;
  const collection = db.collection('questions_v2');
  
  // Find all ch12_carbonyl questions
  const questions = await collection.find({
    'metadata.chapter_id': 'ch12_carbonyl',
    deleted_at: null
  }).toArray();
  
  console.log(`Found ${questions.length} ch12_carbonyl questions to delete\n`);
  
  if (questions.length === 0) {
    console.log('✓ No questions to delete\n');
    await mongoose.disconnect();
    return;
  }
  
  // Group by display_id prefix
  const byPrefix = {};
  questions.forEach(q => {
    const prefix = q.display_id?.split('-')[0] || 'UNKNOWN';
    if (!byPrefix[prefix]) byPrefix[prefix] = [];
    byPrefix[prefix].push(q.display_id);
  });
  
  console.log('Questions by prefix:');
  for (const [prefix, ids] of Object.entries(byPrefix)) {
    console.log(`  ${prefix}: ${ids.length} questions`);
  }
  console.log('');
  
  if (DRY_RUN) {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`DRY RUN: Would mark ${questions.length} questions as deleted`);
    console.log('═══════════════════════════════════════════════════════════════════\n');
    console.log('To proceed with deletion, run:\n');
    console.log('  node scripts/delete_carbonyl_direct_mongo.js --confirm\n');
    await mongoose.disconnect();
    return;
  }
  
  // Perform soft delete (set deleted_at timestamp)
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('Marking questions as deleted...\n');
  
  const result = await collection.updateMany(
    {
      'metadata.chapter_id': 'ch12_carbonyl',
      deleted_at: null
    },
    {
      $set: {
        deleted_at: new Date(),
        deleted_by: 'admin_script'
      }
    }
  );
  
  console.log(`✓ Marked ${result.modifiedCount} questions as deleted\n`);
  
  // Verify deletion
  const remaining = await collection.countDocuments({
    'metadata.chapter_id': 'ch12_carbonyl',
    deleted_at: null
  });
  
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('DELETION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`  ✓ Deleted: ${result.modifiedCount}`);
  console.log(`  Remaining (not deleted): ${remaining}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
  
  if (remaining === 0) {
    console.log('✅ All ch12_carbonyl questions successfully deleted\n');
  } else {
    console.log(`⚠️  ${remaining} questions still remain (not deleted)\n`);
  }
  
  await mongoose.disconnect();
  console.log('✓ Disconnected from MongoDB\n');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
