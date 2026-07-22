#!/usr/bin/env bash
# Deploy the built Astro site to S3.
# CloudFront is managed outside this project; this script only uploads files.
#
# Usage:
#   ./scripts/deploy.sh                 # build + sync to S3
#   ./scripts/deploy.sh --skip-build    # upload existing dist/
#   ./scripts/deploy.sh --dry-run       # show what would be uploaded
#   ./scripts/deploy.sh --full          # fetch-data + build + deploy
#
# Env overrides:
#   S3_BUCKET=occupancy.library.virginia.edu
#   AWS_PROFILE=...
#   AWS_REGION=us-east-1

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

S3_BUCKET="${S3_BUCKET:-occupancy.library.virginia.edu}"
AWS_REGION="${AWS_REGION:-us-east-1}"
DIST_DIR="${DIST_DIR:-dist}"

SKIP_BUILD=0
DRY_RUN=0
FULL=0

for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=1 ;;
    --dry-run) DRY_RUN=1 ;;
    --full) FULL=1 ;;
    --help|-h)
      sed -n '2,15p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

if ! command -v aws >/dev/null 2>&1; then
  echo "Error: aws CLI is required." >&2
  exit 1
fi

if [[ "$FULL" -eq 1 ]]; then
  echo "==> Fetching occupancy data from MCP gateway"
  npm run fetch-data
  SKIP_BUILD=0
fi

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  echo "==> Building site"
  npm run build
fi

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Error: build output not found at ${DIST_DIR}/" >&2
  exit 1
fi

if [[ ! -f "$DIST_DIR/index.html" ]]; then
  echo "Error: ${DIST_DIR}/index.html missing — build looks incomplete." >&2
  exit 1
fi

PAGE_COUNT="$(find "$DIST_DIR" -name 'index.html' | wc -l | tr -d ' ')"
echo "==> Deploying ${PAGE_COUNT} HTML pages from ${DIST_DIR}/"
echo "    Bucket:  s3://${S3_BUCKET}"
echo "    Region:  ${AWS_REGION}"

export AWS_DEFAULT_REGION="$AWS_REGION"

SYNC_ARGS=(s3 sync "${DIST_DIR}/" "s3://${S3_BUCKET}/" --delete)
if [[ "$DRY_RUN" -eq 1 ]]; then
  SYNC_ARGS+=(--dryrun)
  echo "    Mode:    DRY RUN (no changes)"
fi

echo "==> Syncing site to s3://${S3_BUCKET}/"
aws "${SYNC_ARGS[@]}"

echo ""
if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Done (dry run)."
else
  echo "Deploy complete."
  echo "  Site: https://occupancy.library.virginia.edu/"
fi
