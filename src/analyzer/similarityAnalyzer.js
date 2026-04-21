const { hexToRgb, colorDistance } = require('../resolver/colorNameResolver');

/**
 * Groups colors by perceptual similarity using a distance threshold.
 * @param {string[]} hexColors
 * @param {number} threshold - max distance to consider similar (default 30)
 * @returns {{ group: string[], representative: string }[]}
 */
function groupSimilarColors(hexColors, threshold = 30) {
  const visited = new Set();
  const groups = [];

  for (const color of hexColors) {
    if (visited.has(color)) continue;

    const group = [color];
    visited.add(color);

    for (const other of hexColors) {
      if (visited.has(other)) continue;
      const dist = colorDistance(hexToRgb(color), hexToRgb(other));
      if (dist <= threshold) {
        group.push(other);
        visited.add(other);
      }
    }

    groups.push({
      group,
      representative: group[0],
    });
  }

  return groups;
}

/**
 * Finds pairs of colors that are too similar (below threshold).
 * @param {string[]} hexColors
 * @param {number} threshold
 * @returns {{ a: string, b: string, distance: number }[]}
 */
function findRedundantPairs(hexColors, threshold = 15) {
  const pairs = [];
  for (let i = 0; i < hexColors.length; i++) {
    for (let j = i + 1; j < hexColors.length; j++) {
      const dist = colorDistance(hexToRgb(hexColors[i]), hexToRgb(hexColors[j]));
      if (dist <= threshold) {
        pairs.push({ a: hexColors[i], b: hexColors[j], distance: Math.round(dist) });
      }
    }
  }
  return pairs;
}

/**
 * Calculates average pairwise distance (diversity score).
 * @param {string[]} hexColors
 * @returns {number}
 */
function calcDiversityScore(hexColors) {
  if (hexColors.length < 2) return 0;
  let total = 0;
  let count = 0;
  for (let i = 0; i < hexColors.length; i++) {
    for (let j = i + 1; j < hexColors.length; j++) {
      total += colorDistance(hexToRgb(hexColors[i]), hexToRgb(hexColors[j]));
      count++;
    }
  }
  return Math.round(total / count);
}

module.exports = { groupSimilarColors, findRedundantPairs, calcDiversityScore };
