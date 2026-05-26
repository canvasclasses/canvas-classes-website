#!/usr/bin/env node
/**
 * Seed: Energy / materials engineer.
 * Status: published. engineering / emerging.
 * First Chemical Engineering branch coverage in the catalog.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'energy-materials-engineer',
  display_name: 'Energy / materials engineer',
  category: 'engineering',
  archetype: 'emerging',
  linked_career_path_slug: undefined,
  one_line: 'Battery chemistry, hydrogen, advanced materials, grid storage — Chemical Engineering\'s honest second act in 2026.',
  what_it_is_today:
    'An energy / materials engineer works at the intersection of chemistry, materials science, and modern energy systems — designing new ' +
    'battery chemistries (Li-ion variants, sodium-ion, solid-state), developing hydrogen production / storage, formulating new electrode + ' +
    'electrolyte materials, or scaling these from lab to manufacturing. In 2026 India has a real and growing scene driven by EV adoption ' +
    '(Ola Electric, Ather Energy, Tata, Mahindra all have in-house battery teams), grid-scale storage (Reliance, Adani, NTPC pilots), ' +
    'green hydrogen (Reliance, Adani, NTPC + IIT Bombay incubated startups), and materials informatics (the AI-augmented side of new-' +
    'material discovery). The field has finally moved past "Chem Eng = work at a refinery" — it is genuinely modernising, but more slowly ' +
    'than tech.',
  what_parents_think_it_is:
    'Most parents picture Chemical Engineering as refineries (Reliance, IOCL) + cement plants + petrochemicals. That career still exists ' +
    'but it\'s the legacy track. The modern energy / materials track is different: smaller teams, higher pay, closer to research, located ' +
    'at EV companies + green-hydrogen startups + materials labs. It\'s a smaller world than IT but with real growth.',
  common_misconceptions: [
    '"Chem Eng = refinery job." That track exists, but the modern track is energy storage + new materials + green chemistry.',
    '"You need a PhD." For deep R&D — often yes. For applied engineering at battery companies / EV startups — often no.',
    '"Indian battery industry is too small." Ola, Ather, Tata, Reliance, JSW collectively have ~2,000+ engineers working on batteries in 2026. Not huge by SWE standards, but real.',
    '"It pays less than IT." True at entry level. The gap narrows by year 5-7, especially at funded EV / energy startups with ESOPs.',
    '"It\'s all wet-lab work." Increasingly, materials informatics + simulation + ML-augmented discovery is a significant fraction of the engineering hours.',
  ],
  income: {
    year_1:  { p25: 5,  median: 8,  p75: 14 },
    year_5:  { p25: 14, median: 22, p75: 40 },
    year_10: { p25: 28, median: 45, p75: 85 },
    notes:
      'Income is meaningfully lower than tech careers at entry — Chemical / Materials engineers compete with refineries (which set the floor) ' +
      'and energy startups (which set the upside). p75 at year 5+ is concentrated at funded EV companies (Ola Electric, Ather) and green-' +
      'hydrogen startups with significant ESOPs. PhD-track research scientists at top labs (CSIR, IIT research centres, BARC) sit around p25-' +
      'median but with high stability + intellectual reward.',
    sources: [
      { type: 'salary', label: 'AmbitionBox energy / battery / materials engineer listings — Q1 2026', accessed_date: '2026-04-12' },
      { type: 'salary', label: 'Editorial — 4 interviews with engineers at Ola Electric battery team / Ather / a hydrogen startup / a materials lab', accessed_date: '2026-04-09' },
    ],
    last_updated: '2026-04',
  },
  sub_paths: [
    { name: 'Battery cell / pack engineer', description: 'Designs battery cells (chemistry, electrode formulation) + packs (thermal, mechanical, BMS integration). Heaviest concentration at EV companies.', ai_exposure_5y: 'low', income_vs_median: 'higher' },
    { name: 'Materials informatics engineer', description: 'Uses ML + DFT simulations + high-throughput experimentation to accelerate new-material discovery. CS + materials hybrid. Newest and fastest-growing sub-path.', ai_exposure_5y: 'moderate', income_vs_median: 'much_higher' },
    { name: 'Hydrogen process engineer', description: 'Electrolysers, fuel cells, hydrogen storage + safety systems. Real but smaller market in India in 2026 — growing fast.', ai_exposure_5y: 'low', income_vs_median: 'similar' },
    { name: 'Solar / PV engineer', description: 'PV cell technology, module design, balance-of-system. Mature market — India has Adani, Tata Solar, Waaree, ReNew producing.', ai_exposure_5y: 'moderate', income_vs_median: 'lower' },
    { name: 'Manufacturing process engineer (energy)', description: 'Scales lab chemistry to manufacturing reality — yield, quality, cost. Bridges R&D and production. Common at EV cell / pack plants.', ai_exposure_5y: 'moderate', income_vs_median: 'similar' },
  ],
  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'low', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'Energy + materials engineering is more AI-resistant than software because the bottleneck is physical experimentation, not computation. ' +
      'AI accelerates simulation + screening + materials discovery (and is doing so visibly in 2024-2026), but the final validation requires ' +
      'wet-lab work + manufacturing scale-up + safety qualification that AI cannot do. Engineers who use AI tools fluently benefit; the role ' +
      'itself doesn\'t go away.',
    what_doesnt_compress: [
      'Designing experiments that test specific hypotheses about new materials.',
      'Diagnosing battery failures from real-world field data + post-mortem analysis.',
      'Manufacturing scale-up — translating lab chemistry to production reality.',
      'Safety + regulatory work on energy storage systems.',
      'Materials selection trade-offs across cost / performance / supply chain.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'DeepMind GNoME + Microsoft MatterGen materials-discovery papers 2023-2025', accessed_date: '2026-03-20' },
      { type: 'ai_exposure', label: 'Editorial — interviews with battery + materials engineers on AI integration', accessed_date: '2026-04-09' },
    ],
  },
  moat_skills: [
    {
      skill: 'Electrochemistry + thermodynamics fundamentals at depth.',
      why_it_matters: 'The math + physics foundation of energy storage. Engineers who deeply understand half-cell potentials + Nernst equation + Butler-Volmer kinetics outperform engineers who only know the empirical patterns.',
      how_to_build_in_college: 'Take electrochemistry + thermodynamics seriously in years 2-3. Read Newman + Thomas-Alyea "Electrochemical Systems" (the textbook). Solve real numerical problems, not just memorise definitions.',
    },
    {
      skill: 'Materials informatics — bridging materials science and ML.',
      why_it_matters: 'The single most-leveraged emerging skill in materials engineering. Engineers who can run DFT simulations + train property-prediction models + design high-throughput experiments are scarce + highly paid.',
      how_to_build_in_college: 'Take ML / data science courses if your curriculum allows. Build at least one project using a public materials database (Materials Project, Aflow, NOMAD). Reproduce a simple property-prediction paper.',
    },
    {
      skill: 'Manufacturing + scale-up intuition.',
      why_it_matters: 'A lab process that works at gram scale often fails at kilogram scale. Engineers who understand the scale-up failure modes are the ones who actually get products to production.',
      how_to_build_in_college: 'Take a process design / unit operations course seriously. Visit a manufacturing facility if possible. Read case studies of how lab discoveries failed or succeeded at industrial scale.',
    },
    {
      skill: 'Reading + critiquing battery / materials research papers.',
      why_it_matters: 'The field moves fast (new chemistries published weekly). Engineers who can read a Nature Energy paper + figure out whether the claimed performance is real + reproducible separate themselves from peers who only read product brochures.',
      how_to_build_in_college: 'Subscribe to Nature Energy + Joule + Cell Reports Physical Science. Read 1-2 papers per week. Write short critiques. By graduation you should have a personal opinion on solid-state vs sodium-ion vs LFP trajectories.',
    },
  ],
  educational_path: {
    primary_degrees: ['B.Tech Chemical Engineering', 'B.Tech Materials / Metallurgical Engineering', 'B.Tech Energy Engineering', 'MS / M.Tech in Materials Science or Energy Systems', 'PhD for deep R&D roles'],
    alternative_degrees: ['B.Tech Mechanical with battery / energy focus', 'BSc / MSc Chemistry with materials specialisation'],
    target_colleges: {
      stretch: ['IIT Madras / Bombay / Delhi / Kanpur Chemical / Materials', 'IISc Materials Engineering / Centre for Sustainable Technologies', 'IIT Kharagpur Energy + Environment'],
      realistic: ['NIT Trichy / Surathkal / Warangal Chemical / Metallurgical', 'IIT BHU Materials / Ceramic Engineering', 'ICT Mumbai (specialised chemistry programs)'],
      accessible: ['Mid-tier NITs Chemical / Materials', 'Decent state engineering Chemical + active project portfolio + masters specialisation'],
    },
    minimum_viable_path:
      'Any decent Chemical / Materials degree + serious engagement with at least one energy / materials sub-field (battery chemistry / hydrogen / ' +
      'materials informatics) + 1-2 internships at an EV company OR energy startup OR materials lab + M.Tech / MS specialisation. Without ' +
      'specialisation, the default path is refinery / petrochemicals — fine career but not "energy / materials" specifically.',
    what_to_do_in_college: [
      'Year 1-2: Chemistry + thermodynamics + transport phenomena foundations. Read battery / hydrogen news to find what excites you.',
      'Year 3: Pick a sub-discipline + start projects. Try for an internship at an EV / battery / energy company. CSIR labs also have summer programs.',
      'Year 4: Internship → return offer OR plan for M.Tech / MS specialisation. The masters credential is more important here than in software.',
      'Throughout: take CS + ML side courses. Materials informatics is the fastest-growing sub-path and the engineers who bridge chemistry + ML are unusually valuable.',
    ],
    time_to_first_real_income: 5,
  },
  cons: [
    {
      issue: 'Entry pay is genuinely lower than tech.',
      explanation: 'A ₹6-8L starting offer is normal for chem / materials. SWE peers start at ₹12-14L. The gap closes by year 5-7 but the early-career ' +
        'gap is real — be honest with yourself about whether the work motivates you enough to accept the trade-off.',
    },
    {
      issue: 'Specialisation matters more than in software.',
      explanation: 'A generalist Chem Eng degree without specialisation defaults to refinery / petrochemical roles. To get into energy / materials specifically, you ' +
        'need to demonstrate the focus through projects + internships + often masters. Less "switch fields easily" mobility than software.',
    },
    {
      issue: 'Lab work + manufacturing roles can be physically demanding.',
      explanation: 'Wet-lab work, shift work in manufacturing, occasional safety hazards (high-voltage testing, flammable hydrogen, chemical exposure). ' +
        'Workplace conditions vary widely. Modern EV company R&D centres are office-like; older refineries are not.',
    },
    {
      issue: 'India energy / materials market is smaller and more concentrated than tech.',
      explanation: 'Maybe 30-40 serious employers in India for modern energy / materials work. If your dream employer goes through layoffs or pivots, ' +
        'lateral options are narrower than in software where 1000+ employers exist.',
    },
    {
      issue: 'Career mobility into ML / SWE requires significant retraining.',
      explanation: 'Many engineers eventually pivot from energy / materials to ML / data engineering. The transition is real but takes 1-2 years of focused ' +
        'self-study. Plan for this if you suspect you might want out.',
    },
  ],
  india_context: {
    geographic_concentration: 'Bangalore (Ola Electric, Ather Energy) + Pune (Tata Motors EV) + Chennai (Hyundai, Mahindra) + Mumbai (Reliance, JSW) + Hyderabad (CSIR-NCL). Some Gujarat (Adani, Tata Electronics).',
    remote_work_feasibility: 'low',
    english_requirement: 'medium',
    family_capital_required: 'medium',
    typical_first_job_city: ['Bangalore', 'Pune', 'Chennai', 'Mumbai', 'Hyderabad', 'Gujarat industrial belt'],
  },
  adjacent_careers: [
    { career_slug: 'ml-engineer', why_its_a_natural_pivot: 'For materials informatics engineers + computational chemists. The Python + ML skills transfer; the materials background becomes a domain edge.' },
    { career_slug: 'data-engineer', why_its_a_natural_pivot: 'For engineers tired of slow physical iteration cycles. Same systems thinking, broader geography, higher pay.' },
  ],
  example_paths: [
    {
      college_tier: 'top_iit',
      college_to_first_job: 'IIT Bombay Chemical Engineering + M.Tech in Energy Science + Engineering. Lab work on Li-ion electrolytes during MTech. Joined Ola Electric battery team via direct campus placement.',
      where_now: 'Senior battery engineer at Ola Electric, 5 years experience',
      income_range: '₹28-40L cash + ESOPs',
      one_decision_that_mattered: 'Choosing the Energy Science MTech over an MBA at year 4 — the technical depth opened the EV-startup track that an MBA wouldn\'t have.',
    },
    {
      college_tier: 'top_nit',
      college_to_first_job: 'NIT Trichy Chemical Engineering. Took a 6-month materials informatics elective + reproduced 2 DFT papers in year 4. Joined a Bangalore materials-discovery startup as a CS-chem hybrid hire.',
      where_now: 'Materials informatics engineer at a series-A materials-discovery startup, 3 years experience',
      income_range: '₹22-30L cash + ESOPs',
      one_decision_that_mattered: 'Taking ML + DFT seriously in year 4 instead of preparing for traditional refinery placement — the hybrid CS-chem skillset was the differentiator.',
    },
    {
      college_tier: 'private',
      college_to_first_job: 'Tier-2 private engineering Chemical. Strong CGPA + active in green hydrogen research projects through college club. M.Tech at IIT in Energy Systems after GATE. Joined a hydrogen startup via campus placement.',
      where_now: 'Process engineer at a green hydrogen startup, 2 years post-MTech',
      income_range: '₹15-22L cash + small ESOPs',
      one_decision_that_mattered: 'Doing GATE seriously in BTech final year to land an IIT MTech — that credential was the entry point that opened the hydrogen startup ecosystem.',
    },
  ],
  sources: [
    { type: 'salary', label: 'AmbitionBox energy / battery / materials engineer listings — Q1 2026', accessed_date: '2026-04-12' },
    { type: 'job_market', label: 'India EV + battery + green hydrogen industry reports 2024-2026', accessed_date: '2026-03-30' },
    { type: 'ai_exposure', label: 'DeepMind GNoME + Microsoft MatterGen materials-discovery papers 2023-2025', accessed_date: '2026-03-20' },
    { type: 'career_path', label: 'Editorial — 4 interviews with engineers at Ola / Ather / a hydrogen startup / a materials lab', accessed_date: '2026-04-09' },
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
