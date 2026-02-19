const fs = require('fs');
const path = require('path');

// Inline chapter configuration (copied from chaptersConfig.ts for Node.js compatibility)
const CHAPTER_ID_MAPPINGS = {
  'chapter_basic_concepts_mole_concept': 'chapter_some_basic_concepts',
  'chapter_atomic_structure': 'chapter_structure_of_atom',
  'chapter_gaseous_state': 'chapter_states_of_matter',
  'chapter_chemical_equilibrium': 'chapter_equilibrium',
  'chapter_periodic_properties': 'chapter_classification_of_elements',
  'chapter_s_block_elements': 'chapter_s_block',
  'chapter_p_block_13_14': 'chapter_p_block_11',
  'chapter_p_block_15_18': 'chapter_p_block_12',
  'chapter_general_organic_chemistry': 'chapter_organic_chemistry_basic',
  'chapter_aldehydes_ketones_and_carboxylic_acids': 'chapter_aldehydes_ketones',
};

const CHAPTER_PREFIXES = {
  'chapter_some_basic_concepts': 'mole',
  'chapter_structure_of_atom': 'atom',
  'chapter_states_of_matter': 'gas',
  'chapter_thermodynamics': 'thermo',
  'chapter_equilibrium': 'equil',
  'chapter_classification_of_elements': 'periodic',
  'chapter_chemical_bonding': 'bond',
  'chapter_hydrogen': 'h2',
  'chapter_s_block': 'sblock',
  'chapter_p_block_11': 'pblock11',
  'chapter_organic_chemistry_basic': 'goc',
  'chapter_hydrocarbons': 'hc',
  'chapter_solutions': 'soln',
  'chapter_electrochemistry': 'electro',
  'chapter_chemical_kinetics': 'kinetics',
  'chapter_p_block_12': 'pblock15',
  'chapter_d_f_block': 'dfblock',
  'chapter_coordination_compounds': 'coord',
  'chapter_haloalkanes_haloarenes': 'halo',
  'chapter_alcohols_phenols_ethers': 'alcohol',
  'chapter_aldehydes_ketones': 'carbonyl',
  'chapter_amines': 'amine',
  'chapter_biomolecules': 'bio',
  'chapter_salt_analysis': 'salt',
  'chapter_stereochemistry': 'stereo',
};

const PYQ_FILE_MAPPINGS = {
  'Mole - pyq.md': 'chapter_some_basic_concepts',
  'Atomic Structure - PYQs.md': 'chapter_structure_of_atom',
  'Thermodynamics - PYQ.md': 'chapter_thermodynamics',
  'chem equilibrium - pyq.md': 'chapter_equilibrium',
};

function getStandardChapterId(id) {
  return CHAPTER_ID_MAPPINGS[id] || id;
}

function generateQuestionId(chapterId, index) {
  const standardId = getStandardChapterId(chapterId);
  const prefix = CHAPTER_PREFIXES[standardId] || standardId.replace('chapter_', '').substring(0, 8);
  return `${prefix}_${String(index).padStart(3, '0')}`;
}

const PYQ_DIR = path.join(__dirname, '../PYQ');
const DATA_DIR = path.join(__dirname, '../data/questions');
const TEMP_DIR = path.join(__dirname, '../temp_parsed');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function normalizeText(text) {
    return text
        .replace(/．/g, '.')
        .replace(/（/g, '(')
        .replace(/）/g, ')')
        .replace(/：/g, ':')
        .replace(/－/g, '-')
        .replace(/＇/g, "'")
        .replace(/＊/g, '*')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
}

function detectFileFormat(content) {
    // Check for ## Q1 format (Atomic Structure style)
    if (/^##\s*Q\d+/m.test(content)) {
        return 'HEADER';
    }
    // Check for Q1., Q2* format (Mole/Thermo style)
    if (/^Q\d+[\.\*]/m.test(content)) {
        return 'LINE';
    }
    return 'UNKNOWN';
}

function extractExamDate(text) {
    // Match patterns like "26 Jun 2022 (E)", "04 Apr 2024", "Jan 21 Morning Shift"
    const patterns = [
        /(\d{1,2})\s+([A-Z][a-z]{2})\s+(\d{4})\s*\(([EM])\)/i,  // 26 Jun 2022 (E)
        /(\d{1,2})\s+(Apr|May|Jun|Jul|Aug|Sep|Jan|Feb|Mar)\s+(\d{4})/i,  // 04 Apr 2024
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+([A-Za-z\s]+Shift)/i,  // Jan 21 Morning Shift
        /(\d{4})/,  // Just year
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return match[0];
        }
    }
    return '';
}

function extractYear(examSource) {
    const match = examSource.match(/(\d{4})/);
    return match ? parseInt(match[1]) : null;
}

function extractShift(examSource) {
    if (examSource.includes('(E)') || examSource.toLowerCase().includes('evening')) {
        return 'Evening';
    }
    if (examSource.includes('(M)') || examSource.toLowerCase().includes('morning')) {
        return 'Morning';
    }
    return '';
}

function parseHeaderFormat(content, chapterId, conceptTag) {
    const questions = [];
    const lines = content.split('\n');
    let currentQ = null;
    let currentSection = conceptTag || 'General';
    let questionCounter = 0;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        line = normalizeText(line);
        
        // Check for section header
        if (line.startsWith('\\section*{')) {
            currentSection = line.replace('\\section*{', '').replace('}', '').trim();
            continue;
        }
        
        // Check for question header ## Q1, ## Q2, etc.
        const headerMatch = line.match(/^##\s*Q(\d+)/);
        if (headerMatch) {
            if (currentQ) {
                questions.push(currentQ);
            }
            
            questionCounter++;
            currentQ = {
                tempId: headerMatch[1],
                id: generateQuestionId(chapterId, questionCounter),
                textMarkdown: '',
                options: [],
                examSource: '',
                chapterId: chapterId,
                conceptTag: currentSection,
                questionType: 'SCQ',
                difficulty: 'Medium',
                isPYQ: true,
                images: [],
                rawLines: [],
                solution: {
                    textSolutionLatex: 'Detailed solution to be added by subject expert.',
                    videoUrl: '',
                    audioExplanationUrl: '',
                    handwrittenSolutionImageUrl: ''
                },
                inQuestionBlock: false,
                inSolutionBlock: false
            };
            continue;
        }
        
        if (!currentQ) continue;
        
        // Check for Date line
        if (line.startsWith('**Date:**') || /\*\*Date:\*\*/.test(line)) {
            const dateText = line.replace(/\*\*Date:\*\*/, '').trim();
            currentQ.examSource = dateText;
            continue;
        }
        
        // Check for Concept tag
        if (line.startsWith('**Concept:**')) {
            const conceptMatch = line.match(/`([^`]+)`/);
            if (conceptMatch) {
                currentQ.conceptTag = conceptMatch[1];
            }
            continue;
        }
        
        // Check for Question block start
        if (line === '**Question:**' || line === '**Question**' || line === 'Question:') {
            currentQ.inQuestionBlock = true;
            currentQ.inSolutionBlock = false;
            continue;
        }
        
        // Check for Options block
        if (line === '**Options:**' || line === '**Options**' || line === 'Options:') {
            continue;
        }
        
        // Check for Solution block
        if (line === '**Solution:**' || line === '**Solution**' || line === 'Solution:') {
            currentQ.inSolutionBlock = true;
            currentQ.inQuestionBlock = false;
            currentQ.solution.textSolutionLatex = '';
            continue;
        }
        
        // Check for Answer
        if (line.startsWith('**Answer:**') || line.startsWith('Answer:')) {
            const answerMatch = line.match(/[\(\[\{](\d+)[\)\]\}]/);
            if (answerMatch) {
                // Mark the corresponding option as correct
                const correctId = answerMatch[1];
                currentQ.options.forEach(opt => {
                    opt.isCorrect = (opt.id === correctId);
                });
            }
            continue;
        }
        
        // Check for image
        if (line.startsWith('![](')) {
            const urlMatch = line.match(/\!\[\]\((.*?)\)/);
            if (urlMatch) {
                currentQ.images.push(urlMatch[1]);
                const imageMarkdown = `\n\n![Image](${urlMatch[1]})\n\n`;
                if (currentQ.inSolutionBlock) {
                    currentQ.solution.textSolutionLatex += imageMarkdown;
                } else {
                    currentQ.textMarkdown += imageMarkdown;
                }
            }
            continue;
        }
        
        // Check for options format: (1), (2), (3), (4)
        const optMatch = line.match(/^\((\d)\)\s*(.+)$/);
        if (optMatch && !currentQ.inSolutionBlock) {
            const optId = optMatch[1];
            const optText = optMatch[2].trim();
            currentQ.options.push({ id: optId, text: optText, isCorrect: false });
            continue;
        }
        
        // Append to appropriate text block
        if (line.length > 0) {
            if (currentQ.inSolutionBlock) {
                currentQ.solution.textSolutionLatex += (currentQ.solution.textSolutionLatex ? '\n' : '') + line;
            } else if (!line.startsWith('**') && !line.startsWith('#') && !line.startsWith('\\')) {
                currentQ.textMarkdown += (currentQ.textMarkdown ? '\n' : '') + line;
            }
        }
    }
    
    if (currentQ) {
        questions.push(currentQ);
    }
    
    return questions;
}

function parseLineFormat(content, chapterId, conceptTag) {
    const questions = [];
    const lines = content.split('\n');
    let currentQ = null;
    let currentSection = conceptTag || 'General';
    let questionCounter = 0;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        line = normalizeText(line);
        
        // Check for section header
        if (line.startsWith('\\section*{')) {
            currentSection = line.replace('\\section*{', '').replace('}', '').trim();
            continue;
        }
        
        // Check for question start Q1., Q2*, Q3*, etc.
        const qMatch = line.match(/^Q(\d+)[\.\*]*/);
        if (qMatch) {
            if (currentQ) {
                questions.push(currentQ);
            }
            
            questionCounter++;
            currentQ = {
                tempId: qMatch[1],
                id: generateQuestionId(chapterId, questionCounter),
                textMarkdown: line.substring(qMatch[0].length).trim(),
                options: [],
                examSource: '',
                chapterId: chapterId,
                conceptTag: currentSection,
                questionType: 'SCQ',
                difficulty: 'Medium',
                isPYQ: true,
                images: [],
                solution: {
                    textSolutionLatex: 'Detailed solution to be added by subject expert.',
                    videoUrl: '',
                    audioExplanationUrl: '',
                    handwrittenSolutionImageUrl: ''
                }
            };
            continue;
        }
        
        if (!currentQ) continue;
        
        // Check for exam date
        const dateMatch = line.match(/\d{2}\s+[A-Z]{3}\s+\d{4}\s*\([EM]\)/i);
        if (dateMatch && !currentQ.examSource) {
            currentQ.examSource = dateMatch[0];
            continue;
        }
        
        // Check for image
        if (line.startsWith('![](')) {
            const urlMatch = line.match(/\!\[\]\((.*?)\)/);
            if (urlMatch) {
                currentQ.images.push(urlMatch[1]);
                currentQ.textMarkdown += `\n\n![Image](${urlMatch[1]})\n\n`;
            }
            continue;
        }
        
        // Check for options format: (1), (2), (3), (4)
        const optMatch = line.match(/^\((\d)\)\s*(.+)$/);
        if (optMatch) {
            const optId = optMatch[1];
            const optText = optMatch[2].trim();
            currentQ.options.push({ id: optId, text: optText, isCorrect: false });
            continue;
        }
        
        // Append to question text if not an option or special line
        if (line.length > 0 && !line.match(/^\(\d\)/) && !line.match(/\d{2}\s+[A-Z]{3}/)) {
            currentQ.textMarkdown += '\n' + line;
        }
    }
    
    if (currentQ) {
        questions.push(currentQ);
    }
    
    return questions;
}

function parseFile(filename, chapterId) {
    const filePath = path.join(PYQ_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filename}`);
        return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const format = detectFileFormat(content);
    
    console.log(`📄 ${filename}: Detected format = ${format}`);
    
    const standardChapterId = getStandardChapterId(chapterId);
    
    let questions;
    if (format === 'HEADER') {
        questions = parseHeaderFormat(content, standardChapterId, null);
    } else if (format === 'LINE') {
        questions = parseLineFormat(content, standardChapterId, null);
    } else {
        console.error(`❌ Unknown format in ${filename}`);
        return [];
    }
    
    // Post-process questions
    return questions.map(q => {
        // Clean up text
        q.textMarkdown = q.textMarkdown.trim();
        
        // Ensure we have at least 4 options for SCQ
        if (q.questionType === 'SCQ' && q.options.length < 4) {
            while (q.options.length < 4) {
                q.options.push({
                    id: String(q.options.length + 1),
                    text: 'Option ' + String.fromCharCode(65 + q.options.length),
                    isCorrect: false
                });
            }
        }
        
        // Extract year and shift info
        const year = extractYear(q.examSource);
        const shift = extractShift(q.examSource);
        
        // Build source reference
        q.sourceReferences = [{
            type: 'PYQ',
            pyqExam: q.examSource.toLowerCase().includes('adv') ? 'JEE Advanced' : 'JEE Main',
            pyqYear: year,
            pyqShift: shift,
            similarity: 'exact'
        }];
        
        // Build concept tags
        q.conceptTags = q.conceptTag ? [{
            tagId: q.conceptTag,
            weight: 1.0
        }] : [];
        
        q.tagId = q.conceptTag || '';
        
        return q;
    });
}

function saveToJSON(questions, filename) {
    // Group questions by chapter
    const byChapter = {};
    questions.forEach(q => {
        const chapterId = q.chapterId || 'chapter_uncategorized';
        if (!byChapter[chapterId]) {
            byChapter[chapterId] = [];
        }
        byChapter[chapterId].push(q);
    });
    
    // Save each chapter to its own file
    for (const [chapterId, chapterQuestions] of Object.entries(byChapter)) {
        const outputFile = path.join(DATA_DIR, `${chapterId}.json`);
        
        // Merge with existing questions if file exists
        let existingQuestions = [];
        if (fs.existsSync(outputFile)) {
            try {
                existingQuestions = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
            } catch (e) {
                console.warn(`⚠️ Could not read existing file ${outputFile}`);
            }
        }
        
        // Remove duplicates based on ID
        const existingIds = new Set(existingQuestions.map(q => q.id));
        const newQuestions = chapterQuestions.filter(q => !existingIds.has(q.id));
        
        const mergedQuestions = [...existingQuestions, ...newQuestions];
        
        fs.writeFileSync(outputFile, JSON.stringify(mergedQuestions, null, 2));
        console.log(`✅ Saved ${chapterId}: ${newQuestions.length} new, ${existingQuestions.length} existing (${mergedQuestions.length} total)`);
    }
    
    // Also save to temp for reference
    const tempFile = path.join(TEMP_DIR, `${filename.replace('.md', '')}_parsed.json`);
    fs.writeFileSync(tempFile, JSON.stringify(questions, null, 2));
}

// Main execution
console.log('🔥 Canvas Classes - PYQ Parser\n');

const allQuestions = [];

// Process each PYQ file
for (const [filename, chapterId] of Object.entries(PYQ_FILE_MAPPINGS)) {
    console.log(`\n📚 Processing: ${filename}`);
    console.log('=' .repeat(50));
    
    const questions = parseFile(filename, chapterId);
    
    if (questions.length > 0) {
        allQuestions.push(...questions);
        saveToJSON(questions, filename);
        console.log(`✅ Parsed ${questions.length} questions from ${filename}`);
    } else {
        console.log(`⚠️ No questions found in ${filename}`);
    }
}

console.log('\n' + '=' .repeat(50));
console.log(`🎉 TOTAL: ${allQuestions.length} questions parsed`);
console.log('=' .repeat(50));

// Summary by chapter
const byChapter = {};
allQuestions.forEach(q => {
    const chapterId = q.chapterId || 'uncategorized';
    byChapter[chapterId] = (byChapter[chapterId] || 0) + 1;
});

console.log('\n📊 Summary by Chapter:');
for (const [chapter, count] of Object.entries(byChapter).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${chapter}: ${count} questions`);
}
