const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
    console.log(`--- INSPECT DUPLICATE CANDIDATES ---`);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('questions');

        // Find IONIC-003 and IONIC-004
        const codes = ['IONIC-003', 'IONIC-004'];
        const docs = await collection.find({ question_code: { $in: codes } }).toArray();

        console.log(`Found ${docs.length} documents.`);

        for (const q of docs) {
            console.log("--------------------------------------------------");
            console.log(`CODE: ${q.question_code}`);
            console.log(`ID: ${q._id} (Type: ${typeof q._id}, Constructor: ${q._id.constructor.name})`);
            console.log(`Text (snake): ${q.text_markdown ? q.text_markdown.substring(0, 30) : 'N/A'}`);
            console.log(`Text (camel): ${q.textMarkdown ? q.textMarkdown.substring(0, 30) : 'N/A'}`);
            console.log(`Chapter ID (snake):`, q.chapter_id);
            console.log(`Chapter ID (camel):`, q.chapterId);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
