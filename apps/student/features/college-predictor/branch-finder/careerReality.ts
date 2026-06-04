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
  'it': {
    hook: 'The classic IT-services path — TCS/Infosys mass hiring — is exactly the entry-level work AI is eating first.',
    dayInLife:
      'Most days are at a desk: maintaining and supporting existing software, fixing tickets, writing routine code, running manual tests, and attending client/standup calls. A lot of it is process-heavy and repetitive — keeping big enterprise systems running rather than building shiny new things. Increasingly you’re expected to use AI tools to do the grunt work faster.',
    myths: [
      { myth: 'An IT services job at TCS/Infosys is a safe, guaranteed career for life.', reality: 'Entry-level service roles are shrinking — companies now want fewer freshers and more ’AI-ready’ specialists; the bottom rungs are the first to be automated.' },
      { myth: 'You’ll be building cutting-edge products.', reality: 'Most of the work is support, maintenance, and client delivery on legacy systems — useful, but not glamorous, and not where the big money is.' },
      { myth: 'The fat fresher packages are normal.', reality: 'Base tracks pay ₹3.5–7 LPA; the ₹11–21 LPA ’specialist’ offers go to a small slice with niche AI/cloud skills, not the general intake.' },
    ],
    workSetting: 10,
    workSettingNote: 'Desk / office / remote — sometimes client-site for delivery roles.',
    social: 50,
    socialNote: 'Lots of client calls, coordination, and team delivery — not a quiet solo coding life.',
    excelQualities: ['Reliability and discipline', 'Willingness to constantly reskill', 'Communication with clients', 'Patience with process and documentation'],
    subjects: ['Programming & Software Engineering', 'DBMS', 'Computer Networks', 'Operating Systems', 'Web/Cloud Fundamentals', 'Software Testing'],
    indianRecruiters: ['TCS', 'Infosys', 'Wipro', 'HCLTech', 'Cognizant', 'Accenture', 'Capgemini', 'Tech Mahindra'],
    globalRecruiters: ['IBM', 'Accenture (global)', 'DXC Technology', 'Deloitte (tech)', 'Oracle'],
    salaryReality:
      'Entry base is modest (~₹3.5–7 LPA on standard tracks); the ₹11–21 LPA headline offers are a small specialist slice. The catch: this is the segment AI is automating fastest, so steady raises depend on quickly moving into cloud/AI/data niches rather than staying in plain support. (Directional.)',
    higherStudies:
      'Not required to start. Long-term, certifications (cloud, data, AI) or an MS/MBA matter more than the degree for moving up or out of routine work.',
    fitFor: 'You want a stable on-ramp into tech, are okay starting with routine work, and will keep reskilling as the field shifts.',
    notFor: 'You expect a future-proof, high-pay job from day one or dislike repetitive maintenance and process-heavy delivery work.',
  },
  'ai-ml': {
    hook: 'It’s the hottest field on paper — but the good jobs want real math and real projects, not just a 3-month ’AI course’.',
    dayInLife:
      'Most days are at a laptop: cleaning data, training and tuning models, reading papers, and writing code to test ideas — with long stretches where nothing works and you debug why. Increasingly the job is wiring up and evaluating large AI models rather than building everything from scratch. Deep-focus work, broken by team reviews.',
    myths: [
      { myth: 'Any AI/ML degree means a ₹20L+ job waiting for you.', reality: 'Demand is real and high, but employers want strong math, coding, and a portfolio of real projects; weak candidates with just a buzzword degree struggle.' },
      { myth: 'You’ll be building robots and ChatGPT all day.', reality: 'Most of the job is unglamorous data cleaning, experiments that fail, and squeezing small accuracy gains — the magic is 10% of the time.' },
      { myth: 'AI skills never go stale.', reality: 'The tools and models change every few months — you’ll be relearning constantly to stay employable.' },
    ],
    workSetting: 8,
    workSettingNote: 'Desk / remote — solo deep work with team collaboration.',
    social: 40,
    socialNote: 'Introvert-friendly, but you must explain results to non-technical teams.',
    excelQualities: ['Strong math (probability, linear algebra)', 'Comfort with messy, failing experiments', 'Self-driven learning', 'Coding fluency'],
    subjects: ['Machine Learning', 'Probability & Statistics', 'Linear Algebra', 'Deep Learning', 'Data Structures & Algorithms', 'Natural Language Processing'],
    indianRecruiters: ['Sarvam AI / Krutrim (Ola)', 'Flipkart', 'Swiggy / Zomato', 'Zerodha', 'Fractal Analytics', 'Mu Sigma', 'Jio / Reliance', 'TCS/Infosys AI units'],
    globalRecruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Nvidia', 'Uber'],
    salaryReality:
      'Entry roles commonly land around ₹8–14 LPA for strong candidates with real projects, higher for GenAI/MLOps niches; weaker portfolios land far lower. The catch: the headline ₹30–50 LPA offers go to a small elite from top colleges with serious skills — the median is good, not insane. (Directional.)',
    higherStudies:
      'Often helpful — an MS/MTech opens better research and product roles, and a PhD for deep research labs. Strong projects can substitute for many product roles.',
    fitFor: 'You genuinely enjoy math and statistics, can sit through failing experiments, and teach yourself constantly.',
    notFor: 'You’re weak at or dislike math, want quick guaranteed money, or expect to skip the grind with a short course.',
  },
  'data-science': {
    hook: 'Half the ’data science’ jobs are actually data cleaning and dashboards — and that’s the part you’ll spend most of your time on.',
    dayInLife:
      'Most days are at a desk: pulling and cleaning data with SQL/Python, building pipelines or dashboards, and answering business questions with numbers. Data engineers spend most time making data flow reliably; data scientists spend it on analysis and models. A lot of it is plumbing and reporting, not glamorous prediction.',
    myths: [
      { myth: 'Data science is all building fancy ML models.', reality: '60–80% of the real work is cleaning messy data, writing SQL, and building pipelines — the modelling is a small slice on top.' },
      { myth: 'It’s the ’sexiest job of the century’ so it’s easy money.', reality: 'The field is crowded with course-grads now; standing out needs real SQL, statistics, and business sense, not just a certificate.' },
      { myth: 'Data engineer and data scientist are the same.', reality: 'Engineering is heavy software/pipeline work; science is heavy stats/analysis — pick which one actually suits you before you commit.' },
    ],
    workSetting: 8,
    workSettingNote: 'Desk / remote — solo analysis plus stakeholder meetings.',
    social: 50,
    socialNote: 'You constantly translate data into plain answers for business teams — communication matters as much as code.',
    excelQualities: ['Strong SQL and Python', 'Statistical thinking', 'Curiosity about business problems', 'Patience for messy data'],
    subjects: ['Statistics & Probability', 'SQL & Databases', 'Python / Data Wrangling', 'Machine Learning', 'Data Visualization', 'Big Data / Cloud Tools'],
    indianRecruiters: ['Fractal Analytics', 'Mu Sigma', 'Tiger Analytics', 'Flipkart / Amazon India', 'Swiggy / Zomato', 'Razorpay / Paytm', 'Deloitte / EY (analytics)', 'Jio / Reliance'],
    globalRecruiters: ['Amazon', 'Microsoft', 'Google', 'Walmart Global Tech', 'Uber', 'Mastercard'],
    salaryReality:
      'Data scientists often start ~₹6–12 LPA; data engineers a bit lower (~₹4–8 LPA entry) but with strong growth. The catch: ’data scientist’ titles vary wildly — some are glorified analyst/reporting roles at the lower end, and the ₹14 LPA+ fresher figures skew toward elite colleges. (Directional.)',
    higherStudies:
      'Not required — strong projects, SQL, and stats can land jobs. An MS or specialised analytics degree helps for senior/research-leaning roles.',
    fitFor: 'You like finding stories in numbers, are comfortable with statistics, and don’t mind a lot of data cleaning.',
    notFor: 'You expected pure model-building, dislike SQL and messy data, or want a non-technical ’analytics manager’ role straight away.',
  },
  'math-computing': {
    hook: 'It’s the secret pipeline to quant finance — but only a handful crack those firms, and the rest end up in regular software jobs.',
    dayInLife:
      'If you make it into quant/trading: days are at a desk modelling markets, writing fast code, and back-testing strategies under pressure where small edges mean real money. For most others, the day looks like a strong software or data engineer — building systems, solving algorithmic problems. Heavy thinking, heavy coding, high standards.',
    myths: [
      { myth: 'Math & Computing = a guaranteed ₹50L+ quant job.', reality: 'The eye-watering quant packages go to a tiny top slice from IITs who clear brutal interviews; most graduates take normal (still good) tech roles.' },
      { myth: 'It’s just CSE with extra maths.', reality: 'It’s genuinely math-heavy — probability, optimisation, statistics — and if you don’t love that, it’s a hard, abstract slog.' },
      { myth: 'Quant jobs are calm and intellectual.', reality: 'Trading roles are high-pressure, results-judged daily, and your models are directly tied to profit and loss.' },
    ],
    workSetting: 6,
    workSettingNote: 'Desk-based — quant/dev work, mostly indoors and screen-heavy.',
    social: 35,
    socialNote: 'Mostly solo problem-solving in small sharp teams; introvert-friendly.',
    excelQualities: ['Genuine love of mathematics', 'Strong probability & statistics', 'Fast, clean coding', 'Calm under pressure'],
    subjects: ['Probability & Statistics', 'Linear Algebra & Optimization', 'Stochastic Processes', 'Data Structures & Algorithms', 'Numerical Methods', 'Discrete Mathematics'],
    indianRecruiters: ['Tower Research Capital', 'Optiver (Mumbai)', 'IMC Trading', 'Graviton / Quadeye / WorldQuant (India)', 'Goldman Sachs (strats)', 'D. E. Shaw India', 'American Express (analytics)', 'Google / Microsoft'],
    globalRecruiters: ['Jane Street', 'Citadel Securities', 'Five Rings', 'Two Sigma', 'Millennium'],
    salaryReality:
      'Quant/trading roles for the elite few start very high (commonly ₹25–70 LPA+ at top firms, with global parity for the very best). But that’s a small minority — the typical Math & Computing graduate lands strong software/data roles in the ₹8–18 LPA range. The catch: the headline numbers are survivorship bias, not the median outcome. (Directional.)',
    higherStudies:
      'Optional for quant-dev/software, but an MS/PhD (or strong olympiad-grade math) helps for quant-research and academic paths.',
    fitFor: 'You genuinely love hard maths, enjoy abstract problem-solving, and can handle high-stakes, competitive environments.',
    notFor: 'You only want it for the quant money but don’t actually enjoy mathematics, or you dislike screen-heavy, high-pressure work.',
  },
  'economics': {
    hook: 'It’s the non-coder’s route into finance and quant — but the top jobs demand brutal hours, sharp math, and an elite-college tag.',
    dayInLife:
      'Days are at a desk: building financial models in Excel/Python, analysing markets or company data, writing reports, and (in fintech/quant) coding pricing and risk models. In investment banking, expect long, intense hours; in research or fintech, more analysis and product work. A lot of it is numbers, slides, and deadlines.',
    myths: [
      { myth: 'Economics is an easy, theory-only degree with cushy finance jobs.', reality: 'The good roles are quantitative and competitive — strong math, statistics, and modelling matter; pure theory won’t get you hired.' },
      { myth: 'Everyone becomes an investment banker on ₹25L+.', reality: 'Those bulge-bracket offers go to a small slice from elite colleges; most graduates start in research, analytics, or consulting at far more modest pay.' },
      { myth: 'Finance jobs are glamorous deal-making.', reality: 'Junior years are spreadsheets, late nights, and grunt analysis — the deal-making comes much later, if at all.' },
    ],
    workSetting: 8,
    workSettingNote: 'Desk / office — analysis, modelling, and meetings; occasional client visits.',
    social: 55,
    socialNote: 'Client-facing and team-heavy in banking/consulting; quieter in research/quant.',
    excelQualities: ['Strong quantitative and statistical skills', 'Comfort with high-pressure deadlines', 'Clear analytical writing', 'Financial modelling / coding'],
    subjects: ['Microeconomics & Macroeconomics', 'Econometrics & Statistics', 'Financial Economics', 'Stochastic Calculus / Derivatives', 'Game Theory', 'Programming for Finance (Python/R)'],
    indianRecruiters: ['Goldman Sachs / Morgan Stanley (India)', 'JPMorgan / BofA (India)', 'McKinsey / BCG / Bain', 'Razorpay / Paytm / fintechs', 'CRISIL / ICRA', 'WorldQuant / D. E. Shaw (analytics)', 'RBI / policy think-tanks', 'Big 4 (Deloitte/EY/KPMG/PwC)'],
    globalRecruiters: ['Goldman Sachs', 'JPMorgan', 'BlackRock', 'Citadel', 'World Bank / IMF'],
    salaryReality:
      'Entry varies hugely: research/analytics and Big-4 roles start ~₹6–12 LPA, while investment-banking analysts at global firms start ~₹15–30 LPA. The catch: those top offers concentrate at a few elite colleges and come with 80–100 hour weeks; the broad median is far lower and the ceiling rewards the few who survive the grind. (Directional.)',
    higherStudies:
      'Often valued — a master’s (econ/finance), CFA, FRM, or MBA materially boosts access to top finance, policy, and quant roles.',
    fitFor: 'You like economics and markets, are strong with numbers, and can handle competitive, deadline-heavy work.',
    notFor: 'You dislike math and pressure, want a 9-to-5 from day one, or assume the degree alone guarantees a big finance package.',
  },
  'ece': {
    hook: 'The branch that secretly opens every door — chips, telecom, software, AI hardware — but the catch is you’ll have to pick a lane, and a lot of ECE grads just drift into IT.',
    dayInLife:
      'Depending on your role, you’re at a desk writing embedded C, debugging a circuit board, simulating a signal chain, or doing verification in front of EDA tools. A chunk of ECE grads end up in pure-software IT jobs and barely touch hardware again.',
    myths: [
      { myth: 'ECE is just CSE-lite, you’ll easily switch to software anyway.', reality: 'You can switch, but you’ll compete with CSE grads who spent four years only on code — your DSA has to be just as sharp.' },
      { myth: 'ECE means a guaranteed core electronics job.', reality: 'Core hardware seats are limited; many ECE students land in IT services or telecom support, not chip labs.' },
    ],
    workSetting: 20,
    workSettingNote: 'Mostly lab and desk work — some telecom/field roles, but core electronics is bench-and-screen heavy.',
    social: 40,
    socialNote: 'Works for quieter types, but you’ll do team design reviews and explain your circuits and code.',
    excelQualities: ['Comfort across both hardware and software', 'Patience for debugging at the signal level', 'Willingness to specialize early', 'Self-driven learning'],
    subjects: ['Digital Electronics', 'Signals & Systems', 'Communication Systems', 'Microprocessors & Embedded Systems', 'Analog Circuits', 'Electromagnetic Theory'],
    indianRecruiters: ['Bharat Electronics (BEL)', 'Qualcomm India', 'Samsung R&D', 'Robert Bosch', 'L&T', 'TCS', 'Infosys', 'Reliance Jio'],
    globalRecruiters: ['Texas Instruments', 'Cisco', 'Nokia', 'Intel', 'MediaTek'],
    salaryReality:
      'Core electronics freshers typically land ₹4–8 LPA; IT-route ECE grads track the software median. Top VLSI/chip offers are real but a small slice. (Directional.)',
    higherStudies:
      'An M.Tech or MS strongly helps for core electronics, VLSI, or RF roles — pure B.Tech often funnels into IT.',
    fitFor: 'You like both circuits and code and are okay choosing a specialization to stand out.',
    notFor: 'You want a single guaranteed core job without picking a niche, or you secretly only want software — then just do CSE.',
  },
  'vlsi': {
    hook: 'India’s hottest hardware bet right now — real money, government push, global fabs landing — but it’s deep, slow, unforgiving work where one bug can cost crores.',
    dayInLife:
      'You’re at a desk inside EDA tools all day — writing RTL, running simulations, debugging timing, or doing physical-design and verification. Cycles are long and detail-obsessed; you can spend weeks chasing one corner-case failure.',
    myths: [
      { myth: 'The Semiconductor Mission means easy high-paying jobs for everyone.', reality: 'Demand is real and growing, but core VLSI hires for deep skill — you need strong fundamentals or a focused M.Tech/course, not just any ECE degree.' },
      { myth: 'It’s glamorous chip-making like the news shows.', reality: 'Most India roles are design and verification, not fabrication — it’s patient, screen-bound engineering, not a fab floor.' },
    ],
    workSetting: 8,
    workSettingNote: 'Almost entirely desk/EDA-tool work in Bangalore/Hyderabad design centers — fabrication itself is rare in India.',
    social: 35,
    socialNote: 'Suits focused, detail-driven introverts; collaboration happens in design and verification reviews.',
    excelQualities: ['Obsessive attention to detail', 'Patience for long design cycles', 'Strong digital/analog fundamentals', 'Comfort living inside complex tools'],
    subjects: ['Digital Design & VHDL/Verilog', 'CMOS VLSI Design', 'Semiconductor Device Physics', 'Computer Architecture', 'Static Timing Analysis', 'Design Verification'],
    indianRecruiters: ['Intel India', 'Qualcomm India', 'NVIDIA India', 'Texas Instruments', 'Samsung Semiconductor', 'AMD India', 'Micron', 'Analog Devices'],
    globalRecruiters: ['Broadcom', 'MediaTek', 'Synopsys', 'Cadence', 'ARM'],
    salaryReality:
      'Among the strongest core-engineering starts — roughly ₹6–14 LPA at top design houses, with NVIDIA/Qualcomm outliers higher; smaller firms pay ₹4.5–8 LPA. (Directional.)',
    higherStudies:
      'A focused M.Tech in VLSI or a serious specialization course meaningfully boosts entry — many top roles expect it.',
    fitFor: 'You love going deep, tolerate slow precise work, and want a future-proof, AI-resilient hardware career.',
    notFor: 'You want fast variety, quick shipping, or dislike spending days inside one tool chasing a single bug.',
  },
  'eee': {
    hook: 'The steady all-rounder — power, electronics, automation, and control under one roof. Less hyped than CSE, but it survives every economic cycle and isn’t easily automated away.',
    dayInLife:
      'Could be designing power systems at a desk, testing equipment in a lab, or supervising installation on a plant floor. Many EEE grads also pivot into automation, embedded, or IT roles using their electronics side.',
    myths: [
      { myth: 'EEE pays much less than CSE so it’s a weak choice.', reality: 'Core starting pay is lower, but it’s stable, recession-resistant, and PSU/MNC roles (NTPC, Siemens, ABB) catch up fast with security CSE rarely offers.' },
      { myth: 'It’s an old, dying field.', reality: 'EVs, renewables, and grid modernization are pulling EEE back into demand — automation/EV-skilled engineers command a clear premium.' },
    ],
    workSetting: 45,
    workSettingNote: 'A real mix — desk design, lab testing, and plant/site work depending on the role.',
    social: 50,
    socialNote: 'You’ll coordinate with technicians, vendors, and cross-teams — not a silent solo desk job.',
    excelQualities: ['Solid grasp of both power and electronics', 'Practical hands-on problem solving', 'Adaptability across roles', 'Safety-first discipline'],
    subjects: ['Electrical Machines', 'Power Systems', 'Power Electronics', 'Control Systems', 'Analog & Digital Electronics', 'Microprocessors'],
    indianRecruiters: ['NTPC', 'BHEL', 'Power Grid (PGCIL)', 'Tata Power', 'L&T', 'Siemens India', 'ABB India', 'Schneider Electric India'],
    globalRecruiters: ['GE', 'Schneider Electric', 'ABB', 'Siemens', 'Hitachi Energy'],
    salaryReality:
      'Core freshers usually ₹3.5–6 LPA; GATE-route PSUs (NTPC, PGCIL) and MNCs (Siemens, ABB) pay well above that with strong security. Automation/EV skills add 30–50%. (Directional.)',
    higherStudies:
      'Optional — GATE for PSUs is the big lever; an M.Tech helps for power-electronics or control specialization.',
    fitFor: 'You want a stable, broadly-useful, future-relevant degree and don’t mind mixing desk and field work.',
    notFor: 'You’re chasing the highest possible package fast or want a pure-coding software life.',
  },
  'ee': {
    hook: 'The backbone of the entire country — grids, EVs, renewables — and the safest PSU ticket in engineering. The trade-off: core pay starts modest and a lot of the work is unglamorous infrastructure.',
    dayInLife:
      'Field and substation roles mean site visits, inspections, and supervising transmission or generation equipment; office roles run load-flow and protection studies on simulation software. PSU life is structured and secure, but slower-moving than private tech.',
    myths: [
      { myth: 'Power engineering is a dead-end old-economy field.', reality: 'India’s renewable and grid build-out (NTPC Green targeting 60 GW, massive transmission expansion) is creating a fresh wave of demand.' },
      { myth: 'PSUs like NTPC and Power Grid pay poorly.', reality: 'Starting CTC is moderate but total comp with allowances, job security, and growth is strong — and entry is purely GATE-merit, no interview politics.' },
    ],
    workSetting: 65,
    workSettingNote: 'Substations, plants, and transmission sites feature heavily; some office-based system-study roles.',
    social: 50,
    socialNote: 'You coordinate large teams, contractors, and safety crews — field power work is collaborative.',
    excelQualities: ['Strong safety and reliability mindset', 'Comfort with field and site postings', 'Patience for structured PSU processes', 'Solid power-systems fundamentals'],
    subjects: ['Power Systems Analysis', 'Electrical Machines', 'Power Electronics', 'Switchgear & Protection', 'High Voltage Engineering', 'Renewable Energy Systems'],
    indianRecruiters: ['NTPC', 'Power Grid (PGCIL)', 'BHEL', 'Adani Power / Adani Green', 'Tata Power', 'NHPC / SJVN', 'GAIL', 'Siemens Energy India'],
    globalRecruiters: ['Hitachi Energy', 'GE Vernova', 'Schneider Electric', 'ABB'],
    salaryReality:
      'GATE-route PSU trainees commonly start around ₹10–12 LPA CTC with strong security; private/core power freshers often ₹3.5–6 LPA. Renewables roles rising. (Directional.)',
    higherStudies:
      'GATE is essential for the best PSU seats; an M.Tech helps for power-systems or renewable-energy specialization.',
    fitFor: 'You value job security, a national-infrastructure mission, and are okay with site postings and a steady PSU pace.',
    notFor: 'You want a metro startup vibe, fast pay jumps, or a desk-only city job — power work means plants and substations.',
  },
  'instrumentation': {
    hook: 'The nervous system of every factory and plant — sensors, control loops, automation. Niche and underrated, with a clear edge in the Industry 4.0 / IoT wave, but core seats are limited and many grads drift into IT.',
    dayInLife:
      'You calibrate sensors, configure PLCs and DCS systems, and troubleshoot control loops — partly at a desk, partly on a noisy plant floor. In oil, gas, and process industries you’re often the person making sure the whole plant reads and reacts correctly.',
    myths: [
      { myth: 'Instrumentation has tiny scope and no future.', reality: 'Automation, IoT, and smart factories are exactly its turf — Industry 4.0 is pulling control engineers back into demand.' },
      { myth: 'You’ll easily get a high-paying core job.', reality: 'Core PSU roles (IOCL, GAIL, BPCL) pay very well but are few and fiercely GATE-competitive; many grads take automation, EPC, or IT roles instead.' },
    ],
    workSetting: 55,
    workSettingNote: 'Split between control-room/desk configuration and hands-on plant-floor calibration and troubleshooting.',
    social: 50,
    socialNote: 'You work closely with plant operators, maintenance, and process teams — collaborative, not solitary.',
    excelQualities: ['Precision and methodical troubleshooting', 'Cross-domain comfort (electronics + process)', 'Calm under plant-floor pressure', 'Hands-on practical mindset'],
    subjects: ['Process Control & Instrumentation', 'Sensors & Transducers', 'Control Systems', 'Industrial Automation (PLC/DCS/SCADA)', 'Analog & Digital Electronics', 'Signal Conditioning'],
    indianRecruiters: ['Honeywell Automation India', 'ABB India', 'Reliance Industries', 'Yokogawa India', 'Rockwell Automation', 'Siemens India', 'IOCL / BPCL / GAIL', 'L&T'],
    globalRecruiters: ['Emerson', 'Schneider Electric', 'Honeywell', 'Yokogawa', 'Shell'],
    salaryReality:
      'Private/core freshers typically ₹3–5 LPA; GATE-route process PSUs (IOCL, GAIL, BPCL) can reach ₹16–20 LPA but are highly competitive. Automation skills lift pay. (Directional.)',
    higherStudies:
      'GATE unlocks high-paying process PSUs; an M.Tech or automation/PLC certification strengthens core entry.',
    fitFor: 'You like precise, hands-on systems work and want a niche with real Industry 4.0 and automation upside.',
    notFor: 'You want abundant core openings, a pure-desk city job, or the highest packages without GATE-level effort.',
  },
  'robotics': {
    hook: 'You’ll build the machines that build everything else — but most Indian ’robotics’ jobs today are really industrial automation on a factory floor, not humanoids in a lab.',
    dayInLife:
      'A controls engineer wires up PLCs and tunes robotic arms on a production line; a perception/software engineer is at a desk writing code for sensors, vision and motion planning. Early years mean a lot of debugging hardware that won’t behave and integrating other people’s machines, not designing your own from scratch.',
    myths: [
      { myth: 'Robotics means building humanoid robots and AI brains.', reality: 'In India, most roles are factory automation, robotic-arm integration and machine vision for manufacturing lines — pure research robotics is rare and concentrated in a few startups and IITs.' },
      { myth: 'It’s the hottest field, so the money must be huge.', reality: 'Fresher core pay is decent (commonly ~₹6–10 LPA), but the big packages go to the software/AI side from top institutes, not to plant-floor automation roles.' },
    ],
    workSetting: 60,
    workSettingNote: 'Mix of desk (coding, simulation) and shop floor / integration site where the robots actually run.',
    social: 50,
    socialNote: 'Integration and commissioning need coordination with plant and client teams; pure software roles are quieter.',
    excelQualities: ['Comfort blending hardware and software', 'Patience for long debugging', 'Hands-on tinkering instinct', 'Math/control-systems intuition'],
    subjects: ['Control Systems', 'Embedded Systems & Microcontrollers', 'Kinematics & Dynamics', 'Sensors & Actuators', 'Computer Vision / ML', 'Mechatronics System Design'],
    indianRecruiters: ['DiFacto Robotics', 'Addverb Technologies', 'GreyOrange', 'Siemens India', 'Bosch', 'Tata Elxsi', 'L&T', 'Ola / Ather (automation)'],
    globalRecruiters: ['ABB', 'FANUC', 'KUKA', 'Boston Dynamics', 'Universal Robots'],
    salaryReality:
      'Solid demand and rising — automation roles commonly start around ₹6–10 LPA, with the top end going to AI/software-heavy robotics from elite institutes; plant-side controls roles pay more modestly. (Directional.)',
    higherStudies:
      'Often worth it — an M.Tech/MS in robotics, control or ML deepens the research and software roles that pay best.',
    fitFor: 'You love both code and physical machines and don’t mind years of patient hardware debugging.',
    notFor: 'You want a pure metro desk job, hate touching hardware, or expect to build sci-fi humanoids on day one.',
  },
  'automobile': {
    hook: 'The EV shift is the most exciting thing in Indian manufacturing right now — but the dirty secret is that the highest-value work is becoming software and electronics, not pistons.',
    dayInLife:
      'A vehicle/powertrain engineer splits time between CAD/simulation at a desk and validation in a test lab or on a track; a battery or power-electronics engineer is deep in cell testing, BMS tuning and thermal data. Service and manufacturing roles put you on the plant floor or at dealerships solving real-world failures.',
    myths: [
      { myth: 'Automobile engineering is all about designing engines and supercars.', reality: 'The industry is pivoting hard to EVs — batteries, motors, power electronics and embedded software now drive hiring; classic IC-engine expertise is shrinking.' },
      { myth: 'EV startups all pay fat packages.', reality: 'Some offer high CTC on paper, but a chunk is ESOPs with uncertain value, and OEM core roles still start modest — the headline ’up to 22 LPA’ numbers are for niche battery/software talent, not the median fresher.' },
    ],
    workSetting: 60,
    workSettingNote: 'Spans design desk, test labs and plant floor — most roles are a real mix, not a pure office.',
    social: 50,
    socialNote: 'Cross-functional coordination with manufacturing, suppliers and software teams; some quiet deep-work design roles.',
    excelQualities: ['Systems thinking across mechanical-electrical-software', 'Hands-on testing mindset', 'Comfort with rapid industry change', 'Data-driven problem solving'],
    subjects: ['Automotive Powertrain & IC Engines', 'Vehicle Dynamics', 'Battery Technology & BMS', 'Power Electronics & Electric Drives', 'Embedded Systems', 'Thermodynamics & Heat Transfer'],
    indianRecruiters: ['Tata Motors', 'Mahindra', 'Maruti Suzuki', 'Ola Electric', 'Ather Energy', 'Bajaj / Hero / TVS', 'Mercedes-Benz R&D India', 'Bosch'],
    globalRecruiters: ['Tesla', 'BYD', 'Bosch', 'Continental', 'ZF', 'Schaeffler'],
    salaryReality:
      'Core OEM entry pay is modest and rises slowly; battery, power-electronics and vehicle-software specialists command the higher EV-era packages, and startup offers often mix cash with uncertain ESOPs. (Directional.)',
    higherStudies:
      'Increasingly valuable — an M.Tech/MS in EV, power electronics or embedded systems future-proofs you against the IC-engine decline.',
    fitFor: 'You’re genuinely excited by cars and the EV transition and willing to keep learning electronics and software.',
    notFor: 'You only love classic engines, want a pure software salary, or dislike plant floors and test labs.',
  },
  'aerospace': {
    hook: 'One of the most prestige-heavy branches — but it’s a narrow, safety-obsessed field where most Indian seats are at a handful of government bodies and a young pack of space startups.',
    dayInLife:
      'Days are heavy on analysis, simulation and painstaking documentation — aerodynamics, structures or propulsion modelling at a desk, punctuated by test campaigns and reviews where nothing ships until it’s proven safe. Pace is deliberate; a single component can take months of validation.',
    myths: [
      { myth: 'Aerospace means you’ll be launching rockets and flying jets.', reality: 'Most of the job is rigorous analysis, testing and paperwork on one small subsystem — the field is safety-critical, slow-moving and intensely detail-driven.' },
      { myth: 'There are tons of aerospace jobs in India.', reality: 'It’s a niche branch — core openings cluster at ISRO, HAL, DRDO and a small (if growing) set of space startups, so competition for the good seats is fierce.' },
    ],
    workSetting: 45,
    workSettingNote: 'Mostly desk-based design, simulation and analysis, with periodic lab and test-facility work.',
    social: 35,
    socialNote: 'Deep individual technical work inside review-driven teams; less client-facing than most branches.',
    excelQualities: ['Extreme attention to detail', 'Patience with slow, rigorous validation', 'Strong physics and math foundation', 'Discipline with documentation and standards'],
    subjects: ['Aerodynamics', 'Flight Mechanics', 'Aerospace Structures', 'Propulsion', 'Control Systems', 'Avionics'],
    indianRecruiters: ['ISRO', 'HAL', 'DRDO', 'Skyroot Aerospace', 'Agnikul Cosmos', 'Pixxel', 'Bellatrix Aerospace', 'Tata Advanced Systems'],
    globalRecruiters: ['Boeing', 'Airbus', 'SpaceX', 'Lockheed Martin', 'Collins Aerospace'],
    salaryReality:
      'Government roles (ISRO/HAL/DRDO) start moderate but stable, commonly ~₹6–10 LPA; private space startups can offer more plus equity but carry startup risk — the field is prestige-rich, not cash-rich early on. (Directional.)',
    higherStudies:
      'Strongly recommended — an M.Tech/MS (often abroad) is close to a default for serious R&D and design roles in this niche.',
    fitFor: 'You’re obsessed with flight and space and happy doing patient, exacting work where safety beats speed.',
    notFor: 'You want lots of job options, fast money, or quick ship-it cycles — this field is narrow and deliberate.',
  },
  'production': {
    hook: 'The branch that quietly runs every factory and warehouse — less glamorous than design, but it’s where ’engineer’ meets ’business’ and pivots into operations, supply chain and management.',
    dayInLife:
      'A production engineer is on the shop floor improving throughput, cutting waste and firefighting bottlenecks; a supply-chain or operations analyst lives in data — demand planning, logistics and dashboards. Expect targets, shift realities and a lot of coordinating people and processes rather than designing parts.',
    myths: [
      { myth: 'Production engineering is just a weaker version of mechanical.', reality: 'It’s its own discipline — optimisation, quality, lean manufacturing and supply chain — and it’s the natural launchpad into operations and management roles that mechanical grads also chase.' },
      { myth: 'It’s all factory floor with no future.', reality: 'The field is going data-driven — supply-chain analytics, automation and operations roles at e-commerce and consulting firms pay well and are hiring hard.' },
    ],
    workSetting: 55,
    workSettingNote: 'Plant floor and warehouses for production/ops; analyst and planning roles are desk-and-data heavy.',
    social: 65,
    socialNote: 'Heavy on coordinating teams, suppliers and shifts — people skills matter as much as technical ones.',
    excelQualities: ['Process and optimisation mindset', 'Comfort coordinating people', 'Data and analytics fluency', 'Calm under production pressure'],
    subjects: ['Operations Research', 'Production Planning & Control', 'Quality Engineering / Six Sigma', 'Supply Chain Management', 'Manufacturing Processes', 'Industrial Automation'],
    indianRecruiters: ['Flipkart', 'Amazon India', 'Tata Motors', 'Maruti Suzuki', 'Reliance', 'Hindustan Unilever', 'TCS / Accenture (ops consulting)', 'Delhivery'],
    globalRecruiters: ['Amazon', 'Walmart', 'Unilever', 'Bosch', 'Procter & Gamble'],
    salaryReality:
      'Core industrial-engineer entry pay is modest (often ~₹4–6 LPA), but supply-chain, operations and analytics roles at e-commerce and consulting firms pay noticeably more and scale faster with experience. (Directional.)',
    higherStudies:
      'An MBA (operations/supply chain) is the classic high-leverage move; analytics/IE master’s also widens the data-side roles.',
    fitFor: 'You like making systems run better, enjoy data plus people, and are open to operations and management paths.',
    notFor: 'You want to design glamorous products, avoid factory floors, or dislike targets and coordination work.',
  },
  'eng-design': {
    hook: 'You’ll shape how products look and feel — but the comfortable ’make it pretty’ phase is exactly what AI is eating, so the future is in research, strategy and systems, not pushing pixels.',
    dayInLife:
      'A UX/product designer runs user research, sketches flows, builds wireframes and prototypes, then argues for them in reviews with PMs and engineers; an industrial designer moves between sketches, CAD/3D models and physical mockups. A lot of the day is justifying decisions and iterating on feedback, not just drawing.',
    myths: [
      { myth: 'Design is about being artistic and making things look good.', reality: 'Good design is research, logic and trade-offs — understanding users and business goals matters far more than drawing skill, and visual polish alone is increasingly automated.' },
      { myth: 'AI will replace designers.', reality: 'AI is commoditising basic UI/visual production, but it’s raising the value of strategy, research and systems thinking — the designers who only push pixels are most at risk; those who frame problems are safer.' },
    ],
    workSetting: 25,
    workSettingNote: 'Mostly desk and collaborative studio work; industrial design adds some workshop and prototyping time.',
    social: 65,
    socialNote: 'Constant collaboration — user interviews, stakeholder reviews and defending decisions to PMs and engineers.',
    excelQualities: ['Empathy and user curiosity', 'Clear visual and verbal communication', 'Comfort defending decisions with reasoning', 'Systems and strategic thinking'],
    subjects: ['Design Thinking & UX Research', 'Interaction & UI Design', 'Human Factors / Ergonomics', 'Prototyping & CAD', 'Visual Communication', 'Product Strategy'],
    indianRecruiters: ['Flipkart', 'Tata (Tata Elxsi / Titan)', 'Myntra', 'Zoho / Freshworks', 'Swiggy / Zomato', 'Razorpay', 'Godrej', 'Infosys / TCS (design studios)'],
    globalRecruiters: ['Adobe', 'Google', 'Microsoft', 'Amazon', 'Samsung R&D'],
    salaryReality:
      'UX/product design pays among the best for design grads — strong portfolios from top campuses can start around ₹8–14 LPA at tech firms, though tier-2 and pure-visual roles pay well below that, and AI pressure is squeezing the low-skill end. (Directional.)',
    higherStudies:
      'A focused design master’s (NID/IDC/abroad) sharpens portfolio and research depth and lifts entry into top product teams.',
    fitFor: 'You love understanding people, enjoy collaboration, and want to solve problems rather than just decorate screens.',
    notFor: 'You want a purely technical/solo engineering job, dislike critique and stakeholder debate, or only want to make things look pretty.',
  },
  'chemical': {
    hook: 'One of the most versatile core branches — you can land in pharma, refineries, FMCG or fertilizers. But ’chemical engineer’ rarely means a lab; it mostly means running a process plant in an industrial town, often on rotating shifts.',
    dayInLife:
      'Plant engineers spend the day on the shop floor monitoring reactors, distillation columns and process parameters, troubleshooting when output drifts, and enforcing safety. Design, R&D and process-modelling roles are desk-based on simulation software like Aspen.',
    myths: [
      { myth: 'Chemical engineers do chemistry experiments in a lab all day.', reality: 'It’s process engineering, not chemistry. Most jobs are about running big plants safely and efficiently — shifts, alarms, and uptime, not test tubes.' },
      { myth: 'It’s a dying core branch with no scope.', reality: 'It’s actually one of the most resilient — pharma, specialty chemicals, refining, FMCG process and energy all need it. The catch is the plants are in industrial belts, not metros.' },
    ],
    workSetting: 60,
    workSettingNote: 'Plant/shift-heavy in early years; R&D, design and process-modelling roles are office-based.',
    social: 45,
    socialNote: 'Plant teams need coordination with operators and safety staff, but it’s more systems-focused than people-facing.',
    excelQualities: ['Systems and process thinking', 'Calm under pressure / safety mindset', 'Comfort with shift work and plant sites', 'Strong grip on thermodynamics and math'],
    subjects: ['Chemical Reaction Engineering', 'Heat & Mass Transfer', 'Thermodynamics', 'Process Control & Instrumentation', 'Fluid Mechanics', 'Plant Design'],
    indianRecruiters: ['Reliance Industries', 'IOCL / BPCL / HPCL', 'Tata Chemicals', 'Pidilite', 'Cipla / Sun Pharma', 'HUL / ITC (FMCG process)', 'GAIL', 'Asian Paints'],
    globalRecruiters: ['BASF', 'Dow', 'Shell', 'Unilever', 'P&G', 'ExxonMobil'],
    salaryReality:
      'Decent and stable core starting pay, with strong upside in oil & gas, PSUs (via GATE) and specialty chemicals; FMCG and consulting roles pay more but are fewer. Ceiling is below software unless you move to management or abroad. (Directional.)',
    higherStudies:
      'An M.Tech (process / specialty) or a GATE-PSU route helps; an MBA opens FMCG management and consulting, which is where the bigger money is.',
    fitFor: 'You like systems thinking, are okay living in an industrial town, and want a versatile core branch that touches many industries.',
    notFor: 'You want a metro desk job, software-level pay from day one, or to avoid plant sites and shift work.',
  },
  'metallurgy': {
    hook: 'You’ll work with metals, alloys and now battery materials — the backbone of steel, defence and EVs. But most jobs are in steel-town plants, and the starting pay is on the lower side of the core branches.',
    dayInLife:
      'Plant metallurgists spend the day at the furnace, rolling mill or foundry checking material quality, failure analysis and process control. The exciting future — materials informatics, battery and EV materials — is mostly R&D and desk-based, but those roles are still few and often need a master’s.',
    myths: [
      { myth: 'Metallurgy is a dead, old-economy branch.', reality: 'Steel still hires steadily, and battery/EV materials and critical minerals are a real new frontier. But the cutting-edge roles need a master’s; the mass-hiring jobs are still in steel plants.' },
      { myth: 'It pays like the other top core branches.', reality: 'Entry pay at steel companies is modest. The big upside comes from PSUs (via GATE), abroad roles, or pivoting into materials/battery R&D.' },
    ],
    workSetting: 65,
    workSettingNote: 'Plant- and furnace-heavy in steel/foundry roles; materials R&D and informatics roles are lab/desk-based.',
    social: 40,
    socialNote: 'More technical and analysis-driven than people-facing, though plant roles need coordination with operators.',
    excelQualities: ['Attention to detail / quality focus', 'Materials and chemistry intuition', 'Patience for failure analysis', 'Openness to data / materials informatics'],
    subjects: ['Physical Metallurgy', 'Extractive Metallurgy', 'Mechanical Behaviour of Materials', 'Phase Transformations', 'Materials Characterization', 'Thermodynamics of Materials'],
    indianRecruiters: ['Tata Steel', 'JSW Steel', 'SAIL', 'Vedanta / Hindalco', 'NMDC', 'HAL / DRDO labs', 'Jindal Steel & Power', 'Mahindra / Tata Motors (materials)'],
    globalRecruiters: ['ArcelorMittal', 'Rio Tinto', 'POSCO', 'Tesla / battery-materials firms'],
    salaryReality:
      'Entry pay at private steel is modest; PSUs (SAIL, NMDC, HAL via GATE) pay better with security. Battery/materials R&D and abroad roles lift the ceiling, but those need a master’s. (Directional.)',
    higherStudies:
      'Strongly recommended — an M.Tech / MS in materials, battery tech or materials informatics is the difference between a furnace-floor job and a high-value R&D role.',
    fitFor: 'You like materials science, are okay starting in a steel town, and want to aim at the battery/EV-materials wave with a master’s.',
    notFor: 'You want high starting pay, a metro tech job, or to stay out of plants without committing to higher studies.',
  },
  'mining': {
    hook: 'PSU jobs here are among the best-paid government entries in any branch — Coal India pays well. But the employer base is narrow, the work is at remote mines, and coal’s long-term future is uncertain.',
    dayInLife:
      'Mining engineers work at the mine — planning extraction, supervising blasting and machinery, and obsessing over safety underground or in open-cast pits. It’s remote-posting, field-heavy work; desk roles in mine planning and software exist but are fewer.',
    myths: [
      { myth: 'Mining engineering has no scope because of climate change.', reality: 'Coal is still huge and hires steadily, and critical minerals (lithium, cobalt, rare earths) via the National Critical Mineral Mission are a genuine new bright spot. But the employer base stays narrow.' },
      { myth: 'It’s a low-paying, neglected branch.', reality: 'PSU pay is actually strong — Coal India management trainees get a high total CTC. The real cost is location (remote mines) and a small set of employers, not the money.' },
    ],
    workSetting: 85,
    workSettingNote: 'Mine-site and field-heavy with remote postings; some mine-planning and software roles are office-based.',
    social: 45,
    socialNote: 'You lead mine crews and enforce safety on the ground — coordination matters, but it’s not a client-facing role.',
    excelQualities: ['Comfort with remote postings', 'Strong safety discipline', 'Physical resilience', 'On-ground leadership of crews'],
    subjects: ['Mine Planning & Development', 'Rock Mechanics', 'Mining Machinery', 'Mine Ventilation & Safety', 'Surface & Underground Mining', 'Mineral Processing'],
    indianRecruiters: ['Coal India (CIL) & subsidiaries', 'NMDC', 'Vedanta', 'Hindustan Zinc', 'Tata Steel (raw materials)', 'Hindalco', 'Singareni Collieries (SCCL)', 'NLC India'],
    globalRecruiters: ['Rio Tinto', 'BHP', 'Glencore', 'Anglo American'],
    salaryReality:
      'PSU entry (Coal India via GATE) offers a strong total CTC, among the best government starts; private mining and Gulf/Australia roles pay well too. But the employer base is narrow and tied to commodity cycles. (Directional.)',
    higherStudies:
      'Often not required for PSU entry (GATE score is enough); an M.Tech or a pivot toward critical-minerals/mineral-processing future-proofs you as coal plateaus.',
    fitFor: 'You’re okay living at remote mine sites, want a strong-paying PSU career, and don’t need a metro lifestyle.',
    notFor: 'You want city life, a wide choice of employers, or a clearly future-proof field beyond commodity cycles.',
  },
  'environmental': {
    hook: 'This is the rare core branch riding a real boom — clean energy, water, pollution control and ESG are all hiring. The catch: a lot of the money sits in corporate ESG and consulting desks, not the field engineering you might picture.',
    dayInLife:
      'Roles split widely — site engineers handle water/wastewater treatment plants and pollution-control systems in the field, while ESG and sustainability analysts sit in corporate offices building reports, audits and compliance dashboards. India’s clean-energy and water missions are pulling demand up across both.',
    myths: [
      { myth: 'Environmental engineering is just an NGO/activism kind of field with no real jobs.', reality: 'It’s now one of the fastest-growing areas — ESG, water, renewables and EHS roles are multiplying because of India’s Net-Zero-2070, Jal Jeevan and 500 GW clean-energy targets.' },
      { myth: 'It’s all outdoor fieldwork at treatment plants.', reality: 'Much of the new growth and higher pay is in office-based ESG, sustainability consulting and carbon-management roles, especially in big firms and banks.' },
    ],
    workSetting: 50,
    workSettingNote: 'Mixed — water/EHS site roles are field-based; ESG, sustainability and consulting roles are office-based.',
    social: 55,
    socialNote: 'Compliance, audits and consulting mean lots of stakeholder coordination; pure site roles are more solo.',
    excelQualities: ['Genuine interest in sustainability', 'Comfort with regulations and data', 'Communication for audits/reports', 'Cross-disciplinary thinking'],
    subjects: ['Water & Wastewater Treatment', 'Air Pollution Control', 'Environmental Impact Assessment', 'Solid & Hazardous Waste Management', 'Climate & Sustainability Systems', 'Environmental Chemistry'],
    indianRecruiters: ['NTPC / NHPC / Adani Green (clean energy)', 'Central & State Pollution Control Boards', 'L&T / Tata Projects (water infra)', 'EY / Deloitte / KPMG (ESG consulting)', 'ReNew / Tata Power Renewables', 'ONGC / GAIL (EHS)', 'VA Tech Wabag', 'Thermax'],
    globalRecruiters: ['AECOM', 'Jacobs', 'Ramboll', 'Veolia', 'Suez'],
    salaryReality:
      'Field/EHS and PSU entry pay is moderate, but ESG and sustainability-consulting roles pay noticeably more and are growing fast; senior ESG/climate roles in big firms reach high figures. (Directional.)',
    higherStudies:
      'An M.Tech (environmental) deepens technical roles; an MS or certifications in ESG, climate finance or sustainability open the higher-paying corporate track.',
    fitFor: 'You care about climate and sustainability and want a genuinely growing field with both field and corporate paths.',
    notFor: 'You want a traditional high-pay core engineering job, or you dislike regulations, reporting and compliance work.',
  },
  'agri-food': {
    hook: 'You’ll work on what the whole country eats — food processing, quality, packaging and agri-supply chains. It’s recession-proof demand, but the starting pay is on the lower side and a lot of jobs are at factories in smaller towns.',
    dayInLife:
      'Food technologists work in processing plants on production, quality assurance, R&D of new products, and FSSAI/food-safety compliance. Agri-engineering and agri-business roles mean procurement, supply chain and field coordination with farmers and mandis, often away from metros.',
    myths: [
      { myth: 'Food technology means you’ll become a chef or work in a restaurant.', reality: 'It’s industrial food science — production, preservation, quality control and R&D in FMCG and processing plants, governed by FSSAI standards. Nothing to do with cooking.' },
      { myth: 'Agri/food is a low-scope branch with no future.', reality: 'Food security, packaged-food growth and agri-tech keep demand steady and recession-resistant. The honest catch is modest starting pay and factory/field postings, not a lack of jobs.' },
    ],
    workSetting: 60,
    workSettingNote: 'Plant- and field-heavy (processing lines, farms, procurement); R&D and quality-management roles are more lab/office-based.',
    social: 55,
    socialNote: 'Procurement and supply-chain roles need constant coordination with farmers, vendors and plant teams; QA/R&D is more focused.',
    excelQualities: ['Quality and hygiene discipline', 'Practical, hands-on mindset', 'Comfort with plants and field postings', 'Interest in food science / nutrition'],
    subjects: ['Food Processing & Preservation', 'Food Microbiology', 'Food Chemistry & Nutrition', 'Food Quality & Safety (FSSAI standards)', 'Post-Harvest Technology', 'Food Packaging Technology'],
    indianRecruiters: ['Amul (GCMMF)', 'ITC Foods', 'Nestlé India', 'Britannia', 'HUL / Marico', 'FSSAI / FCI / ICAR (govt)', 'Mother Dairy', 'Parle / Haldiram’s'],
    globalRecruiters: ['Cargill', 'PepsiCo', 'Mondelez', 'Danone', 'Kellanova'],
    salaryReality:
      'Entry pay (production/QA officer) is modest; FMCG management-trainee and R&D roles pay better, and procurement/supply-chain careers climb well with experience. Ceiling rises sharply with an MBA into FMCG management. (Directional.)',
    higherStudies:
      'An M.Tech (food tech) helps for R&D; an MBA (agri-business / supply chain) is the big lever into higher-paying FMCG management and procurement-leadership roles.',
    fitFor: 'You like food science and practical plant work, and want recession-resistant demand in FMCG and agri.',
    notFor: 'You want high starting pay, a metro-only desk job, or to avoid factory floors and field/procurement postings.',
  },
  'biotech': {
    hook: 'The science is genuinely exciting — but pure bench biotech in India pays badly, and the real money goes to those who add computation or a master’s/PhD.',
    dayInLife:
      'As a student: wet labs, cell cultures, genetics, biochemistry and a lot of careful protocol work. As a career: most freshers land in QC/QA, production, clinical research or sales at a pharma/vaccine company — bench R&D and the high-paying roles usually need an MSc/PhD or a coding pivot.',
    myths: [
      { myth: 'Biotech is the next big boom, so jobs and pay will be great.', reality: 'The sector is growing, but Indian bench salaries lag hard — a plain B.Tech often starts at ₹3.5–5.5 LPA, far below CS/core branches.' },
      { myth: 'A biotech degree alone makes you a research scientist.', reality: 'Real R&D and scientist roles need a master’s or PhD; the bachelor’s usually opens QC, production or sales doors first.' },
    ],
    workSetting: 30,
    workSettingNote: 'Mostly labs and production floors; QC/clinical-research roles add some site and hospital coordination.',
    social: 40,
    socialNote: 'Lab work is quiet and team-based; clinical-research and sales roles are far more people-facing.',
    excelQualities: ['Patience for slow, precise lab work', 'Genuine curiosity about living systems', 'Willingness to add coding or a higher degree', 'Comfort with long career timelines'],
    subjects: ['Genetic Engineering & Molecular Biology', 'Biochemistry', 'Microbiology', 'Bioprocess Engineering', 'Immunology', 'Cell Biology'],
    indianRecruiters: ['Biocon / Syngene', 'Serum Institute of India', 'Bharat Biotech', 'Dr. Reddy’s & Cipla', 'Reliance Life Sciences', 'Indian Immunologicals', 'Panacea Biotec'],
    globalRecruiters: ['Thermo Fisher Scientific', 'Novartis / Pfizer', 'Novo Nordisk', 'Universities abroad (MS / PhD)'],
    salaryReality:
      'Low for a bench-only B.Tech (often ₹3.5–5.5 LPA to start) and slow to climb; it jumps to ₹12–25 LPA only with an MSc/PhD, a bioinformatics/data pivot, or a move into regulatory/clinical leadership. Plan for higher studies. (Directional.)',
    higherStudies:
      'Effectively required to earn well — an MSc/PhD or a computational add-on (bioinformatics, data) is how this field pays off.',
    fitFor: 'You love biology at the molecular level, enjoy lab work, and are ready to study further or learn to code.',
    notFor: 'You want a high salary straight after graduation, or you dislike slow, repetitive bench work.',
  },
  'bioinformatics': {
    hook: 'Biology plus coding — the part of life science that actually pays, because data skills are rare among biologists.',
    dayInLife:
      'As a student: genomics, statistics, Python/R and a lot of biology read through a computer rather than a microscope. As a career: you analyse DNA/protein data, build pipelines, and support drug discovery or clinical diagnostics — mostly at a desk with code, not at a lab bench.',
    myths: [
      { myth: 'It’s just biology, so it must pay like biology.', reality: 'It pays more — because the coding and data skills are scarce, freshers often start ₹4–7 LPA and climb faster than pure-bench biotech.' },
      { myth: 'You need to be a hardcore programmer.', reality: 'You need solid Python/R, Linux and statistics — applied, not elite CS. The edge is combining that with real biology.' },
    ],
    workSetting: 28,
    workSettingNote: 'Almost entirely desk/computer work — pipelines, data and analysis, not field or wet-lab.',
    social: 35,
    socialNote: 'Quiet, focused, project-based work; suits independent thinkers who collaborate with biologists and clinicians.',
    excelQualities: ['Comfort with both code and biology', 'Strong statistics and logic', 'Patience with messy, large datasets', 'Self-driven learning of new tools'],
    subjects: ['Genomics & NGS Data Analysis', 'Programming (Python / R)', 'Biostatistics', 'Algorithms & Databases', 'Molecular Biology', 'Machine Learning for Biology'],
    indianRecruiters: ['MedGenome', 'Strand Life Sciences', 'Mapmygenome', 'Aganitha AI', 'Syngene / Biocon', 'Cellworks Research India', 'Thermo Fisher (India R&D)', 'TCS / Persistent (life-sciences units)'],
    globalRecruiters: ['Illumina', 'Roche / Genentech', 'Novartis', 'Universities & genomics labs abroad (MS / PhD)'],
    salaryReality:
      'Better than pure biotech — entry roughly ₹4–7 LPA, rising to ₹12–25+ LPA for those strong in NGS, ML or drug-discovery data. A master’s lifts the ceiling sharply. (Directional.)',
    higherStudies:
      'Strongly recommended — an M.Sc/M.Tech in bioinformatics or a data/ML specialisation unlocks the higher-paying genomics and drug-discovery roles.',
    fitFor: 'You like biology but want to work through code and data, and you enjoy solving puzzles at a computer.',
    notFor: 'You want hands-on lab or field work, or you dislike programming and statistics.',
  },
  'eng-physics': {
    hook: 'An elite launchpad, not a job title — it opens quantum, semiconductors and photonics, but only if you commit to one specialisation.',
    dayInLife:
      'As a student: heavy physics, advanced maths, electronics and labs spanning lasers, devices and computation. As a career: there’s no single ’engineering physics’ job — you become a semiconductor/VLSI engineer, a photonics or quantum researcher, a data scientist or quant, usually after picking a lane and often a higher degree.',
    myths: [
      { myth: 'Engineering Physics is a clear branch with its own job market.', reality: 'It isn’t — it’s a broad, elite base. Recruiters hire you as a chip designer, researcher, coder or analyst, so you must choose a direction.' },
      { myth: 'The versatility means easy placements everywhere.', reality: 'Versatile only helps if you go deep in one area; spread too thin and you compete poorly against specialised branches.' },
    ],
    workSetting: 32,
    workSettingNote: 'Labs, cleanrooms and computers — research, device design or analysis, rarely field/site work.',
    social: 35,
    socialNote: 'Suits independent, analytical minds; research and design teams collaborate but the work is quiet.',
    excelQualities: ['Strong physics and mathematical intuition', 'Willingness to specialise deeply', 'Comfort across hardware and code', 'Patience for research-style problem-solving'],
    subjects: ['Quantum Mechanics', 'Solid State / Semiconductor Physics', 'Electronics & VLSI', 'Photonics & Optics', 'Computational Physics', 'Mathematical Methods'],
    indianRecruiters: ['IISc / IITs & research labs', 'ISRO / DRDO / BARC', 'Intel / AMD / Texas Instruments (India)', 'Applied Materials / Lam Research', 'Tata Electronics / semiconductor fabs', 'Indian quant & data firms', 'QNu Labs / QpiAI'],
    globalRecruiters: ['TSMC / Intel / Samsung', 'ASML', 'IBM Research', 'Universities abroad (MS / PhD)'],
    salaryReality:
      'Wide range — core semiconductor and quant/data pivots can pay very well (₹12–30+ LPA from top IITs), while research paths pay modestly until a master’s/PhD. Outcome depends entirely on the lane you pick. (Directional.)',
    higherStudies:
      'Usually needed for the research/quantum/photonics lanes; a focused MS/PhD or a strong industry specialisation is how this base converts into a career.',
    fitFor: 'You love deep physics and maths, want frontier fields like quantum or semiconductors, and will commit to mastering one.',
    notFor: 'You want a ready-made job title and clear placement path, or you dislike open-ended, self-directed careers.',
  },
  'quantum': {
    hook: 'A real frontier with government money behind it — but a tiny, credential-heavy field where the payoff is slow and a master’s/PhD is almost mandatory.',
    dayInLife:
      'As a student: deep quantum mechanics, linear algebra, programming (Qiskit) and physics of devices like superconducting qubits or trapped ions. As a career: you research quantum hardware, build quantum algorithms or work on quantum-safe security — mostly in labs and on computers at a handful of firms and institutes.',
    myths: [
      { myth: 'Quantum is booming, so there are lots of jobs right now.', reality: 'The hiring pool is still small (hundreds, not thousands) and heavily PhD/M.Tech-gated. The boom is real but long-horizon — payoff comes over years.' },
      { myth: 'A bachelor’s in quantum gets you straight into quantum computing.', reality: 'Most serious roles want an M.Tech/PhD from an IIT/IISc; without it you’ll likely start in adjacent software or research-support work.' },
    ],
    workSetting: 30,
    workSettingNote: 'Labs and computers — hardware experiments or algorithm work, never field/site work.',
    social: 30,
    socialNote: 'Deeply technical and quiet; small specialist teams, suited to patient independent researchers.',
    excelQualities: ['Exceptional maths and physics ability', 'Patience for a long, uncertain payoff', 'Strong programming (Python / Qiskit)', 'Comfort at the edge of the unknown'],
    subjects: ['Quantum Mechanics', 'Quantum Computing & Algorithms', 'Linear Algebra', 'Quantum Information & Cryptography', 'Condensed Matter / Device Physics', 'Programming (Qiskit / Python)'],
    indianRecruiters: ['IISc / IITs & RRI (National Quantum Mission labs)', 'TCS (Quantum CoE)', 'QNu Labs', 'QpiAI', 'Infosys / Wipro quantum teams', 'ISRO / DRDO', 'BosonQ Psi'],
    globalRecruiters: ['IBM Quantum', 'Google Quantum AI', 'IQM', 'Universities abroad (MS / PhD)'],
    salaryReality:
      'Decent for the few who qualify — entry roughly ₹8–14 LPA at Indian quantum startups, ₹25–45 LPA at MNCs like IBM/Intel — but the pool is small and almost always needs a master’s/PhD. Treat it as a long-term bet. (Directional.)',
    higherStudies:
      'Effectively required — an M.Tech/PhD in quantum physics or information is the standard entry ticket to real quantum roles.',
    fitFor: 'You’re top-tier at physics and maths, love frontier research, and can be patient for a payoff that builds over a decade.',
    notFor: 'You want quick job security and high pay early, or you’d rather not commit to a master’s/PhD.',
  },
  'bsc-chemistry': {
    hook: 'Pharma and materials keep chemistry employable — but a bare B.Sc lands you in a low-paid QC lab. The real money needs an M.Sc/PhD or a computational (cheminformatics) pivot, because routine wet-lab analysis is being automated.',
    dayInLife:
      'As a student: lab work, reactions, titrations, plus a heavy dose of physical-chemistry maths. As a career: usually quality control or R&D-assistant work in a pharma or materials lab — or, after a higher degree, you’ve moved into drug discovery, computational chemistry or cheminformatics on a computer.',
    myths: [
      { myth: 'A B.Sc Chemistry easily gets you a good pharma R&D job.', reality: 'Fresh B.Sc grads mostly get QC-analyst or lab-technician roles at modest pay; real R&D needs an M.Sc/PhD.' },
      { myth: 'Lab skills alone will keep you safe.', reality: 'Routine wet-lab testing is being automated; the durable roles add coding, cheminformatics or formulation expertise.' },
      { myth: 'Chemistry has no future with AI.', reality: 'AI-driven drug discovery and materials informatics are growing — but they reward chemists who can also program.' },
    ],
    workSetting: 28,
    workSettingNote: 'Wet labs early on, shifting to computers if you go computational; rarely field work.',
    social: 35,
    socialNote: 'Quiet, methodical lab work; suits introverts, though pharma teams are collaborative.',
    excelQualities: ['Patience and precision', 'Comfort with both lab work and maths', 'Willingness to add coding / data skills'],
    subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Spectroscopy & Instrumentation', 'Computational / Cheminformatics'],
    indianRecruiters: ['Pharma (Dr. Reddy’s, Cipla, Sun Pharma, Biocon)', 'QC / analytical labs (CROs like Syngene)', 'FMCG (HUL, P&G, ITC)', 'Aganitha AI / cheminformatics firms', 'CSIR labs (NCL, IICT) & IISc / IITs', 'Specialty chemicals & paints'],
    globalRecruiters: ['Universities abroad (MS / PhD)', 'Schrödinger / ChemAxon (computational)', 'Global pharma (Pfizer, Novartis, Amgen)', 'BASF / Dow / Unilever R&D'],
    salaryReality:
      'Low for a standalone B.Sc — QC and lab roles often start around ₹3–5.5 LPA. It climbs meaningfully with an M.Sc/PhD or a pivot to computational chemistry / cheminformatics / formulation. Plan for higher studies. (Directional.)',
    higherStudies:
      'Effectively required — an M.Sc/PhD (or a computational/cheminformatics add-on) is how chemistry pays off.',
    fitFor: 'You enjoy lab work AND maths, like understanding how matter behaves, and will study further or pick up coding.',
    notFor: 'You want a high salary straight after graduation, or dislike spending years in a lab before the payoff.',
  },
  'bsc-math': {
    hook: 'The highest-leverage pure science in India right now. Maths and stats are the direct feedstock for AI, data science and quant — but the money comes from the data/quant pivot, not a teaching B.Sc.',
    dayInLife:
      'As a student: proofs, abstract structures, probability and a lot of careful reasoning, increasingly paired with coding. As a career: data analyst, data scientist, quant, actuary or ML engineer — or research/teaching if you go the M.Sc/PhD academic route.',
    myths: [
      { myth: 'B.Sc Maths only leads to teaching or banking clerical jobs.', reality: 'With Python/SQL and stats, maths grads feed straight into the booming data-science, quant and actuarial pipelines.' },
      { myth: 'You must do engineering to get into tech / AI.', reality: 'Strong maths-stats is often valued MORE than a generic CS degree for data-science and quant roles.' },
      { myth: 'AI will replace the maths people.', reality: 'AI is built ON maths and statistics — the people who understand the models are the ones AI makes more valuable.' },
    ],
    workSetting: 30,
    workSettingNote: 'Almost entirely computers — analysis, modelling and coding; no field or site work.',
    social: 35,
    socialNote: 'Independent, focused work; suits introverts, though analytics and quant teams collaborate closely.',
    excelQualities: ['Abstract & logical reasoning', 'Strong with probability and patterns', 'Willingness to learn coding (Python / R / SQL)', 'Comfort with ambiguity and long problems'],
    subjects: ['Real & Complex Analysis', 'Linear Algebra', 'Probability & Statistics', 'Differential Equations', 'Numerical Methods', 'Optimization / Operations Research'],
    indianRecruiters: ['Data / analytics teams (Mu Sigma, Fractal, Tiger Analytics)', 'Quant & trading firms (WorldQuant, Tower, Graviton, AlphaGrep)', 'Banks & risk (Goldman, JPMorgan, ICICI, HDFC)', 'Actuarial (LIC, ICICI Pru, Swiss Re, WTW)', 'Big tech & product firms (data-science roles)', 'IISc / ISI / IITs (research & teaching)'],
    globalRecruiters: ['Global quant & hedge funds (Citadel, Jane Street, D.E. Shaw)', 'Universities abroad (MS / PhD)', 'Big tech (Google, Microsoft, Amazon)', 'Global consulting & analytics (McKinsey QuantumBlack)'],
    salaryReality:
      'Best-paying of the pure sciences once you pivot. Data/analyst roles often start around ₹4–8 LPA; data-science and quant can reach ₹10–30 LPA+ (top quant desks higher) with skills and experience. A bare teaching-track B.Sc pays much less. (Directional.)',
    higherStudies:
      'Helpful but not always required — coding + stats skills can get you into data roles after the B.Sc; an M.Sc/PhD opens quant research and academia.',
    fitFor: 'You love logic and patterns, are happy in front of a computer, and want pure science that still pays well.',
    notFor: 'You dislike abstraction or coding, or want hands-on, people-facing or field work.',
  },
  'bsc-biology': {
    hook: 'Genomics and precision medicine are booming — but ONLY if you add data skills. Pure descriptive biology with a bare B.Sc is one of the weakest-paying science paths in India.',
    dayInLife:
      'As a student: cells, genetics, physiology, plenty of memorising plus lab work. As a career: usually a lab or research associate role early on — or, if you add bioinformatics/data, you’re analysing genomic data at a sequencing or diagnostics company on a computer.',
    myths: [
      { myth: 'A biology degree makes you a scientist or gets you into research easily.', reality: 'Research careers need an M.Sc/PhD; the bare B.Sc lands low-paid lab-assistant or associate roles.' },
      { myth: 'Biotech is a guaranteed high-paying field.', reality: 'Pure wet-lab biotech pays modestly in India; the well-paid roles are in genomics + data (bioinformatics), needing coding.' },
      { myth: 'You don’t need maths or coding for biology.', reality: 'The growth areas — genomics, bioinformatics, computational biology — are basically biology plus statistics and programming.' },
    ],
    workSetting: 30,
    workSettingNote: 'Wet labs early on; shifts to computers if you go bioinformatics / computational biology. Some field ecology work.',
    social: 35,
    socialNote: 'Mostly quiet lab or analysis work; suits introverts, though research is collaborative.',
    excelQualities: ['Patience and careful observation', 'Strong memory for systems and detail', 'Willingness to add data / coding skills', 'Comfort with long research timelines'],
    subjects: ['Cell & Molecular Biology', 'Genetics', 'Biochemistry', 'Microbiology', 'Physiology', 'Bioinformatics / Biostatistics'],
    indianRecruiters: ['Genomics & diagnostics (MedGenome, Strand, Mapmygenome)', 'Biotech & CROs (Biocon, Syngene, Genotypic)', 'Pharma R&D & clinical research', 'CSIR / DBT labs, NCBS, inStem, NIMHANS', 'Bioinformatics teams (Aganitha, Premas)', 'IISc / IISERs / universities (research & teaching)'],
    globalRecruiters: ['Universities abroad (MS / PhD)', 'Thermo Fisher / Illumina', 'Global pharma & biotech (Novartis, Amgen, Roche)', 'Genomics & health-data firms abroad'],
    salaryReality:
      'Low for a standalone B.Sc — lab-associate roles often start around ₹2–4 LPA. It improves with an M.Sc/PhD, and meaningfully if you pivot to bioinformatics / genomics data (roughly ₹4–9 LPA early, rising with experience). Plan for higher studies. (Directional.)',
    higherStudies:
      'Effectively required — an M.Sc/PhD or a bioinformatics / data add-on is how this field pays off.',
    fitFor: 'You’re fascinated by living systems, are patient, and will either go for a PhD or add data/coding skills.',
    notFor: 'You want to earn well right after graduation, or dislike memorisation, long timelines and lab work.',
  },
};
