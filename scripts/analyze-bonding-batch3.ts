/**
 * Analyze Chemical Bonding questions - Batch 3 (questions 61-90)
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

  const questions = await QuestionV2.find({
    'metadata.chapter_id': 'ch11_bonding',
    deleted_at: null,
  })
    .sort({ display_id: 1 })
    .skip(60)
    .limit(30)
    .lean();

  console.log(`📊 Batch 3: ${questions.length} questions\n`);

  questions.forEach((q: any, idx) => {
    const primaryTagId = q.metadata?.tags?.[0]?.tag_id || '';
    const primaryTagNode = TAXONOMY_FROM_CSV.find(n => n.id === primaryTagId);
    
    console.log(`[${idx + 61}] ${q.display_id} | ${q.type} | ${primaryTagNode?.name || 'NONE'}`);
    console.log(`Q: ${q.question_text?.markdown?.substring(0, 120)}...`);
    console.log('-'.repeat(100));
  });

  await mongoose.disconnect();
}

main().catch(console.error);
