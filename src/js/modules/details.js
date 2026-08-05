/**
 * Pokémon Details & Stat Explorer Module
 * Renders full stats, evolution chains, abilities, flavor text, and favorite toggles.
 */

import { getPokemon, getPokemonSpecies, getEvolutionChainByUrl } from '../api/pokeApi.js';
import { renderTypeBadges } from '../utils/typeColors.js';
import { isFavorite, addFavorite, removeFavorite } from '../utils/storage.js';
import { showToast } from '../components/toast.js';

export async function initDetails(pokemonIdOrName) {
  const container = document.getElementById('details-container');
  if (!container) {return;}

  if (!pokemonIdOrName) {
    container.innerHTML = `<p class="error-msg">No Pokémon specified. <a href="#search">Search for a Pokémon</a>.</p>`;
    return;
  }

  container.innerHTML = `<div class="spinner" aria-label="Loading Pokémon details"></div>`;

  try {
    const pokemon = await getPokemon(pokemonIdOrName);
    const species = await getPokemonSpecies(pokemon.id).catch(() => null);

    let evolutionChainData = null;
    if (species && species.evolution_chain?.url) {
      evolutionChainData = await getEvolutionChainByUrl(species.evolution_chain.url).catch(() => null);
    }

    renderDetailsView(container, pokemon, species, evolutionChainData);
  } catch (err) {
    console.error('Error rendering details:', err);
    container.innerHTML = `
      <div class="error-card">
        <h2>Pokémon Not Found</h2>
        <p>Could not find details for "${pokemonIdOrName}".</p>
        <a href="#search" class="btn btn-primary" style="margin-top: 1rem;">Return to Search</a>
      </div>
    `;
  }
}

function renderDetailsView(container, pokemon, species, evoChain) {
  const imgUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || '';
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  const favState = isFavorite(pokemon.id);

  // Flavor Text
  let flavorText = 'No description available.';
  if (species && species.flavor_text_entries) {
    const englishEntry = species.flavor_text_entries.find(e => e.language.name === 'en');
    if (englishEntry) {
      flavorText = englishEntry.flavor_text.replace(/[\f\n\r]/g, ' ');
    }
  }

  // Base Stats Calculations
  const statsMap = {};
  let totalBaseStats = 0;
  pokemon.stats.forEach(s => {
    statsMap[s.stat.name] = s.base_stat;
    totalBaseStats += s.base_stat;
  });

  // Abilities string
  const abilitiesStr = pokemon.abilities
    .map(a => a.ability.name.replace('-', ' ') + (a.is_hidden ? ' (Hidden)' : ''))
    .join(', ');

  const html = `
    <header class="details-header">
      <div class="details-title-group">
        <h1 class="details-name">${pokemon.name}</h1>
        <span class="details-number">${formattedId}</span>
        <div class="details-types">${renderTypeBadges(pokemon.types)}</div>
      </div>
      <button id="fav-btn" class="fav-toggle-btn ${favState ? 'is-fav' : ''}" aria-label="Toggle favorite">
        ${favState ? '❤️' : '🤍'}
      </button>
    </header>

    <div class="details-grid">
      <div class="details-left">
        <div class="details-img-card">
          <img src="${imgUrl}" alt="${pokemon.name}" class="details-img">
        </div>
        <p class="flavor-text" style="font-style: italic; margin-top: 1rem; color: var(--color-text-muted);">
          "${flavorText}"
        </p>

        <div class="physical-specs" style="margin-top: 1rem; display: flex; gap: 2rem;">
          <div><strong>Height:</strong> ${(pokemon.height / 10).toFixed(1)} m</div>
          <div><strong>Weight:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</div>
        </div>
        <div style="margin-top: 0.5rem;">
          <strong>Abilities:</strong> <span style="text-transform: capitalize;">${abilitiesStr}</span>
        </div>

        <div style="margin-top: 1.5rem;">
          <a href="#calculator?pokemon=${pokemon.name}" class="btn btn-secondary">Open in Stat Calculator</a>
        </div>
      </div>

      <div class="details-right">
        <h2 style="font-family: var(--font-heading); margin-bottom: 1rem;">Base Stats</h2>
        <div class="base-stats-list">
          ${renderStatBar('HP', statsMap.hp || 0, 255)}
          ${renderStatBar('Attack', statsMap.attack || 0, 190)}
          ${renderStatBar('Defense', statsMap.defense || 0, 230)}
          ${renderStatBar('Sp. Atk', statsMap['special-attack'] || 0, 194)}
          ${renderStatBar('Sp. Def', statsMap['special-defense'] || 0, 230)}
          ${renderStatBar('Speed', statsMap.speed || 0, 180)}
          <div class="stat-total" style="font-weight: 700; margin-top: 0.5rem; text-align: right;">
            Total: ${totalBaseStats}
          </div>
        </div>

        ${renderEvolutionChainSection(evoChain)}
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Wire Favorite Toggle Button
  const favBtn = document.getElementById('fav-btn');
  if (favBtn) {
    favBtn.onclick = () => {
      const currentState = isFavorite(pokemon.id);
      if (currentState) {
        removeFavorite(pokemon.id);
        favBtn.classList.remove('is-fav');
        favBtn.innerHTML = '🤍';
        showToast(`Removed ${pokemon.name} from favorites`, 'info');
      } else {
        addFavorite(pokemon);
        favBtn.classList.add('is-fav');
        favBtn.innerHTML = '❤️';
        showToast(`Added ${pokemon.name} to favorites!`, 'success');
      }
    };
  }
}

function renderStatBar(label, value, maxVal) {
  const percent = Math.min(100, Math.round((value / maxVal) * 100));
  let barColor = 'var(--color-primary)';
  if (value < 50) {barColor = '#F08030';}
  else if (value >= 100) {barColor = '#78C850';}

  return `
    <div class="stat-bar-container">
      <div class="stat-header">
        <span>${label}</span>
        <span>${value}</span>
      </div>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${percent}%; background-color: ${barColor};"></div>
      </div>
    </div>
  `;
}

function renderEvolutionChainSection(evoChain) {
  if (!evoChain || !evoChain.chain) {return '';}

  const stages = [];
  let curr = evoChain.chain;

  while (curr) {
    stages.push({
      name: curr.species.name,
      id: extractIdFromSpeciesUrl(curr.species.url),
    });
    curr = curr.evolves_to && curr.evolves_to.length > 0 ? curr.evolves_to[0] : null;
  }

  if (stages.length <= 1) {return '';}

  const evoMarkup = stages.map((s, index) => `
    <a href="#details/${s.id}" class="evo-step" style="text-align: center; color: var(--color-dark);">
      <div style="font-weight: 700; text-transform: capitalize;">${s.name}</div>
    </a>
    ${index < stages.length - 1 ? '<span style="font-size: 1.2rem; color: var(--color-text-muted);">&rarr;</span>' : ''}
  `).join('');

  return `
    <div class="evolution-section" style="margin-top: 2rem;">
      <h2 style="font-family: var(--font-heading); margin-bottom: 1rem;">Evolution Line</h2>
      <div class="evo-chain-flex" style="display: flex; align-items: center; gap: 1rem; background-color: var(--color-light); padding: 1rem; border-radius: var(--radius-md);">
        ${evoMarkup}
      </div>
    </div>
  `;
}

function extractIdFromSpeciesUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}
