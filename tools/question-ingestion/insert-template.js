/**
 * Question ingestion template — copy to scripts/insert_<chapter>_b<N>.js and edit.
 *
 * Reads MONGODB_URI from .env.local (project root). Inserts each question in
 * QUESTIONS into questions_v2 with auto-generated display_id. Idempotent across
 * re-runs: duplicate display_ids are caught and the next sequence is used.
 *
 * Run: node scripts/insert_<chapter>_b<N>.js
 */

// Load .env.local from the first location it exists in. Supports both:
//   • Standalone use: bundle folder contains .env.local
//   • In-project use: project root contains .env.local
const fs = require('fs');
const path = require('path');
const envCandidates = [
    path.resolve(__dirname, '.env.local'),         // bundle-local (standalone)
    path.resolve(__dirname, '..', '.env.local'),   // tools/.env.local
    path.resolve(__dirname, '..', '..', '.env.local'), // project root (when bundle is at tools/question-ingestion/)
    path.resolve(process.cwd(), '.env.local'),     // wherever node was invoked
];
const envFile = envCandidates.find(p => fs.existsSync(p));
if (!envFile) {
    console.error('No .env.local found. Looked in:\n' + envCandidates.map(p => '  ' + p).join('\n'));
    process.exit(1);
}
require('dotenv').config({ path: envFile });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// ─── Configure these for your batch ─────────────────────────────────────────
const SCRIPT_NAME = 'insert_atom_b5';        // matches filename, used in audit log
const CHAPTER_ID = 'ch11_atom';              // must exist in taxonomyData_from_csv.ts
const DISPLAY_ID_PREFIX = 'ATOM';            // see prefix table in README.md
// ────────────────────────────────────────────────────────────────────────────

// Each entry below produces one question_v2 document. Fill in QUESTIONS with
// the real content; the wrapper script handles _id, display_id, timestamps,
// and audit logging.
//
// REMEMBER:
//   - tags[0] is the PRIMARY topic — drives NCERT-flow browse sort
//   - For PYQs, set BOTH the v2 fields (applicableExams, sourceType, examDetails)
//     and the legacy mirrors (examBoard, is_pyq, exam_source)
//   - For non-PYQs, omit examDetails AND exam_source entirely
const QUESTIONS = [
    {
        question_text: {
            markdown: 'The de Broglie wavelength of an electron moving with velocity $ v $ is given by:',
        },
        type: 'SCQ',
        options: [
            { id: 'A', text: '$ \\lambda = \\frac{h}{mv} $', is_correct: true },
            { id: 'B', text: '$ \\lambda = \\frac{mv}{h} $', is_correct: false },
            { id: 'C', text: '$ \\lambda = h \\cdot mv $', is_correct: false },
            { id: 'D', text: '$ \\lambda = \\frac{h}{m} $', is_correct: false },
        ],
        solution: {
            text_markdown: 'de Broglie hypothesis states $ \\lambda = h/p = h/(mv) $, where $ h $ is Planck\\u2019s constant.',
            latex_validated: false,
        },
        metadata: {
            difficultyLevel: 2,                       // 1-5

            tags: [                                   // PRIMARY tag first
                { tag_id: 'tag_atom_8', weight: 1.0 },  // de Broglie / Uncertainty
            ],

            // ── New 3-tier exam taxonomy ──
            applicableExams: ['JEE'],                 // ['JEE', 'NEET'] for dual-use
            sourceType: 'PYQ',                        // or 'Practice' / 'Mock' / 'NCERT_Textbook' / 'NCERT_Exemplar'
            examDetails: {                            // omit entirely for non-PYQ
                exam: 'JEE_Main',                       // 'JEE_Main' | 'JEE_Advanced' | 'NEET_UG' | 'NEET_PG'
                year: 2025,
                month: 'Apr',
                shift: 'Evening',
            },

            // ── Legacy mirrors (set on every PYQ for back-compat) ──
            examBoard: 'JEE',                         // = applicableExams[0]
            is_pyq: true,                             // = (sourceType === 'PYQ')
            exam_source: {                            // mirror of examDetails (omit for non-PYQ)
                exam: 'JEE Main',                       // free-text, matches existing data conventions
                year: 2025,
                month: 'Apr',
                shift: 'Evening',
            },

            is_top_pyq: false,                        // true only for curated "must-do" set
        },
    },
    // ... add more questions here
];

async function generateNextDisplayId(col, prefix) {
    const lastQ = await col.findOne(
        { display_id: { $regex: `^${prefix}-\\d+$` } },
        { sort: { display_id: -1 }, projection: { display_id: 1 } }
    );
    const maxSeq = lastQ ? parseInt(lastQ.display_id.split('-')[1], 10) : 0;
    return `${prefix}-${String(maxSeq + 1).padStart(3, '0')}`;
}

function buildDoc(q, displayId) {
    const m = q.metadata || {};

    // Sanity: refuse to insert if primary tag is missing — silent insertion
    // here would land the question at the bottom of the chapter in browse view.
    if (!m.tags || m.tags.length === 0 || !m.tags[0].tag_id) {
        throw new Error(`Question is missing metadata.tags[0] (primary tag). Will not insert.`);
    }

    return {
        _id: uuidv4(),
        display_id: displayId,
        question_text: { markdown: q.question_text.markdown, latex_validated: false },
        type: q.type,
        options: q.options || [],
        answer: q.answer,
        solution: {
            text_markdown: q.solution.text_markdown,
            latex_validated: false,
            asset_ids: q.solution.asset_ids,
            video_url: q.solution.video_url,
        },
        metadata: {
            chapter_id: CHAPTER_ID,
            subject: 'chemistry',
            difficultyLevel: m.difficultyLevel,
            tags: m.tags,
            applicableExams: m.applicableExams,
            sourceType: m.sourceType,
            examDetails: m.examDetails,
            examBoard: m.examBoard,
            is_pyq: m.is_pyq ?? (m.sourceType === 'PYQ'),
            exam_source: m.exam_source,
            is_top_pyq: m.is_top_pyq ?? false,
        },
        status: 'review',
        quality_score: 50,
        needs_review: false,
        version: 1,
        created_by: SCRIPT_NAME,
        updated_by: SCRIPT_NAME,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        asset_ids: [],
    };
}

async function main() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not set. Check .env.local in project root.');
    }
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const col = client.db('crucible').collection('questions_v2');

    const inserted = [];
    let nextSeq = null;

    for (let i = 0; i < QUESTIONS.length; i++) {
        const q = QUESTIONS[i];
        let attempt = 0;
        const MAX_RETRY = 3;

        while (true) {
            const displayId = nextSeq
                ? `${DISPLAY_ID_PREFIX}-${String(nextSeq).padStart(3, '0')}`
                : await generateNextDisplayId(col, DISPLAY_ID_PREFIX);
            const doc = buildDoc(q, displayId);
            try {
                await col.insertOne(doc);
                inserted.push(displayId);
                console.log(`  + ${displayId}`);
                nextSeq = parseInt(displayId.split('-')[1], 10) + 1;
                break;
            } catch (err) {
                if (err.code === 11000 && attempt < MAX_RETRY) {
                    attempt++;
                    nextSeq = null; // re-query to find the new max
                    console.log(`  ! ${displayId} duplicate — retrying (attempt ${attempt})`);
                    continue;
                }
                throw err;
            }
        }
    }

    console.log(`\nInserted ${inserted.length} questions: ${inserted[0]} … ${inserted[inserted.length - 1]}`);
    await client.close();
}

// Exports for the validator. Keep this line at the bottom so
// `node tools/question-ingestion/validate-question.js <this-file>` can lint
// the QUESTIONS array without running the insert.
module.exports = { QUESTIONS, CHAPTER_ID, DISPLAY_ID_PREFIX };

// Only run main when invoked directly. When `require()`d (by the validator),
// we stop here so no Mongo connection is opened.
if (require.main === module) {
    main().catch(err => {
        console.error('FAILED:', err);
        process.exit(1);
    });
}
