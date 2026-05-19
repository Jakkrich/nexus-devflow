'use strict';
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  STATE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let allSpecs = [];          // all specs from current active project(s)
let specsByProject = {};    // { projectId: [specs] }
let activeProjectIds = [];  // for multi-project aggregate
let currentSpec = null;
let refreshTimer = null;
let rootHandle = null;
let rootUrl = null;
let rootProjectName = null;
let strategyDiscovery = null;
let strategyRoadmap = null;
let artifactHealth = [];
let filterStatus = null;
let sortMode = 0; // 0=default, 1=priority, 2=created

const SORT_MODES = ['Default', 'Priority', 'Created'];
const COLUMNS = [
  { key: 'planning', label: 'Planning', color: 'var(--col-planning)' },
  { key: 'queue', label: 'Queue', color: 'var(--col-queue)', collapsed: true },
  { key: 'in-progress', label: 'In Progress', color: 'var(--col-progress)' },
  { key: 'ai-review', label: 'AI Review', color: 'var(--col-ai-review)' },
  { key: 'human-review', label: 'Human Review', color: 'var(--col-human-review)' },
  { key: 'done', label: 'Done', color: 'var(--col-done)' },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  FILE SYSTEM HELPERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
async function readFile(handle) { return (await handle.getFile()).text(); }

async function getFileHandle(dir, ...parts) {
  let cur = dir;
  for (let i = 0; i < parts.length - 1; i++) {
    try { cur = await cur.getDirectoryHandle(parts[i]); } catch { return null; }
  }
  try { return await cur.getFileHandle(parts[parts.length - 1]); } catch { return null; }
}

async function listDirs(dir, ...path) {
  let cur = dir;
  for (const p of path) { try { cur = await cur.getDirectoryHandle(p); } catch { return []; } }
  const dirs = [];
  for await (const e of cur.values()) if (e.kind === 'directory') dirs.push({ name: e.name, handle: e });
  return dirs.sort((a, b) => a.name.localeCompare(b.name));
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  INDEXEDDB PERSISTENCE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const IDB = { NAME: 'workspaces-dash', STORE: 'kv', VER: 3 };

function openIDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(IDB.NAME, IDB.VER);
    r.onupgradeneeded = e => { if (!e.target.result.objectStoreNames.contains(IDB.STORE)) e.target.result.createObjectStore(IDB.STORE); };
    r.onsuccess = e => res(e.target.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbGet(k) {
  try { const db = await openIDB(); return new Promise(r => { const q = db.transaction(IDB.STORE, 'readonly').objectStore(IDB.STORE).get(k); q.onsuccess = () => r(q.result ?? null); q.onerror = () => r(null); }); }
  catch { return null; }
}
async function idbSet(k, v) {
  try { const db = await openIDB(); db.transaction(IDB.STORE, 'readwrite').objectStore(IDB.STORE).put(v, k); }
  catch (e) { console.warn('idbSet', e); }
}

async function getProjects() { return (await idbGet('projects')) || []; }

async function saveProject(handle) {
  const projects = await getProjects();
  const existing = projects.find(p => p.name === handle.name);
  if (existing) {
    existing.handle = handle;
    existing.updatedAt = Date.now();
    await idbSet('projects', projects);
    await idbSet('activeProject', existing.id);
    return existing.id;
  }
  const id = handle.name + '_' + Date.now();
  projects.push({ id, name: handle.name, path: handle.name, handle, addedAt: Date.now() });
  await idbSet('projects', projects);
  await idbSet('activeProject', id);
  return id;
}

async function removeProject(id) {
  let projects = await getProjects();
  projects = projects.filter(p => p.id !== id);
  await idbSet('projects', projects);
  const active = await idbGet('activeProject');
  if (active === id) await idbSet('activeProject', projects[0]?.id || null);
  delete specsByProject[id];
  rebuildAllSpecs();
  await renderProjectSwitcher(await idbGet('activeProject'));
  renderAll();
}

async function verifyPerm(handle) {
  try { return (await handle.queryPermission({ mode: 'read' })) === 'granted'; }
  catch { return false; }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PROJECT SWITCHER UI
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let projDropOpen = false;

async function renderProjectSwitcher(activeId) {
  const projects = await getProjects();
  const sw = document.getElementById('projectSwitcher');
  const em = document.getElementById('projEmpty');

  if (!projects.length) { sw.style.display = 'none'; em.style.display = 'flex'; return; }
  sw.style.display = 'flex'; em.style.display = 'none';

  const active = projects.find(p => p.id === activeId);
  document.getElementById('projBarName').textContent = active ? active.name : projects[0].name;

  document.getElementById('projList').innerHTML = projects.map(p => `
    <div class="proj-item ${p.id === activeId ? 'active' : ''}" onclick="switchProject('${p.id}')">
      <div class="proj-item-ico"><i class="fa-solid fa-folder${p.id === activeId ? '-open' : ''}"></i></div>
      <div class="proj-item-info">
        <div class="proj-item-name">${escHtml(p.name)}</div>
        <div class="proj-item-path" title="${escHtml(p.path)}">${escHtml(p.path)}</div>
      </div>
      <div class="proj-item-actions">
        ${p.id === activeId ? '<i class="fa-solid fa-check proj-check"></i>' : ''}
        <button class="proj-del-btn" onclick="event.stopPropagation();confirmRemoveProject('${p.id}','${escHtml(p.name)}')" title="Remove project"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function toggleProjDropdown() {
  projDropOpen = !projDropOpen;
  document.getElementById('projDropdown').style.display = projDropOpen ? 'block' : 'none';
  document.getElementById('projBar').classList.toggle('open', projDropOpen);
}
function closeProjDropdown() {
  projDropOpen = false;
  document.getElementById('projDropdown').style.display = 'none';
  document.getElementById('projBar')?.classList.remove('open');
}

async function switchProject(id) {
  closeProjDropdown();
  const projects = await getProjects();
  const p = projects.find(x => x.id === id);
  if (!p?.handle) return;
  const ok = await verifyPerm(p.handle);
  if (!ok) { showToast(`Please Browse to reconnect "${p.name}" again`, 'error'); return; }
  rootHandle = p.handle;
  rootUrl = null;
  rootProjectName = null;
  await idbSet('activeProject', id);
  document.getElementById('projBarName').textContent = p.name;
  document.getElementById('btnRefresh').style.display = 'flex';
  await renderProjectSwitcher(id);
  await refreshData();
}

function confirmRemoveProject(id, name) {
  if (confirm(`Remove "${name}" from the project list?\n(Your files will not be deleted)`)) removeProject(id);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  BROWSE / LOAD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
async function browseFolder() {
  closeProjDropdown();
  if (!window.showDirectoryPicker) { alert('File System Access API not supported. Use Chrome/Edge, or click Demo.'); return; }
  try {
    const handle = await window.showDirectoryPicker({ mode: 'read' });
    rootHandle = handle;
    rootUrl = null;
    rootProjectName = null;
    const id = await saveProject(handle);
    document.getElementById('projBarName').textContent = handle.name;
    document.getElementById('btnRefresh').style.display = 'flex';
    await renderProjectSwitcher(id);
    await refreshData();
  } catch (e) { if (e.name !== 'AbortError') showToast('Cannot open folder: ' + e.message, 'error'); }
}

async function refreshData() {
  if (!rootHandle && rootUrl) return refreshUrlData();
  if (!rootHandle) return;
  showLoading(true);
  try {
    const specs = await loadFromHandle(rootHandle);
    const active = await idbGet('activeProject');
    specsByProject[active] = specs;

    // Load Strategy Data
    const tryReadJson = async (h, ...p) => {
      const fh = await getFileHandle(h, ...p);
      if (!fh) return null;
      try { return JSON.parse(await readFile(fh)) } catch { return null }
    };
    const readJsonStatus = async (label, ...p) => {
      const fh = await getFileHandle(rootHandle, ...p);
      if (!fh) return { label, path: p.join('/'), status: 'missing', data: null };
      try {
        const data = JSON.parse(await readFile(fh));
        return { label, path: p.join('/'), status: 'healthy', data };
      } catch {
        return { label, path: p.join('/'), status: 'invalid', data: null };
      }
    };
    const artifactChecks = await Promise.all([
      readJsonStatus('Project index', '.workspaces', 'project_index.json'),
      readJsonStatus('Roadmap index', '.workspaces', 'roadmap', 'project_index.json'),
      readJsonStatus('Discovery', '.workspaces', 'roadmap', 'roadmap_discovery.json'),
      readJsonStatus('Roadmap', '.workspaces', 'roadmap', 'roadmap.json')
    ]);
    artifactHealth = artifactChecks;
    strategyDiscovery = artifactChecks.find(a => a.label === 'Discovery')?.data
      || await tryReadJson(rootHandle, '.workspaces', 'roadmap_discovery.json');
    strategyRoadmap = artifactChecks.find(a => a.label === 'Roadmap')?.data
      || await tryReadJson(rootHandle, '.workspaces', 'roadmap.json');

    rebuildAllSpecs();
    renderAll();
    updateLastRefresh();
    showToast(`Loaded ${specs.length} spec${specs.length !== 1 ? 's' : ''}`, 'success');
  } catch (e) { console.error(e); showToast('Error: ' + e.message, 'error'); }
  showLoading(false);
}

async function refreshUrlData() {
  if (!rootUrl) return;
  showLoading(true);
  try {
    const specs = await loadFromProjectUrl(rootUrl);
    const projectId = 'auto-current-project';
    specsByProject = { [projectId]: specs };

    const readJsonStatus = async (label, ...p) => {
      const path = p.join('/');
      try {
        const data = await readJsonUrl(rootUrl, ...p);
        return data ? { label, path, status: 'healthy', data } : { label, path, status: 'missing', data: null };
      } catch {
        return { label, path, status: 'invalid', data: null };
      }
    };

    const artifactChecks = await Promise.all([
      readJsonStatus('Project index', '.workspaces', 'project_index.json'),
      readJsonStatus('Roadmap index', '.workspaces', 'roadmap', 'project_index.json'),
      readJsonStatus('Discovery', '.workspaces', 'roadmap', 'roadmap_discovery.json'),
      readJsonStatus('Roadmap', '.workspaces', 'roadmap', 'roadmap.json')
    ]);
    artifactHealth = artifactChecks;
    strategyDiscovery = artifactChecks.find(a => a.label === 'Discovery')?.data
      || await readJsonUrl(rootUrl, '.workspaces', 'roadmap_discovery.json').catch(() => null);
    strategyRoadmap = artifactChecks.find(a => a.label === 'Roadmap')?.data
      || await readJsonUrl(rootUrl, '.workspaces', 'roadmap.json').catch(() => null);

    rebuildAllSpecs();
    renderAutoProjectHeader();
    renderAll();
    updateLastRefresh();
    showToast(`Auto-loaded ${specs.length} spec${specs.length !== 1 ? 's' : ''}`, 'success');
  } catch (e) { console.error(e); showToast('Auto-load unavailable: ' + e.message, 'error'); }
  showLoading(false);
}

function rebuildAllSpecs() {
  allSpecs = Object.values(specsByProject).flat();
  // Inject projectId into each spec
  Object.entries(specsByProject).forEach(([pid, specs]) => specs.forEach(s => s._projectId = pid));
}

async function loadFromHandle(handle) {
  let dirs = await listDirs(handle, '.workspaces', 'specs');
  if (!dirs.length) dirs = await listDirs(handle, 'specs');
  if (!dirs.length) { return []; }

  const specs = [];
  for (const { name, handle: sh } of dirs) {
    const s = { id: name };
    const tryJson = async (...p) => { const h = await getFileHandle(sh, ...p); if (!h) return null; try { return JSON.parse(await readFile(h)) } catch { return null } };
    const tryMd = async (...p) => { const h = await getFileHandle(sh, ...p); if (!h) return null; return readFile(h); };
    s.plan = await tryJson('implementation_plan.json');
    s.meta = await tryJson('task_metadata.json');
    s.logs = await tryJson('task_logs.json');
    s.context = await tryJson('context.json');
    s.requirements = await tryJson('requirements.json');
    s.complexity = await tryJson('complexity_assessment.json');
    s.specMd = await tryMd('spec.md');
    s.planMd = await tryMd('plan.md');
    s.qaMd = await tryMd('qa_report.md');
    specs.push(s);
  }
  return specs;
}

async function fetchTextUrl(baseUrl, ...parts) {
  const url = new URL(parts.map(encodeURIComponent).join('/'), baseUrl);
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return response.text();
}

async function readJsonUrl(baseUrl, ...parts) {
  const text = await fetchTextUrl(baseUrl, ...parts);
  if (!text) return null;
  return JSON.parse(text);
}

async function readTextUrl(baseUrl, ...parts) {
  return fetchTextUrl(baseUrl, ...parts);
}

async function listDirsUrl(baseUrl, ...parts) {
  const dirUrl = new URL(parts.map(encodeURIComponent).join('/') + '/', baseUrl);
  const response = await fetch(dirUrl, { cache: 'no-store' });
  if (!response.ok) return [];
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const dirs = [];
  for (const a of doc.querySelectorAll('a[href]')) {
    const raw = a.getAttribute('href');
    if (!raw || raw.startsWith('?') || raw.startsWith('#') || raw === '../') continue;
    const decoded = decodeURIComponent(raw.split(/[?#]/)[0]).replace(/\/$/, '');
    const name = decoded.split('/').filter(Boolean).pop();
    if (!name || name === '..' || name.includes('.')) continue;
    dirs.push({ name });
  }
  return [...new Map(dirs.map(d => [d.name, d])).values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function loadFromProjectUrl(baseUrl) {
  let dirs = [];
  try { dirs = await listDirsUrl(baseUrl, '.workspaces', 'specs'); } catch { dirs = []; }
  if (!dirs.length) {
    try { dirs = await listDirsUrl(baseUrl, 'specs'); } catch { dirs = []; }
  }

  const specs = [];
  for (const { name } of dirs) {
    const s = { id: name };
    const tryJson = async (...p) => { try { return await readJsonUrl(baseUrl, '.workspaces', 'specs', name, ...p); } catch { return null; } };
    const tryMd = async (...p) => { try { return await readTextUrl(baseUrl, '.workspaces', 'specs', name, ...p); } catch { return null; } };
    s.plan = await tryJson('implementation_plan.json');
    s.meta = await tryJson('task_metadata.json');
    s.logs = await tryJson('task_logs.json');
    s.context = await tryJson('context.json');
    s.requirements = await tryJson('requirements.json');
    s.complexity = await tryJson('complexity_assessment.json');
    s.specMd = await tryMd('spec.md');
    s.planMd = await tryMd('plan.md');
    s.qaMd = await tryMd('qa_report.md');
    specs.push(s);
  }
  return specs;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  STATUS / HELPERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function normalizeStatus(spec) {
  const raw = (spec.plan?.xstateState || spec.plan?.status || 'planning').toLowerCase().trim();
  if (/^done|completed$/.test(raw)) return 'done';
  if (raw === 'archived') return 'archived';
  if (/human.?review/.test(raw)) return 'human-review';
  if (/ai.?review|^review|qa/.test(raw)) return 'ai-review';

  // Requirement: If planned, move to In Progress
  if (spec.plan && spec.plan.phases && spec.plan.phases.length > 0) return 'in-progress';

  if (/in.?progress|coding/.test(raw)) return 'in-progress';
  if (/queue|queued|pending/.test(raw)) return 'queue';
  return 'planning';
}

function priorityOrder(s) {
  const p = s.meta?.priority?.toLowerCase();
  return p === 'high' ? 0 : p === 'medium' ? 1 : p === 'low' ? 2 : 3;
}

function getCreated(s) {
  return new Date(s.plan?.created_at || s.logs?.created_at || 0);
}

function escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

function getDuration(start, end) {
  try {
    const ms = new Date(end) - new Date(start); if (ms < 0) return null;
    const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
    return h ? `${h}h ${m % 60}m` : m ? `${m}m ${s % 60}s` : `${s}s`;
  } catch { return null; }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  VIEW SWITCHER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let currentView = 'kanban';
function switchView(v) {
  currentView = v;
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + v).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + v).classList.add('active');
  if (v === 'timeline') renderTimeline();
  if (v === 'stats') renderStats();
  if (v === 'strategy') renderStrategy();
  if (v === 'search') document.getElementById('globalSearch').focus();
}

function renderStrategy() {
  const wrap = document.getElementById('strategyContent');
  if (!strategyDiscovery && !strategyRoadmap) {
    wrap.innerHTML = '<div class="no-data"><i class="fa-solid fa-chess-knight"></i><h3>No strategy data</h3><p>Load a project with .workspaces/roadmap_discovery.json and roadmap.json</p></div>';
    return;
  }

  let html = '';

  // Artifact Health Section
  if (artifactHealth.length) {
    html += `
          <div class="strategy-section">
            <div class="sec-header"><i class="fa-solid fa-heart-pulse"></i> Artifact Health</div>
            <div class="artifact-health-grid">
              ${artifactHealth.map(a => `
                <div class="artifact-health-card ${a.status}">
                  <div class="artifact-health-main">
                    <span class="artifact-health-name">${escHtml(a.label)}</span>
                    <span class="artifact-health-status">${escHtml(a.status)}</span>
                  </div>
                  <div class="artifact-health-path">${escHtml(a.path)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
  }

  // Discovery Section
  if (strategyDiscovery) {
    const d = strategyDiscovery;
    html += `
          <div class="strategy-section">
            <div class="sec-header"><i class="fa-solid fa-rocket"></i> Project Discovery</div>
            <div class="sec-grid">
              <div class="sec-card">
                <label>Vision</label>
                <div class="sec-val">${escHtml(d.product_vision?.one_liner || (d.vision ? d.vision : 'â€”'))}</div>
              </div>
              <div class="sec-card">
                <label>Target Audience</label>
                <div class="sec-val">${escHtml(d.target_audience?.primary_persona || (d.target_audience?.primary ? d.target_audience.primary : 'â€”'))}</div>
              </div>
              <div class="sec-card">
                <label>Success Metrics / Goals</label>
                <div class="sec-list">
                  ${(d.product_vision?.success_metrics || d.target_audience?.goals || []).map(m => `<span><i class="fa-solid fa-check"></i> ${escHtml(m)}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        `;
  }

  // Roadmap Section
  if (strategyRoadmap) {
    const r = strategyRoadmap;
    html += `
          <div class="strategy-section">
            <div class="sec-header"><i class="fa-solid fa-map"></i> Roadmap</div>
            <div class="roadmap-phases">
              ${(r.phases || []).map(p => {
      const phaseFeatures = (p.features || []).map(fid => r.features?.find(feat => feat.id === fid)).filter(Boolean);
      return `
                <div class="road-phase">
                  <div class="road-phase-hdr">
                    <span class="road-phase-id">${p.id || 'P' + p.order}</span>
                    <span class="road-phase-name">${escHtml(p.name)}</span>
                    <span class="status-pill ${p.status}">${p.status}</span>
                  </div>
                  <div class="road-phase-desc">${escHtml(p.description)}</div>
                  
                  ${(p.milestones || []).length > 0 ? `
                  <div class="road-milestones">
                    <div class="road-milestones-header">
                      <i class="fa-solid fa-flag-checkered"></i> Milestones
                    </div>
                    ${(p.milestones || []).map(m => {
        const milestoneFeatures = (m.features || []).map(fid => r.features?.find(feat => feat.id === fid)).filter(Boolean);
        return `
                      <div class="road-milestone">
                        <div class="road-milestone-hdr">
                          <span class="road-milestone-id">${m.id || ''}</span>
                          <span class="road-milestone-title">${escHtml(m.title)}</span>
                          <span class="status-pill ${m.status}">${m.status}</span>
                        </div>
                        <div class="road-milestone-desc">${escHtml(m.description)}</div>
                        ${milestoneFeatures.length > 0 ? `
                        <div class="road-milestone-features">
                          ${milestoneFeatures.map(f => `
                            <span class="road-milestone-feat-tag">${escHtml(f.title)}</span>
                          `).join('')}
                        </div>
                        ` : ''}
                      </div>
                      `;
      }).join('')}
                  </div>
                  ` : ''}
                  
                  <div class="road-phase-features-header">
                    <i class="fa-solid fa-list-check"></i> Features (${phaseFeatures.length})
                  </div>
                  <div class="road-phase-features">
                    ${phaseFeatures.map(f => `
                      <div class="road-feat" onclick="toggleFeatureDetail('${f.id}')">
                        <div class="road-feat-main">
                          <span class="road-feat-title">${escHtml(f.title)}</span>
                          <div class="road-feat-tags">
                            <span class="tag tag-priority-${f.priority || 'medium'}">${f.priority || ''}</span>
                            <span class="tag tag-complexity-${f.complexity || 'medium'}">${f.complexity || ''}</span>
                            <span class="tag tag-impact-${f.impact || 'medium'}">${f.impact || ''}</span>
                          </div>
                        </div>
                        <div class="road-feat-detail" id="feat-detail-${f.id}" style="display:none">
                          ${f.description ? `<div class="road-feat-desc"><strong>Description:</strong> ${escHtml(f.description)}</div>` : ''}
                          ${f.rationale ? `<div class="road-feat-rationale"><strong>Rationale:</strong> ${escHtml(f.rationale)}</div>` : ''}
                          ${f.dependencies && f.dependencies.length > 0 ? `
                          <div class="road-feat-deps">
                            <strong>Dependencies:</strong>
                            ${f.dependencies.map(depId => {
        const dep = r.features?.find(feat => feat.id === depId);
        return dep ? `<span class="road-feat-dep-tag">${escHtml(dep.title)}</span>` : '';
      }).join('')}
                          </div>
                          ` : ''}
                          ${f.acceptance_criteria && f.acceptance_criteria.length > 0 ? `
                          <div class="road-feat-ac">
                            <strong>Acceptance Criteria:</strong>
                            <ul>
                              ${f.acceptance_criteria.map(ac => `<li>${escHtml(ac)}</li>`).join('')}
                            </ul>
                          </div>
                          ` : ''}
                          ${f.user_stories && f.user_stories.length > 0 ? `
                          <div class="road-feat-stories">
                            <strong>User Stories:</strong>
                            <ul>
                              ${f.user_stories.map(us => `<li>${escHtml(us)}</li>`).join('')}
                            </ul>
                          </div>
                          ` : ''}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
    }).join('')}
            </div>
          </div>
        `;
  }

  wrap.innerHTML = html;
}


function toggleFeatureDetail(featureId) {
  const detail = document.getElementById('feat-detail-' + featureId);
  if (detail) {
    detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
  }
}

function renderAll() {
  renderKanban();
  if (currentView === 'timeline') renderTimeline();
  if (currentView === 'stats') renderStats();
  if (currentView === 'strategy') renderStrategy();
}


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  FILTERS & SORT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function toggleStatusFilter(status) {
  filterStatus = filterStatus === status ? null : status;
  document.querySelectorAll('.stat-card').forEach((c, i) => {
    const key = ['planning', 'queue', 'in-progress', 'ai-review', 'human-review', 'done'][i];
    c.classList.toggle('filtered', filterStatus === key);
  });
  applyFilters();
}

function cycleSortMode() {
  sortMode = (sortMode + 1) % SORT_MODES.length;
  document.getElementById('sortLabel').textContent = SORT_MODES[sortMode];
  document.getElementById('sortIcon').className = sortMode === 1 ? 'fa-solid fa-flag' : sortMode === 2 ? 'fa-solid fa-clock' : 'fa-solid fa-sort';
  applyFilters();
}

function getFilteredSpecs() {
  const q = (document.getElementById('kanbanSearch')?.value || '').toLowerCase();
  const pri = document.getElementById('filterPriority')?.value || '';
  const cat = document.getElementById('filterCategory')?.value || '';
  const proj = document.getElementById('filterProject')?.value || '';

  let specs = [...allSpecs];
  if (q) specs = specs.filter(s => {
    const t = (s.plan?.feature || s.id || '').toLowerCase();
    return t.includes(q) || s.id.toLowerCase().includes(q);
  });
  if (pri) specs = specs.filter(s => s.meta?.priority === pri);
  if (cat) specs = specs.filter(s => s.meta?.category === cat);
  if (proj) specs = specs.filter(s => s._projectId === proj);
  if (filterStatus) specs = specs.filter(s => normalizeStatus(s) === filterStatus);
  else specs = specs.filter(s => normalizeStatus(s) !== 'archived'); // Hide archived unless filtered by status (if ever allowed)

  if (sortMode === 1) specs.sort((a, b) => priorityOrder(a) - priorityOrder(b));
  else if (sortMode === 2) specs.sort((a, b) => getCreated(b) - getCreated(a));

  return specs;
}

function applyFilters() { renderKanban(getFilteredSpecs()); }

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  KANBAN RENDER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderKanban(specs = null) {
  specs = specs || getFilteredSpecs();
  const wrapper = document.getElementById('boardWrapper');
  const statsRow = document.getElementById('statsRow');

  if (!rootHandle && !allSpecs.length) {
    wrapper.innerHTML = '<div class="no-data"><i class="fa-solid fa-layer-group"></i><h3>No workspace loaded</h3><p>Click <strong>Browse</strong> to select a project folder containing <code>.workspaces/specs</code>, or click <strong>Demo</strong> to preview sample data.</p></div>';
    statsRow.style.display = 'none';
    document.getElementById('totalCount').textContent = 0;
    return;
  }

  // Stats from ALL specs (not filtered)
  const allGroups = {};
  COLUMNS.forEach(c => allGroups[c.key] = 0);
  allSpecs.forEach(s => { const k = normalizeStatus(s); if (allGroups[k] !== undefined) allGroups[k]++; });
  document.getElementById('cnt-planning').textContent = allGroups.planning;
  document.getElementById('cnt-queue').textContent = allGroups.queue;
  document.getElementById('cnt-progress').textContent = allGroups['in-progress'];
  document.getElementById('cnt-ai-review').textContent = allGroups['ai-review'];
  document.getElementById('cnt-human-review').textContent = allGroups['human-review'];
  document.getElementById('cnt-done').textContent = allGroups.done;
  document.getElementById('totalCount').textContent = allSpecs.length;
  statsRow.style.display = 'flex';

  // Build filtered groups
  const groups = {};
  COLUMNS.forEach(c => groups[c.key] = []);
  specs.forEach(s => { const k = normalizeStatus(s); if (groups[k]) groups[k].push(s); });

  const board = document.createElement('div');
  board.className = 'board';

  COLUMNS.forEach(col => {
    const cards = groups[col.key] || [];
    const colEl = document.createElement('div');
    colEl.className = `column ${col.collapsed ? 'collapsed' : ''}`;
    colEl.dataset.col = col.key;
    colEl.innerHTML = `
      <div class="col-header" onclick="toggleColumn(this)">
        <div class="col-dot" style="background:${col.color}"></div>
        <div class="col-title">${col.label}</div>
        <div class="col-badge">${cards.length}</div>
        <i class="fa-solid fa-chevron-left col-toggle"></i>
      </div>
      <div class="col-body" id="col-${col.key}">
        ${cards.length === 0 ? '<div class="empty-col"><i class="fa-regular fa-circle-dot"></i><p>Empty</p></div>' : ''}
      </div>`;
    board.appendChild(colEl);
    const body = colEl.querySelector('.col-body');
    cards.forEach((spec, idx) => body.appendChild(buildCard(spec, idx)));
  });

  wrapper.innerHTML = '';
  wrapper.appendChild(board);

  const q = document.getElementById('kanbanSearch')?.value || '';
  document.getElementById('resultCount').textContent = specs.length < allSpecs.length ? `${specs.length} of ${allSpecs.length} shown` : '';

  // Multi-project filter dropdown
  const projFilter = document.getElementById('filterProject');
  const projectIds = Object.keys(specsByProject);
  if (projectIds.length > 1) {
    projFilter.style.display = 'block';
    const names = {};
    Object.entries(specsByProject).forEach(([id, specs]) => names[id] = specs[0]?._projectName || id.split('_')[0]);
    projFilter.innerHTML = '<option value="">All projects</option>' + projectIds.map(id => `<option value="${id}">${escHtml(names[id])}</option>`).join('');
  } else {
    projFilter.style.display = 'none';
  }
}

function toggleColumn(header) {
  const col = header.closest('.column');
  col.classList.toggle('collapsed');
}

function buildCard(spec, idx) {
  const el = document.createElement('div');
  el.className = 'card';
  el.style.animationDelay = (idx * 35) + 'ms';
  const meta = spec.meta || {}, plan = spec.plan || {};
  const logs = spec.logs || {};
  const title = plan.feature || spec.id;
  const phases = plan.phases || [];
  const getTasks = (p) => p.tasks || p.subtasks || [];
  const isCompleted = (s) => s.status === 'completed' || s.status === 'done';

  const total = phases.reduce((a, p) => a + getTasks(p).length, 0);
  const done = phases.reduce((a, p) => a + getTasks(p).filter(s => isCompleted(s)).length, 0);
  const dots = phases.map(p => {
    const t = getTasks(p);
    const pct = t.length ? Math.round(t.filter(s => isCompleted(s)).length / t.length * 100) : 0;
    return `<div class="phase-dot ${pct === 100 ? 'done' : pct > 0 ? 'progress' : ''}"></div>`;
  }).join('');

  // Stepper logic
  const status = normalizeStatus(spec);
  const hasPhases = !!(spec.plan && spec.plan.phases && spec.plan.phases.length > 0);

  const stepPlan = hasPhases; // Only highlight PLAN after /02 (when phases exist)
  const stepCode = ['in-progress', 'ai-review', 'human-review', 'done'].includes(status);
  const stepQA = ['ai-review', 'human-review', 'done'].includes(status);
  const isDone = status === 'done';

  const complexity = String(spec.complexity?.complexity || spec.complexity?.level || plan.complexity_assessment?.level || meta.complexity || '').trim() || undefined;
  const priCls = `tag-priority-${(meta.priority || 'medium').toLowerCase()}`;

  el.innerHTML = `
    <div class="card-top">
      <div class="card-id">${spec.id.split('-')[0]}</div>
      <div class="card-title">${escHtml(title)}</div>
      <button class="proj-del-btn" style="opacity:0.6; padding:0 4px; height:18px" onclick="event.stopPropagation();updateTaskStatus('${spec.id}', 'archived')" title="Archive Task">
        <i class="fa-solid fa-box-archive"></i>
      </button>
    </div>
    <div class="card-meta">
      <span class="tag tag-status-${status}">${status.replace('-', ' ')}</span>
      ${meta.priority ? `<span class="tag ${priCls}">${meta.priority}</span>` : ''}
      ${meta.category ? `<span class="tag tag-category">${meta.category}</span>` : ''}
      ${complexity ? `<span class="tag tag-complexity">${complexity}</span>` : ''}
    </div>
    ${total > 0 ? `
    <div class="card-progress">
      <div class="card-progress-labels">
        <span class="card-progress-stat">${status === 'in-progress' ? 'Coding' : status.replace('-', ' ')}</span>
        <span class="card-progress-pct">${Math.round(done / total * 100)}%</span>
      </div>
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width:${Math.round(done / total * 100)}%"></div>
      </div>
    </div>` : ''}
    
    <div class="card-stepper">
      <div class="step ${stepPlan ? 'active' : ''}">Plan</div>
      <div class="step-line ${stepCode ? 'active' : ''}"></div>
      <div class="step ${stepCode ? 'active' : ''}">Code</div>
      <div class="step-line ${stepQA ? 'active' : ''}"></div>
      <div class="step ${stepQA ? 'active' : ''}">QA</div>
    </div>

    <div class="card-footer">
      <div class="card-footer-left">
        <i class="fa-solid fa-clock"></i>
        <span>${formatRelativeDate(spec.plan?.updated_at || spec.meta?.created_at)}</span>
      </div>
    </div>`;
  el.addEventListener('click', () => openModal(spec));
  return el;
}

function formatRelativeDate(iso) {
  if (!iso) return 'â€”';
  try {
    const diff = Date.now() - new Date(iso);
    const m = Math.floor(diff / 60000);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return 'just now';
  } catch { return 'â€”'; }
}

async function updateTaskStatus(specId, newStatus) {
  const spec = getSpecById(specId);
  if (!spec || !rootHandle) return;

  if (newStatus === 'archived' && !confirm(`Archive task "${spec.plan?.feature || specId}"?`)) return;

  try {
    // Find spec directory
    let specsDir;
    try { specsDir = await rootHandle.getDirectoryHandle('.workspaces'); specsDir = await specsDir.getDirectoryHandle('specs'); }
    catch { specsDir = await rootHandle.getDirectoryHandle('specs'); }

    const specDir = await specsDir.getDirectoryHandle(specId);
    const planHandle = await specDir.getFileHandle('implementation_plan.json', { create: false });

    // Read and update
    const plan = JSON.parse(await readFile(planHandle));
    plan.status = newStatus;
    plan.xstateState = newStatus;
    plan.updated_at = new Date().toISOString();

    // Write back
    const writable = await planHandle.createWritable();
    await writable.write(JSON.stringify(plan, null, 4));
    await writable.close();

    let actionMsg = 'Status updated';
    if (newStatus === 'done') actionMsg = 'Task Approved';
    else if (newStatus === 'archived') actionMsg = 'Task Archived';
    else if (newStatus === 'queue') actionMsg = 'Task sent to Queue';
    showToast(actionMsg, 'success');

    // Refresh local data
    spec.plan = plan;
    if (currentSpec && currentSpec.id === specId) {
      currentSpec.plan = plan;
      // Update modal if open
      const statusPill = document.querySelector('.modal .status-pill');
      if (statusPill) {
        statusPill.className = `status-pill ${normalizeStatus(spec)}`;
        statusPill.textContent = normalizeStatus(spec);
      }
      // Refresh QA Tab content to show/hide buttons
      renderQATab(spec);
    }

    applyFilters();
  } catch (e) {
    console.error(e);
    showToast('Error updating status: ' + e.message, 'error');
  }
}

function renderQATab(spec) {
  const status = normalizeStatus(spec);
  let actionHtml = '';

  // Approve section: ONLY for human-review
  if (status === 'human-review') {
    actionHtml += `
            <div style="margin-top:20px; padding:16px; background:rgba(52, 211, 153, 0.05); border:1px solid rgba(52, 211, 153, 0.2); border-radius:var(--r); display:flex; align-items:center; justify-content:space-between">
                <div>
                    <div style="font-weight:700; color:var(--text); margin-bottom:4px">Ready to Finalize?</div>
                    <div style="font-size:11px; color:var(--text3)">Click Approve once you are satisfied with the implementation.</div>
                </div>
                <button class="btn btn-primary" onclick="updateTaskStatus('${spec.id}', 'done')">
                    <i class="fa-solid fa-check-circle"></i> Approve Implementation
                </button>
            </div>`;
  }

  document.getElementById('tab-qa').innerHTML = `
            ${spec.qaMd ? `<div class="md-content">${marked.parse(spec.qaMd)}</div>` : '<div class="empty-state"><i class="fa-solid fa-microscope"></i><p>No QA report found</p></div>'}
            ${actionHtml}
        `;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  TIMELINE VIEW
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderTimeline() {
  const wrap = document.getElementById('tlWrap');
  const q = (document.getElementById('tlSearch')?.value || '').toLowerCase();
  const rangeDays = parseInt(document.getElementById('tlRange')?.value || '30');

  if (!allSpecs.length) {
    wrap.innerHTML = '<div class="no-data"><i class="fa-solid fa-timeline"></i><h3>No data</h3><p>Load a project to see the timeline.</p></div>';
    return;
  }

  // Gather events from logs
  const rows = [];
  allSpecs.filter(s => !q || (s.plan?.feature || s.id).toLowerCase().includes(q)).forEach(spec => {
    const logs = spec.logs;
    let earliest = null, latest = null;
    const phases = [];
    if (logs?.phases) {
      Object.entries(logs.phases).forEach(([name, data]) => {
        const start = data.started_at || data.entries?.[0]?.timestamp;
        const end = data.completed_at || data.entries?.slice(-1)[0]?.timestamp;
        if (start) {
          if (!earliest || new Date(start) < new Date(earliest)) earliest = start;
          if (end && (!latest || new Date(end) > new Date(latest))) latest = end;
          phases.push({ name, start, end, status: data.status });
        }
      });
    }
    if (!earliest) {
      // Use plan created_at as fallback
      earliest = spec.plan?.created_at || spec.plan?.updated_at;
      latest = spec.plan?.updated_at;
    }
    if (earliest) rows.push({ spec, earliest, latest, phases });
  });

  if (!rows.length) {
    wrap.innerHTML = '<div class="no-data"><i class="fa-solid fa-timeline"></i><h3>No timeline data</h3><p>Specs need <code>started_at</code> / <code>completed_at</code> in task_logs.json to appear here.</p></div>';
    return;
  }

  // Compute time range
  const now = new Date();
  let minD = rangeDays > 0 ? new Date(now - rangeDays * 86400000) : new Date(Math.min(...rows.map(r => new Date(r.earliest))));
  let maxD = now;
  const totalMs = maxD - minD;

  function pct(d) { return Math.max(0, Math.min(100, (new Date(d) - minD) / totalMs * 100)); }

  const STATUS_COLORS = {
    planning: 'var(--col-planning)', coding: 'var(--col-progress)', validation: 'var(--col-done)',
    review: 'var(--col-ai-review)', completed: 'var(--col-done)', default: 'var(--accent)'
  };

  // Axis ticks (6)
  const ticks = [];
  for (let i = 0; i <= 5; i++) {
    const d = new Date(minD.getTime() + (totalMs * i / 5));
    ticks.push(d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
  }

  const todayPct = pct(now);
  const axisHtml = `<div class="tl-axis" style="position:relative;margin-left:212px;margin-bottom:8px">
    ${ticks.map((t, i) => `<div class="tl-tick" style="position:absolute;left:${i * 20}%;transform:translateX(-50%)">${t}</div>`).join('')}
    <div style="height:18px"></div>
  </div>`;

  const rowsHtml = rows.sort((a, b) => new Date(a.earliest) - new Date(b.earliest)).map(r => {
    const phaseBars = r.phases.length
      ? r.phases.filter(p => p.start).map(p => {
        const s = pct(p.start), e = p.end ? pct(p.end) : Math.min(pct(new Date()), 100);
        const w = Math.max(e - s, 0.5);
        const col = STATUS_COLORS[p.name] || STATUS_COLORS.default;
        return `<div class="tl-bar" style="left:${s}%;width:${w}%;background:${col};opacity:.8" title="${p.name}: ${formatDate(p.start)}${p.end ? ' â†’ ' + formatDate(p.end) : 'â€¦'}">${w > 8 ? p.name : ''}</div>`;
      }).join('')
      : (() => {
        const s = pct(r.earliest), e = r.latest ? pct(r.latest) : pct(new Date());
        const w = Math.max(e - s, 0.5);
        const col = STATUS_COLORS[normalizeStatus(r.spec)] || STATUS_COLORS.default;
        return `<div class="tl-bar" style="left:${s}%;width:${w}%;background:${col};opacity:.8" title="${r.spec.id}">${w > 8 ? (r.spec.plan?.feature || r.spec.id) : ''}</div>`;
      })();

    return `<div class="tl-row">
      <div class="tl-label">
        <div class="tl-name" onclick="openModal(getSpecById('${r.spec.id}'))">${escHtml(r.spec.plan?.feature || r.spec.id)}</div>
        <div class="tl-id">${r.spec.id.split('-').slice(0, 1).join('-')}</div>
      </div>
      <div class="tl-track">
        ${phaseBars}
        <div class="tl-today" style="left:${todayPct}%"></div>
      </div>
    </div>`;
  }).join('');

  wrap.innerHTML = axisHtml + rowsHtml;
}

function getSpecById(id) { return allSpecs.find(s => s.id === id); }

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  STATS DASHBOARD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function renderStats() {
  const dash = document.getElementById('statsDash');
  if (!allSpecs.length) {
    dash.innerHTML = '<div class="no-data"><i class="fa-solid fa-chart-pie"></i><h3>No data</h3><p>Load a project to see statistics.</p></div>';
    return;
  }

  const total = allSpecs.length;
  const bySt = {};
  COLUMNS.forEach(c => bySt[c.key] = 0);
  allSpecs.forEach(s => bySt[normalizeStatus(s)]++);

  const byPri = { high: 0, medium: 0, low: 0, other: 0 };
  allSpecs.forEach(s => { const p = s.meta?.priority?.toLowerCase(); byPri[byPri[p] !== undefined ? p : 'other']++; });

  const byCat = {};
  allSpecs.forEach(s => { const c = s.meta?.category || 'other'; byCat[c] = (byCat[c] || 0) + 1; });

  // Progress: subtasks
  let totalSubs = 0, doneSubs = 0;
  allSpecs.forEach(s => {
    (s.plan?.phases || []).forEach(p => {
      totalSubs += (p.subtasks || []).length;
      doneSubs += (p.subtasks || []).filter(t => t.status === 'done').length;
    });
  });
  const progress = totalSubs ? Math.round(doneSubs / totalSubs * 100) : 0;

  // Velocity (done per week, last 8 weeks)
  const weeks = [];
  for (let i = 7; i >= 0; i--) {
    const from = new Date(); from.setDate(from.getDate() - i * 7 - 7);
    const to = new Date(); to.setDate(to.getDate() - i * 7);
    const cnt = allSpecs.filter(s => {
      const d = getCreated(s);
      return d >= from && d < to && normalizeStatus(s) === 'done';
    }).length;
    weeks.push({ label: `W-${i + 1}`, cnt });
  }
  const maxW = Math.max(...weeks.map(w => w.cnt), 1);

  // Complexity breakdown
  const byCx = { high: 0, medium: 0, low: 0 };
  allSpecs.forEach(s => { const c = s.meta?.complexity?.toLowerCase(); if (byCx[c] !== undefined) byCx[c]++; });

  const STATUS_COLORS_HEX = {
    planning: '#38bdf8', queue: '#a78bfa', 'in-progress': '#fbbf24', 'ai-review': '#f97316', 'human-review': '#f472b6', done: '#34d399'
  };

  // SVG donut
  const donutParts = COLUMNS.map(c => ({ key: c.key, val: bySt[c.key], col: STATUS_COLORS_HEX[c.key] })).filter(p => p.val > 0);
  let donutSvg = `<svg viewBox="0 0 36 36" width="80" height="80" style="transform:rotate(-90deg)">`;
  let cumulative = 0;
  const donutTotal = donutParts.reduce((a, p) => a + p.val, 0) || 1;
  donutParts.forEach(p => {
    const pct = p.val / donutTotal * 100;
    donutSvg += `<circle cx="18" cy="18" r="15.9" fill="none" stroke="${p.col}" stroke-width="4" stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="${-cumulative}" style="transition:stroke-dasharray .4s"/>`;
    cumulative += pct;
  });
  donutSvg += `<text x="18" y="18" text-anchor="middle" dominant-baseline="middle" font-size="7" fill="#e8eaf2" style="transform:rotate(90deg);transform-origin:50% 50%">${total}</text></svg>`;

  // â”€â”€ Project Maturity Summary â”€â”€
  const statusCols = [
    { key: 'planning', label: 'Planning', color: 'var(--col-planning)', hex: '#38bdf8' },
    { key: 'queue', label: 'Queue', color: 'var(--col-queue)', hex: '#a78bfa' },
    { key: 'in-progress', label: 'In Progress', color: 'var(--col-progress)', hex: '#fbbf24' },
    { key: 'ai-review', label: 'AI Review', color: 'var(--col-ai-review)', hex: '#f97316' },
    { key: 'human-review', label: 'Human Review', color: 'var(--col-human-review)', hex: '#f472b6' },
    { key: 'done', label: 'Done', color: 'var(--col-done)', hex: '#34d399' },
  ];
  const doneRate = total ? Math.round(bySt.done / total * 100) : 0;

  const maturityHtml = `
  <div class="maturity-section">
    <div class="maturity-header">
      <i class="fa-solid fa-seedling"></i>
      <span>Project Maturity</span>
      <span class="maturity-rate">${doneRate}% complete</span>
    </div>

    <div class="maturity-status-row">
      ${statusCols.map(s => `
        <div class="maturity-badge" onclick="switchView('kanban');toggleStatusFilter('${s.key}')" title="Filter: ${s.label}">
          <div class="maturity-badge-dot" style="background:${s.color}"></div>
          <div class="maturity-badge-label">${s.label}</div>
          <div class="maturity-badge-num" style="color:${s.color}">${bySt[s.key] || 0}</div>
        </div>`).join('')}
    </div>

    <div class="maturity-progress-wrap">
      <div class="maturity-progress-labels">
        <span><i class="fa-solid fa-list-check" style="font-size:9px;margin-right:4px;color:var(--accent2)"></i>Subtask Progress</span>
        <span class="maturity-progress-pct">${doneSubs}/${totalSubs} subtasks Â· <strong style="color:var(--accent2)">${progress}%</strong></span>
      </div>
      <div class="maturity-progress-bar">
        <div class="maturity-progress-fill" style="width:${progress}%"></div>
      </div>
    </div>
  </div>`;

  dash.innerHTML = maturityHtml + `
  <div class="dash-grid">
    <div class="dash-card">
      <h4>Total Specs</h4>
      <div class="dash-big-num">${total}</div>
      <div class="dash-sub">${Object.keys(specsByProject).length} project${Object.keys(specsByProject).length !== 1 ? 's' : ''}</div>
    </div>
    <div class="dash-card">
      <h4>Completion Rate</h4>
      <div class="dash-big-num" style="color:var(--col-done)">${total ? Math.round(bySt.done / total * 100) : 0}<span style="font-size:16px;font-weight:400">%</span></div>
      <div class="dash-sub">${bySt.done} of ${total} done</div>
    </div>
    <div class="dash-card">
      <h4>Subtask Progress</h4>
      <div class="dash-big-num" style="color:var(--accent2)">${progress}<span style="font-size:16px;font-weight:400">%</span></div>
      <div class="dash-sub">${doneSubs}/${totalSubs} subtasks</div>
      <div class="dash-bar" style="margin-top:10px"><div class="dash-bar-fill" style="width:${progress}%;background:var(--accent)"></div></div>
    </div>
    <div class="dash-card">
      <h4>By Status</h4>
      <div class="donut-wrap">
        ${donutSvg}
        <div class="donut-legend">
          ${COLUMNS.filter(c => bySt[c.key] > 0).map(c => `
            <div class="donut-legend-item">
              <div class="donut-legend-dot" style="background:${STATUS_COLORS_HEX[c.key]}"></div>
              <span>${c.label}</span>
              <span style="margin-left:auto;font-family:'DM Mono',monospace;font-size:10px">${bySt[c.key]}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="dash-card">
      <h4>By Priority</h4>
      ${[['high', 'var(--red)'], ['medium', 'var(--yellow)'], ['low', 'var(--green)'], ['other', 'var(--text3)']].map(([k, c]) => `
        <div class="dash-row">
          <div class="dash-row-label"><i class="fa-solid fa-circle" style="color:${c};font-size:8px;margin-right:5px"></i>${k}</div>
          <div class="dash-row-val">${byPri[k]}</div>
        </div>
        <div class="dash-bar"><div class="dash-bar-fill" style="width:${total ? byPri[k] / total * 100 : 0}%;background:${c}"></div></div>
      `).join('')}
    </div>
    <div class="dash-card">
      <h4>By Category</h4>
      ${Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `
        <div class="dash-row">
          <div class="dash-row-label">${k}</div>
          <div class="dash-row-val">${v}</div>
        </div>
        <div class="dash-bar"><div class="dash-bar-fill" style="width:${v / total * 100}%;background:var(--accent)"></div></div>
      `).join('')}
    </div>
    <div class="dash-card" style="grid-column:1/-1">
      <h4>Velocity â€” Done per week (last 8 weeks)</h4>
      <div style="display:flex;gap:12px;align-items:flex-end;margin-top:8px">
        <div class="velocity-bars">
          ${weeks.map(w => `<div class="vel-bar" style="height:${w.cnt / maxW * 100}%" title="${w.label}: ${w.cnt}"></div>`).join('')}
        </div>
        <div style="flex:1">
          <div class="vel-labels" style="display:flex;gap:4px">
            ${weeks.map(w => `<div class="vel-label">${w.label}</div>`).join('')}
          </div>
          <div style="font-size:10px;color:var(--text3);margin-top:4px">Based on spec created_at date (requires proper timestamps)</div>
        </div>
      </div>
    </div>
    <div class="dash-card">
      <h4>Complexity</h4>
      ${[['high', 'var(--red)'], ['medium', 'var(--yellow)'], ['low', 'var(--green)']].map(([k, c]) => `
        <div class="dash-row">
          <div class="dash-row-label">${k}</div>
          <div class="dash-row-val">${byCx[k]}</div>
        </div>
        <div class="dash-bar"><div class="dash-bar-fill" style="width:${total ? byCx[k] / total * 100 : 0}%;background:${c}"></div></div>
      `).join('')}
    </div>
    <div class="dash-card">
      <h4>Active Work</h4>
      <div class="dash-big-num" style="color:var(--col-progress)">${bySt['in-progress']}</div>
      <div class="dash-sub">In progress</div>
      <div style="margin-top:8px">
        <div class="dash-row"><div class="dash-row-label">Queue</div><div class="dash-row-val">${bySt.queue}</div></div>
        <div class="dash-row"><div class="dash-row-label">AI Review</div><div class="dash-row-val">${bySt['ai-review']}</div></div>
        <div class="dash-row"><div class="dash-row-label">Human Review</div><div class="dash-row-val">${bySt['human-review']}</div></div>
      </div>
    </div>
  </div>`;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  GLOBAL SEARCH
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let searchDebounce;
function runGlobalSearch() {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(_doSearch, 250);
}

function _doSearch() {
  const q = (document.getElementById('globalSearch')?.value || '').trim();
  const container = document.getElementById('searchResults');
  const countEl = document.getElementById('globalResultCount');

  if (!q || q.length < 2) {
    container.innerHTML = '<div class="search-hint"><i class="fa-solid fa-magnifying-glass-chart"></i><p>Type to search across all specs, plans, and documents</p></div>';
    countEl.textContent = '';
    return;
  }

  const ql = q.toLowerCase();
  const results = [];

  allSpecs.forEach(spec => {
    const searchable = [
      { field: 'title', text: spec.plan?.feature || spec.id },
      { field: 'id', text: spec.id },
      { field: 'description', text: spec.plan?.description },
      { field: 'spec.md', text: spec.specMd },
      { field: 'plan.md', text: spec.planMd },
      { field: 'plan', text: JSON.stringify(spec.plan) },
      { field: 'requirements', text: spec.requirements ? JSON.stringify(spec.requirements) : null },
    ];

    let score = 0, excerpt = '', matchField = '';
    for (const { field, text } of searchable) {
      if (!text) continue;
      const tl = text.toLowerCase();
      const idx = tl.indexOf(ql);
      if (idx >= 0) {
        score += field === 'title' ? 10 : field === 'id' ? 8 : field === 'description' ? 5 : field === 'requirements' ? 3 : 2;
        if (!excerpt) {
          const start = Math.max(0, idx - 60), end = Math.min(text.length, idx + 120);
          excerpt = (start > 0 ? 'â€¦' : '') + escHtml(text.slice(start, end)).replace(new RegExp(escHtml(q), 'gi'), m => `<mark>${m}</mark>`) + (end < text.length ? 'â€¦' : '');
          matchField = field;
        }
      }
    }
    if (score > 0) results.push({ spec, score, excerpt, matchField });
  });

  results.sort((a, b) => b.score - a.score);
  countEl.textContent = results.length ? `${results.length} result${results.length !== 1 ? 's' : ''}` : '';

  if (!results.length) {
    container.innerHTML = `<div class="search-hint"><i class="fa-solid fa-face-frown-open"></i><p>No results for <strong>"${escHtml(q)}"</strong></p></div>`;
    return;
  }

  const status_icons = { planning: 'fa-compass', queue: 'fa-clock', 'in-progress': 'fa-code', 'ai-review': 'fa-robot', 'human-review': 'fa-user-check', done: 'fa-circle-check' };
  container.innerHTML = results.map(r => {
    const st = normalizeStatus(r.spec);
    const meta = r.spec.meta || {};
    const title = r.spec.plan?.feature || r.spec.id;
    const hilite = escHtml(title).replace(new RegExp(escHtml(q), 'gi'), m => `<mark>${m}</mark>`);
    return `<div class="search-result-item" onclick="openModal(getSpecById('${r.spec.id}'))">
      <div class="sri-icon"><i class="fa-solid ${status_icons[st] || 'fa-file'}" style="color:var(--col-${st === 'in-progress' ? 'progress' : st === 'ai-review' ? 'ai-review' : st})"></i></div>
      <div class="sri-body">
        <div class="sri-title">${hilite}</div>
        <div class="sri-path">${r.spec.id} Â· matched in ${r.matchField}</div>
        ${r.excerpt ? `<div class="sri-excerpt">${r.excerpt}</div>` : ''}
        <div class="sri-tags">
          <span class="status-pill ${st}">${st}</span>
          ${meta.priority ? `<span class="tag tag-priority-${meta.priority}">${meta.priority}</span>` : ''}
          ${meta.category ? `<span class="tag tag-category">${meta.category}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MODAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function openModal(spec) {
  if (!spec) return;
  currentSpec = spec;
  const plan = spec.plan || {}, meta = spec.meta || {};
  document.getElementById('modalId').textContent = spec.id;
  document.getElementById('modalTitle').textContent = plan.feature || spec.id;

  const tags = [];
  if (meta.priority) tags.push(`<span class="tag tag-priority-${meta.priority}"><i class="fa-solid fa-flag"></i> ${meta.priority}</span>`);
  if (meta.category) tags.push(`<span class="tag tag-category"><i class="fa-solid fa-tag"></i> ${meta.category}</span>`);
  const complexity = String(spec.complexity?.complexity || spec.complexity?.level || plan.complexity_assessment?.level || meta.complexity || '').trim() || undefined;
  if (complexity) tags.push(`<span class="tag tag-complexity"><i class="fa-solid fa-chart-bar"></i> ${complexity}</span>`);
  if (meta.impact) tags.push(`<span class="tag" style="background:rgba(248,113,113,.12);color:var(--red)"><i class="fa-solid fa-bolt"></i> ${meta.impact} impact</span>`);
  document.getElementById('modalTags').innerHTML = tags.join('');

  const status = normalizeStatus(spec);
  const phases = plan.phases || [];
  const getTasks = (p) => p.tasks || p.subtasks || [];
  const isCompleted = (s) => s.status === 'completed' || s.status === 'done';
  const totalSubs = phases.reduce((a, p) => a + getTasks(p).length, 0);
  const doneSubs = phases.reduce((a, p) => a + getTasks(p).filter(s => isCompleted(s)).length, 0);
  const progress = totalSubs ? Math.round(doneSubs / totalSubs * 100) : 0;

  // Copy Command buttons in modal header
  const modalHeader = document.querySelector('.modal-header');
  modalHeader?.querySelectorAll('.cmd-copy-btn').forEach(b => b.remove());

  if (modalHeader) {
    let commandsToCopy = [];

    if (status === 'done') {
      // No commands for done
    } else if (status === 'planning' || status === 'queue') {
      commandsToCopy = [
        { cmd: `/01-Task ${spec.id}`, label: '01-Task', title: `Copy /01-Task (Initialize Spec)`, icon: 'fa-file-circle-plus' },
        { cmd: `/02-Plan ${spec.id}`, label: '02-Plan', title: `Copy /02-Plan (Create Plan)`, icon: 'fa-map' }
      ];
    } else if (status === 'human-review') {
      commandsToCopy = [
        { cmd: `/10-Human Approve ${spec.id}`, label: 'Approve', title: `Copy /10-Human Approve`, icon: 'fa-check-double' },
        { cmd: `/10-Human Feedback ${spec.id} "à¹à¸à¹‰à¹„à¸‚à¸ªà¹ˆà¸§à¸™à¸™à¸µà¹‰à¸«à¸™à¹ˆà¸­à¸¢..."`, label: 'Feedback', title: `Copy /10-Human Feedback`, icon: 'fa-comment-dots' }
      ];
    } else if (status === 'ai-review' || (status === 'in-progress' && progress === 100)) {
      commandsToCopy = [
        { cmd: `/04-Verify ${spec.id}`, label: '04-Verify', title: `Copy /04-Verify (Run QA)`, icon: 'fa-shield-halved' }
      ];
    } else {
      commandsToCopy = [
        { cmd: `/03-Code ${spec.id}`, label: '03-Code', title: `Copy /03-Code (Implementation)`, icon: 'fa-code' }
      ];
    }

    const closeBtn = modalHeader.querySelector('.modal-close');
    commandsToCopy.forEach(({ cmd, label, title, icon }) => {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'cmd-copy-btn';
      copyBtn.title = title;
      copyBtn.innerHTML = `<i class="fa-solid ${icon}" style="font-size:10px"></i> Copy ${label}`;
      copyBtn.onclick = () => copyText(cmd);
      if (closeBtn) modalHeader.insertBefore(copyBtn, closeBtn);
      else modalHeader.appendChild(copyBtn);
    });
  }

  document.getElementById('tab-overview').innerHTML = `
    <!-- 1. Progress (1 row) -->
    ${totalSubs > 0 ? `
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px">
        <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text3)">Progress</span>
        <span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text2)">${doneSubs}/${totalSubs}</span>
      </div>
      <div style="height:5px;border-radius:3px;background:var(--border);overflow:hidden">
        <div style="height:100%;border-radius:3px;background:linear-gradient(90deg,var(--accent),var(--col-done));width:${progress}%;transition:width .5s"></div>
      </div>
    </div>` : ''}

    <!-- 2. Status & Complexity (3 columns) -->
    <div class="overview-grid cols-3">
      <div class="overview-item"><label>Status</label><value><span class="status-pill ${status}">${status}</span></value></div>
      <div class="overview-item"><label>Detailed Status</label><value><span style="font-family:'DM Mono',monospace; font-size:11px; color:var(--text2)">${plan.planStatus || 'â€”'}</span></value></div>
      <div class="overview-item">
        <label>Complexity</label>
        <value>
          <span style="
            text-transform: uppercase; 
            font-weight: 700; 
            font-size: 11px;
            color: ${complexity && String(complexity).toLowerCase() === 'complex' ? 'var(--red)' : complexity && String(complexity).toLowerCase() === 'standard' ? 'var(--yellow)' : 'var(--blue)'}
          ">
            ${complexity || 'â€”'}
          </span>
        </value>
      </div>
      
      <!-- 3. Approach (1 row - Spans all 3 columns) -->
      <div class="overview-item" style="grid-column: span 3">
        <label>Approach</label>
        <value style="display:block; line-height:1.6; color:var(--text2); font-size:12px; padding-top:4px">${spec.complexity?.reasoning || plan.complexity_assessment?.approach || 'â€”'}</value>
      </div>
    </div>

    ${meta.external_ref_id ? `
    <div class="ext-ref-wrap">
      <i class="fa-solid fa-link" style="font-size:10px;color:var(--text3)"></i>
      <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3)">External Ref</span>
      <a class="ext-ref-link" href="#" onclick="event.preventDefault();copyText('${escHtml(meta.external_ref_id)}')" title="Click to copy ID: ${escHtml(meta.external_ref_id)}">
        <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:8px"></i>
        ${escHtml(meta.external_ref_id)}
      </a>
    </div>` : ''}

    ${plan.description ? `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-top:12px;margin-bottom:12px;font-size:12px;color:var(--text2);line-height:1.6">${escHtml(plan.description)}</div>` : ''}

    <!-- 4. Requirements Summary (1 row) -->
    ${spec.requirements ? `
      <div style="margin-top:15px;margin-bottom:15px">
        <label style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:8px">Requirements Summary</label>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:12px;font-size:12px;color:var(--text2)">
          <div style="font-weight:700;margin-bottom:5px;color:var(--text)">${escHtml(spec.requirements.task_description || '')}</div>
          <ul style="padding-left:18px;margin-top:8px;color:var(--text2)">
            ${(spec.requirements.acceptance_criteria || []).map(ac => `<li>${escHtml(ac)}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : ''}

    ${(plan.final_acceptance || []).length ? `
      <div style="margin-top:15px">
        <label style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:8px">Final Acceptance</label>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
          ${plan.final_acceptance.map(item => `
            <div style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:12px;color:var(--text2);display:flex;align-items:center;gap:10px">
              <i class="fa-solid fa-circle-check" style="color:var(--green);font-size:10px"></i>
              <span>${escHtml(item)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- 5. Strategic Tip (Footer) -->
    <div style="margin-top:20px; padding:12px; background:rgba(56,189,248,0.05); border:1px dashed var(--accent); border-radius:var(--r); display:flex; gap:12px; align-items:flex-start">
      <i class="fa-solid fa-lightbulb" style="color:var(--accent); margin-top:3px"></i>
      <div style="font-size:11px; line-height:1.5; color:var(--text2)">
        <strong style="color:var(--accent); text-transform:uppercase; font-size:10px; letter-spacing:0.5px; display:block; margin-bottom:4px">ðŸ’¡ Discovery Tip</strong>
        à¸›à¸£à¸°à¹€à¸¡à¸´à¸™à¸„à¸§à¸²à¸¡à¸‹à¸±à¸šà¸‹à¹‰à¸­à¸™ (Complexity) à¸£à¹ˆà¸§à¸¡à¸à¸±à¸š AI: à¸«à¸²à¸ AI à¸§à¸´à¹€à¸„à¸£à¸²à¸°à¸«à¹Œà¸§à¹ˆà¸² <strong>COMPLEX</strong> à¹à¸•à¹ˆà¸—à¹ˆà¸²à¸™à¸¡à¸­à¸‡à¸§à¹ˆà¸² <strong>SIMPLE</strong> (à¸«à¸£à¸·à¸­à¸à¸¥à¸±à¸šà¸à¸±à¸™) 
        à¹‚à¸›à¸£à¸”à¸«à¸¢à¸¸à¸”à¹à¸¥à¸° <strong>Discuss Spec</strong> à¹€à¸žà¸·à¹ˆà¸­à¸›à¸£à¸±à¸šà¸ˆà¸¹à¸™à¸„à¸§à¸²à¸¡à¹€à¸‚à¹‰à¸²à¹ƒà¸ˆà¹à¸¥à¸°à¸‚à¸­à¸šà¹€à¸‚à¸•à¸‡à¸²à¸™à¹ƒà¸«à¹‰à¸•à¸£à¸‡à¸à¸±à¸™à¸à¹ˆà¸­à¸™à¹€à¸£à¸´à¹ˆà¸¡à¸¥à¸‡à¸¡à¸·à¸”à¸—à¸³à¹à¸œà¸™à¸‡à¸²à¸™ (Planning) à¸•à¹ˆà¸­à¹„à¸›
      </div>
    </div>
    
    <!-- Action Panel (Queue/Archive) -->
    ${['planning', 'in-progress', 'ai-review', 'human-review'].includes(status) ? `
      <div style="margin-top:20px; padding:16px; background:rgba(167, 139, 250, 0.05); border:1px dashed var(--col-queue); border-radius:var(--r); display:flex; align-items:center; justify-content:space-between">
          <div>
              <div style="font-weight:700; color:var(--text); margin-bottom:4px">Move back to Queue?</div>
              <div style="font-size:11px; color:var(--text3)">Pause this task or prepare it to run again later by sending it to the queue.</div>
          </div>
          <button class="btn btn-secondary" style="border-color:var(--col-queue); color:var(--col-queue)" onclick="updateTaskStatus('${spec.id}', 'queue')">
              <i class="fa-solid fa-clock-rotate-left"></i> Move to Queue
          </button>
      </div>` : ''}

    ${status === 'done' ? `
      <div style="margin-top:20px; padding:16px; background:var(--bg3); border:1px solid var(--border); border-radius:var(--r); display:flex; align-items:center; justify-content:space-between">
          <div>
              <div style="font-weight:700; color:var(--text); margin-bottom:4px">Task Completed</div>
              <div style="font-size:11px; color:var(--text3)">Implementation is finished. You can archive this task to hide it from the board.</div>
          </div>
          <button class="btn btn-secondary" onclick="updateTaskStatus('${spec.id}', 'archived')">
              <i class="fa-solid fa-box-archive"></i> Archive Task
          </button>
      </div>` : ''}`;

  document.getElementById('tab-plan').innerHTML = phases.length ? phases.map(p => `
    <div class="phase-section">
      <div class="phase-header"><i class="fa-solid fa-layer-group" style="color:var(--accent2);font-size:11px"></i><div class="phase-name">${escHtml(p.phase_name || p.name)}</div></div>
      ${p.description ? `<div class="phase-desc">${escHtml(p.description)}</div>` : ''}
      <div class="subtask-list">
        ${getTasks(p).map(s => `
          <div class="subtask">
            <div class="subtask-check ${isCompleted(s) ? 'done' : 'pending'}">${isCompleted(s) ? '<i class="fa-solid fa-check" style="font-size:7px"></i>' : ''}</div>
            <div class="subtask-info">
              <div style="display:flex;align-items:center;gap:6px">
                <span class="subtask-id">#${s.task_id || s.id}</span>
                ${s.title ? `<span style="font-weight:700;color:var(--text);margin-right:5px">${escHtml(s.title)}</span>` : ''}
                <span class="subtask-desc">${escHtml(typeof s.description === 'object' ? JSON.stringify(s.description) : (s.description || ''))}</span>
              </div>
              ${(s.files_to_modify || s.files || []).length || (s.new_files || []).length ? `
                <div class="subtask-files">
                  ${(s.files_to_modify || s.files || []).map(f => `<span class="file-tag"><i class="fa-solid fa-file-code" style="font-size:8px"></i> ${escHtml(typeof f === 'string' ? f : (f.path || f.name || JSON.stringify(f)))}</span>`).join('')}
                  ${(s.new_files || []).map(f => `<span class="file-tag" style="border-color:rgba(52,211,153,.3);color:var(--green)"><i class="fa-solid fa-plus" style="font-size:8px"></i> ${escHtml(typeof f === 'string' ? f : (f.path || f.name || JSON.stringify(f)))}</span>`).join('')}
                </div>` : ''}
              ${s.verification && s.verification !== '-' ? (() => {
      const v = s.verification;
      if (typeof v === 'string') return `<div style="font-size:12px;color:var(--text3);margin-top:3px"><i class="fa-solid fa-circle-check" style="color:var(--green);font-size:8px"></i> ${escHtml(v)}</div>`;
      if (typeof v === 'object') {
        const cmd = v.command || v.run || '';
        const exp = v.expected || '';
        return `<div style="font-size:12px;color:var(--text3);margin-top:3px">
                    <i class="fa-solid fa-circle-check" style="color:var(--green);font-size:8px"></i>
                    <strong>${escHtml(v.type || 'verify')}</strong>${cmd ? ': ' + escHtml(cmd) : ''}
                    ${exp ? `<div style="margin-top:2px;padding-left:14px;color:var(--text3)">â†’ ${escHtml(exp)}</div>` : ''}
                  </div>`;
      }
      return '';
    })() : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>`).join('') : '<div class="empty-state"><i class="fa-solid fa-scroll"></i><p>No plan data</p></div>';

  switchModalTab('overview');

  document.getElementById('tab-spec').innerHTML = spec.specMd
    ? `<div class="md-content">${marked.parse(spec.specMd)}</div>`
    : '<div class="empty-state"><i class="fa-solid fa-file-lines"></i><p>No spec.md found</p></div>';

  const logs = spec.logs;
  const logTab = document.getElementById('tab-logs');

  // â”€â”€ Shared Vertical Stepper renderer â”€â”€
  function buildStepper(steps) {
    // steps = [{key, icon, iconCls, status, duration, entries, isLast}]
    if (!steps.length) {
      logTab.innerHTML = '<div class="empty-state"><i class="fa-solid fa-terminal"></i><p>No task logs</p></div>';
      return;
    }
    logTab.innerHTML = `<div class="stepper">${steps.map((step, idx) => {
      const stCls = step.status === 'completed' ? 'completed'
        : step.status === 'in-progress' ? 'in-progress' : 'pending';
      const nodeIcon = step.status === 'completed'
        ? 'fa-check' : step.status === 'in-progress'
          ? 'fa-spinner fa-spin' : step.icon;
      const entriesHtml = step.entries.map(e => {
        const eIcon = e.type === 'error' ? 'fa-triangle-exclamation'
          : e.type === 'warning' ? 'fa-circle-exclamation' : 'fa-circle-dot';
        const eColor = e.type === 'error' ? 'var(--red)'
          : e.type === 'warning' ? 'var(--yellow)' : 'var(--text3)';
        return `<div class="stepper-entry">
          <div class="stepper-entry-dot" style="color:${eColor}"><i class="fa-solid ${eIcon}"></i></div>
          <div class="stepper-entry-body">
            <div class="log-time">${formatDate(e.timestamp)}</div>
            <div class="log-text">${e.action ? `<strong>${escHtml(e.action)}</strong>: ` : ''}${escHtml(e.content || e.details || '')}</div>
          </div>
        </div>`;
      }).join('');
      return `<div class="stepper-step ${step.isLast ? 'last' : ''}">
        <div class="stepper-left">
          <div class="stepper-node ${stCls}"><i class="fa-solid ${nodeIcon}"></i></div>
          ${!step.isLast ? '<div class="stepper-line"></div>' : ''}
        </div>
        <div class="stepper-content">
          <div class="stepper-hdr" onclick="this.closest('.stepper-step').classList.toggle('expanded')">
            <div class="stepper-phase-name">${step.key}</div>
            <div class="stepper-meta">
              ${step.duration ? `<span class="stepper-dur"><i class="fa-solid fa-clock" style="font-size:8px"></i> ${step.duration}</span>` : ''}
              <span class="stepper-entry-count">${step.entries.length} ${step.entries.length === 1 ? 'entry' : 'entries'}</span>
              <span class="stepper-badge ${stCls}">${step.status || 'pending'}</span>
              <i class="fa-solid fa-chevron-down stepper-chev"></i>
            </div>
          </div>
          ${step.entries.length ? `<div class="stepper-entries">${entriesHtml}</div>` : ''}
        </div>
      </div>`;
    }).join('')}</div>`;
  }

  if (logs) {
    if (logs.phases) {
      // Structure 006: phases object {[phaseName]: {entries, started_at, completed_at, status}}
      const PHASE_ICONS = { planning: 'fa-compass', coding: 'fa-code', validation: 'fa-flask-vial', review: 'fa-magnifying-glass' };
      const phaseKeys = Object.keys(logs.phases);
      const steps = phaseKeys.map((key, i) => {
        const data = logs.phases[key];
        const entries = (data.entries || []).map(e => ({ ...e }));
        const dur = data.started_at && data.completed_at ? getDuration(data.started_at, data.completed_at) : null;
        const stCls = data.status === 'completed' ? 'completed' : data.status === 'in-progress' ? 'in-progress' : 'pending';
        return {
          key,
          icon: PHASE_ICONS[key] || 'fa-circle-dot',
          iconCls: ['planning', 'coding', 'validation', 'review'].includes(key) ? key : 'default',
          status: data.status || 'pending',
          duration: dur,
          entries,
          isLast: i === phaseKeys.length - 1,
        };
      });
      buildStepper(steps);

    } else if (logs.logs && Array.isArray(logs.logs)) {
      // Structure 999: flat logs array grouped by phase
      const groups = {};
      logs.logs.forEach(log => {
        const p = log.phase || 'info';
        if (!groups[p]) groups[p] = [];
        groups[p].push(log);
      });
      const order = ['initialization', 'planning', 'coding', 'validation', 'deployment'];
      const sortedPhases = Object.keys(groups).sort((a, b) => {
        const idxA = order.indexOf(a.toLowerCase()), idxB = order.indexOf(b.toLowerCase());
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1; if (idxB !== -1) return 1;
        return a.localeCompare(b);
      });
      const steps = sortedPhases.map((phase, i) => {
        const sorted = [...groups[phase]].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const first = new Date(sorted[0].timestamp), last = new Date(sorted[sorted.length - 1].timestamp);
        const diffMin = Math.round((last - first) / 60000);
        const dur = diffMin > 0 ? `${diffMin}m` : '< 1m';
        const latest = sorted[sorted.length - 1];
        const st = latest.status === 'completed' || latest.status === 'done' ? 'completed' : 'in-progress';
        return {
          key: phase,
          icon: 'fa-terminal',
          status: st,
          duration: dur,
          entries: sorted.map(e => ({ ...e, content: e.details, action: e.action })),
          isLast: i === sortedPhases.length - 1,
        };
      });
      buildStepper(steps);

    } else if (logs.planning || logs.coding || logs.validation) {
      // Standard PRP Structure: {planning: {...}, coding: {...}, validation: {...}}
      const standardPhases = ['planning', 'coding', 'validation', 'deployment'];
      const PHASE_ICONS = { planning: 'fa-compass', coding: 'fa-code', validation: 'fa-flask-vial', review: 'fa-magnifying-glass' };

      const steps = standardPhases
        .filter(key => logs[key])
        .map((key, i, arr) => {
          const data = logs[key];
          const entries = (data.logs || []).map(logLine => ({
            timestamp: data.completed_at || data.started_at || new Date().toISOString(),
            content: logLine,
            type: 'info'
          }));
          const dur = data.started_at && data.completed_at ? getDuration(data.started_at, data.completed_at) : null;
          const stCls = data.status === 'completed' ? 'completed' : data.status === 'active' || data.status === 'in-progress' ? 'in-progress' : 'pending';

          return {
            key: key.charAt(0).toUpperCase() + key.slice(1),
            icon: PHASE_ICONS[key] || 'fa-circle-dot',
            status: data.status || 'pending',
            duration: dur,
            entries,
            isLast: i === arr.length - 1,
          };
        });
      buildStepper(steps);
    } else {
      logTab.innerHTML = '<div class="empty-state"><i class="fa-solid fa-terminal"></i><p>Log format not recognized (Expected logs.phases, logs.logs, or standard PRP structure)</p></div>';
    }
  } else {
    logTab.innerHTML = '<div class="empty-state"><i class="fa-solid fa-terminal"></i><p>No task logs</p></div>';
  }

  renderQATab(spec);
  buildFilesTab(spec);

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelector('.tab-btn').classList.add('active');
  document.getElementById('tab-overview').classList.add('active');
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal(event) {
  if (event && event.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('show');
}

function switchModalTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', ['overview', 'spec', 'plan', 'logs', 'qa', 'files'][i] === tab));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
}

function toggleLogPhase(hdr) {
  const body = hdr.nextElementSibling;
  hdr.classList.toggle('collapsed');
  body.style.display = hdr.classList.contains('collapsed') ? 'none' : '';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  FILES TAB
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const FILE_ICONS = {
  '.json': { icon: 'fa-file-code', color: '#fbbf24' },
  '.md': { icon: 'fa-file-lines', color: '#38bdf8' },
  '.ts': { icon: 'fa-code', color: '#60a5fa' },
  '.tsx': { icon: 'fa-code', color: '#818cf8' },
  '.js': { icon: 'fa-square-js', color: '#fbbf24' },
  '.jsx': { icon: 'fa-code', color: '#fb923c' },
  '.txt': { icon: 'fa-file-lines', color: '#9ca3af' },
  '.yaml': { icon: 'fa-file-code', color: '#a78bfa' },
  '.yml': { icon: 'fa-file-code', color: '#a78bfa' },
  '.env': { icon: 'fa-gear', color: '#6b7280' },
  '.sh': { icon: 'fa-terminal', color: '#34d399' },
  DEFAULT: { icon: 'fa-file', color: '#6b7280' },
};

function getFileIcon(name) {
  const ext = name.match(/\.[^.]+$/)?.[0]?.toLowerCase() || '';
  return FILE_ICONS[ext] || FILE_ICONS.DEFAULT;
}

function buildFilesTab(spec) {
  const files = [
    { name: 'implementation_plan.json', type: 'json', data: spec.plan },
    { name: 'task_metadata.json', type: 'json', data: spec.meta },
    { name: 'task_logs.json', type: 'json', data: spec.logs },
    { name: 'spec.md', type: 'md', data: spec.specMd },
    { name: 'context.json', type: 'json', data: spec.context },
    { name: 'requirements.json', type: 'json', data: spec.requirements },
    { name: 'plan.md', type: 'md', data: spec.planMd },
    { name: 'qa_report.md', type: 'md', data: spec.qaMd },
  ].filter(f => f.data != null);

  spec._files = files;

  if (!files.length) {
    document.getElementById('tab-files').innerHTML = '<div class="empty-state"><i class="fa-solid fa-folder-open"></i><p>No file data loaded</p></div>';
    return;
  }

  document.getElementById('tab-files').innerHTML = `
    <div class="files-browser">
      <div class="files-list">${files.map((f, i) => { const { icon, color } = getFileIcon(f.name); return `<div class="file-item" onclick="viewFile(${i})"><i class="fa-solid ${icon}" style="color:${color}"></i><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.name}</span></div>`; }).join('')}</div>
      <div class="file-viewer" id="fileViewerEl"><div class="file-viewer-empty"><i class="fa-solid fa-file-magnifying-glass"></i><span>Select a file</span></div></div>
    </div>`;
}

function viewFile(idx) {
  const f = currentSpec._files[idx];
  if (!f) return;
  document.querySelectorAll('.file-item').forEach((el, i) => el.classList.toggle('active', i === idx));
  const viewer = document.getElementById('fileViewerEl');
  if (f.type === 'json') viewer.innerHTML = `<div class="file-content-json">${syntaxHL(JSON.stringify(f.data, null, 2))}</div>`;
  else if (f.type === 'md') viewer.innerHTML = `<div class="file-content-md md-content">${marked.parse(f.data)}</div>`;
  else viewer.innerHTML = `<div class="file-content-json">${escHtml(String(f.data))}</div>`;
}

function syntaxHL(json) {
  return escHtml(json).replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, m => {
    if (/^"/.test(m)) return /:$/.test(m) ? `<span class="json-key">${m}</span>` : `<span class="json-string">${m}</span>`;
    if (/true|false/.test(m)) return `<span class="json-bool">${m}</span>`;
    if (/null/.test(m)) return `<span class="json-null">${m}</span>`;
    return `<span class="json-number">${m}</span>`;
  });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  AUTO REFRESH
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function setAutoRefresh() {
  if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
  const secs = parseInt(document.getElementById('refreshSelect').value);
  if (secs > 0 && (rootHandle || rootUrl)) refreshTimer = setInterval(refreshData, secs * 1000);
  else if (secs > 0) { showToast('Select a project first', 'error'); document.getElementById('refreshSelect').value = '0'; }
}

function updateLastRefresh() {
  const b = document.getElementById('lastRefreshedBadge');
  b.style.display = 'flex';
  document.getElementById('lastRefreshTime').textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  UI HELPERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function showLoading(v) { document.getElementById('loadingOverlay').classList.toggle('show', v); }

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i class="fa-solid fa-${type === 'error' ? 'triangle-exclamation' : 'circle-check'}" style="color:${type === 'error' ? 'var(--red)' : 'var(--green)'}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(`Copied: <code style="font-family:'DM Mono',monospace">${text}</code>`))
      .catch(() => showToast('Clipboard unavailable â€” try HTTPS', 'error'));
  } else {
    // Fallback for file:// protocol
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast(`Copied: <code style="font-family:'DM Mono',monospace">${text}</code>`); }
    catch { showToast('Clipboard not supported', 'error'); }
    ta.remove();
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  DEMO DATA
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function loadDemoData() {
  const now = new Date();
  const daysAgo = n => new Date(now - n * 86400000).toISOString();

  allSpecs = [
    {
      id: '001-auth-system', _projectId: 'demo',
      plan: {
        feature: '001: Auth System', status: 'done', xstateState: 'done', created_at: daysAgo(45), updated_at: daysAgo(30),
        description: 'JWT-based authentication with refresh tokens and role-based access control.',
        phases: [
          {
            name: 'Phase 1: Backend', description: 'API endpoints', subtasks: [
              { id: '1.1', description: 'JWT middleware', status: 'done', files: ['middleware/auth.ts'], verification: 'Tests pass' },
              { id: '1.2', description: 'Refresh token logic', status: 'done', files: ['auth/refresh.ts'], verification: 'OK' },
            ]
          },
          {
            name: 'Phase 2: Frontend', description: 'UI components', subtasks: [
              { id: '2.1', description: 'Login form', status: 'done', files: ['components/LoginForm.tsx'], verification: 'Visual check' },
            ]
          }
        ]
      },
      meta: { priority: 'high', complexity: 'high', impact: 'high', category: 'feat', sourceType: 'manual' },
      specMd: '# Auth System\n\n## Overview\nJWT authentication with refresh tokens.\n\n## Requirements\n- Login/Logout\n- Token refresh\n- Role-based access',
      logs: {
        phases: {
          planning: { phase: 'planning', status: 'completed', started_at: daysAgo(45), completed_at: daysAgo(44), entries: [{ timestamp: daysAgo(45), type: 'text', content: 'Planned auth flow', phase: 'planning' }] },
          coding: { phase: 'coding', status: 'completed', started_at: daysAgo(43), completed_at: daysAgo(30), entries: [{ timestamp: daysAgo(30), type: 'text', content: 'Implemented and tested', phase: 'coding' }] },
          validation: { phase: 'validation', status: 'completed', started_at: daysAgo(30), completed_at: daysAgo(29), entries: [{ timestamp: daysAgo(29), type: 'text', content: 'All tests passed.', phase: 'validation' }] }
        }
      }
    },
    {
      id: '002-dashboard-ui', _projectId: 'demo',
      plan: {
        feature: '002: Dashboard UI', status: 'in-progress', xstateState: 'in-progress', created_at: daysAgo(20), updated_at: daysAgo(2),
        phases: [
          { name: 'Phase 1: Layout', subtasks: [{ id: '1.1', description: 'Grid system', status: 'done', files: ['layouts/Dashboard.tsx'], verification: 'OK' }] },
          {
            name: 'Phase 2: Widgets', subtasks: [
              { id: '2.1', description: 'Line chart widget', status: 'in-progress', files: ['widgets/LineChart.tsx'], verification: 'Pending' },
              { id: '2.2', description: 'Stats cards', status: 'pending', files: ['widgets/StatCard.tsx'], verification: '-' },
            ]
          }
        ]
      },
      meta: { priority: 'high', complexity: 'medium', impact: 'high', category: 'feat', sourceType: 'manual' },
      specMd: '# Dashboard UI\n\n## Overview\nMain dashboard with analytics widgets.\n\n## Requirements\n- Real-time charts\n- Responsive layout\n- Dark/Light theme',
      logs: {
        phases: {
          planning: { status: 'completed', started_at: daysAgo(20), completed_at: daysAgo(19), entries: [{ timestamp: daysAgo(20), type: 'text', content: 'Layout plan approved', phase: 'planning' }] },
          coding: { status: 'in-progress', started_at: daysAgo(18), completed_at: null, entries: [{ timestamp: daysAgo(2), type: 'text', content: 'Grid done, working on charts', phase: 'coding' }] }
        }
      }
    },
    {
      id: '003-api-gateway', _projectId: 'demo',
      plan: {
        feature: '003: API Gateway', status: 'ai-review', xstateState: 'ai-review', created_at: daysAgo(35), updated_at: daysAgo(5),
        phases: [{
          name: 'Phase 1: Core', subtasks: [
            { id: '1.1', description: 'Express router', status: 'done', files: ['gateway/router.ts'], verification: 'OK' },
            { id: '1.2', description: 'Rate limiter', status: 'done', files: ['gateway/rateLimiter.ts'], verification: 'Load tested' },
          ]
        }]
      },
      meta: { priority: 'medium', complexity: 'high', impact: 'high', category: 'feat' },
      specMd: '# API Gateway\n\n## Overview\nCentralised routing and rate limiting.',
      logs: null
    },
    {
      id: '004-email-service', _projectId: 'demo',
      plan: {
        feature: '004: Email Service', status: 'queue', xstateState: 'queue', created_at: daysAgo(10), updated_at: daysAgo(8),
        phases: [{ name: 'Phase 1: Setup', subtasks: [{ id: '1.1', description: 'SES client', status: 'pending', files: ['email/client.ts'], verification: '-' }] }]
      },
      meta: { priority: 'medium', complexity: 'low', impact: 'medium', category: 'feat' },
      specMd: '# Email Service\n\n## Overview\nTransactional email via SES.',
      logs: null
    },
    {
      id: '005-search-index', _projectId: 'demo',
      plan: {
        feature: '005: Search Index', status: 'human-review', xstateState: 'human-review', created_at: daysAgo(25), updated_at: daysAgo(3),
        phases: []
      },
      meta: { priority: 'low', complexity: 'high', impact: 'medium', category: 'chore' },
      specMd: '# Search Index\n\n## Overview\nElasticsearch integration for full-text search.',
      logs: null
    },
    {
      id: '006-prp-dashboard', _projectId: 'demo',
      plan: {
        feature: '006: PRPs Dashboard', status: 'done', xstateState: 'done', created_at: daysAgo(7), updated_at: daysAgo(1),
        phases: [
          { name: 'Phase 1: Setup', subtasks: [{ id: '1.1', description: 'Init package.json', status: 'done', files: ['package.json'], verification: 'OK' }] },
          { name: 'Phase 2: UI', subtasks: [{ id: '2.1', description: 'Create Kanban UI', status: 'done', files: ['App.tsx'], verification: 'Visual check' }] },
        ]
      },
      meta: { priority: 'medium', complexity: 'high', impact: 'high', category: 'feat' },
      specMd: '# PRPs Dashboard\n\n## Overview\nKanban board for monitoring workspaces specs.\n\n## Requirements\n- Kanban view\n- Auto refresh\n- Detail modal\n- Timeline view\n- Stats dashboard',
      logs: {
        phases: {
          planning: { phase: 'planning', status: 'completed', started_at: daysAgo(7), completed_at: daysAgo(7), entries: [{ timestamp: daysAgo(7), type: 'text', content: 'Initial planning complete for 006-prps-dashboard-electron-kanban-board', phase: 'planning' }] },
          coding: { phase: 'coding', status: 'completed', started_at: daysAgo(7), completed_at: daysAgo(1), entries: [{ timestamp: daysAgo(1), type: 'text', content: 'Implementation finished for 006-prps-dashboard-electron-kanban-board', phase: 'coding' }] },
          validation: { phase: 'validation', status: 'completed', started_at: daysAgo(1), completed_at: daysAgo(1), entries: [{ timestamp: daysAgo(1), type: 'text', content: 'All tests passed.', phase: 'validation' }] }
        }
      }
    },
    {
      id: '007-payment-flow', _projectId: 'demo',
      plan: {
        feature: '007: Payment Flow', status: 'planning', xstateState: 'planning', created_at: daysAgo(3), updated_at: daysAgo(1),
        phases: [{ name: 'Phase 1: Design', subtasks: [{ id: '1.1', description: 'Wireframes', status: 'pending', files: [], verification: '-' }] }]
      },
      meta: { priority: 'high', complexity: 'high', impact: 'high', category: 'feat' },
      specMd: '# Payment Flow\n\n## Overview\nStripe payment integration.',
      logs: null
    },
  ];

  specsByProject = { demo: allSpecs };
  document.getElementById('projBarName').textContent = 'Demo Project';
  document.getElementById('projectSwitcher').style.display = 'flex';
  document.getElementById('projEmpty').style.display = 'none';
  updateLastRefresh();
  renderAll();
  showToast('Demo data loaded', 'success');
}

function getCurrentProjectBaseUrl() {
  const href = window.location.href;
  const marker = '/.agent/dashboard/html/';
  const normalized = href.replaceAll('\\', '/');
  const index = normalized.indexOf(marker);
  if (index === -1) return null;
  return new URL(normalized.slice(0, index + 1));
}

function projectNameFromUrl(baseUrl) {
  const parts = decodeURIComponent(baseUrl.pathname).replace(/\/$/, '').split('/').filter(Boolean);
  return parts[parts.length - 1] || 'Current Project';
}

function renderAutoProjectHeader() {
  document.getElementById('projBarName').textContent = rootProjectName || 'Current Project';
  document.getElementById('projectSwitcher').style.display = 'flex';
  document.getElementById('projEmpty').style.display = 'none';
  document.getElementById('btnRefresh').style.display = 'flex';
  document.getElementById('projList').innerHTML = `
    <div class="proj-item active">
      <div class="proj-item-ico"><i class="fa-solid fa-folder-open"></i></div>
      <div class="proj-item-info">
        <div class="proj-item-name">${escHtml(rootProjectName || 'Current Project')}</div>
        <div class="proj-item-path" title="${escHtml(rootUrl?.href || '')}">${escHtml(rootUrl?.href || '')}</div>
      </div>
      <div class="proj-item-actions"><i class="fa-solid fa-check proj-check"></i></div>
    </div>`;
}

async function tryAutoLoadCurrentProject() {
  if (rootHandle || rootUrl) return false;
  const baseUrl = getCurrentProjectBaseUrl();
  if (!baseUrl) return false;

  const projectIndex = await readJsonUrl(baseUrl, '.workspaces', 'project_index.json').catch(() => null);
  const hasWorkspace =
    projectIndex
    || await readJsonUrl(baseUrl, '.workspaces', 'roadmap', 'roadmap.json').catch(() => null)
    || await readJsonUrl(baseUrl, '.workspaces', 'roadmap', 'roadmap_discovery.json').catch(() => null);
  if (!hasWorkspace) return false;

  rootUrl = baseUrl;
  rootProjectName = projectIndex?.project_root
    ? projectIndex.project_root.split(/[\\/]/).filter(Boolean).pop()
    : projectNameFromUrl(baseUrl);
  await refreshUrlData();
  return true;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  SESSION RESTORE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
async function tryRestoreLastSession() {
  const projects = await getProjects();
  if (!projects.length) return;

  const activeId = await idbGet('activeProject');
  const active = projects.find(p => p.id === activeId) || projects[projects.length - 1];
  if (!active?.handle) return;

  await renderProjectSwitcher(active.id);
  document.getElementById('projBarName').textContent = active.name;

  const permitted = await verifyPerm(active.handle);
  if (permitted) {
    rootHandle = active.handle;
    document.getElementById('btnRefresh').style.display = 'flex';
    await refreshData();
  } else {
    document.getElementById('projBarName').textContent = active.name + ' â€” click Browse';
  }
}

async function initDashboard() {
  await tryRestoreLastSession();
  await tryAutoLoadCurrentProject();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  EVENTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { document.getElementById('modalOverlay').classList.remove('show'); closeProjDropdown(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); switchView('search'); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'r' && (rootHandle || rootUrl)) { e.preventDefault(); refreshData(); }
});

document.addEventListener('click', e => {
  const sw = document.getElementById('projectSwitcher');
  if (sw && !sw.contains(e.target)) closeProjDropdown();

  // Click-to-copy for code and pre tags
  const code = e.target.closest('code');
  const pre = e.target.closest('pre');
  if (code || pre) {
    const text = (code || pre).innerText.trim();
    if (text) copyText(text);
  }
});

window.addEventListener('load', initDashboard);

