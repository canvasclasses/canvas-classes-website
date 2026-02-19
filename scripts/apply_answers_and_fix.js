const fs = require('fs');
const path = require('path');
const keys = require('../data/answer_keys_content.js');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// --- Configuration ---
const DATA_DIR = path.join(__dirname, '../data/questions');
const PYQ_DIR = path.join(__dirname, '../PYQ');
const FILES = [
    { name: 'Mole - pyq.md', chapterId: 'chapter_basic_concepts_mole_concept' },
    { name: 'Thermodynamics - PYQ.md', chapterId: 'chapter_thermodynamics' },
    { name: 'chem equilibrium - pyq.md', chapterId: 'chapter_chemical_equilibrium' },
];

const MONGO_URI = process.env.MONGODB_URI;

// --- Helper: Parse Answer string ---
// "Q1 (225)" -> { id: "1", ans: "225" }
function parseAnswerKey(text) {
    const map = new Map();
    // Regex: Q(\d+)\s*\(([^)]+)\)
    const matches = text.matchAll(/Q(\d+)\s*\(([^)]+)\)/g);
    for (const match of matches) {
        map.set(match[1], match[2]);
    }
    return map;
}

// --- Helper: Re-parse MD to get ORDERED List of Q Keys ---
function getQuestionOrder(filename) {
    const content = fs.readFileSync(path.join(PYQ_DIR, filename), 'utf8');
    const lines = content.split('\n');
    const orderedIds = [];

    // Simple normalize
    const normalize = t => t.replace(/．/g, '.').replace(/＊/g, '*');

    for (let line of lines) {
        line = normalize(line.trim());
        const qMatch = line.match(/^Q(\d+)[\.\*]*/);
        if (qMatch) {
            orderedIds.push(qMatch[1]);
        }
    }
    return orderedIds;
}

// --- Helper: Generate better solution stub ---
function generateSolution(ans, q) {
    // Basic categorization based on answer
    let explanation = "";
    if (['1', '2', '3', '4'].includes(ans)) {
        explanation = `The correct option is (${ans}).\n\nDetailed stepwise solution:\n\n1. Analyze the given question carefully.\n2. Identify the key concepts involved (e.g., '${q.conceptTags?.[0]?.tagId || "Topic"}').\n3. Apply relevant formulas or principles.\n4. Calculate/Derive the result.\n\nResult matches Option (${ans}).`;
    } else {
        explanation = `The numerical answer is ${ans}.\n\nDetailed stepwise solution:\n\n1. Given data analysis.\n2. Formula application.\n3. Calculation steps leading to the value ${ans}.`;
    }
    return `**Correct Answer:** ${ans}\n\n**Solution:**\n\n${explanation}\n\n(Detailed solution pending subject expert review).`;
}

async function main() {
    console.log("Starting Answer Key Update (Index Matching)...");

    // 1. Process each chapter
    for (const f of FILES) {
        const chapterId = f.chapterId;
        const keyText = keys[chapterId];
        if (!keyText) {
            console.log(`No key for ${chapterId}`);
            continue;
        }

        const answerMap = parseAnswerKey(keyText);
        const orderedIds = getQuestionOrder(f.name);

        console.log(`Chapter: ${chapterId}`);
        console.log(`  Keys Found: ${answerMap.size}`);
        console.log(`  MD Questions Found (Parsed Order): ${orderedIds.length}`);

        // 2. Load Existing Questions
        const jsonPath = path.join(DATA_DIR, `${chapterId}.json`);
        if (!fs.existsSync(jsonPath)) {
            console.log(`  JSON file not found: ${jsonPath}`);
            continue;
        }

        let questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`  Questions in JSON: ${questions.length}`);

        let updatedCount = 0;

        // 3. Match by INDEX
        // Ideally, questions[i] corresponds to orderedIds[i]
        // BUT, what if parsing skipped a question?
        // We assume parse_pyq_md.js produced questions in the SAME order as getQuestionOrder.
        // Let's verify by checking the count mismatch.
        // If counts differ slightly, we proceed with index matching up to min(length).

        const limit = Math.min(questions.length, orderedIds.length);

        for (let i = 0; i < limit; i++) {
            const q = questions[i];
            const originalQNum = orderedIds[i]; // e.g., "1", "2", "3"

            if (answerMap.has(originalQNum)) {
                const ansVal = answerMap.get(originalQNum);

                let isMCQ = (['1', '2', '3', '4'].includes(ansVal) && q.options && q.options.length > 0);

                // Update Metadata
                if (q.examSource) {
                    const parts = q.examSource.match(/(\d{2} [A-Z]{3} \d{4}) \(([EM])\)/);
                    if (parts) {
                        q.year = parseInt(parts[1].split(' ')[2]);
                        q.shift = parts[2] === 'M' ? "Morning" : "Evening";
                        q.exam = "JEE Main";
                    }
                }

                if (isMCQ) {
                    q.questionType = "SCQ";
                    let found = false;
                    for (let opt of q.options) {
                        if (opt.id === ansVal) {
                            opt.isCorrect = true;
                            found = true;
                        } else {
                            opt.isCorrect = false;
                        }
                    }
                } else {
                    q.questionType = "NVT";
                    q.numericalAnswer = ansVal;
                    // Keep options empty or minimal? Usually clear options for NVT
                    q.options = [];
                }

                // Update Solution Text
                q.solution.textSolutionLatex = generateSolution(ansVal, q);
                updatedCount++;
            }
        }

        console.log(`  Updated ${updatedCount} questions (Index Match).`);

        // Save back
        fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2));
    }

    // 4. Sync to Mongo
    if (process.env.MONGODB_URI) {
        console.log("Syncing to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('questions');

        for (const f of FILES) {
            const jsonPath = path.join(DATA_DIR, `${f.chapterId}.json`);
            if (fs.existsSync(jsonPath)) {
                const qs = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                const ops = qs.map(q => ({
                    updateOne: {
                        filter: { id: q.id }, // Match by ID
                        update: { $set: q },
                        upsert: true
                    }
                }));
                if (ops.length > 0) {
                    await collection.bulkWrite(ops);
                    console.log(`Synced ${ops.length} docs for ${f.chapterId}`);
                }
            }
        }

        await mongoose.disconnect();
    } else {
        console.log("Skipping Mongo Sync (No URI)");
    }
}

main().catch(console.error);
