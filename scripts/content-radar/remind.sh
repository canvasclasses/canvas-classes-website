#!/bin/sh
# remind.sh — the Content Radar scheduler.
#
# WHY A REMINDER, NOT A HEADLESS RUN: the Content Radar's strongest sources
# (the vidiq MCP — channel/competitor analytics, breakouts, comments, title
# scoring) come from an INTERACTIVELY-AUTHENTICATED claude.ai connector. A
# background/headless `claude -p` run cannot reliably reach that connector, so
# an unattended cron would silently produce vidiq-less (degraded) briefs — the
# exact silent-failure mode the AI-native layer exists to prevent
# (AI_NATIVE_ROADMAP §5.1 / §5.7). So instead of running blind, this fires a
# macOS notification that prompts the founder to run the skill in a LIVE Claude
# Code session, where vidiq is authenticated and the brief is complete.
#
# Cadence: weekly heavy digest on Mondays, light daily pass otherwise
# (CONTENT_RADAR.md §5). Invoked by launchd: in.canvasclasses.content-radar.
# Manual run: sh scripts/content-radar/remind.sh

DOW="$(date '+%u')"   # 1 = Monday ... 7 = Sunday
if [ "$DOW" = "1" ]; then
  TITLE="Content Radar — weekly digest"
  MSG="Run /content-radar in Claude Code for this week's ranked 'what to record' shortlist."
else
  TITLE="Content Radar — daily pass"
  MSG="Run /content-radar daily — quick check for breaking exam news / competitor breakouts."
fi

osascript -e "display notification \"$MSG\" with title \"$TITLE\"" 2>/dev/null
echo "$(date '+%Y-%m-%d %H:%M') reminder fired (dow=$DOW)" >> "$(dirname "$0")/remind.log"
