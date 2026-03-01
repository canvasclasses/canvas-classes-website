const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    const col = mongoose.connection.db.collection('questions_v2');
    const docs = await col.find({ display_id: /^SALT-\d{3}$/ }).toArray();
    const max = docs.reduce((m, d) => {
        const num = parseInt(d.display_id.split('-')[1]);
        return num > m ? num : m;
    }, 0);
    console.log(`Max SALT ID is: SALT-${max.toString().padStart(3, '0')}`);
    await mongoose.disconnect();
}
main();
