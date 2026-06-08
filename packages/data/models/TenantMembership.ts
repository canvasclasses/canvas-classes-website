import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * TENANT MEMBERSHIP — maps a Supabase user to a tenant + role (Phase 3, ADR-011).
 *
 * One active membership per user (a student is in one school). Absence of a
 * membership means the user is in the default `'public'` tenant — so existing
 * B2C students need no row. This is the join table the tenant resolver
 * (@canvas/data/tenancy) reads, and the substrate teacher dashboards (3b) will
 * roll up from (list students in a tenant/section).
 */
export type TenantRole = 'student' | 'teacher' | 'tenant_admin';

export interface ITenantMembership extends Document {
  user_id: string;        // Supabase user id
  tenant_id: string;      // references Tenant._id
  role: TenantRole;
  /** Optional class/section label for teacher rollups (3b). */
  section?: string;
  status: 'active' | 'inactive';
  created_at: Date;
}

const TenantMembershipSchema = new Schema<ITenantMembership>(
  {
    user_id: { type: String, required: true },
    tenant_id: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'tenant_admin'], default: 'student' },
    section: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    created_at: { type: Date, default: Date.now },
  },
  { collection: 'tenant_memberships' },
);

// One active membership per user — the resolver reads this.
TenantMembershipSchema.index({ user_id: 1 }, { unique: true });
// Teacher dashboards: list members of a tenant/section by role.
TenantMembershipSchema.index({ tenant_id: 1, role: 1, section: 1 });

const TenantMembershipModel: Model<ITenantMembership> =
  mongoose.models.TenantMembership ||
  mongoose.model<ITenantMembership>('TenantMembership', TenantMembershipSchema);

export default TenantMembershipModel;
