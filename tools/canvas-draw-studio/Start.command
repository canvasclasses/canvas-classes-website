#!/bin/bash
# Double-click this file (on a Mac) to launch Canvas Draw Studio.
# It starts a tiny local server and opens the tool in your browser.
# Requires Node to be installed (it already is on the Canvas machines).

# Move into this script's own folder, so it works no matter where it's copied.
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node is not installed on this machine."
  echo "Install it from https://nodejs.org (the LTS version), then double-click this again."
  echo ""
  read -r -p "Press Return to close."
  exit 1
fi

if [ ! -d "dist" ]; then
  echo "The built app (dist/) is missing."
  echo "If this is a fresh checkout, run:  npm install && npm run build"
  echo ""
  read -r -p "Press Return to close."
  exit 1
fi

node serve.mjs
