#!/usr/bin/env node
/**
 * Seed: Robotics + automation engineer.
 * Status: published. engineering / transforming.
 * First Mech-branch coverage in the catalog.
 *
 * Usage:
 *   node scripts/career-specs/seed_robotics.js           # dry run
 *   node scripts/career-specs/seed_robotics.js --apply   # upsert
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'robotics-engineer',
  display_name: 'Robotics + automation engineer',
  category: 'engineering',
  archetype: 'transforming',
  linked_career_path_slug: undefined,
  one_line: 'Build the machines that move physical stuff — warehouse robots, factory automation, mobile platforms, manipulation arms.',
  what_it_is_today:
    'A robotics + automation engineer designs and ships systems that interact with the physical world — from warehouse picking robots ' +
    '(Addverb, GreyOrange) to industrial assembly automation (Tata, Mahindra factories) to autonomous mobile platforms (Ati Motors, EMotorad). ' +
    'The work splits into mechanical design, robot perception (computer vision + sensors), motion planning, control systems, and increasingly ' +
    'AI-augmented manipulation. In 2026 India has a genuinely growing robotics scene driven by warehouse e-commerce (Flipkart, Amazon India ' +
    'spend big here) and the slow manufacturing-renaissance under PLI schemes. It\'s smaller than the SWE market but real, and one of the few ' +
    'careers where a Mechanical Engineering degree leads somewhere genuinely modern.',
  what_parents_think_it_is:
    'Parents either picture sci-fi humanoids ("you\'ll build Iron Man\'s suit") or assume robotics is the same career L&T offered in 1995 ' +
    '("you\'ll work in a factory floor managing assembly lines"). Both are wrong. Modern robotics is a hybrid software + mechanical + ML career ' +
    'that pays competitive tech salaries, sits in office buildings with development labs, and ships products to e-commerce / manufacturing / ' +
    'logistics customers.',
  common_misconceptions: [
    '"Robotics = humanoid robots." Most robotics jobs in India are wheeled / arm-based industrial systems. Humanoid work happens at maybe 2-3 research labs.',
    '"You need a PhD." For research labs — often. For applied robotics engineering — no. Strong CS + control systems + a portfolio of working robots is enough.',
    '"It\'s just mechanical engineering with extra steps." Modern robotics is increasingly software-heavy. The mechanical work matters, but software + ML + perception dominate the hours.',
    '"India doesn\'t make robots." Addverb, GreyOrange, Ati Motors, Bharat Forge automation are real Indian companies shipping real robots. Plus Indian arms of NVIDIA Isaac, ABB, Siemens, Bosch.',
    '"AI will automate robotics jobs away." The opposite — AI is the unlock that makes more robotics jobs possible. Manipulation that was impossible in 2020 is shippable in 2026.',
  ],
  income: {
    year_1:  { p25: 6,  median: 10, p75: 18 },
    year_5:  { p25: 16, median: 28, p75: 50 },
    year_10: { p25: 32, median: 50, p75: 95 },
    notes:
      'Entry pay is below pure-software roles because the talent pool is more accessible (mech students with software skills are common). ' +
      'p75 catches up at year 5+ for engineers at NVIDIA Isaac, Addverb senior tracks, and the few Indian robotics startups with US-tier funding. ' +
      'Government / PSU robotics roles (BARC, DRDO, ISRO) sit at p25 with strong job stability but limited career mobility.',
    sources: [
      { type: 'salary', label: 'AmbitionBox robotics / automation engineer listings — Q1 2026', accessed_date: '2026-04-12' },
      { type: 'salary', label: 'Editorial — 4 interviews with robotics engineers across Addverb / GreyOrange / NVIDIA Isaac / a Mumbai automation startup', accessed_date: '2026-04-10' },
    ],
    last_updated: '2026-04',
  },
  sub_paths: [
    { name: 'Robotics software engineer', description: 'Owns the software stack on top of robot hardware — ROS, perception, motion planning, behaviour trees. Closest sub-path to general SWE.', ai_exposure_5y: 'moderate', income_vs_median: 'higher' },
    { name: 'Perception / robot vision engineer', description: 'Computer vision + sensor fusion for robots. Heavy ML, often pivots between robotics and self-driving / vision teams.', ai_exposure_5y: 'low', income_vs_median: 'higher' },
    { name: 'Motion planning + controls engineer', description: 'Plans paths, controls actuators, tunes feedback loops. Heavy math (kinematics, dynamics, optimal control). Most AI-resistant sub-path.', ai_exposure_5y: 'low', income_vs_median: 'similar' },
    { name: 'Industrial automation engineer', description: 'PLCs, factory floor systems, conveyor + arm integration at manufacturing customers. Closer to traditional automation than to modern robotics.', ai_exposure_5y: 'moderate', income_vs_median: 'lower' },
    { name: 'Mechanical design engineer (robot hardware)', description: 'Designs the physical robot — arms, grippers, mobile platforms, end effectors. CAD-heavy, often paired with manufacturing engineering.', ai_exposure_5y: 'low', income_vs_median: 'similar' },
  ],
  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'low', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'Robotics is unusually AI-resistant because the work is fundamentally about acting in the physical world — sensors, actuators, latency, ' +
      'safety, mechanical reality. AI accelerates parts of robotics (perception, manipulation policy learning, simulation) but increases the ' +
      'TOTAL amount of robotics work because it expands what robots can do. The risk on a 10-year horizon is genuinely uncertain — if general-' +
      'purpose foundation models for robotics materialise, some roles compress. But the physical-world value-add is durable.',
    what_doesnt_compress: [
      'Designing physical systems that survive real-world mechanical wear.',
      'Debugging robot behaviour when simulator-trained policies fail in the real world (the sim-to-real gap).',
      'Safety analysis — when can the robot move near humans, and how do we prove it?',
      'Integration with factory / warehouse customer infrastructure (often messy + legacy).',
      'Cross-team coordination between mechanical / electrical / software / customer.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'NVIDIA Isaac platform briefings + robotics-foundation-model papers 2024-2026', accessed_date: '2026-03-18' },
      { type: 'ai_exposure', label: 'Editorial — robotics engineer interviews on AI-augmented vs AI-replaced trajectory', accessed_date: '2026-04-10' },
    ],
  },
  moat_skills: [
    {
      skill: 'ROS / ROS2 fluency at the systems level.',
      why_it_matters: 'The dominant middleware for modern robotics. Engineers who can read + extend a ROS stack debug 5x faster than those who can only write nodes.',
      how_to_build_in_college: 'Build at least 2 ROS projects on real or simulated robots (Gazebo, Isaac Sim). By year 4 you should have a public GitHub repo with a fully-working robot demo (mobile robot navigating an environment, or arm picking objects).',
    },
    {
      skill: 'Control systems + linear algebra intuition.',
      why_it_matters: 'The math foundation of motion planning + feedback control. Engineers who deeply understand state-space + LQR + MPC stay relevant across robotics paradigms (classical → modern → ML-augmented).',
      how_to_build_in_college: 'Take controls + linear systems courses seriously in years 2-3. Read Steven LaValle\'s "Planning Algorithms" (free online) for motion planning fundamentals. Implement at least one MPC controller from scratch.',
    },
    {
      skill: 'Computer vision + sensor processing fluency.',
      why_it_matters: 'Robots without perception are toys. The engineers who can take raw camera + LiDAR + IMU data and produce robust world models are scarce + paid accordingly.',
      how_to_build_in_college: 'Take an image processing / computer vision course. Build at least one project that fuses 2+ sensor types — e.g. camera + IMU for visual-inertial odometry. Practice with OpenCV + PyTorch.',
    },
    {
      skill: 'Comfort across mechanical / electrical / software boundaries.',
      why_it_matters: 'The robotics engineers who lead teams are the ones who can talk to mech engineers about gear ratios + electrical engineers about motor drivers + software engineers about ROS nodes. Single-domain depth is fine for IC roles; cross-domain breadth unlocks leadership.',
      how_to_build_in_college: 'Take at least one course outside your primary discipline. If CS, take a mechatronics course. If Mech, take a real systems / OS course. Build hobby robots that force you across boundaries.',
    },
  ],
  educational_path: {
    primary_degrees: ['B.Tech Mechanical', 'B.Tech Mechatronics', 'B.Tech CSE (with robotics specialisation)', 'B.Tech ECE / EE (with controls focus)', 'M.Tech / MS Robotics / Control Systems'],
    alternative_degrees: ['B.Tech Aerospace', 'B.Tech Production / Manufacturing', 'B.Tech Industrial Automation'],
    target_colleges: {
      stretch: ['IIT Madras (M.Tech Robotics)', 'IIT Bombay Mechanical / EE', 'IIT Kanpur EE / CSE', 'IISc Robotics + Centre for Cyber-Physical Systems'],
      realistic: ['NIT Trichy / Surathkal / Warangal Mech / Mechatronics', 'IIIT Hyderabad Robotics Research Centre', 'College of Engineering Pune (COEP) Mechatronics'],
      accessible: ['Any decent Mech / Mechatronics degree + serious portfolio of robotics projects + 1 internship at an Indian robotics company'],
    },
    minimum_viable_path:
      'Any reasonable Mech / Mechatronics / EE / ECE degree + 2-3 robotics projects on ROS / Arduino / Raspberry Pi + 1 internship at an Indian robotics company ' +
      '(Addverb, GreyOrange, Ati Motors, etc.) + comfort with Python + a 1-2-page writeup per project. Hiring bar is moderate — not as competitive as SWE-product, ' +
      'and the supply of "Mech students who can actually code" is genuinely thin so you stand out fast.',
    what_to_do_in_college: [
      'Year 1-2: Build CAD + basic electronics fluency. Take controls + linear algebra seriously. Join a robotics club, even a small one.',
      'Year 3: Pick a sub-discipline (perception, planning, controls, mechanical). Build 1-2 substantial robotics projects. Try for an internship at a robotics company.',
      'Year 4: Convert internship to full-time OR apply broadly to robotics startups. Have 1 working public robotics demo on GitHub by graduation.',
      'Throughout: Mechanical engineering students with software skills are unusually valuable. Don\'t skip programming because "I\'m a mech student".',
    ],
    time_to_first_real_income: 4,
  },
  cons: [
    {
      issue: 'India market is meaningfully smaller than US / China.',
      explanation: 'Roughly 5,000-8,000 robotics-relevant jobs in India total in 2026 — compared to maybe 80,000+ in the US. Career mobility is real but the universe of employers is smaller, which means switching companies sometimes requires changing cities.',
    },
    {
      issue: 'Hardware delivery cycles are slow + frustrating.',
      explanation: 'A robotics project that ships in 18 months is fast. Mechanical iterations alone take weeks. Engineers used to software\'s "deploy in an hour" rhythm find robotics genuinely slow.',
    },
    {
      issue: 'Most "robotics" startups don\'t survive.',
      explanation: 'Hardware-first robotics companies have higher failure rates than software startups. If you join an early-stage robotics startup, plan for the company-pivot or shutdown as a realistic outcome within 3-5 years.',
    },
    {
      issue: 'Cross-discipline work means you\'re sometimes the only one in the room with full context.',
      explanation: 'Robotics teams are smaller + more cross-functional than software teams. As an IC, you\'ll often be the only person who understands a problem across mech + electrical + software boundaries. This is energising for some, isolating for others.',
    },
    {
      issue: 'Pay ceiling somewhat lower than top-tier ML / SWE.',
      explanation: 'A robotics engineer at year 10 in India typically caps at ~₹70-100L total comp. Compare to ML-engineering / SWE-product where ₹1.5Cr+ is realistic. The trade-off is the work is more durable and AI-resistant.',
    },
  ],
  india_context: {
    geographic_concentration: 'Bangalore (heaviest) + Hyderabad + Pune + Chennai. Some Mumbai for industrial automation customers.',
    remote_work_feasibility: 'low',
    english_requirement: 'medium',
    family_capital_required: 'low',
    typical_first_job_city: ['Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai'],
  },
  adjacent_careers: [
    { career_slug: 'ml-engineer', why_its_a_natural_pivot: 'Robotics perception + manipulation engineers pivot to ML / computer-vision roles readily. Often higher-paid + broader geography.' },
    { career_slug: 'software-engineer-product', why_its_a_natural_pivot: 'Robotics software engineers can switch to SWE-product if the hardware pace becomes frustrating. Most of the systems-engineering skill transfers.' },
    { career_slug: 'semiconductor-engineer', why_its_a_natural_pivot: 'For robotics engineers interested in custom chips (NPUs for robotics, sensor SoCs) — pivot is possible but requires real retraining.' },
  ],
  example_paths: [
    {
      college_tier: 'top_iit',
      college_to_first_job: 'IIT Madras M.Tech Robotics (after B.Tech Mech). Strong ROS + perception focus during MTech. Internship at Addverb during MTech, return offer for robotics software engineer.',
      where_now: 'Senior robotics engineer at Addverb, 4 years experience',
      income_range: '₹28-40L cash + ESOPs',
      one_decision_that_mattered: 'Doing MTech Robotics specifically rather than directly entering industry after BTech — the focused specialisation opened doors that a generalist Mech engineer struggled with.',
    },
    {
      college_tier: 'mid_nit',
      college_to_first_job: 'NIT mid-tier Mechatronics. Self-taught ROS in years 2-3. Joined the college robotics team, built 3 demo robots. Internship at GreyOrange Gurgaon in year 3, return offer.',
      where_now: 'Robotics software engineer at GreyOrange, 3 years experience',
      income_range: '₹20-26L cash + ESOPs',
      one_decision_that_mattered: 'Picking Mechatronics over pure Mech at admission time — the mixed curriculum (Mech + Electronics + Programming) was the foundation that landed the GreyOrange internship.',
    },
    {
      college_tier: 'private',
      college_to_first_job: 'Tier-2 private engineering Mech. Spent 2 years on hobby robotics projects (Arduino, Raspberry Pi, ROS). Documented everything on a personal blog. Got into an early-stage robotics startup after 60+ applications in year 4.',
      where_now: 'Mechatronics engineer at a Bangalore robotics startup, 2 years experience',
      income_range: '₹12-18L cash + small ESOPs',
      one_decision_that_mattered: 'Treating hobby robotics as a serious portfolio rather than a side hobby — the blog posts + public GitHub repos were what differentiated him from peers with similar degrees.',
    },
  ],
  sources: [
    { type: 'salary', label: 'AmbitionBox robotics / automation engineer listings — Q1 2026', accessed_date: '2026-04-12' },
    { type: 'job_market', label: 'India PLI scheme + warehouse automation market reports 2024-2026', accessed_date: '2026-03-25' },
    { type: 'career_path', label: 'Editorial — 4 interviews with robotics engineers across Addverb / GreyOrange / NVIDIA Isaac / a Mumbai automation startup', accessed_date: '2026-04-10' },
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
