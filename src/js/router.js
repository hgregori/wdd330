/**
 * SPA Hash Router
 * Parses location.hash, toggles visible section, and initializes corresponding module.
 */

import { initHome } from './modules/home.js';
import { initSearch } from './modules/search.js';
import { initDetails } from './modules/details.js';
import { initCalculator } from './modules/calculator.js';
import { initTeamBuilder } from './modules/teamBuilder.js';
import { initFavorites } from './modules/favorites.js';
import { initLocations } from './modules/locations.js';

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  // Dispatch initial route on load
  handleRoute();
}

async function handleRoute() {
  const hash = window.location.hash.slice(1) || 'home';
  
  // Parse hash and query parameters (e.g. #search?q=pikachu or #details/25)
  const [routePath, queryString] = hash.split('?');
  const pathParts = routePath.split('/');
  const mainRoute = pathParts[0] || 'home';
  const routeParam = pathParts[1] || null;

  const queryParams = {};
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams.entries()) {
      queryParams[key] = value;
    }
  }

  // Hide all sections
  const sections = document.querySelectorAll('.route-section');
  sections.forEach(sec => sec.hidden = true);

  // Update active state on nav links
  updateActiveNavLink(mainRoute);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Route Dispatcher
  switch (mainRoute) {
    case 'home': {
      const secHome = document.getElementById('section-home');
      if (secHome) {secHome.hidden = false;}
      await initHome();
      break;
    }
    case 'search': {
      const secSearch = document.getElementById('section-search');
      if (secSearch) {secSearch.hidden = false;}
      await initSearch(queryParams);
      break;
    }
    case 'details': {
      const secDetails = document.getElementById('section-details');
      if (secDetails) {secDetails.hidden = false;}
      await initDetails(routeParam);
      break;
    }
    case 'calculator': {
      const secCalc = document.getElementById('section-calculator');
      if (secCalc) {secCalc.hidden = false;}
      await initCalculator(queryParams);
      break;
    }
    case 'team': {
      const secTeam = document.getElementById('section-team');
      if (secTeam) {secTeam.hidden = false;}
      initTeamBuilder();
      break;
    }
    case 'favorites': {
      const secFav = document.getElementById('section-favorites');
      if (secFav) {secFav.hidden = false;}
      initFavorites();
      break;
    }
    case 'locations': {
      const secLoc = document.getElementById('section-locations');
      if (secLoc) {secLoc.hidden = false;}
      await initLocations();
      break;
    }
    default: {
      const secHome = document.getElementById('section-home');
      if (secHome) {secHome.hidden = false;}
      await initHome();
      break;
    }
  }
}

function updateActiveNavLink(currentRoute) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const route = link.dataset.route;
    if (route === currentRoute) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}
