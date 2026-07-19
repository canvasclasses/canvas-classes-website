#!/usr/bin/env node
/* Daily-run batch scorer for 2026-07-04. Reads /tmp/blog_new_sources.json,
 * applies an index->[score, reason, status] map via bulkWrite on explicit _ids.
 * Whitelisted fields only (relevance_score/relevance_reason/status). */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1); }

const sources = require('/tmp/blog_new_sources.json');

// index -> [score, reason, status]
const BY_INDEX = {
  0:  [0.15, 'NIFT counselling round 2; fashion-design admissions, off-topic', 'ignored'],
  1:  [0.3,  'DU CSAS UG Phase II; college admissions, not JEE/NEET/CBSE prep audience', 'ignored'],
  2:  [0.5,  'New IIT Madras/Kanpur Bachelor of Cybersecurity; branch-choice interest for JEE aspirants', 'reviewed'],
  3:  [0.1,  '11-year-old startup valuation; human-interest, off-topic', 'ignored'],
  4:  [0.4,  'New CBSE Chairperson appointment; CBSE leadership, marginally relevant', 'reviewed'],
  5:  [0.15, 'CG PPHT pharmacy entrance results; state exam, off-topic', 'ignored'],
  6:  [0.25, 'UGC NET answer key timing; PG exam, off-topic for school aspirants', 'ignored'],
  7:  [0.1,  'Assam ITI round 3 seat allotment; off-topic', 'ignored'],
  8:  [0.3,  'HBSE 10/12 supplementary admit card; state-board compartment, narrow', 'ignored'],
  9:  [0.2,  'CUSAT CAT seat allotment; state engineering entrance, narrow', 'ignored'],
  10: [0.2,  'JKCET round 3 counselling; state engineering, regional', 'ignored'],
  11: [0.1,  'Telangana police recruitment; off-topic', 'ignored'],
  12: [0.1,  'LIC HFL Junior Assistant result; off-topic', 'ignored'],
  13: [0.1,  'WUD theatre programmes; off-topic', 'ignored'],
  14: [0.1,  'SSB HC ministerial admit card; recruitment, off-topic', 'ignored'],
  15: [0.1,  'JNCU semester results; off-topic', 'ignored'],
  16: [0.1,  'GIM leadership programme for DU principals; off-topic', 'ignored'],
  17: [0.15, 'BITS graduate money essay; human-interest, off-topic', 'ignored'],
  18: [0.1,  'HTET exam-day guidelines; teacher eligibility test, off-topic', 'ignored'],
  19: [0.2,  'AIIMS BSc Nursing result; nursing, not NEET-UG core', 'ignored'],
  20: [0.3,  'General education news round-up; low actionability', 'ignored'],
  21: [0.2,  'UGC NET sociology paper errors; PG exam, off-topic', 'ignored'],
  22: [0.35, 'Rethink classroom-lectures think-piece; pedagogy, marginal', 'reviewed'],
  23: [0.4,  'IIT report-card feature; branch/institution interest, mildly relevant', 'reviewed'],
  24: [0.15, 'How to get hired by GCCs; careers, off-topic', 'ignored'],
  25: [0.1,  'Language-in-conversation piece; off-topic', 'ignored'],
  26: [0.15, 'Teaching commerce as a discipline; commerce ed, off-topic', 'ignored'],
  27: [0.8,  'SC plea vs coaching Raj + dummy schools; strong editorial angle for JEE/NEET ecosystem', 'reviewed'],
  28: [0.4,  'CBSE three-language formula confusion; CBSE policy, marginal', 'reviewed'],
  29: [0.15, 'State school-closure/holiday announcements; off-topic', 'ignored'],
  30: [0.1,  'UPTET NIOS DElEd relief; teacher ed, off-topic', 'ignored'],
  31: [0.2,  'UGC NET sociology errors (duplicate angle); off-topic', 'ignored'],
  32: [0.3,  'DU 2026-27 academic calendar; college admin, marginal', 'ignored'],
  33: [0.1,  'ICAI CA Foundation topper; CA, off-topic', 'ignored'],
  34: [0.2,  'Ivy/UK accept Duolingo test; study-abroad, off-topic', 'ignored'],
  35: [0.92, 'MoE panel proposes up to 50% Class-12 board weightage in NEET/JEE admissions; top student-relevant policy signal', 'reviewed'],
  36: [0.1,  'ICAI CA Foundation result when/where; off-topic', 'ignored'],
  37: [0.15, 'AICTE Industry Fellowship stipend; off-topic', 'ignored'],
  38: [0.3,  'DU UG Phase 2 (duplicate); college admissions, marginal', 'ignored'],
  39: [0.1,  'ICAI CA Foundation download steps; off-topic', 'ignored'],
  40: [0.1,  'ICAI CA Foundation result websites; off-topic', 'ignored'],
  41: [0.45, 'MHT CET CAP registration; state engineering counselling, actionable but regional', 'reviewed'],
  42: [0.3,  'Bihar Board class 11 spot admission extended; state board, narrow', 'ignored'],
  43: [0.25, 'Delhi private-school fee-hike parameters; parents, marginal', 'ignored'],
  44: [0.35, 'CBSE Chairperson appointment (duplicate); marginal', 'ignored'],
  45: [0.1,  'ICAI CA Foundation topper (duplicate); off-topic', 'ignored'],
  46: [0.4,  'Punjab AI curriculum in schools from August; ed-tech policy, mild student angle', 'reviewed'],
  47: [0.15, 'AI skills B-school hiring GMAC survey; MBA, off-topic', 'ignored'],
  48: [0.5,  'BSEB free JEE/NEET coaching teacher applications; JEE/NEET-relevant but teacher-facing', 'reviewed'],
  49: [0.3,  'Gujarat SSC/HSC supplementary results; state board, narrow', 'ignored'],
  50: [0.1,  'Haryana TET candidate guidelines; teacher exam, off-topic', 'ignored'],
  51: [0.5,  'IIT Madras+Kanpur cybersecurity course (duplicate of item 2); branch interest', 'reviewed'],
  52: [0.1,  'Agniveer CEE results; off-topic', 'ignored'],
  53: [0.2,  'IIT Delhi IP certificate course; off-topic for aspirants', 'ignored'],
  54: [0.1,  'IIM Shillong director appointment; off-topic', 'ignored'],
  55: [0.4,  'KCET ranks revised after class-12 revaluation; state engineering, marginal', 'reviewed'],
  56: [0.1,  'UPTET 93% attendance; teacher exam, off-topic', 'ignored'],
  57: [0.1,  'DU VC re-appointment; off-topic', 'ignored'],
  58: [0.1,  'IBPS PO recruitment notice; banking, off-topic', 'ignored'],
  59: [0.3,  'Maharashtra makes Marathi mandatory 1-10; state language policy, marginal', 'ignored'],
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  const coll = mongoose.connection.collection('blog_sources');
  const ops = [];
  for (const [idx, [score, reason, status]] of Object.entries(BY_INDEX)) {
    const src = sources[Number(idx)];
    if (!src) { console.warn(`no source at index ${idx}`); continue; }
    ops.push({
      updateOne: {
        filter: { _id: src._id },
        update: { $set: { relevance_score: score, relevance_reason: reason, status } },
      },
    });
  }
  const res = await coll.bulkWrite(ops);
  console.log(`Scored ${ops.length} sources. modified=${res.modifiedCount}`);
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
