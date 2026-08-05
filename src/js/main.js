/**
 * PokéSphere Main Entry Point
 * Initializes HTML Partials and starts the Hash Router.
 */

import { loadPartials } from './components/partials.js';
import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Load Header and Footer HTML Partials
  await loadPartials();

  // Initialize Router
  initRouter();
});
