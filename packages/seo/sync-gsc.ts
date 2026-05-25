import 'server-only';
import { GscMetricsDaily } from '@canvas/data/models/GscMetricsDaily';
import {
  searchAnalyticsQuery,
  queryDailyTotal,
  type GscDimensionLabel,
  type GscRow,
} from './gsc-client';
import { getGscSiteUrl, TOP_N } from './config';

// ============================================
// One-day, all-dimensions sync.
//
// Idempotency: every write is an upsert on (date, dimension, key). Re-running
// for the same date overwrites the existing rows with the freshest numbers
// from GSC (GSC re-attributes data within its ~3-day finalisation window).
//
// Quota: each dimension is one API call. We fetch 4 dimensions per day
// (query, page, device, country) + one totals call = 5 API calls per day.
// At GSC's 1200 QPM ceiling, even a 480-day backfill stays well under.
// ============================================

export interface FetchedGscRow {
  dimension: 'total' | 'query' | 'page' | 'device' | 'country';
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SyncDayResult {
  date: string;             // 'YYYY-MM-DD'
  rowCounts: Record<string, number>;
  errors: string[];
}

interface DimensionPlan {
  storedAs: 'query' | 'page' | 'device' | 'country';
  gscDim: GscDimensionLabel;
  limit: number;
}

const PLAN: DimensionPlan[] = [
  { storedAs: 'query',   gscDim: 'query',   limit: TOP_N.query },
  { storedAs: 'page',    gscDim: 'page',    limit: TOP_N.page },
  { storedAs: 'device',  gscDim: 'device',  limit: TOP_N.device },
  { storedAs: 'country', gscDim: 'country', limit: TOP_N.country },
];

export async function syncGscForDate(dateStr: string): Promise<SyncDayResult> {
  const siteUrl = getGscSiteUrl();
  const date = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`syncGscForDate: invalid date "${dateStr}" (expected YYYY-MM-DD)`);
  }

  const rowCounts: Record<string, number> = {};
  const errors: string[] = [];

  // 1. Site-wide totals
  try {
    const total = await queryDailyTotal(siteUrl, dateStr);
    if (total) {
      await bulkUpsert(date, [{ dimension: 'total', key: 'TOTAL', row: total }]);
      rowCounts.total = 1;
    } else {
      rowCounts.total = 0;
    }
  } catch (err) {
    errors.push(`total: ${(err as Error).message}`);
    rowCounts.total = 0;
  }

  // 2. Per-dimension top-N
  for (const plan of PLAN) {
    try {
      const rows = await searchAnalyticsQuery({
        siteUrl,
        startDate: dateStr,
        endDate: dateStr,
        dimensions: [plan.gscDim],
        rowLimit: plan.limit,
      });
      const ops = rows
        .filter(r => r.keys?.[0])
        .map(r => ({ dimension: plan.storedAs, key: r.keys[0], row: r }));
      if (ops.length) await bulkUpsert(date, ops);
      rowCounts[plan.storedAs] = ops.length;
    } catch (err) {
      errors.push(`${plan.storedAs}: ${(err as Error).message}`);
      rowCounts[plan.storedAs] = 0;
    }
  }

  return { date: dateStr, rowCounts, errors };
}

/**
 * Batch-upsert all rows for one (date, dimension) slice in a single round trip.
 * Replaces a previous 1-network-call-per-row loop that made a single day's
 * sync take ~95 s (1000 query rows × ~90 ms each). With bulkWrite the same
 * day completes in under 10 s, which makes the 480-day backfill viable.
 */
async function bulkUpsert(
  date: Date,
  rows: Array<{ dimension: FetchedGscRow['dimension']; key: string; row: GscRow }>,
): Promise<void> {
  const operations = rows.map(({ dimension, key, row }) => ({
    updateOne: {
      filter: { date, dimension, key },
      update: {
        $set: {
          clicks: row.clicks ?? 0,
          impressions: row.impressions ?? 0,
          ctr: row.ctr ?? 0,
          position: row.position ?? 0,
        },
      },
      upsert: true,
    },
  }));
  // ordered:false → Mongo keeps going on per-doc errors (e.g. a transient
  // E11000 from a racing sync) rather than aborting the whole batch.
  await GscMetricsDaily.bulkWrite(operations, { ordered: false });
}

// Format Date → 'YYYY-MM-DD' (UTC). Use everywhere a GSC date string is needed.
export function ymd(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// The default sync target: D-3, GSC's reliable-data lag.
export function defaultSyncDate(now: Date = new Date()): string {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() - 3);
  return ymd(d);
}
