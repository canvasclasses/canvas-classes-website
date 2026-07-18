# Question Library — one public question surface that wins search + AI citations

> **Status:** 🟡 Phase A CODE COMPLETE (2026-07-18, uncommitted — founder reviews/commits) · **Last updated:** 2026-07-18
> **Done:** Research (4 agents) + adversarial verification (5 agents). **Phase A shipped in code:** A.1 mhchem import (QuestionMarkdown + chemistry-questions page; verified 0/4→4/4 \ce render test); A.2 SSR Crucible q content (new `QuestionContent.tsx` + pure `questionContentTransform.ts` porting MathRenderer's quirk repairs — 16/16 unit checks + 500-question live-DB sample: 12,427 math spans, 0.03% failures, all pre-existing content bugs; sr-only h1; title/OG question-text-first); A.3 robots three-bot fix (block ClaudeBot; explicit Claude-User/Claude-SearchBot; unblock meta-externalfetcher in robots.ts AND middleware NO_VALUE_BOT_RE — it was in both) + CLAUDE.md §10.6 + playbook updated; A.4 QAPage education-exception shape on all 3 surfaces (500-char caps, suggestedAnswer array removed on pyq, www-canonical fix on chemistry-questions); A.5 chemistry-questions 7d→28d; A.6 REVISED per Shaurya 2026-07-18: author = `Organization` everywhere (Paaras Sir is chemistry-only + brand-face undecided — open decision #7); the all-subjects Crucible meta description's "by Paaras Sir" replaced with subject-neutral copy.
> **Phase 0 measurement: ✅ COMPLETE 2026-07-18** — GSC URL-prefix properties added by Shaurya (the-crucible/, jee-main-pyqs/, chemistry-questions/, + forward-installed questions/ for the pilot); 16-month baseline archived (`_agents/data/gsc-baselines/`); rank-tracking sample built (348 queries, 8 segments, same folder). Measurement rule: CTR-at-position + YoY only — May–Jul is the seasonal trough, never read raw MoM clicks.
> **Pending:** Founder: commit + push + deploy Phase A → post-deploy checks → 2–4 week Phase A hold → Batch-1 metadata rewrites (drafted: `_agents/plans/METADATA_REWRITE_BATCH_1.md`) → Phase B canonicals → Phase C pilot. Hygiene scripts written + dry-run-verified (79 applicableExams backfill; 5 TEMP re-IDs) — run with `--apply` on founder go. Content fixes in admin: AMIN-017 + MTRX-141 (`$` splits an expression mid-span).
> **Blocked on:** ⛔ Shaurya-only execution (see Governance; confirmed for 2026-07-18 session). Phase C additionally gated on cache-redesign Phase 0/1 post-deploy verification (needs the deploy).
> **Next action:** Founder commit/deploy Phase A; post-deploy live check: fetch a /the-crucible/q/ page and confirm stem/solution text present in raw HTML + admin-edit→seconds freshness test.

## ⛔ GOVERNANCE — SHAURYA-ONLY (inherited, and it applies to this whole spec)

This spec **absorbs Phases 3–5 of [`CRUCIBLE_CACHE_SEO_REDESIGN.md`](CRUCIBLE_CACHE_SEO_REDESIGN.md)**, whose backlog carries a hard ownership rule. That rule inherits here in full:

> **Execution of ANY phase in this spec is reserved for Shaurya.** Any agent asked
> to execute an item MUST FIRST ask the human to confirm they are Shaurya — every
> session, even if a previous session already confirmed. If not confirmed, do not
> execute; explain the reservation and stop. Reading/explaining this spec is fine
> for anyone.

Identity confirmations log: 2026-07-18 (session that wrote this spec — Shaurya confirmed, spec written; no implementation yet).

---

## 1. North star

**One free, robot-readable Question Library that wins exact-question searches and AI citations; login gates the tools and the media, never the text answers; the Crucible app is the product it feeds.**

The founder's funnel: student searches a question (Google / ChatGPT / Gemini / Meta AI / Lens) → Canvas page ranks or is cited → student lands on a free full TEXT solution → the login gate sits on tools and media (attempt mode, progress, next-question, video/audio solutions) → the Crucible app takes it from there. **What (if anything) is paid is deliberately undecided and out of this spec's scope — do not infer a paid boundary from anything here.**

## 2. Verified reality this is built on (evidence, not vibes)

All claims below were adversarially verified 2026-07-18 (5 agents; file:line + primary sources in session notes).

1. **Our biggest surface is invisible to robots.** `packages/ui/MathRenderer.tsx` renders everything in a `useEffect`→`innerHTML` (`:17`, `:109`) — `/the-crucible/q/*` SSR HTML ships empty divs for stem/options/solution. AI crawlers see a title + 500-char JSON-LD teaser. Google indexed one page with bare title "Canvasclasses". Meanwhile we PAY full Fast-Origin-Transfer for ~171KB/page of script payload bots can't read (live-measured; readable text = 1,697 chars ≈ 1%).
2. **Our best surface is visually broken.** No `katex/contrib/mhchem` import anywhere in `apps/student` → every `\ce{...}` on `/jee-main-pyqs/*` (6,521 occurrences) renders as KaTeX parse-error text. One-line fix; working pattern in `packages/book-renderer/blocks/TextBlockRenderer.tsx:11`.
3. **Three URL families serve the same questions**, all self-canonical, all sitemapped (`sitemap.ts:124-160, :185-197, :325-364`) — confirmed cannibalization. jee-main-pyqs and Crucible pages are the same Mongo docs (`crucibleId`).
4. **QAPage is legitimate for us** — Google's education exception explicitly allows a single expert-authored answer to an exam/homework-style question (Q&A carousel). It is effectively the **last surviving education rich result**: Practice Problems dead Jan 2026, Learning Video + Course Info dead Sept 2025, FAQ rich results dead June 2026. Structured data does NOT affect AI Overviews at all (Google: no special markup needed).
5. **Bank inventory (Mongo audit 2026-07-18):** 17,898 published; 0 missing display_id; 0 missing chapter_id; all 89 chapters resolve in taxonomy. Gaps: 4,715 without `solution.text_markdown` (→ launch universe ≈ **13,183** indexable pages), 79 with empty `applicableExams`, 5 TEMP-* display_ids, `ch12_biomolecules` missing a chapter→subject mapping, zero biology questions yet.
6. **Market:** only free-answer players (Sarthaks) win the exact-question long tail; all gaters (PDF/email/login walls: MathonGo, Selfstudys, Embibe, Vedantu, PW, Careers360) ceded it; Doubtnut gated video solutions and became an Allen redirect farm; Chegg hard-gated and collapsed (−34% traffic, −68% keywords) under AI substitution. A cacheable, un-gated, one-URL-per-question HTML page with full solution + correct schema is a lane no incumbent occupies well.
7. **Cost-safe:** Library at 28d windows + on-demand `generateStaticParams` ≈ 1–2K ISR write-units/day steady state (~2% of the old 59–77K/day baseline); 301s incur zero ISR writes. Deploy cadence is the dominant residual cost (deployment-scoped cache) — the Ignored Build Step script (faaf638) already mitigates.
8. **Red-team corrections adopted:** no big-bang new-root 301s (4–12 week air-pocket risk); realistic indexation for low-authority programmatic inventory is 10–30% in months 1–6 (target 30–50% by month 6 with staged rollout); Google Lens photo-search is a first-class channel (students photograph questions — verbatim stem text must be crawlable); tools-only login gating is unvalidated in this market (attempt-before-reveal for everyone, login to SAVE).

## 3. URL architecture

```
/questions/{exam}/{subject}/{chapter-slug}/{stem-slug}-{display_id}
 e.g. /questions/jee/chemistry/thermodynamics/work-done-adiabatic-process-thermo-186
```

- **`{exam}` = exam APPLICABILITY, not PYQ provenance** — `applicableExams[0]` lowercased (`jee` | `neet`). Non-PYQ "famous" questions live at the same scheme; PYQ year/shift appears on-page (badge + title via `formatExamLabel`) and in schema — **never in the URL**. The 79 empty-`applicableExams` docs get a backfill script (subject default: chem/phys/maths → `['JEE']`, bio → `['NEET']`) — no third path segment; a `/questions/practice/` catch-all would fragment the pattern Google evaluates.
- **`{subject}`** from a new canonical chapter→subject map in `packages/data/taxonomy/` (must cover `ch12_biomolecules`).
- **`{chapter-slug}`** from the taxonomy chapter table (stable; rename ⇒ 301).
- **`{stem-slug}`**: extend `buildQuestionSlug` (`scripts/export_jee_main_pyqs.js:61-91` — slugified stem, LaTeX/images stripped, ≤80 chars) with boilerplate-opener stripping ("which of the following…", "choose the correct…") so meaningful words lead. **Minted once, stored on the question doc, frozen forever** (edits to the question never regenerate it).
- **`{display_id}` suffix** = uniqueness + lookup anchor (Stack-Overflow pattern; our prefixed IDs are self-delimiting, unlike bare numeric IDs). Resolution: parse trailing display_id → lookup → **301 to canonical path if the requested path differs** (typo-proof, reclassify-proof). Re-ID the 5 TEMP-* questions first.
- **Reclassify rule:** chapter move ⇒ path changes ⇒ old path 301s via the display_id anchor, and the revalidation bridge must fire for BOTH old and new paths.

## 4. On-page rules (every Library question page)

1. **Server-rendered everything** — stem, options, solution in real HTML (ReactMarkdown + remark-math + rehype-katex, the proven jee-main-pyqs path) + `import 'katex/contrib/mhchem'`. Port MathRenderer's ~200 lines of DB-quirk preprocessing (brace-less `\ce` repair, MTC pseudo-table synthesis, `^*` normalization — `MathRenderer.tsx:49-63, :74-81, :139-183`) into a shared **pure** transform in `packages/*` used by both renderers.
2. **Question stem as `<h1>`**, verbatim (Lens/exact-paste matching) — slug cleaning never applies to visible content. Answer-first layout: correct option + 2-line takeaway near the top, then the full 6-section taught solution. Free. No wall.
3. **Title** = question text first, `(JEE Main 2023)` style tag when PYQ, display_id trailing — never leading (current Crucible titles lead with `GOC-524:`, `page.tsx:64` — wasted slot).
4. **Structured data:** QAPage under the education exception (single expert `acceptedAnswer`, consistent ~500-char cap policy across surfaces) + `BreadcrumbList` + author = **`Organization` (Canvas Classes), NOT a Person** — see open decision #7: Paaras Sir teaches chemistry only (a Person credit on the all-subjects surfaces would mis-attribute physics/maths solutions), and whether the teacher is the public face of the brand is undecided. **Do NOT add** FAQ / Practice-Problems / Learning-Video / Course-Info markup (all dead) or Math-Solver (wrong eligibility). No paywall markup at launch (nothing is gated); if metering is ever A/B-tested, add `isAccessibleForFree` + `hasPart` cssSelector THEN (Google's sanctioned pattern — gating without it = cloaking risk).
5. **Hub-and-spoke crawl paths:** every question ≤3 clicks from its chapter hub; prev/next-question links within a chapter; hubs link every leaf; zero orphans. Images get descriptive alt text (Lens).
6. **Caching:** `export const revalidate = 2419200` (28d) + `generateStaticParams` returning `[]` + event-driven bridge refresh. CLAUDE.md §10 applies in full. ⚠️ Next.js 16 removes route-segment revalidate under Cache Components — revisit at upgrade.
7. **Indexing gate:** only solution-complete questions enter sitemaps (launch universe ~13,183). Stubs stay out until solved (scaled-content-abuse defense: one thin page can stall the whole URL pattern).

## 5. Phases (re-sequenced per red-team; each gate is a hard stop)

### Phase 0 — Measurement baseline (BEFORE any change)
GSC URL-prefix properties for all 3 existing families (+ `/questions/` later); full 16-month GSC query/page export NOW (retention limit); ~300–500-query rank sample (exact-question + chapter + brand); AI-crawler hits (Claude-SearchBot, OAI-SearchBot, PerplexityBot) + AI referrers (chatgpt.com, perplexity.ai) logging; per-segment indexation dashboard (ties into SEO Dashboard PR 2). **Also: confirm cache-redesign Phase 0/1 post-deploy verification** (edit→seconds freshness; ISR writes ~¼ baseline).

### Phase A — Fix existing surfaces (ZERO URL changes; hold 2–4 weeks; measure in isolation)
1. **mhchem one-liner** in the jee-main-pyqs markdown path (kills 6,521 broken formulas on the ranking surface). Cheapest, first.
2. **SSR the Crucible q content** — swap MathRenderer for the shared server-safe renderer on `/the-crucible/q/*`; add `<h1>`; fix title order.
3. **robots.ts three-bot fix:** BLOCK `ClaudeBot` (Anthropic's training crawler per their own docs); explicitly ALLOW `Claude-User` + `Claude-SearchBot`; UNBLOCK `meta-externalfetcher` (user-triggered Meta AI fetcher — WhatsApp reach; keep `Meta-ExternalAgent` blocked). Update stale CLAUDE.md §10.6 + SEO_PLAYBOOK Part A #5. Everything else verified correct (incl. keeping Google-Extended blocked — it does NOT affect Search/AI Overviews).
4. **QAPage shaping** to the education-exception form on all surfaces; consistent acceptedAnswer cap. (Hygiene — expect zero ranking movement; don't let it delay items 1–2.)
5. **Interim:** `chemistry-questions` revalidate 604800 → 2419200 (last family on the old expiry-resonance window).
6. Author/entity markup: `Organization` only for now — Person attribution and
   the teacher/About entity build-out are GATED on open decision #7 (brand
   face undecided; Paaras Sir is chemistry-only so per-subject authorship is
   a prerequisite for any Person rollout).

### Phase B — Deduplicate, reversibly (canonicals, NO 301s)
For the ~1,868 questions with jee-main-pyqs twins: point the Crucible UUID page's canonical at the twin (today's best page). Reversible sticky-note, not a moving truck. Nothing is deleted, nothing redirects.

### Phase C — Gated pilot (~1–2K pages, one subject ~10 chapters, chemistry)
Launch `/questions/*` for the pilot set only: solution-complete pages, full hub-and-spoke, segmented sitemaps (≤2K URLs/segment for diagnosability), internal links wired from notes surfaces (the `crucibleChapterId` plumbing exists; today there are ZERO links from notes/class/blog surfaces to any question leaf — untapped 9.3%-CTR authority). Pre-launch data hygiene: 79-doc `applicableExams` backfill, 5 TEMP re-IDs, chapter→subject map, slugs minted + stored.
**Gate: ≥40% of pilot indexed + impression growth at 4–8 weeks.** If it stalls: fix crawl paths/quality before adding a single page.

### Phase D — Scale + migrate (only after the gate)
Tranche by subject/chapter, same gate per tranche. Then 301s, weakest family first: `chemistry-questions` → Library; then Crucible UUID leaves → Library twins; `/jee-main-pyqs/*` LAST — or stays, if its data says leave it (open decision §7). Watch the rank sample daily during each family's migration. **Never de-index/redirect a page before its twin is confirmed indexed.**

### Phase E — Funnel (thin, lands with the pilot)
**Attempt-before-reveal as the default interaction for EVERYONE** (no login to reveal; login to SAVE progress/streaks) — habit forms pre-signup. Google One Tap / phone-OTP (email login is friction in this market) + WhatsApp capture ("today's PYQ set"). Chapter progress ("3/58 solved"), bookmarks, next-question → login. Defer PDF packs/metering experiments until organic sessions exist to convert.

### Phase F — Authority & channels (ongoing)
Monthly GSC striking-distance loop (starts the month the pilot indexes). YouTube: 20–30 chapter-level "hardest PYQs" videos on hubs (NOT per-question — treadmill). Hindi-medium NEET pages: post-pilot, winning clusters first, hreflang, teacher-reviewed translations. Quora/Reddit/Telegram seeding as founder side-work. Scraper ops ~2 hrs/month (attribution naturally embedded in solution prose, watermarking on diagrams, fast sitemap pings on publish, DMCA only for rank-displacing copies).

## 6. Engineering touch-points (verified against code 2026-07-18)

| Touch-point | Change |
|---|---|
| `apps/student/app/questions/[exam]/[subject]/[chapter]/[slug]/page.tsx` | New route: SSR, `revalidate = 2419200`, `generateStaticParams` → `[]`, display_id resolution + 301-to-canonical |
| Shared slug/path builder | New, in `packages/*` (data or services) — single implementation for pages, sitemap, bridge |
| `apps/student/app/api/revalidate/route.ts:18-26` | Extend `ALLOWED_PATHS` whitelist: `/questions` leaf + 3 hub levels |
| `packages/services/revalidate-bridge.ts:27-36` | `questionPagePaths()` signature grows (display_id, exam, subject, chapter-slug, stem-slug); reclassify must emit OLD + NEW paths |
| Bridge callers | `packages/services/questions-by-id.ts` PATCH/DELETE, admin reclassify route, `scripts/lib/revalidate.js` — pass the extra fields |
| `apps/student/app/sitemap.ts` | Segmented sitemap index for `/questions/*` (absorbs cache-redesign Phase 3); legacy families shrink as migrated |
| `apps/student/middleware.ts` | NO change needed — bot 403 covers all paths; cookie-refresh tree excludes `/questions/*` by default (verified) |
| `questions_v2` docs | New stored `slug` field (minted once); backfills per §5 Phase C |
| Env / Vercel | None — bridge secret/URL already set both sides (2026-07-16) |

## 7. Open decisions (decide with pilot data, not now)

1. **Final 301 survivor:** `/questions/*` is the working assumption (root name must hold NEET + non-PYQ, which `/jee-main-pyqs` can't; Crucible UUIDs need migration regardless). Confirmed only after pilot indexation ≥ gate.
2. **`/jee-main-pyqs/*` keep-vs-fold:** it ranks today; folding is optional and last. (Diverges from the cache-redesign Phase-5 lean "upgrade crucible in place, 301 pyqs into it" — recorded there as superseded.)
3. **`data-nosnippet` on the final-answer line:** trade-off = SERP click protection vs AI-citation input (meta-description "leak" itself is moot — Google rewrites 62–87% and snippets come from page content). Decide per-surface with pilot CTR data.
4. Hindi rollout timing; YouTube cadence.
5. **Teaser-boundary experiment (post-pilot only; decided 2026-07-18 with Shaurya):**
   at launch the public page shows EVERYTHING (question, options, answer, all 6
   solution sections) — the rich sections are the thin-content defense and must be
   on-page while the pilot passes its indexation gate. AFTER the pilot proves out,
   optionally A/B a **free-login gate** on the two teacher's-edge
   sections only (⚠️ Where Students Get Stuck, 💡 A Different Angle), blurred with
   a hook line, declared via `isAccessibleForFree:false` + `hasPart` cssSelector
   (sanctioned pattern — see §4.4). NEVER gate the question, the correct answer,
   or 🗺️ Working It Out. Ship only if login-conversion uplift beats any
   indexation/citation dip on the test slice.
6. **Free-boundary + media policy (decided 2026-07-18 with Shaurya; supersedes
   this item's first draft):** Free forever = **question, options, correct answer,
   full TEXT solution — nothing else.** ALL media sits behind the free-login gate
   from day one: video solutions (`solution.video_url` + `video_timestamp_start`)
   — **no public-YouTube exception**; many of those videos are private/unlisted,
   so never assume a video is embeddable without login — and audio/voice
   (`solution.assets.audio[]`). Rationale: Google judges page richness on text
   and AI engines can't inline media, so gating media costs zero SEO/GEO and is
   the natural login hook. Implementation rule: gated media must NOT carry
   `VideoObject` (or similar) markup claiming on-page playability — schema only
   on media an anonymous visitor can actually play. **The paid tier is
   deliberately UNDECIDED — this spec says nothing about what is paid.**
7. **Teacher attribution & brand face (raised by Shaurya 2026-07-18):** Paaras
   Sir teaches CHEMISTRY only — never credit him on physics/maths content
   (the all-subjects surfaces use `Organization` author + subject-neutral
   copy for this reason). Whether Paaras Sir becomes the public face of
   Canvas Classes is an OPEN brand decision; until it's made, no NEW Person
   attribution anywhere. Known pre-existing public attributions (live today,
   left as-is pending the decision): the jee-main-pyqs surface's
   `PAARAS_PERSON` JSON-LD + "Detailed solution by Paaras Sir." meta
   descriptions (chemistry-only, so factually accurate). If the decision is
   "no face," strip those; if "yes," build the per-subject author map
   (chemistry → Paaras Sir; physics/maths → their actual authors or
   Organization) before any wider rollout.
   **⚠️ Entity-collision fact (16-month GSC, 2026-07-18): "Paras Thakur" is
   also The Local Train's famous lead guitarist — the 28d "paras thakur"
   impressions (3,164) are substantially music-fan queries ("paras thakur
   fender guitar" pos 2.0, "the local train paras thakur lead guitarist"
   pos 2.2 land on OUR site). A face strategy under this name fights a
   stronger existing entity in Google's graph; if "yes-face," always use the
   distinct full form "Paaras Sir / Paaras Thakur Canvas Classes" and expect
   entity disambiguation work. Do NOT read bare "paras thakur" impressions
   as teacher demand.

## 8. Explicitly rejected (do not resurrect without new evidence)

Login/paywall on solution content (Chegg's grave; kills long tail + GEO) · email-walled PDFs (Selfstudys trust tax) · big-bang new-root migration with immediate 301s (air-pocket) · dropping QAPage (education exception makes it our last rich result) · FAQ/Practice-Problems/Learning-Video/Course-Info/Math-Solver markup (dead or wrong-eligibility) · `/id/slug` URL format (wastes a segment; prefixed display_ids don't need it) · query-param question URLs (breaks §10 caching + SEO) · Web Stories / Discover chasing · per-question video program · blanket nosnippet.

## 9. The ritual (per CLAUDE.md §0.5 / §7)

Every session that advances this: update this header + the PROJECTS.md row; record surface changes in `_agents/SEO_PLAYBOOK.md`; changelog below; GBrain-log decisions per §11. Re-confirm Shaurya before executing.

## Changelog
- **2026-07-18** — Spec written after 4-agent research + 5-agent adversarial verification. Absorbs cache-redesign Phases 3–5 (Phase 2 stays there). Shaurya confirmed for the session; no implementation yet.
