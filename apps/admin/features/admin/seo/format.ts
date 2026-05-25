// Tiny formatters shared across the SEO dashboard pages. Pure functions —
// safe to import from server + client components.

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 10_000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export function formatCtr(ctr: number | null | undefined): string {
  if (ctr == null || !Number.isFinite(ctr)) return '—';
  return (ctr * 100).toFixed(2) + '%';
}

export function formatPosition(pos: number | null | undefined): string {
  if (pos == null || !Number.isFinite(pos)) return '—';
  return pos.toFixed(1);
}

export function formatMs(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return '—';
  return Math.round(ms) + ' ms';
}

export function formatCls(cls: number | null | undefined): string {
  if (cls == null || !Number.isFinite(cls)) return '—';
  return cls.toFixed(2);
}

/** Strip the canvasclasses.in origin for compact display in tables. */
export function shortenUrl(url: string): string {
  if (!url) return '';
  return url
    .replace(/^https?:\/\/(www\.)?canvasclasses\.in/, '')
    .replace(/^$/, '/')
    || '/';
}

/** Truncate a query string for table display; full text goes in title attr. */
export function shortenQuery(q: string, max = 60): string {
  if (q.length <= max) return q;
  return q.slice(0, max - 1) + '…';
}

/** "Good / Needs improvement / Poor" verdict per Core Web Vitals thresholds. */
export type CwvVerdict = 'good' | 'ni' | 'poor' | null;

export const CWV_THRESHOLDS = {
  lcp: { good: 2500, ni: 4000 },     // ms
  inp: { good: 200,  ni: 500 },      // ms
  cls: { good: 0.10, ni: 0.25 },     // unitless
} as const;

export function cwvVerdict(
  metric: 'lcp' | 'inp' | 'cls',
  value: number | null | undefined,
): CwvVerdict {
  if (value == null || !Number.isFinite(value)) return null;
  const t = CWV_THRESHOLDS[metric];
  if (value <= t.good) return 'good';
  if (value <= t.ni) return 'ni';
  return 'poor';
}

export const VERDICT_CLASSES: Record<NonNullable<CwvVerdict>, { text: string; bg: string; border: string; label: string }> = {
  good: { text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Good' },
  ni:   { text: 'text-amber-300',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   label: 'Needs improvement' },
  poor: { text: 'text-red-300',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     label: 'Poor' },
};
