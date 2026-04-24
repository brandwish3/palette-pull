/**
 * CLI command handler for palette trend analysis.
 */

const { resolveInput } = require('../resolver/inputResolver');
const { extractColors, deduplicateColors } = require('../extractor/colorExtractor');
const { analyzeTrends } = require('../analyzer/trendAnalyzer');
const {
  generateTrendReport,
  generateTrendJSON,
  printTrendReport,
} = require('../formatter/trendReportFormatter');
const { exportTokens } = require('../exporter/fileExporter');

async function trendCommand(source, options = {}) {
  const { output, format = 'text' } = options;

  let content;
  try {
    content = await resolveInput(source);
  } catch (err) {
    console.error(`Error resolving input: ${err.message}`);
    process.exit(1);
  }

  const rawColors = extractColors(content);
  if (!rawColors.length) {
    console.error('No colors found in the provided source.');
    process.exit(1);
  }

  const colors = deduplicateColors(rawColors);
  const trendResult = analyzeTrends(colors);

  if (output) {
    let exportContent;
    if (format === 'json') {
      exportContent = generateTrendJSON(trendResult);
    } else {
      exportContent = generateTrendReport(trendResult);
    }
    try {
      await exportTokens(exportContent, output);
      console.log(`Trend report saved to ${output}`);
    } catch (err) {
      console.error(`Error writing output: ${err.message}`);
      process.exit(1);
    }
  } else {
    if (format === 'json') {
      console.log(generateTrendJSON(trendResult));
    } else {
      printTrendReport(trendResult);
    }
  }
}

module.exports = { trendCommand };
