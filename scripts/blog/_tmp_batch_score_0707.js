#!/usr/bin/env node
/* Daily-run batch scorer for 2026-07-07. Keyed by explicit _id (safer than
 * index). Whitelisted fields only (relevance_score/relevance_reason/status). */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1); }

// _id -> [score, reason, status]
const BY_ID = {
  'c8c376a0-0bc1-4c75-a650-7f49380a803b': [0.3,  'BBOSE Class 10/12 datesheet; regional open board, not JEE/NEET/CBSE core', 'ignored'],
  'f6b2ca36-acd4-458a-8a87-e20077f0ff66': [0.25, 'Nagaland Univ FYUGP admissions via CUET; college admission, not prep audience', 'ignored'],
  '09eb50b5-1eb4-49e2-8123-49dc9458c613': [0.15, 'IGNOU/DU SOL distance-learning listicle; off-topic', 'ignored'],
  'f3b1e51a-20b6-43da-a0d2-701359a0390a': [0.15, 'NCTE ITEP teacher-education advisory; off-topic', 'ignored'],
  '45b171b5-ab6d-48b7-92b5-a9c3566302f7': [0.1,  'NBEMS recruitment vacancies; off-topic', 'ignored'],
  '566bf8a1-91b0-46fd-abd7-1492e4ceb992': [0.75, 'JoSAA Round 3 seat allotment out; directly actionable for JEE counselling students now', 'reviewed'],
  '32138e89-d810-4844-a5be-4718e0418a9c': [0.2,  'TN SSLC revaluation result; regional board, off-topic', 'ignored'],
  '053a2ace-2648-4e80-80ef-dbbec0c83bd7': [0.1,  'World best countries for jobs listicle; off-topic', 'ignored'],
  '586850fd-979a-4ac5-ad5f-499936b84c31': [0.1,  'HTET answer key; teacher eligibility test, off-topic', 'ignored'],
  '13eab80e-b1a6-44d6-8b01-e60135328c09': [0.15, 'India oldest schools listicle; off-topic', 'ignored'],
  '08707891-a2de-4d2d-81a4-67d463158519': [0.1,  'AIBE 21 bar exam result; law, off-topic', 'ignored'],
  '9dbd253d-abd7-4c7c-afcc-73bed91c8b00': [0.1,  'Indian Navy INET result; recruitment, off-topic', 'ignored'],
  '1ae5dd5e-8917-4b09-9629-773dc508cbbf': [0.25, 'Nagaland Univ FYUGP (dup angle); off-topic', 'ignored'],
  'a26a3f9f-04a3-4fed-9cd2-dcff63c46b54': [0.2,  'First Indian woman solo fighter-jet feature; inspirational but off-topic', 'ignored'],
  'd87148b8-a1e2-4eea-9d09-141f8f135304': [0.1,  'CCI recruitment; off-topic', 'ignored'],
  'af782b7f-bd5b-479c-9f58-9b211faf3eaa': [0.2,  'Mumbai schools closed for rain; local news, off-topic', 'ignored'],
  'd1fd8ec9-61ea-43d4-bb6c-0714ab42fe21': [0.2,  'AP POLYCET seat allotment; state polytechnic, regional', 'ignored'],
  'd8de9e66-a61e-478a-93a9-36776ce1bd40': [0.5,  'WBJEE Round 1 seat allotment; state engineering entrance, regional but audience-adjacent', 'reviewed'],
  'e43ec991-d981-4a7f-bd51-d9af5c973fc1': [0.55, 'NEET UG fee-refund deadline today; NEET-relevant but already covered in a recent draft', 'reviewed'],
  '423d0f1f-51d3-467b-8157-a68f0d68d864': [0.1,  'Bihar Police ASI admit card; recruitment, off-topic', 'ignored'],
  '5c30525c-97ed-4762-93ed-91c4a9b79704': [0.15, 'Hindu vocabulary idiom piece; off-topic', 'ignored'],
  'f901563a-5ccb-4388-96f7-3a4670ae78ba': [0.4,  'UDISE+ 2024-25 enrolment analysis; education-policy think-piece, marginal', 'reviewed'],
  'bbbc87f3-0231-4be6-aa81-80d75d0fbfe8': [0.3,  'Pedagogy for online learning think-piece; marginal', 'ignored'],
  'ad1d4b5a-4223-4807-8463-ba6038913d38': [0.15, 'AU BBA/BBA-MBA deadline; off-topic', 'ignored'],
  'b9ec5572-d491-4f21-ae54-6117a958abf6': [0.45, 'Rs15-lakh Himachal library for competitive-exam prep; human-interest, mildly relevant', 'reviewed'],
  '22509e1c-c77b-4e05-858d-c6771cb7ca83': [0.5,  'NITI Aayog defends CUET, MCQs test intelligence; exam-culture editorial angle', 'reviewed'],
  'e20bb210-0688-45d1-932e-afb163e3025d': [0.1,  'Biometric attendance for PG Dental; off-topic', 'ignored'],
  'fd175668-f439-443d-aa87-0fdee840d7ab': [0.78, '58 engineering colleges shut across India; strong JEE college-choice editorial with JEE Main 2026 angle', 'reviewed'],
  '59b17e36-dbe3-4ac6-8a4c-39eed58b54d6': [0.15, 'DU PG one-year Masters registration; off-topic', 'ignored'],
  '89a6235e-0119-498f-a6ef-c6a208f2b4cf': [0.15, 'School assembly headlines round-up; off-topic', 'ignored'],
  '763f5fa7-f7a6-48da-af1f-55eb868711a6': [0.2,  'IIM Bodh Gaya MBA cohort mix; off-topic', 'ignored'],
  'c1d91aae-2e1c-452c-9194-9a9a42996101': [0.75, 'JoSAA Round 3 seat allotment (Indian Express); actionable for JEE counselling, primary source for draft', 'reviewed'],
  '587990fd-fbdc-4a89-8098-9685a0d56ddb': [0.4,  'Punjab Post-Matric Scholarship for SC students; scholarship, marginal', 'reviewed'],
  '71285f51-3f6c-420c-97e7-1c0c22c461a2': [0.55, 'NEET UG re-exam bank-detail update; NEET-relevant but already covered in a recent draft', 'reviewed'],
  'd163eb2d-67aa-4fd0-8922-ab268806218f': [0.15, 'Allahabad Univ BA/BEd registration; off-topic', 'ignored'],
  'e37eb201-5556-4195-9239-06348e915842': [0.2,  'IIM Lucknow placement package; off-topic', 'ignored'],
  '78b12a40-0887-405e-b9b1-03a991d338c6': [0.2,  'Mumbai rains, exams postponed; local news, off-topic', 'ignored'],
  'b294a873-358d-4c0d-b1a8-7c30e6b276fd': [0.6,  'IIT Gandhinagar semester-for-industry swap; IIT news, audience-relevant editorial', 'reviewed'],
  'b11d81ec-cec7-417a-bf9f-ebe5925204b3': [0.15, 'School assembly headlines (ethanol); off-topic', 'ignored'],
};

const BlogSourceSchema = new mongoose.Schema({}, { strict: false, collection: 'blog_sources', _id: false });
const BlogSource = mongoose.models.BlogSource || mongoose.model('BlogSource', BlogSourceSchema);

(async () => {
  await mongoose.connect(MONGODB_URI);
  const ops = Object.entries(BY_ID).map(([_id, [score, reason, status]]) => ({
    updateOne: {
      filter: { _id },
      update: { $set: { relevance_score: score, relevance_reason: reason, status } },
    },
  }));
  const res = await BlogSource.bulkWrite(ops);
  console.log(`Scored ${ops.length} sources. matched=${res.matchedCount} modified=${res.modifiedCount}`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
