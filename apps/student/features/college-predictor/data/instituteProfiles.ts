// ============================================================================
// INSTITUTE CHARACTER PROFILES — the "fit" layer for the compare tool.
//
// WHY THIS EXISTS
// The compare tool deliberately does NOT rank colleges by generalized placement
// numbers — outlier packages don't tell a student what THEY will get. Instead we
// compare on *character / fit*: which institute suits which kind of student.
//
//   1. ORIENTATION  — is the place wired for research, startups, core industry,
//      the govt/PSU track, or going abroad? Students weight these differently.
//   2. BRANCH HERITAGE — an institute that has run a branch (Metallurgy, Mining,
//      Aerospace) for decades has far deeper alumni + recruiter depth IN that
//      branch. `knownForBranches` carries the legacy strengths (with founding
//      year where verified).
//   3. HIGHLIGHTS — short, durable, factual notes (incubator, legacy dept,
//      research labs, founder-alumni) — not year-specific stats that rot.
//
// DATA PROVENANCE (two tiers)
//   • RESEARCH-BACKED (27 institutes): orientation scores derived from sourced
//     evidence via the rubric below — NIRF 2024 research sub-scores, DST/MeitY
//     incubator status + startup counts, founder-alumni, department founding
//     years, PSU/abroad pipelines. Sources logged in
//     _agents/college-data-research-2026-06.md (character pass).
//   • EDITORIAL (the rest): informed judgement, not yet source-audited. These
//     degrade gracefully and are flagged as revisable.
//
// SCORING RUBRIC (1–5), applied consistently for the research-backed tier:
//   research        : NIRF 2024 RP sub-score banded — ≥52→5, 44–52→4, 36–44→3,
//                     30–36→2, <30→2 — then ±1 for documented research infra
//                     (flagship labs/centres) or when RP is unavailable.
//   entrepreneurship: 5 = major govt-funded incubator (DST-NIDHI/MeitY) at scale
//                     + notable founder-alumni; 4 = govt incubator with activity
//                     OR strong founders; 3 = incubator exists; 2 = cell/early;
//                     1 = none found.
//   coreIndustry    : core-branch recruiting brand + legacy-department depth.
//   govtPsu         : PSU pipeline (NIT core via GATE ≈4; steel/metals belt 4–5;
//                     IIIT 2–3; private BITS 2).
//   abroad          : documented MS/PhD-abroad pipeline.
// Scores remain a synthesis, not a precise metric — revisable as data improves.
//
// KEYS are the College `_id` slug ("nit-trichy") for JoSAA institutes, and
// "bits-<campus>" for BITS campuses.
// ============================================================================

export type AspirationKey =
  | 'research'
  | 'entrepreneurship'
  | 'coreIndustry'
  | 'govtPsu'
  | 'abroad';

export interface AspirationMeta {
  key: AspirationKey;
  label: string;
  short: string;
  blurb: string;
  icon: string;
}

// The "aspiration lens" the student picks. Selecting one re-frames the
// comparison around the orientation dimension that matters to THAT student.
export const ASPIRATIONS: AspirationMeta[] = [
  {
    key: 'coreIndustry',
    label: 'Core industry & tech jobs',
    short: 'Industry',
    blurb: 'Branch-specific recruiters and a deep alumni network in your field.',
    icon: '🏭',
  },
  {
    key: 'research',
    label: 'Research & academia',
    short: 'Research',
    blurb: 'Strong labs, a PhD/higher-studies culture, faculty doing real R&D.',
    icon: '🔬',
  },
  {
    key: 'entrepreneurship',
    label: 'Startups & entrepreneurship',
    short: 'Startups',
    blurb: 'Active incubator, founder alumni, and access to funding networks.',
    icon: '🚀',
  },
  {
    key: 'govtPsu',
    label: 'Govt & PSU career',
    short: 'Govt/PSU',
    blurb: 'A reliable pipeline into PSUs and stable public-sector roles.',
    icon: '🏛️',
  },
  {
    key: 'abroad',
    label: 'Higher studies abroad',
    short: 'Abroad',
    blurb: 'A track record of students heading to MS/PhD programmes overseas.',
    icon: '🌍',
  },
];

export interface InstituteProfile {
  // 1 (weak) – 5 (exceptional) on each orientation.
  orientation: Record<AspirationKey, number>;
  // Branches the institute is historically known to run well — a proxy for
  // alumni + recruiter depth IN that branch. "(since YYYY)" appended where a
  // department founding year was verified. Matched loosely (see isLegacyStrength).
  knownForBranches: string[];
  // 2–4 short, durable, factual notes.
  highlights: string[];
}

export const INSTITUTE_PROFILES: Record<string, InstituteProfile> = {
  // ════════ RESEARCH-BACKED TIER (sourced; see character pass in research log) ═
  // ── Top NITs ──────────────────────────────────────────────────────────────
  'nit-trichy': {
    orientation: { research: 5, entrepreneurship: 4, coreIndustry: 5, govtPsu: 4, abroad: 4 },
    knownForBranches: ['CSE', 'EEE', 'ECE', 'Mechanical', 'Production'],
    highlights: [
      'Highest-ranked non-IIT in NIRF Engineering (#9, 2024).',
      'Software/SaaS founder culture — Freshworks and HackerRank were founded by alumni.',
      'CEDI incubator plus the DST TREC-STEP science park (one of India’s first).',
    ],
  },
  'nit-warangal': {
    orientation: { research: 4, entrepreneurship: 4, coreIndustry: 5, govtPsu: 4, abroad: 4 },
    knownForBranches: ['CSE', 'ECE', 'EEE', 'Metallurgy (since 1965)', 'Civil'],
    highlights: [
      'India’s first Regional Engineering College (1959) — one of the deepest NIT alumni bases.',
      'DST-supported Technology Business Incubator and a 2024 startup policy.',
    ],
  },
  'nit-surathkal': {
    orientation: { research: 4, entrepreneurship: 4, coreIndustry: 5, govtPsu: 4, abroad: 4 },
    knownForBranches: ['CSE', 'IT', 'Mechanical', 'Mining', 'Metallurgy', 'Civil'],
    highlights: [
      'Reportedly the most student-founded startups among NITs; NITK-STEP DST incubator.',
      'Practo was co-founded by an alumnus.',
      'Coastal campus close to the Bengaluru tech ecosystem.',
    ],
  },
  'nit-rourkela': {
    orientation: { research: 5, entrepreneurship: 4, coreIndustry: 5, govtPsu: 4, abroad: 3 },
    knownForBranches: ['Ceramic', 'Metallurgy', 'Mining', 'Mechanical', 'Chemical'],
    highlights: [
      'Research-heavy NIT — among the highest NIRF research sub-scores in the system.',
      'Distinctive Ceramic Engineering dept; FTBI incubator with 100+ startups (incl. Coratia ROVs).',
      'Deep metallurgy/mining/ceramic heritage in a steel city.',
    ],
  },
  'nit-calicut': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'Architecture', 'Mechanical', 'Civil'],
    highlights: [
      'Established NIT (1961); well regarded for architecture and core branches.',
      'DST-supported Technology Business Incubator since 2004.',
    ],
  },
  'nit-allahabad': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['CSE (since 1976)', 'IT', 'ECE', 'EEE'],
    highlights: [
      'First institute in India to offer an undergraduate CSE programme (1976).',
      'Top CSE placements (Google, Microsoft, Amazon); supercomputing heritage (PARAM).',
      'DST-NIDHI incubator (IIHMF).',
    ],
  },
  'nit-jaipur': {
    orientation: { research: 4, entrepreneurship: 4, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'Mechanical', 'Metallurgy', 'Chemical'],
    highlights: [
      'Among the top NITs for research (ranked 3rd among NITs, NIRF 2024).',
      'DST-funded MIIC incubator with a large dedicated facility.',
    ],
  },
  'nit-nagpur': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['CSE', 'Mechanical', 'Civil', 'Mining', 'Metallurgy'],
    highlights: [
      'Hosts an ISRO Space Technology Incubation Centre.',
      'Long core-engineering heritage with strong metallurgy and mining departments.',
    ],
  },
  'nit-surat': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['Civil', 'Mechanical', 'CSE', 'ECE', 'Chemical'],
    highlights: [
      'DST-NIDHI incubator (ASHINE); World Bank Centre of Excellence in water resources.',
      'Strong in civil and core branches; industrial Gujarat location.',
    ],
  },
  'nit-bhopal': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'Mechanical', 'Chemical', 'Architecture'],
    highlights: [
      'One of the first eight RECs (1960); Centre of AI and a CoE in Water Management.',
      'Notable architecture & planning programme.',
    ],
  },
  'nit-kurukshetra': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'EEE', 'Mechanical'],
    highlights: [
      'Established Haryana NIT with strong CS/electronics placements (Google, Amazon, Oracle).',
    ],
  },
  'nit-jamshedpur': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 5, govtPsu: 4, abroad: 2 },
    knownForBranches: ['Metallurgy', 'Production', 'Mechanical', 'Civil'],
    highlights: [
      'In the heart of Tata steel country — exceptional metallurgy and steel-industry pipeline.',
      'Founded 1960 as RIT Jamshedpur; recruiters led by Tata Steel and the metals belt.',
    ],
  },
  'nit-durgapur': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 5, govtPsu: 4, abroad: 2 },
    knownForBranches: ['Metallurgy (since 1960)', 'Mechanical', 'Civil', 'CSE'],
    highlights: [
      'Steel-city NIT; the Metallurgical & Materials dept has been a teaching/research centre since 1960.',
    ],
  },
  'nit-patna': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 4, abroad: 2 },
    knownForBranches: ['Civil (since 1924)', 'Mechanical', 'CSE', 'ECE', 'Architecture'],
    highlights: [
      'One of India’s oldest engineering lineages — Civil Engineering since 1924.',
      'Selected under the Bihar Startup Policy; state-capital location.',
    ],
  },
  'nit-raipur': {
    orientation: { research: 3, entrepreneurship: 4, coreIndustry: 5, govtPsu: 4, abroad: 2 },
    knownForBranches: ['Metallurgy (since 1956)', 'Mining (since 1956)', 'Mechanical', 'Civil', 'CSE'],
    highlights: [
      'Founded 1956 as a Government College of Mining and Metallurgy — rare, deep heritage.',
      'DST-NIDHI incubator (NITRRFIE) with 50+ startups; central steel/mineral belt.',
    ],
  },
  'nit-delhi': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 4, govtPsu: 3, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'EEE', 'VLSI'],
    highlights: [
      'Young (2010) NIT punching above its age — NIRF Engineering #45.',
      'VLSI and power-electronics research focus; prime metro location.',
    ],
  },

  // ── IIITs (research-backed) ─────────────────────────────────────────────
  'iiit-allahabad': {
    orientation: { research: 3, entrepreneurship: 4, coreIndustry: 5, govtPsu: 3, abroad: 4 },
    knownForBranches: ['CSE (since 1999)', 'IT', 'ECE'],
    highlights: [
      'India’s oldest and most reputed IIIT (1999); elite CS / competitive-programming culture.',
      'MeitY-funded incubator (IIIC); strong abroad higher-studies pipeline.',
      'AI, robotics, data-science and computer-vision research labs.',
    ],
  },
  'iiitm-gwalior': {
    orientation: { research: 3, entrepreneurship: 4, coreIndustry: 4, govtPsu: 2, abroad: 4 },
    knownForBranches: ['IT', 'CSE', 'Management'],
    highlights: [
      'Distinctive IT + management blend (integrated programmes).',
      'TIIC incubator (Mech-Mocha, TAPITS); alumni pursue PhDs at UPenn, Cornell, Arizona State.',
    ],
  },
  'iiitdm-jabalpur': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 2, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'Mechanical', 'Design (since 2008)'],
    highlights: [
      'IT-enabled design & manufacturing focus with strong fabrication/prototyping labs.',
      'Autonomous Institute of National Importance.',
    ],
  },
  'iiitdm-kancheepuram': {
    orientation: { research: 4, entrepreneurship: 4, coreIndustry: 4, govtPsu: 3, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'Mechanical', 'Design'],
    highlights: [
      'Design-driven incubator MaDeIT (DST-supported, ~₹10 cr seed fund).',
      'Smart-manufacturing / Industry-4.0 research; DRDO and ISRO collaborations.',
    ],
  },
  'iiit-sri-city': {
    orientation: { research: 3, entrepreneurship: 4, coreIndustry: 4, govtPsu: 2, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'AI & DS'],
    highlights: [
      'Located inside the Sri City industrial hub — strong industry exposure.',
      'MeitY-funded Gyan Circle Ventures incubator; first PPP IIIT with a funded MS/PhD programme.',
    ],
  },

  // ── GFTIs (research-backed) ─────────────────────────────────────────────
  'gfti-iiest-shibpur': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 5, govtPsu: 4, abroad: 3 },
    knownForBranches: ['Civil (since 1856)', 'Metallurgy (since 1939)', 'Mining (since 1956)', 'Aerospace', 'Mechanical'],
    highlights: [
      'One of India’s oldest engineering institutions (Civil Engineering College, 1856).',
      'Deep heritage: Metallurgy (1939), Mining (1956), Aerospace; PSU recruiters (BHEL, Coal India).',
    ],
  },
  'gfti-bit-mesra': {
    orientation: { research: 3, entrepreneurship: 4, coreIndustry: 4, govtPsu: 3, abroad: 3 },
    knownForBranches: ['Space Engineering (since 1964)', 'CSE', 'ECE', 'Mechanical', 'Architecture'],
    highlights: [
      'Set up India’s first Department of Space Engineering & Rocketry (1964).',
      'Home to one of India’s first Science & Technology Entrepreneurs Parks (STEP).',
      'Founder-alumni include AI researcher Ashish Vaswani.',
    ],
  },
  'gfti-pec-chandigarh': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['Aerospace (since 1962)', 'Mechanical', 'CSE', 'Civil', 'Production'],
    highlights: [
      'Founded 1921; runs one of India’s oldest Aerospace Engineering departments (since 1962).',
      'Heritage core-engineering institute with PSU recruitment via GATE.',
    ],
  },

  // ── BITS (research-backed) ──────────────────────────────────────────────
  'bits-pilani': {
    orientation: { research: 4, entrepreneurship: 5, coreIndustry: 4, govtPsu: 2, abroad: 5 },
    knownForBranches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Chemical'],
    highlights: [
      'India’s standout institute for entrepreneurship — PIEDS incubator with 400+ startups.',
      'Founder-alumni: Hotmail, SanDisk/Micron, redBus, GreyOrange.',
      'Practice School industry programme (since 1973); strong abroad pipeline (IPCD).',
      'Flexible curriculum — pick your branch by CGPA, plus dual degrees.',
    ],
  },
  'bits-goa': {
    orientation: { research: 3, entrepreneurship: 5, coreIndustry: 4, govtPsu: 2, abroad: 4 },
    knownForBranches: ['CSE', 'ECE', 'EEE', 'Mechanical'],
    highlights: [
      'Shares the BITS model — PIEDS incubator, Practice School, strong abroad pipeline.',
      'Startup-friendly, flexible, merit-only admission (BITSAT).',
    ],
  },
  'bits-hyderabad': {
    orientation: { research: 3, entrepreneurship: 5, coreIndustry: 4, govtPsu: 2, abroad: 4 },
    knownForBranches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Chemical'],
    highlights: [
      'Newest BITS campus in a major tech hub; the same entrepreneurial BITS model.',
      'PIEDS incubator, Practice School, and IPCD abroad programmes.',
    ],
  },

  // ════════ EDITORIAL TIER (informed judgement; not yet source-audited) ═══════
  'nit-jalandhar': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'Mechanical', 'Textile', 'Industrial'],
    highlights: [
      'Dr B R Ambedkar NIT — solid north-India NIT with reliable placements.',
      'Distinctive textile and industrial engineering programmes.',
    ],
  },
  'nit-silchar': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 4, govtPsu: 4, abroad: 2 },
    knownForBranches: ['CSE', 'ECE', 'EE', 'Civil', 'Mechanical'],
    highlights: ['Established Northeast NIT (REC since 1967) with a steady core-branch recruiter base.'],
  },
  'nit-srinagar': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 4, govtPsu: 4, abroad: 2 },
    knownForBranches: ['Civil', 'Mechanical', 'CSE', 'ECE', 'Metallurgy'],
    highlights: ['Older NIT (REC since 1960) with a long civil and mechanical engineering tradition.'],
  },
  'nit-agartala': {
    orientation: { research: 2, entrepreneurship: 2, coreIndustry: 3, govtPsu: 4, abroad: 2 },
    knownForBranches: ['CSE', 'ECE', 'EE', 'Civil', 'Mechanical'],
    highlights: ['Northeast NIT with a regional recruiter base; PSU-leaning outcomes.'],
  },
  'nit-hamirpur': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 4, govtPsu: 3, abroad: 2 },
    knownForBranches: ['CSE', 'ECE', 'EE', 'Mechanical'],
    highlights: ['Scenic Himachal campus; computing and electronics focus.'],
  },
  'nit-goa': {
    orientation: { research: 2, entrepreneurship: 3, coreIndustry: 3, govtPsu: 3, abroad: 3 },
    knownForBranches: ['CSE', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    highlights: ['Newer, small NIT in a prime location; computing-leaning intake.'],
  },
  'iiit-bhubaneswar': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 3, abroad: 3 },
    knownForBranches: ['CSE', 'IT', 'ECE'],
    highlights: ['Computing-focused IIIT with steady software placements.'],
  },
  'iiit-pune': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 3, abroad: 3 },
    knownForBranches: ['CSE', 'ECE'],
    highlights: ['PPP-model IIIT in a strong IT metro (Pune); computing-centric.'],
  },
  'iiit-lucknow': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 3, abroad: 3 },
    knownForBranches: ['CSE', 'IT'],
    highlights: ['Computing/IT-focused IIIT with a growing recruiter base.'],
  },
  'iiit-guwahati': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 3, abroad: 3 },
    knownForBranches: ['CSE', 'ECE'],
    highlights: ['Northeast IIIT, computing/electronics focus; rising recruiter base.'],
  },
  'iiit-vadodara': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 2, abroad: 3 },
    knownForBranches: ['CSE', 'IT'],
    highlights: ['PPP-model IIIT in industrial Gujarat; computing-focused.'],
  },
  'gfti-sgsits-indore': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 4, govtPsu: 4, abroad: 2 },
    knownForBranches: ['Mechanical', 'Electronics', 'CSE', 'Civil'],
    highlights: ['Established central-India institute with solid core-branch recruiting.'],
  },
  'gfti-niamt-ranchi': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 5, govtPsu: 4, abroad: 2 },
    knownForBranches: ['Manufacturing', 'Foundry', 'Forge', 'Materials', 'Mechanical'],
    highlights: [
      'Formerly NIFFT — a one-of-a-kind foundry, forge and advanced-manufacturing institute.',
      'Deep, specialised ties to the metals and manufacturing industry.',
    ],
  },
  'gfti-smvdu-katra': {
    orientation: { research: 3, entrepreneurship: 2, coreIndustry: 3, govtPsu: 3, abroad: 2 },
    knownForBranches: ['CSE', 'ECE', 'Mechanical'],
    highlights: ['State university near Katra; computing and core branches.'],
  },
  'gfti-spa-delhi': {
    orientation: { research: 4, entrepreneurship: 3, coreIndustry: 5, govtPsu: 4, abroad: 4 },
    knownForBranches: ['Architecture', 'Planning'],
    highlights: [
      'The top School of Planning and Architecture in India — #1 in NIRF Architecture.',
      'Architecture & planning only (not B.Tech); unmatched alumni network in the field.',
    ],
  },
  'gfti-spa-bhopal': {
    orientation: { research: 3, entrepreneurship: 3, coreIndustry: 4, govtPsu: 4, abroad: 3 },
    knownForBranches: ['Architecture', 'Planning'],
    highlights: ['Institute of National Importance for architecture & planning (not B.Tech).'],
  },
};

/** Returns the curated profile for an institute, or null if not yet profiled. */
export function getInstituteProfile(slug: string): InstituteProfile | null {
  return INSTITUTE_PROFILES[slug] ?? null;
}

/**
 * Loose match between a curated "known-for" branch and the actual branch a
 * student is comparing. Handles:
 *   - substring either way        → "CSE" vs "CSE (AI & DS)", "Materials" vs "...Materials..."
 *   - shared word-stem (≥5 chars) → "Metallurgy" vs "Metallurgical and Materials Engineering"
 *   - short code is a word prefix → "Mining" vs "MIN", "Ceramic" vs "CER"
 * The curated side may carry a "(since YYYY)" suffix — substring/stem matching
 * still works because the branch name appears as a leading token.
 */
function tokenMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a.includes(b) || b.includes(a)) return true;
  // shared leading stem of ≥5 chars (metallurgy/metallurgical)
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (i >= 5) return true;
  // a short code (≥3 chars) that prefixes a word in the other string
  const words = (a.length <= b.length ? b : a).split(/[^a-z0-9]+/);
  const code = a.length <= b.length ? a : b;
  return code.length >= 3 && words.some((w) => w.startsWith(code) || (code.startsWith(w) && w.length >= 3));
}

export function isLegacyStrength(profile: InstituteProfile | null, branchShortName: string, branchName?: string): boolean {
  if (!profile) return false;
  const needles = [branchShortName, branchName].filter(Boolean).map((s) => (s as string).toLowerCase().trim());
  return profile.knownForBranches.some((known) => {
    // Compare on the branch token only, ignoring any "(since YYYY)" suffix.
    const k = known.toLowerCase().replace(/\s*\(since[^)]*\)/, '').trim();
    return needles.some((n) => tokenMatch(k, n));
  });
}
