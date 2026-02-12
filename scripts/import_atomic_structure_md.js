
const fs = require('fs');
const path = require('path');

// Configuration
const MD_FILE_PATH = path.join(__dirname, '../PYQ/Atomic Structure - PYQs.md');
const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
const CHAPTER_ID = 'chapter_atomic_structure';

// Function to parse the markdown file
function parseMarkdown(content) {
    const questions = [];
    // Split by "## Q" but keep the delimiter or handle it
    const blocks = content.split(/^## Q/gm);

    // Skip empty first block if it's just header matter
    const questionBlocks = blocks.slice(1);

    questionBlocks.forEach((block, index) => {
        try {
            // block starts with number (e.g. "1\n**Date:**...")
            const lines = block.trim().split('\n');
            const qNumMatch = lines[0].match(/^(\d+)/);
            const questionNum = qNumMatch ? qNumMatch[1] : (index + 1).toString();

            const fullBlock = "## Q" + block;

            // Extract fields using Regex
            const dateMatch = fullBlock.match(/\*\*Date:\*\*\s*(.*)/);
            const conceptMatch = fullBlock.match(/\*\*Concept:\*\*\s*(.*)/);

            // Question Text: Between **Question:** and (**Options:** OR **Answer:**)
            const qStart = fullBlock.indexOf('**Question:**');
            const optStart = fullBlock.indexOf('**Options:**');
            const ansStart = fullBlock.indexOf('**Answer:**');

            let qEnd = optStart !== -1 ? optStart : ansStart;
            if (qEnd === -1) qEnd = fullBlock.length;

            let questionText = '';
            if (qStart !== -1) {
                questionText = fullBlock.substring(qStart + 13, qEnd).trim();
            }

            // Options
            let options = [];
            if (optStart !== -1) {
                const optEnd = ansStart !== -1 ? ansStart : fullBlock.length;
                const optText = fullBlock.substring(optStart + 12, optEnd).trim();
                const optLines = optText.split('\n');
                optLines.forEach(line => {
                    // Match (1) Text or (a) Text
                    const match = line.match(/^\((\d+|[a-d])\)\s*(.*)/i);
                    if (match) {
                        options.push({
                            id: match[1],
                            text: match[2].trim(),
                            isCorrect: false
                        });
                    }
                });
            }

            // Answer
            let answerVal = '';
            const ansMatch = fullBlock.match(/\*\*Answer:\*\*\s*\(?([\w\d]+)\)?/);
            if (ansMatch) {
                answerVal = ansMatch[1];
            }

            // Solution
            let solutionText = '';
            const solStart = fullBlock.indexOf('**Solution:**');
            if (solStart !== -1) {
                solutionText = fullBlock.substring(solStart + 13).trim();
            }

            // Mark Correct Option
            if (options.length > 0 && answerVal) {
                options.forEach(opt => {
                    if (opt.id == answerVal) {
                        opt.isCorrect = true;
                    }
                });
            }

            // Determine Type
            let questionType = 'SCQ';
            let integerAnswer = '';
            if (options.length === 0 && answerVal) {
                questionType = 'NVT';
                integerAnswer = answerVal;
            }

            // Metadata
            let difficulty = 'Medium';
            let examSource = 'JEE Main';
            if (dateMatch) {
                const dStr = dateMatch[1];
                if (dStr.includes('Easy')) difficulty = 'Easy';
                if (dStr.includes('Hard')) difficulty = 'Hard';

                // Parse date for exam source
                // e.g. "25 Jul 2021 (Easy)" -> "JEE Main 2021 - 25 Jul"
                const cleanDate = dStr.replace(/\((Easy|Moderate|Hard)\)/i, '').trim();
                if (cleanDate) {
                    // specific parsing if needed, but keeping simple for now
                    examSource = `JEE Main ${cleanDate}`;
                }
            }

            // Tags
            let tags = [];
            let mainTag = 'TAG_ATOM_MODELS';
            if (conceptMatch) {
                const concepts = conceptMatch[1].split(',').map(c => c.trim().replace(/`/g, ''));
                concepts.forEach(c => {
                    if (c) tags.push({ tagId: c, weight: 1.0 });
                });
                if (tags.length > 0) mainTag = tags[0].tagId;
            } else {
                tags.push({ tagId: mainTag, weight: 1.0 });
            }

            const qObj = {
                id: `atomic_structure_q${questionNum}`,
                textMarkdown: questionText,
                options: options,
                integerAnswer: integerAnswer,
                questionType: questionType,
                conceptTags: tags,
                tagId: mainTag,
                difficulty: difficulty,
                examSource: examSource,
                isPYQ: true,
                chapterId: CHAPTER_ID,
                solution: {
                    textSolutionLatex: solutionText
                }
            };

            questions.push(qObj);

        } catch (e) {
            console.error(`Error parsing block ${index}:`, e);
        }
    });

    return questions;
}

// Ensure DB path exists or handle missing
if (!fs.existsSync(DB_PATH) && !fs.existsSync(path.dirname(DB_PATH))) {
    console.error("DB Path directory not found!");
    process.exit(1);
}

try {
    const rawContent = fs.readFileSync(MD_FILE_PATH, 'utf8');
    const parsedQuestions = parseMarkdown(rawContent);
    console.log(`Parsed ${parsedQuestions.length} questions from Markdown.`);

    // Read existing
    let dbQuestions = [];
    if (fs.existsSync(DB_PATH)) {
        dbQuestions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }

    let added = 0;
    let updated = 0;

    parsedQuestions.forEach(q => {
        const idx = dbQuestions.findIndex(existing => existing.id === q.id);
        if (idx !== -1) {
            dbQuestions[idx] = q; // Update
            updated++;
        } else {
            dbQuestions.push(q);
            added++;
        }
    });

    fs.writeFileSync(DB_PATH, JSON.stringify(dbQuestions, null, 2));
    console.log(`Success! Added ${added}, Updated ${updated}. Total questions: ${dbQuestions.length}`);

} catch (e) {
    console.error("Script Error:", e);
}
