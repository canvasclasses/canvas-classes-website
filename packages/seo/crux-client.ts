import 'server-only';
import { getCruxApiKey } from './config';

// ============================================
// Wrapper around the Chrome UX Report API (queryRecord endpoint).
// Docs: https://developer.chrome.com/docs/crux/api
//
// Returns the latest 28-day aggregate for a given URL/origin × form-factor.
// CrUX returns a 404 when there's not enough traffic to compute reliable
// percentiles — we surface that as `null` rather than an error so the
// caller can store a "no data" row and move on.
// ============================================

const ENDPOINT = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';
const HISTORY_ENDPOINT = 'https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord';

export type CruxFormFactor = 'PHONE' | 'DESKTOP' | 'ALL_FORM_FACTORS';

export interface CruxFetchArgs {
  url?: string;        // exactly one of url/origin
  origin?: string;
  formFactor?: CruxFormFactor;
}

export interface CruxMetricSummary {
  p75: number | null;
  goodPct: number | null;
}

export interface CruxRecord {
  lcp: CruxMetricSummary;
  inp: CruxMetricSummary;
  cls: CruxMetricSummary;
  periodStart: Date | null;
  periodEnd: Date | null;
}

// CrUX API returns a nested response shape. This interface is the subset
// we read — fields beyond these are ignored. See:
// https://developer.chrome.com/docs/crux/api#crux-history-record
interface RawCruxMetric {
  percentiles?: { p75?: number | string };
  histogram?: Array<{ start?: number; end?: number; density?: number }>;
}

interface RawCruxResponse {
  record?: {
    metrics?: Record<string, RawCruxMetric>;
    collectionPeriod?: {
      firstDate?: { year: number; month: number; day: number };
      lastDate?: { year: number; month: number; day: number };
    };
  };
}

function dateFromParts(d?: { year: number; month: number; day: number }): Date | null {
  if (!d) return null;
  return new Date(Date.UTC(d.year, d.month - 1, d.day));
}

function summarise(metric: RawCruxMetric | undefined): CruxMetricSummary {
  if (!metric) return { p75: null, goodPct: null };
  const p75Raw = metric.percentiles?.p75;
  // CLS arrives as a stringified decimal ("0.05"); LCP/INP as numbers (ms).
  const p75 = p75Raw === undefined ? null : Number(p75Raw);

  // "Good" bucket is always the first histogram entry per CrUX docs.
  const good = metric.histogram?.[0]?.density;
  const goodPct = typeof good === 'number' ? good : null;

  return {
    p75: Number.isFinite(p75) ? p75 : null,
    goodPct,
  };
}

export async function queryCruxRecord(
  args: CruxFetchArgs,
): Promise<CruxRecord | null> {
  if (!args.url && !args.origin) {
    throw new Error('queryCruxRecord requires url or origin');
  }
  const key = getCruxApiKey();
  const body: Record<string, unknown> = {
    formFactor: args.formFactor ?? 'PHONE',
    metrics: [
      'largest_contentful_paint',
      'interaction_to_next_paint',
      'cumulative_layout_shift',
    ],
  };
  if (args.url) body.url = args.url;
  else body.origin = args.origin;

  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (res.status === 404) {
    // No CrUX data for this URL/origin × form-factor.
    return null;
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CrUX API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as RawCruxResponse;
  const metrics = data.record?.metrics ?? {};

  return {
    lcp: summarise(metrics['largest_contentful_paint']),
    inp: summarise(metrics['interaction_to_next_paint']),
    cls: summarise(metrics['cumulative_layout_shift']),
    periodStart: dateFromParts(data.record?.collectionPeriod?.firstDate),
    periodEnd: dateFromParts(data.record?.collectionPeriod?.lastDate),
  };
}

// ============================================
// HISTORY — queryHistoryRecord returns up to ~25 weekly snapshots in a single
// call. Used by `scripts/seo/backfill-crux.ts` to seed the dashboard with real
// CWV trends from day one, instead of waiting weeks for `queryRecord` to
// accumulate enough data points.
// ============================================

interface RawCruxHistoryMetric {
  percentilesTimeseries?: { p75s?: Array<number | string | null> };
  histogramTimeseries?: Array<{ densities?: number[] | null }>;
}

interface RawCruxHistoryResponse {
  record?: {
    metrics?: Record<string, RawCruxHistoryMetric>;
    collectionPeriods?: Array<{
      firstDate?: { year: number; month: number; day: number };
      lastDate?: { year: number; month: number; day: number };
    }>;
  };
}

export interface CruxHistoryPoint {
  periodStart: Date | null;
  periodEnd: Date | null;
  lcp: CruxMetricSummary;
  inp: CruxMetricSummary;
  cls: CruxMetricSummary;
}

function pickP75(metric: RawCruxHistoryMetric | undefined, i: number): number | null {
  const raw = metric?.percentilesTimeseries?.p75s?.[i];
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function pickGoodPct(metric: RawCruxHistoryMetric | undefined, i: number): number | null {
  // histogramTimeseries is bucketed [good, needs-improvement, poor]; index 0
  // is the "good" bucket. Each entry is parallel to the collectionPeriods array.
  const good = metric?.histogramTimeseries?.[0]?.densities?.[i];
  return typeof good === 'number' ? good : null;
}

export async function queryCruxHistory(
  args: CruxFetchArgs,
): Promise<CruxHistoryPoint[]> {
  if (!args.url && !args.origin) {
    throw new Error('queryCruxHistory requires url or origin');
  }
  const key = getCruxApiKey();
  const body: Record<string, unknown> = {
    formFactor: args.formFactor ?? 'PHONE',
    metrics: [
      'largest_contentful_paint',
      'interaction_to_next_paint',
      'cumulative_layout_shift',
    ],
  };
  if (args.url) body.url = args.url;
  else body.origin = args.origin;

  const res = await fetch(`${HISTORY_ENDPOINT}?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (res.status === 404) return [];           // no data for this URL × form-factor
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CrUX history API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as RawCruxHistoryResponse;
  const periods = data.record?.collectionPeriods ?? [];
  const metrics = data.record?.metrics ?? {};
  const lcp = metrics['largest_contentful_paint'];
  const inp = metrics['interaction_to_next_paint'];
  const cls = metrics['cumulative_layout_shift'];

  return periods.map((period, i) => ({
    periodStart: dateFromParts(period.firstDate),
    periodEnd: dateFromParts(period.lastDate),
    lcp: { p75: pickP75(lcp, i), goodPct: pickGoodPct(lcp, i) },
    inp: { p75: pickP75(inp, i), goodPct: pickGoodPct(inp, i) },
    cls: { p75: pickP75(cls, i), goodPct: pickGoodPct(cls, i) },
  }));
}
