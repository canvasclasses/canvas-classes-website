/**
 * Analyze Chemical Bonding questions - Batch 2 (questions 31-60)
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
  await mongoose.connect(MONGODB_URI!);
  console.log('✅ Connected to MongoDB\n');

  // Fetch questions 31-60
  const questions = await QuestionV2.find({
    'metadata.chapter_id': 'ch11_bonding',
    deleted_at: null,
  })
    .sort({ display_id: 1 })
    .skip(30)
    .limit(30)
    .lean();

  console.log(`📊 Fetched ${questions.length} questions for Batch 2\n`);
  console.log('='.repeat(100));

  questions.forEach((q: any, idx) => {
    const primaryTagId = q.metadata?.tags?.[0]?.tag_id || '';
    const primaryTagNode = TAXONOMY_FROM_CSV.find(n => n.id === primaryTagId);
    
    console.log(`\n[${idx + 31}] ${q.display_id} | Type: ${q.type}`);
    console.log(`Primary Tag: ${primaryTagNode?.name || 'NONE'}`);
    console.log(`Question: ${q.question_text?.markdown?.substring(0, 150)}...`);
    
    if (q.options && q.options.length > 0) {
      console.log(`Options:`);
      q.options.slice(0, 2).forEach((opt: any, i: number) => {
        const marker = opt.is_correct ? '✓' : ' ';
        console.log(`  [${marker}] ${String.fromCharCode(65 + i)}. ${opt.text.substring(0, 60)}`);
      });
    }
    
    console.log(`Current: Micro=${q.metadata?.microConcept || '❌'} | Cog=${q.metadata?.cognitiveType || '❌'} | Calc=${q.metadata?.calcLoad || '❌'}`);
    console.log('-'.repeat(100));
  });

  await mongoose.disconnect();
  console.log('\n✅ Analysis complete');
}

main().catch(console.error);
