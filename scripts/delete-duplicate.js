const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('dotenv').config({ path: '.env.local' });

async function run() {
    console.log(`--- DELETE DUPLICATE QUESTION ---`);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('questions');

        // We want to delete the one that has an ObjectId _id (IONIC-003)
        // The one with String _id (IONIC-004) is the correct/current one.

        // 1. Find it first to be sure
        const duplicate = await collection.findOne({
            // We can't easily query by type in findOne standard filters easily without $type
            // But we know it has question_code 'IONIC-003' and chapterId (camelCase)
            question_code: 'IONIC-003',
            chapterId: { $exists: true }
        });

        if (duplicate) {
            console.log("Found duplicate candidate:");
            console.log(`ID: ${duplicate._id} (Type: ${typeof duplicate._id}, Constructor: ${duplicate._id.constructor.name})`);
            console.log(`Code: ${duplicate.question_code}`);

            if (duplicate._id instanceof ObjectId) {
                console.log("Deleting duplicate...");
                const result = await collection.deleteOne({ _id: duplicate._id });
                console.log(`Deleted count: ${result.deletedCount}`);
            } else {
                console.log("WARNING: Found document is NOT an ObjectId. Aborting to avoid deleting wrong one.");
            }
        } else {
            console.log("Duplicate IONIC-003 (with camelCase chapterId) not found.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
