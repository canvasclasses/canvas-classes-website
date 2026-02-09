/**
 * Script to fix taxonomy - ensure only 31 chapters exist
 * Any nodes with type 'chapter' beyond the expected 31 will be converted to 'topic'
 * Run with: node scripts/fix-taxonomy.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// The 31 valid chapter IDs (or patterns to match them)
const VALID_CHAPTER_IDS = [
    'chapter_basic_concepts',
    'chapter_atomic_structure',
    'chapter_periodic_properties',
    'chapter_chemical_bonding',
    'chapter_states_of_matter',
    'chapter_thermodynamics',
    'chapter_chemical_equilibrium',
    'chapter_ionic_equilibrium',
    'chapter_redox',
    'chapter_hydrogen',
    'chapter_s_block',
    'chapter_p_block_13_14',
    'chapter_goc',
    'chapter_general_organic_chemistry_goc',
    'chapter_isomerism',
    'chapter_hydrocarbons',
    'chapter_environmental_chemistry',
    'chapter_solid_state',
    'chapter_solutions',
    'chapter_electrochemistry',
    'chapter_chemical_kinetics',
    'chapter_surface_chemistry',
    'chapter_p_block_15_18',
    'chapter_d_and_f_block',
    'chapter_coordination_compounds',
    'chapter_haloalkanes_haloarenes',
    'chapter_alcohols_phenols_ethers',
    'chapter_aldehydes_ketones',
    'chapter_carboxylic_acids',
    'chapter_amines',
    'chapter_biomolecules',
    'chapter_polymers',
    'chapter_chemistry_in_everyday_life',
    'chapter_salt_analysis'
];

async function main() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('taxonomy');

    // Step 1: Get all current taxonomy nodes
    const allNodes = await collection.find({}).toArray();
    console.log(`\n📊 Current taxonomy: ${allNodes.length} total nodes`);

    // Count by type
    const chapters = allNodes.filter(n => n.type === 'chapter');
    const topics = allNodes.filter(n => n.type === 'topic');
    const others = allNodes.filter(n => n.type !== 'chapter' && n.type !== 'topic');

    console.log(`   - Chapters: ${chapters.length}`);
    console.log(`   - Topics: ${topics.length}`);
    console.log(`   - Other types: ${others.length}`);

    if (chapters.length <= 31) {
        console.log('\n✅ Chapter count is normal (≤31). No fixes needed.');
        await mongoose.disconnect();
        return;
    }

    // Step 2: Find extra chapters (those that should be topics)
    console.log(`\n⚠️ Found ${chapters.length} chapters (expected 31)`);
    console.log('\n📋 All current chapters:');
    chapters.forEach((ch, i) => {
        const isValid = VALID_CHAPTER_IDS.includes(ch._id);
        console.log(`   ${i + 1}. ${ch._id}: ${ch.name} ${isValid ? '✅' : '❌ (should be topic)'}`);
    });

    // Step 3: Find chapters that have a parent_id (these should be topics)
    const chaptersWithParent = chapters.filter(ch => ch.parent_id);
    console.log(`\n🔧 Chapters with parent_id (should be topics): ${chaptersWithParent.length}`);

    // Step 4: Convert incorrect chapters to topics
    let converted = 0;
    for (const ch of chaptersWithParent) {
        console.log(`   Converting: ${ch._id} (parent: ${ch.parent_id})`);
        await collection.updateOne(
            { _id: ch._id },
            { $set: { type: 'topic' } }
        );
        converted++;
    }

    console.log(`\n✅ Converted ${converted} chapters to topics.`);

    // Verify
    const finalChapters = await collection.countDocuments({ type: 'chapter' });
    console.log(`\n📊 Final chapter count: ${finalChapters}`);

    await mongoose.disconnect();
    console.log('\n✅ Done!');
}

main().catch(console.error);
