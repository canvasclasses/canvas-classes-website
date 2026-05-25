/**
 * One-time CrUX history backfill — fetches up to ~25 weeks of weekly CWV
 * snapshots per (URL group × form factor) in a single `queryHistoryRecord`
 * call each. Seeds `crux_metrics_daily` so the web-vitals dashboard renders
 * a real trend line on first load instead of one data point.
 *
 * Usage:
 *   npx tsx scripts/seo/backfill-crux.ts          # idempotent — overwrites existing rows
 *
 * Each weekly snapshot is keyed in Mongo by its `periodEnd` date so it
 * dovetails with the daily-cron rows (which also key by `periodEnd`-ish
 * dates — the cron stores under `date = today`, and history stores under
 * `date = period_end`). The result is one row per week's worth of data.
 *
 * Quota: ~16 (URLs × form factors) × 1 API call = 16 calls total. Free.
 */

import './_shim-server-only';                            // must stay first
import dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import mongoose from 'mongoose';
import { CruxMetricsDaily } from '@canvas/data/models/CruxMetricsDaily';
import { queryCruxHistory, type CruxFormFactor } from '@canvas/seo/crux-client';
import { URL_GROUPS, ORIGIN } from '@canvas/seo/url-groups';

const FORM_FACTORS: CruxFormFactor[] = ['PHONE', 'ALL_FORM_FACTORS'];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
  await mongoose.connect(process.env.MONGODB_URI);

  console.log(`\nBackfilling CrUX history — ${URL_GROUPS.length} URLs × ${FORM_FACTORS.length} form factors`);
  console.log('────────────────────────────────────────────────────────────\n');

  let totalPoints = 0;
  let noData = 0;
  let errors = 0;

  for (const urlPattern of URL_GROUPS) {
    for (const formFactor of FORM_FACTORS) {
      try {
        const history = await queryCruxHistory(
          urlPattern === ORIGIN
            ? { origin: urlPattern, formFactor }
            : { url: urlPattern, formFactor },
        );

        if (history.length === 0) {
          console.log(`  ${formFactor.padEnd(18)} ${urlPattern}  (no data)`);
          noData++;
          continue;
        }

        // Bulk-upsert all weekly periods for this (URL × form factor). Each
        // weekly snapshot is keyed by its periodEnd so re-running this script
        // overwrites in place rather than duplicating.
        const ops = history
          .filter(point => point.periodEnd)
          .map(point => ({
            updateOne: {
              filter: { date: point.periodEnd, urlPattern, formFactor },
              update: {
                $set: {
                  lcp_p75: point.lcp.p75,
                  inp_p75: point.inp.p75,
                  cls_p75: point.cls.p75,
                  lcp_good_pct: point.lcp.goodPct,
                  inp_good_pct: point.inp.goodPct,
                  cls_good_pct: point.cls.goodPct,
                  periodStart: point.periodStart,
                  periodEnd: point.periodEnd,
                },
              },
              upsert: true,
            },
          }));

        if (ops.length) {
          await CruxMetricsDaily.bulkWrite(ops, { ordered: false });
        }

        console.log(`  ${formFactor.padEnd(18)} ${urlPattern}  ${ops.length} weekly points`);
        totalPoints += ops.length;
      } catch (err) {
        errors++;
        console.log(`  ${formFactor.padEnd(18)} ${urlPattern}  ❌ ${(err as Error).message}`);
      }
    }
  }

  console.log('\n────────────────────────────────────────────────────────────');
  console.log(`Done — ${totalPoints} weekly snapshots upserted, ${noData} URL×FF had no data, ${errors} errors`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('\n❌ Backfill failed:', err.message ?? err);
  mongoose.disconnect().finally(() => process.exit(1));
});
