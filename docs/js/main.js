/**
 * Nexus-DevFlow UI Engine
 * Lightweight Vanilla JavaScript Interactions & Real-Time Search
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy to Clipboard Functionality
  const copyButtons = document.querySelectorAll('[data-copy-command]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const command = btn.getAttribute('data-copy-command');
      const label = btn.querySelector('[data-copy-label]');
      if (!command) return;

      try {
        await navigator.clipboard.writeText(command);
        if (label) {
          const defaultLabel = label.getAttribute('data-default-label') || label.textContent;
          label.textContent = 'คัดลอกแล้ว';
          setTimeout(() => {
            label.textContent = defaultLabel;
          }, 1800);
        }
      } catch (err) {
        if (label) {
          label.textContent = 'กด Ctrl+C';
          setTimeout(() => {
            label.textContent = label.getAttribute('data-default-label') || 'คัดลอก';
          }, 1800);
        }
      }
    });
  });

  // 2. Landing Page Mobile Menu Toggle
  const header = document.querySelector('[data-site-header]');
  const menuToggle = document.querySelector('[data-site-menu]');
  const navigation = document.querySelector('#site-navigation');

  if (menuToggle && header) {
    menuToggle.addEventListener('click', () => {
      const isOpen = header.getAttribute('data-open') === 'true';
      header.setAttribute('data-open', String(!isOpen));
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  if (navigation && header && menuToggle) {
    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        header.setAttribute('data-open', 'false');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Documentation Mobile Sidebar Drawer Toggle
  const docsMenuBtn = document.querySelector('[data-docs-menu]');
  const docsSidebar = document.querySelector('[data-docs-sidebar]');

  if (docsMenuBtn && docsSidebar) {
    docsMenuBtn.addEventListener('click', () => {
      const isOpen = docsSidebar.classList.toggle('open');
      docsMenuBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });

    docsSidebar.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        docsSidebar.classList.remove('open');
        docsMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // 4. Instant Documentation Search (⌘K / Ctrl+K)
  const searchDialog = document.querySelector('[data-search-dialog]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  let searchIndexData = [];

  const getRootPrefix = () => {
    const scriptTag = document.querySelector('script[src*="main.js"]');
    if (scriptTag) {
      const src = scriptTag.getAttribute('src') || '';
      return src.replace(/js\/main\.js(\?.*)?$/, '');
    }
    return '';
  };

  const openSearch = async () => {
    if (!searchDialog) return;
    searchDialog.showModal();
    if (searchInput) searchInput.focus();

    if (searchIndexData.length === 0) {
      try {
        const rootPrefix = getRootPrefix();
        const indexPath = `${rootPrefix}docs-search.json`;
        const res = await fetch(indexPath);
        if (res.ok) {
          searchIndexData = await res.json();
        }
      } catch (e) {
        if (searchResults) {
          searchResults.innerHTML = '<p>ระบบค้นหาไม่พร้อมใช้งานชั่วคราว สามารถเลือกอ่านตามหมวดหมู่ได้ที่เมนูด้านซ้าย</p>';
        }
      }
    }
  };

  const closeSearch = () => {
    if (searchDialog) searchDialog.close();
  };

  const handleSearchInput = (e) => {
    if (!searchResults) return;
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      searchResults.innerHTML = '<p>พิมพ์เพื่อค้นหาคำสั่ง คู่มือ และสถาปัตยกรรม...</p>';
      return;
    }

    const rootPrefix = getRootPrefix();
    const tokens = query.split(/\s+/).filter(Boolean);
    const matches = searchIndexData.filter((item) => {
      const corpus = `${item.title} ${item.description} ${item.section} ${(item.tags || []).join(' ')}`.toLowerCase();
      return tokens.every((token) => corpus.includes(token));
    }).slice(0, 10);

    if (matches.length === 0) {
      searchResults.innerHTML = '<p>ไม่พบคู่มือหรือคำสั่งที่ตรงกับคำค้นหาของคุณ</p>';
      return;
    }

    searchResults.innerHTML = matches.map((item) => {
      const targetHref = item.slug ? `${rootPrefix}${item.slug}/` : item.href;
      return `
      <a href="${targetHref}">
        <span class="docs-card-label" style="font-size:0.65rem; color:var(--blue-dark); text-transform:uppercase; letter-spacing:0.05em;">${item.section}</span>
        <strong style="margin-top:2px;">${item.title}</strong>
        <span>${item.description}</span>
      </a>
    `;
    }).join('');
  };

  document.querySelectorAll('[data-search-open]').forEach((btn) => {
    btn.addEventListener('click', openSearch);
  });

  document.querySelectorAll('[data-search-close]').forEach((btn) => {
    btn.addEventListener('click', closeSearch);
  });

  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
  }

  // Keyboard shortcut ⌘K / Ctrl+K & Esc
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchDialog && searchDialog.open) {
      closeSearch();
    }
  });

  if (searchDialog) {
    searchDialog.addEventListener('click', (e) => {
      if (e.target === searchDialog) {
        closeSearch();
      }
    });
  }

  // 5. 3D Dashboard Tilter Animation Trigger
  const tilter = document.querySelector('[data-dashboard-tilter]');
  if (tilter && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          tilter.setAttribute('data-active', 'true');
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(tilter);
  }

  // 6. Smooth Anchor Scroll Spy for Documentation Table of Contents
  const tocLinks = document.querySelectorAll('.docs-toc a');
  if (tocLinks.length > 0 && 'IntersectionObserver' in window) {
    const headings = [];
    tocLinks.forEach((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      if (id) {
        const el = document.getElementById(id);
        if (el) headings.push({ el, link });
      }
    });

    const updateActiveToc = () => {
      let currentActive = null;
      for (const item of headings) {
        const rect = item.el.getBoundingClientRect();
        if (rect.top <= 140) {
          currentActive = item.link;
        }
      }
      tocLinks.forEach((l) => l.classList.remove('active'));
      if (currentActive) {
        currentActive.classList.add('active');
      }
    };

    window.addEventListener('scroll', updateActiveToc, { passive: true });
    updateActiveToc();
  }
});
