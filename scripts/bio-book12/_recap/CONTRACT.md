# Class 12 Biology — Chapter Recap Page (pilot: Ch.1)

> Born 2026-07-17 from the audit's F3 finding (`_agents/reviews/CLASS12_BIO_AUDIT_2026-07-16.md`)
> and designed in `_agents/plans/LIVEBOOK_LEARNING_LAYER.md` §2. **This is a ONE-CHAPTER PILOT —
> refine on Ch.1 before scaling to the other 12.**

## The one rule everything else follows

> Anything a student merely **READS** is low-utility (Dunlosky et al. 2013: summarising,
> highlighting and rereading are rated LOW). Anything that makes them **RETRIEVE** is
> high-utility (practice testing is one of only two techniques rated HIGH).

**So: no summary paragraph, anywhere on this page.** Every block must make the student *do*
something — recall, then check — never just read a condensed version of the chapter.

## Grounding rule (Rule 0 applies to summarizing our own content too)

The recap is built from **the chapter's own already-published lesson pages** — dumped via
`scripts/livebook-review/_dump_chapter.js class12-biology <N>` — plus the raw NCERT source
text as the final fact-check. **Never** re-derive from memory. Every fact, number, and hotspot
label on the recap page must trace to a sentence, table, or hotspot detail already sitting in
that chapter's own published pages.

## Technical decisions (checked against the actual code before building)

1. **`page_type: 'lesson'`.** The type is a strict `'lesson' | 'chapter_opener'` union with no
   third value, and nothing in the codebase branches on `'lesson'` specifically (only
   `page_type === 'chapter_opener'` is ever checked). Adding a `'chapter_recap'` value would
   touch the type, the readiness dashboard, and several opener checks for zero benefit —
   `'lesson'` is the correct, precedent-matching choice (same as the NCERT-exercises page).
2. **Must include a genuine checkpoint block**, or the readiness dashboard flags the page as
   `"No quiz / checkpoint block"` (`packages/data/books/readiness.ts` — `QUIZ_TYPES` includes
   `inline_quiz`, `reasoning_prompt`, `practice_bank`, `comprehension_checkpoint`, etc.; any
   non-opener page without one is a blocker). This pushed the design in the right direction
   anyway: instead of a passive summary, the closing device is a genuine **cross-chapter
   integrative quiz** — see device #6.
3. **Position: the new LAST page of the chapter**, appended after the NCERT-exercises page
   (itself the prior last page). The recap is the true closing beat before the student moves on.
4. **No new schema or renderer work.** Every device below reuses a block type that already
   ships: `image`, `interactive_image`, `heading`, `text`, `table`, `reasoning_prompt`,
   `inline_quiz`.

## The six devices, in order

| # | Device | Block | Purpose |
|---|---|---|---|
| 1 | **Skeleton mindmap** | `interactive_image`, one hotspot per major chapter branch | Blank until tapped — doubles as a free Label Sprint round once the image exists. Coordinates roughly follow the actual conceptual flow (top-to-bottom or left-to-right through the chapter's arc), not a literal diagram of an organ. |
| 2 | **The process spine** | `text`, ordered markdown list | The chapter's sequence in ≤10 steps. Reserve this for chapters that are genuinely process-shaped (this one very much is: flower → anther/ovule → gametophytes → pollination → fertilisation → seed/fruit → apomixis). |
| 3 | **Numbers you must not blur** | `table` | The exact figures NEET turns on — ploidy chain, cell/nucleus counts, measurements, percentages — pulled verbatim from the chapter's own `remember` callouts and hotspot details, not re-derived. |
| 4 | **The swap traps** (matching sets) | ONE `table`, 3 columns (`Term A` / `vs Term B` / `The one fact that separates them`) | Every already-taught A-vs-B pair the chapter contains, consolidated into a single dense, scannable table — **not** six separate `comparison_card` blocks restating what individual lesson pages already have. Density over decoration; this is a 5-minute artifact. |
| 5 | **Self-check prompts** | 1–2 `reasoning_prompt` blocks, placed right after the devices above | Genuine retrieval — "work this out," not "read this." Each references a fact from devices 1–4 so the student has just been given the raw material and must now use it. |
| 6 | **Closing integrative quiz** | `inline_quiz`, LAST block, question count scales with chapter size (see decision below) | Spans the *whole* chapter — a question drawing on the male side and a question drawing on the female side and a question drawing on post-fertilisation, etc. — testing whether ideas connect across pages, which no single lesson-page quiz can do. Varied `correct_index`, real NCERT-based traps, difficulty-tagged. Satisfies the readiness gate *and* is the single highest-value block on the page. |

## Style notes

- **Hero image is NOT the atmospheric painterly style used on lesson-page heroes.** Frame it as
  a "revision station" / control-panel feel — flat, diagrammatic, built to be scanned, not
  admired. (Mirrors the Chem-12 gold standard, `ncert-simplified-12` ch5 "Chapter Recap & Exam
  Decoder".)
- **Intro text (if any) is an instruction, not a summary.** "Cover the mindmap and recall each
  branch before you tap it. If a self-check trips you up, that's the one to reread — not the
  whole chapter." Two sentences, max.
- No new AI-tell words; same voice rules as every other page in the book.

## Pipeline (mirrors `_practice/` exactly)

- `ch<N>.js` — the authored page module (hand-written for the Ch.1 pilot; parallel subagents
  once the pattern is refined and approved for the other 12 chapters).
- `validate_recap.mts` — Zod validation against `ContentBlocksArraySchema`, same shape as
  `_practice/validate_practice.mts`.
- `insert_recap_pages.js` — additive-only insert, appends as the new last page, idempotent
  update-by-slug on re-run. Existing pages are never re-saved.

## Founder decisions (2026-07-18, after the Ch.1 pilot report)

1. **Swap-traps table vs. numbers table: stay separate.** Confirmed as-is — recalling a value
   and discriminating two ideas are different retrieval tasks, so keep them as two tables.
2. **Mindmap ("whole chapter as one picture" vs. arbitrary hotspot list): open — founder is
   viewing Ch.1 live before deciding.** Do not rework pre-emptively. If they come back asking
   for a more literal diagrammatic structure (hotspots sitting on an actual flowchart of the
   process, not a generic illustrated scene), that becomes the change; otherwise device #1
   stays as built.
3. **Closing quiz size: scales with chapter length, roughly 1 question per lesson page**, not a
   fixed 6–8. Ch.1 (11 lesson pages) keeping its 8 is fine as a floor/ceiling-ish outcome, but
   when authoring Ch.2–13 size each closing quiz to the chapter's own lesson-page count
   (6-page chapters like Ch.3/Ch.12 get ~6 questions; 11-page chapters like Ch.4/Ch.5 get ~11).
   Still applies book-wide quiz hygiene (varied `correct_index`, no length-tell) at whatever size.

**Still blocking the scale-to-Ch.2–13 pass:** founder's live look at the Ch.1 mindmap (item 2).
Once they confirm keep-as-is or request a rework, the pattern is fully locked and ready to
mirror across the remaining 12 chapters via parallel subagents (same as the `_practice/` pass).
