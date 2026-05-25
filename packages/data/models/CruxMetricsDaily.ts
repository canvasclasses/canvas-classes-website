import 'server-only';
import mongoose, { Schema } from 'mongoose';

// ============================================
// CRUX METRICS DAILY — Core Web Vitals from the Chrome UX Report.
// One row per (date, urlPattern, formFactor). `urlPattern` is the value
// passed to the CrUX API: either a fully-qualified URL ("origin" call)
// or a URL prefix. Stored verbatim so the dashboard can group by it.
// ============================================

export type CruxFormFactor = 'PHONE' | 'DESKTOP' | 'ALL_FORM_FACTORS';

export interface ICruxMetricsDaily {
  date: Date;
  urlPattern: string;
  formFactor: CruxFormFactor;

  // p75 values (the threshold metric Google uses for "good/needs improvement/poor")
  lcp_p75: number | null;   // ms; null when CrUX has no data for this dim
  inp_p75: number | null;   // ms
  cls_p75: number | null;   // unitless

  // "good" percentages — what fraction of users hit the "good" threshold
  lcp_good_pct: number | null;  // 0..1
  inp_good_pct: number | null;
  cls_good_pct: number | null;

  // CrUX's collection period (28-day rolling window ending on `periodEnd`)
  periodStart: Date | null;
  periodEnd: Date | null;
}

const CruxMetricsDailySchema = new Schema<ICruxMetricsDaily>({
  date: { type: Date, required: true },
  urlPattern: { type: String, required: true },
  formFactor: {
    type: String,
    enum: ['PHONE', 'DESKTOP', 'ALL_FORM_FACTORS'],
    required: true,
  },
  lcp_p75: { type: Number, default: null },
  inp_p75: { type: Number, default: null },
  cls_p75: { type: Number, default: null },
  lcp_good_pct: { type: Number, default: null },
  inp_good_pct: { type: Number, default: null },
  cls_good_pct: { type: Number, default: null },
  periodStart: { type: Date, default: null },
  periodEnd: { type: Date, default: null },
}, {
  timestamps: false,
  collection: 'crux_metrics_daily',
});

CruxMetricsDailySchema.index(
  { date: 1, urlPattern: 1, formFactor: 1 },
  { unique: true },
);

CruxMetricsDailySchema.index({ urlPattern: 1, formFactor: 1, date: -1 });

export const CruxMetricsDaily =
  mongoose.models.CruxMetricsDaily ||
  mongoose.model<ICruxMetricsDaily>('CruxMetricsDaily', CruxMetricsDailySchema);
