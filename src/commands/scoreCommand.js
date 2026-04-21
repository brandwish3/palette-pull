/**
 * scoreCommand.js
 * CLI command handler for the `score` subcommand.
 * Scores an extracted palette and outputs the result.
 */

const { scorePalette } = require('../analyzer/paletteScorer');
const { generateScoreReport, generateScoreJSON, printScoreReport } = require('../formatter/scoreReportFormatter');
const { resolveInput } = require('../resolver/inputResolver');
const { extractColors, deduplicateColors } = require('../extractor/colorExtractor');

/**
 * Runs the score command.
 * @param {string} input - File path or URL
 * @param {{ format: string, output: string|null }} options
 */
async function runScoreCommand(input, options = {}) {
  const { format = 'text', output = null } = options;

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
    process.exit(0);
  }

  const scores = scorePalette(colors);

  if (format === 'json') {
    const json = generateScoreJSON(scores, colors);
    const jsonStr = JSON.stringify(json, null, 2);
    if (output) {
      const { writeToFile } = require('../exporter/fileExporter');
      await writeToFile(output, jsonStr);
      console.log(`Score report written to ${output}`);
    } else {
      console.log(jsonStr);
    }
  } else {
    if (output) {
      const report = generateScoreReport(scores, colors);
      const { writeToFile } = require('../exporter/fileExporter');
      await writeToFile(output, report);
      console.log(`Score report written to ${output}`);
    } else {
      printScoreReport(scores, colors);
    }
  }
}

module.exports = { runScoreCommand };
