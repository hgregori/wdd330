/**
 * Stat Calculation Utility
 * Standard Pokémon Gen III+ Stat Formulas & Natures
 */

export const NATURES = {
  Hardy: { boost: null, lower: null },
  Lonely: { boost: 'attack', lower: 'defense' },
  Brave: { boost: 'attack', lower: 'speed' },
  Adamant: { boost: 'attack', lower: 'special-attack' },
  Naughty: { boost: 'attack', lower: 'special-defense' },
  Bold: { boost: 'defense', lower: 'attack' },
  Docile: { boost: null, lower: null },
  Relaxed: { boost: 'defense', lower: 'speed' },
  Impish: { boost: 'defense', lower: 'special-attack' },
  Lax: { boost: 'defense', lower: 'special-defense' },
  Timid: { boost: 'speed', lower: 'attack' },
  Hasty: { boost: 'speed', lower: 'defense' },
  Jolly: { boost: 'speed', lower: 'special-attack' },
  Naive: { boost: 'speed', lower: 'special-defense' },
  Modest: { boost: 'special-attack', lower: 'attack' },
  Mild: { boost: 'special-attack', lower: 'defense' },
  Quiet: { boost: 'special-attack', lower: 'speed' },
  Bashful: { boost: null, lower: null },
  Rash: { boost: 'special-attack', lower: 'special-defense' },
  Calm: { boost: 'special-defense', lower: 'attack' },
  Gentle: { boost: 'special-defense', lower: 'defense' },
  Sassy: { boost: 'special-defense', lower: 'speed' },
  Careful: { boost: 'special-defense', lower: 'special-attack' },
  Quirky: { boost: null, lower: null },
};

/**
 * Calculates HP stat
 */
export function calcHP(base, iv = 31, ev = 0, level = 50, pokemonName = '') {
  if (pokemonName.toLowerCase() === 'shedinja') {return 1;}
  const evBonus = Math.floor(ev / 4);
  return Math.floor(((2 * base + iv + evBonus) * level) / 100) + level + 10;
}

/**
 * Calculates any non-HP stat
 */
export function calcOtherStat(statName, base, iv = 31, ev = 0, level = 50, nature = 'Hardy') {
  const evBonus = Math.floor(ev / 4);
  const baseCalc = Math.floor(((2 * base + iv + evBonus) * level) / 100) + 5;
  const natureMult = getNatureMultiplier(nature, statName);
  return Math.floor(baseCalc * natureMult);
}

/**
 * Gets nature multiplier for a given stat (0.9, 1.0, or 1.1)
 */
export function getNatureMultiplier(natureName, statName) {
  const nature = NATURES[natureName];
  if (!nature) {return 1.0;}

  // Standardize statName
  const normalized = statName.toLowerCase().replace(/\s+/g, '-');

  if (nature.boost === normalized) {return 1.1;}
  if (nature.lower === normalized) {return 0.9;}
  return 1.0;
}

/**
 * Calculates total stats block for a Pokémon
 */
export function calculateAllStats(statsArray, level = 50, nature = 'Hardy', ivs = {}, evs = {}, pokemonName = '') {
  const result = {};

  statsArray.forEach(s => {
    const statName = s.stat.name;
    const base = s.base_stat;
    const iv = ivs[statName] !== undefined ? parseInt(ivs[statName], 10) : 31;
    const ev = evs[statName] !== undefined ? parseInt(evs[statName], 10) : 0;

    if (statName === 'hp') {
      result[statName] = calcHP(base, iv, ev, level, pokemonName);
    } else {
      result[statName] = calcOtherStat(statName, base, iv, ev, level, nature);
    }
  });

  return result;
}
