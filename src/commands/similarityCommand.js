const { resolveInput } = require('../resolver/inputResolver');
const { extractColors, deduplicateColors } = require('../extractor/colorExtractor');
const {
  findRedundantPairs,
  calcDiversityScore,
} = require('../analyzer/similarityAnalyzer');
const {
  printSimilarityReport,
  generateSimilarityJSON,
} = require('../formatter/similarityReportFormatter');
const { exportTokens } = require('../exporter/fileExporter');

/**
 * Default distance threshold below which two colors are considered redundant.
 */
const DEFAULT_THRESHOLD = 15;

/**
 * Runs the similarity analysis command.
 *
 * @param {string} input - File path or URL to analyze.
 * @param {object} options - CLI options.
 * @param {number} [options.threshold] - Distance threshold for redundancy.
 * @param {string} [options.output] - Output file path.
 * @param {string} [options.format] - Output format: 'text' | 'json'.
 */
async function similarityCommand(input, options = {}) {
  const threshold = Number(options.threshold) || DEFAULT_THRESHOLD;
  const outputFormat = options.format || 'text';

  let content;
  try {
    content = await resolveInput(input);
  } catch (err) {
    console.error(`Error resolving input: ${err.message}`);
    process.exit(1);
  }

  const rawColors = extractColors(content);
  const colors = deduplicateColors(rawColors);

  if (colors.length === 0) {
    console.warn('No colors found in the provided input.');
    return;
  }

  const redundantPairs = findRedundantPairs(colors, threshold);
  const diversityScore = calcDiversityScore(colors);

  if (outputFormat === 'json') {
    const json = generateSimilarityJSON(redundantPairs, diversityScore);
    if (options.output) {
      try {
        await exportTokens(json, options.output);
        console.log(`Similarity report written to ${options.output}`);
      } catch (err) {
        console.error(`Error writing output: ${err.message}`);
        process.exit(1);
      }
    } else {
      console.log(json);
    }
  } else {
    printSimilarityReport(redundantPairs, diversityScore);
  }
}

module.exports = { similarityCommand };
