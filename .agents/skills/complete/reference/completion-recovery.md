# Completion recovery

Use this contract only when the read-only screen in `complete/reference/completion-screen.md`
detects a pending completion candidate or explicit resume. For normal archive
preparation without recovery, read `complete/reference/completion-archive.md`.
Archive and Git evidence determine the phase.
`run.json`, modification times, archive titles, and commit subjects prove none of
these transitions. Recovery grants no commit, merge, push, or cleanup approval.

## Recovery annotation & byte reconstruction

Read `complete/reference/completion-archive.md` alongside this recovery contract
to see how `sourceTree`, `absentOptional`, and `<!-- devflow:completion {...} -->`
are prepared. To recover, locate the unique annotation boundary and remove only the two inserted line breaks before
it (LF or CRLF). Test that prefix as raw bytes and uniform LF/CRLF candidates
against both `specBytes` and `specSha256`; deduplicate identical candidates and
accept only one exact match. This reconstructs hash-proven original bytes across
ordinary Git EOL conversion. Mixed endings or custom filters without an exact
match stop recovery. Never trim content, split on a Markdown heading, or accept a
normalized digest instead of the original. Reject malformed/duplicate annotations.

## Prove an actual recovery candidate

For feature archives on a reused branch, exclude a prior build only when all of
these read-only Git checks pass:

- `../../feature/reference/build-history.md` proves its unique unchanged archive
  addition on the local default, and the introducing commit's sole parent equals
  that archive annotation's `baseCommit` on the same `baseRef`.
- An exact completed, unchanged, reachable rollback record names that archive and
  introducing commit; its commit is after the feature addition.
- The current work branch descends from a post-rollback local default: that
  rollback commit is an ancestor of the merge base of the current work branch
  and local default. Its old archive remains byte/mode-identical in both trees
  and the working tree, with no pending archive edits or retained review explicitly
  targeting that old build.

Different spec bytes, title, attempt, filename, or ancestry alone never exclude
an archive. Missing, changed, or contradictory proof stops; this exception does
not recover old missing inputs or waive current gates. It permits legacy branch
reuse only after the old lifecycle is demonstrably finished and reversed.

Require one annotated archive matching the recorded work branch, or the exact
archive/commit proof in the merged phase below. A real live spec must match its
recovered bytes; a cleaned-up workspace is also expected after merge. A different spec conflicts.
For features, use the recovered spec's frozen `**Build attempt:**` and that exact
archive path; never allocate a new attempt on resume. For a legacy feature spec
without the field, the path plus existing annotation fixes the destination only
after the prior-build proof in `../../feature/reference/build-history.md` at its
recorded `baseCommit` uniquely establishes its attempt. Exclude the current archive from those prior
builds. Do not edit the recovered bytes to insert metadata.

Require all recorded commits and `sourceTree` to exist (`git cat-file -e`).
Unreferenced source trees can be pruned by Git: missing objects stop recovery;
request the original objects or an identified backup, never recreate a guessed
baseline. An old archive without this annotation may be read as history, but
cannot automatically recover a missing live spec through this contract.

Use the temporary-index command above to inspect the present work tree without
altering the real index. Compare trees with `git diff --raw -z <source> <current>`
and inspect source blobs with `git show <sourceTree>:<path>`. Git trees use clean-
filtered bytes; compare evidence through `git hash-object --path=<path> --stdin`
when ordinary EOL conversion applies, while recovering the exact spec only by
its archive digest above. Unsupported custom filters stop recovery. Inspect staged
changes too; conflicting staged/working versions must be reconciled explicitly.
Do not infer identity from ancestry alone, a matching filename, or a latest date.

## Validate only the expected completion changes

Reconstruct the original spec and evidence from the source tree and archive.
Every changed path, file mode, addition, and deletion must be accounted for.
Only these exact transformations can follow the captured source tree:

- Add this one archive, with the exact spec prefix and annotation, resolved
  findings copied with only the documented ID prefix, the original passing
  receipt bytes, and a try guide for this spec when required or already generated.
- Apply this work item's exact build-plan checkbox/parent changes, or its exact
  rollback note. Update `devflow/history/HISTORY.md` with the release digest.
  Change only the overview's existing source-hash value, using the documented hash contract.
  A fix has no build-plan change.
- Remove only resolved ledger entries present in that archive. Preserve every
  `open`, `fixed`, and `unverified` entry byte-for-byte, including its ID.
- Clean up the completed task run directory `devflow/context/{xxx-slug}/`.
- Delete only the exact consumed prototype files already authorized for this
  work item and identified by its design reference. No general cleanup is allowed.

No other history, context, configuration, product, test, or ignore-rule changes
are completion bookkeeping. Read the full diffs, not just a filename allowlist.
Partial plan bookkeeping is recoverable only when each changed byte is one of
these transformations and all unfinished operations can be identified exactly.
Conflicting or partial archive/evidence content stops before any live reset.

For independent review, validate the archived receipt against its original
`Target commit`, original base/merge-base, exact recovered spec digest, reviewer
identity, execution/context pairing, required Check result, and receipt sections.
The annotation's `head` must equal that target, and its source tree may differ
from the target only in the original review/findings evidence permitted by Audit.
Never relabel the receipt as current at the later work commit or merge commit.
When the original receipt has `Spec snapshot`, preserve that field unchanged.
After live reset, the hash-proven original archive prefix may establish the same
spec identity: require its exact digest to equal the receipt's `Spec hash` and the
annotation's `specSha256`, and require the snapshot field's canonical path to
contain that original target and hash. This is archived-receipt validation, not
a current live receipt. Do not create a new snapshot or relabel the target.
Conflicting retained snapshot bytes or unsafe paths still stop recovery; an
absent local snapshot may use this exact archive proof after reset. This does
not replace source-tree/product proof or recover other ignored evidence.
The narrow completion changes above preserve the reviewed product; any other
change requires restored exact active inputs and renewed gates/checkpoint/review.
Never overwrite conflicting live evidence to obtain that restoration.

Ignored local-only files are absent from this tree proof. Validate them using
separately provable exact original bytes plus the archive and retained inputs,
or stop and name the missing evidence. A local archive can match a still-existing
work branch; its presence alone cannot bind an already-deleted branch to a squash
commit. Do not force-add ignored workflow files to make recovery pass.

## Interrupted archival, before the work commit

Require the recorded work branch at the recorded `head`, the local default still
at `baseCommit`, a complete matching archive, and only the validated partial or
finished bookkeeping changes above. Reconcile archived and retained findings and
review before changing anything. Do not duplicate sections or erase unresolved
entries. If the archive is absent and live inputs are intact, use normal Complete;
if both the archive and needed live input are missing, stop for recovery evidence.

Read the recovered spec from a temporary file, preserving its exact bytes; do
not overwrite the live stub merely to orient a fresh session. Repeat current-
session Verify and required gates against that spec and the current product.
Reuse a passing archived review only through the original-target checks above.
If a gate needs active files restored, restore only proven matching originals
with no conflicting live data, run the gate, and re-enter normal Complete. If
verification or review changes evidence, stop and reconcile a new reviewed archive
candidate explicitly; never silently append to the existing archive.

Finish only the missing bookkeeping, with live workspace cleanup last. Show the concrete
remaining diff and proposed conventional work commit, obtain normal commit
approval, and continue at Complete Step 2. This archive does not authorize Git.

## Work committed, awaiting merge

Require a clean recorded work branch at one unambiguous final work commit whose
sole parent is recorded `head`, with the default still at `baseCommit`. Compare the complete work
commit tree to `sourceTree` and require exactly the finished transformations above.
The tracked archive and final bookkeeping must be in that commit, not added later.
For ignored evidence require the separate proof described above. Extra commits or
post-commit drift stop for review, not another completion commit.

Rerun current-session Verify and validate all required gates using the recovered
spec and original receipt. Resume at Complete Step 3's merge approval. Never make
a second work commit, reset evidence again, or treat earlier approval as covering
new changes. Preserve the exact work commit SHA for merge verification.

## Merge already completed

Require a clean local default branch tip whose sole parent is the recorded
`baseCommit`, and the complete finished tree and archive. If the work branch still
exists, require its exact final work commit and tree equality with that default
tip (`git diff --exit-code <workCommit>^{tree} <defaultTip>^{tree}`), including the
archive blob. A squash merge normally does not contain the work commit as an
ancestor. Tree equality alone without the matching base, archive, and completed
bookkeeping is insufficient.

If the work branch was deleted, require the tracked archive at the default tip,
its exact source-tree/spec/branch annotation, and exactly the finished changes
from sourceTree to that tip. An ignored archive without a provable commit binding
must stop for user identification and supporting evidence. If the default has
advanced or several commits/archives fit, stop and name the ambiguity instead of
weakening this proof or searching by title.

Do only pending cleanup already authorized for this work item; ask if cleanup
approval is missing. Never repeat archival, the work commit, or the squash merge,
and never create a cleanup commit on the default branch. If nothing remains,
report the verified local merge once and leave Git unchanged. Push still needs
its separate approval. A repeated resume follows this same no-op path.
