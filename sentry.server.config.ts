// Server-side Sentry init — runs on every Node runtime request.
// Tuned for Crucible's $0-through-50k-DAU budget.

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://648f332b145bdafbf0291fdbc11378f0@o4511240716681216.ingest.de.sentry.io/4511240950054992',
  tracesSampleRate: 0.01,
  sendDefaultPii: false,
  enableLogs: false,
  beforeSend(event, hint) {
    const msg = String(hint?.originalException ?? '');
    if (msg.includes('AbortError')) return null;
    return event;
  },
});
