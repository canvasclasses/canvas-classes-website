const { createClient } = require('@supabase/supabase-js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

// --- Configuration ---
const MONGODB_URI = process.env.MONGODB_URI;
const QUESTIONS_DIR = path.join(__dirname, '../data/questions');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Chapter Prefix Map (Reuse from migration script)
const PREFIX_MAP = {
    "chapter_basic_concepts_mole_concept": "MOLE",
    "chapter_atomic_structure": "ATOM",
    "chapter_thermodynamics": "THERMO",
    "chapter_chemical_equilibrium": "EQUIL",
    "chapter_ionic_equilibrium": "IONIC",
    "chapter_redox_reactions": "REDOX",
    "chapter_solid_state": "SOLID",
    "chapter_solutions": "SOLN",
    "chapter_electrochemistry": "ELECTRO",
    "chapter_chemical_kinetics": "KINETICS",
    "chapter_surface_chemistry": "SURFACE",
    "chapter_gaseous_state": "GAS",
    "chapter_periodic_properties": "PERIODIC",
    "chapter_chemical_bonding": "BONDING"
};

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Helper to generate standardized ID
function generateStandardId(chapterId, index) {
    const prefix = PREFIX_MAP[chapterId] || "GEN";
    return `${prefix}-${String(index + 1).padStart(3, '0')}`;
}

async function restore() {
    console.log("Starting Recovery from Supabase...");

    // 1. Fetch from Supabase
    let allQuestions = [];
    let page = 0;
    const pageSize = 1000;

    while (true) {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error("Supabase Fetch Error:", error);
            break;
        }

        if (!data || data.length === 0) break;

        allQuestions = allQuestions.concat(data);
        page++;
    }

    console.log(`Fetched ${allQuestions.length} questions from Supabase.`);

    // 2. Group Supabase questions by chapter
    const grouped = {};

    allQuestions.forEach(q => {
        const chId = q.chapter_id || "chapter_uncategorized";
        if (!grouped[chId]) grouped[chId] = [];
        grouped[chId].push(q);
    });

    // 3. Process Each Chapter
    ensureDir(QUESTIONS_DIR);

    for (const [chapterId, questions] of Object.entries(grouped)) {
        console.log(`Processing ${chapterId} (${questions.length} questions)...`);

        // Sort to ensure deterministic ID generation
        questions.sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));

        const processedQuestions = questions.map((q, index) => {
            const standardId = generateStandardId(chapterId, index);

            return {
                id: standardId,
                originalId: q.id, // Keep trace
                questionCode: q.question_code,
                textMarkdown: q.text_markdown || "",
                options: (q.options || []).map(o => ({
                    id: o.id,
                    text: o.text || "",
                    isCorrect: o.isCorrect || o.is_correct || false,
                    imageScale: o.imageScale
                })),
                integerAnswer: q.integer_answer,
                solution: {
                    textSolutionLatex: q.solution?.text_latex || q.solution?.textSolutionLatex || "",
                    videoUrl: q.solution?.video_url,
                    audioExplanationUrl: q.solution?.audio_url,
                    handwrittenSolutionImageUrl: q.solution?.image_url
                },
                difficulty: q.meta?.difficulty || "Medium",
                chapterId: q.chapter_id,
                examSource: q.exam_source || q.meta?.exam,
                isPYQ: q.is_pyq || false,
                isTopPYQ: q.is_top_pyq || false,
                questionType: q.type || "SCQ",
                conceptTags: (q.tags || []).map(t => ({
                    tagId: t.tag_id,
                    weight: t.weight || 1
                })),
                tagId: q.tag_id
            };
        });

        // 4. Write to JSON
        const filePath = path.join(QUESTIONS_DIR, `${chapterId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(processedQuestions, null, 2));
    }

    // 5. Sync to Mongo
    console.log("Syncing to MongoDB...");
    try {
        await mongoose.connect(MONGODB_URI);

        const collection = mongoose.connection.db.collection('questions');
        await collection.deleteMany({}); // START FRESH

        for (const file of fs.readdirSync(QUESTIONS_DIR)) {
            if (!file.endsWith('.json')) continue;
            const content = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));

            // Map content to Mongo format
            const docs = content.map(q => mapQuestionToMongo(q));

            // Batch process
            const BATCH_SIZE = 50;
            for (let i = 0; i < docs.length; i += BATCH_SIZE) {
                const batch = docs.slice(i, i + BATCH_SIZE);
                try {
                    const bulkOps = batch.map(doc => ({
                        replaceOne: {
                            filter: { _id: doc._id },
                            replacement: doc,
                            upsert: true
                        }
                    }));
                    await collection.bulkWrite(bulkOps);
                } catch (err) {
                    console.error(`Error processing batch in ${file}:`, err);
                }
            }
        }
        console.log("Recovery Complete.");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

function mapQuestionToMongo(q) {
    return {
        _id: q.id,
        question_code: q.questionCode,
        text_markdown: q.textMarkdown,
        type: q.questionType,
        options: q.options.map(o => ({
            id: o.id,
            text: o.text,
            is_correct: o.isCorrect
        })),
        integer_answer: q.integerAnswer,
        tags: q.conceptTags.map(t => ({ tag_id: t.tagId, weight: t.weight })),
        meta: {
            difficulty: q.difficulty,
            exam: q.examSource
        },
        chapter_id: q.chapterId,
        is_pyq: q.isPYQ,
        is_top_pyq: q.isTopPYQ,
        exam_source: q.examSource,
        solution: {
            text_latex: q.solution.textSolutionLatex,
            video_url: q.solution.videoUrl,
            audio_url: q.solution.audioExplanationUrl
        }
    };
}

restore();
