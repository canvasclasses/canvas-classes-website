const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/questions/chapter_basic_concepts_mole_concept.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('Categorizing Mole Concept Questions by Complexity');
console.log('='.repeat(70));

const groupA = []; // Complex: limiting reagent, mixtures, eudiometry
const groupB = []; // Standard: molarity, composition, stoichiometry
const groupC = []; // Simple: sig figs, definitions, concepts
const alreadyGood = []; // High quality already

questions.forEach(q => {
    const sol = q.solution?.textSolutionLatex || '';
    const text = q.textMarkdown || '';
    const len = sol.length;

    // Check if already high quality
    const hasSteps = sol.includes('Step') || sol.includes('**Formula:**') || sol.includes('**Reaction:**');
    const hasEquation = sol.includes('$$') || sol.includes('\\to') || sol.includes('\\rightarrow');
    const isDetailed = len > 400 && hasSteps && hasEquation;

    if (isDetailed) {
        alreadyGood.push(q.id);
        return;
    }

    // Categorize by problem type
    const isLimitingReagent = text.includes('limiting') ||
        (text.match(/moles?.*mixed|react/i) && text.match(/produce|form/i));
    const isMixture = text.includes('mixture') || text.includes('formic.*oxalic') ||
        text.includes('cuprous.*cupric');
    const isEudiometry = text.includes('eudiometry') ||
        (text.includes('gas') && text.includes('volume') && text.includes('spark'));
    const isComplexStoich = text.match(/purity|impurity/i) && text.match(/yield|percent/i);

    const isMolarity = text.match(/molarity|concentration|dilut/i) && !isLimitingReagent;
    const isComposition = text.match(/mass.*%|percent.*composition|empirical|molecular formula/i);
    const isSigFigs = text.match(/significant figures?/i);
    const isDensity = text.match(/density/i) && !isLimitingReagent;

    if (isLimitingReagent || isMixture || isEudiometry || isComplexStoich) {
        groupA.push({
            id: q.id,
            type: isLimitingReagent ? 'Limiting Reagent' :
                isMixture ? 'Mixture Analysis' :
                    isEudiometry ? 'Eudiometry' : 'Complex Stoich',
            currentLength: len
        });
    } else if (isMolarity || isComposition || isDensity) {
        groupB.push({
            id: q.id,
            type: isMolarity ? 'Molarity' :
                isComposition ? 'Composition' : 'Density',
            currentLength: len
        });
    } else if (isSigFigs) {
        groupC.push({
            id: q.id,
            type: 'Sig Figs',
            currentLength: len
        });
    } else {
        // Default categorization based on tags/difficulty
        if (q.tagId?.includes('LIMITING') || q.tagId?.includes('MIXTURE')) {
            groupA.push({ id: q.id, type: 'Stoichiometry', currentLength: len });
        } else if (q.tagId?.includes('CONCENTRATION') || q.tagId?.includes('COMPOSITION')) {
            groupB.push({ id: q.id, type: 'Standard Calc', currentLength: len });
        } else {
            groupC.push({ id: q.id, type: 'Conceptual', currentLength: len });
        }
    }
});

console.log('\nCategorization Results:');
console.log('━'.repeat(70));
console.log(`Already High Quality: ${alreadyGood.length}`);
console.log(`Group A (Complex - Manual): ${groupA.length}`);
console.log(`Group B (Standard - Hybrid): ${groupB.length}`);
console.log(`Group C (Simple - AI-Assisted): ${groupC.length}`);
console.log(`Total: ${alreadyGood.length + groupA.length + groupB.length + groupC.length}`);

console.log('\n' + '='.repeat(70));
console.log('GROUP A - COMPLEX (Manual Improvement Priority)');
console.log('='.repeat(70));
groupA.slice(0, 20).forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.id.padEnd(12)} | ${item.type.padEnd(20)} | Length: ${item.currentLength}`);
});
if (groupA.length > 20) console.log(`... and ${groupA.length - 20} more`);

console.log('\n' + '='.repeat(70));
console.log('GROUP B - STANDARD (First 15)');
console.log('='.repeat(70));
groupB.slice(0, 15).forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.id.padEnd(12)} | ${item.type.padEnd(20)} | Length: ${item.currentLength}`);
});

console.log('\n' + '='.repeat(70));
console.log('GROUP C - SIMPLE (First 10)');
console.log('='.repeat(70));
groupC.slice(0, 10).forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.id.padEnd(12)} | ${item.type.padEnd(20)} | Length: ${item.currentLength}`);
});

// Save categorization
const report = {
    alreadyGood,
    groupA: groupA.map(i => i.id),
    groupB: groupB.map(i => i.id),
    groupC: groupC.map(i => i.id),
    details: { groupA, groupB, groupC }
};

fs.writeFileSync(
    path.join(__dirname, '../data/mole_concept_categorization.json'),
    JSON.stringify(report, null, 2)
);

console.log('\n✓ Categorization saved to: data/mole_concept_categorization.json');
console.log('\nNext: Begin manual improvements on Group A questions');
