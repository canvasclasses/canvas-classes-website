/**
 * Analyze Chemical Bonding questions - Batch 1 (first 30 questions)
 * This script fetches and displays questions for expert tagging
 */

import mongoose from 'mongoose';
import { QuestionV2 } from '../lib/models/Question.v2';
import { TAXONOMY_FROM_CSV } from '../app/crucible/admin/taxonomy/taxonomyData_from_csv';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  // Fetch first 30 questions
  const questions = await QuestionV2.find({
    'metadata.chapter_id': 'ch11_bonding',
    deleted_at: null,
  })
    .sort({ display_id: 1 })
    .limit(30)
    .lean();

  console.log(`📊 Fetched ${questions.length} questions for Batch 1\n`);
  console.log('='.repeat(100));

  questions.forEach((q: any, idx) => {
    const primaryTagId = q.metadata?.tags?.[0]?.tag_id || '';
    const primaryTagNode = TAXONOMY_FROM_CSV.find(n => n.id === primaryTagId);
    
    console.log(`\n[${idx + 1}] ${q.display_id} | Type: ${q.type}`);
    console.log(`Primary Tag: ${primaryTagNode?.name || 'NONE'}`);
    console.log(`Question: ${q.question_text?.markdown?.substring(0, 150)}...`);
    
    if (q.options && q.options.length > 0) {
      console.log(`Options:`);
      q.options.forEach((opt: any, i: number) => {
        const marker = opt.is_correct ? '✓' : ' ';
        console.log(`  [${marker}] ${String.fromCharCode(65 + i)}. ${opt.text.substring(0, 80)}`);
      });
    }
    
    console.log(`Current Tags:`);
    console.log(`  - Micro: ${q.metadata?.microConcept || '❌ NOT SET'}`);
    console.log(`  - Cognitive: ${q.metadata?.cognitiveType || '❌ NOT SET'}`);
    console.log(`  - Calc Load: ${q.metadata?.calcLoad || '❌ NOT SET'}`);
    console.log(`  - Entry Point: ${q.metadata?.entryPoint || '❌ NOT SET'}`);
    console.log('-'.repeat(100));
  });

  await mongoose.disconnect();
  console.log('\n✅ Analysis complete');
}

main().catch(console.error);
