const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/questions/chapter_basic_concepts_mole_concept.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const remaining = [
    'MOLE-070', 'MOLE-109', 'MOLE-113', 'MOLE-117', 'MOLE-120',
    'MOLE-135', 'MOLE-155', 'MOLE-162', 'MOLE-169', 'MOLE-181',
    'MOLE-186', 'MOLE-196'
];

console.log('Remaining Group A Questions - Summary\n' + '='.repeat(70));

remaining.forEach((id, idx) => {
    const q = questions.find(q => q.id === id);
    if (q) {
        const sol = q.solution?.textSolutionLatex || 'NO SOLUTION';
        console.log(`\n${idx + 1}. ${id}:`);
        console.log(`   Question: ${q.textMarkdown.substring(0, 100).replace(/\n/g, ' ')}...`);
        console.log(`   Solution length: ${sol.length} chars`);
        console.log(`   Preview: ${sol.substring(0, 100).replace(/\n/g, ' ')}...`);
    }
});

console.log('\n' + '='.repeat(70));
console.log(`Total remaining: ${remaining.length} questions`);
