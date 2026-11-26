#!/usr/bin/env node
import { existsSync, lstatSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const BUNDLED = resolve(dirname(fileURLToPath(import.meta.url)), "../playbooks");
const CHANGE = /^ {0,3}(?:[-*]|\d+\.)\s+\*\*(?:After|Before|Replace|In)\*\*\s+"([^"]+)"/;
const CHANGE_VERB = /^ {0,3}(?:[-*]|\d+\.)\s+\*\*(?:After|Before|Replace|In)\*\*/;
const flat = (text) => text.replace(/\s+/g, " ");
const yamlScalar = (value) => value.trim().replace(/^(["'])(.*)\1$/, "$2").trim();

const PSTACK_ONLY_STEMS = new Set([
  "authoring-a-skill",
  "autonomous-run",
  "autopilot-full",
  "autopilot-stack",
  "babysit",
  "eval",
  "hillclimb",
  "investigation",
  "multi-phase-plan",
  "opening-a-pr",
  "pause-safely",
  "perf-issue",
  "prototype",
  "refactoring",
  "runtime-forensics",
  "session-pickup",
  "shipping",
  "trace-forensics",
  "visual-parity",
  "worktree-cleanup"
]);
const SHARED_STEMS = new Set(["feature", "bug-fix"]);

function fieldValue(line) {
  let quote = "";
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (quote === '"' && c === "\\") i++;
      else if (c === quote && quote === "'" && line[i + 1] === "'") i++;
      else if (c === quote) quote = "";
    } else if (c === "#" && (i === 0 || /\s/.test(line[i - 1]))) {
      return line.slice(0, i).trim();
    } else if ((c === "'" || c === '"') && /(?:^|\[|,)\s*$/.test(line.slice(0, i))) {
      quote = c;
    }
  }
  return line.trim();
}

function baseNames(front) {
  const field = /^extends:[ \t]*(.*)$/m.exec(front);
  if (!field) return [];
  const value = fieldValue(field[1]);
  if (value) return value.replace(/^\[(.*)\]$/, "$1").split(",").map(yamlScalar).filter(Boolean);
  const names = [];
  for (const line of front.slice(field.index + field[0].length).split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const item = /^ *- +(.*)$/.exec(line);
    if (!item) break;
    names.push(yamlScalar(fieldValue(item[1])));
  }
  return names;
}

function* proseLines(body) {
  let fence;
  for (const line of body.split("\n")) {
    const marker = /^\s*(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      if (marker && marker[1].startsWith(fence) && !marker[2].trim()) fence = undefined;
    } else if (marker && (marker[1][0] === "~" || !marker[2].includes("`"))) {
      fence = marker[1];
      yield "";
    } else {
      yield line;
    }
  }
}

function proseBlocks(body) {
  const blocks = [];
  let current;
  let paragraph = false;
  for (const line of proseLines(body)) {
    const item = /^ *(?:[-*+]|\d+[.)]) +(.*)$/.exec(line);
    if (!line.trim() || /^ {0,3}#{1,6}(?:[ \t]|$)/.test(line)) current = undefined;
    else if (current && paragraph && /^ {0,3}(?:=+|-+)[ \t]*$/.test(line)) {
      blocks.pop();
      current = undefined;
    } else if (item || !current) {
      current = [item ? item[1] : line.trim()];
      paragraph = !item;
      blocks.push(current);
    } else {
      current.push(line.trim());
    }
  }
  return blocks.map((lines) => flat(lines.join(" ")));
}

function bundledSteps(body, includeProseFallback = false) {
  const steps = [];
  let current;
  let afterBlank = true;
  for (const line of proseLines(body)) {
    const start = /^(\d+[.)] +)(.*)$/.exec(line);
    if (start) {
      current = { indent: start[1].length, lines: [start[2]] };
      steps.push(current);
    } else if (current && line.trim()) {
      if (line.startsWith(" ".repeat(current.indent)) || (!afterBlank && !/^ {0,3}(?:#{1,6}[ \t]|[-*+] )/.test(line))) {
        current.lines.push(line.trim());
      } else {
        current = undefined;
      }
    }
    afterBlank = !line.trim();
  }
  if (steps.length > 0) {
    return steps.map((step) => flat(step.lines.join(" ")));
  }
  return includeProseFallback ? proseBlocks(body) : [];
}

function isSafeDir(dir) {
  try {
    const st = lstatSync(dir);
    return !st.isSymbolicLink() && st.isDirectory();
  } catch {
    return false;
  }
}

function areSafeChildDirs(baseDir, segments) {
  let current = baseDir;
  for (const segment of segments) {
    current = join(current, segment);
    if (!isSafeDir(current)) return false;
  }
  return true;
}

function compareVersionDirDesc(a, b) {
  const splitPre = (v) => {
    const idx = v.indexOf("-");
    return idx === -1 ? [v, null] : [v.slice(0, idx), v.slice(idx + 1)];
  };
  const [aBase, aPre] = splitPre(a);
  const [bBase, bPre] = splitPre(b);
  const baseCmp = bBase.localeCompare(aBase, undefined, { numeric: true });
  if (baseCmp !== 0) return baseCmp;
  if (aPre === null && bPre !== null) return -1;
  if (aPre !== null && bPre === null) return 1;
  if (aPre !== null && bPre !== null) return bPre.localeCompare(aPre, undefined, { numeric: true });
  return b.localeCompare(a, undefined, { numeric: true });
}

function scanPstackPlaybooksCacheDir(dir, depth, maxDepth) {
  if (!isSafeDir(dir)) return null;
  for (const suffix of [
    ["skills", "poteto-mode", "playbooks"],
    ["plugins", "pstack", "skills", "poteto-mode", "playbooks"]
  ]) {
    if (areSafeChildDirs(dir, suffix)) {
      return join(dir, ...suffix);
    }
  }
  if (depth >= maxDepth) return null;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  const subdirs = entries
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .map((entry) => entry.name)
    .sort(compareVersionDirDesc);
  for (const name of subdirs) {
    const found = scanPstackPlaybooksCacheDir(join(dir, name), depth + 1, maxDepth);
    if (found) return found;
  }
  return null;
}

function resolveDefaultPstackPlaybooksDir(root, env = process.env, homeDir = homedir()) {
  const claudeHome = env.CLAUDE_CONFIG_DIR || join(homeDir, ".claude");
  const codexHome = env.CODEX_HOME || join(homeDir, ".codex");
  const copilotHome = env.COPILOT_HOME || join(homeDir, ".copilot");

  const directCandidates = [
    ...(env.PSTACK_PLUGIN_DIR ? [[env.PSTACK_PLUGIN_DIR, ["skills", "poteto-mode", "playbooks"]]] : []),
    [root, [".agents", "plugins", "pstack", "skills", "poteto-mode", "playbooks"]],
    [root, [".claude", "plugins", "pstack", "skills", "poteto-mode", "playbooks"]],
    ...(env.XDG_DATA_HOME ? [[env.XDG_DATA_HOME, ["open-pstack", "pstack", "skills", "poteto-mode", "playbooks"]]] : []),
    [homeDir, [".local", "share", "open-pstack", "pstack", "skills", "poteto-mode", "playbooks"]],
    ...(env.LOCALAPPDATA ? [[env.LOCALAPPDATA, ["open-pstack", "pstack", "skills", "poteto-mode", "playbooks"]]] : []),
    [homeDir, [".gemini", "config", "plugins", "pstack", "skills", "poteto-mode", "playbooks"]],
    [claudeHome, ["plugins", "pstack", "skills", "poteto-mode", "playbooks"]],
    [codexHome, ["plugins", "pstack", "skills", "poteto-mode", "playbooks"]],
    [copilotHome, ["plugins", "pstack", "skills", "poteto-mode", "playbooks"]]
  ];

  for (const [base, segments] of directCandidates) {
    if (isSafeDir(base) && areSafeChildDirs(base, segments)) {
      return join(base, ...segments);
    }
  }

  for (const cacheRoot of [
    join(claudeHome, "plugins", "cache"),
    join(claudeHome, "plugins", "marketplaces"),
    join(codexHome, "plugins", "cache"),
    join(codexHome, "plugins", "marketplaces"),
    join(copilotHome, "installed-plugins"),
    join(copilotHome, "plugins", "cache")
  ]) {
    const found = scanPstackPlaybooksCacheDir(cacheRoot, 0, 4);
    if (found) return found;
  }
  return null;
}

function stripNamespacePrefix(rawEntry) {
  if (/^(?:devflow|devflow-mode):/i.test(rawEntry)) {
    return { namespace: "devflow", stem: rawEntry.replace(/^(?:devflow|devflow-mode):/i, "") };
  }
  if (/^(?:pstack|poteto-mode):/i.test(rawEntry)) {
    return { namespace: "pstack", stem: rawEntry.replace(/^(?:pstack|poteto-mode):/i, "") };
  }
  return { namespace: null, stem: rawEntry };
}

function shouldSkipSharedPstackPlaybook(front, body, rawBases, hasWhen, devflowBases, pstackDir) {
  const nsRaw = yamlScalar(fieldValue(/^namespace:[ \t]*(.*)$/m.exec(front)?.[1] ?? "")).toLowerCase();
  const targetRaw = yamlScalar(fieldValue(/^target:[ \t]*(.*)$/m.exec(front)?.[1] ?? "")).toLowerCase();
  const declaredPstack = nsRaw === "pstack" || nsRaw === "poteto-mode" || targetRaw === "pstack" || targetRaw === "poteto-mode";
  const declaredDevflow = nsRaw === "devflow" || nsRaw === "devflow-mode" || targetRaw === "devflow" || targetRaw === "devflow-mode";

  const parsedEntries = rawBases.map(stripNamespacePrefix);
  if (declaredPstack || parsedEntries.some((entry) => entry.namespace === "pstack")) {
    return true;
  }

  const hasExplicitDevflowMarker = declaredDevflow || parsedEntries.some((entry) => entry.namespace === "devflow");
  if (hasExplicitDevflowMarker || rawBases.length === 0) {
    return false;
  }

  const allInPstackCatalog = parsedEntries.every(
    (entry) => PSTACK_ONLY_STEMS.has(entry.stem) || SHARED_STEMS.has(entry.stem)
  );
  if (allInPstackCatalog && parsedEntries.some((entry) => PSTACK_ONLY_STEMS.has(entry.stem))) {
    return true;
  }

  if (!hasWhen || !pstackDir || !parsedEntries.every((entry) => SHARED_STEMS.has(entry.stem))) {
    return false;
  }

  const anchors = [];
  for (const line of proseLines(body)) {
    if (CHANGE_VERB.test(line) && !CHANGE.test(line)) {
      return false;
    }
    const anchor = line.match(CHANGE)?.[1];
    if (anchor) anchors.push(anchor);
  }
  if (anchors.length === 0) {
    return false;
  }

  const allMatchDevflow = anchors.every((anchor) =>
    devflowBases.some((base) => base.steps?.some((step) => step.includes(flat(anchor))))
  );
  if (allMatchDevflow) {
    return false;
  }

  const pstackBases = parsedEntries.map((entry) => {
    const file = join(pstackDir, `${entry.stem}.md`);
    const known = !/[\\/]/.test(entry.stem) && existsSync(file);
    return {
      steps: known
        ? bundledSteps(readFileSync(file, "utf8").replace(/^\uFEFF/, "").replaceAll("\r\n", "\n"), true)
        : null
    };
  });

  return anchors.every((anchor) =>
    pstackBases.some((base) => base.steps?.some((step) => step.includes(flat(anchor))))
  );
}

function inspectPlaybooksDir(dir, relPrefix, bundled, sharedNamespace, pstackDir) {
  if (!existsSync(dir)) return [];
  const problems = [];
  for (const name of readdirSync(dir).filter((file) => file.endsWith(".md")).sort()) {
    const fullPath = join(dir, name);
    const relPath = `${relPrefix}/${name}`;
    const st = lstatSync(fullPath);
    if (st.isSymbolicLink() || !st.isFile()) {
      problems.push(`${relPath}: playbook entry must be a regular non-symlink file`);
      continue;
    }
    const text = readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");
    const header = text.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
    const front = header?.[1] ?? "";
    const body = text.slice(header?.[0].length ?? 0);
    const when = yamlScalar(fieldValue(/^when:[ \t]*(.*)$/m.exec(front)?.[1] ?? ""));
    const rawBases = baseNames(front);

    const bases = rawBases.map((rawEntry) => {
      const { namespace, stem } = stripNamespacePrefix(rawEntry);
      const effectiveStem = namespace === "pstack" ? rawEntry : stem;
      const file = join(bundled, `${effectiveStem}.md`);
      const known = !/[\\/]/.test(effectiveStem) && existsSync(file);
      return {
        raw: rawEntry,
        stem: effectiveStem,
        steps: known
          ? bundledSteps(readFileSync(file, "utf8").replace(/^\uFEFF/, "").replaceAll("\r\n", "\n"))
          : null
      };
    });

    if (
      sharedNamespace &&
      shouldSkipSharedPstackPlaybook(front, body, rawBases, Boolean(when), bases, pstackDir)
    ) {
      continue;
    }

    if (!when) problems.push(`${relPath}: its frontmatter needs a "when:" line`);
    for (const base of bases) {
      if (base.steps === null) {
        problems.push(`${relPath}: extends \`${base.raw}\`, which this devflow-mode has no playbook for`);
      }
    }
    for (const line of proseLines(body)) {
      if (CHANGE_VERB.test(line) && !CHANGE.test(line)) {
        problems.push(`${relPath}: a change has no straight-quoted step text to anchor on: ${line.trim().slice(0, 80)}`);
      }
      const anchor = line.match(CHANGE)?.[1];
      if (anchor && !bases.some((base) => base.steps?.some((step) => step.includes(flat(anchor))))) {
        problems.push(`${relPath}: "${anchor}" is not in any playbook it extends`);
      }
    }
  }
  return problems;
}

export function checkPlaybooks(root, bundled = BUNDLED, options = {}) {
  const pstackDir =
    options.pstackBundled === null
      ? null
      : typeof options.pstackBundled === "string"
        ? options.pstackBundled
        : resolveDefaultPstackPlaybooksDir(root, options.env, options.homeDir);
  const problems = [];
  if (!options.sharedOnly) {
    problems.push(...inspectPlaybooksDir(join(root, "devflow/playbooks"), "devflow/playbooks", bundled, false, pstackDir));
  }
  problems.push(...inspectPlaybooksDir(join(root, ".agents/playbooks"), ".agents/playbooks", bundled, true, pstackDir));
  return problems;
}

function invokedDirectly() {
  if (!process.argv[1]) return false;
  try {
    return fileURLToPath(import.meta.url) === realpathSync(process.argv[1]);
  } catch {
    return false;
  }
}

if (invokedDirectly()) {
  const root = resolve(process.argv[2] ?? ".");
  const home = homedir();
  const devflowDirectory = join(root, "devflow/playbooks");
  const directory = join(root, ".agents/playbooks");
  const homeDirectory = join(home, ".agents/playbooks");
  const atHome = root === resolve(home);
  let problems = [`${root} is not a directory`];
  if (statSync(root, { throwIfNoEntry: false })?.isDirectory()) {
    problems = atHome ? [] : checkPlaybooks(home, BUNDLED, { sharedOnly: true }).map((problem) => `~/${problem}`);
    problems.push(...checkPlaybooks(root));
  }
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exitCode = 1;
  } else if (existsSync(devflowDirectory) || existsSync(directory) || existsSync(homeDirectory)) {
    console.log("Every DevFlow project playbook matches this devflow-mode's playbooks.");
  } else if (atHome) {
    console.log(`No project playbooks to check: ${directory} does not exist.`);
  } else {
    console.log(`No project playbooks to check: neither ${devflowDirectory}, ${directory}, nor ${homeDirectory} exists.`);
  }
}
