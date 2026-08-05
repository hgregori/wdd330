/**
 * Storage Utility
 * Manages localStorage for Favorites, Teams, Preferences, and Recent Searches.
 */

const KEYS = {
  FAVORITES: 'pokesphere_favorites',
  TEAMS: 'pokesphere_teams',
  PREFERENCES: 'pokesphere_preferences',
  RECENT_SEARCHES: 'pokesphere_recent_searches',
};

// --- FAVORITES ---
export function getFavorites() {
  try {
    const data = localStorage.getItem(KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to get favorites from storage:', err);
    return [];
  }
}

export function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.some(p => String(p.id) === String(id));
}

export function addFavorite(pokemon) {
  const favorites = getFavorites();
  if (!isFavorite(pokemon.id)) {
    favorites.push({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      image: pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default,
    });
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
  }
  return false;
}

export function removeFavorite(id) {
  let favorites = getFavorites();
  favorites = favorites.filter(p => String(p.id) !== String(id));
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
}

// --- TEAMS ---
export function getTeams() {
  try {
    const data = localStorage.getItem(KEYS.TEAMS);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Failed to get teams from storage:', err);
    return {};
  }
}

export function getTeam(name) {
  const teams = getTeams();
  return teams[name] || null;
}

export function saveTeam(name, pokemonList) {
  const teams = getTeams();
  teams[name] = pokemonList;
  localStorage.setItem(KEYS.TEAMS, JSON.stringify(teams));
}

export function deleteTeam(name) {
  const teams = getTeams();
  delete teams[name];
  localStorage.setItem(KEYS.TEAMS, JSON.stringify(teams));
}

// --- PREFERENCES ---
export function getPreferences() {
  try {
    const data = localStorage.getItem(KEYS.PREFERENCES);
    return data ? JSON.parse(data) : { theme: 'light', defaultRegion: 'kanto' };
  } catch (err) {
    console.error('Failed to get preferences from storage:', err);
    return { theme: 'light', defaultRegion: 'kanto' };
  }
}

export function savePreferences(prefs) {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(updated));
}

// --- RECENT SEARCHES ---
export function getRecentSearches() {
  try {
    const data = localStorage.getItem(KEYS.RECENT_SEARCHES);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to get recent searches from storage:', err);
    return [];
  }
}

export function addRecentSearch(term) {
  if (!term || typeof term !== 'string') {return;}
  const cleanTerm = term.trim().toLowerCase();
  if (!cleanTerm) {return;}

  let searches = getRecentSearches();
  searches = searches.filter(s => s !== cleanTerm);
  searches.unshift(cleanTerm);
  if (searches.length > 5) {
    searches.pop();
  }
  localStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(searches));
}
