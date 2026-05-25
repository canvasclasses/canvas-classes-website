import 'server-only';
import mongoose, { Schema } from 'mongoose';

// ============================================
// BITSAT CUTOFF MODEL — historical closing scores per (campus, programme, year).
//
// Modelled separately from CollegeCutoff (the JoSAA model) because the data
// shape is fundamentally different:
//
//   JoSAA: rank-based (lower=better), with category × gender × quota × round
//          dimensions, and opening + closing ranks per row.
//   BITSAT: score-based (higher=better), no category / gender / quota /
//          round dimensions, only the final closing score after all 6–7
//          iterations. Max score also changed (450 pre-2022, 390 post-2022).
//
// Wedging the two into one collection would force every BITSAT row to set
// fake category/gender/quota values and would corrupt the predictor's hot
// query path. Keeping them separate also lets each predictor's projection
// model (z-score on ranks vs. on scores) stay clean.
// ============================================

export type BitsatCampus = 'Pilani' | 'Goa' | 'Hyderabad';
export type BitsatDegreeType = 'BE' | 'MSC' | 'BPHARM';

export interface IBitsatCutoff {
  _id: string;                    // uuid
  campus: BitsatCampus;
  programme_code: string;         // canonical join key, e.g. "BE-CSE", "BPHARM"
  programme_name: string;         // display name, e.g. "B.E. Computer Science"
  degree_type: BitsatDegreeType;

  year: number;                   // academic-year start (2024 = AY 2024-25)
  cutoff_score: number;           // final closing BITSAT score (post all iterations)
  max_score: number;              // 450 (2017-2021) or 390 (2022+) — see note below
  // ↑ The max-score change in AY 2022-23 reflects an actual paper-pattern shift,
  // so raw scores ARE NOT comparable across the boundary. The predictor must
  // either normalize to a 0..1 fraction (cutoff / max) or scope queries to a
  // single regime when projecting.

  created_at: Date;
}

const BitsatCutoffSchema = new Schema<IBitsatCutoff>({
  _id: { type: String, required: true },
  campus: { type: String, enum: ['Pilani', 'Goa', 'Hyderabad'], required: true },
  programme_code: { type: String, required: true },
  programme_name: { type: String, required: true },
  degree_type: { type: String, enum: ['BE', 'MSC', 'BPHARM'], required: true },

  year: { type: Number, required: true },
  cutoff_score: { type: Number, required: true, min: 0 },
  max_score: { type: Number, required: true, enum: [390, 450] },

  created_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'bitsat_cutoffs',
});

// Predictor's main query path: pull every (campus, programme) row across years
// for a known regime (max_score). The predictor receives the user's score plus
// (optionally) preferred campuses / programmes and returns bucketed matches.
BitsatCutoffSchema.index(
  { max_score: 1, campus: 1, programme_code: 1, year: -1 },
  { name: 'predictor_query' },
);
BitsatCutoffSchema.index({ year: -1 });
BitsatCutoffSchema.index(
  { campus: 1, programme_code: 1, year: 1 },
  { unique: true, name: 'bitsat_cutoff_uniqueness' },
);

export const BitsatCutoff = mongoose.models.BitsatCutoff
  || mongoose.model<IBitsatCutoff>('BitsatCutoff', BitsatCutoffSchema);
