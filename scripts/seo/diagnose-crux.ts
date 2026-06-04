/**
 * Read-only diagnostic for the "Partial / 0 CrUX rows" sync.
 *  1. Prints the stored error from the most recent GscSyncRun.
 *  2. Reports whether CRUX_API_KEY is present.
 *  3. Makes ONE live CrUX queryRecord call (origin, PHONE) and prints the
 *     raw HTTP status + body so we can tell 403 (bad key) from 429 (quota)
 *     from a transient 5xx.
 * No writes. Safe to run against prod.
 */

import './_shim-server-only';
import dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import mongoose from 'mongoose';
import { GscSyncRun } from '@canvas/data/models/GscSyncRun';
import { ORIGIN } from '@canvas/seo/url-groups';

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('\n=== Last 4 sync runs ===');
  const runs = await GscSyncRun.find({}).sort({ startedAt: -1 }).limit(4).lean();
  for (const r of runs) {
    console.log('─'.repeat(60));
    console.log('startedAt :', r.startedAt);
    console.log('status    :', r.status, '| trigger:', r.trigger);
    console.log('cruxFetched:', r.cruxFetched);
    console.log('error     :', r.error ?? '(none)');
  }

  await mongoose.disconnect();

  console.log('\n=== CRUX_API_KEY presence ===');
  const key = process.env.CRUX_API_KEY;
  if (!key) {
    console.log('CRUX_API_KEY is NOT set in .env.local — this alone would throw on every call.');
    return;
  }
  console.log(`CRUX_API_KEY present (length ${key.length}, prefix "${key.slice(0, 6)}…")`);

  console.log('\n=== Live CrUX probe (origin, PHONE) ===');
  const res = await fetch(
    `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        origin: ORIGIN,
        formFactor: 'PHONE',
        metrics: ['largest_contentful_paint', 'interaction_to_next_paint', 'cumulative_layout_shift'],
      }),
      cache: 'no-store',
    },
  );
  console.log('HTTP status:', res.status, res.statusText);
  const text = await res.text();
  console.log('Body (first 800 chars):\n', text.slice(0, 800));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
