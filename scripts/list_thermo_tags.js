
const mongoose = require('mongoose');

// Use the URI from list_tags.js
const uri = "mongodb+srv://REDACTED:REDACTED@REDACTED/crucible?retryWrites=true&w=majority&appName=Crucible-Cluster";

const TaxonomySchema = new mongoose.Schema({
    _id: String,
    name: String,
    parent_id: String,
    type: String, // 'subject', 'chapter', 'topic'
    sequence_order: Number
}, { collection: 'taxonomy' });

const Taxonomy = mongoose.model('Taxonomy', TaxonomySchema);

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        // Find Thermodynamics chapter
        // It might be named "Thermodynamics" or "Chemical Thermodynamics" or similar.
        // We'll search by regex.
        const chapters = await Taxonomy.find({
            type: 'chapter',
            name: { $regex: /Thermodynamics/i }
        });

        if (chapters.length === 0) {
            console.log("No Thermodynamics chapter found!");
            return;
        }

        for (const chapter of chapters) {
            console.log(`\nFound Chapter: ${chapter.name} (_id: ${chapter._id})`);

            // Find topics
            const tags = await Taxonomy.find({ parent_id: chapter._id }).sort({ sequence_order: 1 });
            if (tags.length === 0) {
                console.log("  No topics found.");
            } else {
                tags.forEach(t => {
                    console.log(`  - Metric: ${t.name} | ID: ${t._id}`);
                });
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
run();
