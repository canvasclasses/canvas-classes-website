import Script from 'next/script';

/**
 * Cloudflare Web Analytics beacon — loaded only when
 * NEXT_PUBLIC_CF_BEACON_TOKEN is set in the environment.
 *
 * Same gating pattern as GoogleAnalytics so preview/local deploys
 * stay clean (no double-counting while testing).
 *
 * The CSP in next.config.ts allowlists static.cloudflareinsights.com
 * (script-src) and cloudflareinsights.com (connect-src), so no extra
 * header work is needed here.
 */
export default function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token) return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
