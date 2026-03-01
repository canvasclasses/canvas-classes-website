require('dotenv').config({ path: '.env.local' });
const m = require('mongoose');
m.connect(process.env.MONGODB_URI).then(async () => {
    const db = m.connection.db;
    const qs = await db.collection('questions_v2').find({ display_id: { $regex: /^ALDO-/ } }).toArray();
    let count = 0;
    for (const q of qs) {
        const n = parseInt(q.display_id.split('-')[1]);
        if (n < 18) continue;
        const stripped = q.question_text.markdown.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
        if (stripped.length < 30) {
            count++;
            console.log(q.display_id + ' | "' + stripped + '"');
        }
    }
    console.log('Total image-only:', count);
    m.disconnect();
});
