import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Grant } from './UserAccess';

export type UserAccessAuditAction =
  | 'access_created'
  | 'access_updated'
  | 'access_deleted';

export interface IUserAccessAuditLog extends Document {
  action: UserAccessAuditAction;
  actor_email: string;
  target_email: string;
  timestamp: Date;
  changes: {
    before: { grants: Grant[]; notes?: string } | null;
    after: { grants: Grant[]; notes?: string } | null;
  };
}

const UserAccessAuditLogSchema = new Schema<IUserAccessAuditLog>(
  {
    action: {
      type: String,
      enum: ['access_created', 'access_updated', 'access_deleted'],
      required: true,
    },
    actor_email: { type: String, required: true },
    target_email: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    changes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: false,
    collection: 'user_access_audit_logs',
  },
);

UserAccessAuditLogSchema.index({ target_email: 1, timestamp: -1 });
UserAccessAuditLogSchema.index({ actor_email: 1, timestamp: -1 });
UserAccessAuditLogSchema.index({ timestamp: -1 });
// TTL: delete logs older than 2 years
UserAccessAuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

export const UserAccessAuditLog: Model<IUserAccessAuditLog> =
  mongoose.models.UserAccessAuditLog ||
  mongoose.model<IUserAccessAuditLog>('UserAccessAuditLog', UserAccessAuditLogSchema);
