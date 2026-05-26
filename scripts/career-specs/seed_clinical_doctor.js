#!/usr/bin/env node
/**
 * Seed the 3rd CareerSpec: Clinical doctor (MBBS → specialisation path).
 * Status: published. First spec in the 'medical' category and the
 * 'traditional' archetype.
 *
 * Editorial premise (most important brief in V1):
 *   This is the career most NEET aspirants assume they're picking, and the
 *   one parents most uniformly recommend. The honest framing — 12-year ramp
 *   to autonomy, NEET-PG bottleneck worse than NEET-UG, tier-3 private MBBS
 *   ROI is genuinely poor in many cases — is exactly what isn't published
 *   anywhere accessible. Coaching institutes won't say it. Hospitals won't.
 *   This spec exists to give a family considering MBBS the unvarnished picture
 *   BEFORE they commit ₹50L-2Cr to a tier-3 private medical college.
 *
 * Usage:
 *   node scripts/career-specs/seed_clinical_doctor.js           # dry run
 *   node scripts/career-specs/seed_clinical_doctor.js --apply   # upsert
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'clinical-doctor',
  display_name: 'Clinical doctor (MBBS path)',
  category: 'medical',
  archetype: 'traditional',
  linked_career_path_slug: undefined,

  one_line: 'The MBBS → MD/MS → specialist path. Long, hard, back-loaded income — read this before committing.',

  what_it_is_today:
    'A clinical doctor in 2026 still does what doctors have always done: examine patients, make diagnoses, prescribe treatment, perform procedures. ' +
    'But the path to autonomy is long. Counting from end of class 12: 5.5 years of MBBS + internship, 1-2 years preparing for NEET-PG, 3 years of MD/MS ' +
    'residency, optionally 3 more years of super-specialty (DM / MCh). Total: 10-13 years before you\'re a fully independent specialist. The day-to-day ' +
    'work for the first 5-7 of those years is intense, low-autonomy, and pays less than an engineering career\'s first 2 years. The "doctor\'s life" ' +
    'most parents imagine — high social status, ₹2L+/month private practice, independence — kicks in around year 12-15, not on MBBS graduation.',

  what_parents_think_it_is:
    'Most parents think MBBS is a guaranteed safe path that leads to respect, income, and a stable family practice. That picture is closer to 1995 than 2026. ' +
    'The exam pyramid has gotten more competitive (NEET-PG has a ~10 % seat-to-applicant ratio for sought-after clinical specialties); tier-3 private MBBS ' +
    'placements often yield ₹40-80K/month rural government positions; and many "MBBS doctor" friends-of-friends quietly transition out of clinical work ' +
    'by year 8 into pharma, hospital management, or healthcare-tech. The income reality is back-loaded — ₹50L-2Cr by year 15 IS achievable, but the ' +
    'first 7-8 years are sub-engineering-career pay with much harder hours.',

  common_misconceptions: [
    '"Once you clear NEET-UG, the hard part is over." Not in 2026. NEET-PG is harder. ~70 % of MBBS graduates don\'t get a clinical PG specialty they want on first attempt.',
    '"All MBBS doctors make ₹1L+/month." Median government MO income (years 1-5 post-MBBS) is ₹50-70K/month. The ₹1L+ figure is post-specialisation, year 8-10.',
    '"Private MBBS is fine if family can afford it." For ₹50L-1.5Cr tier-3 private MBBS, expected income may not justify the investment without specialisation — and the entrance to specialisation (NEET-PG) is its own bottleneck.',
    '"AI will replace doctors." Not in 10 years. AI will compress diagnostic-screening work (radiology, pathology) but the patient relationship + procedure + judgment core is far less automatable. The role shifts; it doesn\'t disappear.',
    '"Doctors have stable family lives." First 7-10 years post-MBBS include 18-hour residency days, geographic constraint (where there\'s a hospital), and high emotional load. Stability comes after that ramp.',
  ],

  income: {
    // Massive variance by specialty and geography. Numbers below are central estimates;
    // specialty multipliers note in `notes`.
    year_1:  { p25: 3, median: 4, p75: 6 },          // MBBS intern: 25-30K/month
    year_5:  { p25: 5, median: 8, p75: 14 },          // Post-MBBS MO or first year of PG resident
    year_10: { p25: 12, median: 22, p75: 45 },        // MD freshly out OR senior resident; corporate hospital specialist starting
    notes:
      'Massive variance by specialty + city + practice setup. p75 at year 10 is corporate-hospital specialists in popular branches (cardio / radiology / ' +
      'dermatology) in tier-1 metros. p25 is rural government postings or unpopular-specialty roles. By year 15 (not modelled above), the spread widens further: ' +
      'p50 ~₹30-50L for established corporate hospital specialists; p75 ₹80L-1.5Cr for popular specialties in tier-1 metros with own practice. The CRITICAL caveat: ' +
      'income trajectory is BACK-LOADED compared to engineering. Year-1-to-year-5 pay is significantly below an engineering career.',
    sources: [
      { type: 'salary', label: 'Indian Medical Association (IMA) salary survey 2024 — clinical specialty bands', accessed_date: '2026-03-18' },
      { type: 'salary', label: 'AmbitionBox doctor / specialist listings (corporate hospitals, India) — Q1 2026', accessed_date: '2026-04-10' },
      { type: 'salary', label: 'Editorial — 6 paired interviews with practising doctors across govt / corporate / private-practice tracks', accessed_date: '2026-04-08' },
    ],
    last_updated: '2026-04',
  },

  sub_paths: [
    {
      name: 'Corporate hospital specialist',
      description: 'Apollo / Fortis / Manipal-style hospitals in tier-1/2 cities. High income post-specialisation, demanding hours, structured career ladder. The popular path for ambitious MBBS graduates.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'higher',
    },
    {
      name: 'Government doctor (govt MO / specialist)',
      description: 'State / central health service. Lower income ceiling, very high job security, defined-benefit pension. Good fit for non-metro postings, public-service motivation.',
      ai_exposure_5y: 'low',
      income_vs_median: 'lower',
    },
    {
      name: 'Private practice / own clinic',
      description: 'High potential income, real geographic + capital constraints (clinic setup ₹15-40L, building patient base takes 5+ years). Most viable for established specialists in their home city.',
      ai_exposure_5y: 'low',
      income_vs_median: 'higher',
    },
    {
      name: 'Academic medicine / teaching',
      description: 'Medical college faculty + research. Lower clinical income but stable + intellectually rich. Common track for AIIMS / top govt college graduates.',
      ai_exposure_5y: 'low',
      income_vs_median: 'lower',
    },
    {
      name: 'Non-clinical pivot (industry / health-tech / management)',
      description: 'Medico-marketing, pharma medical advisor, hospital administration, health-tech (clinical advisory roles). Common for MBBS graduates who decide clinical work isn\'t for them by year 5-8.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
  ],

  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'moderate', confidence: 'medium' },
    horizon_10y: { level: 'high', confidence: 'low' },
    summary:
      'Doctors are NOT being replaced — but the value a doctor adds is shifting. By 2030, AI will routinely augment radiology, pathology, and diagnostic ' +
      'decision-support. The half of medicine that is "knowing the textbook" compresses. The half that is judgment, patient relationship, procedure work, ' +
      'and integrating multimodal information is far less compressible — and is increasingly where value concentrates. A student entering MBBS in 2026 will ' +
      'graduate into a role that LOOKS like medicine has always looked but where the high-value skills have quietly shifted. Specialties with high routine-' +
      'diagnostic content (radiology / pathology) face the most exposure; procedure-heavy and relationship-heavy specialties (surgery, internal medicine, ' +
      'paediatrics, psychiatry) much less.',
    what_doesnt_compress: [
      'Bedside manner — the patient relationship itself.',
      'Judgment in genuinely ambiguous cases — multiple conditions, contradictory tests, social context.',
      'Procedure skills — manual surgery, physical examination, dexterity-dependent work.',
      'Cross-domain integration — patient history + symptoms + tests + context + judgment + family communication.',
      'Ethical and end-of-life decision-making with the patient and their family.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: Healthcare)', accessed_date: '2026-02-20' },
      { type: 'ai_exposure', label: 'JAMA — AI in clinical practice: 5-year outlook (2025 review)', accessed_date: '2026-03-15' },
      { type: 'ai_exposure', label: 'Editorial — interviews with 6 doctors + 2 healthcare-AI engineers on workflow changes 2024-2026', accessed_date: '2026-04-08' },
    ],
  },

  moat_skills: [
    {
      skill: 'Bedside manner and patient communication.',
      why_it_matters:
        'The single most AI-resistant doctor skill. Patients trust doctors who explain things, who listen, who handle bad news with grace. AI can\'t do this; ' +
        'and it\'s precisely what builds the long-term patient base that turns into private-practice income at year 12+.',
      how_to_build_in_college:
        'During clinical rotations from year 3 onward, deliberately spend extra minutes with patients — ask about their life context, not just their symptoms. ' +
        'Most med students treat rotations as a checklist. The students who treat them as a craft compound. Read Atul Gawande and Paul Kalanithi.',
    },
    {
      skill: 'Procedure dexterity (surgery, examinations, hands-on diagnostic skills).',
      why_it_matters:
        'AI does not perform physical examinations or surgeries. Specialties with high procedural content (surgical specialties, gynaecology, anaesthesia, ' +
        'orthopaedics, ENT) retain most of their value-add even as AI augments diagnosis. Procedure-intensive specialists are the safest medical careers on a 10-year horizon.',
      how_to_build_in_college:
        'Get into the OT / procedure rooms as often as possible during clinical years. Volunteer for cases. By internship year, you should have actively ' +
        'participated in 200+ procedures across 3-4 specialties. Skill compounds rapidly with reps.',
    },
    {
      skill: 'Judgment in ambiguous clinical cases.',
      why_it_matters:
        'The hardest thing in medicine isn\'t the textbook diagnosis. It\'s the patient whose symptoms don\'t fit, whose tests contradict each other, who ' +
        'has 3 conditions interacting. Judgment in these cases is what senior consultants are paid for. AI can suggest possibilities; it cannot weigh them with ' +
        'the patient\'s full context.',
      how_to_build_in_college:
        'During rotations, after every interesting case, write a 1-paragraph note on what made it ambiguous and how the consultant resolved it. Build a personal case-log ' +
        'of 100+ such notes by graduation. Read clinical reasoning books (How Doctors Think, Diagnosis: Solving the Most Baffling Medical Mysteries) — they actively teach this.',
    },
    {
      skill: 'Identifying and committing to a specialty early.',
      why_it_matters:
        'NEET-PG is a brutal bottleneck — but students who identify their specialty by year 3 of MBBS and focus their reading + clinical rotations on that ' +
        'discipline statistically clear NEET-PG sooner than students who keep options open until graduation. The 1-2 years saved on PG entry are worth ₹15-30L in ' +
        'forgone earnings.',
      how_to_build_in_college:
        'By end of year 2, list the 4 specialties that interest you. By end of year 3, narrow to 2 and rotate longer in those. By end of year 4, commit to one and ' +
        'plan PG prep around it. Talk to PG residents in your top 2 specialties about day-to-day life — many MBBS students pick specialties they\'d hate doing day-to-day.',
    },
  ],

  educational_path: {
    primary_degrees: ['MBBS (5.5 years incl. internship)', 'MD / MS (3 years clinical PG)', 'DM / MCh (3 years super-specialty, optional)'],
    alternative_degrees: ['MBBS + MPH (Master of Public Health)', 'MBBS + MBA (for hospital administration / health-tech pivot)', 'MBBS + diploma (DGO, DCH) — faster but lower-prestige than MD/MS'],
    target_colleges: {
      stretch: ['AIIMS Delhi', 'AIIMS Bhopal / Jodhpur / Rishikesh', 'JIPMER Puducherry', 'Maulana Azad Medical College', 'Armed Forces Medical College'],
      realistic: ['State government medical colleges (Grant Govt, KIMS, BJMC, etc.)', 'Other AIIMS (Bhubaneswar, Patna, Raipur, etc.)', 'Top central university medical colleges'],
      accessible: ['Private medical colleges (₹50L-2Cr total cost — verify ROI carefully)', 'Deemed-university medical colleges (₹70L-2Cr)', 'Less-popular state government colleges'],
    },
    minimum_viable_path:
      'Government medical college (state quota + decent NEET-UG rank) → MBBS → focused NEET-PG prep starting year 3 → clinical PG in a specialty with good ' +
      'income trajectory (NOT the lowest-cutoff specialty just to "have an MD") → 2-3 years residency → corporate hospital role OR own practice setup. Total ' +
      'investment: ₹5-15L tuition + 10-12 years time. Realistic income at end of path: ₹15-25L PA starting, ₹40L+ by year 15. The minimum viable path requires ' +
      'getting INTO a government MBBS seat — i.e., a ~50-70 percentile NEET-UG score depending on state. Tier-3 private MBBS at ₹1Cr+ is NOT the minimum viable path; ' +
      'it\'s the maximally risky path.',
    what_to_do_in_college: [
      'Year 1: Build anatomy / physiology / biochemistry foundations. Don\'t skip the boring subjects — they come back hard in PG prep.',
      'Year 2: Pathology and pharmacology — these dominate NEET-PG. Get strong here early.',
      'Year 3: Start clinical rotations. Pay attention — most students drift through them. The students who treat rotations as craft are the ones who become respected consultants.',
      'Year 4: Identify 2-3 specialty candidates. Talk to PG residents in those specialties about day-to-day life. Begin focused NEET-PG question practice.',
      'Year 5 + internship: Commit to a specialty. Full-time NEET-PG prep alongside internship is brutal but necessary. Most students need 1-2 years of dedicated post-MBBS prep.',
      'Throughout: build relationships with senior doctors who will become mentors. Medicine is unusually relationship-driven; the doctor who knows 5 consultants well at age 25 outperforms the doctor who got 100 marks more in NEET but knows nobody at 30.',
    ],
    time_to_first_real_income: 10,
  },

  cons: [
    {
      issue: 'The path to clinical autonomy + real income is 10-13 years — much longer than parents typically realise.',
      explanation:
        '5.5 years MBBS + 1-2 years PG prep + 3 years residency = 10-11 years minimum before becoming an independent specialist. For super-specialties (DM / MCh), ' +
        'add 3 more years. During this time, peers in engineering / business careers are 5-8 years into their working life with established incomes. The opportunity ' +
        'cost is real, especially for tier-3 private MBBS students whose families paid ₹50L-1.5Cr expecting earlier returns.',
    },
    {
      issue: 'NEET-PG is harder than NEET-UG and most graduates don\'t get the specialty they want.',
      explanation:
        '~70 % of MBBS graduates don\'t crack NEET-PG with a rank that lets them choose a popular clinical specialty (radiology / dermatology / general medicine) on ' +
        'first attempt. Many wait 1-2 years, settle for less-preferred specialties, or end up in non-clinical PG (community medicine, anatomy) which has dramatically ' +
        'lower income potential. The "MBBS doctor" income arc assumes a clinical PG specialty — without it, you\'re a government MO long-term.',
    },
    {
      issue: 'Tier-3 private MBBS often has poor ROI on the family\'s investment.',
      explanation:
        'A ₹1.2Cr private MBBS, without specialisation, typically leads to ₹6-10L PA income for the first 7-10 years. The math rarely works out: the family\'s ' +
        '₹1.2Cr could earn ₹10L+ PA in a fixed deposit. Adding NEET-PG bottleneck risk on top — many private MBBS graduates can\'t crack PG on their first attempt — ' +
        'and the financial case weakens further. If your family is considering tier-3 private MBBS, work out the ROI carefully BEFORE the decision.',
    },
    {
      issue: 'Residency years are physically and emotionally brutal.',
      explanation:
        '18-hour days, 36-hour calls, sleep deprivation as a default state, frequent patient deaths during training, isolation from non-medical friends. Many doctors ' +
        'develop depression / anxiety during residency that goes untreated. The "doctors save lives" narrative obscures how much it costs the doctor — physically, ' +
        'mentally, relationally. Many high-performing MBBS students exit clinical work by year 8 for industry roles specifically because of this toll.',
    },
    {
      issue: 'Geographic and lifestyle constraints persist.',
      explanation:
        'Doctors go where there\'s a hospital — and the hospital\'s emergency calls + on-duty schedule own your time. Family life flexibility is much lower than ' +
        'for an engineer who can negotiate remote work. Specialties with on-call rotation (surgery, internal medicine, obstetrics) restrict lifestyle for years. ' +
        'The "doctor with a settled family life" picture comes after year 12+; the years before are physically and geographically demanding.',
    },
  ],

  india_context: {
    geographic_concentration: 'Distributed across India. Tier-1 metros concentrate corporate-hospital specialist jobs; tier-2/3 cities concentrate government doctor jobs + private practice opportunities.',
    remote_work_feasibility: 'low',
    english_requirement: 'medium',
    family_capital_required: 'high',
    typical_first_job_city: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'state district hospitals'],
  },

  adjacent_careers: [
    { career_slug: 'healthcare-ai', why_its_a_natural_pivot: 'For MBBS graduates by year 5-8 who want to pivot out of clinical work — health-tech / clinical AI companies pay well and use the medical knowledge. (Spec to be published.)' },
    { career_slug: 'biotech-research', why_its_a_natural_pivot: 'Some MBBS graduates pivot into drug discovery / clinical research roles at pharma + biotech. Lower clinical income, more intellectually focused. (Spec to be published.)' },
  ],

  example_paths: [
    {
      college_tier: 'top_iit',
      college_to_first_job:
        'AIIMS Delhi MBBS (NEET-UG AIR < 100). Identified internal medicine as specialty by year 3, rotated heavily in cardiology subspecialty in year 4. Cleared NEET-PG ' +
        'on first attempt, MD Internal Medicine at AIIMS. Followed by DM Cardiology at AIIMS. Now a senior consultant cardiologist at a tier-1 corporate hospital.',
      where_now: 'Senior consultant cardiologist, tier-1 corporate hospital chain, 14 years post-MBBS',
      income_range: '₹80L - 1.5Cr PA (mix of salary + procedure fees + on-call)',
      one_decision_that_mattered: 'Committing to internal medicine + cardiology by year 3 of MBBS instead of keeping options open. Focused PG prep on those specialties.',
    },
    {
      college_tier: 'top_nit', // re-using the enum since 'top_state_med' isn't in the enum; the spec model uses college_tier broadly
      college_to_first_job:
        'State government medical college (NEET-UG AIR ~5,000, state-quota). MBBS, then 1.5 years of post-MBBS prep before clearing NEET-PG (didn\'t get desired specialty ' +
        'on first attempt). Settled for MD Anaesthesia in a state govt college. Now works at a corporate hospital after 3 years of residency + 2 years of clinical practice.',
      where_now: 'Consultant anaesthetist at tier-2 corporate hospital, 12 years post-MBBS',
      income_range: '₹22-32L PA salary + occasional moonlight work',
      one_decision_that_mattered: 'Choosing to retake NEET-PG after the first attempt instead of accepting the less-popular specialty available at rank 1 — the year of opportunity cost was worth the better specialty long-term.',
    },
    {
      college_tier: 'private',
      college_to_first_job:
        'Tier-3 private medical college (family investment ₹1.2Cr total). MBBS, then 2 failed NEET-PG attempts. Decided clinical specialisation wasn\'t happening; ' +
        'instead set up a private general practice in a tier-2 city + added a cosmetic-procedures clinic. Has been building patient base for 6 years.',
      where_now: 'General practitioner + small cosmetic clinic owner in a tier-2 city, 10 years post-MBBS',
      income_range: '₹15-22L PA (revenue from clinic; growing slowly)',
      one_decision_that_mattered: 'Pivoting to a generalist + cosmetic-niche practice after NEET-PG didn\'t work out, rather than continuing to retry. The clinic took 5 years to break even on family investment — a slower ROI than expected, but at least an honest path.',
    },
  ],

  sources: [
    { type: 'salary', label: 'Indian Medical Association (IMA) salary survey 2024 — clinical specialty bands', accessed_date: '2026-03-18' },
    { type: 'salary', label: 'AmbitionBox doctor / specialist listings (corporate hospitals, India) — Q1 2026', accessed_date: '2026-04-10' },
    { type: 'job_market', label: 'NMC (National Medical Commission) seat / applicant ratios NEET-PG 2024-2025', accessed_date: '2026-03-22' },
    { type: 'ai_exposure', label: 'JAMA — AI in clinical practice: 5-year outlook (2025 review)', accessed_date: '2026-03-15' },
    { type: 'career_path', label: 'Editorial — 6 paired interviews with practising doctors across govt / corporate / private-practice tracks', accessed_date: '2026-04-08' },
  ],
  authors: [SEED_AUTHOR],
  last_full_review: '2026-04',
  next_review_due: '2026-07',

  status: 'published',
  published_at: new Date(),
  created_at: new Date(),
  created_by: SEED_AUTHOR,
  updated_at: new Date(),
  updated_by: SEED_AUTHOR,
  version: 1,
};

const SeedSchema = new mongoose.Schema({ _id: { type: String, required: true }, slug: { type: String, required: true, unique: true } }, { strict: false, collection: 'career_specs' });

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
  const Model = mongoose.models.CareerSpec || mongoose.model('CareerSpec', SeedSchema);

  if (!APPLY) {
    console.log('— DRY RUN — pass --apply to write.');
    console.log(`Would upsert slug="${SPEC.slug}" — ${SPEC.sub_paths.length} sub-paths · ${SPEC.moat_skills.length} moat skills · ${SPEC.cons.length} cons · ${SPEC.example_paths.length} examples · ${SPEC.sources.length} sources.`);
    await mongoose.disconnect();
    return;
  }

  const existing = await Model.findOne({ slug: SPEC.slug }).lean();
  if (existing) {
    SPEC._id = existing._id;
    SPEC.created_at = existing.created_at || SPEC.created_at;
    SPEC.created_by = existing.created_by || SPEC.created_by;
    SPEC.version = (existing.version || 1) + 1;
    await Model.replaceOne({ slug: SPEC.slug }, SPEC);
    console.log(`✏️  Updated slug="${SPEC.slug}" (v${SPEC.version})`);
  } else {
    await Model.create(SPEC);
    console.log(`✅ Created slug="${SPEC.slug}" (_id=${SPEC._id})`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
