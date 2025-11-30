#!/usr/bin/env bash
#
# Hook display script - displays React hooks from src/hooks directory
# Uses generic file tracker to avoid repetition
#
set -euo pipefail

# Source shared file tracking utilities
source "$(dirname "$0")/file_tracker.sh"

# Define hooks directory and pattern
HOOKS_DIR="src/hooks"
HOOKS_PATTERN="*.ts"

# PostToolUse - output to stderr with header, exit code 2
display_unread_files "$HOOKS_DIR" "$HOOKS_PATTERN" "REACT HOOKS" "The following React hooks are available in this project:" >&2
exit 2