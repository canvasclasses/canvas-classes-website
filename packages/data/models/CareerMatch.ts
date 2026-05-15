import mongoose, { Schema } from 'mongoose';

// CareerMatch stores one computed match for (profile, career). One row per
// career evaluated, not just the top results — keeping the fuller picture
// lets admin override buckets and lets us build a feedback loop later.

export type MatchBucket = 'strong_fit' | 'hidden_gem' | 'stretch' | 'excluded';

export interface IMatchBreakdown {
  aptitude: number;
  interest: number;
  work_style: number;
  values: number;
  future: number;
  economic: number;
}

export interface ICareerMatch {
  _id: string;                          // uuid
  profile_id: string;
  career_id: string;                    // slug
  computed_score: number;               // 0..100
  computed_bucket: MatchBucket;
  computed_breakdown: IMatchBreakdown;
  /** Reasons the career was hard-filtered (only set when excluded). */
  exclusion_reasons?: string[];
  admin_override?: {
    bucket: MatchBucket;
    note?: string;
    by: string;                         // admin email
    at: Date;
  };
  user_feedback?: {
    rating?: 1 | 2 | 3 | 4 | 5;
    saved?: boolean;
    note?: string;
    updated_at: Date;
  };
  created_at: Date;
  updated_at: Date;
}

const CareerMatchSchema = new Schema<ICareerMatch>(
  {
    _id: { type: String, required: true },
    profile_id: { type: String, required: true, index: true },
    career_id: { type: String, required: true, index: true },
    computed_score: { type: Number, required: true, min: 0, max: 100 },
    computed_bucket: {
      type: String,
      enum: ['strong_fit', 'hidden_gem', 'stretch', 'excluded'],
      required: true,
    },
    computed_breakdown: {
      aptitude: Number,
      interest: Number,
      work_style: Number,
      values: Number,
      future: Number,
      economic: Number,
    },
    exclusion_reasons: [String],
    admin_override: {
      bucket: { type: String, enum: ['strong_fit', 'hidden_gem', 'stretch', 'excluded'] },
      note: String,
      by: String,
      at: Date,
    },
    user_feedback: {
      rating: { type: Number, min: 1, max: 5 },
      saved: Boolean,
      note: String,
      updated_at: Date,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: false, collection: 'career_matches', optimisticConcurrency: true },
);

CareerMatchSchema.index({ profile_id: 1, computed_score: -1 });
CareerMatchSchema.index({ profile_id: 1, computed_bucket: 1 });

CareerMatchSchema.pre('save', async function () {
  (this as ICareerMatch).updated_at = new Date();
});

export const CareerMatch =
  mongoose.models.CareerMatch || mongoose.model<ICareerMatch>('CareerMatch', CareerMatchSchema);
