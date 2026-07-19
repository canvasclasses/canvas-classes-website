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

# ── Diff base ────────────────────────────────────────────────────────────────
# MUST be the last successfully DEPLOYED commit, not HEAD^. A push can carry
# several commits; diffing only HEAD^..HEAD sees just the top one. That bug
# skipped a real deploy on 2026-07-18: the Phase-A push ended with a
# docs/scripts-only commit, so the script saw "no apps/student changes" and
# ignored the two app commits underneath. Vercel provides
# VERCEL_GIT_PREVIOUS_SHA (the last successful deployment's commit) to the
# Ignored Build Step for exactly this comparison.
BASE=""
if [ -n "${VERCEL_GIT_PREVIOUS_SHA:-}" ]; then
  if git rev-parse -q --verify "${VERCEL_GIT_PREVIOUS_SHA}^{commit}" >/dev/null 2>&1; then
    BASE="$VERCEL_GIT_PREVIOUS_SHA"
  elif git fetch --quiet --depth=1 origin "$VERCEL_GIT_PREVIOUS_SHA" 2>/dev/null \
       && git rev-parse -q --verify "${VERCEL_GIT_PREVIOUS_SHA}^{commit}" >/dev/null 2>&1; then
    BASE="$VERCEL_GIT_PREVIOUS_SHA"
  else
    # Previous-deploy SHA exists but isn't reachable in this clone — never
    # guess with a shallower base; build.
    echo "[ignore-build] previous deploy SHA ${VERCEL_GIT_PREVIOUS_SHA} unavailable in clone — building to be safe"
    exit 1
  fi
elif git rev-parse -q --verify HEAD^ >/dev/null 2>&1; then
  # No Vercel env (local testing) — single-commit diff is the best available.
  BASE="HEAD^"
else
  echo "[ignore-build] no parent commit — building"
  exit 1
fi

# Everything that can influence this app's build output.
WATCHED="apps/$APP packages package.json package-lock.json"

if git diff --quiet "$BASE" HEAD -- $WATCHED; then
  echo "[ignore-build] no changes in ($WATCHED) since $BASE — SKIPPING $APP build"
  exit 0
fi

echo "[ignore-build] changes in $APP dependency graph since $BASE — building"
exit 1
