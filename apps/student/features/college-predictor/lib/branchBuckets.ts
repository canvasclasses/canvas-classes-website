// ============================================================================
// BRANCH BUCKETS — consolidates the 150+ branch-name variants in JoSAA cutoff
// data into a small set of student-friendly groups.
//
// WHY: colleges name fundamentally-similar branches differently ("Food
// Technology" / "Food Engineering and Technology" / "Food and Technology";
// "Metallurgy and Materials" / "Materials Science and Metallurgical" / "MME").
// A flat list of every name overwhelms students AND splits the same branch
// across labels. Buckets fix both: pick "Computer Science & Allied" and you get
// every CS/AI/DS/IT/cyber variant across all colleges, in one place.
//
// SOURCE: derived from the content team's "Branch Data Requirement.xlsx"
// (BRANCHES + Branch Buckets sheets). The file's bucket TITLES disagreed with
// its per-branch ASSIGNMENTS (it labelled B4 "Civil & Chemical" / B5
// "Architecture" but assigned Civil→B4, Chemical→B5, Architecture→Others); we
// follow the per-branch assignments and give Architecture its own bucket
// (B.Arch/B.Plan are a large, distinct path on a separate JEE paper).
//
// The classifier is RULE-BASED (keyword/regex), not a fixed lookup, so it also
// classifies branch names we haven't seen yet. Validated to cover 100% of the
// distinct branch_name values currently in `college_cutoffs`.
// ============================================================================

export interface BranchBucket {
  id: string;
  title: string;
  short: string; // compact chip label
  order: number;
}

export const BRANCH_BUCKETS: BranchBucket[] = [
  { id: 'cs',       title: 'Computer Science & Allied',          short: 'CS & Allied',     order: 1 },
  { id: 'ece',      title: 'Electronics & Electrical',           short: 'Electronics/Elec', order: 2 },
  { id: 'mech',     title: 'Mechanical & Industrial',            short: 'Mechanical',      order: 3 },
  { id: 'civil',    title: 'Civil & Environmental',              short: 'Civil',           order: 4 },
  { id: 'chem',     title: 'Chemical, Process & Pharma',         short: 'Chemical',        order: 5 },
  { id: 'bio',      title: 'Biotech, Biomedical & Life Sciences', short: 'Biotech/Bio',    order: 6 },
  { id: 'aero',     title: 'Aerospace & Aviation',               short: 'Aerospace',       order: 7 },
  { id: 'meta',     title: 'Metallurgy, Materials & Mining',     short: 'Metallurgy/Mining', order: 8 },
  { id: 'math',     title: 'Mathematics, Computing & Data',      short: 'Maths & Computing', order: 9 },
  { id: 'sci',      title: 'Pure Sciences (Physics, Chemistry, Economics, Earth)', short: 'Pure Sciences', order: 10 },
  { id: 'arch',     title: 'Architecture, Planning & Design',    short: 'Architecture',    order: 11 },
  { id: 'mba',      title: 'B.Tech + MBA / Management',          short: 'B.Tech + MBA',    order: 12 },
  { id: 'other',    title: 'Others / Interdisciplinary',         short: 'Others',          order: 13 },
];

export type BranchBucketId = (typeof BRANCH_BUCKETS)[number]['id'];

export const BRANCH_BUCKET_BY_ID: Record<string, BranchBucket> = Object.fromEntries(
  BRANCH_BUCKETS.map((b) => [b.id, b]),
);

// Ordered rules — FIRST match wins, so more-specific buckets come first
// (e.g. "...+ MBA" must beat "Computer Science"; "Industrial Chemistry" must
// beat "Industrial Engineering"). Each test runs against the lowercased name.
const RULES: { id: BranchBucketId; re: RegExp }[] = [
  // 12: B.Tech + MBA / management dual degrees (check before the parent branch)
  { id: 'mba',   re: /\bmba\b|management/ },
  // 11: Architecture / planning / design
  { id: 'arch',  re: /architect|\bplanning\b|\bb\.?\s?plan\b|\bdesign\b/ },
  // 7: Aerospace & aviation
  { id: 'aero',  re: /aero|aviation|\bspace\b|avionic|aeronautic/ },
  // 6: Biotech / biomedical / life sciences
  { id: 'bio',   re: /bio[\s-]?tech|biomed|bio[\s-]?medical|life scien|biological scien|bioengineer|bio engineer/ },
  // 8: Metallurgy / materials / mining / ceramic
  { id: 'meta',  re: /metallurg|\bmining\b|ceramic|material|\bmems\b|\bmsme\b/ },
  // 5: Chemical / process / pharma / food (incl. "industrial chemistry" before mech)
  { id: 'chem',  re: /chemical|industrial chem|\bfood\b|\bpharma|petro|polymer|process engineer/ },
  // 4: Civil & environmental
  { id: 'civil', re: /\bcivil\b|environment|structural/ },
  // 2: Electronics & electrical
  { id: 'ece',   re: /electronic|electrical|\bece\b|\beee\b|\bvlsi\b|communication|telecommunication|instrumentation|microelectronic|\bee\b/ },
  // 1: Computer science & allied (CS-flavoured AI/DS/IT/cyber)
  { id: 'cs',    re: /computer|\bcse\b|information tech|\bit\b|artificial intel|\bai\b|machine learning|data scien|data engineer|\bcyber|software|\binformatics\b/ },
  // 3: Mechanical & industrial (incl. robotics, mechatronics, computational mechanics)
  { id: 'mech',  re: /mechanical|production|industrial|manufactur|\brobot|mechatron|automation|\bieor\b|thermal|computational mechanic|\bmech\b|smart manufactur|\bme\b/ },
  // 9: Mathematics, computing & data (non-CSE)
  { id: 'math',  re: /mathematic|\bcomputing\b|\bm&c\b|computational math|\bquantitative\b/ },
  // 10: Pure sciences
  { id: 'sci',   re: /physic|chemistry|\beconomic|geolog|geophys|\bearth\b|statistic|\bagri/ },
  // 13 (fallback handled below): textile / naval / energy / animation / general engineering …
  { id: 'other', re: /textile|naval|\bocean\b|energy|animation|\bvfx\b|handloom|general engineer|engineering scien|\bcarpet\b|engineering physics|nanoscien|semiconductor/ },
];

// Optional "narrow to a specific branch" chips shown once a bucket is picked.
// `match` is sent to the predict API as dream_branch (alias-matched server-side),
// so it can be a friendly code/keyword. Buckets without meaningful sub-choices
// (mba/other) omit a drill-down.
export const BUCKET_DRILLDOWN: Record<string, { label: string; match: string }[]> = {
  cs: [
    { label: 'CSE', match: 'CSE' },
    { label: 'AI / ML', match: 'Artificial Intelligence' },
    { label: 'Data Science', match: 'Data Science' },
    { label: 'IT', match: 'Information Technology' },
    { label: 'Cyber Security', match: 'Cyber' },
  ],
  ece: [
    { label: 'ECE', match: 'Electronics and Communication' },
    { label: 'Electrical (EE)', match: 'Electrical Engineering' },
    { label: 'EEE', match: 'Electrical and Electronics' },
    { label: 'VLSI', match: 'VLSI' },
    { label: 'Instrumentation', match: 'Instrumentation' },
  ],
  mech: [
    { label: 'Mechanical', match: 'Mechanical' },
    { label: 'Production', match: 'Production' },
    { label: 'Industrial', match: 'Industrial Engineering' },
    { label: 'Robotics', match: 'Robotics' },
  ],
  civil: [
    { label: 'Civil', match: 'Civil' },
    { label: 'Environmental', match: 'Environmental' },
  ],
  chem: [
    { label: 'Chemical', match: 'Chemical Engineering' },
    { label: 'Food Tech', match: 'Food' },
    { label: 'Pharma', match: 'Pharma' },
  ],
  bio: [
    { label: 'Biotechnology', match: 'Biotechnology' },
    { label: 'Biomedical', match: 'Biomedical' },
  ],
  aero: [
    { label: 'Aerospace', match: 'Aerospace' },
    { label: 'Aeronautical', match: 'Aeronautical' },
  ],
  meta: [
    { label: 'Metallurgy', match: 'Metallurg' },
    { label: 'Mining', match: 'Mining' },
    { label: 'Materials', match: 'Materials' },
    { label: 'Ceramic', match: 'Ceramic' },
  ],
  math: [
    { label: 'Maths & Computing', match: 'Mathematics and Computing' },
    { label: 'Mathematics', match: 'Mathematics' },
  ],
  sci: [
    { label: 'Physics', match: 'Physics' },
    { label: 'Chemistry', match: 'Chemistry' },
    { label: 'Economics', match: 'Economics' },
  ],
  arch: [
    { label: 'Architecture', match: 'Architecture' },
    { label: 'Planning', match: 'Planning' },
    { label: 'Design', match: 'Design' },
  ],
  mba: [],
  other: [],
};

const norm = (s: string | undefined | null): string =>
  (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

/**
 * Classify a branch (by full name, optionally short name) into a bucket id.
 * Always returns a bucket — falls back to 'other' for anything unmatched.
 */
export function bucketForBranch(branchName: string, branchShort?: string): BranchBucketId {
  const hay = `${norm(branchName)} ${norm(branchShort)}`.trim();
  for (const { id, re } of RULES) {
    if (re.test(hay)) return id;
  }
  return 'other';
}
