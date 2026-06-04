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
| `ingest.js` | One image: compress → R2 upload → set block field → journal | **R2 + 1 DB block** |
| `flag.js` | Record a mismatch in `_agents/livebook-image-flags/`, leave block pending | no DB |
| `rollback.js` | Reset journalled writes back to pending (`--last N` / `--all` / `--block <id>`) | DB |

Runtime files (`_queue.json`, `_journal.jsonl`, `_downloads/`) are gitignored.

## The run loop (Claude drives ChatGPT in your Chrome)

Prereq: Chrome open + logged into ChatGPT + the Claude-in-Chrome extension connected.

1. `node scripts/livebook-images/worklist.js --book <id> --chapter <n>` → builds `_queue.json`.
2. For each queue item, Claude:
   a. opens a **new** ChatGPT chat, pastes the `prompt`, waits for the image;
   b. downloads the PNG into `_downloads/`;
   c. **looks at the image** and compares it to the prompt intent;
   d. if it matches → `node ingest.js --file <png> --page <…> --block <…> --field <src|image_src> --lang <en|hi> --book <…> --chapter <n>`;
   e. if it doesn't → `node flag.js --page … --block … --book … --chapter … --kind … --reason "…" --prompt "…"` and move on.
3. When ChatGPT throws a Cloudflare/rate-limit challenge, it **pauses** for you to clear it
   (Claude will not bypass bot-detection). Then resume from the same queue.

## Undo

- One image: `node rollback.js --block <blockId>`
- Last N: `node rollback.js --last 10`
- A whole run: `node rollback.js --all`

Rollback resets the block to pending (`""`). R2 objects are left in place; they're
harmlessly overwritten on the next attempt for that block.
