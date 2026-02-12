/**
 * Sync Questions JSON to MongoDB
 * 
 * This script reads the local questions-migrated.json file and syncs it to the MongoDB database.
 * It handles the transformation from the camelCase JSON format to the snake_case MongoDB schema.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// MongoDB Connection String
const MONGODB_URI = 'mongodb+srv://REDACTED:REDACTED@REDACTED/crucible?retryWrites=true&w=majority&appName=Crucible-Cluster';

// Path to the questions file
const QUESTIONS_PATH = path.join(__dirname, '../app/the-crucible/questions-migrated.json');

// Define Schema (Simplified for script usage)
const questionSchema = new mongoose.Schema({
    _id: String,
    text_markdown: String,
    type: { type: String, default: 'SCQ' },
    options: [{
        id: String,
        text: String,
        isCorrect: Boolean
    }],
    integer_answer: String,
    tags: [{
        tag_id: String,
        weight: Number
    }],
    meta: {
        difficulty: String,
        exam: String,
        year: Number,
        avg_time_sec: Number
    },
    chapter_id: String,
    is_pyq: Boolean,
    is_top_pyq: Boolean,
    exam_source: String,
    solution: {
        text_latex: String,
        video_url: String,
        video_timestamp_start: Number,
        audio_url: String,
        image_url: String
    },
    tag_id: String,
    image_scale: Number,
    solution_image_scale: Number,
    source_references: Array
}, { _id: false });

const Question = mongoose.model('Question', questionSchema);

async function syncQuestions() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        console.log(`Reading questions from ${QUESTIONS_PATH}...`);
        const questions = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));
        console.log(`Found ${questions.length} questions in local file.`);

        let syncedCount = 0;
        let errorCount = 0;

        for (const q of questions) {
            try {
                // Map Question (camelCase) -> DB Document (snake_case)
                const doc = {
                    _id: q.id,
                    text_markdown: q.textMarkdown,
                    type: q.questionType || 'SCQ',
                    options: q.options,
                    integer_answer: q.integerAnswer,
                    tags: (q.conceptTags || []).map(t => ({
                        tag_id: t.tagId,
                        weight: t.weight
                    })),
                    meta: {
                        difficulty: q.difficulty,
                        // Extract exam name
                        exam: q.examSource?.match(/^([A-Za-z\s]+)\d/)?.[1]?.trim() || 'Other',
                        // Extract year
                        year: parseInt(q.examSource?.match(/(\d{4})/)?.[1] || '0') || undefined,
                        avg_time_sec: 120
                    },
                    chapter_id: q.chapterId,
                    is_pyq: q.isPYQ || false,
                    is_top_pyq: q.isTopPYQ || false,
                    exam_source: q.examSource,
                    solution: {
                        text_latex: q.solution?.textSolutionLatex || "",
                        video_url: q.solution?.videoUrl,
                        video_timestamp_start: q.solution?.videoTimestampStart,
                        audio_url: q.solution?.audioExplanationUrl,
                        image_url: q.solution?.handwrittenSolutionImageUrl
                    },
                    tag_id: q.tagId,
                    image_scale: q.imageScale,
                    solution_image_scale: q.solutionImageScale,
                    source_references: q.sourceReferences
                };

                // Upsert into MongoDB
                await Question.findByIdAndUpdate(
                    q.id,
                    { $set: doc },
                    { upsert: true, new: true }
                );

                syncedCount++;
                if (syncedCount % 50 === 0) {
                    process.stdout.write('.');
                }
            } catch (err) {
                console.error(`Error syncing question ${q.id}:`, err.message);
                errorCount++;
            }
        }

        console.log('\n');
        console.log(`✅ Sync Complete!`);
        console.log(`Successfully synced: ${syncedCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (error) {
        console.error('Fatal error during sync:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

syncQuestions();
