const fs = require('fs');
const path = require('path');

// Configuration
const QUESTIONS_FILE = path.join(__dirname, '../app/the-crucible/questions.json');
const MIGRATED_FILE = path.join(__dirname, '../app/the-crucible/questions-migrated.json');
const OUTPUT_DIR = path.join(__dirname, '../data/questions');

// Chapter ID to Prefix Map
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
    "chapter_surface_chemistry": "SURFACE"
};

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadQuestions(filePath) {
    if (!fs.existsSync(filePath)) return [];
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
        return [];
    }
}

function standardizeId(chapterId, index) {
    const prefix = PREFIX_MAP[chapterId] || "GEN"; // Default to GEN (General) if unknown
    return `${prefix}-${String(index + 1).padStart(3, '0')}`;
}

function main() {
    ensureDir(OUTPUT_DIR);

    console.log("Loading questions...");
    const q1 = loadQuestions(QUESTIONS_FILE);
    const q2 = loadQuestions(MIGRATED_FILE);

    // Merge lists
    const allQuestions = [...q1, ...q2];
    console.log(`Total questions found: ${allQuestions.length}`);

    // Group by Chapter
    const initialMap = {}; // { chapterId: [questions] }

    allQuestions.forEach(q => {
        const chId = q.chapterId || "chapter_uncategorized";
        if (!initialMap[chId]) initialMap[chId] = [];
        initialMap[chId].push(q);
    });

    // Deduplicate and Sort
    Object.keys(initialMap).forEach(chapterId => {
        const questions = initialMap[chapterId];
        const uniqueQuestions = [];
        const seenText = new Set();
        const seenIds = new Set();

        questions.forEach(q => {
            // Basic deduplication using clean text (ignoring whitespace)
            const cleanText = (q.textMarkdown || "").trim().replace(/\s+/g, ' ');
            if (!cleanText || seenText.has(cleanText)) {
                // Determine if we should keep this one instead (e.g., better metadata)
                // For now, simple first-come (from questions.json) priority
                // But check if ID is "better" in the duplicate?
                return;
            }
            if (seenIds.has(q.id)) {
                // If ID collision, we might still want the content if text is different?
                // But here we rely on text matching first.
                // If ID exists but text is diff, this is a conflict we must resolve by re-IDing.
                // Current logic: Text unique? Keep it.
                // We will Re-ID everything to ensure order, or preserve "good" IDs?
                // Plan: Re-ID everything for cleaner sequence as per user request "arrange them in order"
            }

            seenText.add(cleanText);
            seenIds.add(q.id);
            uniqueQuestions.push(q);
        });

        // Sort by Exam Year/Shift (if available) to have logical order, or just keep as is
        uniqueQuestions.sort((a, b) => {
            // Try to extract year
            const getYear = (item) => item.meta?.year || item.year || 0;
            return getYear(a) - getYear(b);
        });

        // Re-ID logic
        // The user complained about MOLE-001 appearing after MOLE-087.
        // We will Regenerate IDs to ensure sequential order MOLE-001... MOLE-XXX

        const finalizedQuestions = uniqueQuestions.map((q, index) => {
            // Keep existing fields, maximize metadata
            // Ensure ID is standard
            const newId = standardizeId(chapterId, index);

            // Clean up old fields if necessary
            // e.g., separate questionNumber which caused issues
            const { questionNumber, ...rest } = q;

            return {
                ...rest,
                id: newId
            };
        });

        const outputPath = path.join(OUTPUT_DIR, `${chapterId}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(finalizedQuestions, null, 2));
        console.log(`Saved ${chapterId}: ${finalizedQuestions.length} questions`);
    });

    console.log("Migration Complete.");
}

main();
