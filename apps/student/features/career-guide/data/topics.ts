/*
 * /career-guide/topics/[slug] — programmatic SEO landing pages.
 *
 * Each topic is a curated entry point keyed to a head search query. The page
 * renders ~600 words of original framing + cards for 5-7 featured career
 * specs (read live from MongoDB by slug) + honest "what to think about"
 * framings. JSON-LD: Article + BreadcrumbList.
 *
 * Adding a new topic = drop a new entry here. The dynamic route picks it up,
 * generates a page, and the sitemap emits the URL on next 24h revalidate.
 *
 * Featured slugs must exist in the `career_specs` MongoDB collection. The
 * detail-page route will 404 individual cards whose slug no longer publishes,
 * but the topic page itself stays renderable.
 */

export interface Topic {
  slug: string;
  title: string;            // <title> + h1
  metaDescription: string;  // <meta name="description">
  intro: {
    eyebrow: string;        // small uppercase chip ("AI careers · India 2026")
    headline: string;       // h1 — short, declarative
    lead: string[];         // 2-3 paragraphs of framing copy
  };
  featuredSlugs: string[];  // 5-7 career-guide slugs, in display order
  framings: Array<{         // 2-3 "what to think about" callouts
    title: string;
    body: string;
  }>;
  faq?: Array<{ q: string; a: string }>;  // optional small FAQ — boosts depth

  /**
   * When present, the page renders as a RANKED listicle (a quotable one-paragraph
   * "answer", a comparison table, and a numbered ordered list) instead of the
   * curated grid. This is the shape AI engines (ChatGPT / Gemini / Perplexity)
   * and Google's "top / best / highest-paying … 2026" results lift and cite.
   *
   * `items` order IS the rank (item 1 = #1). Keep `items` and `featuredSlugs`
   * in the SAME order with the SAME slugs — `featuredSlugs` drives the Mongo
   * fetch, `items` supplies the per-rank reason. All numbers shown on the page
   * (pay, AI risk) are read live from each career's brief, never hardcoded here.
   */
  ranked?: {
    asOf: string;            // recency marker shown on the page, e.g. '2026'
    criterion: string;       // one-line ranking basis (chip under the answer)
    answerSummary: string;   // the quotable, enumerated direct answer (GEO gold)
    methodology: string[];   // 1-2 paragraphs: exactly how we ranked this
    items: Array<{
      slug: string;          // must match a featuredSlug
      reason: string;        // 2-3 sentences: why it ranks where it does
      suitsYouIf?: string;   // one line: "pick this if…"
    }>;
  };
}

export const TOPICS: Topic[] = [
  // ──────────────────────────────────────────────────────────────────────
  // 1. Best careers after JEE Main 2026
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'best-after-jee-main',
    title: 'Best careers after JEE Main 2026 — Canvas Classes',
    metaDescription:
      'Five engineering careers worth pursuing after JEE Main 2026. Income distributions, AI exposure, the path in, and the cons nobody else lists. Editorial — refreshed quarterly.',
    intro: {
      eyebrow: 'After JEE Main · 2026',
      headline: 'The best careers after JEE Main are not the ones you were sold in class 11.',
      lead: [
        "JEE Main opens about 50,000 engineering seats across the NITs, IIITs, GFTIs, and a long tail of private colleges. The cutoffs you'll see in counselling are real — what they implicitly tell you about careers, less so. \"Computer Science at an NIT\" is a college decision; the career it leads to depends on a dozen choices you make after that, most of which you haven't made yet.",
        "We've picked five careers that a JEE Main student can credibly chase in 2026, judged on three things: the income distribution at year five (not the press-release packages), the work itself (do you actually want to do it?), and AI exposure over the next decade. Two are conventional, three aren't.",
        "Read these alongside the College Predictor. The predictor tells you which colleges your rank can reach; the briefs tell you whether the careers downstream of those colleges are worth reaching for.",
      ],
    },
    featuredSlugs: [
      'software-engineer-product',
      'ml-engineer',
      'semiconductor-engineer',
      'energy-materials-engineer',
      'robotics-engineer',
      'data-engineer',
      'quant-developer',
    ],
    framings: [
      {
        title: 'Branch matters more than tier for some of these.',
        body: "Semiconductor and energy-materials careers are branch-locked — electronics, materials, or chemical engineering. If your rank gets you an NIT but in a branch you can't pivot from, the prestige doesn't help. Software and ML are largely branch-agnostic; you can come from any engineering branch and reach the same roles by year three.",
      },
      {
        title: 'AI exposure is uneven across these five.',
        body: "Software-engineering work is being amplified by AI, not erased — but only for engineers who adopt the tools. Semiconductor design, energy-materials R&D, and robotics sit on the resistant end because the work is physical, regulated, or both. Quant and data engineering are bifurcating: the routine work is automating, the systems-design work is paying more.",
      },
      {
        title: 'The first-job premium is real but bounded.',
        body: "Top-tier college networks matter at year one and year two. By year five, your portfolio and the specific projects you've shipped weigh more than the institute name. If you're choosing between a great branch at a mid-tier college and a forgettable branch at a top-tier one, the great branch usually wins on a five-year horizon.",
      },
    ],
    faq: [
      {
        q: 'Is computer science still the best branch after JEE Main 2026?',
        a: 'It is the safest. CS opens the broadest portfolio of careers and is largely college-agnostic past the first job. But "safest" is not "best" for everyone — if you have strong inclinations toward semiconductors, materials, or robotics, picking CS to be safe and then trying to pivot back is harder than starting in the right branch.',
      },
      {
        q: 'Is JEE Main worth taking if I am only aiming for private colleges?',
        a: 'Yes. Many private colleges accept JEE Main scores for admission and scholarships. The same rank that gets you a mid-tier NIT can unlock significant scholarships at a private institution.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Career options after NEET that aren't MBBS
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'neet-non-mbbs-paths',
    title: 'Career options after NEET that are not MBBS — Canvas Classes',
    metaDescription:
      'Five careers a NEET aspirant can pursue without an MBBS seat. Biotech, healthcare AI, clinical research, life-sciences engineering. Honest income data, AI exposure, and the path in.',
    intro: {
      eyebrow: 'After NEET · Non-MBBS paths',
      headline: 'Most NEET aspirants assume the only honest career is MBBS. That assumption is costing you options.',
      lead: [
        "About 24 lakh students sat NEET-UG 2024 for roughly 1.1 lakh MBBS seats. The arithmetic guarantees that most aspirants — including most who clear the qualifying cutoff — will not enter MBBS. The standard fallback is BDS, BAMS, or BHMS. There are better options if your interest in biology is real and your interest in clinical medicine is more conventional than examined.",
        "The five careers below are real entry points for a NEET-track student who scored well enough to clear NEET but not well enough for a government MBBS seat. Some are emerging (healthcare AI, biotech research). One is conventional but evolving (clinical medicine, via slightly different routes). All of them keep your biology training relevant.",
        "If you're choosing this path because MBBS is out of reach, be honest with yourself about why MBBS appealed in the first place. If it was the work — patient contact, diagnosis, clinical reasoning — then clinical-doctor-via-AIIMS-route or even an MD after an unconventional UG might be right. If it was the social status, the alternatives below pay better and grant more autonomy. Pick on the work.",
      ],
    },
    featuredSlugs: [
      'clinical-doctor',
      'biotech-research',
      'healthcare-ai',
      'ai-evaluations-engineer',
      'product-designer',
    ],
    framings: [
      {
        title: "Biology training is portable. Treat it that way.",
        body: "A NEET-level grasp of biology and chemistry is more rigorous than what most non-medical undergraduates carry. It transfers cleanly into biotech, life-sciences engineering, clinical research, and the biology side of healthcare AI. The branch you pick for your UG matters; the field you came from matters less than you think.",
      },
      {
        title: 'The AI question is different for medicine.',
        body: "Clinical medicine has low AI exposure for the next decade because the work is regulated, physical, and trust-laden — patients, hospitals, and licensing bodies don't replace doctors with software. The non-clinical careers (research, healthcare AI, biotech R&D) sit in a different regime where AI is a tool that amplifies senior workers and quietly displaces juniors. Read the AI-exposure section in each brief carefully — the horizons are not the same.",
      },
      {
        title: "Don't fall for 'next year I'll crack it'.",
        body: "Drop years are common in NEET. Some pay off; most don't. Before you commit to another year, work backwards: which of the careers below would you actually be happy doing, and does another year of NEET get you to one of them faster than starting a UG now would? If the honest answer is no, the year is a sunk cost.",
      },
    ],
    faq: [
      {
        q: 'Can I do AIIMS or PG-MD without an MBBS from a top college?',
        a: 'For AIIMS you need an MBBS first — that exam is for postgraduate medical entrance after MBBS. The path is: get any government MBBS seat, then sit NEET-PG. The college tier matters far less for PG admissions than your NEET-PG rank.',
      },
      {
        q: 'Is biotech a real career or just a fallback?',
        a: 'Real career, with bifurcated outcomes. Bench-scientist roles at academic labs pay poorly. Industrial roles at pharma, agritech, and contract-research organisations pay well and are growing. Read the full biotech-research brief for the income distribution and the realistic path in.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. AI careers in India 2026
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-careers-india',
    title: 'AI careers in India 2026 — Canvas Classes',
    metaDescription:
      'Six AI-adjacent careers a JEE / NEET student can credibly enter in India in 2026. Honest income data, what the work actually is, and the careers AI hype is misleading you about.',
    intro: {
      eyebrow: 'AI careers · India · 2026',
      headline: 'There are about four real AI careers. The rest is recruitment-firm noise.',
      lead: [
        "\"AI career\" is currently the most-searched career term among Indian students. Most of the search results are written by recruitment firms, edtech marketers, or LinkedIn influencers, and most of them collapse genuinely different jobs — research, engineering, product, evaluations — into one indistinguishable bucket. They aren't the same job, they don't pay the same, and they don't take the same person.",
        "The six careers below are the ones we can defend as real entry points for an Indian student today. We've named the work, the actual income distributions at year five, the AI exposure of the AI careers themselves (because the field is eating its juniors — pay attention to that), and the cons.",
        "If you're between two of these, read both briefs in full before you pick. The day-to-day work in healthcare AI looks nothing like the day-to-day work in ML engineering, even though both pay roughly similar at year five.",
      ],
    },
    featuredSlugs: [
      'ml-engineer',
      'ai-evaluations-engineer',
      'healthcare-ai',
      'data-engineer',
      'software-engineer-product',
      'quant-developer',
    ],
    framings: [
      {
        title: 'The hype is real. The job pyramid is uneven.',
        body: "Senior AI engineers are paid extraordinarily well. Junior AI engineers — defined as anyone in their first three years who can't yet ship production systems independently — are increasingly the bottleneck AI itself is solving. The pyramid has narrowed at the bottom. If you're entering, expect a steeper apprenticeship phase than a 2020 SWE entrant faced.",
      },
      {
        title: 'AI evaluations is the most underrated branch.',
        body: "Every serious AI lab now employs people whose job is to test whether the model does what it claims — across capabilities, safety, and edge cases. The work is half engineering, half empirical science, and it scales with how much trust labs need to ship. Most students have never heard of it. Read the brief.",
      },
      {
        title: 'Healthcare AI is not the same as ML engineering.',
        body: "Healthcare AI is regulated, slower, more biology-adjacent, and significantly more meaningful in the day-to-day. Compensation can be lower than pure ML at the top of the curve, but the work has a different shape — clinical partners, real patients, real regulators. Pick on what you want your weeks to look like.",
      },
    ],
    faq: [
      {
        q: 'Do I need a CS degree to work in AI?',
        a: "Not at the senior level — most of the best AI engineers in India came from electronics, math, or physics. At entry level a CS degree helps because the work is currently bottlenecked on engineering chops. If you're entering from a non-CS branch, expect to spend a year building a public portfolio (papers, open-source contributions, ML system designs) before recruiters take you seriously.",
      },
      {
        q: 'Is AI a bubble?',
        a: "The valuations might be. The careers aren't, because the work — building, deploying, evaluating, and integrating large models into real products — is real engineering work with real customers. Even if a third of today's AI startups fail, the underlying skill will compound for the next decade.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Highest-paying careers in India 2026
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'highest-paying-india-2026',
    title: 'Highest-paying careers in India 2026 — Canvas Classes',
    metaDescription:
      'Six of the highest-paying careers in India in 2026 for JEE / NEET aspirants. Income distributions at year five, not headline-package fiction. AI exposure, path in, and the cons.',
    intro: {
      eyebrow: 'Income · India · 2026',
      headline: 'The "highest-paying jobs in India" lists are wrong because they quote outliers.',
      lead: [
        "Every January, a new round of \"highest-paying jobs in India\" posts circulate, all citing the same six-figure-dollar packages that 0.1% of new graduates at a single elite tier of companies see. Those numbers are real. They are also a marketing artefact. A more useful question — and the one the briefs answer — is what the median engineer earns at year five in each of these careers, and how wide the distribution is.",
        "The six careers below have the highest realistic income ceilings for someone entering from JEE or NEET in 2026, judged on year-five median compensation in the brief. We've kept careers off this list that pay well only at one or two firms, because optionality matters: a career where you can earn ₹40-60 LPA at dozens of companies is more durable than one where you can earn ₹1 cr at three.",
        "Read these as ceiling estimates, not floor estimates. The distribution at the bottom of each career is significantly less generous, and most graduates land closer to the bottom than the top.",
      ],
    },
    featuredSlugs: [
      'quant-developer',
      'ml-engineer',
      'software-engineer-product',
      'semiconductor-engineer',
      'ai-evaluations-engineer',
      'clinical-doctor',
    ],
    framings: [
      {
        title: "Income compounds. Don't optimise the first job.",
        body: "A ₹30 LPA first job that opens into a ₹90 LPA mid-career is better than a ₹50 LPA first job that caps at ₹60 LPA. Most students choose the higher first-job number and regret it at year seven. The career briefs include year-1, year-5, and year-10 income markers exactly so you can see the slope, not just the intercept.",
      },
      {
        title: "Quant and senior software roles are the only true outliers.",
        body: "Top-decile quant developer roles in India and Singapore now pay more than any other career on this list. They are also the most concentrated — three or four firms hire the bulk of them, the interviews are brutal, and the work is narrower than the salary suggests. Read the cons section in the brief before you decide this is what you want.",
      },
      {
        title: "Clinical medicine is on this list for a different reason.",
        body: "MBBS does not pay the highest at year five. It pays well steadily, for a long time, with low downside risk and the highest survivability across economic cycles. If \"highest-paying\" includes \"least likely to lose your career to AI or a market crash\", clinical medicine deserves to be on this list. Don't read it as the same shape of career as quant or software.",
      },
    ],
    faq: [
      {
        q: 'Are quant developer salaries really that high in India?',
        a: 'At the top firms, yes. At the broader market of \"quant\" roles, the headline numbers are inflated. Read the quant-developer brief for the realistic distribution and which firms anchor the top of it.',
      },
      {
        q: 'Should I optimise my career for money?',
        a: "Money is a real thing to optimise for, especially early. But income compounds over a career, and careers compound over a life. The honest move is to pick the highest-paying career where the day-to-day work doesn't make you miserable. Three of the careers above have very different daily textures even though their incomes overlap.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. Best engineering careers in India 2026 — RANKED
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'top-engineering-careers-2026',
    title: 'The best engineering careers in India for 2026 (ranked) — Canvas Classes',
    metaDescription:
      'The engineering careers worth aiming for in 2026, ranked on year-five pay, durable demand and AI-resistance — with the real income distribution and the honest downside of each. Editorial, refreshed quarterly.',
    intro: {
      eyebrow: 'Engineering careers · Ranked · 2026',
      headline: 'The best engineering careers in India for 2026, ranked on what actually matters.',
      lead: [
        "Search \"best engineering careers\" and you get the same alphabetised list of branches every year, with no numbers and no opinion. This page is the opposite: a ranked list of the engineering and engineering-adjacent careers an Indian student can credibly enter in 2026, ordered by the salary an engineer actually reaches by year five — not the press-release packages — with how well each one resists automation as the tiebreaker.",
        "Every rank links to a full brief with the 25th-to-75th-percentile income range, a one/five/ten-year AI-exposure assessment, the path in, and the cons nobody else lists. The numbers on this page are read live from those briefs, so they stay in sync as we refresh them quarterly.",
        "Read it alongside the College Predictor: the predictor tells you which colleges your rank can reach; this list tells you which careers downstream of those colleges are worth reaching for.",
      ],
    },
    featuredSlugs: [
      'quant-developer',
      'ai-evaluations-engineer',
      'ml-engineer',
      'software-engineer-product',
      'data-engineer',
      'semiconductor-engineer',
      'robotics-engineer',
      'energy-materials-engineer',
    ],
    ranked: {
      asOf: '2026',
      criterion: 'Year-five median pay · AI-resistance as the tiebreaker',
      answerSummary:
        'As of 2026, the engineering and engineering-adjacent careers in India with the best mix of year-five pay, durable demand and AI-resistance are, in order: 1) quant developer (~₹110L median at year five), 2) AI evaluations / safety engineer (~₹80L), 3) ML / applied-AI engineer (~₹55L), 4) software engineer, product track (~₹38L), 5) data engineer (~₹35L), 6) semiconductor / chip-design engineer (~₹30L), 7) robotics & automation engineer (~₹28L), and 8) energy & materials engineer (~₹22L). The ranking uses the median salary an engineer actually reaches by year five — not outlier packages — with ties broken by how much of the work resists automation.',
      methodology: [
        "We rank on the median total compensation an engineer reaches about five years in — the 50th percentile, drawn from each career's cited income data and refreshed quarterly — because that is the number a typical entrant actually experiences, unlike the ₹50L–₹1cr 'packages' that describe the top 1% at a handful of firms. Where two careers are close on pay, the one whose core work resists automation ranks higher.",
        "We include engineering-adjacent roles — quant, AI evaluations, data engineering — that a JEE or engineering student routinely enters, because the category label matters less than where the work actually leads. Every figure links to the full brief, where the 25th–75th-percentile range, the AI-exposure call (with our confidence level), and the honest downsides are laid out with sources.",
      ],
      items: [
        {
          slug: 'quant-developer',
          reason:
            'The highest year-five median on this list — about ₹110 LPA — and the work resists automation because generating novel trading ideas and building microsecond-latency systems is judgment, not pattern-matching. The catch: three or four firms hire most of these roles, the interviews are brutal, and the work is narrower than the pay suggests.',
          suitsYouIf: 'you love maths under pressure and can stomach a brutal, narrow way in.',
        },
        {
          slug: 'ai-evaluations-engineer',
          reason:
            'Around ₹80 LPA at year five, and demand grows precisely as AI spreads — every serious lab now needs people who can prove a model actually works. The work is half engineering, half empirical science, and supply is tiny, which is part of why it pays.',
          suitsYouIf: "you like breaking things and proving what's true, not just building.",
        },
        {
          slug: 'ml-engineer',
          reason:
            'About ₹55 LPA at year five and central to almost every AI product being built. AI amplifies this work rather than erasing it — but only for engineers who understand why a model works, not just which API to call.',
          suitsYouIf: 'you want to be at the centre of the AI build-out and enjoy the maths.',
        },
        {
          slug: 'software-engineer-product',
          reason:
            'The broadest entry point in tech — roughly ₹38 LPA at year five, available at hundreds of companies, and largely branch-agnostic. AI is reshaping the day-to-day, so the durable edge is product judgment: deciding what to build, not just typing the code.',
          suitsYouIf: "you want the widest set of options and don't yet know your niche.",
        },
        {
          slug: 'data-engineer',
          reason:
            'About ₹35 LPA at year five and quietly indispensable — every dashboard, analytics stack and ML system runs on pipelines someone has to build. The routine layers are automating; schema design and debugging silent-failure pipelines are the parts that keep paying.',
          suitsYouIf: 'you like building invisible infrastructure that everything else depends on.',
        },
        {
          slug: 'semiconductor-engineer',
          reason:
            "Around ₹30 LPA at year five with a decade-long tailwind behind it — India's fab push and global chip demand. Branch-locked to electronics or materials, and the work resists AI because bringing up real silicon is intuition plus measurement, not code generation.",
          suitsYouIf: 'you want hardware, physics and a national-scale tailwind.',
        },
        {
          slug: 'robotics-engineer',
          reason:
            "About ₹28 LPA at year five and one of the most AI-resistant here in the near term — the work is physical, spanning mechanical, electronics and control. The catch is that India's robotics market is thinner than software, so location and employer choice matter more.",
          suitsYouIf: 'you want to build physical things and stay out of a pure desk job.',
        },
        {
          slug: 'energy-materials-engineer',
          reason:
            'The lowest year-five pay here at roughly ₹22 LPA, but riding the energy-transition tailwind and very AI-resistant — physical, regulated R&D work. Choose this for the decade-long structural demand, not the starting salary.',
          suitsYouIf: 'you care about the energy transition and play the long game.',
        },
      ],
    },
    framings: [
      {
        title: 'Pay is the headline, not the whole story.',
        body: "We rank on year-five median pay because it's the most honest single number — but a career two ranks lower with work you'd actually enjoy beats a higher-paid one you'd quit at year three. Open each brief and read the day-in-the-life and cons before you let the ranking decide for you.",
      },
      {
        title: 'Branch-locked vs branch-agnostic matters.',
        body: 'Semiconductor, robotics, and energy-materials careers are tied to specific branches — if your rank gets you a college but not that branch, the prestige does not help. Software, ML, data, and quant are largely branch-agnostic; you can reach them from most engineering branches by year three.',
      },
      {
        title: 'AI is the tiebreaker for a reason.',
        body: "Two careers can pay the same at year five and diverge sharply over a decade depending on how much of the work AI absorbs. That's why a slightly lower-paid but AI-resistant role can be the smarter pick — and why every brief carries a dated, confidence-rated AI-exposure assessment.",
      },
    ],
    faq: [
      {
        q: 'What is the best engineering career in India in 2026?',
        a: 'On year-five median pay combined with AI-resistance, quant developer ranks first (around ₹110 LPA median by year five), followed by AI evaluations engineer and ML / applied-AI engineer. But "best" depends on the work you want to do and the branch you can reach — the highest-paid career is not the best one if you would be miserable doing it.',
      },
      {
        q: 'Which engineering branch leads to the highest-paying career?',
        a: 'Computer science opens the broadest set of high-paying paths (software, ML, data, and most quant roles), which is why it has the highest demand. But electronics and materials lead to semiconductor and energy careers with strong, less-crowded long-term demand. Pick the branch whose careers you actually want, not just the one with the highest average.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 6. Engineering careers of the next decade (2026–2036) — RANKED
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'engineering-careers-next-decade',
    title: 'Engineering careers of the next decade (2026–2036), ranked — Canvas Classes',
    metaDescription:
      'The engineering careers most likely to still be paying well in 2036, ranked on ten-year demand and how much of the work resists AI — not just today’s salary. Honest data and the catch for each.',
    intro: {
      eyebrow: 'Future-proof · 2026–2036',
      headline: 'The engineering careers most likely to still matter in 2036.',
      lead: [
        "A career choice you make in 2026 plays out over the 2030s. So the right question is not \"what pays most today\" but \"what will still have demand, and still resist automation, ten years from now\". This list ranks engineering careers on exactly that — the ten-year outlook, weighted above the starting salary.",
        "That reweighting changes the order: physical, regulated and research-heavy careers climb above some better-paid but more automatable ones, because the work ages well against AI and rides structural tailwinds — India's semiconductor mission, the energy transition, and the AI build-out itself.",
        "No ten-year forecast is certain. Each linked brief states our confidence level on the AI-exposure call and shows year-one, year-five and year-ten income, so you can judge the slope for yourself rather than trust a single number.",
      ],
    },
    featuredSlugs: [
      'quant-developer',
      'ai-evaluations-engineer',
      'semiconductor-engineer',
      'ml-engineer',
      'robotics-engineer',
      'energy-materials-engineer',
      'software-engineer-product',
      'data-engineer',
    ],
    ranked: {
      asOf: '2026–2036',
      criterion: 'Ten-year demand and AI-resistance, weighted above starting pay',
      answerSummary:
        'Looking out to 2036, the engineering careers in India most likely to still be paying well and resisting automation are, in order: 1) quant developer, 2) AI evaluations / safety engineer, 3) semiconductor / chip-design engineer, 4) ML / applied-AI engineer, 5) robotics & automation engineer, 6) energy & materials engineer, 7) software engineer (product track), and 8) data engineer. This list weights ten-year demand and the share of work that resists AI more heavily than today’s salary — so physical, regulated and research-heavy roles rank above some better-paid but more automatable ones.',
      methodology: [
        "This ranking deliberately under-weights today's salary and over-weights two things that decide a career's next decade: whether demand has a structural tailwind (India's semiconductor mission, the energy transition, the AI build-out) and how much of the day-to-day work resists automation. A career can pay less in 2026 and still rank higher here if its ten-year outlook is sturdier.",
        "Income figures are the year-ten median from each brief's cited data, refreshed quarterly, and we include engineering-adjacent roles a JEE student routinely enters. Because this is a forecast, every brief states our confidence level on its AI-exposure call — read it before betting a decade on any single line.",
      ],
      items: [
        {
          slug: 'quant-developer',
          reason:
            'Year-ten median near ₹200 LPA, and the work — novel research plus ultra-low-latency systems — is some of the hardest on this list to automate. Concentrated and brutal to enter, but durable once you are in.',
          suitsYouIf: 'you can clear an extreme bar and want the highest long-run ceiling.',
        },
        {
          slug: 'ai-evaluations-engineer',
          reason:
            'A career that grows precisely as AI proliferates: the more capable models become, the more the world needs people who can prove they are safe and working. A structural, decade-long tailwind with tiny current supply.',
          suitsYouIf: 'you want to ride the AI wave without your own work being the thing automated.',
        },
        {
          slug: 'semiconductor-engineer',
          reason:
            "India's fab investments and global chip demand make this a decade bet, not a 2026 bet. Bringing up real silicon resists automation, and the talent shortage is structural — pay should climb as the industry matures here.",
          suitsYouIf: 'you want hardware and a tailwind that lasts the whole decade.',
        },
        {
          slug: 'ml-engineer',
          reason:
            'ML stays central to the economy through the decade. The risk is commoditisation of routine model work, so the durable version of this career is systems design and evaluation, not glue code — the briefs show how to aim there.',
          suitsYouIf: 'you want to be central to the AI economy and will keep levelling up.',
        },
        {
          slug: 'robotics-engineer',
          reason:
            "Physical work ages well against AI, and automation and manufacturing demand compound over ten years. India's market is thin today but widening, so early movers with strong control/perception skills are well placed.",
          suitsYouIf: 'you want physical engineering with a long demand runway.',
        },
        {
          slug: 'energy-materials-engineer',
          reason:
            'The energy transition is a multi-decade structural shift, and this is among the most AI-resistant work here — regulated, physical R&D. The slowest to start on pay, among the longest to stay relevant.',
          suitsYouIf: 'you are patient and want work that matters for the next thirty years.',
        },
        {
          slug: 'software-engineer-product',
          reason:
            'Still a strong decade-long career, but the most exposed here to AI reshaping the day-to-day. It survives well if you move toward product judgment and systems design rather than routine coding.',
          suitsYouIf: 'you will lean into the parts of software AI cannot do alone.',
        },
        {
          slug: 'data-engineer',
          reason:
            'Durable demand — data infrastructure is not going away — but the routine pipeline layers are the most automatable part of this list. Move toward platform and architecture work to stay ahead of that curve.',
          suitsYouIf: 'you like infrastructure and will climb toward the architecture layer.',
        },
      ],
    },
    framings: [
      {
        title: 'Tailwinds beat starting salaries over ten years.',
        body: "A career riding a structural shift — chips, energy, AI safety — can start lower and out-earn a higher-paying job whose demand plateaus. That's why the order here looks different from the pure-pay ranking; we're optimising the slope, not the intercept.",
      },
      {
        title: 'AI-resistance is not the same as AI-irrelevance.',
        body: 'The careers that age best are not the ones AI ignores — they are the ones where AI is a tool that amplifies a skilled human (chip bring-up, robotics control, evaluations) rather than a replacement. Read each brief’s "what doesn’t compress" section.',
      },
    ],
    faq: [
      {
        q: 'Which engineering career is most future-proof in India?',
        a: 'On a ten-year view, quant developer, AI evaluations engineer, and semiconductor engineer rank highest, because each combines durable demand with work that resists automation. No career is fully "AI-proof" — the right framing is which careers AI amplifies rather than replaces, and those three are among the strongest.',
      },
      {
        q: 'Will AI replace software engineers by 2036?',
        a: 'It is reshaping the job, not deleting it. Routine coding is increasingly automated, but deciding what to build, designing systems, and shipping complex features end-to-end remain human work. Software still ranks as a strong decade-long career here — just lower than the most AI-resistant options.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 7. Highest-paying engineering careers in India 2026 — RANKED (pure pay)
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'highest-paying-engineering-careers-india-2026',
    title: 'Highest-paying engineering careers in India 2026 (ranked by real pay) — Canvas Classes',
    metaDescription:
      'Ranked purely by the median salary engineers actually reach by year five in 2026 — not outlier packages. The real income distribution (25th–75th percentile) for each, with sources.',
    intro: {
      eyebrow: 'Engineering pay · India · 2026',
      headline: 'The highest-paying engineering careers in India in 2026 — ranked on real median pay, not press-release packages.',
      lead: [
        "Most \"highest-paying engineering jobs\" lists quote the ₹1-crore packages that 0.1% of graduates at a single tier of firms see. Those numbers are real and almost useless for planning. This list ranks engineering and engineering-adjacent careers on the median pay an engineer actually reaches by year five — the number a typical entrant experiences.",
        "Each rank shows that year-five median and links to a brief with the full 25th-to-75th-percentile spread, the sources, and the path in. Read every figure as a ceiling-and-floor range, not a promise: most graduates land closer to the bottom of the range than the top in their early years.",
        "If you want the balanced \"best overall\" view rather than pure pay, see our ranked best-engineering-careers guide; for a future-weighted view, see the next-decade guide.",
      ],
    },
    featuredSlugs: [
      'quant-developer',
      'ai-evaluations-engineer',
      'ml-engineer',
      'software-engineer-product',
      'data-engineer',
      'semiconductor-engineer',
      'robotics-engineer',
      'energy-materials-engineer',
    ],
    ranked: {
      asOf: '2026',
      criterion: 'Year-five median total compensation, sourced',
      answerSummary:
        'Ranked purely by the median salary engineers actually reach by year five in 2026 — not headline packages — the highest-paying engineering and engineering-adjacent careers in India are: 1) quant developer (~₹110L), 2) AI evaluations / safety engineer (~₹80L), 3) ML / applied-AI engineer (~₹55L), 4) software engineer, product track (~₹38L), 5) data engineer (~₹35L), 6) semiconductor / chip-design engineer (~₹30L), 7) robotics & automation engineer (~₹28L), and 8) energy & materials engineer (~₹22L). Each figure is a 50th-percentile, sourced number; the 25th–75th-percentile range is in each brief.',
      methodology: [
        "Every figure here is a year-five median — the 50th percentile — from each career's cited income data, refreshed quarterly. We rank on the median, not the maximum, because the ₹1-crore numbers that fill most 'highest-paying' lists describe the top 1% at a handful of firms and tell you almost nothing about what you will earn.",
        "We include engineering-adjacent roles (quant, AI evaluations, data engineering) that engineering students routinely enter. Read each number as a ceiling-and-floor range, not a promise — most graduates land closer to the 25th percentile than the 75th in their first years, and the full spread is in every brief.",
      ],
      items: [
        {
          slug: 'quant-developer',
          reason:
            'Both the ceiling and the floor are the highest here — about ₹110L median at year five, and ₹220L at the 75th percentile. But the top numbers come from three or four firms; treat them as a ceiling, not an expectation.',
        },
        {
          slug: 'ai-evaluations-engineer',
          reason:
            'Around ₹80L median at year five and rising fast because supply is tiny. One of the few places a young engineer can reach senior-level pay quickly — if you can get in.',
        },
        {
          slug: 'ml-engineer',
          reason:
            'About ₹55L median at year five (₹30L–₹100L range). Broad demand keeps the floor higher than most careers, while senior roles push the ceiling well past ₹1cr over time.',
        },
        {
          slug: 'software-engineer-product',
          reason:
            'About ₹38L median at year five, but the widest distribution by employer count — you can hit good pay at hundreds of companies, not just a famous few. Optionality is the real prize here.',
        },
        {
          slug: 'data-engineer',
          reason:
            'About ₹35L median at year five. Less glamorous than the roles above it, but the pay is steady and available almost anywhere data exists — which is everywhere.',
        },
        {
          slug: 'semiconductor-engineer',
          reason:
            "About ₹30L median at year five, with a rising ceiling as India's chip industry matures. Pay is lower than software today, but the trajectory is steepening.",
        },
        {
          slug: 'robotics-engineer',
          reason:
            'About ₹28L median at year five. The pay is moderate and location-dependent, but specialised control and perception roles command a clear premium.',
        },
        {
          slug: 'energy-materials-engineer',
          reason:
            'About ₹22L median at year five — the lowest here. You choose this for the long-horizon structural demand, not the early paycheck.',
        },
      ],
    },
    framings: [
      {
        title: 'Median, not maximum.',
        body: "The ₹1-crore figures in most lists are 75th–99th-percentile outliers at a few firms. We rank on the median because it's the number you're most likely to actually live. Each brief shows the full 25th-to-75th spread so you can see both the floor and the ceiling.",
      },
      {
        title: 'Optionality is worth real money.',
        body: 'A career where you can earn ₹35–55 LPA at dozens of companies is more durable than one where you can earn ₹1cr at three. When two careers are close on pay, the one you can pursue at more employers is usually the safer bet.',
      },
    ],
    faq: [
      {
        q: 'What is the highest-paying engineering career in India in 2026?',
        a: 'By year-five median pay, quant developer is highest at roughly ₹110 LPA, followed by AI evaluations engineer (~₹80 LPA) and ML engineer (~₹55 LPA). These are medians, not the outlier ₹1-crore packages — the realistic 25th-to-75th-percentile range for each is in its full brief.',
      },
      {
        q: 'Do engineers in India really earn ₹1 crore?',
        a: 'A small fraction do — mostly senior quant developers and top-tier software/ML engineers, years into their careers, at a handful of firms. It is a 75th-to-99th-percentile outcome, not a year-five median. Plan around the median (₹30–110 LPA depending on the career) and treat the crore as upside, not expectation.',
      },
    ],
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}
