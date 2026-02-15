const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Load .env from root

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
}

const TaxonomySchema = new mongoose.Schema({
    _id: String,
    name: String,
    type: String
}, { collection: 'taxonomy' });

const Taxonomy = mongoose.model('Taxonomy', TaxonomySchema);

async function verify() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const chapters = await Taxonomy.find({ type: 'chapter' });
        console.log(`Found ${chapters.length} chapters.`);

        const relevant = chapters.filter(c =>
            c.name.toLowerCase().includes('salt') ||
            c._id.includes('salt') ||
            c.name.toLowerCase().includes('practical') ||
            c._id.includes('practical')
        );

        if (relevant.length > 0) {
            console.log('✅ Found relevant chapters:');
            relevant.forEach(c => console.log(`- ${c.name} (${c._id})`));
        } else {
            console.log('❌ No specific Salt Analysis chapter found.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
