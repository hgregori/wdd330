/**
 * Pokémon Level & Stat Calculator Module
 * Calculates stats based on base stats, level, nature, IVs, and EVs with 510 EV cap guard.
 */

import { getPokemon } from '../api/pokeApi.js';
import { NATURES, calculateAllStats, getNatureMultiplier } from '../utils/statCalc.js';

let currentPokemon = null;

export async function initCalculator(queryParams = {}) {
  populateNatureDropdown();
  setupFormListeners();

  const pokemonName = queryParams.pokemon || 'pikachu';
  const nameInput = document.getElementById('calc-pokemon-input');
  if (nameInput) {nameInput.value = pokemonName;}

  await loadPokemonData(pokemonName);
}

function populateNatureDropdown() {
  const dropdown = document.getElementById('calc-nature');
  if (!dropdown || dropdown.children.length > 0) {return;}

  Object.keys(NATURES).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    const nature = NATURES[name];
    let label = name;
    if (nature.boost && nature.lower) {
      label += ` (+${nature.boost}, -${nature.lower})`;
    } else {
      label += ` (Neutral)`;
    }
    opt.textContent = label;
    dropdown.appendChild(opt);
  });
}

async function loadPokemonData(query) {
  try {
    currentPokemon = await getPokemon(query);
    renderStatInputs();
    updateCalculations();
  } catch (err) {
    console.error('Calculator failed to load Pokémon:', err);
    currentPokemon = null;
    const output = document.getElementById('calc-results-output');
    if (output) {output.innerHTML = `<p class="error-msg">Could not load Pokémon "${query}". Try another name.</p>`;}
  }
}

function renderStatInputs() {
  const container = document.getElementById('stat-inputs-container');
  if (!container || !currentPokemon) {return;}

  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

  container.innerHTML = `
    <div class="stat-row-control" style="font-weight: 700; border-bottom: 2px solid var(--color-border); padding-bottom: 0.4rem;">
      <span>Stat</span>
      <span>Base</span>
      <span>IV (0-31)</span>
      <span>EV (0-252)</span>
    </div>
  ` + statNames.map(name => {
    const baseObj = currentPokemon.stats.find(s => s.stat.name === name);
    const baseVal = baseObj ? baseObj.base_stat : 50;

    return `
      <div class="stat-row-control">
        <label for="iv-${name}" style="text-transform: capitalize;">${name.replace('-', ' ')}</label>
        <span class="base-val">${baseVal}</span>
        <input type="number" id="iv-${name}" class="form-input iv-input" min="0" max="31" value="31">
        <input type="number" id="ev-${name}" class="form-input ev-input" min="0" max="252" value="0">
      </div>
    `;
  }).join('');

  // Re-attach input event listeners to recalculate dynamically
  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateCalculations);
  });
}

function setupFormListeners() {
  const nameInput = document.getElementById('calc-pokemon-input');
  const levelInput = document.getElementById('calc-level');
  const levelDisplay = document.getElementById('calc-level-val');
  const natureSelect = document.getElementById('calc-nature');

  if (nameInput) {
    nameInput.onchange = async () => {
      if (nameInput.value.trim()) {
        await loadPokemonData(nameInput.value.trim());
      }
    };
  }

  if (levelInput) {
    levelInput.oninput = () => {
      if (levelDisplay) {levelDisplay.textContent = levelInput.value;}
      updateCalculations();
    };
  }

  if (natureSelect) {
    natureSelect.onchange = updateCalculations;
  }
}

function updateCalculations() {
  if (!currentPokemon) {return;}

  const level = parseInt(document.getElementById('calc-level')?.value || '50', 10);
  const nature = document.getElementById('calc-nature')?.value || 'Hardy';

  const ivs = {};
  const evs = {};
  let totalEvs = 0;

  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  statNames.forEach(name => {
    const ivVal = parseInt(document.getElementById(`iv-${name}`)?.value || '31', 10);
    const evVal = parseInt(document.getElementById(`ev-${name}`)?.value || '0', 10);
    ivs[name] = isNaN(ivVal) ? 31 : Math.max(0, Math.min(31, ivVal));
    evs[name] = isNaN(evVal) ? 0 : Math.max(0, Math.min(252, evVal));
    totalEvs += evs[name];
  });

  // Check EV Total Guard (Max 510)
  const evBadge = document.getElementById('ev-total-display');
  if (evBadge) {
    evBadge.textContent = `Total EVs: ${totalEvs} / 510`;
    if (totalEvs > 510) {
      evBadge.classList.add('exceeded');
    } else {
      evBadge.classList.remove('exceeded');
    }
  }

  // Calculate final stat output values
  const finalStats = calculateAllStats(currentPokemon.stats, level, nature, ivs, evs, currentPokemon.name);
  renderResultsTable(finalStats, nature);
}

function renderResultsTable(finalStats, nature) {
  const container = document.getElementById('calc-results-output');
  if (!container || !currentPokemon) {return;}

  const imgUrl = currentPokemon.sprites?.other?.['official-artwork']?.front_default || currentPokemon.sprites?.front_default || '';

  const statRows = Object.keys(finalStats).map(name => {
    const mult = getNatureMultiplier(nature, name);
    let natureBadge = '';
    if (mult === 1.1) {natureBadge = ' <span style="color: var(--color-success); font-weight:700;">(+10%)</span>';}
    if (mult === 0.9) {natureBadge = ' <span style="color: var(--color-danger); font-weight:700;">(-10%)</span>';}

    return `
      <tr style="border-bottom: 1px solid var(--color-border);">
        <td style="padding: 0.6rem; text-transform: capitalize; font-weight: 500;">${name.replace('-', ' ')}${natureBadge}</td>
        <td style="padding: 0.6rem; text-align: right; font-weight: 700; font-size: 1.1rem; color: var(--color-primary);">${finalStats[name]}</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <img src="${imgUrl}" alt="${currentPokemon.name}" style="width: 100px; height: 100px; object-fit: contain; margin: 0 auto;">
      <h3 style="text-transform: capitalize; font-family: var(--font-heading);">${currentPokemon.name}</h3>
    </div>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: var(--color-light); text-align: left;">
          <th style="padding: 0.6rem;">Stat</th>
          <th style="padding: 0.6rem; text-align: right;">Calculated Value</th>
        </tr>
      </thead>
      <tbody>
        ${statRows}
      </tbody>
    </table>
  `;
}
