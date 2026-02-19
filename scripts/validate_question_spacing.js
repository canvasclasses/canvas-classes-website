const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = path.join(__dirname, '../data/questions');

function detectSpacingIssues(text, questionId) {
    if (!text) return [];

    const issues = [];

    // Pattern 1: Alphanumeric directly before $
    const beforeDollar = text.match(/[a-zA-Z0-9]\$/g);
    if (beforeDollar) {
        issues.push({
            type: 'missing_space_before_latex',
            pattern: beforeDollar[0],
            count: beforeDollar.length
        });
    }

    // Pattern 2: $ directly before alphanumeric
    const afterDollar = text.match(/\$[a-zA-Z0-9]/g);
    if (afterDollar) {
        issues.push({
            type: 'missing_space_after_latex',
            pattern: afterDollar[0],
            count: afterDollar.length
        });
    }

    // Pattern 3: Comma without space
    const afterComma = text.match(/,[a-zA-Z\$]/g);
    if (afterComma) {
        issues.push({
            type: 'missing_space_after_comma',
            pattern: afterComma[0],
            count: afterComma.length
        });
    }

    return issues;
}

function validateFile(filePath) {
    const fileName = path.basename(filePath);

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const problemQuestions = [];

        data.forEach(q => {
            const questionIssues = q.textMarkdown ? detectSpacingIssues(q.textMarkdown, q.id) : [];
            const solutionIssues = q.solution?.textSolutionLatex ? detectSpacingIssues(q.solution.textSolutionLatex, q.id) : [];

            if (questionIssues.length > 0 || solutionIssues.length > 0) {
                const problemData = {
                    id: q.id
                };

                if (questionIssues.length > 0) {
                    problemData.questionIssues = questionIssues;
                }

                if (solutionIssues.length > 0) {
                    problemData.solutionIssues = solutionIssues;
                }

                problemQuestions.push(problemData);
            }
        });

        return {
            file: fileName,
            total: data.length,
            problems: problemQuestions.length,
            details: problemQuestions
        };
    } catch (err) {
        return {
            file: fileName,
            error: err.message
        };
    }
}

function main() {
    console.log('='.repeat(60));
    console.log('Question Spacing Validation');
    console.log('='.repeat(60));

    const files = fs.readdirSync(QUESTIONS_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(QUESTIONS_DIR, f));

    console.log(`\nValidating ${files.length} question files...\n`);

    const results = files.map(validateFile);

    // Report issues
    let totalIssues = 0;
    let hasErrors = false;

    results.forEach(result => {
        if (result.error) {
            console.log(`✗ ${result.file}: ERROR - ${result.error}`);
            hasErrors = true;
            return;
        }

        if (result.problems > 0) {
            console.log(`\n⚠ ${result.file}: ${result.problems} questions with spacing issues`);
            result.details.slice(0, 3).forEach(q => {
                console.log(`  - ${q.id}:`);
                if (q.questionIssues) {
                    console.log(`    [Question Text]`);
                    q.questionIssues.forEach(issue => {
                        console.log(`      • ${issue.type}: "${issue.pattern}" (${issue.count} occurrences)`);
                    });
                }
                if (q.solutionIssues) {
                    console.log(`    [Solution]`);
                    q.solutionIssues.forEach(issue => {
                        console.log(`      • ${issue.type}: "${issue.pattern}" (${issue.count} occurrences)`);
                    });
                }
            });
            if (result.details.length > 3) {
                console.log(`  ...and ${result.details.length - 3} more`);
            }
            totalIssues += result.problems;
        }
    });

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Validation Summary');
    console.log('='.repeat(60));

    const totalQuestions = results.reduce((sum, r) => sum + (r.total || 0), 0);
    const filesWithIssues = results.filter(r => r.problems > 0).length;

    console.log(`Total Files: ${files.length}`);
    console.log(`Total Questions: ${totalQuestions}`);
    console.log(`Files with Issues: ${filesWithIssues}`);
    console.log(`Questions with Issues: ${totalIssues}`);

    if (totalIssues === 0 && !hasErrors) {
        console.log('\n✓ All questions pass spacing validation!\n');
        process.exit(0);
    } else {
        console.log('\n✗ Spacing issues detected. Run fix_spacing_all_questions.js to fix.\n');
        process.exit(1);
    }
}

main();
