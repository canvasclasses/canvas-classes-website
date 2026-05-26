#!/usr/bin/env node
/**
 * Seed: Biotech / drug discovery research.
 * Status: published. medical / emerging.
 * Fixes the dead clinical-doctor → biotech-research adjacent_career link.
 * Adds non-MBBS NEET pathway coverage + B.Tech Biotechnology branch.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'biotech-research',
  display_name: 'Biotech / drug discovery research',
  category: 'medical',
  archetype: 'emerging',
  linked_career_path_slug: undefined,
  one_line: 'Drug discovery, computational biology, and biotech R&D — the NEET path that doesn\'t involve clinical practice.',
  what_it_is_today:
    'A biotech / drug discovery researcher works on understanding biological systems + designing therapeutics + advancing biomedical knowledge. ' +
    'The work splits across wet-lab research (running experiments at the bench), computational biology + bioinformatics (analysing genomic / ' +
    'protein data), clinical trial design (CROs + pharma R&D), and increasingly AI-augmented drug discovery (using ML for protein structure ' +
    'prediction, drug-target interactions, molecular property prediction). India\'s biotech scene grew significantly between 2020 and 2026 — ' +
    'driven by COVID-era investment + the rise of AI-in-biology + pharma R&D shifting some discovery work to lower-cost geographies. The ' +
    'major employers in 2026: pharma R&D (Dr. Reddy\'s, Sun Pharma, Cipla, Biocon), biotech startups (Strand Life Sciences, Mapmygenome, ' +
    'PathAI India, several IIT/IISc-incubated drug discovery startups), CROs (Syngene, Aragen, GVK Bio), and global pharma India captives ' +
    '(Pfizer, Novartis, Merck India centres).',
  what_parents_think_it_is:
    'Parents who know about biotech typically think it means working at a pharma factory making generic medicines (the IPCA / Cipla shop ' +
    'floor career) or doing a low-pay lab job. Both miss what modern biotech research actually is. The well-paid biotech research roles are ' +
    'in computational biology + AI-augmented drug discovery + early-stage R&D at funded biotech startups — comparable to tech careers in ' +
    'compensation, with the trade-off of longer ramp + PhD often required.',
  common_misconceptions: [
    '"Biotech = working at a pharma factory making medicines." That\'s pharma manufacturing — a different career. Biotech research is upstream of that.',
    '"You need NEET / MBBS to do biotech." False. Most biotech researchers are B.Tech Biotechnology + MS/PhD, or BSc + MSc + PhD biology, not MBBS.',
    '"It pays terribly." Entry pay is below tech, true. But computational biology + drug discovery roles at funded biotech startups + global pharma India captives can match SWE-product by year 5-7.',
    '"India biotech is too small to make a real career." Strand, Mapmygenome, Aragen, Syngene + multiple incubated startups + pharma India captives collectively employ 30,000+ research scientists in 2026. Not huge, but real.',
    '"AI will replace drug discovery scientists." AI is augmenting drug discovery, not replacing it. Wet-lab experimental validation is still required + the AI tools are themselves built by people with biology + ML backgrounds.',
  ],
  income: {
    year_1:  { p25: 4,  median: 6,  p75: 10 },
    year_5:  { p25: 12, median: 20, p75: 35 },
    year_10: { p25: 25, median: 40, p75: 80 },
    notes:
      'Income is meaningfully lower than tech, especially in years 1-5. Wet-lab research roles + government / CSIR positions sit at p25. Computational ' +
      'biology + drug discovery at funded biotech startups + pharma India captives reach p75. Significant variance — a PhD + 5 years at a top biotech ' +
      'startup with ESOPs can equal SWE-product pay; a generic B.Tech Biotech without postgrad maxes at sub-tech levels.',
    sources: [
      { type: 'salary', label: 'AmbitionBox biotech / pharma research listings — Q1 2026', accessed_date: '2026-04-12' },
      { type: 'salary', label: 'Editorial — interviews with 4 biotech researchers across Strand / Syngene / a drug discovery startup / a pharma captive', accessed_date: '2026-04-08' },
    ],
    last_updated: '2026-04',
  },
  sub_paths: [
    { name: 'Computational biologist / bioinformatician', description: 'Analyses genomic + proteomic + sequencing data + builds biological databases. Python / R heavy. Highest-paid sub-path because of CS + biology hybrid scarcity.', ai_exposure_5y: 'moderate', income_vs_median: 'much_higher' },
    { name: 'Drug discovery scientist', description: 'Designs + tests new therapeutic molecules. Wet-lab + computational hybrid. Common at biotech startups + pharma R&D.', ai_exposure_5y: 'low', income_vs_median: 'higher' },
    { name: 'AI-augmented drug discovery researcher', description: 'Uses ML for protein structure (AlphaFold-style work) + drug-target interaction + molecular property prediction. Newest sub-path, growing fast.', ai_exposure_5y: 'low', income_vs_median: 'much_higher' },
    { name: 'Clinical research scientist (CRO / pharma)', description: 'Designs + runs clinical trials. Heavy regulatory work. Common at CROs (Syngene, Aragen) + pharma R&D. Stable but somewhat lower-ceiling.', ai_exposure_5y: 'moderate', income_vs_median: 'similar' },
    { name: 'Academic research scientist (CSIR / IISc / IIT labs)', description: 'PhD-track research at government / academic labs. Lower pay, more autonomy, deeper science. Good fit for people who chose research over industry.', ai_exposure_5y: 'low', income_vs_median: 'lower' },
  ],
  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'low', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'Biotech research is among the more AI-resistant careers because biological experimentation has irreducible physical work — wet-lab assays, ' +
      'cell cultures, animal models, clinical trials — that AI cannot perform. AI is reshaping the discovery side (AlphaFold + protein design + ' +
      'molecular ML) but each AI breakthrough creates more downstream wet-lab + validation work, not less. The 10-year horizon is genuinely ' +
      'uncertain — if foundation models for biology mature, computational biology specifically may compress — but the field overall expands.',
    what_doesnt_compress: [
      'Designing wet-lab experiments that test specific biological hypotheses.',
      'Interpreting noisy biological data with judgment + domain knowledge.',
      'Clinical trial design + regulatory submissions.',
      'Bench work — cell culture, assays, animal models, tissue work.',
      'Integration of multimodal biological evidence (genomics + clinical + imaging + functional).',
    ],
    sources: [
      { type: 'ai_exposure', label: 'DeepMind AlphaFold + Isomorphic Labs publications 2024-2026', accessed_date: '2026-03-18' },
      { type: 'ai_exposure', label: 'Editorial — biotech researcher interviews on AI integration trajectory', accessed_date: '2026-04-08' },
    ],
  },
  moat_skills: [
    {
      skill: 'Molecular biology fundamentals at depth.',
      why_it_matters: 'The biology + chemistry foundation that everything else builds on. Researchers who deeply understand transcription / translation / signalling pathways outperform those who only know surface concepts.',
      how_to_build_in_college: 'Take molecular biology + biochemistry + genetics seriously in years 2-3. Read Alberts "Molecular Biology of the Cell". Aim to be able to explain CRISPR + a specific signalling pathway from memory by graduation.',
    },
    {
      skill: 'Programming + statistics for biological data.',
      why_it_matters: 'Modern biology is data-heavy. Python / R + statistics + version control are mandatory for computational biology, increasingly for wet-lab biology too. Researchers who can\'t code plateau at the bench-technician level.',
      how_to_build_in_college: 'Take CS-for-biologists or equivalent courses. Self-study Python + R. Work through Datacamp or Coursera bioinformatics specialisations. Use git for your project notebooks.',
    },
    {
      skill: 'Reading + critiquing biology research papers.',
      why_it_matters: 'Biology has high replication-failure rates. Researchers who can read Nature / Cell / NEJM critically — spotting weak controls, p-hacked results, unconvincing claims — separate themselves from peers who take published claims at face value.',
      how_to_build_in_college: 'Pick one biology subfield. Read 1-2 papers per week with active critique. Join a journal club if your college has one; start one if it doesn\'t. By graduation you should have 100+ critiqued papers in your notebook.',
    },
    {
      skill: 'Wet-lab technique + bench skills.',
      why_it_matters: 'Researchers who can pipette accurately + design controls + troubleshoot failed experiments are unusually valuable because the skill is slow to acquire. AI doesn\'t help with this; only repetition does.',
      how_to_build_in_college: 'Take lab courses seriously, not as a chore. Volunteer in a research lab from year 2 onward. The lab-mentor relationships + bench technique you build are the foundation of any biology career.',
    },
  ],
  educational_path: {
    primary_degrees: ['B.Tech Biotechnology', 'B.Tech Bioengineering / Biological Engineering', 'BSc Biology / Biochemistry + MSc + PhD', 'B.Tech Chemical Engineering with biology specialisation', 'MBBS + research pivot (uncommon but possible)'],
    alternative_degrees: ['BSc Microbiology / Genetics / Molecular Biology + masters', 'BSc Pharmacy + research masters'],
    target_colleges: {
      stretch: ['IIT Madras / Bombay / Delhi / Kanpur Biotechnology / Bioengineering', 'IISc Bangalore (Centre for BioSystems Science + Engineering)', 'IISER (any campus) for BSc + MS combined', 'NCBS Bangalore (TIFR-affiliated)'],
      realistic: ['NIT Warangal / Surathkal / Calicut Biotechnology', 'Anna University Biotech', 'BITS Pilani Biological Sciences', 'AIIMS for MBBS + research pivot'],
      accessible: ['B.Tech Biotech from any decent college + serious masters specialisation + lab research experience + active project portfolio'],
    },
    minimum_viable_path:
      'B.Tech Biotechnology / Bioengineering OR BSc Biology + MSc + PhD. Industry roles at decent biotech / pharma typically open up post-masters. ' +
      'For the highest-paid computational biology + AI-augmented drug discovery sub-paths, add serious Python + ML + bioinformatics tools to the ' +
      'biology foundation. Has been done from non-IIT colleges via excellent research portfolio + GATE for IIT MTech.',
    what_to_do_in_college: [
      'Year 1-2: Build biology + chemistry foundations. Read Alberts, Lehninger. Start lab volunteering by mid-year-2.',
      'Year 3: Pick a sub-discipline (computational, drug discovery, wet-lab molecular biology, clinical research). Internship at a biotech / CRO / lab.',
      'Year 4: Either convert internship into industry role OR commit to MS/PhD path. GATE for IIT MTech is the established next step.',
      'Throughout: take CS + ML courses seriously. The computational biology + AI-augmented drug discovery sub-paths are where the highest-paid roles live.',
    ],
    time_to_first_real_income: 6,
  },
  cons: [
    {
      issue: 'Industry roles typically require masters / PhD.',
      explanation: 'Direct B.Tech-only biotech roles exist but pay modestly (₹4-6L starting) and ceiling is genuinely lower. The 2-3 year masters / 5-year PhD time investment is significant. Plan for it.',
    },
    {
      issue: 'Entry-level pay is below tech.',
      explanation: 'A B.Tech Biotechnology graduate without masters often earns ₹3-5L at first job vs a B.Tech CSE peer at ₹12-15L. Career ROI catches up by year 5-8 for the well-positioned, but the early-career income gap is a real psychological + financial pressure.',
    },
    {
      issue: 'Industry concentration on a few cities.',
      explanation: 'Bangalore (Strand, IBAB, Mapmygenome, Foundation, Aragen) + Hyderabad (Genome Valley with Aragen, Syngene, multiple CROs) + Mumbai (pharma R&D) account for ~85 % of well-paid biotech research roles. Less geographically distributed than even SWE.',
    },
    {
      issue: 'Replication crisis is psychologically taxing.',
      explanation: 'A significant fraction of published biology results don\'t replicate. Researchers in their first years often spend months chasing claims that turn out to be artifacts. The mental discipline of "trust nothing without controls" is essential + exhausting until it becomes habit.',
    },
    {
      issue: 'Career lateral mobility is narrower than software.',
      explanation: 'Biotech researchers can pivot to healthcare AI, data science, science communication — but each requires real retraining. A SWE-product engineer has more lateral options. Be honest about whether you\'re OK with deeper specialisation + narrower exits.',
    },
  ],
  india_context: {
    geographic_concentration: 'Bangalore (heaviest — Strand, Mapmygenome, Aragen, IBAB) + Hyderabad (Genome Valley — Aragen, Syngene, multiple CROs) + Mumbai (pharma R&D). Some Pune + Chennai.',
    remote_work_feasibility: 'low',
    english_requirement: 'high',
    family_capital_required: 'medium',
    typical_first_job_city: ['Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai'],
  },
  adjacent_careers: [
    { career_slug: 'healthcare-ai', why_its_a_natural_pivot: 'For computational biology + bioinformatics researchers who want to be closer to clinical impact + better pay. Same skillset, broader applications.' },
    { career_slug: 'ml-engineer', why_its_a_natural_pivot: 'For computational biology researchers who decide the biology side isn\'t enough motivation — pivot to ML engineering at consumer tech, broader geography, higher pay.' },
    { career_slug: 'data-engineer', why_its_a_natural_pivot: 'For researchers who decide they like the engineering side more than the biology side — data engineering is a natural transition with overlapping skills.' },
  ],
  example_paths: [
    {
      college_tier: 'top_iit',
      college_to_first_job: 'IIT Madras B.Tech Biotechnology + MS Bioinformatics. Strong computational biology focus during MS. Joined Strand Life Sciences as a computational biologist on the genomics team.',
      where_now: 'Senior computational biologist at Strand Life Sciences, 5 years experience',
      income_range: '₹28-40L cash + small ESOPs',
      one_decision_that_mattered: 'Choosing computational over wet-lab during MS — the CS + biology hybrid unlocked the well-paid roles that pure-wet-lab peers struggled to reach.',
    },
    {
      college_tier: 'top_nit',
      college_to_first_job: 'NIT Warangal Biotechnology. Did GATE seriously + IIT Bombay MTech in Biological Sciences + Bioengineering. PhD interest emerged during MTech, but pivoted to industry. Joined a Bangalore drug discovery startup.',
      where_now: 'Research scientist at a series-B drug discovery startup, 3 years post-MTech',
      income_range: '₹18-26L cash + ESOPs',
      one_decision_that_mattered: 'Picking industry over the PhD path at year 7 — the PhD would have added 5 years for marginal career return given the industry was hiring.',
    },
    {
      college_tier: 'private',
      college_to_first_job: 'Tier-2 private engineering Biotech. BSc → MSc Bioinformatics from a decent university. Taught herself Python + R + machine learning over 18 months during MSc. Joined an AI-augmented drug discovery startup as a junior computational biologist.',
      where_now: 'Junior computational biologist at an AI drug discovery startup, 2 years experience',
      income_range: '₹12-18L cash + small ESOPs',
      one_decision_that_mattered: 'Investing 18 months in self-taught ML during MSc — that unlocked the AI-augmented drug discovery roles that pure biology candidates couldn\'t compete for.',
    },
  ],
  sources: [
    { type: 'salary', label: 'AmbitionBox biotech / pharma research listings — Q1 2026', accessed_date: '2026-04-12' },
    { type: 'job_market', label: 'India biotech industry reports + DBT / DST hiring statistics 2024-2026', accessed_date: '2026-03-28' },
    { type: 'ai_exposure', label: 'DeepMind AlphaFold + Isomorphic Labs publications 2024-2026', accessed_date: '2026-03-18' },
    { type: 'career_path', label: 'Editorial — interviews with 4 biotech researchers across Strand / Syngene / a drug discovery startup / a pharma captive', accessed_date: '2026-04-08' },
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
    console.log(`Would upsert slug="${SPEC.slug}" — ${SPEC.sub_paths.length} sub-paths · ${SPEC.moat_skills.length} moat skills · ${SPEC.cons.length} cons · ${SPEC.example_paths.length} examples.`);
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

main().catch((err) => { console.error('❌ Seed failed:', err); process.exit(1); });
