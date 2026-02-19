/**
 * fix_dnf_exam_display.js
 * Updates DNF questions in questions_v2 so exam_source.shift uses "M"/"E"
 * instead of "Morning"/"Evening", and removes the day from the display label.
 * The display_id stays as DNF-NNN; the admin list label is built from
 * metadata.exam_source fields (year + shift).
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    const col = mongoose.connection.db.collection('questions_v2');

    const docs = await col.find({ display_id: { $regex: '^DNF-' } }).toArray();
    console.log(`Found ${docs.length} DNF questions`);

    let updated = 0;
    for (const doc of docs) {
        const es = doc.metadata?.exam_source;
        if (!es) continue;

        let shift = es.shift || '';
        // Normalise Morning/Evening → M/E
        if (/morning/i.test(shift)) shift = 'M';
        else if (/evening/i.test(shift)) shift = 'E';

        // Also normalise exam name: keep "JEE Main" only (drop full date string)
        let exam = es.exam || '';
        // Strip day/month from exam string if it crept in (e.g. "JEE Main 04 Apr 2024 Morning")
        exam = exam.replace(/\s+\d{1,2}\s+\w+\s+\d{4}\s*(Morning|Evening)?/i, '').trim();
        if (!exam) exam = 'JEE Main';

        await col.updateOne(
            { _id: doc._id },
            { $set: { 'metadata.exam_source.shift': shift, 'metadata.exam_source.exam': exam } }
        );
        updated++;
    }

    console.log(`Updated ${updated} DNF questions`);

    // Verify sample
    const sample = await col.findOne({ display_id: 'DNF-001' });
    console.log('Sample DNF-001 exam_source:', sample?.metadata?.exam_source);

    await mongoose.disconnect();
    console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
