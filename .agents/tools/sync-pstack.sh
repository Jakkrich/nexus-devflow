#!/usr/bin/env sh
set -eu

REINSTALL=0
for arg in "$@"; do
  case "$arg" in
    --reinstall|-Reinstall) REINSTALL=1 ;;
  esac
done

SCRIPT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
AGENTS_DIR=$(CDPATH='' cd -- "$SCRIPT_DIR/.." && pwd)
PLUGINS_DIR="$AGENTS_DIR/plugins"
PSTACK_DIR="$PLUGINS_DIR/pstack"
CACHE_DIR="$AGENTS_DIR/.cache/pstack-claude"
REPO_URL="https://github.com/michael-denyer/pstack-claude.git"
BRANCH="main"

mkdir -p "$PLUGINS_DIR" "$(dirname "$CACHE_DIR")"

if [ -d "$PLUGINS_DIR/.git" ]; then
  STATUS_OUT=$(git -C "$PLUGINS_DIR" -c core.quotepath=false status --porcelain -- pstack 2>/dev/null || true)
  if [ -n "$STATUS_OUT" ]; then
    BACKUP_DIR="$AGENTS_DIR/.backup/legacy-pstack-$(date +%Y%m%d-%H%M%S)"
    COPIED=0
    OLD_IFS=$IFS
    IFS='
'
    for line in $STATUS_OUT; do
      [ -z "$line" ] && continue
      rel=$(printf '%s' "$line" | sed 's/^...//; s/.* -> //; s/^"//; s/"$//')
      [ -z "$rel" ] && continue
      src="$PLUGINS_DIR/$rel"
      if [ -e "$src" ]; then
        dst="$BACKUP_DIR/$rel"
        mkdir -p "$(dirname "$dst")"
        cp -R "$src" "$dst"
        COPIED=$((COPIED + 1))
      fi
    done
    IFS=$OLD_IFS
    if [ "$COPIED" -gt 0 ]; then
      echo "[WARN] Backed up $COPIED local path(s) from legacy .agents/plugins/pstack to $BACKUP_DIR" >&2
    fi
  fi
  rm -rf "$PLUGINS_DIR/.git"
fi

NEED_CLONE=$REINSTALL
if [ "$NEED_CLONE" -eq 0 ] && [ -d "$CACHE_DIR/.git" ]; then
  echo "Updating pstack-claude cache in $CACHE_DIR ..."
  if ! git -C "$CACHE_DIR" pull --ff-only origin "$BRANCH"; then
    echo "[WARN] Fast-forward update failed; re-cloning pstack-claude cache cleanly ..." >&2
    NEED_CLONE=1
  fi
else
  NEED_CLONE=1
fi

if [ "$NEED_CLONE" -ne 0 ]; then
  rm -rf "$CACHE_DIR"
  echo "Cloning pstack-claude (sparse checkout) from $REPO_URL ($BRANCH) ..."
  git clone --depth 1 --branch "$BRANCH" --filter=blob:none --no-checkout "$REPO_URL" "$CACHE_DIR"
  git -C "$CACHE_DIR" sparse-checkout init --cone
  git -C "$CACHE_DIR" sparse-checkout set plugins/pstack VERSION
  git -C "$CACHE_DIR" checkout "$BRANCH"
fi

SOURCE_PSTACK="$CACHE_DIR/plugins/pstack"
if [ ! -f "$SOURCE_PSTACK/skills/poteto-mode/SKILL.md" ]; then
  echo "[ERROR] Expected plugins/pstack/skills/poteto-mode/SKILL.md not found in $CACHE_DIR" >&2
  exit 1
fi

rm -rf "$PSTACK_DIR"
cp -R "$SOURCE_PSTACK" "$PSTACK_DIR"

if [ -f "$PSTACK_DIR/.antigravity-plugin/plugin.json" ] && [ ! -f "$PSTACK_DIR/plugin.json" ]; then
  cp "$PSTACK_DIR/.antigravity-plugin/plugin.json" "$PSTACK_DIR/plugin.json"
fi

rm -f \
  "$PSTACK_DIR/hooks.json" \
  "$PSTACK_DIR/hooks/hooks.json" \
  "$PSTACK_DIR/hooks/codex-hooks.json" \
  "$PSTACK_DIR/hooks/copilot-hooks.json"

CUSTOM_LOGO="$AGENTS_DIR/assets/logo.png"
if [ -f "$CUSTOM_LOGO" ]; then
  mkdir -p "$PSTACK_DIR/assets"
  cp "$CUSTOM_LOGO" "$PSTACK_DIR/assets/logo.png"
  rm -f \
    "$PSTACK_DIR/assets/pstack-icon.png" \
    "$PSTACK_DIR/assets/pstack-icon.prompt.txt" \
    "$PSTACK_DIR/.claude-plugin/icon.png"
  for mf in \
    "$PSTACK_DIR/plugin.json" \
    "$PSTACK_DIR/.antigravity-plugin/plugin.json" \
    "$PSTACK_DIR/.codex-plugin/plugin.json" \
    "$PSTACK_DIR/.muse-plugin/plugin.json"; do
    if [ -f "$mf" ]; then
      tmp_mf=$(mktemp "${TMPDIR:-/tmp}/mf.XXXXXX")
      sed 's/pstack-icon\.png/logo.png/g' "$mf" > "$tmp_mf"
      mv "$tmp_mf" "$mf"
    fi
  done
fi

VER="unknown"
if [ -f "$CACHE_DIR/VERSION" ]; then
  VER=$(tr -d ' \r\n' < "$CACHE_DIR/VERSION")
fi
SHA=$(git -C "$CACHE_DIR" rev-parse --short HEAD)
echo "[OK] pstack-claude (version $VER, commit $SHA) ready at $PSTACK_DIR"
