/**
 * Partials Loader Component
 * Fetches header.html and footer.html partials and injects them into DOM placeholders.
 * Wires up mobile nav toggle and global header search form.
 */

import { addRecentSearch } from '../utils/storage.js';

export async function loadPartials() {
  try {
    const [headerRes, footerRes] = await Promise.all([
      fetch('/public/partials/header.html'),
      fetch('/public/partials/footer.html'),
    ]);

    if (headerRes.ok) {
      const headerHtml = await headerRes.text();
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHtml;
      }
    }

    if (footerRes.ok) {
      const footerHtml = await footerRes.text();
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHtml;
      }
    }

    // Attach Header Interactive Listeners
    initHeaderEvents();
  } catch (err) {
    console.error('Failed to load HTML partials:', err);
  }
}

function initHeaderEvents() {
  // Mobile Hamburger Toggle
  const toggleBtn = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Header Search Form
  const searchForm = document.getElementById('header-search-form');
  const searchInput = document.getElementById('header-search-input');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        addRecentSearch(query);
        window.location.hash = `#search?q=${encodeURIComponent(query)}`;
        searchInput.value = '';
        if (mainNav && mainNav.classList.contains('is-open')) {
          mainNav.classList.remove('is-open');
        }
      }
    });
  }
}
