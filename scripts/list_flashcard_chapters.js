require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Flashcard = mongoose.connection.collection('flashcards');

        const chapters = await Flashcard.aggregate([
            { $match: { deleted_at: null } },
            { $group: { _id: '$chapter.name', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]).toArray();

        console.log(`Chapters with flashcards (${chapters.length} total):\n`);
        chapters.forEach((c) => console.log(`  ${c._id.padEnd(50)} (${c.count} cards)`));

        await mongoose.disconnect();
    } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
})();
