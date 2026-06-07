# SEO & GEO Playbook — the single record for the whole project

> **This is THE one place that records all SEO and GEO (generative-engine /
> AI-engine optimization) work on the project.** Read it before changing any
> public page's metadata, caching, structured data, sitemap, robots, redirects,
> or before adding new public/programmatic pages — so existing work isn't
> reverted or duplicated.
>
> If code and this doc disagree, fix whichever is wrong and update the Changelog.

- **Owner:** Canvas (paaras.thakur07@gmail.com)
- **Last updated:** 2026-06-06
- **Scope:** `apps/student/` (all public, indexable pages). The admin app is
  intentionally not indexed.

> **Split trigger (housekeeping rule):** keep this as ONE file while it stays
> scannable. **If it passes ~600 lines, or the Career section (Part E) balloons,
> split that section back into its own `_agents/CAREER_SEO_GEO.md` and link it
> from here.** Single-file simplicity now; a principled exit later — not an
> arbitrary one.

---

## Contents
- **Part A — Site-wide conventions** (canonical domain, caching, sitemap, robots, redirects, OG, schema helper)
- **Part B — SEO surface inventory** (what's optimized, by section)
- **Part C — Do-NOT-revert decisions** (the load-bearing fixes)
- **Part D — GEO strategy** (getting cited by AI engines)
- **Part E — Career segment** (the deep, feature-specific record)
- **Part F — Monitoring** + Known gaps + Changelog

---

## Part A — Site-wide conventions

1. **Canonical domain = `https://www.canvasclasses.in`** (with `www`), everywhere.
   Never `canvasclasses.com` (a dead/foreign domain — see Part C) and never bare
   `canvasclasses.in` (it 301-redirects to `www`). This matches `sitemap.ts`
   `BASE_URL`, `robots.ts`, and the root `layout.tsx` `metadataBase`.
2. **Caching/rendering is governed by `CLAUDE.md §10` — read it; do not duplicate
   its rules here.** Summary: every public page is cacheable (`export const
   revalidate = <secs>`, default 3600, "effectively static" 86400). **Never
   `force-dynamic` / `revalidate = 0` on public pages** (that caused the June 2026
   Vercel bill spike). Auth/searchParams go in client islands, not server reads.
3. **Global metadata** lives in `apps/student/app/layout.tsx`: title template
   (`%s | Canvas Classes`), `metadataBase`, default OG/Twitter, `en-IN` + `x-default`
   hreflang, Google verification, and an `EducationalOrganization` JSON-LD block.
4. **Sitemap** (`apps/student/app/sitemap.ts`, ISR 86400) enumerates everything —
   static pages + dynamic blocks (questions, crucible chapters/questions, flashcards,
   book pages, blog, NCERT solutions/PDFs, handwritten notes, quizzes, JEE-Main PYQs,
   detailed lectures, career topics/specs/explorer, college-predictor landings/colleges).
   **New content in those collections auto-appears** on the next 24h revalidate.
5. **robots.ts** (`CLAUDE.md §10.6`): blocks AI **training** crawlers (GPTBot,
   Google-Extended, CCBot, …); **allows** AI **answer** crawlers (ChatGPT-User,
   OAI-SearchBot, PerplexityBot, ClaudeBot, Googlebot, Bingbot). Disallows `/api/`,
   admin, dashboard, login. **Do not block the answer bots — that breaks GEO.**
6. **Redirects** (`apps/student/next.config.ts`): non-www → www (301); plus
   canonical moves (`/books/ncert-simplified/*` → `/class-11/chemistry/*`,
   `/jee-pyqs/*` → `/the-crucible`, flashcard renames). Preserve these.
7. **Structured-data helper:** reuse `apps/student/app/components/BreadcrumbSchema.tsx`
   for breadcrumbs (it safely escapes JSON-LD). For Mongo-sourced inline schema,
   escape with the `.replace(/</g,'\\u003c')…` chain.
8. **OG images:** dynamic per-page OG generation exists for Live Books
   (`class-9/opengraph-image.tsx`, `class-9/[bookSlug]/[pageSlug]/opengraph-image.tsx`).
   Career briefs use an API-generated brief image.

**Schema types in use across the site:** `EducationalOrganization` (global),
`Article`, `BreadcrumbList`, `FAQPage`, `CollectionPage`, `ItemList`,
`CollegeOrUniversity`, `Occupation`, `WebApplication`, `WebPage`.

---

## Part B — SEO surface inventory

~82 pages carry custom metadata; ~46 emit JSON-LD. Grouped by role (not per-file —
read the code for line detail):

### Programmatic-SEO sections (auto-generated at scale — the highest-traffic SEO assets)
| Section | Routes | Schema | Sitemap block |
|---|---|---|---|
| Chemistry questions | `/chemistry-questions` (+ chapter + per-question) | FAQ/Question | `questionEntries` |
| JEE Main PYQs | `/jee-main-pyqs` (hub/subject/chapter/question) | yes | `jeeMainPyqEntries` |
| Crucible | `/the-crucible/[chapter]`, `/the-crucible/q/[id]` | yes | `crucibleChapter/QuestionEntries` |
| NCERT solutions | `/ncert-solutions/class-N/[chapter]` | Breadcrumb | `ncertChapterEntries` |
| NCERT PDF downloads | `/download-ncert-books/class-N/[slug]` | yes | `ncertPdfChapterEntries` |
| Handwritten notes | `/handwritten-notes/[chapter]` | yes | `handwrittenChapterEntries` |
| Flashcards | `/chemistry-flashcards/[chapter]` | yes | `flashcardChapterEntries` |
| Quizzes | `/quiz/chemistry` (+ per-quiz) | yes | `chemistryQuizEntries` |
| Detailed lectures | `/detailed-lectures/[chapter]` | yes | `detailedLectureEntries` |
| Blog | `/blog/[slug]` | yes | `blogEntries` |
| Live Books | `/class-9/*`, `/class-11/chemistry/*`, `/class-12/*` | yes | `bookPageEntries` |
| **Career segment** | see **Part E** | Article/FAQ/ItemList/Occupation/College | career blocks |

### Hubs, landings & tools (curated SEO pages)
- **Subject hubs:** `/organic-chemistry-hub`, `/inorganic-chemistry-hub`,
  `/physical-chemistry-hub`, `/mechanics-hub` (+ sub-pages).
- **Class / exam landings:** `/cbse-class-10|11|12`, `/class-9|10|11|12`,
  `/neet-crash-course`, `/one-shot-lectures`, `/detailed-lectures`.
- **Interactive / tools:** `/interactive-periodic-table`, `/periodic-trends`,
  `/salt-analysis`, `/solubility-product-ksp-calculator`, `/organic-wizard`,
  `/chemihex`, `/2-minute-chemistry`, `/quick-recap`, `/top-50-concepts`,
  `/organic-name-reactions`, `/assertion-reason`.

### Notes
- `/_bitsat-2026-archive` is **noindex'd** (exam window ended) and removed from the
  sitemap — keep it out until refreshed for 2027.
- Per-user / interactive flow pages (career-explorer questionnaire/results/vision,
  account) are `force-dynamic` and correctly **not** indexed.

---

## Part C — Do-NOT-revert decisions (load-bearing)

These were deliberate and are expensive to undo silently:

1. **No `force-dynamic` on public pages** + the `revalidate` windows (3600 / 86400).
   Reverting this re-triggers the June 2026 Vercel bill spike (~10× outbound + ISR
   writes). Full story: `CLAUDE.md §10`.
2. **robots.ts bot policy** — block training bots, allow answer bots. Loosening the
   first costs bandwidth; blocking the second kills AI-citation discovery.
3. **Canonical domain = `www.canvasclasses.in`.** Fixed 2026-06-06 after the career/
   college pages were found canonicalising to a dead `canvasclasses.com` (see Part E
   §4 and `~/brain/reference/bugs/2026-06-06-career-canonical-com-domain-bug.md`).
4. **`AuthButton` stays a Client Component** (`features/auth/`) — converting it to a
   Server Component re-introduces the E132 layout trap that flips every page dynamic
   (`CLAUDE.md §10.4`).
5. **Canonical-move 301s** in `next.config.ts` — deleting them drops the SEO equity
   from the old URLs.

---

## Part D — GEO strategy (AI-engine / generative-engine optimization)

Goal: be the source ChatGPT / Gemini / Perplexity / Google AI Overviews cite when
students ask directly, instead of typing keywords.

- **Foundation (done):** answer-bots allowed in robots; FAQ + structured data on key
  pages; named authors + sources on editorial content.
- **What actually wins citations:** a direct, quotable answer in the first 1–2
  sentences; question-shaped headings; numbered lists; dated facts ("as of 2026");
  comparison tables; visible sources. (LLMs lean on visible text; schema is a bonus
  for Google's AI Overviews.)
- **Ranked-listicle play** (career segment, Part E §3): explicit ranked pages with a
  one-sentence enumerated answer + table + numbered list, to win "top/best/highest-
  paying … 2026" queries. This pattern is reusable for other ranking-type queries.

---

## Part E — Career segment (deep record)

> The "Plan Your Career" segment is the most heavily SEO/GEO-optimized area, so it
> carries the most detail. (If this section grows much larger, apply the split
> trigger at the top of this doc.)

### E.1 Page inventory
All paths under `apps/student/app/`.

**Career Guide — `/career-guide/*`** (editorial briefs; the GEO content engine)
| Route | File | Caching | Schema |
|---|---|---|---|
| `/career-guide` | `career-guide/page.tsx` | ISR 86400 | CollectionPage + ItemList (+ "Ranked guides" link block) |
| `/career-guide/[slug]` | `career-guide/[slug]/page.tsx` | ISR 86400 | Article + BreadcrumbList + FAQPage |
| `/career-guide/topics/[slug]` | `career-guide/topics/[slug]/page.tsx` | ISR 86400, `generateStaticParams` | Article + Breadcrumb + FAQPage (+ ordered ItemList/Occupation when ranked) |

Data: `CareerSpec` (Mongo `career_specs`, 12 published). `topics.ts` holds the
`TOPICS` array (curated + ranked formats). `buildFaqs.ts` generates per-brief FAQs.

**Career Planning — `/career-planning`** (`page.tsx`): WebPage + hasPart hub linking
College Predictor + Career Guide.

**Career Explorer — `/career-explorer/*`** (aptitude tool + career library)
| Route | Caching | Schema |
|---|---|---|
| `/career-explorer` | static | WebApplication (thin server HTML — gap) |
| `/career-explorer/browse` | ISR 86400 | CollectionPage + ItemList |
| `/career-explorer/careers/[slug]` (`[slug]` = Mongo `_id`) | ISR 86400 | Article + BreadcrumbList |
| `/career-explorer/{vision,questionnaire,results}/[profileId]` | force-dynamic | none (per-user; not indexed) |

Data: `CareerPath` (Mongo `career_paths`).

**College Predictor — `/college-predictor/*`** (tools + cutoff pages)
| Route | Caching | Schema |
|---|---|---|
| `/college-predictor` | static | FAQPage + BreadcrumbList + ItemList |
| `/college-predictor/branch-finder` | ISR 86400 | FAQPage |
| `/college-predictor/compare` | ISR 86400 | FAQPage |
| `/college-predictor/[slug]` (10 regional/type landings) | ISR 86400, `generateStaticParams` | FAQPage |
| `/college-predictor/college/[slug]` (~100+ cutoff pages) | ISR 86400 | CollegeOrUniversity + Breadcrumb + FAQPage |

Data: `College` (Mongo); `features/college-predictor/{data/landingConfig,lib/deepDive}`.

### E.2 GEO ranked-listicle system (`/career-guide/topics/[slug]`)
Topics live in `features/career-guide/data/topics.ts`. Two formats, switched by the
optional `ranked` field:
- **Curated** (no `ranked`): hero + unordered featured grid + framings + FAQ.
  (Originals: `best-after-jee-main`, `neet-non-mbbs-paths`, `ai-careers-india`,
  `highest-paying-india-2026`.)
- **Ranked** (`ranked` present): hero + **quotable answer paragraph** + **comparison
  table** + numbered **`<ol>`** (reason/pay/AI-risk per rank) + **methodology** block
  + cross-links. Emits ordered `ItemList` of `Occupation` (salary markup) + `FAQPage`.

**The 3 ranked guides (2026-06-06):** `top-engineering-careers-2026`,
`highest-paying-engineering-careers-india-2026`, `engineering-careers-next-decade`.
All rank the same 8 engineering(-adjacent) careers (quant-developer,
ai-evaluations-engineer, ml-engineer, software-engineer-product, data-engineer,
semiconductor-engineer, robotics-engineer, energy-materials-engineer). **All
pay/AI numbers are read live from `CareerSpec` — never hardcoded.**

`ranked` shape: `{ asOf, criterion, answerSummary, methodology[], items:[{slug, reason, suitsYouIf?}] }`.
`featuredSlugs` must list the same slugs in the same order (drives the Mongo fetch).

### E.3 Decisions
1. **Canonical fix (2026-06-06):** standardized the whole segment on
   `www.canvasclasses.in` (was `canvasclasses.com`, a dead domain). See Part C §3.
2. **Honest titles:** 8 briefs, not 10 → "best engineering careers… (ranked)", not
   "Top 10". Body still matches "top 10" searches. Grow to 10 as briefs ship.
3. **Keep both highest-paying pages, cross-link:** curated all-category one + the new
   engineering-only ranked one are separate, cross-linked.
4. **FAQPage schema on ALL topic pages** (was briefs-only).
5. **Ranking is data-backed** (real income + AI-exposure), with a visible methodology.

### E.4 How to extend
- **New brief:** seed a published `CareerSpec` (`scripts/career-specs/seed_*.js`) +
  add a `CARD_META` visual entry. Auto-flows to index, sitemap, and any topic listing it.
- **New curated topic:** append a `Topic` (no `ranked`) to `TOPICS`.
- **New ranked listicle:** append a `Topic` with `ranked`; set `featuredSlugs` +
  `ranked.items` to the same slugs in rank order; write `answerSummary` (enumerate the
  list in one sentence — this is what AI engines cite), `criterion`, `methodology`,
  per-item `reason`. Numbers render automatically; cross-links are automatic.

---

## Part F — Monitoring, gaps, changelog

### Monitoring
- `_agents/plans/SEO_DASHBOARD.md` — the **admin** GSC + Core-Web-Vitals dashboard
  (`admin.canvasclasses.in/seo`). Catches ranking/CWV regressions from a daily cron.
- `_agents/college-data-research-2026-06.md` — dataset behind College Predictor.
- GBrain: `~/brain/reference/bugs/2026-06-06-career-canonical-com-domain-bug.md`,
  `~/brain/decisions/2026-06-06-career-geo-ranked-listicle-strategy.md`.

### Known gaps / TODO
- Only ~8 engineering briefs — a literal "top 10" needs 2–4 more (civil, chemical,
  aerospace, biomedical).
- `/career-explorer` landing is thin server HTML (client-rendered) — weak for AI/Google.
- Counselling-season "freshness" (live JoSAA 2026 round framing) deferred — needs real
  dates, must not be fabricated.
- No tracking yet for whether pages actually get cited in AI-engine answers.
- College-predictor tool/landing pages lack a Twitter card (only `college/[slug]` has one).

### Changelog
- **2026-06-06** — Playbook created as the single SEO/GEO record; folded in the career
  segment record (formerly `_agents/CAREER_SEO_GEO.md`). Captures: site-wide
  conventions, surface inventory, do-not-revert decisions, GEO strategy, and the
  career canonical-domain fix + sitemap additions + ranked-listicle pages.
