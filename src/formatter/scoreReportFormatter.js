/**
 * scoreReportFormatter.js
 * Formats palette score results into human-readable or JSON output.
 */

/**
 * Returns a letter grade for a numeric score.
 * @param {number} score
 * @returns {string}
 */
function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Formats a single score line for terminal output.
 * @param {string} label
 * @param {number} score
 * @returns {string}
 */
function formatScoreLine(label, score) {
  const grade = getGrade(score);
  const bar = '█'.repeat(Math.round(score / 10)).padEnd(10, '░');
  return `  ${label.padEnd(18)} ${bar} ${String(score).padStart(3)}%  [${grade}]`;
}

/**
 * Generates a full text report for the palette score.
 * @param {{ diversity: number, accessibility: number, size: number, overall: number }} scores
 * @param {string[]} hexColors
 * @returns {string}
 */
function generateScoreReport(scores, hexColors) {
  const lines = [
    `Palette Score Report`,
    `Colors analyzed: ${hexColors.length}`,
    '─'.repeat(50),
    formatScoreLine('Hue Diversity', scores.diversity),
    formatScoreLine('Accessibility', scores.accessibility),
    formatScoreLine('Palette Size', scores.size),
    '─'.repeat(50),
    formatScoreLine('Overall Score', scores.overall),
  ];
  return lines.join('\n');
}

/**
 * Generates a JSON-serializable score report.
 * @param {{ diversity: number, accessibility: number, size: number, overall: number }} scores
 * @param {string[]} hexColors
 * @returns {object}
 */
function generateScoreJSON(scores, hexColors) {
  return {
    colorsAnalyzed: hexColors.length,
    scores: {
      diversity: { value: scores.diversity, grade: getGrade(scores.diversity) },
      accessibility: { value: scores.accessibility, grade: getGrade(scores.accessibility) },
      size: { value: scores.size, grade: getGrade(scores.size) },
      overall: { value: scores.overall, grade: getGrade(scores.overall) },
    },
  };
}

/**
 * Prints the score report to stdout.
 * @param {{ diversity: number, accessibility: number, size: number, overall: number }} scores
 * @param {string[]} hexColors
 */
function printScoreReport(scores, hexColors) {
  console.log(generateScoreReport(scores, hexColors));
}

module.exports = { getGrade, formatScoreLine, generateScoreReport, generateScoreJSON, printScoreReport };
