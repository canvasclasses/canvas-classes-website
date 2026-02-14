const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
    console.log(`--- FETCH TAXONOMY ---`);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('taxonomy');

        // Fetch all distinct chapters
        const chapters = await collection.find({ type: 'chapter' }).toArray();
        console.log(`Found ${chapters.length} chapters.`);
        for (const c of chapters) {
            console.log(`ID: ${c._id}, Name: ${c.name}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
