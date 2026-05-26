import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';

export type Subject = 'chemistry' | 'physics' | 'mathematics' | 'biology';
export type AccessLevel = 'view' | 'edit';

export interface Grant {
  subject: Subject;
  chapters: 'all' | string[];
  level: AccessLevel;
}

export interface IUserAccess extends Document {
  email: string;
  grants: Grant[];
  granted_by: string;
  granted_at: Date;
  last_accessed_at?: Date;
  is_active: boolean;
  notes?: string;
}

// Inline subject inference: avoid a runtime dependency on rbac.ts (which
// imports this model). The mapping must match getSubjectFromChapterId in
// packages/data/rbac.ts exactly.
function getSubjectFromChapterId(chapterId: string): Subject | null {
  if (chapterId.startsWith('ch11_') || chapterId.startsWith('ch12_')) return 'chemistry';
  if (chapterId.startsWith('ph11_') || chapterId.startsWith('ph12_')) return 'physics';
  if (chapterId.startsWith('ma_')) return 'mathematics';
  if (
    chapterId.startsWith('bio9_') ||
    chapterId.startsWith('bio11_') ||
    chapterId.startsWith('bio12_')
  ) {
    return 'biology';
  }
  return null;
}

// Per-grant validator: when chapters is an array, every chapter id must
// belong to that grant's subject. Mongoose types `this` inside a SchemaType
// validator as `Document | Query`, so we cast to access the parent subdoc's
// `subject` field. The API-layer Zod check in /api/v2/admin/user-access
// validates the same constraint before write — this is defense in depth.
const grantChaptersValidator = {
  validator: function (this: unknown, chapters: 'all' | string[]): boolean {
    if (chapters === 'all') return true;
    if (!Array.isArray(chapters) || chapters.length === 0) return false;
    if (chapters.length > 100) return false;
    if (new Set(chapters).size !== chapters.length) return false;
    const parent = this as { subject?: Subject } | undefined;
    const subject = parent?.subject;
    if (!subject) return false;
    return chapters.every((chId) => getSubjectFromChapterId(chId) === subject);
  },
  message: "Every chapter ID in `chapters` must be unique and belong to the grant's subject.",
};

const GrantSchema = new Schema<Grant>(
  {
    subject: {
      type: String,
      enum: ['chemistry', 'physics', 'mathematics', 'biology'],
      required: true,
    },
    chapters: {
      type: Schema.Types.Mixed,
      required: true,
      validate: grantChaptersValidator,
    },
    level: {
      type: String,
      enum: ['view', 'edit'],
      required: true,
    },
  },
  { _id: false },
);

// No two grants share the same subject in one document.
const grantsArrayValidator = {
  validator: function (grants: Grant[]): boolean {
    if (!Array.isArray(grants)) return false;
    if (grants.length > 50) return false;
    return new Set(grants.map((g) => g.subject)).size === grants.length;
  },
  message: 'Duplicate subject in grants — each subject may appear at most once per user.',
};

const UserAccessSchema = new Schema<IUserAccess>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    grants: {
      type: [GrantSchema],
      default: [],
      validate: grantsArrayValidator,
    },
    granted_by: { type: String, required: true },
    granted_at: { type: Date, default: Date.now },
    last_accessed_at: { type: Date },
    is_active: { type: Boolean, default: true },
    notes: { type: String, maxlength: 500 },
  },
  {
    timestamps: true,
    collection: 'user_access',
  },
);

UserAccessSchema.index({ email: 1, is_active: 1 });
UserAccessSchema.index({ is_active: 1, granted_at: -1 });

export const UserAccess: Model<IUserAccess> =
  mongoose.models.UserAccess || mongoose.model<IUserAccess>('UserAccess', UserAccessSchema);
