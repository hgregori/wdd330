/**
 * Search Module
 * Search Pokémon by name, Pokédex #, element type, and generation with pagination.
 */

import { getPokemon, getPokemonList, getPokemonByType } from '../api/pokeApi.js';
import { ALL_TYPES, renderTypeBadges } from '../utils/typeColors.js';
import { addRecentSearch } from '../utils/storage.js';
import { showToast } from '../components/toast.js';

const PAGE_SIZE = 24;
let currentPage = 1;
let currentResults = [];
let totalResultsCount = 0;

export async function initSearch(queryParams = {}) {
  populateTypeDropdown();
  setupSearchForm();

  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');

  // Check if query params passed from URL hash
  if (queryParams.q) {
    if (searchInput) {searchInput.value = queryParams.q;}
    await executeSearch(queryParams.q);
  } else if (queryParams.type) {
    if (typeFilter) {typeFilter.value = queryParams.type;}
    await executeTypeFilter(queryParams.type);
  } else {
    // Default initial view: load first page of Pokémon
    await loadDefaultPokemonPage(1);
  }
}

function populateTypeDropdown() {
  const dropdown = document.getElementById('type-filter');
  if (!dropdown || dropdown.children.length > 1) {return;} // already populated

  ALL_TYPES.forEach(type => {
    const opt = document.createElement('option');
    opt.value = type;
    opt.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    dropdown.appendChild(opt);
  });
}

function setupSearchForm() {
  const form = document.getElementById('search-form');
  const typeFilter = document.getElementById('type-filter');

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const term = document.getElementById('search-input')?.value.trim();
      const type = typeFilter?.value;

      if (term) {
        addRecentSearch(term);
        await executeSearch(term);
      } else if (type && type !== 'all') {
        await executeTypeFilter(type);
      } else {
        await loadDefaultPokemonPage(1);
      }
    };
  }

  if (typeFilter) {
    typeFilter.onchange = async () => {
      const type = typeFilter.value;
      if (type !== 'all') {
        await executeTypeFilter(type);
      } else {
        await loadDefaultPokemonPage(1);
      }
    };
  }
}

async function loadDefaultPokemonPage(page = 1) {
  currentPage = page;
  const offset = (page - 1) * PAGE_SIZE;
  const grid = document.getElementById('search-results-grid');
  const countEl = document.getElementById('search-results-count');

  renderSkeletons(grid);

  try {
    const data = await getPokemonList(PAGE_SIZE, offset);
    totalResultsCount = data.count;
    if (countEl) {countEl.textContent = `Showing Pokémon ${offset + 1}–${Math.min(offset + PAGE_SIZE, totalResultsCount)} of ${totalResultsCount}`;}

    // Fetch detail for each Pokémon in current page
    const detailsPromises = data.results.map(item => getPokemon(item.name));
    currentResults = await Promise.all(detailsPromises);

    renderResultsGrid(grid, currentResults);
    renderPaginationControls(Math.ceil(totalResultsCount / PAGE_SIZE));
  } catch (err) {
    console.error('Search load error:', err);
    if (grid) {grid.innerHTML = `<p class="error-msg">Error fetching Pokémon data. Please check your connection.</p>`;}
  }
}

async function executeSearch(term) {
  const grid = document.getElementById('search-results-grid');
  const countEl = document.getElementById('search-results-count');

  renderSkeletons(grid);

  try {
    const pokemon = await getPokemon(term);
    currentResults = [pokemon];
    totalResultsCount = 1;
    if (countEl) {countEl.textContent = `Found 1 result for "${term}"`;}

    renderResultsGrid(grid, currentResults);
    clearPagination();
  } catch (err) {
    console.error('Search error for term:', term, err);
    if (countEl) {countEl.textContent = `No Pokémon found matching "${term}"`;}
    if (grid) {grid.innerHTML = `<p class="error-msg">No Pokémon found matching "${term}". Try searching by exact name or Pokédex number.</p>`;}
    clearPagination();
    showToast(`No Pokémon found for "${term}"`, 'error');
  }
}

async function executeTypeFilter(type) {
  const grid = document.getElementById('search-results-grid');
  const countEl = document.getElementById('search-results-count');

  renderSkeletons(grid);

  try {
    const pokemonList = await getPokemonByType(type);
    if (!pokemonList || pokemonList.length === 0) {
      if (grid) {grid.innerHTML = `<p>No Pokémon found for type: ${type}</p>`;}
      return;
    }

    // Limit first 30 for performance
    const sample = pokemonList.slice(0, 30);
    const detailPromises = sample.map(item => getPokemon(item.name));
    currentResults = await Promise.all(detailPromises);
    totalResultsCount = pokemonList.length;

    if (countEl) {countEl.textContent = `Showing ${sample.length} of ${totalResultsCount} ${type.toUpperCase()}-type Pokémon`;}

    renderResultsGrid(grid, currentResults);
    clearPagination();
  } catch (err) {
    console.error('Type filter error:', err);
    if (grid) {grid.innerHTML = `<p class="error-msg">Error filtering by type.</p>`;}
  }
}

function renderSkeletons(grid) {
  if (!grid) {return;}
  grid.innerHTML = Array(8).fill(0).map(() => `
    <div class="pokemon-card skeleton-card">
      <div class="skeleton" style="height: 120px; margin-bottom: 0.5rem;"></div>
      <div class="skeleton" style="height: 20px; width: 60%; margin: 0 auto 0.5rem auto;"></div>
      <div class="skeleton" style="height: 15px; width: 40%; margin: 0 auto;"></div>
    </div>
  `).join('');
}

function renderResultsGrid(grid, list) {
  if (!grid) {return;}
  grid.innerHTML = list.map(pokemon => {
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
  }).join('');
}

function renderPaginationControls(totalPages) {
  const container = document.getElementById('search-pagination');
  if (!container || totalPages <= 1) {
    clearPagination();
    return;
  }

  const html = `
    <button class="btn btn-outline" ${currentPage === 1 ? 'disabled' : ''} id="prev-page-btn">Previous</button>
    <span style="align-self: center; font-weight: 500;">Page ${currentPage} of ${totalPages}</span>
    <button class="btn btn-outline" ${currentPage === totalPages ? 'disabled' : ''} id="next-page-btn">Next</button>
  `;

  container.innerHTML = html;

  document.getElementById('prev-page-btn')?.addEventListener('click', () => {
    if (currentPage > 1) {loadDefaultPokemonPage(currentPage - 1);}
  });

  document.getElementById('next-page-btn')?.addEventListener('click', () => {
    if (currentPage < totalPages) {loadDefaultPokemonPage(currentPage + 1);}
  });
}

function clearPagination() {
  const container = document.getElementById('search-pagination');
  if (container) {container.innerHTML = '';}
}
