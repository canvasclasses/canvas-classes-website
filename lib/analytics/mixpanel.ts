// Browser-side Mixpanel wrapper. Intentionally does NOT import the Node
// SDK — importing `mixpanel` (the Node package) from a file that reaches
// the client bundle pulls `net` / `tls` / `https-proxy-agent` and breaks
// the build. Server-side code must import from `./mixpanel.server`.

import mixpanelBrowser from 'mixpanel-browser';
import { hasConsent } from './consent';
import { sanitize } from './sanitize';

let clientInitialized = false;
let identified = false;

// Events queued before identify() lands (e.g. a chapter page useEffect
// fires chapter_opened while MixpanelProvider's async getUser is still
// resolving on hydration). Flushed on identify. For users who never
// identify (anonymous), the window below closes and the queue is
// dropped — matches spec "anonymous users fire nothing to Mixpanel".
const preIdentifyQueue: Array<[string, Record<string, unknown>]> = [];
const PRE_IDENTIFY_WINDOW_MS = 2500;
let preIdentifyWindowClosed = false;

export function initMixpanel() {
  if (typeof window === 'undefined' || clientInitialized) return;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;
  const apiHost = process.env.NEXT_PUBLIC_MIXPANEL_API_HOST; // e.g. 'https://api-eu.mixpanel.com' or 'https://api-in.mixpanel.com'
  mixpanelBrowser.init(token, {
    ...(apiHost ? { api_host: apiHost } : {}),
    persistence: 'localStorage',
    track_pageview: false,
  });
  clientInitialized = true;
  setTimeout(() => {
    preIdentifyWindowClosed = true;
    preIdentifyQueue.length = 0;
  }, PRE_IDENTIFY_WINDOW_MS);
}

export function identify(userId: string, traits: Record<string, unknown> = {}) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.identify(userId);
  mixpanelBrowser.people.set(sanitize(traits));
  identified = true;
  for (const [ev, p] of preIdentifyQueue) {
    mixpanelBrowser.track(ev, sanitize(p));
  }
  preIdentifyQueue.length = 0;
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (!clientInitialized || !hasConsent()) return;
  if (!identified) {
    if (!preIdentifyWindowClosed) preIdentifyQueue.push([event, props]);
    return;
  }
  mixpanelBrowser.track(event, sanitize(props));
}

export function peopleSet(traits: Record<string, unknown>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.set(sanitize(traits));
}

export function peopleSetOnce(traits: Record<string, unknown>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.set_once(sanitize(traits));
}

export function peopleIncrement(props: Record<string, number>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.increment(props);
}

export function reset() {
  if (!clientInitialized) return;
  mixpanelBrowser.reset();
  identified = false;
  preIdentifyQueue.length = 0;
}
