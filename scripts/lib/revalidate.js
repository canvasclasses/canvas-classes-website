// Fire the student app's secret-gated POST /api/revalidate after a batch
// script mutates questions_v2, so students see the change in seconds instead
// of waiting out the 28-day ISR window (cache redesign Phase 1 —
// _agents/plans/CRUCIBLE_CACHE_SEO_REDESIGN.md).
//
// Assumes the calling script already ran dotenv.config({ path: '.env.local' })
// (the canonical script preamble) so REVALIDATE_SECRET is in process.env.
// Non-fatal by design: a missed call self-heals via the ISR window, and a
// cache blip must never fail a batch whose Mongo writes already committed.

const DEFAULT_URL = 'https://www.canvasclasses.in/api/revalidate';
const MAX_PATHS_PER_CALL = 50; // mirrors the endpoint's cap

/** Build student question-page paths from _id UUIDs (+ optional chapter id). */
function questionPaths(questionIds, chapterId) {
  const paths = questionIds.map((id) => `/the-crucible/q/${id}`);
  if (chapterId) paths.push(`/the-crucible/${chapterId}`);
  return paths;
}

/**
 * POST the paths to the revalidate endpoint in chunks of 50.
 * Returns the number of paths successfully revalidated. Never throws.
 */
async function revalidatePaths(paths) {
  const url = process.env.REVALIDATE_URL || DEFAULT_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.warn('[revalidate] REVALIDATE_SECRET not set — skipping (28d ISR window will self-heal)');
    return 0;
  }

  let ok = 0;
  for (let i = 0; i < paths.length; i += MAX_PATHS_PER_CALL) {
    const chunk = paths.slice(i, i + MAX_PATHS_PER_CALL);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-revalidate-secret': secret },
        body: JSON.stringify({ paths: chunk }),
      });
      if (res.ok) {
        ok += chunk.length;
      } else {
        console.warn(`[revalidate] ${url} responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
      }
    } catch (err) {
      console.warn('[revalidate] call failed (non-fatal):', err.message);
    }
  }
  return ok;
}

module.exports = { revalidatePaths, questionPaths };
