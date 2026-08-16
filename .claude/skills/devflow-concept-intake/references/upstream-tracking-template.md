# Upstream Tracking Template

Use this template for phase 3 only after the user chooses to adopt or actively evaluate a source concept.

```markdown
# Upstream Tracking: {source-name}

## Source

- Repo:
- Upstream revision:
- License:
- Credit:
- Date recorded:

## Adopted Or Evaluated Concepts

| Source Concept | Local DevFlow Mapping | Status |
| :--- | :--- | :--- |
|  |  | adopted | evaluating | rejected |

## Local Integration Points

- Workflows:
- Agents:
- Skills:
- Artifacts:
- Docs/wiki:
- Scripts:

## Update Strategy

Choose one:

- Manual review: revisit only when user asks.
- Scheduled review: revisit on a calendar or release cadence.
- Diff-based review: compare upstream changes against recorded revision.
- No tracking: preserve credit, but do not follow upstream.

## Compatibility Notes

Explain what could break if upstream changes, and what local decisions intentionally diverge from upstream.

## Review Checklist

- [ ] Compare upstream README or docs against recorded revision.
- [ ] Check whether adopted concepts changed meaning.
- [ ] Check whether local DevFlow mapping is still valid.
- [ ] Update adoption proposal or option guide if needed.
- [ ] Preserve credit and license notes.
```
