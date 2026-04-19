/**
 * Formats extracted colors into various design token formats.
 */

/**
 * Format colors as CSS custom properties
 * @param {string[]} colors - Array of hex color strings
 * @param {string} prefix - Variable name prefix
 * @returns {string}
 */
function formatCSS(colors, prefix = 'color') {
  const vars = colors
    .map((color, i) => `  --${prefix}-${i + 1}: ${color};`)
    .join('\n');
  return `:root {\n${vars}\n}`;
}

/**
 * Format colors as a JSON token object
 * @param {string[]} colors - Array of hex color strings
 * @param {string} prefix - Token name prefix
 * @returns {object}
 */
function formatJSON(colors, prefix = 'color') {
  const tokens = {};
  colors.forEach((color, i) => {
    tokens[`${prefix}-${i + 1}`] = { value: color, type: 'color' };
  });
  return tokens;
}

/**
 * Format colors as SCSS variables
 * @param {string[]} colors - Array of hex color strings
 * @param {string} prefix - Variable name prefix
 * @returns {string}
 */
function formatSCSS(colors, prefix = 'color') {
  return colors
    .map((color, i) => `$${prefix}-${i + 1}: ${color};`)
    .join('\n');
}

/**
 * Format colors using the specified format
 * @param {string[]} colors
 * @param {'css'|'json'|'scss'} format
 * @param {string} prefix
 * @returns {string}
 */
function formatTokens(colors, format = 'json', prefix = 'color') {
  switch (format) {
    case 'css':
      return formatCSS(colors, prefix);
    case 'scss':
      return formatSCSS(colors, prefix);
    case 'json':
      return JSON.stringify(formatJSON(colors, prefix), null, 2);
    default:
      throw new Error(`Unsupported format: "${format}". Use css, scss, or json.`);
  }
}

module.exports = { formatCSS, formatJSON, formatSCSS, formatTokens };
