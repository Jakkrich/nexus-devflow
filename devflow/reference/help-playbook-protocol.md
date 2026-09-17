# Contextual Help Playbook

**Universal Contextual Help & Playbook Protocol (`help`, `--help`, `-h`, `?`)**:
   Whenever any skill or command is invoked with a help keyword or flag (e.g., `/bughunter help`, `bughunter --help`, `/archify -h`, `/check ?`, `/feature help`):
   - **Execution Safety Gate**: DO NOT execute the skill's primary or mutating actions (do not launch scans/attacks, do not modify source code, and do not initialize new task runs).
   - **Dynamic Workspace Inspection**: Read the target skill in the active adapter. Inspect only workspace files and selected references needed to tailor its examples; reuse current context.
   - **Persistent HTML Playbook & Token-Saving Cache**:
      - **Output Location & Light Theme Mandate**: Compile and persist the tailored playbook as a standalone, styled HTML report at `devflow/reference/playbooks/{skill}.html` adhering to the **Paper/Ink Light Theme Standard** (`data-theme="light"`, teal accent, ruler corner, terminal mockup UI, and a real diagram). Build the standalone page using these conventions.
      - **First Run**: Render the comprehensive 5W1H playbook in chat and write the complete HTML report to `devflow/reference/playbooks/{skill}.html`.
      - **Subsequent Invocations (Delta Updates & Zero Token Bloat)**: If `devflow/reference/playbooks/{skill}.html` already exists:
        - Inspect the existing HTML file and compute the diff/delta against the current repository state (e.g., new file paths, modified endpoints, or newly installed vendor assets).
        - DO NOT repeat unchanged boilerplate or full static content in chat.
        - Provide a concise **Delta Summary** in chat (highlighting what changed, new recommendations, or newly available commands).
        - In-place update `devflow/reference/playbooks/{skill}.html` with the fresh timestamp and state.
        - Provide a clickable link to the actual resolved output file using the active client's supported local-file link format.
   - **Render the User-Friendly 5W1H Playbook**: Emit an easy-to-read, practical guide organized around the **5W 1H Framework** (rendered on initial run or updated in the HTML playbook):
      1. **What (Concept & Capabilities)**: Clear, jargon-free summary of what this skill does, its core concept, and its bundled tools/capabilities.
      2. **Why (Problems Solved & Key Benefits)**: The problems it solves, key advantages, and why you should use it instead of ad-hoc manual work.
      3. **Who (Target Roles & Personas)**: Target audience or engineering role (e.g., Feature Developer, Senior QA, Security Auditor, Solo Dev, or Tech Lead).
      4. **Where (Boundaries & Artifact Locations)**: Target workspace boundaries, affected directories, and generated artifact locations (e.g., `devflow/context/`, `devflow/discoveries/`, `findings.md`).
      5. **When (Timing & Prerequisites/Next Steps)**:
         - **Timing & Triggers**: Practical situations or milestones when this skill should be invoked.
         - **Run Before (Prerequisites)**: What to check, prepare, or run beforehand to get the best result.
         - **Run After (Next Steps)**: What DevFlow command or lifecycle stage should follow next (e.g., handing off to `/fix`, `/feature`, or `/complete`).
      6. **How (Execution Lifecycle & Real Command Examples)**:
         - **How It Works (Lifecycle)**: Simple, plain-language breakdown of the execution steps or phases.
         - **Available Commands & Options**: Common sub-commands, arguments, and flags with brief explanations.
         - **Safety, Guardrails & Precautions**: Operational boundaries, credential hygiene, read-only vs. mutating constraints, and explicit special safety constraints / precautions.
      7. **Diagram Slot & Architecture Flow**:
         - **Real Diagram Mandate**: MUST embed a real, verified vector SVG or interactive diagram reflecting actual skill lifecycle, state transitions, or threat models in Light Theme (`data-theme="light"`).
         - **Thai Language & Legible Typography**: Architecture and flow diagrams must describe workflows and nodes in Thai language while preserving technical identifiers, paths, and commands in English. Typography must be sufficiently sized and legible for Thai script (Headers 13–14px, box content/descriptions 11–12px, line spacing 18–22px) to prevent tone marks and vowels from clipping or overlapping.
         - **Strictly No Placeholders**: NEVER output empty placeholder cards, generic instruction text, or phrases like *"when invoking archify..."*. Every playbook must ship with a real visual architectural diagram.
   - Always conclude the response with: `"Help menu displayed successfully"`.
