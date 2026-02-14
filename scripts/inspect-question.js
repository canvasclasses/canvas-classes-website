const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
    console.log(`--- INSPECT QUESTION ---`);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('questions');

        // Find all matches
        const docs = await collection.find({ text_markdown: { $regex: "equal volumes of \\$AB_2\\$ and \\$XY\\$", $options: 'i' } }).toArray();
        console.log(`Found ${docs.length} matching questions.`);

        for (const q of docs) {
            console.log("---");
            console.log("_id:", q._id);
            console.log("chapter_id (DB):", q.chapter_id);
            console.log("chapterId (DB):", q.chapterId);
            console.log("question_code:", q.question_code);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
