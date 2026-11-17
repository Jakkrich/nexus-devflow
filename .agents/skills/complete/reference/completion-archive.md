# Completion archive preparation

Use this reference during normal `/complete` Step 1 and `/autopilot --all` Step 2.6 after final verification and any required Check/review gates pass.

## Prepare one recoverable archive

After Complete's final gates pass, but before any logging edits, record the full
work branch ref, `HEAD`, local default branch ref and its current commit. Require
that default commit to be an ancestor of the work branch. Resolve refs locally;
do not fetch. Capture the verified working tree in a temporary Git index:

```bash
node --input-type=module -e '
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-completion-"));
const env = { ...process.env, GIT_INDEX_FILE: path.join(dir, "index") };
try {
  execFileSync("git", ["read-tree", "HEAD"], { env });
  execFileSync("git", ["add", "-A", "--", "."], { env });
  process.stdout.write(execFileSync("git", ["write-tree"], { env }));
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}'
```

Run from the project root only after excluding unrelated work and Git conflicts.
This writes local Git objects, not a commit or ref, and leaves the normal index
untouched. Never force-add ignored files. Dirty submodules or required ignored
inputs without separately recoverable exact bytes cannot support this proof.
The source tree is evidence, not approval or a substitute for any quality gate.

Before logging, record `absentOptional` as an array containing only
`devflow/context/{xxx-slug}/findings.md` and/or `devflow/context/{xxx-slug}/review.md` when each
exact path returns `ENOENT` from `lstat`, its parents are ordinary directories,
and neither HEAD nor sourceTree contains it. Otherwise omit that path. This
records original filesystem absence, never permission to discard evidence.
Ignored existing files and symlinks are not absent. Reject other paths, duplicates,
or contradictions; a missing field in an older annotation proves no absence.

Start the archive with the original verified spec bytes, unchanged. Measure
UTF-8 **bytes**, not characters or lines. Append two LF bytes and this single-line
JSON comment before any Findings, Independent review, or Manual try guide section:

```text
<!-- devflow:completion {"schemaVersion":1,"specBytes":123,"specSha256":"<64 hex>","branch":"refs/heads/feature/name","head":"<full SHA>","baseRef":"refs/heads/main","baseCommit":"<full SHA>","sourceTree":"<full tree SHA>","absentOptional":[]} -->
```

Use `Buffer.length` and SHA-256 over the exact file bytes.

Build the complete archive in a temporary file first, including all resolved
findings, the exact passing receipt when present, and any generated try guide.
Validate it against its inputs, then place it at the intended absent archive path
in `devflow/history/features/`, `fixes/`, or `rollbacks/`.
Never overwrite an existing archive: a matching one enters recovery (`complete/reference/completion-recovery.md`);
a conflicting one stops for an exact path decision. Finish plan/overview bookkeeping,
update `devflow/history/HISTORY.md`, then clean up the run workspace `devflow/context/{xxx-slug}/`.
Do not append sections incrementally to an existing archive during recovery.
