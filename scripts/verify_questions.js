const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Load .env from root

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
}

const QuestionSchema = new mongoose.Schema({
    _id: String,
    text_markdown: String,
    chapter_id: String,
    exam_source: String
}, { _id: false });

const Question = mongoose.model('Question', QuestionSchema);

async function verify() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const ids = ['jee_2025_apr8e_salt_1', 'jee_2025_apr7m_salt_1', 'jee_2025_apr7m_salt_2', 'jee_2025_apr3e_salt_1', 'jee_2025_apr2e_salt_1'];
        const found = await Question.find({ _id: { $in: ids } });

        console.log(`Found ${found.length} questions.`);
        found.forEach(q => {
            console.log(`- ${q._id}: ${q.chapter_id} | ${q.exam_source}`);
        });

        if (found.length === 0) {
            console.log("No questions found! Check DB connection or IDs.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
