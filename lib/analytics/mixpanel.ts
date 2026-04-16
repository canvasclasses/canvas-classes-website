import mixpanelBrowser from 'mixpanel-browser';
import Mixpanel from 'mixpanel';
import { hasConsent } from './consent';

const PII_KEYS = [
  'email',
  'phone',
  'name',
  'full_name',
  'password',
  'question_content',
  'answer_text',
];

let clientInitialized = false;
let identified = false;

function sanitize(props: Record<string, unknown> = {}) {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (PII_KEYS.includes(k.toLowerCase())) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[analytics] PII key "${k}" stripped from event props`);
      }
      continue;
    }
    clean[k] = v;
  }
  return clean;
}

// ── CLIENT ────────────────────────────────────────────────────────────────

export function initMixpanel() {
  if (typeof window === 'undefined' || clientInitialized) return;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;
  mixpanelBrowser.init(token, {
    persistence: 'localStorage',
    ignore_dnt: false,
    track_pageview: false,
  });
  clientInitialized = true;
}

export function identify(userId: string, traits: Record<string, unknown> = {}) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.identify(userId);
  mixpanelBrowser.people.set(sanitize(traits));
  identified = true;
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (!clientInitialized || !hasConsent() || !identified) return;
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
}

// ── SERVER ────────────────────────────────────────────────────────────────

let serverClient: ReturnType<typeof Mixpanel.init> | null = null;
function getServerClient() {
  if (serverClient) return serverClient;
  const token = process.env.MIXPANEL_TOKEN;
  if (!token) return null;
  serverClient = Mixpanel.init(token);
  return serverClient;
}

export async function trackServer(
  userId: string,
  event: string,
  props: Record<string, unknown> = {}
) {
  const client = getServerClient();
  if (!client) return;
  const { hasServerConsent } = await import('./serverConsent');
  const ok = await hasServerConsent(userId);
  if (!ok) return;
  return new Promise<void>((resolve) => {
    client.track(
      event,
      { distinct_id: userId, ...sanitize(props) },
      (err) => {
        if (err) console.error('[mixpanel server track]', err);
        resolve();
      }
    );
  });
}

export async function peopleSetOnceServer(
  userId: string,
  traits: Record<string, unknown>
) {
  const client = getServerClient();
  if (!client) return;
  const { hasServerConsent } = await import('./serverConsent');
  const ok = await hasServerConsent(userId);
  if (!ok) return;
  return new Promise<void>((resolve) => {
    client.people.set_once(userId, sanitize(traits), (err) => {
      if (err) console.error('[mixpanel server set_once]', err);
      resolve();
    });
  });
}

export async function peopleSetServer(
  userId: string,
  traits: Record<string, unknown>
) {
  const client = getServerClient();
  if (!client) return;
  const { hasServerConsent } = await import('./serverConsent');
  const ok = await hasServerConsent(userId);
  if (!ok) return;
  return new Promise<void>((resolve) => {
    client.people.set(userId, sanitize(traits), (err) => {
      if (err) console.error('[mixpanel server set]', err);
      resolve();
    });
  });
}

export async function peopleIncrementServer(
  userId: string,
  props: Record<string, number>
) {
  const client = getServerClient();
  if (!client) return;
  const { hasServerConsent } = await import('./serverConsent');
  const ok = await hasServerConsent(userId);
  if (!ok) return;
  return new Promise<void>((resolve) => {
    client.people.increment(userId, props, (err) => {
      if (err) console.error('[mixpanel server increment]', err);
      resolve();
    });
  });
}
