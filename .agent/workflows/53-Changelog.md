---
description: Update CHANGELOG.md - Automatically gather changes from specs, git history, or current state to update the project changelog.
---
# Phase 53: Update Changelog

This command automates the process of maintaining the `CHANGELOG.md` file by analyzing task specifications, git diffs, and the current project state.

## Usage

Run the command by typing:
```
/53-Changelog
```

## Objectives

1.  **Change Detection**: Identify new features, fixes, and changes since the last recorded version in `CHANGELOG.md`.
2.  **Automated Versioning**: Analyze the impact of changes to automatically select the next version number (Major, Minor, or Patch) based on Semantic Versioning (SemVer) principles.
3.  **Source Analysis**:
    *   Scan `.workspaces/` for `spec.md` files of active or recently completed tasks.
    *   Check `git status` and `git diff` for uncommitted/staged changes.
    *   Check `git log` if git is initialized to see history since the last tag or version entry.
3.  **Automatic Formatting**: Generate a standardized changelog entry following the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.
4.  **Consistency**: Ensure the `CHANGELOG.md` reflects the actual work done in the repository.

## Process

### 1. Version Detection & Setup
1.  **Read Current Changelog**: Extract the latest version and date from `CHANGELOG.md`.
2.  **Analyze & Determine Next Version**: 
    *   Analyze the collected changes to decide the increment based on **Semantic Versioning (SemVer)**:
        - **Major (+1.0.0)**: Use if there are breaking changes, [DELETE] operations on core modules, or major architectural shifts.
        - **Minor (0.+1.0)**: Use if new features ([NEW]) or significant compatible additions are found.
        - **Patch (0.0.+1)**: Use for bug fixes ([FIXED]), small tweaks ([MODIFY]), or documentation updates.
    *   Auto-propose the version based on the highest impact category found.
3.  **Get Current Date**: Use the current system date (YYYY-MM-DD).

### 2. Information Gathering
1.  **Scan .workspaces/**:
    *   Find all `spec.md` files in subdirectories of `.workspaces/`.
    *   Extract the `Goal` or `Requirements` sections to identify high-level features/fixes.
2.  **Git Analysis** (if available):
    *   Run `git status` to see current work in progress.
    *   Run `git diff` to understand technical changes and impact.
    *   Look for "BREAKING CHANGE" in git commit messages.
3.  **Categorization & Impact Assessment**: Group findings and assess impact:
    *   `Added` → Usually Minor.
    *   `Changed` → Minor or Patch (Major if breaking).
    *   `Fixed` → Patch.
    *   `Removed` → Major (if public API/Core).
    *   `Security` → Patch or Minor.

### 3. Update CHANGELOG.md
1.  **Template Verification**: Before generating a new changelog block, inspect `.agent/resources/schemas/changelog_entry.template.md` and use its headings.
2.  **Generate Entry**: Format the gathered information into a Markdown block.
3.  **Insertion**: Use `replace_file_content` to insert the new version block at the top of the version list (usually after the header and description).
4.  **Validation**: Ensure the file remains readable and correctly formatted.

## Benefits
- **Automation**: Reduces the manual effort of tracking changes.
- **Accuracy**: Ensures all tasks documented in `.workspaces/` are captured.
- **Standardization**: Maintains a consistent look and feel for project history.

## System Prompt / Persona
- **Release Engineer**: Focuses on clear, concise, and accurate documentation of software changes.
- **Technical Writer**: Ensures the changelog is readable for both humans and machines.

## Insight Addon

When recent work includes useful lessons, apply the `insight_extractor` pattern before writing the changelog:

- Extract reusable patterns, gotchas, and file insights from task artifacts and git diff.
- Keep lessons actionable and concise.
- Include only user-facing changes in `CHANGELOG.md`; keep internal gotchas in `.workspaces/lessons.md` or task logs.

## Management-Talk Addon

When changelog input is too implementation-heavy, apply `.agent/skills/9arm-skills/management-talk/SKILL.md` as a credited communication lens:

- Source pack: `9arm-skills`
- Credit: `thananon/9arm-skills`
- Adapted for: Antigravity IDE / Nexus-DevFlow
- Preserve user-facing impact, validation, risk, and follow-up.
- Remove low-value internal details such as function names, long file paths, and commit SHAs unless they are needed for release decisions.
