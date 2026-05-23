---
description: Advanced UI/UX Design Intelligence - Search styles, palettes, and generate design systems.
---

# /ui-ux-pro-max - Design Intelligence

Invoke the **`ui-ux-pro-max`** skill.

This command activates the UI/UX design intelligence system to help you design, build, and review user interfaces.

## Usage

```bash
/ui-ux-pro-max "product type, style, industry"
```

## Process

1. **Invoke Skill**: Activate `skills/ui-ux-pro-max/SKILL.md`.
2. **Analysis**: Extract design requirements from the arguments.
3. **Template Verification**: **MANDATORY:** Before generating UI/UX details, the agent MUST inspect the layout, required sections, and format defined in `.agent/resources/schemas/ui_ux.template.md` to ensure a consistent output layout. Before reporting completion, run `npm run agent -- markdown:validate {report_path} ui_ux.template.md` and replace any placeholder/template text with concrete UI patterns, responsive behavior, states, and accessibility notes.
4. **Design System & Output**: Run the search script to generate a design system. Save the final design system specification as a markdown report under `.workspaces/reports/ui-ux-{topic}.md` (where `{topic}` is a slugified version of the target screen or feature).
5. **Implementation**: Use the generated tokens and rules to build or review the UI.

---
*Next Step: Follow the instructions provided by the Skill to generate the Design System and save the report.*
