# Matt Pocock Skills Pilot Runs

Use these pilot runs to test the imported support skills against real DevFlow behavior.

Each pilot must prove that the mainline stage remains the owner and that support skill output lands in the owning artifact or another durable doc.

## Pilot 1: Fuzzy Feature Idea

Route:

```text
/00-Discover -> /10-Define -> /20-Spec
```

Skills:

- `Brainstorm`
- `grill-with-docs`
- `domain-modeling`

Success criteria:

- `00-discover.md` captures uncertainty honestly.
- `10-define.md` resolves terms, scope boundaries, and non-goals.
- `CONTEXT.md` or ADRs are created only for confirmed terms or decisions.
- `20-spec.md` has testable acceptance criteria.

## Pilot 2: Stable Feature With Module Design

Route:

```text
/20-Spec -> /30-Plan
```

Skills:

- `codebase-design`
- `tdd`

Success criteria:

- Spec names module/interface constraints only when they are true delivery constraints.
- Plan names files, seams, test surfaces, and verification commands.
- Behavior-change subtasks have required tests.

## Pilot 3: Bug Report

Route:

```text
Issue-Triage -> Debug -> /40-Implement -> /50-Verify
```

Skills:

- `triage`
- `diagnosing-bugs`
- `tdd`

Success criteria:

- Triage separates evidence from inference.
- Debug produces a tight feedback loop before implementation.
- Implementation includes regression coverage or documents why no correct seam exists.
- Verify records the exact evidence.

## Pilot 4: Review Before Release

Route:

```text
/50-Verify -> /60-Release
```

Skills:

- `review`
- `handoff`

Success criteria:

- Review reports Standards and Spec findings separately.
- Release packaging does not hide unresolved issues.
- Handoff references existing artifacts instead of duplicating them.

## Pilot 5: Runnable Uncertainty

Route:

```text
Research -> /20-Spec or /30-Plan
```

Skills:

- `prototype`
- `codebase-design`

Success criteria:

- Prototype answers one named question.
- Prototype is marked throwaway and has one run command.
- Durable output captures the answer, not the throwaway code.
- The result routes back into a stage artifact.

## Pilot Report Template

```md
# Skill Pilot: {Name}

## Route

## Skills Loaded

## Stage Owner

## Evidence

## What Worked

## Confusion Or Overlap

## Policy Changes Needed

## Promotion Recommendation
```
