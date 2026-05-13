// Generic Phase 2 insertion script for question ingestion.
//
// USAGE:
//   node scripts/insert_questions.js scripts/_phase1_buffer_<prefix>.js
//
// The buffer file must export `{ questions }` (Phase 1 array). It MAY also
// export `chapter_id` and `subject` to override auto-derivation. If those are
// omitted, this script derives them from the prefix in the first question's
// `display_id` (e.g. CURR-001 → ph12_current → physics).
//
// Replaces the legacy per-batch `insert_<chapter>_b<N>.js` template. Inserts
// the entire validated buffer in a single insertMany call. The Phase 1
// validator is the gate — run it first; this script does NOT re-validate.
//
// NEVER includes a cache-bust hook (the dev server's revalidate endpoint is
// flaky; cache invalidation is a manual call from the user).

require('dotenv').config({ path: '.env.local' });
const path = require('path');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// Canonical PREFIX → chapter_id map. Mirrors `CHAPTER_PREFIX_MAP` in
// app/api/v2/questions/route.ts. Single source of truth: taxonomyData_from_csv.ts.
const PREFIX_TO_CHAPTER = {
  // Chemistry (Class 11)
  ATOM: 'ch11_atom', BOND: 'ch11_bonding', CEQ: 'ch11_chem_eq', GOC: 'ch11_goc',
  HC: 'ch11_hydrocarbon', IEQ: 'ch11_ionic_eq', MOLE: 'ch11_mole', PB11: 'ch11_pblock',
  PERI: 'ch11_periodic', POC: 'ch11_prac_org', RDX: 'ch11_redox', THERMO: 'ch11_thermo',
  // Chemistry (Class 12)
  ALCO: 'ch12_alcohols', AMIN: 'ch12_amines', BIO: 'ch12_biomolecules',
  ALDO: 'ch12_carbonyl', CORD: 'ch12_coord', DNF: 'ch12_dblock', EC: 'ch12_electrochem',
  HALO: 'ch12_haloalkanes', CK: 'ch12_kinetics', PB12: 'ch12_pblock',
  SALT: 'ch12_salt', SOL: 'ch12_solutions',
  // Physics (Class 11)
  MIP: 'ph11_math_phy', UNIT: 'ph11_units', K1D: 'ph11_kinematics1d', K2D: 'ph11_kinematics2d',
  NLM: 'ph11_nlm', WEP: 'ph11_wep', COM: 'ph11_com_mom', ROT: 'ph11_rotation',
  GRAV: 'ph11_gravitation', SOLD: 'ph11_solids', FLUI: 'ph11_fluids',
  SHM: 'ph11_shm', WAVE: 'ph11_waves',
  THPR: 'ph11_thermal_props', TDYN: 'ph11_thermo', KTG: 'ph11_ktg',
  // Physics (Class 12)
  ELST: 'ph12_electrostatics', CAPC: 'ph12_capacitance', CURR: 'ph12_current',
  MAGM: 'ph12_mag_matter', MVCH: 'ph12_moving_charges',
  EMI: 'ph12_emi', ACUR: 'ph12_ac', ROPY: 'ph12_ray_optics',
  WVOP: 'ph12_wave_optics',
  DUAL: 'ph12_dual_nature', ATPH: 'ph12_atoms', NUCL: 'ph12_nuclei',
  EMW: 'ph12_em_waves', SEMI: 'ph12_semiconductors',
  COMM: 'ph12_communication', EXPP: 'ph12_exp_phy',
  // Mathematics
  BOMA: 'ma_basic_math', QUAD: 'ma_quadratic', CMPL: 'ma_complex',
  SQSR: 'ma_sequence', PMCM: 'ma_pnc', BNML: 'ma_binomial',
  MRES: 'ma_reasoning', STAT: 'ma_statistics', MTRX: 'ma_matrices',
  DTRM: 'ma_determinants', PROB: 'ma_probability', STRL: 'ma_sets_rel',
  FUNC: 'ma_functions', LIMS: 'ma_limits', CTDF: 'ma_continuity_diff',
  DIFF: 'ma_differentiation', AODV: 'ma_aod', ININ: 'ma_indef_int',
  DFIN: 'ma_def_int', AUC: 'ma_auc', DFEQ: 'ma_diff_eq',
  STLN: 'ma_straight_lines', CRCL: 'ma_circle', PRBL: 'ma_parabola',
  ELPS: 'ma_ellipse', HYPB: 'ma_hyperbola', TRRI: 'ma_trig_ratios',
  TREQ: 'ma_trig_eq', ITF: 'ma_itf', HTDT: 'ma_height_dist',
  PRTR: 'ma_triangle_prop', VCAL: 'ma_vector_algebra', TDGM: 'ma_3d_geom',
};

function chapterToSubject(chapter_id) {
  if (chapter_id.startsWith('ch')) return 'chemistry';
  if (chapter_id.startsWith('ph')) return 'physics';
  if (chapter_id.startsWith('ma')) return 'maths';
  if (chapter_id.startsWith('bio')) return 'biology';
  return null;
}

(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/insert_questions.js <buffer-path>');
    console.error('Example: node scripts/insert_questions.js scripts/_phase1_buffer_curr.js');
    process.exit(2);
  }

  const bufferPath = path.resolve(arg);
  let mod;
  try { mod = require(bufferPath); }
  catch (e) { console.error(`Failed to load ${bufferPath}: ${e.message}`); process.exit(2); }

  const questions = mod.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    console.error(`${bufferPath} must export { questions: [...] }`); process.exit(2);
  }

  // Derive chapter_id and subject (buffer override > prefix lookup).
  const firstId = questions[0].display_id || '';
  const m = firstId.match(/^([A-Z0-9]+)-\d+$/);
  if (!m) { console.error(`First question display_id "${firstId}" doesn't match PREFIX-NNN`); process.exit(2); }
  const PREFIX = m[1];

  const CHAPTER_ID = mod.chapter_id || PREFIX_TO_CHAPTER[PREFIX];
  if (!CHAPTER_ID) { console.error(`Unknown prefix "${PREFIX}" — add it to PREFIX_TO_CHAPTER or export chapter_id from buffer`); process.exit(2); }

  const SUBJECT = mod.subject || chapterToSubject(CHAPTER_ID);
  if (!SUBJECT) { console.error(`Cannot derive subject from chapter_id "${CHAPTER_ID}"`); process.exit(2); }

  // Sanity: every question's prefix and tag_id chapter must align.
  const wrongPrefix = questions.filter(q => !q.display_id?.startsWith(PREFIX + '-'));
  if (wrongPrefix.length) {
    console.error(`Mixed prefixes in batch — first is ${PREFIX} but found:`, wrongPrefix.slice(0, 3).map(q => q.display_id));
    process.exit(2);
  }

  console.log(`Inserting ${questions.length} questions into ${CHAPTER_ID} (${SUBJECT}, prefix ${PREFIX})`);

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  // Pre-flight: collision check across the entire batch.
  const ids = questions.map(q => q.display_id);
  const existing = await col.find({ display_id: { $in: ids } }).project({ display_id: 1 }).toArray();
  if (existing.length) {
    console.error(`Aborting — ${existing.length} display_id collision(s):`, existing.map(e => e.display_id).slice(0, 10));
    await client.close(); process.exit(1);
  }

  const now = new Date();
  const docs = questions.map(q => ({
    _id: uuidv4(),
    display_id: q.display_id,
    question_text: { markdown: q.question_text.markdown, latex_validated: false },
    type: q.type,
    options: (q.options || []).map(o => ({ id: o.id, text: o.text, is_correct: o.is_correct, asset_ids: [] })),
    answer: q.answer || {},
    solution: q.solution?.text_markdown
      ? { text_markdown: q.solution.text_markdown, latex_validated: false }
      : { text_markdown: '', latex_validated: false },
    metadata: {
      difficultyLevel: q.difficultyLevel,
      chapter_id: CHAPTER_ID,
      subject: SUBJECT,
      tags: [{ tag_id: q.tag_id, weight: 1 }],
      questionNature: q.questionNature,
      applicableExams: q.applicableExams,
      sourceType: q.sourceType,
      examDetails: q.examDetails || null,
      isMultiConcept: false,
      is_top_pyq: false,
      microConcept: null,
      source_reference: { type: 'image', verified_against_source: true, verification_date: now, verified_by: 'ai_agent' },
    },
    status: 'published',
    quality_score: 95,
    needs_review: false,
    version: 1,
    flags: [],
    asset_ids: [],
    created_at: now,
    created_by: 'ai_agent',
    updated_at: now,
    updated_by: 'ai_agent',
    deleted_at: null,
  }));

  const result = await col.insertMany(docs, { ordered: true });
  console.log(`✅ Inserted ${result.insertedCount} of ${docs.length}`);

  const verified = await col.countDocuments({ display_id: { $in: ids } });
  console.log(`✅ Verified in DB: ${verified}/${ids.length}`);

  // Quick chapter audit.
  const total = await col.countDocuments({ 'metadata.chapter_id': CHAPTER_ID });
  console.log(`📊 Chapter ${CHAPTER_ID} now has ${total} question(s) total`);

  await client.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
