import 'server-only';
import mongoose, { Schema } from 'mongoose';

// ============================================
// GSC SYNC RUN — observability for the daily cron and manual syncs.
// Powers the "Sync log" page in the admin SEO dashboard so an operator
// can see whether the data they're looking at is fresh.
// ============================================

export type SyncStatus = 'ok' | 'partial' | 'error';

export interface IGscSyncRun {
  startedAt: Date;
  finishedAt: Date | null;
  status: SyncStatus;
  trigger: 'cron' | 'manual';

  // Which dates were touched in this run (GSC supports backfill of multiple
  // days in one call, but we sync one day at a time for idempotency).
  datesFetched: Date[];

  // Per-dimension upsert counts, e.g. { total: 1, query: 723, page: 412 }.
  rowCounts: Record<string, number>;

  // CrUX is fetched separately; null when skipCrux=true.
  cruxFetched: number | null;

  error: string | null;
  durationMs: number | null;
}

const GscSyncRunSchema = new Schema<IGscSyncRun>({
  startedAt: { type: Date, required: true, default: Date.now },
  finishedAt: { type: Date, default: null },
  status: { type: String, enum: ['ok', 'partial', 'error'], required: true },
  trigger: { type: String, enum: ['cron', 'manual'], required: true },
  datesFetched: [{ type: Date }],
  rowCounts: { type: Schema.Types.Mixed, default: {} },
  cruxFetched: { type: Number, default: null },
  error: { type: String, default: null },
  durationMs: { type: Number, default: null },
}, {
  timestamps: false,
  collection: 'gsc_sync_runs',
});

GscSyncRunSchema.index({ startedAt: -1 });

export const GscSyncRun =
  mongoose.models.GscSyncRun ||
  mongoose.model<IGscSyncRun>('GscSyncRun', GscSyncRunSchema);
