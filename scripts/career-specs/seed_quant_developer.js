#!/usr/bin/env node
/**
 * Seed the 7th CareerSpec: Quant developer / quantitative analyst.
 * Status: published. crossover / transforming.
 *
 * Editorial premise:
 *   The top-of-income math-heavy lane. Real and well-paid but genuinely narrow
 *   — maybe 200-300 entry-level quant roles in India per year. The most
 *   prestige-laden career on the list and the one with the highest variance
 *   in outcomes. Honest framing: hard to enter, can be hard to stay in,
 *   compensation is real but concentrated in 5-8 firms.
 *
 * Usage:
 *   node scripts/career-specs/seed_quant_developer.js           # dry run
 *   node scripts/career-specs/seed_quant_developer.js --apply   # upsert
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'quant-developer',
  display_name: 'Quant developer / quantitative analyst',
  category: 'crossover',
  archetype: 'transforming',
  linked_career_path_slug: undefined,

  one_line: 'Build the systems and models that trading firms use to make money. Hard to enter, concentrated, very well paid.',

  what_it_is_today:
    'A quant developer / analyst writes the software + statistical models that high-frequency trading firms (HFT), hedge funds, and sell-side investment banks use ' +
    'to find and execute trades. The work splits into three broad shapes: quant developers (engineers who build production trading systems, low-latency C++, exchange ' +
    'connectivity); quant researchers (PhD-track, generate trading hypotheses + backtest them); and quant traders (sit between research and execution). In 2026, the ' +
    'real India market is concentrated at maybe 5-8 firms: Tower Research, Jane Street, Citadel India, Optiver, IMC, Da Vinci Trading, plus a few sell-side quant ' +
    'teams (Goldman, Morgan Stanley, JP Morgan in Mumbai + Bangalore). Total entry-level roles per year: ~200-300. Compensation is genuinely high but the lane is ' +
    'narrow.',

  what_parents_think_it_is:
    'Most parents have heard "quant" only vaguely — usually in the context of "people who broke the financial system in 2008". The modern reality in 2026 is different. ' +
    'Quants build the infrastructure of modern markets — most of global equities trading flows through quant systems, not human traders. The career exists, is hiring, ' +
    'and pays among the highest entry-level salaries in tech. The catch: getting in is genuinely competitive, with selective interview processes and small annual ' +
    'cohorts.',

  common_misconceptions: [
    '"You need a math PhD." For quant developer / engineering roles — no. Strong math + strong programming is enough; many top quant developers have just B.Tech CSE / M&C. For pure research / pricing roles — yes, PhD is common.',
    '"Quants are getting rich from gambling." No. Real quant work is systematic, model-driven, and risk-controlled. The pop-culture "math wizards betting big" image is largely fiction.',
    '"AI / ChatGPT will replace quants." Wrong. Quant firms are heavy AI users themselves, but the value is in proprietary research + low-latency systems — both genuinely hard for outside AI to replicate.',
    '"All quant work is in New York / London." Bangalore (Tower Research, Optiver, Da Vinci) + Mumbai (Goldman / Morgan / Citadel + Indian HFT firms) host serious quant teams. India scene grew ~3x between 2019 and 2026.',
    '"Once you\'re in, you\'re set for life." Not true. Quant firms can have brutal performance evaluations + sudden team closures + market regime changes that make whole strategies obsolete. The career has higher variance than software.',
  ],

  income: {
    year_1:  { p25: 25, median: 45, p75: 80 },
    year_5:  { p25: 60, median: 110, p75: 220 },
    year_10: { p25: 110, median: 200, p75: 500 },
    notes:
      'p75 numbers are heavily bonus-weighted — base salaries are typically high but the variable component (bonus tied to firm performance + team performance + individual ' +
      'output) often equals or exceeds base. At top HFT firms, exceptional individual contributors at year 8-10 hit ₹5Cr+ total comp. p25 reflects sell-side quant roles ' +
      '(banks) which are more salary-stable but lower-ceiling. Compensation is HIGHLY firm-dependent: the top 3-4 firms pay 2-3x what the bottom 3-4 in the same career pay.',
    sources: [
      { type: 'salary', label: 'Levels.fyi India quant developer / analyst bands — Q1 2026', accessed_date: '2026-04-18' },
      { type: 'salary', label: 'Glassdoor + Quora industry threads on Tower Research / Jane Street / Citadel India compensation 2024-2026', accessed_date: '2026-04-12' },
      { type: 'salary', label: 'Editorial — interviews with 4 working quants across HFT / sell-side / hedge fund roles in Mumbai + Bangalore', accessed_date: '2026-04-10' },
    ],
    last_updated: '2026-04',
  },

  sub_paths: [
    {
      name: 'Quant developer (production-systems engineering)',
      description: 'Writes the production trading software — low-latency C++, exchange-protocol parsers, order management systems. Most common entry point. Heavy software engineering, lighter math.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Quant researcher',
      description: 'Generates and tests trading hypotheses using statistical + ML methods. PhD-track common; MS in stats / financial engineering / CS-with-strong-math also viable. The highest-paid sub-path at top firms.',
      ai_exposure_5y: 'low',
      income_vs_median: 'much_higher',
    },
    {
      name: 'Quant trader',
      description: 'Operates trading strategies in production, monitors performance, handles edge cases. Smaller subset of roles. Requires comfort with intra-day risk + decision-making under uncertainty.',
      ai_exposure_5y: 'low',
      income_vs_median: 'higher',
    },
    {
      name: 'Risk quant',
      description: 'Builds models that measure + control trading risk. Common at investment banks. Less glamorous than research / trading but more stable.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Sell-side quant (bank-based)',
      description: 'Quant roles at investment banks (Goldman, Morgan Stanley, JP Morgan, Citi). Salary-heavy compensation, more stable, somewhat lower ceiling than HFT / hedge funds.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'lower',
    },
  ],

  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'low', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'Quant work is one of the more AI-resistant tech careers because the value is in PROPRIETARY research + low-latency execution — both genuinely hard for general AI ' +
      'tools to replicate. Quant firms are themselves among the heaviest AI users; this is more of a "AI augments quants" story than "AI replaces quants". The role\'s ' +
      'deeper risk is not AI — it\'s market regime changes that obsolete whole strategies, plus firm-level survival risk (HFT firms close down regularly when their ' +
      'edge erodes).',
    what_doesnt_compress: [
      'Generating novel research hypotheses + iterating on them with judgment.',
      'Designing low-latency systems that operate at microsecond margins.',
      'Understanding market microstructure + exchange-specific quirks.',
      'Risk management decisions in real-time under pressure.',
      'Translating between trading floor needs + engineering reality.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: Financial services)', accessed_date: '2026-02-20' },
      { type: 'ai_exposure', label: 'Editorial — interviews with 4 working quants on AI integration + threat assessment', accessed_date: '2026-04-10' },
    ],
  },

  moat_skills: [
    {
      skill: 'Probability + statistics fluency well beyond textbook level.',
      why_it_matters:
        'The defining skill of quant work. Engineers who deeply understand probability — Bayes\' theorem under pressure, distributions and their tails, conditional ' +
        'expectations, stochastic processes — pass interview rounds that filter out 80 % of applicants. AI tools don\'t replace this; they amplify it for people who have it.',
      how_to_build_in_college:
        'Take probability + stats + stochastic processes seriously in years 1-3. Work through "Probability and Random Processes" by Grimmett + Stirzaker or equivalent. ' +
        'By graduation, you should be able to solve "two random variables, conditional expectation, what\'s the variance" problems in your sleep. Practice with quant ' +
        'interview question banks (Heard on the Street, Quant Job Interview Questions and Answers).',
    },
    {
      skill: 'Low-latency C++ — for quant developer roles.',
      why_it_matters:
        'HFT firms run their trading software in C++. Engineers who can write tight, cache-friendly, lock-free C++ — and read OTHER people\'s C++ at scale — pass technical ' +
        'rounds that pure-Python engineers can\'t. Modern C++ (C++17 / 20) is a meaningfully different skill than Python.',
      how_to_build_in_college:
        'Take a serious systems / OS course where you write C++. Work through Scott Meyers "Effective Modern C++" + "C++ Concurrency in Action" by Anthony Williams. ' +
        'Build at least one project where you optimise from "slow C++" to "1000x faster C++" — the experience teaches caching + branch prediction + memory layout viscerally.',
    },
    {
      skill: 'Reading + reproducing quant research papers + classic textbooks.',
      why_it_matters:
        'The quants who progress past entry-level are the ones who can read a research paper from the Journal of Finance or QF and figure out whether it\'s actually ' +
        'useful in production. This is a synthesis skill — math + engineering judgment + market understanding.',
      how_to_build_in_college:
        'Read "Active Portfolio Management" (Grinold + Kahn) and "Advances in Financial Machine Learning" (López de Prado). Reproduce 2-3 simple quant strategies from ' +
        'academic papers (momentum, mean reversion, basic factor models). Publish writeups on GitHub. By graduation you should have a small portfolio that signals genuine ' +
        'interest, not just "I want a high-paying job".',
    },
    {
      skill: 'Comfort with ambiguity + speed under pressure.',
      why_it_matters:
        'Quant interview rounds + the actual job both feature problems where there\'s no clean answer + you have to make a decision under time pressure. Engineers who freeze ' +
        'under ambiguity don\'t pass quant interviews. The skill is genuinely trainable but you have to lean into it deliberately.',
      how_to_build_in_college:
        'Compete in math olympiads / Putnam-style competitions if accessible. Practice timed quant interview questions — set a 90-second timer + see whether you can ' +
        'articulate a reasonable answer even when uncertain. The discipline of "good fast answer beats no answer" is itself the skill.',
    },
  ],

  educational_path: {
    primary_degrees: ['B.Tech Mathematics & Computing (any IIT)', 'B.Tech CSE with strong math performance', 'B.Tech ECE with strong math performance', 'MS / PhD Statistics / Financial Engineering / Operations Research'],
    alternative_degrees: ['BSc / MSc Statistics', 'Math + Stats double major (international universities)', 'Direct entry from a strong financial-engineering masters program'],
    target_colleges: {
      stretch: ['IIT Bombay / Delhi / Madras / Kharagpur — M&C is the most quant-relevant', 'IIT CSE with math electives', 'CMI Chennai (mathematical sciences focus)', 'ISI Kolkata / Bangalore'],
      realistic: ['Top NITs CSE / ECE with strong math performance', 'BITS Pilani Math + CS dual', 'IIIT Hyderabad with focused quant prep'],
      accessible: ['Any decent CS / math degree + heavy self-driven quant interview prep + 1-2 quant internships'],
    },
    minimum_viable_path:
      'Any decent math-heavy engineering degree + 12+ months of focused quant interview prep + serious portfolio of reproduced quant strategies + 1-2 internships at ' +
      'quant firms during years 3-4. Unusual path but has happened: students from non-IIT colleges have broken into HFT firms via excellent interview performance + ' +
      'portfolio + cold outreach. The entry bar is genuinely high for top firms but somewhat lower for sell-side bank quant roles.',
    what_to_do_in_college: [
      'Year 1-2: Math + stats + CS fundamentals deeply. CP if accessible (CodeChef, Codeforces) — most quant firms care about CP background.',
      'Year 3: Apply to quant firm internships aggressively — Tower Research, Jane Street, Optiver, Da Vinci all run intern programs. Internship is the dominant entry path.',
      'Year 4: Convert internship to return offer OR apply directly. Interview prep should consume 200+ hours minimum — most candidates underestimate this. Practise math problems on whiteboard.',
      'Throughout: read books mentioned above, build a small portfolio of reproduced strategies, keep CP rating reasonable, maintain CGPA (top firms screen on CGPA).',
    ],
    time_to_first_real_income: 4,
  },

  cons: [
    {
      issue: 'Entry is genuinely narrow.',
      explanation:
        '~200-300 entry-level quant roles in India per year against ~5,000+ serious applicants. Even strong candidates from top IITs get rejected. Plan for this — have ' +
        'a backup plan (SWE or MLE or data engineering offer) before you commit fully to quant interviewing. Don\'t treat quant as your default; treat it as your ' +
        'stretch with a real fallback.',
    },
    {
      issue: 'Compensation varies dramatically by firm — the top 3-4 pay 2-3x the bottom 3-4.',
      explanation:
        'Within the "quant" job title, working at a top HFT firm vs a mid-tier sell-side desk is the difference between ₹50L and ₹15L entry comp. Research which firm ' +
        'is actually paying what BEFORE accepting offers. Glassdoor + Levels.fyi + Quora threads + cold-outreach to current employees are all useful.',
    },
    {
      issue: 'Firm survival risk is real.',
      explanation:
        'HFT firms close, reorganise, or downsize teams more frequently than software companies. Even good firms have years where they shed 30 % of headcount. A 10-year ' +
        'quant career might involve 2-3 firm changes — sometimes by choice, sometimes not. Compare to SWE-product where job mobility is a feature, here it can be a ' +
        'forced reality.',
    },
    {
      issue: 'The work is mentally demanding in a sustained way.',
      explanation:
        'Quants think hard for a living. Engineers who like to "vibe code" or do straightforward CRUD work find quant exhausting. The intellectual intensity is part of ' +
        'the appeal for the right person, but it\'s real — burnout rates are higher than in standard product engineering.',
    },
    {
      issue: 'Geography is concentrated in Bangalore + Mumbai.',
      explanation:
        'Outside these two cities, real quant roles are rare. If you cannot relocate, plan accordingly. Sell-side quant roles at investment banks have slightly more ' +
        'geographic diversity (Pune, Hyderabad teams exist) but the HFT employers are nearly entirely Bangalore + Mumbai.',
    },
  ],

  india_context: {
    geographic_concentration: 'Bangalore (Tower Research, Optiver, Da Vinci, Jane Street, Indian fintech quants) + Mumbai (Goldman, Morgan Stanley, JP Morgan, Citadel India, Indian HFT firms).',
    remote_work_feasibility: 'low',
    english_requirement: 'high',
    family_capital_required: 'low',
    typical_first_job_city: ['Bangalore', 'Mumbai', 'Hyderabad', 'Pune'],
  },

  adjacent_careers: [
    { career_slug: 'ml-engineer', why_its_a_natural_pivot: 'Many quant researchers pivot to ML engineering at tech companies — same math + programming foundation, lower variance, broader geography.' },
    { career_slug: 'software-engineer-product', why_its_a_natural_pivot: 'Quant developers (engineering-track) pivot to SWE-product readily — the C++ + systems skills transfer. Lower comp but broader career flexibility.' },
    { career_slug: 'data-engineer', why_its_a_natural_pivot: 'Risk quants + sell-side quants who decide finance isn\'t for them pivot to data engineering — overlapping data + systems skills.' },
  ],

  example_paths: [
    {
      college_tier: 'top_iit',
      college_to_first_job:
        'IIT Bombay Mathematics & Computing. Strong CP background (4-star CodeChef). Internship at Tower Research Mumbai in year 3. Return offer for quant developer role.',
      where_now: 'Senior quant developer at Tower Research, 5 years experience',
      income_range: '₹1.2-1.8 Cr total comp (base + bonus)',
      one_decision_that_mattered: 'Picking M&C over CSE in undergraduate — M&C\'s heavier math content was the credential that signalled real quant readiness in interviews.',
    },
    {
      college_tier: 'top_iit',
      college_to_first_job:
        'IIT Madras CSE. Strong math performance (CGPA 9.5+, math electives). Spent 300+ hours on quant interview prep + Project Euler + Putnam-style problems. ' +
        'Internship at Jane Street Hong Kong + summer internship at Da Vinci Bangalore in year 3.',
      where_now: 'Quant researcher at Da Vinci Trading Bangalore, 3 years experience',
      income_range: '₹70L-1.2 Cr total comp (heavy bonus variance)',
      one_decision_that_mattered: 'Pivoting from a CSE-default research-engineer trajectory to quant researcher specifically at year 3, after one quant internship made clear the intellectual fit was right.',
    },
    {
      college_tier: 'top_nit',
      college_to_first_job:
        'NIT Trichy CSE. CGPA 9.3, strong CP background. Did NOT get a quant internship in year 3 despite trying. Spent 8 months in year 4 on intensive quant interview ' +
        'prep + reproduced 3 quant strategies on GitHub. Got into a sell-side quant role at a Mumbai bank on the 4th application attempt.',
      where_now: 'Quant analyst at a Mumbai investment bank, 2 years experience',
      income_range: '₹25-35L total comp',
      one_decision_that_mattered: 'Accepting that sell-side bank quant work was a legitimate entry point even though it pays less than HFT — the experience and exit options after 2-3 years matter more than entry pay.',
    },
  ],

  sources: [
    { type: 'salary', label: 'Levels.fyi India quant developer / analyst bands — Q1 2026', accessed_date: '2026-04-18' },
    { type: 'salary', label: 'Glassdoor + Quora industry threads on Tower Research / Jane Street / Citadel India 2024-2026', accessed_date: '2026-04-12' },
    { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: Financial services)', accessed_date: '2026-02-20' },
    { type: 'career_path', label: 'Editorial — interviews with 4 working quants across HFT / sell-side / hedge fund roles in Mumbai + Bangalore', accessed_date: '2026-04-10' },
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
