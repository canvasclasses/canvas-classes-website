/**
 * Consolidate all Physical Chemistry flashcard chapters:
 *   ch12_solutions, ch12_electrochemistry, ch12_kinetics,
 *   ch11_atom, ch12_surface, ch12_solid_state
 *
 * - Assigns proper topic.order (all were 0)
 * - Merges oversized chapter topics to ≤ 8 subtopics
 * - Normalises LaTeX: $$..$$ → $..$, strips zero-width chars, collapses whitespace
 *
 * Usage:
 *   node scripts/consolidate_physical_all.js           # dry run
 *   node scripts/consolidate_physical_all.js --apply   # write to DB
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const APPLY = process.argv.includes('--apply');

// ─── LaTeX / whitespace cleanup ───────────────────────────────────────────────
function cleanLatex(text) {
  if (typeof text !== 'string') return text;
  let out = text;
  out = out.replace(/[\u200B-\u200D\uFEFF]/g, '');
  out = out.replace(/\$\$([\s\S]+?)\$\$/g, (_m, body) => `$${body.trim()}$`);
  out = out.replace(/[ \t]{2,}/g, ' ');
  out = out.split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n');
  return out;
}

// ─── Chapter definitions ───────────────────────────────────────────────────────
const CHAPTERS = {

  // ── ch12_solutions ── 76 cards, 8 topics (already good) → fix ordering
  ch12_solutions: {
    defaultMap: {
      'Classification of Solutions':          { name: 'Classification of Solutions',          order: 1 },
      'Concentration Terms':                  { name: 'Concentration Terms',                  order: 2 },
      'Vapour Pressure':                      { name: 'Vapour Pressure',                      order: 3 },
      "Raoult's Law":                         { name: "Raoult's Law",                         order: 4 },
      "Henry's Law":                          { name: "Henry's Law",                          order: 5 },
      'Elevation in BP and Depression in FP': { name: 'Boiling Point Elevation & Freezing Point Depression', order: 6 },
      'Osmosis & Osmotic Pressure':           { name: 'Osmosis & Osmotic Pressure',           order: 7 },
      "Van't Hoff Factor":                    { name: "Van't Hoff Factor & Abnormal Masses",  order: 8 },
    },
  },

  // ── ch12_electrochemistry ── 73 cards, 9 → 6 topics
  ch12_electrochemistry: {
    defaultMap: {
      'Galvanic Cells':              { name: 'Galvanic Cells & Electrode Potentials', order: 1 },
      'SRP and Cell Potential':      { name: 'Galvanic Cells & Electrode Potentials', order: 1 },
      'Nernst Equation':             { name: 'Nernst Equation & Thermodynamics',      order: 2 },
      'Conductance of Solutions':    { name: 'Conductance & Molar Conductivity',      order: 3 },
      'Variation of Conductivity':   { name: 'Conductance & Molar Conductivity',      order: 3 },
      "Electrolysis & Faraday's Laws": { name: "Electrolysis & Faraday's Laws",       order: 4 },
      'Batteries':                   { name: 'Batteries & Fuel Cells',                order: 5 },
      'Fuel Cells':                  { name: 'Batteries & Fuel Cells',                order: 5 },
      'Corrosion':                   { name: 'Corrosion & Prevention',                order: 6 },
    },
  },

  // ── ch12_kinetics ── 60 cards, 7 topics (already good) → fix ordering
  ch12_kinetics: {
    defaultMap: {
      'Rate of Chemical Reaction':   { name: 'Rate of Chemical Reaction',             order: 1 },
      'Rate Law & Order of Reaction':{ name: 'Rate Law & Order of Reaction',          order: 2 },
      'Factors Influencing Rate':    { name: 'Factors Influencing Rate',              order: 3 },
      'Zero Order Kinetics':         { name: 'Zero Order Kinetics',                   order: 4 },
      'First Order Kinetics':        { name: 'First Order Kinetics',                  order: 5 },
      'Collision Theory':            { name: 'Collision Theory & Molecularity',       order: 6 },
      'Arrhenius Equation':          { name: 'Arrhenius Equation & Activation Energy',order: 7 },
    },
  },

  // ── ch11_atom ── 60 cards, 17 → 6 topics
  ch11_atom: {
    defaultMap: {
      'EM Radiation':              { name: 'EM Radiation & Photoelectric Effect',       order: 1 },
      'Photoelectric Effect':      { name: 'EM Radiation & Photoelectric Effect',       order: 1 },
      'Sub-atomic Particles':      { name: 'Sub-atomic Particles & Early Atomic Models',order: 2 },
      'Atomic Models':             { name: 'Sub-atomic Particles & Early Atomic Models',order: 2 },
      'Atomic Terms':              { name: 'Sub-atomic Particles & Early Atomic Models',order: 2 },
      'General':                   { name: 'Sub-atomic Particles & Early Atomic Models',order: 2 },
      "Bohr's Model":              { name: "Bohr's Model & Hydrogen Spectrum",          order: 3 },
      'Hydrogen Spectrum':         { name: "Bohr's Model & Hydrogen Spectrum",          order: 3 },
      'Atomic Spectra':            { name: "Bohr's Model & Hydrogen Spectrum",          order: 3 },
      'Dual Nature':               { name: 'Dual Nature, Uncertainty & QM Model',       order: 4 },
      'Uncertainty Principle':     { name: 'Dual Nature, Uncertainty & QM Model',       order: 4 },
      'Quantum Mechanical Model':  { name: 'Dual Nature, Uncertainty & QM Model',       order: 4 },
      'Quantum Numbers':           { name: 'Quantum Numbers & Orbital Shapes',          order: 5 },
      'Shapes of Orbitals':        { name: 'Quantum Numbers & Orbital Shapes',          order: 5 },
      'Orbitals':                  { name: 'Quantum Numbers & Orbital Shapes',          order: 5 },
      'Electronic Configuration':  { name: 'Electronic Configuration & Spectral Effects', order: 6 },
      'Effects':                   { name: 'Electronic Configuration & Spectral Effects', order: 6 },
    },
  },

  // ── ch12_surface ── 60 cards, 10 → 7 topics
  ch12_surface: {
    defaultMap: {
      'Adsorption':                { name: 'Adsorption & Thermodynamics',          order: 1 },
      'Thermodynamics':            { name: 'Adsorption & Thermodynamics',          order: 1 },
      'Adsorption Isotherms':      { name: 'Adsorption Isotherms',                 order: 2 },
      'Catalysis':                 { name: 'Catalysis',                            order: 3 },
      'Colloids ':                 { name: 'Classification of Colloids',           order: 4 },
      'Colloids':                  { name: 'Classification of Colloids',           order: 4 },
      'Preparation of Colloids':   { name: 'Preparation & Purification of Colloids', order: 5 },
      'Purification of Colloids':  { name: 'Preparation & Purification of Colloids', order: 5 },
      'Properties of Colloids':    { name: 'Properties of Colloids',               order: 6 },
      'Coagulation':               { name: 'Coagulation & Emulsions',              order: 7 },
      'Emulsions':                 { name: 'Coagulation & Emulsions',              order: 7 },
    },
  },

  // ── ch12_solid_state ── 60 cards, 9 → 6 topics
  ch12_solid_state: {
    defaultMap: {
      'Classification of Solids':  { name: 'Classification & Types of Crystals',          order: 1 },
      'Types of Crystals':         { name: 'Classification & Types of Crystals',          order: 1 },
      'Unit Cells & Lattices':     { name: 'Unit Cells & Lattices',                       order: 2 },
      'Packing Efficiency':        { name: 'Packing Efficiency, Voids & Calculations',    order: 3 },
      'Voids':                     { name: 'Packing Efficiency, Voids & Calculations',    order: 3 },
      'Calculation':               { name: 'Packing Efficiency, Voids & Calculations',    order: 3 },
      'Defects':                   { name: 'Point Defects in Crystals',                   order: 4 },
      'Electrical Properties':     { name: 'Electrical Properties & Semiconductors',      order: 5 },
      'Magnetic Properties':       { name: 'Magnetic Properties',                         order: 6 },
    },
  },
};

// ─── Run ──────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  const globalOps = [];
  const summary = [];

  for (const [chapterId, { defaultMap }] of Object.entries(CHAPTERS)) {
    const cards = await coll.find({ 'chapter.id': chapterId, deleted_at: null }).toArray();
    const ops = [];
    const unmapped = new Set();
    const groupCounts = new Map();
    let latexCount = 0;

    for (const card of cards) {
      const oldTopic = card.topic?.name;
      const dest = defaultMap[oldTopic];
      if (!dest) {
        unmapped.add(`${card.flashcard_id}  (${JSON.stringify(oldTopic)})`);
        continue;
      }

      const cleanedQ = cleanLatex(card.question);
      const cleanedA = cleanLatex(card.answer);
      const qChanged = cleanedQ !== card.question;
      const aChanged = cleanedA !== card.answer;
      if (qChanged || aChanged) latexCount++;

      groupCounts.set(dest.name, (groupCounts.get(dest.name) ?? 0) + 1);

      const topicChanged = card.topic?.name !== dest.name || card.topic?.order !== dest.order;
      if (!topicChanged && !qChanged && !aChanged) continue;

      const $set = {
        'topic.name': dest.name,
        'topic.order': dest.order,
        'metadata.updated_at': new Date(),
      };
      if (qChanged) $set.question = cleanedQ;
      if (aChanged) $set.answer = cleanedA;

      ops.push({ updateOne: { filter: { _id: card._id }, update: { $set } } });
    }

    const sortedGroups = [...groupCounts.entries()].sort((a, b) => {
      const oa = Object.values(defaultMap).find(d => d.name === a[0])?.order ?? 99;
      const ob = Object.values(defaultMap).find(d => d.name === b[0])?.order ?? 99;
      return oa - ob;
    });

    summary.push({
      chapterId, total: cards.length,
      ops: ops.length, latex: latexCount,
      unmapped: [...unmapped], groups: sortedGroups,
    });
    globalOps.push(...ops);
  }

  for (const { chapterId, total, ops, latex, unmapped, groups } of summary) {
    console.log(`\n=== ${chapterId} (${total} cards) ===`);
    console.log(`  LaTeX changes: ${latex}   Ops queued: ${ops}`);
    if (unmapped.length) {
      console.log('  ⚠️  Unmapped:');
      unmapped.forEach(u => console.log('    · ' + u));
    }
    for (const [name, count] of groups) console.log(`  · ${name}  (${count})`);
  }

  const totalOps = globalOps.length;
  console.log(`\nTotal ops: ${totalOps}`);

  if (APPLY && totalOps) {
    const res = await coll.bulkWrite(globalOps, { ordered: false });
    console.log(`\n✅ Applied. modified=${res.modifiedCount}`);
  } else if (!APPLY) {
    console.log('\n(dry run — pass --apply to write)');
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
