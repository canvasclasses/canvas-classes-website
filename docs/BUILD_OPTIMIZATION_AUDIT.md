# Build Optimization Audit — REVISED after intense verification

**Date:** 2026-04-23
**Baseline:** `next build` takes 5.5–6 minutes
**Target:** ~2.5–3 minutes after phase 1

---

## Changes from v1 of this doc

An intense re-verification caught **3 packages that v1 said to remove but are actually in use**, and **1 config change that could corrupt mongoose**. Corrections below are in **bold**. No changes have been made to the codebase yet; the previously-applied edits were reverted via `git checkout ui`.

- **`motion` — KEEP.** Used by `components/ui/glowing-effect.tsx:5` (`import { animate } from "motion/react"`), which is rendered inside `app/physical-chemistry-hub/GasLaws.tsx` and `AtomicModels.tsx`.
- **`lottie-react` — KEEP.** Used dynamically in `components/books/renderer/blocks/AnimationBlockRenderer.tsx:18` (`import('lottie-react').then(...)`), wired into `BlockRenderer.tsx`.
- **`rss-parser` — KEEP.** Used in `scripts/blog/fetch_rss.js:20` (blog source ingestion script, referenced by `.agent/workflows/BLOG_DAILY_WORKFLOW.md`).
- **`optimizePackageImports` — drop `mongoose` from the list.** Mongoose uses the default export (`import mongoose from 'mongoose'` → `mongoose.connect`, `mongoose.model`, `mongoose.Types.ObjectId`). The Next.js optimizer is designed for named-export barrel libs; applying it to mongoose risks tree-shaking the connection pool or model registry. Keep the other 4 targets.

---

## TL;DR — Expected Savings (revised)

| Change | Est. time saved | Risk | Effort |
|---|---|---|---|
| 1. Disable Sentry `widenClientFileUpload` | 1.5–2 min | low | 1 line |
| 2. Skip ESLint during `next build` | 1–1.5 min | low (see caveat) | 1 line |
| 3. Remove 6 unused prod deps + 1 devDep | 20–40 s install; no build-time change directly | none | package.json |
| 4. Add `experimental.optimizePackageImports` (4 packages) | 15–30 s | low | 5 lines |
| 5. Disable `automaticVercelMonitors` | 10–20 s | monitoring regression, not a feature break | 1 line |
| 6. Delete 5 dead files | negligible | none | git rm |
| 7. (Later) Pre-compute `generateStaticParams` DB calls | 30–60 s | medium | ~30 min work |
| 8. (Later) Dynamic-import `openchemlib` in `MoleculeViewer` | first-load chunk -1.2 MB | low | ~10 lines |

**Realistic build time after items 1–6: ~2.5–3 minutes** (biggest wins are 1 and 2).

---

## 1. Where the 5–6 minutes actually goes

Two cost centers dominate:

1. **Sentry source-map upload.** `widenClientFileUpload: true` in `next.config.ts` makes `@sentry/webpack-plugin` emit and upload source maps for every client asset on every production build. Known 2–3× slowdown.
2. **ESLint on `next build`.** Next.js runs ESLint against the full TS surface at the end of every build unless `eslint.ignoreDuringBuilds` is set. With ~450 files and the project's rule set, this is ~1–1.5 min.

Together these explain ~3 min of the 5.5–6. The rest is ordinary TS + route compilation.

---

## 2. Unused dependencies — VERIFIED safe to remove (7 total)

Verification: grep across `app/`, `components/`, `lib/`, `hooks/`, `scripts/`, `automation/`, `server/`, `types/`, `data/`, `content/`, `public/`, `.agent/`, `_agents/`, `docs/`, `PYQ/`, `.github/`, and root `.ts`/`.js`/`.mjs` files. Excluded only `node_modules/` and `.next/`. Checked ES imports, `require()`, dynamic `import()`, and string refs in all config files.

### Remove from `dependencies` (6)

| Package | Verified status | Approx install size |
|---|---|---|
| `@react-three/fiber` | 0 imports anywhere | ~400 KB |
| `@react-three/drei` | 0 imports anywhere | ~500 KB |
| `@react-three/postprocessing` | 0 imports anywhere | ~300 KB |
| `three` | 0 direct imports; only ever pulled in as a peer of the R3F stack above, so safe to remove **together with all three R3F packages** | ~600 KB |
| `html2canvas` | 0 imports anywhere | ~400 KB |
| `string-similarity` | 0 imports anywhere | ~20 KB |

### Remove from `devDependencies` (1)

| Package | Verified status |
|---|---|
| `smiles-drawer` | 0 imports anywhere |

### DO NOT REMOVE — verified still in use

| Package | Where it's used |
|---|---|
| `motion` | `components/ui/glowing-effect.tsx` |
| `lottie-react` | `components/books/renderer/blocks/AnimationBlockRenderer.tsx` |
| `rss-parser` | `scripts/blog/fetch_rss.js` |
| `mongodb` (driver) | 20+ script files use `MongoClient` directly |
| `dotenv` | 60+ scripts load `.env.local` |
| `clsx` | `lib/utils.ts` `cn()` helper |
| `jspdf` | Dynamic import in `ExportDashboard.tsx:416` |
| `canvas-confetti` | `ConversionGame.tsx`, `SaltAnalysisQuiz.tsx` |
| `browser-image-compression` | `lib/uploadUtils.ts`, `lib/assetManager.ts` |
| `mixpanel` (server), `mixpanel-browser` (client) | Correctly split across `lib/analytics/mixpanel.server.ts` and `lib/analytics/mixpanel.ts` |

---

## 3. Dead / orphaned files — VERIFIED safe to delete

| Path | Evidence |
|---|---|
| `components/admin/LatexHighlightTextArea.tsx` | Basename appears only in this file + my audit doc. Zero other imports. |
| `components/admin/LatexPreview.tsx` | Same. |
| `components/admin/SmartUploader.tsx` | Same. |
| `app/api/v2/questions/route.ts.backup` | `.backup` extension; not a real route. |
| `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts.backup` | `.backup` extension; 76 KB of stale taxonomy data. |

### Candidates that need your decision (not deleting without your call)

| Path | Status | Notes |
|---|---|---|
| `app/api/questions/**` (V1 API) + `lib/models.ts` | Still present | `CLAUDE.md` says V1 is deprecated. Confirm no external caller hits `/api/questions/*` before deleting. |
| `backups/` (1.8 MB) | Not imported | `.gitignore` candidate. |
| `_migration/` (92 KB) | Dev-only | `.gitignore` candidate. |
| `scripts/college-predictor/data/raw/` (15.3 MB CSVs) | Source data for seed scripts | `.gitignore` candidate (move to R2 or cold storage). |

Root-level `.md` files (SECURITY_*.md, RBAC_*.md, etc.) are **not bundled** — no build impact. Pure docs hygiene; optional move to `docs/`.

---

## 4. `next.config.ts` changes — VERIFIED

### 4.1 Narrow Sentry source-map upload — biggest single win

```ts
// in withSentryConfig options
widenClientFileUpload: false,   // was: true
```

Sentry errors in the app are minimal: `captureException` is only in `app/global-error.tsx:13` (global error boundary) and `app/api/admin/debug/sentry/route.ts` (admin test endpoint). Narrowing source-map upload reduces debug quality in Sentry UI but does not break error capture. **Est. savings: 1.5–2 min.**

### 4.2 Skip ESLint during `next build`

```ts
// at top level of nextConfig
eslint: {
  ignoreDuringBuilds: true,
},
```

`eslint.config.mjs` currently has **only one rule at error level**: `@typescript-eslint/no-explicit-any`.

**Safety net:** `.github/workflows/quality.yml` runs `npm run lint` and `npx tsc --noEmit` as separate parallel jobs on every PR to `main`/`stage`/`ui` and every push to those branches. Broken code cannot be merged once branch protection is turned on (GitHub → Settings → Branches → add rule: require `ESLint` and `TypeScript` checks to pass before merging). TypeScript is still enforced directly by Vercel during `next build` regardless — skipping ESLint during `next build` does **not** skip type-checking.

**Est. savings on Vercel build: 1–1.5 min.** CI lint+typecheck runs in parallel in ~2 min on each PR.

### 4.3 Enable package-import optimization (REVISED — 4 packages, not 5)

```ts
experimental: {
  serverActions: { bodySizeLimit: '2mb' },   // existing
  optimizePackageImports: [
    'lucide-react',            // verified: used as barrel in 148 files
    'framer-motion',           // verified: barrel imports only
    '@supabase/ssr',           // verified: named imports only
    '@supabase/supabase-js',   // verified: named imports only
    // 'mongoose' — DROPPED: uses default export (mongoose.connect, mongoose.model)
  ],
},
```

**Est. savings: 200–500 KB off client bundle + 15–30 s build time.**

### 4.4 Disable Vercel cron auto-instrumentation

```ts
// in webpack block of withSentryConfig options
automaticVercelMonitors: false,   // was: true
```

`vercel.json` has one cron: `/api/blog/cron/publish` every 15 min. **That cron will still run.** You lose automatic Sentry monitor creation for it — alerting regression, not a feature break. **Est. savings: 10–20 s.**

---

## 5. Database calls during build (`generateStaticParams`) — later phase

~10 routes call Mongoose in `generateStaticParams`. Each opens a connection at build time. Serial roundtrips add 30–60 s to builds and make them fragile (if Mongo is down, deploy fails).

Two fixes, pick per route:
- `export const dynamic = 'force-dynamic'` (or `revalidate = N`) and drop `generateStaticParams`. Good for admin-ish / low-traffic pages.
- Cache results in a committed JSON file, refreshed by a script. Good for high-traffic pages like flashcards.

Design-level change — not touching in phase 1.

---

## 6. Dynamic-import opportunities (runtime only)

| File | Library | Size | Change |
|---|---|---|---|
| `components/organic-wizard/MoleculeViewer.tsx` | `openchemlib` | ~1.2 MB | Move `import * as OCL` into `await import('openchemlib')` inside the effect |
| `app/crucible/admin/components/ExportDashboard.tsx` | `jspdf` | already dynamic | fine |
| `pptxgenjs` | server-only via API route | already fine |

Doesn't help build time; helps first-load payload.

---

## 7. Assets (not build time, but initial-load gain)

Large PNGs in `public/` — total ~4.5 MB across 7 files. Your `next.config.ts` already has `formats: ['image/avif', 'image/webp']`. Run these through Squoosh / sharp CLI once and commit:
- `paaras_hero.png` 649 KB, `jee_silhouette.png` 642 KB, `neet_student.png` 604 KB, `salt_analysis_hero.png` 601 KB, `neet_silhouette.png` 552 KB, `molecular_bg.png` 537 KB, `jee_student.png` 508 KB.
- Plus `public/chapter-card-images/` — 6.5 MB total.

---

## 8. Phase-1 implementation order (what I'll do on green light)

1. Delete 5 dead files (section 3).
2. Edit `package.json` — remove 7 unused packages (section 2).
3. Edit `next.config.ts` — sections 4.1, 4.2, 4.3 (without mongoose), 4.4.
4. Edit `.gitignore` — add `*.backup`, `/backups/`, `/_migration/`, `/scripts/college-predictor/data/raw/`.
5. **I will not run `npm install` or `next build`.** You run `npm install` (with any dev server stopped first — last time it hung on a file lock) and the next `next build` to measure.

Phase 2 (on a separate pass): V1 API deletion, `generateStaticParams` work, `openchemlib` dynamic import, image conversion.
