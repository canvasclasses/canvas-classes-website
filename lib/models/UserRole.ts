import mongoose, { Schema, Document, Model } from 'mongoose';

export type Subject = 'chemistry' | 'physics' | 'mathematics';
export type RoleType = 'super_admin' | 'subject_admin' | 'viewer';

export interface IUserRole extends Document {
  email: string;
  role: RoleType;
  subjects: Subject[]; // Empty array for super_admin (has access to all)
  granted_by: string; // Email of admin who granted this role
  granted_at: Date;
  last_accessed_at?: Date;
  is_active: boolean;
  notes?: string;
}

const subjectValidator = function (this: IUserRole, subjects: Subject[]): boolean {
  // Super admins should have empty subjects array (they get all)
  if (this.role === 'super_admin') return subjects.length === 0;
  // Subject admins must have at least one subject
  if (this.role === 'subject_admin') return subjects.length > 0;
  // Viewers can have subjects (read-only access)
  return true;
};

const UserRoleSchema = new Schema<IUserRole>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'subject_admin', 'viewer'],
      required: true,
      default: 'viewer',
    },
    subjects: {
      type: [String],
      enum: ['chemistry', 'physics', 'mathematics'],
      default: [],
      validate: {
        validator: subjectValidator,
        message: 'Invalid subjects configuration for role',
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as unknown as any,
    granted_by: {
      type: String,
      required: true,
    },
    granted_at: {
      type: Date,
      default: Date.now,
    },
    last_accessed_at: {
      type: Date,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: 'user_roles',
  }
);

// Indexes for performance
UserRoleSchema.index({ email: 1, is_active: 1 });
UserRoleSchema.index({ role: 1, is_active: 1 });

export const UserRole: Model<IUserRole> =
  mongoose.models.UserRole || mongoose.model<IUserRole>('UserRole', UserRoleSchema);
