#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { issueMarker, issueTitle } from "./lib/upstream-monitor.js";

interface IssueItem {
  number: number;
  title: string;
  body?: string | null;
  pull_request?: unknown;
  html_url?: string;
}

function parseArgs(argv: string[]) {
  if (argv.length !== 2 || argv[0] !== "--issue-body" || !argv[1]) {
    throw new Error("Usage: update-upstream-issue.ts --issue-body PATH");
  }

  return { issueBody: path.resolve(argv[1]) };
}

function selectExistingIssue(issues: IssueItem[]): IssueItem | undefined {
  return issues.find(
    (issue) =>
      !issue.pull_request &&
      issue.title === issueTitle &&
      typeof issue.body === "string" &&
      issue.body.includes(issueMarker)
  );
}

async function githubRequest(token: string, endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "nexus-devflow-upstream-monitor",
      ...options.headers
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub API ${response.status}: ${detail}`);
  }

  return response.status === 204 ? null : response.json();
}

async function listOpenIssues(token: string, repository: string): Promise<IssueItem[]> {
  const issues: IssueItem[] = [];

  for (let page = 1; ; page += 1) {
    const batch = (await githubRequest(
      token,
      `/repos/${repository}/issues?state=open&per_page=100&page=${page}`
    )) as IssueItem[];
    issues.push(...batch);

    if (batch.length < 100) {
      return issues;
    }
  }
}

async function upsertIssue({ token, repository, body }: { token: string; repository: string; body: string }) {
  const existing = selectExistingIssue(await listOpenIssues(token, repository));
  const payload = JSON.stringify({ title: issueTitle, body });

  if (existing) {
    return (await githubRequest(token, `/repos/${repository}/issues/${existing.number}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: payload
    })) as IssueItem;
  }

  return (await githubRequest(token, `/repos/${repository}/issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload
  })) as IssueItem;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const token = process.env.GH_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;

  if (!token || !repository || !/^[^/]+\/[^/]+$/.test(repository)) {
    throw new Error("GH_TOKEN and GITHUB_REPOSITORY are required");
  }

  const body = fs.readFileSync(options.issueBody, "utf8");

  if (!body.includes(issueMarker)) {
    throw new Error("Issue body is missing the upstream monitor marker");
  }

  const issue = await upsertIssue({ token, repository, body });
  console.log(`Upstream review Issue ready: ${issue.html_url}`);
}

if (
  process.argv[1] &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
) {
  main().catch((error: unknown) => {
    console.error(`Upstream Issue update failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}

export { selectExistingIssue, upsertIssue };
