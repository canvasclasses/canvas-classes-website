require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
const BlogSourceSchema = new mongoose.Schema({}, { strict: false, collection: 'blog_sources', _id: false });
const BlogSource = mongoose.models.BlogSource || mongoose.model('BlogSource', BlogSourceSchema);

// [id, score, reason, status]
const SCORES = [
['f7b3b638-185e-40e8-a93d-9d87ae197f17',0.25,'UoH PG admissions via CUET PG — postgraduate, not JEE/NEET/CBSE target audience','ignored'],
['22432029-dbe5-4a6d-bc59-b3aaa7657360',0.6,'JEE AAT 2026 reg deadline — relevant but niche (BArch aspirants among JEE Advanced qualifiers)','reviewed'],
['8e7177c3-b2b3-403e-bc90-134f187950ac',0.15,'BSEB D.El.Ed admit cards — teacher-training, off-topic','ignored'],
['77327e1e-1469-426a-88f3-1be19957d70d',0.7,'NEET-UG leak probe / COEMPT contract — relevant NEET integrity story','reviewed'],
['f94b5846-a109-4b69-8839-6e51aa0f565d',0.45,'NMC 10-year MBBS limit — medical policy, loosely relevant to NEET aspirants','reviewed'],
['98547741-edb9-4bdd-9523-a945816fdb58',0.5,'CBSE OSM whistleblower before parliamentary panel — CBSE governance angle','reviewed'],
['b595b5d2-1fd8-480f-ae21-d60ba0edf358',0.6,'CBSE re-evaluation portal cyberattack — relevant to Class 12 CBSE students','reviewed'],
['a733ad15-794a-4158-9311-0a4c294a4f2a',0.1,'US workers / money — off-topic, no India student angle','ignored'],
['8f5aef0d-b7b7-46f0-b77e-37d3bf8a218f',0.2,'Haryana board inspection — regional admin, off-topic','ignored'],
['88df938c-8207-4fca-860a-be3027f3be6f',0.2,'RUHS CUET result — niche state medical entrance, off-topic','ignored'],
['9af33ef8-8541-4338-a46f-a13668eca32d',0.15,'IGNOU BEd result — teacher-training, off-topic','ignored'],
['ee4a67c5-cc15-4835-b947-7ee0e9bd714f',0.3,'NEET MDS result — postgraduate dental, not target audience','ignored'],
['53f34471-1df6-4772-a91e-3be9e7b26287',0.5,'CBSE OSM officials shunted out — CBSE governance, mild student relevance','reviewed'],
['1a61f4cc-2053-4a03-849a-91f378f80f3c',0.2,'CGBSE Chhattisgarh supplementary — regional board, off-topic','ignored'],
['1dbb6dfc-d2cf-45bd-b749-4dafbd7d6122',0.1,'TGPSC AEE recruitment — govt jobs, off-topic','ignored'],
['03e7580c-c5ab-4bd8-8d9e-a1066fb93813',0.1,'TEDx youth event — off-topic','ignored'],
['cbac47e2-cbc7-418f-800a-cf6691dd0b5e',0.1,'ICMAI chapter chairman — off-topic','ignored'],
['957f840d-6057-4426-b16b-ca1c729572f3',0.15,'RRB NTPC city slip — govt recruitment, off-topic','ignored'],
['f7d24b5b-c048-477e-8147-4b5a0f712812',0.2,'CGBSE supplementary timetable — regional board, off-topic','ignored'],
['59d9eedb-5f7f-42f1-b767-8dc7e6139207',0.45,'New CBSE Chairperson appointed — governance context for CBSE students','reviewed'],
['80e0fd4e-e3b6-46e9-a16e-a0eaa86786c1',0.4,'Rethinking university rankings — opinion, loose student angle','reviewed'],
['8e6f9c78-7a63-4349-b225-5d498ca3ed7a',0.45,'NSUI moves HC on CBSE OSM — CBSE governance','reviewed'],
['7977ea3b-6259-40b1-bd12-9e2f8915ae3a',0.5,'CBSE Chairman/Secretary replaced amid OSM — CBSE governance','reviewed'],
['ef58db51-1670-4812-9fed-f08711d23268',0.1,'Know your English column — off-topic','ignored'],
['169eb0db-a5b3-45b9-920f-582f7771fd6f',0.6,'CBSE re-eval portal glitches + Aadhaar mandatory — actionable for CBSE Class 12','reviewed'],
['7ab7618e-0bd0-48e7-924f-2bf6daca5f2b',0.75,'CBSE Class 12 re-evaluation portal opens + video guide — directly actionable','reviewed'],
['0875a65b-10b1-42df-88ad-fc331f3a3a99',0.4,'TNEA registration extended — Tamil Nadu engineering, regional','reviewed'],
['6dc2f7fc-fa68-49e5-96e3-85c9ff01873e',0.7,'Kota AIR 1&2 JEE Advanced toppers on AI — strong editorial JEE angle','reviewed'],
['fd596730-8d1b-4b87-a30e-dbdc9d91d3d1',0.3,'NEET MDS result — postgraduate, off-topic','ignored'],
['5014c63d-f2df-48e1-9f9d-9463bb236268',0.9,'NEET UG June 21 retest defended by NTA — directly actionable for NEET aspirants','reviewed'],
['9724977f-e7bd-4306-b6ea-f626ee69829e',0.1,'UP Police Constable admit card — govt recruitment, off-topic','ignored'],
['c32ad35a-c2ae-4978-ae1f-9c172b0fd1eb',0.92,'JoSAA Counselling 2026 begins — directly actionable for every JEE Main/Advanced qualifier','reviewed'],
['90860ffc-0481-4b15-a7dc-f207c0c461dc',0.82,'NEET UG reform blueprint (multi-set, AI checks) — strong explainer for NEET audience','reviewed'],
['249d0aca-e46d-4049-993b-dbc22aa06caa',0.25,'UoH PG admissions (dup angle) — postgraduate, off-topic','ignored'],
['83e86851-dc3e-43a4-9fb3-693d05549db9',0.2,'JIPMAT admit card — management entrance, off-topic','ignored'],
['e69921b9-6927-41f0-8a65-d982dc23ab96',0.55,'CBSE cyberattack on re-eval portal — CBSE Class 12 relevance','reviewed'],
['24d55035-53a5-4fba-85e0-71a3ad2ce220',0.3,'KCET results / exam security — Karnataka regional, off-topic','ignored'],
['4d787f22-c06b-4dd9-b353-d9786dba4bc0',0.2,'CGBSE schedule — regional board, off-topic','ignored'],
['2b29f3ef-008e-4603-a46e-adcf65cf0461',0.45,'CBSE OSM whistleblower tender irregularities — CBSE governance','reviewed'],
['50716a2d-50f1-4ae6-9f41-4f1286cab90d',0.5,'CBSE re-eval portal cyberattack statement — CBSE Class 12 relevance','reviewed'],
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  let matched = 0, modified = 0;
  for (const [id, score, reason, status] of SCORES) {
    const res = await BlogSource.updateOne({ _id: id }, { $set: { relevance_score: score, relevance_reason: reason.slice(0,500), status } });
    matched += res.matchedCount; modified += res.modifiedCount;
  }
  console.log(JSON.stringify({ total: SCORES.length, matched, modified }));
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
