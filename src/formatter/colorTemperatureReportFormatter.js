/**
 * Formats color temperature analysis results for CLI output or JSON export.
 */

/**
 * Format a single breakdown line.
 * @param {{ hex: string, hue: number, saturation: number, lightness: number, temperature: string }} entry
 * @returns {string}
 */
function formatTemperatureLine(entry) {
  const tag = entry.temperature.padEnd(7);
  return `  ${entry.hex}  hue:${String(entry.hue).padStart(3)}°  sat:${String(entry.saturation).padStart(3)}%  [${tag}]`;
}

/**
 * Generate a human-readable temperature report.
 * @param {{ warm: number, cool: number, neutral: number, dominant: string, breakdown: object[] }} result
 * @returns {string}
 */
function generateTemperatureReport(result) {
  const total = result.warm + result.cool + result.neutral;
  const pct = (n) => total > 0 ? `${Math.round((n / total) * 100)}%` : '0%';
  const lines = [
    '=== Color Temperature Report ===',
    `Dominant: ${result.dominant}`,
    `Warm:    ${result.warm} (${pct(result.warm)})`,
    `Cool:    ${result.cool} (${pct(result.cool)})`,
    `Neutral: ${result.neutral} (${pct(result.neutral)})`,
    '',
    'Breakdown:',
    ...result.breakdown.map(formatTemperatureLine),
  ];
  return lines.join('\n');
}

/**
 * Generate a JSON-serializable temperature report.
 * @param {{ warm: number, cool: number, neutral: number, dominant: string, breakdown: object[] }} result
 * @returns {object}
 */
function generateTemperatureJSON(result) {
  const total = result.warm + result.cool + result.neutral;
  return {
    summary: {
      dominant: result.dominant,
      warm: result.warm,
      cool: result.cool,
      neutral: result.neutral,
      total,
    },
    breakdown: result.breakdown,
  };
}

/**
 * Print the temperature report to stdout.
 * @param {{ warm: number, cool: number, neutral: number, dominant: string, breakdown: object[] }} result
 */
function printTemperatureReport(result) {
  console.log(generateTemperatureReport(result));
}

module.exports = { formatTemperatureLine, generateTemperatureReport, generateTemperatureJSON, printTemperatureReport };
