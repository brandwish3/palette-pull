/**
 * gradientFormatter.js
 * Generates CSS gradient strings and token entries from extracted color palettes.
 */

/**
 * Sorts colors by their perceived lightness (simple luminance approximation).
 * @param {string[]} hexColors
 * @returns {string[]}
 */
function sortByLightness(hexColors) {
  return [...hexColors].sort((a, b) => {
    const lum = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    };
    return lum(a) - lum(b);
  });
}

/**
 * Builds a CSS linear-gradient string from an array of hex colors.
 * @param {string[]} hexColors
 * @param {number} [angle=90]
 * @returns {string}
 */
function buildGradientString(hexColors, angle = 90) {
  if (!hexColors || hexColors.length < 2) {
    throw new Error('At least two colors are required to build a gradient.');
  }
  const stops = hexColors.join(', ');
  return `linear-gradient(${angle}deg, ${stops})`;
}

/**
 * Formats palette colors as a set of CSS gradient custom properties.
 * @param {string[]} hexColors
 * @param {object} [options]
 * @param {number} [options.angle=90]
 * @param {boolean} [options.sorted=true]
 * @returns {string}
 */
function formatGradientCSS(hexColors, options = {}) {
  const { angle = 90, sorted = true } = options;
  const colors = sorted ? sortByLightness(hexColors) : hexColors;
  const gradient = buildGradientString(colors, angle);
  return `:root {\n  --palette-gradient: ${gradient};\n}`;
}

/**
 * Formats palette colors as a JSON gradient token.
 * @param {string[]} hexColors
 * @param {object} [options]
 * @returns {object}
 */
function formatGradientJSON(hexColors, options = {}) {
  const { angle = 90, sorted = true } = options;
  const colors = sorted ? sortByLightness(hexColors) : hexColors;
  return {
    gradient: {
      value: buildGradientString(colors, angle),
      type: 'gradient',
      colors,
      angle,
    },
  };
}

/**
 * Formats palette colors as a SCSS gradient variable.
 * @param {string[]} hexColors
 * @param {object} [options]
 * @returns {string}
 */
function formatGradientSCSS(hexColors, options = {}) {
  const { angle = 90, sorted = true } = options;
  const colors = sorted ? sortByLightness(hexColors) : hexColors;
  const gradient = buildGradientString(colors, angle);
  return `$palette-gradient: ${gradient};`;
}

module.exports = {
  sortByLightness,
  buildGradientString,
  formatGradientCSS,
  formatGradientJSON,
  formatGradientSCSS,
};
