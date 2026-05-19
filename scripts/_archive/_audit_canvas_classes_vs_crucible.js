/**
 * scripts/_audit_canvas_classes_vs_crucible.js
 *
 * READ-ONLY. Compare `canvas_classes` (old DB) and `test` (orphan)
 * against `crucible` to answer: is anything in them UNIQUE, or all
 * already represented in crucible?
 */
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const cc = client.db('canvas_classes');
    const cr = client.db('crucible');
    const ts = client.db('test');

    console.log('\n========== canvas_classes vs crucible ==========\n');

    // --- canvas_classes.questions vs crucible.questions (V1) and questions_v2
    const ccQ = cc.collection('questions');
    const ccQCount = await ccQ.countDocuments();
    console.log(`canvas_classes.questions:           ${ccQCount} docs`);

    const ccSample = await ccQ.find({}).limit(3).toArray();
    console.log('\n  Sample doc shape:');
    for (const d of ccSample) {
        console.log('   ', JSON.stringify({
            _id: d._id,
            question_code: d.question_code,
            chapter_id: d.chapter_id,
            type: d.type,
            text_markdown_preview: (d.text_markdown || '').slice(0, 80),
        }));
    }

    // Are these _id values present in crucible.questions or crucible.questions_v2?
    const ccIds = await ccQ.find({}).project({ _id: 1, question_code: 1 }).toArray();
    const idList = ccIds.map((d) => d._id);
    const codeList = ccIds.map((d) => d.question_code).filter(Boolean);

    const crV1Same = await cr.collection('questions').countDocuments({ _id: { $in: idList } });
    const crV2Same = await cr.collection('questions_v2').countDocuments({ _id: { $in: idList } });
    console.log(`\n  Of those ${ccQCount} _id values:`);
    console.log(`    - present in crucible.questions     (V1):  ${crV1Same}`);
    console.log(`    - present in crucible.questions_v2  (V2):  ${crV2Same}`);

    if (codeList.length > 0) {
        // V1 sometimes stored the same id under `question_code` on V2 docs — try a fuzzy match
        const crV2ByCode = await cr.collection('questions_v2').countDocuments({
            $or: [
                { question_code: { $in: codeList } },
                { display_id: { $in: codeList } },
                { 'metadata.legacy_question_code': { $in: codeList } },
            ],
        });
        console.log(`    - canvas_classes question_codes found anywhere in V2: ${crV2ByCode}`);
    }

    // Date range — how old is this DB?
    const newest = await ccQ.find({}).sort({ updatedAt: -1, created_at: -1, updated_at: -1 }).limit(1).toArray();
    const oldest = await ccQ.find({}).sort({ updatedAt: 1, created_at: 1, updated_at: 1 }).limit(1).toArray();
    const pickDate = (d) => d?.updatedAt || d?.updated_at || d?.created_at || null;
    console.log(`\n  canvas_classes.questions dates: oldest=${pickDate(oldest[0])}  newest=${pickDate(newest[0])}`);

    // --- canvas_classes.chapters
    const ccCh = cc.collection('chapters');
    const ccChCount = await ccCh.countDocuments();
    const crCh = cr.collection('chapters');
    const crChCount = await crCh.countDocuments();
    const ccChSample = await ccCh.find({}).limit(2).toArray();
    const crChSample = await crCh.find({}).limit(2).toArray();
    console.log(`\ncanvas_classes.chapters:             ${ccChCount} docs`);
    console.log(`crucible.chapters:                   ${crChCount} docs`);
    console.log('  canvas_classes sample:', JSON.stringify({ _id: ccChSample[0]?._id, name: ccChSample[0]?.name, subject: ccChSample[0]?.subject }));
    console.log('  crucible sample:      ', JSON.stringify({ _id: crChSample[0]?._id, name: crChSample[0]?.name, subject: crChSample[0]?.subject }));

    const ccChIds = (await ccCh.find({}).project({ _id: 1 }).toArray()).map((d) => d._id);
    const crChSame = await crCh.countDocuments({ _id: { $in: ccChIds } });
    console.log(`  Of the ${ccChCount} chapter _ids in canvas_classes, ${crChSame} also exist in crucible.chapters.`);

    console.log('\n========== test vs crucible ==========\n');

    // --- test.blog_sources vs crucible.blog_sources
    const tsBS = ts.collection('blog_sources');
    const crBS = cr.collection('blog_sources');
    const tsCount = await tsBS.countDocuments();
    const crCount = await crBS.countDocuments();
    console.log(`test.blog_sources:                   ${tsCount} docs`);
    console.log(`crucible.blog_sources:               ${crCount} docs`);

    const tsHashes = (await tsBS.find({}).project({ url_hash: 1, url: 1 }).toArray());
    const hashList = tsHashes.map((d) => d.url_hash).filter(Boolean);
    if (hashList.length > 0) {
        const dupesByHash = await crBS.countDocuments({ url_hash: { $in: hashList } });
        console.log(`  test.blog_sources url_hashes also present in crucible.blog_sources: ${dupesByHash} / ${hashList.length}`);
    }
    const urlList = tsHashes.map((d) => d.url).filter(Boolean);
    if (urlList.length > 0) {
        const dupesByUrl = await crBS.countDocuments({ url: { $in: urlList } });
        console.log(`  test.blog_sources urls also present in crucible.blog_sources:       ${dupesByUrl} / ${urlList.length}`);
    }

    const tsNewest = await tsBS.find({}).sort({ fetched_at: -1, created_at: -1 }).limit(1).toArray();
    const tsOldest = await tsBS.find({}).sort({ fetched_at: 1, created_at: 1 }).limit(1).toArray();
    const pickD = (d) => d?.fetched_at || d?.created_at || null;
    console.log(`\n  test.blog_sources dates: oldest=${pickD(tsOldest[0])}  newest=${pickD(tsNewest[0])}`);

    await client.close();
}

main().catch((e) => { console.error('FAILED:', e); process.exit(1); });
