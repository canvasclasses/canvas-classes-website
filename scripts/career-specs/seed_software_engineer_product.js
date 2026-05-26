#!/usr/bin/env node
/**
 * Seed the first CareerSpec into the `career_specs` collection.
 *
 * Career: Software engineer — product track
 * Status: published (real editorial content; this is V1's reference spec)
 *
 * Usage:
 *   node scripts/career-specs/seed_software_engineer_product.js           # dry run
 *   node scripts/career-specs/seed_software_engineer_product.js --apply   # upsert
 *
 * Honesty notes (read before editing):
 *   - Income p25/median/p75 numbers are calibrated against AmbitionBox + Naukri +
 *     Levels.fyi cross-references (Q2 2026). Refresh in March / September per the
 *     editorial cadence in _agents/plans/CAREER_LIVE_SPEC_V1.md.
 *   - AI-exposure assessments use the source confidence convention — `low`
 *     confidence means we genuinely don't know; we publish that honestly rather
 *     than fabricate precision.
 *   - `cons` is non-empty. Every spec MUST name downsides. Schema enforces this.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

// ── The spec ────────────────────────────────────────────────────────────────
const SPEC = {
  _id: uuidv4(),
  slug: 'software-engineer-product',
  display_name: 'Software engineer — product track',
  category: 'engineering',
  archetype: 'transforming',

  one_line: 'Engineers who build and ship product features at companies that sell software.',

  what_it_is_today:
    'A product-track software engineer designs, builds, ships, debugs, and maintains software that customers actually use. ' +
    "Unlike service-company SWEs who execute on someone else's spec, product engineers shape what gets built — they argue about " +
    'requirements with PMs, debate trade-offs with designers, own a slice of a real product, and ship code to real users on a weekly cadence. ' +
    'In 2026, AI tooling (Copilot, Cursor, Claude Code) handles a meaningful slice of the rote coding work — so the role has shifted ' +
    'upward toward judgment, system design, and end-to-end ownership.',

  what_parents_think_it_is:
    'Most parents think "software engineer" means a stable IT-services job — sitting in a TCS / Infosys / Wipro office, ' +
    'writing whatever code the client demands, getting a 4 % yearly hike. That career still exists but is hollowing out fast. ' +
    'The product track is a different job at different companies with different economics.',

  common_misconceptions: [
    '"You need to be a coding genius to do this." False — judgment + reliability beat raw IQ here.',
    '"Service companies and product companies are the same career." They are not. Compensation, growth, and AI exposure all differ.',
    '"You need an IIT degree." Many strong product engineers come from mid-NITs, IIITs, and private colleges with strong portfolios.',
    '"AI will take this job away in 2 years." AI is reshaping it, not replacing it. The junior end is squeezed; the senior end is more valuable than ever.',
    '"You can\'t do this from a tier-3 town." True for the first job (mostly Bangalore/Hyderabad/Pune) — but increasingly remote-friendly at senior levels.',
  ],

  // ── Income ──────────────────────────────────────────────────────────────
  income: {
    year_1: { p25: 8, median: 14, p75: 26 },        // INR LPA at first product-track SWE job
    year_5: { p25: 22, median: 38, p75: 75 },        // Senior SDE / SDE-3 at product companies
    year_10: { p25: 45, median: 75, p75: 180 },      // Staff / Principal / Senior Staff
    notes:
      'p75 at year 5+ is dominated by Indian-arms of global tech companies (Google, Microsoft, Meta, Atlassian) and well-funded ' +
      'Indian startups paying in cash + ESOPs. p25 reflects mid-tier Indian product companies. Service-company SWEs sit BELOW p25 ' +
      "and aren't represented in these numbers — they're a different career.",
    sources: [
      { type: 'salary', label: 'AmbitionBox SDE salaries (Bangalore + Hyderabad + Pune) — Q1 2026', accessed_date: '2026-04-15' },
      { type: 'salary', label: 'Levels.fyi India compensation — Q1 2026', accessed_date: '2026-04-15' },
      { type: 'salary', label: 'Naukri Insights — Software Engineer Pay Band Report 2026', accessed_date: '2026-03-10' },
    ],
    last_updated: '2026-04',
  },

  // ── Sub-paths ───────────────────────────────────────────────────────────
  sub_paths: [
    {
      name: 'Backend / API engineer',
      description: 'Owns service code, databases, performance, scale. The plumbing the rest of the product sits on.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Full-stack product engineer',
      description: 'Owns features end-to-end — UI to database. Closest to the product. Most in-demand at growth-stage startups.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Mobile engineer (iOS / Android)',
      description: 'Platform-specific apps. Slower-moving in 2026 as cross-platform tools mature, but still has dedicated roles at large consumer apps.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Platform / infrastructure engineer',
      description: 'Builds the internal tools other engineers use — CI/CD, observability, developer experience. AI-resistant because the work is judgment-heavy.',
      ai_exposure_5y: 'low',
      income_vs_median: 'higher',
    },
    {
      name: 'Senior / Staff product engineer',
      description: 'Cross-team technical leadership, system design, mentoring. The role that compounds. Most valuable career bend point at year 6-10.',
      ai_exposure_5y: 'low',
      income_vs_median: 'much_higher',
    },
  ],

  // ── AI exposure ─────────────────────────────────────────────────────────
  ai_exposure: {
    horizon_1y: { level: 'low', confidence: 'high' },
    horizon_5y: { level: 'moderate', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'AI tools augment day-to-day product engineering work — they do not replace it. The rote-coding share of the job ' +
      "(scaffolding, boilerplate, test stubs) is the most automatable and is genuinely being absorbed in 2026. The judgment-heavy " +
      'share (system design, trade-off calls, cross-team coordination, debugging at scale, taste) is far less automatable on any ' +
      'plausible 5-year timeline. The honest picture: junior product-engineer roles are squeezing; senior product-engineer roles ' +
      'are more valuable than ever. The career mostly survives — but the on-ramp is steeper.',
    what_doesnt_compress: [
      'Deciding WHAT to build vs not — product judgment.',
      'Shipping a complex feature end-to-end across multiple systems without supervision.',
      'Debugging a production outage at 2 AM with incomplete information.',
      'Communicating technical trade-offs to non-engineering stakeholders.',
      'Reading a 50K-line codebase and making safe changes to it.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025', accessed_date: '2026-02-20' },
      { type: 'ai_exposure', label: 'Anthropic — Anthropic Economic Index Q1 2026', accessed_date: '2026-03-05' },
      { type: 'ai_exposure', label: 'McKinsey — The Economic Potential of Generative AI (refresh)', accessed_date: '2026-01-30' },
    ],
  },

  // ── Moat skills ─────────────────────────────────────────────────────────
  moat_skills: [
    {
      skill: 'Ship a non-trivial project end-to-end, alone or with one other person.',
      why_it_matters: 'The number-one signal recruiters and engineering managers look for. Coursework cannot fake this.',
      how_to_build_in_college:
        'By end of 2nd year, ship at least one project that solves a real problem you or your friends actually have — and put it on GitHub. ' +
        'By end of 3rd year, have two such projects, at least one with 100+ commits over 6+ months.',
    },
    {
      skill: 'Read and modify code you did not write.',
      why_it_matters:
        'Real engineering work is 80% reading existing code, 20% writing new. AI tools accelerate writing but not the comprehension half.',
      how_to_build_in_college:
        'Contribute to one open-source project per semester from 2nd year onward. Start small (docs, tests, small bug fixes). ' +
        'Aim for 5+ merged PRs across 2-3 projects by end of 4th year.',
    },
    {
      skill: 'Communicate technical trade-offs clearly in writing.',
      why_it_matters:
        'Senior engineers are paid for judgment, and judgment travels via writing. The engineers who advance are the ones whose ' +
        'design docs and PR descriptions can be read by a PM or a junior teammate without follow-up questions.',
      how_to_build_in_college:
        'Write a short blog post (300-800 words) about each project — explain WHY you made each technical choice. ' +
        'Doing this 8-10 times across college makes the skill compound.',
    },
    {
      skill: 'Debug methodically under stress.',
      why_it_matters: 'The single hardest thing to automate. Production incidents reward calm, structured thinking — the part of the job that scales hardest with seniority.',
      how_to_build_in_college:
        'Take on an unfamiliar bug from an open-source issue tracker every month. Force yourself to figure it out without AI assistance. ' +
        'Write down what you tried. The discipline matters more than the fix.',
    },
  ],

  // ── Educational path ───────────────────────────────────────────────────
  educational_path: {
    primary_degrees: ['B.Tech CSE', 'B.Tech IT', 'B.Tech AI/ML', 'B.Tech Mathematics & Computing'],
    alternative_degrees: ['B.Tech ECE (with self-taught software)', 'BSc / MSc Computer Science', 'BCA → MCA', 'BTech in any branch + portfolio'],
    target_colleges: {
      stretch: ['IIT Bombay CSE', 'IIT Delhi CSE', 'IIT Madras CSE', 'IIIT Hyderabad', 'BITS Pilani CSE'],
      realistic: ['NIT Trichy / Warangal / Surathkal CSE', 'IIIT Bangalore', 'IIIT Delhi', 'DTU / NSUT CSE', 'PEC Chandigarh'],
      accessible: ['Mid-tier NITs CSE (Rourkela, Calicut, Allahabad)', 'New IIITs', 'GFTI CSE branches', 'Top state engg colleges', 'Reputed private colleges with strong placements'],
    },
    minimum_viable_path:
      'State engineering college + 4 years of consistent self-driven projects + 5-8 open-source contributions + 2 internships at product companies. ' +
      'This path lands a product-engineer offer at year 5 from class 12 with no IIT/NIT brand. Has been done many times — but requires self-discipline most students underestimate.',
    what_to_do_in_college: [
      'Year 1: learn programming fundamentals deeply (Python OR JavaScript, not both at once). One small project per semester.',
      'Year 2: pick a stack (backend OR frontend OR mobile), start contributing to open source, write your first blog post.',
      'Year 3: get an internship at a product company (any tier). If you cannot land one, freelance on small projects.',
      'Year 4: convert your year-3 internship into a return offer, or apply broadly. Have 2-3 portfolio projects, 5+ OSS PRs, a personal blog.',
      'Throughout: build a public GitHub presence. Recruiters check it. A real repo with 50 stars beats a 9.5 CGPA from an unknown college.',
    ],
    time_to_first_real_income: 4,
  },

  // ── Honest cons ─────────────────────────────────────────────────────────
  cons: [
    {
      issue: 'The on-ramp is steeper than it was in 2020.',
      explanation:
        'Junior product-engineer hiring at mid-tier companies has slowed since 2023, and AI tools are absorbing the simpler ' +
        'parts of the work the most. To break in, you now need a portfolio + OSS contributions + interview prep, not just a CS degree.',
    },
    {
      issue: 'Geography is a hard constraint at first.',
      explanation:
        'Roughly 80% of product-engineering jobs in India are in Bangalore, Hyderabad, Pune, with smaller clusters in Mumbai / Gurgaon / ' +
        'Chennai. If you cannot move for your first job, this career path becomes much harder. Remote-first roles open up at senior levels but are rare for fresh graduates.',
    },
    {
      issue: 'Burnout is real.',
      explanation:
        'On-call rotations, deadline pressure, and constant context-switching take a measurable toll. The engineers who last 10+ years are the ones who ' +
        'protect their sleep, hobbies, and relationships deliberately. Many do not, and exit the field by year 7-8.',
    },
    {
      issue: 'Self-direction or stagnation — the middle ground is shrinking.',
      explanation:
        'Engineers who keep learning compound. Engineers who coast plateau at year 4-5 and watch their salary stagnate as ' +
        'younger engineers with newer skills overtake them. There is less room for "good enough" than there was a decade ago.',
    },
    {
      issue: 'ESOPs are not cash — and most never become cash.',
      explanation:
        'Startup compensation packages often look impressive on paper (₹40L base + ₹30L ESOPs). The ESOP portion is illiquid until ' +
        'the company exits or buys back, and most startups do neither. Treat ESOP numbers as lottery tickets, not income.',
    },
  ],

  // ── India context ──────────────────────────────────────────────────────
  india_context: {
    geographic_concentration: 'Bangalore + Hyderabad + Pune account for ~80% of product-engineering jobs. Smaller clusters in Mumbai, Gurgaon, Chennai.',
    remote_work_feasibility: 'medium',
    english_requirement: 'high',
    family_capital_required: 'low',
    typical_first_job_city: ['Bangalore', 'Hyderabad', 'Pune', 'Gurgaon', 'Mumbai', 'Chennai'],
  },

  // ── Adjacent careers (exit ramps) ──────────────────────────────────────
  adjacent_careers: [
    { career_slug: 'ml-engineer', why_its_a_natural_pivot: 'Same foundation — strong product engineers with ML coursework + projects pivot into MLE roles in 2-3 years.' },
    { career_slug: 'data-engineer', why_its_a_natural_pivot: 'Same backend skills + SQL fluency. Slightly less competitive market and similar pay.' },
    { career_slug: 'product-designer', why_its_a_natural_pivot: 'For engineers who realise they care more about WHAT gets built than HOW. Career switch typically takes 1-2 years of intentional portfolio work.' },
    { career_slug: 'quant-developer', why_its_a_natural_pivot: 'For mathematically inclined engineers who want concentrated high pay. Competitive entry but well-paid niche.' },
  ],

  // ── Example paths (anonymised but specific) ────────────────────────────
  example_paths: [
    {
      college_tier: 'mid_nit',
      college_to_first_job:
        'Started CP (competitive programming) in year 1 — peaked at 5-star on CodeChef. Contributed to a popular open-source ' +
        'TypeScript library in year 3 (12 merged PRs). Two internships: small Bangalore startup in year 3, then a series-B SaaS company in year 4.',
      where_now: 'Senior software engineer at India-arm of a global tech company, 5 years experience',
      income_range: '₹50-65 LPA total comp',
      one_decision_that_mattered: 'Choosing the internship at the series-B SaaS company over a higher-paying offer at a service company in year 4.',
    },
    {
      college_tier: 'private',
      college_to_first_job:
        'Tier-3 private engineering college (no famous brand). Self-taught web development from year 1. Built and shipped 4 web apps ' +
        'between year 2 and year 4. Wrote a technical blog with 30+ posts. Did NOT crack any internships in year 3 — applied to 200+ companies directly in year 4.',
      where_now: 'Product engineer at a YC-backed Indian startup, 3 years experience',
      income_range: '₹28-35 LPA cash + early-stage ESOPs',
      one_decision_that_mattered: 'Sticking with deep portfolio work even when most peers were grinding coding-interview prep instead.',
    },
    {
      college_tier: 'top_iit',
      college_to_first_job:
        'IIT CSE. Standard pipeline — research projects with faculty, summer internship at FAANG India in year 3, return offer.',
      where_now: 'Staff engineer at India-arm of a global tech company, 8 years experience',
      income_range: '₹1.4-1.8 Cr total comp',
      one_decision_that_mattered: 'Switching from individual-contributor track to staff-eng (technical leadership) track at year 5 instead of going for the more obvious manager track.',
    },
  ],

  // ── Sources + editorial trust ──────────────────────────────────────────
  sources: [
    { type: 'salary', label: 'AmbitionBox SDE Salary Data — Q1 2026 cross-referenced with Levels.fyi India', accessed_date: '2026-04-15' },
    { type: 'job_market', label: 'LinkedIn Talent Insights — Bangalore + Hyderabad + Pune Software Engineering Hiring 2024-2026', accessed_date: '2026-03-22' },
    { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: Technology roles)', accessed_date: '2026-02-20' },
    { type: 'ai_exposure', label: 'Anthropic Economic Index Q1 2026', accessed_date: '2026-03-05' },
    { type: 'career_path', label: 'Editorial — paired interviews with 12 product engineers across IIT / NIT / IIIT / private tiers', accessed_date: '2026-04-10' },
  ],
  authors: [SEED_AUTHOR],
  last_full_review: '2026-04',
  next_review_due: '2026-07',

  // ── Lifecycle ──────────────────────────────────────────────────────────
  status: 'published',
  published_at: new Date(),
  created_at: new Date(),
  created_by: SEED_AUTHOR,
  updated_at: new Date(),
  updated_by: SEED_AUTHOR,
  version: 1,
};

// ── Lightweight Mongoose schema for the seed (matches packages/data/models/CareerSpec.ts) ──
// We re-declare a minimal schema here so the seed script doesn't depend on the
// 'server-only' import in the main model file. The collection name + index keys
// match — Mongoose treats this as the same collection.
const SeedSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { strict: false, collection: 'career_specs' },
);

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const Model = mongoose.models.CareerSpec || mongoose.model('CareerSpec', SeedSchema);

  if (!APPLY) {
    console.log('— DRY RUN — pass --apply to write.');
    console.log(`Would upsert career spec slug="${SPEC.slug}" with ${Object.keys(SPEC).length} fields.`);
    console.log(`Section sizes: ${SPEC.sub_paths.length} sub-paths · ${SPEC.moat_skills.length} moat skills · ${SPEC.cons.length} cons · ${SPEC.example_paths.length} examples · ${SPEC.sources.length} sources.`);
    await mongoose.disconnect();
    return;
  }

  // Upsert by slug — re-running the seed updates an existing spec rather than creating a duplicate.
  const existing = await Model.findOne({ slug: SPEC.slug }).lean();
  if (existing) {
    // Preserve original _id + created_at on update.
    SPEC._id = existing._id;
    SPEC.created_at = existing.created_at || SPEC.created_at;
    SPEC.created_by = existing.created_by || SPEC.created_by;
    SPEC.version = (existing.version || 1) + 1;
    await Model.replaceOne({ slug: SPEC.slug }, SPEC);
    console.log(`✏️  Updated existing spec slug="${SPEC.slug}" (v${SPEC.version})`);
  } else {
    await Model.create(SPEC);
    console.log(`✅ Created new spec slug="${SPEC.slug}" (_id=${SPEC._id})`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
