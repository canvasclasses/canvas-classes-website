#!/usr/bin/env node
/**
 * Export all ch12_carbonyl questions (ALDO-016 onwards) with exam metadata
 * Output: JSON file grouped by exam paper for easy resequencing
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment');
  process.exit(1);
}

async function exportCarbonylQuestions() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('crucible');
    const collection = db.collection('questions_v2');

    console.log('📊 Fetching all ch12_carbonyl questions...\n');

    const questions = await collection
      .find({
        'metadata.chapter_id': 'ch12_carbonyl',
        deleted_at: null,
        display_id: { $regex: /^ALDO-\d+$/ } // Only ALDO questions (not CARB-001/002)
      })
      .sort({ display_id: 1 })
      .toArray();

    console.log(`✓ Found ${questions.length} questions\n`);

    // Group by exam paper
    const byPaper = {};
    const noExamSource = [];

    questions.forEach(q => {
      const es = q.metadata?.exam_source;
      if (!es || !es.year || !es.month) {
        noExamSource.push({
          _id: q._id.toString(),
          display_id: q.display_id,
          question_preview: q.question_text.markdown.substring(0, 80),
          exam_source: es || null
        });
        return;
      }

      const key = `${es.exam || 'JEE Main'} ${es.year} ${es.month || ''} ${es.day || ''} ${es.shift || ''}`.trim();
      
      if (!byPaper[key]) {
        byPaper[key] = {
          exam: es.exam || 'JEE Main',
          year: es.year,
          month: es.month || null,
          day: es.day || null,
          shift: es.shift || null,
          questions: []
        };
      }

      byPaper[key].questions.push({
        _id: q._id.toString(),
        current_display_id: q.display_id,
        question_text_preview: q.question_text.markdown.substring(0, 100).replace(/\n/g, ' '),
        type: q.type,
        difficulty: q.metadata.difficulty,
        tags: q.metadata.tags?.map(t => t.tag_id) || []
      });
    });

    // Sort papers by year desc, then month
    const monthOrder = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
    const sortedPapers = Object.entries(byPaper).sort((a, b) => {
      const [, dataA] = a;
      const [, dataB] = b;
      if (dataB.year !== dataA.year) return dataB.year - dataA.year; // Newer first
      const monthA = monthOrder[dataA.month] || 0;
      const monthB = monthOrder[dataB.month] || 0;
      if (monthB !== monthA) return monthB - monthA;
      return (dataB.day || 0) - (dataA.day || 0);
    });

    // Build output
    const output = {
      exported_at: new Date().toISOString(),
      chapter_id: 'ch12_carbonyl',
      total_questions: questions.length,
      papers: sortedPapers.map(([key, data]) => ({
        paper_key: key,
        exam_metadata: {
          exam: data.exam,
          year: data.year,
          month: data.month,
          day: data.day,
          shift: data.shift
        },
        question_count: data.questions.length,
        questions: data.questions
      })),
      questions_without_exam_source: noExamSource
    };

    // Write to file
    const fs = require('fs');
    const outputPath = '/Users/CanvasClasses/Desktop/canvas/carbonyl_questions_export.json';
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✓ Exported ${questions.length} questions to:`);
    console.log(`  ${outputPath}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📋 Summary by Exam Paper:\n');
    sortedPapers.forEach(([key, data]) => {
      console.log(`  ${key.padEnd(40)} → ${data.questions.length.toString().padStart(3)} questions`);
    });

    if (noExamSource.length > 0) {
      console.log(`\n⚠️  ${noExamSource.length} questions have missing/incomplete exam_source metadata`);
    }

    console.log('\n📝 Next Steps:');
    console.log('   1. Open carbonyl_questions_export.json');
    console.log('   2. For each paper, verify the question order matches your PDF');
    console.log('   3. Use the resequencing script to generate new display_ids');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

exportCarbonylQuestions();
