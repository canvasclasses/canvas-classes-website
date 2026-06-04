// Branch Finder — single source of truth for the engineering + science + emerging
// programs these institutes (IITs / NITs / IIITs / IISERs / BITS) actually offer,
// and the three signal families a parent/student picks from.
//
// Data-only (no React, no I/O) so it stays unit-testable and the affinity weights
// + future-outlook calls can be tuned by hand. Mirrors the shape philosophy of
// `instituteProfiles.ts`.
//
// Affinity scale:
//   0 = irrelevant   1 = minor   2 = strong   3 = defining
// Omit a key entirely instead of writing 0 — the scorer treats "missing" as 0.
//
// Future outlook is grounded in a 2026 research pass over WEF Future of Jobs 2025,
// McKinsey, NITI Aayog, the India Semiconductor Mission and the National Quantum
// Mission. The guiding rule encoded here: almost every field is Resilient-or-better
// for the graduate who adds AI/computation fluency, and Caution for the one who
// doesn't — so the bucket is a starting condition and the note carries the nuance.

// ── Signal families ──────────────────────────────────────────────────────────

export type SubjectKey =
  | 'physics'
  | 'maths'
  | 'chemistry'
  | 'biology'
  | 'coding'
  | 'drawing'
  | 'business';

export type TraitKey =
  | 'buildPhysical'
  | 'codingSoftware'
  | 'designCreative'
  | 'howMachinesWork'
  | 'livingThings'
  | 'labWork'
  | 'outdoorsField'
  | 'abstractLogic'
  | 'electronicsCircuits'
  | 'bigSystems';

export type VisionKey =
  // ambitions
  | 'highPaying'
  | 'abroad'
  | 'govtPsu'
  | 'research'
  | 'startup'
  | 'socialImpact'
  // industries
  | 'software'
  | 'automotive'
  | 'aerospace'
  | 'energy'
  | 'healthcare'
  | 'construction'
  | 'finance'
  | 'manufacturing';

export type SignalFamily = 'subjects' | 'traits' | 'vision';

// ── Future outlook ───────────────────────────────────────────────────────────

export type OutlookBucket = 'booming' | 'resilient' | 'evolving' | 'caution';

export interface SignalDef<K extends string> {
  key: K;
  label: string;
  family: SignalFamily;
}

export const SUBJECT_SIGNALS: SignalDef<SubjectKey>[] = [
  { key: 'physics', label: 'Physics', family: 'subjects' },
  { key: 'maths', label: 'Maths', family: 'subjects' },
  { key: 'chemistry', label: 'Chemistry', family: 'subjects' },
  { key: 'biology', label: 'Biology', family: 'subjects' },
  { key: 'coding', label: 'Computers & coding', family: 'subjects' },
  { key: 'drawing', label: 'Drawing & visualising', family: 'subjects' },
  { key: 'business', label: 'Business sense', family: 'subjects' },
];

export const TRAIT_SIGNALS: SignalDef<TraitKey>[] = [
  { key: 'buildPhysical', label: 'Building & fixing things', family: 'traits' },
  { key: 'codingSoftware', label: 'Writing code', family: 'traits' },
  { key: 'designCreative', label: 'Designing & creating', family: 'traits' },
  { key: 'howMachinesWork', label: 'How machines work', family: 'traits' },
  { key: 'livingThings', label: 'Living things & health', family: 'traits' },
  { key: 'labWork', label: 'Lab experiments', family: 'traits' },
  { key: 'outdoorsField', label: 'Outdoor / on-site work', family: 'traits' },
  { key: 'abstractLogic', label: 'Puzzles & logic', family: 'traits' },
  { key: 'electronicsCircuits', label: 'Electronics & circuits', family: 'traits' },
  { key: 'bigSystems', label: 'Big systems & flow', family: 'traits' },
];

export const VISION_SIGNALS: SignalDef<VisionKey>[] = [
  { key: 'highPaying', label: 'High-paying job', family: 'vision' },
  { key: 'abroad', label: 'Work / settle abroad', family: 'vision' },
  { key: 'govtPsu', label: 'Govt job / PSU stability', family: 'vision' },
  { key: 'research', label: 'Research & higher studies', family: 'vision' },
  { key: 'startup', label: 'Start a company', family: 'vision' },
  { key: 'socialImpact', label: 'Social / environmental impact', family: 'vision' },
  { key: 'software', label: 'Software / IT', family: 'vision' },
  { key: 'automotive', label: 'Automotive', family: 'vision' },
  { key: 'aerospace', label: 'Aerospace / defence', family: 'vision' },
  { key: 'energy', label: 'Energy & power', family: 'vision' },
  { key: 'healthcare', label: 'Healthcare / pharma', family: 'vision' },
  { key: 'construction', label: 'Construction / infrastructure', family: 'vision' },
  { key: 'finance', label: 'Finance / data', family: 'vision' },
  { key: 'manufacturing', label: 'Manufacturing', family: 'vision' },
];

export const SIGNAL_LABELS: Record<string, string> = Object.fromEntries(
  [...SUBJECT_SIGNALS, ...TRAIT_SIGNALS, ...VISION_SIGNALS].map((s) => [s.key, s.label]),
);

// ── Branch profile ───────────────────────────────────────────────────────────

export interface BranchProfile {
  id: string;
  shortName: string;
  name: string;
  // Plain one-liner a parent with no engineering background understands.
  plainLine: string;
  // Future-readiness, AI-era. `outlookNote` carries the honest nuance — for
  // `caution`/`evolving` it is a "how to stay relevant" line, surfaced in the UI
  // whenever the branch becomes a strong match so it's never hidden.
  outlook: OutlookBucket;
  outlookNote: string;
  // Non-B.Tech programs label themselves (e.g. "B.S. / M.Sc"). B.Tech omits it.
  track?: string;
  // dream_branch value handed to /college-predictor. Omit when the program has
  // no clean JoSAA/BITSAT cutoff coverage (science & most emerging programs) —
  // the handoff button is then hidden for that tile.
  predictorBranch?: string;
  demandTier: 1 | 2 | 3;
  subjects: Partial<Record<SubjectKey, 1 | 2 | 3>>;
  traits: Partial<Record<TraitKey, 1 | 2 | 3>>;
  vision: Partial<Record<VisionKey, 1 | 2 | 3>>;
}

// 33 programs across B.Tech, B.S./M.Sc science, and emerging interdisciplinary
// tracks. Weights are a research-informed first-pass — tune freely.
export const BRANCH_PROFILES: BranchProfile[] = [
  // ── Computing & data ───────────────────────────────────────────────────────
  {
    id: 'cse',
    shortName: 'CSE',
    name: 'Computer Science & Engineering',
    plainLine: 'Software, algorithms and the apps & systems that run on computers.',
    outlook: 'evolving',
    outlookNote:
      'Still one of the safest bets — but AI now writes routine code, so the edge goes to those who design systems and wield AI, not just type functions.',
    predictorBranch: 'CSE',
    demandTier: 1,
    subjects: { maths: 3, coding: 3, physics: 1 },
    traits: { codingSoftware: 3, abstractLogic: 3, bigSystems: 2, designCreative: 1 },
    vision: { highPaying: 3, abroad: 3, startup: 3, software: 3, finance: 2, research: 1 },
  },
  {
    id: 'it',
    shortName: 'IT',
    name: 'Information Technology',
    plainLine: 'Close cousin of CSE — software, networks and IT systems for businesses.',
    outlook: 'caution',
    outlookNote:
      'Traditional IT services (support, manual testing, L1) is exactly what AI is automating — entry roles are already shrinking. Aim for cloud / AI-engineering, not body-shopping.',
    predictorBranch: 'IT',
    demandTier: 1,
    subjects: { maths: 2, coding: 3 },
    traits: { codingSoftware: 3, abstractLogic: 2, bigSystems: 2 },
    vision: { highPaying: 2, abroad: 2, software: 3, startup: 1, finance: 1 },
  },
  {
    id: 'ai-ml',
    shortName: 'AI & ML',
    name: 'Artificial Intelligence & Machine Learning',
    plainLine: 'Teaching computers to learn — the field behind ChatGPT, self-driving cars and more.',
    outlook: 'booming',
    outlookNote: 'The engine of the AI wave itself — among the fastest-growing fields in the world.',
    predictorBranch: 'AI & ML',
    demandTier: 1,
    subjects: { maths: 3, coding: 3, physics: 1 },
    traits: { codingSoftware: 3, abstractLogic: 3, bigSystems: 2 },
    vision: { highPaying: 3, abroad: 3, research: 3, startup: 3, software: 3, finance: 2, healthcare: 1 },
  },
  {
    id: 'data-science',
    shortName: 'DSE',
    name: 'Data Science & Engineering',
    plainLine: 'Turning huge amounts of data into decisions, predictions and insight.',
    outlook: 'booming',
    outlookNote:
      'Data and AI skills top every future-jobs list — demand is accelerating across every industry.',
    predictorBranch: 'data science',
    demandTier: 1,
    subjects: { maths: 3, coding: 3, business: 1 },
    traits: { abstractLogic: 3, codingSoftware: 2, bigSystems: 2 },
    vision: { highPaying: 3, software: 2, finance: 3, research: 2, healthcare: 1, abroad: 2, startup: 2 },
  },
  {
    id: 'cybersecurity',
    shortName: 'CYB',
    name: 'Cybersecurity',
    plainLine: 'Defending computers, data and networks from hackers and digital threats.',
    outlook: 'booming',
    outlookNote:
      'The #2 fastest-growing skill after AI — every new AI system is a new attack surface, and defenders are scarce.',
    demandTier: 2,
    subjects: { maths: 2, coding: 3, physics: 1 },
    traits: { codingSoftware: 3, abstractLogic: 3, bigSystems: 2 },
    vision: { highPaying: 3, software: 2, govtPsu: 2, finance: 1, abroad: 2 },
  },
  {
    id: 'math-computing',
    shortName: 'M&C',
    name: 'Mathematics & Computing',
    plainLine: 'Heavy maths + coding — the branch behind quant finance, data science and algorithms.',
    outlook: 'booming',
    outlookNote:
      'The purest pipeline into AI/ML, quant finance and cryptography — the substrate of the whole AI economy.',
    predictorBranch: 'mathematics and computing',
    demandTier: 1,
    subjects: { maths: 3, coding: 3 },
    traits: { abstractLogic: 3, codingSoftware: 2 },
    vision: { finance: 3, software: 3, highPaying: 3, abroad: 2, research: 2, startup: 1 },
  },

  // ── Electronics & electrical ───────────────────────────────────────────────
  {
    id: 'ece',
    shortName: 'ECE',
    name: 'Electronics & Communication Engineering',
    plainLine: 'Chips, circuits, signals and the electronics inside every modern device.',
    outlook: 'evolving',
    outlookNote:
      'A strong gateway into booming VLSI, embedded and AI-hardware — but drift into generic roles and the advantage fades.',
    predictorBranch: 'ECE',
    demandTier: 1,
    subjects: { physics: 3, maths: 2, coding: 1 },
    traits: { electronicsCircuits: 3, howMachinesWork: 2, buildPhysical: 1, abstractLogic: 2 },
    vision: { highPaying: 2, abroad: 2, govtPsu: 2, software: 2, manufacturing: 2, research: 2 },
  },
  {
    id: 'vlsi',
    shortName: 'VLSI',
    name: 'VLSI & Semiconductor / Chip Design',
    plainLine: 'Designing the microchips that power phones, computers and AI itself.',
    outlook: 'booming',
    outlookNote:
      "India's ₹76,000-cr semiconductor push plus global AI-chip demand make chip design one of the strongest tailwinds today.",
    predictorBranch: 'vlsi',
    demandTier: 1,
    subjects: { physics: 3, maths: 2, coding: 2 },
    traits: { electronicsCircuits: 3, abstractLogic: 2, howMachinesWork: 1 },
    vision: { highPaying: 3, abroad: 3, manufacturing: 2, software: 1, research: 2 },
  },
  {
    id: 'eee',
    shortName: 'EEE',
    name: 'Electrical & Electronics Engineering',
    plainLine: 'Power, motors and electronics together — energy systems and the devices they run.',
    outlook: 'resilient',
    outlookNote: 'Power, grids and EVs run on this — hard to automate, and renewables are expanding it.',
    predictorBranch: 'EEE',
    demandTier: 2,
    subjects: { physics: 3, maths: 2 },
    traits: { electronicsCircuits: 3, howMachinesWork: 2, buildPhysical: 1, bigSystems: 1 },
    vision: { govtPsu: 3, energy: 3, manufacturing: 2, abroad: 1, highPaying: 2 },
  },
  {
    id: 'ee',
    shortName: 'EE',
    name: 'Electrical & Power Engineering',
    plainLine: 'Generating, moving and using electrical power — grids, motors and machines.',
    outlook: 'resilient',
    outlookNote:
      'The grid underpins EVs, renewables and AI data-centres; physical accountability keeps it human-led.',
    predictorBranch: 'EE',
    demandTier: 2,
    subjects: { physics: 3, maths: 2 },
    traits: { electronicsCircuits: 2, howMachinesWork: 2, buildPhysical: 2, bigSystems: 2 },
    vision: { govtPsu: 3, energy: 3, manufacturing: 2, construction: 1, abroad: 1 },
  },
  {
    id: 'instrumentation',
    shortName: 'EIE',
    name: 'Instrumentation & Control Engineering',
    plainLine: 'The sensors and control systems that measure and run industrial machines.',
    outlook: 'evolving',
    outlookNote:
      'Backbone of Industry 4.0 and IoT — move up into industrial-AI and autonomous control to ride it.',
    predictorBranch: 'instrumentation',
    demandTier: 3,
    subjects: { physics: 3, maths: 2, coding: 1 },
    traits: { electronicsCircuits: 3, howMachinesWork: 2, labWork: 1, bigSystems: 1 },
    vision: { manufacturing: 2, govtPsu: 2, energy: 2, software: 1 },
  },

  // ── Mechanical & motion ────────────────────────────────────────────────────
  {
    id: 'mechanical',
    shortName: 'ME',
    name: 'Mechanical Engineering',
    plainLine: 'The “mother branch” — engines, machines, manufacturing and how physical things are built.',
    outlook: 'evolving',
    outlookNote:
      'India’s broadest branch endures, but AI automates drafting & simulation — pair core mechanics with CAE, automation and data.',
    predictorBranch: 'Mechanical',
    demandTier: 2,
    subjects: { physics: 3, maths: 2, drawing: 2 },
    traits: { buildPhysical: 3, howMachinesWork: 3, designCreative: 1, bigSystems: 1 },
    vision: { govtPsu: 2, abroad: 2, automotive: 3, manufacturing: 3, aerospace: 2, energy: 1 },
  },
  {
    id: 'robotics',
    shortName: 'R&A',
    name: 'Robotics & Mechatronics',
    plainLine: 'Building robots and smart machines — where mechanics, electronics and AI meet.',
    outlook: 'booming',
    outlookNote:
      'The physical body of AI — manufacturing, warehouse and service robots are scaling fast.',
    predictorBranch: 'robotics',
    demandTier: 2,
    subjects: { physics: 3, maths: 2, coding: 2 },
    traits: { buildPhysical: 3, howMachinesWork: 3, electronicsCircuits: 2, codingSoftware: 2, abstractLogic: 1 },
    vision: { startup: 2, manufacturing: 3, automotive: 2, abroad: 2, highPaying: 2, research: 2 },
  },
  {
    id: 'automobile',
    shortName: 'AUTO',
    name: 'Automobile & EV Engineering',
    plainLine: 'Designing vehicles — engines, EVs and everything that moves on wheels.',
    outlook: 'booming',
    outlookNote:
      'The EV shift is creating millions of jobs; the future is batteries, power-electronics and software, not just engines.',
    predictorBranch: 'Mechanical',
    demandTier: 3,
    subjects: { physics: 3, maths: 1, drawing: 2 },
    traits: { buildPhysical: 3, howMachinesWork: 3, electronicsCircuits: 1 },
    vision: { automotive: 3, manufacturing: 2, abroad: 2, energy: 2, startup: 1 },
  },
  {
    id: 'aerospace',
    shortName: 'AE',
    name: 'Aerospace Engineering',
    plainLine: 'Aircraft, rockets and spacecraft — flight, propulsion and the physics of the skies.',
    outlook: 'resilient',
    outlookNote:
      "Safety-critical and high-barrier; buoyed by India's space-startups and defence. Niche but human-led.",
    predictorBranch: 'Aerospace',
    demandTier: 3,
    subjects: { physics: 3, maths: 3, drawing: 1 },
    traits: { howMachinesWork: 3, buildPhysical: 2, abstractLogic: 2 },
    vision: { aerospace: 3, research: 2, govtPsu: 2, abroad: 2, manufacturing: 1 },
  },
  {
    id: 'production',
    shortName: 'PIE',
    name: 'Production & Industrial Engineering',
    plainLine: 'Making factories and supply chains run efficiently — operations and quality.',
    outlook: 'evolving',
    outlookNote:
      'Becomes data-driven operations — AI optimises supply chains; the clipboard-and-stopwatch role is what fades.',
    predictorBranch: 'production',
    demandTier: 3,
    subjects: { physics: 2, maths: 2, business: 1 },
    traits: { howMachinesWork: 2, bigSystems: 3, buildPhysical: 1 },
    vision: { manufacturing: 3, govtPsu: 2, startup: 1, highPaying: 1 },
  },

  // ── Civil, chemical, materials, earth ──────────────────────────────────────
  {
    id: 'civil',
    shortName: 'CE',
    name: 'Civil Engineering',
    plainLine: 'Buildings, bridges, roads and dams — the infrastructure a country runs on.',
    outlook: 'resilient',
    outlookNote:
      "Infrastructure can't be offshored or fully automated; India's construction pipeline is huge. Lower pay ceiling than tech.",
    predictorBranch: 'Civil',
    demandTier: 3,
    subjects: { physics: 2, maths: 2, drawing: 2 },
    traits: { buildPhysical: 2, outdoorsField: 3, bigSystems: 2, designCreative: 1 },
    vision: { govtPsu: 3, construction: 3, abroad: 1, socialImpact: 1 },
  },
  {
    id: 'chemical',
    shortName: 'CHE',
    name: 'Chemical Engineering',
    plainLine: 'Turning raw materials into products at scale — fuels, medicines, plastics and more.',
    outlook: 'resilient',
    outlookNote:
      'Pharma, energy and materials endure; AI optimises processes while humans own plant safety and scale-up.',
    predictorBranch: 'Chemical',
    demandTier: 2,
    subjects: { chemistry: 3, physics: 2, maths: 2 },
    traits: { labWork: 3, howMachinesWork: 1, bigSystems: 2 },
    vision: { energy: 3, manufacturing: 2, govtPsu: 2, healthcare: 1, research: 2, abroad: 1 },
  },
  {
    id: 'metallurgy',
    shortName: 'MME',
    name: 'Metallurgical & Materials Engineering',
    plainLine: 'The science of metals and materials — from steel and alloys to battery materials.',
    outlook: 'resilient',
    outlookNote:
      'Steel, copper and battery materials sustain it; AI-driven materials discovery is the fast-growing frontier to aim at.',
    predictorBranch: 'metallurgy',
    demandTier: 3,
    subjects: { chemistry: 2, physics: 2, maths: 1 },
    traits: { labWork: 2, buildPhysical: 1, howMachinesWork: 1 },
    vision: { manufacturing: 3, govtPsu: 2, research: 2, energy: 1 },
  },
  {
    id: 'mining',
    shortName: 'MIN',
    name: 'Mining Engineering',
    plainLine: 'Extracting minerals and resources from the earth — fieldwork-heavy, stable careers.',
    outlook: 'caution',
    outlookNote:
      'Narrow employer base and the energy transition cap upside. The bright spot is critical minerals (lithium, copper) and remote automation.',
    predictorBranch: 'mining',
    demandTier: 3,
    subjects: { physics: 2, maths: 1, chemistry: 1 },
    traits: { outdoorsField: 3, buildPhysical: 1, howMachinesWork: 1 },
    vision: { govtPsu: 3, energy: 2, highPaying: 2, manufacturing: 1 },
  },
  {
    id: 'petroleum',
    shortName: 'PET',
    name: 'Petroleum Engineering',
    plainLine: 'Finding and producing oil, gas and the energy resources beneath the ground.',
    outlook: 'caution',
    outlookNote:
      'Oil demand is plateauing and hiring is cyclical. The skills transfer to geothermal, carbon-capture and hydrogen — the future energy roles.',
    demandTier: 3,
    subjects: { chemistry: 2, physics: 2, maths: 2 },
    traits: { outdoorsField: 2, howMachinesWork: 2, labWork: 1, bigSystems: 1 },
    vision: { energy: 3, highPaying: 2, govtPsu: 2, abroad: 2 },
  },
  {
    id: 'environmental',
    shortName: 'ENV',
    name: 'Environmental & Climate Engineering',
    plainLine: 'Engineering for a cleaner planet — climate, clean energy, water and pollution.',
    outlook: 'booming',
    outlookNote:
      "Climate and clean-energy work is structurally expanding — among the world's fastest-growing engineering missions.",
    demandTier: 3,
    subjects: { chemistry: 2, biology: 2, physics: 1, maths: 1 },
    traits: { outdoorsField: 3, bigSystems: 2, livingThings: 2, labWork: 1 },
    vision: { socialImpact: 3, energy: 2, govtPsu: 2, research: 2, construction: 1 },
  },

  // ── Life & bio ─────────────────────────────────────────────────────────────
  {
    id: 'biotech',
    shortName: 'BT',
    name: 'Biotechnology',
    plainLine: 'Engineering with living systems — genetics, medicine, food and the environment.',
    outlook: 'evolving',
    outlookNote:
      'Booming if you add computation — AI is accelerating discovery, so bench-only skills get squeezed.',
    predictorBranch: 'biotech',
    demandTier: 3,
    subjects: { biology: 3, chemistry: 3, maths: 1 },
    traits: { labWork: 3, livingThings: 3, abstractLogic: 1 },
    vision: { research: 3, healthcare: 3, socialImpact: 1, abroad: 1 },
  },
  {
    id: 'bioinformatics',
    shortName: 'BIO-I',
    name: 'Bioinformatics & Computational Biology',
    plainLine: 'Using computers and data to decode biology — genomes, drugs and disease.',
    outlook: 'booming',
    outlookNote:
      'Biology × data — genomics and drug discovery generate huge datasets that need computational minds. Exactly what AI rewards.',
    demandTier: 2,
    subjects: { biology: 3, coding: 2, maths: 2, chemistry: 1 },
    traits: { livingThings: 3, codingSoftware: 2, abstractLogic: 2, labWork: 1 },
    vision: { research: 3, healthcare: 3, abroad: 2, software: 1 },
  },
  {
    id: 'agri-food',
    shortName: 'AG/FT',
    name: 'Agricultural & Food Technology',
    plainLine: 'The science of food and farming — crops, nutrition, processing and food security.',
    outlook: 'resilient',
    outlookNote:
      'Food security is India-critical and agri-tech is rising — AI, drones and sensors are redefining farming from manual to data-driven.',
    predictorBranch: 'agriculture',
    demandTier: 3,
    subjects: { biology: 3, chemistry: 2 },
    traits: { outdoorsField: 2, livingThings: 3, labWork: 2 },
    vision: { socialImpact: 2, govtPsu: 2, manufacturing: 1, healthcare: 1, research: 1 },
  },

  // ── Frontier physics & interdisciplinary ───────────────────────────────────
  {
    id: 'eng-physics',
    shortName: 'EP',
    name: 'Engineering Physics',
    plainLine: 'Deep physics + maths + computing — a launchpad for research and frontier tech.',
    outlook: 'evolving',
    outlookNote:
      'An elite launchpad into quantum, semiconductors and photonics — but it has no single job market; commit early to a specialisation.',
    predictorBranch: 'engineering physics',
    demandTier: 2,
    subjects: { physics: 3, maths: 3, coding: 1 },
    traits: { abstractLogic: 3, labWork: 2, electronicsCircuits: 1 },
    vision: { research: 3, abroad: 2, software: 1, finance: 1 },
  },
  {
    id: 'quantum',
    shortName: 'QT',
    name: 'Quantum Technology',
    plainLine: 'The next computing revolution — using quantum physics to build ultra-powerful machines.',
    outlook: 'booming',
    outlookNote:
      "India's ₹6,003-cr National Quantum Mission is funding a near-empty talent pool — bleeding-edge, longer payoff, huge first-mover upside.",
    track: 'Emerging',
    demandTier: 3,
    subjects: { physics: 3, maths: 3, coding: 2 },
    traits: { abstractLogic: 3, labWork: 1, electronicsCircuits: 1 },
    vision: { research: 3, abroad: 2, highPaying: 1 },
  },
  {
    id: 'eng-design',
    shortName: 'DES',
    name: 'Engineering Design & UX',
    plainLine: 'Designing how products and software look, feel and work for people (UX & industrial design).',
    outlook: 'evolving',
    outlookNote:
      'AI commoditises pixel-pushing, so value moves up to UX strategy, research and AI-product design — taste and judgement still win.',
    track: 'Design',
    predictorBranch: 'industrial design',
    demandTier: 3,
    subjects: { drawing: 3, business: 2, maths: 1 },
    traits: { designCreative: 3, abstractLogic: 1, buildPhysical: 1 },
    vision: { startup: 2, software: 1, socialImpact: 1, abroad: 1, highPaying: 1 },
  },
  {
    id: 'economics',
    shortName: 'ECO',
    name: 'Economics & Financial Engineering',
    plainLine: 'How money, markets and decisions work — maths-driven economics and finance.',
    outlook: 'booming',
    outlookNote:
      'AI amplifies quants and fintech rather than replacing them — bigger data, faster models, new roles like AI-product quant.',
    track: 'B.S. Eco',
    demandTier: 1,
    subjects: { maths: 3, business: 3 },
    traits: { abstractLogic: 2, bigSystems: 2 },
    vision: { finance: 3, highPaying: 3, abroad: 2, research: 1, startup: 1 },
  },

  // ── Pure science (B.S. / Integrated M.Sc — IISERs, IITs, NITs) ──────────────
  {
    id: 'bsc-physics',
    shortName: 'PHY',
    name: 'Physics (B.S. / M.Sc)',
    plainLine: 'Pure physics — understanding how the universe works, from atoms to galaxies.',
    outlook: 'evolving',
    outlookNote:
      'A powerful foundation for quantum, semiconductors, data and finance — but stack it with computation or research depth; a bare B.Sc is weak in the market.',
    track: 'B.S. / M.Sc',
    demandTier: 3,
    subjects: { physics: 3, maths: 3 },
    traits: { abstractLogic: 3, labWork: 2 },
    vision: { research: 3, abroad: 2, finance: 1 },
  },
  {
    id: 'bsc-chemistry',
    shortName: 'CHEM',
    name: 'Chemistry (B.S. / M.Sc)',
    plainLine: 'Pure chemistry — the science of matter, reactions and new materials.',
    outlook: 'evolving',
    outlookNote:
      'Pharma and materials keep it relevant, but go computational (cheminformatics, materials) — routine wet-lab analysis is being automated.',
    track: 'B.S. / M.Sc',
    predictorBranch: 'chemistry',
    demandTier: 3,
    subjects: { chemistry: 3, biology: 1, maths: 1 },
    traits: { labWork: 3, livingThings: 1 },
    vision: { research: 3, healthcare: 2, govtPsu: 1 },
  },
  {
    id: 'bsc-math',
    shortName: 'MATH',
    name: 'Mathematics & Statistics (B.S. / M.Sc)',
    plainLine: 'Pure maths & statistics — the language behind AI, data and modern finance.',
    outlook: 'booming',
    outlookNote:
      'Maths and statistics are the direct feedstock for AI, data science and quant — among the highest-leverage pure-science paths.',
    track: 'B.S. / M.Sc',
    predictorBranch: 'mathematics',
    demandTier: 2,
    subjects: { maths: 3, coding: 2 },
    traits: { abstractLogic: 3 },
    vision: { finance: 3, research: 2, software: 2, highPaying: 2, abroad: 2 },
  },
  {
    id: 'bsc-biology',
    shortName: 'BIO',
    name: 'Biology / Life Sciences (B.S. / M.Sc)',
    plainLine: 'Pure life sciences — how living things work, from cells to ecosystems.',
    outlook: 'evolving',
    outlookNote:
      'Genomics and precision medicine boom if you add data skills; pure descriptive biology has weak standalone prospects in India.',
    track: 'B.S. / M.Sc',
    demandTier: 3,
    subjects: { biology: 3, chemistry: 2 },
    traits: { livingThings: 3, labWork: 3 },
    vision: { research: 3, healthcare: 2, socialImpact: 2 },
  },
];

// Signature hue (HSL degrees) per branch — drives the cloud's colour wash and
// the reality-card header mesh. Grouped by domain so related fields rhyme.
export const BRANCH_HUE: Record<string, number> = {
  cse: 214, it: 202, 'ai-ml': 258, 'data-science': 240, 'math-computing': 230, cybersecurity: 268,
  ece: 188, vlsi: 196, instrumentation: 172,
  eee: 280, ee: 252,
  mechanical: 30, robotics: 12, automobile: 16, aerospace: 206, production: 6,
  civil: 142, environmental: 158,
  chemical: 310, metallurgy: 42, mining: 34, petroleum: 24,
  biotech: 134, bioinformatics: 120, 'agri-food': 96,
  'eng-physics': 288, quantum: 300, 'eng-design': 330, economics: 50,
  'bsc-physics': 286, 'bsc-chemistry': 318, 'bsc-math': 226, 'bsc-biology': 128,
};

// Future-outlook badge treatment — label, colour and glyph. Shared by the cloud
// tiles, the legend, the expand modal and the reality-check section.
export const OUTLOOK_META: Record<OutlookBucket, { label: string; color: string; glyph: string }> = {
  booming: { label: 'Booming', color: '#34d399', glyph: '▲' },
  resilient: { label: 'Resilient', color: '#7dd3fc', glyph: '◆' },
  evolving: { label: 'Evolving', color: '#fbbf24', glyph: '↻' },
  caution: { label: 'Re-skill needed', color: '#f87171', glyph: '⚠' },
};

// "Where it leads" — example career roles per branch, shown in the expand modal.
// Kept as a side map (keyed by id) so role lists can be tuned without touching
// the profile objects. Every BRANCH_PROFILES id must have an entry.
export const BRANCH_ROLES: Record<string, string[]> = {
  cse: ['Software Engineer', 'Backend / Product Developer', 'AI / ML Engineer', 'Startup Founder'],
  it: ['Software Developer', 'Cloud / DevOps Engineer', 'IT Consultant', 'Systems Analyst'],
  'ai-ml': ['Machine Learning Engineer', 'Data / AI Scientist', 'Research Engineer', 'AI Product Builder'],
  'data-science': ['Data Scientist', 'Data / ML Engineer', 'Business / Analytics roles', 'Quant Analyst'],
  cybersecurity: ['Security Engineer', 'Ethical Hacker / Pen-tester', 'Threat / SOC Analyst', 'Security Architect'],
  'math-computing': ['Quant / Algo Trader', 'Data Scientist', 'Software Engineer', 'Cryptography / Research'],
  ece: ['VLSI / Chip Engineer', 'Embedded Systems Engineer', 'Telecom Engineer', 'Hardware + Software roles'],
  vlsi: ['Chip Design Engineer', 'Verification Engineer', 'Semiconductor R&D', 'Embedded / Hardware Engineer'],
  eee: ['Power Systems Engineer', 'Electronics Design Engineer', 'PSU / Core Engineer', 'Automation Engineer'],
  ee: ['Power / Grid Engineer', 'Renewable Energy Engineer', 'PSU Engineer (NTPC, PowerGrid)', 'Control Systems Engineer'],
  instrumentation: ['Control Systems Engineer', 'Automation / PLC Engineer', 'Industrial-IoT Engineer', 'Process Instrumentation'],
  mechanical: ['Design / CAE Engineer', 'Manufacturing Engineer', 'Automotive / Aerospace roles', 'PSU Engineer'],
  robotics: ['Robotics Engineer', 'Automation / Controls Engineer', 'Mechatronics R&D', 'Embedded Robotics'],
  automobile: ['EV / Powertrain Engineer', 'Automotive Design Engineer', 'Battery Systems Engineer', 'R&D Engineer'],
  aerospace: ['Aircraft / Aerospace Engineer', 'Propulsion Engineer', 'Space-tech / ISRO roles', 'Defence R&D'],
  production: ['Operations / Supply-chain Manager', 'Industrial / Process Engineer', 'Quality Engineer', 'Analytics / Ops roles'],
  civil: ['Structural Engineer', 'Construction / Project Manager', 'Infrastructure (Govt / PSU)', 'Urban / Transport Planner'],
  chemical: ['Process Engineer', 'Pharma / Energy roles', 'Plant / Production Engineer', 'R&D Engineer'],
  metallurgy: ['Materials Engineer', 'Metallurgist (steel / PSU)', 'Battery / Materials R&D', 'Quality / Process Engineer'],
  mining: ['Mining Engineer', 'Mine Planning / Safety', 'PSU roles (Coal India)', 'Critical-minerals / automation'],
  petroleum: ['Reservoir / Drilling Engineer', 'Oil & Gas (ONGC etc.)', 'Energy roles (geothermal, H₂)', 'Subsurface Engineer'],
  environmental: ['Environmental Engineer', 'Clean-energy / Sustainability roles', 'Water / Waste Engineer', 'Climate / ESG Analyst'],
  biotech: ['Biotech Researcher', 'Pharma / Biopharma roles', 'Bioprocess Engineer', 'R&D / Higher studies'],
  bioinformatics: ['Bioinformatics Scientist', 'Computational Biologist', 'Genomics / Drug-discovery roles', 'Health-data Analyst'],
  'agri-food': ['Food Technologist', 'Agri-tech Engineer', 'Quality / R&D (FSSAI, FMCG)', 'Supply-chain roles'],
  'eng-physics': ['R&D Scientist', 'Semiconductor / Photonics Engineer', 'Quantum / Deep-tech roles', 'Data / Quant roles'],
  quantum: ['Quantum Researcher', 'Quantum Hardware / Software Engineer', 'Deep-tech R&D', 'Higher studies (MS / PhD)'],
  'eng-design': ['UX / Product Designer', 'Industrial Designer', 'Design Researcher', 'Design-led Founder'],
  economics: ['Quant / Financial Analyst', 'Economist / Policy roles', 'Data / Risk Analyst', 'Consulting / Finance'],
  'bsc-physics': ['Researcher (MS / PhD)', 'Data Scientist', 'Semiconductor / Quantum roles', 'Academia / R&D'],
  'bsc-chemistry': ['Research Chemist', 'Pharma / Materials roles', 'Cheminformatics / Data', 'Academia / Higher studies'],
  'bsc-math': ['Data Scientist', 'Quant / Actuary', 'Statistician / Analyst', 'Researcher / Academia'],
  'bsc-biology': ['Life-science Researcher', 'Genomics / Biotech roles', 'Healthcare / R&D', 'Academia / Higher studies'],
};
