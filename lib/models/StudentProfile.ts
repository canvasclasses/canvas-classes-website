import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * StudentProfile — per-user identity & preferences that persist across both
 * the live books and Crucible question-bank systems.
 *
 * Created on first login / onboarding. The class_level drives:
 *  • Default landing section in Crucible (Class 9 vs 11/12)
 *  • Which books are shown first in the books landing page
 *  • Adaptive question selection in practice sessions
 */

export interface IStudentProfile extends Omit<Document, '_id'> {
  /** Supabase user ID (primary key). */
  _id: string;
  email: string;
  display_name?: string;

  /** Current class — drives routing and content filtering. */
  class_level: '9' | '10' | '11' | '12';

  /** Board preference — defaults to 'cbse'. */
  board: 'cbse' | 'icse' | 'state';

  /** Subjects the student is actively studying. */
  subjects: string[];

  /** Exam target (optional, for 11/12 students). */
  exam_target?: 'JEE' | 'NEET' | 'Boards' | null;

  /** Books the student is currently reading (slugs). */
  active_book_slugs: string[];

  /** Overall reading streak across all books (maintained by stats API). */
  reading_streak_days: number;
  last_reading_date?: Date;

  /** Crucible practice streak (mirrors UserProgress.stats.streak_days). */
  practice_streak_days: number;
  last_practice_date?: Date;

  /** Onboarding completed flag. */
  onboarded: boolean;

  created_at: Date;
  updated_at: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: { type: String, required: true } as any,
    email:               { type: String, required: true },
    display_name:        String,
    class_level:         { type: String, enum: ['9', '10', '11', '12'], required: true },
    board:               { type: String, enum: ['cbse', 'icse', 'state'], default: 'cbse' },
    subjects:            { type: [String], default: ['chemistry'] },
    exam_target:         { type: String, enum: ['JEE', 'NEET', 'Boards', null], default: null },
    active_book_slugs:   { type: [String], default: [] },
    reading_streak_days: { type: Number, default: 0 },
    last_reading_date:   Date,
    practice_streak_days: { type: Number, default: 0 },
    last_practice_date:   Date,
    onboarded:           { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'student_profiles',
  }
);

StudentProfileSchema.index({ email: 1 });
StudentProfileSchema.index({ class_level: 1 });

const StudentProfileModel: Model<IStudentProfile> =
  mongoose.models.StudentProfile ||
  mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);

export default StudentProfileModel;
