# Class 11 Biology Live Book — Canonical Structure & Style Spec

> **This is the contract for building every Class 11 Biology chapter.** Read it before authoring
> any page. Finalised 2026-07-11 after a design discussion with the founder, before any chapter was
> built. It supersedes nothing — it's the first biology exam-track book — but it inherits and
> narrows [`BOOK_PAGE_WORKFLOW.md`](BOOK_PAGE_WORKFLOW.md) §4A (Class 11–12 JEE/NEET template) and
> §3.13–3.14 (biology-specific blocks + image style, proven on Class 9 Science's biology chapters).

- **Book:** `class11-biology` (not yet created in DB) · subject `biology` · grade `11`
- **⚠️ Naming collision to be aware of:** an existing book `anatomy-physiology` is ALSO
  `subject: biology, grade: 11` (a separate, general-audience body-systems book — Heart, Skeleton —
  not NCERT-syllabus-driven, 0% published, early/idle). Any UI that filters "Biology · Grade 11"
  will show both. Don't confuse the two when building.
- **Source:** NCERT Biology, Class 11, 2023-rationalised edition — the same edition NEET's official
  syllabus uses. 19 chapters, canonical chapter/prefix table in
  [`BIOLOGY_QUESTION_INGESTION_WORKFLOW.md`](BIOLOGY_QUESTION_INGESTION_WORKFLOW.md) §"Biology
  Chapter Table."
- **Track:** Class 11–12 JEE/NEET template ([`BOOK_PAGE_WORKFLOW.md`](BOOK_PAGE_WORKFLOW.md) §4A),
  with biology's block substitutions (§3.13 `interactive_image`, §3.13.1 decision tree, §3.14 image
  style) instead of the chemistry/physics defaults.
- **Build order (founder decision 2026-07-11):** NCERT's own chapter order, starting at Chapter 1
  *The Living World*. Not reordered by NEET weightage.
- **Build settings (locked, same as every other book):** English first · `published: false` on
  every new page until founder review · all mutations through `scripts/lib/book-writer.js` (never
  raw Mongo) · images are `src: ''` + a `generation_prompt` placeholder, filled later via the image
  pipeline.

---

## 1. THE GOLDEN RULE — NCERT is the ceiling AND the floor

This is the one thing that makes Biology different from every other Live Book we've built, so it's
worth stating plainly:

**For Chemistry/Physics/Math, "beyond NCERT" depth earns marks (JEE rewards derivation and
application beyond the textbook). For Biology, it mostly doesn't.** NEET draws its questions —
often verbatim — from NCERT's own sentences. CBSE board exams test the same content as
define/differentiate/label-the-diagram. There is no real NCERT-vs-NEET-vs-CBSE tradeoff here the
way there can be in physics: a page built faithfully around NCERT already serves all three
audiences.

So "a little beyond NCERT" means **teaching depth**, not **extra facts**. Concretely:

**Do add (these are the leverage points):**
1. **Mnemonics** for classification-heavy chapters (Plant Kingdom, Animal Kingdom, Biological
   Classification) — NCERT doesn't supply these and rote recall load here is the highest in the
   whole syllabus.
2. **Comparison tables** (`comparison_card`) for things NCERT describes in scattered prose but NEET
   tests as "differentiate between" — xylem vs phloem, mitosis vs meiosis, exocrine vs endocrine.
3. **Exact-NCERT-line flags** — a callout that says "memorise this sentence as written" when it's a
   phrase NEET has repeatedly lifted verbatim into an option. This requires actually reading the
   NCERT PDF text, not paraphrasing from training memory (Rule 0 applies as always).
4. **Diagram-labelling practice on NCERT's own figures** — neuron, nephron, flower L.S., cell
   organelles — via `interactive_image` hotspots, because NEET tests "which part does X" directly
   against the textbook diagram, not a stylised alternative.
5. **Worked examples where NCERT genuinely has numericals** (Hardy-Weinberg, respiratory quotient,
   ecological pyramids) — rare in biology, but give it the full `worked_example` treatment when it
   occurs, same as chemistry.

**Do NOT add:** outside facts from coaching modules or non-NCERT reference books just to make a
page feel richer. Founder decision (2026-07-11): **no beyond-NCERT reference book is indexed** for
this subject in `_agents/reference-books/REFERENCE_LIBRARY.md` — unlike Chemistry's Shishir Mittal.
If a page feels thin, the fix is to teach the NCERT content more deeply (mechanism, analogy,
diagram), not to import content NCERT doesn't cover.

---

## 2. DIAGRAM / SIMULATION STRATEGY

Reuse before build (per `BOOK_PAGE_WORKFLOW.md` §4E). The biology 3D-sim catalog
(`packages/data/simulations/biologySimulations.ts`) already has four **live** components:

| Sim | Fits this chapter |
|---|---|
| `heart-3d` | Body Fluids and Circulation |
| `skeleton-3d` | Locomotion and Movement |
| `muscular-system` | Locomotion and Movement |
| `anatomy-explorer` | Structural Organisation in Animals (overview) |

Embed these directly where they fit — no new build needed.

Two more are catalogued as `coming_soon` and **were explicitly deferred** (founder decision
2026-07-11): `nephron-3d` (would serve Excretory Products) and `neuron-3d` (would serve Neural
Control). Build those chapters with `interactive_image` hotspots on a static NCERT-style diagram
instead — fast, proven, no new pipeline. Revisit the 3D build only once real pages exist to justify
the effort.

For everything else, the block-type decision tree at `BOOK_PAGE_WORKFLOW.md` §3.13.1 governs:
single dense diagram → `interactive_image`; 2–4 types compared → `comparison_card` + one `image`;
multi-stage process → `timeline`; simple single-diagram concept → plain `image`.

---

## 3. Chapter list (build order)

Canonical IDs/prefixes are frozen in `BIOLOGY_QUESTION_INGESTION_WORKFLOW.md` — reuse them as the
book's `chapter_number`/reference, don't invent new ones.

```
1.  The Living World                          (TLW)
2.  Biological Classification                 (BCLS)
3.  Plant Kingdom                              (PKGD)
4.  Animal Kingdom                             (AKGD)
5.  Morphology of Flowering Plants             (MOFP)
6.  Anatomy of Flowering Plants                (ANFP)
7.  Structural Organisation in Animals         (SOIA)
8.  Cell: The Unit of Life                     (CUOL)
9.  Biomolecules                               (BMOL)
10. Cell Cycle and Cell Division               (CCDV)
11. Photosynthesis in Higher Plants            (PHOT)
12. Respiration in Plants                      (RPLN)
13. Plant Growth and Development               (PGRO)
14. Breathing and Exchange of Gases            (BRTH)
15. Body Fluids and Circulation                (BDFL)
16. Excretory Products and Their Elimination   (EXCR)
17. Locomotion and Movement                    (LOMV)
18. Neural Control and Coordination            (NEUR)
19. Chemical Coordination and Integration      (CHCO)
```

---

## 4. Open follow-ups (not yet decided)

- Whether to eventually build `nephron-3d`/`neuron-3d` once Ch.16/Ch.18 are reached.
- Whether Hinglish twins are wanted for this book (not asked yet — default per
  `BOOK_PAGE_WORKFLOW.md` §12 is available if requested later).
- No book document exists in the `books` collection yet — first build session needs to create it
  before any pages can be posted.
