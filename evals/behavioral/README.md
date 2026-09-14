# Behavioral decision probes

These English/Thai scenarios test skill selection and workflow decisions. They are separate from `npm run test:routing`, which is a lexical smoke check and does not measure model understanding.

Give a fresh agent only each scenario's `id` and `prompt`, the current skill catalog, and the relevant current instructions. Hide `expectedAction` and `expectedSkills`. Ask it to simulate the next action without changing files or running the scenario. Save its verbatim decisions as JSON:

```json
{
  "reviewer": "runtime agent/session identifier",
  "model": "exact model if exposed, otherwise unknown",
  "observations": [
    { "id": "plan-en", "action": "plan", "skills": ["fix"], "reason": "Agent explanation" }
  ]
}
```

Action vocabulary: `plan`, `implement`, `diagnose`, `direct`, `continue`, `review`, `help`, `diagram`. It describes the next decision, not proof that the resulting task succeeds. Skill arrays contain the required DevFlow workflow skills, in order; unrelated general-purpose tools are omitted.

Score with `npx tsx scripts/evals/behavioral.ts <observations.json>`. Every scenario must be present exactly once. Any mismatch, malformed observation, or unknown case fails. Keep reviewer identity, model uncertainty, reasons, and current diff/reference hashes with the evidence. Repeat with other target adapters/models before claiming cross-model reliability. Never replace missing model observations with lexical predictions or hand-authored expected answers.
