/**
 * Resolves human-readable names for hex color values
 * using nearest-match lookup against a curated color list.
 */

const NAMED_COLORS = {
  '#000000': 'black',
  '#ffffff': 'white',
  '#ff0000': 'red',
  '#00ff00': 'green',
  '#0000ff': 'blue',
  '#ffff00': 'yellow',
  '#ff00ff': 'magenta',
  '#00ffff': 'cyan',
  '#ff8800': 'orange',
  '#800080': 'purple',
  '#ffc0cb': 'pink',
  '#a52a2a': 'brown',
  '#808080': 'gray',
  '#c0c0c0': 'silver',
  '#ffd700': 'gold',
  '#4b0082': 'indigo',
  '#ee82ee': 'violet',
  '#40e0d0': 'turquoise',
  '#f5f5dc': 'beige',
  '#ffe4c4': 'bisque',
};

/**
 * Parses a hex color string into [r, g, b] components.
 * @param {string} hex - Normalized 6-digit hex string (e.g. '#ff0000')
 * @returns {number[]}
 * @throws {Error} If the hex string is not a valid 6-digit hex color
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(clean)) {
    throw new Error(`Invalid hex color: "${hex}". Expected a 6-digit hex string (e.g. '#ff0000').`);
  }
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

/**
 * Calculates Euclidean distance between two RGB colors.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
function colorDistance(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2) +
    Math.pow(a[2] - b[2], 2)
  );
}

/**
 * Resolves the closest named color for a given hex value.
 * @param {string} hex - Normalized hex color string
 * @returns {string} Color name
 * @throws {Error} If the hex string is invalid
 */
function resolveColorName(hex) {
  const normalized = hex.toLowerCase();
  if (NAMED_COLORS[normalized]) {
    return NAMED_COLORS[normalized];
  }

  const target = hexToRgb(normalized);
  let closestName = 'color';
  let minDistance = Infinity;

  for (const [namedHex, name] of Object.entries(NAMED_COLORS)) {
    const dist = colorDistance(target, hexToRgb(namedHex));
    if (dist < minDistance) {
      minDistance = dist;
      closestName = name;
    }
  }

  return closestName;
}

/**
 * Generates a unique token name for a color, appending an index if needed.
 * @param {string} hex
 * @param {number} index
 * @returns {string}
 */
function generateTokenName(hex, index) {
  const base = resolveColorName(hex);
  return index === 0 ? base : `${base}-${index + 1}`;
}

module.exports = { resolveColorName, generateTokenName, hexToRgb, colorDistance };
