#!/bin/sh
# run-and-log.sh — runs the Canvas morning brief (all watchdogs), writes the
# result to _agents/brain/briefs/, and pops a macOS notification if anything is
# flagged. Invoked daily by the launchd agent in.canvasclasses.morning-brief.
# Manual run: sh scripts/watchdogs/run-and-log.sh

REPO="/Users/CanvasClasses/Desktop/canvas"
BRIEFDIR="$REPO/_agents/brain/briefs"
mkdir -p "$BRIEFDIR"

# Resolve node robustly (launchd has a minimal PATH; node is under nvm). Pick the
# highest installed nvm version, else fall back to PATH.
NODE="$(ls -d /Users/CanvasClasses/.nvm/versions/node/*/bin/node 2>/dev/null | sort -V | tail -1)"
[ -z "$NODE" ] && NODE="$(command -v node 2>/dev/null)"
[ -z "$NODE" ] && NODE="/usr/local/bin/node"

TS="$(date '+%Y-%m-%d %H:%M')"
OUT="$("$NODE" "$REPO/scripts/watchdogs/morning-brief.js" 2>&1)"
CODE=$?

{
  echo "# Canvas morning brief — $TS (exit $CODE)"
  echo
  echo '```'
  echo "$OUT"
  echo '```'
} > "$BRIEFDIR/latest.md"
cp "$BRIEFDIR/latest.md" "$BRIEFDIR/$(date '+%Y-%m-%d').md" 2>/dev/null
echo "$TS exit=$CODE" >> "$BRIEFDIR/run.log"

# exit 0 = all clear; 1 = warnings; 2 = needs attention; 3 = a watchdog errored
if [ "$CODE" -ne 0 ]; then
  osascript -e 'display notification "A watchdog flagged something — open _agents/brain/briefs/latest.md" with title "Canvas morning brief"' 2>/dev/null
fi
exit "$CODE"
