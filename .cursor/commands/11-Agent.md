# Invoke Agent

Run a specific specialist agent persona on the codebase or a specific file.

## Usage

```
/11-Agent {AGENT_NAME} {TARGET}
```

Example: `/11-Agent code-simplifier src/utils.ts`
Example: `/11-Agent silent-failure-hunter src/services/`

## Available Agents

Located in `../agents/` (or depending on the IDE config folder):

### 🧑‍💻 Specialist Coders
| `frontend-specialist` | UI/UX Developer. Expert in React, Next.js, and beautiful UI. |
| `backend-specialist` | API & DB Engineer. Expert in API design and server logic. |
| `mobile-developer` | Mobile Engineer. Expert in React Native or Flutter. |
| `game-developer` | Game Engine Expert. Expert in game loops and rendering. |

### 🛡️ Audit & Quality Assurance
| `security-auditor` | Security Expert. Hunts for vulnerabilities and logic flaws. |
| `penetration-tester` | White Hat Hacker. Simulates attacks to test system resilience. |
| `performance-optimizer`| Performance Expert. Profiles code and optimizes bottlenecks. |
| `seo-specialist` | SEO Consultant. Audits web pages for SEO compliance. |
| `test-engineer` | QA Coder. Dedicated to writing Unit and Integration tests. |

### 🏗️ Infrastructure & Architecture
| `orchestrator` | Chief Commander. Coordinates multiple agents for complex tasks. |
| `database-architect` | DB Designer. Optmizes complex queries and schema design. |
| `devops-engineer` | CI/CD Manager. Handles Docker and Deployment pipelines. |
| `code-archaeologist` | Legacy Code Expert. Deciphers undocumented legacy code. |

### 🔍 Explore & Review (PRP Core)
| `discuss-spec` | Discusses and refines specifications (`spec.md`) with the developer |
| `code-reviewer` | Reviews code for guidelines, bugs, and quality |
| `code-simplifier` | Refactors code to be cleaner without changing logic |
| `codebase-analyst` | Analyzes the codebase structure and patterns |
| `codebase-explorer` | Explores the codebase to answer questions |
| `comment-analyzer` | Analyzes comments for outdated or missing info |
| `docs-impact-agent` | Checks if changes require documentation updates |
| `gpui-researcher` | Researches GPUI specific patterns (if applicable) |
| `pr-test-analyzer` | Analyzes PRs for missing tests |
| `silent-failure-hunter` | Finds swallowed errors and missing logs |
| `type-design-analyzer` | Reviews type definitions and hierarchy |
| `web-researcher` | Performs web research for specific topics |

> **Note**: `coach-guideline.md` is a guideline file, not an invocable agent.

## Model Selection Guide

To get the best results, you can pick a Model according to the "family" that best fits the type of task as follows (usually, the latest Model version in that family gives the best results):

| Model Family | Suitable for Task Type | Example Agent |
| :--- | :--- | :--- |
| **🥇 Claude Opus / DeepSeek R1** | **Tasks requiring deep "thinking"**: Asking questions, architectural planning, resolving complex logic | `discuss-spec`, `codebase-analyst` |
| **🥈 Claude Sonnet / Gemini Pro** | **Tasks requiring "precision execution"**: Writing code, Syntax checking, following project rules | `reviewer`, `coder`, `simplifier` |
| **🥉 GPT-4o / Gemini Flash** | **Tasks requiring "finding" information**: Scanning massive amounts of files, summarizing key insights from web or PDFs | `explorer`, `researcher`, `docs-impact` |

> 💡 **Summary Guide:**
> - If you want a **"Thinking Partner"** to debate or plan → Choose **Opus / R1**
> - If you want an **"Artisan"** to write beautiful and compliant code → Choose **Sonnet / Pro**
> - If you want a **"Researcher"** to summarize info as fast as possible → Choose **GPT-4o / Flash**

## Process

1.  **Load Persona**
    - Read the content of `../agents/{AGENT_NAME}.md`.
    - Adopt the persona, tone, and strict rules defined in that file.

2.  **Execute Task**
    - Apply the agent's logic to the `{TARGET}` (file, directory, or concept).
    - If `{TARGET}` is not specified, run on the current active file or recent changes.

3.  **Output**
    - Generate a report or code changes as specified by the agent's instructions.
    - If the agent produces a report, save it to `.auto-claude/reports/{AGENT_NAME}_{TIMESTAMP}.md` (or print to chat if short).
