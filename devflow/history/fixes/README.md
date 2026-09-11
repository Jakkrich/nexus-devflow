# Completed Fixes Archive (Canonical Post-Mortem Records)

Finished bug fixes, hotfixes, regressions, security patches, and performance optimizations are archived here as `{xxx-slug}.md`.

Together they form the project's permanent bug resolution history, recording root causes, TDD test decisions, and empirical proof.

---

## 🏛️ The 8 Canonical Post-Mortem Blocks

Each completed fix in this directory preserves the following canonical engineering record:

1. **Summary**: One paragraph describing what broke in user/workload terms, what fixed it, JIRA/PR identifiers, and owner.
2. **Symptom**: Observed test failure, error message, stack trace, or log line with concrete identifiers.
3. **Root Cause**: The actual bug mechanism with code identifiers (functions, file paths, struct fields, branch conditions).
4. **Why it Produced the Symptom**: The cause-and-effect chain connecting the root cause to the observed symptom.
5. **Fix**: What changed and why it addresses the root cause rather than papering over the symptom.
6. **How it Was Found**: Debugging path, minimal repro command, hypotheses tested and rejected, and the decisive experiment.
7. **Why it Slipped Through**: The real gap (CI gap, latent code path, workload gap, incomplete prior fix, review miss).
8. **Validation**: Concrete proof that the fix works (failing test now green, benchmark, customer repro passes).
9. **Action Items**: Concrete follow-ups (regression test at seam, class-of-bug audit, CI matrix entry) with owners and tickets.
