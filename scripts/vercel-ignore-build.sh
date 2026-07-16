#!/bin/bash
# Vercel "Ignored Build Step" for the two-app monorepo.
#
#   Project Settings -> Git -> Ignored Build Step -> Custom command:
#     student project:  bash ../../scripts/vercel-ignore-build.sh student
#     admin project:    bash ../../scripts/vercel-ignore-build.sh admin
#   (use `bash scripts/vercel-ignore-build.sh <app>` instead if the project's
#   Root Directory is the repo root rather than apps/<app>)
#
# Exit semantics (Vercel's contract): exit 0 = SKIP the build, exit 1 = BUILD.
#
# Why this exists (2026-07-16): every push built BOTH apps, and every
# production deploy RESETS that app's ISR cache (deployment-scoped — see
# _agents/plans/CRUCIBLE_CACHE_SEO_REDESIGN.md). A docs-only or admin-only
# push therefore cost a pointless student build (~Build CPU) PLUS a full
# student cache reset (~$0.25 of ISR rebuild churn as crawlers re-touch the
# question surface). This script skips a project's build unless something in
# its actual dependency graph changed.
#
# Deliberately errs toward building: shared packages/ or root manifest
# changes rebuild BOTH apps; any doubt (missing parent commit) builds.

set -u

APP="${1:-}"
if [ "$APP" != "student" ] && [ "$APP" != "admin" ]; then
  echo "[ignore-build] usage: vercel-ignore-build.sh <student|admin> — building to be safe"
  exit 1
fi

# Run from the repo root regardless of the project's Root Directory setting.
cd "$(git rev-parse --show-toplevel)" || exit 1

# First push / no parent commit -> build.
if ! git rev-parse HEAD^ >/dev/null 2>&1; then
  echo "[ignore-build] no parent commit — building"
  exit 1
fi

# Everything that can influence this app's build output.
WATCHED="apps/$APP packages package.json package-lock.json"

if git diff --quiet HEAD^ HEAD -- $WATCHED; then
  echo "[ignore-build] no changes in ($WATCHED) — SKIPPING $APP build"
  exit 0
fi

echo "[ignore-build] changes in $APP dependency graph — building"
exit 1
