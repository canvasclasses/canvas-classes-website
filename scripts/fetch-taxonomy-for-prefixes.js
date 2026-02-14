const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const taxonomySchema = new mongoose.Schema({
    _id: String,
    name: String,
    type: String,
    parent_id: String
}, { _id: false });

const Taxonomy = mongoose.model('Taxonomy', taxonomySchema);

async function fetchTaxonomy() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Fetch only chapters (where type is chapter OR parent_id is null/empty)
        // Adjust filter based on actual schema usage. simpler to fetch all and filter in JS if unsure.
        const nodes = await Taxonomy.find({}).lean();

        const chapters = nodes.filter(n => n.type === 'chapter' || !n.parent_id);

        console.log('--- FOUND CHAPTERS ---');
        console.log(JSON.stringify(chapters, null, 2));

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

fetchTaxonomy();
