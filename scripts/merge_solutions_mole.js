const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions/chapter_basic_concepts_mole_concept.json');

function extractDistinctNumbers(text) {
    if (!text) return new Set();
    const matches = text.match(/[0-9]*\.?[0-9]+/g);
    if (!matches) return new Set();
    const unique = new Set();
    matches.forEach(m => {
        const val = parseFloat(m);
        // Keep numbers that are specific: > 10, or decimals, or small floats. Skip 1-9 integers.
        if (!isNaN(val) && (val >= 10 || m.includes('.') || (val < 10 && val > 0 && !Number.isInteger(val)))) {
            unique.add(val);
        }
    });
    return unique;
}

function calculateSimilarity(qText, solText) {
    const qNums = extractDistinctNumbers(qText);
    const solNums = extractDistinctNumbers(solText);

    // If solution has NO numbers, we can't match by number. 
    // But maybe it's a conceptual question? We skip those for now.
    if (solNums.size === 0) return 0;

    let overlap = 0;
    solNums.forEach(num => {
        for (const qNum of qNums) {
            if (Math.abs(qNum - num) < 0.01) {
                overlap++;
                break;
            }
        }
    });
    return overlap;
}

(async () => {
    console.log("Starting Intelligent Merge for Mole Concept (Overwrite V2)...");

    const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
    console.log(`Loaded ${questions.length} questions.`);

    // Load both Manual and PYQ solutions
    // Note: 'manual' comes before 'mole' alphabetically, so they are processed first.
    const solutionSets = fs.readdirSync(DATA_DIR).filter(f => f.startsWith('mole_pyq_solutions_set') || f.startsWith('manual_solutions_mole'));

    let mergedCount = 0;

    for (const file of solutionSets) {
        console.log(`Processing ${file}...`);
        const solutionsMap = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
        const solutionKeys = Object.keys(solutionsMap);

        for (const key of solutionKeys) {
            const solObj = solutionsMap[key];
            const solText = solObj.textSolutionLatex;
            const isManual = file.startsWith('manual_solutions');

            let bestMatchQ = null;
            let forceUpdate = false;

            // 1. Try Direct ID Match (Preferred for Manual Solutions)
            const idMatch = questions.find(q => q.id === key);
            if (idMatch && isManual) {
                bestMatchQ = idMatch;
                forceUpdate = true;
                console.log(`  [Manual] ID Match ${key}. Force Overwrite.`);
            }

            // 2. Fuzzy Match (Fallback)
            if (!bestMatchQ) {
                let maxOverlap = 0;
                for (const q of questions) {
                    // Check if we should overwrite
                    const currentSol = q.solution?.textSolutionLatex || "";
                    const isPlaceholder = currentSol.length < 50 || currentSol.includes("Pending") || currentSol.includes("pending subject expert review");
                    const isGenericHeuristic = currentSol.includes("Identify Given Data") || currentSol.includes("Extract the values");

                    if (!isPlaceholder && !isGenericHeuristic && currentSol.length > 50) continue;

                    const overlap = calculateSimilarity(q.textMarkdown, solText);
                    if (overlap > maxOverlap) {
                        maxOverlap = overlap;
                        bestMatchQ = q;
                    }
                }
                if (maxOverlap < 1) bestMatchQ = null; // Threshold
            }

            // Apply Update
            if (bestMatchQ) {
                if (!bestMatchQ.solution) bestMatchQ.solution = {};

                // Normalize LaTeX
                let cleanSol = solText
                    .replace(/\\\((.*?)\\\)/gs, '$$$1$$')
                    .replace(/\\\[(.*?)\\\]/gs, '$$$$$1$$$$');

                bestMatchQ.solution.textSolutionLatex = cleanSol;

                if (file.startsWith('mole_pyq')) {
                    bestMatchQ.isPYQ = true;
                }

                mergedCount++;
            }
        }
    }

    console.log(`Merged ${mergedCount} solutions.`);
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
    console.log("Saved updated questions file.");
})();
