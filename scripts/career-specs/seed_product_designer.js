#!/usr/bin/env node
/**
 * Seed: Product designer / UX research.
 * Status: published. crossover / transforming.
 * The "non-CS pivot" career — often hired without specific degree.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'product-designer',
  display_name: 'Product designer / UX research',
  category: 'crossover',
  archetype: 'transforming',
  linked_career_path_slug: undefined,
  one_line: 'Design how users interact with software — the bridge between engineering, business, and the people who actually use the product.',
  what_it_is_today:
    'A product designer owns the user experience of a software product — from the high-level "what problem does this solve" question down to ' +
    'pixel-level interaction details. The role combines design (visual + interaction), research (user interviews, usability testing), and ' +
    'cross-functional collaboration (with engineering, product management, business). In 2026 the field has matured beyond "UI designer who ' +
    'pushes pixels" into a real product-discipline role at most serious software companies. The split between "product designer" (broad ' +
    'product ownership) and "UX researcher" (specialist in user research methods) is increasingly distinct at large companies. India\'s ' +
    'design scene grew significantly between 2020 and 2026 — Indian designers at Razorpay, CRED, Zerodha, Swiggy, Flipkart command ' +
    'compensation that wasn\'t available pre-2020.',
  what_parents_function_thinks: undefined,
  what_parents_think_it_is:
    'Most parents either don\'t know what a product designer does, or assume it means "graphic design at a marketing agency". The actual job ' +
    'is closer to a hybrid of engineering, psychology, and product strategy. Compensation has caught up to engineering at top product companies; ' +
    'the role has cultural weight + influence on product direction; and it\'s one of the few well-paid tech careers that doesn\'t require a CS degree.',
  common_misconceptions: [
    '"You need to be artistic / good at drawing." False. Modern product design is about user empathy + problem-solving + systematic thinking. Visual polish helps but isn\'t the core skill.',
    '"You need a design degree." False. Many strong Indian product designers came from engineering / commerce / arts backgrounds + self-taught design through portfolios.',
    '"It pays less than engineering." Used to be true — not anymore at top companies. Senior product designers at CRED / Razorpay / Swiggy match senior SWE comp.',
    '"It\'s mostly making things look pretty." A small fraction. Most of the work is user research, interaction design, system design, and cross-team negotiation.',
    '"AI will replace designers." Partially false. AI tools (Figma AI, Galileo) automate certain production tasks but increase the value of judgment + research + systems-thinking — the harder-to-automate parts.',
  ],
  income: {
    year_1:  { p25: 5,  median: 9,  p75: 18 },
    year_5:  { p25: 18, median: 32, p75: 60 },
    year_10: { p25: 35, median: 60, p75: 120 },
    notes:
      'Wide variance — bottom quartile is "UI designer at small companies / agency work" which is a different career. Median + p75 are at funded ' +
      'product companies. Top-quartile senior product designers + design managers at Indian unicorns (CRED, Razorpay, Swiggy, Zerodha) approach SWE-' +
      'product senior pay. Title inflation is rampant — "designer" titles range from CSS-formatting roles to genuine product-strategy roles. ' +
      'Compensation correlates more with the company tier than the title.',
    sources: [
      { type: 'salary', label: 'AmbitionBox + Glassdoor product designer / UX researcher listings — Q1 2026', accessed_date: '2026-04-12' },
      { type: 'salary', label: 'Editorial — 5 interviews with designers across CRED / Razorpay / Swiggy / a series-B SaaS startup / a B2B fintech', accessed_date: '2026-04-08' },
    ],
    last_updated: '2026-04',
  },
  sub_paths: [
    { name: 'Product designer (generalist)', description: 'Owns end-to-end design of product features — research, interaction, visual, prototyping. The dominant role at most product companies. Strongest growth + earnings.', ai_exposure_5y: 'moderate', income_vs_median: 'similar' },
    { name: 'UX researcher', description: 'Specialises in user research methods — interviews, usability testing, surveys, behavioural analytics. Often a separate function at large companies. Slower entry but high-paid at senior level.', ai_exposure_5y: 'low', income_vs_median: 'higher' },
    { name: 'Design systems engineer', description: 'Builds + maintains the design system + component library that other designers use. Bridges design + engineering. Code-heavy — typically requires real frontend skills.', ai_exposure_5y: 'low', income_vs_median: 'higher' },
    { name: 'Brand / marketing designer', description: 'Designs the brand identity + marketing surfaces — landing pages, ads, brand systems. More commercial / agency-adjacent. Different career from product designer.', ai_exposure_5y: 'high', income_vs_median: 'lower' },
    { name: 'Service designer / strategic designer', description: 'Designs whole service experiences — cross-touchpoint, often B2B + consulting-adjacent. Rare in India but growing.', ai_exposure_5y: 'low', income_vs_median: 'similar' },
  ],
  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'moderate', confidence: 'medium' },
    horizon_10y: { level: 'high', confidence: 'low' },
    summary:
      'AI is reshaping product design unevenly. Production tasks (initial mockups, visual variations, prototype-to-code) are being meaningfully ' +
      'automated by Figma AI + Galileo + similar tools. But the judgment-heavy work — user research, interaction design decisions, design ' +
      'strategy, system design — remains hard to automate. Junior designer roles that consist mostly of pixel-pushing face real compression; ' +
      'senior designers who do research + judgment + cross-team work become MORE valuable. The 10-year picture is genuinely uncertain.',
    what_doesnt_compress: [
      'User research — actually talking to humans + interpreting their behaviour.',
      'Design strategy — deciding what to build vs not.',
      'Cross-team negotiation between engineering, business, and design.',
      'Systems thinking — designing consistent experiences across many surfaces.',
      'Taste + judgment under ambiguity in product decisions.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: Design and creative roles)', accessed_date: '2026-02-20' },
      { type: 'ai_exposure', label: 'Editorial — design lead interviews on AI tooling integration 2024-2026', accessed_date: '2026-04-08' },
    ],
  },
  moat_skills: [
    {
      skill: 'User research fluency — interviewing, observing, synthesising.',
      why_it_matters: 'The single hardest-to-automate skill in product design. Designers who can run a good user interview + spot the underlying need behind a surface request + synthesise across 8-10 sessions are scarce + paid accordingly.',
      how_to_build_in_college: 'Read Erika Hall "Just Enough Research" + Steve Krug "Don\'t Make Me Think" + Nielsen Norman Group articles. Conduct at least 5 real user interviews on real projects during college — even if for hobby apps. Practice synthesis: write up findings, identify patterns.',
    },
    {
      skill: 'Interaction design + systems thinking.',
      why_it_matters: 'Modern products are systems — features, flows, edge cases, states. Designers who can hold a whole system in their head + ensure consistency across surfaces are more valuable than designers who design beautiful but inconsistent screens.',
      how_to_build_in_college: 'Study real product apps (Notion, Linear, Figma) + reverse-engineer their design systems. Build at least 2 substantial side projects with deep interaction work — not just landing pages, but full apps with edge cases.',
    },
    {
      skill: 'Visual + interaction craft at modern fidelity.',
      why_it_matters: 'AI tools produce decent baseline visuals, but the polish + taste + interaction nuance that makes a product feel right is human. Designers who develop genuine craft taste — knowing what to add + what to remove — separate themselves from AI-tool operators.',
      how_to_build_in_college: 'Practice Figma + Framer + Principle daily. Build a portfolio with 4-6 polished projects. Study craft-focused designers (Mig Reyes, Jason Yuan, Linear team) + reverse-engineer their work in your own projects.',
    },
    {
      skill: 'Cross-functional communication — writing + speaking clearly.',
      why_it_matters: 'Designers spend 30-40 % of their time persuading engineering + product + business of design decisions. Designers who write clear design rationales + present confidently advance to lead roles; those who can\'t plateau as ICs.',
      how_to_build_in_college: 'Write design rationales for every project. Treat your portfolio as a writing portfolio as much as a visual one. Practice giving design critiques to peers — both giving and receiving.',
    },
  ],
  educational_path: {
    primary_degrees: ['NID / NIFT / IDC IIT Bombay (formal design degree)', 'IIT Bombay Design (IDC programs)', 'B.Tech (any branch) + self-taught design through portfolio', 'Liberal arts + design self-study (less common but valid path)'],
    alternative_degrees: ['NIFT B.Des', 'Srishti / Pearl / MIT Institute of Design / Symbiosis Design Institute', 'Engineering degree + design certification (UpGrad, Interaction Design Foundation)'],
    target_colleges: {
      stretch: ['IDC IIT Bombay (M.Des)', 'NID Ahmedabad', 'IIT Guwahati Design (B.Des)', 'Srishti Institute of Art Design + Technology'],
      realistic: ['NIFT (any campus) Communication Design', 'Pearl Academy', 'MIT Institute of Design Pune', 'Symbiosis Institute of Design Pune'],
      accessible: ['Any decent undergraduate degree + 6-12 months of self-driven design portfolio building + design certification + 1 design internship'],
    },
    minimum_viable_path:
      'No formal design degree required. Path: any undergrad degree + 6-12 months building 4-6 portfolio projects + 1-2 design internships (often easier to land ' +
      'than CS internships because the supply of decent designers is thinner) + active presence on design Twitter / dribbble / Read.cv / Layers. ' +
      'Has been done many times from engineering, commerce, and arts backgrounds. The portfolio is the credential.',
    what_to_do_in_college: [
      'Year 1-2: Pick up Figma + design fundamentals. Build small projects — redesign apps you actually use, study + practise interaction design.',
      'Year 3: Build a serious portfolio with 3-4 substantial projects. Apply for design internships — easier to land than SWE internships in 2026.',
      'Year 4: Convert internship to return offer OR apply directly to product companies. Have a portfolio website + active design Twitter presence.',
      'Throughout: design Twitter + Dribbble + Read.cv community is high-signal. Engage. Get critiques. The community is unusually generous + the relationships compound.',
    ],
    time_to_first_real_income: 4,
  },
  cons: [
    {
      issue: 'Title inflation makes the career landscape confusing.',
      explanation: '"Designer" titles range from CSS-formatting at low-tier agencies (₹3L) to senior product strategy at unicorns (₹50L+). Most job listings don\'t clearly specify which they want. Filter by company tier + interview process seriously before accepting offers.',
    },
    {
      issue: 'Without formal design education, you need a genuinely strong portfolio.',
      explanation: 'The path is open but not easy. Self-taught designers need 6-12 months of focused portfolio building + active community presence + 1-2 internships before landing serious roles. Don\'t expect to break in after a 4-week course.',
    },
    {
      issue: 'AI tools are compressing junior + production-design work fast.',
      explanation: 'The role is becoming more bimodal — junior production designers face real automation pressure; senior research + strategy designers become more valuable. Plan for the senior trajectory; don\'t bank on a long mid-career making mockups.',
    },
    {
      issue: 'Career lateral mobility is moderate.',
      explanation: 'Product designers can pivot to product management or design management or UX research. Pivoting to engineering / data is harder. Be honest about whether you\'re committing to the design discipline long-term.',
    },
    {
      issue: 'Top compensation is concentrated at ~30 Indian companies.',
      explanation: 'Outside funded unicorns + select global product company India arms, design pay drops sharply. If your dream is high-pay design work, plan to target a small set of employers.',
    },
  ],
  india_context: {
    geographic_concentration: 'Bangalore (heaviest — CRED, Razorpay, Swiggy, PhonePe, Flipkart) + Hyderabad + Mumbai (Zerodha, Marketing-design houses). Some Gurgaon (Paytm).',
    remote_work_feasibility: 'medium',
    english_requirement: 'high',
    family_capital_required: 'low',
    typical_first_job_city: ['Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Gurgaon'],
  },
  adjacent_careers: [
    { career_slug: 'software-engineer-product', why_its_a_natural_pivot: 'Some designers shift toward design-systems engineering + frontend development, becoming hybrid IC roles. Real but requires meaningful coding skill.' },
    { career_slug: 'data-engineer', why_its_a_natural_pivot: 'UX researchers who deepen their analytics + experimentation skills sometimes pivot to data-product roles. Less common but viable.' },
  ],
  example_paths: [
    {
      college_tier: 'private',
      college_to_first_job: 'NID Ahmedabad B.Des Communication Design. Internship at a Bangalore design agency in year 3, then at Razorpay in year 4. Return offer at Razorpay.',
      where_now: 'Senior product designer at Razorpay, 5 years experience',
      income_range: '₹30-45L cash + ESOPs',
      one_decision_that_mattered: 'Picking Razorpay over the agency return offer at year 4 — the product-company depth of design work compounded faster than agency variety.',
    },
    {
      college_tier: 'top_nit',
      college_to_first_job: 'NIT mid-tier CSE — but spent 18 months in years 2-3 self-teaching design + building a portfolio of 6 projects. Active on design Twitter. Got a design internship at a Bangalore startup in year 3, switched track from CS to design after that.',
      where_now: 'Product designer at a series-B Indian SaaS startup, 3 years experience',
      income_range: '₹20-30L cash + ESOPs',
      one_decision_that_mattered: 'Committing to design over CS at year 3 despite the CS degree — the self-built portfolio + active community presence outweighed the missing design degree.',
    },
    {
      college_tier: 'state',
      college_to_first_job: 'State engineering Computer Engineering. Self-taught design starting year 2 — built 5 portfolio projects + a personal blog about design + active on Read.cv. Did NOT crack a year-3 internship; got into a series-A startup as junior designer in year 4 after 40+ applications.',
      where_now: 'Mid-level product designer at a series-B fintech startup, 2 years experience',
      income_range: '₹12-18L cash + small ESOPs',
      one_decision_that_mattered: 'Posting design work consistently on Read.cv + design Twitter — the visibility was what got him interview calls when his CV alone wasn\'t opening doors.',
    },
  ],
  sources: [
    { type: 'salary', label: 'AmbitionBox + Glassdoor product designer / UX researcher listings — Q1 2026', accessed_date: '2026-04-12' },
    { type: 'job_market', label: 'LinkedIn Talent Insights — India product designer hiring 2022-2026', accessed_date: '2026-03-25' },
    { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: Design + creative)', accessed_date: '2026-02-20' },
    { type: 'career_path', label: 'Editorial — 5 interviews with designers across CRED / Razorpay / Swiggy / a series-B SaaS startup / a B2B fintech', accessed_date: '2026-04-08' },
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

// Cleanup the stray typo field I accidentally included
delete SPEC.what_parents_function_thinks;

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
