/**
 * Appends Organic Chemistry image candidates to scripts/image_candidates.md.
 * Idempotent: strips any previous organic section before appending.
 *
 * Usage:
 *   node scripts/append_organic_image_candidates.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Cards that were flagged with imageNote in the three insert scripts.
// { id, chapter, topic, note }
const IMAGE_CARDS = [
  // ── Organic Reagents ──────────────────────────────────────────────────────
  { id: 'ORGR-006', ch: 'Organic Reagents',              topic: 'Reducing Agents',                    note: 'Reduction ladder: NO₂ → NHOH → NH₂ step diagram' },
  { id: 'ORGR-007', ch: 'Organic Reagents',              topic: 'Reducing Agents',                    note: 'cis-alkene (Lindlar\'s) vs trans-alkene (Na/NH₃) products from same alkyne' },
  { id: 'ORGR-011', ch: 'Organic Reagents',              topic: 'Oxidising Agents',                   note: 'Two-pathway diagram: cold KMnO₄ (diol) vs hot KMnO₄ (oxidative cleavage)' },
  { id: 'ORGR-015', ch: 'Organic Reagents',              topic: 'Oxidising Agents',                   note: 'Ozonolysis mechanism: ozonide intermediate → reductive vs oxidative workup' },
  { id: 'ORGR-021', ch: 'Organic Reagents',              topic: 'Halogenation Reagents',              note: 'SOCl₂ SNi retention vs PCl₅ SN2 inversion mechanisms side-by-side' },
  { id: 'ORGR-025', ch: 'Organic Reagents',              topic: 'Halogenation Reagents',              note: 'Markovnikov (ionic, cation intermediate) vs anti-Markovnikov (radical) HBr addition to propene' },
  { id: 'ORGR-027', ch: 'Organic Reagents',              topic: 'Halogenation Reagents',              note: '1,2 vs 1,4 addition to 1,3-butadiene; resonance-stabilised allylic cation' },
  { id: 'ORGR-034', ch: 'Organic Reagents',              topic: 'Grignard & Nucleophilic Reagents',   note: 'Two-step Grignard on ester: ester → ketone intermediate → tertiary alcohol' },
  { id: 'ORGR-048', ch: 'Organic Reagents',              topic: 'EAS Reagents & Catalysts',           note: 'Reimer–Tiemann: dichlorocarbene formation + electrophilic ortho attack on phenoxide' },
  { id: 'ORGR-051', ch: 'Organic Reagents',              topic: 'Elimination & Dehydration Reagents', note: 'Zaitsev (small base) vs Hofmann (bulky base) product alkenes from same substrate' },
  { id: 'ORGR-054', ch: 'Organic Reagents',              topic: 'Elimination & Dehydration Reagents', note: 'Ei ester pyrolysis: six-membered cyclic TS with syn H-transfer' },
  { id: 'ORGR-055', ch: 'Organic Reagents',              topic: 'Elimination & Dehydration Reagents', note: '3-methylbutan-2-ol dehydration: 2° → 3° carbocation via 1,2-methyl shift → Zaitsev product' },

  // ── Named Reactions ───────────────────────────────────────────────────────
  { id: 'ORGNR-001', ch: 'Named Reactions',              topic: 'Carbonyl Condensation Reactions',    note: 'Crossed aldol: acetaldehyde enolate attacking PhCHO → β-hydroxy aldehyde → cinnamaldehyde' },
  { id: 'ORGNR-010', ch: 'Named Reactions',              topic: 'Carbonyl Condensation Reactions',    note: 'Intramolecular aldol of heptane-2,6-dione → 5-membered ring formation' },
  { id: 'ORGNR-014', ch: 'Named Reactions',              topic: 'Reduction Named Reactions',          note: 'Birch reduction of anisole (double bonds adjacent to OMe) vs benzoic acid (double bonds away from COOH)' },
  { id: 'ORGNR-032', ch: 'Named Reactions',              topic: 'Amine & Diazonium Reactions',        note: 'Hofmann rearrangement: N-bromoamide → nitrene-like intermediate → isocyanate → amine' },
  { id: 'ORGNR-041', ch: 'Named Reactions',              topic: 'Phenol & Aromatic Named Reactions',  note: 'Kolbe–Schmitt: Na⁺-directed ortho cyclic TS vs K⁺/Cs⁺-directed para selectivity' },

  // ── Reaction Pathways & Scenarios ─────────────────────────────────────────
  { id: 'ORGS-012', ch: 'Reaction Pathways & Scenarios', topic: 'Elimination vs Substitution',        note: 'Chair conformations of trans-4-t-Bu-cyclohexyl OTs (axial, E2 fast) vs cis (equatorial, E2 slow)' },
  { id: 'ORGS-021', ch: 'Reaction Pathways & Scenarios', topic: 'Addition Regio- & Stereo-chemistry', note: 'Bromonium ion anti-addition to Z-but-2-ene (→ meso) vs E-but-2-ene (→ ± racemic)' },
  { id: 'ORGS-022', ch: 'Reaction Pathways & Scenarios', topic: 'Addition Regio- & Stereo-chemistry', note: 'Hydroboration (syn, anti-Markovnikov → 1°-OH) vs acid hydration (Markovnikov → 2°-OH) of propene' },
  { id: 'ORGS-025', ch: 'Reaction Pathways & Scenarios', topic: 'Addition Regio- & Stereo-chemistry', note: '1,2 vs 1,4 addition to 1,3-butadiene with allylic cation resonance; kinetic vs thermodynamic product' },
  { id: 'ORGS-029', ch: 'Reaction Pathways & Scenarios', topic: 'Addition Regio- & Stereo-chemistry', note: 'HBr Markovnikov (→ 1-bromo-1-methylcyclohexane) vs hydroboration anti-Markovnikov (→ 2-methylcyclohexan-1-ol) on 1-methylcyclohexene' },
  { id: 'ORGS-031', ch: 'Reaction Pathways & Scenarios', topic: 'EAS — Directing Effects & Competition', note: 'Sigma complex (Wheland intermediate) resonance structures for ortho vs meta attack on chlorobenzene' },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  // Fetch truncated question text for each flagged card
  const ids = IMAGE_CARDS.map(c => c.id);
  const docs = await coll.find({ flashcard_id: { $in: ids } }, { projection: { flashcard_id: 1, question: 1 } }).toArray();
  const qMap = {};
  docs.forEach(d => { qMap[d.flashcard_id] = (d.question || '').replace(/\n/g, ' ').slice(0, 110); });

  // Build markdown
  const lines = [];
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('# Organic Chemistry — Image Candidates');
  lines.push('');
  lines.push('> Generated by `scripts/append_organic_image_candidates.js`');
  lines.push('> Cards where a hand-drawn illustration would directly replace or supplement the text.');
  lines.push('');
  lines.push(`**Total flagged:** ${IMAGE_CARDS.length} cards`);
  lines.push('');

  // Group by chapter then topic
  const byChapter = {};
  for (const c of IMAGE_CARDS) {
    if (!byChapter[c.ch]) byChapter[c.ch] = {};
    if (!byChapter[c.ch][c.topic]) byChapter[c.ch][c.topic] = [];
    byChapter[c.ch][c.topic].push(c);
  }

  const chapterOrder = ['Organic Reagents', 'Named Reactions', 'Reaction Pathways & Scenarios'];
  for (const chName of chapterOrder) {
    const topics = byChapter[chName];
    if (!topics) continue;
    const total = Object.values(topics).flat().length;
    lines.push(`## ${chName}  (${total} flagged)`);
    lines.push('');
    for (const [topic, cards] of Object.entries(topics)) {
      lines.push(`### ${topic}`);
      lines.push('');
      lines.push('| ID | Question (truncated) | Illustration needed |');
      lines.push('|---|---|---|');
      for (const c of cards) {
        const q = (qMap[c.id] || '').replace(/\|/g, '\\|');
        lines.push(`| \`${c.id}\` | ${q} | ${c.note} |`);
      }
      lines.push('');
    }
  }

  // Summary table
  const noteTally = {};
  for (const c of IMAGE_CARDS) {
    const cat = c.note.split(':')[0].trim().replace(/\(.*\)/, '').trim();
    noteTally[cat] = (noteTally[cat] || 0) + 1;
  }
  lines.push('---');
  lines.push('');
  lines.push('## Summary by Illustration Type (Organic Chemistry)');
  lines.push('');
  lines.push('| Illustration type | Cards |');
  lines.push('|---|---|');
  for (const [tag, n] of Object.entries(noteTally).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${tag} | ${n} |`);
  }
  lines.push('');

  // Append idempotently
  const outPath = path.join(__dirname, 'image_candidates.md');
  const existing = fs.readFileSync(outPath, 'utf8');
  const marker = '\n---\n\n# Organic Chemistry — Image Candidates\n';
  const base = existing.indexOf(marker) === -1 ? existing : existing.slice(0, existing.indexOf(marker));
  fs.writeFileSync(outPath, base.replace(/\s+$/, '') + '\n' + lines.join('\n'));

  console.log(`Appended ${IMAGE_CARDS.length} organic image candidates to ${outPath}`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
