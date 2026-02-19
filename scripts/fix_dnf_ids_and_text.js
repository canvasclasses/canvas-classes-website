/**
 * fix_dnf_ids_and_text.js
 *
 * 1. Renames DNF-PYQ-NNN → DNF-NNN in the JSON file
 * 2. Strips exam date/year/shift lines from textMarkdown (e.g. "**[05 Apr 2024 (M)]**")
 * 3. Applies the same changes to both MongoDB collections (questions + questions_v2)
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const JSON_FILE = path.join(__dirname, '../data/questions/chapter_d_and_f_block.json');

// Strips trailing exam date/year/shift annotation lines from question text.
// Matches patterns like:
//   **[JEE Main PYQ]**
//   **[05 Apr 2024 (M)]**
//   **[28 Jul 2022 Morning]**
//   **[04 Apr 2024 (M)]**
//   **[Main PYQ]**
function stripExamLines(text) {
    if (!text) return text;
    // Remove lines that are purely a **[...]** exam annotation (with optional surrounding whitespace/newlines)
    return text
        .replace(/\n+\*\*\[[^\]]*\]\*\*\s*$/g, '')   // trailing **[...]** after newlines
        .replace(/^\*\*\[[^\]]*\]\*\*\s*\n+/g, '')   // leading **[...]** before newlines
        .replace(/\*\*\[[^\]]*\]\*\*/g, '')           // any remaining inline **[...]**
        .trimEnd();
}

async function main() {
    // ── 1. Fix JSON file ──────────────────────────────────────────────────────
    console.log('Reading JSON file...');
    const questions = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

    const fixed = questions.map(q => {
        const newId = q.id.replace(/^DNF-PYQ-/, 'DNF-');
        const newText = stripExamLines(q.textMarkdown);
        return { ...q, id: newId, textMarkdown: newText };
    });

    fs.writeFileSync(JSON_FILE, JSON.stringify(fixed, null, 2));
    console.log(`JSON updated: ${fixed.length} questions`);
    console.log(`  Sample old → new: DNF-PYQ-001 → ${fixed[0].id}`);
    console.log(`  Sample text (first 80 chars): ${fixed[0].textMarkdown.slice(0, 80)}`);

    // ── 2. Fix MongoDB ────────────────────────────────────────────────────────
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    const qCol   = mongoose.connection.db.collection('questions');
    const v2Col  = mongoose.connection.db.collection('questions_v2');

    let qUpdated = 0, v2Updated = 0;

    for (const q of fixed) {
        const oldId = q.id.replace(/^DNF-/, 'DNF-PYQ-');
        const newId = q.id; // e.g. DNF-001
        const cleanText = q.textMarkdown;

        // ── questions collection (flat schema) ──
        // MongoDB doesn't support renaming _id in-place; delete old + upsert new
        const oldDoc = await qCol.findOne({ _id: oldId });
        if (oldDoc) {
            await qCol.deleteOne({ _id: oldId });
            await qCol.replaceOne(
                { _id: newId },
                { ...oldDoc, _id: newId, text_markdown: cleanText },
                { upsert: true }
            );
            qUpdated++;
        } else {
            // Old ID already renamed in a previous run — just update text on new ID
            const existing = await qCol.findOne({ _id: newId });
            if (existing) {
                await qCol.updateOne({ _id: newId }, { $set: { text_markdown: cleanText } });
                qUpdated++;
            }
        }

        // ── questions_v2 collection ──
        // display_id holds the old DNF-PYQ-NNN value; update it + clean question text
        const v2Result = await v2Col.updateOne(
            { display_id: oldId },
            { $set: { display_id: newId, 'question_text.markdown': cleanText } }
        );
        if (v2Result.modifiedCount > 0) v2Updated++;
    }

    console.log(`\nMongoDB 'questions' updated: ${qUpdated}`);
    console.log(`MongoDB 'questions_v2' updated: ${v2Updated}`);

    // Verify
    const sampleV2 = await v2Col.findOne({ display_id: 'DNF-001' });
    console.log('\nVerification (DNF-001 in questions_v2):');
    console.log('  display_id:', sampleV2?.display_id);
    console.log('  text (first 80):', sampleV2?.question_text?.markdown?.slice(0, 80));

    await mongoose.disconnect();
    console.log('\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });
