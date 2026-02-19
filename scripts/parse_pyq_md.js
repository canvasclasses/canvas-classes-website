const fs = require('fs');
const path = require('path');

const FILES = [
    { name: 'Mole - pyq.md', chapterId: 'chapter_basic_concepts_mole_concept' },
    { name: 'Thermodynamics - PYQ.md', chapterId: 'chapter_thermodynamics' },
    { name: 'chem equilibrium - pyq.md', chapterId: 'chapter_chemical_equilibrium' },
];

const PYQ_DIR = path.join(__dirname, '../PYQ');
const OUTPUT_DIR = path.join(__dirname, '../temp_parsed');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

function normalizeText(text) {
    // Replace full-width characters
    return text
        .replace(/．/g, '.')
        .replace(/（/g, '(')
        .replace(/）/g, ')')
        .replace(/：/g, ':')
        .replace(/－/g, '-')
        .replace(/＇/g, "'")
        .replace(/＊/g, '*');
}

function parseFile(filename, chapterId) {
    const content = fs.readFileSync(path.join(PYQ_DIR, filename), 'utf8');
    const lines = content.split('\n');

    const questions = [];
    let currentQ = null;
    let currentSection = "General"; // Concept Tag

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        line = normalizeText(line);

        // Check for Section Header (Concept Tag)
        if (line.startsWith('\\section*{')) {
            currentSection = line.replace('\\section*{', '').replace('}', '').trim();
            continue;
        }

        // Check for Question Start Q[Number].
        // Regex: ^Q\d+[\.\*]* (Allow optional . or *)
        // Handle "Q3*." or "Q3."
        const qMatch = line.match(/^Q(\d+)[\.\*]*/);

        if (qMatch) {
            if (currentQ) questions.push(currentQ);

            currentQ = {
                tempId: qMatch[1],
                textMarkdown: line.substring(qMatch[0].length).trim(), // Rest of line is text start
                options: [],
                examSource: "",
                chapterId: chapterId,
                conceptTag: currentSection,
                images: [],
                rawLines: [] // Store raw lines for later option parsing
            };
        } else if (currentQ) {
            // Check for Exam Date (e.g. "26 Jun 2022 (E)")
            // Regex: \d{2} [A-Z]{3} \d{4} \([EM]\)
            const dateMatch = line.match(/\d{2} [A-Z]{3} \d{4} \([EM]\)/);
            if (dateMatch && !currentQ.examSource) {
                currentQ.examSource = dateMatch[0]; // Set source
                // Sometimes date line has unwanted text, but usually it's clean
            }
            // Check for Image
            else if (line.startsWith('![](')) {
                // Extract URL: ![](url)
                const urlMatch = line.match(/\!\[\]\((.*?)\)/);
                if (urlMatch) {
                    currentQ.images.push(urlMatch[1]);
                    // Append image markdown to text? Or separate field?
                    // User wants "High Quality Solution", maybe keep image in text for now
                    currentQ.textMarkdown += `\n\n![Image](${urlMatch[1]})`;
                }
            }
            // Check for Options (1), (2)...
            else if (line.match(/^\(\d\)/)) {
                const optId = line.match(/^\((\d)\)/)[1];
                const optText = line.substring(3).trim();
                currentQ.options.push({ id: optId, text: optText });
            }
            // Append to Text if not an option or date (heuristic)
            else {
                // If line looks like part of question text (not empty)
                if (line.length > 0 && !line.match(/^\(\d\)/)) {
                    currentQ.textMarkdown += "\n" + line;
                }
            }
        }
    }
    if (currentQ) questions.push(currentQ);

    return questions;
}

const allParsed = [];

for (const f of FILES) {
    if (fs.existsSync(path.join(PYQ_DIR, f.name))) {
        console.log(`Parsing ${f.name}...`);
        const qs = parseFile(f.name, f.chapterId);
        console.log(`  Found ${qs.length} questions.`);

        // Save intermediate JSON
        fs.writeFileSync(path.join(OUTPUT_DIR, `${f.chapterId}_parsed.json`), JSON.stringify(qs, null, 2));
        allParsed.push(...qs);
    } else {
        console.error(`File not found: ${f.name}`);
    }
}

console.log(`Total parsed: ${allParsed.length}`);
