
const mongoose = require('mongoose');

const uri = "mongodb+srv://REDACTED:REDACTED@REDACTED/crucible?retryWrites=true&w=majority&appName=Crucible-Cluster";

const TaxonomySchema = new mongoose.Schema({
    _id: String,
    name: String,
    parent_id: String,
    type: String,
    sequence_order: Number
}, { collection: 'taxonomy' });

const Taxonomy = mongoose.model('Taxonomy', TaxonomySchema);

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        // Find chapter first
        const chapter = await Taxonomy.findOne({
            $or: [
                { name: "Atomic Structure" },
                { _id: "chapter_atomic_structure" }
            ]
        });

        if (!chapter) {
            console.log("Chapter 'Atomic Structure' not found.");
            return;
        }
        console.log(`Chapter Found: ${chapter.name} (${chapter._id})`);

        // Find tags with this parent_id
        const tags = await Taxonomy.find({ parent_id: chapter._id }).sort({ sequence_order: 1 });

        console.log("\nAvailable Concept Tags:");
        tags.forEach(t => {
            console.log(`- ${t.name} (order: ${t.sequence_order}): ${t._id}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
run();
