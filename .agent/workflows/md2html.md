---
description: Convert long-form Markdown documents to styled HTML pages using the md2html skill.
---

# md2html - Convert Markdown to HTML

## Usage

```text
/md2html {file.md}             # output <file>.html next to source
/md2html {file.md} --out X.html # custom output path
/md2html                       # if no arg, ask user which file
```

## Purpose

Use `/md2html` to compile a verbose Markdown document (plan, spec, design, note) into a single, self-contained HTML page that is easy for humans to read, complete with sidebar TOC, Mermaid diagrams, timelines, and callouts.

## Relationship to DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: Any stage
- Typical handoff targets: Return to the active stage

## Sources

- `.agent/skills/md2html/SKILL.md`
- `.agent/skills/md2html/template.html`
- `.agent/skills/md2html/components.md`
