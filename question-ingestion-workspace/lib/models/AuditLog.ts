import mongoose, { Schema } from 'mongoose';

// ============================================
// AUDIT LOG MODEL - Track all changes
// Complete history for rollback and accountability
// ============================================

export interface IAuditLogChanges {
  field: string;
  old_value: any;
  new_value: any;
}

export interface IAuditLog {
  _id: string; // UUID v4
  
  entity_type: 'question' | 'asset' | 'tag' | 'chapter';
  entity_id: string;
  action: 'create' | 'update' | 'delete' | 'restore';
  
  changes: IAuditLogChanges[];
  
  user_id: string;
  user_email: string;
  timestamp: Date;
  
  ip_address?: string;
  user_agent?: string;
  
  can_rollback: boolean;
  rollback_data?: any; // Snapshot of previous state
}

const AuditLogChangesSchema = new Schema<IAuditLogChanges>({
  field: { type: String, required: true },
  old_value: { type: Schema.Types.Mixed },
  new_value: { type: Schema.Types.Mixed }
}, { _id: false });

const AuditLogSchema = new Schema<IAuditLog>({
  _id: { 
    type: String, 
    required: true,
    match: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  },
  
  entity_type: { 
    type: String, 
    enum: ['question', 'asset', 'tag', 'chapter'], 
    required: true 
  },
  entity_id: { type: String, required: true },
  action: { 
    type: String, 
    enum: ['create', 'update', 'delete', 'restore'], 
    required: true 
  },
  
  changes: [AuditLogChangesSchema],
  
  user_id: { type: String, required: true },
  user_email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
  
  ip_address: { type: String },
  user_agent: { type: String },
  
  can_rollback: { type: Boolean, default: true },
  rollback_data: { type: Schema.Types.Mixed }
}, {
  timestamps: false,
  collection: 'audit_logs'
});

// Indexes for performance
AuditLogSchema.index({ entity_id: 1, timestamp: -1 });
AuditLogSchema.index({ user_id: 1, timestamp: -1 });
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ entity_type: 1, action: 1 });

// TTL index - automatically delete logs older than 2 years
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 }); // 2 years

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
