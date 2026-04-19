/**
 * Extracts color values from various source types.
 * Supports: hex, rgb, rgba, hsl color formats.
 */

const HEX_REGEX = /#([0-9a-fA-F]{3,8})\b/g;
const RGB_REGEX = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/g;
const HSL_REGEX = /hsla?\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%(?:\s*,\s*[\d.]+)?\s*\)/g;

/**
 * Normalizes a hex color to 6-digit lowercase format.
 * @param {string} hex
 * @returns {string}
 */
function normalizeHex(hex) {
  const val = hex.replace('#', '');
  if (val.length === 3) {
    return '#' + val.split('').map(c => c + c).join('');
  }
  return '#' + val.slice(0, 6).toLowerCase();
}

/**
 * Extracts all unique color strings from a block of CSS/HTML text.
 * @param {string} text
 * @returns {string[]}
 */
function extractColors(text) {
  const found = new Set();

  const hexMatches = text.match(HEX_REGEX) || [];
  hexMatches.forEach(h => found.add(normalizeHex(h)));

  const rgbMatches = text.match(RGB_REGEX) || [];
  rgbMatches.forEach(r => found.add(r.replace(/\s+/g, '').toLowerCase()));

  const hslMatches = text.match(HSL_REGEX) || [];
  hslMatches.forEach(h => found.add(h.replace(/\s+/g, '').toLowerCase()));

  return Array.from(found);
}

/**
 * Deduplicates and sorts an array of color strings.
 * @param {string[]} colors
 * @returns {string[]}
 */
function deduplicateColors(colors) {
  return Array.from(new Set(colors)).sort();
}

module.exports = { extractColors, deduplicateColors, normalizeHex };
