#!/usr/bin/env bash
set -euo pipefail

# Script to deploy a TEI XML file to remote server and trigger reindex
# Usage: ./deploy-tei.sh [file] [remote_host]

FILE=${1:-transcription.tei.xml}
REMOTE_HOST=${2:-docker-dev-0.internal.lib.virginia.edu}
REMOTE_TARGET_DIR=/mnt/xtf/data/StudiesInBiblio/uvaBook/tei2/

echo "Transferring $FILE to $REMOTE_HOST home directory..."
scp "$FILE" "$REMOTE_HOST:"

echo "Moving file and running reindex on remote server..."
ssh "$REMOTE_HOST" << EOF
set -euo pipefail
cd xtf-docker
# move from remote home ($HOME) to target, then reindex
sudo mv "\$HOME/$FILE" "$REMOTE_TARGET_DIR"
sudo package/script/reindex-bov.sh
EOF

echo "Deployment of $FILE completed."
