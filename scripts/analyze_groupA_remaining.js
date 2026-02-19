/**
 * Script to systematically improve all remaining Group A question solutions
 * This processes MOLE-028, 029, 030, 033, 046, 051, 059, 060, 066, 067, 070,
 * 109, 113, 117, 120, 135, 155, 162, 169, 181, 186, 196
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/questions/chapter_basic_concepts_mole_concept.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Group A remaining IDs to improve
const groupARem = [
    'MOLE-028', 'MOLE-029', 'MOLE-030', 'MOLE-033', 'MOLE-046',
    'MOLE-051', 'MOLE-059', 'MOLE-060', 'MOLE-066', 'MOLE-067', 'MOLE-070',
    'MOLE-109', 'MOLE-113', 'MOLE-117', 'MOLE-120',
    'MOLE-135', 'MOLE-155', 'MOLE-162', 'MOLE-169', 'MOLE-181',
    'MOLE-186', 'MOLE-196'
];

console.log('Group A Remaining Solutions Analysis');
console.log('='.repeat(70));

groupARem.forEach(id => {
    const q = questions.find(q => q.id === id);
    if (q) {
        const sol = q.solution?.textSolutionLatex || 'NO SOLUTION';
        const len = sol.length;
        const hasSteps = sol.includes('Step');
        const hasReaction = sol.includes('$$') || sol.includes('\\\\to');

        console.log(`\n${id}:`);
        console.log(`  Text: ${q.textMarkdown.substring(0, 80)}...`);
        console.log(`  Current length: ${len}`);
        console.log(`  Has steps: ${hasSteps}, Has equations: ${hasReaction}`);
        console.log(`  Preview: ${sol.substring(0, 120).replace(/\\n/g, ' ')}...`);
    }
});

console.log('\n' + '='.repeat(70));
console.log(`Total remaining for manual improvement: ${groupARem.length}`);
