/**
 * Comprehensive Question Bank Management Script
 * - Validates all questions
 * - Fixes LaTeX inconsistencies
 * - Checks for missing solutions
 * - Generates report
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data/questions');
const REPORT_FILE = path.join(__dirname, '../question_audit_report.json');

// LaTeX patterns that need fixing
const LATEX_ISSUES = [
    { pattern: /\$\$([^$]+)\$\$/g, fix: '$$$1$$' },  // Double dollar spacing
    { pattern: /\\text{\s*([^}]+)\s*}/g, fix: '\\text{$1}' },  // Text spacing
    { pattern: /_{\s*([^}]+)\s*}/g, fix: '_{$1}' },  // Subscript spacing
    { pattern: /\^{\s*([^}]+)\s*}/g, fix: '^{$1}' },  // Superscript spacing
];

// Common LaTeX symbols that should be properly formatted
const LATEX_SYMBOLS = [
    { wrong: /\?\?/g, correct: '\\rightarrow' },
    { wrong: /\?\?/g, correct: '\\Rightarrow' },
    { wrong: /\?\?/g, correct: '\\leftrightarrow' },
    { wrong: /\?\?/g, correct: '\\Leftrightarrow' },
    { wrong: /\?\?/g, correct: '\\leq' },
    { wrong: /\?\?/g, correct: '\\geq' },
    { wrong: /\?\?/g, correct: '\\neq' },
    { wrong: /\?\?/g, correct: '\\approx' },
    { wrong: /\?\?/g, correct: '\\pm' },
    { wrong: /\?\?/g, correct: '\\times' },
    { wrong: /\?\?/g, correct: '\\div' },
    { wrong: /\?\?/g, correct: '\\cdot' },
    { wrong: /\?\?/g, correct: '\\alpha' },
    { wrong: /\?\?/g, correct: '\\beta' },
    { wrong: /\?\?/g, correct: '\\gamma' },
    { wrong: /\?\?/g, correct: '\\delta' },
    { wrong: /\?\?/g, correct: '\\Delta' },
    { wrong: /\?\?/g, correct: '\\pi' },
    { wrong: /\?\?/g, correct: '\\sigma' },
    { wrong: /\?\?/g, correct: '\\Sigma' },
    { wrong: /\?\?/g, correct: '\\lambda' },
    { wrong: /\?\?/g, correct: '\\theta' },
    { wrong: /\?\?/g, correct: '\\Theta' },
    { wrong: /\?\?/g, correct: '\\omega' },
    { wrong: /\?\?/g, correct: '\\Omega' },
    { wrong: /\?\?/g, correct: '\\infty' },
    { wrong: /\?\?/g, correct: '\\nabla' },
    { wrong: /\?\?/g, correct: '\\partial' },
    { wrong: /\?\?/g, correct: '\\degree' },
];

function normalizeLatex(text) {
    if (!text) return text;
    
    let normalized = text;
    
    // Fix inline math spacing
    normalized = normalized.replace(/\$\s+/g, '$');
    normalized = normalized.replace(/\s+\$/g, '$');
    
    // Fix chemical formulas (e.g., H2O -> H$_2$O)
    normalized = normalized.replace(/([A-Z][a-z]?)\s*(\d+)/g, (match, element, num) => {
        // Don't fix if already in math mode
        if (normalized.indexOf('$' + match) !== -1 || normalized.indexOf(match + '$') !== -1) {
            return match;
        }
        return `${element}_{${num}}`;
    });
    
    // Fix common chemical formulas
    const chemicalFormulas = [
        { pattern: /\bH2O\b/g, replacement: 'H$_2$O' },
        { pattern: /\bCO2\b/g, replacement: 'CO$_2$' },
        { pattern: /\bNaCl\b/g, replacement: 'NaCl' },
        { pattern: /\bHCl\b/g, replacement: 'HCl' },
        { pattern: /\bH2SO4\b/g, replacement: 'H$_2$SO$_4$' },
        { pattern: /\bHNO3\b/g, replacement: 'HNO$_3$' },
        { pattern: /\bNH3\b/g, replacement: 'NH$_3$' },
        { pattern: /\bCH4\b/g, replacement: 'CH$_4$' },
        { pattern: /\bC2H6\b/g, replacement: 'C$_2$H$_6$' },
        { pattern: /\bC6H12O6\b/g, replacement: 'C$_6$H$_{12}$O$_6$' },
        { pattern: /\bCaCO3\b/g, replacement: 'CaCO$_3$' },
        { pattern: /\bNaOH\b/g, replacement: 'NaOH' },
        { pattern: /\bKCl\b/g, replacement: 'KCl' },
        { pattern: /\bAgNO3\b/g, replacement: 'AgNO$_3$' },
        { pattern: /\bBaCl2\b/g, replacement: 'BaCl$_2$' },
        { pattern: /\bFe2O3\b/g, replacement: 'Fe$_2$O$_3$' },
        { pattern: /\bAl2O3\b/g, replacement: 'Al$_2$O$_3$' },
        { pattern: /\bCuSO4\b/g, replacement: 'CuSO$_4$' },
        { pattern: /\bZnSO4\b/g, replacement: 'ZnSO$_4$' },
        { pattern: /\bMgCl2\b/g, replacement: 'MgCl$_2$' },
        { pattern: /\bCaCl2\b/g, replacement: 'CaCl$_2$' },
        { pattern: /\bNa2CO3\b/g, replacement: 'Na$_2$CO$_3$' },
        { pattern: /\bK2Cr2O7\b/g, replacement: 'K$_2$Cr$_2$O$_7$' },
        { pattern: /\bKMnO4\b/g, replacement: 'KMnO$_4$' },
        { pattern: /\bH2O2\b/g, replacement: 'H$_2$O$_2$' },
        { pattern: /\bO2\b/g, replacement: 'O$_2$' },
        { pattern: /\bN2\b/g, replacement: 'N$_2$' },
        { pattern: /\bH2\b/g, replacement: 'H$_2$' },
        { pattern: /\bCl2\b/g, replacement: 'Cl$_2$' },
        { pattern: /\bBr2\b/g, replacement: 'Br$_2$' },
        { pattern: /\bI2\b/g, replacement: 'I$_2$' },
        { pattern: /\bF2\b/g, replacement: 'F$_2$' },
        { pattern: /\bP4\b/g, replacement: 'P$_4$' },
        { pattern: /\bS8\b/g, replacement: 'S$_8$' },
    ];
    
    for (const { pattern, replacement } of chemicalFormulas) {
        normalized = normalized.replace(pattern, replacement);
    }
    
    // Fix powers (e.g., 10-3 -> 10$^{-3}$)
    normalized = normalized.replace(/(\d+)\s*\^\s*\{-?(\d+)\}/g, '$1^{-$2}$');
    normalized = normalized.replace(/(\d+)\s*\^\s*(\d+)/g, '$1^$2$');
    
    // Fix units (e.g., mol-1 -> mol$^{-1}$)
    normalized = normalized.replace(/mol\s*\^\s*\{-?1\}/g, 'mol$^{-1}$');
    normalized = normalized.replace(/L\s*\^\s*\{-?1\}/g, 'L$^{-1}$');
    normalized = normalized.replace(/g\s*\^\s*\{-?1\}/g, 'g$^{-1}$');
    normalized = normalized.replace(/m\s*\^\s*\{-?1\}/g, 'm$^{-1}$');
    normalized = normalized.replace(/cm\s*\^\s*\{-?1\}/g, 'cm$^{-1}$');
    normalized = normalized.replace(/dm\s*\^\s*\{-?1\}/g, 'dm$^{-1}$');
    normalized = normalized.replace(/nm\s*\^\s*\{-?1\}/g, 'nm$^{-1}$');
    
    // Fix temperatures (e.g., 25°C -> 25$^\\circ$C)
    normalized = normalized.replace(/(\d+)\s*°\s*C/g, '$1$^\\circ$C');
    normalized = normalized.replace(/(\d+)\s*°\s*F/g, '$1$^\\circ$F');
    
    // Fix math constants
    normalized = normalized.replace(/\bN_A\b/g, '$N_A$');
    normalized = normalized.replace(/\bR\s*=\s*8\.314/g, '$R = 8.314$');
    
    return normalized;
}

function validateQuestion(q, fileName) {
    const issues = [];
    
    // Check required fields
    if (!q.id) issues.push('Missing ID');
    if (!q.textMarkdown || q.textMarkdown.trim() === '') issues.push('Missing question text');
    if (!q.chapterId) issues.push('Missing chapter ID');
    if (!q.options || q.options.length === 0) {
        if (q.questionType !== 'NVT' && q.questionType !== 'INTEGER') {
            issues.push('Missing options for non-integer question');
        }
    }
    
    // Check solution
    if (!q.solution) {
        issues.push('Missing solution object');
    } else {
        if (!q.solution.textSolutionLatex || q.solution.textSolutionLatex.trim() === '') {
            issues.push('Missing solution text');
        } else if (q.solution.textSolutionLatex.includes('Wait for solution') || 
                   q.solution.textSolutionLatex.includes('to be added')) {
            issues.push('Solution is placeholder');
        }
    }
    
    // Check answer
    if (q.options && q.options.length > 0) {
        const hasCorrectAnswer = q.options.some(opt => opt.isCorrect);
        if (!hasCorrectAnswer) {
            issues.push('No correct answer marked');
        }
    }
    
    // Check LaTeX consistency
    const latexIssues = [];
    const allText = `${q.textMarkdown || ''} ${q.solution?.textSolutionLatex || ''}`;
    
    // Check for unclosed math mode
    const openDollars = (allText.match(/\$/g) || []).length;
    if (openDollars % 2 !== 0) {
        latexIssues.push('Unclosed $ (odd number of $ signs)');
    }
    
    // Check for common formatting issues
    if (allText.includes('\\text{ ') || allText.includes(' \\text{')) {
        latexIssues.push('Spacing issues with \\text{}');
    }
    
    return {
        id: q.id,
        file: fileName,
        issues,
        latexIssues,
        hasSolution: q.solution && q.solution.textSolutionLatex && 
                     !q.solution.textSolutionLatex.includes('Wait for solution'),
        optionCount: q.options?.length || 0,
        hasCorrectAnswer: q.options?.some(opt => opt.isCorrect) || false
    };
}

function processQuestions() {
    const allFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const allQuestions = [];
    const report = {
        summary: {
            totalFiles: 0,
            totalQuestions: 0,
            questionsWithIssues: 0,
            questionsWithoutSolutions: 0,
            questionsWithoutAnswers: 0,
            latexIssues: 0
        },
        byChapter: {},
        issues: [],
        fixed: []
    };
    
    console.log('🔍 Auditing Question Bank...\n');
    
    for (const file of allFiles) {
        const filePath = path.join(DATA_DIR, file);
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const chapterId = file.replace('.json', '');
        
        report.summary.totalFiles++;
        report.byChapter[chapterId] = {
            total: questions.length,
            withIssues: 0,
            withoutSolutions: 0
        };
        
        let modified = false;
        const fixedQuestions = questions.map(q => {
            // Normalize LaTeX in question text
            if (q.textMarkdown) {
                const normalized = normalizeLatex(q.textMarkdown);
                if (normalized !== q.textMarkdown) {
                    q.textMarkdown = normalized;
                    modified = true;
                }
            }
            
            // Normalize LaTeX in solution
            if (q.solution?.textSolutionLatex) {
                const normalized = normalizeLatex(q.solution.textSolutionLatex);
                if (normalized !== q.solution.textSolutionLatex) {
                    q.solution.textSolutionLatex = normalized;
                    modified = true;
                }
            }
            
            // Validate
            const validation = validateQuestion(q, file);
            if (validation.issues.length > 0 || validation.latexIssues.length > 0) {
                report.issues.push(validation);
                report.summary.questionsWithIssues++;
                report.byChapter[chapterId].withIssues++;
            }
            
            if (!validation.hasSolution) {
                report.summary.questionsWithoutSolutions++;
                report.byChapter[chapterId].withoutSolutions++;
            }
            
            if (!validation.hasCorrectAnswer) {
                report.summary.questionsWithoutAnswers++;
            }
            
            if (validation.latexIssues.length > 0) {
                report.summary.latexIssues++;
            }
            
            return q;
        });
        
        // Save if modified
        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(fixedQuestions, null, 2));
            console.log(`✅ Fixed LaTeX in ${file}`);
        }
        
        report.summary.totalQuestions += questions.length;
        allQuestions.push(...questions);
    }
    
    // Save report
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 AUDIT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Files:          ${report.summary.totalFiles}`);
    console.log(`Total Questions:      ${report.summary.totalQuestions}`);
    console.log(`Questions w/ Issues:  ${report.summary.questionsWithIssues}`);
    console.log(`Without Solutions:  ${report.summary.questionsWithoutSolutions}`);
    console.log(`Without Answers:    ${report.summary.questionsWithoutAnswers}`);
    console.log(`LaTeX Issues:         ${report.summary.latexIssues}`);
    console.log('='.repeat(60));
    
    console.log('\n📋 Detailed report saved to: question_audit_report.json');
    
    // Show top issues
    if (report.issues.length > 0) {
        console.log('\n🔴 Top Issues (showing first 10):');
        report.issues.slice(0, 10).forEach((issue, i) => {
            console.log(`  ${i + 1}. ${issue.id} (${issue.file}):`);
            issue.issues.forEach(iss => console.log(`     - ${iss}`));
        });
    }
}

// Run
processQuestions();
