# Living Spec: 076-skill-registry-engine

> **Status**: In Progress  
> **Phase**: 04 Upkeep & Refactoring (ADR-0007)  
> **Track**: Fast-Track Refactor  
> **Testing Seam**: `SkillRegistryEngine` programmatic API (`packages/create-nexus-devflow/lib/skill-registry-engine.ts`)

---

## 1. Context & Architecture Seam

`packages/create-nexus-devflow/lib/skill-manager.ts` is currently 1,426 lines long and tightly couples CLI presentation, Git subprocess execution, file hashing, compound knowledge extraction, and adapter synchronization.

### The New Deep Module:
- **`SkillRegistryEngine`**: Deep lifecycle engine with a minimal 3-method interface:
  1. `list(options?)`: lists core and third-party skills with role filtering.
  2. `install(options)`: resolves package, executes adapter fetch, validates frontmatter, unpacks knowledge packages, and syncs adapters.
  3. `sync()`: ensures all installed skills are bidirectionally mirrored across active tool adapters (`.agents/skills/` and `.claude/skills/`).
  4. Helper lifecycle methods: `remove(name)`, `update(options)`.
- **`SkillRepositoryAdapter`**: The testable seam isolating Git and network operations from filesystem installation logic:
  - `DefaultGitRepositoryAdapter`: invokes `git clone` via `execFile`.
  - `InMemorySkillRepositoryAdapter`: simulates repository packages in-memory for zero-network testing.

---

## 2. Invariants & Acceptance Criteria

1. **Deterministic Seam**: `SkillRegistryEngine` must accept a custom `SkillRepositoryAdapter` in constructor for testing without hitting remote Git.
2. **Backward Compatibility**: `skill-manager.ts` must retain all exported legacy function signatures (`listInstalledSkills`, `installThirdPartySkill`, `syncSkills`, etc.) as thin wrappers delegating to `SkillRegistryEngine`.
3. **Compound Knowledge Support**: Must support `type: "compound-knowledge"` packages (like `matt-pocock`) unpacking into `devflow/.vendor/`.
4. **All Tests Pass**: Existing unit tests in `test/skill-manager.test.ts` and `test/role-profile.test.ts` must pass without regressions, along with new unit tests in `test/skill-registry-engine.test.ts`.

---

## 3. Tasks & Tracer-Bullet Tickets

- [x] **Ticket 01**: Define `SkillRepositoryAdapter` interface and `DefaultGitRepositoryAdapter` / `InMemorySkillRepositoryAdapter`.
- [x] **Ticket 02**: Implement `SkillRegistryEngine` core class with `list`, `install`, `sync`, `remove`, and `update`.
- [x] **Ticket 03**: Wire `skill-manager.ts` as backward-compatible facade delegating to `SkillRegistryEngine`.
- [x] **Ticket 04**: Implement comprehensive test suite in `packages/create-nexus-devflow/test/skill-registry-engine.test.ts`.
