#!/usr/bin/env sh
set -eu

DEFAULT_SOURCE_REPO="https://github.com/Jakkrich/poteto-starter.git"
TARGET_DIR=""
SOURCE_REPO=""
BRANCH="main"
UPGRADE=0
SKIP_PSTACK_SYNC=0
FORCE=0
HAS_SOURCE_ARG=0
HAS_BRANCH_ARG=0

while [ "$#" -gt 0 ]; do
  case "$1" in
    --target)
      TARGET_DIR="$2"; shift 2 ;;
    --source)
      SOURCE_REPO="$2"; HAS_SOURCE_ARG=1; shift 2 ;;
    --branch)
      BRANCH="$2"; HAS_BRANCH_ARG=1; shift 2 ;;
    --upgrade)
      UPGRADE=1; shift ;;
    --skip-pstack-sync)
      SKIP_PSTACK_SYNC=1; shift ;;
    --force)
      FORCE=1; shift ;;
    *)
      echo "Unknown option: $1" >&2
      exit 2 ;;
  esac
done

SCRIPT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
STARTER_ROOT=$(CDPATH='' cd -- "$SCRIPT_DIR/../.." && pwd)

if [ "$UPGRADE" -eq 1 ] && [ -z "$TARGET_DIR" ]; then
  TARGET_DIR="$STARTER_ROOT"
fi
if [ -z "$TARGET_DIR" ]; then
  TARGET_DIR=$(pwd)
fi

mkdir -p "$TARGET_DIR"
TARGET_FULL=$(CDPATH='' cd -- "$TARGET_DIR" && pwd)
HOME_FULL=$(CDPATH='' cd -- "$HOME" && pwd)
if [ "$TARGET_FULL" = "$HOME_FULL" ] || [ "$TARGET_FULL" = "/" ]; then
  echo "[ERROR] Refusing unsafe target dir: $TARGET_FULL (on-project installs only)" >&2
  exit 1
fi

MANIFEST_PATH="$TARGET_FULL/.agents/starter-kit.json"
if [ "$HAS_SOURCE_ARG" -eq 0 ] || [ -z "$SOURCE_REPO" ]; then
  if [ -f "$MANIFEST_PATH" ]; then
    parsed_src=$(awk '
      /"sourceRepo"[[:space:]]*:/ {
        sub(/^.*"sourceRepo"[[:space:]]*:[[:space:]]*"/, "")
        sub(/".*$/, "")
        gsub(/\\\\/, "\\")
        print
        exit
      }
    ' "$MANIFEST_PATH")
    [ -n "$parsed_src" ] && SOURCE_REPO="$parsed_src"
    if [ "$HAS_BRANCH_ARG" -eq 0 ]; then
      parsed_br=$(awk '
        /"branch"[[:space:]]*:/ {
          sub(/^.*"branch"[[:space:]]*:[[:space:]]*"/, "")
          sub(/".*$/, "")
          gsub(/\\\\/, "\\")
          print
          exit
        }
      ' "$MANIFEST_PATH")
      [ -n "$parsed_br" ] && BRANCH="$parsed_br"
    fi
  fi
  [ -z "$SOURCE_REPO" ] && SOURCE_REPO="$DEFAULT_SOURCE_REPO"
fi

if [ "$UPGRADE" -eq 1 ]; then
  if [ -d "$TARGET_FULL/.git" ] && [ "$FORCE" -eq 0 ]; then
    ORIGIN_URL=$(git -C "$TARGET_FULL" remote get-url origin 2>/dev/null || true)
    case "$ORIGIN_URL" in
      *poteto-starter*|*agent-starter-kit*)
        DIRTY=$(git -C "$TARGET_FULL" status --porcelain 2>/dev/null || true)
        if [ -n "$DIRTY" ]; then
          echo "[ERROR] Refusing --upgrade on dirty starter-kit repository ($TARGET_FULL). Commit/stash changes or pass --force." >&2
          exit 1
        fi
        ;;
    esac
  fi

  if [ -d "$SOURCE_REPO" ]; then
    SRC_FULL=$(CDPATH='' cd -- "$SOURCE_REPO" && pwd)
    if [ "$SRC_FULL" = "$TARGET_FULL" ]; then
      echo "[ERROR] Upgrade source ($SRC_FULL) cannot equal target ($TARGET_FULL)." >&2
      exit 1
    fi
    if [ "$SKIP_PSTACK_SYNC" -eq 1 ]; then
      exec sh "$SRC_FULL/.agents/tools/install-project.sh" --target "$TARGET_FULL" --source "$SRC_FULL" --branch "$BRANCH" --skip-pstack-sync
    else
      exec sh "$SRC_FULL/.agents/tools/install-project.sh" --target "$TARGET_FULL" --source "$SRC_FULL" --branch "$BRANCH"
    fi
  fi

  TMP_CLONE=$(mktemp -d "${TMPDIR:-/tmp}/starter-kit-upgrade.XXXXXX")
  trap 'rm -rf "$TMP_CLONE"' EXIT INT TERM
  echo "Fetching latest agent-starter-kit from $SOURCE_REPO ($BRANCH) ..."
  git clone --depth 1 --branch "$BRANCH" "$SOURCE_REPO" "$TMP_CLONE"
  if [ "$SKIP_PSTACK_SYNC" -eq 1 ]; then
    sh "$TMP_CLONE/.agents/tools/install-project.sh" --target "$TARGET_FULL" --source "$SOURCE_REPO" --branch "$BRANCH" --skip-pstack-sync
  else
    sh "$TMP_CLONE/.agents/tools/install-project.sh" --target "$TARGET_FULL" --source "$SOURCE_REPO" --branch "$BRANCH"
  fi
  exit 0
fi

PROJECT_NAME=$(basename "$TARGET_FULL")
TEMPLATES_DIR="$STARTER_ROOT/.agents/skills/chief-of-staff/templates"

copy_dir_clean() {
  src="$1"
  dst="$2"
  if [ -d "$src" ]; then
    rm -rf "$dst"
    mkdir -p "$(dirname "$dst")"
    cp -R "$src" "$dst"
  fi
}

copy_tools_preserve_extra() {
  src_dir="$1"
  dst_dir="$2"
  mkdir -p "$dst_dir"
  for f in "$src_dir"/*; do
    [ -f "$f" ] || continue
    cp "$f" "$dst_dir/$(basename "$f")"
  done
}

merge_additive_gitignore() {
  src="$1"
  dst="$2"
  if [ ! -f "$dst" ]; then
    tr -d '\r' < "$src" > "$dst"
    return
  fi
  tmp_gi=$(mktemp "${TMPDIR:-/tmp}/gi-merge.XXXXXX")
  tr -d '\r' < "$dst" > "$tmp_gi"
  for req in "plugins/" ".cache/" ".backup/"; do
    if ! awk -v r="$req" '{ gsub(/^[ \t]+|[ \t]+$/, ""); if ($0 == r) found=1 } END { exit !found }' "$tmp_gi"; then
      printf '%s\n' "$req" >> "$tmp_gi"
    fi
  done
  mv "$tmp_gi" "$dst"
}

merge_managed_markdown() {
  src="$1"
  dst="$2"
  legacy_v1="$3"
  preserve_fm="$4"

  if [ ! -f "$dst" ]; then
    tr -d '\r' < "$src" > "$dst"
    return
  fi

  tmp_out=$(mktemp "${TMPDIR:-/tmp}/md-merge.XXXXXX")
  awk -v src_file="$src" -v v1_file="$legacy_v1" -v preserve_fm="$preserve_fm" '
    function slurp(path,    line, buf, first) {
      buf = ""; first = 1
      while ((getline line < path) > 0) {
        gsub(/\r$/, "", line)
        buf = first ? line : (buf "\n" line)
        first = 0
      }
      close(path)
      return buf
    }
    BEGIN {
      src_raw = slurp(src_file)
      sub(/\n+$/, "", src_raw)

      dst_raw = slurp(ARGV[1])
      sub(/\n+$/, "", dst_raw)

      b_tag = "<!-- BEGIN AGENT-STARTER-KIT -->"
      e_tag = "<!-- END AGENT-STARTER-KIT -->"

      sb = index(src_raw, b_tag)
      se = index(src_raw, e_tag)
      if (sb == 0 || se == 0 || se < sb) {
        print "Missing markers in " src_file > "/dev/stderr"
        exit 2
      }
      block = substr(src_raw, sb, se + length(e_tag) - sb)

      db = index(dst_raw, b_tag)
      de = index(dst_raw, e_tag)
      if (db > 0 && de > db) {
        out = substr(dst_raw, 1, db - 1) block substr(dst_raw, de + length(e_tag))
        printf "%s\n", out
        exit 0
      }

      if (v1_file != "") {
        v1_raw = slurp(v1_file)
        sub(/\n+$/, "", v1_raw)
        if (dst_raw == v1_raw) {
          printf "%s\n", src_raw
          exit 0
        }
        v1_idx = index(dst_raw, v1_raw)
        if (v1_idx > 0) {
          rep = (preserve_fm == 1) ? src_raw : block
          out = substr(dst_raw, 1, v1_idx - 1) rep substr(dst_raw, v1_idx + length(v1_raw))
          sub(/\n+$/, "", out)
          printf "%s\n", out
          exit 0
        }
      }

      if (preserve_fm == 1 && substr(dst_raw, 1, 4) == "---\n") {
        rest_start = index(substr(dst_raw, 5), "\n---\n")
        if (rest_start > 0) {
          fm_end = 4 + rest_start + 4
          fm = substr(dst_raw, 1, fm_end)
          tail = substr(dst_raw, fm_end + 1)
          sub(/^\n+/, "", tail)
          printf "%s%s\n\n%s\n", fm, block, tail
          exit 0
        }
      }

      tail2 = dst_raw
      sub(/^\n+/, "", tail2)
      printf "%s\n\n%s\n", block, tail2
      exit 0
    }
  ' "$dst" > "$tmp_out"
  mv "$tmp_out" "$dst"
}

migrate_legacy_cursor_rule() {
  target_root="$1"
  legacy_tmpl="$2"
  target_rule="$3"
  legacy_mdc="$target_root/.cursor/rules/chief-of-staff.mdc"
  [ -f "$legacy_mdc" ] || return 0

  tmp_custom=$(mktemp "${TMPDIR:-/tmp}/mdc-custom.XXXXXX")
  awk -v v1_file="$legacy_tmpl" '
    function slurp(path,    line, buf, first) {
      buf = ""; first = 1
      while ((getline line < path) > 0) {
        gsub(/\r$/, "", line)
        buf = first ? line : (buf "\n" line)
        first = 0
      }
      close(path)
      return buf
    }
    BEGIN {
      mdc_raw = slurp(ARGV[1])
      sub(/\n+$/, "", mdc_raw)
      v1_raw = slurp(v1_file)
      sub(/\n+$/, "", v1_raw)

      if (mdc_raw == v1_raw) {
        exit 0
      }
      idx = index(mdc_raw, v1_raw)
      if (idx > 0) {
        out = substr(mdc_raw, 1, idx - 1) substr(mdc_raw, idx + length(v1_raw))
      } else {
        out = mdc_raw
        if (substr(out, 1, 4) == "---\n") {
          fm_end = index(substr(out, 5), "\n---\n")
          if (fm_end > 0) {
            out = substr(out, 4 + fm_end + 5)
          }
        }
      }
      gsub(/^[ \t\n]+|[ \t\n]+$/, "", out)
      if (out != "") {
        printf "%s", out
      }
      exit 0
    }
  ' "$legacy_mdc" > "$tmp_custom"

  if [ -s "$tmp_custom" ] && [ -f "$target_rule" ]; then
    if ! awk -v cf="$tmp_custom" '
      BEGIN {
        first = 1; needle = ""
        while ((getline line < cf) > 0) { needle = first ? line : (needle "\n" line); first = 0 }
        close(cf)
        first = 1; hay = ""
        while ((getline line < ARGV[1]) > 0) { gsub(/\r$/, "", line); hay = first ? line : (hay "\n" line); first = 0 }
        close(ARGV[1])
        exit (index(hay, needle) > 0 ? 0 : 1)
      }
    ' "$target_rule"; then
      {
        printf '\n## Migrated Legacy Notes (from .cursor/rules/chief-of-staff.mdc)\n\n'
        cat "$tmp_custom"
        printf '\n'
      } >> "$target_rule"
      echo "Migrated custom notes from .cursor/rules/chief-of-staff.mdc into .agents/rules/chief-of-staff.md"
    fi
  fi
  rm -f "$tmp_custom" "$legacy_mdc"
  rmdir "$target_root/.cursor/rules" 2>/dev/null || true
  rmdir "$target_root/.cursor" 2>/dev/null || true
}

json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

if [ "$TARGET_FULL" != "$STARTER_ROOT" ]; then
  echo "Installing/updating starter-kit files into $TARGET_FULL ..."
  mkdir -p "$TARGET_FULL/.agents/rules"

  merge_additive_gitignore "$STARTER_ROOT/.agents/.gitignore" "$TARGET_FULL/.agents/.gitignore"
  copy_tools_preserve_extra "$STARTER_ROOT/.agents/tools" "$TARGET_FULL/.agents/tools"
  copy_dir_clean "$STARTER_ROOT/.agents/skills/chief-of-staff" "$TARGET_FULL/.agents/skills/chief-of-staff"
  copy_dir_clean "$STARTER_ROOT/.agents/skills/make-bot-ui" "$TARGET_FULL/.agents/skills/make-bot-ui"
  copy_dir_clean "$STARTER_ROOT/.agents/docs/pstack-guide-th" "$TARGET_FULL/.agents/docs/pstack-guide-th"
  copy_dir_clean "$STARTER_ROOT/.agents/assets" "$TARGET_FULL/.agents/assets"

  TARGET_COS_RULE="$TARGET_FULL/.agents/rules/chief-of-staff.md"
  merge_managed_markdown \
    "$STARTER_ROOT/.agents/rules/chief-of-staff.md" \
    "$TARGET_COS_RULE" \
    "" \
    1

  migrate_legacy_cursor_rule \
    "$TARGET_FULL" \
    "$TEMPLATES_DIR/legacy-v1-cursor-rule.txt" \
    "$TARGET_COS_RULE"

  merge_managed_markdown \
    "$STARTER_ROOT/.agents/rules/pstack-antigravity.md" \
    "$TARGET_FULL/.agents/rules/pstack-antigravity.md" \
    "$TEMPLATES_DIR/legacy-v1-pstack-antigravity.txt" \
    1

  if [ ! -f "$TARGET_FULL/AI_HANDOFF.md" ]; then
    awk -v p="$PROJECT_NAME" '{
      out = ""
      s = $0
      while ((idx = index(s, "<project-name>")) > 0) {
        out = out substr(s, 1, idx - 1) p
        s = substr(s, idx + 14)
      }
      print out s
    }' "$TEMPLATES_DIR/AI_HANDOFF.md" > "$TARGET_FULL/AI_HANDOFF.md"
  fi

  if [ ! -f "$TARGET_FULL/.context/cos-board.md" ]; then
    mkdir -p "$TARGET_FULL/.context"
    TODAY=$(date +%Y-%m-%d)
    awk -v d="$TODAY" -v p="$PROJECT_NAME" '
      function repl(str, pat, val,    out, idx) {
        out = ""
        while ((idx = index(str, pat)) > 0) {
          out = out substr(str, 1, idx - 1) val
          str = substr(str, idx + length(pat))
        }
        return out str
      }
      {
        gsub(/\r$/, "")
        line = repl($0, "YYYY-MM-DD", d)
        line = repl(line, "<repo>", p)
        print line
      }
      /^## Latest summary$/ {
        print "Starter kit installed on-project. Waiting for project bootstrap (fill `AI_HANDOFF.md` and customize `.agents/skills/verify-project/SKILL.md`)."
      }
      /^\|---\|---\|---\|---\|---\|---\|---\|---\|$/ {
        printf "| bootstrap-repo | Populate `AI_HANDOFF.md` and customize `verify-project` skill from real codebase inspection | `AI_HANDOFF.md` has accurate build/test commands & invariants; `verify-project` runs cleanly | Investigation | root | queued | Inspect codebase and bootstrap | \342\200\224 |\n"
      }
    ' "$TEMPLATES_DIR/cos-board.md" > "$TARGET_FULL/.context/cos-board.md"
  fi

  if [ ! -f "$TARGET_FULL/.agents/skills/verify-project/SKILL.md" ]; then
    mkdir -p "$TARGET_FULL/.agents/skills/verify-project"
    cp "$STARTER_ROOT/.agents/skills/verify-project/SKILL.md" "$TARGET_FULL/.agents/skills/verify-project/SKILL.md"
  fi

  TARGET_MODELS="$TARGET_FULL/.agents/rules/pstack-models.md"
  SRC_MODELS="$STARTER_ROOT/.agents/rules/pstack-models.md"
  if [ ! -f "$TARGET_MODELS" ]; then
    cp "$SRC_MODELS" "$TARGET_MODELS"
  elif [ -f "$TEMPLATES_DIR/legacy-v1-pstack-models.txt" ]; then
    if awk -v v1_file="$TEMPLATES_DIR/legacy-v1-pstack-models.txt" '
      function slurp(path,    line, buf, first) {
        buf = ""; first = 1
        while ((getline line < path) > 0) { gsub(/\r$/, "", line); buf = first ? line : (buf "\n" line); first = 0 }
        close(path)
        return buf
      }
      BEGIN {
        d = slurp(ARGV[1]); sub(/\n+$/, "", d)
        v = slurp(v1_file); sub(/\n+$/, "", v)
        exit (d == v ? 0 : 1)
      }
    ' "$TARGET_MODELS"; then
      cp "$SRC_MODELS" "$TARGET_MODELS"
      echo "[INFO] Upgraded untouched v1 .agents/rules/pstack-models.md to cross-harness defaults"
    fi
  fi

  LEGACY_ENTRY="$TEMPLATES_DIR/legacy-v1-entry.txt"
  merge_managed_markdown "$STARTER_ROOT/AGENTS.md" "$TARGET_FULL/AGENTS.md" "$LEGACY_ENTRY" 0
  merge_managed_markdown "$STARTER_ROOT/CLAUDE.md" "$TARGET_FULL/CLAUDE.md" "$LEGACY_ENTRY" 0
  merge_managed_markdown "$STARTER_ROOT/GEMINI.md" "$TARGET_FULL/GEMINI.md" "$LEGACY_ENTRY" 0
fi

if [ "$SKIP_PSTACK_SYNC" -eq 0 ]; then
  sh "$TARGET_FULL/.agents/tools/sync-pstack.sh"
fi

STARTER_COMMIT="local"
if [ -d "$STARTER_ROOT/.git" ]; then
  STARTER_COMMIT=$(git -C "$STARTER_ROOT" rev-parse --short HEAD 2>/dev/null || echo "local")
fi

PSTACK_VER="pending-sync"
if [ -f "$TARGET_FULL/.agents/plugins/pstack/plugin.json" ]; then
  v=$(awk '
    /"version"[[:space:]]*:/ {
      sub(/^.*"version"[[:space:]]*:[[:space:]]*"/, "")
      sub(/".*$/, "")
      print
      exit
    }
  ' "$TARGET_FULL/.agents/plugins/pstack/plugin.json")
  [ -n "$v" ] && PSTACK_VER="$v"
fi

UPDATED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
ESC_SRC=$(json_escape "$SOURCE_REPO")
ESC_BR=$(json_escape "$BRANCH")
ESC_SHA=$(json_escape "$STARTER_COMMIT")
ESC_PVER=$(json_escape "$PSTACK_VER")

cat > "$MANIFEST_PATH" <<EOF
{
  "name": "agent-starter-kit",
  "sourceRepo": "$ESC_SRC",
  "branch": "$ESC_BR",
  "starterKitCommit": "$ESC_SHA",
  "pstackSource": "https://github.com/michael-denyer/pstack-claude.git",
  "pstackVersion": "$ESC_PVER",
  "updatedAt": "$UPDATED_AT"
}
EOF

echo "[OK] agent-starter-kit ready on-project at $TARGET_FULL (commit: $STARTER_COMMIT, pstack: $PSTACK_VER)"
