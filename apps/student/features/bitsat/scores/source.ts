import 'server-only';

// ============================================================================
// BITSAT scores — third-party API adapter (SERVER-ONLY).
//
// The "scores submitted by other candidates" shown on /bitsat come from the
// MeritVerse BITSAT scorecard API, which returns RAW individual scorecard
// submissions. This module is the ONLY place that knows that API: its URL, its
// auth, and its response shape. Everything downstream works on the normalized
// `ScorecardRecord[]` this returns (see ./analytics.ts).
//
// Vendor contract (GET /api/export):
//   Auth:     X-API-Key request header (the partner integration secret)
//   Response: { success: true, count: N, data: ScorecardRecord[] }
//
// Security (CLAUDE.md §8.7 / §8.8):
//   - The API key lives in env (BITSAT_SCORES_API_KEY) and never reaches the
//     browser. This file is `server-only`; only the server route imports it.
//   - HTTPS required (http:// allowed ONLY for localhost — local worker dev).
//   - Host pinned to `workers.dev` (override via BITSAT_SCORES_API_ALLOWED_HOST).
//   - On ANY failure we log server-side and return [] so the page degrades to a
//     "no data yet" state rather than throwing.
// ============================================================================

const DEFAULT_API_URL =
  'https://meritverse-bitsat-api.ayushyash503.workers.dev/api/export';

const API_URL = process.env.BITSAT_SCORES_API_URL || DEFAULT_API_URL;
const API_KEY = process.env.BITSAT_SCORES_API_KEY;
const ALLOWED_HOST = (process.env.BITSAT_SCORES_API_ALLOWED_HOST || 'workers.dev').toLowerCase();

// Normalized record the rest of the app consumes. Only the fields we actually
// aggregate are kept — no app_num_hash, test_center, etc. (no PII downstream).
export interface ScorecardRecord {
  final_score: number;
  s1_score: number | null;
  s2_score: number | null;
  branch_allotted: string | null;
}

function urlIsAllowed(raw: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  const host = parsed.hostname.toLowerCase();
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  if (parsed.protocol !== 'https:' && !(isLocal && parsed.protocol === 'http:')) return false;
  if (isLocal) return true;
  return host === ALLOWED_HOST || host.endsWith(`.${ALLOWED_HOST}`);
}

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Normalize the vendor payload into ScorecardRecord[] (rows with a real total). */
function mapResponse(payload: unknown): ScorecardRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload.data)) return [];

  const out: ScorecardRecord[] = [];
  for (const item of payload.data) {
    if (!isRecord(item)) continue;
    // `final_score` is the higher of S1/S2 — the canonical BITSAT total.
    const final = num(item.final_score);
    if (final == null || final <= 0) continue; // drop blank / not-taken rows
    const branch = typeof item.branch_allotted === 'string' ? item.branch_allotted.trim() : '';
    out.push({
      final_score: final,
      s1_score: num(item.s1_score),
      s2_score: num(item.s2_score),
      branch_allotted: branch.length > 0 ? branch : null,
    });
  }
  return out;
}

/**
 * Fetch normalized BITSAT scorecards from the MeritVerse API.
 * Returns [] (never throws) when the API key is unset or the API is unavailable.
 */
export async function fetchScorecards(): Promise<ScorecardRecord[]> {
  if (!API_KEY) return []; // not configured yet — empty state, not an error
  if (!urlIsAllowed(API_URL)) {
    console.error('BITSAT scores: API URL rejected (not https or host not allowed)');
    return [];
  }

  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: { 'X-API-Key': API_KEY, Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`BITSAT scores: upstream returned ${res.status}`);
      return [];
    }
    return mapResponse(await res.json());
  } catch (err) {
    console.error('BITSAT scores: fetch failed', err);
    return [];
  }
}
