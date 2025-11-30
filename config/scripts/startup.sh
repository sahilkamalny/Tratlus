#!/usr/bin/env bash
#
# S3-based startup script for E2B containers
# Syncs latest code from S3 and initializes the development environment
#
set -euo pipefail

# Configuration
S3_PATH="${S3_PATH:-s3://creao-template/webapp/}"
APP_DIR="/home/user/vite-template"

# Logging functions
log_info() {
    echo "🔄 [STARTUP] $1"
}

log_success() {
    echo "✅ [STARTUP] $1"
}

log_error() {
    echo "❌ [STARTUP] $1" >&2
}

# Main startup process
main() {
    log_info "Starting E2B container initialization..."
    
    # Ensure app directory exists
    mkdir -p "${APP_DIR}"
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &>/dev/null; then
        log_error "AWS credentials not configured properly"
        exit 1
    fi
    
    # Sync latest code from S3
    log_info "Syncing latest code from S3 bucket: ${S3_PATH}"
    
    if aws s3 sync "${S3_PATH}" "${APP_DIR}/" --delete --quiet; then
        chown -R user:user "${APP_DIR}"
        log_success "Code synchronized successfully"
    else
        log_error "Failed to sync code from S3"
        exit 1
    fi
    
    # Navigate to app directory
    cd "${APP_DIR}"
    
    # Display sync metadata if available
    if [ -f "sync-metadata.json" ]; then
        log_info "Sync metadata:"
        cat sync-metadata.json | jq -r '"  Commit: " + .commit + "\n  Branch: " + .branch + "\n  Timestamp: " + .timestamp' 2>/dev/null || cat sync-metadata.json
    fi
    
    # Install dependencies (leverages npm cache for speed)
    log_info "Installing/updating dependencies..."
    if npm ci --prefer-offline --silent; then
        log_success "Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        exit 1
    fi
    
    # Final success message
    log_success "Container ready for development!"
    log_info "Working directory: ${APP_DIR}"
    log_info "Available commands:"
    echo "  • npm run check    - TypeScript + ESLint validation"
    echo "  • npm run build    - Production build"
    echo "  • npm run test     - Run tests"
    
    # Keep container running if no command specified
    if [ $# -eq 0 ]; then
        log_info "Container initialized. Ready for development work."
        # Instead of infinite loop, just complete successfully
        # The E2B environment will handle keeping the container alive
    else
        log_info "Executing command: $*"
        exec "$@"
    fi
}

# Error handling
trap 'log_error "Startup failed on line $LINENO"' ERR

# Run main function
main "$@"
