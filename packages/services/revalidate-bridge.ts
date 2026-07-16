import { revalidatePath } from 'next/cache';

// Cross-deployment ISR invalidation bridge (cache redesign Phase 1 —
// _agents/plans/CRUCIBLE_CACHE_SEO_REDESIGN.md).
//
// revalidatePath() only affects the deployment it executes in. This shared
// service code runs in BOTH apps: when it runs inside the student app the
// local revalidatePath() below is sufficient; when it runs inside the admin
// app the student app's cached pages are only reachable over HTTP, via the
// student-hosted secret-gated POST /api/revalidate.
//
// Env (set on the ADMIN Vercel project + apps/admin/.env.local only):
//   REVALIDATE_URL     https://www.canvasclasses.in/api/revalidate
//   REVALIDATE_SECRET  shared secret the student endpoint verifies
// Leave REVALIDATE_URL unset on the student app — its own revalidatePath()
// already covers same-deployment freshness; a self-HTTP call would be waste.
//
// Every failure path here is swallowed by design: a missed invalidation is
// self-healed by the 28d ISR window, and a cache blip must never turn a
// committed Mongo write into a reported save failure (same contract as the
// other post-write side effects in questions-by-id.ts).

const MAX_PATHS_PER_CALL = 50; // mirrors the endpoint's cap
const CALL_TIMEOUT_MS = 4000;

/** Student-facing paths affected by a change to one question. */
export function questionPagePaths(
  questionId: string,
  chapterIds: Array<string | null | undefined> = [],
): string[] {
  const paths = [`/the-crucible/q/${questionId}`];
  for (const ch of chapterIds) {
    if (ch) paths.push(`/the-crucible/${ch}`);
  }
  return paths;
}

/**
 * Invalidate student-facing pages: locally (correct when running in the
 * student app) and over the HTTP bridge when REVALIDATE_URL is configured
 * (the admin app). Never throws.
 */
export async function revalidateStudentPaths(paths: string[]): Promise<void> {
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      // next/cache throws outside a request scope (e.g. scripts) — ignore.
    }
  }

  const url = process.env.REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;

  for (let i = 0; i < paths.length; i += MAX_PATHS_PER_CALL) {
    const chunk = paths.slice(i, i + MAX_PATHS_PER_CALL);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-revalidate-secret': secret,
        },
        body: JSON.stringify({ paths: chunk }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) {
        console.error(`[revalidate-bridge] ${url} responded ${res.status} (non-fatal)`);
      }
    } catch (err) {
      console.error('[revalidate-bridge] call failed (non-fatal; ISR window self-heals):', err);
    }
  }
}
