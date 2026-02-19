const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '../../.env.local' });
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local');
const QUESTIONS_DIR = path.join(__dirname, '../data/questions');

async function sync() {
    console.log("Starting Sync: JSON -> MongoDB");

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json'));
        let totalCount = 0;
        const allIds = new Set();

        for (const file of files) {
            const content = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
            console.log(`Processing ${file} (${content.length} questions)...`);

            const collection = mongoose.connection.db.collection('questions');

            // Bulk Write for efficiency
            const bulkOps = content.map(q => {
                // Ensure specific fields map correctly if needed
                // q object basically matches the schema we migrated to
                // Map camelCase (JSON) to snake_case (Mongo) if there's a mismatch in my previous migration script?
                // Wait, my `migrate_questions.js` preserved the structure from `questions.json` which was camelCase in key names?
                // Let's check `actions.ts` mapping.
                // variables: `q.textMarkdown` vs `doc.text_markdown`.
                // My migration script `migrate_questions.js` just did `...rest` from the loaded questions.
                // The loaded questions from `questions.json` were output of `actions.ts` -> `getQuestions`?
                // No, `questions.json` seemed to be a mix.
                // I need to ensure the JSON files have the CORRECT format for `actions.ts` or `QuestionModel`.

                // Let's assume the JSON files currently hold the "Frontend Question Object" format (camelCase).
                // But Mongo expects snake_case for some fields usually?
                // `actions.ts` has `mapQuestionToDoc`. I should reuse that logic or duplicate it here.

                // Mapping:
                return {
                    updateOne: {
                        filter: { _id: q.id },
                        update: { $set: mapQuestionToMongo(q) },
                        upsert: true
                    }
                };
            });

            if (bulkOps.length > 0) {
                await collection.bulkWrite(bulkOps);
            }

            content.forEach(q => allIds.add(q.id));
            totalCount += content.length;
        }

        console.log(`Upserted ${totalCount} questions.`);

        // Verification/Cleanup: Remove questions in Mongo that are NOT in JSON (optional but good for strict sync)
        // However, be careful not to delete things we didn't migrate yet?
        // Current JSONs cover ALL known questions. So safe to simple cleanup?
        // Let's count Mongo first.
        const collection = mongoose.connection.db.collection('questions');
        const count = await collection.countDocuments({});
        console.log(`MongoDB currently has ${count} documents.`);

        // Uncomment to enable strict sync (delete orphans)
        // const deleteResult = await collection.deleteMany({ _id: { $nin: Array.from(allIds) } });
        // console.log(`Deleted ${deleteResult.deletedCount} orphaned documents.`);

    } catch (e) {
        console.error("Sync failed:", e);
    } finally {
        await mongoose.disconnect();
    }
}

function mapQuestionToMongo(q) {
    // Maps JSON (Frontend Type) to MongoDB Schema
    // Based on `actions.ts` mapQuestionToDoc

    // Priority: conceptTags > tagId
    let tags = [];
    if (q.conceptTags && q.conceptTags.length > 0) {
        tags = q.conceptTags.map(t => ({ tag_id: t.tagId, weight: t.weight }));
    } else if (q.tagId) {
        tags = [{ tag_id: q.tagId, weight: 1.0 }];
    }

    return {
        _id: q.id,
        question_code: q.questionCode,
        text_markdown: q.textMarkdown,
        type: q.questionType || q.type, // Handle both if present
        options: (q.options || []).map(o => ({
            id: o.id,
            text: o.text,
            is_correct: o.isCorrect,
            image_scale: o.imageScale
        })),
        integer_answer: q.integerAnswer,
        tags: tags,
        meta: {
            difficulty: q.difficulty || q.meta?.difficulty,
            exam: q.examSource || q.meta?.exam, // Heuristic
            year: q.year || q.meta?.year,
            shift: q.shift || q.meta?.shift
        },
        chapter_id: q.chapterId,
        is_pyq: q.isPYQ,
        is_top_pyq: q.isTopPYQ,
        exam_source: q.examSource,
        solution: {
            text_latex: q.solution?.textSolutionLatex || q.solution?.text_latex,
            video_url: q.solution?.videoUrl,
            video_timestamp_start: q.solution?.videoTimestampStart,
            audio_url: q.solution?.audioExplanationUrl,
            image_url: q.solution?.handwrittenSolutionImageUrl
        },
        tag_id: q.tagId,
        image_scale: q.imageScale,
        solution_image_scale: q.solutionImageScale
    };
}

sync();
