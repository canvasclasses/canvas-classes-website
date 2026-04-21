import mongoose, { Schema } from 'mongoose';

// ============================================
// COLLEGE BRANCH MODEL
// Program offerings per college (CSE, ECE, Mech, etc.).
// One document per (college, branch) pair.
// ============================================

export type DegreeType =
  | 'B.Tech'
  | 'B.Arch'
  | 'B.Plan'
  | 'B.S.'
  | 'Int. M.Tech'
  | 'B.Tech + M.Tech'
  | 'Int. M.Sc.'
  | 'Dual Degree';

export interface ICollegeBranch {
  _id: string;                    // uuid
  college_id: string;             // ref to College._id (slug)
  name: string;                   // "Computer Science and Engineering"
  short_name: string;             // "CSE"
  branch_code?: string;           // JoSAA branch code, e.g. "4IG1"
  duration_years: number;         // 4 | 5
  degree: DegreeType;
  total_seats?: number;
  annual_fees?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const CollegeBranchSchema = new Schema<ICollegeBranch>({
  _id: { type: String, required: true },
  college_id: { type: String, required: true },
  name: { type: String, required: true },
  short_name: { type: String, required: true },
  branch_code: { type: String },
  duration_years: { type: Number, required: true, min: 3, max: 6 },
  degree: {
    type: String,
    enum: ['B.Tech', 'B.Arch', 'B.Plan', 'B.S.', 'Int. M.Tech', 'B.Tech + M.Tech', 'Int. M.Sc.', 'Dual Degree'],
    required: true,
  },
  total_seats: { type: Number },
  annual_fees: { type: Number },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'college_branches',
});

CollegeBranchSchema.index({ college_id: 1, short_name: 1 }, { unique: true });
CollegeBranchSchema.index({ short_name: 1 });

CollegeBranchSchema.pre('save', async function () {
  (this as ICollegeBranch).updated_at = new Date();
});

export const CollegeBranch = mongoose.models.CollegeBranch
  || mongoose.model<ICollegeBranch>('CollegeBranch', CollegeBranchSchema);
