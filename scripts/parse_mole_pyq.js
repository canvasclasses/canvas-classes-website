const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, '../PYQ/Mole - pyq.md');
const OUTPUT_FILE = path.join(__dirname, '../data/mole_pyq_parsed.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
}

function parseMarkdown() {
    console.log('Reading file...');
    const content = fs.readFileSync(SOURCE_FILE, 'utf8');
    const lines = content.split('\n');

    const questions = [];
    let currentQuestion = null;

    // Regular expressions for parsing
    // Handle full-width characters: ． (dot), （ (left paren), ） (right paren)
    const questionStartRegex = /^Q(\d+)[．.](.*)/;
    const optionRegex = /^[（(](\d+)[）)](.*)/;
    const dateRegex = /(\d{2} [A-Za-z]{3} \d{4})\s*[（(]([ME])[）)]/;
    const sectionRegex = /^\\section\*\{(.*)\}/;
    const imageRegex = /!\[(.*?)\]\((.*?)\)/;

    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (!line) continue;

        // Check for Section
        const sectionMatch = line.match(sectionRegex);
        if (sectionMatch) {
            currentSection = sectionMatch[1].trim();
            continue;
        }

        // Check for Question Start
        const qMatch = line.match(questionStartRegex);
        if (qMatch) {
            if (currentQuestion) {
                questions.push(currentQuestion);
            }

            const qNum = qMatch[1];
            const qText = qMatch[2].trim();

            currentQuestion = {
                id: `mole_concept_pyq_${qNum}`, // Temporary ID
                questionNumber: parseInt(qNum),
                textMarkdown: qText,
                section: currentSection,
                options: [],
                images: [],
                examSource: '',
                year: null,
                shift: '',
                isPYQ: true,
                chapterId: 'chapter_basic_concepts_mole_concept',
                tagId: 'TAG_MOLE_BASICS', // Default tag, will refine
                type: 'SCQ', // Default to SCQ
                solution: { textSolutionLatex: '' }
            };
            continue;
        }

        if (currentQuestion) {
            // Check for Options
            const optMatch = line.match(optionRegex);
            if (optMatch) {
                const optNum = optMatch[1];
                const optText = optMatch[2].trim();
                currentQuestion.options.push({
                    id: optNum,
                    text: optText,
                    isCorrect: false // Needs manual verification or answer key
                });
                continue;
            }

            // Check for Date/Exam Source
            const dateMatch = line.match(dateRegex);
            if (dateMatch) {
                const dateStr = dateMatch[1];
                const shiftCode = dateMatch[2]; // M or E
                currentQuestion.year = parseInt(dateStr.split(' ')[2]);
                currentQuestion.shift = shiftCode === 'M' ? 'Morning' : 'Evening';
                currentQuestion.examSource = `JEE Main ${currentQuestion.year} - ${dateStr} ${currentQuestion.shift} Shift`;
                continue;
            }

            // Check for Images
            const imgMatch = line.match(imageRegex);
            if (imgMatch) {
                currentQuestion.images.push(imgMatch[2]);
                currentQuestion.textMarkdown += `\n${line}`;
                continue;
            }

            // Append to current question text if not a special line
            // Check if it's likely a continuation of the question text
            if (!optMatch && !dateMatch && !sectionMatch) {
                // Check if it's an answer key or solution block (not expected in this format based on viewing)
                currentQuestion.textMarkdown += `\n${line}`;
            }
        }
    }

    if (currentQuestion) {
        questions.push(currentQuestion);
    }

    console.log(`Parsed ${questions.length} questions.`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2));
    console.log(`Saved to ${OUTPUT_FILE}`);
}

parseMarkdown();
