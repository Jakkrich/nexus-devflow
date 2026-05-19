#!/usr/bin/env node
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const requestedPort = Number(process.env.PORT || process.env.DASHBOARD_PORT || 5050);

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

async function handleRequest(req, res) {
  const url = new URL(req.url || '/', 'http://localhost');
  const pathname = url.pathname === '/' ? '/.agent/dashboard/html/dashboard.html' : url.pathname;
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
