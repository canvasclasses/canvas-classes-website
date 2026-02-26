// POC - Ingest ALL 104 questions from MD file in correct sequence
// Questions start at 108 and go to 211 in MD file
// Will be ingested as POC-NEW-001 to POC-NEW-104
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Sample of first 20 questions - will create full script in batches
const questions = [
  // Q108 -> POC-NEW-001
  { _id: uuidv4(), display_id: 'POC-NEW-001', question_text: { markdown: `Match List-I with List-II.\n\n| List-I (Purification technique) | List-II (Mixture of organic compounds) |\n|---|---|\n| (A) Distillation (simple) | (I) Diesel + Petrol |\n| (B) Fractional distillation | (II) Aniline + Water |\n| (C) Distillation under reduced pressure | (III) Chloroform + Aniline |\n| (D) Steam distillation | (IV) Glycerol + Spent-lye |\n\nChoose the correct answer from the options given below:`, latex_validated: true }, type: 'SCQ', options: [{ id: 'a', text: '(A)-(II), (B)-(III), (C)-(IV), (D)-(I)', is_correct: false }, { id: 'b', text: '(A)-(II), (B)-(IV), (C)-(I), (D)-(III)', is_correct: false }, { id: 'c', text: '(A)-(III), (B)-(IV), (C)-(II), (D)-(I)', is_correct: false }, { id: 'd', text: '(A)-(III), (B)-(I), (C)-(IV), (D)-(II)', is_correct: true }], answer: { correct_option: 'd', explanation: 'Match purification techniques with mixtures.' }, solution: { text_markdown: `Matching based on separation principles.\n\nAnswer: **(d)**`, latex_validated: true }, metadata: { difficulty: 'Medium', chapter_id: 'ch11_prac_org', tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'April', day: 2, shift: 'Shift-II' } }, status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85 },

  // Q109 -> POC-NEW-002
  { _id: uuidv4(), display_id: 'POC-NEW-002', question_text: { markdown: `Match List-I with List-II.\n\n| List-I (Separation of) | List-II (Separation Technique) |\n|---|---|\n| (A) Aniline from aniline-water mixture | (I) Simple distillation |\n| (B) Glycerol from spent-lye in soap industry | (II) Fractional distillation |\n| (C) Different fractions of crude oil in petroleum industry | (III) Distillation at reduced pressure |\n| (D) Chloroform-Aniline mixture | (IV) Steam distillation |\n\nChoose the correct answer from the options given below:`, latex_validated: true }, type: 'SCQ', options: [{ id: 'a', text: '(A)-(IV), (B)-(III), (C)-(II), (D)-(I)', is_correct: true }, { id: 'b', text: '(A)-(I), (B)-(II), (C)-(III), (D)-(IV)', is_correct: false }, { id: 'c', text: '(A)-(III), (B)-(IV), (C)-(I), (D)-(II)', is_correct: false }, { id: 'd', text: '(A)-(II), (B)-(I), (C)-(IV), (D)-(III)', is_correct: false }], answer: { correct_option: 'a', explanation: 'Match separation techniques.' }, solution: { text_markdown: `Answer: **(a)**`, latex_validated: true }, metadata: { difficulty: 'Medium', chapter_id: 'ch11_prac_org', tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'April', day: 4, shift: 'Shift-II' } }, status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 85 },

  // Q110 -> POC-NEW-003
  { _id: uuidv4(), display_id: 'POC-NEW-003', question_text: { markdown: `The purification method based on the following physical transformation is:\n\n![Transformation](image)`, latex_validated: true }, type: 'SCQ', options: [{ id: 'a', text: 'Sublimation', is_correct: true }, { id: 'b', text: 'Crystallization', is_correct: false }, { id: 'c', text: 'Extraction', is_correct: false }, { id: 'd', text: 'Distillation', is_correct: false }], answer: { correct_option: 'a', explanation: 'Solid to gas to solid transformation is sublimation.' }, solution: { text_markdown: `Answer: **(a)**`, latex_validated: true }, metadata: { difficulty: 'Easy', chapter_id: 'ch11_prac_org', tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'Jan', day: 28, shift: 'Shift-II' } }, status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88 },

  // Q111 -> POC-NEW-004
  { _id: uuidv4(), display_id: 'POC-NEW-004', question_text: { markdown: `Given below are two statements:\n\n**Statement (I):** In partition chromatography, stationary phase is thin film of liquid present in the inert support.\n\n**Statement (II):** In paper chromatography, the material of paper acts as a stationary phase.\n\nIn the light of the above statements, choose the correct answer:`, latex_validated: true }, type: 'SCQ', options: [{ id: 'a', text: 'Statement I is true but Statement II is false', is_correct: false }, { id: 'b', text: 'Statement I is false but Statement II is true', is_correct: false }, { id: 'c', text: 'Both Statement I and Statement II are false', is_correct: false }, { id: 'd', text: 'Both Statement I and Statement II are true', is_correct: true }], answer: { correct_option: 'd', explanation: 'Both statements are correct.' }, solution: { text_markdown: `Answer: **(d)**`, latex_validated: true }, metadata: { difficulty: 'Easy', chapter_id: 'ch11_prac_org', tags: [{ tag_id: 'tag_poc_2', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2025, month: 'Jan', day: 29, shift: 'Shift-II' } }, status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 88 },

  // Q112 -> POC-NEW-005
  { _id: uuidv4(), display_id: 'POC-NEW-005', question_text: { markdown: `The technique used for purification of steam volatile water immiscible substance is:`, latex_validated: true }, type: 'SCQ', options: [{ id: 'a', text: 'Fractional distillation', is_correct: false }, { id: 'b', text: 'Fractional distillation under reduced pressure', is_correct: false }, { id: 'c', text: 'Distillation', is_correct: false }, { id: 'd', text: 'Steam distillation', is_correct: true }], answer: { correct_option: 'd', explanation: 'Steam distillation for steam volatile water immiscible substances.' }, solution: { text_markdown: `Answer: **(d)**`, latex_validated: true }, metadata: { difficulty: 'Easy', chapter_id: 'ch11_prac_org', tags: [{ tag_id: 'tag_poc_1', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: { exam: 'JEE Main', year: 2024, month: 'Jan', day: 27, shift: 'Shift-II' } }, status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null, asset_ids: [], quality_score: 90 }
];

async function run() {
  console.log('\n=== POC INGESTION - SAMPLE BATCH (First 5 questions) ===\n');
  console.log('NOTE: This is a sample. Full ingestion requires all 104 questions.\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('questions_v2');
    
    for (const q of questions) {
      await collection.insertOne(q);
      console.log(`✅ Inserted ${q.display_id} (MD Q${parseInt(q.display_id.split('-')[2]) + 107}) - ${q.metadata.exam_source.year}`);
    }
    
    console.log(`\n✅ Sample batch complete: ${questions.length} questions`);
    console.log(`📊 Remaining: 99 questions to complete full POC ingestion`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
