/**
 * Add Source References for Organic Chemistry Questions
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
let questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const ADDITIONAL_MAPPINGS = {
    // Jan 23 Morning Q60 - Alkene Stereoisomerism
    'jee_2026_jan23m_q60': [
        {
            type: 'NCERT',
            ncertBook: 'Class 11 Chemistry Part 2',
            ncertChapter: 'Chapter 13: Hydrocarbons',
            ncertPage: 'Page 388-390',
            ncertTopic: 'Geometrical Isomerism in Alkenes',
            similarity: 'concept',
            description: 'Reduction of alkynes to cis-alkenes (Lindlar) and trans-alkenes (Na/liq NH3) is explicitly described.'
        },
        {
            type: 'PYQ',
            pyqExam: 'JEE Main',
            pyqYear: 2021,
            pyqShift: 'Feb 26 Morning',
            pyqQuestionNo: 'Q.73',
            similarity: 'exact',
            description: 'Direct question comparing Birch reduction and Lindlar catalyst was asked previously.'
        }
    ],

    // Jan 23 Morning Q57 - Amines Preparation
    'jee_2026_jan23m_q57': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 2',
            ncertChapter: 'Chapter 13: Amines',
            ncertPage: 'Page 381',
            ncertTopic: 'Reduction of Nitro Compounds',
            similarity: 'concept',
            description: 'Reduction of nitro compounds to amines using Sn/HCl is a standard method given in NCERT.'
        },
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 2',
            ncertChapter: 'Chapter 13: Amines',
            ncertPage: 'Page 393',
            ncertTopic: 'Electrophilic Substitution - Bromination',
            similarity: 'concept',
            description: 'Bromination of aniline derivatives and protective effect of acetylation (implied).'
        }
    ],

    // Jan 22 Evening Q61 - Dipole Moment
    'jee_2026_jan22e_q61': [
        {
            type: 'NCERT',
            ncertBook: 'Class 11 Chemistry Part 1',
            ncertChapter: 'Chapter 4: Chemical Bonding',
            ncertPage: 'Page 109',
            ncertTopic: 'Dipole Moment',
            similarity: 'exact',
            description: 'Comparison of dipole moments of NH3 and NF3 is a classic NCERT example (Fig 4.10).'
        }
    ],

    // Jan 22 Evening Q62 - Group 15 Elements
    'jee_2026_jan22e_q62': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 1',
            ncertChapter: 'Chapter 7: The p-Block Elements',
            ncertPage: 'Page 170-172',
            ncertTopic: 'Anomalous Properties of Nitrogen',
            similarity: 'concept'
        }
    ],

    // Jan 22 Evening Q66 - Coordination Compounds
    'jee_2026_jan22e_q66': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 1',
            ncertChapter: 'Chapter 9: Coordination Compounds',
            ncertPage: 'Page 254-256',
            ncertTopic: 'Crystal Field Theory',
            similarity: 'concept',
            description: 'Understanding of tetrahedral splitting and magnetic properties is required.'
        }
    ],

    // Jan 22 Evening Q67 - Electrochemistry
    'jee_2026_jan22e_q67': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 1',
            ncertChapter: 'Chapter 3: Electrochemistry',
            ncertPage: 'Page 69',
            ncertTopic: 'Electrochemical Series',
            similarity: 'exact',
            description: 'Ordering reducing power based on standard electrode potentials is a direct application of the series.'
        }
    ]
};

// Update questions with source references
let updatedCount = 0;
questions.forEach(q => {
    if (ADDITIONAL_MAPPINGS[q.id]) {
        // Merge with existing or create new
        const newRefs = ADDITIONAL_MAPPINGS[q.id];
        if (q.sourceReferences) {
            // Simple merge avoiding exact duplicates if needed, but for now overwrite is fine or append
            // We'll just overwrite for this script to ensure clean state
            q.sourceReferences = newRefs;
        } else {
            q.sourceReferences = newRefs;
        }
        updatedCount++;
        console.log(`✓ Added sources to: ${q.id}`);
    }
});

fs.writeFileSync(DB_PATH, JSON.stringify(questions, null, 2));
console.log(`\n✅ Updated ${updatedCount} more questions with source references.`);
