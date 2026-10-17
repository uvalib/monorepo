#!/usr/bin/env bash
# deploy.sh — deploy HooHelp only if the offline regression evals pass.
#
#   scripts/deploy.sh          # offline evals → sam build → sam deploy
#   scripts/deploy.sh --live   # also run the live evals and confirm before deploying
#
# PYTHON can point at a venv with the bot's dependencies (default: python3).

set -euo pipefail

cd "$(dirname "$0")/.."
PY="${PYTHON:-python3}"

echo "== Offline regression evals"
"$PY" evals/run.py --offline

if [[ "${1:-}" == "--live" ]]; then
  echo "== Live regression evals (real model + gateway)"
  "$PY" evals/run.py --live
  read -r -p "Continue with deploy? [y/N] " answer
  [[ "$answer" == "y" || "$answer" == "Y" ]] || { echo "Deploy cancelled."; exit 1; }
fi

echo "== sam build"
sam build
echo "== sam deploy"
sam deploy
