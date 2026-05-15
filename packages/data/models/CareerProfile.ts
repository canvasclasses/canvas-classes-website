import mongoose, { Schema } from 'mongoose';

// A CareerProfile is one student's pass through the questionnaire.
// Anonymous sessions are allowed (user_id is optional) so we can surface
// the tool to logged-out visitors; when they save results we require signup.

export type ProfileStatus = 'in_progress' | 'completed';

export interface IProfileResponse {
  question_id: string;
  option_id?: string;
  /** Free-form payload for rank / slider formats. */
  value?: unknown;
  answered_at: Date;
}

export interface ICareerProfileConstraints {
  financial_capacity?: 1 | 2 | 3 | 4 | 5;
  loan_ok?: boolean;
  geo_flex?: 'metro' | 'tier2' | 'hometown' | 'anywhere';
  international?: 'settle_abroad' | 'work_return' | 'india_only' | 'unsure';
  language_comfort?: 'en_native' | 'en_good' | 'en_developing';
  stream?: 'PCM' | 'PCB' | 'PCMB' | 'Commerce' | 'Arts' | 'Undecided';
  academic_band?: 'top' | 'strong' | 'average' | 'struggling';
  time_horizon?: 'short' | 'medium' | 'long';
  family_pressure?: 1 | 2 | 3 | 4 | 5;
  special_circumstances?: string;
}

export interface ICareerProfileScores {
  aptitude: Record<string, number>;
  interest: Record<string, number>;
  work_style: Record<string, number>;
  values: Record<string, number>;
  future: Record<string, number>;
}

export interface ICareerProfile {
  _id: string;                          // uuid
  user_id?: string;                     // supabase id (null for anon)
  meta: {
    name?: string;
    email?: string;
    class_level?: '9' | '10' | '11' | '12' | 'ug' | 'pg' | 'other';
  };
  responses: IProfileResponse[];
  scores: ICareerProfileScores;
  constraints: ICareerProfileConstraints;
  status: ProfileStatus;
  progress_pct: number;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

const ResponseSchema = new Schema<IProfileResponse>(
  {
    question_id: { type: String, required: true },
    option_id: String,
    value: Schema.Types.Mixed,
    answered_at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const CareerProfileSchema = new Schema<ICareerProfile>(
  {
    _id: { type: String, required: true },
    user_id: { type: String, index: true },
    meta: {
      name: String,
      email: String,
      class_level: { type: String, enum: ['9', '10', '11', '12', 'ug', 'pg', 'other'] },
    },
    responses: { type: [ResponseSchema], default: [] },
    scores: {
      aptitude: { type: Schema.Types.Mixed, default: {} },
      interest: { type: Schema.Types.Mixed, default: {} },
      work_style: { type: Schema.Types.Mixed, default: {} },
      values: { type: Schema.Types.Mixed, default: {} },
      future: { type: Schema.Types.Mixed, default: {} },
    },
    constraints: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
    progress_pct: { type: Number, default: 0, min: 0, max: 100 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    completed_at: Date,
  },
  { timestamps: false, collection: 'career_profiles', optimisticConcurrency: true },
);

CareerProfileSchema.index({ user_id: 1, created_at: -1 });
CareerProfileSchema.index({ status: 1, updated_at: -1 });

CareerProfileSchema.pre('save', async function () {
  (this as ICareerProfile).updated_at = new Date();
});

export const CareerProfile =
  mongoose.models.CareerProfile ||
  mongoose.model<ICareerProfile>('CareerProfile', CareerProfileSchema);
