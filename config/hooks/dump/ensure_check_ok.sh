#!/usr/bin/env bash
#
# Ensures check validation passes with truncated output to prevent token limit issues.
#
set -euo pipefail

#======================================
# Configuration
#======================================
readonly TIMEOUT=60
readonly TIMEOUT_EXIT_CODE=1  # non-blocking exit code

#======================================
# Setup Logging
#======================================
setup_logs() {
    local timestamp=$(date +%s)
    
    # Main log file
    log_file="logs/check-${timestamp}.log"
    
    # Individual process logs
    format_log="logs/format-${timestamp}.log"
    typecheck_log="logs/typecheck-${timestamp}.log" 
    lint_log="logs/lint-${timestamp}.log"

    # Setup exit codes
    format_exit=0
    typecheck_exit=0
    lint_exit=0
    
    # Ensure logs directory exists
    mkdir -p logs
    
    # Cleanup old log files (keep last 10)
    find logs/ -name "check-*.log" -type f | sort -r | tail -n +11 | xargs rm -f 2>/dev/null || true
}

#======================================
# Start Parallel Checks
#======================================
start_all_checks() {
    # Start all checks in background with individual logs
    npm run format:quiet >"$format_log" 2>&1 &
    format_pid=$!

    npx tsgo --noEmit --pretty false >"$typecheck_log" 2>&1 &
    typecheck_pid=$!

    npm run lint:radix:check -- --no-color --quiet >"$lint_log" 2>&1 &
    lint_pid=$!
}

#======================================
# Process Management Functions
#======================================
is_pid_running() {
    local pid="$1"
    if [[ -z "$pid" ]]; then
        return 1
    fi
    ps -p "$pid" > /dev/null 2>&1
}

finalize_process() {
    local pid_var=$1
    local name=$2
    local log_file=$3
    local exit_var=$4

    local pid=${!pid_var}
    local exit_code=0
    local was_killed=false

    # If timeout occurred, terminate if still running and log to the process log
    if [[ "${timeout_occurred:-false}" == true ]]; then
        if is_pid_running "$pid"; then
            kill "$pid" 2>/dev/null || true
            was_killed=true
            echo "$name: timeout after ${TIMEOUT}s" >> "$log_file"
        fi
    fi

    # Capture exit code safely under set -e. Always attempt to wait so we get
    # the real status even if the process already exited before we checked.
    set +e
    wait "$pid" 2>/dev/null
    exit_code=$?
    set -e
    # Normalize exit code when timeout occurred
    if [[ "$was_killed" == true ]]; then
        exit_code=$TIMEOUT_EXIT_CODE
    elif [[ $exit_code -eq 127 ]]; then
        # Not a child / already reaped – infer from timeout flag
        if [[ "${timeout_occurred:-false}" == true ]]; then
            exit_code=$TIMEOUT_EXIT_CODE
        else
            exit_code=0
        fi
    fi

    # Indirect assignment to the provided exit var name
    printf -v "$exit_var" '%s' "$exit_code"
}

#======================================
# Wait for Processes with Timeout
#======================================
wait_for_all_processes() {
    local start_time=$(date +%s)
    timeout_occurred=false
    
    while [[ $(($(date +%s) - start_time)) -lt $TIMEOUT ]]; do
        # Check if all processes are done
        if ! is_pid_running "$format_pid" && ! is_pid_running "$typecheck_pid" && ! is_pid_running "$lint_pid"; then
            break
        fi
        sleep 0.1
    done
    
    # Timeout reached marker and messaging
    if [[ $(($(date +%s) - start_time)) -ge $TIMEOUT ]]; then
        echo "⏱️  Timeout reached (${TIMEOUT}s), terminating running processes..." >&2
        timeout_occurred=true
    fi

    # Finalize all processes: kill-if-timeout, then wait/capture exit
    finalize_process format_pid "format" "$format_log" format_exit
    finalize_process typecheck_pid "typecheck" "$typecheck_log" typecheck_exit
    finalize_process lint_pid "lint" "$lint_log" lint_exit
}

#======================================
# Generate Report
#======================================
generate_report() {
    # Combine logs for full context with section headers
    {
        if [[ $format_exit -ne 0 ]]; then
            echo "======= Format Bugs ========"
            echo ""
            cat "$format_log" 2>/dev/null || echo "(no format output)"
            echo ""
        fi
        if [[ $typecheck_exit -ne 0 ]]; then
            echo "======= TypeCheck Bugs  ========"
            echo ""
            cat "$typecheck_log" 2>/dev/null || echo "(no typecheck output)"
            echo ""
        fi
        if [[ $lint_exit -ne 0 ]]; then
            echo "======= Lint Bugs ========"
            echo ""
            cat "$lint_log" 2>/dev/null || echo "(no lint output)"
            echo ""
        fi
    } > "$log_file" 2>/dev/null
    
    # Clean up individual logs
    rm -f "$format_log" "$typecheck_log" "$lint_log" 2>/dev/null

    if [[ "${timeout_occurred:-false}" == true ]]; then
        show_error_summary
        exit $TIMEOUT_EXIT_CODE
    elif [[ ${format_exit:-0} -eq 0 && ${typecheck_exit:-0} -eq 0 && ${lint_exit:-0} -eq 0 ]]; then
        echo "✅ Check succeeded (format, typecheck, lint)"
        exit 0
    else
        show_error_summary
        exit 2
    fi
}

show_error_summary() {
    {
        echo "❌ Check failed."
        echo ""
        
        local total_lines=$(wc -l < "$log_file" 2>/dev/null)
        if [[ $total_lines -gt 100 ]]; then
            echo "Showing first 50 + last 50 lines (full log at $log_file)."
            echo "<FIRST 50 LINES>"
            head -n 50 "$log_file" 2>/dev/null
            echo "</FIRST 50 LINES>"
            echo ""
            echo "<LAST 50 LINES>"
            tail -n 50 "$log_file" 2>/dev/null
            echo "</LAST 50 LINES>"
        else
            cat "$log_file" 2>/dev/null
        fi
        
        echo ""
        echo "--------------------------------"
        echo ""
        echo "Full details saved to: $log_file"
    } >&2
}

#======================================
# Main Execution
#======================================
main() {
    setup_logs
    start_all_checks
    wait_for_all_processes
    generate_report
}

# Run main function
main