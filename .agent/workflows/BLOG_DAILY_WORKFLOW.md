# Blog Daily Workflow (scheduled-task prompt source of truth)

This document is the canonical instruction set for the daily blog pipeline. The
scheduled Claude Code task at **08:00 IST** follows this workflow end-to-end.
The task prompt itself is stored in `~/.claude/scheduled-tasks/blog-daily/SKILL.md`
and references this file.

---

## Context

Canvas Classes blog runs on MongoDB (`blog_posts`, `blog_ideas`, `blog_sources`).
Paaras wants a morning routine where:

1. Fresh education/exam news is pulled from RSS feeds.
2. Items are triaged by relevance to JEE / NEET / CBSE / chemistry students.
3. **One or two** drafts are produced and dropped in the **Review** column of
   the admin board (`/crucible/admin/blog`) by ~09:30 IST.
4. Paaras opens the admin panel around 10–11 AM, approves or edits the drafts,
   and schedules them.

No Anthropic API key is used. The drafting AI is Claude Code itself, running
inside the scheduled task.

---

## Step-by-step workflow

### Step 1 — Pull RSS feeds

```bash
cd /Users/CanvasClasses/Desktop/canvas
node scripts/blog/fetch_rss.js --hours 48
```

This writes new items into `blog_sources` with `status='new'`, deduped by URL
hash. Feeds are configured in `scripts/blog/feeds.json` — add/remove freely.

### Step 2 — Read new sources and pending ideas

```bash
node scripts/blog/list_new_sources.js --limit 40 > /tmp/blog_new_sources.json
node scripts/blog/list_pending_ideas.js > /tmp/blog_pending_ideas.json
```

These scripts dump JSON arrays of un-triaged RSS items and manually added
ideas. Read both files.

### Step 3 — Score each RSS item

For every source in `/tmp/blog_new_sources.json`, form a judgment on a
**0.0 – 1.0** relevance scale:

- **0.9 – 1.0** — directly actionable for JEE/NEET/CBSE students right now
  (exam date changes, syllabus updates, official NTA/CBSE notices, result
  announcements).
- **0.7 – 0.89** — strong editorial angle (new policy, admission trends,
  scholarship news, study-abroad shifts affecting the target audience).
- **0.4 – 0.69** — loosely relevant (general education reform, ed-tech news
  with a student angle, rankings).
- **0.0 – 0.39** — off-topic (higher-ed research, international news without
  an India angle, pure entertainment) → mark `ignored`.

Update the DB for each:

```bash
node scripts/blog/score_source.js <source_id> <score> "<1-sentence reason>" reviewed
# or, for off-topic items:
node scripts/blog/score_source.js <source_id> 0.2 "off-topic: not student-relevant" ignored
```

### Step 4 — Pick 1–2 candidates to draft

- Prefer RSS sources with score ≥ 0.75, sorted by score then recency.
- If a pending idea exists with priority ≥ 4, consider drafting that instead
  of a second RSS source (but always draft at least one RSS item if any
  scored ≥ 0.75).
- **Never draft more than 2 in a single run.** Two high-quality reviews beats
  five mediocre drafts.
- If nothing scores ≥ 0.5 and there are no priority ideas, skip drafting and
  report "no qualifying items today."

### Step 5 — Draft each blog

For every chosen item, write a full markdown post in Paaras's voice. Anchor
reference: the tone of `content/blog/hacking-google-canvas.mdx` — direct,
opinionated, student-focused, uses metaphors, calls out common mistakes, ends
with a clear action the reader can take.

Structure each draft:

1. **Hook** (1–2 paragraphs) — lead with the news or the problem. No
   preamble.
2. **Context / why it matters** — who is affected, what changes.
3. **Breakdown** (2–4 sections with `##` headings) — the substance. If it's
   an exam-date change, include the old vs. new schedule. If it's a syllabus
   update, list the specific chapters affected.
4. **What to do next** — 3–5 concrete action items for the student.
5. **Canvas Classes angle** (optional, only if natural) — how Canvas helps
   with this specific thing. Never force it.

Length: **700–1200 words**. Shorter for news announcements, longer for
explainer pieces.

LaTeX rules (if any chemistry formulas appear): follow
`.agent/rules/latex_formatting.md` — single `$…$` delimiters, `\ce{…}` for
chemical formulas, never `$$…$$`.

Cite the source near the top with a block quote:

```markdown
> **Source:** [Indian Express — "NTA announces JEE Main 2026 Session 2 schedule"](<url>)
```

### Step 6 — Save the draft

Build a JSON payload and pipe it through `save_draft.js`. Using the Write
tool to create a temp file then `node save_draft.js < /tmp/draft.json` is
safer than inline shell quoting for markdown bodies.

```json
{
  "title": "JEE Main 2026 Session 2: The Dates You Need to Know",
  "excerpt": "NTA has locked in the April window. Here's what changed, the exact timeline, and the three-week prep plan that still works.",
  "content": "> **Source:** …\n\n# JEE Main 2026 Session 2…\n\n[~1000 words of MDX]",
  "tags": ["JEE", "JEEMain2026", "exam-strategy"],
  "source": "rss",
  "source_refs": ["<BlogSource _id from /tmp/blog_new_sources.json>"],
  "created_by": "daily-cron"
}
```

```bash
node scripts/blog/save_draft.js < /tmp/draft.json
```

The draft is created with `status='review'` and the referenced `BlogSource`
is flipped to `drafted`. Repeat for draft 2 if applicable.

### Step 7 — Emit a short morning summary

At the end of the run, print a concise summary. This is what Paaras sees in
the notification:

```
Good morning. Pulled 34 new RSS items, scored all, drafted 2.

1. "JEE Main 2026 Session 2 Schedule" — from Indian Express, 0.92 relevance.
   /crucible/admin/blog → Review column.

2. "CBSE Class 12 Chemistry Paper Pattern Changes" — from PIB, 0.81.
   /crucible/admin/blog → Review column.

No pending ideas in queue. 3 items ignored as off-topic.
```

Keep it under 150 words. No fluff.

---

## What NOT to do

- **Never set `status='published'`** or `status='scheduled'` — drafts always
  land in `review`. Paaras decides when things go live.
- **Never fabricate facts.** If an RSS item's summary is thin and you can't
  verify specifics, draft a shorter news-brief post and flag the gaps with
  `NEEDS_REVIEW: [what's missing]`. Never invent dates, numbers, or quotes.
- **Never draft the same story twice.** `blog_sources` dedupes by URL hash
  and drafted sources flip to `status='drafted'` — but also scan existing
  posts in `/crucible/admin/blog` (via `curl http://localhost:3000/api/blog/posts`
  locally, or read via Mongo directly) to avoid duplicating recent coverage.
- **Never upload images in the cron.** Drafts go text-only. Paaras adds
  cover images manually via the admin drag-drop zone.
- **Never delete sources.** Ignored items stay in the DB with
  `status='ignored'` — useful for auditing later.

---

## Config

Feeds: `scripts/blog/feeds.json` (edit freely; no code change required)
Schedule: `0 8 * * *` local time (8:00 AM IST, Claude Code scheduled task)
Admin panel: https://www.canvasclasses.in/crucible/admin/blog (or localhost)
Auto-publish cron (Vercel): `*/15 * * * *` — flips `scheduled → published`
when `scheduled_for` is due. Configured in `vercel.json`.
