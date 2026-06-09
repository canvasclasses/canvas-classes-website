// Catalog for the Drop Year Planner (Chemistry v1).
//
// The chapter list, names, categories, and question counts are derived live from
// `buildChaptersWithCounts()` (the same source /the-crucible uses), so the planner
// can never drift from the taxonomy. The only hand-curated part is RESOURCE_MAP —
// the per-chapter lectures / notes / flashcards links. Crucible practice is always
// linked automatically by chapter id.
//
// This file is imported server-side (page.tsx builds the catalog) and the resulting
// plain objects are passed to the client island as props. Only `import type` crosses
// into shared use so nothing server-only leaks into the client bundle.

import type { ChapterWithCounts } from '@/features/crucible/lib/chapterCounts';
import { PHYSICS_GROUP_LABEL, MATH_GROUP_LABEL } from '@/features/crucible/lib/subjects';

// The three subjects the planner can show. Chemistry is fully curated
// (weightage / difficulty / one-shot / prereqs); physics + math are catalog +
// BYO-resource for v1 (students bring their own lectures/notes; Crucible powers
// practice). See the Phase-5 handoff for the launch scope.
export type Subject = 'chemistry' | 'physics' | 'math';
export const PLANNER_SUBJECTS: Subject[] = ['chemistry', 'physics', 'math'];
export const SUBJECT_META: Record<Subject, { label: string }> = {
    chemistry: { label: 'Chemistry' },
    physics: { label: 'Physics' },
    math: { label: 'Math' },
};

export type ResourceKind = 'lecture' | 'notes' | 'questions' | 'flashcards' | 'tool';

// The chapter loop: Learn (theory) → Apply (learn the method on worked DPPs) →
// Practice (solve yourself on Crucible) → Revise (flashcards + mock test, spaced).
export type LoopStep = 'learn' | 'apply' | 'practice' | 'revise';

export const LOOP_STEPS: { id: LoopStep; label: string; blurb: string }[] = [
    { id: 'learn',    label: 'Learn',    blurb: 'Watch / read the concept once.' },
    { id: 'apply',    label: 'Apply',    blurb: 'Learn how to solve — worked DPPs & methodology.' },
    { id: 'practice', label: 'Practice', blurb: 'Solve questions yourself on Crucible.' },
    { id: 'revise',   label: 'Revise',   blurb: 'Flashcards + a mock test, a few days later.' },
];

export type PlannerResource = {
    label: string;
    kind: ResourceKind;
    href: string;            // deep link into the site
    embedUrl?: string;       // when present, plays inline in the player window
    steps: LoopStep[];       // which loop step(s) this resource serves
    oneShot?: boolean;       // a quick-revision one-shot video — surfaced in EVERY mode
};

export type WeightTier = 'high' | 'medium' | 'low';
export type Difficulty = 'easy' | 'medium' | 'hard';

// A chapter on the Complete Chemistry Lectures page (/detailed-lectures/<slug>),
// resolved live from that page's sheet. Used to build the Class 11/12 "Detailed
// Lectures" + "PDF Notes" resources. See lectures.server.ts.
export type DetailedLectureRef = {
    slug: string;
    name: string;
    videoCount: number;
    notesLink: string;
};

export type ChapterPlanItem = {
    chapterId: string;       // taxonomy id, e.g. 'ch11_mole' (authoritative key)
    name: string;
    subject: Subject;        // chemistry | physics | math
    category: 'Physical' | 'Inorganic' | 'Organic' | 'Practical';
    // Sidebar accordion + dashboard dimension label. For chemistry this equals
    // `category`; for physics it's 'Physics'; for math it's the pretty
    // chapter-type ('Algebra', 'Calculus', …). Authoritative grouping key for
    // any subject — the chem-only `category` is kept for back-compat.
    group: string;
    classLevel: 11 | 12;
    sequence: number;
    weight: WeightTier;          // research-backed weightage tier (see WEIGHTAGE_MAP)
    highYield: boolean;          // weight === 'high' — drives the visible flame chip
    weightagePct: number;        // raw JEE Main % (5-year avg) — for display + sorting
    difficulty: Difficulty;       // chapter-size + conceptual depth (see DIFFICULTY_MAP)
    mustDo: boolean;              // High/Core weight + Easy/Medium diff = highest ROI (silent ordering)
    daysNeeded: number;          // study days for this chapter (3 / 5 / 7) — see CHAPTER_DAYS_MAP
    questionCount: number;
    starCount: number;
    // Resources differ by batch (mode): Class 11 sees detailed lectures, Class 12
    // sees detailed lectures (its own chapters) or crash courses (Class 11
    // prereqs), Dropper sees crash courses + DPP. Keyed by PlannerMode; the
    // chapter screen renders the slice for the active mode.
    resourcesByMode: Record<PlannerMode, PlannerResource[]>;
    // One-shot lecture (single video covering the whole chapter). When present,
    // renders as a prominent button on the chapter screen — preferred over a
    // detailed-lectures playlist for students who are revising.
    oneShotVideoId?: string;
    oneShotDurationMin?: number;
    // For Class 12 chapters: Class 11 chapters whose mastery underpins this
    // chapter. Powers the "Revise alongside" callout. Empty for non-Class 12
    // chapters or Class 12 chapters with no specific prereq.
    prerequisites: string[];
};

// --- per-chapter study days ----------------------------------------------
// Tuned to chapter size and conceptual depth (Canvas Classes teaching team).
// 7d = large/dense chapters where rushing breaks retention.
// 3d = bounded chapters that can be locked quickly.
// 5d = the calibrated middle for everything else.
export const CHAPTER_DAYS_DEFAULT = 5;
// Bounds for the student-editable per-chapter day count in the roadmap.
export const CHAPTER_DAYS_MIN = 1;
export const CHAPTER_DAYS_MAX = 30;
export const CHAPTER_DAYS_MAP: Record<string, number> = {
    // 7-day (large)
    ch11_thermo: 7,
    ch11_bonding: 7,
    ch11_goc: 7,
    ch11_hydrocarbon: 7,
    ch12_electrochem: 7,
    ch12_coord: 7,
    ch12_carbonyl: 7,
    // 3-day (quick wins)
    ch11_periodic: 3,
    ch11_redox: 3,
    ch11_pblock: 3,
    ch12_amines: 3,
    // everything else → CHAPTER_DAYS_DEFAULT
};

// After every N chapters in the roadmap, auto-insert a short consolidation
// revision break (re-test from the loop's 4th step + flashcards). 2 days felt
// right against 5d chapter cadence — long enough to consolidate, short enough
// not to bleed into the next chapter.
export const AUTO_REVISION_EVERY_N_CHAPTERS = 3;
export const AUTO_REVISION_DAYS = 2;

// --- curated resource map -------------------------------------------------
// Fill these in per chapter as they are verified. Anything omitted simply isn't
// shown; the always-on Crucible practice link + the class chemistry lectures hub
// are added by the builder regardless, so every chapter is usable from day one.
//
// `embedUrl` (a YouTube/Drive link) makes a resource play inline. Use the helpers.
const yt = (id: string) => `https://www.youtube.com/embed/${id}`;
const ytWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const drivePdf = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

type ResourceSeed = Omit<PlannerResource, 'steps'> & { steps?: LoopStep[] };

// A YouTube video resource that PLAYS INLINE (embedUrl) inside the planner;
// `href` is the watch URL so the "Open" affordance still works. `steps` controls
// which loop step it sits under (default Learn; pass ['apply'] for DPP videos).
// All video kind = 'lecture' so it shows the play icon and plays inline.
const ytVideo = (label: string, videoId: string, steps: LoopStep[] = ['learn']): ResourceSeed => ({
    label,
    kind: 'lecture',
    href: ytWatch(videoId),
    embedUrl: yt(videoId),
    steps,
});
// One-shot / quick-revision video. Flagged `oneShot` so the builder surfaces it
// in EVERY batch (Class 11, Class 12, Dropper) — one-shots are how students
// revise a chapter fast, useful regardless of batch.
const oneShotLecture = (label: string, videoId: string): ResourceSeed => ({ ...ytVideo(label, videoId, ['learn']), oneShot: true });

export const RESOURCE_MAP: Record<string, ResourceSeed[]> = {
    // --- Class 11 ---
    ch11_mole: [
        ytVideo('Mole Concept — Crash Course L1', 'tvp-RDY_FM0'),
        ytVideo('Mole Concept — Crash Course L2', '8c8ayHmxzlA'),
        ytVideo('Mole Concept — DPP 1', 'rOjFuHsVQu4', ['apply']),
        ytVideo('Mole Concept — DPP 2', 'dPx9bNzgsNw', ['apply']),
        ytVideo('Mole Concept — DPP 3', 'Wf5lLogiAnQ', ['apply']),
        // Brief revision summary — placed last so it's used after the detailed
        // lectures. Flagged one-shot so it shows in Class 11 / 12 / Dropper.
        oneShotLecture('Mole Concept — Revise in 15 Minutes', '9yga2IAEm3g'),
    ],
    ch11_atom: [
        ytVideo('Atomic Structure — Crash Course L1', 'Fg02K1UGJaw'),
        ytVideo('Atomic Structure — Crash Course L2', 'RTqS9uDUwWw'),
        ytVideo('Atomic Structure — Crash Course L3', 'QY6sSpKt0N8'),
        ytVideo('Atomic Structure — DPP 1', 'O7-lnMBnifc', ['apply']),
        ytVideo('Atomic Structure — DPP 2', 'pXAmCr4Y0vs', ['apply']),
        ytVideo('Atomic Structure — DPP 3', 'Bae5-F1AXWQ', ['apply']),
        // One-shot last — quick revision after the detailed work. Shows in every batch.
        oneShotLecture('Atomic Structure — One Shot', '_fOi9q31vHQ'),
    ],
    ch11_periodic: [
        ytVideo('Periodicity — Crash Course L1', 'C6bHDPJfvwk'),
        ytVideo('Periodicity — Crash Course L2', 'T368-IpfD7U'),
        oneShotLecture('Periodicity — One Shot', 'p-NdkOfm0tQ'),
    ],
    ch11_bonding: [
        ytVideo('Chemical Bonding — Crash Course L1', '_RLPotf0NSA'),
        ytVideo('Chemical Bonding — Crash Course L2', 'jyzzVa2Dgj0'),
        ytVideo('Chemical Bonding — Crash Course L3', 'ENICF20VTuM'),
        ytVideo('Chemical Bonding — Crash Course L4', 'xhYjvroxVF4'),
        oneShotLecture('Chemical Bonding — One Shot', 'yMpD6PEFjmw'),
    ],
    ch11_thermo: [
        ytVideo('Thermodynamics — Pre-Requisite', 'TADFKhfM1tE'),
        ytVideo('Thermodynamics — Crash Course L1', 'V7uChUeuSzc'),
        ytVideo('Thermodynamics — Crash Course L2', 'AnnJaLUlnMk'),
        ytVideo('Thermodynamics — Crash Course L3', 'hQDUFSHokTQ'),
        ytVideo('Thermodynamics — Crash Course L4', '6dxB49anz8o'),
        ytVideo('Isothermal & Adiabatic Work — Derivation & Comparison', 'OdjaGJca4A0'),
        ytVideo('Fundamentals of Entropy & Gibbs Energy', 'HTqpDc-nWB8'),
        oneShotLecture('Thermodynamics — One Shot', '437RxJzwOhk'),
    ],
    ch11_chem_eq: [
        ytVideo('Chemical Equilibrium — Crash Course L1', 'ugcCAg8WzdE'),
        ytVideo('Chemical Equilibrium — Crash Course L2', '3PpmAFLQscw'),
        oneShotLecture('Chemical Equilibrium — One Shot', 'pcokrXtUnGo'),
    ],
    ch11_ionic_eq: [
        ytVideo('Ionic Equilibrium — Crash Course L1', 'SrHK0T8-YEo'),
        ytVideo('Ionic Equilibrium — Crash Course L2', 'C-CjfepOz6k'),
        ytVideo('Ionic Equilibrium — Crash Course L3', 'jTKFF-LGN1k'),
        ytVideo('Ionic Equilibrium — DPP 1', 'ZdDQ_lXFhkU', ['apply']),
        ytVideo('Ionic Equilibrium — DPP 2', 'ggC5pmkOPw8', ['apply']),
        ytVideo('Ionic Equilibrium — DPP 3', 'v9ejpnHwPR8', ['apply']),
    ],
    ch11_redox: [
        ytVideo('Redox Reactions — Crash Course L1', 'U-66N5u5Wbw'),
        ytVideo('Redox Reactions — Crash Course L2', 'y9K0PxbnEzA'),
        ytVideo('Redox Reactions — DPP 1', 'Dc5eSTfkclI', ['apply']),
        ytVideo('Redox Reactions — DPP 2', 'nPjM6SCJYAo', ['apply']),
        oneShotLecture('Redox Reactions — One Shot', 'g5EwjAaNhqs'),
        ytVideo('Equivalent Concept & N-factor', 'DJuPWr2X7_k'),
        ytVideo('Titration & Primary Standard Solution', 'QhgfhqPPbOw'),
    ],
    ch11_pblock: [oneShotLecture('p-Block (11) — One Shot', '8zT9gXplLBQ')],
    ch11_goc: [
        ytVideo('GOC — Basics of Organic (before GOC)', '-Y2tMcrhDxU'),
        ytVideo('GOC — IUPAC Naming', 'juJkhCprxy0'),
        ytVideo('GOC — Crash Course L1', 'RThlnLU2zMA'),
        ytVideo('GOC — Crash Course 2.1', 'g15a2bGGx10'),
        ytVideo('GOC — Crash Course 2.2', '_CsdX3HByew'),
        ytVideo('GOC — Crash Course L3', 'KmNGhqk4ew4'),
        ytVideo('GOC — Drawing Resonating Structures', 'dG3wjRQeuYw'),
        ytVideo('GOC — Rearrangement in Carbocations', 'O8nET7unnWM'),
        ytVideo('GOC — DPP 1', '7rnNFgtijiw', ['apply']),
        ytVideo('GOC — DPP 2', 'eEjQvsw-4tg', ['apply']),
        ytVideo('GOC — DPP 3', 'okfrmz5xpGs', ['apply']),
        ytVideo('GOC — DPP 4', 'OeKWfd1v0jQ', ['apply']),
        ytVideo('GOC — DPP 5', 'clI0KeT_h0c', ['apply']),
        oneShotLecture('GOC — One Shot', 'yg_xIkyGtxg'),
    ],
    ch11_hydrocarbon: [
        ytVideo('Hydrocarbons — Crash Course L1', 'izezV1oOg88'),
        ytVideo('Hydrocarbons — Crash Course L2', 'xU_IfAL0x14'),
        ytVideo('Hydrocarbons — DPP 1', 'PCNI19FUG5w', ['apply']),
        ytVideo('Hydrocarbons — DPP 2', 'yCgvotvl7GE', ['apply']),
        ytVideo('Hydrocarbons — DPP 3', '3EcsAlTtUIU', ['apply']),
        ytVideo('Hydrocarbons — DPP 4', 'BvyMbE1zshg', ['apply']),
    ],
    ch11_prac_org: [
        ytVideo('POC — Crash Course L1', '4Dj-XRvdcAk'),
        ytVideo('POC — Crash Course L2 (Part 1)', 'AWbrOiDFZ4E'),
        ytVideo('POC — Crash Course L2 (Part 2)', 'jm2yvtavhQ4'),
        oneShotLecture('Practical Organic — One Shot', '6_HOV4tkxwk'),
    ],
    // --- Class 12 ---
    ch12_solutions: [
        ytVideo('Solutions — Crash Course L1', 'QffwSl90ax8'),
        ytVideo('Solutions — Crash Course L2', 'tcHediJk-Ek'),
        oneShotLecture('Solutions — One Shot', 'Vb_6VKw7Yrw'),
    ],
    ch12_electrochem: [
        ytVideo('Electrochemistry — Crash Course L1', 'JELPbgL0va4'),
        ytVideo('Electrochemistry — Crash Course L2', '6v-VdC0QBUM'),
        ytVideo('Electrochemistry — Crash Course L3', 'u60yZjm8c5A'),
        oneShotLecture('Electrochemistry — One Shot', 'MiIJwC0LpaE'),
    ],
    ch12_kinetics: [oneShotLecture('Chemical Kinetics — One Shot', 'sYXMqIHGew8')],
    ch12_pblock: [
        oneShotLecture('p-Block (12) · N & O Family — One Shot', 'gpuuH89ZyGo'),
        oneShotLecture('p-Block (12) · Halogens & Noble Gases — One Shot', 'VEmatUp30r4'),
    ],
    ch12_coord: [oneShotLecture('Coordination Compounds — One Shot', 'uRPfNa5_RPk')],
    ch12_haloalkanes: [oneShotLecture('Haloalkanes, Alcohols & Ethers — One Shot', 'ZACn8YVBkGY')],
    ch12_alcohols: [oneShotLecture('Haloalkanes, Alcohols & Ethers — One Shot', 'ZACn8YVBkGY')],
    ch12_carbonyl: [oneShotLecture('Aldehydes, Ketones & Acids — One Shot', '4NqlPuJHves')],
    ch12_amines: [oneShotLecture('Amines — Key NCERT Reactions', 'eyWYnda7DL8')],
    ch12_biomolecules: [oneShotLecture('Biomolecules — One Shot', 'PnwNgp7HUeg')],
    // Chapters with no curated videos yet (d & f block, salt analysis, practical
    // physical) fall through to the auto class-hub lecture + NCERT notes +
    // Crucible practice links.
};

// --- research-backed weightage map ----------------------------------------
// JEE Main 5-year average chapter-wise weightage (PW data) + JEE Advanced
// 2026 projections (PW). `mainPct` is the headline number we display; `tier`
// is the resolved badge level. GOC is tagged High because of Advanced-only
// weight (6–8% vs 1.20% in Main).
//
// Sources:
//  - https://www.pw.live/iit-jee/exams/jee-main-chapter-wise-weightage
//  - https://www.pw.live/iit-jee/exams/jee-advanced-chemistry-chapter-wise-weightage
//  - https://www.esaral.com/jee/jee-main-chemistry-weightage/
export const WEIGHTAGE_MAP: Record<string, { mainPct: number; tier: WeightTier }> = {
    // Class 11 — Physical
    ch11_mole:       { mainPct: 2.82, tier: 'medium' },
    ch11_atom:       { mainPct: 3.34, tier: 'high' },
    ch11_thermo:     { mainPct: 3.65, tier: 'high' },   // + 6–8% Advanced
    ch11_chem_eq:    { mainPct: 4.44, tier: 'high' },   // PW reports combined "Equilibrium" 4.44%
    ch11_ionic_eq:   { mainPct: 4.44, tier: 'medium' },  // combined "Equilibrium" basket; per-teacher call: not a standout
    ch11_redox:      { mainPct: 1.75, tier: 'medium' },
    // Class 11 — Inorganic
    ch11_periodic:   { mainPct: 1.93, tier: 'high' },    // per-teacher call: foundational + quick to bank
    ch11_bonding:    { mainPct: 3.34, tier: 'high' },
    ch11_pblock:     { mainPct: 1.79, tier: 'medium' },
    // Class 11 — Organic
    ch11_goc:        { mainPct: 1.20, tier: 'high' },   // Main low, but Advanced 6–8% → tagged High
    ch11_hydrocarbon:{ mainPct: 3.03, tier: 'high' },
    // Class 11 — Practical
    ch11_prac_org:   { mainPct: 1.94, tier: 'high' },    // per-teacher call: practical paper carries reliable marks

    // Class 12 — Physical
    ch12_solutions:  { mainPct: 4.54, tier: 'medium' },  // per-teacher call: weighty but not a flame chip
    ch12_electrochem:{ mainPct: 3.30, tier: 'high' },
    ch12_kinetics:   { mainPct: 3.61, tier: 'high' },
    // Class 12 — Inorganic
    ch12_pblock:     { mainPct: 3.68, tier: 'high' },   // + 6–8% Advanced
    ch12_dblock:     { mainPct: 4.69, tier: 'high' },
    ch12_coord:      { mainPct: 5.33, tier: 'high' },
    // Class 12 — Organic
    ch12_haloalkanes:{ mainPct: 2.65, tier: 'medium' },
    ch12_alcohols:   { mainPct: 3.54, tier: 'high' },
    ch12_carbonyl:   { mainPct: 5.95, tier: 'high' },
    ch12_amines:     { mainPct: 4.40, tier: 'medium' },  // per-teacher call: weighty but not a flame chip
    ch12_biomolecules:{ mainPct: 3.99, tier: 'high' },
    // Class 12 — Practical
    ch12_salt:       { mainPct: 0.50, tier: 'low' },
    ch12_prac_phys:  { mainPct: 1.00, tier: 'low' },
};

// --- difficulty map -------------------------------------------------------
// User-curated chapter difficulty (Canvas Classes teaching team). Captures
// surface area + conceptual depth — NOT mere question hardness.
export const DIFFICULTY_MAP: Record<string, Difficulty> = {
    // Class 11
    ch11_mole: 'medium',
    ch11_atom: 'easy',
    ch11_thermo: 'medium',
    ch11_chem_eq: 'easy',
    ch11_ionic_eq: 'hard',
    ch11_redox: 'easy',
    ch11_periodic: 'easy',
    ch11_bonding: 'medium',
    ch11_pblock: 'easy',
    ch11_goc: 'hard',
    ch11_hydrocarbon: 'hard',
    ch11_prac_org: 'easy',
    // Class 12
    ch12_solutions: 'medium',
    ch12_electrochem: 'medium',
    ch12_kinetics: 'easy',
    ch12_pblock: 'medium',
    ch12_dblock: 'medium',
    ch12_coord: 'hard',
    ch12_haloalkanes: 'medium',
    ch12_alcohols: 'medium',
    ch12_carbonyl: 'hard',
    ch12_amines: 'easy',
    ch12_biomolecules: 'medium',
    ch12_salt: 'hard',
    ch12_prac_phys: 'medium',
};

// --- must-do derivation ---------------------------------------------------
// A chapter is "Must-do" if the time-vs-marks ROI is strongest:
//   (High weight  AND  difficulty != hard)   — big chapters you can bank
//   OR  (Core weight AND Easy difficulty)    — quick-win small chapters
export function isMustDo(weight: WeightTier, difficulty: Difficulty): boolean {
    if (weight === 'high' && difficulty !== 'hard') return true;
    if (weight === 'medium' && difficulty === 'easy') return true;
    return false;
}

// Fallback for any chapter NOT in WEIGHTAGE_MAP (defensive — e.g. taxonomy
// gains a chapter before the planner data is updated).
function fallbackWeight(c: { questionCount: number; starCount: number }): WeightTier {
    if (c.starCount >= 15 || c.questionCount >= 120) return 'high';
    if (c.starCount >= 6 || c.questionCount >= 50) return 'medium';
    return 'low';
}

// --- one-shot lecture map ------------------------------------------------
// Each entry is a single YouTube video that covers the entire chapter in
// one go (typically 30–90 min). Surfaces as a prominent "One-Shot Lecture"
// button on the chapter screen — especially important for Class 11 chapters
// used as prereq revision by Class 12 students.
//
// FORMAT: chapterId → { videoId, durationMin? }
// Populate over time as videos are produced; chapters not in the map simply
// don't show the button. Safe to grow incrementally.
export type OneShotEntry = { videoId: string; durationMin?: number };
export const ONE_SHOT_MAP: Record<string, OneShotEntry> = {
    // One-shot lectures now live in RESOURCE_MAP and play INLINE in the Resources
    // section. This map drives the optional prominent OneShotButton; left empty so
    // the one-shot isn't shown twice. Add an entry to re-enable the hero button.
};

// --- prerequisite map (Class 12 → Class 11) ------------------------------
// For each Class 12 chapter, the Class 11 chapters that lay its foundations.
// Shown as a "Revise alongside" callout above the chapter loop when a Class
// 12 student opens the chapter. Validated by Canvas Classes teaching team.
export const PREREQUISITE_MAP: Record<string, string[]> = {
    ch12_solutions: ['ch11_mole', 'ch11_chem_eq'],
    ch12_electrochem: ['ch11_redox', 'ch11_thermo'],
    ch12_kinetics: ['ch11_thermo', 'ch11_chem_eq'],
    ch12_pblock: ['ch11_pblock', 'ch11_periodic'],
    ch12_dblock: ['ch11_periodic', 'ch11_bonding'],
    ch12_coord: ['ch11_bonding', 'ch11_periodic'],
    ch12_haloalkanes: ['ch11_goc', 'ch11_hydrocarbon'],
    ch12_alcohols: ['ch11_goc', 'ch11_hydrocarbon'],
    ch12_carbonyl: ['ch11_goc'],
    ch12_amines: ['ch11_goc'],
    ch12_biomolecules: [],
    ch12_salt: ['ch11_prac_org'],
};

// --- mode + subject filter -----------------------------------------------
// Each planner mode shows a different chapter subset:
//  - class11: Class 11 chemistry only (physics/math in these modes is a future
//             extension — for v1 only Dropper carries physics/math)
//  - class12: Class 12 chemistry only (with prereq metadata attached)
//  - dropper: the active subject's chapters (Class 11 + 12)
import type { PlannerMode } from './lib/state';
export function filterCatalog(catalog: ChapterPlanItem[], mode: PlannerMode, subject: Subject): ChapterPlanItem[] {
    if (mode === 'class11') return catalog.filter((c) => c.subject === 'chemistry' && c.classLevel === 11);
    if (mode === 'class12') return catalog.filter((c) => c.subject === 'chemistry' && c.classLevel === 12);
    return catalog.filter((c) => c.subject === subject);
}

// Resolve the sidebar/dimension grouping label for a chapter. Physics/Maths read
// the shared chapterType→label maps (single source of truth, also used by the
// Crucible chapter list). Chemistry keeps its own `category` (the planner's
// chemistry rows come from buildChaptersWithCounts, which carries `category` but
// no `chapterType`).
function groupFor(subject: Subject, category: ChapterPlanItem['category'], chapterType?: string): string {
    if (subject === 'physics') return PHYSICS_GROUP_LABEL[chapterType ?? ''] ?? 'Physics';
    if (subject === 'math') return MATH_GROUP_LABEL[chapterType ?? ''] ?? 'Mathematics';
    return category;  // chemistry → Physical / Inorganic / Organic / Practical
}

// Source row for the builder. Chemistry comes from buildChaptersWithCounts()
// (no chapterType needed — its group is `category`); physics/math come from
// catalog.server.ts and carry the raw taxonomy chapterType for grouping.
export type PlannerSourceChapter = ChapterWithCounts & { chapterType?: string };

// --- builder --------------------------------------------------------------
// Merges the live chapter+counts data with the curated resource map and the
// always-on Crucible practice link. Server-side only (uses no browser APIs, but
// is called from the Server Component so the client gets plain serializable data).
//
// Chemistry chapters get curated resources + class-hub lecture/notes fallbacks +
// research-backed weightage/difficulty/days/prereqs. Physics & math chapters
// (v1) get only the always-on Crucible practice link plus BYO student resources;
// weightage falls back to question-count heuristics, difficulty defaults to
// medium, and there are no curated prereqs.
// `notesSlugMap` maps a chapter id → its slug on the Handwritten Notes page
// (/handwritten-notes/<slug>). Built server-side in page.tsx from the notes
// page's own chapter metadata (single source of truth), so as the founder
// updates that page the planner's notes links — and the content behind them —
// stay in sync. Chapters without a slug fall back to the notes index.
// `detailedMap` maps a chapter id → its chapter(s) on the Complete Chemistry
// Lectures page (pulled live in page.tsx). Drives the Class 11/12 "Detailed
// Lectures" + "PDF Notes" rows.
export function buildSubjectCatalog(
    chapters: PlannerSourceChapter[],
    subject: Subject,
    notesSlugMap: Record<string, string> = {},
    detailedMap: Record<string, DetailedLectureRef[]> = {},
    flashcardSlugMap: Record<string, string> = {}
): ChapterPlanItem[] {
    const isChem = subject === 'chemistry';
    return [...chapters]
        .sort((a, b) =>
            a.class_level - b.class_level || a.display_order - b.display_order || a.name.localeCompare(b.name)
        )
        .map((ch) => {
            // --- shared building blocks ---------------------------------------
            // Practice step — solve questions yourself on Crucible (topic-wise
            // browser; PYQ + non-PYQ).
            const crucible: PlannerResource = {
                label: 'Practice Questions on Crucible', kind: 'questions',
                href: `/the-crucible/${ch.id}?mode=browse`, steps: ['practice'],
            };
            // Revise step — flashcards (active recall) + a timed mock test.
            const mockTest: PlannerResource = {
                label: 'Mock Test on Crucible', kind: 'questions',
                href: `/the-crucible/${ch.id}?mode=test`, steps: ['revise'],
            };
            const flashcards: PlannerResource | null = isChem ? {
                label: 'Flashcards', kind: 'flashcards',
                href: flashcardSlugMap[ch.id] ? `/chemistry-flashcards/${flashcardSlugMap[ch.id]}` : '/chemistry-flashcards',
                steps: ['revise'],
            } : null;
            // Handwritten Notes — deep-linked per chapter (chemistry only).
            const handwritten: PlannerResource | null = isChem ? {
                label: 'Handwritten Notes', kind: 'notes',
                href: notesSlugMap[ch.id] ? `/handwritten-notes/${notesSlugMap[ch.id]}` : '/handwritten-notes',
                steps: ['learn'],
            } : null;
            // Concise videos (crash courses + DPP + "Revise in 15 min") from the
            // curated RESOURCE_MAP. Lecture-kind = crash/revise; solve-kind = DPP.
            const concise: PlannerResource[] = isChem
                ? (RESOURCE_MAP[ch.id] ?? []).map((r) => ({ ...r, steps: r.steps ?? defaultStepsForKind(r.kind) }))
                : [];
            const conciseLectures = concise.filter((r) => r.steps.includes('learn'));
            // One-shot revision videos — surfaced in every batch.
            const oneShots = concise.filter((r) => r.oneShot);
            // Detailed Lectures + PDF Notes from the lectures page; falls back to
            // the class chemistry hub when a chapter isn't on that page yet.
            const detailedRefs = isChem ? (detailedMap[ch.id] ?? []) : [];
            const detailed: PlannerResource[] = [];
            if (isChem) {
                if (detailedRefs.length) {
                    for (const r of detailedRefs) {
                        const multi = detailedRefs.length > 1;
                        detailed.push({
                            label: multi ? `Detailed Lectures · ${r.name} (${r.videoCount})` : `Detailed Lectures · ${r.videoCount} videos`,
                            kind: 'lecture', href: `/detailed-lectures/${r.slug}`, steps: ['learn'],
                        });
                        if (r.notesLink) {
                            detailed.push({
                                label: multi ? `PDF Notes for Detailed Lectures · ${r.name}` : 'PDF Notes for Detailed Lectures',
                                kind: 'notes', href: r.notesLink, steps: ['learn'],
                            });
                        }
                    }
                } else {
                    const classHub = ch.class_level === 12 ? '/class-12/chemistry' : '/class-11/chemistry';
                    detailed.push({ label: `Class ${ch.class_level} Chemistry Lectures`, kind: 'lecture', href: classHub, steps: ['learn'] });
                }
            }

            // --- per-mode resource lists --------------------------------------
            const class11: PlannerResource[] = [];
            const class12: PlannerResource[] = [];
            const dropper: PlannerResource[] = [];
            if (isChem) {
                // Class 11 — detailed lectures + the one-shot (for quick revision).
                class11.push(...detailed, ...oneShots);
                // Class 12 — detailed + one-shot for its own (Class 12) chapters;
                // crash courses (which already include the one-shot) for Class 11
                // prereq chapters opened from the callout.
                if (ch.class_level === 12) class12.push(...detailed, ...oneShots);
                else class12.push(...(conciseLectures.length ? conciseLectures : detailed));
                // Dropper — crash courses + DPP + one-shot (falls back to just
                // notes + practice when those videos aren't uploaded yet).
                dropper.push(...concise);
                for (const list of [class11, class12, dropper]) {
                    if (handwritten) list.push(handwritten);     // Learn
                    list.push(crucible);                          // Practice
                    if (flashcards) list.push(flashcards);        // Revise
                    list.push(mockTest);                          // Revise
                }
            } else {
                // Physics/Math (Dropper only) — Crucible practice + mock test
                // (+ student-added resources).
                for (const list of [class11, class12, dropper]) {
                    list.push(crucible);
                    list.push(mockTest);
                }
            }
            const resourcesByMode: Record<PlannerMode, PlannerResource[]> = { class11, class12, dropper };

            const weightEntry = isChem ? WEIGHTAGE_MAP[ch.id] : undefined;
            const weight: WeightTier = weightEntry
                ? weightEntry.tier
                : fallbackWeight({ questionCount: ch.question_count, starCount: ch.star_question_count });
            const weightagePct = weightEntry?.mainPct ?? 0;
            const difficulty: Difficulty = (isChem ? DIFFICULTY_MAP[ch.id] : undefined) ?? 'medium';
            const mustDo = isMustDo(weight, difficulty);

            const oneShot = ONE_SHOT_MAP[ch.id];
            const prerequisites = isChem ? (PREREQUISITE_MAP[ch.id] ?? []) : [];
            return {
                chapterId: ch.id,
                name: ch.name,
                subject,
                category: ch.category,
                group: groupFor(subject, ch.category, ch.chapterType),
                classLevel: (ch.class_level === 12 ? 12 : 11) as 11 | 12,
                sequence: ch.display_order,
                weight,
                highYield: weight === 'high',
                weightagePct,
                difficulty,
                mustDo,
                daysNeeded: CHAPTER_DAYS_MAP[ch.id] ?? CHAPTER_DAYS_DEFAULT,
                questionCount: ch.question_count,
                starCount: ch.star_question_count,
                resourcesByMode,
                oneShotVideoId: oneShot?.videoId,
                oneShotDurationMin: oneShot?.durationMin,
                prerequisites,
            };
        });
}

// Back-compat alias — chemistry-only callers.
export function buildChemistryCatalog(chapters: ChapterWithCounts[]): ChapterPlanItem[] {
    return buildSubjectCatalog(chapters, 'chemistry');
}

function defaultStepsForKind(kind: ResourceKind): LoopStep[] {
    switch (kind) {
        case 'lecture':
        case 'notes':
            return ['learn'];
        case 'questions':
            return ['practice'];
        case 'flashcards':
            return ['revise'];
        case 'tool':
            return ['learn'];
    }
}

// --- id helpers (completion units) ---------------------------------------
export const stepId = (chapterId: string, step: LoopStep) => `${chapterId}:${step}`;
export const customModuleId = (chapterId: string, id: string) => `${chapterId}#custom:${id}`;
