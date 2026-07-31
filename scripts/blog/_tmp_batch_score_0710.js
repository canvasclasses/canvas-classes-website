require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

// [id, score, reason, status]
const SCORES = [
  ['30fd115b-5995-4fba-8b19-f1435dd85187', 0.30, 'Inspirational career story (Zoho), no JEE/NEET/CBSE exam angle', 'ignored'],
  ['1af7c33f-45c8-4946-a330-7d2aea19a6b2', 0.20, 'Army SSC Tech recruitment for engineering graduates, not school exam students', 'ignored'],
  ['eb597531-ca21-40b9-9b77-787e28c1eb88', 0.35, 'WB ANM/GNM nursing entrance answer key, niche not core JEE/NEET', 'ignored'],
  ['4b6265f2-2f27-48b9-9170-854195435770', 0.50, 'Parag Agrawal IIT-B / JEE AIR 77 story; mild motivational angle for JEE aspirants', 'reviewed'],
  ['c00bf8c4-6524-40b3-ba0b-db8393e2fc77', 0.30, 'BBOSE Bihar open schooling dummy admit card, niche regional', 'ignored'],
  ['56eba4e9-88b6-4781-b2ca-d69978ef9099', 0.20, 'Gujarat PGCET ME/MTech postgrad admissions, off-topic', 'ignored'],
  ['13326020-c1a6-476e-9f56-3d5a74b03c15', 0.35, 'AISHE NEP higher-ed policy stocktake, not student-actionable', 'ignored'],
  ['6b58a382-15fe-47f9-913d-6e9ad376d0d1', 0.25, 'Japan teen ChatGPT cyberattack, AI-misuse news, no exam relevance', 'ignored'],
  ['7087c6d9-7507-4841-8ec3-c03ccc1229b7', 0.82, 'CBSE Class 10 second-board result delay hits 50 days; 6.68 lakh students awaiting — timely and directly relevant to CBSE audience', 'reviewed'],
  ['48b73ce7-1cf9-47d1-a148-0ee305ff9dcb', 0.30, 'Jharkhand PECE polytechnic admit card, niche regional', 'ignored'],
  ['091b3ec8-3cfe-4ec9-b7ce-732df3bac1b1', 0.20, 'AIIMS INI-SS DM/MCh postgrad medical, off-topic for NEET UG', 'ignored'],
  ['3b176ea0-ce5e-4b0a-89b6-5a50c42f63dc', 0.15, 'AIBE 21 bar exam (law), off-topic', 'ignored'],
  ['df2b27e7-0a23-47c4-9efa-9a65fd03d100', 0.20, 'Karnataka UUCMS university UG/PG results, off-topic', 'ignored'],
  ['5a0048e5-6724-4a83-a2a0-3ab619e34cbd', 0.30, 'Telangana bandh school closures, transient local news', 'ignored'],
  ['7dc97d7d-bf2c-48f7-a91d-796482ba88c6', 0.45, 'TS EAMCET Phase 1 seat allotment; state counselling, moderately relevant to some aspirants', 'reviewed'],
  ['0c6ce6aa-891a-4b02-8969-4e7eb43dc4e4', 0.30, 'IPS/IIT-K officer resignation, career story, no exam angle', 'ignored'],
  ['df750b30-3cbd-497d-9d83-a3f6f42e47bf', 0.35, 'JEECUP UP polytechnic Round 2 allotment, niche regional', 'ignored'],
  ['1500a0e9-4edc-483e-860e-ebf503264eba', 0.78, 'JoSAA 2026 Round 4 counselling result today, reporting by July 13 — directly actionable for JEE-qualified students in IIT/NIT counselling', 'reviewed'],
  ['aa458ac3-39bd-479f-9e0b-fd1618e20cba', 0.30, 'AIIMS Paramedical result, niche', 'ignored'],
  ['2472db31-65cb-4d67-ba28-dfe198faba3e', 0.25, 'Engineer-to-cinema career story, off-topic', 'ignored'],
  ['6f9e7061-84f8-4321-847d-69e24465be98', 0.30, 'Nipun Bharat foundational-literacy policy debate, off-topic', 'ignored'],
  ['998ff5c5-1a1f-4bb0-8024-3638ee997f4c', 0.30, 'Literacy-rate data/policy piece, off-topic', 'ignored'],
  ['e1e96d07-e11b-44da-be73-476ef0f21d1e', 0.60, 'NEET paper-leak custody update; integrity news relevant to NEET aspirants but thin on actionable detail', 'reviewed'],
  ['c2850cc4-6767-465e-add9-34dd88a6ba0c', 0.30, 'TN textbook distribution delay, local news', 'ignored'],
  ['efc46506-8dc0-489c-9d4b-d17515a047a8', 0.40, 'NCERT Class 8 textbook revision on discrimination grounds; content-policy, mildly CBSE-relevant', 'reviewed'],
  ['27ac49b4-bd82-40d1-977f-bc894ac6d4fe', 0.55, 'CBSE supplementary exam re-evaluation editorial; relevant to Class 12 students but opinion-column', 'reviewed'],
  ['784df38a-c084-4830-ab13-6987aea0fa27', 0.25, 'Assam school infrastructure gaps, local policy', 'ignored'],
  ['472c87fc-9dbb-4e2b-9662-e6477c8f177d', 0.30, 'Opinion on regulating tech vs phone bans, off-topic', 'ignored'],
  ['d62ac227-467f-40d3-a39b-ab2a28bb5259', 0.35, 'AI + local-language education edtech, loosely relevant', 'ignored'],
  ['bb1b6257-c2c6-4e97-ba5b-3b2a72de364b', 0.25, 'TN govt education agenda, local policy', 'ignored'],
  ['dcdf0779-7776-4e72-a9e4-38af04a8a4ad', 0.15, 'Bengaluru daycare child-protection case, off-topic', 'ignored'],
  ['88fdc782-f4a7-4d23-a52e-7a8871f85af2', 0.30, 'Meta engineers campus AI demo event, off-topic', 'ignored'],
  ['4830a1e9-dfc8-4dda-85b8-d52db1e64249', 0.25, 'Degree certificate delays, higher-ed admin, off-topic', 'ignored'],
  ['00dd8186-2083-4dc4-9f67-a1734f5a5d29', 0.30, 'VBSA Bill higher-ed regulation debate, policy off-topic', 'ignored'],
  ['7bfbd30a-7bd6-4e26-bb37-d826fc74e9bd', 0.20, 'XAT 2027 MBA entrance registration, off-topic', 'ignored'],
  ['475e250d-9e72-4daf-befd-0e2d482cbfa8', 0.20, 'IIT-K alumni hostel donation, off-topic', 'ignored'],
  ['7cea10d7-d6e9-44e7-a20d-385fec9ff999', 0.30, 'PGI 2025-26 state education index, policy off-topic', 'ignored'],
  ['4156da2b-3bb8-4b46-b7ae-84518a6205f9', 0.20, 'LinkedIn senior-leadership skills report, off-topic', 'ignored'],
  ['5b854f49-2ca9-4a30-955f-7c9782d22250', 0.15, 'Workplace effort survey, off-topic', 'ignored'],
  ['0eeeaba3-4000-4312-966c-3e4d2370480c', 0.30, 'CSIR-UGC NET postgrad science eligibility exam-city slip, off-topic for school audience', 'ignored'],
];

const BlogSourceSchema = new mongoose.Schema({}, { strict: false, collection: 'blog_sources', _id: false });
const BlogSource = mongoose.models.BlogSource || mongoose.model('BlogSource', BlogSourceSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  let ok = 0, miss = 0;
  for (const [id, score, reason, status] of SCORES) {
    const res = await BlogSource.updateOne(
      { _id: id },
      { $set: { relevance_score: score, relevance_reason: reason.slice(0, 500), status } }
    );
    if (res.matchedCount) ok++; else { miss++; console.log('MISS', id); }
  }
  console.log(`Scored ${ok} sources, ${miss} missed`);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
