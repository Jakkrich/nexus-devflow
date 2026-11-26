# Discovery Playbook

**Read-only investigation and architectural alignment before committing build scope.**

1. Ground in existing records (`git log`, `devflow/history/`, `devflow/decisions/`, `devflow/context/project-overview.md`) before inferring behavior from source alone.
2. Apply the **Experiment-vs-Preference Fork**: settle factual code or compatibility questions with read-only probes; reserve human questions for product scope, UX, or irreversible trade-offs (1–2 focused questions per turn).
3. Formulate 2–3 materially distinct options with a Pros/Cons/Effort comparison table; slice large initiatives using the **4 Slicing Archetypes** (`devflow/reference/slicing-archetypes.md`).
4. Persist settled terms to `devflow/context/glossary.md`, irreversible decisions to `devflow/decisions/ADR-xxx-{slug}.md`, and the discovery record to `devflow/discoveries/{DISC-ID}-{slug}/discovery.md`.
5. End with a clear `Proceed`, `Defer`, or `Reject` decision and propose `build-plan.md` edits for approval before drafting specs.
