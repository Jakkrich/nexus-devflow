#!/usr/bin/env node
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const requestedPort = Number(process.env.PORT || process.env.DASHBOARD_PORT || 5050);
const nodeBin = process.execPath;

const commandRegistry = {
  'agent-status': {
    label: 'Agent Status',
    description: 'List PRP tasks and their current status.',
    command: [nodeBin, ['./.agent/scripts/prp.mjs', 'status']],
    mutates: false
  },
  validate: {
    label: 'Framework Validate',
    description: 'Run root framework validation. This regenerates project index artifacts before checking them.',
    command: [nodeBin, ['./scripts/validate-framework.mjs']],
    mutates: true
  },
  'agent-validate': {
    label: 'Artifact Validate',
    description: 'Validate task JSON and Markdown artifacts through the PRP CLI.',
    command: [nodeBin, ['./.agent/scripts/prp.mjs', 'validate']],
    mutates: false
  },
  index: {
    label: 'Regenerate Project Index',
    description: 'Regenerate .workspaces project index files.',
    command: [nodeBin, ['./scripts/generate-project-index.mjs']],
    mutates: true
  },
  'roadmap-validate': {
    label: 'Roadmap Validate',
    description: 'Validate roadmap artifacts only. This regenerates project index artifacts before checking them.',
    command: [nodeBin, ['./scripts/validate-framework.mjs', '--roadmap-only']],
    mutates: true
  },
  'sync-check': {
    label: 'Bundle Sync Check',
    description: 'Check agent bundle sync and required files.',
    command: [nodeBin, ['./scripts/sync-agent-bundle.mjs']],
    mutates: false
  },
  graphify: {
    label: 'Graphify',
    description: 'Run the Graphify script with its default action.',
    command: [nodeBin, ['./scripts/graphify.mjs']],
    mutates: false
  }
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(body);
}

function sendJson(res, status, value) {
  send(res, status, JSON.stringify(value, null, 2), { 'Content-Type': 'application/json; charset=utf-8' });
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const target = path.resolve(projectRoot, `.${normalized}`);
  if (target !== projectRoot && !target.startsWith(projectRoot + path.sep)) return null;
  return target;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function renderDirectory(urlPath, fsPath) {
  const entries = await fs.readdir(fsPath, { withFileTypes: true });
  const links = entries
    .filter((entry) => !entry.name.startsWith('.git'))
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name))
    .map((entry) => {
      const suffix = entry.isDirectory() ? '/' : '';
      const href = `${encodeURIComponent(entry.name)}${suffix}`;
      return `<li><a href="${href}">${escapeHtml(entry.name)}${suffix}</a></li>`;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(urlPath)}</title></head>
<body><ul>${links}</ul></body>
</html>`;
}

function listCommands() {
  return Object.entries(commandRegistry).map(([id, config]) => ({
    id,
    label: config.label,
    description: config.description,
    mutates: config.mutates,
    command: `node ${config.command[1].join(' ')}`
  }));
}

function runRegisteredCommand(id) {
  const config = commandRegistry[id];
  if (!config) return Promise.resolve({ ok: false, error: `Unknown command: ${id}` });
  const [command, args] = config.command;
  const startedAt = Date.now();
  const maxOutput = 200_000;

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      windowsHide: true,
      shell: false,
      env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, 300_000);

    child.stdout.on('data', chunk => {
      stdout += chunk.toString();
      if (stdout.length > maxOutput) stdout = stdout.slice(-maxOutput);
    });
    child.stderr.on('data', chunk => {
      stderr += chunk.toString();
      if (stderr.length > maxOutput) stderr = stderr.slice(-maxOutput);
    });
    child.on('error', error => {
      clearTimeout(timer);
      resolve({
        ok: false,
        id,
        label: config.label,
        error: error.message,
        stdout,
        stderr,
        durationMs: Date.now() - startedAt
      });
    });
    child.on('close', code => {
      clearTimeout(timer);
      resolve({
        ok: code === 0 && !timedOut,
        id,
        label: config.label,
        code,
        timedOut,
        stdout,
        stderr,
        durationMs: Date.now() - startedAt
      });
    });
  });
}

async function listFilesRecursively(dir, base = '') {
  let results = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue; // ignore hidden files
      const relPath = base ? `${base}/${entry.name}` : entry.name;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await listFilesRecursively(fullPath, relPath)));
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        let type = 'text';
        if (ext === '.json') type = 'json';
        else if (ext === '.md') type = 'md';
        results.push({
          name: entry.name,
          path: `.workspaces/${relPath}`,
          type
        });
      }
    }
  } catch (err) {
    // Ignore missing directories
  }
  return results;
}

async function scanWorkspaceGroups(projectRoot) {
  const workspacesPath = path.join(projectRoot, '.workspaces');
  const allFiles = await listFilesRecursively(workspacesPath);
  
  const groups = [
    { key: 'project', label: 'Project', icon: 'fa-diagram-project', files: [] },
    { key: 'roadmap', label: 'Roadmap', icon: 'fa-map', files: [] },
    { key: 'specs', label: 'Specs', icon: 'fa-list-check', files: [] },
    { key: 'research', label: 'Research', icon: 'fa-magnifying-glass', files: [] },
    { key: 'prds', label: 'PRDs', icon: 'fa-brain', files: [] },
    { key: 'reports', label: 'Reports', icon: 'fa-chart-simple', files: [] },
    { key: 'debug', label: 'Debug', icon: 'fa-bug', files: [] },
    { key: 'issues', label: 'Issues', icon: 'fa-circle-exclamation', files: [] },
    { key: 'lessons', label: 'Lessons', icon: 'fa-chalkboard-user', files: [] }
  ];

  const groupMap = Object.fromEntries(groups.map(g => [g.key, g]));

  for (const file of allFiles) {
    const parts = file.path.split('/');
    if (parts.length < 2) continue;
    const firstLevel = parts[1];
    
    if (firstLevel.endsWith('.json') && (firstLevel.includes('index') || firstLevel.includes('active'))) {
      groupMap.project.files.push(file);
    } else if (firstLevel === 'roadmap') {
      groupMap.roadmap.files.push(file);
    } else if (firstLevel === 'specs') {
      groupMap.specs.files.push(file);
    } else if (firstLevel === 'research') {
      groupMap.research.files.push(file);
    } else if (firstLevel === 'prds') {
      groupMap.prds.files.push(file);
    } else if (firstLevel === 'reports') {
      groupMap.reports.files.push(file);
    } else if (firstLevel === 'debug') {
      groupMap.debug.files.push(file);
    } else if (firstLevel === 'issues') {
      groupMap.issues.files.push(file);
    } else if (firstLevel === 'lessons.md' || firstLevel === 'lessons.txt' || firstLevel.includes('lessons')) {
      groupMap.lessons.files.push(file);
    } else {
      if (file.path.includes('/specs/')) {
        groupMap.specs.files.push(file);
      } else {
        groupMap.project.files.push(file);
      }
    }
  }

  return groups.filter(g => g.files.length > 0);
}

async function handleApiRequest(req, res, url) {
  if (url.pathname === '/api/commands' && req.method === 'GET') {
    sendJson(res, 200, { commands: listCommands() });
    return true;
  }

  if (url.pathname === '/api/files' && req.method === 'GET') {
    try {
      const groups = await scanWorkspaceGroups(projectRoot);
      sendJson(res, 200, { ok: true, groups });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: error.message });
    }
    return true;
  }

  if (url.pathname === '/api/commands/run' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const result = await runRegisteredCommand(String(body.id || ''));
      sendJson(res, result.ok ? 200 : 400, result);
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    }
    return true;
  }

  if (url.pathname.startsWith('/api/')) {
    sendJson(res, 404, { ok: false, error: 'Unknown API route' });
    return true;
  }

  return false;
}

async function handleRequest(req, res) {
  const url = new URL(req.url || '/', 'http://localhost');
  if (await handleApiRequest(req, res, url)) return;

  let pathname = url.pathname;
  if (pathname === '/') {
    pathname = '/.agent/dashboard/html/dashboard.html';
  } else if (pathname.startsWith('/dashboard')) {
    pathname = `/.agent/dashboard/html${pathname}`;
  }
  const target = safeResolve(pathname);

  if (!target) {
    send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' });
    return;
  }

  try {
    const stat = await fs.stat(target);
    if (stat.isDirectory()) {
      const body = await renderDirectory(pathname, target);
      send(res, 200, body, { 'Content-Type': 'text/html; charset=utf-8' });
      return;
    }

    const ext = path.extname(target).toLowerCase();
    const body = await fs.readFile(target);
    send(res, 200, body, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }
    console.error(error);
    send(res, 500, 'Internal server error', { 'Content-Type': 'text/plain; charset=utf-8' });
  }
}

const server = http.createServer(handleRequest);

server.listen(requestedPort, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${requestedPort}/.agent/dashboard/html/dashboard.html`;
  console.log(`Dashboard: ${url}`);
  console.log('Press Ctrl+C to stop.');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${requestedPort} is already in use. Try: DASHBOARD_PORT=4174 npm run dashboard`);
    process.exit(1);
  }
  throw error;
});
