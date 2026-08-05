/**
 * PokéAPI Wrapper
 * Handles API calls to https://pokeapi.co/api/v2/ with caching
 */

const BASE_URL = 'https://pokeapi.co/api/v2';
const cache = new Map();

/**
 * Fetch wrapper with in-memory caching
 */
async function fetchWithCache(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Pokémon not found');
      }
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch (err) {
    console.error(`Fetch failed for URL: ${url}`, err);
    throw err;
  }
}

/**
 * Get individual Pokémon data by name or ID
 */
export async function getPokemon(nameOrId) {
  if (!nameOrId) {throw new Error('Name or ID is required');}
  const cleanQuery = String(nameOrId).trim().toLowerCase();
  return fetchWithCache(`${BASE_URL}/pokemon/${cleanQuery}`);
}

/**
 * Get Pokémon Species info (flavor text, evolution chain URL, generation)
 */
export async function getPokemonSpecies(idOrName) {
  if (!idOrName) {throw new Error('ID or Name is required');}
  const cleanQuery = String(idOrName).trim().toLowerCase();
  return fetchWithCache(`${BASE_URL}/pokemon-species/${cleanQuery}`);
}

/**
 * Get evolution chain by full URL
 */
export async function getEvolutionChainByUrl(url) {
  if (!url) {throw new Error('Evolution chain URL is required');}
  return fetchWithCache(url);
}

/**
 * Get paginated Pokémon list
 */
export async function getPokemonList(limit = 24, offset = 0) {
  return fetchWithCache(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
}

/**
 * Get all Pokémon belonging to a specific type
 */
export async function getPokemonByType(type) {
  if (!type || type === 'all') {return null;}
  const cleanType = type.trim().toLowerCase();
  const data = await fetchWithCache(`${BASE_URL}/type/${cleanType}`);
  // Transform type structure to list of Pokémon objects
  return data.pokemon.map(p => p.pokemon);
}

/**
 * Get encounter locations for a Pokémon
 */
export async function getLocationEncounters(idOrName) {
  const cleanQuery = String(idOrName).trim().toLowerCase();
  return fetchWithCache(`${BASE_URL}/pokemon/${cleanQuery}/encounters`);
}

/**
 * Get list of all types
 */
export async function getAllTypes() {
  return fetchWithCache(`${BASE_URL}/type`);
}
