/**
 * fix_dnf_exam_source_full.js
 * Parses examSource strings from JSON and updates questions_v2 with:
 *   exam: "JEE Main", year: YYYY, shift: "M" or "E"
 * Display format in admin: DNF-001 [ 2024 M ]
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const JSON_FILE = path.join(__dirname, '../data/questions/chapter_d_and_f_block.json');

function parseExamSource(str) {
    if (!str) return { exam: 'JEE Main', year: null, shift: null };
    // e.g. "JEE Main 04 Apr 2024 Morning"
    const yearMatch = str.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1]) : null;
    const shift = /morning/i.test(str) ? 'M' : /evening/i.test(str) ? 'E' : null;
    return { exam: 'JEE Main', year, shift };
}

async function main() {
    const questions = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    console.log(`Loaded ${questions.length} DNF questions from JSON`);

    await mongoose.connect(process.env.MONGODB_URI);
    const col = mongoose.connection.db.collection('questions_v2');

    let updated = 0;
    for (const q of questions) {
        const { exam, year, shift } = parseExamSource(q.examSource);
        await col.updateOne(
            { display_id: q.id },
            { $set: { 'metadata.exam_source': { exam, year, shift } } }
        );
        updated++;
    }

    console.log(`Updated ${updated} DNF questions`);

    // Verify
    const samples = await col.find({ display_id: { $in: ['DNF-001','DNF-002','DNF-003','DNF-006'] } }).toArray();
    for (const s of samples) {
        console.log(`${s.display_id}: ${JSON.stringify(s.metadata?.exam_source)}`);
    }

    await mongoose.disconnect();
    console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
