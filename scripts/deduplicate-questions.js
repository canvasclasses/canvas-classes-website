/**
 * Remove Duplicate Questions
 * Deduplicates questions based on ID, keeping the last occurrence.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
let questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

console.log(`Initial count: ${questions.length}`);

const uniqueMap = new Map();
let duplicates = 0;

questions.forEach(q => {
    if (uniqueMap.has(q.id)) {
        console.log(`Found duplicate: ${q.id}`);
        duplicates++;
    }
    // Set/Overwrite keeps the last occurrence
    uniqueMap.set(q.id, q);
});

if (duplicates > 0) {
    const deduplicated = Array.from(uniqueMap.values());
    console.log(`\nRemoved ${duplicates} duplicates.`);
    console.log(`Final count: ${deduplicated.length}`);

    fs.writeFileSync(DB_PATH, JSON.stringify(deduplicated, null, 2));
    console.log('✅ Database cleaned.');
} else {
    console.log('\nNo duplicates found! Database is clean.');
}
