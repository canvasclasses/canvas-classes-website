
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Configuration
const MD_FILE_PATH = path.join(__dirname, '../PYQ/Thermodynamics - PYQ.md');
// Hardcoded URI - in production use env vars
const uri = "mongodb+srv://REDACTED:REDACTED@REDACTED/crucible?retryWrites=true&w=majority&appName=Crucible-Cluster";
const CHAPTER_ID = 'chapter_thermodynamics';

// Answer Key
const ANSWERS_MAP = {
    1: "4", 2: "3", 3: "1", 4: "200", 5: "38", 6: "4", 7: "1200", 8: "1", 9: "0", 10: "150",
    11: "1", 12: "50", 13: "4", 14: "48", 15: "4", 16: "3", 17: "1070", 18: "2", 19: "2", 20: "855",
    21: "2", 22: "2", 23: "4", 24: "4", 25: "2", 26: "3", 27: "45", 28: "3", 29: "1", 30: "0",
    31: "274", 32: "55", 33: "1200", 34: "200", 35: "-28721", 36: "620", 37: "847", 38: "200", 39: "2", 40: "8630",
    41: "0", 42: "600", 43: "2218", 44: "3", 45: "326400", 46: "4", 47: "6.25", 48: "3", 49: "2", 50: "4",
    51: "1", 52: "3", 53: "3", 54: "400", 55: "3", 56: "1", 57: "300", 58: "336", 59: "1", 60: "1",
    61: "1", 62: "1", 63: "37", 64: "163", 65: "57", 66: "2", 67: "2", 68: "6", 69: "747", 70: "2",
    71: "2", 72: "5", 73: "2", 74: "200", 75: "13538", 76: "-2.7", 77: "2", 78: "4", 79: "3", 80: "2",
    81: "3", 82: "125", 83: "3", 84: "150", 85: "6535", 86: "2", 87: "82", 88: "56", 89: "492", 90: "278",
    91: "3", 92: "3", 93: "3", 94: "4", 95: "800", 96: "610", 97: "173", 98: "499", 99: "1006", 100: "104",
    101: "57", 102: "35", 103: "54", 104: "3", 105: "727", 106: "38", 107: "117", 108: "718", 109: "667", 110: "21",
    111: "3", 112: "101", 113: "31", 114: "82", 115: "230", 116: "128", 117: "741", 118: "5576", 119: "309", 120: "189494",
    121: "-192", 122: "3", 123: "2", 124: "1", 125: "3", 126: "72", 127: "38", 128: "964", 129: "1", 130: "2000",
    131: "10", 132: "1", 133: "2735", 134: "1380", 135: "1", 136: "1411", 137: "4"
};

// Mongoose Schemas
const WeightedTagSchema = new mongoose.Schema({ tag_id: String, weight: { type: Number, default: 1.0 } }, { _id: false });
const OptionSchema = new mongoose.Schema({ id: String, text: String, isCorrect: { type: Boolean, default: false }, imageScale: Number }, { _id: false });
const SolutionSchema = new mongoose.Schema({ text_latex: String, video_url: String, image_url: String, image_scale: Number }, { _id: false });
const MetaSchema = new mongoose.Schema({ exam: String, year: Number, difficulty: String, avg_time_sec: { type: Number, default: 120 } }, { _id: false });
const QuestionSchema = new mongoose.Schema({
    _id: String, text_markdown: String, type: { type: String, default: 'SCQ' }, options: [OptionSchema],
    integer_answer: String, tags: [WeightedTagSchema], tag_id: String, meta: MetaSchema, chapter_id: String,
    is_pyq: { type: Boolean, default: true }, is_top_pyq: { type: Boolean, default: false }, exam_source: String, solution: SolutionSchema
}, { collection: 'questions', timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);

// Tag Mapping
const SECTION_TAG_MAP = {
    'System and surrounding': 'TAG_THER_BASIC_CONCEPTS_AND_ZEROTH_LAW',
    'First Law and Basic Fundamentals of Thermodynamics': 'TAG_THERMO_FFL',
    'Entropy and Second law of thermodynamics': 'TAG_THERMO_ENTROPY',
    'Third law of thermodynamics': 'TAG_THERMO_ENTROPY',
    'Laws of Thermochemistry and Enthalpy Change': 'TAG_THERMO_CHEMISTRY',
    'ADVANCED STYLE PROBLEMS': 'TAG_THERMO_CHEMISTRY'
};
const DEFAULT_TAG = 'TAG_THERMO_FFL';

function assessDifficulty(text, type, tags) {
    let score = 0;
    if (type === 'NVT' || type === 'INTEGER') score += 2;
    if (type === 'SCQ') score += 1;
    const lowerText = text.toLowerCase();
    const hardKeywords = ['reversible', 'adiabatic', 'polytropic', 'carnot', 'efficiency', 'entropy change', 'gibbs free energy', 'equilibrium constant', 'log ', 'ln ', 'integral', 'molar heat capacity', 'van der waals'];
    const easyKeywords = ['intensive', 'extensive', 'state function', 'path function', 'system', 'surrounding', 'isolated', 'open system', 'closed system', 'unit of'];
    hardKeywords.forEach(k => { if (lowerText.includes(k)) score += 1; });
    easyKeywords.forEach(k => { if (lowerText.includes(k)) score -= 1; });
    if (text.length > 400) score += 1;
    if (text.length < 100) score -= 1;
    if (tags.includes('TAG_THERMO_ENTROPY') || tags.includes('TAG_THERMO_GIBBS')) score += 1;
    if (tags.includes('TAG_THER_BASIC_CONCEPTS_AND_ZEROTH_LAW')) score -= 1;
    if (score >= 3) return 'Hard';
    if (score <= 0) return 'Easy';
    return 'Medium';
}

// FORMATTING HELPERS
function cleanMarkdown(text) {
    // 1. Convert \( ... \) to $ ... $
    let cleaned = text.replace(/\\\(/g, '$').replace(/\\\)/g, '$');

    // 2. Convert \[ ... \] to $$ ... $$ (if present)
    cleaned = cleaned.replace(/\\\[/g, '$$').replace(/\\\]/g, '$$');

    // 3. Remove the Date/Shift line (e.g. "11 Apr 2023 (E)")
    // Regex matches date pattern at end of lines or distinct line
    cleaned = cleaned.replace(/\n\s*\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s*[（(][EM][）)]\s*$/gm, '');
    cleaned = cleaned.replace(/^\s*\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s*[（(][EM][）)]\s*$/gm, '');

    // 4. Ensure \mathrm is spaced if needed? Usually $\mathrm{...}$ is fine.

    return cleaned.trim();
}

async function importQuestions() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB.");
        const content = fs.readFileSync(MD_FILE_PATH, 'utf8');
        const blocks = content.split(/\n(?=Q\d+[\.．])/gm);
        let currentSectionTag = DEFAULT_TAG;
        let count = 0;

        for (const block of blocks) {
            if (!block.trim()) continue;

            // Tag Update
            if (block.includes('\\section*{')) {
                const match = block.match(/\\section\*\{(.*?)\}/);
                if (match && SECTION_TAG_MAP[match[1]]) currentSectionTag = SECTION_TAG_MAP[match[1]];
            }

            const qNumMatch = block.match(/Q(\d+)[\.．]/);
            if (!qNumMatch) continue;
            const qNum = parseInt(qNumMatch[1]);
            const qId = `thermo_q${qNum}`;

            // Parse raw text first to extract Date
            let rawText = block.replace(/Q\d+[\.．]\s*/, '').trim();

            // Extract Date/Exam info BEFORE cleaning
            let examSource = "JEE Main";
            let year = 2023;
            let shiftFull = "Morning Shift";

            const dateMatch = rawText.match(/(\d{1,2}\s+[A-Za-z]{3}\s+(\d{4})\s*[（(]([EM])[）)])/);
            if (dateMatch) {
                year = parseInt(dateMatch[2]);
                const shiftCode = dateMatch[3];
                shiftFull = (shiftCode === 'E') ? 'Evening Shift' : 'Morning Shift';
                const datePart = dateMatch[1].split(/[（(]/)[0].replace(/\d{4}/, '').trim(); // "11 Apr"
                examSource = `JEE Main ${year} - ${datePart} ${shiftFull}`;
            }

            // CLEAN THE TEXT (Remove date, fix latex)
            let cleanedText = cleanMarkdown(rawText);

            // Options Parsing from CLEANED Text
            // Note: cleaning replaced \( with $, so options might look like $1$ ...
            // But usually options are (1). Regex needs to be robust.
            // In file: （1） or (1). My cleanMarkdown converts \( ... \). It does NOT touch (1).
            // UNLESS (1) was written as \(1\) which is unlikely for options numbering.
            // Let's assume options are (1), (2) etc.

            const options = [];
            let type = 'NVT';

            // Regex for options: handle fullwidth and normal parens
            const optMatches = cleanedText.matchAll(/[（(]([1-4])[）)]\s*([^\n\r]*)/g);
            for (const m of optMatches) {
                options.push({ id: m[1], text: m[2].trim(), isCorrect: false });
            }
            if (options.length >= 2) type = 'SCQ';

            // Answer Mapping
            let integerAnswer = '';
            const correctAnsVal = ANSWERS_MAP[qNum];
            if (type === 'SCQ') {
                if (correctAnsVal) {
                    const opt = options.find(o => o.id == correctAnsVal);
                    if (opt) opt.isCorrect = true;
                }
            } else {
                if (correctAnsVal) integerAnswer = correctAnsVal;
            }

            const difficulty = assessDifficulty(cleanedText, type, [currentSectionTag]);

            // Solution Text - Minimalist
            let solutionText = '';
            // We can't generate detailed physics, but we can structure the Answer clearly.
            if (type === 'SCQ') {
                solutionText += `**Correct Answer:** Option (${correctAnsVal})\n\n`;
            } else {
                solutionText += `**Correct Answer:** ${integerAnswer}\n\n`;
            }
            solutionText += `*Analysis:* This question is from the topic **${currentSectionTag.replace('TAG_THER_', '').replace(/_/g, ' ')}** and is considered **${difficulty}** level. Detailed solution will be provided soon.`;

            const questionDoc = {
                _id: qId,
                text_markdown: cleanedText,
                type: type,
                options: options,
                integer_answer: integerAnswer,
                tags: [{ tag_id: currentSectionTag, weight: 1.0 }],
                tag_id: currentSectionTag,
                chapter_id: CHAPTER_ID,
                is_pyq: true,
                meta: { exam: 'JEE Main', year: year, difficulty: difficulty, avg_time_sec: 120 },
                exam_source: examSource,
                solution: { text_latex: solutionText }
            };

            await Question.findByIdAndUpdate(qId, questionDoc, { upsert: true, new: true });
            if (count % 20 === 0) console.log(`Processed ${qId}...`);
            count++;
        }
        console.log(`\nCompleted! Re-processed ${count} questions with Latex Formatting.`);
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

importQuestions();
