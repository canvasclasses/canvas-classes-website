# NCERT Corpus — Index

> **What this is.** A repo-resident, *citable* index of NCERT textbook content, chunked by NCERT's
> own section numbers with exact page provenance. It exists so the Crucible solution-writer and the
> Live-Books page-writer can (a) ground content in NCERT's actual wording and (b) cite the precise
> source — *"built on NCERT Class 11 Ch.2 §2.6.6, p.64"* — which builds credibility, since a large
> share of JEE/NEET chemistry is designed around NCERT lines. Companion to the **teacher-voice
> system** (`_agents/voice/`): voice banks carry *how the founder teaches*; this carries *what
> NCERT says, verbatim, and where*.
>
> **Why a repo file (not GBrain / not a vector DB).** Mirrors the proven `_agents/voice/` pattern —
> agents read these markdown references directly during solution/page batches. Git-diffable, so
> founder edits are the improvement signal. GBrain stays the business/decisions brain; only the
> *decision to build this* is logged there.

## Subject → chapter status

### Chemistry (`_agents/ncert/chemistry/`)

| NCERT | Crucible prefix | Index file | Status |
|---|---|---|---|
| Cl-11 Unit 2 — Structure of Atom | **ATOM** (`ch11_atom`) | `chemistry/ATOM-ncert.md` + `chemistry/ATOM-citation-map.md` | ✅ Done (pilot) — 270/299 bank Qs citable |
| Cl-11 Unit 1 — Some Basic Concepts | MOLE | — | ⏳ Next |
| Cl-11 Unit 3 — Classification & Periodicity | PERI | — | ⏳ |
| Cl-11 Unit 4 — Chemical Bonding | BOND | — | ⏳ |
| (remaining Cl-11 + Cl-12 units) | … | — | ⏳ |

> Physics / Maths / Biology: not started — Chemistry first (founder priority). Structure
> generalizes: `_agents/ncert/<subject>/<PREFIX>-ncert.md`.

## How to cite (for solution/page authors)

Use printed page + section: **`(NCERT Cl-11 Ch.2, §2.4, p.47)`**. The `§` and page in each chapter
file are exact. When you need wording beyond the verbatim lines captured, open the local source PDF
at that page — the chapter file's header gives the path + the `printed = PDF + N` page offset.

## Ingestion — "drop a file, I ingest" (founder-triggered)

1. **Get the PDF.** Official NCERT: `https://ncert.nic.in/textbook/pdf/<code>.pdf`
   (Cl-11 Chemistry Part I codes: `kech1<NN>.pdf`; Part II: `kech2<NN>.pdf`). Or founder drops a
   preferred edition into `_agents/ncert/_source/<subject>/`.
2. **Extract text:** `pdftotext -layout <file>.pdf <file>.txt` (cheap, complete). Read formula-heavy
   sections as page images where `pdftotext` mangles subscripts/Greek.
3. **Build `<PREFIX>-ncert.md`** in the chapter format (see `chemistry/ATOM-ncert.md` as the
   template): header with provenance + page offset → concept jump-table → section-by-section
   (verbatim citable lines, content digest, *question hooks*, what it feeds in the Crucible bank) →
   worked-problem table → exercises note.
4. **Verify:** spot-check 3 chunks against the PDF (wording + page).
5. **Add the row** to the table above.

## Source files

`_agents/ncert/_source/` holds the raw PDFs + `.txt` extractions. It is **gitignored** (binary bulk
— ~5 MB/chapter); the distilled `.md` indexes are what's committed. Re-fetch any source with the
`curl` command in that chapter file's header.
