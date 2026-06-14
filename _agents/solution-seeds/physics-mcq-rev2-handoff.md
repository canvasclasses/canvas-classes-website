# Physics MCQ (Deb Mukherji) — Revision Exercise 2 — KICKOFF HANDOFF

Captured 2026-06-11 so the next (fresh) session can run the full chapter end-to-end without
re-deriving anything. **27 single-correct questions** ("Choose the correct option… Only one
option is correct"), book footer **pg 1-146** onward. Book PDF: `~/Downloads/Physics MCQ.pdf`
(locate the page with `pdftotext` searching "Revision Exercise 2"; physical PDF page = printed
page + offset — calibrate once, it was +3 around Ch.3).

## Answer key (from the founder's image — verified against R1–R5 by hand, all consistent)

| Q | ans | Q | ans | Q | ans | Q | ans | Q | ans |
|---|---|---|---|---|---|---|---|---|---|
| R1 | a | R2 | d | R3 | d | R4 | a | R5 | b |
| R6 | d | R7 | b | R8 | c | R9 | c | R10 | c |
| R11 | c | R12 | c | R13 | a | R14 | d | R15 | b |
| R16 | b | R17 | a | R18 | b | R19 | a | R20 | c |
| R21 | d | R22 | d | R23 | b | R24 | d | R25 | d |
| R26 | b | R27 | a | | | | | | |

## SVG figure folders (already on disk, `~/Desktop/Out - Ready for Database/`)
- **`Revision Exercise 2`** — QUESTION-side diagrams.
- **`Revision Exercise 2 - Solution Diagrams`** — SOLUTION-side diagrams.
  (Naming convention TBD — check filenames: if book-Q#-named, map via the qmap deterministically;
  if not, build a gallery first: `node scripts/svg-mapper/build-gallery.js "<folder>"`.)

## The full sequence (a complete chapter cycle — this is the workflow stress-test)
1. **Ingest** (question-ingester skill / `PHYSICS_QUESTION_INGESTION_WORKFLOW.md`): extract the 27
   Qs from the PDF into `scripts/_phase1_buffer_<prefix>.js` (Rule-0 image-verification gate — quote
   first 8 words from the page), per-question taxonomy routing like Rev-Ex-1 (mechanics revision:
   COM/NLM/K1D/K2D/WEP/ROT/SHM as applicable), `sourceType:'Practice'`, `applicableExams:['JEE']`,
   `examDetails:null`, `status:'published'`. Apply the answer key above. Insert via
   `scripts/insert_questions.js`. Build the qmap (book R# ↔ display_id) as you go.
2. **Question-side figures** (figure-inserter skill): rasterize the `Revision Exercise 2` folder,
   map → manifest (slot=question / optionX), **book-verify a/b/c/d order for any option-image Q**,
   dry-run → commit.
3. **Solutions** (physics-solution-workflow): `fetch-batch.js <PREFIX>` now auto-rasterises figures
   to `images[].file` PNGs — Read those (small batches), write the 6-section solutions, re-derive
   every answer (flag, don't silently change, any mismatch vs the key above).
4. **Solution-side figures** (figure-inserter): map the `… - Solution Diagrams` folder → slot=solution,
   dry-run (expect "into 🖼️ Visual Sketch"/"created" placements, 0 NOT FOUND) → commit.
5. Refresh `CRUCIBLE_STATE.md` + `PROJECTS.md` + the wishlist, per the usual final step.

If anything is ambiguous (routing of a specific Q, a figure that won't map), STOP and ask the
founder — do not assume.
