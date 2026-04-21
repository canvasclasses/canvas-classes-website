import mongoose, { Schema } from 'mongoose';

// ============================================
// COLLEGE MODEL — JEE Main College Predictor
// One document per college (NIT / IIIT / GFTI / IIT).
// _id is a human-readable slug (e.g. "nit-trichy") so URLs stay clean.
// ============================================

export type CollegeType = 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
export type CollegeRegion = 'North' | 'South' | 'East' | 'West' | 'Northeast' | 'Central';

export interface ICollege {
  _id: string;                    // slug, e.g. "nit-trichy"
  name: string;                   // "National Institute of Technology, Tiruchirappalli"
  short_name: string;             // "NIT Trichy"
  type: CollegeType;
  institute_code?: string;        // JoSAA institute code (numeric string), e.g. "107"
  state: string;                  // "Tamil Nadu"
  city: string;                   // "Tiruchirappalli"
  region: CollegeRegion;          // derived from state, stored for fast filtering
  established?: number;           // 1964
  website?: string;
  nirf_rank_engineering?: number;
  nirf_rank_overall?: number;
  total_seats?: number;
  annual_fees?: number;           // tuition INR
  hostel_fees?: number;           // INR
  description?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const CollegeSchema = new Schema<ICollege>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  short_name: { type: String, required: true },
  type: { type: String, enum: ['NIT', 'IIIT', 'GFTI', 'IIT'], required: true },
  institute_code: { type: String },
  state: { type: String, required: true },
  city: { type: String, required: true },
  region: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'Northeast', 'Central'],
    required: true,
  },
  established: { type: Number },
  website: { type: String },
  nirf_rank_engineering: { type: Number },
  nirf_rank_overall: { type: Number },
  total_seats: { type: Number },
  annual_fees: { type: Number },
  hostel_fees: { type: Number },
  description: { type: String },
  logo_url: { type: String },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'colleges',
});

CollegeSchema.index({ type: 1, region: 1 });
CollegeSchema.index({ nirf_rank_engineering: 1 });
CollegeSchema.index({ state: 1 });

CollegeSchema.pre('save', async function () {
  (this as ICollege).updated_at = new Date();
});

export const College = mongoose.models.College || mongoose.model<ICollege>('College', CollegeSchema);
