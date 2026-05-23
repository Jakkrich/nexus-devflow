#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');

const requiredWorkflows = [
  '05-Goal.md',
  '20-Debug.md',
  '30-Task.md',
  '31-Plan.md',
  '32-Code.md',
  '33-Verify.md',
  '34-Human.md',
  '54-Insight.md',
  '55-PR-Review.md',
  '59-Wiki.md',
  '90-Agent.md',
  '99-Help.md',
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
  assert(content.includes('## Wiki Update Recommendation'), `${file} should define wiki update recommendation output`);
}

console.log('workflow recommendation tests passed');
