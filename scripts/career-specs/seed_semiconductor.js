#!/usr/bin/env node
/**
 * Seed the 6th CareerSpec: Semiconductor / chip design engineer.
 * Status: published. engineering / emerging.
 *
 * Editorial premise:
 *   First spec to cover the ECE branch path. India Semiconductor Mission
 *   (₹76,000 cr) plus growing presence of NVIDIA, Intel, AMD, Qualcomm, Apple
 *   in Bangalore + Hyderabad makes this a genuinely emerging career.
 *   Honest framing required: India is mostly verification + back-end design,
 *   not chip architecture. The architecture work still concentrates at US HQs.
 *   Tata Electronics / Vedanta-Foxconn fabs add manufacturing roles but those
 *   are a different career (process engineering) from chip design.
 *
 * Usage:
 *   node scripts/career-specs/seed_semiconductor.js           # dry run
 *   node scripts/career-specs/seed_semiconductor.js --apply   # upsert
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const SEED_AUTHOR = 'editorial@canvasclasses.in';

const SPEC = {
  _id: uuidv4(),
  slug: 'semiconductor-engineer',
  display_name: 'Semiconductor / chip design engineer',
  category: 'engineering',
  archetype: 'emerging',
  linked_career_path_slug: undefined,

  one_line: 'Design, verify, and bring up the chips that power phones, cars, AI accelerators, and medical devices.',

  what_it_is_today:
    'A semiconductor engineer designs, verifies, and validates integrated circuits — from the architecture sketches down to the transistor-level layouts. ' +
    'In 2026, India hosts large teams at NVIDIA, Intel, AMD, Qualcomm, Apple, Broadcom, Marvell, MediaTek, Texas Instruments, and Analog Devices — typically ' +
    '2,000-8,000 engineers per major employer. The work splits into three layers: front-end (digital design + verification + architecture exploration), back-end ' +
    '(physical design, place + route, timing closure), and analog (high-speed I/O, RF, power management). India is unusually strong in verification + ' +
    'back-end design — the high-volume hands-on engineering work — and increasingly building out architecture roles. The India Semiconductor Mission ' +
    '(₹76,000 cr) is funding new fabs (Tata Electronics, Vedanta-Foxconn) — those create different jobs (process engineering, manufacturing) that share ' +
    'the "semiconductor" name but are a separate career from chip design.',

  what_parents_think_it_is:
    'Most parents either don\'t know this career exists, or assume it\'s overlapping with general "electronics engineering" — what their cousin did at L&T ' +
    'in the 1990s. The modern reality is different. Chip design at India arms of global semiconductor companies pays competitively (often within 20-30 % of ' +
    'SWE-product) with significantly more job stability (semicon companies don\'t lay off the way consumer tech does), and the work is genuinely hard / ' +
    'specialised — which makes it harder to replace with AI and harder to commoditise.',

  common_misconceptions: [
    '"All semiconductor work is in the US." False in 2026. NVIDIA Bangalore + Hyderabad has 5,000+ engineers; similar order of magnitude at Intel, Qualcomm, AMD. India is the second-largest engineering geography for many semi companies.',
    '"India only does verification — that\'s lower-value work." Partly true — but verification engineers at top semi companies earn ₹40-80L by year 5-7, comparable to SWE-product. The "low-value" framing is dated.',
    '"Semiconductor = working in a fab." Chip DESIGN happens in office buildings with EDA tools (Synopsys, Cadence). Fabrication happens in fabs. Different careers, different geographies, different skills.',
    '"Tata Electronics fab will be the future." Maybe — but fab process engineering is a 5-7 year ramp to first real engineering ownership, and is a different career from chip design. Don\'t conflate them when planning.',
    '"AI will design chips by itself." Some EDA-tool work is genuinely accelerating with AI. But architecture decisions, verification strategy, and physical-design judgment remain solidly human work for the foreseeable future.',
  ],

  income: {
    year_1:  { p25: 7,  median: 11, p75: 18 },
    year_5:  { p25: 18, median: 30, p75: 55 },
    year_10: { p25: 35, median: 55, p75: 110 },
    notes:
      'Slightly lower entry pay than SWE-product because the talent pool is more specialised + the value-add per engineer in India is somewhat lower (most architecture ' +
      'work still concentrates at US HQs). But: significantly more job stability, slower layoff cycles, and competitive trajectory at mid-senior level. p75 at year 10 ' +
      'reflects engineers at the Apple / NVIDIA / Qualcomm India bands plus a few senior India-tracked architects. p25 reflects mid-tier semi companies + verification-only ' +
      'roles. Compensation is rarely ESOP-heavy (unlike software startups) — it\'s mostly cash + RSU.',
    sources: [
      { type: 'salary', label: 'Levels.fyi India hardware / semiconductor engineer bands — Q1 2026', accessed_date: '2026-04-15' },
      { type: 'salary', label: 'AmbitionBox semiconductor / VLSI listings — Q1 2026', accessed_date: '2026-04-12' },
      { type: 'salary', label: 'Editorial — interviews with 6 chip design engineers across NVIDIA / Qualcomm / AMD / smaller analog houses', accessed_date: '2026-04-09' },
    ],
    last_updated: '2026-04',
  },

  sub_paths: [
    {
      name: 'Digital design engineer (RTL)',
      description: 'Writes Verilog / SystemVerilog at the RTL level. Designs the digital blocks that get synthesised into gates. Heaviest concentration at India arms of GPU / mobile SoC / networking chip companies.',
      ai_exposure_5y: 'low',
      income_vs_median: 'similar',
    },
    {
      name: 'Verification engineer',
      description: 'Builds the test environments that confirm chips work. Writes UVM testbenches, formal-verification properties, runs regression. India\'s largest semi sub-discipline by headcount.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Physical design / back-end engineer',
      description: 'Takes the synthesised netlist and turns it into a physical layout that meets timing, power, area constraints. EDA-tool-heavy work (Synopsys, Cadence). Concentrated in Bangalore / Hyderabad.',
      ai_exposure_5y: 'moderate',
      income_vs_median: 'similar',
    },
    {
      name: 'Analog / mixed-signal designer',
      description: 'Designs analog circuits — high-speed I/O, RF, power management, ADCs / DACs. Rare and well-paid: the talent pool is genuinely thin (analog can\'t be brute-forced with simulations). Common at TI / ADI / Qualcomm India.',
      ai_exposure_5y: 'low',
      income_vs_median: 'higher',
    },
    {
      name: 'Chip architect / system-on-chip lead',
      description: 'Defines what the chip does, how the blocks fit together, and what the trade-offs are. India is increasingly hosting these roles but they remain a smaller fraction than verification. Highest-paid sub-path.',
      ai_exposure_5y: 'low',
      income_vs_median: 'much_higher',
    },
  ],

  ai_exposure: {
    horizon_1y:  { level: 'low', confidence: 'high' },
    horizon_5y:  { level: 'moderate', confidence: 'medium' },
    horizon_10y: { level: 'moderate', confidence: 'low' },
    summary:
      'Chip design is more AI-resistant than most software work on a 5-year horizon. EDA-tool vendors are integrating AI to accelerate specific steps (placement, ' +
      'verification coverage, design exploration) — but the human judgment in architecture decisions, debugging silicon, and verification strategy remains structurally ' +
      'hard to compress. The career also has a "long-cycle physical product" buffer: chips take 18-36 months from design start to silicon, and the work has to be done by ' +
      'someone responsible. AI tools speed up parts of the work; they don\'t obviate the engineer.',
    what_doesnt_compress: [
      'Architecture decisions on what the chip should do and what trade-offs to make.',
      'Debugging silicon — when first chips come back and behaviour is wrong, the work is judgment + intuition + measurement.',
      'Verification strategy — deciding what to test, what scenarios matter, what corners to chase.',
      'Physical design intuition — knowing when timing closure will be hard before running the tools.',
      'Cross-team coordination across hardware + software + manufacturing.',
    ],
    sources: [
      { type: 'ai_exposure', label: 'WEF Future of Jobs Report 2025 (Section: Hardware engineering)', accessed_date: '2026-02-20' },
      { type: 'ai_exposure', label: 'Synopsys + Cadence AI integration roadmaps 2024-2026 (public materials)', accessed_date: '2026-03-12' },
      { type: 'ai_exposure', label: 'Editorial — interviews with 6 semi engineers + 1 EDA tools PM on AI integration trajectory', accessed_date: '2026-04-09' },
    ],
  },

  moat_skills: [
    {
      skill: 'Digital design fluency in Verilog / SystemVerilog at depth.',
      why_it_matters:
        'The foundation of front-end design. Engineers who can read other people\'s RTL fluently, debug timing issues, and write clean parameterised modules are scarce. ' +
        'AI tools generate Verilog faster, but reading + debugging it remains hard human work — especially when ASIC silicon costs $5M+ to spin and a bug means a respin.',
      how_to_build_in_college:
        'Take VLSI courses seriously in years 2-3. Build at least 2 non-trivial Verilog projects — a CPU pipeline, an FFT accelerator, a memory controller. Get them ' +
        'simulating clean + synthesizing. Use SystemVerilog assertions. By year 4 you should be able to read someone else\'s 2,000-line module and explain what it does.',
    },
    {
      skill: 'Computer architecture intuition.',
      why_it_matters:
        'Beyond Verilog syntax, the engineers who advance are the ones who understand WHY a design choice matters — caches, pipelines, memory hierarchies, ' +
        'communication protocols. Architecture intuition compounds over decades; specific tool knowledge does not.',
      how_to_build_in_college:
        'Read Hennessy + Patterson "Computer Architecture: A Quantitative Approach" (the textbook). Take an OS + computer architecture course. Build a small CPU + ' +
        'memory hierarchy as a project. Practice reading patent filings from NVIDIA / Apple — they\'re unusually readable architecture documents.',
    },
    {
      skill: 'Verification methodology — UVM + formal verification.',
      why_it_matters:
        'India\'s largest semiconductor sub-discipline by headcount. Engineers who can build clean UVM testbenches + formal-property assertions + coverage closure ' +
        'are paid well and stay relevant across companies. Verification is also unusually portable — methodology transfers between companies.',
      how_to_build_in_college:
        'Take a verification course or self-study from Doulos / Verilab materials. Build a UVM testbench for one of your Verilog projects. By year 4 you should have ' +
        'one project where verification is more polished than the design itself.',
    },
    {
      skill: 'EDA tool fluency — Synopsys / Cadence flow.',
      why_it_matters:
        'Chip design happens inside EDA tools. Engineers who are fluent in the full Synopsys (Design Compiler, IC Compiler, PrimeTime) or Cadence (Genus, Innovus, ' +
        'Tempus) flow are immediately productive at any major semi employer. Tool fluency separates engineers who deliver from engineers who get stuck.',
      how_to_build_in_college:
        'Most college labs have at least one of these tool flows. Use them — don\'t just write Verilog and stop at simulation. Run synthesis, see the gate count, ' +
        'understand timing reports. The engineers who graduate having actually used these tools at scale are 3x more productive in their first year.',
    },
  ],

  educational_path: {
    primary_degrees: ['B.Tech ECE', 'B.Tech EE / EEE', 'B.Tech Electronics & Instrumentation', 'B.Tech VLSI Design (where offered)', 'MS / M.Tech VLSI / Microelectronics'],
    alternative_degrees: ['B.Tech CSE + MS Electrical Engineering', 'B.Tech ECE + foreign MS (common path to architecture roles)'],
    target_colleges: {
      stretch: ['IIT Bombay / Delhi / Madras / Kharagpur ECE', 'IIT Hyderabad ECE (strong VLSI program)', 'IISc Bangalore (MS / PhD route)', 'BITS Pilani EEE'],
      realistic: ['NIT Trichy / Warangal / Surathkal / Calicut ECE', 'IIIT Hyderabad ECE', 'DTU / NSUT ECE', 'PEC Chandigarh ECE'],
      accessible: ['Mid-tier NITs ECE', 'GFTI ECE branches', 'State engineering ECE with strong VLSI project work + masters'],
    },
    minimum_viable_path:
      'B.Tech ECE from any decent college + serious VLSI / digital design coursework + 2-3 portfolio projects in Verilog (CPU / accelerator / memory controller) + ' +
      'one verification project with UVM or formal methods + an internship at a semi company. The hiring bar is genuinely lower than for SWE-product at most India ' +
      'semi employers because the talent supply is constrained. Has been done many times from mid-tier NITs and decent private engineering colleges. An MS / M.Tech ' +
      'specifically in VLSI is the credentialed path that opens more doors, especially for back-end / analog roles.',
    what_to_do_in_college: [
      'Year 1-2: Build digital electronics foundations. Take VLSI Design course seriously. Read Hennessy + Patterson.',
      'Year 3: Pick a sub-discipline (digital design, verification, physical design, analog). Build 2-3 portfolio projects in that area. First internship at a semi company.',
      'Year 4: Convert internship into a return offer. Have at least one Verilog project on GitHub with a verification environment. Decide on MS specialisation if applicable.',
      'Throughout: practise with real EDA tools — most college labs have Cadence + Synopsys tool flows available. Use them on real projects, not just toy assignments.',
    ],
    time_to_first_real_income: 4,
  },

  cons: [
    {
      issue: 'Tool licenses and fab access constraints are real.',
      explanation:
        'Modern EDA tools (Synopsys, Cadence) cost $50K-100K per seat — most colleges have limited licenses. Real-world fab access for advanced nodes (7nm and below) ' +
        'is gated to large companies. As a student you\'ll work on simulations + older nodes (28nm / 65nm) which is fine for skill-building but means you don\'t get ' +
        'hands-on with cutting-edge until you join industry.',
    },
    {
      issue: 'India work concentrates at the verification + back-end end of the value chain.',
      explanation:
        'The most strategic work — architecture, lead design, technology roadmap — still concentrates at US HQs. Indian engineers can rise to architecture roles, but it ' +
        'often requires either a foreign MS / PhD or 8-10 years of demonstrated excellence in verification / design. Be honest with yourself about whether you\'re OK ' +
        'spending the first 5-7 years on execution work rather than novel architecture.',
    },
    {
      issue: 'Career mobility is narrower than software.',
      explanation:
        'A SWE-product engineer can pivot to MLE, data engineering, product, design. A digital design engineer has fewer easy lateral moves — ML / software pivots ' +
        'require significant retraining. The trade-off: more job stability, slower hype cycles, but less optionality if you decide chip work isn\'t for you.',
    },
    {
      issue: 'Project timelines are 18-36 months long.',
      explanation:
        'You work on a chip that won\'t tape out for 2+ years. Engineers who need short feedback loops + quick wins find this rhythm frustrating. The good news: the work ' +
        'is more durable per hour invested; the bad news: the satisfaction of "I shipped X" is more distributed.',
    },
    {
      issue: 'Hardware bugs cost real money — pressure during silicon bring-up is intense.',
      explanation:
        'When first silicon comes back from the fab and a bug is found, the team scrambles. A respin can cost $5M+ + 3-6 months of schedule. The pressure during bring-up ' +
        'weeks is unlike anything in software engineering — many engineers find this exhilarating, some find it crushing. Know which you are before committing.',
    },
  ],

  india_context: {
    geographic_concentration: 'Bangalore (heaviest) + Hyderabad. Some Noida (STMicro, Synopsys India), Pune (Marvell), and emerging Chennai (Tata Electronics fab plus Apple).',
    remote_work_feasibility: 'low',
    english_requirement: 'high',
    family_capital_required: 'low',
    typical_first_job_city: ['Bangalore', 'Hyderabad', 'Noida', 'Pune', 'Chennai'],
  },

  adjacent_careers: [
    { career_slug: 'ml-engineer', why_its_a_natural_pivot: 'For chip designers working on AI accelerators or NPUs — pivoting to ML-systems engineering is increasingly common. Requires 1-2 years of focused project work.' },
    { career_slug: 'software-engineer-product', why_its_a_natural_pivot: 'For chip designers who decide hardware\'s pace isn\'t for them — verification engineers in particular often pivot to backend SWE roles with relatively short retraining.' },
  ],

  example_paths: [
    {
      college_tier: 'top_iit',
      college_to_first_job:
        'IIT Madras ECE. Took VLSI courses + research-track seriously. Internship at NVIDIA Bangalore in year 3 — return offer for digital design. Did one ' +
        'side project on a small RISC-V CPU on GitHub.',
      where_now: 'Senior digital design engineer at NVIDIA India, 5 years experience',
      income_range: '₹45-65L cash + RSUs',
      one_decision_that_mattered: 'Picking digital design over software at year 4 — the supply / demand for skilled chip designers in India is structurally tighter than for SWEs, which compounded faster.',
    },
    {
      college_tier: 'mid_nit',
      college_to_first_job:
        'NIT mid-tier ECE. M.Tech VLSI from IIT (took GATE seriously in year 4). Verification specialisation during M.Tech. Joined Qualcomm Hyderabad verification team.',
      where_now: 'Senior verification engineer at Qualcomm India, 6 years experience (4 post M.Tech)',
      income_range: '₹35-45L cash + RSUs',
      one_decision_that_mattered: 'Doing GATE + M.Tech VLSI instead of immediately taking an SWE offer at year 5 — the masters credential opened verification roles at the major semi employers that B.Tech-only engineers struggled to reach.',
    },
    {
      college_tier: 'private',
      college_to_first_job:
        'Tier-2 private engineering ECE. Worked through the full Doulos UVM training materials online over 18 months. Built 3 Verilog projects on GitHub + a UVM ' +
        'testbench for one of them. Got into a mid-tier semi company (an Indian fabless startup) on the third application attempt.',
      where_now: 'Verification engineer at an Indian fabless semi company, 2 years experience',
      income_range: '₹18-24L cash',
      one_decision_that_mattered: 'Investing 18 months in self-taught UVM + portfolio projects despite no IIT brand — the verification methodology fluency was the differentiator that landed offers when his peers with the same college credentials were stuck.',
    },
  ],

  sources: [
    { type: 'salary', label: 'Levels.fyi India semiconductor engineer bands — Q1 2026', accessed_date: '2026-04-15' },
    { type: 'job_market', label: 'India Semiconductor Mission progress + Tata Electronics + Vedanta-Foxconn fab updates 2024-2026', accessed_date: '2026-03-25' },
    { type: 'ai_exposure', label: 'Synopsys + Cadence AI integration roadmaps 2024-2026 (public materials)', accessed_date: '2026-03-12' },
    { type: 'career_path', label: 'Editorial — interviews with 6 semi engineers across NVIDIA / Qualcomm / AMD / smaller analog houses', accessed_date: '2026-04-09' },
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
