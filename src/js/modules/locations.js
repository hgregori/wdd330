/**
 * Pokémon Locations & Regional Maps Module
 * Search wild encounter locations for Pokémon and display region information cards.
 */

import { getLocationEncounters, getPokemon } from '../api/pokeApi.js';
import { showToast } from '../components/toast.js';

export async function initLocations() {
  setupLocationSearchForm();
  await loadRegionsOverview();
}

function setupLocationSearchForm() {
  const form = document.getElementById('location-search-form');
  const input = document.getElementById('location-search-input');

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const term = input?.value.trim();
      if (term) {
        await searchPokemonLocations(term);
      }
    };
  }
}

async function searchPokemonLocations(term) {
  const container = document.getElementById('location-results-container');
  if (!container) {return;}

  container.innerHTML = `<div class="spinner" aria-label="Searching locations"></div>`;

  try {
    const pokemon = await getPokemon(term);
    const encounters = await getLocationEncounters(pokemon.id);

    renderEncounters(container, pokemon, encounters);
  } catch (err) {
    console.error('Location search error:', err);
    container.innerHTML = `
      <div style="background-color: var(--color-card-bg); padding: 1.5rem; border-radius: var(--radius-md); text-align: center;">
        <h3>No Location Data Found</h3>
        <p style="color: var(--color-text-muted);">Could not find wild encounter locations for "${term}". This Pokémon may be an event exclusive, starter, or legend.</p>
      </div>
    `;
    showToast(`No locations found for "${term}"`, 'error');
  }
}

function renderEncounters(container, pokemon, encounters) {
  const imgUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || '';

  if (!encounters || encounters.length === 0) {
    container.innerHTML = `
      <div style="background-color: var(--color-card-bg); padding: 1.5rem; border-radius: var(--radius-md); text-align: center;">
        <img src="${imgUrl}" alt="${pokemon.name}" style="width: 80px; height: 80px; object-fit: contain; margin: 0 auto 0.5rem auto;">
        <h3 style="text-transform: capitalize;">${pokemon.name}</h3>
        <p style="color: var(--color-text-muted);">No wild encounter locations recorded in PokéAPI for this Pokémon (likely acquired via evolution, trade, or gift).</p>
      </div>
    `;
    return;
  }

  // Group encounter locations by area
  const locationCards = encounters.map(enc => {
    const locationName = enc.location_area.name.replace(/-/g, ' ');
    const versionDetails = enc.version_details.map(v => {
      const versionName = v.version.name.replace(/-/g, ' ');
      const maxChance = Math.max(...v.encounter_details.map(d => d.chance));
      return `<span style="display: inline-block; background-color: var(--color-light); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.8rem; margin: 0.2rem;">${versionName} (${maxChance}% chance)</span>`;
    }).join(' ');

    return `
      <div style="background-color: var(--color-card-bg); padding: 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-left: 4px solid var(--color-primary);">
        <h4 style="text-transform: capitalize; font-family: var(--font-heading); color: var(--color-dark); margin-bottom: 0.4rem;">${locationName}</h4>
        <div>${versionDetails}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="background-color: var(--color-card-bg); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
        <img src="${imgUrl}" alt="${pokemon.name}" style="width: 60px; height: 60px; object-fit: contain;">
        <div>
          <h2 style="text-transform: capitalize; font-family: var(--font-heading);">${pokemon.name} Locations</h2>
          <p style="color: var(--color-text-muted); font-size: 0.9rem;">Found in ${encounters.length} location areas across games</p>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${locationCards}
      </div>
    </div>
  `;
}

async function loadRegionsOverview() {
  const container = document.getElementById('regions-grid');
  if (!container) {return;}

  try {
    const res = await fetch('/public/json/regions.json');
    if (!res.ok) {throw new Error('Failed to load regions.json');}
    const regions = await res.json();

    container.innerHTML = regions.map(reg => `
      <div class="region-card" style="border-left-color: ${reg.color || 'var(--color-primary)'};">
        <h3>${reg.name}</h3>
        <div class="region-gen">Generation ${reg.generation}</div>
        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">${reg.description}</p>
        <div style="font-size: 0.8rem; font-weight: 500;">
          <strong>Games:</strong> ${reg.games.join(', ')}
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed loading regions:', err);
  }
}
