# Findings Ledger — `132-pstack-integration-hardening`

> **Generated Ledger File.** Tracks quality findings, security vulnerabilities, regression risks, and architectural debt raised during review and QA passes.
>
> **Finding Format**:
> `### <ID> [<SEVERITY>] <STATUS> - <Title>`
> - **Severities**: `P0` (Critical Blocker), `P1` (High Blocker), `P2` (Medium), `P3` (Low / Polish)
> - **Statuses**: `unverified`, `open`, `fixed`, `closed`, `accepted`, `invalid`
> - **Release Gate Rule**: Any `P0` or `P1` finding in `open` or `fixed` status unconditionally blocks `/complete`.

---

### S-001 [P2] closed - Symlink traversal asymmetry in `detectPstackSkillPath`
- **Source**: Independent Outsider Scrutiny Review (`5441ae4a-ab02-4607-ba63-7094a4103954`)
- **Detail**: `env.PSTACK_PLUGIN_DIR` and `directHomeCandidates` in `packages/create-nexus-devflow/lib/doctor.ts` only checked `isRegularNonSymlinkFile` on `SKILL.md` rather than validating intermediate child directories via `areChildSegmentsSafeDirs`.
- **Resolution**: Added `resolveSafeCandidate` using `isRegularNonSymlinkDir` + `areChildSegmentsSafeDirs` across all direct home and `PSTACK_PLUGIN_DIR` candidates, plus regression Case G in `packages/create-nexus-devflow/test/doctor.test.ts`.

### Q-001 [P2] closed - `resolveDefaultPstackPlaybooksDir` missed plugin caches, `XDG_DATA_HOME`, and `LOCALAPPDATA`
- **Source**: Independent Outsider Scrutiny Review (`5441ae4a-ab02-4607-ba63-7094a4103954`)
- **Detail**: `.agents/skills/devflow-mode/scripts/check-playbooks.mjs` probed fewer paths than `doctor.ts` and lacked `lstatSync` symlink refusal.
- **Resolution**: Expanded `resolveDefaultPstackPlaybooksDir` with `isSafeDir`/`areSafeChildDirs` and `scanPstackPlaybooksCacheDir` (`maxDepth = 4`, numeric semver + prerelease ordering) across Claude/Codex/Copilot caches and `XDG_DATA_HOME`/`LOCALAPPDATA`, synced to `.claude/`, and added regression test in `scripts/test/check-playbooks.test.ts`.

### Q-002 [P3] closed - Semver prerelease ordering edge case in `scanPstackCacheDir`
- **Source**: Independent Outsider Scrutiny Review (`5441ae4a-ab02-4607-ba63-7094a4103954`)
- **Detail**: `localeCompare` sorted `0.9.158-beta.1` ahead of stable `0.9.158`.
- **Resolution**: Added `compareVersionDirDesc` preferring stable over prerelease for identical base versions, with Case C regression check in `doctor.test.ts`.

### T-001 [P3] closed - Missing `devflow/playbooks` test assertion & CRLF normalization
- **Source**: Independent Outsider Scrutiny Review (`5441ae4a-ab02-4607-ba63-7094a4103954`)
- **Detail**: Added `devflow/playbooks/custom.md` to `prepare-template.test.ts` and `\r\n` normalization to bundled/`pstack` playbook reads in `check-playbooks.mjs`.
