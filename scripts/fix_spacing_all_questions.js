const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = path.join(__dirname, '../data/questions');

function fixSpacing(text) {
    if (!text) return text;

    let fixed = text;

    // 1. Add space before $ if preceded by alphanumeric, %, ., ,, or )
    fixed = fixed.replace(/([a-zA-Z0-9%\.,\)])(\$)/g, '$1 $2');

    // 2. Add space after $ if followed by alphanumeric or (
    fixed = fixed.replace(/(\$)([a-zA-Z0-9\(])/g, '$1 $2');

    // 3. Add space after comma if followed by alphanumeric or $
    fixed = fixed.replace(/,([a-zA-Z\$])/g, ', $1');

    // 4. Add space after period if followed by alphanumeric, $, or (
    fixed = fixed.replace(/\.([a-zA-Z\$\(])/g, '. $1');

    return fixed;
}

function processFile(filePath) {
    const fileName = path.basename(filePath);
    console.log(`\nProcessing ${fileName}...`);

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let fixedCount = 0;

        data.forEach(q => {
            if (!q.textMarkdown) return;

            const original = q.textMarkdown;
            const fixed = fixSpacing(original);

            if (fixed !== original) {
                q.textMarkdown = fixed;
                fixedCount++;
            }
        });

        if (fixedCount > 0) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`  ✓ Fixed spacing in ${fixedCount} questions`);
        } else {
            console.log(`  ✓ No spacing issues found`);
        }

        return { file: fileName, fixed: fixedCount, total: data.length };
    } catch (err) {
        console.error(`  ✗ Error processing ${fileName}:`, err.message);
        return { file: fileName, error: err.message };
    }
}

function main() {
    console.log('='.repeat(60));
    console.log('Universal Question Spacing Fix');
    console.log('='.repeat(60));

    const files = fs.readdirSync(QUESTIONS_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(QUESTIONS_DIR, f));

    console.log(`\nFound ${files.length} question files\n`);

    const results = files.map(processFile);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Summary');
    console.log('='.repeat(60));

    const totalFixed = results.reduce((sum, r) => sum + (r.fixed || 0), 0);
    const totalQuestions = results.reduce((sum, r) => sum + (r.total || 0), 0);
    const filesWithIssues = results.filter(r => r.fixed > 0).length;
    const errors = results.filter(r => r.error);

    console.log(`Total Files Processed: ${files.length}`);
    console.log(`Total Questions: ${totalQuestions}`);
    console.log(`Files with Spacing Issues: ${filesWithIssues}`);
    console.log(`Total Questions Fixed: ${totalFixed}`);

    if (errors.length > 0) {
        console.log(`\nErrors: ${errors.length}`);
        errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
    }

    console.log('\n✓ Spacing fix complete!\n');
}

main();
