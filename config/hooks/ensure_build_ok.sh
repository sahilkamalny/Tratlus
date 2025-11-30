#!/usr/bin/env bash
#
# Ensures build validation passes, with retry logic for intermittent failures.
# Manages a retry counter to prevent infinite loops during build issues.
#
set -euo pipefail

MAX_RETRIES=3
RETRY_COUNT_FILE="agent/.retry_counts.build.local"

# Ensure directory exists
mkdir -p "$(dirname "$RETRY_COUNT_FILE")"

# Run build first
if build_output=$(npm run build 2>&1); then
    # Build succeeded - reset retry counter and exit successfully
    echo "0" > "$RETRY_COUNT_FILE"
    echo "✅ Build succeeded"
    exit 0
else
    # Build failed - check retry logic
    current_retry=$(cat "$RETRY_COUNT_FILE" 2>/dev/null || echo "0")
    
    if [ "$current_retry" -ge "$MAX_RETRIES" ]; then
        echo "❌ Maximum retries ($MAX_RETRIES) exceeded for build validation" >&2
        echo "$build_output" >&2
        exit 1  # Non-blocking error
    else
        echo "🔄 Retry attempt $current_retry/$MAX_RETRIES - Build validation" >&2
        echo "$((current_retry + 1))" > "$RETRY_COUNT_FILE"
        echo "$build_output" >&2
        exit 2  # Send error back to Claude
    fi
fi
