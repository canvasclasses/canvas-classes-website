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
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}
