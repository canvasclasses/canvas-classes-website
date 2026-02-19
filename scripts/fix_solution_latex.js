const fs = require('fs');
const path = require('path');

// Spacing fix function (same as question fix)
function fixSpacing(text) {
    if (!text) return text;

    let fixed = text;
    // Add space before $ if preceded by alphanumeric, %, ., ,, or )
    fixed = fixed.replace(/([a-zA-Z0-9%\.,\)])(\$)/g, '$1 $2');
    // Add space after $ if followed by alphanumeric or (
    fixed = fixed.replace(/(\$)([a-zA-Z0-9\(])/g, '$1 $2');
    // Add space after comma if followed by alphanumeric or $
    fixed = fixed.replace(/,([a-zA-Z\$])/g, ', $1');
    // Add space after period if followed by alphanumeric, $, or (
    fixed = fixed.replace(/\.([a-zA-Z\$\(])/g, '. $1');

    return fixed;
}

const QUESTIONS_DIR = path.join(__dirname, '../data/questions');

async function main() {
    console.log('============================================================');
    console.log('Solution LaTeX Spacing Fix');
    console.log('============================================================\n');

    const files = fs.readdirSync(QUESTIONS_DIR)
        .filter(f => f.endsWith('.json') && f.startsWith('chapter_'));

    console.log(`Found ${files.length} question files\n`);

    let totalFiles = 0;
    let totalQuestions = 0;
    let filesFixed = 0;
    let questionsFixed = 0;

    for (const file of files) {
        const filePath = path.join(QUESTIONS_DIR, file);
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        let fixedInFile = 0;

        questions.forEach(q => {
            totalQuestions++;

            if (q.solution && q.solution.textSolutionLatex) {
                const original = q.solution.textSolutionLatex;
                const fixed = fixSpacing(original);

                if (original !== fixed) {
                    q.solution.textSolutionLatex = fixed;
                    fixedInFile++;
                    questionsFixed++;
                }
            }
        });

        if (fixedInFile > 0) {
            fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
            console.log(`Processing ${file}...`);
            console.log(`  ✓ Fixed spacing in ${fixedInFile} solutions`);
            filesFixed++;
        } else {
            console.log(`Processing ${file}...`);
            console.log(`  ✓ No spacing issues found`);
        }

        totalFiles++;
    }

    console.log('\n============================================================');
    console.log('Summary');
    console.log('============================================================');
    console.log(`Total Files Processed: ${totalFiles}`);
    console.log(`Total Questions: ${totalQuestions}`);
    console.log(`Files with Spacing Issues: ${filesFixed}`);
    console.log(`Total Solutions Fixed: ${questionsFixed}`);
    console.log('\n✓ Solution spacing fix complete!\n');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
