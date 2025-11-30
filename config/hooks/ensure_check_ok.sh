#!/usr/bin/env bash
#
# Ensures code checks (typecheck & lint) pass. 
# This script does not perform any file modifications.
#
set -euo pipefail

# Run check first
check_command="npx tsgo --noEmit && npm run lint:radix"
if check_output=$(timeout 20 bash -c "$check_command" 2>&1); then
    # Check succeeded - exit successfully
    echo "✅ Check succeeded"
    exit 0
else
    # Check failed - no retry, just report
    echo "❌ Check validation failed" >&2
    echo "--------------------------------"
    echo "Check output:" >&2
    echo "$check_output" >&2
    echo "--------------------------------"
    exit 2  # Send error back to Claude
fi
