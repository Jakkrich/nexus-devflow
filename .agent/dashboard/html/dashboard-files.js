'use strict';

export let workspaceFileGroups = [];

export async function renderWorkspaceFiles() {
  const wrap = document.getElementById('workspaceFiles');
  if (!wrap) return;

  if (!workspaceFileGroups.length) {
    try {
      const response = await fetch('/api/files', { cache: 'no-store' });
      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          workspaceFileGroups = result.groups;
        }
      }
    } catch (e) {
      console.warn('Failed to load workspace files from API, using empty fallback', e);
    }
  }

  if (!workspaceFileGroups.length) {
    wrap.innerHTML = '<div class="no-data"><i class="fa-solid fa-folder-tree"></i><h3>No workspace files</h3><p>Ensure the companion Node server is running and has loaded a project.</p></div>';
    return;
  }

  const totalFiles = workspaceFileGroups.reduce((acc, g) => acc + (g.files?.length || 0), 0);

  const escHtml = window.escHtml || (str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));

  wrap.innerHTML = `
    <div class="workspace-files-layout">
      <div class="workspace-files-sidebar">
        <div class="workspace-files-summary">
          <div class="workspace-files-title">Workspace Index</div>
          <div class="workspace-files-count">${totalFiles} Artifacts</div>
        </div>
        <div class="workspace-files-groups">
          ${workspaceFileGroups.map((group, groupIdx) => `
            <div class="workspace-file-group" id="file-group-${group.key}">
              <div class="workspace-file-group-header" onclick="toggleFileGroup(this)">
                <span><i class="fa-solid ${group.icon || 'fa-folder'}"></i> ${escHtml(group.label)}</span>
                <span class="workspace-group-badge">${group.files?.length || 0}</span>
              </div>
              <div class="workspace-file-list">
                ${(group.files || []).map((file, fileIdx) => `
                  <div class="workspace-file-item" onclick="viewWorkspaceFile(${groupIdx}, ${fileIdx})">
                    <i class="fa-regular ${file.type === 'json' ? 'fa-file-code' : file.type === 'md' ? 'fa-file-lines' : 'fa-file'}"></i>
                    <span>${escHtml(file.name)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="workspace-files-viewer" id="workspaceFilesViewer">
        <div class="file-viewer-empty">
          <i class="fa-solid fa-file-magnifying-glass"></i>
          <h3>No artifact selected</h3>
          <p>Select a generated workspace file from the left sidebar to inspect it.</p>
        </div>
      </div>
    </div>
  `;
}

export function toggleFileGroup(header) {
  const group = header.closest('.workspace-file-group');
  group.classList.toggle('collapsed');
}

export async function viewWorkspaceFile(groupIdx, fileIdx) {
  const group = workspaceFileGroups[groupIdx];
  const file = group?.files?.[fileIdx];
  if (!file) return;

  // Active state styling
  document.querySelectorAll('.workspace-file-item').forEach(el => el.classList.remove('active'));
  const listEl = document.querySelectorAll('.workspace-file-group')[groupIdx]?.querySelectorAll('.workspace-file-item')?.[fileIdx];
  if (listEl) listEl.classList.add('active');

  const viewer = document.getElementById('workspaceFilesViewer');
  if (!viewer) return;

  viewer.innerHTML = '<div class="file-viewer-loading"><div class="spinner"></div><span>Loading file content...</span></div>';

  const escHtml = window.escHtml || (str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));

  try {
    const response = await fetch('/' + file.path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    
    let displayHtml = '';
    if (file.type === 'json') {
      try {
        const formattedJson = JSON.stringify(JSON.parse(text), null, 2);
        displayHtml = `<pre class="file-content-json"><code>${escHtml(formattedJson)}</code></pre>`;
      } catch {
        displayHtml = `<pre class="file-content-text"><code>${escHtml(text)}</code></pre>`;
      }
    } else if (file.type === 'md') {
      displayHtml = `<div class="file-content-md markdown-body">${window.marked.parse(text)}</div>`;
    } else {
      displayHtml = `<pre class="file-content-text"><code>${escHtml(text)}</code></pre>`;
    }

    viewer.innerHTML = `
      <div class="workspace-file-viewer-header">
        <div class="workspace-file-viewer-info">
          <div class="workspace-file-viewer-name"><i class="fa-solid fa-file-invoice"></i> ${escHtml(file.name)}</div>
          <div class="workspace-file-viewer-path">/${escHtml(file.path)}</div>
        </div>
        <button class="btn btn-ghost" id="btn-copy-file">
          <i class="fa-solid fa-copy"></i> Copy
        </button>
      </div>
      <div class="workspace-file-viewer-body">
        ${displayHtml}
      </div>
    `;

    document.getElementById('btn-copy-file')?.addEventListener('click', () => {
      if (window.copyText) {
        window.copyText(text);
      } else {
        navigator.clipboard.writeText(text);
      }
    });
  } catch (err) {
    viewer.innerHTML = `
      <div class="file-viewer-error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <h3>Failed to load file</h3>
        <p>${escHtml(err.message)}</p>
      </div>
    `;
  }
}
