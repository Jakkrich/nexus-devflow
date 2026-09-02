import type { Runner } from "../harness.js";

const PROJECT_PLAN = `# Project Plan

## 1. Problem - What problem are we solving?

Readers lose track of articles they intend to revisit and why each one mattered.

## 2. Users - Who is this for?

Independent developers who save technical reading throughout the week.

## 3. Features - What does the MVP need?

- Save an article with a title, URL, and personal note.
- Review saved articles in a simple reading queue.

## 4. Data - What are we storing?

Articles with title, URL, note, saved date, and read status.

## 5. Tech - What stack are we using?

Node.js with local JSON storage and no external services.

## 6. Monetize - How will this make money?

No monetization for the MVP.

## 7. UI/UX - How should this look and feel?

A minimal command-line interface with clear success and error messages.

## 8. Deployment - Where and how will this ship?

Run locally as a Node.js command-line application.
`;

const BUILD_PLAN = `# Build Plan

- [ ] 1. **Save an article** - store a title, URL, and personal note locally
- [ ] 2. **Reading queue** - list saved articles and mark them as read
`;

async function run(t: Runner) {
  t.phase("setup");
  t.installDevFlow();
  t.gitInit();
  t.git("add", "-A");
  t.git("commit", "-m", "chore: create discovery fixture");
  const projectPlanBefore = t.read("devflow/project-plan.md");
  const buildPlanBefore = t.read("devflow/build-plan.md");

  t.phase("discovery starts a conversation without drafting plans");
  const discovery = t.agent(
    "Run /discovery for a new personal reading queue. Start the deep planning conversation, ask only the first focused question, and do not draft or write either planning file yet."
  );

  t.check("discovery invocation succeeded", discovery.status === 0);
  t.check(
    "discovery asked a question",
    discovery.resultText.includes("?") || /question|would you|which|what|who|how/i.test(discovery.resultText)
  );
  t.check("project plan stayed unchanged", t.read("devflow/project-plan.md") === projectPlanBefore);
  t.check("build plan stayed unchanged", t.read("devflow/build-plan.md") === buildPlanBefore);

  t.phase("manual plans continue directly to overview");
  t.write("devflow/project-plan.md", PROJECT_PLAN);
  t.write("devflow/build-plan.md", BUILD_PLAN);
  t.git("add", "-A");
  t.git("commit", "-m", "docs: write plans directly");
  const overview = t.agent(
    "I wrote both planning files directly without using discovery. Run /overview now and generate project-overview.md from them."
  );

  t.check("overview invocation succeeded", overview.status === 0);
  t.check(
    "manual plans generated a reading queue overview",
    /reading queue/i.test(t.read("devflow/context/project-overview.md") || "")
  );
  t.check("manual project plan stayed unchanged", t.read("devflow/project-plan.md") === PROJECT_PLAN);
  t.check("manual build plan stayed unchanged", t.read("devflow/build-plan.md") === BUILD_PLAN);
}

export default {
  name: "discovery-optional",
  description: "Discovery starts without writing plans and the direct planning path still reaches overview",
  run
};
