import * as fs from 'node:fs';
import * as path from 'node:path';

interface DocPage {
  slug: string; // e.g. "getting-started", "commands/feature", "cli/dashboard"
  category: 'START' | 'WORKFLOW' | 'COMMANDS' | 'CLI' | 'REFERENCE' | 'QUALITY' | 'SHIP';
  title: string;
  lead: string;
  pills: string[];
  sections: {
    id: string;
    title: string;
    contentHtml: string;
    subsections?: { id: string; title: string; contentHtml: string }[];
  }[];
}

const SIDEBAR_ITEMS = [
  {
    category: 'START',
    items: [
      { slug: 'getting-started', title: 'Getting Started' },
      { slug: 'existing-codebase', title: 'Existing Codebase Adoption' },
      { slug: 'command-guide', title: 'Command Guide' },
      { slug: 'writing-your-plans', title: 'Writing Your Plans' },
      { slug: 'updating-devflow', title: 'Updating DevFlow' }
    ]
  },
  {
    category: 'WORKFLOW',
    items: [
      { slug: 'core-workflow', title: 'Core Workflow' }
    ]
  },
  {
    category: 'COMMANDS',
    items: [
      { slug: 'commands/onboard', title: 'Onboard' },
      { slug: 'commands/adopt', title: 'Adopt' },
      { slug: 'commands/discovery', title: 'Discovery' },
      { slug: 'commands/explore', title: 'Explore' },
      { slug: 'commands/overview', title: 'Overview' },
      { slug: 'commands/feature', title: 'Feature' },
      { slug: 'commands/implement', title: 'Implement' },
      { slug: 'commands/check', title: 'Check' },
      { slug: 'commands/complete', title: 'Complete' },
      { slug: 'commands/status', title: 'Status' },
      { slug: 'commands/doctor', title: 'Doctor' },
      { slug: 'commands/debug', title: 'Debug' },
      { slug: 'commands/fix', title: 'Fix' },
      { slug: 'commands/brief', title: 'Brief' },
      { slug: 'commands/audit', title: 'Audit' },
      { slug: 'commands/tests', title: 'Tests' },
      { slug: 'commands/ci', title: 'CI' },
      { slug: 'commands/prototype', title: 'Prototype' },
      { slug: 'commands/autopilot', title: 'Autopilot' },
      { slug: 'commands/continuous', title: 'Continuous' },
      { slug: 'commands/release', title: 'Release' },
      { slug: 'commands/rollback', title: 'Rollback' },
      { slug: 'commands/analyze', title: 'Analyze (SA Suite)' },
      { slug: 'commands/grill', title: 'Grill (Domain & ADR)' },
      { slug: 'commands/bughunter', title: 'Bughunter (Security)' }
    ]
  },
  {
    category: 'CLI',
    items: [
      { slug: 'cli', title: 'CLI Overview' },
      { slug: 'cli/status', title: 'Status' },
      { slug: 'cli/dashboard', title: 'Live Dashboard' }
    ]
  },
  {
    category: 'REFERENCE',
    items: [
      { slug: 'file-reference', title: 'File Reference' },
      { slug: 'tool-adapters', title: 'Tool Adapters' },
      { slug: 'local-only-mode', title: 'Local-Only Mode' },
      { slug: 'project-configuration', title: 'Project Configuration' },
      { slug: 'commands/try', title: 'Try migration' },
      { slug: 'commands/browser-tests', title: 'Browser Tests migration' }
    ]
  },
  {
    category: 'QUALITY',
    items: [
      { slug: 'testing', title: 'Testing and CI' },
      { slug: 'manual-review', title: 'Manual Review With Try' },
      { slug: 'code-quality', title: 'Code Quality With Audit' },
      { slug: 'findings-ledger', title: 'The Findings Ledger' }
    ]
  },
  {
    category: 'SHIP',
    items: [
      { slug: 'release-readiness', title: 'Release Readiness' },
      { slug: 'troubleshooting', title: 'Troubleshooting' }
    ]
  }
];

// Linear list for next/previous navigation
const FLAT_PAGES = SIDEBAR_ITEMS.flatMap(g => g.items);

function getRelativePrefix(slug: string): string {
  const depth = slug.split('/').length;
  return '../'.repeat(depth);
}

function renderSidebar(currentSlug: string): string {
  const relPrefix = getRelativePrefix(currentSlug);
  return SIDEBAR_ITEMS.map(group => {
    const links = group.items.map(item => {
      const isActive = item.slug === currentSlug;
      const href = `${relPrefix}${item.slug}/`;
      return `          <a class="docs-nav-link${isActive ? ' active' : ''}" href="${href}">${item.title}</a>`;
    }).join('\n');

    return `        <!-- ${group.category} -->
        <div class="docs-nav-group">
          <div class="docs-nav-title">${group.category}</div>
${links}
        </div>`;
  }).join('\n\n');
}

function renderPage(page: DocPage): string {
  const relPrefix = getRelativePrefix(page.slug);
  const currentIndex = FLAT_PAGES.findIndex(p => p.slug === page.slug);
  const prevPage = currentIndex > 0 ? FLAT_PAGES[currentIndex - 1] : null;
  const nextPage = currentIndex < FLAT_PAGES.length - 1 ? FLAT_PAGES[currentIndex + 1] : null;

  const prevHtml = prevPage 
    ? `<a class="prev" href="${relPrefix}${prevPage.slug}/">
          <span>ก่อนหน้า (Previous)</span>
          <strong>${prevPage.title}</strong>
        </a>`
    : `<span></span>`;

  const nextHtml = nextPage 
    ? `<a class="next" href="${relPrefix}${nextPage.slug}/">
          <span>ถัดไป (Next)</span>
          <strong>${nextPage.title}</strong>
        </a>`
    : `<span></span>`;

  // TOC
  const tocItems: string[] = [];
  page.sections.forEach(sec => {
    tocItems.push(`      <a href="#${sec.id}">${sec.title}</a>`);
    if (sec.subsections) {
      sec.subsections.forEach(sub => {
        tocItems.push(`      <a class="nested" href="#${sub.id}" style="padding-left:0.75rem;">${sub.title}</a>`);
      });
    }
  });

  // Main Sections
  const sectionsHtml = page.sections.map(sec => {
    const subHtml = sec.subsections ? sec.subsections.map((sub, idx) => {
      const cleanTitle = sub.title.replace(/^\d+\.\s*/, '');
      return `
          <div class="docs-step" id="${sub.id}">
            <div class="docs-step-number">${idx + 1}</div>
            <div>
              <h3>${cleanTitle}</h3>
              ${sub.contentHtml}
            </div>
          </div>
      `;
    }).join('') : '';

    return `
        <!-- Section: ${sec.title} -->
        <section id="${sec.id}">
          <h2>${sec.title}</h2>
          ${sec.contentHtml}
          ${subHtml}
        </section>`;
  }).join('\n');

  const pillsHtml = page.pills.map(p => `<span class="docs-pill">${p}</span>`).join('\n        ');

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title} - คู่มือ Nexus-DevFlow</title>
  <meta name="description" content="${page.lead.replace(/"/g, '&quot;')}">
  <link rel="canonical" href="https://jakkrich.github.io/nexus-devflow/${page.slug}/">
  <link rel="icon" href="${relPrefix}brand/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Local Standalone Style (Zero External Dependencies) -->
  <link rel="stylesheet" href="${relPrefix}css/style.css">
</head>
<body class="docs-body">
  <a class="skip-link" href="#docs-content">ข้ามไปยังเนื้อหาหลัก</a>

  <!-- Docs Header -->
  <header class="docs-header">
    <div class="docs-header-inner">
      <div class="docs-brand">
        <a href="${relPrefix}" aria-label="Nexus-DevFlow หน้าแรก">
          <img src="${relPrefix}brand/logo-light.svg" alt="Nexus-DevFlow" class="site-logo">
        </a>
        <span class="docs-badge">คู่มือ</span>
      </div>

      <div class="docs-header-actions">
        <!-- Instant Search Button -->
        <button class="docs-search" type="button" data-search-open aria-label="เปิดหน้าต่างค้นหาเอกสาร">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>ค้นหาเอกสาร...</span>
          <span class="docs-key">⌘ K</span>
        </button>

        <a class="docs-header-link" href="${relPrefix}">หน้าแรก</a>
        <a class="docs-header-link" href="${relPrefix}updates/">อัปเดต</a>
        <a class="docs-header-link" href="https://github.com/Jakkrich/nexus-devflow" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.27-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          <span>GitHub</span>
        </a>
        <button class="docs-mobile-menu" type="button" aria-expanded="false" aria-controls="docs-sidebar" data-docs-menu>เมนู</button>
      </div>
    </div>
  </header>

  <!-- Docs Shell (3 Columns) -->
  <div class="docs-shell">
    <!-- Left Sidebar -->
    <aside class="docs-sidebar" id="docs-sidebar" aria-label="Documentation sidebar" data-docs-sidebar>
      <nav>
${renderSidebar(page.slug)}
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="docs-main" id="docs-content">
      <div class="docs-breadcrumb"><a href="${relPrefix}getting-started/">คู่มือ</a> <span>/</span> <span>${page.category}</span> <span>/</span> <strong>${page.title}</strong></div>
      
      <h1 class="docs-title">${page.title}</h1>
      
      <p class="docs-lead">
        ${page.lead}
      </p>

      <div class="docs-meta">
        ${pillsHtml}
      </div>

      <div class="docs-prose">
${sectionsHtml}
      </div>

      <!-- Bottom Page Navigation -->
      <nav class="docs-page-nav" aria-label="Documentation page navigation">
        ${prevHtml}
        ${nextHtml}
      </nav>
    </main>

    <!-- Right Sidebar (TOC) -->
    <aside class="docs-toc" aria-label="On this page">
      <div class="docs-toc-title">ในหน้านี้ (On this page)</div>
${tocItems.join('\n')}
    </aside>
  </div>

  <!-- Instant Search Dialog Modal (Zero Dependency) -->
  <dialog class="search-dialog" data-search-dialog aria-labelledby="search-title">
    <div class="search-panel">
      <div class="search-heading">
        <div>
          <span class="eyebrow" style="font-size:0.7rem; text-transform:uppercase; color:var(--blue-dark); font-family:var(--font-mono);">Nexus-DevFlow Docs</span>
          <h2 id="search-title">ค้นหาเอกสารและคำสั่ง</h2>
        </div>
        <button type="button" data-search-close aria-label="ปิดหน้าต่างค้นหา">Esc</button>
      </div>
      <label class="search-input">
        <span class="sr-only">ค้นหาเอกสาร</span>
        <input type="search" placeholder="พิมพ์ชื่อคำสั่ง เช่น /feature, /audit, config, testing..." autocomplete="off" data-search-input>
      </label>
      <div class="search-results" data-search-results aria-live="polite">
        <p>พิมพ์เพื่อค้นหาคำสั่ง คู่มือ และสถาปัตยกรรม...</p>
      </div>
    </div>
  </dialog>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container site-footer-inner">
      <div class="site-footer-brand">
        <img src="${relPrefix}brand/logo-light.svg" alt="Nexus-DevFlow">
        <span>เลเยอร์เวิร์กโฟลว์แบบโอเพนซอร์สสำหรับการพัฒนาซอฟต์แวร์ด้วย AI</span>
      </div>
      <div class="site-footer-links">
        <a href="https://github.com/Jakkrich/nexus-devflow" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="${relPrefix}getting-started/">คู่มือ (Docs)</a>
        <a href="${relPrefix}updates/">อัปเดต (Updates)</a>
        <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer">สัญญาอนุญาต MIT</a>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="${relPrefix}js/main.js"></script>
</body>
</html>`;
}

// Export for runner
export { renderPage, SIDEBAR_ITEMS, FLAT_PAGES };
export type { DocPage };
