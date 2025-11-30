#!/usr/bin/env bash
#
# Hook display script - displays React hooks from src/hooks directory
# Uses generic file tracker to avoid repetition
#
set -euo pipefail

# Read JSON input from stdin
input=$(cat)

# Extract the subagent_type from the tool_input
subagent_type=$(echo "$input" | jq -r '.tool_input.subagent_type')

if [ "$subagent_type" == "data-layer-generation" ]; then
    ORM_INJECTION_PROMPT="**REQUIRED**: Use code under 'src/components/data' for all data access. NEVER modify this code - only use it as-is. NEVER create new CRUD operations - only use existing ones."
    echo "$ORM_INJECTION_PROMPT" >&2
elif [ "$subagent_type" == "api-hook-enforcer" ] || [ "$subagent_type" == "mcp-hook-enforcer" ]; then
    # Source shared file tracking utilities
    source "$(dirname "$0")/file_tracker.sh"

    # Define hooks directory and pattern
    HOOKS_DIR="src/hooks"
    HOOKS_PATTERN="*.ts"

    # PostToolUse - output to stderr with header, exit code 2
    display_unread_files "$HOOKS_DIR" "$HOOKS_PATTERN" "REACT HOOKS" "The following React hooks are available in this project:" >&2
fi

exit 2
