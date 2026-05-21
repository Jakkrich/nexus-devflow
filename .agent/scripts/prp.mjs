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
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const TEMPLATE_MANIFEST = {
  'task_metadata.json': 'task_metadata.template.json',
  'implementation_plan.json': 'implementation_plan.template.json',
  'requirements.json': 'requirements.template.json',
  'task_logs.json': 'task_logs.template.json',
  'context.json': 'context.template.json',
  'complexity_assessment.json': 'complexity_assessment.template.json',
};

const REQUIRED_MARKDOWN_TEMPLATE_MANIFEST = {
  'spec.md': 'spec.template.md',
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

function repairJson(raw) {
  try {
    JSON.parse(raw);
    return raw;
  } catch (originalError) {
    let text = raw.trim();
    text = text.replace(/^```(?:json)?\s*\n?/gm, '').replace(/\n?```\s*$/gm, '');
    text = text.replace(/,(\s*[}\]])/g, '$1');
    text = text.replace(/([}\]"0-9]|true|false|null)\s*\n(\s*[{["])/g, '$1,\n$2');
    try {
      JSON.parse(text);
      return text;
    } catch {
      text = text.replace(/([}\]"])\s+([{["])/g, '$1, $2');
      try {
        JSON.parse(text);
        return text;
      } catch {
        throw originalError;
      }
    }
  }
}

function readJsonRepairable(file, fallback = {}, repair = false) {
  if (!fs.existsSync(file)) return fallback;
  const raw = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    if (!repair) throw new Error(`Cannot read JSON ${file}: ${error.message}`);
    try {
      const repaired = repairJson(raw);
      const data = JSON.parse(repaired);
      writeJson(file, data);
      return data;
    } catch (repairError) {
      throw new Error(`Cannot repair JSON ${file}: ${repairError.message}`);
    }
  }
}

function readTemplate(name) {
  return readJson(path.join(SCHEMA_DIR, name));
}

function readTextTemplate(name) {
  return fs.readFileSync(path.join(SCHEMA_DIR, name), 'utf8');
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

function materializeTextTemplate(templateName, replacements = {}) {
  return Object.entries(replacements).reduce(
    (text, [key, val]) => text.replaceAll(`{${key}}`, String(val)),
    readTextTemplate(templateName),
  );
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

function validateTimestamp(value, prefix) {
  if (typeof value !== 'string') return [`${prefix}: expected ISO timestamp string`];
  if (value.includes('{') && value.includes('}')) return [];
  return ISO_TIMESTAMP_PATTERN.test(value) ? [] : [`${prefix}: expected ISO timestamp, got ${JSON.stringify(value)}`];
}

function validateTopLevelKeys(value, schema, prefix) {
  if (!isObject(value) || !schema?.properties) return [];
  const allowed = new Set(Object.keys(schema.properties));
  return Object.keys(value)
    .filter((key) => !allowed.has(key))
    .map((key) => `${prefix}.${key}: unknown top-level key`);
}

function validateSemanticFile(data, templateName, schema) {
  const errors = [];
  errors.push(...validateTopLevelKeys(data, schema, '<root>'));

  for (const field of ['created_at', 'updated_at']) {
    if (field in data) errors.push(...validateTimestamp(data[field], `<root>.${field}`));
  }

  if (templateName === 'task_logs.template.json') {
    for (const [phaseName, phase] of Object.entries({ planning: data.planning, coding: data.coding, validation: data.validation })) {
      if (!phase) continue;
      if (phase.started_at !== null) errors.push(...validateTimestamp(phase.started_at, `<root>.${phaseName}.started_at`));
      if (phase.completed_at !== null) errors.push(...validateTimestamp(phase.completed_at, `<root>.${phaseName}.completed_at`));
    }
    for (const [index, event] of (data.events || []).entries()) {
      errors.push(...validateTimestamp(event.timestamp, `<root>.events[${index}].timestamp`));
    }
  }

  if (templateName === 'implementation_plan.template.json') {
    const expected = STATUS_MAP[data.status];
    if (expected) {
      const [planStatus, xstateState] = expected;
      if (data.planStatus !== planStatus) {
        errors.push(`<root>.planStatus: expected ${planStatus} for status ${data.status}, got ${data.planStatus}`);
      }
      if (data.xstateState !== xstateState) {
        errors.push(`<root>.xstateState: expected ${xstateState} for status ${data.status}, got ${data.xstateState}`);
      }
    }
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

function resolveArtifactName(name) {
  if (!name) throw new Error('Artifact name is required.');
  const normalized = name.endsWith('.json') ? name : `${name}.json`;
  const aliases = {
    plan: 'implementation_plan.json',
    implementation_plan: 'implementation_plan.json',
    requirements: 'requirements.json',
    metadata: 'task_metadata.json',
    task_metadata: 'task_metadata.json',
    logs: 'task_logs.json',
    task_logs: 'task_logs.json',
    context: 'context.json',
    complexity: 'complexity_assessment.json',
    complexity_assessment: 'complexity_assessment.json',
  };
  const fileName = aliases[name] || aliases[name.replace(/\.json$/, '')] || normalized;
  if (!TEMPLATE_MANIFEST[fileName]) {
    throw new Error(`Unknown artifact: ${name}. Known artifacts: ${Object.keys(TEMPLATE_MANIFEST).join(', ')}`);
  }
  return fileName;
}

function artifactPath(taskDir, artifactName) {
  return path.join(taskDir, resolveArtifactName(artifactName));
}

function parseFieldPath(fieldPath) {
  if (!fieldPath) return [];
  const tokens = [];
  const pattern = /([^.[\]]+)|\[(\d+)\]/g;
  let match;
  while ((match = pattern.exec(fieldPath)) !== null) {
    tokens.push(match[1] ?? Number(match[2]));
  }
  return tokens;
}

function coerceCliValue(value) {
  if (value === undefined) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function getAtPath(data, fieldPath) {
  let current = data;
  for (const token of parseFieldPath(fieldPath)) {
    if (current === undefined || current === null) return undefined;
    current = current[token];
  }
  return current;
}

function setAtPath(data, fieldPath, value) {
  const tokens = parseFieldPath(fieldPath);
  if (!tokens.length) throw new Error('Field path is required.');
  let current = data;
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    if (current[token] === undefined || current[token] === null) {
      current[token] = typeof nextToken === 'number' ? [] : {};
    }
    current = current[token];
    if (!isObject(current) && !Array.isArray(current)) {
      throw new Error(`Cannot descend into non-container at ${tokens.slice(0, i + 1).join('.')}`);
    }
  }
  current[tokens.at(-1)] = value;
}

function appendAtPath(data, fieldPath, value) {
  const existing = getAtPath(data, fieldPath);
  if (existing === undefined) {
    setAtPath(data, fieldPath, []);
  }
  const target = getAtPath(data, fieldPath);
  if (!Array.isArray(target)) throw new Error(`Field is not an array: ${fieldPath}`);
  target.push(value);
}

function mergeAtPath(data, fieldPath, value) {
  if (!isObject(value)) throw new Error('artifact:merge value must be a JSON object.');
  const existing = getAtPath(data, fieldPath);
  if (existing === undefined) {
    setAtPath(data, fieldPath, {});
  }
  const target = getAtPath(data, fieldPath);
  if (!isObject(target)) throw new Error(`Field is not an object: ${fieldPath}`);
  Object.assign(target, value);
}

function loadArtifact(taskDir, artifactName, repair = false) {
  const fileName = resolveArtifactName(artifactName);
  const filePath = path.join(taskDir, fileName);
  const templateName = TEMPLATE_MANIFEST[fileName];
  const data = normalizeToTemplate(readJsonRepairable(filePath, readTemplate(templateName), repair), readTemplate(templateName));
  data.schema_version ||= CONTRACT_VERSION;
  return { fileName, filePath, templateName, data };
}

function saveArtifact(filePath, data) {
  data.updated_at = timestamp();
  writeJson(filePath, data);
}

function csvOrJsonArray(value) {
  if (!value) return [];
  const parsed = coerceCliValue(value);
  if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function normalizeSubtaskStatus(status) {
  const value = String(status || 'pending').trim().toLowerCase();
  if (['pending', 'in_progress', 'completed', 'failed', 'done'].includes(value)) return value;
  if (['todo', 'to_do', 'not_started', 'not-started', 'backlog'].includes(value)) return 'pending';
  if (['in-progress', 'inprogress', 'working', 'active'].includes(value)) return 'in_progress';
  if (['complete', 'finished', 'success'].includes(value)) return 'completed';
  return 'pending';
}

function isTemplateExamplePhase(phase) {
  return phase?.id === 'phase-1'
    && phase?.name === 'Example Phase'
    && Array.isArray(phase.subtasks)
    && phase.subtasks.length === 1
    && phase.subtasks[0]?.id === 'subtask-1.1'
    && phase.subtasks[0]?.title === 'Subtask Title';
}

function clearExamplePlan(plan) {
  if (Array.isArray(plan.phases) && plan.phases.length === 1 && isTemplateExamplePhase(plan.phases[0])) {
    plan.phases = [];
  }
}

function nextPhaseId(plan) {
  const existing = new Set((plan.phases || []).map((phase) => phase.id));
  let index = (plan.phases || []).length + 1;
  while (existing.has(`phase-${index}`)) index += 1;
  return `phase-${index}`;
}

function nextSubtaskId(phase) {
  const existing = new Set((phase.subtasks || []).map((subtask) => subtask.id));
  const phaseNumber = String(phase.id || 'phase-1').match(/\d+/)?.[0] || '1';
  let index = (phase.subtasks || []).length + 1;
  while (existing.has(`subtask-${phaseNumber}.${index}`)) index += 1;
  return `subtask-${phaseNumber}.${index}`;
}

function findPhase(plan, phaseId) {
  return (plan.phases || []).find((phase) => phase.id === phaseId || phase.name === phaseId);
}

function findSubtask(plan, subtaskId) {
  for (const phase of plan.phases || []) {
    for (const subtask of phase.subtasks || []) {
      if (subtask.id === subtaskId || subtask.title === subtaskId) return { phase, subtask };
    }
  }
  return null;
}

function updatePlanSummary(plan) {
  const phases = Array.isArray(plan.phases) ? plan.phases : [];
  const services = new Set();
  const manualSteps = [];
  for (const phase of phases) {
    for (const subtask of phase.subtasks || []) {
      if (subtask.service) services.add(subtask.service);
      if (subtask.verification?.type === 'manual') {
        manualSteps.push(subtask.verification.command || subtask.verification.expected || subtask.title);
      }
    }
  }
  plan.summary ||= {};
  plan.summary.total_phases = phases.length;
  plan.summary.services_involved = [...services];
  plan.summary.parallelism ||= {};
  plan.summary.parallelism.max_parallel_phases = Math.max(1, phases.filter((phase) => !phase.depends_on?.length).length);
  plan.summary.parallelism.recommended_workers = Math.max(1, Math.min(3, plan.summary.parallelism.max_parallel_phases));
  plan.summary.manual_verification_steps = manualSteps;
}

function validatePlanDependencies(plan) {
  const errors = [];
  const phases = Array.isArray(plan.phases) ? plan.phases : [];
  const seen = new Set();
  const allIds = new Set(phases.map((phase) => phase.id));
  const subtaskIds = new Set();
  for (const phase of phases) {
    if (!phase.id) errors.push('Phase is missing id');
    if (seen.has(phase.id)) errors.push(`Duplicate phase id: ${phase.id}`);
    seen.add(phase.id);
    for (const dep of phase.depends_on || []) {
      if (dep === phase.id) errors.push(`Phase ${phase.id}: cannot depend on itself`);
      if (!allIds.has(dep)) errors.push(`Phase ${phase.id}: depends on missing phase ${dep}`);
      if (!seen.has(dep)) errors.push(`Phase ${phase.id}: depends on ${dep} before it appears in the plan`);
    }
    for (const subtask of phase.subtasks || []) {
      if (subtaskIds.has(subtask.id)) errors.push(`Duplicate subtask id: ${subtask.id}`);
      subtaskIds.add(subtask.id);
    }
  }
  return errors;
}

function loadPlan(taskDir) {
  return loadArtifact(taskDir, 'implementation_plan', true);
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
  if (!fs.existsSync(specPath)) {
    const spec = materializeTextTemplate('spec.template.md', {
      'Task ID': id,
      'Task Title': title,
      ID: id,
      Title: title,
      Description: description,
      ISO_TIMESTAMP: now,
    });
    fs.writeFileSync(specPath, spec.endsWith('\n') ? spec : `${spec}\n`, 'utf8');
  }
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
          subtask.status = normalizeSubtaskStatus(options.substatus);
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
  let data = readJsonRepairable(filePath, {}, fix);
  const missing = missingKeys(data, template);
  if (fix && missing.length) {
    data = normalizeToTemplate(data, template);
    data.schema_version ||= CONTRACT_VERSION;
    data.updated_at ||= timestamp();
    writeJson(filePath, data);
  }
  const schemaErrors = validateSchema(fix ? readJson(filePath) : data, schema);
  schemaErrors.push(...validateSemanticFile(fix ? readJson(filePath) : data, templateName, schema));
  if (templateName === 'implementation_plan.template.json') {
    schemaErrors.push(...validatePlanDependencies(fix ? readJson(filePath) : data));
  }
  return { missing, schemaErrors };
}

function markdownHeadings(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^#{2,6}\s+/.test(line));
}

function validateMarkdownFile(filePath, templateName) {
  const templateHeadings = markdownHeadings(readTextTemplate(templateName));
  const fileHeadings = new Set(markdownHeadings(fs.readFileSync(filePath, 'utf8')));
  return templateHeadings.filter((heading) => !fileHeadings.has(heading));
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
    for (const [fileName, templateName] of Object.entries(REQUIRED_MARKDOWN_TEMPLATE_MANIFEST)) {
      const filePath = path.join(taskDir, fileName);
      if (!fs.existsSync(filePath)) {
        hadErrors = true;
        console.log(`  MISSING FILE: ${fileName}`);
        if (fix) {
          const now = timestamp();
          const id = path.basename(taskDir).split('-')[0];
          const title = readJson(path.join(taskDir, 'requirements.json')).task_description || path.basename(taskDir);
          const content = materializeTextTemplate(templateName, {
            'Task ID': id,
            'Task Title': title,
            ID: id,
            Title: title,
            ISO_TIMESTAMP: now,
          });
          fs.writeFileSync(filePath, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
          console.log(`  FIXED FILE: ${fileName}`);
        }
        continue;
      }
      const missingHeadings = validateMarkdownFile(filePath, templateName);
      if (missingHeadings.length) {
        hadErrors = true;
        console.log(`  MISSING HEADINGS in ${fileName}: ${missingHeadings.join(', ')}`);
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

function commandArtifactGet(args) {
  const { positional } = parseOptions(args);
  const [id, artifactName, fieldPath] = positional;
  if (!id || !artifactName) throw new Error('Usage: prp artifact:get {ID} {artifact} [field_path]');
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  const { data } = loadArtifact(taskDir, artifactName, true);
  const value = fieldPath ? getAtPath(data, fieldPath) : data;
  console.log(JSON.stringify(value, null, 2));
}

function commandArtifactSet(args) {
  const { positional } = parseOptions(args);
  const [id, artifactName, fieldPath, ...valueParts] = positional;
  if (!id || !artifactName || !fieldPath || !valueParts.length) {
    throw new Error('Usage: prp artifact:set {ID} {artifact} {field_path} {value}');
  }
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  const { fileName, filePath, data } = loadArtifact(taskDir, artifactName, true);
  setAtPath(data, fieldPath, coerceCliValue(valueParts.join(' ')));
  saveArtifact(filePath, data);
  console.log(`Updated ${fileName}: ${fieldPath}`);
}

function commandArtifactAppend(args) {
  const { positional } = parseOptions(args);
  const [id, artifactName, fieldPath, ...valueParts] = positional;
  if (!id || !artifactName || !fieldPath || !valueParts.length) {
    throw new Error('Usage: prp artifact:append {ID} {artifact} {field_path} {value}');
  }
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  const { fileName, filePath, data } = loadArtifact(taskDir, artifactName, true);
  appendAtPath(data, fieldPath, coerceCliValue(valueParts.join(' ')));
  saveArtifact(filePath, data);
  console.log(`Appended ${fileName}: ${fieldPath}`);
}

function commandArtifactMerge(args) {
  const { positional } = parseOptions(args);
  const [id, artifactName, fieldPath, ...valueParts] = positional;
  if (!id || !artifactName || !fieldPath || !valueParts.length) {
    throw new Error('Usage: prp artifact:merge {ID} {artifact} {field_path} {json_object}');
  }
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  const { fileName, filePath, data } = loadArtifact(taskDir, artifactName, true);
  mergeAtPath(data, fieldPath, coerceCliValue(valueParts.join(' ')));
  saveArtifact(filePath, data);
  console.log(`Merged ${fileName}: ${fieldPath}`);
}

function commandJsonRepair(args) {
  const { positional } = parseOptions(args);
  const [id, artifactName] = positional;
  if (!id || !artifactName) throw new Error('Usage: prp json:repair {ID} {artifact}');
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  const { fileName, filePath, data } = loadArtifact(taskDir, artifactName, true);
  saveArtifact(filePath, data);
  const { missing, schemaErrors } = validateFile(filePath, TEMPLATE_MANIFEST[fileName], true);
  if (missing.length || schemaErrors.length) {
    console.log(`Repaired syntax and normalized ${fileName}, but validation still reports issues:`);
    if (missing.length) console.log(`  MISSING KEYS: ${missing.join(', ')}`);
    for (const error of schemaErrors) console.log(`  SCHEMA ERROR: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Repaired and validated ${fileName}.`);
}

function commandPlanAddPhase(args) {
  const { positional, options } = parseOptions(args);
  const [id, ...nameParts] = positional;
  const name = nameParts.join(' ').trim();
  if (!id || !name) throw new Error('Usage: prp plan:add-phase {ID} "{Name}" [--phase-id id] [--type implementation] [--depends-on phase-1,phase-2]');
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  const { filePath, data: plan } = loadPlan(taskDir);
  clearExamplePlan(plan);
  const phaseId = options['phase-id'] || nextPhaseId(plan);
  if (findPhase(plan, phaseId)) throw new Error(`Phase already exists: ${phaseId}`);
  plan.phases ||= [];
  plan.phases.push({
    id: phaseId,
    name,
    type: options.type || 'implementation',
    depends_on: csvOrJsonArray(options['depends-on']),
    subtasks: [],
  });
  updatePlanSummary(plan);
  saveArtifact(filePath, plan);
  console.log(`Added phase ${phaseId}: ${name}`);
}

function commandPlanAddSubtask(args) {
  const { positional, options } = parseOptions(args);
  const [id, phaseId, ...titleParts] = positional;
  const title = titleParts.join(' ').trim();
  if (!id || !phaseId || !title) {
    throw new Error('Usage: prp plan:add-subtask {ID} {PHASE_ID} "{Title}" [--description text] [--service backend] [--modify a,b] [--create a,b] [--pattern a,b] [--verify-command cmd]');
  }
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  const { filePath, data: plan } = loadPlan(taskDir);
  clearExamplePlan(plan);
  const phase = findPhase(plan, phaseId);
  if (!phase) throw new Error(`Phase not found: ${phaseId}`);
  phase.subtasks ||= [];
  const subtaskId = options['subtask-id'] || options.id || nextSubtaskId(phase);
  if (findSubtask(plan, subtaskId)) throw new Error(`Subtask already exists: ${subtaskId}`);
  phase.subtasks.push({
    id: subtaskId,
    title,
    description: options.description || title,
    service: options.service || 'fullstack',
    files_to_modify: csvOrJsonArray(options.modify || options['files-to-modify']),
    files_to_create: csvOrJsonArray(options.create || options['files-to-create']),
    patterns_from: csvOrJsonArray(options.pattern || options['patterns-from']),
    verification: {
      type: options['verify-type'] || 'manual',
      command: options['verify-command'] || options.verify || 'Manual verification',
      expected: options['verify-expected'] || 'Expected behavior is observed',
    },
    status: normalizeSubtaskStatus(options.status || 'pending'),
  });
  updatePlanSummary(plan);
  saveArtifact(filePath, plan);
  console.log(`Added subtask ${subtaskId}: ${title}`);
}

function commandPlanSetSubtaskStatus(args) {
  const { positional } = parseOptions(args);
  const [id, subtaskId, status] = positional;
  if (!id || !subtaskId || !status) throw new Error('Usage: prp plan:set-subtask-status {ID} {SUBTASK_ID} {status}');
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  const { filePath, data: plan } = loadPlan(taskDir);
  const found = findSubtask(plan, subtaskId);
  if (!found) throw new Error(`Subtask not found: ${subtaskId}`);
  found.subtask.status = normalizeSubtaskStatus(status);
  updatePlanSummary(plan);
  saveArtifact(filePath, plan);
  appendEvent(taskDir, {
    event: 'subtask.status_changed',
    phase: plan.xstateState || 'coding',
    ref: found.subtask.id,
    message: `Subtask ${found.subtask.id} -> ${found.subtask.status}`,
  });
  console.log(`Updated subtask ${found.subtask.id}: ${found.subtask.status}`);
}

function commandPlanValidate(args) {
  const { positional } = parseOptions(args);
  const [id] = positional;
  if (!id) throw new Error('Usage: prp plan:validate {ID}');
  const taskDir = findTaskDir(id);
  if (!taskDir) throw new Error(`Task with ID ${id} not found.`);
  const planPath = path.join(taskDir, 'implementation_plan.json');
  const { missing, schemaErrors } = validateFile(planPath, 'implementation_plan.template.json', false);
  if (missing.length || schemaErrors.length) {
    if (missing.length) console.log(`MISSING KEYS: ${missing.join(', ')}`);
    for (const error of schemaErrors) console.log(`SCHEMA ERROR: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log('Plan validation passed.');
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
  prp artifact:get {ID} {artifact} [field_path]
  prp artifact:set {ID} {artifact} {field_path} {value}
  prp artifact:append {ID} {artifact} {field_path} {value}
  prp artifact:merge {ID} {artifact} {field_path} {json_object}
  prp json:repair {ID} {artifact}
  prp plan:add-phase {ID} "{Name}" [--phase-id id] [--type implementation] [--depends-on phase-1,phase-2]
  prp plan:add-subtask {ID} {PHASE_ID} "{Title}" [--description text] [--service backend] [--modify a,b] [--create a,b]
  prp plan:set-subtask-status {ID} {SUBTASK_ID} {status}
  prp plan:validate {ID}
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
    if (command === 'artifact:get') return commandArtifactGet(args);
    if (command === 'artifact:set') return commandArtifactSet(args);
    if (command === 'artifact:append') return commandArtifactAppend(args);
    if (command === 'artifact:merge') return commandArtifactMerge(args);
    if (command === 'json:repair') return commandJsonRepair(args);
    if (command === 'plan:add-phase') return commandPlanAddPhase(args);
    if (command === 'plan:add-subtask') return commandPlanAddSubtask(args);
    if (command === 'plan:set-subtask-status') return commandPlanSetSubtaskStatus(args);
    if (command === 'plan:validate') return commandPlanValidate(args);
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
