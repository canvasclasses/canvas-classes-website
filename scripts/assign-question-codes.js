const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// --- COPY OF PREFIX REGISTRY ---
const CHAPTER_PREFIXES = {
    // Physical Chemistry
    'chapter_atomic_structure': 'ATOM',
    'chapter_basic_concepts_mole_concept': 'MOLE',
    'chapter_gaseous_state': 'GAS',
    'chapter_thermodynamics': 'THERMO',
    'chapter_chemical_equilibrium': 'EQUIL',
    'chapter_ionic_equilibrium': 'IONIC',
    'chapter_redox_reactions': 'REDOX',
    'chapter_solid_state': 'SOLID',
    'chapter_solutions': 'SOL',
    'chapter_electrochemistry': 'ELECT',
    'chapter_chemical_kinetics': 'KINET',
    'chapter_surface_chemistry': 'SURF',

    // Inorganic Chemistry
    'chapter_periodic_properties': 'PERIODIC',
    'chapter_chemical_bonding': 'BOND',
    'chapter_hydrogen': 'HYDRO',
    'chapter_s_block_elements': 'SBLOCK',
    'chapter_p_block_group_13_14': 'PBLOCK1', // Group 13-14
    'chapter_p_block_12th': 'PBLOCK2',       // Group 15-18
    'chapter_d_f_block': 'DFBLOCK',
    'chapter_coordination_compounds': 'COORD',
    'chapter_metallurgy': 'METAL',
    'chapter_salt_analysis': 'SALT',
    'chapter_environmental_chemistry': 'ENV',

    // Organic Chemistry
    'chapter_general_organic_chemistry_goc': 'GOC',
    'chapter_hydrocarbons': 'HYDROC',
    'chapter_haloalkanes_and_haloarenes': 'RX',
    'chapter_alcohols_phenols_and_ethers': 'ROH',
    'chapter_aldehydes_ketones': 'ALD',
    'chapter_carboxylic_acids_and_derivatives': 'CARB',
    'chapter_amines': 'AMINE',
    'chapter_biomolecules': 'BIO',
    'chapter_polymers': 'POLY',
    'chapter_chemistry_in_everyday_life': 'CHEMLYF',
    'chapter_stereochemistry': 'STEREO',
    'chapter_practical_organic_chemistry': 'POC',
    'chapter_aromatic_compounds': 'AROM',

    // Fallback
    'default': 'GEN'
};

async function run() {
    const APPLY = process.argv.includes('--apply');
    console.log(`--- QUESTION CODE ASSIGNER ---`);
    console.log(`Mode: ${APPLY ? 'APPLY (Writing to DB)' : 'DRY RUN (Read-only)'}`);

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('questions');

        // 1. Get all questions
        const questions = await collection.find({}).toArray();
        console.log(`Found ${questions.length} total questions.`);

        // 1a. Validate Taxonomy
        const taxonomyCollection = db.collection('taxonomy');
        const validChapters = await taxonomyCollection.find({ type: 'chapter' }).toArray();
        const validChapterIds = new Set(validChapters.map(c => c._id));

        console.log(`\n--- Validating Taxonomy (${validChapters.length} active chapters) ---`);
        for (const [key, val] of Object.entries(CHAPTER_PREFIXES)) {
            if (key === 'default') continue;
            // Some keys in map might be legacy mappings or aliases, but ideally should match DB
            if (!validChapterIds.has(key)) {
                console.warn(`WARNING: Script has prefix for '${key}' which is NOT in active taxonomy.`);
            }
        }


        // 2. Group by Chapter
        const byChapter = {};
        for (const q of questions) {
            const chId = q.chapter_id || q.chapterId || 'unknown';
            if (!byChapter[chId]) byChapter[chId] = [];
            byChapter[chId].push(q);
        }

        const updates = [];

        // 3. Process each chapter
        for (const [chId, chapterQuestions] of Object.entries(byChapter)) {
            const prefix = CHAPTER_PREFIXES[chId] || 'GEN';
            console.log(`Processing Chapter: ${chId} (Prefix: ${prefix}) - ${chapterQuestions.length} questions`);

            // Sort questions to ensure stable ordering (e.g. by created date or existing ID)
            // If we have 'jee_2026_...' IDs, simple sort works well to keep order roughly chronological/logical
            chapterQuestions.sort((a, b) => String(a._id).localeCompare(String(b._id)));

            let count = 1;
            for (const q of chapterQuestions) {
                // If question already has a valid code with correct prefix, verify/skip?
                // For now, let's re-assign or fill missing to ensure consistency. 
                // BUT, to avoid breaking links if we run this later, we should ONLY assign if missing.
                // HOWEVER, since this is the FIRST RUN, we want to assign everything.

                // Let's generate the code
                const newCode = `${prefix}-${String(count).padStart(3, '0')}`; // ATOM-001, ATOM-002...

                // Only update if it's different
                if (q.question_code !== newCode) {
                    updates.push({
                        qId: q._id,
                        oldCode: q.question_code,
                        newCode: newCode,
                        chapter: chId
                    });
                }
                count++;
            }
        }

        console.log(`\nProposed Updates: ${updates.length}`);

        if (updates.length > 0) {
            // Show sample
            console.log('Sample Updates:');
            console.log(updates.slice(0, 10));

            if (APPLY) {
                console.log('\nApplying updates to MongoDB...');
                const bulkOps = updates.map(u => ({
                    updateOne: {
                        filter: { _id: u.qId },
                        update: { $set: { question_code: u.newCode } }
                    }
                }));

                const result = await collection.bulkWrite(bulkOps);
                console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
            } else {
                console.log('\nrun with --apply to execute.');
            }
        } else {
            console.log('All questions have correct codes.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
