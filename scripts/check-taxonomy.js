/**
 * Quick diagnostic to see what the "other types" are in MongoDB taxonomy
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('taxonomy');

    // Get all unique types
    const allNodes = await collection.find({}).toArray();
    const uniqueTypes = [...new Set(allNodes.map(n => n.type))];
    console.log('\n📊 Unique types:', uniqueTypes);

    // Show the "other" type nodes
    const others = allNodes.filter(n => n.type !== 'chapter' && n.type !== 'topic');
    console.log(`\n📋 "Other" type nodes (${others.length}):`);
    others.forEach(n => {
        console.log(`   - ${n._id}: type="${n.type}", name="${n.name}", parent="${n.parent_id}"`);
    });

    // List all chapters
    const chapters = allNodes.filter(n => n.type === 'chapter');
    console.log(`\n📚 All Chapters (${chapters.length}):`);
    chapters.forEach((ch, i) => {
        console.log(`   ${i + 1}. ${ch.name} (id: ${ch._id})`);
    });

    await mongoose.disconnect();
}

main().catch(console.error);
