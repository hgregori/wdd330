/**
 * Dream Team Builder Module
 * Manage up to 6 team slots, save/load named teams, and analyze team strengths & weaknesses.
 */

import { getPokemon } from '../api/pokeApi.js';
import { renderTypeBadges, getTypeColor } from '../utils/typeColors.js';
import { getTeams, saveTeam } from '../utils/storage.js';
import { showToast } from '../components/toast.js';

let currentTeam = Array(6).fill(null); // Array of 6 slots

export function initTeamBuilder() {
  renderTeamSlots();
  populateSavedTeamsDropdown();
  setupTeamManagementControls();
  analyzeCurrentTeam();
}

function renderTeamSlots() {
  const container = document.getElementById('team-slots-grid');
  if (!container) {return;}

  container.innerHTML = currentTeam.map((pokemon, index) => {
    if (pokemon) {
      const imgUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || '';
      return `
        <div class="team-slot-card filled">
          <button class="slot-remove-btn" onclick="removeSlotPokemon(${index})" aria-label="Remove Pokémon">&times;</button>
          <img src="${imgUrl}" alt="${pokemon.name}" style="width: 90px; height: 90px; object-fit: contain; margin-bottom: 0.5rem;">
          <h4 style="text-transform: capitalize; font-family: var(--font-heading); margin-bottom: 0.4rem;">${pokemon.name}</h4>
          <div>${renderTypeBadges(pokemon.types)}</div>
        </div>
      `;
    }

    return `
      <div class="team-slot-card">
        <span style="font-size: 2rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">+</span>
        <p style="font-weight: 500; font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--color-text-muted);">Slot ${index + 1}</p>
        <div style="width: 100%;">
          <input type="text" class="form-input slot-search-input" data-index="${index}" placeholder="Add Pokémon…" aria-label="Add Pokémon to slot ${index + 1}">
        </div>
      </div>
    `;
  }).join('');

  // Attach search listeners for empty slots
  container.querySelectorAll('.slot-search-input').forEach(input => {
    input.addEventListener('change', async (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const query = e.target.value.trim();
      if (query) {
        try {
          const pokemon = await getPokemon(query);
          currentTeam[idx] = pokemon;
          renderTeamSlots();
          analyzeCurrentTeam();
        } catch (err) {
          console.error('Error adding slot Pokémon:', err);
          showToast(`Could not find Pokémon "${query}"`, 'error');
        }
      }
    });
  });
}

// Make removeSlotPokemon globally available on window for inline onclick handlers
window.removeSlotPokemon = function(index) {
  currentTeam[index] = null;
  renderTeamSlots();
  analyzeCurrentTeam();
};

function setupTeamManagementControls() {
  const saveBtn = document.getElementById('save-team-btn');
  const clearBtn = document.getElementById('clear-team-btn');
  const nameInput = document.getElementById('team-name-input');
  const selectDropdown = document.getElementById('saved-teams-select');

  if (saveBtn) {
    saveBtn.onclick = () => {
      const teamName = nameInput?.value.trim() || 'My Dream Team';
      const activePokemon = currentTeam.filter(Boolean);

      if (activePokemon.length === 0) {
        showToast('Cannot save an empty team. Add at least 1 Pokémon.', 'error');
        return;
      }

      saveTeam(teamName, currentTeam);
      populateSavedTeamsDropdown();
      showToast(`Team "${teamName}" saved successfully!`, 'success');
    };
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      currentTeam = Array(6).fill(null);
      renderTeamSlots();
      analyzeCurrentTeam();
      showToast('Team cleared.', 'info');
    };
  }

  if (selectDropdown) {
    selectDropdown.onchange = () => {
      const selectedName = selectDropdown.value;
      if (!selectedName) {return;}

      const teams = getTeams();
      if (teams[selectedName]) {
        currentTeam = teams[selectedName];
        if (nameInput) {nameInput.value = selectedName;}
        renderTeamSlots();
        analyzeCurrentTeam();
        showToast(`Loaded team "${selectedName}"`, 'info');
      }
    };
  }
}

function populateSavedTeamsDropdown() {
  const dropdown = document.getElementById('saved-teams-select');
  if (!dropdown) {return;}

  const teams = getTeams();
  const names = Object.keys(teams);

  dropdown.innerHTML = `<option value="">-- Select Saved Team --</option>` +
    names.map(name => `<option value="${name}">${name}</option>`).join('');
}

/**
 * Team Strength & Weakness Analyzer
 */
function analyzeCurrentTeam() {
  const container = document.getElementById('team-analysis-container');
  if (!container) {return;}

  const activeTeam = currentTeam.filter(Boolean);
  if (activeTeam.length === 0) {
    container.innerHTML = `
      <h2>Team Strength & Weakness Analyzer</h2>
      <p style="color: var(--color-text-muted);">Add Pokémon to your team slots above to see a detailed type coverage & vulnerability analysis.</p>
    `;
    return;
  }

  // Count elemental types present in team
  const typeCounts = {};
  activeTeam.forEach(p => {
    p.types.forEach(tObj => {
      const tName = tObj.type.name;
      typeCounts[tName] = (typeCounts[tName] || 0) + 1;
    });
  });

  const typeBadgesMarkup = Object.keys(typeCounts).map(t => {
    const color = getTypeColor(t);
    return `<span class="type-badge" style="background-color: ${color}; margin-right: 0.3rem;">${t} (${typeCounts[t]})</span>`;
  }).join('');

  // Determine team balance rating
  const uniqueTypes = Object.keys(typeCounts).length;
  let ratingText = 'Needs Diversity';
  let ratingColor = 'var(--color-warning)';
  if (uniqueTypes >= 5) {
    ratingText = 'Excellent Type Balance!';
    ratingColor = 'var(--color-success)';
  } else if (uniqueTypes >= 3) {
    ratingText = 'Good Type Diversity';
    ratingColor = 'var(--color-primary)';
  }

  container.innerHTML = `
    <h2 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">Team Analysis (${activeTeam.length}/6 Pokémon)</h2>
    <div style="margin-bottom: 1rem;">
      <strong>Team Rating:</strong> <span style="color: ${ratingColor}; font-weight: 700;">${ratingText}</span>
    </div>
    <div style="margin-bottom: 1rem;">
      <strong>Types Represented:</strong>
      <div style="margin-top: 0.4rem;">${typeBadgesMarkup}</div>
    </div>
    <div style="background-color: var(--color-light); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);">
      <h4 style="font-family: var(--font-heading); margin-bottom: 0.4rem;">Team Summary</h4>
      <p style="font-size: 0.95rem; color: var(--color-text-muted);">
        Your squad has ${activeTeam.length} Pokémon representing ${uniqueTypes} unique elemental types. 
        ${uniqueTypes < 4 ? 'Consider adding different types to improve defensive coverage against varied opponents.' : 'Your team has strong elemental variety.'}
      </p>
    </div>
  `;
}
