// Rename JM25APR* exam-based display_ids to canonical chapter-based prefixes
// Also fixes non-canonical chapter_id values to match taxonomyData_from_csv.ts
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Canonical chapter_id corrections (non-canonical → canonical)
const CHAPTER_ID_FIXES = {
  'ch11_equilibrium':    'ch11_chem_eq',
  'ch11_thermodynamics': 'ch11_thermo',
  'ch11_hydrocarbons':   'ch11_hydrocarbon',
  'ch12_coordination':   'ch12_coord',
  'ch12_electrochemistry': 'ch12_electrochem',
};

// Canonical prefix per chapter_id (after chapter_id is corrected)
const CHAPTER_PREFIX = {
  'ch11_atom':        'ATOM',
  'ch11_bonding':     'BOND',
  'ch11_chem_eq':     'CEQ',
  'ch11_goc':         'GOC',
  'ch11_hydrocarbon': 'HC',
  'ch11_ionic_eq':    'IEQ',
  'ch11_mole':        'MOLE',
  'ch11_pblock':      'PB11',
  'ch11_periodic':    'PERI',
  'ch11_prac_org':    'POC',
  'ch11_redox':       'RDX',
  'ch11_thermo':      'THERMO',
  'ch12_alcohols':    'ALCO',
  'ch12_aldehydes':   'ALDO',
  'ch12_amines':      'AMIN',
  'ch12_biomolecules':'BIO',
  'ch12_carboxylic':  'CARB',
  'ch12_coord':       'CORD',
  'ch12_dblock':      'DNF',
  'ch12_electrochem': 'EC',
  'ch12_haloalkanes': 'HALO',
  'ch12_kinetics':    'CK',
  'ch12_pblock':      'PB12',
  'ch12_phenols':     'PHEN',
  'ch12_solutions':   'SOL',
};

// Current max display_id numbers per prefix (from pre-run audit)
const CURRENT_MAX = {
  ATOM: 413, BOND: 177, CEQ: 63,  CK: 132,  CORD: 239, DNF: 158,
  EC: 137,   GOC: 136,  HALO: 6,  HC: 158,  IEQ: 78,   MOLE: 414,
  PB11: 62,  PB12: 121, PERI: 141, POC: 86,  RDX: 81,   SOL: 143,
  THERMO: 144, BIO: 130, ALDO: 7, AMIN: 8,
  ALCO: 0, CARB: 0, PHEN: 0,
};

function pad(n) { return String(n).padStart(3, '0'); }

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');

  const examPrefixes = ['JM25APR3M','JM25APR4E','JM25APR4M','JM25APR7E','JM25APR7M','JM25APR8E'];

  // Fetch all exam-prefixed questions
  const allDocs = await col.find(
    { display_id: { $in: examPrefixes.map(p => new RegExp('^' + p + '-')) } },
    { projection: { _id: 1, display_id: 1, 'metadata.chapter_id': 1 } }
  ).sort({ display_id: 1 }).toArray();

  console.log('Total exam-prefixed questions found:', allDocs.length);

  // Build sequential counters per prefix (starting from current max + 1)
  const counters = {};
  for (const [prefix, max] of Object.entries(CURRENT_MAX)) {
    counters[prefix] = max + 1;
  }

  let ok = 0, fail = 0, skipped = 0;

  for (const doc of allDocs) {
    // Step 1: resolve canonical chapter_id
    let chapterId = doc.metadata?.chapter_id;
    const correctedChapterId = CHAPTER_ID_FIXES[chapterId] || chapterId;

    // Step 2: get canonical prefix
    const prefix = CHAPTER_PREFIX[correctedChapterId];
    if (!prefix) {
      console.log(`  SKIP ${doc.display_id} — no prefix for chapter_id: ${correctedChapterId}`);
      skipped++;
      continue;
    }

    // Step 3: assign new display_id
    const newDisplayId = `${prefix}-${pad(counters[prefix])}`;
    counters[prefix]++;

    // Step 4: build $set update
    const setFields = { display_id: newDisplayId, updated_at: new Date() };
    if (correctedChapterId !== chapterId) {
      setFields['metadata.chapter_id'] = correctedChapterId;
    }

    try {
      const result = await col.updateOne({ _id: doc._id }, { $set: setFields });
      if (result.modifiedCount === 1) {
        const chFix = correctedChapterId !== chapterId ? ` [chapter: ${chapterId}→${correctedChapterId}]` : '';
        console.log(`  OK  ${doc.display_id} → ${newDisplayId}${chFix}`);
        ok++;
      } else {
        console.log(`  SKIP ${doc.display_id} (no modification)`);
        skipped++;
      }
    } catch (e) {
      console.log(`  FAIL ${doc.display_id} → ${newDisplayId}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} renamed, ${fail} failed, ${skipped} skipped`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
