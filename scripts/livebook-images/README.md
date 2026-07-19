# Livebook image automation

Generates the missing images on Livebook chapter pages, end to end:
**find pending prompt → generate in ChatGPT → compress → upload to R2 → write the
URL back into the page → flag anything that doesn't match.**

It replaces this manual loop: copy prompt → ChatGPT → download → XnConvert → upload in admin.

## How images are stored (the thing this automates)

Pages live in MongoDB `book_pages`, each with a `blocks[]` array (+ `hinglish_blocks[]`).
Two block types carry an image prompt and an empty slot until an image exists:

| Block type | Prompt field | Image field (empty = pending) |
|---|---|---|
| `image`   | `generation_prompt` | `src` |
| `callout` | `image_prompt`      | `image_src` |

"Pending" = prompt is set but the image field is `""`. The tools only ever touch
pending blocks, so the whole thing is **idempotent and safe to re-run / interrupt.**

## Compression — matches XnConvert exactly

`ingest.js` compresses with **`cwebp -q 42`, no resize**. This was calibrated against
two of the user's real XnConvert outputs and reproduces them to within ~100 bytes:

| Source | XnConvert | `cwebp -q 42` |
|---|---|---|
| 1774×887 | 76.97 KiB | 76.86 KiB |
| 1254×1254 | 50.69 KiB | 50.6 KiB |

XnConvert, `cwebp`, and the app all use the same libwebp encoder, so quality is identical.
XnConvert's GUI is sandboxed and can't be driven per-image from a script — this is the
same engine at the same setting, headless. If you ever change your XnConvert quality,
re-calibrate and update `CWEBP_QUALITY` in `ingest.js`.

## The tools

| Script | What it does | Writes? |
|---|---|---|
| `scan.js` | Report the pending backlog by book/chapter | no |
| `worklist.js` | Emit the ordered queue (`_queue.json`) to walk through | no (writes a local file) |
| `ingest.js` | CLI, one image: parses args, calls `ingest_core.js` | **R2 + 1 DB block** |
| `ingest_core.js` | The actual steps: compress → R2 upload → set block field → journal → **hotspot check** | **R2 + 1 DB block** |
| `flag.js` | Record a mismatch in `_agents/livebook-image-flags/`, leave block pending | no DB |
| `rollback.js` | Reset journalled writes back to pending (`--last N` / `--all` / `--block <id>`) | DB |
| `hotspot_check.js` | Pixel hit-test module: does each hotspot land on artwork or empty background? (used by the two below) | no |
| `audit_hotspots.js` | Bulk re-check every `interactive_image` block in a book/chapter against its live image | no (or `--fix-flags` to write flag files) |

**If you write a one-off batch-ingest script for a chapter** (several exist —
`_ch6_ingest_run.js`, `_ch7_ingest_run.js`, `_ch8_ingest_run.js`, etc. — because a hand-verified
filename↔block mapping doesn't fit the generic `worklist.js` queue), call
`ingestImage()` from `ingest_core.js` inside your loop. **Do not copy-paste the
compress/upload/write-back steps.** That's exactly how the hotspot check went missing
in the first place — it lived only inside `ingest.js`'s CLI body until it was pulled out
into `ingest_core.js` on 2026-07-12 specifically so every ingestion path, present and
future, gets it automatically.

Runtime files (`_queue.json`, `_journal.jsonl`, `_downloads/`) are gitignored.

## Hotspot alignment check (interactive_image blocks only)

`interactive_image` hotspot x/y coordinates are authored by a text-only agent **before
the image exists** — it's guessing from the generation prompt, not the real pixels. When
the generated image's actual composition/padding differs from the guess, a hotspot dot
lands on empty background instead of the feature it's meant to label. This happened
silently across 22 of ~40 hotspots in the first Ch.1–2 batch (2026-07-12) — found only
because a human happened to screenshot one and ask about it.

`ingest.js` now runs `hotspot_check.js` automatically on every `interactive_image` upload,
right after the image lands, and reports PASS/FAIL per hotspot in its console output. A
FAIL doesn't block the image from going live (the image still needs to display), but it:
- prints a loud `⚠️ HOTSPOT ALIGNMENT` block with a suggested nearby correction, and
- appends the block to `_agents/livebook-hotspot-flags/<book>-ch<n>.md` — treat this
  exactly like `_agents/livebook-image-flags/`: **a batch isn't done while its flag file
  has open entries.**

Before declaring an image batch finished, also run the bulk auditor as a gate:

```bash
node scripts/livebook-images/audit_hotspots.js --book <bookId> --chapter <n>
```

Exits 1 if anything is misplaced. Fix via the admin editor (drag the hotspot) or a
`book-writer.savePage` script, then re-run until it's clean.

The check itself: every image in this pipeline is a flat-charcoal-background
illustration, so "is this hotspot on the artwork" is answered by sampling a small
neighborhood around the point and checking for a color meaningfully different from the
image's background color. Hollow/outline diagrams (e.g. a flowchart-style box) get a
second "am I enclosed by artwork on most sides" check so a legitimately-centered point
inside an empty box interior doesn't false-flag. Calibrated against the 43 corrected
hotspots from the 2026-07-12 batch (0 false fails) plus a known-open-background sanity
point (correctly fails).

## The run loop (Claude drives ChatGPT in your Chrome)

Prereq: Chrome open + logged into ChatGPT + the Claude-in-Chrome extension connected.

1. `node scripts/livebook-images/worklist.js --book <id> --chapter <n>` → builds `_queue.json`.
2. Claude opens **one** ChatGPT chat and reuses it for the next 12-15 queue items
   (paste next prompt in the same chat, don't hit "new chat" each time) — start a fresh
   chat only after ~12-15 images, or sooner if the chat gets stuck/glitchy. **Never a new
   chat per image** — that scatters generations across dozens of conversations the founder
   then has to hunt through to download from. See `feedback_livebook_image_chat_batching`
   memory for why this is a hard rule, not a suggestion.
3. For each queue item, Claude:
   a. pastes the `prompt` in the current chat, waits for the image;
   b. downloads the PNG into `_downloads/`;
   c. **looks at the image** and compares it to the prompt intent;
   d. if it matches → `node ingest.js --file <png> --page <…> --block <…> --field <src|image_src> --lang <en|hi> --book <…> --chapter <n>`
      (for `interactive_image` blocks this also auto-checks hotspot alignment — read its
      output, don't just glance at the `OK` line);
   e. if it doesn't → `node flag.js --page … --block … --book … --chapter … --kind … --reason "…" --prompt "…"` and move on.
4. When ChatGPT throws a Cloudflare/rate-limit challenge, it **pauses** for you to clear it
   (Claude will not bypass bot-detection). Then resume from the same queue.
5. Before declaring the batch done, run `node audit_hotspots.js --book <id> --chapter <n>`
   as a final gate (see "Hotspot alignment check" below) — it must report 0 misplaced.

## Undo

- One image: `node rollback.js --block <blockId>`
- Last N: `node rollback.js --last 10`
- A whole run: `node rollback.js --all`

Rollback resets the block to pending (`""`). R2 objects are left in place; they're
harmlessly overwritten on the next attempt for that block.
