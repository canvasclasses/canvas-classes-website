const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        const untagged = await db.collection('questions').find({
            $or: [{ tag_id: { $exists: false } }, { tag_id: null }, { tag_id: '' }]
        }).toArray();

        const taxonomy = await db.collection('taxonomy').find({}).toArray();

        const chapterById = {};
        const chapterByName = {};
        taxonomy.filter(n => n.type === 'chapter').forEach(c => {
            chapterById[c._id] = c;
            chapterByName[c.name.toLowerCase()] = c;
        });

        const tagsByParentId = {};
        taxonomy.filter(n => n.type === 'topic').forEach(t => {
            if (!tagsByParentId[t.parent_id]) tagsByParentId[t.parent_id] = [];
            tagsByParentId[t.parent_id].push({ id: t._id, name: t.name });
        });

        const recommendations = [];
        untagged.forEach(q => {
            let chNode = chapterById[q.chapter_id] || chapterByName[(q.chapter_id || '').toLowerCase()];

            if (!chNode && q.chapter_id) {
                const chNameNorm = q.chapter_id.toLowerCase().replace(/[^a-z0-9]/g, '');
                chNode = Object.values(chapterById).find(c =>
                    c.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(chNameNorm) ||
                    chNameNorm.includes(c.name.toLowerCase().replace(/[^a-z0-9]/g, ''))
                );
            }

            const possibleTags = chNode ? tagsByParentId[chNode._id] : [];

            let suggestedTag = null;
            if (possibleTags && possibleTags.length > 0) {
                const text = ((q.text_markdown || '') + ' ' + (q.solution?.text_latex || '')).toLowerCase();
                for (const tag of possibleTags) {
                    const tagNameLower = tag.name.toLowerCase();
                    // Require full word match for short tags to avoid false positives
                    const regex = new RegExp('\\b' + tagNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
                    if (regex.test(text)) {
                        suggestedTag = tag;
                        break;
                    }
                }
            }

            recommendations.push({
                qId: q._id,
                ch: q.chapter_id,
                resolvedCh: chNode ? chNode.name : 'Unknown',
                text: q.text_markdown ? q.text_markdown.substring(0, 80) + '...' : '',
                suggestedTag: suggestedTag ? suggestedTag.name : 'None',
                suggestedTagId: suggestedTag ? suggestedTag.id : null
            });
        });

        console.log('--- AUTO-TAG ANALYSIS ---');
        console.log(`Total Untagged: ${untagged.length}`);
        console.log(`Success Rate: ${recommendations.filter(r => r.suggestedTagId).length} / ${untagged.length}`);
        console.log('-------------------------');

        // Output suggestions for review
        console.log(JSON.stringify(recommendations.filter(r => r.suggestedTagId).slice(0, 30), null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

run();
