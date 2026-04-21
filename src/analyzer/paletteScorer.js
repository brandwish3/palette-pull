/**
 * paletteScorer.js
 * Scores a color palette based on diversity, contrast, and accessibility.
 */

const { getContrastRatio, getWcagLevel } = require('./contrastAnalyzer');

/**
 * Calculates hue spread score (0-100) based on distribution across hue wheel.
 * @param {string[]} hexColors
 * @returns {number}
 */
function calcHueSpread(hexColors) {
  const hues = hexColors.map((hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    if (delta === 0) return 0;
    let hue;
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    return Math.round(hue * 60 + 360) % 360;
  });

  if (hues.length < 2) return 0;
  hues.sort((a, b) => a - b);
  const gaps = hues.map((h, i) => {
    const next = hues[(i + 1) % hues.length];
    return i === hues.length - 1 ? 360 - h + hues[0] : next - h;
  });
  const maxGap = Math.max(...gaps);
  return Math.round((1 - maxGap / 360) * 100);
}

/**
 * Calculates an accessibility score based on WCAG contrast pairs.
 * @param {string[]} hexColors
 * @returns {number}
 */
function calcAccessibilityScore(hexColors) {
  let passed = 0;
  let total = 0;
  for (let i = 0; i < hexColors.length; i++) {
    for (let j = i + 1; j < hexColors.length; j++) {
      const ratio = getContrastRatio(hexColors[i], hexColors[j]);
      const level = getWcagLevel(ratio);
      total++;
      if (level === 'AA' || level === 'AAA') passed++;
    }
  }
  return total === 0 ? 0 : Math.round((passed / total) * 100);
}

/**
 * Scores a palette and returns a breakdown.
 * @param {string[]} hexColors
 * @returns {{ diversity: number, accessibility: number, size: number, overall: number }}
 */
function scorePalette(hexColors) {
  const diversity = calcHueSpread(hexColors);
  const accessibility = calcAccessibilityScore(hexColors);
  const size = Math.min(hexColors.length * 10, 100);
  const overall = Math.round(diversity * 0.4 + accessibility * 0.4 + size * 0.2);
  return { diversity, accessibility, size, overall };
}

module.exports = { calcHueSpread, calcAccessibilityScore, scorePalette };
