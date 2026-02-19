const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '../temp_parsed');
const DATA_DIR = path.join(__dirname, '../data/questions');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to generate a unique ID prefix
const PREFIX_MAP = {
    "chapter_basic_concepts_mole_concept": "MOLE",
    "chapter_thermodynamics": "THERMO",
    "chapter_chemical_equilibrium": "EQUIL",
    // Add others if needed
};

// Function to generate IDs
function generateId(prefix, index) {
    return `${prefix}-PYQ-${String(index).padStart(3, '0')}`;
}

const files = fs.readdirSync(TEMP_DIR);

for (const file of files) {
    if (!file.endsWith('.json')) continue;

    console.log(`Processing batch: ${file}`);
    const questions = JSON.parse(fs.readFileSync(path.join(TEMP_DIR, file), 'utf8'));

    // Get Chapter ID from the first question (or filename)
    const chapterId = questions[0]?.chapterId || file.replace('_parsed.json', '');
    const prefix = PREFIX_MAP[chapterId] || "GEN";

    const formattedQuestions = questions.map((q, i) => {
        // Construct standard Question Object
        return {
            id: generateId(prefix, i + 1),
            textMarkdown: q.textMarkdown,
            options: q.options.map((opt, idx) => ({
                id: String(idx + 1),
                text: opt.text || "",
                isCorrect: false // Placeholder: Correct option unknown
            })),
            solution: {
                textSolutionLatex: "Detailed step-by-step solution to be added by subject expert.",
                videoUrl: "",
                audioExplanationUrl: "",
                handwrittenSolutionImageUrl: ""
            },
            difficulty: "Medium", // Default
            chapterId: chapterId,
            examSource: q.examSource || "JEE Main PYQ",
            conceptTags: q.conceptTag ? [{ tagId: q.conceptTag, weight: 1 }] : [],
            isPYQ: true,
            isTopPYQ: false,
            questionType: "SCQ" // Single Correct Question
        };
    });

    const outputFilename = `${chapterId}_batch_imported.json`;
    fs.writeFileSync(path.join(DATA_DIR, outputFilename), JSON.stringify(formattedQuestions, null, 2));
    console.log(`Saved ${formattedQuestions.length} to ${outputFilename}`);
}
