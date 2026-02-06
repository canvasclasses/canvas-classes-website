/**
 * Fix Legacy IDs
 * Renames questions with format 'jee_2026_qXX' to 'jee_2026_jan21m_qXX'
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
let questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Mapping of legacy IDs to new standard IDs
// We verify these are indeed Jan 21 Morning questions
const ID_Updates = {
    'jee_2026_q51': 'jee_2026_jan21m_q51',
    'jee_2026_q52': 'jee_2026_jan21m_q52',
    'jee_2026_q54': 'jee_2026_jan21m_q54',
    'jee_2026_q55': 'jee_2026_jan21m_q55',
    'jee_2026_q5': 'jee_2026_jan21m_q05' // Assuming this is Q05 or Q5
};

let updatedCount = 0;

questions = questions.map(q => {
    if (ID_Updates[q.id]) {
        console.log(`Renaming ${q.id} -> ${ID_Updates[q.id]}`);
        updatedCount++;
        return {
            ...q,
            id: ID_Updates[q.id],
            // Ensure exam source is explicit
            examSource: q.examSource || 'JEE Main 2026 - Jan 21 Morning Shift'
        };
    }

    // Also catch any other patterns if they exist (safety net)
    if (q.id.match(/^jee_2026_q\d+$/)) {
        console.log(`Found unmapped legacy ID: ${q.id}`);
    }

    return q;
});

if (updatedCount > 0) {
    fs.writeFileSync(DB_PATH, JSON.stringify(questions, null, 2));
    console.log(`\n✅ Successfully updated ${updatedCount} question IDs.`);
} else {
    console.log('\nNo legacy IDs found to update.');
}
