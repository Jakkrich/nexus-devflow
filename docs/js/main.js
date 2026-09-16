/**
 * Nexus-DevFlow UI Engine
 * Lightweight Vanilla JavaScript Interactions
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
          label.textContent = 'Copied';
          setTimeout(() => {
            label.textContent = defaultLabel;
          }, 1800);
        }
      } catch (err) {
        // Fallback prompt if clipboard access is denied
        if (label) {
          label.textContent = 'Press Ctrl+C';
          setTimeout(() => {
            label.textContent = label.getAttribute('data-default-label') || 'Copy';
          }, 1800);
        }
      }
    });
  });

  // 2. Mobile Menu Toggle
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

  // 3. 3D Dashboard Tilter Animation Trigger
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

  // 4. Smooth Anchor Scroll Spy for Documentation Table of Contents
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

    const headingObserver = new IntersectionObserver(
      () => {
        let currentActive = null;
        for (const item of headings) {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= 120) {
            currentActive = item.link;
          }
        }
        tocLinks.forEach((l) => l.classList.remove('active'));
        if (currentActive) {
          currentActive.classList.add('active');
        }
      },
      { rootMargin: '0px 0px -70% 0px' }
    );

    headings.forEach((item) => headingObserver.observe(item.el));
  }
});
