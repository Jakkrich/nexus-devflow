# @jakkrichm/create-nexus-devflow

Install and manage **Nexus-DevFlow** — an enterprise-grade agentic workflow layer supporting **The 3-Pillars Model & Single Living Spec Model** into any web app, backend, or existing codebase.

[![Documentation](https://img.shields.io/badge/Docs-Online_Manual-0f766e?style=flat-square&logo=gitbook&logoColor=white)](https://jakkrich.github.io/nexus-devflow/)
[![npm version](https://img.shields.io/npm/v/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef)](https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow)
[![Validate DevFlow](https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml/badge.svg)](https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml)
[![MIT license](https://img.shields.io/npm/l/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef)](LICENSE)

[📖 Documentation Website](https://jakkrich.github.io/nexus-devflow/) |
[GitHub Repository](https://github.com/Jakkrich/nexus-devflow) |
[Changelog](https://github.com/Jakkrich/nexus-devflow/blob/main/CHANGELOG.md)

---

## 🚀 Quick Installation

Requires Node.js 18.17 or newer. Run the installer in your target project directory:

```bash
# Standard project initialization (Recommended)
npm create nexus-devflow

# Or run directly via npx shorthand
npx nexus-devflow

# Or scoped package invocation
npx @jakkrichm/create-nexus-devflow@latest
```

The installer overlays the DevFlow workflow layer into your workspace:
- `AGENTS.md` & `CLAUDE.md` (Universal AI guidelines & cross-tool entry point)
- `.agents/skills/` (15 Core Skills for Google Antigravity, OpenAI Codex, Cursor, Copilot)
- `.claude/skills/` (15 Core Skills for Claude Code)
- `devflow/ideas.md` (Idea inbox with AI feasibility scoring)
- `devflow/context/` (Living spec & active delivery context)
- `devflow/history/` (Categorized delivery archives)

The 15 Core Skill names come from the canonical bundled inventory. Local or Personal Skills
may coexist in a maintainer workspace, but the package builder excludes them
unless they are explicitly promoted into that inventory. During interactive `install` or `update`, Step `[3/3]` also lets you pick bundled Opt-in Extras Skills via a multi-select checkbox (`--yes` / non-interactive skips extras cleanly).

---

## ⚡ The Unified 4-Stage Living Spec Lifecycle

All development tasks execute through the 4-stage single living spec lifecycle:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`feature` / `fix` (`/feature`, `/fix`)**: Combines Discover, Define, Spec, and Plan. Allocates sequential ID (`xxx-slug`) and initializes the **Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`)**.
2. **`implement` (`/implement`)**: Incrementally executes checklist tasks with strict **TDD discipline (Red-Green-Refactor)**.
3. **`check` (`/check`)**: Dual-Axis review combining empirical spec fidelity with independent standards, architecture, and quality gates.
4. **`complete` (`/complete`)**: Final safety pass, records Release Digest, auto-archives living spec to `devflow/history/`, cleans up the task workspace, and manages the git delivery gate.

---

## 🔮 Pre-Flight Discovery Suite

- **`/idea`**: Capture raw ideas in `devflow/ideas.md` with instant AI feasibility scoring.
- **`/explore`**: Compare 2–3 architectural/implementation options with trade-offs without modifying files.
- **`/discovery`**: Macro roadmap planning, SA requirement intake (`REQ-ID`), Socratic ADR alignment (`--grill`), and exploratory discovery (`devflow/discoveries/DISC-xxx.md`).

For failures, `/debug` follows a scientific six-phase diagnosis built around a
red-capable feedback loop and does not modify source. Architecture review follows
Deep Modules principles: small public interfaces, hidden implementation
complexity, and stable seams.

Maintainer contracts and examples are available in the official documentation:
[governance rules](https://jakkrich.github.io/nexus-devflow/governance-rules/),
[Markdown metadata](https://jakkrich.github.io/nexus-devflow/markdown-metadata-contract/),
[manual review workflow](https://jakkrich.github.io/nexus-devflow/manual-review/), and
[Living Spec examples](https://jakkrich.github.io/nexus-devflow/living-spec-examples/).

---

## 🛠️ CLI Management Commands

```bash
# Check project status, active work, and blockers
npx @jakkrichm/create-nexus-devflow status [--json]

# Automated Quality Gatekeeper & Pre-commit Hooks
npx @jakkrichm/create-nexus-devflow check-gate [--strict]
npx @jakkrichm/create-nexus-devflow hook install pre-commit

# Model Context Protocol (MCP) Server Hub (6 Core Tools)
npx @jakkrichm/create-nexus-devflow mcp

# Deterministic 3-layer code verification gate
npx @jakkrichm/create-nexus-devflow verify-layers [--json]

# Framework Update & Safety Rollback (v2 -> v3 auto-prunes retired autopilot/devflow)
npx @jakkrichm/create-nexus-devflow update [--dry-run]

# Opt-in Team & Ops Extensions
npx nexus-devflow skill add verify-harness    # Generate project-local .agents/skills/verify-<app>/ driver
npx nexus-devflow skill add browseros-neo     # E2E testing, debugging & ID-traceable evidence via BrowserOS neo MCP
npx nexus-devflow skill add setup-tests       # Unit & Playwright browser test harness
npx nexus-devflow skill add ci                # Verify command & GitHub Actions CI
npx nexus-devflow skill add release           # Production release readiness checks
npx nexus-devflow skill add rollback          # History-preserving feature reversal
npx nexus-devflow skill add convert-any-to-md # Bulk Office/PDF to Markdown converter
npx nexus-devflow skill add vendor            # Local git repo ingestion & wrapper synthesis

# Optional Community Visual Skills
npx nexus-devflow skill add archify        # Architecture & trace diagrams
npx nexus-devflow skill add diagram-design # 39 visual charts & presentation templates
```

---

## 📄 License

MIT © [Jakkrich](https://github.com/Jakkrich)
