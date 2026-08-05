/**
 * Favorites Module
 * Renders user's saved favorite Pokémon from localStorage with remove buttons.
 */

import { getFavorites, removeFavorite } from '../utils/storage.js';
import { renderTypeBadges } from '../utils/typeColors.js';
import { showToast } from '../components/toast.js';

export function initFavorites() {
  renderFavoritesGrid();
}

function renderFavoritesGrid() {
  const container = document.getElementById('favorites-grid');
  if (!container) {return;}

  const favorites = getFavorites();

  if (favorites.length === 0) {
    container.innerHTML = `
      <div class="empty-favorites" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">💔</span>
        <h2>No Favorite Pokémon Yet</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">Explore the Pokédex and click the ❤️ icon to save your favorite Pokémon here.</p>
        <a href="#search" class="btn btn-primary">Browse Pokédex</a>
      </div>
    `;
    return;
  }

  container.innerHTML = favorites.map(pokemon => {
    const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

    return `
      <article class="pokemon-card" style="position: relative;">
        <button class="slot-remove-btn" onclick="removeFavoritePokemon(${pokemon.id})" aria-label="Remove favorite" style="top: 0.5rem; right: 0.5rem;">&times;</button>
        <div onclick="window.location.hash='#details/${pokemon.id}'" style="cursor: pointer;">
          <span class="pokemon-card__number" style="right: 2.2rem;">${formattedId}</span>
          <div class="pokemon-card__img-container">
            <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-card__img" loading="lazy">
          </div>
          <h3 class="pokemon-card__name">${pokemon.name}</h3>
          <div class="pokemon-card__types">
            ${renderTypeBadges(pokemon.types)}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Make remove function globally accessible for inline click handlers
window.removeFavoritePokemon = function(id) {
  removeFavorite(id);
  renderFavoritesGrid();
  showToast('Removed from favorites.', 'info');
};
