import 'server-only';

// ============================================
// URL groups tracked for Core Web Vitals.
//
// The CrUX API accepts either a fully-qualified URL or an origin. For
// origin-level data (whole site), use ORIGIN. For per-route field data,
// the URL must match an actual URL Chrome users have visited — so we
// list the canonical paths here. Bad paths return 404 from CrUX, which
// sync-crux logs as "no_data" and skips, not as an error.
//
// To add a new tracked page, append to URL_GROUPS and the next sync run
// picks it up. No migration needed — CruxMetricsDaily keys on urlPattern.
// ============================================

export const ORIGIN = 'https://www.canvasclasses.in' as const;

export const URL_GROUPS = [
  ORIGIN,                                                  // origin-wide
  `${ORIGIN}/`,                                            // homepage
  `${ORIGIN}/handwritten-notes`,                           // the page that triggered this whole dashboard
  `${ORIGIN}/detailed-lectures`,                           // top traffic page (530+ videos hub) — added after 2026-05-25 CTR-leak fix
  `${ORIGIN}/neet-crash-course`,                           // NEET 3-month crash course hub — added 2026-05-25 alongside CTR rewrite
  `${ORIGIN}/the-crucible`,
  `${ORIGIN}/chemistry-flashcards`,
  `${ORIGIN}/interactive-periodic-table`,
  `${ORIGIN}/organic-wizard`,
  // /bitsat-chemistry-revision removed 2026-05-25 — BITSAT 2026 exam window
  // ended, page is noindex'd until refreshed for BITSAT 2027.
  `${ORIGIN}/college-predictor`,
  `${ORIGIN}/career-guide`,                                // editorial Career Guide index
  `${ORIGIN}/career-planning`,                             // hub linking predictor + guide
] as const;

export type UrlGroup = (typeof URL_GROUPS)[number];
