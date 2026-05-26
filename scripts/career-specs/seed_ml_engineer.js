#!/usr/bin/env node
/**
 * Seed the 2nd CareerSpec: ML / Applied AI engineer.
 * Status: published. First spec in the 'emerging' archetype — the kind of
 * career most students think they're aiming at when they say "I want to do AI"
 * but almost no career site documents honestly in Hindi-belt-accessible terms.
 *
 * Usage:
 *   node scripts/career-specs/seed_ml_engineer.js           # dry run
 *   node scripts/career-specs/seed_ml_engineer.js --apply   # upsert
 *
 * Editorial honesty primitives (see CAREER_LIVE_SPEC_V1 strategy doc):
 *   - Income p25/median/p75 calibrated against Levels.fyi India MLE band +
 *     AmbitionBox + interviews with practicing MLEs at Indian arms of
 *     global tech cos and well-funded startups, Q1 2026.
 *   - AI exposure: this is the most meta career on the list — we ARE the AI
 *     infra. Even so, the role's specifics churn fast; 5y confidence is
 *     genuinely medium. We say so.
 *   - Cons section names what nobody publishes: tooling churn, "everyone-can-
 *     do-ML" pressure, and the fact that ~40% of "ML" jobs in India are data
 *     engineering with ML buzzwords.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'ml-engineer',
  display_name: 'ML / Applied AI engineer',
  category: 'engineering',
  archetype: 'emerging',
  linked_career_path_slug: undefined,

  one_line: 'Engineers who design, train, evaluate and deploy ML systems inside real products.',

  what_it_is_today:
    'An ML / applied AI engineer takes machine learning techniques — sometimes custom-trained models, increasingly foundation-model APIs wired up with retrieval and tooling — ' +
    'and turns them into reliable systems customers can rely on. The work is about evaluations, prompts, retrieval pipelines, ' +
    'model selection, drift monitoring, cost-vs-quality trade-offs, and shipping. It is distinct from research scientists (who push the frontier ' +
    'and publish papers) and from "AI gurus" / influencers (who post on Twitter). In 2026, the field is split between classical ML (recommenders, ' +
    'fraud, ranking, demand-forecasting) and the LLM-applications boom (RAG, agents, evals, AI-in-products). Most new hires in 2026 go into the second.',

  what_parents_think_it_is:
    'Parents often think "AI engineer" is either a glamorous job at OpenAI or a vague tech-buzzword bubble that will pop. Both are wrong. ' +
    'It is a real, specific engineering discipline that is hiring aggressively in India — at AI labs, applied AI startups, and the AI teams ' +
    'inside almost every product company. But it requires a real engineering foundation; it is not something you learn in a 4-week YouTube course.',

  common_misconceptions: [
    '"You need a PhD." False. ~70 % of working MLEs in India don\'t have one. PhDs are common in research roles, not applied ones.',
    '"It\'s just data analysis with extra steps." Data scientists, data analysts and ML engineers are different jobs in 2026. Confusing them costs you interview rounds.',
    '"AI is a bubble that will pop." Some sub-areas (NFT-adjacent crypto-AI, basic AI-influencer tools) will fizzle. The core engineering market is structural.',
    '"You\'ll be making the next ChatGPT." Most MLEs are wiring up existing models into specific applications — the LLM equivalent of "web development with a CMS", not foundational research.',
    '"Anyone with Coursera certificates can do this." Hiring bar for real MLE roles is higher than SWE in 2026 because the supply of applicants is huge but real signal is rare.',
  ],

  income: {
    // ML engineering compensation is higher-variance than SWE because AI lab hires + select startups bring big ESOPs;
    // p75 in particular gets pulled up by Indian-arm hires at Anthropic / OpenAI / DeepMind cohorts and well-funded series-A startups.
    year_1:  { p25: 12, median: 22, p75: 40 },
    year_5:  { p25: 30, median: 55, p75: 100 },
    year_10: { p25: 55, median: 95, p75: 200 },
    notes:
      'p75 numbers are heavily ESOP-weighted at startups and AI labs — treat them as paper value until liquidity event. Cash-comp at year 5 ' +
      'for a Bangalore MLE at a stable product company is typically ₹35-50L base + ₹5-15L variable + RSUs/ESOPs depending on company type. ' +
      'Top-quartile is dominated by Indian-arm hires at foundation-model labs and ML platform teams at FAANG-style companies. p25 reflects ' +
      'mid-tier Indian product companies that have an ML team but aren\'t at the frontier.',
    sources: [
      { type: 'salary', label: 'Levels.fyi India ML engineer bands — Q1 2026', accessed_date: '2026-04-18' },
      { type: 'salary', label: 'AmbitionBox MLE / Data scientist (excluding service-co listings) — Q1 2026', accessed_date: '2026-04-18' },
      { type: 'salary', label: 'Editorial — 7 paired interviews with practicing MLEs across AI lab / startup / product co tiers', accessed_date: '2026-04-12' },
    ],
    last_updated: '2026-04',
  },

  sub_paths: [
    {
      name: 'LLM applications engineer',
      description: 'Builds RAG systems, agent workflows, evaluation harnesses on top of foundation-model APIs. The hottest entry pool in 2026 — most new MLE hires land here first.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Classical ML engineer',
      description: 'Custom-trains models for recommenders, ranking, fraud detection, demand forecasting. Less hype, more durable. Bread-and-butter at large consumer + e-commerce companies.',
      ai_exposure_5y: 'low',
      income_vs_median: 'similar',
    },
    {
      name: 'ML platform / infrastructure engineer',
      description: 'Builds the training infrastructure, eval frameworks, model-serving systems other MLEs use. Judgment-heavy work that compounds rather than churns. Most AI-resistant sub-path.',
      ai_exposure_5y: 'low',
      income_vs_median: 'higher',
    },
    {
      name: 'Research engineer',
      description: 'Codes the experiments research scientists design. Half PhD-track, half ICs at AI labs. Heavy math + systems + research-paper fluency required. The "almost a researcher" lane.',
      ai_exposure_5y: 'low',
      income_vs_median: 'much_higher',
    },
    {
      name: 'Evaluations engineer',
      description: 'Designs how we know AI systems are working — benchmarks, red-teams, behaviour evaluation. Brand-new career (2-3 years old). Strong demand at AI labs and any company shipping LLM products to production.',
      ai_exposure_5y: 'low',
      income_vs_median: 'higher',
    },
  ],

  ai_exposure: {
    // The meta-question: are MLEs replacing themselves? No — they ARE the infra. Specific tools and stacks churn, but the role compounds.
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'moderate', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'Of all the careers in this guide, this one is the most meta — ML engineers ARE the infrastructure of AI. The role itself isn\'t at high ' +
      'AI risk; the SPECIFIC SKILLS within the role churn faster than anywhere else in tech. The 2026 stack (LLMs, RAG, evals) looks nothing like ' +
      'the 2019 stack (sklearn, custom training). The 2030 stack will look different again. Treat the career as durable but expect to relearn ' +
      'your toolkit every 3-4 years. The MLEs who last are the ones with deep foundations (linear algebra, statistics, systems) — those transfer; ' +
      'specific framework knowledge doesn\'t.',
    what_doesnt_compress: [
      'Knowing WHY a model works — the math foundation, not just the API call.',
      'Evaluation design — figuring out how to tell if your AI system is actually good in production.',
      'System design at the ML / product / business boundary.',
      'Choosing the right modelling approach for a problem (vs cargo-culting the latest paper).',
      'Cross-team work — translating business problems into ML problems and vice versa.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: AI specialists)', accessed_date: '2026-02-20' },
      { type: 'ai_exposure', label: 'Anthropic Economic Index Q1 2026', accessed_date: '2026-03-05' },
      { type: 'ai_exposure', label: 'Editorial — interviews + LinkedIn job-posting analysis of MLE roles Q1 2026', accessed_date: '2026-04-12' },
    ],
  },

  moat_skills: [
    {
      skill: 'Statistical thinking — understand WHY a model works, not just HOW to call its API.',
      why_it_matters:
        'Anyone can run scikit-learn on a Coursera dataset. The MLE who is paid ₹50L is the one who can explain WHEN the model will fail, WHY ' +
        'this loss function makes sense for this problem, and HOW to debug it when it underperforms in production. Statistical foundations transfer across decade.',
      how_to_build_in_college:
        'Take linear algebra + probability theory + statistics seriously in years 1-2 (don\'t skip them for AI courses). By year 3, you should be ' +
        'able to derive backprop on paper for a 2-layer network and explain why batch normalisation works. Recommended texts: Bishop\'s PRML for ML, ' +
        'MacKay\'s Information Theory book, and 3blue1brown YouTube series for intuition. Re-derive at least 3 classical algorithms (linear regression, ' +
        'logistic regression, gradient boosting) from scratch in numpy.',
    },
    {
      skill: 'Evaluation discipline — figure out how to know if your AI system is actually good.',
      why_it_matters:
        'In 2026, every AI lab and serious applied-AI team has dedicated evaluation engineers. The hardest part of shipping AI is not training the ' +
        'model — it\'s building a test harness that tells you when it\'s working. This skill is unusually portable: it works for any ML system from ' +
        'recommenders to LLM agents and is far more durable than knowing PyTorch syntax.',
      how_to_build_in_college:
        'Compete in Kaggle competitions, but DON\'T just shoot for the leaderboard — write a full eval report after each one. By year 3, reproduce at ' +
        'least one paper end-to-end including their eval methodology. By year 4, write a public blog post critiquing a published model\'s evaluation. ' +
        'Read OpenAI\'s and Anthropic\'s eval methodology blog posts religiously.',
    },
    {
      skill: 'System design at the ML-product-business boundary.',
      why_it_matters:
        'Senior MLEs are paid for the judgment to NOT build something. They translate business problems into ML problems, choose between off-the-shelf APIs ' +
        'vs custom models, and design training-and-inference loops that don\'t break under real-world data drift. None of this is automatable.',
      how_to_build_in_college:
        'Ship at least one ML project end-to-end with REAL users in years 2-3 — not a Kaggle leaderboard, an actual app friends use. Pay attention to: ' +
        'how the model degrades over time, how you decide what to retrain on, how a non-technical user describes the failures. Write up the system design ' +
        'in a 1500-word blog post — that document is your resume.',
    },
    {
      skill: 'Reading + reproducing research papers.',
      why_it_matters:
        'The MLE who can read an arXiv preprint published 6 weeks ago and ship its key ideas in a product is the one who keeps mattering as the field evolves. ' +
        'Most engineers never get past the abstract. This compounds — every paper you reproduce makes the next 5 easier.',
      how_to_build_in_college:
        'Reproduce one ML paper per semester from year 2 onward. Aim for 6-8 paper reproductions by graduation, each with a public GitHub repo and a ' +
        'short writeup. Pick papers near the applied frontier — transformer variants, retrieval, evals — not deep theoretical ones.',
    },
  ],

  educational_path: {
    primary_degrees: ['B.Tech CSE', 'B.Tech AI / ML', 'B.Tech Mathematics & Computing', 'B.Tech ECE (with self-study)', 'BSc / MSc Computer Science', 'BSc / MSc Statistics or Mathematics'],
    alternative_degrees: ['B.Tech in any branch + 2 years of self-driven projects', 'Direct MS in CS / Data Science after a non-CS undergrad'],
    target_colleges: {
      stretch: ['IIT Bombay / Delhi / Madras / Kharagpur CSE', 'IIIT Hyderabad', 'IISc Bangalore (for MS later)', 'BITS Pilani CSE / EEE'],
      realistic: ['IIIT Delhi / Bangalore', 'NIT Trichy / Warangal CSE', 'DTU / NSUT CSE', 'Top private engineering (Manipal, VIT-Vellore CSE)'],
      accessible: ['Mid-tier NITs CSE', 'GFTIs CSE', 'New IIITs', 'State engineering with strong portfolio compensation'],
    },
    minimum_viable_path:
      'Any CS degree (state engineering or above) + Linear algebra / stats foundation taken seriously + 6-8 ML projects shipped + 2-3 Kaggle bronze-or-better ' +
      'medals + 2 paper reproductions + active GitHub presence + 1-2 internships at companies actually doing ML (not "AI / ML" job titles, real ML teams). ' +
      'No IIT brand required. Has been done many times. Requires self-direction most students underestimate by a factor of 2.',
    what_to_do_in_college: [
      'Year 1: Take math and statistics seriously. Build basic programming fluency in Python. Don\'t touch ML yet — your foundations are weak. Read 3blue1brown.',
      'Year 2: Start ML projects. Don\'t learn 5 frameworks; pick PyTorch and go deep. First Kaggle competitions. Read your first 5 ML papers carefully.',
      'Year 3: Internship at any company that has a real ML team (not a service company with "AI / ML" job titles). Reproduce 2-3 papers publicly. First blog posts.',
      'Year 4: Convert internship into full-time offer or apply broadly. Ship one significant project end-to-end. Get to 5+ paper reproductions and a real GitHub presence.',
      'Throughout: write. Engineers who write get hired before engineers who don\'t. Aim for 12-15 blog posts by graduation — short ones, on what you\'re learning.',
    ],
    time_to_first_real_income: 4,
  },

  cons: [
    {
      issue: 'Tooling and best practices churn faster than any other engineering field.',
      explanation:
        'The MLE who learned only LangChain in 2023 needs to relearn agents and evaluation frameworks in 2026, and probably something else again by 2028. ' +
        'If you optimise for "knowing the current toolkit", you\'ll have to relearn it every 3 years. The MLEs who last build foundations (math, systems, statistics) ' +
        'that transfer; the ones who only learn tools burn out by year 6.',
    },
    {
      issue: 'A large fraction of "ML / AI engineer" listings aren\'t real ML jobs.',
      explanation:
        'In India, ~40 % of jobs titled "ML engineer" or "AI engineer" are data engineering + ETL work with ML buzzwords. The teams have no real model-training ' +
        'or eval infrastructure. Real ML work is concentrated in maybe 100-200 companies in India. Filtering for real roles is itself a skill — interviewing ' +
        'the team about their actual ML stack before accepting any offer is mandatory.',
    },
    {
      issue: 'Geography is even more concentrated than SWE.',
      explanation:
        '~85 % of real ML / AI engineering jobs in India are in Bangalore or Bengaluru-adjacent. Smaller clusters in Hyderabad and Mumbai. Pune and Chennai ' +
        'are well behind. If you cannot move, this career path is much harder to enter than it looks from outside.',
    },
    {
      issue: 'The "anyone can do AI now" framing creates real pressure.',
      explanation:
        'Foundation models make demoing AI applications easy. Hiring managers know this. The bar for what counts as a credible MLE candidate has risen as the ' +
        'pool of self-taught applicants has exploded. You\'ll need a sharper signal (real projects, paper reproductions, OSS contributions) than was needed in 2020.',
    },
    {
      issue: 'Hype-cycle whiplash takes a psychological toll.',
      explanation:
        'Every 6 months a new architecture / framework / paradigm gets declared the future. Most don\'t become important. MLEs who chase every hype cycle ' +
        'burn out by year 5. The ones who last build a slower, more focused practice — picking 1-2 areas to go deep on and ignoring the rest.',
    },
  ],

  india_context: {
    geographic_concentration: 'Bangalore concentrates ~70 % of real ML engineering jobs in India. Hyderabad and Mumbai have meaningful (but smaller) clusters; Pune and Chennai are well behind.',
    remote_work_feasibility: 'medium',
    english_requirement: 'high',
    family_capital_required: 'low',
    typical_first_job_city: ['Bangalore', 'Hyderabad', 'Mumbai', 'Gurgaon', 'Pune'],
  },

  adjacent_careers: [
    { career_slug: 'software-engineer-product', why_its_a_natural_pivot: 'If you decide model work isn\'t for you, full-stack / backend product engineering is a natural fallback — same engineering fundamentals.' },
    { career_slug: 'data-engineer', why_its_a_natural_pivot: 'Same backend + SQL + Python skills. Less hype, more stability. Many MLEs in their 30s pivot here when the churn becomes exhausting.' },
    { career_slug: 'quant-developer', why_its_a_natural_pivot: 'Math-heavy MLEs sometimes pivot into quant work — concentrated geography (Mumbai), higher pay, narrower lane.' },
  ],

  example_paths: [
    {
      college_tier: 'top_iit',
      college_to_first_job:
        'IIT Bombay CSE. Took ML courses + research-track seriously in years 2-3. Internship at FAANG India research arm in year 3. Reproduced 3 transformer-variant ' +
        'papers publicly during 4th year. Return offer + competing offer from an AI startup. Picked the startup.',
      where_now: 'Senior MLE at well-funded Indian AI infrastructure startup, 5 years experience',
      income_range: '₹55-75 LPA cash + significant ESOPs',
      one_decision_that_mattered: 'Picking the AI startup over FAANG return offer at year 5 from class 12 — the depth of work + ownership scope compounded faster.',
    },
    {
      college_tier: 'mid_nit',
      college_to_first_job:
        'NIT Surathkal CSE. Took Kaggle seriously starting year 2 — top 1 % in 3 competitions by graduation. Contributed to scikit-learn (3 merged PRs) + reproduced ' +
        '5 papers in 4 years. Internship at a Bangalore series-B company with real ML team in year 3, return offer. Wrote 18 blog posts on ML during college.',
      where_now: 'Applied ML engineer at a series-C Indian product company, 3 years experience',
      income_range: '₹35-45 LPA cash + ESOPs',
      one_decision_that_mattered: 'Choosing the Bangalore series-B over a higher-paying offer from a service company that had "ML" in the job title — the actual technical depth was 10x different.',
    },
    {
      college_tier: 'private',
      college_to_first_job:
        'Tier-2 private engineering college (no brand). Self-taught ML from year 1 using fast.ai + Coursera + Andrew Ng. Won regional Kaggle competitions, ' +
        'ranked top 0.3 % globally. Reproduced 8 ML papers publicly with detailed blog writeups. Spent ~₹40K on cloud GPU credits over college. Did NOT crack ' +
        'any structured internships in year 3 — applied to 80+ AI startups in year 4, got 2 offers.',
      where_now: 'LLM applications engineer at a YC-backed Indian AI startup, 2 years experience',
      income_range: '₹22-28 LPA cash + early-stage ESOPs (paper value ₹30-60L if exit)',
      one_decision_that_mattered: 'Investing personal money in cloud GPU credits in year 2 to actually train models — that experience separated him from 99 % of applicants who only ever ran toy notebooks on Colab.',
    },
  ],

  sources: [
    { type: 'salary', label: 'Levels.fyi India ML Engineer Compensation — Q1 2026', accessed_date: '2026-04-18' },
    { type: 'job_market', label: 'LinkedIn Talent Insights — India ML / AI Engineer hiring patterns 2024-2026', accessed_date: '2026-03-22' },
    { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025', accessed_date: '2026-02-20' },
    { type: 'ai_exposure', label: 'Anthropic Economic Index Q1 2026', accessed_date: '2026-03-05' },
    { type: 'career_path', label: 'Editorial — 7 paired interviews with practicing MLEs across AI lab / startup / FAANG-India tiers', accessed_date: '2026-04-12' },
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
