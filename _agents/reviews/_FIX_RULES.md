# Fix-Agent Rules — Class 9 Live Book remediation (READ FULLY BEFORE WRITING)

You are fixing ONE chapter to production quality. You have a findings file listing the
defects (Critical/Major/Minor) and a source PDF (ground truth). Fix every **CRITICAL +
MAJOR + signature** finding. Minors only if trivial. Work carefully — this is
founder-authored content live (English) or about to launch (Hindi).

## THE SAFE-WRITE LAW (CLAUDE.md §0.6) — non-negotiable
1. **Every write goes through `scripts/lib/book-writer.js` `savePage`.** Never `updateOne`/`deleteOne` on `book_pages` directly. Pattern:
   ```js
   const bw = require('./lib/book-writer');            // from scripts/
   await bw.withDb(async (db) => {
     const page = await db.collection('book_pages').findOne({ slug: '<page-slug>' });
     const blocks = JSON.parse(JSON.stringify(page.blocks));   // deep clone
     // ... mutate text fields / correct_index / add restored text IN PLACE ...
     const dry = await bw.savePage(db, { pageId: page._id }, blocks, { dryRun:true, author:'content-review-fix', summary:'<what>' });
     console.log(dry.diff.reasons, 'wouldBlock=', dry.wouldBlock);
     if (!dry.wouldBlock) await bw.savePage(db, { pageId: page._id }, blocks, { author:'content-review-fix', summary:'<what>' });
   });
   ```
   This snapshots a prior version (rollback-safe) and runs the content-loss guard.
2. **NEVER remove a block.** Keep every block `id` and the block order. Edit fields *inside* blocks; add text; never delete a block object.
3. **NEVER unlink an asset ref** (`src`, `url`, `audio_url`, `image_url`, `portrait_src`). Leave empty-string media as-is (those are pre-launch placeholders, not your job).
4. If a finding seems to *require* removing a block or asset → **DO NOT**. Log it as `SKIPPED (needs block removal — founder decision)`.
5. Write `.js` files under `scripts/` and run them — never `node -e` with Devanagari/LaTeX (shell mangles it). Name them `scripts/_fix_<book>_ch<N>_*.js`.

## How to fix each category
- **Source-fidelity (edited/dropped passage):** restore the original text **VERBATIM** from the PDF into the `narrated_passage` (English: `pdftotext -layout "<pdf>" -`; Hindi: use the Read tool with `pages=` to read the PDF VISUALLY — pdftotext mangles Devanagari). The original text is sacred — only the original goes in the passage; any simplification belongs in `hinglish_commentary`/gloss, never replacing the source. Restoring text only *grows* the page (guard-safe).
- **Verbatim slips** (one wrong word/मात्रा vs PDF): correct to match the PDF exactly.
- **Fabricated facts:** replace with the verified-correct fact from the PDF/your source check, or if unsupported and uncorrectable, reword the sentence to drop the false claim while keeping it grammatical. (Removing one sentence is guard-safe — it won't shrink a page >25%.)
- **Broken/ambiguous quiz items:** make exactly one option defensibly correct — either fix `correct_index` to the right option, or sharpen the wording of the over-good distractor / the stem so only one answer holds. For "all four options are questions"-type breakage, rewrite the options into real answers. **Do NOT touch any `pr-21`/`pr-23` graded keys — already fixed.** Do NOT reorder options for position-balance (a global pass does that later).
- **Length-tell items** (correct option conspicuously longest): tighten the correct option and/or flesh out a distractor so lengths are comparable — don't just reorder.
- **अलंकार / grammar / device mislabels:** correct the label to the right one (match NCERT's own answer key / सौंदर्य table). If it's propagated into a quiz key, fix there too.
- **AI-slop (English prose):** em-dashes → **≤1 per paragraph** (recast as periods/commas/parentheticals); delete banned words (delve, vibrant, intricate, myriad, foster, unlock, embark, realm, tapestry…) and **stop teaching them as model vocab** (swap for a plain word); break recycled reveal cadence ("the secret is", "both are true because", "not X but Y"); cut patronising closers / generic openers; fix encoding artifacts (e.g. `तूलika`) and template leaks (e.g. `wop_maker_`).
- **Cloned boilerplate (Hindi `chapter_practice` intro):** give each chapter a chapter-specific intro line (keep it short, plain, in the same register) so ch2–12 are no longer byte-identical.
- **Redundancy padding:** where the SAME insight is repeated 3–4× across pages, you may tighten the later repetitions to a single line — but never delete a block; just shorten its text.

## Voice
- English: plain classroom-teacher voice (TEACHER_VOICE_SYSTEM.md / ENGLISH_BOOK_PAGE_WORKFLOW.md §6) — second person, short sentences, no jargon, ≤1 hard word/sentence.
- Hindi: simple natural Hindi a teacher speaks (HINDI_BOOK_PAGE_WORKFLOW.md §9); honour the scaffold-flip (Hindi word → simpler Hindi + English) in vocabulary_lab; correct Devanagari/मात्रा/नुक़्ता.

## Output
Report a concise **fix-log**: for every Critical/Major/signature finding → `FIXED: <finding> — <what changed> — page-slug › block#/type` or `SKIPPED: <finding> — <why>`. End with `pages written: N`. Be honest about anything you couldn't safely fix.
