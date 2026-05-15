import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoleAuditLog extends Document {
  action: 'role_created' | 'role_updated' | 'role_deleted';
  user_id: string;
  user_email: string;
  resource_type: 'user_role';
  resource_id: string;
  metadata: {
    target_email: string;
    role?: string;
    subjects?: string[];
    new_role?: string;
    new_subjects?: string[];
    previous_role?: string;
    previous_subjects?: string[];
  };
  timestamp: Date;
}

const RoleAuditLogSchema = new Schema<IRoleAuditLog>(
  {
    action: {
      type: String,
      enum: ['role_created', 'role_updated', 'role_deleted'],
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    resource_type: {
      type: String,
      enum: ['user_role'],
      default: 'user_role',
      required: true,
    },
    resource_id: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: false,
    collection: 'role_audit_logs',
  }
);

// Indexes for performance
RoleAuditLogSchema.index({ resource_id: 1, timestamp: -1 });
RoleAuditLogSchema.index({ user_email: 1, timestamp: -1 });
RoleAuditLogSchema.index({ timestamp: -1 });

// TTL index - automatically delete logs older than 2 years
RoleAuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

export const RoleAuditLog: Model<IRoleAuditLog> =
  mongoose.models.RoleAuditLog || mongoose.model<IRoleAuditLog>('RoleAuditLog', RoleAuditLogSchema);
