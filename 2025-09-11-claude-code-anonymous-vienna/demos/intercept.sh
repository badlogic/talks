#!/bin/bash

# Clean up old requests log
rm -f requests.jsonl

# Check for --messages flag and filter it from arguments
MESSAGES_ONLY=false
FILTERED_ARGS=()

for arg in "$@"; do
    if [ "$arg" = "--messages" ]; then
        MESSAGES_ONLY=true
    else
        FILTERED_ARGS+=("$arg")
    fi
done

# Run Claude CLI with the fetch interceptor injected
echo "Starting Claude CLI with fetch interception..."
if [ "$MESSAGES_ONLY" = true ]; then
    echo "Logging only Anthropic Messages API calls to requests.jsonl"
    export INTERCEPT_MESSAGES_ONLY=true
else
    echo "Logging all requests to requests.jsonl"
    export INTERCEPT_MESSAGES_ONLY=false
fi
echo ""

# Run with filtered arguments (without --messages)
node --import ./intercept.js node_modules/@anthropic-ai/claude-code/cli.js --dangerously-skip-permissions "${FILTERED_ARGS[@]}"