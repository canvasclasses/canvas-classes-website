/**
 * Fetch Chemical Bonding questions for manual tagging analysis
 */

import mongoose from 'mongoose';
import { QuestionV2 } from '../lib/models/Question.v2';
import { TAXONOMY_FROM_CSV } from '../app/crucible/admin/taxonomy/taxonomyData_from_csv';
import * as fs from 'fs';

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const questions = await QuestionV2.find({
    'metadata.chapter_id': 'ch11_bonding',
    deleted_at: null,
  })
    .sort({ display_id: 1 })
    .lean();

  console.log(`📊 Total Chemical Bonding questions: ${questions.length}\n`);

  // Get all micro tags for Chemical Bonding
  const bondingPrimaryTags = TAXONOMY_FROM_CSV.filter(n => n.parent_id === 'ch11_bonding' && n.type === 'topic');
  const microTagsMap = new Map<string, string[]>();
  
  bondingPrimaryTags.forEach(pt => {
    const microTags = TAXONOMY_FROM_CSV.filter(n => n.parent_id === pt.id && n.type === 'micro_topic');
    microTagsMap.set(pt.id, microTags.map(mt => mt.name));
  });

  // Prepare data for export
  const exportData = questions.map((q: any) => {
    const primaryTagId = q.metadata?.tags?.[0]?.tag_id || '';
    const primaryTagNode = TAXONOMY_FROM_CSV.find(n => n.id === primaryTagId);
    const availableMicroTags = microTagsMap.get(primaryTagId) || [];

    return {
      _id: q._id.toString(),
      display_id: q.display_id,
      question_text: q.question_text?.markdown || '',
      options: q.options?.map((opt: any) => opt.text) || [],
      type: q.type,
      primary_tag_id: primaryTagId,
      primary_tag_name: primaryTagNode?.name || 'UNKNOWN',
      available_micro_tags: availableMicroTags,
      current_micro_concept: q.metadata?.microConcept || '',
      current_cognitive_type: q.metadata?.cognitiveType || '',
      current_calc_load: q.metadata?.calcLoad || '',
      current_entry_point: q.metadata?.entryPoint || '',
      current_is_multi_concept: q.metadata?.isMultiConcept || false,
    };
  });

  // Save to JSON file
  fs.writeFileSync(
    'chemical-bonding-questions.json',
    JSON.stringify(exportData, null, 2)
  );

  console.log('✅ Exported to chemical-bonding-questions.json');
  console.log(`\nSummary:`);
  console.log(`- Total questions: ${exportData.length}`);
  console.log(`- Questions with micro concept: ${exportData.filter(q => q.current_micro_concept).length}`);
  console.log(`- Questions with cognitive type: ${exportData.filter(q => q.current_cognitive_type).length}`);
  console.log(`- Questions with calc load: ${exportData.filter(q => q.current_calc_load).length}`);
  console.log(`- Questions with entry point: ${exportData.filter(q => q.current_entry_point).length}`);

  await mongoose.disconnect();
}

main().catch(console.error);
