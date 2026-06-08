import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * TENANT — the B2B isolation boundary (Phase 3, ADR-011 / UNIFIED_LEARNER_PERSONA.md §7).
 *
 * A tenant is an organisation the platform is sold to: a school, a coaching
 * centre, or the default public B2C pool. Every learner record and learning
 * event is stamped with a `tenant_id` so data can be hard-isolated per tenant.
 *
 * The reserved default tenant id is `'public'` (see @canvas/data/tenancy
 * DEFAULT_TENANT_ID) — all existing individual students belong to it, so adding
 * tenancy changes nothing for today's B2C users.
 *
 * `_id` is a human-readable slug (e.g. 'public', 'dps-rohini') so tenant_id is
 * legible in logs and filters.
 */
export type TenantType = 'b2c' | 'school' | 'coaching';
export type TenantStatus = 'active' | 'suspended' | 'archived';

export interface ITenant extends Document {
  _id: string;
  name: string;
  type: TenantType;
  status: TenantStatus;
  /** Phase 3d placeholder — where this tenant's data must reside. */
  data_residency?: string;
  /** Free-form settings bag for white-label / feature flags (Phase 3 follow-ons). */
  settings?: Record<string, unknown>;
  created_at: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['b2c', 'school', 'coaching'], default: 'school' },
    status: { type: String, enum: ['active', 'suspended', 'archived'], default: 'active' },
    data_residency: { type: String },
    settings: { type: Schema.Types.Mixed },
    created_at: { type: Date, default: Date.now },
  },
  { collection: 'tenants', _id: false },
);

const TenantModel: Model<ITenant> =
  mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);

export default TenantModel;
