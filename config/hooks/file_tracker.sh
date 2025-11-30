#!/usr/bin/env bash
#
# Generic file tracker for monitoring and displaying files from any directory.
# Provides consistent tracking behavior to avoid file repetition.
#

# Function to get tracking file path for a specific directory
get_tracking_file() {
    local dir_path="$1"
    local normalized_path=$(echo "$dir_path" | tr '/' '_')
    echo "agent/.${normalized_path}_read.local"
}

# Function to check if files have been read in this session
has_files_been_read() {
    local tracking_file="$1"
    [ -f "$tracking_file" ] && [ -s "$tracking_file" ]
}

# Function to mark files as read
mark_files_as_read() {
    local target_dir="$1"
    local file_pattern="${2:-*}"
    local tracking_file=$(get_tracking_file "$target_dir")
    
    # Create tracking file if it doesn't exist
    if [ ! -f "$tracking_file" ]; then
        touch "$tracking_file"
    fi
    
    # Find all matching files in directory and add to tracking
    if [ -d "$target_dir" ]; then
        find "$target_dir" -name "$file_pattern" -type f | sort | while read -r file; do
            if ! grep -q "^$file$" "$tracking_file" 2>/dev/null; then
                echo "$file" >> "$tracking_file"
            fi
        done
    fi
}

# Function to get unread files
get_unread_files() {
    local target_dir="$1"
    local file_pattern="${2:-*}"
    local tracking_file=$(get_tracking_file "$target_dir")
    
    # Check if directory exists
    if [ ! -d "$target_dir" ]; then
        return 0
    fi
    
    # Initialize tracking file if it doesn't exist
    if [ ! -f "$tracking_file" ]; then
        touch "$tracking_file"
    fi
    
    # Find all matching files in directory and output unread ones
    find "$target_dir" -name "$file_pattern" -type f | sort | while read -r file; do
        if ! grep -q "^$file$" "$tracking_file" 2>/dev/null; then
            echo "$file"
        fi
    done
}

# Function to display unread files (core logic)
display_unread_files() {
    local target_dir="$1"
    local file_pattern="${2:-*}"
    local header_title="${3:-FILES}"
    local header_desc="${4:-The following files provide information for this session:}"
    
    local unread_files
    unread_files=$(get_unread_files "$target_dir" "$file_pattern")
    
    # Return early if no unread files
    if [ -z "$unread_files" ]; then
        return 0
    fi
    
    # Convert string to array by reading line by line
    local unread_array=()
    while IFS= read -r line; do
        [ -n "$line" ] && unread_array+=("$line")
    done <<< "$unread_files"
    
    # Output files if any exist
    if [ ${#unread_array[@]} -gt 0 ]; then
        output_files "$target_dir" "$header_title" "$header_desc" "${unread_array[@]}"
        return 0
    fi
    
    return 1
}

# Function to output file contents with formatting
output_files() {
    local target_dir="$1"
    local header_title="$2"
    local header_desc="$3"
    shift 3
    local files=("$@")
    local tracking_file=$(get_tracking_file "$target_dir")
    
    if [ ${#files[@]} -eq 0 ]; then
        return 0
    fi
    
    echo "## 📋 $header_title - Session Guidelines"
    echo
    echo "$header_desc"
    echo
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            # Extract filename without path and extension for display
            echo "========== 📄 $file =========="
            echo
            cat "$file"
            echo
            
            # Mark this file as read
            echo "$file" >> "$tracking_file"
        fi
    done

    echo
    echo "--------------------------------"
    echo
    echo "**These files remain active for the entire session and should guide all implementation decisions.**"
}
