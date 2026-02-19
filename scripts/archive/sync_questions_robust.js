/**
 * Robust Sync Script for Question Bank
 * - Clears MongoDB collection before syncing to prevent duplicates
 * - Validates all questions before sync
 * - Generates detailed sync report
 * - Supports dry-run mode
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '../data/questions');
const SYNC_REPORT_FILE = path.join(__dirname, '../sync_report.json');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/canvas_classes';

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_URI || MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
}

// Question Schema (simplified for sync)
const QuestionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    question_code: String,
    text_markdown: { type: String, required: true },
    type: { type: String, default: 'SCQ' },
    options: [{
        id: String,
        text: String,
        isCorrect: Boolean,
        imageScale: Number
    }],
    integer_answer: String,
    image_scale: Number,
    tags: [{
        tag_id: String,
        weight: Number
    }],
    tag_id: String,
    meta: {
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
        exam: String,
        year: Number,
        avg_time_sec: { type: Number, default: 120 }
    },
    chapter_id: String,
    is_pyq: { type: Boolean, default: false },
    is_top_pyq: { type: Boolean, default: false },
    exam_source: String,
    source_references: [{
        type: { type: String, enum: ['NCERT', 'PYQ', 'COACHING', 'OTHER'] },
        pyqExam: String,
        pyqShift: String,
        pyqYear: Number,
        similarity: String
    }],
    solution: {
        text_latex: String,
        video_url: String,
        video_timestamp_start: Number,
        audio_url: String,
        image_url: String,
        image_scale: Number
    },
    solution_image_scale: Number,
    trap: {
        likely_wrong_choice_id: String,
        message: String,
        concept_gap_tag: String
    }
}, {
    timestamps: true,
    collection: 'questions'
});

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

// Map frontend question to DB document
function mapQuestionToDoc(q) {
    let tags = [];
    if (q.conceptTags && q.conceptTags.length > 0) {
        tags = q.conceptTags.map(t => ({ tag_id: t.tagId, weight: t.weight }));
    } else if (q.tagId) {
        tags = [{ tag_id: q.tagId, weight: 1.0 }];
    }

    const examMatch = q.examSource?.match(/^([A-Za-z\s]+)\d/);
    const yearMatch = q.examSource?.match(/(\d{4})/);

    return {
        _id: q.id,
        question_code: q.questionCode,
        text_markdown: q.textMarkdown,
        type: q.questionType,
        options: q.options?.map(opt => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            imageScale: opt.imageScale
        })),
        integer_answer: q.integerAnswer,
        tags,
        meta: {
            difficulty: q.difficulty || 'Medium',
            exam: examMatch ? examMatch[1].trim() : 'Other',
            year: yearMatch ? parseInt(yearMatch[1]) : undefined,
            avg_time_sec: 120
        },
        chapter_id: q.chapterId,
        is_pyq: q.isPYQ,
        is_top_pyq: q.isTopPYQ,
        exam_source: q.examSource,
        source_references: q.sourceReferences || [],
        solution: {
            text_latex: q.solution?.textSolutionLatex || '',
            video_url: q.solution?.videoUrl,
            video_timestamp_start: q.solution?.videoTimestampStart,
            audio_url: q.solution?.audioExplanationUrl,
            image_url: q.solution?.handwrittenSolutionImageUrl,
            image_scale: q.solution?.imageScale
        },
        tag_id: q.tagId,
        image_scale: q.imageScale,
        solution_image_scale: q.solutionImageScale,
        trap: q.trap
    };
}

// Validate a question
function validateQuestion(q, fileName) {
    const errors = [];
    
    if (!q.id) errors.push('Missing ID');
    if (!q.textMarkdown?.trim()) errors.push('Missing question text');
    if (!q.chapterId) errors.push('Missing chapter ID');
    if (!q.solution?.textSolutionLatex) errors.push('Missing solution');
    
    if (q.options && q.options.length > 0) {
        const hasCorrect = q.options.some(o => o.isCorrect);
        if (!hasCorrect) errors.push('No correct answer marked');
    }
    
    return {
        valid: errors.length === 0,
        errors,
        file: fileName
    };
}

async function syncQuestions(options = { dryRun: false, clearFirst: true }) {
    const report = {
        startTime: new Date().toISOString(),
        dryRun: options.dryRun,
        summary: {
            filesProcessed: 0,
            totalQuestions: 0,
            validQuestions: 0,
            invalidQuestions: 0,
            syncedToDB: 0,
            errors: 0
        },
        byChapter: {},
        validationErrors: [],
        dbErrors: []
    };
    
    console.log('🔄 Starting Question Bank Sync...\n');
    if (options.dryRun) {
        console.log('⚠️  DRY RUN MODE - No changes will be made to database\n');
    }
    
    // Connect to DB
    await connectToDatabase();
    
    // Clear existing questions if requested
    if (options.clearFirst && !options.dryRun) {
        console.log('🗑️  Clearing existing questions from MongoDB...');
        const deleteResult = await Question.deleteMany({});
        console.log(`   Deleted ${deleteResult.deletedCount} existing questions\n`);
        report.clearedCount = deleteResult.deletedCount;
    }
    
    // Read all question files
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const allQuestions = [];
    
    for (const file of files) {
        const filePath = path.join(DATA_DIR, file);
        const chapterId = file.replace('.json', '');
        
        try {
            const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            report.summary.filesProcessed++;
            report.byChapter[chapterId] = {
                file,
                total: questions.length,
                valid: 0,
                invalid: 0
            };
            
            console.log(`📁 ${file}: ${questions.length} questions`);
            
            for (const q of questions) {
                const validation = validateQuestion(q, file);
                
                if (validation.valid) {
                    allQuestions.push(q);
                    report.summary.validQuestions++;
                    report.byChapter[chapterId].valid++;
                } else {
                    report.summary.invalidQuestions++;
                    report.byChapter[chapterId].invalid++;
                    report.validationErrors.push({
                        id: q.id || 'unknown',
                        file,
                        errors: validation.errors
                    });
                }
            }
        } catch (error) {
            console.error(`❌ Error reading ${file}:`, error.message);
            report.dbErrors.push({ file, error: error.message });
        }
    }
    
    report.summary.totalQuestions = allQuestions.length;
    
    console.log(`\n📊 Validation Complete:`);
    console.log(`   Valid: ${report.summary.validQuestions}`);
    console.log(`   Invalid: ${report.summary.invalidQuestions}`);
    
    // Sync to database
    if (!options.dryRun && allQuestions.length > 0) {
        console.log('\n💾 Syncing to MongoDB...');
        
        const docs = allQuestions.map(mapQuestionToDoc);
        
        try {
            // Use bulkWrite for efficiency
            const bulkOps = docs.map(doc => ({
                updateOne: {
                    filter: { _id: doc._id },
                    update: { $set: doc },
                    upsert: true
                }
            }));
            
            const result = await Question.collection.bulkWrite(bulkOps, { ordered: false });
            report.summary.syncedToDB = result.upsertedCount + result.modifiedCount;
            console.log(`✅ Synced ${report.summary.syncedToDB} questions to MongoDB`);
            
        } catch (error) {
            console.error('❌ Bulk write failed:', error.message);
            report.dbErrors.push({ error: error.message });
            
            // Fall back to individual inserts
            console.log('   Falling back to individual inserts...');
            let successCount = 0;
            
            for (const doc of docs) {
                try {
                    await Question.findOneAndUpdate(
                        { _id: doc._id },
                        { $set: doc },
                        { upsert: true }
                    );
                    successCount++;
                } catch (err) {
                    report.dbErrors.push({ id: doc._id, error: err.message });
                }
            }
            
            report.summary.syncedToDB = successCount;
            console.log(`✅ Synced ${successCount} questions (fallback mode)`);
        }
    } else if (options.dryRun) {
        console.log(`\n📝 Would sync ${allQuestions.length} questions to MongoDB`);
    }
    
    report.endTime = new Date().toISOString();
    
    // Save report
    fs.writeFileSync(SYNC_REPORT_FILE, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved to: ${SYNC_REPORT_FILE}`);
    
    // Summary by chapter
    console.log('\n📊 By Chapter:');
    for (const [chapter, stats] of Object.entries(report.byChapter).sort((a, b) => b[1].valid - a[1].valid)) {
        console.log(`   ${chapter}: ${stats.valid} valid, ${stats.invalid} invalid`);
    }
    
    // Show validation errors
    if (report.validationErrors.length > 0) {
        console.log('\n⚠️  Validation Errors (first 10):');
        report.validationErrors.slice(0, 10).forEach((err, i) => {
            console.log(`   ${i + 1}. ${err.id} (${err.file}): ${err.errors.join(', ')}`);
        });
    }
    
    return report;
}

async function verifySync() {
    console.log('\n🔍 Verifying sync...\n');
    
    const dbCount = await Question.countDocuments();
    console.log(`MongoDB: ${dbCount} questions`);
    
    // Count questions in files
    let fileCount = 0;
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
        const questions = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
        fileCount += questions.length;
    }
    console.log(`Files:   ${fileCount} questions`);
    
    if (dbCount === fileCount) {
        console.log('✅ Counts match!');
    } else {
        console.log(`⚠️  Mismatch: ${Math.abs(dbCount - fileCount)} questions difference`);
    }
    
    return { dbCount, fileCount, match: dbCount === fileCount };
}

// Main
async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const noClear = args.includes('--no-clear');
    const verify = args.includes('--verify');
    
    try {
        const report = await syncQuestions({
            dryRun,
            clearFirst: !noClear
        });
        
        if (verify || (!dryRun && report.summary.syncedToDB > 0)) {
            await verifySync();
        }
        
        console.log('\n🎉 Sync complete!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Sync failed:', error);
        process.exit(1);
    }
}

main();
