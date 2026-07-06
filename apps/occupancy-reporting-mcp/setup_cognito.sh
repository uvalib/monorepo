#!/bin/bash
# setup_cognito.sh
#
# Documents and retrieves tokens for the occupancy-reporting-mcp Cognito clients.
# All infrastructure below has already been created in pool us-east-1_mrkVZwdeA.
#
# Pool:            us-east-1_mrkVZwdeA
# Hosted UI:       https://bestsellers.auth.us-east-1.amazoncognito.com
# Resource server: occupancy-reporting-mcp  (scope: occupancy-reporting-mcp/invoke)
#
# Clients:
#   occupancy-reporting-mcp-human   (2s7er4nlmm6fdgj6nbkeio24fv) — browser/Shibboleth flow
#   occupancy-reporting-mcp-hermes  (3uuaqpphnu1vta1bap3n5uo6dk) — client credentials
#
# Usage:
#   # Get a Hermes machine token (non-interactive, safe for automation):
#   source setup_cognito.sh hermes
#
#   # Print the human/Claude login URL (requires Shibboleth SP registration with UVA ITS first):
#   source setup_cognito.sh human

set -euo pipefail

POOL_ID="us-east-1_mrkVZwdeA"
REGION="us-east-1"
HOSTED_UI_BASE="https://bestsellers.auth.us-east-1.amazoncognito.com"
DISCOVERY_URL="https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}/.well-known/openid-configuration"

# ── Client credentials (Hermes agent) ────────────────────────────────────────
HERMES_CLIENT_ID="3uuaqpphnu1vta1bap3n5uo6dk"
# Set HERMES_CLIENT_SECRET in your environment or secrets manager before running.
# Do NOT hard-code the secret here.
: "${HERMES_CLIENT_SECRET:?Set HERMES_CLIENT_SECRET before running}"

# ── Human / Claude (browser + Shibboleth) ────────────────────────────────────
HUMAN_CLIENT_ID="2s7er4nlmm6fdgj6nbkeio24fv"
HUMAN_CALLBACK_URL="http://localhost:3030/callback"

MODE="${1:-hermes}"

if [[ "$MODE" == "hermes" ]]; then
    echo "Fetching Hermes client credentials token..."
    RESPONSE=$(curl -s -X POST \
        "${HOSTED_UI_BASE}/oauth2/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials&client_id=${HERMES_CLIENT_ID}&client_secret=${HERMES_CLIENT_SECRET}&scope=occupancy-reporting-mcp/invoke")

    BEARER_TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')
    EXPIRES_IN=$(echo "$RESPONSE" | jq -r '.expires_in')

    if [[ "$BEARER_TOKEN" == "null" || -z "$BEARER_TOKEN" ]]; then
        echo "ERROR: Failed to obtain token. Response:"
        echo "$RESPONSE" | jq .
        exit 1
    fi

    echo "  Token obtained (expires in ${EXPIRES_IN}s)"
    echo ""
    echo "===== Exported variables ====="
    echo "BEARER_TOKEN  (use as: Authorization: Bearer \$BEARER_TOKEN)"
    echo "DISCOVERY_URL $DISCOVERY_URL"
    echo "=============================="

    export BEARER_TOKEN
    export DISCOVERY_URL

elif [[ "$MODE" == "human" ]]; then
    ENCODED_CALLBACK=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$HUMAN_CALLBACK_URL', safe=''))")
    HOSTED_UI_URL="${HOSTED_UI_BASE}/oauth2/authorize?client_id=${HUMAN_CLIENT_ID}&response_type=code&scope=openid&redirect_uri=${ENCODED_CALLBACK}&identity_provider=virginia.edu"

    echo "NOTE: The human/Claude browser flow requires UVA ITS to register the Cognito SP first."
    echo "      SP Entity ID: urn:amazon:cognito:sp:${POOL_ID}"
    echo "      ACS URL:      ${HOSTED_UI_BASE}/saml2/idpresponse"
    echo ""
    echo "Once registered, open this URL in your browser to authenticate:"
    echo "  $HOSTED_UI_URL"
    echo ""
    echo "Discovery URL (for agentcore create): $DISCOVERY_URL"
    echo "Client ID    (for agentcore create):  $HUMAN_CLIENT_ID"

    export DISCOVERY_URL
    export HUMAN_CLIENT_ID

else
    echo "Usage: source setup_cognito.sh [hermes|human]"
    exit 1
fi
