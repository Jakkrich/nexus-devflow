#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');

const requiredWorkflows = [
  'Goal.md',
  'Debug.md',
  'Human-Approve.md',
  'Human-Reject.md',
  'Human-Feedback.md',
  'Human-ReCheck.md',
  '40-Implement.md',
  '50-Verify.md',
  '70-Release.md',
  '60-Report.md',
  'Insight.md',
  'PR-Review.md',
  'Wiki.md',
  'Agent.md',
  'Help.md',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

const templatePath = '.agent/resources/schemas/workflow_recommendation.template.md';
assert(fs.existsSync(path.join(projectRoot, templatePath)), 'workflow recommendation template should exist');

const template = read(templatePath);
assert(template.includes('## Next Workflow Recommendation'), 'template should include next workflow recommendation');
assert(template.includes('## Wiki Update Recommendation'), 'template should include wiki update recommendation');

for (const file of requiredWorkflows) {
  const relativePath = `.agent/workflows/${file}`;
  assert(fs.existsSync(path.join(projectRoot, relativePath)), `${file} should exist`);
  const content = read(relativePath);
  assert(content.includes('## Next Workflow Recommendation'), `${file} should define next workflow recommendation output`);
}

console.log('workflow recommendation tests passed');
