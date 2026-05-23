#!/usr/bin/env bash
# Build a single composite PNG for one MCQ question — question-text image (if any)
# stacked on top of a 2x2 grid of option diagrams.
#
# Usage:
#   _render_question.sh <display_id> <q_text_url|-> <opt_a_url|-> <opt_b_url|-> <opt_c_url|-> <opt_d_url|->
#
# Pass `-` for any slot with no image. Output → /tmp/<display_id>_grid.png
#
# ⚠️ ImageMagick on this system has no freetype delegate — text annotation is broken.
# Instead, each option tile gets a unique colored border:
#   (a) RED border   — top-left of grid
#   (b) GREEN border — top-right
#   (c) BLUE border  — bottom-left
#   (d) YELLOW border— bottom-right
# The question-text tile (if present) gets a WHITE border and sits on top.
# Grid layout is row-major from `montage -tile 2x2`.

set -euo pipefail

ID="$1"; QURL="$2"; A="$3"; B="$4"; C="$5"; D="$6"
TMP=/tmp/halo_render_$ID
rm -rf "$TMP"; mkdir -p "$TMP"

# $1=url $2=color $3=out
make_tile() {
  local url="$1" color="$2" out="$3"
  if [ "$url" = "-" ]; then
    # Empty placeholder still gets its colored border so position is unambiguous.
    magick -size 500x60 xc:'#0a0a0a' \
      -bordercolor "$color" -border 14 -background black "$out"
    return
  fi
  local raw="$TMP/raw_$color.svg"
  if ! curl -fsSL "$url" -o "$raw" 2>/dev/null; then
    magick -size 500x300 xc:'#400' -bordercolor "$color" -border 14 "$out"
    return
  fi
  if head -c 40 "$raw" | grep -qi 'html\|error'; then
    magick -size 500x300 xc:'#400' -bordercolor "$color" -border 14 "$out"
    return
  fi
  # Render the SVG with a hard cap, then wrap in the colored border.
  magick -background black -density 100 "$raw" \
    -resize '500x500>' -bordercolor "$color" -border 14 "$out" 2>/dev/null || \
    magick -size 500x300 xc:'#400' -bordercolor "$color" -border 14 "$out"
}

make_tile "$A" red    "$TMP/a.png"
make_tile "$B" green  "$TMP/b.png"
make_tile "$C" blue   "$TMP/c.png"
make_tile "$D" yellow "$TMP/d.png"

# 2x2 row-major grid of options.
magick montage "$TMP/a.png" "$TMP/b.png" "$TMP/c.png" "$TMP/d.png" \
  -tile 2x2 -geometry +6+6 -background black "$TMP/grid.png"

OUT=/tmp/${ID}_grid.png
if [ "$QURL" = "-" ]; then
  cp "$TMP/grid.png" "$OUT"
else
  make_tile "$QURL" white "$TMP/q.png"
  magick "$TMP/q.png" "$TMP/grid.png" -append -background black "$OUT"
fi

# Final size sanity: cap whole composite at 1400 wide.
magick "$OUT" -resize '1400x1400>' "$OUT"
identify -format "%w x %h  %b\n" "$OUT" >&2
echo "$OUT"
