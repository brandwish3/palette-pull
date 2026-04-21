const { groupSimilarColors, findRedundantPairs, calcDiversityScore } = require('../analyzer/similarityAnalyzer');

/**
 * Formats a single redundant pair as a readable line.
 * @param {{ a: string, b: string, distance: number }} pair
 * @returns {string}
 */
function formatRedundantPairLine(pair) {
  return `  ${pair.a} ↔ ${pair.b}  (distance: ${pair.distance})`;
}

/**
 * Generates a human-readable similarity report.
 * @param {string[]} hexColors
 * @returns {string}
 */
function generateSimilarityReport(hexColors) {
  const groups = groupSimilarColors(hexColors);
  const redundant = findRedundantPairs(hexColors);
  const diversity = calcDiversityScore(hexColors);

  const lines = [
    '=== Similarity Analysis ===',
    `Total colors: ${hexColors.length}`,
    `Color groups (threshold 30): ${groups.length}`,
    `Diversity score (avg pairwise distance): ${diversity}`,
    '',
  ];

  if (redundant.length > 0) {
    lines.push(`Redundant pairs (distance ≤ 15): ${redundant.length}`);
    redundant.forEach(p => lines.push(formatRedundantPairLine(p)));
  } else {
    lines.push('No redundant pairs found.');
  }

  lines.push('');
  lines.push('Color Groups:');
  groups.forEach((g, i) => {
    lines.push(`  Group ${i + 1}: ${g.group.join(', ')} (rep: ${g.representative})`);
  });

  return lines.join('\n');
}

/**
 * Generates a JSON-serializable similarity report.
 * @param {string[]} hexColors
 * @returns {object}
 */
function generateSimilarityJSON(hexColors) {
  return {
    totalColors: hexColors.length,
    diversityScore: calcDiversityScore(hexColors),
    groups: groupSimilarColors(hexColors),
    redundantPairs: findRedundantPairs(hexColors),
  };
}

/**
 * Prints the similarity report to stdout.
 * @param {string[]} hexColors
 */
function printSimilarityReport(hexColors) {
  console.log(generateSimilarityReport(hexColors));
}

module.exports = { formatRedundantPairLine, generateSimilarityReport, generateSimilarityJSON, printSimilarityReport };
