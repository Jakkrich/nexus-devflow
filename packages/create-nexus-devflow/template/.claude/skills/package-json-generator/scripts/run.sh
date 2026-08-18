#!/bin/bash
set -e

# Wrapper script to run the Node.js generator

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-$(pwd)}"

# Convert WSL paths to Windows paths for Node.js if running in WSL
if grep -q microsoft /proc/version 2>/dev/null; then
    # wslpath is available in WSL to convert paths
    if command -v wslpath >/dev/null 2>&1; then
        TARGET_DIR_WIN=$(wslpath -w "$TARGET_DIR" 2>/dev/null || echo "$TARGET_DIR")
        node "$SCRIPT_DIR/generate.js" "$TARGET_DIR_WIN"
        exit $?
    fi
fi

node "$SCRIPT_DIR/generate.js" "$TARGET_DIR"
