# Systems map — how the pieces connect (and where the gaps live)

> The gap auditor's territory. This maps the **joints between systems** — the places where one system depends on another and a silent drift can open a gap nobody sees. For each joint: what connects, and what breaks if it drifts.

## The systems
1. **Crucible question bank** (`questions_v2`) — questions, options, solutions, metadata, flags.
2. **Taxonomy** (`packages/data/taxonomy/taxonomyData_from_csv.ts`) — Chapter → Topic Tag → micro-topics.
3. **Live Books** (`book_pages`, R2 assets) — pages, content blocks, video/audio/image references.
4. **Persona / adaptive engine** (`userprogress`, `StudentChapterProfile`, `packages/persona/`) — per-student state.
5. **Student app** (public, cached) — reads content; auth-aware bits in client islands.
6. **Admin app** (operator, RBAC-gated) — authoring + write APIs.
7. **Assets** (R2 `canvas-chemistry-assets`) — images/SVGs/video/audio, linked from questions + book blocks.
8. **3D anatomy sims** (`apps/student/features/anatomy/`, glbs in `apps/student/public/anatomy/`, catalog `packages/data/simulations/`) — Z-Anatomy-derived glTF organ/system models (skeleton, heart) in three.js/R3F; embedded in Live Books as `simulation` blocks + shown in the Biology Hub. North-star = the **Anatomy Explorer** (full-body multi-layer atlas). Canonical: [`ANATOMY_3D_SIMULATOR_WORKFLOW.md`](../workflows/ANATOMY_3D_SIMULATOR_WORKFLOW.md) + [`plans/ANATOMY_EXPLORER_VISION.md`](../plans/ANATOMY_EXPLORER_VISION.md). **P1 spike 2026-06-22 → GO (build on Z-Anatomy, not license BioDigital); quality-first (meshopt compression is lossless + CSP-safe, decimation minimized); lazy-load per system is mandatory (the ceiling is the GPU, not bandwidth)** — vision-doc §8.

## The joints (where gaps open)

| Joint | The dependency | What a silent drift looks like |
|---|---|---|
| Question → Taxonomy | every question's `metadata.chapter_id` + tags must match a real taxonomy entry | a question points at a chapter/tag that no longer exists → it vanishes from filtered views. **2026-06-19: dangling tags fully cleared 828 → 0 (gap-auditor severity 0); 5 new primary tags added where gaps existed.** Physics/Maths still have **zero micro_topics** in the taxonomy → can't micro-tag (known, tracked). |
| Question → Solution | a published question should have a solution | questions with no solution, or solutions with broken LaTeX, ship silently. |
| Question → Assets | a question's markdown references an R2 image/SVG | the Asset doc or R2 file goes missing → broken figure in the stem/option/solution. |
| Book block → Assets | a block references a `src`/`url`/`audio_url` | an unlinked video/audio (the **June-10 incident**) → content silently gone. Now guarded by `book-writer.js`. |
| Book content → Publish-readiness | a page shouldn't go public with placeholder images, no quiz, invalid blocks/LaTeX, or without a human sign-off | a chapter is published with pending-image placeholders or a missing quiz and nobody notices. **Surfaced by the Book Readiness dashboard** (`admin.../books/dashboard`; pure engine `packages/data/books/readiness.ts`) — per-page stage + hard blockers (pending images / missing quiz / invalid / LaTeX) + soft warnings + a separate human sign-off (`BookPage.review`); summary stored on `BookPage.readiness`, computed on every save, backfillable via `scripts/backfill-book-readiness.ts`. Cockpit row "Book Readiness Dashboard". |
| Book ↔ Crucible | books deep-link to Crucible practice; persona may recommend across surfaces | a renamed chapter id or route breaks the link. (Cross-surface recommendation was decoupled per ADR-012 — parked, not deleted.) |
| 3D sim → Hosting / Live Books | each sim's `.glb` must be served **static** from `public/anatomy/` (R2's public URL is CORS-blocked for three.js `fetch`); injected sims render only in the **published** reader + Biology Hub, not the admin preview | a glb moved to R2, or a viewer pointed at the R2 proxy → silent load hang/blank canvas; a renamed/unversioned glb → stale cache; an `EXTRA_SIMULATORS`/catalog-id mismatch → sim doesn't appear. |
| Public page → Cache config | every public page must be cacheable (CLAUDE.md §10) | a new page ships `force-dynamic`/`revalidate=0` → the **June-2026 bill spike**. A `cookies()`/`headers()` call in the layout tree flips every page below to dynamic (E132 trap). |
| Write API → Auth | every mutating route needs an auth guard (CLAUDE.md §8) | a new route ships without `requireAdmin`/`getAuthenticatedUser` → an open write path. |
| Student face → Data scope (future) | student-facing brain faces must only read published, student-safe content | a retrieval filter gap → operational docs or another student's data leak (AI_NATIVE_ROADMAP §5.2). |

## Standing checks that watch these joints (all ✅ BUILT 2026-06-18, in `scripts/watchdogs/`)
- **Content guard** (`content-guard.js`) → Book block → Assets joint + page shrink/delete; compares each live page to its latest snapshot, flags untracked loss. Recovery: `restore-helper.js`. Verified clean (673/673 pages).
- **Cost/perf sentinel** (`cost-sentinel.js`) → Public page → Cache joint; flags force-dynamic/revalidate=0/60 + layout cookies(), **and (2026-06-19) whole-site `revalidatePath('/','layout')` busts, bank-wide `revalidateTag('questions')`, and `@vercel/analytics` imports**. 2026-06-19: fixed 6 of the 7 open Vercel-cost backlog items (#16,17,19,20,21,22) + the flag-resolve bust; the 4 per-chapter `revalidateTag` calls (#18) are deferred (need a read-side cache-factory) and show as 🟡.
- **Gap auditor** (`gap-auditor.js`) → Question→Taxonomy + Question→Solution; flags orphan chapter_id, dangling tag_id, no-chapter. **2026-06-18: orphan chapter_id resolved 55 → 0** (42 orphan TEMP-* soft-deleted pending 7 missing chem chapters; 6 moved to real chapters; 7 AROM → ch11_hydrocarbon — see CRUCIBLE_STATE changelog). **2026-06-19: dangling tag_id cleanup COMPLETE — 828 → 0 (gap-auditor severity 0, morning-brief all-green).** All chemistry chapters retagged to real taxonomy tags; 5 new primary tags added where real gaps existed (haloalkanes Polyhalogen, aldehyde Prep + Nomenclature, carboxylic Acidity, GOC Reactions&Mechanisms). Remaining bank gap: 4,246 published-no-solution (backlog, not a defect). Generic catch-all maps (ch12_pblock `tag_pblock_1`, p-block dominant-theme) are baselines to refine in micro-tagging. **Known taxonomy gap: chemistry missing 7 chapters** (Solid State, Surface Chemistry, Metallurgy, Polymers, Environmental, Everyday Life, s-block).
- **Student-signal analyst** (`student-signal.js`) → high-failure / never-attempted chapters; "too sparse" until usage grows.
- **Morning brief** (`morning-brief.js`) → runs all of the above, one aggregated brief, worst-severity exit.
- **Founder advisor** (`/founder-advisor`) → the prose layer over all of it + the brain + cockpit; reports.
- **Industry scout** (`/industry-scout`) → external joint: competitor/market moves → writes to `_agents/brain/industry/`.
- **Book Readiness dashboard** (`admin.../books/dashboard`, BUILT 2026-07-10) → human-driven, on-demand pre-release gate over the **Book content → Publish-readiness** joint: pending images, missing quizzes, invalid/LaTeX, and unreviewed pages, per chapter/page across all classes. Not a scheduled script — the operator's cockpit for deciding a chapter is safe to publish.

Scheduling these (daily morning brief) is the remaining step; until then run on demand or via the advisor.
