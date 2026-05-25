import 'server-only';
import { CruxMetricsDaily } from '@canvas/data/models/CruxMetricsDaily';
import { queryCruxRecord, type CruxFormFactor } from './crux-client';
import { URL_GROUPS, ORIGIN } from './url-groups';

// ============================================
// CrUX sync. One row per (date, urlPattern, formFactor) so a single dashboard
// query can plot any URL group's trend over time.
//
// For each URL group we fetch PHONE (the form factor that triggered this whole
// dashboard via the /handwritten-notes INP alert) and ALL_FORM_FACTORS.
// Desktop is omitted by default — almost all our traffic is mobile — but the
// schema supports it; flip ENABLE_DESKTOP to true if you ever want it.
// ============================================

const ENABLE_DESKTOP = false;

export interface CruxFetchResult {
  fetched: number;
  noData: number;
  errors: string[];
}

export async function syncCruxForDate(dateStr: string): Promise<CruxFetchResult> {
  const date = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`syncCruxForDate: invalid date "${dateStr}"`);
  }

  const formFactors: CruxFormFactor[] = ENABLE_DESKTOP
    ? ['PHONE', 'DESKTOP', 'ALL_FORM_FACTORS']
    : ['PHONE', 'ALL_FORM_FACTORS'];

  let fetched = 0;
  let noData = 0;
  const errors: string[] = [];

  for (const urlPattern of URL_GROUPS) {
    for (const formFactor of formFactors) {
      try {
        const record = await queryCruxRecord(
          urlPattern === ORIGIN
            ? { origin: urlPattern, formFactor }
            : { url: urlPattern, formFactor },
        );

        if (!record) {
          // Persist a "no data" row so the dashboard can distinguish
          // "not enough traffic" from "sync hasn't run yet".
          await CruxMetricsDaily.updateOne(
            { date, urlPattern, formFactor },
            {
              $set: {
                lcp_p75: null, inp_p75: null, cls_p75: null,
                lcp_good_pct: null, inp_good_pct: null, cls_good_pct: null,
                periodStart: null, periodEnd: null,
              },
            },
            { upsert: true },
          );
          noData++;
          continue;
        }

        await CruxMetricsDaily.updateOne(
          { date, urlPattern, formFactor },
          {
            $set: {
              lcp_p75: record.lcp.p75,
              inp_p75: record.inp.p75,
              cls_p75: record.cls.p75,
              lcp_good_pct: record.lcp.goodPct,
              inp_good_pct: record.inp.goodPct,
              cls_good_pct: record.cls.goodPct,
              periodStart: record.periodStart,
              periodEnd: record.periodEnd,
            },
          },
          { upsert: true },
        );
        fetched++;
      } catch (err) {
        errors.push(`${urlPattern} (${formFactor}): ${(err as Error).message}`);
      }
    }
  }

  return { fetched, noData, errors };
}
