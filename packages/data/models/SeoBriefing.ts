import 'server-only';
import mongoose, { Schema } from 'mongoose';

// ============================================
// SEO BRIEFING — one morning brief per day. Stores both the deterministic
// digest (structured insights from packages/seo/insights.ts) AND Claude's
// natural-language synthesis. Letting the dashboard show either view:
// fast scanners read Claude's 3-action summary, deep readers expand the
// structured details.
// ============================================

export type InsightSeverity = 'win' | 'issue' | 'trend' | 'info';

export interface StoredInsight {
  id: string;
  severity: InsightSeverity;
  title: string;
  evidence: string;
  recommendation: string;
  estimatedImpact: string | null;     // e.g. "+4,800 clicks/mo"
  drillDownUrl: string | null;        // e.g. "/seo/queries?q=..."
  metadata: Record<string, unknown>;  // free-form for rule-specific data
}

export interface IBriefingHealth {
  trafficTrendPct: number | null;     // clicks delta vs prior 7d (0..1)
  cwvPassRate: number | null;         // fraction of (URL × form factor) all-good
  issueCount: number;
  winCount: number;
  totalClicks7d: number;
  totalImpressions7d: number;
}

export interface ISeoBriefing {
  forDate: Date;                      // the data-as-of date the brief covers
  generatedAt: Date;
  trigger: 'cron' | 'manual';
  health: IBriefingHealth;
  insights: StoredInsight[];          // full insight list, all severities
  llmSynthesis: string | null;        // Claude's plain-English summary; null on LLM failure
  llmModel: string | null;
  llmTokensUsed: number | null;
  error: string | null;
}

const InsightSchema = new Schema<StoredInsight>({
  id: { type: String, required: true },
  severity: { type: String, enum: ['win', 'issue', 'trend', 'info'], required: true },
  title: { type: String, required: true },
  evidence: { type: String, required: true },
  recommendation: { type: String, required: true },
  estimatedImpact: { type: String, default: null },
  drillDownUrl: { type: String, default: null },
  metadata: { type: Schema.Types.Mixed, default: {} },
}, { _id: false });

const HealthSchema = new Schema<IBriefingHealth>({
  trafficTrendPct: { type: Number, default: null },
  cwvPassRate: { type: Number, default: null },
  issueCount: { type: Number, default: 0 },
  winCount: { type: Number, default: 0 },
  totalClicks7d: { type: Number, default: 0 },
  totalImpressions7d: { type: Number, default: 0 },
}, { _id: false });

const SeoBriefingSchema = new Schema<ISeoBriefing>({
  forDate: { type: Date, required: true },
  generatedAt: { type: Date, required: true, default: Date.now },
  trigger: { type: String, enum: ['cron', 'manual'], required: true },
  health: { type: HealthSchema, required: true },
  insights: { type: [InsightSchema], default: [] },
  llmSynthesis: { type: String, default: null },
  llmModel: { type: String, default: null },
  llmTokensUsed: { type: Number, default: null },
  error: { type: String, default: null },
}, {
  timestamps: false,
  collection: 'seo_briefings',
});

// Most-recent first for the dashboard
SeoBriefingSchema.index({ forDate: -1 });
// Idempotency: re-running for the same forDate replaces rather than duplicates
SeoBriefingSchema.index({ forDate: 1 }, { unique: true });

export const SeoBriefing =
  mongoose.models.SeoBriefing ||
  mongoose.model<ISeoBriefing>('SeoBriefing', SeoBriefingSchema);
