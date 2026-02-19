const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;

// Define a schema that allows any fields
const questionSchema = new mongoose.Schema({
    id: String,
    _id: mongoose.Schema.Types.Mixed
}, { strict: false });

const Question = mongoose.model('Question', questionSchema);

async function main() {
    console.log("Connecting to MongoDB to fix duplicates...");
    if (!MONGO_URI) {
        console.error("MONGODB_URI missing");
        process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log("Connected.");

    // Find all documents
    const allDocs = await Question.find({});
    console.log(`Analyzing ${allDocs.length} documents...`);

    const duplicates = [];

    for (const doc of allDocs) {
        // Check if _id is an ObjectId (24 char hex)
        // AND we have a 'id' field that looks like a valid ID (e.g. MOLE-001)
        // If so, this is likely a duplicate created by the buggy script.
        // Valid questions use String _id (e.g. "MOLE-001")

        const idStr = doc._id.toString();
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(idStr);

        if (isObjectId) {
            // It's an ObjectId. Check if it seems to be a question that should have a string ID.
            if (doc.id && typeof doc.id === 'string' && doc.id.length > 0) {
                // Determine if this is a duplicate.
                // Does a document with _id = doc.id Exist?
                // If yes, this ObjectId one is definitely a duplicate.
                // IF no, maybe this IS the only copy (but with wrong ID type)?
                // Since we want to enforce String IDs, we should DELETE this and ensure the correct one exists.
                // But my sync will handle the "ensure correct one exists".
                // So I can delete this safely IF I re-sync.
                duplicates.push(doc._id);
            }
        }
    }

    console.log(`Found ${duplicates.length} duplicate/invalid documents.`);

    if (duplicates.length > 0) {
        console.log("Deleting...");
        const res = await Question.deleteMany({ _id: { $in: duplicates } });
        console.log(`Deleted ${res.deletedCount} documents.`);
    } else {
        console.log("No duplicates found.");
    }

    await mongoose.disconnect();
}

main().catch(err => console.error(err));
