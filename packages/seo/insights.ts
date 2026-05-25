import 'server-only';
import { GscMetricsDaily } from '@canvas/data/models/GscMetricsDaily';
import { CruxMetricsDaily } from '@canvas/data/models/CruxMetricsDaily';
import { expectedCtr, top3Ctr } from './expected-ctr';
import { URL_GROUPS } from './url-groups';

// ============================================
// The brain of the SEO dashboard.
//
// analyzeSeo() runs a set of pure-function rules over the data already in
// Mongo and returns a structured digest the dashboard renders, the digest
// API serves, and the morning briefing cron sends to Claude.
//
// Each rule produces zero or more Insight objects. Rules are independent;
// adding a new one only edits this file. The dashboard does not need to
// know about new rules — they appear in whichever bucket (win/issue/trend)
// their severity puts them in.
// ============================================

export type Severity = 'win' | 'issue' | 'trend' | 'info';

export interface Insight {
  id: string;
  severity: Severity;
  title: string;
  evidence: string;
  recommendation: string;
  estimatedImpact: string | null;
  drillDownUrl: string | null;
  metadata: Record<string, unknown>;
  /** Internal priority score — higher = more important. UI sorts by this. */
  score: number;
}

export interface Health {
  trafficTrendPct: number | null;
  cwvPassRate: number | null;
  issueCount: number;
  winCount: number;
  totalClicks7d: number;
  totalImpressions7d: number;
}

export interface SeoDigest {
  generatedAt: Date;
  dataAsOf: Date | null;
  health: Health;
  quickWins: Insight[];
  issues: Insight[];
  trending: Insight[];
}

// ────────────────────────────────────────────────────────────────────────────
// Tunable thresholds — kept at the top so they're easy to find + adjust.
// Conservative defaults: we'd rather skip a borderline insight than spam
// the dashboard with weak ones.
// ────────────────────────────────────────────────────────────────────────────

const T = {
  ctrLeak: {
    minImpressions: 1000,        // per 28d window
    ratioBelow: 0.5,             // actual < expected × 0.5 → flag
  },
  strikingDistance: {
    minImpressions: 200,
    positionMin: 4,              // exclusive — already top 3 isn't striking distance
    positionMax: 12,
  },
  positionDrop: {
    minImpressions: 100,
    minPositionDelta: 3,         // worsened by ≥ 3 positions
  },
  cwvRegression: {
    minWorseningRatio: 0.20,     // current p75 ≥ 20% worse than 30-day median
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Date helpers
// ────────────────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

// ────────────────────────────────────────────────────────────────────────────
// Main entry point
// ────────────────────────────────────────────────────────────────────────────

export async function analyzeSeo(): Promise<SeoDigest> {
  // Run all rules in parallel — they read disjoint slices of Mongo.
  const [
    health,
    ctrLeaks,
    strikingDistance,
    positionDrops,
    cwvRegressions,
    bigGainers,
    bigLosers,
  ] = await Promise.all([
    computeHealth(),
    findCtrLeaks(),
    findStrikingDistanceQueries(),
    findPositionDrops(),
    findCwvRegressions(),
    findBigMovers('gainer'),
    findBigMovers('loser'),
  ]);

  // Sort buckets by score desc; cap to keep the UI scannable.
  const quickWins = [...ctrLeaks, ...strikingDistance]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  const issues = [...positionDrops, ...cwvRegressions]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  const trending = [...bigGainers, ...bigLosers]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const dataAsOf = await getLatestDataDate();

  return {
    generatedAt: new Date(),
    dataAsOf,
    health: {
      ...health,
      issueCount: issues.length,
      winCount: quickWins.length,
    },
    quickWins,
    issues,
    trending,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Rules
// ────────────────────────────────────────────────────────────────────────────

interface AggRow {
  _id: string;
  clicks: number;
  impressions: number;
  weightedPos: number;
}

/** Aggregate a (dimension, window) slice into per-key totals. */
async function aggregateWindow(
  dimension: 'query' | 'page',
  start: Date,
  end: Date,
): Promise<AggRow[]> {
  return GscMetricsDaily.aggregate<AggRow>([
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
}

// ───────────── Rule: high-impression, low-CTR pages ────────────────────────

async function findCtrLeaks(): Promise<Insight[]> {
  const start = daysAgo(28);
  const end = new Date();
  const pages = await aggregateWindow('page', start, end);
  const insights: Insight[] = [];

  for (const p of pages) {
    if (p.impressions < T.ctrLeak.minImpressions) continue;
    const position = p.weightedPos / p.impressions;
    const actualCtr = p.clicks / p.impressions;
    const expected = expectedCtr(position);
    if (expected === 0) continue;
    const ratio = actualCtr / expected;
    if (ratio >= T.ctrLeak.ratioBelow) continue;

    const missedClicksPerWindow = (expected - actualCtr) * p.impressions;
    const missedClicksPerMonth = (missedClicksPerWindow / 28) * 30;

    insights.push({
      id: `ctr-leak:${p._id}`,
      severity: 'win',
      title: `CTR leak on ${shortUrl(p._id)}`,
      evidence:
        `${formatInt(p.impressions)} impressions over 28 days but only ${formatInt(p.clicks)} clicks ` +
        `(${(actualCtr * 100).toFixed(2)}% CTR vs ${(expected * 100).toFixed(1)}% expected at position ${position.toFixed(1)}).`,
      recommendation:
        `Rewrite the <title> and meta description for this page. ` +
        `Lead with the user-visible benefit + include "JEE/NEET" or "CBSE" if relevant.`,
      estimatedImpact: `+${formatInt(missedClicksPerMonth)} clicks/mo if CTR matches benchmark`,
      drillDownUrl: `/seo/pages`,
      metadata: { url: p._id, position, actualCtr, expectedCtr: expected, impressions: p.impressions },
      score: missedClicksPerWindow,    // higher missed-clicks = more important
    });
  }
  return insights;
}

// ───────────── Rule: striking-distance queries (pos 4-12) ──────────────────

async function findStrikingDistanceQueries(): Promise<Insight[]> {
  const start = daysAgo(28);
  const end = new Date();
  const queries = await aggregateWindow('query', start, end);
  const top3 = top3Ctr();
  const insights: Insight[] = [];

  for (const q of queries) {
    if (q.impressions < T.strikingDistance.minImpressions) continue;
    const position = q.weightedPos / q.impressions;
    if (position <= T.strikingDistance.positionMin) continue;
    if (position > T.strikingDistance.positionMax) continue;

    const currentCtr = q.clicks / q.impressions;
    const upsidePerWindow = (top3 - currentCtr) * q.impressions;
    if (upsidePerWindow <= 50) continue;  // too small to matter
    const upsidePerMonth = (upsidePerWindow / 28) * 30;

    insights.push({
      id: `striking:${q._id}`,
      severity: 'win',
      title: `Striking-distance query: "${shortQuery(q._id)}"`,
      evidence:
        `Currently ranking position ${position.toFixed(1)} with ${formatInt(q.impressions)} impressions/28d ` +
        `→ ${formatInt(q.clicks)} clicks.`,
      recommendation:
        `Push this into top 3: strengthen the target page's H1, add an FAQ section answering this exact query, ` +
        `and add internal links from related chapter pages.`,
      estimatedImpact: `+${formatInt(upsidePerMonth)} clicks/mo at top-3 ranking`,
      drillDownUrl: `/seo/queries`,
      metadata: { query: q._id, position, impressions: q.impressions, currentCtr },
      score: upsidePerWindow,
    });
  }
  return insights;
}

// ───────────── Rule: ranking drops vs prior 28d ────────────────────────────

async function findPositionDrops(): Promise<Insight[]> {
  const curStart = daysAgo(28);
  const curEnd = new Date();
  const priStart = daysAgo(56);
  const priEnd = daysAgo(28);

  const [cur, pri] = await Promise.all([
    aggregateWindow('query', curStart, curEnd),
    aggregateWindow('query', priStart, priEnd),
  ]);
  const priMap = new Map<string, AggRow>();
  for (const r of pri) priMap.set(r._id, r);

  const insights: Insight[] = [];
  for (const c of cur) {
    if (c.impressions < T.positionDrop.minImpressions) continue;
    const p = priMap.get(c._id);
    if (!p || p.impressions < T.positionDrop.minImpressions) continue;

    const curPos = c.weightedPos / c.impressions;
    const priPos = p.weightedPos / p.impressions;
    const drop = curPos - priPos;       // positive = ranking got worse
    if (drop < T.positionDrop.minPositionDelta) continue;

    const clicksLost = p.clicks - c.clicks;
    if (clicksLost <= 0) continue;

    insights.push({
      id: `pos-drop:${c._id}`,
      severity: 'issue',
      title: `Ranking drop: "${shortQuery(c._id)}"`,
      evidence:
        `Position fell from ${priPos.toFixed(1)} → ${curPos.toFixed(1)} (−${drop.toFixed(1)} positions) ` +
        `over the last 28 days. Lost ${formatInt(clicksLost)} clicks vs the prior 28d.`,
      recommendation:
        `Investigate: (1) check if a competitor updated content for this query, ` +
        `(2) confirm your target page wasn't recently changed/redirected, (3) check GSC URL Inspection for indexing issues.`,
      estimatedImpact: `−${formatInt(clicksLost)} clicks vs prior 28d`,
      drillDownUrl: `/seo/queries`,
      metadata: { query: c._id, currentPosition: curPos, priorPosition: priPos, clicksLost },
      score: clicksLost * drop,        // weight by both magnitude + click impact
    });
  }
  return insights;
}

// ───────────── Rule: Core Web Vitals regressions ───────────────────────────

async function findCwvRegressions(): Promise<Insight[]> {
  const start = daysAgo(60);
  const insights: Insight[] = [];

  for (const urlPattern of URL_GROUPS) {
    const series = await CruxMetricsDaily.find(
      { urlPattern, formFactor: 'PHONE', date: { $gte: start } },
      { date: 1, lcp_p75: 1, inp_p75: 1, cls_p75: 1, _id: 0 },
    ).sort({ date: 1 }).lean();
    if (series.length < 3) continue;

    for (const metric of ['lcp_p75', 'inp_p75', 'cls_p75'] as const) {
      const values = series.map(s => s[metric]).filter((v): v is number => v != null);
      if (values.length < 3) continue;
      const current = values[values.length - 1];
      const median = sortedMedian(values.slice(0, -1));
      if (median === 0) continue;
      const ratio = (current - median) / median;
      if (ratio < T.cwvRegression.minWorseningRatio) continue;

      const metricName = metric.replace('_p75', '').toUpperCase();
      insights.push({
        id: `cwv-regression:${urlPattern}:${metric}`,
        severity: 'issue',
        title: `${metricName} regression on ${shortUrl(urlPattern)}`,
        evidence:
          `Current p75 ${formatMetric(metric, current)} is ${(ratio * 100).toFixed(0)}% worse than the 60-day median ` +
          `(${formatMetric(metric, median)}).`,
        recommendation:
          `Check the last few deploys for this page. Bundle-size increases, new third-party scripts, ` +
          `or heavy hydration are the usual culprits. Profile in Chrome DevTools Performance tab.`,
        estimatedImpact: null,
        drillDownUrl: `/seo/web-vitals`,
        metadata: { urlPattern, metric, current, median, regressionPct: ratio },
        score: ratio * 100 + (metric === 'inp_p75' ? 50 : 0),  // INP regressions weighted higher (recent ranking factor)
      });
    }
  }
  return insights;
}

// ───────────── Rule: biggest gainers / losers ──────────────────────────────

async function findBigMovers(kind: 'gainer' | 'loser'): Promise<Insight[]> {
  const curStart = daysAgo(7);
  const curEnd = new Date();
  const priStart = daysAgo(14);
  const priEnd = daysAgo(7);

  const [cur, pri] = await Promise.all([
    aggregateWindow('query', curStart, curEnd),
    aggregateWindow('query', priStart, priEnd),
  ]);
  const priMap = new Map<string, AggRow>();
  for (const r of pri) priMap.set(r._id, r);

  const deltas: Array<{ key: string; delta: number; currentClicks: number; priorClicks: number }> = [];
  for (const c of cur) {
    const p = priMap.get(c._id);
    const priorClicks = p?.clicks ?? 0;
    const delta = c.clicks - priorClicks;
    if (Math.abs(delta) < 20) continue;
    deltas.push({ key: c._id, delta, currentClicks: c.clicks, priorClicks });
  }
  // Also pick up queries that disappeared (in prior, not in current).
  if (kind === 'loser') {
    for (const [key, p] of priMap) {
      if (cur.find(c => c._id === key)) continue;
      if (p.clicks < 20) continue;
      deltas.push({ key, delta: -p.clicks, currentClicks: 0, priorClicks: p.clicks });
    }
  }
  const filtered = kind === 'gainer'
    ? deltas.filter(d => d.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 5)
    : deltas.filter(d => d.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 5);

  return filtered.map((d): Insight => ({
    id: `${kind}:${d.key}`,
    severity: 'trend',
    title: kind === 'gainer'
      ? `Gainer: "${shortQuery(d.key)}"`
      : `Loser: "${shortQuery(d.key)}"`,
    evidence:
      `${formatInt(d.currentClicks)} clicks this week vs ${formatInt(d.priorClicks)} last week ` +
      `(${d.delta > 0 ? '+' : ''}${formatInt(d.delta)}).`,
    recommendation: kind === 'gainer'
      ? `Double down: ensure the target page is up-to-date and consider creating related content.`
      : `Investigate: did Google update this query's intent, or did a competitor jump in?`,
    estimatedImpact: null,
    drillDownUrl: `/seo/queries`,
    metadata: { query: d.key, delta: d.delta },
    score: Math.abs(d.delta),
  }));
}

// ───────────── Health summary ──────────────────────────────────────────────

async function computeHealth(): Promise<Omit<Health, 'issueCount' | 'winCount'>> {
  const cur = await sumTotals(daysAgo(7), new Date());
  const pri = await sumTotals(daysAgo(14), daysAgo(7));
  const cwvPassRate = await computeCwvPassRate();

  return {
    trafficTrendPct: cur && pri && pri.clicks > 0
      ? (cur.clicks - pri.clicks) / pri.clicks
      : null,
    cwvPassRate,
    totalClicks7d: cur?.clicks ?? 0,
    totalImpressions7d: cur?.impressions ?? 0,
  };
}

async function sumTotals(start: Date, end: Date) {
  const result = await GscMetricsDaily.aggregate<{ clicks: number; impressions: number }>([
    { $match: { dimension: 'total', key: 'TOTAL', date: { $gte: start, $lt: end } } },
    { $group: { _id: null, clicks: { $sum: '$clicks' }, impressions: { $sum: '$impressions' } } },
  ]);
  return result[0] ?? null;
}

async function computeCwvPassRate(): Promise<number | null> {
  // Latest snapshot per (URL × form factor) — pass = LCP ≤ 2500 AND INP ≤ 200 AND CLS ≤ 0.1
  const rows = await CruxMetricsDaily.aggregate<{
    _id: { urlPattern: string; formFactor: string };
    lcp_p75: number | null;
    inp_p75: number | null;
    cls_p75: number | null;
  }>([
    { $match: { formFactor: 'PHONE' } },
    { $sort: { date: -1 } },
    {
      $group: {
        _id: { urlPattern: '$urlPattern', formFactor: '$formFactor' },
        lcp_p75: { $first: '$lcp_p75' },
        inp_p75: { $first: '$inp_p75' },
        cls_p75: { $first: '$cls_p75' },
      },
    },
  ]);
  if (rows.length === 0) return null;
  let pass = 0;
  let total = 0;
  for (const r of rows) {
    if (r.lcp_p75 == null && r.inp_p75 == null && r.cls_p75 == null) continue;
    total++;
    const goodLcp = r.lcp_p75 != null && r.lcp_p75 <= 2500;
    const goodInp = r.inp_p75 != null && r.inp_p75 <= 200;
    const goodCls = r.cls_p75 != null && r.cls_p75 <= 0.1;
    if (goodLcp && goodInp && goodCls) pass++;
  }
  return total > 0 ? pass / total : null;
}

async function getLatestDataDate(): Promise<Date | null> {
  const row = await GscMetricsDaily.findOne({ dimension: 'total', key: 'TOTAL' })
    .sort({ date: -1 })
    .select({ date: 1, _id: 0 })
    .lean();
  return row?.date ?? null;
}

// ────────────────────────────────────────────────────────────────────────────
// Small helpers (formatting + math)
// ────────────────────────────────────────────────────────────────────────────

function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?canvasclasses\.in/, '') || '/';
}
function shortQuery(q: string, max = 60): string {
  return q.length <= max ? q : q.slice(0, max - 1) + '…';
}
function formatInt(n: number): string {
  return Math.round(n).toLocaleString();
}
function formatMetric(metric: 'lcp_p75' | 'inp_p75' | 'cls_p75', v: number): string {
  if (metric === 'cls_p75') return v.toFixed(2);
  return `${Math.round(v)}ms`;
}
function sortedMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
