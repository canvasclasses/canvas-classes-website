#!/usr/bin/env python3
"""
prepare_illustration.py — turn a generated organ PNG into a Label Sprint background.

PRIMARY path for Label Sprint art (see _agents/workflows/LABEL_SPRINT_WORKFLOW.md).
Given a generated illustration on a solid near-black background, this:
  1. resizes it to a sensible height,
  2. keys the near-black background to transparent (so it floats on the reading-surface card),
  3. compresses to WebP,
  4. writes a base64 data-URI (for a self-contained prototype/artifact) next to it.

The hotspots themselves are authored by hand once against the image (0-1 coords) —
that is the `hotspots` array of the `interactive_image` block. See the workflow doc.

Usage:
  python3 prepare_illustration.py <input.png> [out_basename] [height] [bg_threshold] [mode]

  mode is "dark" (default) or "white". Some generations ignore the "solid
  deep-charcoal background" prompt instruction and export on an opaque white/
  off-white canvas instead (found 2026-07-15 across a whole batch of clinical-
  style organ illustrations — the dark background visible live in the ChatGPT
  UI did not survive into the downloaded PNG). Pass "white" to key near-white
  pixels to transparent instead of near-black. Always eyeball the source PNG
  first — never assume dark mode.

Example:
  python3 prepare_illustration.py ~/Downloads/heart.png heart_illus 820 18
  python3 prepare_illustration.py ~/Downloads/ear.png ear_illus 820 235 white
"""
import sys, base64
import numpy as np
from PIL import Image

if len(sys.argv) < 2:
    print(__doc__); sys.exit(1)

SRC     = sys.argv[1]
OUTBASE = sys.argv[2] if len(sys.argv) > 2 else "organ_illus"
HEIGHT  = int(sys.argv[3]) if len(sys.argv) > 3 else 820
THRESH  = int(sys.argv[4]) if len(sys.argv) > 4 else 18   # dark mode: brightness below this -> transparent; white mode: brightness above this -> transparent
MODE    = sys.argv[5] if len(sys.argv) > 5 else "dark"

img = Image.open(SRC).convert("RGB")
arr = np.array(img).astype(np.int16)
if MODE == "white":
    m = arr.min(axis=2)                                # per-pixel darkness (min channel)
    alpha = np.clip((THRESH - m) / 24.0, 0, 1) * 255   # soft feather; near-white -> transparent
else:
    m = arr.max(axis=2)                                   # per-pixel brightness
    alpha = np.clip((m - THRESH) / 24.0, 0, 1) * 255      # soft feather over ~24 levels

# Crop to the visible (alpha > 0) content, with a small margin, BEFORE resizing.
# Without this, any transparent padding the generator left around the subject
# (the canvas is rarely filled edge-to-edge) survives into the exported webp —
# the Label Sprint diagram then renders smaller than the space actually
# available, because the <img> sizes off the full (mostly-empty) canvas.
# Bug found 2026-07-15 on the respiratory-system image (founder: "diagram can
# still be made a little bigger") — this crop step existed in the original
# one-off heart script but was dropped when this became the shared tool.
mask = alpha > 5
rows, cols = np.any(mask, axis=1), np.any(mask, axis=0)
if rows.any():
    r0, r1 = np.where(rows)[0][[0, -1]]
    c0, c1 = np.where(cols)[0][[0, -1]]
    H, W = arr.shape[:2]
    pad = round(0.025 * max(W, H))
    r0, c0 = max(0, r0 - pad), max(0, c0 - pad)
    r1, c1 = min(H - 1, r1 + pad), min(W - 1, c1 + pad)
    arr, alpha = arr[r0:r1+1, c0:c1+1], alpha[r0:r1+1, c0:c1+1]

rgba = np.dstack([arr, alpha]).astype(np.uint8)
full = Image.fromarray(rgba, "RGBA")

w, h = full.size
scale = HEIGHT / float(h)
out = full.resize((round(w * scale), HEIGHT), Image.LANCZOS)

webp = OUTBASE + ".webp"
out.save(webp, "WEBP", quality=82, method=6)

b64 = base64.b64encode(open(webp, "rb").read()).decode()
open(OUTBASE + ".datauri.txt", "w").write("data:image/webp;base64," + b64)

print(f"wrote {webp}  size={out.size}  aspect={out.size[0]/out.size[1]:.4f}  datauri={len(b64)//1024}KB")
print("Next: author the hotspots[] (0-1 coords) for this image — see LABEL_SPRINT_WORKFLOW.md")
