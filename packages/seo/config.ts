import 'server-only';

// ============================================
// Env access for the SEO package — all reads go through here so a missing
// env var fails loudly in one place rather than as a cryptic JSON-parse
// error deep inside the Google client.
// ============================================

// We use an OAuth2 installed-app flow with a long-lived refresh token rather
// than a service account. Rationale: GSC's "Add user" dialog silently rejects
// service-account emails for some personal Google accounts (the case that hit
// us during Phase 0). An OAuth client owned by the same account that owns the
// GSC property has no such handshake. The refresh token is obtained once via
// `scripts/seo/get-refresh-token.ts` and never expires (Testing-mode app + test
// user — see https://developers.google.com/identity/protocols/oauth2#expiration).
export interface GscOAuthCreds {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export function getGscOAuthCreds(): GscOAuthCreds {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const missing = [
    !clientId && 'GOOGLE_OAUTH_CLIENT_ID',
    !clientSecret && 'GOOGLE_OAUTH_CLIENT_SECRET',
    !refreshToken && 'GOOGLE_OAUTH_REFRESH_TOKEN',
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(
      `Missing env var(s): ${missing.join(', ')}. ` +
      'Run `npx tsx scripts/seo/get-refresh-token.ts` after creating an OAuth ' +
      'Desktop client in Google Cloud Console. See _agents/plans/SEO_DASHBOARD.md Phase 0.',
    );
  }
  return {
    clientId: clientId!,
    clientSecret: clientSecret!,
    refreshToken: refreshToken!,
  };
}

export function getGscSiteUrl(): string {
  const url = process.env.GSC_SITE_URL;
  if (!url) {
    throw new Error(
      'GSC_SITE_URL is not set. Use "sc-domain:canvasclasses.in" for a ' +
      'Domain property or "https://www.canvasclasses.in/" for URL-prefix.',
    );
  }
  return url;
}

export function getCruxApiKey(): string {
  const key = process.env.CRUX_API_KEY;
  if (!key) {
    throw new Error(
      'CRUX_API_KEY is not set. Create one at console.cloud.google.com ' +
      '(APIs & Services → Credentials → Create credentials → API key).',
    );
  }
  return key;
}

// Top-N caps per dimension on each daily sync. Mirrors the "Totals + top 1000
// queries + top 1000 pages" decision recorded in _agents/plans/SEO_DASHBOARD.md.
// Cranking these higher costs proportional GSC quota and Mongo storage.
export const TOP_N = {
  query: 1000,
  page: 1000,
  device: 10,       // mobile/desktop/tablet → small fixed set
  country: 100,
} as const;
