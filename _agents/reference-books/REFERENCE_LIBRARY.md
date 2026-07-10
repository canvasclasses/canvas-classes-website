# Reference Library — READ THIS BEFORE DESIGNING ANY TOPIC

> **The founder supplies authored reference books (real textbooks by named authors). For any topic those books cover, they are the #1 source — above the agent's own training knowledge — for theory depth, sequencing, worked examples, questions, and voice.** This file is the index + the protocol. It is agent-maintained.

---

## The Reference-First Rule (non-negotiable)

When you are about to **design, explain, or write examples/questions for a topic** — a Live Book page, a solution, a simulation's teaching copy, a flashcard — do this FIRST:

1. **Check this index** for a reference book that covers the topic.
2. If one exists, **open the book's map doc** (linked in the table below) to find the exact chapter/section, then **read those pages** from the PDF before writing a word.
3. **Design around the book:** mirror its depth, its order of ideas, its analogies, and pull its real worked examples and questions (re-expressed in our voice, not copied verbatim — see Anti-Hallucination below). Where the book is richer than our current page, that gap is the improvement to make.
4. **Prefer the book over training knowledge** when they differ on emphasis, sequencing, or what counts as a "must-cover" sub-topic. Training knowledge fills gaps the book leaves; it does not override the book.
5. **Record which book + section informed the work** in the relevant state changelog line (e.g. `LIVE_BOOKS_STATE.md`), so the provenance is traceable.

If no reference book covers the topic yet, proceed normally — but say so, so the founder knows a reference is missing.

### Anti-hallucination (inherits CLAUDE.md §3 Rule 0)

- The book is the **source of truth for facts, values, and examples** on its topics. Do not invent data or "improve" a definition from memory when the book states it.
- **Do not copy the book's prose verbatim** into student-facing pages — it is copyrighted. Read it, understand it, then re-express in our teacher voice (FORMAT-v2 / `teacher-voice-profile.md`). Numbers, the *choice* of example, and the *sequence of reasoning* may be reused; the wording must be ours.
- If the book and a syllabus/NCERT disagree on scope, note it for the founder rather than silently picking one.

---

## Index of reference books

| Book | Author | Subject · Level | Map doc | File location |
|---|---|---|---|---|
| Physical Chemistry for JEE Main & Advanced, Vol. 1 (8th ed.) | Shishir Mittal (Disha) | Chemistry (Physical) · Class 11–12, JEE | [physical-chemistry-mittal-vol1.md](physical-chemistry-mittal-vol1.md) | `/Users/CanvasClasses/iCloud Drive (Archive)/Kindle Converter/Physical Chemistry/Physical Chemistry - Shishir Mittal.pdf` (732 pp, 27.6 MB) |
| Conceptual Integrated Science (2nd ed.) | Hewitt, Lyons, Suchocki, Yeh (Pearson) | Integrated Science — Phys/Chem/Bio/Earth/Astro · **Class 9–10 / foundations** (concept-first, analogy-driven) | [conceptual-integrated-science-hewitt.md](conceptual-integrated-science-hewitt.md) | `/Users/CanvasClasses/iCloud Drive (Archive)/Kindle Converter/Conceptual Integrated Science …(z-lib.org).pdf` (1012 pp, **107 MB — too big for Read tool; use `pdftotext`**) |

> **Storage caveat:** the Mittal PDF currently lives in **iCloud Drive (Archive)**, which can evict/offload the file. If a future agent can't read it, the file may need re-downloading from iCloud, or the founder should move reference PDFs into a stable local folder (and we add a gitignored `reference-books/pdfs/` pointer). PDFs are NOT committed to git (large binaries).

---

## How to add a new reference book (when the founder shares one)

1. Add a row to the index table above (book, author, subject/level, map-doc link, file path).
2. Create a per-book **map doc** in this folder (`<short-slug>.md`) using the Mittal doc as the template:
   - metadata (title/author/edition/scope/level/location),
   - a **coverage map** — which of the book's chapters serve which of *our* chapters/topics (Live Books + Crucible),
   - a **per-chapter section map** for at least the chapters we are actively building,
   - a **style & voice guide** distilled from how the author teaches (openings, analogies, problem-solving scaffolds, vocabulary),
   - the book's **pedagogical features** (worked-example style, exercise tiers, special boxes) so we can borrow the good ones.
3. Note its storage caveat if it lives outside the repo.

---

_Last updated: 2026-06-24 · books indexed: 2_
