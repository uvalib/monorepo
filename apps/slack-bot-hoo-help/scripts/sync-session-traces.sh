#!/usr/bin/env bash
# sync-session-traces.sh — Pull HooHelp session traces from S3 into local logs/
#
# Full JSON transcripts (prompts, MCP tool calls/results, model replies) written
# by the production Lambda when CONVERSATION_TRACE is s3 or both.
#
# Usage:
#   ./scripts/sync-session-traces.sh              # sync all traces
#   ./scripts/sync-session-traces.sh --dry-run    # list only
#   TRACE_BUCKET=... ./scripts/sync-session-traces.sh
#
# Defaults match the prod SAM stack outputs.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

BUCKET="${TRACE_BUCKET:-hoohelp-session-traces-prod-115119339709}"
PREFIX="${TRACE_PREFIX:-traces}"
REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}"
DEST="${TRACE_LOCAL_DIR:-${PROJECT_DIR}/logs/session-traces}"

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    -n|--dry-run) DRY_RUN=1 ;;
    -h|--help)
      sed -n '2,16p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      echo "Usage: $0 [--dry-run]" >&2
      exit 1
      ;;
  esac
done

if ! command -v aws >/dev/null 2>&1; then
  echo "error: aws CLI not found" >&2
  exit 1
fi

SRC="s3://${BUCKET}/${PREFIX}/"
mkdir -p "${DEST}"

echo "Syncing session traces"
echo "  source : ${SRC}"
echo "  dest   : ${DEST}"
echo "  region : ${REGION}"
if [[ "${DRY_RUN}" -eq 1 ]]; then
  echo "  mode   : dry-run"
fi
echo

sync_args=(s3 sync "${SRC}" "${DEST}/" --region "${REGION}" --only-show-errors)
if [[ "${DRY_RUN}" -eq 1 ]]; then
  sync_args+=(--dryrun)
fi

aws "${sync_args[@]}"

if [[ "${DRY_RUN}" -eq 0 ]]; then
  count="$(find "${DEST}" -type f -name '*.json' 2>/dev/null | wc -l | tr -d ' ')"
  echo "Done. Local JSON traces: ${count}"
  echo "  ${DEST}"
else
  echo "Dry-run complete (no files written)."
fi
