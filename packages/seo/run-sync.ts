import 'server-only';
import { GscSyncRun, type IGscSyncRun } from '@canvas/data/models/GscSyncRun';
import { syncGscForDate, defaultSyncDate } from './sync-gsc';
import { syncCruxForDate } from './sync-crux';

// ============================================
// Single canonical entry point used by both the admin "Sync now" button
// (POST /api/v2/seo/sync) and the Vercel cron (GET /api/cron/seo-sync).
// Owns the GscSyncRun bookkeeping so both call sites get identical run-log
// records and the cron route stays a 10-line wrapper.
// ============================================

export interface RunSyncArgs {
  date?: string;                   // 'YYYY-MM-DD'; defaults to D-3
  skipCrux?: boolean;
  trigger: 'cron' | 'manual';
}

export interface RunSyncResult {
  runId: string;
  date: string;
  status: IGscSyncRun['status'];
  rowCounts: Record<string, number>;
  cruxFetched: number | null;
  errors: string[];
  durationMs: number;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function runSync(args: RunSyncArgs): Promise<RunSyncResult> {
  const dateStr = args.date ?? defaultSyncDate();
  if (!DATE_RE.test(dateStr)) {
    throw new Error(`runSync: invalid date "${dateStr}" — expected YYYY-MM-DD`);
  }
  const date = new Date(`${dateStr}T00:00:00Z`);
  const startedAt = new Date();

  // Open the run row up front so an operator looking at the sync log mid-flight
  // sees an in-progress entry rather than nothing.
  const run = await GscSyncRun.create({
    startedAt,
    finishedAt: null,
    status: 'ok',
    trigger: args.trigger,
    datesFetched: [date],
    rowCounts: {},
    cruxFetched: null,
    error: null,
    durationMs: null,
  });

  try {
    const gscResult = await syncGscForDate(dateStr);

    let cruxFetched: number | null = null;
    const cruxErrors: string[] = [];
    if (!args.skipCrux) {
      const cruxResult = await syncCruxForDate(dateStr);
      cruxFetched = cruxResult.fetched;
      cruxErrors.push(...cruxResult.errors);
    }

    const allErrors = [...gscResult.errors, ...cruxErrors];
    const finishedAt = new Date();
    const status: IGscSyncRun['status'] = allErrors.length === 0 ? 'ok' : 'partial';
    const durationMs = finishedAt.getTime() - startedAt.getTime();

    run.set({
      finishedAt,
      status,
      rowCounts: gscResult.rowCounts,
      cruxFetched,
      error: allErrors.length ? allErrors.join('\n').slice(0, 2000) : null,
      durationMs,
    });
    await run.save();

    return {
      runId: String(run._id),
      date: dateStr,
      status,
      rowCounts: gscResult.rowCounts,
      cruxFetched,
      errors: allErrors,
      durationMs,
    };
  } catch (err) {
    const finishedAt = new Date();
    const message = (err as Error).message ?? 'Unknown error';
    run.set({
      finishedAt,
      status: 'error',
      error: message.slice(0, 2000),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    });
    await run.save();
    throw err;
  }
}
