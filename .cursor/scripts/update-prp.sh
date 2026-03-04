#!/bin/bash
BRANCH="prp-auto-dev"
REPO_URL="https://git.nstda.or.th/application-etc/rules-development.git"
CHECK_ONLY=false
APPLY=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --check|-CheckOnly) CHECK_ONLY=true ;;
        --apply|-Apply) APPLY=true ;;
    esac
    shift
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

# Global Check for Target Root based on execution context
if [[ "$SCRIPT_DIR" == *"tmp"* || "$SCRIPT_DIR" == *"Temp"* || "$SCRIPT_DIR" == *"TEMP"* ]]; then
    # Running from an external one-liner (temp dir) -> Target is where the user ran the command
    TARGET_ROOT="$PWD"
else
    # Running from inside an existing project's .cursor/scripts
    TARGET_CURSOR_DIR=$(dirname "$SCRIPT_DIR")
    TARGET_ROOT=$(dirname "$TARGET_CURSOR_DIR")
fi
LOCAL_HASH_FILE="$TARGET_ROOT/.cursor/prp-commit.txt"

get_remote_hash() {
    local output
    # By omitting the URL explicitly here if already cloned, or using the plain repo url,
    # Git might still prompt if it's the first time and not cached.
    # To prevent locking the terminal with prompts, we use a timeout or batch mode.
    # We allow the prompt, but we configure git to temporarily remember the credential
    git config --global credential.helper "cache --timeout=900" 2>/dev/null || true
    output=$(git ls-remote "$REPO_URL" "$BRANCH" 2>/dev/null)
    if [ $? -ne 0 ] || [ -z "$output" ]; then
        echo -e "\033[31m[Error] Failed to reach repository '$REPO_URL'. Check your network, VPN, or Git credentials.\033[0m"
        exit 1
    fi
    echo "$output" | awk '{print $1}'
}

get_local_hash() {
    if [ -f "$LOCAL_HASH_FILE" ]; then
        head -n 1 "$LOCAL_HASH_FILE" | tr -d '[:space:]'
    else
        echo "NONE"
    fi
}

if [ "$CHECK_ONLY" = true ]; then
    echo -e "\033[36m[i] Verifying framework updates with '$BRANCH'...\033[0m"
    REMOTE_HASH=$(get_remote_hash)
    LOCAL_HASH=$(get_local_hash)
    
    if [ "$REMOTE_HASH" != "$LOCAL_HASH" ]; then
        echo "UPDATE_AVAILABLE=true"
        echo "LATEST_HASH=$REMOTE_HASH"
        echo "CURRENT_HASH=$LOCAL_HASH"
        echo -e "\n\033[33m[!] An update is available! Current: $LOCAL_HASH -> New: $REMOTE_HASH\033[0m"
    else
        echo "UPDATE_AVAILABLE=false"
        echo -e "\033[32m[OK] You are already on the latest system version ($LOCAL_HASH).\033[0m"
    fi
    exit 0
fi

if [ "$APPLY" = true ]; then
    echo -e "\033[36m==========================================\033[0m"
    echo -e "\033[32m[>] Applying PRP Framework Update\033[0m"
    echo "Repository: $REPO_URL"
    echo "Branch:     $BRANCH"
    echo -e "\033[36m==========================================\033[0m"

    REMOTE_HASH=$(get_remote_hash)
    LOCAL_HASH=$(get_local_hash)

    if [ "$REMOTE_HASH" = "$LOCAL_HASH" ]; then
        echo -e "\033[32m[OK] You are already on the latest version. Update aborted.\033[0m"
        exit 0
    fi

    TEMP_DIR=$(mktemp -d -t prp-updater-XXXXXXXXXX)
    echo -e "\n[1/3] Downloading latest framework components..."

    git clone -b "$BRANCH" --depth 1 "$REPO_URL" "$TEMP_DIR" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo -e "\033[31m[Error] Failed to download repository. Please check your access rights.\033[0m"
        rm -rf "$TEMP_DIR"
        exit 1
    fi

    echo "[2/3] Applying updates to local framework..."

    TARGET_CURSOR="$TARGET_ROOT/.cursor"
    TARGET_AUTO_CLAUDE="$TARGET_ROOT/.auto-claude"

    echo "   -> Project Target Root : $TARGET_ROOT"

    mkdir -p "$TARGET_CURSOR"
    mkdir -p "$TARGET_AUTO_CLAUDE"

    if [ -d "$TEMP_DIR/.cursor" ]; then
        echo "   -> Updating .cursor/ folder..."
        cp -a "$TEMP_DIR/.cursor/"* "$TARGET_CURSOR/" 2>/dev/null || true
    fi

    if [ -d "$TEMP_DIR/.auto-claude" ]; then
        echo "   -> Updating .auto-claude/ folder..."
        cp -a "$TEMP_DIR/.auto-claude/"* "$TARGET_AUTO_CLAUDE/" 2>/dev/null || true
    fi

    echo "$REMOTE_HASH" > "$LOCAL_HASH_FILE"

    echo "[3/3] Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"

    echo -e "\n\033[32m[OK] Update Completed Successfully! System updated to commit $REMOTE_HASH\033[0m"
    
    # Exit cleanly so bash doesn't read the rewritten file in the middle
    exit 0
fi

echo -e "\033[33m[!] Please specify --check or --apply\033[0m"
