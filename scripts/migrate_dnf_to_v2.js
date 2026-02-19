/**
 * migrate_dnf_to_v2.js
 * Migrates DNF-PYQ-* questions from the JSON file into the questions_v2 collection
 * using the correct QuestionV2 schema (metadata.chapter_id, question_text.markdown, etc.)
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const JSON_FILE = path.join(__dirname, '../data/questions/chapter_d_and_f_block.json');

async function migrate() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    const col = mongoose.connection.db.collection('questions_v2');

    const questions = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    console.log(`Loaded ${questions.length} DNF questions from JSON`);

    // Check existing
    const existing = await col.countDocuments({ 'metadata.chapter_id': 'ch12_dblock' });
    console.log(`Existing ch12_dblock questions in questions_v2: ${existing}`);

    const bulkOps = questions.map(q => {
        const uuid = uuidv4();
        const doc = {
            _id: uuid,
            display_id: q.id, // e.g. DNF-PYQ-001

            question_text: {
                markdown: q.textMarkdown || '',
                latex_validated: false,
            },
            type: q.questionType || 'SCQ',
            options: (q.options || []).map(o => ({
                id: o.id,
                text: o.text || '',
                is_correct: o.isCorrect === true,
            })),
            answer: q.integerAnswer ? { integer_value: parseInt(q.integerAnswer) } : undefined,
            solution: {
                text_markdown: q.solution?.textSolutionLatex || '',
                latex_validated: false,
            },
            metadata: {
                difficulty: q.difficulty || 'Medium',
                chapter_id: 'ch12_dblock',
                tags: (q.conceptTags || []).map(t => ({
                    tag_id: t.tagId,
                    weight: t.weight || 1,
                })),
                exam_source: q.examSource ? { exam: q.examSource } : undefined,
                is_pyq: q.isPYQ === true,
                is_top_pyq: q.isTopPYQ === true,
            },
            status: 'published',
            quality_score: 70,
            needs_review: false,
            version: 1,
            created_at: new Date(),
            created_by: 'migration_script',
            updated_at: new Date(),
            updated_by: 'migration_script',
            asset_ids: [],
            svg_scales: {},
        };

        return {
            updateOne: {
                filter: { display_id: q.id },
                update: { $setOnInsert: doc },
                upsert: true,
            },
        };
    });

    const result = await col.bulkWrite(bulkOps);
    console.log(`Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);

    const total = await col.countDocuments({ 'metadata.chapter_id': 'ch12_dblock' });
    console.log(`Total ch12_dblock questions in questions_v2 now: ${total}`);

    await mongoose.disconnect();
    console.log('Done.');
}

migrate().catch(e => { console.error(e); process.exit(1); });
