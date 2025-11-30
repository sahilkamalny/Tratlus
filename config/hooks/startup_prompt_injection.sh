#!/usr/bin/env bash
#
# This script implements prompt injection based on three conditions:
# - If NEEDS_DATA_SCHEMA is true in .env.local, inject ORM_INJECTION_PROMPT
# - If spec/platform-sdk/api-schemas is not empty, inject API_ENFORCEMENT_PROMPT
# - If spec/platform-sdk/mcp-schemas is not empty, inject MCP_ENFORCEMENT_PROMPT
#
# This script only runs on startup session.
#
set -euo pipefail

# Define prompt variables
CRITICAL_TASK_PROMPT="You MUST include these required subagent assignments at the very beginning of your todo plan, and execute subagents sequentially (never in parallel)."

ORM_INJECTION_PROMPT="## DATA LAYER

- **REQUIRED**: Use the 'data-layer-generation' subagent to analyze the data layer requirements and handle ORM operations.
- NEVER assume localStorage / mock / frontend-only solutions.
- Send the user's actual requirements as-is to the subagent.
- ALWAYS let RAF CLI determine the appropriate database-backed solution."

API_ENFORCEMENT_PROMPT="## API HOOKS

- **REQUIRED**: Use the 'api-hook-enforcer' subagent to generate production-ready React hooks for API tools."

MCP_ENFORCEMENT_PROMPT="## MCP HOOKS

- **REQUIRED**: Use the 'mcp-hook-enforcer' subagent to generate production-ready React hooks for MCP tools."

# Initialize context array
context_parts=()

# Check if NEEDS_DATA_SCHEMA is true in .env.local
if [ -f ".env.local" ] && grep -q "^NEEDS_DATA_SCHEMA=true" ".env.local"; then
  context_parts+=("$ORM_INJECTION_PROMPT")
fi

# Check if spec/platform-sdk/api-schemas exists and is not empty
if [ -d "spec/platform-sdk/api-schemas" ] && ls -A spec/platform-sdk/api-schemas/ 2>/dev/null | grep -q .; then
  context_parts+=("$API_ENFORCEMENT_PROMPT")
fi

# Check if spec/platform-sdk/mcp-schemas exists and is not empty
if [ -d "spec/platform-sdk/mcp-schemas" ] && ls -A spec/platform-sdk/mcp-schemas/ 2>/dev/null | grep -q .; then
  context_parts+=("$MCP_ENFORCEMENT_PROMPT")
fi

# Output context if any conditions were met
if [ ${#context_parts[@]} -gt 0 ]; then
  # Output summary first
  echo "=== REQUIRED SUBAGENT USAGE ==="
  echo
  echo "$CRITICAL_TASK_PROMPT"
  echo
  # Join array elements with newlines
  printf '%s\n\n' "${context_parts[@]}"
  echo "=== END OF REQUIRED SUBAGENT USAGE ==="
fi

# Always exit successfully to allow the prompt to proceed
exit 0
