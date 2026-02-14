const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('questions');

        const total = await collection.countDocuments();
        const withCode = await collection.countDocuments({ question_code: { $exists: true, $ne: null } });

        console.log(`Total Questions: ${total}`);
        console.log(`With question_code: ${withCode}`);

        const sample = await collection.findOne({ question_code: { $exists: true } });
        console.log('Sample:', sample ? { id: sample._id, code: sample.question_code } : 'None');

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
