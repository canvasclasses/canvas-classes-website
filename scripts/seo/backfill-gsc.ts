/**
 * One-time GSC backfill — fetches the last ~16 months of daily Search Console
 * data into Mongo so the dashboard renders a real trend on first load instead
 * of a sparse one-week sparkline.
 *
 * Usage:
 *   npx tsx scripts/seo/backfill-gsc.ts                # full 480-day backfill
 *   npx tsx scripts/seo/backfill-gsc.ts --days 30      # last 30 days only
 *   npx tsx scripts/seo/backfill-gsc.ts --force        # re-sync dates already in Mongo
 *
 * Resumable: by default the script skips any date that already has a
 * `gsc_metrics_daily` row, so you can Ctrl-C and re-run. Use --force to
 * overwrite (use sparingly — burns API quota for no new data).
 *
 * Quota: GSC's per-user limit is 100 QPM. This script makes 5 calls per day
 * (4 dimensions + 1 total), so we sleep 1 s between days → 1 QPS = 60 QPM,
 * comfortably below the limit. A full 480-day backfill takes ~80 minutes.
 */

import './_shim-server-only';                            // must stay first
import dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import mongoose from 'mongoose';
import { GscMetricsDaily } from '@canvas/data/models/GscMetricsDaily';
import { syncGscForDate, ymd } from '@canvas/seo/sync-gsc';

const DEFAULT_DAYS = 480;            // ~16 months — GSC stores 16 months
const SLEEP_MS = 1000;               // 1 s between days = 60 QPM, well under 100 QPM cap
const LAG_DAYS = 3;                  // D-3 is the freshest reliably-finalised date
const FLUSH_EVERY = 30;              // progress line cadence

interface Args { days: number; force: boolean }

function parseArgs(argv: string[]): Args {
  let days = DEFAULT_DAYS;
  let force = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--days') {
      const n = parseInt(argv[++i] ?? '', 10);
      if (!Number.isFinite(n) || n <= 0) throw new Error('--days needs a positive integer');
      days = n;
    } else if (a === '--force') {
      force = true;
    } else if (a === '--help' || a === '-h') {
      console.log('Usage: tsx scripts/seo/backfill-gsc.ts [--days N] [--force]');
      process.exit(0);
    } else {
      throw new Error(`Unknown arg: ${a}`);
    }
  }
  return { days, force };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const { days, force } = parseArgs(process.argv.slice(2));
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not set in .env.local');
  }

  console.log(`\nBackfilling ${days} day(s) of GSC data${force ? ' (force overwrite)' : ' (skip dates already synced)'}`);
  console.log('────────────────────────────────────────────────────────────\n');

  await mongoose.connect(process.env.MONGODB_URI);

  // Pre-compute the set of dates that already have data so we can skip cheaply.
  let existing = new Set<string>();
  if (!force) {
    const docs = await GscMetricsDaily.find(
      { dimension: 'total' },
      { date: 1, _id: 0 },
    ).lean();
    existing = new Set(docs.map(d => ymd(new Date(d.date))));
    console.log(`Found ${existing.size} day(s) already synced — will skip these.\n`);
  }

  const startedAt = Date.now();
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - LAG_DAYS); // begin at D-3

  let synced = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < days; i++) {
    const day = new Date(start);
    day.setUTCDate(day.getUTCDate() - i);
    const dateStr = ymd(day);

    if (existing.has(dateStr)) {
      skipped++;
      continue;
    }

    try {
      const res = await syncGscForDate(dateStr);
      const rows = Object.values(res.rowCounts).reduce((a, b) => a + b, 0);
      synced++;
      if (res.errors.length) {
        console.log(`  ${dateStr}  ${rows.toString().padStart(5)} rows  ⚠️ ${res.errors[0]}`);
      } else if (synced % FLUSH_EVERY === 0 || rows === 0) {
        console.log(`  ${dateStr}  ${rows.toString().padStart(5)} rows  (progress: ${synced} synced, ${skipped} skipped, ${failed} failed)`);
      }
    } catch (err) {
      failed++;
      console.log(`  ${dateStr}  ❌ ${(err as Error).message}`);
    }

    await sleep(SLEEP_MS);
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(0);
  console.log('\n────────────────────────────────────────────────────────────');
  console.log(`Done in ${elapsed}s — ${synced} synced, ${skipped} skipped, ${failed} failed`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('\n❌ Backfill failed:', err.message ?? err);
  mongoose.disconnect().finally(() => process.exit(1));
});
