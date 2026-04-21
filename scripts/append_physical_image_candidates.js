/**
 * Scans Physical Chemistry flashcards and *appends* image-candidate
 * markdown to scripts/image_candidates.md.
 *
 * Usage:
 *   node scripts/append_physical_image_candidates.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Physical-chemistry-specific scoring rules.
const RULES = [
  // Orbital shapes / nodes / QM
  { re: /\b(orbital shape|shape of .* orbital|radial node|angular node|2p_z|dxy|dz2|dx2-y2|probability distribution|radial (function|plot)|psi\^?2|wavefunction)\b/i,
    tag: 'Orbital shape / radial plot' },

  // Unit cells / crystal structures
  { re: /\b(unit cell|FCC|BCC|HCP|simple cubic|body.?centred|face.?centred|NaCl structure|CsCl|zinc.?blende|rock salt|Bravais|fluorite)\b/i,
    tag: 'Unit cell diagram' },

  // Packing / voids
  { re: /\b(packing efficiency|tetrahedral void|octahedral void|close.?packed|ABCABC|ABAB|coordination number \d)\b/i,
    tag: 'Close-packing / voids diagram' },

  // Point defects
  { re: /\b(Schottky|Frenkel|F.?centre|F.?center|Farbenzentrum|vacanc(y|ies)|interstitial)\b/i,
    tag: 'Point defect diagram' },

  // Band theory / semiconductors
  { re: /\b(band (theory|gap|structure)|valence band|conduction band|Fermi level|n.?type|p.?type|doping|semiconductor|intrinsic)\b/i,
    tag: 'Band diagram / semiconductor' },

  // Arrhenius / Maxwell-Boltzmann
  { re: /\bArrhenius (plot|equation)|Maxwell.Boltzmann|energy distribution|fraction of molecules|threshold energy|activation energy.*temperature/i,
    tag: 'Arrhenius plot / Maxwell-Boltzmann curve' },

  // Rate vs time / integrated rate plots
  { re: /\b(integrated rate|concentration.*time|plot.*time|ln\s*\[?A\]?.*time|half.?life.*plot|first.order.*plot|zero.order.*plot)\b/i,
    tag: 'Concentration vs time plot' },

  // Reaction profile / catalysis energy diagram
  { re: /\b(reaction (profile|coordinate)|activation energy.*catalyst|energy (profile|barrier|diagram)|transition state|catalyst.*path)\b/i,
    tag: 'Reaction energy profile' },

  // Adsorption isotherms
  { re: /\b(Freundlich|Langmuir|adsorption isotherm|x\/m.*P|extent of adsorption)\b/i,
    tag: 'Adsorption isotherm plot' },

  // Colloid types / Tyndall / electrophoresis
  { re: /\b(Tyndall|Brownian|electrophoresis|zeta potential|lyophilic|lyophobic|peptization|micelle|CMC|emulsion)\b/i,
    tag: 'Colloid / Tyndall diagram' },

  // Electrochemical cell
  { re: /\b(galvanic cell|Daniell|salt bridge|cell notation|electrode|SHE|calomel|concentration cell)\b/i,
    tag: 'Electrochemical cell setup' },

  // Electrolysis apparatus
  { re: /\b(electrolysis|down'?s cell|Nelson cell|mercury cathode|Hall.Héroult|electrolytic (cell|refining))\b/i,
    tag: 'Electrolysis apparatus diagram' },

  // Conductivity variation with dilution / Kohlrausch
  { re: /\b(molar conductivity|Kohlrausch|limiting molar conductivity|conductivity.*dilution|Debye.?H(ü|u)ckel|Onsager)\b/i,
    tag: 'Conductivity vs dilution plot' },

  // Vapour pressure / Raoult / azeotrope P-x diagrams
  { re: /\b(vapour pressure.*mole fraction|Raoult.*deviation|P.x diagram|positive deviation|negative deviation|azeotrope|maximum.boiling|minimum.boiling)\b/i,
    tag: 'Vapour pressure vs composition plot' },

  // Osmosis apparatus
  { re: /\b(osmosis|osmotic pressure|semi.?permeable|reverse osmosis|Berkeley.?Hartley|Pfeffer)\b/i,
    tag: 'Osmosis setup diagram' },

  // Colligative properties graphs
  { re: /\b(freezing point.*curve|boiling point.*curve|depression.*freezing|elevation.*boiling|T.?x diagram|cryoscopic|ebullioscopic)\b/i,
    tag: 'T-x phase diagram / colligative curve' },

  // H emission spectrum / series
  { re: /\b(Lyman|Balmer|Paschen|Brackett|Pfund|hydrogen (spectrum|emission)|Rydberg|spectral (line|series))\b/i,
    tag: 'Hydrogen spectrum line diagram' },

  // Photoelectric setup / threshold
  { re: /\b(photoelectric|work function|threshold frequency|stopping potential|photocurrent|photoelectron)\b/i,
    tag: 'Photoelectric experiment / KE vs ν graph' },

  // Magnetic ordering (domain pictures)
  { re: /\b(ferromagnet|antiferromagnet|ferrimagnet|Curie|N(é|e)el|magnetic domain|spin alignment)\b/i,
    tag: 'Magnetic domain alignment diagram' },

  // Allotropes (carbon / sulfur / phosphorus)
  { re: /\b(diamond|graphite|graphene|fullerene|allotrope|buckminster|S8|P4|rhombic|monoclinic)\b/i,
    tag: 'Allotrope structure' },

  // VSEPR / hybridisation (for atomic-structure context if any)
  { re: /\bhybridi[sz](ation|ed)|sp3d?2?|bond angle|VSEPR|lone pair\b/i,
    tag: 'Hybridisation / VSEPR diagram' },

  // de Broglie / uncertainty (often benefits from a visual)
  { re: /\bde Broglie|matter wave|uncertainty principle|Heisenberg|wave.particle/i,
    tag: 'Wave-particle duality illustration' },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  const cards = await coll.find({
    'chapter.category': 'Physical Chemistry',
    deleted_at: null,
  }).sort({ 'chapter.name': 1, 'topic.order': 1, flashcard_id: 1 }).toArray();

  console.log(`Scanning ${cards.length} physical chemistry cards…`);

  const byChapter = {};
  for (const card of cards) {
    const combined = (card.question || '') + ' ' + (card.answer || '');
    const tags = [];
    for (const { re, tag } of RULES) {
      if (re.test(combined)) tags.push(tag);
    }
    if (!tags.length) continue;

    const ch = card.chapter?.name || card.chapter?.id;
    if (!byChapter[ch]) byChapter[ch] = [];
    byChapter[ch].push({
      id: card.flashcard_id,
      topic: card.topic?.name || '—',
      q: (card.question || '').replace(/\n/g, ' ').slice(0, 120),
      tags: [...new Set(tags)], // dedupe
    });
  }

  const flagged = Object.values(byChapter).flat().length;

  // Build the appended section
  const lines = [];
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('# Physical Chemistry — Image Candidates');
  lines.push('');
  lines.push('> Generated by `scripts/append_physical_image_candidates.js`  ');
  lines.push('> Cards flagged where a diagram, chart, or illustration would meaningfully improve retention.');
  lines.push('');
  lines.push(`**Total flagged:** ${flagged} / ${cards.length} cards`);
  lines.push('');

  const chapterOrder = [
    'Atomic Structure', 'Solutions', 'Chemical Kinetics',
    'Electrochemistry', 'Surface Chemistry', 'Solid State',
  ];
  const sortedChapters = Object.keys(byChapter).sort((a, b) => {
    const ia = chapterOrder.indexOf(a);
    const ib = chapterOrder.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  for (const chapter of sortedChapters) {
    const items = byChapter[chapter];
    lines.push(`## ${chapter}  (${items.length} flagged)`);
    lines.push('');

    const byTopic = {};
    for (const item of items) {
      if (!byTopic[item.topic]) byTopic[item.topic] = [];
      byTopic[item.topic].push(item);
    }

    for (const [topic, topicItems] of Object.entries(byTopic)) {
      lines.push(`### ${topic}`);
      lines.push('');
      lines.push('| ID | Question (truncated) | Image type |');
      lines.push('|---|---|---|');
      for (const { id, q, tags } of topicItems) {
        const safeQ = (q || '').replace(/\|/g, '\\|');
        lines.push(`| \`${id}\` | ${safeQ} | ${tags.join('; ')} |`);
      }
      lines.push('');
    }
  }

  // Tag tally for this category
  const tagTally = {};
  for (const item of Object.values(byChapter).flat()) {
    for (const t of item.tags) tagTally[t] = (tagTally[t] ?? 0) + 1;
  }
  lines.push('---');
  lines.push('');
  lines.push('## Summary by Image Type (Physical Chemistry)');
  lines.push('');
  lines.push('| Image type | Cards |');
  lines.push('|---|---|');
  for (const [tag, n] of Object.entries(tagTally).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${tag} | ${n} |`);
  }
  lines.push('');

  const outPath = path.join(__dirname, 'image_candidates.md');
  const existing = fs.readFileSync(outPath, 'utf8');

  // Idempotent append: strip previous physical section if present
  const marker = '\n---\n\n# Physical Chemistry — Image Candidates\n';
  const idx = existing.indexOf(marker);
  const base = idx === -1 ? existing : existing.slice(0, idx);

  fs.writeFileSync(outPath, base.replace(/\s+$/, '') + '\n' + lines.join('\n'));
  console.log(`\nAppended ${flagged} physical-chemistry image candidates to ${outPath}.`);

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
