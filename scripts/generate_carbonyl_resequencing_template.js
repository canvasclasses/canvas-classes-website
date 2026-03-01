#!/usr/bin/env node
/**
 * Generate a resequencing template for ch12_carbonyl questions
 * This creates a CSV/TSV that you can edit in Excel/Google Sheets
 * Format: current_display_id | exam_metadata | question_preview | new_display_id
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function generateTemplate() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('crucible');
    const collection = db.collection('questions_v2');

    const questions = await collection
      .find({
        'metadata.chapter_id': 'ch12_carbonyl',
        deleted_at: null,
        display_id: { $regex: /^ALDO-\d+$/ }
      })
      .sort({ display_id: 1 })
      .toArray();

    console.log(`✓ Found ${questions.length} ALDO questions\n`);

    // Create TSV for easy Excel editing
    const rows = [
      ['current_display_id', 'exam', 'year', 'month', 'day', 'shift', 'difficulty', 'type', 'question_preview', 'new_display_id', 'new_sequence'].join('\t')
    ];

    questions.forEach((q, idx) => {
      const es = q.metadata?.exam_source || {};
      const preview = q.question_text.markdown
        .substring(0, 120)
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ')
        .trim();

      rows.push([
        q.display_id,
        es.exam || '',
        es.year || '',
        es.month || '',
        es.day || '',
        es.shift || '',
        q.metadata.difficulty || '',
        q.type,
        preview,
        q.display_id, // Placeholder — user will edit this
        idx + 16 // Starting from ALDO-016
      ].join('\t'));
    });

    const tsvPath = '/Users/CanvasClasses/Desktop/canvas/carbonyl_resequencing_template.tsv';
    fs.writeFileSync(tsvPath, rows.join('\n'));

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✓ Template saved to: ${tsvPath}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📝 Instructions:');
    console.log('   1. Open the TSV file in Excel/Google Sheets');
    console.log('   2. Sort by exam metadata (year, month, day, shift)');
    console.log('   3. Manually reorder rows to match your PDF sequence');
    console.log('   4. Update the "new_sequence" column (16, 17, 18...)');
    console.log('   5. The "new_display_id" will auto-generate as ALDO-{sequence}');
    console.log('   6. Save and use the apply script to update the database\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

generateTemplate();
