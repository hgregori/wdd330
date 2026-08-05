/**
 * Type Colors Utility
 * Hex color mapping for all 18 Pokémon element types.
 */

export const TYPE_COLORS = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  dark: '#705848',
};

export const ALL_TYPES = Object.keys(TYPE_COLORS);

export function getTypeColor(type) {
  const cleanType = type ? type.toLowerCase() : 'normal';
  return TYPE_COLORS[cleanType] || '#A8A878';
}

/**
 * Creates an HTML string for type badges
 * @param {Array} types - Array of type objects from PokéAPI or string array
 * @returns {string} HTML markup for badges
 */
export function renderTypeBadges(types) {
  if (!types || !Array.isArray(types)) {return '';}
  return types
    .map(t => {
      const typeName = typeof t === 'string' ? t : t.type?.name || 'normal';
      const color = getTypeColor(typeName);
      return `<span class="type-badge" style="background-color: ${color}">${typeName}</span>`;
    })
    .join('');
}
