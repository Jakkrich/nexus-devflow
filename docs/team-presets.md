# Team Presets

This guide is for engineering leads and maintainers adopting **Nexus-DevFlow 2.5.0** across different team structures.

Presets are recommendation bundles on top of the same DevFlow 2.5.0 Single Living Spec Model and companion commands.

---

## 1. Product Feature Team

### Who It Is For
Teams shipping new product capabilities, user-facing features, or architectural enhancements that benefit from pre-flight discovery, strict TDD discipline, senior QA verification, and auditable history archives.

### Recommended Workflow Flow
1. `/discovery` or `/idea`: Explore new capability proposals or score backlog ideas.
2. `/grill`: Pressure-test domain models, extract terminology to `glossary.md`, and record ADRs.
3. `/feature {title}`: Initialize the Single Living Spec in `devflow/context/current-feature.md`.
4. `/implement`: Execute tasks incrementally with strict TDD discipline (Red-Green-Refactor).
5. `/check`: Senior QA multi-lane verification.
6. `/complete`: Final safety audit, records Release Digest, and manages the Git delivery gate.

---

## 2. Bugfix & Reliability Team

### Who It Is For
Teams handling defects, regressions, security patches, or operational hotfixes where rapid isolation, minimal blast radius, and verification proof are paramount.

### Recommended Workflow Flow
1. `/debug`: Non-destructive reproduction and root-cause analysis.
2. `/fix {bug-title}`: Document and spec the fix in `devflow/context/current-feature.md`.
3. `/implement`: Apply the targeted fix with failing regression test proof.
4. `/check`: Verify defect resolution across test suites and running app.
5. `/complete`: Archive fix record to `devflow/history/fixes/` and merge cleanly.

---

## 3. Platform & Architecture Team

### Who It Is For
Teams building shared platforms, microservices, core libraries, or complex migrations with high governance and multi-agent coordination.

### Recommended Workflow Flow
1. `/discovery`: Comprehensive pre-delivery feasibility study (`devflow/discoveries/`).
2. `/grill`: Formalize Architecture Decision Records (`devflow/decisions/ADR-xxx.md`).
3. `nexus-devflow graph`: Analyze AST dependency graph and calculate blast radius.
4. `nexus-devflow swarm`: Orchestrate 4-role multi-agent execution (Architect, Coder, QA, Security).
5. `/feature`: Execute delivery through the Single Living Spec.
