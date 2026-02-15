
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const mongoose = require('mongoose');
const fs = require('fs');


const MONGODB_URI = process.env.MONGODB_URI;
const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');

// Define Schema (Simplified for Import)
const questionSchema = new mongoose.Schema({
    _id: String,
    text_markdown: String,
    type: String,
    options: Array,
    integer_answer: String,
    tags: Array,
    meta: Object,
    chapter_id: String,
    is_pyq: Boolean,
    is_top_pyq: Boolean,
    exam_source: String,
    solution: Object,
    tag_id: String,
    image_scale: Number,
    solution_image_scale: Number,
    source_references: Array
}, { _id: false });

const Question = mongoose.model('Question', questionSchema);

async function pushToMongo() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined in .env.local');
        // Try reading from environment variable directly if not found in .env.local by dotenv
        if (!process.env.MONGODB_URI) process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        const questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        console.log(`Loaded ${questions.length} questions from JSON.`);

        // Filter for Atomic Structure questions only to avoid re-pushing everything unnecessarily?
        // Or just upsert everything. Upserting is safer.

        let upsertedCount = 0;
        let errorCount = 0;

        for (const q of questions) {
            // Map camelCase (JSON) to snake_case (DB)
            const doc = {
                _id: q.id,
                text_markdown: q.textMarkdown || q.text_markdown,
                type: q.questionType || q.type || 'SCQ',
                options: q.options ? q.options.map(o => ({
                    id: o.id,
                    text: o.text,
                    isCorrect: o.isCorrect,
                    explanation: o.explanation
                })) : [],
                integer_answer: q.integerAnswer || q.integer_answer,
                tags: (q.conceptTags || q.tags || []).map(t => ({
                    tag_id: t.tagId || t.tag_id,
                    weight: t.weight || 1.0
                })),
                meta: {
                    difficulty: q.difficulty || q.meta?.difficulty || 'Medium',
                    exam: q.examSource?.match(/^([A-Za-z\s]+)\d/)?.[1]?.trim() || 'JEE Main',
                    year: parseInt(q.examSource?.match(/(\d{4})/)?.[1] || '2025') || undefined,
                    avg_time_sec: q.meta?.avg_time_sec || 120
                },
                chapter_id: q.chapterId || q.chapter_id,
                is_pyq: q.isPYQ ?? q.is_pyq ?? true,
                is_top_pyq: q.isTopPYQ ?? q.is_top_pyq ?? false,
                exam_source: q.examSource || q.exam_source,
                solution: {
                    text_latex: q.solution?.textSolutionLatex || q.solution?.text_latex || "",
                    video_url: q.solution?.videoUrl || q.solution?.video_url,
                    video_timestamp_start: q.solution?.videoTimestampStart || q.solution?.video_timestamp_start,
                    audio_url: q.solution?.audioExplanationUrl || q.solution?.audio_url,
                    image_url: q.solution?.handwrittenSolutionImageUrl || q.solution?.image_url
                },
                tag_id: q.tagId || q.tag_id,
                image_scale: q.imageScale || q.image_scale,
                solution_image_scale: q.solutionImageScale || q.solution_image_scale,
                source_references: q.sourceReferences || q.source_references
            };

            try {
                await Question.findOneAndUpdate(
                    { _id: doc._id },
                    { $set: doc },
                    { upsert: true, new: true }
                );
                upsertedCount++;
                if (upsertedCount % 10 === 0) process.stdout.write('.');
            } catch (err) {
                console.error(`Error upserting ${q.id}:`, err.message);
                errorCount++;
            }
        }

        console.log(`\nOperation complete.`);
        console.log(`Upserted: ${upsertedCount}`);
        console.log(`Errors: ${errorCount}`);

        await mongoose.disconnect();

    } catch (e) {
        console.error("Script failed:", e);
    }
}

pushToMongo();
