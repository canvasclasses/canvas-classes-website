import mongoose, { Schema } from 'mongoose';

// ============================================
// COLLEGE CUTOFF MODEL — JoSAA historical cutoffs
// One document per (college, branch, year, round, category, gender, quota).
//
// Denormalizes college + branch names so predictor queries don't need joins.
// Round 6 (or the final round per year) is what the predictor uses as the
// canonical closing rank. Other rounds are kept for transparency and trends.
// ============================================

export type CutoffCategory =
  | 'OPEN' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS'
  | 'OPEN (PwD)' | 'OBC-NCL (PwD)' | 'SC (PwD)' | 'ST (PwD)' | 'EWS (PwD)';

export type CutoffGender = 'Gender-Neutral' | 'Female-only (including Supernumerary)';

// Quota as published by JoSAA. AI = All India, HS = Home State, OS = Other State,
// plus special state quotas for a few GFTIs (GO=Goa, JK=J&K, LA=Ladakh).
export type CutoffQuota = 'AI' | 'HS' | 'OS' | 'GO' | 'JK' | 'LA';

export interface ICollegeCutoff {
  _id: string;                    // uuid
  college_id: string;
  college_short_name: string;     // denormalized
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  branch_id?: string;             // optional ref to CollegeBranch
  branch_short_name: string;      // denormalized, e.g. "CSE"
  branch_name: string;            // denormalized full name

  year: number;                   // 2024, 2023, ...
  round: number;                  // 1..6 (final round used by predictor)
  is_final_round: boolean;        // true if this is the last round of that year

  category: CutoffCategory;
  gender: CutoffGender;
  quota: CutoffQuota;

  opening_rank: number;
  closing_rank: number;

  created_at: Date;
}

const CollegeCutoffSchema = new Schema<ICollegeCutoff>({
  _id: { type: String, required: true },
  college_id: { type: String, required: true },
  college_short_name: { type: String, required: true },
  college_type: { type: String, enum: ['NIT', 'IIIT', 'GFTI', 'IIT'], required: true },
  branch_id: { type: String },
  branch_short_name: { type: String, required: true },
  branch_name: { type: String, required: true },

  year: { type: Number, required: true },
  round: { type: Number, required: true, min: 1, max: 7 },
  is_final_round: { type: Boolean, default: false },

  category: {
    type: String,
    enum: [
      'OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS',
      'OPEN (PwD)', 'OBC-NCL (PwD)', 'SC (PwD)', 'ST (PwD)', 'EWS (PwD)',
    ],
    required: true,
  },
  gender: {
    type: String,
    enum: ['Gender-Neutral', 'Female-only (including Supernumerary)'],
    required: true,
  },
  quota: {
    type: String,
    enum: ['AI', 'HS', 'OS', 'GO', 'JK', 'LA'],
    required: true,
  },

  opening_rank: { type: Number, required: true },
  closing_rank: { type: Number, required: true },

  created_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'college_cutoffs',
});

// Primary predictor query path: filter by (category, gender, quota, is_final_round)
// and look up closing_rank per (college, branch, year). Index accordingly.
CollegeCutoffSchema.index(
  { category: 1, gender: 1, quota: 1, is_final_round: 1, closing_rank: 1 },
  { name: 'predictor_query' },
);
CollegeCutoffSchema.index({ college_id: 1, branch_short_name: 1, year: 1, round: 1 });
CollegeCutoffSchema.index({ year: 1, round: 1 });
CollegeCutoffSchema.index(
  { college_id: 1, branch_short_name: 1, year: 1, round: 1, category: 1, gender: 1, quota: 1 },
  { unique: true, name: 'cutoff_uniqueness' },
);

export const CollegeCutoff = mongoose.models.CollegeCutoff
  || mongoose.model<ICollegeCutoff>('CollegeCutoff', CollegeCutoffSchema);
