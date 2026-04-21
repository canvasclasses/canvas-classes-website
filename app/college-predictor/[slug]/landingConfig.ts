// ============================================
// Landing-page config for programmatic SEO under /college-predictor/[slug].
//
// Each entry becomes a statically-generated page (via generateStaticParams)
// with its own H1, meta title, meta description, and filter logic.
//
// Adding a new landing page = add an entry here. No route file changes needed.
// ============================================

import type { CollegeRegion, CollegeType } from '@/lib/models/College';

export interface LandingFilter {
  region?: CollegeRegion;
  type?: CollegeType;
}

export interface LandingConfig {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;           // short paragraph under the H1
  filter: LandingFilter;
  faqs: { q: string; a: string }[];
}

export const LANDING_CONFIGS: LandingConfig[] = [
  // ── Regional landing pages ────────────────────────────────────────────────
  {
    slug: 'north-india',
    h1: 'Best Engineering Colleges in North India (JEE Main)',
    metaTitle: 'Top NITs & IIITs in North India 2025 — JEE Main Cutoffs | Canvas Classes',
    metaDescription:
      'Complete list of top NITs, IIITs and GFTIs in North India that admit through JEE Main. Compare cutoffs, NIRF ranks, branches and locations across Delhi, UP, Punjab, Haryana, Rajasthan, HP, Uttarakhand and J&K.',
    intro:
      'North India hosts some of the country\'s oldest NITs and IIITs. The colleges below all admit through JoSAA counseling based on your JEE Main rank. Use the predictor to see which ones match your profile.',
    filter: { region: 'North' },
    faqs: [
      {
        q: 'Which is the best NIT in North India?',
        a: 'MNIT Jaipur, MNNIT Allahabad, and NIT Kurukshetra are consistently the highest-ranked NITs in North India on NIRF Engineering. All three admit through JoSAA via JEE Main.',
      },
      {
        q: 'Which IIITs are located in North India?',
        a: 'IIIT Allahabad is the flagship Institute of National Importance (INI) IIIT in North India. Several PPP-model IIITs operate across UP, Punjab, Haryana, and J&K.',
      },
      {
        q: 'What JEE Main rank do I need for an NIT in North India?',
        a: 'CSE branches at top North Indian NITs typically close around CRL 5,000–15,000 for OPEN category in the home-state quota, and CRL 2,000–8,000 in the other-state quota. Use the predictor for exact, year-specific projections.',
      },
    ],
  },
  {
    slug: 'south-india',
    h1: 'Best Engineering Colleges in South India (JEE Main)',
    metaTitle: 'Top NITs & IIITs in South India 2025 — JEE Main Cutoffs | Canvas Classes',
    metaDescription:
      'Top NITs, IIITs and GFTIs in South India via JEE Main. NIT Trichy, NIT Warangal, NIT Surathkal, NIT Calicut, IIITDM Kancheepuram and more — cutoffs, branches, and NIRF ranks.',
    intro:
      'South India has the most competitive NITs in the country — NIT Trichy, NIT Warangal, and NIT Surathkal regularly top the NIRF rankings. All admit through JoSAA based on your JEE Main rank.',
    filter: { region: 'South' },
    faqs: [
      {
        q: 'Which is the best NIT in South India?',
        a: 'NIT Trichy is typically ranked #1 among NITs on NIRF Engineering, followed by NIT Surathkal (Karnataka) and NIT Warangal (Telangana).',
      },
      {
        q: 'What JEE Main rank do I need for NIT Trichy CSE?',
        a: 'NIT Trichy CSE typically closes around CRL 1,000–1,500 for OPEN category Gender-Neutral seats (home-state quota) and CRL 300–800 in the other-state quota. Use the predictor for up-to-date projections.',
      },
      {
        q: 'Which South Indian IIITs admit through JEE Main?',
        a: 'IIITDM Kancheepuram (Chennai) and IIITDM Kurnool (AP) are INI IIITs in South India that admit through JoSAA counseling using JEE Main ranks.',
      },
    ],
  },
  {
    slug: 'east-india',
    h1: 'Best Engineering Colleges in East India (JEE Main)',
    metaTitle: 'Top NITs & IIITs in East India 2025 — JEE Main Cutoffs | Canvas Classes',
    metaDescription:
      'Top NITs and GFTIs in East India — NIT Rourkela, NIT Durgapur, NIT Jamshedpur, NIT Patna. Cutoffs, NIRF ranks, branches and locations across Odisha, West Bengal, Bihar and Jharkhand.',
    intro:
      'East India is home to NIT Rourkela — one of the country\'s highest-ranked NITs — alongside NIT Durgapur, NIT Jamshedpur and NIT Patna. All admit via JoSAA using JEE Main ranks.',
    filter: { region: 'East' },
    faqs: [
      {
        q: 'Which is the best NIT in East India?',
        a: 'NIT Rourkela is consistently the highest-ranked NIT in East India on NIRF Engineering, typically placing in the top 20.',
      },
      {
        q: 'Which engineering branches are strong at NIT Rourkela?',
        a: 'NIT Rourkela is known for its Metallurgy, Mining, Mechanical and Ceramics programs — these have historical strength and strong industry placement.',
      },
    ],
  },
  {
    slug: 'west-india',
    h1: 'Best Engineering Colleges in West India (JEE Main)',
    metaTitle: 'Top NITs & IIITs in West India 2025 — JEE Main Cutoffs | Canvas Classes',
    metaDescription:
      'Top NITs and GFTIs in West India — VNIT Nagpur, SVNIT Surat, NIT Goa. Compare JEE Main cutoffs, NIRF ranks, branches and campus locations across Maharashtra, Gujarat and Goa.',
    intro:
      'West India is home to VNIT Nagpur and SVNIT Surat — two of the country\'s oldest and most reputed NITs — plus NIT Goa. All admit through JoSAA.',
    filter: { region: 'West' },
    faqs: [
      {
        q: 'Which is the best NIT in West India?',
        a: 'VNIT Nagpur and SVNIT Surat are typically the highest-ranked NITs in West India on NIRF Engineering, both regularly placing in the top 50.',
      },
    ],
  },
  {
    slug: 'northeast-india',
    h1: 'Best Engineering Colleges in Northeast India (JEE Main)',
    metaTitle: 'Top NITs in Northeast India 2025 — JEE Main Cutoffs | Canvas Classes',
    metaDescription:
      'NITs across Northeast India — NIT Silchar, NIT Agartala, NIT Meghalaya, NIT Manipur, NIT Mizoram, NIT Nagaland, NIT Arunachal Pradesh, NIT Sikkim. JEE Main cutoffs and branch details.',
    intro:
      'Northeast India hosts eight NITs — NIT Silchar being the oldest (1967). These institutes admit through JoSAA using JEE Main ranks and often have more accessible cutoffs than their peers in other regions.',
    filter: { region: 'Northeast' },
    faqs: [
      {
        q: 'Which is the oldest NIT in Northeast India?',
        a: 'NIT Silchar in Assam, established in 1967. The other seven Northeast NITs were all established in the mid-2000s to 2010 wave of expansion.',
      },
      {
        q: 'Are Northeast NITs easier to get into?',
        a: 'Cutoffs at the newer Northeast NITs (Arunachal, Mizoram, Nagaland, Sikkim, Manipur, Meghalaya) are generally more accessible than at top-ranked NITs, making them good options for students with moderate ranks.',
      },
    ],
  },
  {
    slug: 'central-india',
    h1: 'Best Engineering Colleges in Central India (JEE Main)',
    metaTitle: 'Top NITs & IIITs in Central India 2025 — JEE Main Cutoffs | Canvas Classes',
    metaDescription:
      'Top NITs, IIITs and GFTIs in Central India — MANIT Bhopal, NIT Raipur, IIITDM Jabalpur, ABV-IIITM Gwalior. JEE Main cutoffs, NIRF ranks and branches across MP and Chhattisgarh.',
    intro:
      'Central India hosts MANIT Bhopal and NIT Raipur alongside two Institutes of National Importance IIITs — IIITDM Jabalpur and ABV-IIITM Gwalior. All admit via JoSAA.',
    filter: { region: 'Central' },
    faqs: [
      {
        q: 'Which IIITs are in Central India?',
        a: 'IIITDM Jabalpur and ABV-IIITM Gwalior — both Institutes of National Importance — are the two INI-classified IIITs in Central India that admit through JoSAA via JEE Main.',
      },
    ],
  },

  // ── Type landing pages ─────────────────────────────────────────────────────
  {
    slug: 'all-nits',
    h1: 'All 31 NITs — JEE Main Cutoffs & Rankings 2025',
    metaTitle: 'All 31 NITs List — JEE Main Cutoffs, NIRF Ranks, Branches | Canvas Classes',
    metaDescription:
      'Complete list of all 31 NITs (National Institutes of Technology) in India that admit through JEE Main and JoSAA counseling. Compare NIRF ranks, states, cutoffs, and popular branches.',
    intro:
      'There are 31 NITs across India — all Institutes of National Importance. Admission is through JoSAA counseling based on your JEE Main Common Rank List (CRL) rank. 50% of seats in each NIT are reserved for home-state candidates.',
    filter: { type: 'NIT' },
    faqs: [
      {
        q: 'How many NITs are there in India?',
        a: 'There are 31 NITs — National Institutes of Technology — spread across India. All are Institutes of National Importance and admit through JoSAA counseling via JEE Main.',
      },
      {
        q: 'What is the home-state quota in NITs?',
        a: '50% of the seats in every NIT are reserved for students who are residents of the state where the NIT is located. This is called the Home-State (HS) quota. The remaining 50% go to the Other-State (OS) pool. Home-state seats generally have much more accessible cutoffs.',
      },
      {
        q: 'Which is the best NIT in India?',
        a: 'NIT Trichy is typically ranked #1 among NITs on NIRF Engineering, followed by NIT Surathkal, NIT Rourkela, and NIT Warangal in the top tier.',
      },
      {
        q: 'What JEE Main rank do I need to get into an NIT?',
        a: 'CRL ranks below ~50,000 have a realistic shot at an NIT for OPEN category Gender-Neutral seats, though this varies by branch, quota (home-state vs other-state), and specific NIT. Use the predictor for exact, current projections.',
      },
    ],
  },
  {
    slug: 'all-iiits',
    h1: 'IIITs that Admit via JEE Main — Cutoffs & Rankings 2025',
    metaTitle: 'IIITs in India — JEE Main Cutoffs, INI List, Admissions | Canvas Classes',
    metaDescription:
      'Complete list of IIITs in India that admit through JEE Main and JoSAA counseling. Includes the five Institutes of National Importance IIITs and all PPP-model IIITs.',
    intro:
      'IIITs — Indian Institutes of Information Technology — specialize in computer science, information technology, and electronics. Five are classified as Institutes of National Importance; a larger set operates under the Public-Private Partnership model. All listed here admit via JoSAA using JEE Main ranks. IIIT Hyderabad, IIIT Bangalore, and IIIT Delhi have their own admission processes and are NOT in JoSAA.',
    filter: { type: 'IIIT' },
    faqs: [
      {
        q: 'Which IIITs admit through JEE Main?',
        a: 'Five Institute of National Importance IIITs — IIIT Allahabad, IIITDM Jabalpur, IIITDM Kancheepuram, IIITDM Kurnool, and ABV-IIITM Gwalior — plus 20+ PPP-model IIITs admit through JoSAA using JEE Main ranks.',
      },
      {
        q: 'Is IIIT Hyderabad in JoSAA?',
        a: 'No. IIIT Hyderabad is a Deemed University and admits through its own UGEE process — not JoSAA. The same applies to IIIT Bangalore and IIIT Delhi.',
      },
      {
        q: 'Are IIITs better than NITs for CSE?',
        a: 'Top IIITs like IIIT Allahabad and IIITDM Kancheepuram have strong CSE programs and placement records. For CSE specifically, a top IIIT can rival a mid-tier NIT. For breadth of branches (mechanical, civil, chemical, etc.), NITs are preferable.',
      },
    ],
  },
];

export function findLanding(slug: string): LandingConfig | null {
  return LANDING_CONFIGS.find((c) => c.slug === slug) ?? null;
}
