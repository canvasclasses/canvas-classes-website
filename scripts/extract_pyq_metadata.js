const fs = require('fs');
const path = require('path');

/**
 * Extract PYQ Metadata from Question Text
 * 
 * This script:
 * 1. Finds date patterns in textMarkdown (e.g., "26 Jun 2022 (E)")
 * 2. Extracts year, month, day, shift
 * 3. Adds dedicated metadata fields
 * 4. Removes date string from question text
 * 5. Updates examSource to structured format
 */

const QUESTION_FILES = [
    'chapter_basic_concepts_mole_concept.json',
    'chapter_thermodynamics.json',
    'chapter_equilibrium.json',
    'chapter_structure_of_atom.json'
];

// Date pattern: "26 Jun 2022 (E)" or "04 Apr 2024 (M)"
const DATE_PATTERN = /(\d{2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s*\(([ME])\)/;

function extractPYQMetadata(question) {
    if (!question.isPYQ) {
        return question;
    }

    // Try to find date in textMarkdown
    const match = question.textMarkdown.match(DATE_PATTERN);

    if (match) {
        const [fullMatch, day, month, year, shiftLetter] = match;

        // Add metadata fields
        question.pyqYear = parseInt(year);
        question.pyqMonth = month;
        question.pyqDay = parseInt(day);
        question.pyqShift = shiftLetter === 'M' ? 'Morning' : 'Evening';

        // Clean question text - remove the date
        question.textMarkdown = question.textMarkdown.replace(fullMatch, '').trim();
        // Also clean up any trailing newlines
        question.textMarkdown = question.textMarkdown.replace(/\n+$/, '');

        // Update examSource to structured format
        const exam = question.examSource && question.examSource.toLowerCase().includes('adv')
            ? 'JEE Advanced'
            : 'JEE Main';
        question.examSource = `${exam} ${year} ${month} ${day} (${question.pyqShift})`;

        console.log(`  ✓ ${question.id}: Extracted ${month} ${day}, ${year} (${question.pyqShift})`);
        return { ...question, hadDate: true };
    } else {
        // No date found in text - try to get from examSource or other fields
        if (question.examSource) {
            const yearMatch = question.examSource.match(/(\d{4})/);
            if (yearMatch) {
                question.pyqYear = parseInt(yearMatch[1]);
            }

            if (question.examSource.includes('(E)') || question.examSource.toLowerCase().includes('evening')) {
                question.pyqShift = 'Evening';
            } else if (question.examSource.includes('(M)') || question.examSource.toLowerCase().includes('morning')) {
                question.pyqShift = 'Morning';
            }
        }

        return { ...question, hadDate: false };
    }
}

function processFile(filename) {
    const filePath = path.join(__dirname, '../data/questions', filename);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filename}`);
        return;
    }

    console.log(`\n📄 Processing: ${filename}`);
    console.log('='.repeat(60));

    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const pyqs = questions.filter(q => q.isPYQ);

    console.log(`Total questions: ${questions.length}`);
    console.log(`PYQs: ${pyqs.length}`);

    let datesFound = 0;
    let yearsExtracted = 0;

    const updatedQuestions = questions.map(q => {
        const result = extractPYQMetadata(q);
        if (result.hadDate) datesFound++;
        if (result.pyqYear) yearsExtracted++;
        delete result.hadDate; // Remove temporary flag
        return result;
    });

    // Create backup
    const backupPath = filePath.replace('.json', '_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(questions, null, 2));
    console.log(`✓ Backup created: ${path.basename(backupPath)}`);

    // Save updated questions
    fs.writeFileSync(filePath, JSON.stringify(updatedQuestions, null, 2));

    console.log(`\n📊 Summary:`);
    console.log(`  - Dates found in text: ${datesFound}`);
    console.log(`  - Years extracted: ${yearsExtracted}`);
    console.log(`  - Text cleaned: ${datesFound} questions`);
    console.log(`✅ File updated successfully`);
}

// Main execution
console.log('🔥 PYQ Metadata Extraction Tool\n');

const args = process.argv.slice(2);
const filesToProcess = args.length > 0 ? args : QUESTION_FILES;

filesToProcess.forEach(file => {
    try {
        processFile(file);
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
    }
});

console.log('\n' + '='.repeat(60));
console.log('🎉 Metadata extraction complete!');
console.log('='.repeat(60));
