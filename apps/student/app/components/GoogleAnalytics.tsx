import Script from 'next/script';

/**
 * GA4 tag — loaded only when NEXT_PUBLIC_GA_ID is set in the environment.
 *
 * We keep this as its own component so:
 *   • Vercel Preview deploys without the env var stay clean (no double
 *     counting while A/B testing).
 *   • Local dev doesn't send events unless the developer opts in.
 *
 * The CSP in next.config.ts already whitelists googletagmanager.com and
 * google-analytics.com for both `script-src` and `connect-src`, so no
 * extra header work is needed here.
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            send_page_view: true,
          });
        `}
      </Script>
    </>
  );
}
