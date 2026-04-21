/**
 * Refine "Important Compounds of Inorganic" flashcards:
 *   - Regroup 22 low-level subtopics into 7 clean categories
 *   - Normalise LaTeX ($$..$$ → $..$)
 *   - Strip zero-width chars & collapse stray whitespace
 *
 * Usage:
 *   node scripts/refine_important_compounds.js           # dry run
 *   node scripts/refine_important_compounds.js --apply   # write to DB
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const APPLY = process.argv.includes('--apply');
const CHAPTER_ID = 'important_compounds_of_inorganic';

const ACIDS    = { name: 'Acids, Bases & Oxides',                  order: 1 };
const SALTS    = { name: 'Salts & Hydrates',                       order: 2 };
const MINERALS = { name: 'Minerals & Ores',                        order: 3 };
const GASES    = { name: 'Gases & Liquid Solutions',               order: 4 };
const PIGMENTS = { name: 'Pigments, Reagents & Coordination',      order: 5 };
const MIXTURES = { name: 'Mixtures, Explosives & Fertilizers',     order: 6 };
const ORGANIC  = { name: 'Organic-Named & Trade-Name Compounds',   order: 7 };

// Default mapping based on original topic.name
const DEFAULT_MAP = {
  'Minerals':     MINERALS,
  'Explosives':   MIXTURES,
  'Salts':        SALTS,
  'Acids':        ACIDS,
  'Reagents':     PIGMENTS,
  'Mixtures':     MIXTURES,
  'Solutions':    GASES,
  'Vitriols':     SALTS,
  'Borates':      SALTS,
  'Coordination': PIGMENTS,
  'Chlorides':    SALTS,
  'Ores':         MINERALS,
  'Bases':        ACIDS,
  'Organic':      ORGANIC,
  'Gases':        GASES,
  'Alcohols':     ORGANIC,
  'Pesticides':   MIXTURES,
  'Fertilizers':  MIXTURES,
  'Pigments':     PIGMENTS,
  'Lime':         ACIDS,
};

// Per-card overrides (for Common Names, Compounds, Medical — and cross-cutting
// entries like Chile Saltpeter which was filed under Minerals but is really a salt).
const OVERRIDES = {
  // — From "Minerals" to more specific buckets
  'FLASH-INORG-0578': SALTS,     // Chile Saltpeter (NaNO3)
  'FLASH-INORG-0653': ACIDS,     // Milk of Magnesia (basic)
  'FLASH-INORG-0660': ACIDS,     // Magnesia (MgO — basic oxide)
  'FLASH-INORG-0687': SALTS,     // Washing Soda (Na2CO3)

  // — Common Names pool, assigned by the compound's actual class
  'FLASH-INORG-0563': SALTS,     // Baking Soda
  'FLASH-INORG-0590': GASES,     // Dry Ice
  'FLASH-INORG-0611': SALTS,     // Hypo
  'FLASH-INORG-0613': SALTS,     // Kali → Potash (K2CO3)
  'FLASH-INORG-0622': SALTS,     // Oxone (Na2O2)
  'FLASH-INORG-0630': MINERALS,  // Philosopher's Wool (ZnO)
  'FLASH-INORG-0640': MINERALS,  // Quick Silver (Hg)
  'FLASH-INORG-0686': GASES,     // Vinegar (dilute acid solution)
  'FLASH-INORG-0697': SALTS,     // Na2S2O3·5H2O (Hypo/Antichlor)
  'FLASH-INORG-0698': SALTS,     // Borax (Na2B4O7·10H2O)
  'FLASH-INORG-0699': MINERALS,  // Cu2O (Cuprite)
  'FLASH-INORG-0700': SALTS,     // Hg2Cl2 (Calomel)
  'FLASH-INORG-0701': SALTS,     // NaNO3 (Chile Saltpeter)
  'FLASH-INORG-0702': MINERALS,  // Cu2S (Copper Glance)
  'FLASH-INORG-0703': GASES,     // C2N2 (Cyanogen, gas)
  'FLASH-INORG-0704': MINERALS,  // SiC (Carborundum)
  'FLASH-INORG-0705': MINERALS,  // BaSO4 (Barytes)
  'FLASH-INORG-0706': SALTS,     // Na2SiO3 (Water Glass)
  'FLASH-INORG-0707': PIGMENTS,  // Pb(OH)2·2PbCO3 (White Lead pigment)
  'FLASH-INORG-0708': SALTS,     // (CH3COO)2Pb (Sugar of Lead)
  'FLASH-INORG-0709': MINERALS,  // SnO2 (Tinstone)
  'FLASH-INORG-0710': SALTS,     // Na2O2 (Oxone)
  'FLASH-INORG-0711': ACIDS,     // H2S2O8 (Marshall's Acid)
  'FLASH-INORG-0712': ACIDS,     // H2S2O7 (Oleum)
  'FLASH-INORG-0713': GASES,     // COCl2 (Phosgene)
  'FLASH-INORG-0714': ORGANIC,   // C6H5NO2 (Oil of Mirbane)
  'FLASH-INORG-0715': ORGANIC,   // CH3OH (Wood Spirit)
  'FLASH-INORG-0716': PIGMENTS,  // BiOCl (Pearl White pigment)
  'FLASH-INORG-0717': MINERALS,  // ZnO (Philosopher's Wool)
  'FLASH-INORG-0718': MINERALS,  // ZnO (Zincite ore)
  'FLASH-INORG-0719': MINERALS,  // As2S3/As4S4 (Realgar)
  'FLASH-INORG-0720': PIGMENTS,  // Pb3O4 (Red Lead/Minium pigment)
  'FLASH-INORG-0721': SALTS,     // NaKC4H4O6 (Rochelle Salt)
  'FLASH-INORG-0722': PIGMENTS,  // SnS2 (Mosaic Gold pigment)
  'FLASH-INORG-0723': PIGMENTS,  // K3[Co(NO2)6] (Fischer's Salt — coordination)
  'FLASH-INORG-0724': SALTS,     // KHF2 (Fremy's Salt)
  'FLASH-INORG-0725': ACIDS,     // CaH2 (Hydrolith — metallic hydride, strong base)
  'FLASH-INORG-0726': MINERALS,  // AgCl (Horn Silver)
  'FLASH-INORG-0731': MIXTURES,  // C6H6Cl6 (Gammexane/BHC pesticide)
  'FLASH-INORG-0733': ORGANIC,   // Pb(C2H5)4 (TEL)
  'FLASH-INORG-0734': PIGMENTS,  // K2HgI4 (Nessler's Reagent)
  'FLASH-INORG-0735': SALTS,     // (CH3COO)3Al (Red Liquor)

  // — Reagents split: Hypo/Antichlor & Soda Lime move out
  'FLASH-INORG-0559': SALTS,     // Antichlor = Na2S2O3·5H2O
  'FLASH-INORG-0560': SALTS,     // Antichlor alt name (Hypo)
  'FLASH-INORG-0671': MIXTURES,  // Soda Lime (NaOH + CaO industrial mixture)

  // — Misc "Compounds" bucket redistributed
  'FLASH-INORG-0607': SALTS,     // Graham's Salt
  'FLASH-INORG-0661': PIGMENTS,  // Mosaic Gold
  'FLASH-INORG-0668': PIGMENTS,  // Scheele's Green
  'FLASH-INORG-0673': ACIDS,     // Sodamide (NaNH2 — strong base)

  // — Medical (carbogen = gas mixture; Seidlitz = salt)
  'FLASH-INORG-0584': GASES,     // Carbogen composition
  'FLASH-INORG-0585': GASES,     // Carbogen use
  'FLASH-INORG-0669': SALTS,     // Seidlitz Powder (NaHCO3 base)
};

// ───── LaTeX & whitespace cleanup ─────────────────────────────────────────
function cleanLatex(text) {
  if (typeof text !== 'string') return text;
  let out = text;
  // Strip zero-width chars (U+200B..U+200D, U+FEFF)
  out = out.replace(/[\u200B-\u200D\uFEFF]/g, '');
  // Convert display math $$...$$ to inline $...$
  //   - handles multiple occurrences per line
  //   - preserves the math body unchanged
  out = out.replace(/\$\$([^$]+?)\$\$/g, (_m, body) => `$${body.trim()}$`);
  // Collapse runs of spaces (but preserve newlines)
  out = out.replace(/[ \t]{2,}/g, ' ');
  // Trim trailing whitespace on each line
  out = out.split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n');
  return out;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  const cards = await coll.find({ 'chapter.id': CHAPTER_ID, deleted_at: null }).toArray();
  console.log(`Loaded ${cards.length} cards.`);

  const ops = [];
  const unmapped = new Set();
  const groupCounts = new Map();
  const latexChanges = [];

  for (const card of cards) {
    const oldTopic = card.topic?.name;
    const override = OVERRIDES[card.flashcard_id];
    const dest = override || DEFAULT_MAP[oldTopic];
    if (!dest) {
      unmapped.add(`${card.flashcard_id}  (${oldTopic})`);
      continue;
    }

    const cleanedQ = cleanLatex(card.question);
    const cleanedA = cleanLatex(card.answer);
    const qChanged = cleanedQ !== card.question;
    const aChanged = cleanedA !== card.answer;
    if (qChanged || aChanged) latexChanges.push(card.flashcard_id);

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

  console.log(`\nLaTeX/whitespace changes: ${latexChanges.length} cards`);
  console.log(`Topic-change or content-change ops: ${ops.length}`);

  if (unmapped.size) {
    console.log('\n⚠️  Unmapped:');
    for (const u of unmapped) console.log(`  · ${u}`);
  }

  console.log('\nNew topic breakdown:');
  const sorted = [...groupCounts.entries()].sort((a, b) => {
    const groups = [ACIDS, SALTS, MINERALS, GASES, PIGMENTS, MIXTURES, ORGANIC];
    const oa = groups.find(g => g.name === a[0])?.order ?? 99;
    const ob = groups.find(g => g.name === b[0])?.order ?? 99;
    return oa - ob;
  });
  for (const [name, count] of sorted) {
    console.log(`  ${name}  (${count})`);
  }

  if (APPLY && ops.length) {
    const res = await coll.bulkWrite(ops, { ordered: false });
    console.log(`\n✅ Applied. modified=${res.modifiedCount}`);
  } else if (!APPLY) {
    console.log('\n(dry run — pass --apply to write)');
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
