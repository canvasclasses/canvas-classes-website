/**
 * MOLE CONCEPT QUESTION MIGRATION
 * This script transforms the old question format to the new weighted-tag system.
 * 
 * Run with: node scripts/migrate-questions.js
 */

const fs = require('fs');
const path = require('path');

// Load the original questions
const questionsPath = path.join(__dirname, '../app/the-crucible/questions.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

// =====================================================
// TAG MAPPING: Old tagId -> New Weighted Concept Tags
// =====================================================
const tagMapping = {
    // ====== FOUNDATIONS ======
    'Significant_Figures': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_SIGNIFICANT_FIGURES', weight: 0.9 },
            { tagId: 'TAG_SKILL_CONCEPTUAL', weight: 0.1 }
        ]
    },
    'Mole_Basics': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_BASICS', weight: 0.8 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.2 }
        ]
    },
    'Molar_Mass_Vapor_Density': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_VAPOR_DENSITY', weight: 0.7 },
            { tagId: 'TAG_MOLE_BASICS', weight: 0.2 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.1 }
        ]
    },
    'Empirical_Molecular_Formula': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_COMPOSITION', weight: 0.7 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.3 }
        ]
    },
    'Stoichiometry': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_STOICHIOMETRY', weight: 0.8 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.2 }
        ]
    },
    'Stoichiometry_POAC': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_POAC', weight: 0.5 },
            { tagId: 'TAG_MOLE_STOICHIOMETRY', weight: 0.4 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.1 }
        ]
    },
    'Limiting_Reagent_Yield': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_LIMITING_REAGENT', weight: 0.7 },
            { tagId: 'TAG_MOLE_STOICHIOMETRY', weight: 0.2 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.1 }
        ]
    },

    // ====== SOLUTIONS & CONCENTRATIONS ======
    'Concentration_Terms': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_CONCENTRATIONS', weight: 0.8 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.2 }
        ]
    },
    'Volume_Strength_H2O2': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_H2O2_STRENGTH', weight: 0.6 },
            { tagId: 'TAG_MOLE_CONCENTRATIONS', weight: 0.3 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.1 }
        ]
    },

    // ====== EXPERIMENTAL ANALYSIS ======
    'Eudiometry': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_EUDIOMETRY', weight: 0.8 },
            { tagId: 'TAG_MOLE_STOICHIOMETRY', weight: 0.1 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.1 }
        ]
    },
    'Equivalent_Concept': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_EQUIVALENT', weight: 0.8 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.2 }
        ]
    },
    'Redox_Titration': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_REDOX_TITRATION', weight: 0.6 },
            { tagId: 'TAG_MOLE_EQUIVALENT', weight: 0.3 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.1 }
        ]
    },
    'Acid_Base_Titration': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_ACID_BASE_TITRATION', weight: 0.6 },
            { tagId: 'TAG_MOLE_EQUIVALENT', weight: 0.3 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.1 }
        ]
    },
    'Mixture_Analysis': {
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_MIXTURE_ANALYSIS', weight: 0.5 },
            { tagId: 'TAG_MOLE_STOICHIOMETRY', weight: 0.3 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.2 }
        ]
    }
};

// =====================================================
// QUESTION TYPE DETECTION
// =====================================================
function detectQuestionType(q) {
    // Check if it's already marked as INTEGER
    if (q.type === 'INTEGER' || (q.integerAnswer && q.integerAnswer.trim() !== '')) {
        return 'NVT';
    }

    // Check for Multi-Statement pattern in text
    const text = q.textMarkdown.toLowerCase();
    if (text.includes('statement') || text.includes('assertion') || text.includes('reason')) {
        if (text.includes('assertion') && text.includes('reason')) {
            return 'AR';
        }
        return 'MST';
    }

    // Check for Match the Column
    if (text.includes('match') && (text.includes('column') || text.includes('list'))) {
        return 'MTC';
    }

    // Check if multiple options are correct
    const correctCount = q.options.filter(o => o.isCorrect).length;
    if (correctCount > 1) {
        return 'MCQ'; // Multiple Correct
    }

    // Default: Single Correct Question
    return 'SCQ';
}

// =====================================================
// TRANSFORM QUESTIONS
// =====================================================
const transformedQuestions = questions.map(q => {
    const oldTag = q.tagId;
    const mapping = tagMapping[oldTag] || {
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_MOLE_BASICS', weight: 1.0 }]
    };

    // Detect or override question type
    const detectedType = detectQuestionType(q);
    const questionType = detectedType;

    // Get the primary tag for backwards compatibility
    const primaryTag = mapping.conceptTags[0]?.tagId || 'TAG_MOLE_BASICS';

    return {
        id: q.id,
        textMarkdown: q.textMarkdown,
        options: q.options,

        // Core Metadata
        difficulty: q.difficulty,
        chapterId: q.chapterId,
        examSource: q.examSource || '',
        isTopPYQ: q.isTopPYQ || false,
        isPYQ: q.isPYQ || false,

        // NEW: JEE Question Type
        questionType: questionType,

        // NEW: Weighted Concept Tags
        conceptTags: mapping.conceptTags,

        // Legacy (DEPRECATED)
        tagId: primaryTag,

        // Answer Data
        integerAnswer: q.integerAnswer || '',

        // Solution
        solution: q.solution,

        // Trap Info (if exists)
        trap: q.trap,

        // Admin Flags
        needsReview: false,
        reviewNotes: ''
    };
});

// =====================================================
// SAVE MIGRATED QUESTIONS
// =====================================================
const outputPath = path.join(__dirname, '../app/the-crucible/questions-migrated.json');
fs.writeFileSync(outputPath, JSON.stringify(transformedQuestions, null, 2), 'utf-8');

console.log(`✅ Migration complete!`);
console.log(`   Transformed ${transformedQuestions.length} questions.`);
console.log(`   Saved to: ${outputPath}`);

// =====================================================
// GENERATE STATS
// =====================================================
const stats = {
    total: transformedQuestions.length,
    byType: {},
    byTag: {}
};

transformedQuestions.forEach(q => {
    // Count by question type
    stats.byType[q.questionType] = (stats.byType[q.questionType] || 0) + 1;

    // Count by primary tag
    const primaryTag = q.conceptTags[0]?.tagId || 'Unknown';
    stats.byTag[primaryTag] = (stats.byTag[primaryTag] || 0) + 1;
});

console.log('\n📊 Question Statistics:');
console.log('   By Question Type:');
Object.entries(stats.byType).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`      ${type}: ${count}`);
});

console.log('   By Primary Concept Tag:');
Object.entries(stats.byTag).sort((a, b) => b[1] - a[1]).forEach(([tag, count]) => {
    console.log(`      ${tag.replace('TAG_MOLE_', '')}: ${count}`);
});
