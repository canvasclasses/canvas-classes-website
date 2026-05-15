import mongoose, { Schema } from 'mongoose';

// Questionnaire items for the Career Explorer.
//
// Two response modes:
//
//   contribution — picking an option contributes scores to facets of a
//                  dimension (aptitude / interest / work_style / values /
//                  future). Used for dimensions A, B, C, D, F.
//
//   constraint   — picking an option stores a raw value on profile.constraints
//                  under `constraint_key`. Used for Dimension E.
//
// Formats — ui renders accordingly:
//   force_choice, likert5, rank, single_select, slider

export type Dimension =
  | 'aptitude'
  | 'interest'
  | 'work_style'
  | 'values'
  | 'constraints'
  | 'future';

export type QuestionFormat =
  | 'force_choice'
  | 'likert5'
  | 'rank'
  | 'single_select'
  | 'slider';

export interface ICareerQuestionOption {
  id: string;
  label: string;
  /** Contribution mode: facet-key → delta. */
  contributes?: Record<string, number>;
  /** Constraint mode: raw stored value. */
  value?: string | number | boolean;
}

export interface ICareerQuestion {
  _id: string;                          // stable id, e.g. "cq_apt_001"
  dimension: Dimension;
  sub_facet?: string;
  order: number;
  prompt: string;
  help_text?: string;
  format: QuestionFormat;
  mode: 'contribution' | 'constraint';
  /** For constraint-mode questions, where the value lands on the profile. */
  constraint_key?: string;
  options: ICareerQuestionOption[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const OptionSchema = new Schema<ICareerQuestionOption>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    contributes: { type: Schema.Types.Mixed },
    value: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const CareerQuestionSchema = new Schema<ICareerQuestion>(
  {
    _id: { type: String, required: true },
    dimension: {
      type: String,
      enum: ['aptitude', 'interest', 'work_style', 'values', 'constraints', 'future'],
      required: true,
    },
    sub_facet: String,
    order: { type: Number, required: true },
    prompt: { type: String, required: true },
    help_text: String,
    format: {
      type: String,
      enum: ['force_choice', 'likert5', 'rank', 'single_select', 'slider'],
      required: true,
    },
    mode: { type: String, enum: ['contribution', 'constraint'], required: true },
    constraint_key: String,
    options: { type: [OptionSchema], required: true },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: false, collection: 'career_questions', optimisticConcurrency: true },
);

CareerQuestionSchema.index({ dimension: 1, order: 1 });
CareerQuestionSchema.index({ is_active: 1 });

CareerQuestionSchema.pre('save', async function () {
  (this as ICareerQuestion).updated_at = new Date();
});

export const CareerQuestion =
  mongoose.models.CareerQuestion ||
  mongoose.model<ICareerQuestion>('CareerQuestion', CareerQuestionSchema);
