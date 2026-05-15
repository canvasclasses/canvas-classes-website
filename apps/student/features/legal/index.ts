// features/legal — privacy policy, terms, about, consent gate.
//
// Routes:
//   /about    → app/about/page.tsx (imports AboutPage from here)
//   /privacy  → app/privacy/page.tsx (imports PRIVACY_VERSION + LAST_UPDATED)
//   /terms    → app/terms/page.tsx (imports TERMS_VERSION + LAST_UPDATED)
//
// Site-level: app/layout.tsx renders <ConsentGate /> + <ConsentRefreshModal />
// to handle cookie/consent prompts on every page.

export { default as AboutPage } from './components/AboutPage';
export { ConsentGate } from './components/ConsentGate';
export { ConsentRefreshModal } from './components/ConsentRefreshModal';
export { PRIVACY_VERSION, TERMS_VERSION, LAST_UPDATED } from './lib/versions';
export { acceptConsent } from './lib/acceptConsent';
