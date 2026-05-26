#!/usr/bin/env node
/**
 * Seed the 5th CareerSpec: Data engineer / analytics engineer.
 * Status: published. crossover / transforming.
 *
 * Editorial premise:
 *   The "switch fields" career — the most accessible modern tech path from
 *   any engineering branch with CS skills. Lower hiring bar than MLE,
 *   similar median pay, more AI-resistant. The honest alternative to
 *   "everyone-should-do-ML" hype.
 *
 * Usage:
 *   node scripts/career-specs/seed_data_engineer.js           # dry run
 *   node scripts/career-specs/seed_data_engineer.js --apply   # upsert
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'data-engineer',
  display_name: 'Data engineer / analytics engineer',
  category: 'crossover',
  archetype: 'transforming',
  linked_career_path_slug: undefined,

  one_line: 'Build the data pipelines that make analytics, dashboards, ML, and product features work.',

  what_it_is_today:
    'A data engineer builds and maintains the pipelines that move data from where it\'s created (apps, third-party APIs, sensors) to where it\'s used ' +
    '(dashboards, machine learning models, internal tools, product features). Modern data engineering in 2026 is split between the older "ETL + warehouse" ' +
    'shape — ingesting raw data, transforming it, loading into Snowflake / BigQuery / Redshift — and the newer "analytics engineering" shape, where engineers ' +
    'sit closer to product teams, own dbt models, and treat data transformations as software with tests + version control. The career has stabilised ' +
    'into a real engineering discipline; the chaotic "data scientist who also has to clean data" era is largely over.',

  what_parents_think_it_is:
    'Most parents either haven\'t heard of this career, or assume it\'s low-skill data-entry work. Neither is right. Data engineers earn comparable to ' +
    'software engineers, work alongside the same teams, and increasingly own the most strategic infrastructure inside data-driven companies. The career ' +
    'is genuinely less hyped than software / ML — and that\'s the secret. Less hype means less competition for entry roles, and more durable income because ' +
    'AI is augmenting the work, not replacing it.',

  common_misconceptions: [
    '"It\'s just SQL + Excel." Modern data engineering involves Python, distributed systems (Spark, Kafka), cloud infrastructure (AWS / GCP), and software engineering rigour.',
    '"Data scientists and data engineers are the same job." They are not. Data scientists build models; data engineers build the systems data scientists rely on. Different skills, different teams, sometimes confused in job titles.',
    '"AI will automate data engineering away." Wrong. AI tools accelerate parts of the work (writing SQL, generating ETL boilerplate) but the judgment-heavy parts (schema design, data modelling, debugging production pipelines) remain firmly human.',
    '"You need a math background." For pure data engineering — no. Strong programming + systems thinking + clear writing matter more than calculus.',
    '"It\'s a backup plan for failed ML engineers." Some ex-MLEs do pivot to data engineering, but the career has its own trajectory and is increasingly the strategic-infrastructure role inside data-driven companies.',
  ],

  income: {
    year_1:  { p25: 8,  median: 13, p75: 22 },
    year_5:  { p25: 20, median: 35, p75: 65 },
    year_10: { p25: 40, median: 65, p75: 130 },
    notes:
      'Entry pay is slightly below product-engineering SWE because the hiring bar is lower (and the talent pool larger). By year 5+, top quartile catches up — ' +
      'data engineers who own platform-scale infrastructure at large companies can match or exceed SWE-product pay. Geographic concentration similar to SWE-product ' +
      '(Bangalore + Hyderabad + Pune) with somewhat more diversity (Mumbai for fintech, Gurgaon for non-tech data teams).',
    sources: [
      { type: 'salary', label: 'Levels.fyi India data engineering bands — Q1 2026', accessed_date: '2026-04-18' },
      { type: 'salary', label: 'AmbitionBox data engineer / analytics engineer listings — Q1 2026', accessed_date: '2026-04-12' },
      { type: 'salary', label: 'Editorial — interviews with 6 data engineers across product companies, fintech, and large enterprise data teams', accessed_date: '2026-04-08' },
    ],
    last_updated: '2026-04',
  },

  sub_paths: [
    {
      name: 'ETL / pipeline engineer',
      description: 'Owns the data-ingestion + transformation infrastructure. Heavy Python + SQL + cloud + orchestration tools (Airflow, Dagster). The classic data-engineering shape.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Analytics engineer (dbt-track)',
      description: 'Sits between data engineering and analytics — owns dbt models, transforms raw data into clean analytical layers, works closely with product / business teams. The fastest-growing sub-path in 2026.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Data platform engineer',
      description: 'Builds the data warehouse, query engines, schema catalogs, and tooling other data engineers use. Judgment-heavy systems engineering. Most AI-resistant sub-path.',
      ai_exposure_5y: 'low',
      income_vs_median: 'higher',
    },
    {
      name: 'Streaming / real-time engineer',
      description: 'Specialises in real-time data systems — Kafka, Flink, stream processing. Common at fintech, ad-tech, and high-throughput consumer apps.',
      ai_exposure_5y: 'low',
      income_vs_median: 'higher',
    },
    {
      name: 'Data governance / privacy engineer',
      description: 'Owns data access controls, anonymisation, audit trails, compliance with DPDPA / GDPR. Becoming critical as Indian data regulation matures. Specialised but in demand.',
      ai_exposure_5y: 'low',
      income_vs_median: 'similar',
    },
  ],

  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'moderate', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'Of the tech careers in this catalog, data engineering is one of the more AI-resistant on a 5-year horizon. AI tools (Copilot, Cursor) accelerate SQL ' +
      'writing and ETL boilerplate — but the work\'s core (designing data models that survive 3 years of schema evolution, debugging a pipeline that\'s silently ' +
      'dropping 2 % of events, choosing the right cloud architecture for cost-vs-latency trade-offs) is judgment-heavy and contextual. Entry-level work compresses ' +
      'most; mid-level and senior work compresses much less. The career is durable for engineers who move past pure pipeline-writing into platform / architecture work.',
    what_doesnt_compress: [
      'Schema design that survives years of evolving business needs.',
      'Debugging silent-failure pipelines where data is wrong but no errors fired.',
      'Cost-vs-latency-vs-correctness trade-off decisions in cloud architecture.',
      'Cross-team data-modelling conversations — translating business needs to technical schemas.',
      'Data governance decisions at the boundary of legal, ethical, and engineering constraints.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: Data and analytics roles)', accessed_date: '2026-02-20' },
      { type: 'ai_exposure', label: 'Anthropic Economic Index Q1 2026', accessed_date: '2026-03-05' },
      { type: 'ai_exposure', label: 'Editorial — paired interviews with data engineers + engineering managers at 4 product companies', accessed_date: '2026-04-08' },
    ],
  },

  moat_skills: [
    {
      skill: 'SQL fluency that goes well beyond "I can write a query".',
      why_it_matters:
        'The single most-leveraged skill in data engineering. Engineers who can write complex SQL — window functions, recursive CTEs, query optimisation, ' +
        'reading execution plans — outperform engineers who just call ORMs. AI tools generate SQL faster, but reading + debugging + optimising it remains human work.',
      how_to_build_in_college:
        'By year 3, you should be able to write a query with 4+ joins, a CTE, and a window function fluently. Practice on real-world datasets — Kaggle datasets, ' +
        'OpenAQ air quality data, public NYC taxi data. Read at least one execution plan per week. By graduation, comfort with PostgreSQL OR BigQuery should be ' +
        'deep enough that you can teach it to a junior.',
    },
    {
      skill: 'Data modelling — designing schemas that don\'t break under change.',
      why_it_matters:
        'The hardest skill in data engineering. A poorly-designed schema costs engineering teams years of migration pain. A well-designed one quietly compounds for ' +
        'a decade. Engineers who can think 3-4 schema iterations ahead are paid significantly more than those who just write whatever the current request needs.',
      how_to_build_in_college:
        'Read Kimball\'s "The Data Warehouse Toolkit" (the textbook). Build at least 2 small projects where you design the schema first, then implement — not the ' +
        'other way around. Write a blog post for each: "what I\'d do differently if I designed this schema today." This is genuinely the skill that separates ' +
        'mid-level from senior.',
    },
    {
      skill: 'Distributed-systems fundamentals.',
      why_it_matters:
        'Modern data engineering runs on distributed systems (Spark, Kafka, Snowflake). Engineers who understand WHY a job is slow — partitioning, shuffles, ' +
        'data skew, network costs — debug 10x faster than engineers who treat the system as a black box. AI tools don\'t replace this; they make the consequences ' +
        'of NOT having it more visible.',
      how_to_build_in_college:
        'Take a distributed systems course in year 3 if available, otherwise self-study (the Tyler Akidau "Streaming 101" / "Streaming 102" essays are still ' +
        'foundational). Build at least one project on Spark or DuckDB at non-trivial scale (10GB+ data). Read the Snowflake paper and the Spark paper from the original ' +
        'researchers.',
    },
    {
      skill: 'Writing — internal docs, design documents, root-cause analyses.',
      why_it_matters:
        'Data engineers write more documentation than most other engineering roles because they\'re the source of truth for "where did this number come from". ' +
        'Engineers who write clearly compound; those who don\'t plateau at year 4-5 because their work is invisible to leadership.',
      how_to_build_in_college:
        'Treat your portfolio README files as design documents. Write a blog post about each project — not "what I built" but "why I chose this architecture". ' +
        'Aim for 10-12 such writeups by graduation. This is the documentation muscle you\'ll use forever.',
    },
  ],

  educational_path: {
    primary_degrees: ['B.Tech CSE', 'B.Tech IT', 'B.Tech AI / ML', 'B.Tech Mathematics & Computing', 'BSc / MSc Computer Science', 'BSc / MSc Statistics'],
    alternative_degrees: ['B.Tech in any branch + self-driven CS + projects', 'Direct entry from a data-analyst role after a non-CS degree'],
    target_colleges: {
      stretch: ['IIT CSE (any campus)', 'IIIT Hyderabad', 'BITS Pilani CSE'],
      realistic: ['NIT Trichy / Warangal / Surathkal CSE', 'IIIT Delhi / Bangalore', 'DTU / NSUT CSE', 'Top private engineering with strong CS placements'],
      accessible: ['Any decent CS degree + SQL fluency + 2 portfolio projects + 1 internship at a company with real data teams'],
    },
    minimum_viable_path:
      'Any CS-related degree (state engineering or above) + deep SQL + Python fluency + 2-3 portfolio projects that actually load + transform real-world data + ' +
      'one internship at a company with a real data team (not a service company labelling everything "big data"). Has been done many times from tier-3 colleges. ' +
      'The hiring bar for entry data engineering is genuinely lower than for product SWE or MLE — this is the most accessible modern tech career.',
    what_to_do_in_college: [
      'Year 1-2: Learn Python well. Take database / SQL courses seriously. Build simple data-loading projects from public APIs.',
      'Year 3: Pick a stack — typically Python + PostgreSQL + AWS or GCP — and go deep. First internship at any company with a real data team. Build a Kimball-style data warehouse for a side project.',
      'Year 4: Convert internship into a return offer OR apply broadly. Have 2-3 portfolio projects on GitHub with real data + documented design choices.',
      'Throughout: write. The data engineering Substack ecosystem (Joe Reis, Benn Stancil, etc.) is high-signal — read it, then write your own version of those posts on your own projects.',
    ],
    time_to_first_real_income: 4,
  },

  cons: [
    {
      issue: 'The career has less "wow" factor than ML / AI engineering.',
      explanation:
        'When students tell parents "I want to be a data engineer," the reaction is often muted. The role has less hype than ML. For some students this is a feature ' +
        '(less competition, more durable career); for others it\'s genuinely demotivating because the social validation isn\'t there. Be honest with yourself about ' +
        'whether you need external excitement or whether you\'re fine with quiet competence.',
    },
    {
      issue: 'Career mobility is wider but ceiling slightly lower than top-tier ML engineering.',
      explanation:
        'A data engineer can move into ML engineering, software product engineering, or platform / infra engineering — career flexibility is excellent. But the very ' +
        'top of the income distribution (Anthropic / OpenAI India hires, AI startup founding-engineer ESOPs) is reached more easily through ML / AI eng than through ' +
        'data engineering. p90+ income outcomes are realistic; p99 outcomes are rarer.',
    },
    {
      issue: 'Production pipeline failures are stressful and unglamorous.',
      explanation:
        'When a data pipeline silently breaks at 3 AM and the next morning\'s dashboard is wrong, the data engineer is on the hook. The work has on-call rotations + ' +
        'stressful debugging in unfamiliar codebases. Engineers who don\'t enjoy detective-work-under-pressure burn out by year 4-5.',
    },
    {
      issue: 'Tooling ecosystem is large and changes frequently.',
      explanation:
        'Spark, Kafka, Flink, dbt, Airflow, Dagster, Snowflake, BigQuery, Redshift, Databricks, DuckDB — the modern data stack is large. Most companies use 4-6 of these ' +
        'tools. Switching companies often means relearning a meaningful chunk of stack. Less severe than ML engineering, but real.',
    },
    {
      issue: 'You\'re often the messenger of bad data news.',
      explanation:
        'When a dashboard shows the company\'s growth has stalled, the data engineer often gets blamed for the data being "wrong" before anyone accepts the data ' +
        'might be right. Political navigation is part of the job. Engineers who can\'t handle organisational friction find this exhausting.',
    },
  ],

  india_context: {
    geographic_concentration: 'Bangalore + Hyderabad + Pune for product / SaaS companies. Mumbai + Gurgaon for fintech + non-tech enterprise data teams. Slightly more geographically diverse than SWE-product.',
    remote_work_feasibility: 'medium',
    english_requirement: 'high',
    family_capital_required: 'low',
    typical_first_job_city: ['Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Gurgaon', 'Chennai'],
  },

  adjacent_careers: [
    { career_slug: 'software-engineer-product', why_its_a_natural_pivot: 'Same engineering fundamentals + Python + systems thinking. Product-track SWE is a natural sibling field — many data engineers pivot here for broader product ownership.' },
    { career_slug: 'ml-engineer', why_its_a_natural_pivot: 'The natural "upgrade" path for data engineers who add ML skills. Many MLEs at Indian companies started as data engineers and pivoted with 1-2 years of focused project work.' },
    { career_slug: 'quant-developer', why_its_a_natural_pivot: 'For data engineers with strong math / financial-systems interest. Narrow but well-paid pivot at HFT / sell-side quant teams.' },
  ],

  example_paths: [
    {
      college_tier: 'top_nit',
      college_to_first_job:
        'NIT Trichy CSE. Took databases + distributed systems courses seriously in years 2-3. Built a small data warehouse for a college fest using PostgreSQL ' +
        '+ Airflow in year 3. Internship at a Bangalore SaaS company, return offer.',
      where_now: 'Senior data engineer at a series-C Indian product company, 5 years experience',
      income_range: '₹38-50L cash + ESOPs',
      one_decision_that_mattered: 'Picking the SaaS product company over a flashier ML-engineer offer at year 5 — the depth of platform work + lower competition for senior promotion compounded faster.',
    },
    {
      college_tier: 'mid_nit',
      college_to_first_job:
        'NIT mid-tier IT branch. Self-taught dbt + Spark in year 3 (the curriculum didn\'t cover modern data engineering). Wrote 14 blog posts on data ' +
        'engineering projects during college. Two summer internships — one at a Pune analytics startup, one at a Bangalore B2B SaaS.',
      where_now: 'Analytics engineer at a series-B Indian fintech, 3 years experience',
      income_range: '₹28-35L cash + small ESOPs',
      one_decision_that_mattered: 'Going deep on dbt early when most peers were chasing TensorFlow — the supply of dbt-fluent engineers in India is unusually thin, which made the job search significantly easier.',
    },
    {
      college_tier: 'state',
      college_to_first_job:
        'State engineering college (no famous brand) Computer Engineering. Spent ₹15K of personal money on Google Cloud Platform credits during years 2-3 — ' +
        'used the budget to build 3 real data engineering projects (pipeline + warehouse + analytics layer) with actual non-trivial data volumes. Got into a ' +
        'Bangalore startup after the 4th attempt at applications in year 4.',
      where_now: 'Data engineer at a series-A Indian B2B SaaS startup, 2 years experience',
      income_range: '₹18-24L cash + early-stage ESOPs',
      one_decision_that_mattered: 'Investing personal money in real cloud credits to build real-volume projects in college — that experience separated him from candidates who only ever used localhost / SQLite.',
    },
  ],

  sources: [
    { type: 'salary', label: 'Levels.fyi India Data Engineering Compensation — Q1 2026', accessed_date: '2026-04-18' },
    { type: 'job_market', label: 'LinkedIn Talent Insights — India Data Engineer hiring patterns 2023-2026', accessed_date: '2026-03-22' },
    { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025', accessed_date: '2026-02-20' },
    { type: 'career_path', label: 'Editorial — 6 paired interviews with data engineers at product / fintech / enterprise companies', accessed_date: '2026-04-08' },
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
