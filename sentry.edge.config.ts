// Edge runtime Sentry init — runs for middleware and edge routes.

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://648f332b145bdafbf0291fdbc11378f0@o4511240716681216.ingest.de.sentry.io/4511240950054992',
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'production',
  tracesSampleRate: 0.01,
  sendDefaultPii: false,
  enableLogs: false,
});
