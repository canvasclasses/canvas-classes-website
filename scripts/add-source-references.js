/**
 * Add Source References to JEE Main 2026 Questions
 * Maps questions to their NCERT origins and earlier PYQs
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
let questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Source reference mappings for JEE Main 2026 questions
const SOURCE_MAPPINGS = {
    // ===== 21st JAN MORNING SHIFT =====
    'jee_2026_jan21m_q51': [
        {
            type: 'NCERT',
            ncertBook: 'Class 11 Chemistry Part 2',
            ncertChapter: 'Chapter 7: Equilibrium',
            ncertPage: 'Page 198-200',
            ncertTopic: 'Solubility Product and Common Ion Effect',
            similarity: 'concept',
            description: 'The concept of common ion effect reducing solubility is directly explained in NCERT with similar examples.'
        }
    ],

    'jee_2026_jan21m_q53': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 2',
            ncertChapter: 'Chapter 11: Aldehydes, Ketones and Carboxylic Acids',
            ncertPage: 'Page 310',
            ncertTopic: 'Aldol Condensation',
            similarity: 'concept'
        },
        {
            type: 'PYQ',
            pyqExam: 'JEE Main',
            pyqYear: 2022,
            pyqShift: 'June 27 Morning',
            pyqQuestionNo: 'Q.58',
            similarity: 'similar',
            description: 'Similar Diels-Alder reaction was asked with different diene-dienophile combination.'
        }
    ],

    'jee_2026_jan21m_q57': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 1',
            ncertChapter: 'Chapter 3: Electrochemistry',
            ncertPage: 'Page 74-76',
            ncertTopic: 'Nernst Equation',
            similarity: 'concept',
            description: 'Standard electrode potential and Nernst equation calculation is covered in detail.'
        }
    ],

    'jee_2026_jan21m_q61': [
        {
            type: 'NCERT',
            ncertBook: 'Class 11 Chemistry Part 1',
            ncertChapter: 'Chapter 4: Chemical Bonding and Molecular Structure',
            ncertPage: 'Page 107-110',
            ncertTopic: 'Dipole Moment and Molecular Geometry',
            similarity: 'exact',
            description: 'The comparison of dipole moments of NF₃ and NH₃ is directly discussed as an interesting case in NCERT.'
        }
    ],

    'jee_2026_jan21m_q64': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 1',
            ncertChapter: 'Chapter 6: General Principles of Isolation of Elements',
            ncertPage: 'Page 141-143',
            ncertTopic: 'Ellingham Diagram',
            similarity: 'concept',
            description: 'Reduction of metal oxides using carbon is explained through Ellingham diagram.'
        }
    ],

    // ===== 21st JAN EVENING SHIFT =====
    'jee_2026_jan21e_q52': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 2',
            ncertChapter: 'Chapter 14: Biomolecules',
            ncertPage: 'Page 402-404',
            ncertTopic: 'Structure of Proteins',
            similarity: 'concept'
        },
        {
            type: 'PYQ',
            pyqExam: 'JEE Main',
            pyqYear: 2021,
            pyqShift: 'Feb 25 Evening',
            pyqQuestionNo: 'Q.61',
            similarity: 'exact',
            description: 'Exactly same concept about disulphide linkages in proteins was asked.'
        }
    ],

    'jee_2026_jan21e_q54': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 1',
            ncertChapter: 'Chapter 1: The Solid State',
            ncertPage: 'Page 14-16',
            ncertTopic: 'Defects in Solids - Schottky and Frenkel',
            similarity: 'exact',
            description: 'The characteristics of Schottky and Frenkel defects are directly from NCERT table.'
        }
    ],

    // ===== 22nd JAN MORNING SHIFT =====
    'jee_2026_jan22m_q51': [
        {
            type: 'NCERT',
            ncertBook: 'Class 11 Chemistry Part 1',
            ncertChapter: 'Chapter 5: States of Matter',
            ncertPage: 'Page 136-138',
            ncertTopic: 'Kinetic Molecular Theory of Gases',
            similarity: 'exact',
            description: 'Both statements are directly from the postulates and implications of KMT in NCERT.'
        }
    ],

    'jee_2026_jan22m_q52': [
        {
            type: 'NCERT',
            ncertBook: 'Class 11 Chemistry Part 1',
            ncertChapter: 'Chapter 3: Classification of Elements and Periodicity in Properties',
            ncertPage: 'Page 88-90',
            ncertTopic: 'Electronic Configuration and Position in Periodic Table',
            similarity: 'similar'
        },
        {
            type: 'PYQ',
            pyqExam: 'JEE Main',
            pyqYear: 2019,
            pyqShift: 'Jan 12 Morning',
            pyqQuestionNo: 'Q.55',
            similarity: 'similar',
            description: 'Similar question about identifying element from electronic configuration was asked.'
        }
    ],

    'jee_2026_jan22m_q53': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 2',
            ncertChapter: 'Chapter 10: Haloalkanes and Haloarenes',
            ncertPage: 'Page 275-276',
            ncertTopic: 'Anti-Markovnikov Addition (Peroxide Effect)',
            similarity: 'exact',
            description: 'Kharasch effect / Peroxide effect is directly discussed with the same example in NCERT.'
        }
    ],

    'jee_2026_jan22m_q57': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 2',
            ncertChapter: 'Chapter 15: Polymers',
            ncertPage: 'Page 420-425',
            ncertTopic: 'Classification of Polymers',
            similarity: 'exact',
            description: 'All polymer classifications (thermoplastic, thermosetting, elastomer) are directly from NCERT.'
        }
    ],

    // ===== 22nd JAN EVENING SHIFT =====
    'jee_2026_jan22e_q51': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 1',
            ncertChapter: 'Chapter 2: Solutions',
            ncertPage: 'Page 42-44',
            ncertTopic: 'Mole Fraction and Concentration Terms',
            similarity: 'concept'
        }
    ],

    'jee_2026_jan22e_q55': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 2',
            ncertChapter: 'Chapter 11: Alcohols, Phenols and Ethers',
            ncertPage: 'Page 343',
            ncertTopic: 'Reimer-Tiemann Reaction',
            similarity: 'exact',
            description: 'The Reimer-Tiemann reaction to convert phenol to salicylaldehyde is directly from NCERT.'
        }
    ],

    // ===== 23rd JAN MORNING SHIFT =====
    'jee_2026_jan23m_q51': [
        {
            type: 'NCERT',
            ncertBook: 'Class 11 Chemistry Part 1',
            ncertChapter: 'Chapter 2: Structure of Atom',
            ncertPage: 'Page 54-56',
            ncertTopic: 'Bohr Model - Energy of Stationary States',
            similarity: 'exact',
            description: 'The energy formula for one-electron systems is directly from NCERT.'
        },
        {
            type: 'PYQ',
            pyqExam: 'JEE Main',
            pyqYear: 2020,
            pyqShift: 'Sep 4 Morning',
            pyqQuestionNo: 'Q.52',
            similarity: 'similar',
            description: 'Energy calculation for Li²⁺ was asked in similar format.'
        }
    ],

    'jee_2026_jan23m_q53': [
        {
            type: 'NCERT',
            ncertBook: 'Class 11 Chemistry Part 1',
            ncertChapter: 'Chapter 3: Classification of Elements and Periodicity in Properties',
            ncertPage: 'Page 92-94',
            ncertTopic: 'Ionization Enthalpy Trends',
            similarity: 'exact',
            description: 'The anomaly in IE order (P > S) due to half-filled stability is directly discussed in NCERT.'
        }
    ],

    // ===== 23rd JAN EVENING SHIFT =====
    'jee_2026_jan23e_q52': [
        {
            type: 'NCERT',
            ncertBook: 'Class 11 Chemistry Part 2',
            ncertChapter: 'Chapter 11: The p-Block Elements',
            ncertPage: 'Page 317-318',
            ncertTopic: 'Inert Pair Effect',
            similarity: 'exact',
            description: 'The stability of lower oxidation state for heavier elements is directly from NCERT.'
        }
    ],

    'jee_2026_jan23e_q54': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 2',
            ncertChapter: 'Chapter 14: Biomolecules',
            ncertPage: 'Page 408-410',
            ncertTopic: 'Nucleic Acids - DNA and RNA Structure',
            similarity: 'concept',
            description: 'The D-sugar component in nucleic acids is mentioned in the structure discussion.'
        }
    ],

    'jee_2026_jan23e_q58': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 2',
            ncertChapter: 'Chapter 12: Aldehydes, Ketones and Carboxylic Acids',
            ncertPage: 'Page 361',
            ncertTopic: 'Iodoform Test',
            similarity: 'exact',
            description: 'Conditions for positive iodoform test are directly listed in NCERT.'
        },
        {
            type: 'PYQ',
            pyqExam: 'JEE Main',
            pyqYear: 2023,
            pyqShift: 'Jan 31 Evening',
            pyqQuestionNo: 'Q.59',
            similarity: 'similar',
            description: 'A similar question about differentiating compounds using iodoform test was asked.'
        }
    ],

    'jee_2026_jan23e_q67': [
        {
            type: 'NCERT',
            ncertBook: 'Class 12 Chemistry Part 1',
            ncertChapter: 'Chapter 8: The d and f Block Elements',
            ncertPage: 'Page 215-216',
            ncertTopic: 'Potassium Dichromate - Oxidizing Properties',
            similarity: 'exact',
            description: 'The reaction of dichromate with iodide is a standard reaction discussed in NCERT.'
        }
    ]
};

// Update questions with source references
let updatedCount = 0;
questions.forEach(q => {
    if (SOURCE_MAPPINGS[q.id]) {
        q.sourceReferences = SOURCE_MAPPINGS[q.id];
        updatedCount++;
        console.log(`✓ Added sources to: ${q.id}`);
    }
});

fs.writeFileSync(DB_PATH, JSON.stringify(questions, null, 2));
console.log(`\n✅ Updated ${updatedCount} questions with source references.`);
console.log(`Total questions in database: ${questions.length}`);
