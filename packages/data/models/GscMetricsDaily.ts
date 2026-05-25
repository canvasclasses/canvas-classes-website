import 'server-only';
import mongoose, { Schema } from 'mongoose';

// ============================================
// GSC METRICS DAILY — one row per (date, dimension, key)
// Powers the SEO dashboard. Filled by packages/seo/sync-gsc.
// `dimension = 'total'` rows have `key = 'TOTAL'` and represent the
// site-wide daily aggregate (used for the overview sparkline).
// ============================================

export type GscDimension = 'total' | 'query' | 'page' | 'device' | 'country';

export interface IGscMetricsDaily {
  date: Date;
  dimension: GscDimension;
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;       // 0..1 from GSC
  position: number;  // average position; GSC returns 1-based
}

const GscMetricsDailySchema = new Schema<IGscMetricsDaily>({
  date: { type: Date, required: true },
  dimension: {
    type: String,
    enum: ['total', 'query', 'page', 'device', 'country'],
    required: true,
  },
  key: { type: String, required: true },
  clicks: { type: Number, required: true, default: 0 },
  impressions: { type: Number, required: true, default: 0 },
  ctr: { type: Number, required: true, default: 0 },
  position: { type: Number, required: true, default: 0 },
}, {
  timestamps: false,
  collection: 'gsc_metrics_daily',
});

// Unique per (date, dimension, key) — backbone of idempotent upserts
GscMetricsDailySchema.index(
  { date: 1, dimension: 1, key: 1 },
  { unique: true },
);

// "Top N over window" lookup — covers the queries/pages tables
GscMetricsDailySchema.index({ dimension: 1, date: -1, clicks: -1 });

export const GscMetricsDaily =
  mongoose.models.GscMetricsDaily ||
  mongoose.model<IGscMetricsDaily>('GscMetricsDaily', GscMetricsDailySchema);
