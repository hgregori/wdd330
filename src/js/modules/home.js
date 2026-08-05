/**
 * Home Module
 * Loads featured Pokémon and quick navigation grid on the homepage.
 */

import { getPokemon } from '../api/pokeApi.js';
import { renderTypeBadges } from '../utils/typeColors.js';

const FEATURED_IDS = [25, 6, 94, 448, 658, 384];

export async function initHome() {
  const container = document.getElementById('featured-pokemon-grid');
  if (!container) {return;}

  // Render Skeleton Cards
  container.innerHTML = FEATURED_IDS.map(() => `
    <div class="pokemon-card skeleton-card">
      <div class="skeleton" style="height: 120px; margin-bottom: 0.5rem;"></div>
      <div class="skeleton" style="height: 20px; width: 60%; margin: 0 auto 0.5rem auto;"></div>
      <div class="skeleton" style="height: 15px; width: 40%; margin: 0 auto;"></div>
    </div>
  `).join('');

  try {
    const pokemonResults = await Promise.all(
      FEATURED_IDS.map(id => getPokemon(id))
    );

    container.innerHTML = pokemonResults.map(p => createPokemonCardMarkup(p)).join('');
  } catch (err) {
    console.error('Error loading featured Pokémon:', err);
    container.innerHTML = `<p class="error-msg">Failed to load featured Pokémon. Please try again later.</p>`;
  }
}

function createPokemonCardMarkup(pokemon) {
  const imgUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || '';
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  return `
    <article class="pokemon-card" onclick="window.location.hash='#details/${pokemon.id}'" role="button" tabindex="0">
      <span class="pokemon-card__number">${formattedId}</span>
      <div class="pokemon-card__img-container">
        <img src="${imgUrl}" alt="${pokemon.name}" class="pokemon-card__img" loading="lazy">
      </div>
      <h3 class="pokemon-card__name">${pokemon.name}</h3>
      <div class="pokemon-card__types">
        ${renderTypeBadges(pokemon.types)}
      </div>
    </article>
  `;
}
