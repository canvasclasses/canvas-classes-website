#!/usr/bin/env node

/**
 * PYQ Metadata Validator
 * 
 * Validates that all PYQ questions have proper metadata fields populated
 * and that the data follows the standards defined in QUESTION_DATABASE_GUIDELINES.md
 * 
 * Run before MongoDB sync to catch issues early.
 */

const fs = require('fs');
const path = require('path');

// Standard values
const VALID_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const VALID_SHIFTS = ['Morning', 'Evening'];

class ValidationError {
    constructor(questionId, field, message) {
        this.questionId = questionId;
        this.field = field;
        this.message = message;
    }

    toString() {
        return `[${this.questionId}] ${this.field}: ${this.message}`;
    }
}

function validatePYQQuestion(question) {
    const errors = [];

    // Rule 1: If isPYQ is true, all metadata fields must be present
    if (question.isPYQ) {
        if (!question.pyqYear) {
            errors.push(new ValidationError(question.id, 'pyqYear', 'Missing year for PYQ'));
        } else if (question.pyqYear < 2015 || question.pyqYear > new Date().getFullYear()) {
            errors.push(new ValidationError(question.id, 'pyqYear', `Invalid year: ${question.pyqYear}`));
        }

        if (!question.pyqMonth) {
            errors.push(new ValidationError(question.id, 'pyqMonth', 'Missing month for PYQ'));
        } else if (!VALID_MONTHS.includes(question.pyqMonth)) {
            errors.push(new ValidationError(question.id, 'pyqMonth', `Invalid month: ${question.pyqMonth}. Use 3-letter abbreviation (${VALID_MONTHS.join(', ')})`));
        }

        if (!question.pyqDay) {
            errors.push(new ValidationError(question.id, 'pyqDay', 'Missing day for PYQ'));
        } else if (question.pyqDay < 1 || question.pyqDay > 31) {
            errors.push(new ValidationError(question.id, 'pyqDay', `Invalid day: ${question.pyqDay}`));
        }

        if (!question.pyqShift) {
            errors.push(new ValidationError(question.id, 'pyqShift', 'Missing shift for PYQ'));
        } else if (!VALID_SHIFTS.includes(question.pyqShift)) {
            errors.push(new ValidationError(question.id, 'pyqShift', `Invalid shift: ${question.pyqShift}. Must be "Morning" or "Evening"`));
        }

        // Rule 2: examSource should follow standard format
        if (question.examSource) {
            const isGeneric = question.examSource === 'JEE Main PYQ' || question.examSource === 'JEE Advanced PYQ';
            const isMalformed = /JEE Main \d{1,3}(?!\d)/.test(question.examSource); // "JEE Main 0", "JEE Main 20", etc.

            if (isGeneric) {
                errors.push(new ValidationError(question.id, 'examSource', 'examSource is too generic. Should be "JEE Main YYYY MMM DD (Shift)"'));
            }
            if (isMalformed) {
                errors.push(new ValidationError(question.id, 'examSource', `Malformed examSource: "${question.examSource}"`));
            }
        } else {
            errors.push(new ValidationError(question.id, 'examSource', 'Missing examSource for PYQ'));
        }
    }

    // Rule 3: Check for embedded dates in textMarkdown
    const datePattern = /\d{2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*\([ME]\)/;
    if (datePattern.test(question.textMarkdown)) {
        errors.push(new ValidationError(question.id, 'textMarkdown', 'Date information found in question text. Should be in metadata fields.'));
    }

    // Rule 4: Check for trailing whitespace
    if (question.textMarkdown.endsWith('\n') || question.textMarkdown.endsWith(' ')) {
        errors.push(new ValidationError(question.id, 'textMarkdown', 'Question text has trailing whitespace'));
    }

    return errors;
}

function validateQuestionFile(filePath) {
    console.log(`\nValidating: ${path.basename(filePath)}`);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const pyqs = data.filter(q => q.isPYQ);

    console.log(`  Total questions: ${data.length}`);
    console.log(`  PYQs found: ${pyqs.length}`);

    const allErrors = [];

    pyqs.forEach(question => {
        const errors = validatePYQQuestion(question);
        allErrors.push(...errors);
    });

    if (allErrors.length === 0) {
        console.log(`  ✅ All PYQs valid!`);
        return true;
    } else {
        console.log(`  ❌ Found ${allErrors.length} validation errors:`);
        allErrors.forEach(error => {
            console.log(`    ${error.toString()}`);
        });
        return false;
    }
}

// Main execution
const questionsDir = path.join(__dirname, '../data/questions');
const files = fs.readdirSync(questionsDir)
    .filter(f => f.endsWith('.json') && !f.includes('_backup'))
    .map(f => path.join(questionsDir, f));

console.log('='.repeat(60));
console.log('PYQ METADATA VALIDATION');
console.log('='.repeat(60));

let allValid = true;
files.forEach(file => {
    const isValid = validateQuestionFile(file);
    if (!isValid) allValid = false;
});

console.log('\n' + '='.repeat(60));
if (allValid) {
    console.log('✅ ALL FILES PASSED VALIDATION');
    process.exit(0);
} else {
    console.log('❌ VALIDATION FAILED - Please fix errors above');
    process.exit(1);
}
