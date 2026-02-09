/**
 * One-time script to sync exam_source from Supabase to MongoDB
 * Run with: npx ts-node scripts/fix-exam-source.ts
 */

const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Connected to Supabase');

    // Step 1: Get all JEE 2026 questions from Supabase
    const { data: sbQuestions, error } = await supabase
        .from('questions')
        .select('id, exam_source')
        .ilike('exam_source', '%2026%');

    if (error) {
        console.error('❌ Supabase error:', error);
        process.exit(1);
    }

    console.log(`📦 Found ${sbQuestions.length} JEE 2026 questions in Supabase`);

    // Step 2: Update each question in MongoDB
    const db = mongoose.connection.db;
    const collection = db.collection('questions');

    let updated = 0;
    let notFound = 0;

    for (const q of sbQuestions) {
        const result = await collection.updateOne(
            { _id: q.id },
            { $set: { exam_source: q.exam_source } }
        );

        if (result.matchedCount > 0) {
            updated++;
            console.log(`✅ Updated: ${q.id} -> "${q.exam_source}"`);
        } else {
            notFound++;
            console.log(`⚠️ Not found in MongoDB: ${q.id}`);
        }
    }

    console.log('\n📊 Summary:');
    console.log(`  - Updated: ${updated}`);
    console.log(`  - Not found: ${notFound}`);

    // Step 3: Verify the fix
    const verifyResult = await collection.find({
        _id: { $regex: /jee_2026/i }
    }).project({ _id: 1, exam_source: 1 }).limit(10).toArray();

    console.log('\n🔍 Verification (first 10 jee_2026 questions in MongoDB):');
    verifyResult.forEach(q => {
        console.log(`  - ${q._id}: ${q.exam_source || '(empty)'}`);
    });

    // Step 4: Sync ALL taxonomy (chapters + topics/tags)
    console.log('\n🌿 Syncing taxonomy...');
    const taxonomyCollection = db.collection('taxonomy');

    // Clear existing
    await taxonomyCollection.deleteMany({});

    // Get ALL taxonomy nodes from Supabase (chapters + topics/tags)
    const { data: allTaxonomy, error: tError } = await supabase
        .from('taxonomy')
        .select('*');

    if (tError) {
        console.error('❌ Taxonomy error:', tError);
    } else {
        for (const node of allTaxonomy) {
            await taxonomyCollection.insertOne({
                _id: node.id,
                name: node.name,
                parent_id: node.parent_id,
                type: node.type || 'chapter',
                sequence_order: node.sequence_order,
                class_level: node.class_level
            });
        }
        console.log(`✅ Inserted ${allTaxonomy.length} taxonomy nodes (chapters + topics)`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
}

main().catch(console.error);
