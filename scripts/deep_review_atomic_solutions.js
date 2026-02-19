const fs = require('fs');
const path = require('path');

const ATOMIC_FILE = path.join(__dirname, '../data/questions/chapter_atomic_structure.json');
const questions = JSON.parse(fs.readFileSync(ATOMIC_FILE, 'utf8'));

console.log('Deep Review of Atomic Structure Solutions\n');
console.log('='.repeat(80));

// Categories for review
const needsImprovement = [];
const goodSolutions = [];
const excellentSolutions = [];

// Quality criteria
function assessSolutionQuality(question) {
    const solution = question.solution?.textSolutionLatex || '';
    
    let score = 0;
    const issues = [];
    
    // Criteria 1: Has step-by-step structure (30 points)
    if (solution.includes('**Step') || solution.includes('### Step')) {
        score += 30;
    } else {
        issues.push('Missing step-by-step structure');
    }
    
    // Criteria 2: Has final answer clearly marked (20 points)
    if (solution.includes('**Final Answer') || solution.includes('**Answer')) {
        score += 20;
    } else {
        issues.push('Final answer not clearly marked');
    }
    
    // Criteria 3: Proper LaTeX formatting (20 points)
    const latexCount = (solution.match(/\$/g) || []).length;
    if (latexCount >= 4 && latexCount % 2 === 0) {
        score += 20;
    } else if (latexCount > 0) {
        score += 10;
        issues.push('Limited LaTeX usage');
    } else {
        issues.push('No LaTeX formatting');
    }
    
    // Criteria 4: Adequate length (15 points)
    if (solution.length > 200) {
        score += 15;
    } else if (solution.length > 100) {
        score += 8;
        issues.push('Solution too brief');
    } else {
        issues.push('Solution very short');
    }
    
    // Criteria 5: Explanatory text (15 points)
    const hasExplanation = solution.toLowerCase().includes('given') || 
                          solution.toLowerCase().includes('using') ||
                          solution.toLowerCase().includes('therefore') ||
                          solution.toLowerCase().includes('since');
    if (hasExplanation) {
        score += 15;
    } else {
        issues.push('Lacks explanatory text');
    }
    
    return { score, issues };
}

// Analyze each question
questions.forEach((q, index) => {
    const assessment = assessSolutionQuality(q);
    
    const entry = {
        id: q.id,
        type: q.questionType,
        difficulty: q.difficulty,
        score: assessment.score,
        issues: assessment.issues,
        solutionLength: q.solution?.textSolutionLatex?.length || 0
    };
    
    if (assessment.score >= 80) {
        excellentSolutions.push(entry);
    } else if (assessment.score >= 50) {
        goodSolutions.push(entry);
    } else {
        needsImprovement.push(entry);
    }
});

// Print results
console.log('\n📊 QUALITY DISTRIBUTION\n');
console.log(`Excellent (80-100): ${excellentSolutions.length} questions`);
console.log(`Good (50-79): ${goodSolutions.length} questions`);
console.log(`Needs Improvement (<50): ${needsImprovement.length} questions`);

console.log('\n' + '='.repeat(80));
console.log('🔴 SOLUTIONS NEEDING IMPROVEMENT (Score < 50)\n');

needsImprovement.forEach(entry => {
    console.log(`${entry.id} [${entry.type}] [${entry.difficulty}] - Score: ${entry.score}/100`);
    console.log(`  Length: ${entry.solutionLength} chars`);
    console.log(`  Issues: ${entry.issues.join(', ')}`);
    console.log('');
});

console.log('='.repeat(80));
console.log('🟡 GOOD SOLUTIONS (Score 50-79) - May need minor polish\n');

goodSolutions.slice(0, 10).forEach(entry => {
    console.log(`${entry.id} [${entry.type}] - Score: ${entry.score}/100`);
    if (entry.issues.length > 0) {
        console.log(`  Issues: ${entry.issues.join(', ')}`);
    }
});

if (goodSolutions.length > 10) {
    console.log(`\n... and ${goodSolutions.length - 10} more good solutions`);
}

console.log('\n' + '='.repeat(80));
console.log('🟢 EXCELLENT SOLUTIONS (Score 80+)\n');
console.log(`Total: ${excellentSolutions.length} questions with excellent solutions`);

// Save report
const report = {
    timestamp: new Date().toISOString(),
    summary: {
        total: questions.length,
        excellent: excellentSolutions.length,
        good: goodSolutions.length,
        needsImprovement: needsImprovement.length
    },
    needsImprovement: needsImprovement,
    good: goodSolutions,
    excellent: excellentSolutions.map(e => e.id)
};

const reportPath = path.join(__dirname, '../atomic_structure_quality_report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n📄 Detailed report saved to: ${reportPath}`);
console.log('='.repeat(80));
