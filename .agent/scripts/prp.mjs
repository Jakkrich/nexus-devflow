#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const CONTRACT_VERSION = '1.0.0';
const PHASES = ['planning', 'coding', 'validation'];
const STATUS_MAP = {
  backlog: ['pending', 'backlog'],
  queue: ['approved', 'planning'],
  planning: ['planning', 'planning'],
  in_progress: ['approved', 'coding'],
  ai_review: ['review', 'qa_review'],
  human_review: ['review', 'human_review'],
  done: ['done', 'done'],
  error: ['rejected', 'validation'],
};

const TEMPLATE_MANIFEST = {
  'task_metadata.json': 'task_metadata.template.json',
  'implementation_plan.json': 'implementation_plan.template.json',
  'requirements.json': 'requirements.template.json',
  'task_logs.json': 'task_logs.template.json',
  'context.json': 'context.template.json',
  'complexity_assessment.json': 'complexity_assessment.template.json',
};

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function findProjectRoot() {
  if (process.env.PRP_PROJECT_ROOT) return path.resolve(process.env.PRP_PROJECT_ROOT);
  let current = process.cwd();
  while (true) {
    if (fs.existsSync(path.join(current, '.agent'))) return current;
    const parent = path.dirname(current);
    if (parent === current) return process.cwd();
    current = parent;
  }
}

function findAgentDir(projectRoot) {
  if (process.env.PRP_AGENT_DIR) return path.resolve(process.env.PRP_AGENT_DIR);
  if (path.basename(process.cwd()) === '.agent' && fs.existsSync(path.join(process.cwd(), 'resources'))) {
    return process.cwd();
  }
  return path.join(projectRoot, '.agent');
}

const PROJECT_ROOT = findProjectRoot();
const AGENT_DIR = findAgentDir(PROJECT_ROOT);
const SPECS_DIR = path.join(PROJECT_ROOT, '.workspaces', 'specs');
const SCHEMA_DIR = path.join(AGENT_DIR, 'resources', 'schemas');

function timestamp() {
  return new Date().toISOString();
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file, fallback = {}) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read JSON ${file}: ${error.message}`);
  }
}

function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function readTemplate(name) {
  return readJson(path.join(SCHEMA_DIR, name));
}

function readSchemaForTemplate(templateName) {
  const schemaName = templateName.replace('.template.json', '.schema.json');
  const schemaPath = path.join(SCHEMA_DIR, schemaName);
  return fs.existsSync(schemaPath) ? readJson(schemaPath) : null;
}

function replacePlaceholders(value, replacements) {
  if (Array.isArray(value)) return value.map((item) => replacePlaceholders(item, replacements));
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, replacePlaceholders(val, replacements)]));
  }
  if (typeof value === 'string') {
    return Object.entries(replacements).reduce((text, [key, val]) => text.replaceAll(`{${key}}`, String(val)), value);
  }
  return value;
}

function materialize(templateName, replacements = {}) {
  return replacePlaceholders(readTemplate(templateName), replacements);
}

function normalizeToTemplate(data, template) {
  if (isObject(template)) {
    const normalized = isObject(data) ? structuredClone(data) : {};
    for (const [key, defaultValue] of Object.entries(template)) {
      if (normalized[key] === undefined || normalized[key] === null) {
        normalized[key] = structuredClone(defaultValue);
      } else {
        normalized[key] = normalizeToTemplate(normalized[key], defaultValue);
      }
    }
    return normalized;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(data)) return structuredClone(template);
    if (template[0] && isObject(template[0])) {
      return data.map((item) => (isObject(item) ? normalizeToTemplate(item, template[0]) : item));
    }
    return data;
  }
  return data;
}

function missingKeys(data, template, prefix = '') {
  const missing = [];
  if (isObject(template)) {
    if (!isObject(data)) return [prefix || '<root>'];
    for (const [key, defaultValue] of Object.entries(template)) {
      const next = prefix ? `${prefix}.${key}` : key;
      if (!(key in data)) missing.push(next);
      else missing.push(...missingKeys(data[key], defaultValue, next));
    }
  } else if (Array.isArray(template) && template[0] && isObject(template[0])) {
    if (!Array.isArray(data)) return [prefix];
    data.forEach((item, index) => missing.push(...missingKeys(item, template[0], `${prefix}[${index}]`)));
  }
  return missing;
}

function validateSchema(value, schema, prefix = '<root>', rootSchema = schema) {
  const errors = [];
  if (!schema) return errors;

  if (schema.$ref?.startsWith('#/$defs/')) {
    const defName = schema.$ref.slice('#/$defs/'.length);
    return validateSchema(value, rootSchema.$defs?.[defName], prefix, rootSchema);
  }

  if (schema.type) {
    const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual =
      value === null ? 'null' :
      Array.isArray(value) ? 'array' :
      typeof value;
    if (!allowed.includes(actual)) {
      errors.push(`${prefix}: expected ${allowed.join('|')}, got ${actual}`);
      return errors;
    }
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${prefix}: expected one of ${schema.enum.join(', ')}, got ${JSON.stringify(value)}`);
  }

  if (schema.type === 'object' && isObject(value)) {
    for (const key of schema.required || []) {
      if (!(key in value)) errors.push(`${prefix}.${key}: missing required key`);
    }
    const properties = schema.properties || {};
    for (const [key, childSchema] of Object.entries(properties)) {
      if (key in value) errors.push(...validateSchema(value[key], childSchema, `${prefix}.${key}`, rootSchema));
    }
  }

  if (schema.type === 'array' && Array.isArray(value) && schema.items) {
    value.forEach((item, index) => errors.push(...validateSchema(item, schema.items, `${prefix}[${index}]`, rootSchema)));
  }

  return errors;
}

function parseOptions(args) {
  const positional = [];
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }
    const key = arg.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) {
      options[key] = true;
    } else {
      options[key] = next;
      i += 1;
    }
  }
  return { positional, options };
}

function findTaskDir(id) {
  if (!fs.existsSync(SPECS_DIR)) return null;
  return fs.readdirSync(SPECS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${id}-`))
    .map((entry) => path.join(SPECS_DIR, entry.name))
    .sort()[0] || null;
}

function listTaskDirs(optionalId) {
  if (optionalId) {
    const dir = findTaskDir(optionalId);
    return dir ? [dir] : [];
  }
  if (!fs.existsSync(SPECS_DIR)) return [];
  return fs.readdirSync(SPECS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(SPECS_DIR, entry.name))
    .sort();
}

function syncStatus(plan, status) {
  plan.status = status;
  const [planStatus, xstateState] = STATUS_MAP[status] || [plan.planStatus || 'planning', plan.xstateState || 'planning'];
  plan.planStatus = planStatus;
  plan.xstateState = xstateState;
}

function phaseLog(logs, phase) {
  if (!logs[phase]) {
    logs[phase] = { status: 'pending', started_at: null, completed_at: null, logs: [] };
  }
  logs[phase].logs ||= [];
  return logs[phase];
}

function appendEvent(taskDir, event) {
  const logsPath = path.join(taskDir, 'task_logs.json');
  const logs = normalizeToTemplate(readJson(logsPath), readTemplate('task_logs.template.json'));
  logs.schema_version = logs.schema_version || CONTRACT_VERSION;
  logs.updated_at = timestamp();
  logs.events ||= [];
  logs.events.push({
    timestamp: timestamp(),
    actor: event.actor || 'agent',
    event: event.event || event.type || 'task.info',
    phase: event.phase || 'planning',
    ref: event.ref || null,
    message: event.message || '',
    metadata: event.metadata || {},
  });
  writeJson(logsPath, logs);
}

function commandInit(args) {
  const { positional, options } = parseOptions(args);
  const [id, title, slug, ...descParts] = positional;
  if (!id || !title || !slug) throw new Error('Usage: prp init {ID} "{Title}" {slug} ["Description"] [--force]');

  const taskDir = path.join(SPECS_DIR, `${id}-${slug}`);
  if (fs.existsSync(taskDir) && !options.force) {
    throw new Error(`Task directory already exists: ${taskDir}. Use --force to overwrite.`);
  }

  ensureDir(taskDir);
  const now = timestamp();
  const description = descParts.join(' ') || title;
  const replacements = {
    ID: id,
    Title: title,
    slug,
    Description: description,
    Goal: description,
    ISO_TIMESTAMP: now,
    SCHEMA_VERSION: CONTRACT_VERSION,
  };

  for (const [fileName, templateName] of Object.entries(TEMPLATE_MANIFEST)) {
    const data = materialize(templateName, replacements);
    data.schema_version ||= CONTRACT_VERSION;
    data.created_at ||= now;
    data.updated_at ||= now;
    if (fileName === 'implementation_plan.json') {
      data.feature = `${id}: ${title}`;
      data.description = description;
    }
    if (fileName === 'task_logs.json') data.spec_id = `${id}-${slug}`;
    writeJson(path.join(taskDir, fileName), data);
  }

  const specPath = path.join(taskDir, 'spec.md');
  if (!fs.existsSync(specPath)) fs.writeFileSync(specPath, `# Spec: ${id} - ${title}\n\n${description}\n`, 'utf8');
  appendEvent(taskDir, { event: 'task.created', phase: 'planning', message: `Created task ${id}: ${title}` });
  console.log(`Successfully initialized task ${id} in ${taskDir}`);
}

function commandUpdate(args) {
  const { positional, options } = parseOptions(args);
  const [id] = positional;
  if (!id) throw new Error('Usage: prp update {ID} [--status status] [--subtask id --substatus status]');
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found in ${SPECS_DIR}`);

  const planPath = path.join(taskDir, 'implementation_plan.json');
  const plan = normalizeToTemplate(readJson(planPath), readTemplate('implementation_plan.template.json'));
  plan.schema_version ||= CONTRACT_VERSION;
  plan.updated_at = timestamp();
  if (options.status) syncStatus(plan, options.status);

  if (options.subtask && options.substatus) {
    let found = false;
    for (const phase of plan.phases || []) {
      for (const subtask of phase.subtasks || []) {
        if (subtask.id === options.subtask) {
          subtask.status = options.substatus;
          found = true;
        }
      }
    }
    if (!found) console.warn(`Warning: Subtask ${options.subtask} not found.`);
    else appendEvent(taskDir, {
      event: 'subtask.status_changed',
      phase: plan.xstateState || 'coding',
      ref: options.subtask,
      message: `Subtask ${options.subtask} -> ${options.substatus}`,
    });
  }
  writeJson(planPath, plan);
  console.log(`Updated task ${id}.`);
}

function commandLog(args) {
  const { positional, options } = parseOptions(args);
  const [id, ...messageParts] = positional;
  if (!id || !messageParts.length) throw new Error('Usage: prp log {ID} "message" [--phase phase] [--complete]');
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);

  const logsPath = path.join(taskDir, 'task_logs.json');
  const logs = normalizeToTemplate(readJson(logsPath), readTemplate('task_logs.template.json'));
  const now = timestamp();
  const phase = options.phase || 'coding';
  const message = messageParts.join(' ');
  logs.schema_version ||= CONTRACT_VERSION;
  logs.updated_at = now;
  const bucket = phaseLog(logs, phase);
  if (bucket.status === 'pending') {
    bucket.status = 'active';
    bucket.started_at ||= now;
  }
  bucket.logs.push(`[${now}] ${message}`);
  if (options.complete) {
    bucket.status = 'completed';
    bucket.completed_at = now;
  }
  logs.events ||= [];
  logs.events.push({
    timestamp: now,
    actor: options.actor || 'agent',
    event: options.type || 'task.log',
    phase,
    ref: options.ref || null,
    message,
    metadata: {},
  });
  writeJson(logsPath, logs);
  console.log(`Logged activity for task ${id}.`);
}

function commandEvent(args) {
  const { positional, options } = parseOptions(args);
  const [id, ...messageParts] = positional;
  if (!id) throw new Error('Usage: prp event {ID} "message" [--event name] [--phase phase] [--ref id]');
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  appendEvent(taskDir, {
    event: options.event || options.type || 'task.event',
    phase: options.phase || 'planning',
    ref: options.ref || null,
    actor: options.actor || 'agent',
    message: messageParts.join(' '),
  });
  console.log(`Appended event for task ${id}.`);
}

function validateFile(filePath, templateName, fix) {
  const template = readTemplate(templateName);
  const schema = readSchemaForTemplate(templateName);
  let data = readJson(filePath);
  const missing = missingKeys(data, template);
  if (fix && missing.length) {
    data = normalizeToTemplate(data, template);
    data.schema_version ||= CONTRACT_VERSION;
    data.updated_at ||= timestamp();
    writeJson(filePath, data);
  }
  const schemaErrors = validateSchema(fix ? readJson(filePath) : data, schema);
  return { missing, schemaErrors };
}

function commandValidate(args, fixDefault = false) {
  const { positional, options } = parseOptions(args);
  const [id] = positional;
  const fix = Boolean(options.fix || fixDefault);
  const taskDirs = listTaskDirs(id);
  if (!taskDirs.length) throw new Error(id ? `Task with ID ${id} not found.` : 'No task directories found.');

  let hadErrors = false;
  for (const taskDir of taskDirs) {
    console.log(`Validating ${path.basename(taskDir)}`);
    for (const [fileName, templateName] of Object.entries(TEMPLATE_MANIFEST)) {
      const filePath = path.join(taskDir, fileName);
      if (!fs.existsSync(filePath)) {
        hadErrors = true;
        console.log(`  MISSING FILE: ${fileName}`);
        if (fix) {
          const data = readTemplate(templateName);
          data.schema_version ||= CONTRACT_VERSION;
          data.created_at ||= timestamp();
          data.updated_at ||= timestamp();
          writeJson(filePath, data);
          console.log(`  FIXED FILE: ${fileName}`);
        }
        continue;
      }
      const { missing, schemaErrors } = validateFile(filePath, templateName, fix);
      if (missing.length || schemaErrors.length) {
        hadErrors = true;
        if (missing.length) console.log(`  MISSING KEYS in ${fileName}: ${missing.join(', ')}`);
        for (const error of schemaErrors) console.log(`  SCHEMA ERROR in ${fileName}: ${error}`);
        if (fix && missing.length) console.log(`  FIXED KEYS: ${fileName}`);
      } else {
        console.log(`  OK: ${fileName}`);
      }
    }
  }
  if (hadErrors && !fix) process.exitCode = 1;
}

function commandRepair(args) {
  commandValidate([...args, '--fix'], true);
}

function commandStatus() {
  if (!fs.existsSync(SPECS_DIR)) {
    console.log('No tasks found (.workspaces/specs does not exist).');
    return;
  }
  const tasks = listTaskDirs();
  console.log('\n==================================================');
  console.log('      PRP PROJECT STATUS DASHBOARD');
  console.log('==================================================');
  if (!tasks.length) {
    console.log('No task folders found.');
    return;
  }
  console.log(`${'ID'.padEnd(6)} | ${'Status'.padEnd(15)} | Title`);
  console.log('-'.repeat(50));
  for (const taskDir of tasks) {
    const planPath = path.join(taskDir, 'implementation_plan.json');
    if (!fs.existsSync(planPath)) {
      console.log(`${path.basename(taskDir).padEnd(6)} | ${'No Plan'.padEnd(15)} | -`);
      continue;
    }
    const plan = readJson(planPath);
    const id = path.basename(taskDir).split('-')[0];
    console.log(`${id.padEnd(6)} | ${(plan.status || 'unknown').padEnd(15)} | ${plan.feature || path.basename(taskDir)}`);
  }
  console.log('==================================================\n');
}

function help() {
  console.log(`PRP Task Management Tool (Node)

Usage:
  prp init {ID} "{Title}" {slug} ["Description"] [--force]
  prp update {ID} [--status status] [--subtask id --substatus status]
  prp log {ID} "message" [--phase planning|coding|validation] [--complete]
  prp event {ID} "message" [--event name] [--phase phase] [--ref id]
  prp validate [ID] [--fix]
  prp repair [ID]
  prp status
`);
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  try {
    if (!command || command === '--help' || command === '-h') return help();
    if (command === 'init') return commandInit(args);
    if (command === 'update') return commandUpdate(args);
    if (command === 'log') return commandLog(args);
    if (command === 'event') return commandEvent(args);
    if (command === 'validate') return commandValidate(args);
    if (command === 'repair') return commandRepair(args);
    if (command === 'status') return commandStatus(args);
    throw new Error(`Unknown command: ${command}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
