import mongoose, { Schema } from 'mongoose';

// Career taxonomy for the Career Explorer module.
// _id is a URL slug (e.g. "software-engineer") so deep-dive pages stay clean.
// The 9-layer structure mirrors the design doc and is the single source of
// truth for matching. Fields are optional where the editorial team hasn't
// filled them yet — the matcher reads defensively.

export type RIASEC = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export type TrendArrow = 'declining' | 'flat' | 'growing' | 'exploding';
export type SupplyState = 'oversaturated' | 'balanced' | 'undersupplied';
export type TravelFreq = 'none' | 'occasional' | 'frequent' | 'constant';
export type WorkHoursShape = 'standard' | 'long' | 'shift' | 'flexible';
export type Stream = 'PCM' | 'PCB' | 'PCMB' | 'Commerce' | 'Arts' | 'Any';

export interface ICareerPath {
  _id: string;                          // slug
  name: string;
  family: string;                       // "Technology → Software"
  one_liner: string;
  typical_titles?: string[];

  // Layer 2 — Aptitude & Interest
  riasec_primary: RIASEC;
  riasec_secondary?: RIASEC[];
  cognitive_styles: string[];           // top 3 facet keys from Dimension A
  hard_filters?: {
    min_numerical?: 1 | 2 | 3 | 4 | 5;
    min_verbal?: 1 | 2 | 3 | 4 | 5;
    min_logical?: 1 | 2 | 3 | 4 | 5;
    min_interpersonal?: 1 | 2 | 3 | 4 | 5;
  };

  // Layer 3 — Work Reality (0 = fully left, 100 = fully right)
  indoor_outdoor: number;               // 0 indoor, 100 outdoor
  desk_field: number;                   // 0 desk, 100 field
  solo_team: number;                    // 0 solo, 100 team
  communication_intensity: 1 | 2 | 3 | 4 | 5;
  public_facing: 1 | 2 | 3 | 4 | 5;
  travel: TravelFreq;
  work_hours: WorkHoursShape;
  physical_demand: 1 | 2 | 3 | 4 | 5;
  stress_profile?: string;

  // Layer 4 — Economic (₹ lakhs unless noted)
  education_cost: {
    govt_inr_lakh?: [number, number];
    private_inr_lakh?: [number, number];
    premium_inr_lakh?: [number, number];
  };
  education_duration_years: number;
  entry_salary_inr_lpa: [number, number];
  mid_salary_inr_lpa: [number, number];
  top_salary_inr_lpa?: [number, number];
  roi_timeline_years?: number;
  scholarship_availability?: 1 | 2 | 3 | 4 | 5;
  loan_worthiness?: 1 | 2 | 3 | 4 | 5;

  // Layer 5 — Geographic & Mobility
  india_market_depth: 1 | 2 | 3 | 4 | 5;
  metro_concentration: 1 | 2 | 3 | 4 | 5;
  international_mobility: 1 | 2 | 3 | 4 | 5;
  top_destinations?: string[];
  licensing_portability?: 'easy' | 'moderate' | 'hard';
  remote_feasibility: 1 | 2 | 3 | 4 | 5;
  immigration_pathway?: 1 | 2 | 3 | 4 | 5;

  // Layer 6 — Future-Proofness (THE MOAT, annual refresh)
  automation_vulnerability: 1 | 2 | 3 | 4 | 5;     // 5 = highly vulnerable
  demand_trajectory: TrendArrow;
  supply_saturation: SupplyState;
  emerging_score: 1 | 2 | 3 | 4 | 5;               // 5 = bleeding edge
  hidden_gem: boolean;
  ten_year_outlook?: string;
  disruption_risks?: string[];
  adjacent_pivots?: string[];
  last_future_review?: Date;

  // Layer 7 — Educational pathway
  required_stream: Stream[];
  entrance_exams?: string[];
  degree_paths?: string[];
  certifications?: string[];
  min_qualification?: string;
  alternative_paths?: string[];
  /** School subjects that feed into this career — lets students browse by strength. */
  school_subjects?: string[];
  /** Evergreen human-need sector (Food, Shelter, Health Care, etc.) used for reassurance framing. */
  evergreen_sector?: string;

  // Layer 8 — Lifestyle
  job_stability: 1 | 2 | 3 | 4 | 5;
  work_life_balance: 1 | 2 | 3 | 4 | 5;
  social_prestige_india: 1 | 2 | 3 | 4 | 5;
  autonomy: 1 | 2 | 3 | 4 | 5;
  creative_expression: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;

  // Layer 9 — Human texture
  day_in_life?: string;
  misconceptions?: string[];
  what_people_love?: string[];
  burnout_triggers?: string[];
  role_models?: string[];
  resource_links?: Array<{ label: string; url: string }>;

  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const CareerPathSchema = new Schema<ICareerPath>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    family: { type: String, required: true },
    one_liner: { type: String, required: true },
    typical_titles: [{ type: String }],

    riasec_primary: { type: String, enum: ['R', 'I', 'A', 'S', 'E', 'C'], required: true },
    riasec_secondary: [{ type: String, enum: ['R', 'I', 'A', 'S', 'E', 'C'] }],
    cognitive_styles: [{ type: String }],
    hard_filters: {
      min_numerical: Number,
      min_verbal: Number,
      min_logical: Number,
      min_interpersonal: Number,
    },

    indoor_outdoor: { type: Number, required: true, min: 0, max: 100 },
    desk_field: { type: Number, required: true, min: 0, max: 100 },
    solo_team: { type: Number, required: true, min: 0, max: 100 },
    communication_intensity: { type: Number, required: true, min: 1, max: 5 },
    public_facing: { type: Number, required: true, min: 1, max: 5 },
    travel: { type: String, enum: ['none', 'occasional', 'frequent', 'constant'], required: true },
    work_hours: { type: String, enum: ['standard', 'long', 'shift', 'flexible'], required: true },
    physical_demand: { type: Number, required: true, min: 1, max: 5 },
    stress_profile: String,

    education_cost: {
      govt_inr_lakh: [Number],
      private_inr_lakh: [Number],
      premium_inr_lakh: [Number],
    },
    education_duration_years: { type: Number, required: true },
    entry_salary_inr_lpa: { type: [Number], required: true },
    mid_salary_inr_lpa: { type: [Number], required: true },
    top_salary_inr_lpa: [Number],
    roi_timeline_years: Number,
    scholarship_availability: { type: Number, min: 1, max: 5 },
    loan_worthiness: { type: Number, min: 1, max: 5 },

    india_market_depth: { type: Number, required: true, min: 1, max: 5 },
    metro_concentration: { type: Number, required: true, min: 1, max: 5 },
    international_mobility: { type: Number, required: true, min: 1, max: 5 },
    top_destinations: [String],
    licensing_portability: { type: String, enum: ['easy', 'moderate', 'hard'] },
    remote_feasibility: { type: Number, required: true, min: 1, max: 5 },
    immigration_pathway: { type: Number, min: 1, max: 5 },

    automation_vulnerability: { type: Number, required: true, min: 1, max: 5 },
    demand_trajectory: { type: String, enum: ['declining', 'flat', 'growing', 'exploding'], required: true },
    supply_saturation: { type: String, enum: ['oversaturated', 'balanced', 'undersupplied'], required: true },
    emerging_score: { type: Number, required: true, min: 1, max: 5 },
    hidden_gem: { type: Boolean, default: false },
    ten_year_outlook: String,
    disruption_risks: [String],
    adjacent_pivots: [String],
    last_future_review: Date,

    required_stream: [{ type: String, enum: ['PCM', 'PCB', 'PCMB', 'Commerce', 'Arts', 'Any'] }],
    entrance_exams: [String],
    degree_paths: [String],
    certifications: [String],
    min_qualification: String,
    alternative_paths: [String],
    school_subjects: [String],
    evergreen_sector: String,

    job_stability: { type: Number, required: true, min: 1, max: 5 },
    work_life_balance: { type: Number, required: true, min: 1, max: 5 },
    social_prestige_india: { type: Number, required: true, min: 1, max: 5 },
    autonomy: { type: Number, required: true, min: 1, max: 5 },
    creative_expression: { type: Number, required: true, min: 1, max: 5 },
    impact: { type: Number, required: true, min: 1, max: 5 },

    day_in_life: String,
    misconceptions: [String],
    what_people_love: [String],
    burnout_triggers: [String],
    role_models: [String],
    resource_links: [{ label: String, url: String }],

    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: false, collection: 'career_paths', optimisticConcurrency: true },
);

CareerPathSchema.index({ family: 1 });
CareerPathSchema.index({ hidden_gem: 1 });
CareerPathSchema.index({ riasec_primary: 1 });
CareerPathSchema.index({ required_stream: 1 });
CareerPathSchema.index({ school_subjects: 1 });
CareerPathSchema.index({ evergreen_sector: 1 });

CareerPathSchema.pre('save', async function () {
  (this as ICareerPath).updated_at = new Date();
});

export const CareerPath =
  mongoose.models.CareerPath || mongoose.model<ICareerPath>('CareerPath', CareerPathSchema);
