import 'server-only';
import { google, type webmasters_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { getGscOAuthCreds } from './config';

// ============================================
// Thin wrapper around the Search Console Search Analytics API.
//
// Auth: OAuth2 installed-app flow with a long-lived refresh token. The token
// is obtained once via `scripts/seo/get-refresh-token.ts` and stored in
// .env.local. The OAuth2Client auto-refreshes the short-lived access token
// from the refresh token on each call, so we don't need to manage expiry.
//
// One client cached per process — OAuth2Client maintains the in-memory
// access-token cache, so reusing it avoids redundant refresh calls inside
// the same Node process.
// ============================================

let cachedClient: webmasters_v3.Webmasters | null = null;

function getClient(): webmasters_v3.Webmasters {
  if (cachedClient) return cachedClient;
  const { clientId, clientSecret, refreshToken } = getGscOAuthCreds();
  const auth = new OAuth2Client(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });
  cachedClient = google.webmasters({ version: 'v3', auth });
  return cachedClient;
}

export type GscDimensionLabel = 'date' | 'query' | 'page' | 'device' | 'country' | 'searchAppearance';

export interface QueryArgs {
  siteUrl: string;
  startDate: string;       // 'YYYY-MM-DD'
  endDate: string;         // 'YYYY-MM-DD'
  dimensions?: GscDimensionLabel[];
  rowLimit?: number;       // GSC max per page is 25000
  startRow?: number;
}

export interface GscRow {
  keys: string[];          // matches `dimensions` order; absent when no dimensions
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function searchAnalyticsQuery(args: QueryArgs): Promise<GscRow[]> {
  const client = getClient();
  const res = await client.searchanalytics.query({
    siteUrl: args.siteUrl,
    requestBody: {
      startDate: args.startDate,
      endDate: args.endDate,
      dimensions: args.dimensions,
      rowLimit: args.rowLimit ?? 1000,
      startRow: args.startRow ?? 0,
      // dataState 'final' would exclude the freshest (still-updating) rows.
      // We deliberately fetch D-3 dates only, so we use 'all' to include
      // fresh-but-final rows; GSC stops updating a date after ~3 days.
      dataState: 'all',
    },
  });
  const rows = (res.data.rows ?? []) as GscRow[];
  return rows;
}

// Convenience for the most common call: site-wide totals for one day.
export async function queryDailyTotal(
  siteUrl: string,
  date: string,
): Promise<GscRow | null> {
  const rows = await searchAnalyticsQuery({
    siteUrl,
    startDate: date,
    endDate: date,
    dimensions: [], // no dimensions ⇒ single aggregate row
    rowLimit: 1,
  });
  return rows[0] ?? null;
}
