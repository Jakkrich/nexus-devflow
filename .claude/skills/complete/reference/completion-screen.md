# Completion candidate screen (read-only)

Use this screen before Complete requires a live spec, and before Status or Continuous selects new work.

## Screen candidates read-only

Before matching a reused feature branch, apply the historical-build exclusion
below (see `../../feature/reference/build-history.md` and `completion-recovery.md`).
Do not treat a proved prior reversed build as pending completion of its
replacement. If that exclusion cannot be proved, retain the candidate and stop
for full proof rather than guessing from a different spec or archive name.

Inspect current branch, `git status --porcelain=v1`, live spec/review and plan
consistency, and relevant annotated archives. Check recorded local work refs with
`git show-ref --verify --quiet <branch>`. A matching work branch/archive, a retained
matching work ref after merge, or uncommitted completion changes/live evidence tied
to that item is a recovery candidate. An explicit request to resume completion
also requires full proof. Status reports candidates and routes them to Complete;
it does not create a temporary index or claim the phase has passed full proof.

For ordinary Status or a new Continuous invocation, a clean local default branch
with consistent live state, no matching local work ref, and no pending completion
evidence is settled history. An archive at its tip alone does not trigger recovery.
Do not require historical `head`/`sourceTree` objects for that orientation; clean
clones and Git pruning legitimately lose them. This is not a new claim about past
verification. A reset stub alone proves nothing: check the refs, cleanliness, and
live state too. Missing objects still block actual recovery and explicit resume.

Only when this screen finds a completion candidate or explicit resume, read
`complete/reference/completion-recovery.md` for full recovery proof.
