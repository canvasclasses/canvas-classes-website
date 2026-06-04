// Branch Finder — "Know Your Dream Career: A Reality Check".
//
// An honest, myth-busting profile per branch. The goal is the opposite of a
// brochure: puncture the rosy picture and tell a 17-year-old what the work
// actually feels like. Salary/recruiter figures are DIRECTIONAL (Indian
// market, 2026) and labelled as such in the UI — never quote them as guarantees.
//
// Authored for a first batch of exemplar branches; the rest fall back to a
// "coming soon" state until filled. Keys must match BRANCH_PROFILES ids.

export interface CareerReality {
  // Blunt one-liner that punctures the fantasy.
  hook: string;
  // 2–3 sentences: what a normal working day actually looks like.
  dayInLife: string;
  // The centerpiece — what students believe vs the truth.
  myths: { myth: string; reality: string }[];
  // 0 = entirely desk/remote, 100 = entirely field/site/rig. UI shows a meter.
  workSetting: number;
  workSettingNote: string;
  // 0 = introvert / solo-friendly, 100 = extrovert / highly people-facing.
  social: number;
  socialNote: string;
  // 3–4 aptitudes/qualities that separate those who thrive.
  excelQualities: string[];
  // 4–6 representative core subjects you'll actually study.
  subjects: string[];
  // Real recruiters in the sector, split so students see where the MAJORITY
  // actually land (India) separately from the aspirational global names.
  indianRecruiters: string[];
  globalRecruiters: string[];
  // Honest, directional pay note — entry reality + ceiling + the catch.
  salaryReality: string;
  // Whether higher studies (MS/PhD/MBA) are basically needed to make it pay.
  higherStudies: string;
  // The fit and — just as important — the anti-fit.
  fitFor: string;
  notFor: string;
  // Optional illustration of a professional at work (watercolor / anime style).
  // Drop the asset in apps/student/public/branch-finder/careers/<id>.webp and
  // set this to e.g. '/branch-finder/careers/cse.webp'. When absent, the card
  // shows a branded placeholder with a field icon.
  image?: string;
}

export const CAREER_REALITY: Record<string, CareerReality> = {
  cse: {
    hook: "The dream is real — but so is the grind, the constant relearning, and the fact that everyone else also picked CSE.",
    dayInLife:
      'Most days are at a laptop: writing and reviewing code, debugging, design discussions and standups. Increasingly you direct AI tools and review their output rather than typing every line. Deep-focus work in headphones, broken up by collaboration.',
    myths: [
      {
        myth: 'CSE means a guaranteed ₹40L+ package and a chill remote job.',
        reality: 'Those offers go to a small top slice from strong colleges/skills; the median is solid but ordinary, and the field is crowded now.',
      },
      {
        myth: 'Once you learn to code, you’re set for life.',
        reality: 'The stack changes every few years and AI is reshaping the work — you’ll be relearning constantly to stay relevant.',
      },
      {
        myth: 'It’s all building cool new apps.',
        reality: 'A lot of it is maintaining old systems, fixing bugs, meetings, and reading other people’s code.',
      },
    ],
    workSetting: 8,
    workSettingNote: 'Desk / remote work — mostly solo focus with team collaboration.',
    social: 45,
    socialNote: 'Works for introverts and extroverts, but you must collaborate and explain your ideas.',
    excelQualities: ['Logical problem-solving', 'Patience for debugging', 'Self-driven learning', 'Breaking big problems into steps'],
    subjects: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'Theory of Computation', 'AI / ML basics'],
    indianRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'HCLTech', 'Zoho', 'Flipkart'],
    globalRecruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Atlassian', 'Goldman Sachs (tech)'],
    salaryReality: 'Wide spread — a strong median, but the headline offers are a small top slice. Skills and projects now matter more than the degree itself. (Directional.)',
    higherStudies: 'Not required — many do well on a B.Tech plus strong projects. An MS helps for research or working abroad.',
    fitFor: 'You enjoy puzzles, can sit with a hard problem, and like teaching yourself new things.',
    notFor: 'You want one fixed skill set for life, dislike screens all day, or expect the package without the grind.',
  },

  mechanical: {
    hook: "The 'mother branch' touches everything — but the average core job pays less than software and asks you to start on a shop floor.",
    dayInLife:
      'It depends on the role: a design engineer is on CAD and simulation at a desk; a manufacturing engineer is on the plant floor solving production problems; a service engineer is on-site. Expect a mix of computer work and being around real machines.',
    myths: [
      {
        myth: 'Mechanical engineers all design cars and rockets.',
        reality: 'Most core jobs are in manufacturing, maintenance, quality and operations — important, but less glamorous than the brochure.',
      },
      {
        myth: 'Core branch = stable high pay.',
        reality: 'Core starting salaries are modest vs IT; many mechanical grads pivot to software, analytics or management for higher pay.',
      },
      {
        myth: 'It’s all hands-on with machines.',
        reality: 'Increasingly it’s CAD, simulation and data — and the pure-drafting role is the one AI is automating first.',
      },
    ],
    workSetting: 55,
    workSettingNote: 'Roles span desk (design) to plant floor and on-site — often a mix.',
    social: 55,
    socialNote: 'Plant and operations roles need people skills to coordinate teams; design roles are quieter.',
    excelQualities: ['Spatial / visual thinking', 'Curiosity about how things work', 'Practical problem-solving', 'Comfort on a shop floor'],
    subjects: ['Thermodynamics', 'Strength of Materials', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Processes', 'CAD / CAE'],
    indianRecruiters: ['Tata Motors', 'Mahindra', 'Maruti Suzuki', 'L&T', 'Bajaj / Hero', 'ISRO / DRDO', 'PSUs (BHEL, NTPC)'],
    globalRecruiters: ['Bosch', 'Cummins', 'Caterpillar', 'Mercedes-Benz R&D', 'Siemens'],
    salaryReality: 'Core entry pay is modest and rises slowly; the higher-paying paths usually mean auto/aerospace specialisation, going abroad, or pivoting to tech/management. (Directional.)',
    higherStudies: 'Optional, but an M.Tech / MS or MBA noticeably widens options and pay.',
    fitFor: 'You like physical things and machines, don’t mind starting on a plant floor, and want a broad foundation.',
    notFor: 'You want a high starting package, a pure metro desk job, or fast money without field exposure.',
  },

  cybersecurity: {
    hook: "Genuinely booming and short-staffed — but it's high-responsibility and always-on; you're judged by the breach that didn't happen.",
    dayInLife:
      'Monitoring systems for threats, testing apps for vulnerabilities, responding to incidents, and a lot of reading to keep up with new attacks. Some roles are calm, methodical analysis; incident response can mean high-pressure, off-hours firefighting.',
    myths: [
      {
        myth: 'Cybersecurity is hacking like in the movies.',
        reality: 'Most of it is defence, monitoring, audits, patching and documentation — methodical, not cinematic.',
      },
      {
        myth: 'You’ll never be jobless and the pay is huge.',
        reality: 'Demand is real and pay is strong, but entry needs certifications and hands-on skill, not just a degree.',
      },
      {
        myth: 'It’s a comfortable 9-to-5.',
        reality: 'Attacks don’t keep office hours — on-call and incident response are part of many roles.',
      },
    ],
    workSetting: 15,
    workSettingNote: 'Mostly desk / remote, but high-stakes and sometimes off-hours during incidents.',
    social: 40,
    socialNote: 'Suits introverts — but you must explain risks clearly to non-technical teams.',
    excelQualities: ['Attention to detail', 'Ethical mindset', 'Persistent curiosity', 'Calm under pressure'],
    subjects: ['Networks & Security', 'Cryptography', 'Operating Systems', 'Ethical Hacking', 'Secure Coding', 'Risk & Compliance'],
    indianRecruiters: ['TCS', 'Infosys', 'Wipro', 'Banks (HDFC, ICICI)', 'CERT-In / Govt', 'Quick Heal', 'Security startups'],
    globalRecruiters: ['Palo Alto Networks', 'Cisco', 'Deloitte', 'EY', 'PwC'],
    salaryReality: 'Strong and rising, with a real skills shortage — but certifications (OSCP, CEH) and hands-on labs matter as much as the degree. (Directional.)',
    higherStudies: 'Not required — certifications and practical skill often beat a master’s here.',
    fitFor: 'You’re detail-obsessed, ethical, enjoy cat-and-mouse problem-solving, and stay calm in a crisis.',
    notFor: 'You want predictable hours, dislike constant learning, or expected Hollywood-style hacking.',
  },

  petroleum: {
    hook: 'Big money — but on the world’s edges, with a clock ticking on oil.',
    dayInLife:
      'Field roles mean rotations on rigs or remote sites — often two weeks on, two weeks off, far from home. Office roles (reservoir, drilling planning) are at a desk with simulation software. Both can involve travel and postings in the Gulf or abroad.',
    myths: [
      {
        myth: 'Petroleum means a guaranteed fat paycheck.',
        reality: 'Top pay is real but cyclical — hiring swings with oil prices, and campus placements vary a lot year to year.',
      },
      {
        myth: 'It’s a desk job in a city.',
        reality: 'Core roles are offshore rigs and remote sites, often on rotation away from family.',
      },
      {
        myth: 'It’s a future-proof energy field.',
        reality: 'Oil demand is plateauing; your long game is pivoting to geothermal, carbon-capture or hydrogen.',
      },
    ],
    workSetting: 80,
    workSettingNote: 'Field- and rig-heavy with rotations; some office reservoir / planning roles.',
    social: 50,
    socialNote: 'Field teams need coordination and resilience — not a quiet solo desk life.',
    excelQualities: ['Comfort living away from home', 'Physical & mental resilience', 'Practical problem-solving', 'Adaptability to remote postings'],
    subjects: ['Reservoir Engineering', 'Drilling Technology', 'Petroleum Geology', 'Thermodynamics', 'Fluid Mechanics', 'Production Engineering'],
    indianRecruiters: ['ONGC', 'Oil India', 'Reliance', 'Cairn / Vedanta', 'IOCL / BPCL / HPCL', 'GAIL'],
    globalRecruiters: ['Schlumberger', 'Halliburton', 'Shell', 'Baker Hughes', 'ADNOC (Gulf)'],
    salaryReality: 'High ceiling for offshore / abroad roles, but volatile and tied to oil prices — not a safe bet for steadily rising pay. (Directional.)',
    higherStudies: 'Optional, but specialisation or a pivot to new-energy skills future-proofs you.',
    fitFor: 'You’re okay living away from home, want high-risk / high-reward, and prefer fieldwork to a city desk.',
    notFor: 'You want stability, a metro 9-to-5, or a clearly future-proof field.',
  },

  civil: {
    hook: 'You’ll literally build the country — but the pay ceiling is lower than tech, and early years are on dusty sites, not just blueprints.',
    dayInLife:
      'Site engineers spend the day at construction sites supervising work, checking quality and safety, and coordinating labour and contractors. Design and planning roles are office-based on structural software and BIM. Expect a lot of outdoor, on-ground work early in your career.',
    myths: [
      {
        myth: 'Civil engineers sit and design buildings all day.',
        reality: 'Early years are mostly on-site supervision in sun, dust and deadlines — the design desk comes later or with higher studies.',
      },
      {
        myth: 'It pays like the other core branches.',
        reality: 'Starting pay is on the lower side; growth is steady, and Govt / PSU roles trade salary for stability.',
      },
      {
        myth: 'AI and automation will replace it.',
        reality: 'Physical construction can’t be offshored or fully automated — but BIM and digital twins are changing planning, so add those skills.',
      },
    ],
    workSetting: 70,
    workSettingNote: 'Site-heavy early career; design and planning roles are office-based.',
    social: 60,
    socialNote: 'You manage contractors, labour and clients — people skills matter a lot.',
    excelQualities: ['On-ground problem-solving', 'Leadership & coordination', 'Tolerance for outdoor work', 'Safety and detail focus'],
    subjects: ['Structural Analysis', 'Geotechnical Engineering', 'Surveying', 'Construction Management', 'Transportation Engineering', 'Concrete / BIM'],
    indianRecruiters: ['L&T', 'Tata Projects', 'Shapoorji Pallonji', 'Govt / PSU (CPWD, NHAI)', 'DLF / developers', 'Afcons'],
    globalRecruiters: ['AECOM', 'Jacobs', 'Bechtel', 'Arup'],
    salaryReality: 'Modest starting pay with steady growth; Govt / PSU and Gulf roles improve it. A lower ceiling than tech. (Directional.)',
    higherStudies: 'An M.Tech (structures / geotech) or a PMP / MBA meaningfully boosts roles and pay.',
    fitFor: 'You like on-ground work, leading teams, and building tangible things; you value stability.',
    notFor: 'You want a metro desk job, high starting pay, or to avoid sites and the outdoors.',
  },

  'bsc-physics': {
    hook: 'A beautiful, powerful foundation — but a bare bachelor’s earns little; the payoff needs a master’s, PhD, or a computational pivot.',
    dayInLife:
      'As a student: deep problem-solving, labs and a lot of maths. As a career: usually research (in labs or on computers), or you’ve pivoted into data science, quant or semiconductors — often after a higher degree.',
    myths: [
      {
        myth: 'Pure science is an easy path to becoming a scientist.',
        reality: 'Research careers need an MSc / PhD and patience; the bachelor’s alone has weak job prospects in India.',
      },
      {
        myth: 'There’s no money in physics.',
        reality: 'There is — but usually via a pivot to data / quant / tech or research abroad, not the B.Sc itself.',
      },
      {
        myth: 'It’s all theory and chalkboards.',
        reality: 'Modern physics careers are heavy on coding, simulation and data.',
      },
    ],
    workSetting: 30,
    workSettingNote: 'Labs and computers — research or analysis, rarely field / site work.',
    social: 35,
    socialNote: 'Suits introverts and independent thinkers; research is collaborative but quiet.',
    excelQualities: ['Abstract / mathematical thinking', 'Patience and rigour', 'Genuine curiosity', 'Comfort with long timelines'],
    subjects: ['Classical & Quantum Mechanics', 'Electromagnetism', 'Statistical Physics', 'Mathematical Methods', 'Computational Physics', 'Electronics'],
    indianRecruiters: ['IISc / IITs & research labs', 'ISRO / DRDO / BARC', 'Indian data / quant firms', 'Ed-tech', 'Semiconductor (in India)'],
    globalRecruiters: ['Universities abroad (MS / PhD)', 'CERN-type labs', 'Intel / TSMC / AMD', 'Global quant firms'],
    salaryReality: 'Low for a standalone B.Sc; strong once you add a master’s / PhD or pivot to data / quant / semiconductors. Plan for higher studies. (Directional.)',
    higherStudies: 'Effectively required — an MSc / PhD or a computational add-on is how this pays off.',
    fitFor: 'You love understanding why things work, enjoy maths, and are willing to study for the long term.',
    notFor: 'You want to earn well right after graduation, or prefer applied, hands-on field work.',
  },
};
