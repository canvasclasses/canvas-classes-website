const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        const qId = 'jee_2026_jan22e_q60';
        const q = await db.collection('questions').findOne({ _id: qId });

        if (q) {
            const newText = 'Match List-I with List-II :\n\n| List-I (Reaction of glucose with) | List-II (Product) |\n| :--- | :--- |\n| A. Hydroxylamine | IV. Glucoxime |\n| B. Br$_2$ water | I. Gluconic acid |\n| C. Excess acetic anhydride | II. Glucose pentacetate |\n| D. Concentrated HNO$_3$ | III. Saccharic acid |';

            await db.collection('questions').updateOne(
                { _id: qId },
                { $set: { text_markdown: newText } }
            );
            console.log('Successfully updated question to table format.');
        } else {
            console.log('Question not found in database.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
