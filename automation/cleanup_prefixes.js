const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function cleanup() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db('crucible');
        const col = db.collection('questions_v2');

        console.log("=== PHASE 1: Fix Rogue chapter_id values ===\n");

        // 1. ch12_chem_kinetics → ch12_kinetics
        let r = await col.updateMany(
            { "metadata.chapter_id": "ch12_chem_kinetics" },
            { $set: { "metadata.chapter_id": "ch12_kinetics" } }
        );
        console.log(`ch12_chem_kinetics → ch12_kinetics: ${r.modifiedCount} fixed`);

        // 2. ch12_aldehyde_ketone → ch12_carbonyl
        r = await col.updateMany(
            { "metadata.chapter_id": "ch12_aldehyde_ketone" },
            { $set: { "metadata.chapter_id": "ch12_carbonyl" } }
        );
        console.log(`ch12_aldehyde_ketone → ch12_carbonyl: ${r.modifiedCount} fixed`);

        // 3. ch12_carboxylic_acid → ch12_carbonyl
        r = await col.updateMany(
            { "metadata.chapter_id": "ch12_carboxylic_acid" },
            { $set: { "metadata.chapter_id": "ch12_carbonyl" } }
        );
        console.log(`ch12_carboxylic_acid → ch12_carbonyl: ${r.modifiedCount} fixed`);

        // 4. ch12_phenols → ch12_alcohols
        r = await col.updateMany(
            { "metadata.chapter_id": "ch12_phenols" },
            { $set: { "metadata.chapter_id": "ch12_alcohols" } }
        );
        console.log(`ch12_phenols → ch12_alcohols: ${r.modifiedCount} fixed`);

        console.log("\n=== PHASE 2: Rename Rogue display_id Prefixes ===\n");

        // Helper to rename display_ids
        async function renamePrefix(oldPrefix, newPrefix, chapterId) {
            const docs = await col.find({ display_id: { $regex: `^${oldPrefix}-` } }).toArray();
            if (docs.length === 0) {
                console.log(`${oldPrefix} → ${newPrefix}: No documents found, skipping.`);
                return;
            }

            // Find next available number for the new prefix
            const existingNew = await col.find({ display_id: { $regex: `^${newPrefix}-` } }).toArray();
            let maxNum = 0;
            for (const d of existingNew) {
                const num = parseInt(d.display_id.split('-')[1]);
                if (num > maxNum) maxNum = num;
            }

            let nextNum = maxNum + 1;
            let renamed = 0;

            for (const doc of docs) {
                const oldId = doc.display_id;
                const newId = `${newPrefix}-${String(nextNum).padStart(3, '0')}`;

                // Update display_id
                const updateFields = { display_id: newId };

                // Also fix chapter_id if needed
                if (chapterId) {
                    updateFields["metadata.chapter_id"] = chapterId;
                }

                await col.updateOne({ _id: doc._id }, { $set: updateFields });
                console.log(`  ${oldId} → ${newId}`);
                nextNum++;
                renamed++;
            }
            console.log(`${oldPrefix} → ${newPrefix}: ${renamed} renamed`);
        }

        await renamePrefix('IOCE', 'IEQ', 'ch11_ionic_eq');
        await renamePrefix('DBLOCK', 'DNF', 'ch12_dblock');
        await renamePrefix('ELEC', 'EC', 'ch12_electrochem');
        await renamePrefix('SBLOCK', 'PB12', 'ch12_pblock');
        await renamePrefix('ALDE', 'ALDO', 'ch12_carbonyl');
        await renamePrefix('ACID', 'ALDO', 'ch12_carbonyl');
        await renamePrefix('PHEN', 'ALCO', 'ch12_alcohols');

        console.log("\n=== PHASE 3: Verification ===\n");

        // Re-run the prefix audit
        const allQs = await col.find({}, { projection: { display_id: 1, "metadata.chapter_id": 1 } }).toArray();
        const prefixMap = {};
        for (const q of allQs) {
            if (!q.display_id) continue;
            const prefix = q.display_id.split('-')[0];
            const chapter = q.metadata?.chapter_id || 'UNKNOWN';
            if (!prefixMap[chapter]) prefixMap[chapter] = {};
            if (!prefixMap[chapter][prefix]) prefixMap[chapter][prefix] = 0;
            prefixMap[chapter][prefix]++;
        }

        let hasIssues = false;
        for (const chapter of Object.keys(prefixMap).sort()) {
            const prefixes = Object.keys(prefixMap[chapter]);
            if (prefixes.length > 1) {
                hasIssues = true;
                console.log(`⚠️  ${chapter}: ${prefixes.map(p => `${p}(${prefixMap[chapter][p]})`).join(', ')}`);
            } else {
                console.log(`✅ ${chapter}: ${prefixes[0]}(${prefixMap[chapter][prefixes[0]]})`);
            }
        }

        if (!hasIssues) {
            console.log("\n🎉 All chapters now have exactly ONE canonical prefix!");
        }

    } finally {
        await client.close();
    }
}

cleanup();
