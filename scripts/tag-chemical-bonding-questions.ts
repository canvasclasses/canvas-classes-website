/**
 * Script to tag Chemical Bonding questions with micro concepts, cognitive type, calc load, and entry point
 * Fetches questions from MongoDB and displays them for expert tagging
 */

import mongoose from 'mongoose';
import { QuestionV2 } from '../lib/models/Question.v2';
import { TAXONOMY_FROM_CSV } from '../app/crucible/admin/taxonomy/taxonomyData_from_csv';

const MONGODB_URI = process.env.MONGODB_URI || '';

interface QuestionSummary {
  _id: string;
  display_id: string;
  question_text_preview: string;
  current_primary_tag: string;
  current_micro_concept: string | undefined;
  current_cognitive_type: string | undefined;
  current_calc_load: string | undefined;
  current_entry_point: string | undefined;
}

async function fetchChemicalBondingQuestions(batchSize: number = 30, skip: number = 0): Promise<QuestionSummary[]> {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not set in environment');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const questions = await QuestionV2.find({
    'metadata.chapter_id': 'ch11_bonding',
    deleted_at: null,
  })
    .sort({ display_id: 1 })
    .skip(skip)
    .limit(batchSize)
    .lean();

  console.log(`\n📊 Found ${questions.length} questions in batch (skip: ${skip})`);

  const summaries: QuestionSummary[] = questions.map((q: any) => {
    const primaryTagId = q.metadata?.tags?.[0]?.tag_id || 'NONE';
    const primaryTagNode = TAXONOMY_FROM_CSV.find(n => n.id === primaryTagId);
    const primaryTagName = primaryTagNode?.name || primaryTagId;

    // Extract first 150 chars of question text
    const questionText = q.question_text?.markdown || '';
    const preview = questionText.substring(0, 150).replace(/\n/g, ' ');

    return {
      _id: q._id.toString(),
      display_id: q.display_id,
      question_text_preview: preview,
      current_primary_tag: primaryTagName,
      current_micro_concept: q.metadata?.microConcept,
      current_cognitive_type: q.metadata?.cognitiveType,
      current_calc_load: q.metadata?.calcLoad,
      current_entry_point: q.metadata?.entryPoint,
    };
  });

  await mongoose.disconnect();
  console.log('✅ Disconnected from MongoDB\n');

  return summaries;
}

// Get batch number from command line args
const batchNumber = parseInt(process.argv[2] || '1');
const batchSize = 30;
const skip = (batchNumber - 1) * batchSize;

console.log(`\n=== CHEMICAL BONDING QUESTIONS - BATCH ${batchNumber} ===\n`);

fetchChemicalBondingQuestions(batchSize, skip)
  .then((summaries) => {
    if (summaries.length === 0) {
      console.log('✅ No more questions to tag');
      process.exit(0);
    }

    console.log('Questions to tag:\n');
    summaries.forEach((q, idx) => {
      console.log(`\n[${skip + idx + 1}] ${q.display_id}`);
      console.log(`    Question: ${q.question_text_preview}...`);
      console.log(`    Primary Tag: ${q.current_primary_tag}`);
      console.log(`    Micro Concept: ${q.current_micro_concept || '❌ NOT SET'}`);
      console.log(`    Cognitive Type: ${q.current_cognitive_type || '❌ NOT SET'}`);
      console.log(`    Calc Load: ${q.current_calc_load || '❌ NOT SET'}`);
      console.log(`    Entry Point: ${q.current_entry_point || '❌ NOT SET'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`Total questions in this batch: ${summaries.length}`);
    console.log('='.repeat(80));

    // Output JSON for easy processing
    console.log('\n\nJSON OUTPUT (for processing):');
    console.log(JSON.stringify(summaries, null, 2));
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
