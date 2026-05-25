import 'server-only';
import { GscMetricsDaily } from '@canvas/data/models/GscMetricsDaily';
import { CruxMetricsDaily } from '@canvas/data/models/CruxMetricsDaily';

// ============================================
// Pure data-access functions for the SEO dashboard. Every page in
// apps/admin/app/seo/ calls into here so the Mongo aggregations live in
// exactly one place and the UI files stay declarative.
//
// All functions are read-only. None of them write to Mongo or call external
// APIs — that's the cron's job. Keeping the read path separate means the
// dashboard renders in milliseconds even if the GSC API is having a bad day.
// ============================================

/** Window-over-window comparison output. */
export interface PeriodTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface DailyPoint {
  date: Date;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface TopRow {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  clicksDelta: number | null;        // absolute delta vs prior equal-length window; null if no prior data
  clicksDeltaPct: number | null;
  positionDelta: number | null;      // negative = improved (lower position number = better rank)
}

export interface CwvPoint {
  date: Date;
  lcp_p75: number | null;
  inp_p75: number | null;
  cls_p75: number | null;
  inp_good_pct: number | null;
}

// ────────────────────────────────────────────────────────────────────────────
// Date helpers — kept local so calling code uses a single source of truth for
// "what does 'last N days' mean"; both query and prior-window calls use these.
// ────────────────────────────────────────────────────────────────────────────

/** UTC midnight of N days ago (inclusive of today). */
function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

/** [start, end) range covering the most recent `days` worth of data. */
function recentRange(days: number): { start: Date; end: Date } {
  return { start: daysAgo(days - 1), end: new Date() };
}

/** Equal-length window immediately preceding `recentRange(days)`. */
function priorRange(days: number): { start: Date; end: Date } {
  return { start: daysAgo(days * 2 - 1), end: daysAgo(days - 1) };
}

// ────────────────────────────────────────────────────────────────────────────
// 1. Daily totals — powers the overview KPIs + sparkline.
// ────────────────────────────────────────────────────────────────────────────

/** Returns every daily total row in the last `days` days, ascending by date. */
export async function getDailyTotals(days: number): Promise<DailyPoint[]> {
  const { start } = recentRange(days);
  const docs = await GscMetricsDaily.find(
    { dimension: 'total', key: 'TOTAL', date: { $gte: start } },
    { date: 1, clicks: 1, impressions: 1, ctr: 1, position: 1, _id: 0 },
  ).sort({ date: 1 }).lean();
  return docs.map(d => ({
    date: d.date,
    clicks: d.clicks,
    impressions: d.impressions,
    ctr: d.ctr,
    position: d.position,
  }));
}

/** Sum + weighted-avg the daily totals over a recent window. */
async function sumTotals(start: Date, end: Date): Promise<PeriodTotals | null> {
  const result = await GscMetricsDaily.aggregate<{
    clicks: number;
    impressions: number;
    weightedPos: number;
  }>([
    { $match: { dimension: 'total', key: 'TOTAL', date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: null,
        clicks: { $sum: '$clicks' },
        impressions: { $sum: '$impressions' },
        weightedPos: { $sum: { $multiply: ['$position', '$impressions'] } },
      },
    },
  ]);
  const row = result[0];
  if (!row || row.impressions === 0) return null;
  return {
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.clicks / row.impressions,
    position: row.weightedPos / row.impressions,
  };
}

/** Window-over-window comparison for the overview KPI cards. */
export async function getWindowComparison(days: number): Promise<{
  current: PeriodTotals | null;
  prior: PeriodTotals | null;
}> {
  const cur = recentRange(days);
  const pri = priorRange(days);
  const [current, prior] = await Promise.all([
    sumTotals(cur.start, cur.end),
    sumTotals(pri.start, pri.end),
  ]);
  return { current, prior };
}

// ────────────────────────────────────────────────────────────────────────────
// 2. Top queries / pages — with delta vs the prior equal-length window.
// ────────────────────────────────────────────────────────────────────────────

interface AggRow {
  _id: string;
  clicks: number;
  impressions: number;
  weightedPos: number;
}

async function topByDimension(
  dimension: 'query' | 'page',
  days: number,
  limit: number,
): Promise<TopRow[]> {
  const cur = recentRange(days);
  const pri = priorRange(days);

  const aggregateOver = (start: Date, end: Date) =>
    GscMetricsDaily.aggregate<AggRow>([
      { $match: { dimension, date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: '$key',
          clicks: { $sum: '$clicks' },
          impressions: { $sum: '$impressions' },
          weightedPos: { $sum: { $multiply: ['$position', '$impressions'] } },
        },
      },
    ]);

  // Run both windows in parallel. We pull ALL keys from the current window
  // (filtered by limit afterwards) so the delta lookup is a constant-time map.
  const [curRows, priRows] = await Promise.all([
    aggregateOver(cur.start, cur.end),
    aggregateOver(pri.start, pri.end),
  ]);

  const priByKey = new Map<string, AggRow>();
  for (const r of priRows) priByKey.set(r._id, r);

  return curRows
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit)
    .map(r => {
      const prior = priByKey.get(r._id);
      const ctr = r.impressions > 0 ? r.clicks / r.impressions : 0;
      const position = r.impressions > 0 ? r.weightedPos / r.impressions : 0;
      const priorPosition = prior && prior.impressions > 0
        ? prior.weightedPos / prior.impressions
        : null;

      const clicksDelta = prior ? r.clicks - prior.clicks : null;
      const clicksDeltaPct = prior && prior.clicks > 0
        ? (r.clicks - prior.clicks) / prior.clicks
        : null;
      const positionDelta = priorPosition !== null ? position - priorPosition : null;

      return {
        key: r._id,
        clicks: r.clicks,
        impressions: r.impressions,
        ctr,
        position,
        clicksDelta,
        clicksDeltaPct,
        positionDelta,
      };
    });
}

export function getTopQueries(days: number, limit = 50) {
  return topByDimension('query', days, limit);
}
export function getTopPages(days: number, limit = 50) {
  return topByDimension('page', days, limit);
}

// ────────────────────────────────────────────────────────────────────────────
// 3. Core Web Vitals series — for the web-vitals page.
// ────────────────────────────────────────────────────────────────────────────

/** Time series for one (URL × form factor), ascending. */
export async function getCwvSeries(
  urlPattern: string,
  formFactor: 'PHONE' | 'DESKTOP' | 'ALL_FORM_FACTORS',
  days: number,
): Promise<CwvPoint[]> {
  const start = daysAgo(days);
  const docs = await CruxMetricsDaily.find(
    { urlPattern, formFactor, date: { $gte: start } },
    { date: 1, lcp_p75: 1, inp_p75: 1, cls_p75: 1, inp_good_pct: 1, _id: 0 },
  ).sort({ date: 1 }).lean();
  return docs.map(d => ({
    date: d.date,
    lcp_p75: d.lcp_p75,
    inp_p75: d.inp_p75,
    cls_p75: d.cls_p75,
    inp_good_pct: d.inp_good_pct,
  }));
}

/** Most recent non-null point per (URL × form factor) — for the summary cards. */
export interface CwvSnapshot {
  urlPattern: string;
  formFactor: string;
  date: Date | null;
  lcp_p75: number | null;
  inp_p75: number | null;
  cls_p75: number | null;
}

export async function getLatestCwvSnapshots(): Promise<CwvSnapshot[]> {
  const rows = await CruxMetricsDaily.aggregate<CwvSnapshot & { _id: { urlPattern: string; formFactor: string } }>([
    { $sort: { date: -1 } },
    {
      $group: {
        _id: { urlPattern: '$urlPattern', formFactor: '$formFactor' },
        date: { $first: '$date' },
        lcp_p75: { $first: '$lcp_p75' },
        inp_p75: { $first: '$inp_p75' },
        cls_p75: { $first: '$cls_p75' },
      },
    },
  ]);
  return rows.map(r => ({
    urlPattern: r._id.urlPattern,
    formFactor: r._id.formFactor,
    date: r.date,
    lcp_p75: r.lcp_p75,
    inp_p75: r.inp_p75,
    cls_p75: r.cls_p75,
  }));
}

// ────────────────────────────────────────────────────────────────────────────
// 4. Misc helpers
// ────────────────────────────────────────────────────────────────────────────

/** ISO date of the most recent daily total row. Used for "data as of" labels. */
export async function getLatestDataDate(): Promise<Date | null> {
  const row = await GscMetricsDaily
    .findOne({ dimension: 'total', key: 'TOTAL' })
    .sort({ date: -1 })
    .select({ date: 1, _id: 0 })
    .lean();
  return row?.date ?? null;
}
