const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
    const APPLY_CHANGES = process.argv.includes('--apply');
    const MOLE_CONCEPT_CHAPTER_ID = 'TAG_CH_MOLE';

    console.log(`--- MOLE CONCEPT TAG FIXER ---`);
    console.log(`Mode: ${APPLY_CHANGES ? 'APPLY' : 'DRY RUN'}`);

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        // Prefix map
        const qidToTag = {
            'MC_LRY': 'TAG_MOLE_LIMITING_REAGENT',
            'MC_STO': 'TAG_MOLE_STOICHIOMETRY',
            'MC_MIX': 'TAG_MOLE_STOICHIOMETRY',
            'MC_CON': 'TAG_MOLE_CONCENTRATIONS',
            'MC_MOL': 'TAG_MOLE_BASICS',
            'MC_MVD': 'TAG_MOLE_BASICS',
            'MC_SIG': 'TAG_MOLE_BASICS',
            'MC_ABT': 'TAG_MOLE_BASICS',
            'MC_EQV': 'TAG_MOLE_EQUIVALENT',
            'MC_VOL': 'TAG_MOLE_EQUIVALENT',
            'MC_RDX': 'TAG_REDO_BALANCING_OF_REDOX_REACTIONS',
            'MC_EMP': 'TAG_MOLE_EMPIRICAL',
            'MC_EMF': 'TAG_MOLE_EMPIRICAL',
            'MC_EUD': 'TAG_MOLE_EUDIOMETRY'
        };

        const questions = await db.collection('questions').find({
            _id: { $regex: '^MC_' }
        }).toArray();

        console.log(`Found ${questions.length} questions starting with MC_`);

        const updates = [];

        for (const q of questions) {
            const parts = q._id.split('_');
            const prefix = parts.length >= 2 ? parts[0] + '_' + parts[1] : null;
            const targetTag = qidToTag[prefix] || 'TAG_MOLE_BASICS';

            // Only update if it's currently wrong or missing
            if (q.chapter_id !== MOLE_CONCEPT_CHAPTER_ID || q.tag_id !== targetTag) {
                updates.push({
                    qId: q._id,
                    oldCh: q.chapter_id,
                    newCh: MOLE_CONCEPT_CHAPTER_ID,
                    oldTag: q.tag_id,
                    newTag: targetTag
                });
            }
        }

        console.log(`Found ${updates.length} questions that need correction.`);

        if (APPLY_CHANGES && updates.length > 0) {
            console.log(`Applying updates...`);
            const updateOps = updates.map(u => ({
                updateOne: {
                    filter: { _id: u.qId },
                    update: {
                        $set: {
                            chapter_id: u.newCh,
                            tag_id: u.newTag,
                            tags: [{ tag_id: u.newTag, weight: 1.0 }]
                        }
                    }
                }
            }));

            const bulkResult = await db.collection('questions').bulkWrite(updateOps);
            console.log(`Updated ${bulkResult.modifiedCount} questions.`);
        } else {
            if (updates.length > 0) {
                console.log('Sample Updates:');
                console.log(JSON.stringify(updates.slice(0, 10), null, 2));
                console.log('\nRun with --apply to commit these changes.');
            } else {
                console.log('All MC_ questions are already correctly tagged.');
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
