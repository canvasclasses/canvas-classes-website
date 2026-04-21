/**
 * Consolidate all remaining inorganic chemistry flashcard chapters:
 *   ch12_alloys, ch12_ores, ch12_metallurgy, ch12_inorganic_trends,
 *   fc_p_block_15_18, ch12_salt_analysis, thermal_decomposition_of_salts,
 *   fc_p_block_13_14
 *
 * - Assigns proper topic.order (all were 0)
 * - Merges oversized chapter topics to ≤ 8 subtopics
 * - Normalises LaTeX: $$..$$ → $..$, strips zero-width chars, collapses whitespace
 *
 * Usage:
 *   node scripts/consolidate_inorganic_all.js           # dry run
 *   node scripts/consolidate_inorganic_all.js --apply   # write to DB
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const APPLY = process.argv.includes('--apply');

// ─── LaTeX / whitespace cleanup ───────────────────────────────────────────────
function cleanLatex(text) {
  if (typeof text !== 'string') return text;
  let out = text;
  out = out.replace(/[\u200B-\u200D\uFEFF]/g, '');
  out = out.replace(/\$\$([^$]+?)\$\$/g, (_m, body) => `$${body.trim()}$`);
  out = out.replace(/[ \t]{2,}/g, ' ');
  out = out.split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n');
  return out;
}

// ─── Chapter definitions ───────────────────────────────────────────────────────

const CHAPTERS = {

  // ── ch12_alloys ── 48 cards, 6 topics → just assign order + rename ──────────
  ch12_alloys: {
    defaultMap: {
      'Alloys - Iron/Steel':  { name: 'Iron & Steel Alloys',        order: 1 },
      'Alloys - Copper':      { name: 'Copper Alloys',              order: 2 },
      'Alloys - Aluminium':   { name: 'Aluminium Alloys',           order: 3 },
      'Alloys - Tin/Lead':    { name: 'Tin & Lead Alloys',          order: 4 },
      'Alloys - Magnesium':   { name: 'Magnesium Alloys',           order: 5 },
      'Alloys - Special':     { name: 'Special-Purpose Alloys',     order: 6 },
    },
    overrides: {},
  },

  // ── ch12_ores ── 60 cards, 9 → 7 topics ─────────────────────────────────────
  ch12_ores: {
    defaultMap: {
      'Ores - Aluminum (Al)':   { name: 'Aluminium Ores',                   order: 1 },
      'Ores - Iron (Fe)':       { name: 'Iron Ores',                        order: 2 },
      'Ores - Copper (Cu)':     { name: 'Copper & Silver Ores',             order: 3 },
      'Ores - Silver (Ag)':     { name: 'Copper & Silver Ores',             order: 3 },
      'Ores - Magnesium (Mg)':  { name: 'Magnesium Ores',                   order: 4 },
      'Ores - Ca, Sr, Ba, Ra':  { name: 'Calcium & Alkaline Earth Ores',    order: 5 },
      'Ores - Lead (Pb)':       { name: 'Lead, Zinc & Heavy Metal Ores',    order: 6 },
      'Ores - Zn, Hg, Sn, Ti':  { name: 'Lead, Zinc & Heavy Metal Ores',   order: 6 },
      'Ores - Boron & Be':      { name: 'Boron & Beryllium Ores',           order: 7 },
    },
    overrides: {},
  },

  // ── ch12_metallurgy ── 60 cards, 13 → 7 topics ──────────────────────────────
  ch12_metallurgy: {
    defaultMap: {
      'Introduction':               { name: 'Introduction & Occurrence',                    order: 1 },
      'Occurrence':                 { name: 'Introduction & Occurrence',                    order: 1 },
      'Concentration':              { name: 'Concentration & Pre-treatment',                order: 2 },
      'Pre-treatment':              { name: 'Concentration & Pre-treatment',                order: 2 },
      'Thermodynamics':             { name: 'Reduction: Thermodynamic & Electrochemical',   order: 3 },
      'Electrochemical':            { name: 'Reduction: Thermodynamic & Electrochemical',   order: 3 },
      'Extraction of Fe':           { name: 'Extraction of Iron',                           order: 4 },
      'Extraction of Cu':           { name: 'Extraction of Copper & Leaching',              order: 5 },
      'Extraction of Low Grade Cu': { name: 'Extraction of Copper & Leaching',              order: 5 },
      'Leaching':                   { name: 'Extraction of Copper & Leaching',              order: 5 },
      'Refining':                   { name: 'Refining Methods',                             order: 6 },
      'Extraction of Zn':           { name: 'Zinc Extraction & Industrial Uses',            order: 7 },
      'Uses':                       { name: 'Zinc Extraction & Industrial Uses',            order: 7 },
    },
    overrides: {},
  },

  // ── ch12_inorganic_trends ── 100 cards, 7 topics (already good) → fix order ─
  ch12_inorganic_trends: {
    defaultMap: {
      'Atomic & Periodic Properties': { name: 'Atomic & Periodic Properties', order: 1 },
      'Physical Properties':          { name: 'Physical Properties',          order: 2 },
      'Chemical Bonding':             { name: 'Chemical Bonding Trends',      order: 3 },
      'Acidity & Basicity':           { name: 'Acidity & Basicity',           order: 4 },
      'Solubility & Hydration':       { name: 'Solubility & Hydration',       order: 5 },
      'Redox & Electrochemistry':     { name: 'Redox & Electrochemistry',     order: 6 },
      'Stability & Reactivity':       { name: 'Stability & Reactivity',       order: 7 },
    },
    overrides: {},
  },

  // ── fc_p_block_15_18 ── 160 cards, 9 → 8 topics (merge G17 pair) ────────────
  fc_p_block_15_18: {
    defaultMap: {
      'G15: Trends, Anomalies & N2 Oxide Series':          { name: 'G15: Nitrogen Family — Trends & Oxides',          order: 1 },
      'G15: Ammonia, Nitric Acid & Fertilizers':            { name: 'G15: Ammonia, Nitric Acid & Fertilizers',         order: 2 },
      'G15: Phosphorus Allotropes & Oxoacids':              { name: 'G15: Phosphorus Allotropes & Oxoacids',           order: 3 },
      'G16: Oxygen Family (Trends & Ozone)':                { name: 'G16: Oxygen Family — Trends & Ozone',             order: 4 },
      'G16: Sulfur Allotropes & H2SO4 Process':             { name: 'G16: Sulfur — Allotropes & H₂SO₄',               order: 5 },
      'G16: Sulfur Oxides & Oxoacids':                      { name: 'G16: Sulfur Oxides & Oxoacids',                   order: 6 },
      'G17: Halogen Trends & Reactivity':                   { name: 'G17: Halogens — Trends, Reactivity & Compounds', order: 7 },
      'G17: Halogen Compounds (HCl, Oxoacids & Interhalogens)': { name: 'G17: Halogens — Trends, Reactivity & Compounds', order: 7 },
      'G18: Noble Gases & Xenon Chemistry':                 { name: 'G18: Noble Gases & Xenon Chemistry',              order: 8 },
    },
    overrides: {},
  },

  // ── ch12_salt_analysis ── 100 cards, 17 → 7 topics ──────────────────────────
  ch12_salt_analysis: {
    defaultMap: {
      'Physical Examination':               { name: 'Physical Examination & Dry Tests',           order: 1 },
      'Cation Analysis (Dry Test)':         { name: 'Physical Examination & Dry Tests',           order: 1 },
      'Cation Analysis (Group 0)':          { name: 'Cation Groups 0 & I — Cl⁻ Precipitates',    order: 2 },
      'Cation Analysis (Group I)':          { name: 'Cation Groups 0 & I — Cl⁻ Precipitates',    order: 2 },
      'Cation Analysis (Group II)':         { name: 'Cation Group II — H₂S (Acidic)',             order: 3 },
      'Cation Analysis (Group III)':        { name: 'Cation Group III — Hydroxide Group',         order: 4 },
      'Cation Analysis (Group IV)':         { name: 'Cation Groups IV, V & VI',                   order: 5 },
      'Cation Analysis (Group V)':          { name: 'Cation Groups IV, V & VI',                   order: 5 },
      'Cation Analysis (Group VI)':         { name: 'Cation Groups IV, V & VI',                   order: 5 },
      'Anion Analysis (Dilute  H2SO4  )':   { name: 'Anion Analysis — H₂SO₄ Tests',               order: 6 },
      'Anion Analysis (Conc  H2SO4  )':     { name: 'Anion Analysis — H₂SO₄ Tests',               order: 6 },
      'Anion Analysis (Independent)':       { name: 'Anion Confirmatory Tests',                    order: 7 },
      'Confirmatory Test (Chloride)':       { name: 'Anion Confirmatory Tests',                    order: 7 },
      'Confirmatory Test (Nitrate)':        { name: 'Anion Confirmatory Tests',                    order: 7 },
      'Confirmatory Test (Bromide)':        { name: 'Anion Confirmatory Tests',                    order: 7 },
      'Confirmatory Test (Iodide)':         { name: 'Anion Confirmatory Tests',                    order: 7 },
      'Confirmatory Test (Oxalate)':        { name: 'Anion Confirmatory Tests',                    order: 7 },
    },
    overrides: {},
  },

  // ── thermal_decomposition_of_salts ── 27 cards, 12 → 5 topics ───────────────
  thermal_decomposition_of_salts: {
    defaultMap: {
      'Carbonates':    { name: 'Carbonates & Bicarbonates',                  order: 1 },
      'Bicarbonates':  { name: 'Carbonates & Bicarbonates',                  order: 1 },
      'Nitrates':      { name: 'Nitrates & Nitrites',                        order: 2 },
      'Nitrites':      { name: 'Nitrates & Nitrites',                        order: 2 },
      'Oxides':        { name: 'Metal Oxides & Hydrates',                    order: 3 },
      'Hydrates':      { name: 'Metal Oxides & Hydrates',                    order: 3 },
      'Sulphates':     { name: 'Sulfates, Chlorates & Oxalates',             order: 4 },
      'Chlorates':     { name: 'Sulfates, Chlorates & Oxalates',             order: 4 },
      'Oxalates':      { name: 'Sulfates, Chlorates & Oxalates',             order: 4 },
      'Permanganates': { name: 'Permanganates, Dichromates & Colour Changes', order: 5 },
      'Dichromates':   { name: 'Permanganates, Dichromates & Colour Changes', order: 5 },
      'Color Change':  { name: 'Permanganates, Dichromates & Colour Changes', order: 5 },
    },
    overrides: {},
  },

  // ── fc_p_block_13_14 ── 80 cards, 6 topics, order 1-6 already set ────────────
  // Just apply LaTeX cleanup — topic assignments are already clean
  fc_p_block_13_14: {
    defaultMap: {
      'G13: Trends & Inert Pair Effect':  { name: 'G13: Trends & Inert Pair Effect',  order: 1 },
      'G13: Diborane & Borazine':         { name: 'G13: Diborane & Borazine',         order: 2 },
      'G13: Lewis Acidity & Halides':     { name: 'G13: Lewis Acidity & Halides',     order: 3 },
      'G13: Borax & Boric Acid':          { name: 'G13: Borax & Boric Acid',          order: 4 },
      'G14: Allotropes & Trends':         { name: 'G14: Allotropes & Trends',         order: 5 },
      'G14: CO, Silicates & Silicones':   { name: 'G14: CO, Silicates & Silicones',  order: 6 },
    },
    overrides: {},
  },
};

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  const globalOps = [];
  const summary = [];

  for (const [chapterId, { defaultMap, overrides }] of Object.entries(CHAPTERS)) {
    const cards = await coll.find({ 'chapter.id': chapterId, deleted_at: null }).toArray();
    const ops = [];
    const unmapped = new Set();
    const groupCounts = new Map();
    let latexCount = 0;

    for (const card of cards) {
      const oldTopic = card.topic?.name;
      const dest = overrides[card.flashcard_id] || defaultMap[oldTopic];
      if (!dest) {
        unmapped.add(`${card.flashcard_id}  (${oldTopic})`);
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

  // ── Print report ──────────────────────────────────────────────────────────
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
  console.log(`\nTotal ops across all chapters: ${totalOps}`);

  if (APPLY && totalOps) {
    const res = await coll.bulkWrite(globalOps, { ordered: false });
    console.log(`\n✅ Applied. modified=${res.modifiedCount}`);
  } else if (!APPLY) {
    console.log('\n(dry run — pass --apply to write)');
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
