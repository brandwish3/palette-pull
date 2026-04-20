/**
 * Extends token formatting with auto-generated color names
 * resolved via colorNameResolver.
 */

const { generateTokenName } = require('../resolver/colorNameResolver');

/**
 * Assigns unique token names to an array of hex colors.
 * Handles duplicate base names by tracking usage counts.
 * @param {string[]} colors - Array of normalized hex strings
 * @returns {{ name: string, value: string }[]}
 */
function assignTokenNames(colors) {
  const nameCount = {};
  const nameIndex = {};

  return colors.map((hex) => {
    const baseName = generateTokenName(hex, 0);
    if (nameCount[baseName] === undefined) {
      nameCount[baseName] = 0;
    } else {
      nameCount[baseName] += 1;
    }
    nameIndex[hex] = nameCount[baseName];
    return {
      name: generateTokenName(hex, nameCount[baseName]),
      value: hex,
    };
  });
}

/**
 * Formats named color tokens as CSS custom properties.
 * @param {string[]} colors
 * @returns {string}
 */
function formatNamedCSS(colors) {
  const tokens = assignTokenNames(colors);
  const vars = tokens.map((t) => `  --color-${t.name}: ${t.value};`).join('\n');
  return `:root {\n${vars}\n}`;
}

/**
 * Formats named color tokens as a JSON object.
 * @param {string[]} colors
 * @returns {string}
 */
function formatNamedJSON(colors) {
  const tokens = assignTokenNames(colors);
  const obj = {};
  tokens.forEach((t) => {
    obj[t.name] = { value: t.value, type: 'color' };
  });
  return JSON.stringify({ colors: obj }, null, 2);
}

/**
 * Formats named color tokens as SCSS variables.
 * @param {string[]} colors
 * @returns {string}
 */
function formatNamedSCSS(colors) {
  const tokens = assignTokenNames(colors);
  return tokens.map((t) => `$color-${t.name}: ${t.value};`).join('\n');
}

module.exports = { assignTokenNames, formatNamedCSS, formatNamedJSON, formatNamedSCSS };
