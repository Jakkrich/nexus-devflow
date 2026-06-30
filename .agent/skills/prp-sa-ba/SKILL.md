---
name: prp-sa-ba
description: Assist SA/BA in this PRP-based Pure Agentic project with requirement analysis, spec refinement, and maintaining INITIAL.md. Use whenever the user is acting as SA/BA, defining tasks, or discussing project overview.
---

# 📋 PRP SA/BA Workflow (Pure Agentic)

This Skill is tailored to assist users playing the role of an **SA/BA/PO** by collecting requirements and setting up specs so that the AI can work precisely thereafter in accordance with Pure Agentic Framework standards.

## 🎯 Scope of Work
Apply this Skill when:
- **Requirement Analysis**: Transcribing Raw requirements into an actionable plan.
- **Spec Refinement**: Formatting or fine-tuning `spec.md` located in the task folder.
- **Project Indexing**: Operating and updating `INITIAL.md` ensuring it acts as an up-to-date index.
- **Flow Coordination**: Recommending ensuing actions within the Workflow (Issue -> Spec -> Plan -> Code -> Verify).

---

## 1. 📂 Staging to Spec (Phase: New Task)
Commencing a new task:
1. **Pickup from Staging**: Monitor for specific files localized inside `.workspaces/issues/` (Staging Area).
2. **Standardize**: Exploit Issue data to instigate a task directory under `.workspaces/specs/{ID}-{slug}/`.
3. **Core Files**: Lay down standard requisite AI files:
   - `spec.md`: Elaborate technical nuances coupled with Acceptance Criteria.
   - `define.md` / `spec.md` metadata sections: informative context relating to categories, priority, and complexity.

---

## 2. 🧠 Requirement Refining
Aid the SA/BA in finalizing needs thoroughly prior to writing any Code:
- **Dimension 360**: Question elements about Edge Cases, UX, Security, and Technical Impacts.
- **Measurable Goals**: Tweak Acceptance Criteria causing them to be quantitatively tangible (averting phrases like "make it good").
- **Metadata Tuning**: Harmonize Complexity and Priority to resonate closely alongside the veritable effort needed.

---

## 3. 📑 Maintaining INITIAL.md
Act as custodian of the "Home Page of Project" warranting it persists as the quintessential Source of Truth invariably:
- **Indexing**: During the inception or completion of a Task, append a link right into the `Active Specs & Tasks` division.
- **Stack Status**: Maintain the pertinent Technical Stack information actively updated if modifications transpire.
- **Allowed Commands**: Audit alongside updating explicit lists highlighting commands currently actionable by the AI.

---

## 🔄 Workflow Guidance (Next Steps)
Advocate relevant commands following the DevFlow 2.0 hierarchy:
1. **Planning**: Once a spec matures sufficiently, advise executing `/30-Plan {ID}`.
2. **Implementation**: After the plan is ready, endorse launching `/40-Implement {ID}`.
3. **Review**: After implementation evidence exists, point the user to `/50-Verify {ID}`, then `/60-Report {ID}`, and finally `/70-Release {ID}` when release execution is still needed.

---
*Note: This skill synergizes most efficiently running alongside the Agent Persona `requirements-engineer`.*
