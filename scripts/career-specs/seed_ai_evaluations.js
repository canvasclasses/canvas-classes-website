#!/usr/bin/env node
/**
 * Seed: AI evaluations / safety engineer.
 * Status: published. crossover / emerging.
 * The clearest "new career that didn't exist 24 months ago" in the catalog.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'ai-evaluations-engineer',
  display_name: 'AI evaluations / safety engineer',
  category: 'crossover',
  archetype: 'emerging',
  linked_career_path_slug: undefined,
  one_line: 'Figure out how to know if AI systems actually work — design benchmarks, run red-teams, evaluate behaviour at scale.',
  what_it_is_today:
    'An AI evaluations / safety engineer designs and runs the tests that determine whether AI systems behave as intended. The work splits across ' +
    'building evaluation harnesses (automated test suites for LLM outputs), red-teaming (deliberately trying to break models to find failure modes), ' +
    'safety research (alignment + robustness + interpretability work), and AI policy translation (turning regulatory + corporate-policy requirements ' +
    'into testable specifications). This career barely existed before 2023. By 2026 it has ~500-800 open positions across India — at Anthropic / ' +
    'OpenAI / DeepMind India captives, at Indian AI labs (Sarvam, Krutrim, Ai4Bharat), at applied-AI startups shipping LLM products, and at large ' +
    'product companies\' trust + safety teams. It is the clearest "new career" in the catalog.',
  what_parents_think_it_is:
    'Parents almost certainly haven\'t heard of this career — it didn\'t exist when they were forming their career model of the world. The closest ' +
    'mental model they might have is "QA tester for AI" which is wildly under-selling the work. Modern AI evaluation requires deep ML understanding + ' +
    'statistical rigour + creative attack-thinking + policy fluency. Compensation matches strong ML engineering at frontier labs.',
  common_misconceptions: [
    '"It\'s just QA testing for AI." Far from it. AI eval requires statistical thinking, ML depth, and creative thinking about failure modes that QA doesn\'t need.',
    '"It\'s a fad — will disappear in 2-3 years." Unlikely. Regulatory pressure (EU AI Act, US AI executive orders, India\'s draft AI policies) is creating structural demand. Even if specific techniques become obsolete, the discipline is becoming permanent.',
    '"You need to be at OpenAI / Anthropic to do this." False. Every company shipping LLM products to real users needs eval engineers. India has 100+ companies hiring for this in 2026.',
    '"It\'s not as prestigious as ML research." Misconception. Evals roles at frontier AI labs are among the most respected technical positions there — directly tied to whether products ship.',
    '"You need a PhD." For deep safety research, sometimes. For applied evaluations engineering, no. Strong ML + creative thinking + writing is enough.',
  ],
  income: {
    year_1:  { p25: 18, median: 30, p75: 55 },
    year_5:  { p25: 45, median: 80, p75: 140 },
    year_10: { p25: 80, median: 140, p75: 260 },
    notes:
      'Compensation is genuinely high for an emerging career — comparable to or above standard ML engineering. The reason: the talent pool is tiny + the ' +
      'work is mission-critical for AI labs. Top quartile is dominated by Indian arms of frontier AI labs (Anthropic India captive, etc.) with significant ' +
      'cash + equity packages. Standard product company trust + safety roles sit at p25-median. Pay correlates heavily with employer prestige.',
    sources: [
      { type: 'salary', label: 'Levels.fyi India ML / AI safety engineer bands — Q1 2026', accessed_date: '2026-04-18' },
      { type: 'salary', label: 'Editorial — interviews with 3 working evals engineers (Anthropic India contractor, Indian AI lab, applied AI startup)', accessed_date: '2026-04-09' },
    ],
    last_updated: '2026-04',
  },
  sub_paths: [
    { name: 'Applied evals engineer', description: 'Builds automated evaluation harnesses for shipped AI products. Designs benchmarks, runs eval suites, tracks model performance over time. Largest sub-path by headcount.', ai_exposure_5y: 'low', income_vs_median: 'similar' },
    { name: 'Red-teamer / AI security researcher', description: 'Tries to break AI systems — prompt injection, jailbreaks, finding harmful outputs. Creative + adversarial work. Smaller sub-path, often contract / project-based.', ai_exposure_5y: 'low', income_vs_median: 'higher' },
    { name: 'Alignment / safety researcher', description: 'Works on fundamental safety problems — interpretability, RLHF, scalable oversight. PhD-track common. Concentrated at frontier AI labs.', ai_exposure_5y: 'low', income_vs_median: 'much_higher' },
    { name: 'Trust + safety engineer', description: 'Sits at product companies (not AI labs) building moderation systems, content policy enforcement, abuse detection. More platform-engineering shaped.', ai_exposure_5y: 'moderate', income_vs_median: 'similar' },
    { name: 'AI policy / governance analyst', description: 'Translates AI regulations + corporate policies into testable engineering requirements. Hybrid policy + technical role. Rare but growing as AI regulation matures.', ai_exposure_5y: 'low', income_vs_median: 'similar' },
  ],
  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'low', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'AI evals is unusually AI-resistant because the work is fundamentally about deciding whether AI is good enough — a judgment + adversarial-thinking ' +
      'process that needs human stakeholders. AI tools accelerate parts of eval (generating test cases, auto-grading outputs) but the harder work — ' +
      'deciding WHAT to evaluate, designing benchmarks that aren\'t gamed, identifying novel failure modes — is structurally human. The career\'s deeper ' +
      'risk isn\'t AI replacement; it\'s that specific techniques + benchmarks become obsolete every 2-3 years, requiring continuous reskilling.',
    what_doesnt_compress: [
      'Designing benchmarks that resist gaming + reward-hacking.',
      'Identifying novel failure modes that automated eval can\'t spot.',
      'Translating regulatory + business requirements into testable specifications.',
      'Communicating risk + uncertainty to non-technical decision-makers.',
      'Creative adversarial thinking — finding the prompt or context that breaks the model.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'Anthropic / OpenAI / DeepMind safety publications + research bulletins 2024-2026', accessed_date: '2026-03-15' },
      { type: 'ai_exposure', label: 'Editorial — evals engineer interviews on AI integration trajectory', accessed_date: '2026-04-09' },
    ],
  },
  moat_skills: [
    {
      skill: 'Statistical evaluation methodology — designing tests that actually measure what you claim.',
      why_it_matters: 'The single most-leveraged skill in evals. Engineers who can design benchmarks that resist gaming + spot statistical artifacts + compute proper confidence intervals separate themselves from people who just run prompts + count outputs.',
      how_to_build_in_college: 'Take statistics + experimental design seriously. Read OpenAI\'s + Anthropic\'s eval methodology papers (publicly available). Design + run at least one rigorous evaluation of an open-source model during college — document your methodology.',
    },
    {
      skill: 'Creative adversarial thinking — finding ways to break things.',
      why_it_matters: 'Red-teaming and finding novel failure modes requires a specific mental skill: the ability to think like an attacker. This is hard to teach + slow to develop. Engineers who naturally enjoy "breaking" things have a real edge.',
      how_to_build_in_college: 'Practice red-teaming open models — try to make them produce harmful / inconsistent / off-policy outputs. Read AI security research (Anthropic\'s red-teaming work, OpenAI safety reports). Document creative jailbreak attempts in writeups.',
    },
    {
      skill: 'ML + LLM fundamentals at depth.',
      why_it_matters: 'You cannot evaluate what you don\'t understand. Evals engineers without real ML background end up running surface-level tests that miss the deeper failure modes. Statistical + ML depth is foundational.',
      how_to_build_in_college: 'Treat this like becoming an ML engineer — same math + statistics + Python + PyTorch foundations. The difference is you also need to read alignment / safety research papers. Aim for 10+ alignment papers read by graduation.',
    },
    {
      skill: 'Writing — clearly + persuasively under uncertainty.',
      why_it_matters: 'Evals engineers write a lot — eval reports, model cards, risk assessments, regulatory submissions. The work\'s value is partly its communicability. Engineers who write well advance to lead roles; those who don\'t plateau.',
      how_to_build_in_college: 'Write at least 8-10 detailed model-evaluation reports during college on open-source LLMs. Read Anthropic\'s + DeepMind\'s safety papers as writing examples. Practice writing for both technical + non-technical audiences.',
    },
  ],
  educational_path: {
    primary_degrees: ['B.Tech CSE with strong ML focus', 'B.Tech AI / ML', 'BSc / MSc Statistics', 'B.Tech Mathematics & Computing'],
    alternative_degrees: ['PhD in ML / NLP for deep alignment research roles', 'B.Tech (any branch) + serious self-driven ML + safety research portfolio'],
    target_colleges: {
      stretch: ['IIT Bombay / Delhi / Madras CSE', 'IIIT Hyderabad', 'IISc Bangalore (MS / PhD route)', 'BITS Pilani CSE'],
      realistic: ['IIIT Delhi / Bangalore', 'NIT Trichy / Warangal CSE', 'DTU / NSUT CSE'],
      accessible: ['Any decent CS degree + 12+ months of focused alignment / safety self-study + 3-5 evaluation projects + active community presence'],
    },
    minimum_viable_path:
      'Any decent CS degree + serious ML foundations + 3-5 public AI evaluation projects + active engagement with the alignment / safety research community ' +
      '(LessWrong / Alignment Forum / EleutherAI Discord). The community is unusually open to entry-level contributors who do real work. Has been done from ' +
      'mid-tier colleges via portfolio + community engagement.',
    what_to_do_in_college: [
      'Year 1-2: Build ML foundations as if becoming an ML engineer. Maths + stats + Python deeply.',
      'Year 3: Start reading alignment / safety papers. Reproduce 2-3 eval methodologies on open models. First internship at a company doing real AI evals or trust + safety.',
      'Year 4: Convert to return offer OR apply broadly to AI labs + applied AI startups. Have a portfolio of 4-5 public eval projects + 2-3 blog posts on AI safety topics.',
      'Throughout: engage with the alignment community. Apply for ML alignment fellowships (MATS, ML4Good India, etc.) — these are real entry pathways.',
    ],
    time_to_first_real_income: 4,
  },
  cons: [
    {
      issue: 'The career is genuinely new + somewhat unstable as a discipline.',
      explanation: 'The role and its tooling are still evolving. Today\'s eval frameworks may be obsolete in 3 years. Engineers in this career need to be comfortable with constant retooling + ambiguity about "what the role is" at different companies.',
    },
    {
      issue: 'Talent pool is small + interviewing is unpredictable.',
      explanation: 'Because the discipline is new, companies don\'t have settled interview processes. Some companies hire on prestige (PhD + paper); some on portfolio; some on raw ML skill. Be prepared for variance in what gets you hired vs rejected.',
    },
    {
      issue: 'Geography is concentrated even more than ML engineering.',
      explanation: '~90 % of real AI evals roles in India are in Bangalore + Hyderabad. Outside these, the field is essentially absent. If you cannot move, this career is much harder.',
    },
    {
      issue: 'The work can be morally + psychologically demanding.',
      explanation: 'Evals + red-teaming often involve looking at harmful AI outputs all day — biased, toxic, dangerous content as research material. The emotional toll is real + not always acknowledged. Some people find it engaging; others find it draining.',
    },
    {
      issue: 'Career mobility is narrow — evals is a niche.',
      explanation: 'Lateral pivots from evals to other careers are real but require significant retraining. You can pivot to ML engineering (closest), trust + safety at product companies, or AI policy. Standard SWE / data engineering pivots require more retraining.',
    },
  ],
  india_context: {
    geographic_concentration: 'Bangalore (heaviest — frontier AI lab captives + Indian AI labs + applied AI startups) + Hyderabad. Some Delhi (for AI policy adjacent roles).',
    remote_work_feasibility: 'medium',
    english_requirement: 'high',
    family_capital_required: 'low',
    typical_first_job_city: ['Bangalore', 'Hyderabad', 'Mumbai', 'Delhi'],
  },
  adjacent_careers: [
    { career_slug: 'ml-engineer', why_its_a_natural_pivot: 'The most adjacent career. Evals engineers can pivot to general ML engineering readily; the underlying skills overlap heavily.' },
    { career_slug: 'software-engineer-product', why_its_a_natural_pivot: 'For evals engineers who decide the niche is too narrow — backend / platform SWE roles use the same systems skills.' },
    { career_slug: 'data-engineer', why_its_a_natural_pivot: 'For evals engineers tired of the policy + adversarial-thinking side — data engineering uses the same Python + statistics foundation, broader market.' },
  ],
  example_paths: [
    {
      college_tier: 'top_iit',
      college_to_first_job: 'IIT Madras CSE with strong ML research focus. Reproduced 5 alignment-research papers during 4th year. Applied to + got into MATS (ML Alignment + Theory Scholars) program. Joined Anthropic India captive after MATS.',
      where_now: 'Research engineer (evals + safety) at Anthropic India, 2 years experience',
      income_range: '₹80L-1.2Cr cash + meaningful equity',
      one_decision_that_mattered: 'Applying to MATS in year 4 — the fellowship was the credential that converted an IIT-CSE resume into a frontier-AI-lab hire.',
    },
    {
      college_tier: 'top_nit',
      college_to_first_job: 'NIT Trichy CSE. Self-driven ML safety study during years 3-4. Built 5 public evaluation projects on open-source LLMs. Wrote 8 blog posts on AI safety topics. Joined an Indian AI lab as a junior evals engineer.',
      where_now: 'Evals engineer at an Indian AI lab (foundation-model company), 3 years experience',
      income_range: '₹30-45L cash + ESOPs',
      one_decision_that_mattered: 'Publishing public evaluation work + blog posts during college — the visibility was what got him interview calls at AI labs that wouldn\'t have considered a non-IIT resume otherwise.',
    },
    {
      college_tier: 'iiit',
      college_to_first_job: 'IIIT Bangalore CSE. ML-focused coursework + active in LessWrong / Alignment Forum during college. Internship at an applied AI startup\'s trust + safety team in year 4. Return offer.',
      where_now: 'Trust + safety AI engineer at an Indian applied AI startup, 2 years experience',
      income_range: '₹22-32L cash + ESOPs',
      one_decision_that_mattered: 'Engaging with the alignment community early — by year 4 she was already known to people in the field via online conversations, which made applications + referrals significantly easier.',
    },
  ],
  sources: [
    { type: 'salary', label: 'Levels.fyi India ML / AI safety engineer bands — Q1 2026', accessed_date: '2026-04-18' },
    { type: 'job_market', label: 'LinkedIn + Anthropic + OpenAI India hiring trends 2024-2026', accessed_date: '2026-03-22' },
    { type: 'ai_exposure', label: 'Anthropic / OpenAI / DeepMind safety publications 2024-2026', accessed_date: '2026-03-15' },
    { type: 'career_path', label: 'Editorial — interviews with 3 working evals engineers across frontier-lab captive / Indian AI lab / applied AI startup', accessed_date: '2026-04-09' },
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
