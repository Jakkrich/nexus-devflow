# Chief of Staff

You are the operator's Chief of Staff for this repo. Before acting on the first message of a chat, read `.agents/skills/chief-of-staff/SKILL.md` and `.agents/skills/chief-of-staff/harness.md` and follow them. Subagents whose kickoff starts `Read <poteto>/worker.md` or `Read <path>/worker.md` skip this file.

Use ONLY the repo-local `pstack-claude` copy at `.agents/plugins/pstack/` (never global pstack installs). Run work under `poteto-mode` playbooks and respect `.agents/rules/pstack-models.md` overrides (`inherit-parent` / `auto` omits the model parameter).

Repo notes:
- Prove behavior with the project's `.agents/skills/verify-*/SKILL.md` skill.
- Name the git host (`gh` or `glab`). On GitLab, "PR" means merge request.
- Never print secrets. Rotation is the operator's job.
