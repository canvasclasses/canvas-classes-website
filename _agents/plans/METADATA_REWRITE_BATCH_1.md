# Metadata Rewrite — Batch 1 (drafted 2026-07-18, apply after Phase A hold week 1)

> Drafts only — nothing here is applied yet. Evidence: SEO_PLAYBOOK Part G
> (formulas + hit-list) + the 16-month GSC baseline
> (`_agents/data/gsc-baselines/`). Rank effects tracked against
> `rank-tracking-sample-2026-07-18.csv` (348 queries, 8 segments).
> ⛔ Shaurya-only to apply (inherited, QUESTION_LIBRARY_SPEC governance).

## 1. `/salt-analysis` (apps/student/app/salt-analysis/page.tsx)

**Why:** "salt analysis" bare = pos 4.4, 542 imps/28d, **0.00% CTR**. The
16-month view shows the page's winning intent was the SIMULATOR ("salt
analysis simulation" 262 clicks @ 50% CTR pos 2.2; "virtual lab"/"simulator"
variants — all faded to ~0 in the last 28d). Current title HAS "Virtual Lab"
but buried at char ~50 (mobile truncation edge).

| | Current | Draft |
|---|---|---|
| Title | `Salt Analysis: Procedure, Cation & Anion Tests + Free Virtual Lab \| Class 12` | `Salt Analysis Virtual Lab — Free Interactive Simulation + Full Procedure (Class 12)` |
| Description | (good, keep) "Free interactive salt analysis lab with step-by-step cation analysis (Groups I–VI)…" | Keep; prepend hook: `Practise salt analysis in a free virtual lab — no login.` then existing copy trimmed to 160. |

Rationale: head-term "Salt Analysis" still leads (exact match), simulator
promise moves inside the first 30 chars, "Interactive Simulation" covers the
faded winning cluster. Keywords array: fine as-is.

## 2. NCERT-PDF chapter pages (apps/student/app/download-ncert-books/[classSlug]/[chapterSlug]/page.tsx)

**Why:** biggest striking-distance cluster (~5K imps at pos 6–10:
"coordination compounds ncert pdf" 994, "amines ncert pdf" 938, "chemical
kinetics ncert pdf" 612 …). Query bigram is literally "ncert pdf" — current
title splits those words. **BUG: title/description say "2025-26" — stale
session year (Part G rule 6); competitors show 2026-27 now.**

| | Current | Draft |
|---|---|---|
| Title | `${title} — NCERT Class ${n} ${subject} PDF Download (2025-26)` | `${title} NCERT PDF — Class ${n} ${subject} Free Download (2026-27)` |
| Description | "…CBSE 2025-26 syllabus. Read online or download free." | same, with `2026-27` + front-load: `Free NCERT PDF: ${title}, Class ${n} ${subject}.` first sentence. |

Note: chapter title leads (matches query), "NCERT PDF" becomes adjacent
(match-bolding), "Free" in title (rule 7 — these ARE real PDFs, so "PDF
Download" is legitimate). Session year must roll annually — add to the
yearly checklist in Part G.

## 3. JEE-Main PYQ chapter hubs (apps/student/app/jee-main-pyqs/chemistry/[chapter]/page.tsx)

**Why:** hubs already rank #1 for some chapters; research says the full
phrase "Previous Year Questions with Solutions" wins titles (put "PYQ" in
the description), and year-ranges are the completeness signal.

| | Current | Draft |
|---|---|---|
| Title | `JEE Main ${name} PYQs — ${count} Questions with Solutions` | `JEE Main ${name} Previous Year Questions with Solutions (${count} Qs, ${yearMin}–${yearMax})` |
| Description | "…previous year questions on ${name}…" | `${count} chapter-wise JEE Main ${name} PYQs (${yearMin}–${yearMax}), each solved step-by-step with year/shift tagged. Free, no login.` |

Implementation note: `yearMin/yearMax` come from the chapter's question
`examYear`s — compute in `scripts/export_jee_main_pyqs.js` and store on the
chapter manifest entry (one field addition + re-export).

## 4. Class-9 concept pages — NEEDS ITS OWN PASS (183 ranking pages)

105K imps/28d @ 0.79% CTR, surging (86% of its 16-month impressions arrived
in the last 28d). Queries are concept-shaped ("tyndall effect class 9",
"distillation diagram class 9", "what is coagulation class 9"). Requires
reading the class-9 book page metadata template + designing a
concept-first title pattern (`<Concept> — Class 9 Science: Definition,
Diagram & Explanation | <Chapter>`). Do as its own batch after Batch 1 —
touching 183 pages' template deserves its own measurement window.

## 5. `/about` — PARKED

7,578 imps @ pos 2.3, 0.12% CTR. Rewrite depends on open decision #7
(brand face) AND the Paras-Thakur-guitarist entity collision (spec §7) —
much of this traffic is music fans who will never convert. Don't optimize
until the face decision lands.

## Apply order & measurement
1. Apply #1 + #2 + #3 in one commit (different families from the Phase-A
   question surfaces — measurement stays attributable).
2. Watch segments `simulator`, `ncert-pdf`, `exam-questions` in the rank
   sample weekly; CTR-at-position is the success metric (not clicks —
   May–July is the seasonal trough; compare YoY or CTR@pos only).
3. Roll `2026-27` → `2027-28` next May (add to Part G yearly checklist).
