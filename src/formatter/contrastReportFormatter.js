/**
 * Formats contrast analysis results into human-readable or structured output.
 */

const { analyzeContrast } = require('../analyzer/contrastAnalyzer');

/**
 * Format a single contrast result as a readable line.
 * @param {{ color1: string, color2: string, ratio: number, wcag: object }} result
 * @returns {string}
 */
function formatContrastLine(result) {
  const { color1, color2, ratio, wcag } = result;
  const levels = [];
  if (wcag.AAA) levels.push('AAA');
  else if (wcag.AA) levels.push('AA');
  else if (wcag.AALarge) levels.push('AA Large');
  else levels.push('FAIL');
  return `${color1} / ${color2}  →  ${ratio}:1  [${levels.join(', ')}]`;
}

/**
 * Generate a plain-text contrast report for a palette.
 * @param {string[]} colors
 * @returns {string}
 */
function generateContrastReport(colors) {
  const results = analyzeContrast(colors);
  if (results.length === 0) return 'No color pairs to compare.';

  const lines = [
    `Contrast Report (${colors.length} colors, ${results.length} pairs)`,
    '─'.repeat(52),
    ...results.map(formatContrastLine),
  ];
  return lines.join('\n');
}

/**
 * Format contrast results as a JSON-serializable array.
 * @param {string[]} colors
 * @returns {object[]}
 */
function generateContrastJSON(colors) {
  return analyzeContrast(colors).map(({ color1, color2, ratio, wcag }) => ({
    pair: [color1, color2],
    ratio,
    wcag,
  }));
}

/**
 * Print the contrast report to stdout.
 * @param {string[]} colors
 */
function printContrastReport(colors) {
  console.log(generateContrastReport(colors));
}

module.exports = {
  formatContrastLine,
  generateContrastReport,
  generateContrastJSON,
  printContrastReport,
};
