// Browser-side Sentry init — runs on first client page load.

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://648f332b145bdafbf0291fdbc11378f0@o4511240716681216.ingest.de.sentry.io/4511240950054992',
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'production',
  tracesSampleRate: 0.01,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: false,
  enableLogs: false,
  integrations: [
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
  ],
  beforeSend(event, hint) {
    const msg = String(hint?.originalException ?? '');
    if (msg.includes('ResizeObserver loop')) return null;
    if (msg.includes('NetworkError when attempting to fetch')) return null;
    if (msg.includes('Failed to fetch')) return null;
    if (msg.includes('Load failed')) return null;
    if (msg.includes('AbortError')) return null;
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
