/**
 * Analyzes contrast ratios between colors using WCAG 2.1 guidelines.
 */

/**
 * Convert a hex color to relative luminance.
 * @param {string} hex - Hex color string (e.g. '#ff0000')
 * @returns {number} Relative luminance (0-1)
 */
function getLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const toLinear = (c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculate WCAG contrast ratio between two hex colors.
 * @param {string} hex1
 * @param {string} hex2
 * @returns {number} Contrast ratio (1-21)
 */
function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

/**
 * Determine WCAG compliance level for a contrast ratio.
 * @param {number} ratio
 * @returns {{ AA: boolean, AAA: boolean, AALarge: boolean }}
 */
function getWcagLevel(ratio) {
  return {
    AA: ratio >= 4.5,
    AAA: ratio >= 7,
    AALarge: ratio >= 3,
  };
}

/**
 * Analyze contrast between all pairs in a color palette.
 * @param {string[]} colors - Array of hex color strings
 * @returns {Array<{ color1: string, color2: string, ratio: number, wcag: object }>}
 */
function analyzeContrast(colors) {
  const results = [];
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const ratio = getContrastRatio(colors[i], colors[j]);
      results.push({
        color1: colors[i],
        color2: colors[j],
        ratio,
        wcag: getWcagLevel(ratio),
      });
    }
  }
  return results;
}

module.exports = { getLuminance, getContrastRatio, getWcagLevel, analyzeContrast };
