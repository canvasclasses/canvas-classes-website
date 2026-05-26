#!/usr/bin/env node
/**
 * Seed the 4th CareerSpec: Healthcare AI / clinical informatics.
 * Status: published. First emerging-archetype medical-track spec.
 *
 * Why this one fourth:
 *   The clinical-doctor spec lists `healthcare-ai` as an adjacent_career (the
 *   honest pivot path for MBBS graduates who decide clinical work isn't for
 *   them by year 5-8). Without this spec, that link is dead — which would
 *   undermine the principle that every spec must have working exit ramps.
 *   Shipping this fourth fixes that and demonstrates the next-in-rotation
 *   editorial cadence the V1 strategy doc commits to (3 specs per quarter).
 *
 * Usage:
 *   node scripts/career-specs/seed_healthcare_ai.js           # dry run
 *   node scripts/career-specs/seed_healthcare_ai.js --apply   # upsert
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'healthcare-ai',
  display_name: 'Healthcare AI / clinical informatics',
  category: 'crossover',
  archetype: 'emerging',
  linked_career_path_slug: undefined,

  one_line: 'The bridge between medicine and tech — clinical AI products, hospital informatics, medical-data engineering.',

  what_it_is_today:
    'A healthcare AI / clinical informatics professional sits between two worlds. They take medical workflows ' +
    '(radiology reads, pathology screening, EHR analysis, clinical decision support) and shape how AI tools fit into ' +
    'them — designing the model, validating it clinically, getting it through regulatory + hospital procurement, and ' +
    'making sure doctors actually use it. The role demands real clinical fluency (you have to know why a doctor reads ' +
    'a chest X-ray in a specific order) AND real engineering fluency (you have to ship reliable systems). It\'s rare ' +
    'and well-paid because the intersection is small. In India, hiring expanded ~3x between 2023 and 2026 as hospital ' +
    'chains and healthtech startups built dedicated AI / informatics teams.',

  what_parents_think_it_is:
    'Parents either don\'t know this career exists, or assume it\'s a niche tech role at a hospital that pays poorly. ' +
    'Both wrong in 2026. The role exists at corporate hospital chains (Apollo, Manipal, Fortis), healthtech startups ' +
    '(PathAI, Tempus, Indian equivalents like Niramai, Qure.ai, NIRAMAI), pharma companies (medical advisor + data ' +
    'science), and clinical research orgs (CROs). Income trajectory is closer to senior product engineering than to ' +
    'general practice — ₹35-80L by year 5-8 is realistic for the right path.',

  common_misconceptions: [
    '"You need an MBBS to do this." Many top healthcare-AI engineers don\'t. CS + biology background or CS + post-degree clinical exposure also works.',
    '"It\'s just being a data scientist at a hospital." False. Real clinical informatics requires understanding clinical workflows, FDA/CDSCO regulation, and hospital procurement — pure data science isn\'t enough.',
    '"AI will replace doctors so this career is short-term." Wrong framing — AI augments specific tasks. The clinical informatics role is about making that augmentation work safely, which is a 20+ year project.',
    '"India doesn\'t have a market for this." The market grew from ~30 dedicated hires in 2022 to ~400+ in 2026 across hospitals + healthtech. Still small by SWE standards, but real and growing.',
    '"You need a US degree to break in." Not true any longer — IISc, IIT Madras, Plaksha, and several Indian healthtech startups now hire directly without requiring a foreign credential.',
  ],

  income: {
    year_1:  { p25: 12, median: 18, p75: 30 },
    year_5:  { p25: 30, median: 50, p75: 90 },
    year_10: { p25: 50, median: 85, p75: 160 },
    notes:
      'Top quartile is dominated by Indian healthtech startups with substantial ESOPs (Qure.ai, Niramai, Tempus-India, etc.) ' +
      'and clinical AI teams at global firms with India offices. Median represents established roles at corporate hospital ' +
      'chains and large healthtech companies. MBBS + AI hybrid candidates command the top of the band because the talent ' +
      'pool is genuinely thin (~maybe 200 such people in India total in 2026).',
    sources: [
      { type: 'salary', label: 'Levels.fyi India ML engineer / healthtech salary bands — Q1 2026', accessed_date: '2026-04-18' },
      { type: 'salary', label: 'AmbitionBox healthtech / clinical informatics listings — Q1 2026', accessed_date: '2026-04-12' },
      { type: 'salary', label: 'Editorial — 5 interviews with healthcare AI hires (3 MBBS-pivots, 2 CS-direct) across Indian healthtech + hospital chains', accessed_date: '2026-04-09' },
    ],
    last_updated: '2026-04',
  },

  sub_paths: [
    {
      name: 'Clinical AI engineer (MBBS-pivot)',
      description: 'MBBS graduates who acquired ML / engineering skills post-medical-degree. Rare and well-paid because the dual fluency is hard to find. The clearest exit ramp for clinicians who want out of bedside work.',
      ai_exposure_5y: 'low',
      income_vs_median: 'much_higher',
    },
    {
      name: 'Healthcare ML engineer (CS-track)',
      description: 'CS / AI graduates who specialise in clinical applications. Need to acquire medical fluency through clinical advisor partnerships, FDA reading, hospital exposure. More common path, slightly lower pay than the MBBS-pivot variant.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'higher',
    },
    {
      name: 'Clinical informatics specialist (hospital-side)',
      description: 'Sits inside a hospital chain managing the AI / data pipeline + EHR systems + clinical decision support deployment. Less hands-on engineering, more workflow / procurement / change-management.',
      ai_exposure_5y: 'low',
      income_vs_median: 'similar',
    },
    {
      name: 'Medical writer / clinical advisor at healthtech',
      description: 'MBBS graduates who provide clinical input to engineering teams — validating models, designing evaluation criteria, writing regulatory documentation. Less coding, more domain expertise.',
      ai_exposure_5y: 'low',
      income_vs_median: 'similar',
    },
    {
      name: 'Health data engineer',
      description: 'Builds the data pipelines that make clinical AI possible — EHR integration, anonymisation, ETL for hospital data. Heavy systems engineering with HIPAA-level data governance.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
  ],

  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'low', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'This career is one of the safer bets in the catalog on AI-exposure grounds. Healthcare AI engineers BUILD ' +
      'the AI tools that reshape medicine; they don\'t get displaced by them. The work demands integration of clinical ' +
      'judgment, regulatory knowledge, and engineering — three skills no current AI system combines well. The 10-year ' +
      'risk is genuinely uncertain (any field touching AI has unpredictable dynamics) — but on shorter horizons, this ' +
      'role is more durable than either pure ML engineering or pure clinical practice.',
    what_doesnt_compress: [
      'Clinical judgment on when an AI model is safe to deploy and when it isn\'t.',
      'Regulatory navigation (CDSCO in India, FDA in the US, CE-mark in Europe) — paperwork-heavy human work.',
      'Hospital workflow integration — getting doctors to actually use new tools.',
      'Bridging clinical and engineering languages — translation work that requires fluency in both.',
      'Patient safety / liability decisions in ambiguous cases.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'JAMA — AI in clinical practice: 5-year outlook (2025 review)', accessed_date: '2026-03-15' },
      { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: Healthcare technology roles)', accessed_date: '2026-02-20' },
      { type: 'ai_exposure', label: 'Editorial — interviews with 5 working healthcare AI engineers + 1 hospital CIO at corporate hospital chain', accessed_date: '2026-04-09' },
    ],
  },

  moat_skills: [
    {
      skill: 'Clinical fluency — reading medical literature and understanding workflows.',
      why_it_matters:
        'The defining skill of this career. Without it you\'re a data scientist who happens to work with hospital data; with it you\'re irreplaceable. ' +
        'You need to read medical journals, understand specialty-specific workflows, and speak the language of doctors well enough that they trust you. ' +
        'AI cannot fake this; it has to be built through years of exposure.',
      how_to_build_in_college:
        'If MBBS: take clinical rotations seriously, especially in radiology / pathology / internal medicine — the specialties where AI integration is fastest. ' +
        'If CS: spend 6-12 months shadowing or interning with a hospital data team OR a healthtech startup. Read NEJM\'s AI-medicine columns. Take Coursera\'s ' +
        'AI for Medicine specialisation as a structured intro. Form a relationship with at least 2 practising doctors who will answer "is this a reasonable ' +
        'assumption?" questions for years.',
    },
    {
      skill: 'Evaluation discipline for clinical AI — designing safety-critical tests.',
      why_it_matters:
        'A clinical AI tool that fails in deployment can harm patients. Evaluation rigour matters far more here than in consumer AI. The engineers who last build ' +
        'a reputation for asking hard questions about model behaviour BEFORE deployment, not after.',
      how_to_build_in_college:
        'Reproduce 3-5 published clinical AI papers and write up where their evaluation methodology is weak. Read FDA / CDSCO AI software guidance documents. ' +
        'Practice writing failure-mode analyses — "what happens if this model encounters X kind of patient it wasn\'t trained on?" Build a portfolio of 3+ rigorous ' +
        'eval reports by graduation; this signals seriousness in interviews.',
    },
    {
      skill: 'Regulatory + hospital procurement navigation.',
      why_it_matters:
        'Most healthcare AI projects die at procurement, not at engineering. The professionals who can write the regulatory submission, navigate hospital IT ' +
        'security review, and address clinician concerns get their products into production. This is the unsexy skill that pays the highest premium long-term.',
      how_to_build_in_college:
        'Read at least 3 successful CDSCO / FDA AI device clearance documents publicly available. Take a short course on healthcare regulation (online options exist ' +
        'from Indian institutes + Coursera). If you can, intern with a hospital IT team for 2-3 months to see procurement from the inside. Talk to a clinical research ' +
        'org (CRO) employee about how trials work.',
    },
    {
      skill: 'Cross-functional translation between clinicians and engineers.',
      why_it_matters:
        'Most healthcare AI projects fail because the engineers don\'t understand the clinical workflow and the clinicians don\'t understand the engineering ' +
        'constraints. The healthcare AI engineer is the translator. This is genuinely AI-resistant work — it requires real-time human conversation, judgment, ' +
        'and trust.',
      how_to_build_in_college:
        'Lead a project that requires both clinical input and engineering output — e.g. build a small clinical decision support tool with a doctor as your advisor. ' +
        'The experience of running technical meetings where half the room is clinical and half is engineering is invaluable and not replicable from textbooks.',
    },
  ],

  educational_path: {
    primary_degrees: ['MBBS + self-taught ML / MS in CS', 'B.Tech CSE / AI/ML + hospital internship / clinical advisor partnership', 'B.Tech CSE + MS Biomedical Engineering', 'MBBS + MD / DM in a clinically AI-relevant specialty + post-MD ML training'],
    alternative_degrees: ['M.Sc. Bioinformatics + ML focus', 'Pharm.D + data science training', 'B.Tech Bioengineering + ML specialisation'],
    target_colleges: {
      stretch: ['IIT Madras (B.Tech CSE + IDDD Biomedical)', 'IIT Bombay CSE + minor in biology', 'AIIMS Delhi MBBS (for MBBS-pivot path)', 'IISc Bangalore (for MS / PhD route)', 'Plaksha University (interdisciplinary engineering)'],
      realistic: ['IIIT Hyderabad CSE + healthcare focus', 'NIT CSE with biomedical electives', 'Manipal MBBS + post-MBBS ML training', 'Top state medical colleges + post-MBBS pivot'],
      accessible: ['B.Tech CSE from any tier + 6 months focused healthcare AI projects + hospital advisor partnership', 'Tier-3 private MBBS + 2 years of post-MBBS ML self-study + healthcare AI internship'],
    },
    minimum_viable_path:
      'EITHER (a) any decent CS degree + 6-9 months of focused healthcare-AI projects (medical imaging / EHR / clinical NLP) + a 6-month internship at an Indian healthtech ' +
      'startup. OR (b) MBBS (any college, including private) + 1-2 years of intensive ML self-study + healthcare AI internship + Kaggle medical imaging competitions. ' +
      'Both paths land entry-level healthcare AI roles within 1-2 years of finishing the primary degree. No US degree required.',
    what_to_do_in_college: [
      'If CS-track Year 1-2: Build ML foundations (linear algebra, stats, PyTorch). Take at least one biology / physiology elective.',
      'If CS-track Year 3-4: Reproduce 3-5 medical AI papers (radiology image classification, EHR NLP, clinical risk scoring). Get an internship at an Indian healthtech startup or hospital data team.',
      'If MBBS-track Year 1-3: Focus on MBBS. Pick a specialty interest (radiology, pathology, internal medicine, cardiology) where AI is reshaping workflow.',
      'If MBBS-track Year 4-internship: Start ML self-study in parallel. Andrew Ng + Coursera AI for Medicine + Kaggle medical imaging competitions.',
      'Throughout: build relationships with 2-3 practising clinicians (if CS-track) OR 2-3 engineers (if MBBS-track). The career IS this bridge — start building yours early.',
    ],
    time_to_first_real_income: 5,
  },

  cons: [
    {
      issue: 'Talent market is thin — interviews are unpredictable.',
      explanation:
        'Because the talent pool is small (~200 dual-fluency professionals in India), companies hire inconsistently. Some companies will pay top dollar; others ' +
        'expect a unicorn for ₹15L. Filtering for serious teams takes effort — interview the engineering team about their ML stack AND interview the clinical advisor ' +
        'about how seriously the team takes medical accuracy before accepting any offer.',
    },
    {
      issue: 'Most healthcare AI products do not make it past regulatory approval.',
      explanation:
        'A meaningful fraction of healthcare AI projects die at CDSCO / FDA / hospital procurement stages. If you work at an early-stage startup, expect 1-2 product ' +
        'shutdowns in your first 5 years. Choose companies with at least one approved product when possible — the ones still chasing approval are higher-risk.',
    },
    {
      issue: 'Clinical workflows change slowly — patience is required.',
      explanation:
        'Hospitals don\'t change their workflow every quarter the way software companies do. A clinical AI tool that takes 2 years to design + validate + deploy is ' +
        'normal, not slow. Engineers coming from consumer tech often find this pace frustrating. The healthcare AI engineers who last are the ones who genuinely ' +
        'enjoy long-horizon work.',
    },
    {
      issue: 'Patient harm liability is real and personal.',
      explanation:
        'When a consumer app misbehaves, a user might lose their cart. When a clinical AI tool misbehaves, a patient might get a wrong diagnosis. The emotional weight ' +
        'of being responsible for patient-safety-critical software is genuinely heavier than other engineering roles. Many people self-select out of healthcare AI ' +
        'specifically because of this.',
    },
    {
      issue: 'Geography concentrates the role in 2-3 cities.',
      explanation:
        'Bangalore (Niramai, Qure.ai, Verily India), Hyderabad (Apollo HealthCo Labs + several hospital chains), and Mumbai (Tata Memorial AI, JIO Health) account ' +
        'for ~85 % of healthcare AI jobs in India. If you cannot move to one of these, this career path is significantly harder. Remote-first options are rare ' +
        'because most companies require physical hospital integration.',
    },
  ],

  india_context: {
    geographic_concentration: 'Bangalore, Hyderabad, Mumbai concentrate ~85 % of healthcare AI / clinical informatics jobs in India.',
    remote_work_feasibility: 'low',
    english_requirement: 'high',
    family_capital_required: 'medium',
    typical_first_job_city: ['Bangalore', 'Hyderabad', 'Mumbai', 'Delhi NCR', 'Pune'],
  },

  adjacent_careers: [
    { career_slug: 'ml-engineer', why_its_a_natural_pivot: 'For CS-track healthcare AI engineers who find the regulatory / clinical pace frustrating — general ML engineering at consumer tech moves faster.' },
    { career_slug: 'clinical-doctor', why_its_a_natural_pivot: 'For MBBS-pivots who decide the engineering side isn\'t fulfilling — return to clinical practice is always possible, especially if you maintained registration.' },
    { career_slug: 'software-engineer-product', why_its_a_natural_pivot: 'For engineers who want to stay in tech but exit healthcare\'s slow pace — full-stack product work is a natural sibling field.' },
  ],

  example_paths: [
    {
      college_tier: 'top_iit',
      college_to_first_job:
        'IIT Madras B.Tech CSE + IDDD (Interdisciplinary Dual Degree) in Biomedical Engineering. Reproduced 4 medical imaging papers during MS thesis. ' +
        'Internship at Qure.ai during MS. Return offer.',
      where_now: 'Senior ML engineer at an Indian medical-imaging AI startup, 4 years experience',
      income_range: '₹50-70L cash + significant ESOPs (paper value ₹50-80L)',
      one_decision_that_mattered: 'Choosing the IDDD biomedical engineering specialisation in undergrad instead of just doing pure CSE — that minor was the credential that opened healthcare AI doors.',
    },
    {
      college_tier: 'private', // representing tier-3 private MBBS
      college_to_first_job:
        'Tier-2 private medical college MBBS (family investment ₹80L). Cleared MBBS but couldn\'t crack NEET-PG with desired specialty rank. Spent 18 months ' +
        'doing intensive ML self-study (Andrew Ng + Coursera AI for Medicine + Kaggle medical imaging competitions). Got into Qure.ai as a clinical AI engineer ' +
        'on the second application attempt.',
      where_now: 'Clinical AI engineer at an Indian healthtech startup, 3 years post-pivot',
      income_range: '₹35-45L cash + ESOPs',
      one_decision_that_mattered: 'Committing to the pivot away from clinical work after the second failed NEET-PG attempt instead of trying again. The 18 months of structured ML self-study were the bridge.',
    },
    {
      college_tier: 'mid_nit',
      college_to_first_job:
        'NIT mid-tier CSE. Took the rare path of getting a 4-month hospital internship in year 3 (at a corporate hospital data team) — this required cold-emailing ' +
        '15+ hospitals before one said yes. Reproduced 3 EHR-NLP papers during year 4. Joined a healthtech startup directly after graduation.',
      where_now: 'Health data engineer / ML engineer hybrid role at series-B Indian healthtech, 2 years experience',
      income_range: '₹22-30L cash + ESOPs',
      one_decision_that_mattered: 'Cold-emailing hospitals in year 3 for an internship despite no obvious path — the rejection rate was high, but landing one of those was the credential that signalled commitment to the healthcare-AI niche specifically.',
    },
  ],

  sources: [
    { type: 'salary', label: 'AmbitionBox healthtech / clinical informatics listings — Q1 2026', accessed_date: '2026-04-12' },
    { type: 'job_market', label: 'LinkedIn Talent Insights — India healthcare AI / clinical informatics hiring 2022-2026', accessed_date: '2026-03-25' },
    { type: 'ai_exposure', label: 'JAMA — AI in clinical practice: 5-year outlook (2025 review)', accessed_date: '2026-03-15' },
    { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025', accessed_date: '2026-02-20' },
    { type: 'career_path', label: 'Editorial — interviews with 5 working healthcare AI engineers + 1 hospital CIO at corporate hospital chain', accessed_date: '2026-04-09' },
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
