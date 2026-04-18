/**
 * Consolidate subtopics in D&F Block and Coordination Compounds flashcards.
 *
 * Each chapter is reduced to 7 higher-level topic groups so the list stays
 * scannable on mobile. Card content (question/answer/tags) is untouched —
 * only topic.name and topic.order change.
 *
 * Usage:
 *   node scripts/consolidate_flashcard_topics.js            # dry run
 *   node scripts/consolidate_flashcard_topics.js --apply    # write changes
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const APPLY = process.argv.includes('--apply');

// Map: old topic.name  →  { name, order }
const DFBLOCK_MAP = {
  // 1 · General Trends & Electronic Configuration
  'Position & Electronic Configuration': { name: 'General Trends & Electronic Configuration', order: 1 },
  'Physical Properties':                  { name: 'General Trends & Electronic Configuration', order: 1 },
  'Ionisation Enthalpy':                  { name: 'General Trends & Electronic Configuration', order: 1 },
  // 2 · Oxidation States & Electrode Potentials
  'Oxidation States':                     { name: 'Oxidation States & Electrode Potentials', order: 2 },
  'Standard Electrode Potentials':        { name: 'Oxidation States & Electrode Potentials', order: 2 },
  // 3 · Magnetic & Colour Properties
  'Magnetic Properties':                  { name: 'Magnetic & Colour Properties', order: 3 },
  'Colour in Transition Ions':            { name: 'Magnetic & Colour Properties', order: 3 },
  // 4 · Catalysis, Alloys & Compound Types
  'Catalysts, Interstitial Compounds & Alloys': { name: 'Catalysis, Alloys & Compound Types', order: 4 },
  'Oxides & Oxoanions':                         { name: 'Catalysis, Alloys & Compound Types', order: 4 },
  // 5 · Important Compounds
  'Potassium Dichromate':                 { name: 'Important Compounds (K₂Cr₂O₇ & KMnO₄)', order: 5 },
  'Potassium Permanganate':               { name: 'Important Compounds (K₂Cr₂O₇ & KMnO₄)', order: 5 },
  // 6 · Group 11 & 12 Elements
  'Copper, Silver & Gold':                { name: 'Group 11 & 12 Elements', order: 6 },
  'Zinc & Mercury':                       { name: 'Group 11 & 12 Elements', order: 6 },
  // 7 · Inner Transition Series & Applications
  'The Lanthanoids (4f Series)':          { name: 'Inner Transition Series & Applications', order: 7 },
  'The Actinoids (5f Series)':            { name: 'Inner Transition Series & Applications', order: 7 },
  'Applications of d- and f-block Elements': { name: 'Inner Transition Series & Applications', order: 7 },
};

const COORDINATION_MAP = {
  // 1 · Foundations
  "Werner's Theory & Double Salts":       { name: 'Foundations: Werner & Terminology', order: 1 },
  'Definitions & Terminology':            { name: 'Foundations: Werner & Terminology', order: 1 },
  // 2 · Ligands & Denticity
  'Ligands & Denticity':                  { name: 'Ligands & Denticity', order: 2 },
  'Ambidentate Ligands & Chelate Effect': { name: 'Ligands & Denticity', order: 2 },
  // 3 · IUPAC Nomenclature
  'IUPAC Nomenclature Rules':             { name: 'IUPAC Nomenclature', order: 3 },
  'IUPAC Naming Practice':                { name: 'IUPAC Nomenclature', order: 3 },
  'Oxidation State & Coordination Number': { name: 'IUPAC Nomenclature', order: 3 },
  // 4 · Isomerism
  'Structural Isomerism':                 { name: 'Isomerism in Complexes', order: 4 },
  'Geometrical Isomerism':                { name: 'Isomerism in Complexes', order: 4 },
  'Optical Isomerism':                    { name: 'Isomerism in Complexes', order: 4 },
  // 5 · Valence Bond Theory
  'Valence Bond Theory (VBT)':            { name: 'Valence Bond Theory', order: 5 },
  'VBT — Example Complexes':              { name: 'Valence Bond Theory', order: 5 },
  // 6 · Crystal Field Theory, Colour & Magnetism
  'Crystal Field Theory — Octahedral':    { name: 'Crystal Field Theory, Colour & Magnetism', order: 6 },
  'CFT — Tetrahedral & Spin State':       { name: 'Crystal Field Theory, Colour & Magnetism', order: 6 },
  'Spectrochemical Series & Colour':      { name: 'Crystal Field Theory, Colour & Magnetism', order: 6 },
  'Magnetic Behaviour':                   { name: 'Crystal Field Theory, Colour & Magnetism', order: 6 },
  // 7 · Metal Carbonyls, Stability & Applications
  'Metal Carbonyls & Synergic Bonding':   { name: 'Metal Carbonyls, Stability & Applications', order: 7 },
  'Stability Constants & Chelate Effect': { name: 'Metal Carbonyls, Stability & Applications', order: 7 },
  'Applications & Bioinorganic':          { name: 'Metal Carbonyls, Stability & Applications', order: 7 },
};

const CHAPTERS = [
  { id: 'ch12_dblock',       map: DFBLOCK_MAP,      label: 'D & F Block' },
  { id: 'ch12_coordination', map: COORDINATION_MAP, label: 'Coordination Compounds' },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  let grandTotal = 0;
  let grandMatched = 0;

  for (const { id, map, label } of CHAPTERS) {
    console.log(`\n════ ${label}  (${id}) ════`);
    const cards = await coll
      .find({ 'chapter.id': id, deleted_at: null })
      .project({ flashcard_id: 1, 'topic.name': 1, 'topic.order': 1 })
      .toArray();

    grandTotal += cards.length;
    const unmapped = new Set();
    const groupCounts = new Map();
    const ops = [];

    for (const card of cards) {
      const oldName = card.topic?.name;
      const target = map[oldName];
      if (!target) {
        unmapped.add(oldName);
        continue;
      }
      groupCounts.set(target.name, (groupCounts.get(target.name) ?? 0) + 1);
      if (card.topic?.name === target.name && card.topic?.order === target.order) continue;
      ops.push({
        updateOne: {
          filter: { _id: card._id },
          update: { $set: { 'topic.name': target.name, 'topic.order': target.order, 'metadata.updated_at': new Date() } },
        },
      });
    }

    console.log(`  Scanned: ${cards.length} cards`);
    console.log(`  Ops to run: ${ops.length}`);
    if (unmapped.size) {
      console.log(`  ⚠️  Unmapped source topic names: ${[...unmapped].map(n => JSON.stringify(n)).join(', ')}`);
    }

    console.log('  New topic breakdown:');
    const entries = [...groupCounts.entries()].sort((a, b) => {
      const oa = Object.values(map).find(v => v.name === a[0])?.order ?? 99;
      const ob = Object.values(map).find(v => v.name === b[0])?.order ?? 99;
      return oa - ob;
    });
    for (const [name, count] of entries) {
      console.log(`    · ${name}  (${count})`);
    }

    if (APPLY && ops.length) {
      const res = await coll.bulkWrite(ops, { ordered: false });
      console.log(`  ✅ Applied. modified=${res.modifiedCount}`);
      grandMatched += res.modifiedCount;
    } else if (!APPLY) {
      console.log('  (dry run — pass --apply to write)');
    }
  }

  console.log(`\n── Summary ───────────────────────────────`);
  console.log(`Total cards scanned: ${grandTotal}`);
  if (APPLY) console.log(`Total docs modified: ${grandMatched}`);

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
