# 🤖 Cursor Specialist Agents

List of names and roles of the specialized AI Agents (Personas) used in this project to define AI behaviors for accurate and objective-driven performance.

## 📋 How to use
You can invoke these Agents using the command:
```text
/11-Agent {AGENT_NAME} {TARGET_FILE/DIR}
```
*Example: `/11-Agent discuss-spec .auto-claude/specs/007/spec.md`*

---

## 🏗️ Requirements & Planning
| Agent Name | Role | Main Responsibilities |
|:---|:---|:---|
| **`discuss-spec`** | Requirement Engineer | Challenges and fine-tunes `spec.md` to be 360-degree clear before starting work. |
| **`web-researcher`** | Researcher | Searches for in-depth external information (APIs, Best Practices) and provides references. |

## 🔍 Exploration & Analysis
| Agent Name | Role | Main Responsibilities |
|:---|:---|:---|
| **`codebase-explorer`** | Explorer | Locates code and finds existing patterns for reuse. |
| **`codebase-analyst`** | Analyst | Analyzes data flow and interaction between various modules. |
| **`silent-failure-hunter`**| Bug Hunter | Hunts for risky spots where errors might be Swallowed or unlogged. |

## 🛠️ Implementation & Review
| Agent Name | Role | Main Responsibilities |
|:---|:---|:---|
| **`code-reviewer`** | Senior Reviewer | Audits code quality according to project standards and security. |
| **`code-simplifier`** | Refactor Expert | Cleans up code to be readable without changing logic. |
| **`type-design-analyzer`**| Architect | Ensures consistent Type and Interface design across the project. |
| **`comment-analyzer`** | Auditor | Checks if comments are outdated or lacking critical context. |

## 🛡️ PRP Core Engine (Legacy & Orchestration)
| Agent Name | Role | Main Responsibilities |
|:---|:---|:---|
| **`prp-core-planner`** | Senior Architect | creates detailed execution plans (Deep Analysis) based on legacy standards. |
| **`prp-core-coder`** | Systematic Developer | Writes code according to the plan with a continuous Validation Loop. |
| **`prp-core-debugger`** | RCA Specialist | Finds fundamental bug causes using the 5 Whys technique. |
| **`prp-core-prd-architect`** | Product Architect | Drafts Product Requirements Documents (PRD) from initial ideas. |
| **`prp-core-codebase-assistant`** | Code Assistant | Answers questions about the project's structure and logic. |
| **`prp-core-git-committer`** | Git Specialist | Helps stage files and create standard Commit Messages. |
| **`prp-core-git-pr-maker`** | PR Specialist | Gathers information and creates complete Pull Requests. |

---

## 🧪 Documentation & Testing
| Agent Name | Role | Main Responsibilities |
|:---|:---|:---|
| **`docs-impact-agent`** | Docs Manager | Analyzes which documentation is affected by code changes. |
| **`pr-test-analyzer`** | QA Engineer | Analyzes if Pull Requests cover all critical testing scenarios. |


---

## 🧑‍💻 Specialist Coders
| Agent Name | Role | Main Responsibilities |
|:---|:---|:---|
| **`frontend-specialist`** | UI/UX Developer | Expert in React, Next.js, and creating beautiful user interfaces. |
| **`backend-specialist`** | API & DB Engineer | Expert in API design, database schemas, and server logic. |
| **`mobile-developer`** | Mobile Engineer | Expert in React Native or Flutter for iOS/Android apps. |
| **`game-developer`** | Game Engine Expert | Expert in game loops, rendering, and logic. |

## 🛡️ Audit & Quality Assurance
| Agent Name | Role | Main Responsibilities |
|:---|:---|:---|
| **`security-auditor`** | Security Expert | Hunts for vulnerabilities and logic flaws (OWASP). |
| **`penetration-tester`** | White Hat Hacker | Simulates attacks to test system resilience. |
| **`performance-optimizer`** | Performance Expert | Profiles code and optimizes bottlenecks (Memory/CPU). |
| **`seo-specialist`** | SEO Consultant | Audits web pages to ensure Google/SEO compliance. |
| **`test-engineer`** | QA Coder | Dedicated to writing comprehensive Unit and Integration tests. |

## 🏗️ Infrastructure & Architecture
| Agent Name | Role | Main Responsibilities |
|:---|:---|:---|
| **`orchestrator`** | Chief Commander | Coordinates multiple agents to build complex systems. |
| **`database-architect`** | DB Designer | Optmizes complex queries, indexing, and schema design. |
| **`devops-engineer`** | CI/CD Manager | Handles Docker, Deployment pipelines, and server health. |
| **`code-archaeologist`** | Legacy Code Expert | Deciphers undocumented or extremely messy legacy code. |

## 🏛️ Legacy Agents (Deprecated)
*Moved to the `legacy/` folder to reduce confusion, as they belong to the older architecture.*

| Agent Name | Role | Status / Notes |
|:---|:---|:---|
| **`prp-core-issue-investigator`** | Task Investigator | [Legacy] Replaced by `/02-Plan` and `/06-Debug`. |
| **`prp-core-issue-fixer`** | Fixer | [Legacy] Replaced by `/03-Code`. |
| **`prp-core-reviewer`** | QA Reviewer | [Legacy] Replaced by `auto-qa-expert` in `/04-Verify`. |
| **`prp-core-review-orchestrator`**| Orchestrator | [Legacy] Old review orchestration system. |
| **`prp-core-ralph`** | Autonomous Loop | [Legacy] First-generation autonomous loop system. |
| **`prp-core-ralph-canceller`** | Canceller | [Legacy] Used to cancel the Ralph Loop. |

---
*Note: All Agents are designed to be **Pure Agentic**, using Cursor's standard tools for reading and modifying files.*
