# Refactor Playbook

**Preserve external behavior while deepening module boundaries and deleting dead code.**

1. Lock observable external behavior with existing tests and `verify-layers` baseline before touching structure.
2. Subtract before adding: identify dead code, redundant wrappers, and speculative flags to delete first.
3. Decompose the refactor into small verifiable units (`spec.md` checklist) and delegate each unit to an isolated worktree subagent.
4. After each unit, run affected tests and confirm public CLI, schema, or API contracts remain intact (or explicitly versioned).
5. Run pre-review cleanup (`pstack:deslop`, `pstack:no-comments` when `pstack` is active) followed by `verify-layers` and `pstack:interrogate` (or `audit`).
6. Stop at **Option A Final Human Delivery Gate** (`option-a-evidence-packet`) with before/after diff summary and verification proof.
