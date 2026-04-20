/**
 * paletteReport.js
 * Generates a human-readable summary report of the extracted color palette.
 */

const { assignTokenNames } = require('./namedTokenFormatter');

/**
 * Formats a single color entry as a report line.
 * @param {Object} entry - { hex, name, token }
 * @param {number} index
 * @returns {string}
 */
function formatReportLine(entry, index) {
  return `  ${String(index + 1).padStart(2, '0')}. ${entry.token.padEnd(30)} ${entry.hex.toUpperCase()}  (${entry.name})`;
}

/**
 * Generates a plain-text palette report.
 * @param {string[]} colors - Array of hex color strings
 * @param {Object} [options]
 * @param {string} [options.source] - Source path or URL
 * @param {string} [options.format] - Export format used
 * @returns {string}
 */
function generateReport(colors, options = {}) {
  const { source = 'unknown', format = 'css' } = options;
  const named = assignTokenNames(colors);
  const timestamp = new Date().toISOString();

  const lines = [
    '╔══════════════════════════════════════════════════╗',
    '║              PALETTE PULL — COLOR REPORT         ║',
    '╚══════════════════════════════════════════════════╝',
    '',
    `  Source  : ${source}`,
    `  Format  : ${format}`,
    `  Colors  : ${named.length}`,
    `  Generated: ${timestamp}`,
    '',
    '──────────────────────────────────────────────────',
    '  #    Token Name                     Hex       Name',
    '──────────────────────────────────────────────────',
    ...named.map((entry, i) => formatReportLine(entry, i)),
    '──────────────────────────────────────────────────',
    '',
  ];

  return lines.join('\n');
}

/**
 * Prints the palette report to stdout.
 * @param {string[]} colors
 * @param {Object} [options]
 */
function printReport(colors, options = {}) {
  const report = generateReport(colors, options);
  process.stdout.write(report + '\n');
}

module.exports = { generateReport, printReport, formatReportLine };
