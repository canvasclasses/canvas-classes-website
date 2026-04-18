// Server-only Mixpanel wrapper. Imports the Node `mixpanel` SDK which
// uses `net` / `tls` and cannot be bundled for the browser. Never
// import this file from a client component or anything reachable by
// the client bundle.

import 'server-only';

import Mixpanel from 'mixpanel';
import { sanitize } from './sanitize';

let serverClient: ReturnType<typeof Mixpanel.init> | null = null;

function getServerClient() {
  if (serverClient) return serverClient;
  const token = process.env.MIXPANEL_TOKEN;
  if (!token) return null;
  // Strip "https://" from the public host var so the Node SDK (which expects a bare host)
  // can share one env var with the browser SDK (which expects a full URL).
  const apiHost = process.env.NEXT_PUBLIC_MIXPANEL_API_HOST?.replace(/^https?:\/\//, '');
  serverClient = Mixpanel.init(token, {
    ...(apiHost ? { host: apiHost } : {}),
    geolocate: false, // server IP is not the user's IP — skip wrong geo data
  });
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
