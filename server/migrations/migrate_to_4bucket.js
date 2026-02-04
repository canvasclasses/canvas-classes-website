/**
 * The Crucible - Migration Script
 * 
 * PURPOSE: Convert existing questions.json to the 4-Bucket Architecture
 * 
 * This script:
 * 1. Reads the current flat JSON file
 * 2. Transforms each question to the new schema
 * 3. Creates the initial Taxonomy from unique tags
 * 4. Outputs new JSON files ready for MongoDB import
 * 
 * RUN: node server/migrations/migrate_to_4bucket.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const SOURCE_PATH = path.join(__dirname, '../../app/the-crucible/questions.json');
const OUTPUT_QUESTIONS = path.join(__dirname, '../seed/questions_migrated.json');
const OUTPUT_TAXONOMY = path.join(__dirname, '../seed/taxonomy_seed.json');

// Exam source parser
function parseExamSource(examSource) {
    if (!examSource) return { exam: null, year: null };

    const lower = examSource.toLowerCase();
    let exam = 'Other';
    let year = null;

    // Detect exam type
    if (lower.includes('advanced') || lower.includes('adv')) {
        exam = 'JEE Advanced';
    } else if (lower.includes('main') || lower.includes('aieee')) {
        exam = 'JEE Mains';
    } else if (lower.includes('neet')) {
        exam = 'NEET';
    } else if (lower.includes('cbse')) {
        exam = 'CBSE';
    }

    // Extract year
    const yearMatch = examSource.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
        year = parseInt(yearMatch[0]);
    }

    return { exam, year };
}

// Convert tag string to TAG_ID format
function normalizeTagId(tagId) {
    if (!tagId) return 'TAG_UNCLASSIFIED';
    return 'TAG_' + tagId.toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

// Main migration
async function migrate() {
    console.log('🚀 Starting 4-Bucket Migration...\n');

    // Read source
    const rawData = fs.readFileSync(SOURCE_PATH, 'utf-8');
    const questions = JSON.parse(rawData);
    console.log(`📦 Loaded ${questions.length} questions from source.\n`);

    // Track unique tags for taxonomy
    const uniqueTags = new Map();
    const chapterToTags = new Map();

    // Transform questions
    const migratedQuestions = questions.map((q, idx) => {
        const normalizedTagId = normalizeTagId(q.tagId);
        const { exam, year } = parseExamSource(q.examSource);

        // Build tag entry for taxonomy
        if (!uniqueTags.has(normalizedTagId)) {
            uniqueTags.set(normalizedTagId, {
                _id: normalizedTagId,
                name: q.tagId ? q.tagId.replace(/_/g, ' ') : 'Unclassified',
                parent_id: null,
                subject: 'Chemistry',
                chapter: q.chapterId || 'Unknown',
                question_count: 0
            });
        }
        uniqueTags.get(normalizedTagId).question_count += 1;

        // Track chapter -> tag relationships
        if (q.chapterId) {
            if (!chapterToTags.has(q.chapterId)) {
                chapterToTags.set(q.chapterId, new Set());
            }
            chapterToTags.get(q.chapterId).add(normalizedTagId);
        }

        // Transform question
        return {
            _id: q.id,
            text_markdown: q.textMarkdown,
            type: q.type || 'MCQ',
            options: q.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                isCorrect: opt.isCorrect
            })),
            integer_answer: q.integerAnswer || null,

            // WEIGHTED TAGS (single tag with 100% weight for now)
            tags: [
                {
                    tag_id: normalizedTagId,
                    weight: 1.0
                }
            ],

            // NORMALIZED META
            meta: {
                exam: exam,
                year: year,
                difficulty: q.difficulty || 'Medium',
                avg_time_sec: 120 // Default 2 minutes
            },

            chapter_id: q.chapterId || null,
            is_pyq: q.isPYQ || false,
            is_top_pyq: q.isTopPYQ || false,

            // SOLUTION OBJECT
            solution: {
                text_latex: q.solution?.textSolutionLatex || '',
                video_url: q.solution?.videoUrl || null,
                audio_url: q.solution?.audioExplanationUrl || null,
                image_url: q.solution?.handwrittenSolutionImageUrl || null
            },

            // TRAP INFO
            trap: q.trap ? {
                likely_wrong_choice_id: q.trap.likelyWrongChoiceId,
                message: q.trap.message,
                concept_gap_tag: q.trap.conceptGapTag ? normalizeTagId(q.trap.conceptGapTag) : null
            } : null
        };
    });

    // Build taxonomy array
    const taxonomyArray = Array.from(uniqueTags.values());

    // Add chapter-level parent tags
    chapterToTags.forEach((tags, chapterId) => {
        const chapterTagId = 'TAG_CHAPTER_' + chapterId.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        taxonomyArray.push({
            _id: chapterTagId,
            name: chapterId,
            parent_id: null,
            subject: 'Chemistry',
            chapter: chapterId,
            question_count: 0,
            is_chapter_tag: true
        });

        // Set parent for child tags
        tags.forEach(tagId => {
            const tag = taxonomyArray.find(t => t._id === tagId);
            if (tag && !tag.parent_id) {
                tag.parent_id = chapterTagId;
            }
        });
    });

    // Ensure output directory exists
    const seedDir = path.dirname(OUTPUT_QUESTIONS);
    if (!fs.existsSync(seedDir)) {
        fs.mkdirSync(seedDir, { recursive: true });
    }

    // Write outputs
    fs.writeFileSync(OUTPUT_QUESTIONS, JSON.stringify(migratedQuestions, null, 2));
    fs.writeFileSync(OUTPUT_TAXONOMY, JSON.stringify(taxonomyArray, null, 2));

    console.log('✅ Migration Complete!\n');
    console.log(`📄 Questions: ${OUTPUT_QUESTIONS}`);
    console.log(`   → ${migratedQuestions.length} questions migrated`);
    console.log(`\n📄 Taxonomy: ${OUTPUT_TAXONOMY}`);
    console.log(`   → ${taxonomyArray.length} tags created`);
    console.log(`   → ${chapterToTags.size} chapter groupings\n`);

    // Validation report
    console.log('📊 Validation Report:');
    const questionsWithoutTags = migratedQuestions.filter(q => q.tags.length === 0);
    const questionsWithoutSolution = migratedQuestions.filter(q => !q.solution.text_latex);
    console.log(`   • Questions without tags: ${questionsWithoutTags.length}`);
    console.log(`   • Questions without solution: ${questionsWithoutSolution.length}`);

    // Sample output
    console.log('\n📝 Sample migrated question:');
    console.log(JSON.stringify(migratedQuestions[0], null, 2));
}

// Validation: Check all tags in questions exist in taxonomy
async function validateTagConsistency() {
    console.log('\n🔍 Validating tag consistency...\n');

    const questions = JSON.parse(fs.readFileSync(OUTPUT_QUESTIONS, 'utf-8'));
    const taxonomy = JSON.parse(fs.readFileSync(OUTPUT_TAXONOMY, 'utf-8'));

    const taxonomyIds = new Set(taxonomy.map(t => t._id));
    const orphanTags = new Set();

    questions.forEach(q => {
        q.tags.forEach(t => {
            if (!taxonomyIds.has(t.tag_id)) {
                orphanTags.add(t.tag_id);
            }
        });
    });

    if (orphanTags.size > 0) {
        console.log('⚠️ ORPHAN TAGS FOUND (exist in questions but not in taxonomy):');
        orphanTags.forEach(tag => console.log(`   • ${tag}`));
    } else {
        console.log('✅ All tags are valid!');
    }
}

// Run
migrate().then(() => validateTagConsistency());
