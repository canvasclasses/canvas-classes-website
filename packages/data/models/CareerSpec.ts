import 'server-only';
import mongoose, { Schema } from 'mongoose';

// ============================================================================
// CareerSpec — the editorial Career Live Spec.
//
// This is the V1 career-guide model. ONE document = ONE career, written as an
// honest editorial brief about what that career actually is in 2026, not what
// it was 10 years ago. Built parallel to CareerPath (the older quiz-matcher
// taxonomy) because the shapes are genuinely different:
//
//   CareerPath  → 60+ fields of 1-5 ratings, drives the RIASEC quiz matcher.
//   CareerSpec  → prose-heavy structured fields, income distributions, AI
//                 exposure with explicit confidence levels, refresh metadata.
//
// Linked-but-separate. A CareerSpec can reference a CareerPath via the
// `linked_career_path_slug` field when there's overlap (so a future career
// shortlist generator can leverage both).
//
// Editorial honesty primitives baked into the schema:
//   - Every income / AI-exposure field carries a date or confidence level.
//   - `cons` is required. No spec is publishable without naming downsides.
//   - `next_review_due` makes the refresh cadence a data property, not an aspiration.
//   - `adjacent_careers` forces every spec to admit "this might not work out — here are exits."
//
// Read the V1 strategy doc before editing this file: _agents/plans/CAREER_LIVE_SPEC_V1.md
// (to be written next pass). When that doc conflicts with this file, the doc wins.
// ============================================================================

// ── Shared enum types ───────────────────────────────────────────────────────
export type CareerCategory = 'engineering' | 'medical' | 'crossover';
export type CareerArchetype = 'transforming' | 'emerging' | 'traditional';
export type ExposureLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type Confidence = 'low' | 'medium' | 'high';
export type CollegeTier = 'top_iit' | 'top_nit' | 'mid_nit' | 'iiit' | 'private' | 'state';
export type SourceType = 'salary' | 'job_market' | 'ai_exposure' | 'career_path' | 'editorial';
export type FeasibilityLevel = 'low' | 'medium' | 'high';
export type IncomeModifier = 'lower' | 'similar' | 'higher' | 'much_higher';
export type CareerStatus = 'draft' | 'published' | 'archived';

// ── Composable sub-schemas (typed for use inside the main interface) ────────

export interface ISourceRef {
  type: SourceType;
  label: string;
  url?: string;
  accessed_date: string; // YYYY-MM-DD
}

export interface IIncomeBand {
  p25: number;    // 25th percentile, INR LPA
  median: number; // 50th percentile, INR LPA
  p75: number;    // 75th percentile, INR LPA
}

export interface IIncomeDistribution {
  year_1: IIncomeBand;
  year_5: IIncomeBand;
  year_10: IIncomeBand;
  notes: string;             // "Top quartile heavily skewed by big-tech / startup ESOPs"
  sources: ISourceRef[];
  last_updated: string;      // YYYY-MM — when these numbers were last refreshed
}

export interface ISubPath {
  name: string;                              // 'Backend product engineer'
  description: string;
  ai_exposure_5y: ExposureLevel;
  income_vs_median: IncomeModifier;          // Relative to the career's overall median
}

export interface IAiExposureHorizon {
  level: ExposureLevel;
  confidence: Confidence;
}

export interface IAiExposure {
  horizon_1y: IAiExposureHorizon;
  horizon_5y: IAiExposureHorizon;
  horizon_10y: IAiExposureHorizon;
  summary: string;                  // 2-3 sentence narrative
  what_doesnt_compress: string[];   // The AI-resistant moat tasks
  sources: ISourceRef[];
}

export interface IMoatSkill {
  skill: string;
  why_it_matters: string;
  how_to_build_in_college: string;  // Concrete 4-year action
}

export interface ITargetColleges {
  stretch: string[];     // Top-tier targets — e.g. ['IIT Bombay CSE', 'IIT Delhi CSE']
  realistic: string[];   // Mid-tier — e.g. ['NIT Warangal CSE', 'IIIT Hyderabad']
  accessible: string[];  // Most students can reach — GFTI, state engg
}

export interface IEducationalPath {
  primary_degrees: string[];        // ['B.Tech CSE', 'B.Tech AI']
  alternative_degrees: string[];    // Non-obvious paths in
  target_colleges: ITargetColleges;
  minimum_viable_path: string;      // Cheapest path that actually works
  what_to_do_in_college: string[];  // 4-6 concrete actions
  time_to_first_real_income: number; // years from end of class 12
}

export interface IConItem {
  issue: string;            // One-line
  explanation: string;      // 2-3 sentences
}

export interface IIndiaContext {
  geographic_concentration: string;             // "Bangalore + Hyderabad + Pune dominate"
  remote_work_feasibility: FeasibilityLevel;
  english_requirement: FeasibilityLevel;
  family_capital_required: FeasibilityLevel;
  typical_first_job_city: string[];
}

export interface IAdjacentCareer {
  career_slug: string;                  // Links to another spec's `slug`
  why_its_a_natural_pivot: string;
}

export interface IExamplePath {
  college_tier: CollegeTier;
  college_to_first_job: string;         // What they did during college that mattered
  where_now: string;                    // Anonymised: "Senior MLE at India FAANG, 5 yr exp"
  income_range: string;                 // "₹35-50 LPA"
  one_decision_that_mattered: string;
}

// ── Main interface ──────────────────────────────────────────────────────────

export interface ICareerSpec {
  _id: string;                          // UUID v4
  slug: string;                         // URL slug, e.g. 'software-engineer-product'
  display_name: string;                 // 'Software engineer — product track'
  category: CareerCategory;
  archetype: CareerArchetype;

  /** Optional link to the older CareerPath taxonomy when there's an overlap. */
  linked_career_path_slug?: string;

  // ── 1. What it actually is ────────────────────────────────────────────
  one_line: string;                     // 12 words max — card hover / list view
  what_it_is_today: string;             // Paragraph — 2026 reality
  what_parents_think_it_is: string;     // The misconception to dismantle
  common_misconceptions: string[];      // 3-5 short bullets

  // ── 2. Income ────────────────────────────────────────────────────────
  income: IIncomeDistribution;

  // ── 3. Sub-paths within this career ──────────────────────────────────
  sub_paths: ISubPath[];

  // ── 4. AI exposure ────────────────────────────────────────────────────
  ai_exposure: IAiExposure;

  // ── 5. Moat skills ────────────────────────────────────────────────────
  moat_skills: IMoatSkill[];

  // ── 6. Educational path ──────────────────────────────────────────────
  educational_path: IEducationalPath;

  // ── 7. Honest cons (REQUIRED — schema enforces non-empty) ────────────
  cons: IConItem[];

  // ── 8. India context ─────────────────────────────────────────────────
  india_context: IIndiaContext;

  // ── 9. Exit ramps ─────────────────────────────────────────────────────
  adjacent_careers: IAdjacentCareer[];

  // ── 10. Real example paths ───────────────────────────────────────────
  example_paths: IExamplePath[];

  // ── 11. Editorial trust ──────────────────────────────────────────────
  sources: ISourceRef[];                // Spec-level sources (separate from per-section ones)
  authors: string[];                    // Admin emails who reviewed
  last_full_review: string;             // YYYY-MM
  next_review_due: string;              // YYYY-MM (typically last + 3 months)

  // ── 12. Lifecycle ─────────────────────────────────────────────────────
  status: CareerStatus;
  published_at?: Date;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  deleted_at?: Date;
  deleted_by?: string;
  version: number;
}

// ── Mongoose sub-schemas ────────────────────────────────────────────────────

const SourceRefSchema = new Schema<ISourceRef>(
  {
    type: { type: String, enum: ['salary', 'job_market', 'ai_exposure', 'career_path', 'editorial'], required: true },
    label: { type: String, required: true },
    url: { type: String },
    accessed_date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  },
  { _id: false },
);

const IncomeBandSchema = new Schema<IIncomeBand>(
  {
    p25: { type: Number, required: true, min: 0 },
    median: { type: Number, required: true, min: 0 },
    p75: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const IncomeDistributionSchema = new Schema<IIncomeDistribution>(
  {
    year_1: { type: IncomeBandSchema, required: true },
    year_5: { type: IncomeBandSchema, required: true },
    year_10: { type: IncomeBandSchema, required: true },
    notes: { type: String, required: true },
    sources: { type: [SourceRefSchema], default: [] },
    last_updated: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
  },
  { _id: false },
);

const SubPathSchema = new Schema<ISubPath>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ai_exposure_5y: { type: String, enum: ['low', 'moderate', 'high', 'very_high'], required: true },
    income_vs_median: { type: String, enum: ['lower', 'similar', 'higher', 'much_higher'], required: true },
  },
  { _id: false },
);

const AiExposureHorizonSchema = new Schema<IAiExposureHorizon>(
  {
    level: { type: String, enum: ['low', 'moderate', 'high', 'very_high'], required: true },
    confidence: { type: String, enum: ['low', 'medium', 'high'], required: true },
  },
  { _id: false },
);

const AiExposureSchema = new Schema<IAiExposure>(
  {
    horizon_1y: { type: AiExposureHorizonSchema, required: true },
    horizon_5y: { type: AiExposureHorizonSchema, required: true },
    horizon_10y: { type: AiExposureHorizonSchema, required: true },
    summary: { type: String, required: true },
    what_doesnt_compress: { type: [String], default: [] },
    sources: { type: [SourceRefSchema], default: [] },
  },
  { _id: false },
);

const MoatSkillSchema = new Schema<IMoatSkill>(
  {
    skill: { type: String, required: true },
    why_it_matters: { type: String, required: true },
    how_to_build_in_college: { type: String, required: true },
  },
  { _id: false },
);

const TargetCollegesSchema = new Schema<ITargetColleges>(
  {
    stretch: { type: [String], default: [] },
    realistic: { type: [String], default: [] },
    accessible: { type: [String], default: [] },
  },
  { _id: false },
);

const EducationalPathSchema = new Schema<IEducationalPath>(
  {
    primary_degrees: { type: [String], required: true },
    alternative_degrees: { type: [String], default: [] },
    target_colleges: { type: TargetCollegesSchema, required: true },
    minimum_viable_path: { type: String, required: true },
    what_to_do_in_college: { type: [String], required: true },
    time_to_first_real_income: { type: Number, required: true, min: 0, max: 15 },
  },
  { _id: false },
);

const ConItemSchema = new Schema<IConItem>(
  {
    issue: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false },
);

const IndiaContextSchema = new Schema<IIndiaContext>(
  {
    geographic_concentration: { type: String, required: true },
    remote_work_feasibility: { type: String, enum: ['low', 'medium', 'high'], required: true },
    english_requirement: { type: String, enum: ['low', 'medium', 'high'], required: true },
    family_capital_required: { type: String, enum: ['low', 'medium', 'high'], required: true },
    typical_first_job_city: { type: [String], default: [] },
  },
  { _id: false },
);

const AdjacentCareerSchema = new Schema<IAdjacentCareer>(
  {
    career_slug: { type: String, required: true },
    why_its_a_natural_pivot: { type: String, required: true },
  },
  { _id: false },
);

const ExamplePathSchema = new Schema<IExamplePath>(
  {
    college_tier: {
      type: String,
      enum: ['top_iit', 'top_nit', 'mid_nit', 'iiit', 'private', 'state'],
      required: true,
    },
    college_to_first_job: { type: String, required: true },
    where_now: { type: String, required: true },
    income_range: { type: String, required: true },
    one_decision_that_mattered: { type: String, required: true },
  },
  { _id: false },
);

// ── Top-level schema ────────────────────────────────────────────────────────

const CareerSpecSchema = new Schema<ICareerSpec>(
  {
    _id: { type: String, required: true }, // UUID v4 — generated by the API at create time
    slug: {
      type: String,
      required: true,
      // Kebab-case, 2-60 chars. Used in URLs: /career-guide/[slug].
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      minlength: 2,
      maxlength: 60,
    },
    display_name: { type: String, required: true, minlength: 3, maxlength: 80 },
    category: { type: String, enum: ['engineering', 'medical', 'crossover'], required: true },
    archetype: { type: String, enum: ['transforming', 'emerging', 'traditional'], required: true },

    linked_career_path_slug: { type: String },

    one_line: { type: String, required: true, maxlength: 140 },
    what_it_is_today: { type: String, required: true },
    what_parents_think_it_is: { type: String, required: true },
    common_misconceptions: { type: [String], default: [] },

    income: { type: IncomeDistributionSchema, required: true },
    sub_paths: { type: [SubPathSchema], default: [] },
    ai_exposure: { type: AiExposureSchema, required: true },
    moat_skills: { type: [MoatSkillSchema], required: true, validate: { validator: (v: unknown[]) => v.length > 0, message: 'At least one moat skill is required.' } },
    educational_path: { type: EducationalPathSchema, required: true },

    // Cons is REQUIRED + must be non-empty. The schema enforces editorial honesty:
    // you cannot publish a spec without naming at least one downside.
    cons: {
      type: [ConItemSchema],
      required: true,
      validate: { validator: (v: unknown[]) => v.length > 0, message: 'At least one con is required — every career has downsides.' },
    },

    india_context: { type: IndiaContextSchema, required: true },
    adjacent_careers: { type: [AdjacentCareerSchema], default: [] },
    example_paths: { type: [ExamplePathSchema], default: [] },

    sources: { type: [SourceRefSchema], default: [] },
    authors: { type: [String], default: [] },
    last_full_review: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
    next_review_due: { type: String, required: true, match: /^\d{4}-\d{2}$/ },

    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    published_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, required: true },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String, required: true },
    deleted_at: { type: Date },
    deleted_by: { type: String },
    version: { type: Number, default: 1 },
  },
  {
    timestamps: false,                   // Manual timestamps (mirrors Question.v2 pattern)
    collection: 'career_specs',
    optimisticConcurrency: true,
  },
);

// ── Indexes ────────────────────────────────────────────────────────────────
// Pattern mirrors Question.v2: include deleted_at in compound indexes so the
// ubiquitous `deleted_at: null` filter is covered.
CareerSpecSchema.index({ slug: 1 }, { unique: true });
CareerSpecSchema.index({ status: 1, deleted_at: 1 });
CareerSpecSchema.index({ category: 1, status: 1, deleted_at: 1 });
CareerSpecSchema.index({ archetype: 1, status: 1, deleted_at: 1 });
CareerSpecSchema.index({ next_review_due: 1, status: 1 }); // For "what's due for review" admin queries

// ── Pre-save: bump updated_at + version on every write ─────────────────────
CareerSpecSchema.pre('save', function () {
  this.updated_at = new Date();
  if (this.isModified() && !this.isNew) {
    this.version = (this.version || 1) + 1;
  }
});

export const CareerSpec =
  mongoose.models.CareerSpec || mongoose.model<ICareerSpec>('CareerSpec', CareerSpecSchema);
